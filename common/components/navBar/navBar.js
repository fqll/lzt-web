// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    lineShow: {
      type:Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function () {
      console.log(App.globalData.navHeight)
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      console.log('触发')
      this.triggerEvent('backevent')
    },
    gotohouse: function () {
      wx.redirectTo({
        url: '../loading_index/loading_index',
      })
    }
  }
})