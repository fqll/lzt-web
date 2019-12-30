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
    tabs: [{
      id: 'eff',
      name: '有效证明'
    }, {
      id: 'done',
      name: '已核验'
    }],
    activeId: 'eff',
    checkList: [],
    uncheckList: [],
    showList: []
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '我的离职证明'
    })
    this.getList('eff')
  },
  getList: function (type) {
    apiTest.getDepartureList({
      userId: app.globalData.userInfo.userInfo.id
    })
      .then((res) => {
        this.data.uncheckList = cloneDeep(res)
        this.setData({
          showList: this.data.uncheckList
        })
      })
  },
  gotoDetail: function (e) {
    wx.navigateTo({
      url: '../departure_detail/departure_detail?departureid=' + e.currentTarget.dataset.id + '&activetab=share',
    })
  },
  changetab: function(e) {
    console.log(e.detail)
    this.getList(e.detail)
  }
})