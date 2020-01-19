//index.js
//获取应用实例
import { ApiTest } from '../../common/api/testNet.js'
import { cloneDeep } from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    companyId: '',
    joinName: '',
    companyName: '',
    option: '',
    isShow: false,
  },
  onShow: function () {
    let option = this.data.option
    wx.setNavigationBarTitle({
      title: '加入企业'
    })
    if (option.companyid && option.companyname) {
      // 此为微信程序分享
      this.setData({
        companyId: option.companyid,
        companyName: option.companyname,
        joinName: option.name
      })
    } else if (option.scene) {
      // 小程序扫图片码直接进
      let scene = decodeURIComponent(option.scene)
      console.log('获取到参数')
      console.log(scene)
      let array = scene.split('&')
      array.forEach((el, index) => {
        let array2 = el.split('=')
        if (array2[0] === 'id') {
          this.data.companyId = array2[1]
        }
      })
      apiTest.getCompanyInfo({
        companyId: this.data.companyId
      })
        .then((res) => {
          this.setData({
            companyId: this.data.companyId,
            companyName: res.companyInfo.companyName
          })
          console.log(this.data.companyName)
        })
    }
  },
  onLoad: function (option) {
    this.data.option = option
    // 
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
        app.globalData.onlyGetUserInfo(app.globalData.userInfo.wxInfo.avatarUrl)
          .then(() => {
            wx.hideLoading()
            let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
            this.data.user = cloneDeep(userInfo)
            this.setData({
              user: this.data.user
            })
            if (this.data.user.userInfo.portraitUrl) {
              this.setData({
                isDeafult: false
              })
            } else {
              this.setData({
                isDeafult: true
              })
            }
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
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    if (e.detail.value.name === '') {
       wx.showToast({
         title: '请输入',
         icon: 'none',
         duration: 2000
       })
    } else {
      apiTest.checkNameUnique({
        companyId: this.data.companyId,
        employeeId: app.globalData.userInfo.userInfo.id,
        nickName: e.detail.value.name
      })
        .then((res) => {
          if (res) {
            // 提交加入公司
            apiTest.postCompanyJoin({
              companyId: this.data.companyId,
              nickName: e.detail.value.name,
              userId: app.globalData.userInfo.userInfo.id
            })
              .then((res) => {
                wx.showToast({
                  title: '加入成功,等待审核!',
                  duration: 1000
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../contact_index/contact_index?prepage=loading',
                  })
                }, 1000)
              })
          } else {
            wx.showToast({
              title: '重名',
              icon: 'none',
              duration: 2000
            })
          }
        })
    }
  },
  formReset: function (e) {
    console.log(e)
  }
})