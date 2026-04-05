const api = require('../../../api/index')
const { showToast, showLoading, hideLoading, showConfirm } = require('../../../utils/index')

Page({
  data: {
    id: '',
    task: {},
    isSignedUp: false,
    categoryText: {
      consulting: '顾问',
      workshop: '工作坊',
      volunteer: '志愿',
      project: '项目'
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id })
      this.loadDetail()
    }
  },

  async loadDetail() {
    try {
      showLoading()
      const data = await api.community.getTaskDetail(this.data.id)
      this.setData({
        task: data,
        isSignedUp: data.isSignedUp || false
      })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  async onSignup() {
    if (this.data.isSignedUp) {
      showToast('您已报名该任务')
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
      await api.community.signupTask(this.data.id)
      this.setData({ isSignedUp: true })
      showToast('报名成功')

      app.trackEvent('task_apply', { taskId: this.data.id })
    } catch (error) {
      showToast('报名失败，请重试')
    } finally {
      hideLoading()
    }
  }
})
