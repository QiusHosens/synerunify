Page({
  data: {
    devicePosition: 'back', // 'front' 或 'back'
    flash: 'auto', // 'on', 'off', 'auto'
    score: null, // 得分
    currentImage: null, // 当前检测的图片路径
    region: null, // 区域信息
    imageSize: null, // 原始图片尺寸
    regionLeft: 0, // 区域标记左边距
    regionTop: 0, // 区域标记上边距
    regionWidth: 0, // 区域标记宽度
    regionHeight: 0, // 区域标记高度
    showPreview: false, // 是否显示预览
    previewRegionLeft: 0, // 预览时的区域标记左边距
    previewRegionTop: 0, // 预览时的区域标记上边距
    previewRegionWidth: 0, // 预览时的区域标记宽度
    previewRegionHeight: 0 // 预览时的区域标记高度
  },

  onLoad() {
    // 请求摄像头权限
    this.requestCameraPermission()
  },

  // 请求摄像头权限
  requestCameraPermission() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        console.log('摄像头权限已授权')
      },
      fail: () => {
        wx.showModal({
          title: '权限申请',
          content: '需要摄像头权限才能使用此功能',
          showCancel: false
        })
      }
    })
  },

  // 切换摄像头
  switchCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    })
    // wx.showToast({
    //   title: this.data.devicePosition === 'back' ? '后置摄像头' : '前置摄像头',
    //   icon: 'none',
    //   duration: 1000
    // })
  },

  // 从相册选择图片
  chooseImageFromAlbum() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        console.log('选择的图片路径:', tempFilePath)
        // 上传图片并获取得分
        this.uploadImageAndGetScore(tempFilePath)
      },
      fail: (err) => {
        console.error('选择图片失败', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 上传图片并获取得分
  uploadImageAndGetScore(imagePath) {
    wx.showLoading({
      title: '分析中...',
      mask: true
    })

    // 这里需要替换为你的实际API地址
    const apiUrl = 'http://192.168.1.4:9990/process/appearance/predict' //'https://synerunify.com/api/process/appearance/predict'
    // const apiUrl = 'https://synerunify.com/api/process/appearance/predict'
    
    // 上传图片
    wx.uploadFile({
      url: apiUrl,
      filePath: imagePath,
      name: 'image',
      formData: {
        // 可以添加其他参数
      },
      success: (res) => {
        wx.hideLoading()
        try {
          console.log(res)
          const data = JSON.parse(res.data)
          const score = data.data?.score || 0;
          const region = data.data?.region || null;
          const imageSize = data.data?.size || null;
          this.setData({
            score: Math.round(score),
            currentImage: imagePath, // 保存图片路径
            region: region, // 保存区域信息
            imageSize: imageSize // 保存原始图片尺寸
          })
          if (data.code !== 200) {
            wx.showToast({
              title: data.message || '接口返回错误',
              icon: 'none',
              duration: 2000
            })
          }
        } catch (err) {
          console.error('解析接口返回失败', err)
          // 如果接口格式不对，使用模拟数据
          // this.useMockScore(imagePath)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('上传图片失败', err)
        // 如果接口调用失败，使用模拟数据
        wx.showToast({
          title: '接口调用失败，使用模拟数据',
          icon: 'none',
          duration: 2000
        })
        this.useMockScore(imagePath)
      }
    })
  },

  // 使用模拟得分（用于测试或接口不可用时）
  useMockScore(imagePath) {
    // 生成一个随机得分（0-100）
    const mockScore = Math.floor(Math.random() * 100)
    this.setData({
      score: mockScore,
      currentImage: imagePath || null, // 如果有图片路径，也保存
      region: null, // 清空区域信息
      imageSize: null // 清空图片尺寸
    })
    wx.showToast({
      title: `得分: ${mockScore}`,
      icon: 'success',
      duration: 2000
    })
  },

  // 预览图片
  previewImage() {
    if (this.data.currentImage) {
      wx.previewImage({
        urls: [this.data.currentImage],
        current: this.data.currentImage
      })
    }
  },

  // 预览图片
  previewImageWapper() {
    if (this.data.currentImage) {
      this.setData({
        showPreview: true,
        previewRegionLeft: 0,
        previewRegionTop: 0,
        previewRegionWidth: 0,
        previewRegionHeight: 0
      })
      // 图片加载会在 onPreviewImageLoad 中触发计算
    }
  },

  // 关闭预览（点击预览图片时调用）
  closePreview() {
    this.setData({
      showPreview: false
    })
  },

  // 计算预览时的区域标记位置（根据图片实际渲染位置）
  calculatePreviewRegion(retryCount = 0) {
    if (!this.data.region || !this.data.imageSize) {
      return
    }

    // 最多重试15次
    if (retryCount > 15) {
      console.log('计算预览区域标记失败，已达到最大重试次数')
      return
    }

    const query = wx.createSelectorQuery()
    // 同时获取容器和图片的实际渲染尺寸和位置
    query.select('.preview-image-wrapper').boundingClientRect()
    query.select('.preview-image').boundingClientRect()
    query.exec((res) => {
      const containerRect = res[0]
      const imageRect = res[1]
      
      if (!containerRect) {
        console.log('无法获取预览容器尺寸，重试中...', retryCount)
        setTimeout(() => {
          this.calculatePreviewRegion(retryCount + 1)
        }, 150)
        return
      }

      // 检查图片是否有有效尺寸（实际渲染尺寸）
      if (!imageRect || imageRect.width === 0 || imageRect.height === 0) {
        console.log('图片尺寸无效，等待图片加载，重试中...', retryCount, {
          imageRect,
          containerRect
        })
        setTimeout(() => {
          this.calculatePreviewRegion(retryCount + 1)
        }, 150)
        return
      }

      // 获取系统信息，用于px转rpx
      const systemInfo = wx.getSystemInfoSync()
      const pxToRpx = 750 / systemInfo.windowWidth

      // 容器尺寸（px转rpx）
      const containerWidth = containerRect.width * pxToRpx
      const containerHeight = containerRect.height * pxToRpx

      // 图片实际渲染尺寸（px转rpx）- 使用真实的渲染尺寸
      const imageDisplayWidth = imageRect.width * pxToRpx
      const imageDisplayHeight = imageRect.height * pxToRpx

      // 图片相对于容器的位置（px转rpx）- 使用实际位置
      const imageOffsetX = (imageRect.left - containerRect.left) * pxToRpx
      const imageOffsetY = (imageRect.top - containerRect.top) * pxToRpx

      // 原始图片尺寸
      const originalWidth = this.data.imageSize.width
      const originalHeight = this.data.imageSize.height

      // 计算缩放比例（使用图片的实际渲染尺寸）
      const scale = imageDisplayWidth / originalWidth

      // 计算区域在预览图片上的位置和尺寸（相对于容器）
      const region = this.data.region
      const regionLeft = imageOffsetX + region.x1 * scale
      const regionTop = imageOffsetY + region.y1 * scale
      const regionWidth = region.width * scale
      const regionHeight = region.height * scale

      console.log('计算预览区域标记成功', {
        containerWidth,
        containerHeight,
        imageDisplayWidth,
        imageDisplayHeight,
        imageOffsetX,
        imageOffsetY,
        originalWidth,
        originalHeight,
        scale,
        regionLeft,
        regionTop,
        regionWidth,
        regionHeight
      })

      this.setData({
        previewRegionLeft: regionLeft,
        previewRegionTop: regionTop,
        previewRegionWidth: regionWidth,
        previewRegionHeight: regionHeight
      })
    })
  },

  // 预览图片加载完成
  onPreviewImageLoad(e) {
    console.log('预览图片加载完成', e)
    // 图片加载完成后，延迟一下再计算区域标记位置，确保图片已经渲染到屏幕上
    setTimeout(() => {
      this.calculatePreviewRegion()
    }, 300)
  },

  // 拍照功能（点击摄像头区域拍照）
  captureImage() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('拍照成功:', res.tempImagePath)
        // 拍照后自动调用接口获取得分
        this.uploadImageAndGetScore(res.tempImagePath)
      },
      fail: (err) => {
        console.error('拍照失败', err)
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },

  // 摄像头停止
  onCameraStop() {
    console.log('摄像头停止')
  },

  // 摄像头错误
  onCameraError(err) {
    console.error('摄像头错误', err)
    wx.showToast({
      title: '摄像头错误',
      icon: 'none'
    })
  },

  // 图片加载完成，计算区域标记位置
  onImageLoad(e) {
    if (!this.data.region || !this.data.imageSize) {
      return
    }

    const query = wx.createSelectorQuery()
    query.select('.score-image').boundingClientRect((rect) => {
      if (!rect) return

      // 获取系统信息，用于px转rpx
      const systemInfo = wx.getSystemInfoSync()
      const pxToRpx = 750 / systemInfo.windowWidth

      // 图片显示尺寸（px转rpx）
      const displayWidth = rect.width * pxToRpx
      const displayHeight = rect.height * pxToRpx

      // 原始图片尺寸
      const originalWidth = this.data.imageSize.width
      const originalHeight = this.data.imageSize.height

      // 计算缩放比例
      const scaleX = displayWidth / originalWidth
      const scaleY = displayHeight / originalHeight

      // 计算区域在显示图片上的位置和尺寸
      const region = this.data.region
      const regionLeft = region.x1 * scaleX
      const regionTop = region.y1 * scaleY
      const regionWidth = region.width * scaleX
      const regionHeight = region.height * scaleY

      this.setData({
        regionLeft: regionLeft,
        regionTop: regionTop,
        regionWidth: regionWidth,
        regionHeight: regionHeight
      })
    }).exec()
  }
})

