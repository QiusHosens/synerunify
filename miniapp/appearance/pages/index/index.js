// pages/index/index.js
Page({
  data: {
    devicePosition: 'back', // 'front' 或 'back'
    flash: 'off', // 'on', 'off', 'auto'
    score: null, // 得分
    currentImage: null // 当前检测的图片路径
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
    wx.showToast({
      title: this.data.devicePosition === 'back' ? '后置摄像头' : '前置摄像头',
      icon: 'none',
      duration: 1000
    })
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
    const apiUrl = 'http://192.168.1.4:9990/appearance/predict'
    
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
          if (data.success || data.code === 200 || data.score !== undefined) {
            // 假设接口返回格式为 { score: 85 } 或 { data: { score: 85 } }
            const score = data.score || data.data?.score || data.result?.score
            if (score !== undefined) {
              this.setData({
                score: Math.round(score),
                currentImage: imagePath // 保存图片路径
              })
              wx.showToast({
                title: `得分: ${Math.round(score)}`,
                icon: 'success',
                duration: 2000
              })
            } else {
              throw new Error('接口返回格式不正确')
            }
          } else {
            throw new Error(data.message || '接口返回错误')
          }
        } catch (err) {
          console.error('解析接口返回失败', err)
          // 如果接口格式不对，使用模拟数据
          this.useMockScore(imagePath)
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
      currentImage: imagePath || null // 如果有图片路径，也保存
    })
    wx.showToast({
      title: `得分: ${mockScore}`,
      icon: 'success',
      duration: 2000
    })
  },

  // 预览图片（点击图片放大查看）
  previewImage() {
    if (this.data.currentImage) {
      wx.previewImage({
        urls: [this.data.currentImage],
        current: this.data.currentImage
      })
    }
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
  }
})

