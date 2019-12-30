//index.js
//获取应用实例
import {
  ApiTest
} from '../../common/api/testNet.js'
import {
  cloneDeep
} from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    user: '',
    interval: ''
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '正在进入离职通'
    })
    // apiTest.getRoleList()
    //   .then((res) => {
    //     this.data.rolesData = cloneDeep(res)
    //     wx.setStorageSync('rolesData', this.data.rolesData)
    //   })
    let that = this
    this.data.interval = setInterval(function () {
      if (wx.getStorageSync('userInfo')) {
        clearInterval(that.data.interval)
        app.globalData.updateUserInfo()
          .then(() => {
            app.globalData.findGoCompany()
          })
      }
    }, 1000)
  }
})