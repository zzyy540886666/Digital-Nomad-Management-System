const api = require('../../../api/index')
const { showToast, navigateBack, showLoading, hideLoading, showConfirm } = require('../../../utils/index')

Page({
  data: {
    profile: {
      nickname: '',
      cityFrom: '',
      workType: 'remote',
      skills: [],
      interests: []
    },
    workTypeIndex: 0,
    workTypeOptions: [
      { label: '远程办公', value: 'remote' },
      { label: '创作者', value: 'creator' },
      { label: '自由职业', value: 'freelance' },
      { label: '其他', value: 'other' }
    ],
    skillInput: '',
    interestInput: '',
    saving: false
  },

  onLoad() {
    this.loadProfile()
  },

  async loadProfile() {
    try {
      showLoading()
      const data = await api.auth.getMe()
      const workTypeIndex = this.data.workTypeOptions.findIndex(o => o.value === data.workType)
      this.setData({
        profile: {
          nickname: data.nickname || '',
          cityFrom: data.cityFrom || '',
          workType: data.workType || 'remote',
          skills: data.skills || [],
          interests: data.interests || []
        },
        workTypeIndex: workTypeIndex >= 0 ? workTypeIndex : 0
      })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  onNicknameChange(e) {
    this.setData({ 'profile.nickname': e.detail.value })
  },

  onCityChange(e) {
    this.setData({ 'profile.cityFrom': e.detail.value })
  },

  onWorkTypeChange(e) {
    const index = e.detail.value
    this.setData({
      workTypeIndex: index,
      'profile.workType': this.data.workTypeOptions[index].value
    })
  },

  onSkillInput(e) {
    this.setData({ skillInput: e.detail.value })
  },

  onAddSkill() {
    const { skillInput, profile } = this.data
    if (!skillInput.trim()) return
    if (profile.skills.length >= 10) {
      showToast('最多添加10个技能标签')
      return
    }
    if (profile.skills.includes(skillInput.trim())) {
      showToast('标签已存在')
      return
    }
    this.setData({
      'profile.skills': [...profile.skills, skillInput.trim()],
      skillInput: ''
    })
  },

  onRemoveSkill(e) {
    const index = e.currentTarget.dataset.index
    const skills = this.data.profile.skills.filter((_, i) => i !== index)
    this.setData({ 'profile.skills': skills })
  },

  onInterestInput(e) {
    this.setData({ interestInput: e.detail.value })
  },

  onAddInterest() {
    const { interestInput, profile } = this.data
    if (!interestInput.trim()) return
    if (profile.interests.length >= 10) {
      showToast('最多添加10个兴趣标签')
      return
    }
    if (profile.interests.includes(interestInput.trim())) {
      showToast('标签已存在')
      return
    }
    this.setData({
      'profile.interests': [...profile.interests, interestInput.trim()],
      interestInput: ''
    })
  },

  onRemoveInterest(e) {
    const index = e.currentTarget.dataset.index
    const interests = this.data.profile.interests.filter((_, i) => i !== index)
    this.setData({ 'profile.interests': interests })
  },

  onPrivacy() {
    showToast('隐私设置功能开发中')
  },

  onNotification() {
    showToast('通知设置功能开发中')
  },

  async onLogout() {
    const confirm = await showConfirm('确定要退出登录吗？')
    if (confirm) {
      wx.removeStorageSync('token')
      wx.removeStorageSync('userInfo')
      const app = getApp()
      app.globalData.userInfo = null
      app.globalData.token = null
      showToast('已退出登录')
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mine/index' })
      }, 1500)
    }
  },

  async onSave() {
    if (this.data.saving) return

    this.setData({ saving: true })

    try {
      showLoading('保存中...')
      await api.auth.updateProfile(this.data.profile)

      const app = getApp()
      app.trackEvent('complete_profile')

      showToast('保存成功')
      setTimeout(() => {
        navigateBack()
      }, 1500)
    } catch (error) {
      showToast('保存失败，请重试')
    } finally {
      hideLoading()
      this.setData({ saving: false })
    }
  }
})
