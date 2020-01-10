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
    companyList: [],
    nowCompanyId: ''
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '企业列表'
    })
    this.setData({
      nowCompanyId: wx.getStorageSync('companyId')
    })
    this.getList()
  },
  onPullDownRefresh: function() {
    this.getList()
  },
  pageBack: function() {
    console.log('返回')
    wx.redirectTo({
      url: '../tool_index/tool_index?companyId=' + wx.getStorageSync('companyId'),
    })
  },
  getList: function() {
    return new Promise((resolve, reject) => {
      // 获取会员信息
      apiTest.getUserInfo({
          openId: wx.getStorageSync('openId'),
          portraitUrl: ''
        })
        .then((res) => {
          wx.setStorageSync('userInfo', JSON.stringify(res))
          let userInfo = cloneDeep(res)
          this.data.companyList = cloneDeep(userInfo.companyInfoList)
          this.setData({
            companyList: this.data.companyList
          })
          resolve()
        })
    })
  },
  changeCompany: function(e) {
    let id = e.currentTarget.dataset.companyid
    wx.setStorageSync('companyId', id)
    app.globalData.findGoCompany(id, 'redirectTo')
  },
  setMain: function(e) {
    let id = e.currentTarget.dataset.companyid
    apiTest.setDefault({
        companyId: id,
        userId: app.globalData.userInfo.userInfo.id
      })
      .then((res) => {
        this.getList()
          .then(() => {
            wx.showToast({
              title: '设置成功!',
              duration: 1000
            })
          })
      })
  },
  gotoTool: function() {
    wx.redirectTo({
      url: '../tool_index/tool_index?companyId=' + wx.getStorageSync('companyId'),
    })
  },
  gotoMine: function() {
    wx.redirectTo({
      url: '../mine_index/mine_index',
    })
  },
  gotoContact: function() {
    wx.redirectTo({
      url: '../contact_index/contact_index?prepage=changecompany',
    })
  },
  gotoCreate: function() {
    wx.redirectTo({
      url: '../create_company/create_company?prepage=changecompany',
    })
  }
})