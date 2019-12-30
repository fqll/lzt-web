//app.js
import {
  wxAuthorize,
  wxLogin
} from './common/js/login.js'
import {
  appId
} from "./config/config.js"
// 测试请求接口
import {
  ApiTest
} from "./common/api/testNet.js"
import {
  cloneDeep
} from "./utils/util.js"

var apiTest = new ApiTest()

App({
  onLaunch: function() {
    wx.clearStorageSync('userInfo')
    this.globalData.getUserInfo(true)
      .then(() => {

      })
  },
  globalData: {
    userInfo: {},
    updateUserInfo: function () {
      return new Promise((resolve, reject) => {
        // 获取会员信息
        apiTest.getUserInfo({
          openId: wx.getStorageSync('openId')
        })
          .then((res) => {
            this.userInfo = cloneDeep(res)
            wx.setStorageSync('userInfo', JSON.stringify(res))
            resolve()
          })
      })
    },
    onlyGetUserInfo: function (url) {
      return new Promise((resolve, reject) => {
        apiTest.getUserInfo({
          openId: wx.getStorageSync('openId'),
          portraitUrl: url ? url : ''
        })
          .then((ress) => {
            this.userInfo = cloneDeep(ress)
            wx.setStorageSync('userInfo', JSON.stringify(ress))
            resolve()
          })
      })
    },
    getUserInfo: function(mustLoad, url) {
      return new Promise((resolve, reject) => {
        if (!(wx.getStorageSync('userInfo') && wx.getStorageSync('openId')) || mustLoad) {
          // 登陆
          wxLogin()
            .then((wxCode) => {
              // test
              apiTest.getOpenId({
                  appId: appId,
                  jsCode: wxCode
                })
                .then((res) => {
                  wx.setStorageSync('openId', res)
                  // 获取会员信息
                  apiTest.getUserInfo({
                      openId: wx.getStorageSync('openId'),
                      portraitUrl: url ? url : ''
                    })
                    .then((ress) => {
                      this.userInfo = cloneDeep(ress)
                      wx.setStorageSync('userInfo', JSON.stringify(ress))
                      resolve()
                    })
                })
            })
        } else {
          let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
          this.userInfo = cloneDeep(userInfo)
          resolve()
        }
      })
    },
    // 根据企业id进入不同的地方
    findGoCompany: function(changeId, type) {
      let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      let user = cloneDeep(userInfo)
      console.log(user)
      if (user.companyInfoList && user.companyInfoList.length > 0) {
        // 找到主企业，默认进这个
        let mainId = ''
        user.companyInfoList.forEach((el, index) => {
          if (el.isDefault > 0) {
            mainId = el.companyId
          }
        })
        // 如果是切换企业，需进切换企业id，则替换一下，否则进mainid企业
        if (changeId) {
          mainId = changeId
        }
        if (!mainId) {
          mainId = user.companyInfoList[0].companyId
        }
        wx.redirectTo({
          url: '../tool_index/tool_index?companyId=' + mainId,
        })
      } else {
        if (type && type === 'guideJump') {
          wx.redirectTo({
            url: '../contact_index/contact_index',
          })
        } else {
          // wx.redirectTo({
          //   url: '../guide_index/guide_index',
          // })
          wx.redirectTo({
            url: '../contact_index/contact_index',
          })
        }
      }
    },
    // 获取认证的用户头像信息
    getAuthUserInfo: function() {
      return new Promise((resolve, reject) => {
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.userInfo['wxInfo'] = {}
                  for (let key in res.userInfo) {
                    this.userInfo['wxInfo'][key] = res.userInfo[key]
                  }
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                  resolve()
                }
              })
            } else {
              reject();
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  console.log('success')
                }
              })
            }
          }
        })
      })
    }
  }
})