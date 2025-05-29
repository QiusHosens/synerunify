package app

import (
	"context"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"
	"time"

	"captcha-service/api/proto"

	"captcha-service/internal/cache"
	"captcha-service/internal/common"
	"captcha-service/internal/config"
	"captcha-service/internal/helper"
	"captcha-service/internal/middleware"
	"captcha-service/internal/server"
	"captcha-service/pkg/gocaptcha"
	config2 "captcha-service/pkg/gocaptcha/config"

	"github.com/sony/gobreaker"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

// App manages the application components
type App struct {
	logger         *zap.Logger
	dynamicCfg     *config.DynamicConfig
	dynamicCaptCfg *config2.DynamicCaptchaConfig
	cacheMgr       *cache.CacheManager
	httpServer     *http.Server
	grpcServer     *grpc.Server
	cacheBreaker   *gobreaker.CircuitBreaker
	limiter        *middleware.DynamicLimiter
	captcha        *gocaptcha.GoCaptcha
}

// NewApp initializes the application
func NewApp() (*App, error) {

	// Parse command-line flags
	configFile := flag.String("config", "config.json", "Path to config file")
	gocaptchaConfigFile := flag.String("gocaptcha-config", "gocaptcha.json", "Path to gocaptcha config file")
	serviceName := flag.String("service-name", "", "Name for service")
	httpPort := flag.String("http-port", "", "Port for HTTP server")
	grpcPort := flag.String("grpc-port", "", "Port for gRPC server")

	cacheType := flag.String("cache-type", "", "CacheManager type: redis, memory, etcd, memcache")
	cacheAddrs := flag.String("cache-addrs", "", "Comma-separated Cache cluster addresses")
	cacheUsername := flag.String("cache-username", "", "Comma-separated cache cluster username")
	cachePassword := flag.String("cache-password", "", "Comma-separated cache cluster password")
	cacheTTL := flag.Int("cache-ttl", 0, "CacheManager TTL in seconds")
	cacheKeyPrefix := flag.String("cache-key-prefix", "CAPTCHA_DATA:", "Key prefix for cache")

	enableDynamicConfig := flag.Bool("enable-dynamic-config", false, "Enable dynamic config")

	enableServiceDiscovery := flag.Bool("enable-service-discovery", false, "Enable service discovery")

	rateLimitQPS := flag.Int("rate-limit-qps", 0, "Rate limit QPS")
	rateLimitBurst := flag.Int("rate-limit-burst", 0, "Rate limit burst")
	apiKeys := flag.String("api-keys", "", "Comma-separated API keys")
	logLevel := flag.String("log-level", "", "Set log level: error, debug, warn, info")
	healthCheckFlag := flag.Bool("health-check", false, "Run health check and exit")
	enableCorsFlag := flag.Bool("enable-cors", false, "Enable cross-domain resources")

	flag.Parse()

	// Read environment variables
	if v, exists := os.LookupEnv("CONFIG"); exists {
		*configFile = v
	}
	if v, exists := os.LookupEnv("GO_CAPTCHA_CONFIG"); exists {
		*gocaptchaConfigFile = v
	}

	if v, exists := os.LookupEnv("SERVICE_NAME"); exists {
		*serviceName = v
	}
	if v, exists := os.LookupEnv("HTTP_PORT"); exists {
		*httpPort = v
	}
	if v, exists := os.LookupEnv("GRPC_PORT"); exists {
		*grpcPort = v
	}
	if v, exists := os.LookupEnv("API_KEYS"); exists {
		*apiKeys = v
	}
	if v, exists := os.LookupEnv("CACHE_TYPE"); exists {
		*cacheType = v
	}
	if v, exists := os.LookupEnv("CACHE_ADDRS"); exists {
		*cacheAddrs = v
	}
	if v, exists := os.LookupEnv("CACHE_USERNAME"); exists {
		*cacheUsername = v
	}
	if v, exists := os.LookupEnv("CACHE_PASSWORD"); exists {
		*cachePassword = v
	}
	if v, exists := os.LookupEnv("LOG_LEVEL"); exists {
		*logLevel = v
	}

	if v, exists := os.LookupEnv("ENABLE_DYNAMIC_CONFIG"); exists {
		*enableDynamicConfig = v == "true"
	}

	if v, exists := os.LookupEnv("ENABLE_SERVICE_DISCOVERY"); exists {
		*enableServiceDiscovery = v == "true"
	}

	// Initialize logger
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize logger: %v", err)
	}
	setupLoggerLevel(logger, *logLevel)

	// Load configuration
	dc, err := config.NewDynamicConfig(*configFile, true)
	if err != nil {
		if helper.FileExists(*configFile) {
			logger.Warn("[App] Failed to load of the config.json file, using defaults", zap.Error(err))
		} else {
			logger.Warn("[App] No configuration file 'config.json' was provided for the application. Use the defaults configuration")
		}
		dc = config.DefaultDynamicConfig()
	}
	// Register hot update callback
	dc.RegisterHotCallback("UPDATE_LOG_LEVEL", func(dnCfg *config.DynamicConfig, hotType config.HotCallbackType) {
		setupLoggerLevel(logger, dnCfg.Get().LogLevel)
	})

	// Load configuration
	dgc, err := config2.NewDynamicConfig(*gocaptchaConfigFile, true)
	if err != nil {
		if helper.FileExists(*gocaptchaConfigFile) {
			logger.Warn("[App] Failed to load of the gocaptcha.json file, using defaults", zap.Error(err))
		} else {
			logger.Warn("[App] No configuration file 'gocaptcha.json' was provided for the application. Use the defaults configuration")
		}
		dgc = config2.DefaultDynamicConfig()
	}

	// Merge command-line flags
	cfg := dc.Get()
	cfg = config.MergeWithFlags(cfg, map[string]interface{}{
		"service-name": *serviceName,
		"http-port":    *httpPort,
		"grpc-port":    *grpcPort,

		"cache-type":       *cacheType,
		"cache-addrs":      *cacheAddrs,
		"cache-username":   *cacheUsername,
		"cache-password":   *cachePassword,
		"cache-ttl":        *cacheTTL,
		"cache-key-prefix": *cacheKeyPrefix,

		"enable-dynamic-config": *enableDynamicConfig,

		"enable-service-discovery": *enableServiceDiscovery,

		"rate-limit-qps":   *rateLimitQPS,
		"rate-limit-burst": *rateLimitBurst,
		"enable-cors":      *enableCorsFlag,
		"api-keys":         *apiKeys,
	})
	if err = dc.Update(cfg); err != nil {
		logger.Fatal("[App] Configuration validation failed", zap.Error(err))
	}

	// Initialize rate limiter
	limiter := middleware.NewDynamicLimiter(cfg.RateLimitQPS, cfg.RateLimitBurst)
	dc.RegisterHotCallback("UPDATE_LIMITER", func(dnCfg *config.DynamicConfig, hotType config.HotCallbackType) {
		limiter.Update(dnCfg.Get().RateLimitQPS, dnCfg.Get().RateLimitBurst)
	})

	// Initialize circuit breaker
	cacheBreaker := gobreaker.NewCircuitBreaker(gobreaker.Settings{
		Name:        *serviceName,
		MaxRequests: 1,
		Interval:    60 * time.Second,
		Timeout:     5 * time.Second,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures > 3
		},
	})

	// Setup cache
	cacheMgr, err := setupCacheManager(dc, logger)
	if err != nil {
		logger.Fatal("[App] Create cache manager", zap.Error(err))
	}

	// Setup captcha
	captcha, err := gocaptcha.Setup(dgc)
	if err != nil {
		logger.Fatal("[App] Failed to setup gocaptcha: ", zap.Error(err))
	}
	dgc.RegisterHotCallback("GENERATE_CAPTCHA", func(captchaConfig *config2.DynamicCaptchaConfig, callbackType config2.HotCallbackType) {
		err = captcha.HotSetup(captchaConfig)
		if err != nil {
			logger.Error("[App] Failed to hot update gocaptcha, without any change: ", zap.Error(err))
		}
	})

	// Perform health check if requested
	if *healthCheckFlag {
		if err = setupHealthCheck(":"+cfg.HTTPPort, ":"+cfg.GRPCPort); err != nil {
			logger.Error("[App] Filed to health check", zap.Error(err))
			os.Exit(1)
		}
		os.Exit(0)
	}

	return &App{
		logger:         logger,
		dynamicCfg:     dc,
		dynamicCaptCfg: dgc,
		cacheMgr:       cacheMgr,
		cacheBreaker:   cacheBreaker,
		limiter:        limiter,
		captcha:        captcha,
	}, nil
}

