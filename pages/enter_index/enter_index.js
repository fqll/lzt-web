
import {cloneDeep} from "../../utils/util.js"
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: {},
    isShow: false
  },
  onShow: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    // 获取头像
    app.globalData.getAuthUserInfo()
      .then(() => {
        app.globalData.getUserInfo(true, app.globalData.userInfo.wxInfo.avatarUrl)
          .then(() => {
            wx.hideLoading()
            let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
            this.data.user = cloneDeep(userInfo)
            this.setData({
              user: this.data.user
            })
          })
          .catch(() => {
            wx.hideLoading()  
          })
      })
      .catch(() => {
        wx.hideLoading()  
        this.setData({
          isShow: true
        })
      })
  },
  onPullDownRefresh: function () {
    this.onShow()
  },
  onCloseModal: function (e) {
    this.setData({
      isShow: false
    })
    this.onShow()
  },
  joinCompany: function () {
    wx.navigateTo({
      url: '../search_company/search_company',
    })
  },
  gotoRoleIndex: function (e) {
    let role = e.currentTarget.dataset.role
    let id = e.currentTarget.dataset.id
    // 存储companyId,接下来的操作都是此company
    wx.setStorageSync('companyId', id)
    if (role !== '老板' && role !== '员工') {
      wx.navigateTo({
        url: '../hr_index/hr_index?id=' + id + '&role=' + role,
      })
    } else if (role === '老板') {
      wx.navigateTo({
        url: '../boss_index/boss_index?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../hr_index/hr_index?id=' + id + '&role=' + role,
      })
    }
  },
  createCompany: function () {
    wx.navigateTo({
      url: '../create_company/create_company',
    })
  }
})
