const api = require('../../../api/index')
const { showToast, navigateBack, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    form: {
      type: 'offer',
      title: '',
      content: '',
      tags: [],
      rewardType: 'swap',
      availableTime: ''
    },
    tagInput: '',
    submitting: false
  },

  onSelectType(e) {
    this.setData({ 'form.type': e.currentTarget.dataset.type })
  },

  onTitleChange(e) {
    this.setData({ 'form.title': e.detail.value })
  },

  onContentChange(e) {
    this.setData({ 'form.content': e.detail.value })
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value })
  },

  onAddTag() {
    const { tagInput, form } = this.data
    if (!tagInput.trim()) return
    if (form.tags.length >= 5) {
      showToast('最多添加5个标签')
      return
    }
    if (form.tags.includes(tagInput.trim())) {
      showToast('标签已存在')
      return
    }
    this.setData({
      'form.tags': [...form.tags, tagInput.trim()],
      tagInput: ''
    })
  },

  onRemoveTag(e) {
    const index = e.currentTarget.dataset.index
    const tags = this.data.form.tags.filter((_, i) => i !== index)
    this.setData({ 'form.tags': tags })
  },

  onSelectReward(e) {
    this.setData({ 'form.rewardType': e.currentTarget.dataset.reward })
  },

  onTimeChange(e) {
    this.setData({ 'form.availableTime': e.detail.value })
  },

  validateForm() {
    const { form } = this.data
    if (!form.title.trim()) {
      showToast('请输入标题')
      return false
    }
    if (!form.content.trim()) {
      showToast('请输入详细描述')
      return false
    }
    if (form.tags.length === 0) {
      showToast('请添加至少一个技能标签')
      return false
    }
    return true
  },

  async onSubmit() {
    if (!this.validateForm()) return
    if (this.data.submitting) return

    this.setData({ submitting: true })

    try {
      showLoading('发布中...')
      await api.posts.create(this.data.form)

      const app = getApp()
      app.trackEvent('create_post', { type: this.data.form.type })

      wx.showModal({
        title: '发布成功',
        content: '您的发布已提交审核，审核通过后将展示在广场中。',
        showCancel: false,
        success: () => {
          navigateBack()
        }
      })
    } catch (error) {
      showToast(error.message || '发布失败，请重试')
    } finally {
      hideLoading()
      this.setData({ submitting: false })
    }
  }
})
