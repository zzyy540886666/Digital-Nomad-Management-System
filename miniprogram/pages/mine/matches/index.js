const api = require('../../../api/index')
const { showToast, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    activeTab: 'sent',
    matches: [],
    loading: true,
    statusText: {
      sent: '待处理',
      accepted: '已接受',
      rejected: '已拒绝',
      closed: '已完成'
    }
  },

  onLoad() {
    this.loadMatches()
  },

  async loadMatches() {
    try {
      showLoading()
      const data = await api.posts.getMyMatches()
      const matches = data.list || data || []
      const filtered = this.data.activeTab === 'sent' 
        ? matches.filter(m => m.direction === 'sent')
        : matches.filter(m => m.direction === 'received')
      this.setData({ matches: filtered })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
      this.setData({ loading: false })
    }
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
    this.loadMatches()
  },

  async onAccept(e) {
    const id = e.currentTarget.dataset.id
    try {
      showLoading('处理中...')
      await api.posts.match(id, { action: 'accept' })
      showToast('已接受')
      this.loadMatches()
    } catch (error) {
      showToast('操作失败，请重试')
    } finally {
      hideLoading()
    }
  },

  async onReject(e) {
    const id = e.currentTarget.dataset.id
    try {
      showLoading('处理中...')
      await api.posts.match(id, { action: 'reject' })
      showToast('已拒绝')
      this.loadMatches()
    } catch (error) {
      showToast('操作失败，请重试')
    } finally {
      hideLoading()
    }
  }
})
