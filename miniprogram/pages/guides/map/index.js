const api = require('../../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    longitude: 114.697,
    latitude: 23.746,
    scale: 14,
    activeType: '',
    showList: false,
    pois: [],
    markers: [],
    typeOptions: [
      { label: '全部', value: '' },
      { label: '联合办公', value: 'cowork' },
      { label: '住宿', value: 'stay' },
      { label: '餐饮', value: 'food' },
      { label: '医疗', value: 'medical' },
      { label: '交通', value: 'transport' }
    ]
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ activeType: options.type })
    }
    if (options.poiId) {
      this.loadPoiDetail(options.poiId)
    }
    this.getLocation()
    this.loadPois()
  },

  async getLocation() {
    try {
      const res = await wx.getLocation({ type: 'gcj02' })
      this.setData({
        longitude: res.longitude,
        latitude: res.latitude
      })
    } catch (error) {
      console.log('获取位置失败', error)
    }
  },

  async loadPois() {
    try {
      showLoading()
      const { activeType } = this.data
      const data = await api.guides.getPois({ type: activeType })
      const pois = data.list || []
      const markers = pois.map((poi, index) => ({
        id: poi.id,
        latitude: poi.latitude,
        longitude: poi.longitude,
        title: poi.name,
        iconPath: this.getMarkerIcon(poi.type),
        width: 32,
        height: 32
      }))

      this.setData({ pois, markers })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  getMarkerIcon(type) {
    const icons = {
      cowork: '/assets/icons/marker-cowork.png',
      stay: '/assets/icons/marker-stay.png',
      food: '/assets/icons/marker-food.png',
      medical: '/assets/icons/marker-medical.png',
      transport: '/assets/icons/marker-transport.png'
    }
    return icons[type] || '/assets/icons/marker-default.png'
  },

  onFilterType(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeType: value })
    this.loadPois()
  },

  onMarkerTap(e) {
    const markerId = e.detail.markerId
    const poi = this.data.pois.find(p => p.id === markerId)
    if (poi) {
      this.showPoiDetail(poi)
    }
  },

  onPoiDetail(e) {
    const id = e.currentTarget.dataset.id
    const poi = this.data.pois.find(p => p.id === id)
    if (poi) {
      this.showPoiDetail(poi)
    }
  },

  showPoiDetail(poi) {
    wx.showActionSheet({
      itemList: ['查看详情', '导航前往', '拨打电话'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.showPoiInfo(poi)
        } else if (res.tapIndex === 1) {
          wx.openLocation({
            latitude: poi.latitude,
            longitude: poi.longitude,
            name: poi.name,
            address: poi.address,
            scale: 16
          })
        } else if (res.tapIndex === 2 && poi.phone) {
          wx.makePhoneCall({ phoneNumber: poi.phone })
        }
      }
    })
  },

  showPoiInfo(poi) {
    wx.showModal({
      title: poi.name,
      content: `地址：${poi.address}\n电话：${poi.phone || '暂无'}\n营业时间：${poi.openHours || '暂无'}`,
      showCancel: false
    })
  },

  onRegionChange(e) {
    if (e.type === 'end') {
      const { longitude, latitude } = e.detail.centerLocation || {}
      if (longitude && latitude) {
        this.setData({ longitude, latitude })
      }
    }
  },

  onToggleList() {
    this.setData({ showList: !this.data.showList })
  },

  async loadPoiDetail(poiId) {
    try {
      const poi = await api.guides.getPoiDetail(poiId)
      this.setData({
        longitude: poi.longitude,
        latitude: poi.latitude,
        scale: 16
      })
    } catch (error) {
      console.log('加载点位详情失败', error)
    }
  }
})
