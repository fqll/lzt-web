//index.js
//获取应用实例
import { ApiTest } from '../../common/api/testNet.js'
import { cloneDeep } from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    keyWords: '',
    hasSearched: false,
    searhNone: false,
    companyList: [],
    prepage: ''
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '关联企业'
    })
    if (option.prepage) {
      this.setData({
        prepage: option.prepage
      })
    }
  },
  gotoCreate: function () {
    wx.redirectTo({
      url: '../create_company/create_company?prepage=contact',
    })
  },
  gotoAttend: function (e) {
    let index = e.currentTarget.dataset.index
    let companyName = this.data.companyList[index].companyName
    let companyId = this.data.companyList[index].id
    wx.redirectTo({
      url: '../join_company/join_company?companyid=' + companyId + '&companyname=' + companyName,
    })
  },
  keyWordsInput: function (e) {
    this.data.keyWords = e.detail.value
  },
  searchCompany: function () {
    if (this.data.keyWords) {
      apiTest.getSearchCompany({
        userId: app.globalData.userInfo.userInfo.id,
        keyWords: this.data.keyWords
      })
        .then((res) => {
          this.data.companyList = cloneDeep(res)
          this.setData({
            companyList: this.data.companyList
          })
          this.setData({
            hasSearched: true
          })
          if (this.data.companyList.length > 0) {
            this.setData({
              searhNone: false
            })
          } else {
            wx.showToast({
              title: '没有找到此企业哦，可立即注册',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              searhNone: true
            })
          }
        })
    } else {
      wx.showToast({
        title: '输入公司的邀请码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  pageBack: function () {
    console.log('返回')
    if (this.data.prepage === 'loading') {
      wx.redirectTo({
        url: '../loading_index/loading_index',
      })
    } else if (this.data.prepage === 'changecompany') {
      wx.redirectTo({
        url: '../change_company/change_company',
      })
    }
  }
})
