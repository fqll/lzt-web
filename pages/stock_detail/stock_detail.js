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
    infoData: ''
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '员工离职信息'
    })
    this.getDetail(option.id)
  },
  getDetail: function (id) {
    apiTest.getDepartureInfo({
      id: id,
      userId: app.globalData.userInfo.userInfo.id
    })
      .then((res) => {
        this.data.infoData = cloneDeep(res)
        this.setData({
          infoData: res
        })
      })
  }
})