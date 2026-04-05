const api = require('../../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    events: [],
    loading: true,
    statusText: { signed: '已报名', attended: '已参加', cancelled: '已取消' }
  },

  onLoad() { this.loadEvents() },

  async loadEvents() {
    try {
      showLoading()
      const data = await api.events.getMySignups()
      this.setData({ events: data.list || data || [] })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
      this.setData({ loading: false })
    }
  },

  onEventDetail(e) {
    navigateTo(`/pages/events/detail/index?id=${e.currentTarget.dataset.id}`)
  }
})
