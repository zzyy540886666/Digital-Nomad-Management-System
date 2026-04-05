const api = require('../../../api/index')
const { showToast, navigateTo } = require('../../../utils/index')

Page({
  data: {
    packages: [
      { id: 1, title: '万绿湖深度旅居7日游', coverUrl: 'https://picsum.photos/800/400?random=10', priceMin: 2980, duration: '7天6晚', tags: ['自然风光', '深度体验'], description: '探索万绿湖的绝美风光，体验湖畔露营、皮划艇、徒步等户外活动，感受河源独特的自然魅力。' },
      { id: 2, title: '客家文化探索5日游', coverUrl: 'https://picsum.photos/800/400?random=11', priceMin: 1980, duration: '5天4晚', tags: ['人文历史', '美食体验'], description: '深入客家古村落，品尝地道客家美食，学习客家山歌，体验传统手工艺制作。' },
      { id: 3, title: '温泉养生度假3日游', coverUrl: 'https://picsum.photos/800/400?random=12', priceMin: 1280, duration: '3天2晚', tags: ['养生休闲', '温泉'], description: '入住温泉度假酒店，享受天然温泉SPA，品尝养生美食，放松身心。' },
      { id: 4, title: '乡村田园体验4日游', coverUrl: 'https://picsum.photos/800/400?random=13', priceMin: 1580, duration: '4天3晚', tags: ['田园风光', '农耕体验'], description: '体验农家生活，采摘新鲜蔬果，制作农家美食，感受田园牧歌。' },
      { id: 5, title: '丹霞地貌徒步6日游', coverUrl: 'https://picsum.photos/800/400?random=14', priceMin: 2580, duration: '6天5晚', tags: ['户外探险', '摄影'], description: '探索丹霞地貌奇观，专业向导带队，适合户外爱好者和摄影爱好者。' }
    ],
    loading: false,
    noMore: true,
    page: 1,
    pageSize: 10,
    activeBudget: '',
    activeDuration: '',
    budgetOptions: [
      { label: '全部', value: '' },
      { label: '经济型', value: 'low' },
      { label: '舒适型', value: 'medium' },
      { label: '品质型', value: 'high' }
    ],
    durationOptions: [
      { label: '全部', value: '' },
      { label: '3天内', value: 'short' },
      { label: '1周内', value: 'week' },
      { label: '长期', value: 'long' }
    ]
  },

  onLoad() {
    this.loadPackages()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, packages: this.data.packages, noMore: true })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  async loadPackages() {
    if (this.data.loading) return
    this.setData({ loading: true })
    
    try {
      const { page, pageSize, activeBudget, activeDuration } = this.data
      const params = { page, pageSize, budgetLevel: activeBudget, duration: activeDuration }
      const data = await api.packages.getList(params)
      if (data && data.list) {
        this.setData({ packages: data.list })
      }
      const app = getApp()
      app.trackEvent && app.trackEvent('view_package_list', { budget: activeBudget, duration: activeDuration })
    } catch (error) {
      console.log('使用本地数据')
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearch() {
    navigateTo('/pages/search/index?type=package')
  },

  onFilterBudget(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeBudget: value })
    this.loadPackages()
  },

  onFilterDuration(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeDuration: value })
    this.loadPackages()
  },

  onPackageDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/packages/detail/index?id=${id}`)
  }
})