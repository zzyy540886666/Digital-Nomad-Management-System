const api = require('../../services/api.js');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    stats: {
      leads: 0,
      signups: 0,
      posts: 0
    }
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    // Refresh stats if logged in
    if (this.data.isLoggedIn) {
      this.loadStats();
    }
  },
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo
      });
      this.loadStats();
    }
  },
  handleLogin() {
    if (this.data.isLoggedIn) return;

    wx.showLoading({ title: '登录中...' });
    
    // Simulate wx.login
    setTimeout(() => {
      api.login('mock-code').then(res => {
        wx.hideLoading();
        wx.setStorageSync('token', res.token);
        wx.setStorageSync('userInfo', res.userInfo);
        
        this.setData({
          isLoggedIn: true,
          userInfo: res.userInfo
        });
        
        wx.showToast({ title: '登录成功' });
        this.loadStats();
      }).catch(() => {
        wx.hideLoading();
        wx.showToast({ title: '登录失败', icon: 'none' });
      });
    }, 1000);
  },
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          this.setData({
            isLoggedIn: false,
            userInfo: null,
            stats: { leads: 0, signups: 0, posts: 0 }
          });
        }
      }
    });
  },
  loadStats() {
    // Mock loading user stats
    this.setData({
      stats: {
        leads: 2,
        signups: 3,
        posts: 1
      }
    });
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      if (!this.data.isLoggedIn) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      wx.navigateTo({ url });
    }
  }
});
