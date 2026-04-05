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
    city: '河源',
    // SVG 图标（转换为 data URL）
    locationIcon: svgToDataUrl(svgIcons.location, '#4A90D9'),
    arrowDownIcon: svgToDataUrl(svgIcons.arrowDown, '#333'),
    searchIcon: svgToDataUrl(svgIcons.search, '#999'),
    arrowRightUrl: svgToDataUrl(svgIcons.arrowRight, '#ccc'),
    timeIconUrl: svgToDataUrl(svgIcons.time, '#999'),
    locationIconUrl: svgToDataUrl(svgIcons.location, '#999'),
    communityIconUrl: svgToDataUrl(svgIcons.users, '#4A90D9'),
    // 轮播图
    banners: [],
    // 快捷入口（转换为 data URL）
    quickEntries: [
      { id: 1, name: '旅居包', iconUrl: svgToDataUrl(svgIcons.package, '#4A90D9'), bgColor: 'linear-gradient(135deg, #E6F4FF 0%, #BAE0FF 100%)', url: '/pages/packages/list/index' },
      { id: 2, name: '活动', iconUrl: svgToDataUrl(svgIcons.calendar, '#fa8c16'), bgColor: 'linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%)', url: '/pages/events/list/index' },
      { id: 3, name: '指引', iconUrl: svgToDataUrl(svgIcons.location, '#52c41a'), bgColor: 'linear-gradient(135deg, #F6FFED 0%, #D9F7BE 100%)', url: '/pages/guides/index' },
      { id: 4, name: '对接', iconUrl: svgToDataUrl(svgIcons.users, '#eb2f96'), bgColor: 'linear-gradient(135deg, #FFF0F6 0%, #FFD6E7 100%)', url: '/pages/skills/index' }
    ],
    packages: [],
    events: [],
    posts: [],
    guides: [
      { id: 1, name: '住宿', type: 'accommodation', iconUrl: svgToDataUrl(svgIcons.home, '#4A90D9'), bgColor: 'linear-gradient(135deg, #E6F4FF 0%, #BAE0FF 100%)' },
      { id: 2, name: '餐饮', type: 'food', iconUrl: svgToDataUrl(svgIcons.food, '#ff7875'), bgColor: 'linear-gradient(135deg, #FFF0F6 0%, #FFD6E7 100%)' },
      { id: 3, name: '交通', type: 'transport', iconUrl: svgToDataUrl(svgIcons.location, '#36cfc9'), bgColor: 'linear-gradient(135deg, #E6FFFB 0%, #B5F5EC 100%)' },
      { id: 4, name: '景点', type: 'attraction', iconUrl: svgToDataUrl(svgIcons.recommend, '#ffc53d'), bgColor: 'linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%)' },
      { id: 5, name: '医疗', type: 'medical', iconUrl: svgToDataUrl(svgIcons.medical, '#ff85c0'), bgColor: 'linear-gradient(135deg, #FFF0F6 0%, #FFD6E7 100%)' },
      { id: 6, name: '办事', type: 'service', iconUrl: svgToDataUrl(svgIcons.document, '#b37feb'), bgColor: 'linear-gradient(135deg, #F9F0FF 0%, #EFDBFF 100%)' },
      { id: 7, name: '网络', type: 'network', iconUrl: svgToDataUrl(svgIcons.wifi, '#597ef7'), bgColor: 'linear-gradient(135deg, #F0F5FF 0%, #D6E4FF 100%)' },
      { id: 8, name: '更多', type: 'more', iconUrl: svgToDataUrl(svgIcons.grid, '#8c8c8c'), bgColor: 'linear-gradient(135deg, #F5F5F5 0%, #D9D9D9 100%)' }
    ]
  },

  onLoad() {
    this.loadBanners()
    this.loadHomeData()
    this.checkFirstVisit()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onPullDownRefresh() {
    this.loadBanners()
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 加载轮播图
  async loadBanners() {
    try {
      const banners = await api.home.getBanners()
      if (banners && banners.length > 0) {
        this.setData({ banners })
      }
    } catch (error) {
      console.log('加载轮播图失败，使用默认数据')
    }
  },

  async loadHomeData() {
    try {
      showLoading()
      const data = await api.home.getHomeData()
      if (data) {
        this.setData({
          packages: data.featuredPackages || [],
          events: data.upcomingEvents || [],
          guides: this.data.guides
        })
      }
      // 加载技能交换帖子
      const postsData = await api.posts.getList({ page: 1, pageSize: 3 }).catch(() => null)
      if (postsData && postsData.list) {
        this.setData({ posts: postsData.list })
      }
      const app = getApp()
      app.trackEvent && app.trackEvent('view_home')
    } catch (error) {
      console.log('使用本地数据')
      this.setData({
        packages: [
          { id: 1, title: '万绿湖深度旅居 7 日游', coverUrl: 'https://picsum.photos/400/300?random=1', priceMin: 2980, tags: ['自然风光', '深度体验'] },
          { id: 2, title: '客家文化探索 5 日游', coverUrl: 'https://picsum.photos/400/300?random=2', priceMin: 1980, tags: ['人文历史', '美食体验'] },
          { id: 3, title: '温泉养生度假 3 日游', coverUrl: 'https://picsum.photos/400/300?random=3', priceMin: 1280, tags: ['养生休闲', '温泉'] }
        ],
        events: [
          { id: 1, title: '数字游民线下交流会', coverUrl: 'https://picsum.photos/400/300?random=4', startTime: '3/15 14:00', venueName: '河源创客空间', feeType: 'free', signupCount: 28, capacity: 50 },
          { id: 2, title: '客家美食烹饪体验课', coverUrl: 'https://picsum.photos/400/300?random=5', startTime: '3/16 10:00', venueName: '客家文化村', feeType: 'paid', signupCount: 15, capacity: 20 }
        ],
        posts: [
          { id: 1, title: '提供UI设计服务', type: 'offer', tags: ['UI设计', 'Figma'], createdAt: '2小时前' },
          { id: 2, title: '求摄影指导', type: 'seek', tags: ['摄影', '后期'], createdAt: '5小时前' }
        ]
      })
    } finally {
      hideLoading()
    }
  },

  checkFirstVisit() {
    const hasVisited = wx.getStorageSync('hasVisited')
    if (!hasVisited) {
      this.showGuideModal()
      wx.setStorageSync('hasVisited', true)
    }
  },

  showGuideModal() {
    wx.showModal({
      title: '欢迎来到数字游民旅居',
      content: '1分钟了解河源旅居：产品包、活动、生活指引、技能交换，一站式解决您的旅居需求。',
      showCancel: false,
      confirmText: '开始探索'
    })
  },

  onSelectCity() {
    wx.showActionSheet({
      itemList: ['河源', '广州', '深圳', '珠海'],
      success: (res) => {
        const cities = ['河源', '广州', '深圳', '珠海']
        this.setData({ city: cities[res.tapIndex] })
      }
    })
  },

  onBannerTap(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      if (url.startsWith('http')) {
        wx.setClipboardData({
          data: url,
          success: () => {
            wx.showToast({
              title: '链接已复制',
              icon: 'success'
            })
          }
        })
      } else {
        navigateTo(url)
      }
    }
  },

  onSearch() {
    navigateTo('/pages/search/index')
  },

  onNavigateTo(e) {
    const url = e.currentTarget.dataset.url
    if (url.includes('packages/list') || url.includes('events/list')) {
      wx.switchTab({ url })
    } else {
      navigateTo(url)
    }
  },

  onPackageDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/packages/detail/index?id=${id}`)
  },

  onEventDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/events/detail/index?id=${id}`)
  },

  onGuideDetail(e) {
    const type = e.currentTarget.dataset.type
    navigateTo(`/pages/guides/index?type=${type}`)
  },

  onPostDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/skills/detail/index?id=${id}`)
  }
})
