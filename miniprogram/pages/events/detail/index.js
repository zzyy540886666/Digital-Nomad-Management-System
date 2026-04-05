const api = require('../../../api/index')
const { showToast, navigateTo, showLoading, hideLoading, showConfirm } = require('../../../utils/index')

const categoryTextMap = {
  social: '社交',
  culture: '文化',
  outdoor: '户外',
  build: '共建',
  skillshare: '技能分享'
}

Page({
  data: {
    id: '',
    event: {},
    signupList: [],
    isSignedUp: false,
    isCollected: false,
    isFull: false,
    categoryText: ''
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadDetail()
  },

  async loadDetail() {
    try {
      showLoading()
      const data = await api.events.getDetail(this.data.id)
      const isFull = data.capacity && data.signupCount >= data.capacity
      
      this.setData({
        event: data,
        signupList: data.signupList || [],
        isSignedUp: data.isSignedUp || false,
        isCollected: data.isCollected || false,
        isFull,
        categoryText: categoryTextMap[data.category] || '活动'
      })

      const app = getApp()
      app.trackEvent('view_event_detail', { eventId: this.data.id })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  onNavigate() {
    const { event } = this.data
    if (event.latitude && event.longitude) {
      wx.openLocation({
        latitude: event.latitude,
        longitude: event.longitude,
        name: event.venueName,
        address: event.venueAddress,
        scale: 16
      })
    }
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  async onCollect() {
    this.setData({ isCollected: !this.data.isCollected })
    showToast(this.data.isCollected ? '已收藏' : '已取消收藏')
  },

  async onSignup() {
    if (this.data.isSignedUp) {
      showConfirm('确定要取消报名吗？').then(async (confirm) => {
        if (confirm) {
          try {
            await api.events.cancel(this.data.id)
            this.setData({ isSignedUp: false, isFull: false })
            showToast('已取消报名')
          } catch (error) {
            showToast('操作失败，请重试')
          }
        }
      })
      return
    }

    if (this.data.isFull) {
      showToast('活动已满员')
      return
    }

    const app = getApp()
    if (!app.globalData.userInfo) {
      showConfirm('请先登录后再报名', '提示').then((confirm) => {
        if (confirm) {
          wx.switchTab({ url: '/pages/mine/index' })
        }
      })
      return
    }

    try {
      showLoading('报名中...')
      await api.events.signup(this.data.id)
      this.setData({ isSignedUp: true })
      
      app.trackEvent('signup_event', { eventId: this.data.id })

      wx.showModal({
        title: '报名成功',
        content: '您已成功报名该活动，请按时参加。',
        showCancel: false
      })
    } catch (error) {
      showToast(error.message || '报名失败，请重试')
    } finally {
      hideLoading()
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.event.title,
      path: `/pages/events/detail/index?id=${this.data.id}`,
      imageUrl: this.data.event.coverUrl
    }
  }
})
