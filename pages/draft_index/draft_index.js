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
      title: '草稿箱'
    })
  },
  onPullDownRefresh: function () {
    this.getList()
  },
  onShow: function () {
    this.getList()
  },
  getList: function () {
    apiTest.getDraftList({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: wx.getStorageSync('companyId')
    })
      .then((res) => {
        this.data.showList = cloneDeep(res.draftList)
        this.setData({
          showList: this.data.showList
        })
      })
  },
  delDraft: function (e) {
    let that = this 
    wx.showModal({
      title: '',
      content: '确认删除此表单吗？',
      success(res) {
        if (res.confirm) {
          apiTest.deleteSave({
            id: e.currentTarget.dataset.id,
            userId: app.globalData.userInfo.userInfo.id,
            companyId: wx.getStorageSync('companyId')
          })
            .then((res) => {
              that.getList()
              wx.showToast({
                title: '删除成功',
                duration: 1000
              })
            })
        }
      }
    })
  },
  goonCreate: function (e) {
    wx.navigateTo({
      url: '../create_departure/create_departure?from=save&id=' + e.currentTarget.dataset.id,
    })
  }
})