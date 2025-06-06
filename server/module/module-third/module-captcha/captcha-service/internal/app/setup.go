package app

import (
	"fmt"
	"net"
	"net/http"
	"time"

	"captcha-service/internal/cache"
	"captcha-service/internal/config"

	"go.uber.org/zap"
)

// setupLoggerLevel setting the log Level
func setupLoggerLevel(logger *zap.Logger, level string) {
	switch level {
	case "error":
		logger.WithOptions(zap.IncreaseLevel(zap.ErrorLevel))
		break
	case "debug":
		logger.WithOptions(zap.IncreaseLevel(zap.DebugLevel))
		break
	case "warn":
		logger.WithOptions(zap.IncreaseLevel(zap.WarnLevel))
		break
	case "info":
		logger.WithOptions(zap.IncreaseLevel(zap.InfoLevel))
		break
	}
}

// setupHealthCheck performs a health check on HTTP and gRPC servers
func setupHealthCheck(httpAddr, grpcAddr string) error {
	resp, err := http.Get("http://localhost" + httpAddr + "/status/health")
	if err != nil || resp.StatusCode != http.StatusNotFound {
		return fmt.Errorf("HTTP health check failed: %v", err)
	}
	resp.Body.Close()

	conn, err := net.DialTimeout("tcp", "localhost"+grpcAddr, 1*time.Second)
	if err != nil {
		return fmt.Errorf("gRPC health check failed: %v", err)
	}
	conn.Close()

	return nil
}

// cfg ...
func setupCacheManager(dcfg *config.DynamicConfig, logger *zap.Logger) (*cache.CacheManager, error) {
	cfg := dcfg.Get()
	// Initialize cache
	ttl := time.Duration(cfg.CacheTTL) * time.Second
	cleanInt := time.Duration(10) * time.Second // MemoryCache cleanupInterval

	cacheMgr, err := cache.NewCacheManager(&cache.CacheMgrParams{
		Type:          cache.CacheType(cfg.CacheType),
		CacheAddrs:    cfg.CacheAddrs,
		CacheUsername: cfg.CacheUsername,
		CachePassword: cfg.CachePassword,
		KeyPrefix:     cfg.CacheKeyPrefix,
		Ttl:           ttl,
		CleanInt:      cleanInt,
	})

	if err != nil {
		return nil, err
	}
	dcfg.RegisterHotCallback("UPDATE_SETUP_CACHE", func(dnCfg *config.DynamicConfig, hotType config.HotCallbackType) {
		newCfg := dnCfg.Get()
		err = cacheMgr.Setup(&cache.CacheMgrParams{
			Type:          cache.CacheType(newCfg.CacheType),
			CacheAddrs:    cfg.CacheAddrs,
			CacheUsername: cfg.CacheUsername,
			CachePassword: cfg.CachePassword,
			KeyPrefix:     newCfg.CacheKeyPrefix,
			Ttl:           ttl,
			CleanInt:      cleanInt,
		})
		if err != nil {
			logger.Error("[AppSetup] Setup cache manager", zap.Error(err))
		}
	})

	return cacheMgr, err
}
