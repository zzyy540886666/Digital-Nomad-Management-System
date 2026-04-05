const api = require('../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../utils/index')
const svgIcons = require('../../components/svg-icons')

// 将 SVG 字符串转换为 data URL
const svgToDataUrl = (svgString, color = '#333333') => {
  const coloredSvg = svgString.replace(/currentColor/g, color)
  const encoded = encodeURIComponent(coloredSvg)
  return `data:image/svg+xml,${encoded}`
}

Page({
  data: {
    // SVG 图标（转换为 data URL）
    packageIconUrl: svgToDataUrl(svgIcons.package, '#4A90D9'),
    calendarIconUrl: svgToDataUrl(svgIcons.calendar, '#52c41a'),
    fileIconUrl: svgToDataUrl(svgIcons.file, '#722ed1'),
    usersIconUrl: svgToDataUrl(svgIcons.users, '#fa8c16'),
    settingsIconUrl: svgToDataUrl(svgIcons.settings, '#8c8c8c'),
    feedbackIconUrl: svgToDataUrl(svgIcons.feedback, '#13c2c2'),
    infoIconUrl: svgToDataUrl(svgIcons.ai, '#eb2f96'),
    arrowRightUrl: svgToDataUrl(svgIcons.arrowRight, '#ccc'),
    defaultAvatar: svgToDataUrl(svgIcons.users, '#4A90D9'),
    // 用户数据
    userInfo: null,
    profile: {
      skills: ['UI 设计', '摄影']
    },
    stats: {
      leads: 3,
      events: 5,
      posts: 2,
      matches: 4
    }
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
    if (this.data.userInfo) {
      this.loadProfile()
      this.loadStats()
    }
  },

  checkLogin() {
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo })
      this.loadProfile()
      this.loadStats()
    }
  },

  async onLogin() {
    const app = getApp()
    const mockUser = {
      id: 1,
      nickname: '数字游民小张',
      avatarUrl: ''
    }
    app.globalData.userInfo = mockUser
    this.setData({ userInfo: mockUser })
    showToast('登录成功')
  },

  async loadProfile() {
    try {
      const data = await api.auth.getMe()
      if (data) {
        this.setData({
          profile: {
            skills: data.skills || this.data.profile.skills,
            interests: data.interests || [],
            cityFrom: data.cityFrom,
            workType: data.workType
          }
        })
      }
    } catch (error) {
      console.log('使用本地数据')
    }
  },

  async loadStats() {
    try {
      const [leads, events, posts, matches] = await Promise.all([
        api.packages.getMyLeads().catch(() => ({ total: 3 })),
        api.events.getMySignups().catch(() => ({ total: 5 })),
        api.posts.getMyPosts().catch(() => ({ total: 2 })),
        api.posts.getMyMatches().catch(() => ({ total: 4 }))
      ])
      this.setData({
        stats: {
          leads: leads.length || leads.total || 0,
          events: events.length || events.total || 0,
          posts: posts.length || posts.total || 0,
          matches: matches.length || matches.total || 0
        }
      })
    } catch (error) {
      console.log('使用本地数据')
    }
  },

  onEditProfile() {
    if (!this.data.userInfo) {
      this.onLogin()
      return
    }
    navigateTo('/pages/mine/settings/index')
  },

  onNavigateTo(e) {
    const url = e.currentTarget.dataset.url
    if (!this.data.userInfo) {
      this.onLogin()
      return
    }
    navigateTo(url)
  },

  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      editable: true,
      placeholderText: '请输入您的反馈意见',
      success: (res) => {
        if (res.confirm && res.content) {
          showToast('感谢您的反馈')
        }
      }
    })
  },

  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '数字游民旅居生态平台\n\n为数字游民和旅居人群提供一站式服务，包括产品包、活动、生活指引、技能交换等。',
      showCancel: false
    })
  }
})
