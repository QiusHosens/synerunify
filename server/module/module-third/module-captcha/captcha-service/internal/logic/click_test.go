package logic

// func TestCacheLogic(t *testing.T) {
// 	mr, err := miniredis.Run()
// 	assert.NoError(t, err)
// 	defer mr.Close()

// 	ttl := time.Duration(10) * time.Second
// 	cleanInt := time.Duration(30) * time.Second
// 	cacheClient := cache.NewMemoryCache("TEST_CAPTCHA_DATA:", ttl, cleanInt)
// 	defer cacheClient.Close()

// 	dc := &config.DynamicConfig{Config: config.DefaultConfig()}
// 	cdc := &config2.DynamicCaptchaConfig{Config: config2.DefaultConfig()}

// 	logger, err := zap.NewProduction()
// 	assert.NoError(t, err)

// 	captcha, err := gocaptcha.Setup(cdc)
// 	assert.NoError(t, err)

// 	svcCtx := &common.SvcContext{
// 		CacheMgr:      cacheClient,
// 		DynamicConfig: dc,
// 		Logger:        logger,
// 		Captcha:       captcha,
// 	}
// 	logic := NewClickCaptLogic(svcCtx)

// 	t.Run("GetData", func(t *testing.T) {
// 		_, err := logic.GetData(context.Background(), "dd")
// 		assert.NoError(t, err)
// 	})

// 	t.Run("GetData_Miss", func(t *testing.T) {
// 		_, err := logic.GetData(context.Background(), "dd")
// 		assert.Error(t, err)
// 	})

// 	t.Run("CheckData", func(t *testing.T) {
// 		data, err := logic.GetData(context.Background(), "dd")
// 		assert.NoError(t, err)

// 		cacheData, err := svcCtx.CacheMgr.GetCache(context.Background(), data.CaptchaKey)
// 		assert.NoError(t, err)

// 		var dct map[int]*click.Dot
// 		err = json.Unmarshal([]byte(cacheData), &dct)
// 		assert.NoError(t, err)

// 		var dots []string
// 		for i := 0; i < len(dct); i++ {
// 			dot := dct[i]
// 			dots = append(dots, strconv.Itoa(dot.X), strconv.Itoa(dot.Y))
// 		}

// 		dotStr := strings.Join(dots, ",")
// 		result, err := logic.CheckData(context.Background(), data.CaptchaKey, dotStr)
// 		assert.NoError(t, err)
// 		assert.Equal(t, true, result)
// 	})

// 	t.Run("CheckData_MISS", func(t *testing.T) {
// 		data, err := logic.GetData(context.Background(), "dd")
// 		assert.NoError(t, err)

// 		cacheData, err := svcCtx.CacheMgr.GetCache(context.Background(), data.CaptchaKey)
// 		assert.NoError(t, err)

// 		var dct map[int]*click.Dot
// 		err = json.Unmarshal([]byte(cacheData), &dct)
// 		assert.NoError(t, err)

// 		var dots = []string{
// 			"111",
// 			"222",
// 		}
// 		dotStr := strings.Join(dots, ",")
// 		result, err := logic.CheckData(context.Background(), data.CaptchaKey, dotStr)
// 		assert.NoError(t, err)
// 		assert.Equal(t, false, result)
// 	})
// }
