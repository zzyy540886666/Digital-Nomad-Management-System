App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:8080/api',
    city: '河源'
  },

  onLaunch() {
    this.checkLoginStatus()
    this.getSystemInfo()
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
    }
  },

  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight
    this.globalData.screenWidth = systemInfo.screenWidth
    this.globalData.screenHeight = systemInfo.screenHeight
  },

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            this.request({
              url: '/auth/wx-login',
              method: 'POST',
              data: { jsCode: res.code }
            }).then((data) => {
              this.globalData.token = data.token
              this.globalData.userInfo = data.user
              wx.setStorageSync('token', data.token)
              wx.setStorageSync('userInfo', data.user)
              resolve(data)
            }).catch(reject)
          } else {
            reject(new Error('wx.login failed'))
          }
        },
        fail: reject
      })
    })
  },

  request(options) {
    return new Promise((resolve, reject) => {
      const header = {
        'Content-Type': 'application/json',
        ...options.header
      }
      if (this.globalData.token) {
        header['Authorization'] = `Bearer ${this.globalData.token}`
      }
      wx.request({
        url: this.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              resolve(res.data.data)
            } else {
              reject(new Error(res.data.message || '请求失败'))
            }
          } else if (res.statusCode === 401) {
            this.login().then(() => {
              this.request(options).then(resolve).catch(reject)
            }).catch(reject)
          } else {
            reject(new Error('网络错误'))
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '网络请求失败'))
        }
      })
    })
  },

  trackEvent(eventName, properties = {}) {
    this.request({
      url: '/event-logs',
      method: 'POST',
      data: { eventName, properties }
    }).catch(() => {})
  }
})
