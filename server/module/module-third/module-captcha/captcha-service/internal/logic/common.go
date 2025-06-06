package logic

import (
	"context"
	"encoding/json"
	"fmt"

	"captcha-service/internal/cache"
	"captcha-service/internal/common"
	"captcha-service/internal/config"
	"captcha-service/pkg/gocaptcha"

	"go.uber.org/zap"
)

// CommonLogic .
type CommonLogic struct {
	svcCtx *common.SvcContext

	cacheMgr   *cache.CacheManager
	dynamicCfg *config.DynamicConfig
	logger     *zap.Logger
	captcha    *gocaptcha.GoCaptcha
}

// NewCommonLogic .
func NewCommonLogic(svcCtx *common.SvcContext) *CommonLogic {
	return &CommonLogic{
		svcCtx:     svcCtx,
		cacheMgr:   svcCtx.CacheMgr,
		dynamicCfg: svcCtx.DynamicConfig,
		logger:     svcCtx.Logger,
		captcha:    svcCtx.Captcha,
	}
}

// CheckStatus .
func (cl *CommonLogic) CheckStatus(ctx context.Context, key string) (ret bool, err error) {
	if key == "" {
		return false, fmt.Errorf("invalid key")
	}

	cacheData, err := cl.cacheMgr.GetCache().GetCache(ctx, key)
	if err != nil {
		return false, fmt.Errorf("failed to get cache: %v", err)
	}

	if cacheData == "" {
		return false, nil
	}

	var captData *cache.CaptCacheData
	err = json.Unmarshal([]byte(cacheData), &captData)
	if err != nil {
		return false, fmt.Errorf("failed to json unmarshal: %v", err)
	}

	return captData.Status == 1, nil
}

// GetStatusInfo .
func (cl *CommonLogic) GetStatusInfo(ctx context.Context, key string) (data *cache.CaptCacheData, err error) {
	if key == "" {
		return nil, fmt.Errorf("invalid key")
	}

	captData := &cache.CaptCacheData{}

	cacheData, err := cl.cacheMgr.GetCache().GetCache(ctx, key)
	if err != nil {
		return nil, fmt.Errorf("failed to get cache: %v", err)
	}

	if cacheData == "" {
		captData.Data = struct{}{}
		return captData, nil
	}

	err = json.Unmarshal([]byte(cacheData), &captData)
	if err != nil {
		return nil, fmt.Errorf("failed to json unmarshal: %v", err)
	}

	return captData, nil
}

// DelStatusInfo .
func (cl *CommonLogic) DelStatusInfo(ctx context.Context, key string) (ret bool, err error) {
	if key == "" {
		return false, fmt.Errorf("invalid key")
	}

	err = cl.cacheMgr.GetCache().DeleteCache(ctx, key)
	if err != nil {
		return false, fmt.Errorf("failed to delete cache: %v", err)
	}

	return true, nil
}