// Start starting the Application
func (a *App) Start(ctx context.Context) error {
	cfg := a.dynamicCfg.Get()

	// Service context
	svcCtx := common.NewSvcContext()
	svcCtx.CacheMgr = a.cacheMgr
	svcCtx.DynamicConfig = a.dynamicCfg
	svcCtx.Logger = a.logger
	svcCtx.Captcha = a.captcha

	// Start HTTP server
	if cfg.HTTPPort != "" && cfg.HTTPPort != "0" {
		if err := a.startHTTPServer(svcCtx, &cfg); err != nil {
			return err
		}
	}

	// Start gRPC server
	if cfg.GRPCPort != "" && cfg.GRPCPort != "0" {
		if err := a.startGRPCServer(svcCtx, &cfg); err != nil {
			return err
		}
	}

	return nil
}

// startHTTPServer start HTTP server
func (a *App) startHTTPServer(svcCtx *common.SvcContext, cfg *config.Config) error {
	handlers := server.NewHTTPHandlers(svcCtx)
	var middlewares = make([]middleware.HTTPMiddleware, 0)

	// Enable cross-domain resource
	if cfg.EnableCors {
		middlewares = append(middlewares, nil, middleware.CORSMiddleware(a.logger))
	}

	middlewares = append(middlewares,
		middleware.APIKeyMiddleware(a.dynamicCfg, a.logger),
		middleware.LoggingMiddleware(a.logger),
		middleware.RateLimitMiddleware(a.limiter, a.logger),
		middleware.CircuitBreakerMiddleware(a.cacheBreaker, a.logger),
	)

	mwChain := middleware.NewChainHTTP(middlewares...)

	http.Handle("/status/health", mwChain.Then(handlers.HealthStatusHandler))
	http.Handle("/rate-limit", mwChain.Then(middleware.RateLimitHandler(a.limiter, a.logger)))

	http.Handle("/api/v1/public/get-data", mwChain.Then(handlers.GetDataHandler))
	http.Handle("/api/v1/public/check-data", mwChain.Then(handlers.CheckDataHandler))
	http.Handle("/api/v1/public/check-status", mwChain.Then(handlers.CheckStatusHandler))

	http.Handle("/api/v1/manage/get-status-info", mwChain.Then(handlers.GetStatusInfoHandler))
	http.Handle("/api/v1/manage/del-status-info", mwChain.Then(handlers.DelStatusInfoHandler))
	http.Handle("/api/v1/manage/upload-resource", mwChain.Then(handlers.UploadResourceHandler))
	http.Handle("/api/v1/manage/delete-resource", mwChain.Then(handlers.DeleteResourceHandler))
	http.Handle("/api/v1/manage/get-resource-list", mwChain.Then(handlers.GetResourceListHandler))
	http.Handle("/api/v1/manage/get-config", mwChain.Then(handlers.GetGoCaptchaConfigHandler))
	http.Handle("/api/v1/manage/update-hot-config", mwChain.Then(handlers.UpdateHotGoCaptchaConfigHandler))

	a.httpServer = &http.Server{
		Addr: ":" + cfg.HTTPPort,
	}

	go func() {
		a.logger.Info("[App] Starting HTTP server", zap.String("port", cfg.HTTPPort))
		if err := a.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			a.logger.Fatal("[App] HTTP server failed", zap.Error(err))
		}
	}()

	return nil
}

