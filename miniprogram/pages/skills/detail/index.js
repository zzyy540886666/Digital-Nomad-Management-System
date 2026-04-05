const api = require('../../../api/index')
const { showToast, showLoading, hideLoading, showConfirm } = require('../../../utils/index')

Page({
  data: {
    id: '',
    post: {},
    candidates: [],
    isCollected: false,
    rewardText: {
      swap: '技能互换',
      paid: '有偿服务',
      volunteer: '志愿帮助'
    }
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadDetail()
    this.loadCandidates()
  },

  async loadDetail() {
    try {
      showLoading()
      const data = await api.posts.getDetail(this.data.id)
      this.setData({
        post: data,
        isCollected: data.isCollected || false
      })

      const app = getApp()
      app.trackEvent('view_post_detail', { postId: this.data.id })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  async loadCandidates() {
    try {
      const data = await api.recommendations.matchSuggest(this.data.id)
      this.setData({ candidates: data.candidates || [] })
    } catch (error) {
      console.log('加载匹配推荐失败', error)
    }
  },

  onCandidateTap(e) {
    const item = e.currentTarget.dataset.item
    if (item.userId) {
      wx.showModal({
        title: '发起对接',
        content: `确定要向 ${item.nickname} 发起对接请求吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              showLoading('发送中...')
              await api.posts.match(this.data.id, { 
                message: '您好，我想与您对接',
                toUserId: item.userId 
              })
              showToast('对接请求已发送')
            } catch (error) {
              showToast('发送失败，请重试')
            } finally {
              hideLoading()
            }
          }
        }
      })
    }
  },

  onCollect() {
    this.setData({ isCollected: !this.data.isCollected })
    showToast(this.data.isCollected ? '已收藏' : '已取消收藏')
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  async onMatch() {
    const app = getApp()

    if (!app.globalData.userInfo) {
      showConfirm('请先登录后再发起对接', '提示').then((confirm) => {
        if (confirm) {
          wx.switchTab({ url: '/pages/mine/index' })
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
            await api.posts.match(this.data.id, { message: res.content || '您好，我想与您对接' })
            showToast('对接请求已发送')
            app.trackEvent('match_sent', { postId: this.data.id })
          } catch (error) {
            showToast('发送失败，请重试')
          } finally {
            hideLoading()
          }
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.post.title,
      path: `/pages/skills/detail/index?id=${this.data.id}`
    }
  }
})
