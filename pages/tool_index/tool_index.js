//index.js
//获取应用实例
import { ApiTest } from '../../common/api/testNet.js'
import { cloneDeep } from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    msgPowerShow: false,
    companyInfo: '',
    powerArray: [],
    option: '',
    hasSave: false,
    indexInfo: '',
    isGuide: false,
    guide:{
      guideStatus: '1',
      type: 'leave',
      clickLeft: '',
      clickBottom: ''
    }
  },
  onShow: function () {
    if (this.data.option.mode === 'isGuide') {
      this.data.isGuide = true
    } else {
      this.data.isGuide = false
    }
    this.setData({
      isGuide: this.data.isGuide
    })
    // 更新用户信息
    app.globalData.updateUserInfo()
    //
    wx.showShareMenu()
    console.log(getCurrentPages())
    let option = this.data.option
    if (!this.data.isGuide) {
      wx.setStorageSync('companyId', option.companyId)
    }
    apiTest.getRoleIndexInfo({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: this.data.isGuide ? -1 : option.companyId,
      mode: this.data.isGuide ? 'guide': ''
    })
      .then((res) => {
        this.data.companyInfo = cloneDeep(res.companyInfo)
        this.setData({
          companyInfo: this.data.companyInfo
        })
        this.pushPower()
      })
    // 获取首页代办消息
    this.getIndexInfo()
    // // 查询草稿箱
    // this.searchDraft()  
    // 如果有引导，获取引导子组件
    if (this.data.isGuide) {
      this.setGuide()
    }
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '工作台'
    })
    this.setData({
      option: option
    })
  },
  setGuide: function () {
    this.guide = this.selectComponent("#gudie-wrap")
    if (this.data.guide.guideStatus == 1) {
      this.guide.startSpeaking('你好！我是阿离，麻烦你帮我办理一下离职手续，么么哒~')
      this.setData({
        'guide.clickLeft': '15%',
        'guide.clickBottom': '53%'
      })
    } else if (this.data.guide.guideStatus == 2) {
      this.guide.startSpeaking('辛苦啦！你已成功帮我办理了离职手续，接下来可以到"我的审批"里查看离职证明啦~')
      this.setData({
        'guide.clickLeft': '60%',
        'guide.clickBottom': '63%'
      })
    } else if (this.data.guide.guideStatus == 3) {
      this.guide.startSpeaking('阿通已经待入职了！现在想要了解阿通在上家公司的情况，就赶快点击"入职背调"吧！')
      this.setData({
        'guide.type': 'entry',
        'guide.clickLeft': '60%',
        'guide.clickBottom': '53%'
      })
    }
  },
  gotoGuide: function () {
    wx.redirectTo({
      url: '../guide_index/guide_index',
    })
  },
  getIndexInfo: function () {
    apiTest.getUserIndex({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: wx.getStorageSync('companyId')
    })
      .then((res) => {
        this.data.indexInfo = cloneDeep(res)
        this.setData({
          indexInfo: this.data.indexInfo
        })
      })
  },
  searchDraft: function () {
    apiTest.getDraftList({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: wx.getStorageSync('companyId')
    })
      .then((res) => {
        this.data.showList = cloneDeep(res.draftList)
        if (this.data.showList.length > 0) {
          this.setData({
            hasSave: true
          })
        } else {
          this.setData({
            hasSave: false
          })
        }
      })
  },
  pushPower: function () {
    this.data.powerArray = []
    let authorityData = cloneDeep(this.data.companyInfo.authorityList)
    wx.setStorageSync('authorityData', authorityData)
    this.data.companyInfo.authorityList.forEach((el, index) => {
      this.data.powerArray.push(el.authorityName)
    })
  },
  gotoMine: function (e) {
    wx.redirectTo({
      url: '../mine_index/mine_index',
    })
  },
  gotoShare: function () {
    this.checkPower('添加审批人')
      .then(() => {
        wx.navigateTo({
          url: '../share_page/share_page',
        })
      })
  },
  gotoDraft: function () {
    this.checkPower('开具离职证明')
      .then(() => {
        wx.navigateTo({
          url: '../draft_index/draft_index',
        })
      })
  },
  gotoCheck: function () {
    this.checkPower('入职办理')
      .then(() => {
        if (this.data.isGuide) {
          wx.navigateTo({
            url: '../search_departure/search_departure?mode=isGuide&companyId=' + wx.getStorageSync('companyId'),
          })
        } else {
          wx.navigateTo({
            url: '../search_departure/search_departure?companyId=' + wx.getStorageSync('companyId'),
          })
        }
      })
  },
  gotoCreate: function () {
    if (this.data.isGuide) {
      wx.navigateTo({
        url: '../create_departure/create_departure?mode=isGuide',
      })
    } else {
      this.checkPower('开具离职证明')
        .then(() => {
          wx.navigateTo({
            url: '../create_departure/create_departure',
          })
        })
    }
  },
  gotoChatList: function () {
    this.checkPower('背景调查')
      .then(() => {
        wx.navigateTo({
          url: '../enter_chat/enter_chat?companyId=' + wx.getStorageSync('companyId'),
        })
      })
  },
  gotoDepart: function () {
    if (this.data.isGuide) {
      wx.navigateTo({
        url: '../mine_audit/mine_audit?mode=isGuide',
      })
    } else {
      this.checkPower('我的审批')
        .then(() => {
          wx.navigateTo({
            url: '../mine_audit/mine_audit',
          })
        })
    }
  },
  gotoLook: function () {
    this.checkPower('离职分析')
      .then(() => {
        wx.navigateTo({
          url: '../departure_analyse/departure_analyse',
        })
      })
  },
  checkPower (power) {
    return new Promise ((resolve, reject) => {
      if (this.data.powerArray.indexOf(power) < 0) {
        wx.showToast({
          title: '无权限',
          icon: 'none',
          duration: 2000
        })
        reject()
      } else {
        resolve()
      }
    })
  },
  changeCompany: function () {
    wx.redirectTo({
      url: '../change_company/change_company',
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '离职通',
      path: '/pages/loading_index/loading_index',
      imageUrl: "./images/share.jpg",
      success: (res) => { }
    }
  },
})