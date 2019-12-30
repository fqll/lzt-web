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
    departureId: '',
    opinions: ''
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '审核意见'
    })
    this.data.departureId = option.departureid
  },
  textInput: function (e) {
    this.data.opinions = e.detail.value
  },
  rejectDepart: function () {
    apiTest.auditDeparture({
      userId: app.globalData.userInfo.userInfo.id,
      departureId: this.data.departureId,
      auditResult: 0,
      auditOpinions: this.data.opinions
    })
      .then((res) => {
        wx.showToast({
          title: '已拒绝',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)
      })
  }
})