const api = require('../../../api/index')
const { showToast, navigateTo, showLoading, hideLoading, showConfirm } = require('../../../utils/index')

Page({
  data: {
    id: '',
    package: {
      id: '',
      title: '',
      images: [],
      tags: [],
      priceMin: 0,
      priceMax: 0,
      items: [],
      optionalServices: [],
      priceNote: '',
      notice: ''
    }
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadDetail()
  },

  async loadDetail() {
    try {
      showLoading()
      const data = await api.packages.getDetail(this.data.id)
      this.setData({ package: data })

      const app = getApp()
      app.trackEvent('view_package_detail', { packageId: this.data.id })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  onContact() {
    showConfirm('是否拨打客服电话咨询？', '联系客服').then((confirm) => {
      if (confirm) {
        wx.makePhoneCall({ phoneNumber: '400-123-4567' })
      }
    })
  },

  onSubmitLead() {
    const app = getApp()
    if (!app.globalData.userInfo) {
      showConfirm('请先登录后再提交意向', '提示').then((confirm) => {
        if (confirm) {
          wx.switchTab({ url: '/pages/mine/index' })
        }
      })
      return
    }
    navigateTo(`/pages/packages/lead/index?id=${this.data.id}`)
  },

  onShareAppMessage() {
    return {
      title: this.data.package.title,
      path: `/pages/packages/detail/index?id=${this.data.id}`,
      imageUrl: this.data.package.images[0]
    }
  }
})
