Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        iconPath: '/assets/icons/home.svg',
        selectedIconPath: '/assets/icons/home-active.svg'
      },
      {
        pagePath: '/pages/packages/list/index',
        text: '产品包',
        iconPath: '/assets/icons/package.svg',
        selectedIconPath: '/assets/icons/package-active.svg'
      },
      {
        pagePath: '/pages/events/list/index',
        text: '活动',
        iconPath: '/assets/icons/event.svg',
        selectedIconPath: '/assets/icons/event-active.svg'
      },
      {
        pagePath: '/pages/skills/index',
        text: '技能',
        iconPath: '/assets/icons/skill.svg',
        selectedIconPath: '/assets/icons/skill-active.svg'
      },
      {
        pagePath: '/pages/mine/index',
        text: '我的',
        iconPath: '/assets/icons/mine.svg',
        selectedIconPath: '/assets/icons/mine-active.svg'
      }
    ]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})