// startGRPCServer start gRPC server
func (a *App) startGRPCServer(svcCtx *common.SvcContext, cfg *config.Config) error {
	lis, err := net.Listen("tcp", ":"+cfg.GRPCPort)
	if err != nil {
		return fmt.Errorf("failed to listen: %v", err)
	}

	interceptor := middleware.UnaryServerInterceptor(a.dynamicCfg, a.logger, a.cacheBreaker)
	a.grpcServer = grpc.NewServer(grpc.UnaryInterceptor(interceptor))
	proto.RegisterGoCaptchaServiceServer(a.grpcServer, server.NewGoCaptchaServer(svcCtx))

	go func() {
		a.logger.Info("[App] Starting gRPC server", zap.String("port", cfg.GRPCPort))
		if err := a.grpcServer.Serve(lis); err != nil && err != grpc.ErrServerStopped {
			a.logger.Fatal("[App] gRPC server failed", zap.Error(err))
		}
	}()
	return nil
}

// Shutdown gracefully stops the application
func (a *App) Shutdown() {
	a.logger.Info("[App] Received shutdown signal, shutting down gracefully")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	defer a.logger.Sync()

	// Stop HTTP server
	if a.httpServer != nil {
		if err := a.httpServer.Shutdown(ctx); err != nil {
			a.logger.Error("[App] HTTP server shutdown error", zap.Error(err))
		} else {
			a.logger.Info("[App] HTTP server shut down successfully")
		}
	}

	// Stop gRPC server
	if a.grpcServer != nil {
		a.grpcServer.GracefulStop()
		a.logger.Info("[App] gRPC server shut down successfully")
	}

	// Stop cache
	err := a.cacheMgr.Close()
	if err != nil {
		a.logger.Error("[App] CacheManager client close error", zap.Error(err))
	} else {
		a.logger.Info("[App] CacheManager client stopped successfully", zap.Error(err))
	}

	a.logger.Info("[App] App service shutdown")
}
