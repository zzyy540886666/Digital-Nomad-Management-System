const api = require('../../api/index')
const { showLoading, hideLoading } = require('../../utils/index')
const svgIcons = require('../../components/svg-icons')

const svgToDataUrl = (svgString, color = '#333333') => {
  const coloredSvg = svgString.replace(/currentColor/g, color)
  const encoded = encodeURIComponent(coloredSvg)
  return `data:image/svg+xml,${encoded}`
}

Page({
  data: {
    searchIconUrl: svgToDataUrl(svgIcons.search, '#999'),
    closeIconUrl: svgToDataUrl(svgIcons.close, '#999'),
    arrowRightUrl: svgToDataUrl(svgIcons.arrowRight, '#ccc'),
    keyword: '',
    history: [],
    hotKeywords: ['万绿湖', '温泉', '数字游民', '客家美食', '短期旅居', '工位'],
    results: {
      packages: [],
      events: [],
      posts: []
    },
    searching: false,
    hasSearched: false
  },

  onLoad() {
    this.loadHistory()
  },

  loadHistory() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ history })
  },

  saveHistory(keyword) {
    let history = this.data.history.filter(k => k !== keyword)
    history.unshift(keyword)
    history = history.slice(0, 10)
    wx.setStorageSync('searchHistory', history)
    this.setData({ history })
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({ history: [] })
        }
      }
    })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onClear() {
    this.setData({ keyword: '', hasSearched: false, results: { packages: [], events: [], posts: [] } })
  },

  onSearch() {
    const keyword = this.data.keyword.trim()
    if (!keyword) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }
    this.doSearch(keyword)
  },

  onTagTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  async doSearch(keyword) {
    this.saveHistory(keyword)
    this.setData({ searching: true, hasSearched: true })

    try {
      showLoading()
      const [packages, events, posts] = await Promise.all([
        api.packages.getList({ keyword }).catch(() => ({ list: [] })),
        api.events.getList({ keyword }).catch(() => ({ list: [] })),
        api.posts.getList({ keyword }).catch(() => ({ list: [] }))
      ])

      this.setData({
        results: {
          packages: packages.list || packages || [],
          events: events.list || events || [],
          posts: posts.list || posts || []
        }
      })
    } catch (error) {
      console.error('搜索失败', error)
    } finally {
      hideLoading()
      this.setData({ searching: false })
    }
  },

  onPackageDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/packages/detail/index?id=${id}` })
  },

  onEventDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/events/detail/index?id=${id}` })
  },

  onPostDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/skills/detail/index?id=${id}` })
  }
})
