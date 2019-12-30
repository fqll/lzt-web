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
    showList: []
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '用户指南'
    })
  },
  onShow: function () {
  },
  gotoContact: function () {
    wx.redirectTo({
      url: '../contact_index/contact_index',
    })
  }
})