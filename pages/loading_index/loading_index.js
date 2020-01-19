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
    interval: '',
    isShow: false,
  },
  onLoad: function() {
    
  },
  getAvator: function () {
    // 获取头像
    app.globalData.getAuthUserInfo()
      .then((userRes) => {
        if (!userRes.userInfo.avatarUrl) {
          apiTest.completedUserInfo({
            userId: app.globalData.userInfo.userInfo.id,
            portraitUrl: app.globalData.userInfo.wxInfo.avatarUrl,
            nickName: app.globalData.userInfo.wxInfo.nickName
          })
            .then((res) => {

            })
            .catch((err) => {
              wx.showToast({
                title: '上传头像错误',
                icon: 'none',
                duration: 2000
              })
              this.setData({
                isShow: false
              })
            })
        }
        app.globalData.findGoCompany()
        // app.globalData.onlyGetUserInfo(app.globalData.userInfo.wxInfo.avatarUrl)
        //   .then(() => {
        //     wx.hideLoading()
        //     let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        //     this.data.user = cloneDeep(userInfo)
        //     this.setData({
        //       user: this.data.user
        //     })
        //     if (this.data.user.userInfo.portraitUrl) {
        //       this.setData({
        //         isDeafult: false
        //       })
        //     } else {
        //       this.setData({
        //         isDeafult: true
        //       })
        //     }
        //   })
        //   .catch(() => {
        //     wx.hideLoading()
        //   })
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({
          isShow: true
        })
      })
  },
  onCloseModal: function (e) {
    // this.onLoad(this.data.option)
    // 提交用户数据
    apiTest.completedUserInfo({
      userId: app.globalData.userInfo.userInfo.id,
      portraitUrl: app.globalData.userInfo.wxInfo.avatarUrl,
      nickName: app.globalData.userInfo.wxInfo.nickName
    })
      .then((res) => {
        this.setData({
          isShow: false
        })
        app.globalData.findGoCompany()
      })
      .catch((err) => {
        wx.showToast({
          title: '上传头像错误',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isShow: false
        })
        app.globalData.findGoCompany()
      })
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '正在进入离职通'
    })
    // apiTest.getRoleList()
    //   .then((res) => {
    //     this.data.rolesData = cloneDeep(res)
    //     wx.setStorageSync('rolesData', this.data.rolesData)
    //   })
    let that = this
    this.data.interval = setInterval(function() {
      if (wx.getStorageSync('userInfo')) {
        clearInterval(that.data.interval)
        app.globalData.updateUserInfo()
          .then(() => {
            // that.getAvator()
            app.globalData.findGoCompany()
          })
      }
    }, 1000)
  }
})