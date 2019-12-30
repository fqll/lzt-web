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
    codeData: '',
    shareCode: '',
    companyInfo: {
      id: '',
      name: ''
    },
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '其他邀请方式'
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.asks()
      .then(() => {
        wx.hideLoading()
      })
  },
  asks: function () {
    let ask1 = false,
      ask2 = false
    return new Promise((resolve, reject) => {
      apiTest.getCompanyInfo({
        companyId: wx.getStorageSync('companyId')
      })
        .then((res) => {
          ask1 = true
          if (ask2) {
            resolve()
          }
          this.setData({
            'companyInfo.id': res.companyInfo.id,
            'companyInfo.name': res.companyInfo.companyName,
            shareCode: res.shareCode
          })
        })
      apiTest.getCompanyImage({
        companyId: wx.getStorageSync('companyId')
      })
        .then((res) => {
          ask2 = true
          if (ask1) {
            resolve()
          }
          let codeData = res.data
          this.setData({
            codeData: wx.arrayBufferToBase64(codeData)
          })
        })
    })
  },
  onShareAppMessage: function (res) {
    let that = this
    console.log(res)
    if (res.from === 'button') {
      if (this.data.activeId === 'dup') {
        return {
          title: '邀请您加入' + that.data.companyInfo.name + '公司',
          path: '/pages/join_company/join_company?companyid=' + this.data.companyInfo.id + '&companyname=' + this.data.companyInfo.name,
          imageUrl: "",
          success: (res) => {
            console.log(res)
          }
        }
      } else {
        console.log(res.target.dataset.name)
        return {
          title: '邀请加入' + that.data.companyInfo.name + '公司',
          path: '/pages/join_company/join_company?name=' + res.target.dataset.name + '&companyid=' + this.data.companyInfo.id + '&companyname=' + this.data.companyInfo.name,
          imageUrl: "",
          success: (res) => {
            console.log(res)
          }
        }
      }
    }
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }
})