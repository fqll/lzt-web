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
    guide: {
      clickLeft: '',
      clickBottom: ''
    },
    isGuide: false,
    keyWords: '',
    type: '',
    employees: []
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '选择审批人'
    })
    if (option.mode && option.mode === 'isGuide') {
      this.data.isGuide = true
    } else {
      this.data.isGuide = false
    }
    this.setData({
      isGuide: this.data.isGuide
    })
    if (this.data.isGuide) {
      this.setGuide()
    }
    this.data.type = option.type
    // 查询已加入的员工信息
    apiTest.getUserList({
        companyId: wx.getStorageSync('companyId'),
        mode: this.data.isGuide ? 'guide': '',
        auditStatus: 1,
        nickName: ''
      })
      .then((res) => {
        this.data.employees = cloneDeep(res)
        this.setData({
          employees: this.data.employees
        })
      })
  },
  setGuide: function () {
    this.guide = this.selectComponent("#gudie-wrap")
    this.guide.startSpeaking('请将你添加到审批人吧~')
    this.setData({
      'guide.clickLeft': '65%',
      'guide.clickBottom': '63%'
    })
  },
  keyWordsInput: function(e) {
    this.data.keyWords = e.detail.value
  },
  slelectPerson: function(e) {
    let pages = getCurrentPages() // 获取页面栈
    let currPage = pages[pages.length - 1] // 当前页面
    let prevPage = pages[pages.length - 2]
    let obj = cloneDeep(e.currentTarget.dataset.user)
    obj.type = this.data.type
    prevPage.selectDone(obj)
    wx.navigateBack({
      delta: 1
    })
  },
  searchCompany: function() {
    apiTest.getUserList({
        companyId: wx.getStorageSync('companyId'),
        auditStatus: 1,
        nickName: this.data.keyWords
      })
      .then((res) => {
        this.data.employees = cloneDeep(res)
        this.setData({
          employees: this.data.employees
        })
      })
  },
  gotoCreate: function() {
    wx.navigateTo({
      url: '../../pages/create_company/create_company',
    })
  }
})