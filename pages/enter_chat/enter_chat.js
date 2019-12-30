//index.js
//获取应用实例
import {
  ApiTest
} from "../../common/api/testNet.js"
import {
  cloneDeep
} from "../../utils/util.js"

var apiTest = new ApiTest
const app = getApp()

Page({
  data: {
    option: '',
    keyWords: '',
    keyWords: '',
    userId: '',
    companyId: '',
    entryList: [],
    tabs: [{
      id: 'start',
      name: '发起背调'
    }, {
      id: 'receive',
      name: '接收背调'
    }],
    activeId: 'start',
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '入职背调'
    })
    //
    this.setData({
      option: option
    })
  },
  searchPeople: function() {
    this.getList(this.data.activeId, this.data.keyWords)
  },
  onPullDownRefresh: function () {
    this.getList(this.data.activeId)
  },
  onShow: function() {
    this.setData({
      activeId: this.data.activeId
    })
    this.data.companyId = this.data.option.companyId
    if (this.data.option.activeId) {
      this.setData({
        activeId: this.data.option.activeId
      })
    }
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.data.userId = userInfo.userInfo.id
    this.getList(this.data.activeId)
  },
  changetab: function(e) {
    this.setData({
      activeId: e.detail
    })
    this.getList(this.data.activeId)
  },
  gotoChat: function(e) {
    wx.navigateTo({
      url: '../chat/chat?departureId=' + e.currentTarget.dataset.id + '&nameCanSee=show',
    })
  },
  getList: function(id, keyWords) {
    apiTest.getEmployeeCheckList({
        userId: this.data.userId,
        type: id == 'start' ? 0 : 1,
        companyId: this.data.companyId
      })
      .then((res) => {
        this.data.entryList = cloneDeep(res)
        console.log(res)
        this.setData({
          entryList: this.data.entryList
        })
      })
  },
  keyWordsInput: function(e) {
    this.data.keyWords = e.detail.value
  },
  searchDeparture: function() {

  },
  lookDetail: function(e) {
    let id = e.currentTarget.dataset.id
    if (this.data.activeId === 'start') {
      wx.navigateTo({
        url: '../chat/chat?departureId=' + e.currentTarget.dataset.id + '&nameCanSee=show',
      })
    } else {
      wx.navigateTo({
        url: '../chat/chat?departureId=' + e.currentTarget.dataset.id,
      })
    }
  }
})