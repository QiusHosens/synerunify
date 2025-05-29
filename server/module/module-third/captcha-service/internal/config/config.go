package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"captcha-service/internal/helper"

	"github.com/fsnotify/fsnotify"
)

// Config defines the configuration structure for the application
type Config struct {
	ConfigVersion  int64    `json:"config_version"`
	ServiceName    string   `json:"service_name"`
	HTTPPort       string   `json:"http_port"`
	GRPCPort       string   `json:"grpc_port"`
	CacheAddrs     string   `json:"cache_addrs"`
	CacheUsername  string   `json:"cache_username"`
	CachePassword  string   `json:"cache_password"`
	CacheType      string   `json:"cache_type"` // redis, memory, etcd, memcache
	CacheTTL       int      `json:"cache_ttl"`  // seconds
	CacheKeyPrefix string   `json:"cache_key_prefix"`
	RateLimitQPS   int      `json:"rate_limit_qps"`
	RateLimitBurst int      `json:"rate_limit_burst"`
	EnableCors     bool     `json:"enable_cors"`
	APIKeys        []string `json:"api_keys"`
	LogLevel       string   `json:"log_level"` // error, debug, info, none

	EnableDynamicConfig bool `json:"enable_dynamic_config"`

	EnableServiceDiscovery bool `json:"enable_service_discovery"`
}

// DynamicConfig .
type DynamicConfig struct {
	Config       Config
	mu           sync.RWMutex
	hotCbsHooks  map[string]HandleHotCallbackFunc
	outputLogCbs helper.OutputLogCallback
}

// HotCallbackType ..
type HotCallbackType int

const (
	HotCallbackTypeLocalConfigFile HotCallbackType = 1
	HotCallbackTypeRemoteConfig                    = 2
)

// HandleHotCallbackFunc ..
type HandleHotCallbackFunc = func(*DynamicConfig, HotCallbackType)

// NewDynamicConfig .
func NewDynamicConfig(file string, isWatchFile bool) (*DynamicConfig, error) {
	cfg := DefaultConfig()
	var err error
	if file != "" {
		cfg, err = Load(file)
		if err != nil {
			return nil, err
		}
	}

	dc := &DynamicConfig{Config: cfg, hotCbsHooks: make(map[string]HandleHotCallbackFunc)}

	if isWatchFile {
		go dc.watchFile(file)
	}

	return dc, nil
}

// DefaultDynamicConfig .
func DefaultDynamicConfig() *DynamicConfig {
	cfg := DefaultConfig()
	return &DynamicConfig{Config: cfg, hotCbsHooks: make(map[string]HandleHotCallbackFunc)}
}

// SetOutputLogCallback Set the log out hook function
func (dc *DynamicConfig) SetOutputLogCallback(outputLogCbs helper.OutputLogCallback) {
	dc.outputLogCbs = outputLogCbs
}

// outLog ..
func (dc *DynamicConfig) outLog(logType helper.OutputLogType, message string) {
	if dc.outputLogCbs != nil {
		dc.outputLogCbs(logType, message)
	}
}

// Get retrieves the current configuration
func (dc *DynamicConfig) Get() Config {
	dc.mu.RLock()
	defer dc.mu.RUnlock()
	return dc.Config
}

// MarshalConfig ..
func (dc *DynamicConfig) MarshalConfig() (string, error) {
	dc.mu.RLock()
	cByte, err := json.Marshal(dc.Config)
	if err != nil {
		return "", err
	}
	dc.mu.RUnlock()

	return string(cByte), nil
}

// UnMarshalConfig ..
func (dc *DynamicConfig) UnMarshalConfig(str string) error {
	var config Config
	err := json.Unmarshal([]byte(str), &config)
	if err != nil {
		return err
	}

	dc.mu.Lock()
	dc.Config = config
	dc.mu.Unlock()

	return nil
}

// Update updates the configuration
func (dc *DynamicConfig) Update(cfg Config) error {
	if err := Validate(cfg); err != nil {
		return err
	}
	dc.mu.Lock()
	defer dc.mu.Unlock()
	dc.Config = cfg
	return nil
}

