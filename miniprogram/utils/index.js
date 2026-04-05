const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return '0'
  return price.toFixed(2)
}

const formatPriceRange = (min, max) => {
  if (min === max) return `¥${formatPrice(min)}`
  return `¥${formatPrice(min)} - ¥${formatPrice(max)}`
}

const formatDuration = (days) => {
  if (days < 7) return `${days}天`
  if (days < 30) return `${Math.floor(days / 7)}周`
  return `${Math.floor(days / 30)}个月`
}

const getStatusText = (status, type) => {
  const statusMap = {
    lead: {
      submitted: '已提交',
      contacted: '已联系',
      confirmed: '已确认',
      closed: '已完成',
      lost: '已取消'
    },
    event: {
      signed: '已报名',
      cancelled: '已取消',
      attended: '已参加'
    },
    post: {
      pending: '审核中',
      approved: '已发布',
      rejected: '已拒绝',
      offline: '已下线'
    },
    match: {
      sent: '已发送',
      accepted: '已接受',
      rejected: '已拒绝',
      closed: '已完成'
    },
    task: {
      applied: '已申请',
      approved: '已通过',
      rejected: '已拒绝',
      done: '已完成'
    }
  }
  return statusMap[type]?.[status] || status
}

const getStatusClass = (status) => {
  const successStatus = ['confirmed', 'attended', 'approved', 'accepted', 'done']
  const warningStatus = ['submitted', 'signed', 'pending', 'sent', 'applied', 'contacted']
  const dangerStatus = ['lost', 'rejected', 'cancelled']

  if (successStatus.includes(status)) return 'tag-success'
  if (warningStatus.includes(status)) return 'tag-warning'
  if (dangerStatus.includes(status)) return 'tag-default'
  return 'tag-default'
}

const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const throttle = (fn, delay = 300) => {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({ title, icon, duration })
}

const showLoading = (title = '加载中...') => {
  wx.showLoading({ title, mask: true })
}

const hideLoading = () => {
  wx.hideLoading()
}

const showConfirm = (content, title = '提示') => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) resolve(true)
        else resolve(false)
      },
      fail: reject
    })
  })
}

const navigateTo = (url) => {
  wx.navigateTo({ url })
}

const navigateBack = (delta = 1) => {
  wx.navigateBack({ delta })
}

const switchTab = (url) => {
  wx.switchTab({ url })
}

const checkLogin = () => {
  const app = getApp()
  if (!app.globalData.userInfo) {
    showConfirm('请先登录', '提示').then((confirm) => {
      if (confirm) {
        navigateTo('/pages/mine/index')
      }
    })
    return false
  }
  return true
}

const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: resolve,
      fail: reject
    })
  })
}

const openLocation = (latitude, longitude, name, address) => {
  wx.openLocation({
    latitude,
    longitude,
    name,
    address,
    scale: 16
  })
}

const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({ phoneNumber })
}

const copyText = (text) => {
  wx.setClipboardData({
    data: text,
    success: () => {
      showToast('已复制')
    }
  })
}

module.exports = {
  formatTime,
  formatDate,
  formatPrice,
  formatPriceRange,
  formatDuration,
  getStatusText,
  getStatusClass,
  debounce,
  throttle,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  navigateTo,
  navigateBack,
  switchTab,
  checkLogin,
  getLocation,
  openLocation,
  makePhoneCall,
  copyText
}
