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
    guide: {
      type: 'entry',
      guideStatus: '1',
      clickLeft: '',
      clickBottom: '',
      clickShow: false
    },
    isGuide: false,
    keyWords: '',
    userId: '',
    companyId: '',
    entryList: [],
    tabs: [{
      id: 'will',
      name: '待入职',
      desc: '暂存待背调员工信息'
    }, {
      id: 'done',
      name: '已入职',
        desc: '查阅已入职员工'
    }],
    activeId: 'will',
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '入职办理'
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
    if (this.data.option.mode && this.data.option.mode === 'isGuide') {
      this.setData({
        isGuide: true,
        activeId: this.data.activeId
      })
      this.setGuide()
    } else {
      this.setData({
        isGuide: false,
        activeId: this.data.activeId
      })
    }
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
    if (this.data.isGuide) {
      wx.navigateTo({
        url: '../chat/chat?mode=isGuide&departureId=-1',
      })
    } else {
      wx.navigateTo({
        url: '../chat/chat?departureId=' + e.currentTarget.dataset.id + '&nameCanSee=show',
      })
    }
  },
  setGuide: function() {
    this.guide = this.selectComponent("#gudie-wrap")
    if (this.data.guide.guideStatus == 1) {
      this.guide.startSpeaking('很好！第一条数据就是我的待入职申请了，您可以点击"查看详情"或者"聊天"~')
      this.setData({
        'guide.clickLeft': '65%',
        'guide.clickBottom': '63%'
      })
    } else if (this.data.guide.guideStatus == 2) {
      this.setData({
        activeId: 'done'
      })
      this.getList(this.data.activeId)
      this.guide.startSpeaking('谢谢您！阿通已经加入到您的公司了，之后您可以随时在此处查看阿通过去的离职信息~')
      this.setData({
        'guide.clickLeft': '65%',
        'guide.clickBottom': '63%'
      })
    }
  },
  getList: function(id, keyWords) {
    // 查询待入职员工
    apiTest.getDelayEntry({
        userId: this.data.userId,
        type: id == 'will' ? 0 : 1,
        companyId: this.data.isGuide ? '-1' : this.data.companyId,
        mode: this.data.isGuide ? 'guide' : '',
        nickName: keyWords ? keyWords : ''
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
    // wx.navigateTo({
    //   url: '../del_departure/del_departure?formStatus=6&id=' + id + '&companyId=' + this.data.companyId,
    // })
    if (this.data.activeId === 'will') {
      if (this.data.isGuide) {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?guideStatus=3&mode=isGuide&activetab=join&departureid=' + id,
        })
      } else {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?activetab=join&departureid=' + id,
        })
      }
    } else {
      if (this.data.isGuide) {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?guideStatus=4&mode=isGuide&activetab=join&departureid=' + id + '&joindone=done',
        })
      } else {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?activetab=join&departureid=' + id + '&joindone=done',
        })
      }
    }
  }
})