// RegisterHotCallback callback when updating configuration
func (dc *DynamicConfig) RegisterHotCallback(key string, callback HandleHotCallbackFunc) {
	if _, ok := dc.hotCbsHooks[key]; !ok {
		dc.hotCbsHooks[key] = callback
	}
}

// UnRegisterHotCallback callback when updating configuration
func (dc *DynamicConfig) UnRegisterHotCallback(key string) {
	if _, ok := dc.hotCbsHooks[key]; !ok {
		delete(dc.hotCbsHooks, key)
	}
}

// HandleHotCallback .
func (dc *DynamicConfig) HandleHotCallback(hotType HotCallbackType) {
	for _, fnc := range dc.hotCbsHooks {
		if fnc != nil {
			fnc(dc, hotType)
		}
	}
}

// HotUpdate ..
func (dc *DynamicConfig) HotUpdate(cfg Config) error {
	if err := Validate(cfg); err != nil {
		return err
	}
	dc.mu.Lock()
	defer dc.mu.Unlock()

	// Update config fields
	dc.Config.ConfigVersion = cfg.ConfigVersion
	dc.Config.APIKeys = cfg.APIKeys
	dc.Config.LogLevel = cfg.LogLevel
	dc.Config.CacheAddrs = cfg.CacheAddrs
	dc.Config.CacheUsername = cfg.CacheUsername
	dc.Config.CachePassword = cfg.CachePassword
	dc.Config.CacheType = cfg.CacheType
	dc.Config.CacheTTL = cfg.CacheTTL
	dc.Config.CacheKeyPrefix = cfg.CacheKeyPrefix

	if cfg.RateLimitQPS > 0 {
		dc.Config.RateLimitQPS = cfg.RateLimitQPS
	}
	if cfg.RateLimitBurst > 0 {
		dc.Config.RateLimitBurst = cfg.RateLimitBurst
	}

	return nil
}

// watchFile monitors the Config file for changes
func (dc *DynamicConfig) watchFile(file string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to create watcher, err: %v", err))
		return
	}
	defer watcher.Close()

	absPath, err := filepath.Abs(file)
	if err != nil {
		dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to get absolute path, err: %v", err))
		return
	}
	dir := filepath.Dir(absPath)

	if err := watcher.Add(dir); err != nil {
		dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to watch directory, err: %v", err))
		return
	}

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Name == absPath && (event.Op&fsnotify.Write == fsnotify.Write) {
				cfg, err := Load(file)
				if err != nil {
					dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to reload Config, err: %v", err))
					continue
				}
				if err = dc.HotUpdate(cfg); err != nil {
					dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to update Config, err: %v", err))
					continue
				}

				dc.HandleHotCallback(HotCallbackTypeLocalConfigFile)
				dc.outLog(helper.OutputLogTypeInfo, "[Config] Configuration reloaded successfully")
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			dc.outLog(helper.OutputLogTypeError, fmt.Sprintf("[Config] Failed to watcher, err: %v", err))
		}
	}
}

// Load reads the configuration from a file
func Load(file string) (Config, error) {
	var config Config
	data, err := os.ReadFile(file)
	if err != nil {
		return config, fmt.Errorf("failed to read Config file: %v", err)
	}
	if err := json.Unmarshal(data, &config); err != nil {
		return config, fmt.Errorf("failed to parse Config file: %v", err)
	}
	return config, nil
}

