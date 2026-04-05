const api = require('../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../utils/index')

Page({
  data: {
    guides: [
      { id: 1, type: 'network', name: '网络通讯', description: 'WiFi、移动网络、通讯方式' },
      { id: 2, type: 'transport', name: '交通出行', description: '机场、高铁、公交、打车' },
      { id: 3, type: 'medical', name: '医疗健康', description: '医院、药店、急救中心' },
      { id: 4, type: 'food', name: '餐饮美食', description: '特色美食、餐厅推荐' },
      { id: 5, type: 'cowork', name: '联合办公', description: '共享工位、会议室' },
      { id: 6, type: 'stay', name: '住宿推荐', description: '酒店、民宿、长租公寓' }
    ],
    showChat: false,
    messages: [],
    inputValue: '',
    scrollToView: ''
  },

  onLoad(options) {
    if (options.showChat === 'true') {
      this.setData({ showChat: true })
    }
  },

  onGuideDetail(e) {
    const type = e.currentTarget.dataset.type
    navigateTo(`/pages/guides/map/index?type=${type}`)
  },

  onOpenMap() {
    navigateTo('/pages/guides/map/index')
  },

  onOpenChat() {
    this.setData({ showChat: true })
  },

  onCloseChat() {
    this.setData({ showChat: false })
  },

  preventMove() {},

  onInputChange(e) {
    this.setData({ inputValue: e.detail.value })
  },

  async onSend() {
    const { inputValue, messages } = this.data
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim()
    }

    this.setData({
      messages: [...messages, userMessage],
      inputValue: '',
      scrollToView: `msg-${messages.length}`
    })

    try {
      showLoading('思考中...')
      const app = getApp()
      const context = { city: app.globalData.city }
      const data = await api.ai.guideChat(userMessage.content, context)

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        citations: data.citations || []
      }

      this.setData({
        messages: [...this.data.messages, assistantMessage],
        scrollToView: `msg-${this.data.messages.length}`
      })
    } catch (error) {
      showToast('抱歉，出了点问题，请稍后再试')
    } finally {
      hideLoading()
    }
  },

  onCitationTap(e) {
    const citation = e.currentTarget.dataset.citation
    if (citation.type === 'poi') {
      navigateTo(`/pages/guides/map/index?poiId=${citation.id}`)
    } else if (citation.type === 'event') {
      navigateTo(`/pages/events/detail/index?id=${citation.id}`)
    }
  }
})
