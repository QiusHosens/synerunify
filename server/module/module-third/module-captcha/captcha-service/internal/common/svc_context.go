package common

import (
	"captcha-service/internal/cache"
	"captcha-service/internal/config"
	"captcha-service/pkg/gocaptcha"

	"go.uber.org/zap"
)

// SvcContext service context
type SvcContext struct {
	CacheMgr      *cache.CacheManager
	DynamicConfig *config.DynamicConfig
	Logger        *zap.Logger
	Captcha       *gocaptcha.GoCaptcha
}

// NewSvcContext ..
func NewSvcContext() *SvcContext {
	return &SvcContext{}
}
