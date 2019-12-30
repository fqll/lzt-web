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
    listData: '',
    peopleNum: '',
    input: ''
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '离职员工库'
    })
    this.getList()
  },
  getList: function (nickName) {
    apiTest.getQuitEmployeeList({
      companyId: wx.getStorageSync('companyId'),
      nickName: nickName ? nickName: ''
    })
      .then((res) => {
        this.data.listData = cloneDeep(res)
        if (!nickName) {
          this.setData({
            peopleNum: this.data.listData.length
          })
        }
        this.setData({
          listData: this.data.listData
        })
      })
  },
  gotoDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../stock_detail/stock_detail?id=' + id,
    })
  },
  keyWordsInput: function (e) {
    let input = e.detail.value
    this.data.input = input
  },
  searchStock: function () {
    this.getList(this.data.input)
  }
})