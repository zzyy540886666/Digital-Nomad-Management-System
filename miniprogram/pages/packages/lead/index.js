const api = require('../../../api/index')
const { showToast, navigateBack, showLoading, hideLoading } = require('../../../utils/index')

Page({
  data: {
    packageId: '',
    today: '',
    form: {
      arrivalDate: '',
      stayDays: 7,
      peopleCount: 1,
      budgetLevel: 'medium',
      workType: 'remote',
      contactPhone: '',
      note: ''
    },
    durationIndex: 1,
    budgetIndex: 1,
    workTypeIndex: 0,
    durationOptions: [
      { label: '3天内', value: 3 },
      { label: '1周', value: 7 },
      { label: '2周', value: 14 },
      { label: '1个月', value: 30 },
      { label: '长期', value: 90 }
    ],
    budgetOptions: [
      { label: '经济型', value: 'low' },
      { label: '舒适型', value: 'medium' },
      { label: '品质型', value: 'high' }
    ],
    workTypeOptions: [
      { label: '远程办公', value: 'remote' },
      { label: '创作者', value: 'creator' },
      { label: '自由职业', value: 'freelance' },
      { label: '其他', value: 'other' }
    ],
    submitting: false
  },

  onLoad(options) {
    const today = new Date()
    const dateStr = this.formatDate(today)
    this.setData({ 
      packageId: options.id,
      today: dateStr,
      'form.arrivalDate': dateStr
    })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  onDateChange(e) {
    this.setData({ 'form.arrivalDate': e.detail.value })
  },

  onDurationChange(e) {
    const index = e.detail.value
    this.setData({ 
      durationIndex: index,
      'form.stayDays': this.data.durationOptions[index].value
    })
  },

  onPeopleChange(e) {
    this.setData({ 'form.peopleCount': parseInt(e.detail.value) || 1 })
  },

  onBudgetChange(e) {
    const index = e.detail.value
    this.setData({ 
      budgetIndex: index,
      'form.budgetLevel': this.data.budgetOptions[index].value
    })
  },

  onWorkTypeChange(e) {
    const index = e.detail.value
    this.setData({ 
      workTypeIndex: index,
      'form.workType': this.data.workTypeOptions[index].value
    })
  },

  onPhoneChange(e) {
    this.setData({ 'form.contactPhone': e.detail.value })
  },

  onNoteChange(e) {
    this.setData({ 'form.note': e.detail.value })
  },

  validateForm() {
    const { form } = this.data
    if (!form.arrivalDate) {
      showToast('请选择到达日期')
      return false
    }
    if (!form.contactPhone) {
      showToast('请输入联系电话')
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(form.contactPhone)) {
      showToast('请输入正确的手机号')
      return false
    }
    return true
  },

  async onSubmit() {
    if (!this.validateForm()) return
    if (this.data.submitting) return

    this.setData({ submitting: true })

    try {
      showLoading('提交中...')
      await api.packages.submitLead({
        packageId: this.data.packageId,
        ...this.data.form
      })

      const app = getApp()
      app.trackEvent('submit_package_lead', { packageId: this.data.packageId })

      wx.showModal({
        title: '提交成功',
        content: '您的意向已提交，我们的工作人员将在24小时内与您联系。',
        showCancel: false,
        success: () => {
          navigateBack()
        }
      })
    } catch (error) {
      showToast(error.message || '提交失败，请重试')
    } finally {
      hideLoading()
      this.setData({ submitting: false })
    }
  }
})
