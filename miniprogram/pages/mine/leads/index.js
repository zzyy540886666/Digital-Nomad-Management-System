const api = require('../../../api/index')
const { showToast, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    leads: [],
    loading: true,
    statusText: {
      submitted: '已提交',
      contacted: '已联系',
      confirmed: '已确认',
      closed: '已完成',
      lost: '已取消'
    }
  },

  onLoad() {
    this.loadLeads()
  },

  async loadLeads() {
    try {
      showLoading()
      const data = await api.packages.getMyLeads()
      this.setData({ leads: data.list || data || [] })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
      this.setData({ loading: false })
    }
  }
})
