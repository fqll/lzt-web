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
      this.triggerEvent('backevent')
    },
  }
})