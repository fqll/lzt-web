//index.js
//获取应用实例
import {
  ApiTest
} from '../../common/api/testNet.js'
import {
  cloneDeep
} from "../../utils/util.js"
var apiTest = new ApiTest
var Charts = require('../../common/js/wxcharts.js')
const app = getApp()

Page({
  data: {
    canScroll: true,
    isShow: false,
    ratioData: '',
    num: '',
    tabs: [{
      id: 'reason',
      name: '离职原因分析'
    }, {
      id: 'ratio',
      name: '离职率分析'
    }, {
      id: 'stock',
      name: '离职员工库'
    }],
    activeId: 'reason',
    listData: '', // 离职员工库
    peopleNum: '',
    startTime: '',
    input: ''
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '离职分析'
    })
    this.drawCircle()
  },
  getRate: function() {
    apiTest.getDepartureRate({
        companyId: wx.getStorageSync('companyId')
      })
      .then((res) => {
        this.data.ratioData = cloneDeep(res)
        this.setData({
          ratioData: this.data.ratioData
        })
        let values = [],
          categories = []
        this.data.ratioData.monthDepartureRateList.forEach((el, index) => {
          let month = el.monthValue.split('-')[1]
          categories.push(month + '月')
          values.push(el.monthDepartureRate)
        })
        this.drawColumn(categories, values)
      })
  },
  changeNum: function() {
    this.setData({
      isShow: true,
      num: this.data.ratioData.incumbentsCount
    })
  },
  cancelInput: function() {
    this.setData({
      isShow: false
    })
    this.getRate()
  },
  getNum: function(e) {
    this.setData({
      isShow: false
    })
    let num = e.detail
    if (num > 0) {
      apiTest.updateIncumbentsCount({
          companyId: wx.getStorageSync('companyId'),
          userId: app.globalData.userInfo.userInfo.id,
          incumbentsCount: num
        })
        .then((res) => {
          wx.showToast({
            title: '更改成功!',
            duration: 1000
          })
          setTimeout(() => {
            this.getRate()
          }, 1000)
        })
    } else {
      wx.showToast({
        title: '人数至少一人',
        icon: 'none',
        duration: 1000
      })
      this.getRate()
    }
  },
  changetab: function(e) {
    this.setData({
      activeId: e.detail
    })
    if (this.data.activeId === 'reason') {
      this.drawCircle()
    } else if (this.data.activeId === 'ratio') {
      this.getRate()
    } else if (this.data.activeId === 'stock') {
      this.getList()
    }
    // this.getList(e.detail)
  },
  drawColumn: function(categories, values) {
    new Charts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: categories,
      series: [{
        name: '离职率',
        data: values,
        format: function(val, name) {
          return val.toFixed(2) + '%';
        }
      }],
      yAxis: {
        format: function(val) {
          return val + '%';
        },
        title: '',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: 440,
      height: 450,
    })
  },
  drawCircle: function() {
    apiTest.getDepartureReasonInfo({
        companyId: wx.getStorageSync('companyId')
      })
      .then((res) => {
        let departureReasonInfo = cloneDeep(res.departureReasonInfo)
        let departureCpmpanyInfo = cloneDeep(res.companyDepartureReasonInfo)
        this.doDrawingCircle('reason-company', departureCpmpanyInfo)
        this.doDrawingCircle('reason-self', departureReasonInfo)
        // 获取饼状图配置
      })
  },
  doDrawingCircle: function (obj, data) {
    let departureReasonInfo = cloneDeep(data)
    let dataArr = []
    let hasData = false
    var colorList = []
    departureReasonInfo.forEach((el, index) => {
      if (el.departureCount > 0) {
        hasData = true
      }
      let r = Math.random() * 200 + 100
      let g = Math.random() * 200 + 100
      let b = Math.random() * 200 + 100
      let rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
      while (colorList.indexOf(rgb) > 0) {
        r = Math.floor(Math.random() * 200 + 100);
        g = Math.floor(Math.random() * 200 + 100);
        b = Math.floor(Math.random() * 200 + 100);
        rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
      }
      colorList.push(rgb)
      dataArr.push({
        name: el.personalDepartureReason,
        data: el.departureCount,
        color: rgb
      })
    })
    if (!hasData) {
      dataArr.push({
        name: '无',
        data: 100
      })
    }
    new Charts({
      canvasId: obj,
      type: 'pie',
      series: dataArr,
      width: 260,
      height: 300,
      dataLabel: true
    })
  },
  // 离职员工库
  getList: function (nickName) {
    apiTest.getQuitEmployeeList({
      companyId: wx.getStorageSync('companyId'),
      nickName: nickName ? nickName : ''
    })
      .then((res) => {
        this.data.listData = cloneDeep(res.quitEmployeeList)
        if (!nickName) {
          this.setData({
            peopleNum: this.data.listData.length,
            startTime: res.sinceTime
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