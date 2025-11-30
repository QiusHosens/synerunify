Page({
  data: {
    devicePosition: 'back', // 'front' 或 'back'
    flash: 'auto', // 'on', 'off', 'auto'
    score: null, // 得分（用于显示，逗号分隔的多个分数）
    currentImage: null, // 当前检测的图片路径
    faces: [], // 人脸数组
    imageSize: null, // 原始图片尺寸
    faceRegions: [], // 人脸区域标记数据（用于小图显示）
    showPreview: false, // 是否显示预览
    previewFaceRegions: [], // 预览时的人脸区域标记数据
    cameraReady: false // 摄像头是否准备好（授权后为true）
  },

  onLoad() {
    console.log('onLoad')
    // 检查权限状态，但不主动请求授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          // 已授权，直接显示摄像头
          this.setData({
            cameraReady: true
          })
        } else {
          // 未授权，先显示摄像头（用于显示授权提示），等用户操作时再请求权限
          this.setData({
            cameraReady: true
          })
          console.log('页面加载时摄像头权限未授权，等待用户操作时再请求')
        }
      }
    })
  },

  // 检查并请求摄像头权限
  checkCameraPermission(callback) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          // 已授权
          console.log('摄像头权限已授权')
          callback && callback(true)
        } else if (res.authSetting['scope.camera'] === false) {
          // 用户曾经拒绝过授权，需要打开设置页面
          wx.showModal({
            title: '需要摄像头权限',
            content: '请在设置中开启摄像头权限',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.camera']) {
                      // 授权成功，重新初始化摄像头
                      this.reinitCamera()
                      callback && callback(true)
                    } else {
                      callback && callback(false)
                    }
                  },
                  fail: () => {
                    callback && callback(false)
                  }
                })
              } else {
                callback && callback(false)
              }
            }
          })
        } else {
          // 未授权，请求授权
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              console.log('摄像头权限已授权')
              // 授权成功，重新初始化摄像头
              this.reinitCamera()
              callback && callback(true)
            },
            fail: () => {
              wx.showModal({
                title: '需要摄像头权限',
                content: '需要摄像头权限才能使用此功能',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.camera']) {
                          // 授权成功，重新初始化摄像头
                          this.reinitCamera()
                          callback && callback(true)
                        } else {
                          callback && callback(false)
                        }
                      },
                      fail: () => {
                        callback && callback(false)
                      }
                    })
                  } else {
                    callback && callback(false)
                  }
                }
              })
            }
          })
        }
      },
      fail: () => {
        callback && callback(false)
      }
    })
  },

  // 重新初始化摄像头
  reinitCamera() {
    // 先隐藏摄像头，然后重新显示，强制重新渲染
    this.setData({
      cameraReady: false
    })
    setTimeout(() => {
      this.setData({
        cameraReady: true
      })
    }, 100)
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
    // 选择相册不需要摄像头权限，直接选择
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
        // wx.showToast({
        //   title: '选择图片失败',
        //   icon: 'none'
        // })
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
    // const apiUrl = 'http://192.168.1.4:9990/process/appearance/predict'
    // const apiUrl = 'https://synerunify.com/api/process/appearance/predict'
    // const apiUrl = 'http://192.168.1.4:9990/process/appearance/predict_all'
    const apiUrl = 'https://synerunify.com/api/process/appearance/predict_all'
    
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
          const faces = data.data?.faces || [];
          const imageSize = data.data?.size || null;
          
          // 处理人脸数据：按 x1 位置从左到右排序
          const sortedFaces = faces.sort((a, b) => a.region.x1 - b.region.x1);
          
          // 生成分数字符串（用逗号分隔）
          const scores = sortedFaces.map(face => Math.round(face.score)).join(',');
          
          this.setData({
            score: scores || '-',
            currentImage: imagePath, // 保存图片路径
            faces: sortedFaces, // 保存人脸数组
            imageSize: imageSize, // 保存原始图片尺寸
            faceRegions: [] // 清空之前的区域标记，等待图片加载后计算
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
          title: '服务调用失败',
          icon: 'none',
          duration: 2000
        })
        // this.useMockScore(imagePath)
      }
    })
  },

  // 使用模拟得分（用于测试或接口不可用时）
  useMockScore(imagePath) {
    // 清空数据
    this.setData({
      score: '--',
      currentImage: imagePath || null,
      faces: [],
      imageSize: null,
      faceRegions: []
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
        previewFaceRegions: []
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
    if (!this.data.faces || this.data.faces.length === 0 || !this.data.imageSize) {
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

      // 先计算所有人脸区域的位置
      const regions = this.data.faces.map((face, index) => {
        const region = face.region
        return {
          index: index,
          left: imageOffsetX + region.x1 * scale,
          top: imageOffsetY + region.y1 * scale,
          width: region.width * scale,
          height: region.height * scale
        }
      })
      
      // 检查两个矩形是否重叠
      const isOverlap = (rect1, rect2) => {
        return !(rect1.left + rect1.width < rect2.left || 
                 rect2.left + rect2.width < rect1.left ||
                 rect1.top + rect1.height < rect2.top ||
                 rect2.top + rect2.height < rect1.top)
      }
      
      // 计算所有人脸区域在预览图片上的位置和尺寸（相对于容器）
      const previewFaceRegions = this.data.faces.map((face, index) => {
        const region = regions[index]
        const regionLeft = region.left
        const regionTop = region.top
        const regionWidth = region.width
        const regionHeight = region.height
        
        // 计算分数显示位置（默认在上方，如果遮挡则按左/右/下顺序选择）
        const scoreHeight = 40 // 分数标签高度（rpx）
        const scoreWidth = 64 // 分数标签预估宽度（rpx，考虑数字可能较长）
        let scorePosition = 'top' // 默认位置
        let scoreLeft = 0
        let scoreTop = 0
        
        // 计算分数标签的位置
        const getScoreRect = (pos, left, top) => {
          switch(pos) {
            case 'top':
              return {
                left: regionLeft + left,
                top: regionTop + top,
                width: scoreWidth,
                height: scoreHeight
              }
            case 'left':
              return {
                left: regionLeft + left,
                top: regionTop + top,
                width: scoreWidth,
                height: scoreHeight
              }
            case 'right':
              return {
                left: regionLeft + left,
                top: regionTop + top,
                width: scoreWidth,
                height: scoreHeight
              }
            case 'bottom':
              return {
                left: regionLeft + left,
                top: regionTop + top,
                width: scoreWidth,
                height: scoreHeight
              }
            default:
              return null
          }
        }
        
        // 检查分数位置是否会遮挡其他区域
        const checkScorePosition = (pos, left, top) => {
          // 检查是否超出容器边界
          const scoreRect = getScoreRect(pos, left, top)
          if (!scoreRect) return false
          
          if (scoreRect.left < 0 || scoreRect.top < 0 ||
              scoreRect.left + scoreRect.width > containerWidth ||
              scoreRect.top + scoreRect.height > containerHeight) {
            return false
          }
          
          // 检查是否会遮挡其他区域
          for (let i = 0; i < regions.length; i++) {
            if (i === index) continue // 跳过当前区域
            if (isOverlap(scoreRect, regions[i])) {
              return false // 会遮挡其他区域
            }
          }
          
          return true // 位置可用
        }
        
        // 按顺序尝试位置：上 -> 左 -> 右 -> 下
        if (checkScorePosition('top', 0, -scoreHeight)) {
          scorePosition = 'top'
          scoreLeft = 0
          scoreTop = -scoreHeight
        } else if (checkScorePosition('left', -scoreWidth, 0)) {
          scorePosition = 'left'
          // scoreLeft = -scoreWidth
          scoreLeft = 0
          scoreTop = 0
        } else if (checkScorePosition('right', regionWidth, 0)) {
          scorePosition = 'right'
          scoreLeft = regionWidth
          scoreTop = 0
        } else if (checkScorePosition('bottom', 0, regionHeight)) {
          scorePosition = 'bottom'
          scoreLeft = 0
          scoreTop = regionHeight
        } else {
          // 所有位置都不可用，强制放在上方（即使会遮挡）
          scorePosition = 'top'
          scoreLeft = 0
          scoreTop = -scoreHeight
        }
        
        return {
          index: index,
          score: Math.round(face.score),
          left: regionLeft,
          top: regionTop,
          width: regionWidth,
          height: regionHeight,
          scorePosition: scorePosition,
          scoreLeft: scoreLeft,
          scoreTop: scoreTop
        }
      })

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
        previewFaceRegions
      })

      this.setData({
        previewFaceRegions: previewFaceRegions
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
    // 检查摄像头权限
    this.checkCameraPermission((hasPermission) => {
      if (hasPermission) {
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
            // wx.showToast({
            //   title: '拍照失败',
            //   icon: 'none'
            // })
          }
        })
      } else {
        // wx.showToast({
        //   title: '需要摄像头权限',
        //   icon: 'none'
        // })
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
    // 如果是权限错误，检查并请求权限
    if (err.detail && (err.detail.errMsg && err.detail.errMsg.includes('permission'))) {
      this.checkCameraPermission((hasPermission) => {
        if (!hasPermission) {
          // wx.showToast({
          //   title: '需要摄像头权限',
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      })
    } else {
      // wx.showToast({
      //   title: '摄像头错误',
      //   icon: 'none'
      // })
    }
  },

  // 图片加载完成，计算区域标记位置
  onImageLoad(e) {
    if (!this.data.faces || this.data.faces.length === 0 || !this.data.imageSize) {
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

      // 计算所有人脸区域在显示图片上的位置和尺寸
      const faceRegions = this.data.faces.map((face, index) => {
        const region = face.region
        return {
          index: index,
          score: Math.round(face.score),
          left: region.x1 * scaleX,
          top: region.y1 * scaleY,
          width: region.width * scaleX,
          height: region.height * scaleY
        }
      })

      this.setData({
        faceRegions: faceRegions
      })
    }).exec()
  }
})

