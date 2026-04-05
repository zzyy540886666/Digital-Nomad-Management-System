const api = require('../../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    posts: [],
    loading: true,
    typeText: { offer: '我能提供', need: '我需要', project: '本地项目' },
    statusText: { pending: '审核中', approved: '已发布', rejected: '已拒绝', offline: '已下线' }
  },

  onLoad() { this.loadPosts() },

  async loadPosts() {
    try {
      showLoading()
      const data = await api.posts.getMyPosts()
      this.setData({ posts: data.list || data || [] })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
      this.setData({ loading: false })
    }
  },

  onPostDetail(e) {
    navigateTo(`/pages/skills/detail/index?id=${e.currentTarget.dataset.id}`)
  }
})
