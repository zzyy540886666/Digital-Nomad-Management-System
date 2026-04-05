Component({
  options: {
    multipleSlots: true
  },
  
  properties: {
    name: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      value: '48rpx'
    },
    height: {
      type: String,
      value: '48rpx'
    },
    color: {
      type: String,
      value: ''
    },
    className: {
      type: String,
      value: ''
    }
  },

  data: {
    iconSvg: ''
  },

  observers: {
    name: function(name) {
      if (name) {
        const icons = require('./svg-icons')
        this.setData({
          iconSvg: icons[name] || ''
        })
      }
    }
  },

  lifetimes: {
    attached: function() {
      if (this.data.name) {
        const icons = require('./svg-icons')
        this.setData({
          iconSvg: icons[this.data.name] || ''
        })
      }
    }
  },

  methods: {}
})