// Validate checks the configuration for validity
func Validate(config Config) error {
	if !isValidPort(config.HTTPPort) {
		return fmt.Errorf("invalid http_port: %s", config.HTTPPort)
	}
	if !isValidPort(config.GRPCPort) {
		return fmt.Errorf("invalid grpc_port: %s", config.GRPCPort)
	}

	validCacheTypes := map[string]bool{
		"redis":    true,
		"memory":   true,
		"etcd":     true,
		"memcache": true,
	}
	if !validCacheTypes[config.CacheType] {
		return fmt.Errorf("invalid cache_type: %s, must be redis, memory, etcd, or memcache", config.CacheType)
	}

	if config.CacheType != "" && config.CacheType != "memory" {
		if !isValidAddrs(config.CacheAddrs) {
			return fmt.Errorf("invalid cache_addrs: %s", config.CacheAddrs)
		}
	}

	if config.CacheTTL <= 0 {
		return fmt.Errorf("cache_ttl must be positive: %d", config.CacheTTL)
	}

	if config.RateLimitQPS <= 0 {
		return fmt.Errorf("rate_limit_qps must be positive: %d", config.RateLimitQPS)
	}
	if config.RateLimitBurst <= 0 {
		return fmt.Errorf("rate_limit_burst must be positive: %d", config.RateLimitBurst)
	}

	if len(config.APIKeys) > 0 {
		for _, key := range config.APIKeys {
			if key == "" {
				return fmt.Errorf("api_keys contain empty key")
			}
		}
	}

	return nil
}

// isValidPort checks if a port number is valid
func isValidPort(port string) bool {
	p, err := strconv.Atoi(port)
	return err == nil && p > 0 && p <= 65535
}

// isValidAddrs checks if addresses are valid
func isValidAddrs(addrs string) bool {
	if addrs == "" {
		return false
	}
	addrRegex := regexp.MustCompile(`^([a-zA-Z0-9.-]+:[0-9]+)(,[a-zA-Z0-9.-]+:[0-9]+)*$`)
	return addrRegex.MatchString(addrs)
}

// MergeWithFlags merges command-line flags into the configuration
func MergeWithFlags(config Config, flags map[string]interface{}) Config {
	if v, ok := flags["http-port"].(string); ok && v != "" {
		config.HTTPPort = v
	}
	if v, ok := flags["service-name"].(string); ok && v != "" {
		config.ServiceName = v
	}
	if v, ok := flags["grpc-port"].(string); ok && v != "" {
		config.GRPCPort = v
	}
	if v, ok := flags["cache-addrs"].(string); ok && v != "" {
		config.CacheAddrs = v
	}
	if v, ok := flags["cache-username"].(string); ok && v != "" {
		config.CacheUsername = v
	}
	if v, ok := flags["cache-password"].(string); ok && v != "" {
		config.CachePassword = v
	}
	if v, ok := flags["cache-type"].(string); ok && v != "" {
		config.CacheType = v
	}
	if v, ok := flags["cache-ttl"].(int); ok && v != 0 {
		config.CacheTTL = v
	}
	if v, ok := flags["cache-key-prefix"].(string); ok && v != "" {
		config.CacheKeyPrefix = v
	}

	/////
	if v, ok := flags["enable-dynamic-config"].(bool); ok && !config.EnableDynamicConfig {
		config.EnableDynamicConfig = v
	}

	/////
	if v, ok := flags["enable-service-discovery"].(bool); ok && !config.EnableServiceDiscovery {
		config.EnableServiceDiscovery = v
	}

	///////
	if v, ok := flags["rate-limit-qps"].(int); ok && v != 0 {
		config.RateLimitQPS = v
	}
	if v, ok := flags["rate-limit-burst"].(int); ok && v != 0 {
		config.RateLimitBurst = v
	}
	if v, ok := flags["api-keys"].(string); ok && v != "" {
		config.APIKeys = strings.Split(v, ",")
	}
	if v, ok := flags["log-level"].(string); ok && v != "" {
		config.LogLevel = v
	}

	if v, ok := flags["enable-cors"].(bool); ok && !config.EnableCors {
		config.EnableCors = v
	}
	return config
}

func DefaultConfig() Config {
	return Config{
		ServiceName:            "captcha-service",
		HTTPPort:               "8080",
		GRPCPort:               "50051",
		CacheType:              "memory",
		CacheAddrs:             "",
		CacheTTL:               60,
		CacheKeyPrefix:         "CAPTCHA_DATA:",
		EnableDynamicConfig:    false,
		EnableServiceDiscovery: false,
		RateLimitQPS:           1000,
		RateLimitBurst:         1000,
		EnableCors:             true,
		APIKeys:                make([]string, 0),
		LogLevel:               "info",
	}
}
