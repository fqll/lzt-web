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
      title: '欢迎使用离职通'
    })
  },
  onShow: function () {
  },
  gotoContact: function() {
    wx.showModal({
      title: '',
      content: '确认跳过用户指南吗？',
      success(res) {
        if (res.confirm) {
          let companyId = wx.getStorageSync('companyId') ? wx.getStorageSync('companyId') : ''
          app.globalData.findGoCompany(companyId, 'guideJump')
        } else if (res.cancel) {

        }
      }
    })
  },
  gotoDetail: function () {
    wx.redirectTo({
      url: '../tool_index/tool_index?mode=isGuide',
    })
  }
})