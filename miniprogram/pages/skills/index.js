const api = require('../../api/index')
const { showToast, navigateTo, showLoading, hideLoading, showConfirm } = require('../../utils/index')

Page({
  data: {
    activeTab: 'offer',
    posts: [
      { id: 1, title: '提供UI/UX设计服务', content: '5年设计经验，擅长移动端产品设计，可提供界面设计、交互设计、设计规范制定等服务。希望交换前端开发技能或有偿服务。', userNickname: '设计师小王', userAvatar: '', createdAt: '3小时前', rewardType: 'swap', tags: ['UI设计', '交互设计', 'Figma'], matchCount: 5 },
      { id: 2, title: '寻找摄影合作伙伴', content: '计划拍摄河源万绿湖系列风光片，需要擅长风光摄影的伙伴一起创作，可提供后期修图服务作为交换。', userNickname: '摄影爱好者', userAvatar: '', createdAt: '5小时前', rewardType: 'swap', tags: ['摄影', '后期修图', '风光'], matchCount: 3 },
      { id: 3, title: '免费提供职业规划咨询', content: '资深HR从业者，可为数字游民提供职业规划、简历优化、面试技巧等咨询服务，完全免费。', userNickname: 'HR小林', userAvatar: '', createdAt: '1天前', rewardType: 'volunteer', tags: ['职业规划', '简历优化', '面试'], matchCount: 8 },
      { id: 4, title: '承接小程序开发项目', content: '3年小程序开发经验，熟悉微信、支付宝、抖音小程序开发，可承接各类小程序开发项目，价格面议。', userNickname: '全栈开发者', userAvatar: '', createdAt: '2天前', rewardType: 'paid', tags: ['小程序', '全栈', 'Node.js'], matchCount: 2 }
    ],
    loading: false,
    noMore: true,
    page: 1,
    pageSize: 10,
    rewardText: {
      swap: '技能互换',
      paid: '有偿服务',
      volunteer: '志愿帮助'
    }
  },

  onLoad() {
    this.loadPosts()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, posts: this.data.posts, noMore: true })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  async loadPosts() {
    if (this.data.loading) return
    this.setData({ loading: true })

    try {
      const { page, pageSize, activeTab } = this.data
      const params = { page, pageSize, type: activeTab }
      const data = await api.posts.getList(params)
      if (data && data.list) {
        this.setData({ posts: data.list })
      }
      const app = getApp()
      app.trackEvent && app.trackEvent('view_post_list', { type: activeTab })
    } catch (error) {
      console.log('使用本地数据')
    } finally {
      this.setData({ loading: false })
    }
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab, page: 1, posts: [], noMore: false })
    this.loadPosts()
  },

  onPostDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/skills/detail/index?id=${id}`)
  },

  async onMatchSuggest(e) {
    const id = e.currentTarget.dataset.id
    showToast(`已为您匹配到 ${this.data.posts.find(p => p.id === id)?.matchCount || 0} 位合适的伙伴`)
  },

  async onMatch(e) {
    const id = e.currentTarget.dataset.id
    const app = getApp()

    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发起对接',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/mine/index' })
          }
        }
      })
      return
    }

    wx.showModal({
      title: '发起对接',
      editable: true,
      placeholderText: '请输入对接留言',
      success: async (res) => {
        if (res.confirm) {
          try {
            showLoading('发送中...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            showToast('对接请求已发送')
            app.trackEvent && app.trackEvent('match_sent', { postId: id })
          } catch (error) {
            showToast('发送失败，请重试')
          } finally {
            hideLoading()
          }
        }
      }
    })
  },

  onPublish() {
    const app = getApp()
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/mine/index' })
          }
        }
      })
      return
    }
    navigateTo('/pages/skills/publish/index')
  }
})