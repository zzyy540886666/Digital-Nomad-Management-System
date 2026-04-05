const api = require('../../../api/index')
const { showToast, navigateTo } = require('../../../utils/index')

Page({
  data: {
    events: [
      { id: 1, title: '数字游民线下交流会', coverUrl: 'https://picsum.photos/800/400?random=20', startTime: '2024-03-15 14:00', venueName: '河源创客空间', feeType: 'free', signupCount: 28, capacity: 50, organizerName: '河源数字游民社区', organizerAvatar: '' },
      { id: 2, title: '客家美食烹饪体验课', coverUrl: 'https://picsum.photos/800/400?random=21', startTime: '2024-03-16 10:00', venueName: '客家文化村', feeType: 'paid', signupCount: 15, capacity: 20, organizerName: '客家文化传承中心', organizerAvatar: '' },
      { id: 3, title: '万绿湖徒步摄影活动', coverUrl: 'https://picsum.photos/800/400?random=22', startTime: '2024-03-17 07:00', venueName: '万绿湖风景区', feeType: 'free', signupCount: 35, capacity: 40, organizerName: '河源户外俱乐部', organizerAvatar: '' },
      { id: 4, title: '远程工作效率提升分享会', coverUrl: 'https://picsum.photos/800/400?random=23', startTime: '2024-03-18 19:30', venueName: '线上直播', feeType: 'free', signupCount: 120, capacity: 200, organizerName: '数字游民学院', organizerAvatar: '' },
      { id: 5, title: '周末读书会：探索数字时代', coverUrl: 'https://picsum.photos/800/400?random=24', startTime: '2024-03-19 15:00', venueName: '河源图书馆', feeType: 'free', signupCount: 18, capacity: 30, organizerName: '河源读书会', organizerAvatar: '' }
    ],
    loading: false,
    noMore: true,
    page: 1,
    pageSize: 10,
    activeCategory: '',
    categoryOptions: [
      { label: '全部', value: '' },
      { label: '社交', value: 'social' },
      { label: '文化', value: 'culture' },
      { label: '户外', value: 'outdoor' },
      { label: '共建', value: 'build' },
      { label: '技能分享', value: 'skillshare' }
    ]
  },

  onLoad() {
    this.loadEvents()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, events: this.data.events, noMore: true })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  async loadEvents() {
    if (this.data.loading) return
    this.setData({ loading: true })
    
    try {
      const { page, pageSize, activeCategory } = this.data
      const params = { page, pageSize, category: activeCategory }
      const data = await api.events.getList(params)
      if (data && data.list) {
        this.setData({ events: data.list })
      }
      const app = getApp()
      app.trackEvent && app.trackEvent('view_event_list', { category: activeCategory })
    } catch (error) {
      console.log('使用本地数据')
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearch() {
    navigateTo('/pages/search/index?type=event')
  },

  onFilterCategory(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeCategory: value })
    this.loadEvents()
  },

  onEventDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/events/detail/index?id=${id}`)
  }
})