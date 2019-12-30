//index.js
//获取应用实例
import { ApiTest } from '../../common/api/testNet.js'
import { cloneDeep } from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    isOnlyStuff: false // 是否只有一家，且是员工
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    if (option.type && option.type === 'noOther') {
      this.setData({
        isOnlyStuff: true
      })
    }
  },
  gotoDepart: function () {
    wx.navigateTo({
      url: '../mine_departure/mine_departure',
    })
  },
  gotoTool: function () {
    wx.redirectTo({
      url: '../tool_index/tool_index?companyId=' + wx.getStorageSync('companyId'),
    })
  },
  changeCompany: function () {
    wx.redirectTo({
      url: '../change_company/change_company',
    })
  }
})
