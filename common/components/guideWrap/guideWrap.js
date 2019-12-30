const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: true
    },
    showTop: {
      type: Boolean,
      value: false
    },
    entryGuide: {
      type: Boolean,
      value: false
    },
    preEntry: {
      type: Boolean,
      value: false
    },
    exitBtn: {
      type: Boolean,
      value: false
    },
    entryBtn: {
      type: Boolean,
      value: false
    },
    clickBottom: {
      type: String,
      value: ''
    },
    clickLeft: {
      type: String,
      value: ''
    },
    clickShow: {
      type: Boolean,
      value: true
    },
    type: {
      type: String,
      value: 'leave'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    talkingWords: ' ',
    interval: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击黑色蒙版和取消
    //设置userInfo
    changeTab: function (e) {
      this.setData({
        activeId: e.currentTarget.dataset.id
      })
      this.triggerEvent('changetab', e.currentTarget.dataset.id)
    },
    gotoEntryGuide: function () {
      this.triggerEvent('gotoEntryGuide')
    },
    gotoPreEntry: function () {
      this.triggerEvent('gotoPreEntry')
    },
    jumpGuide: function () {
      wx.showModal({
        title: '',
        content: '确认退出引导吗？',
        success(res) {
          if (res.confirm) {
            let companyId = wx.getStorageSync('companyId') ? wx.getStorageSync('companyId') : ''
            app.globalData.findGoCompany(companyId, 'guideJump')
          } else if (res.cancel) {

          }
        }
      })
    },
    startSpeaking: function (words) {
      let that = this
      if (this.data.interval) {
        clearInterval(that.data.interval)
        that.data.interval = ''
      }
      var story = words;
      var i = 0;
      this.data.interval = setInterval(function () {
        var text = story.substring(0, i);
        i++;
        that.setData({
          talkingWords: text
        });
        if (text.length == story.length) {
          clearInterval(that.data.interval);
          that.data.interval = ''
        }
      }, 200)
    },
    doEntry: function () {
      this.triggerEvent('doEntry')
    },
    doExit: function () {
      this.triggerEvent('doExit')
    }
  }
})