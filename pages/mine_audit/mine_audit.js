//index.js
//获取应用实例
import {
  ApiTest
} from '../../common/api/testNet.js'
import {
  cloneDeep, colorBack
} from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    isGuide: false,
    guide: {
      guideStatus: '3', // 1为引导点击我发起的，2位引导点击进入分享, 3为点击去审批
      clickLeft: '',
      clickBottom: ''
    },
    tabs: [{
      id: 'wait',
      name: '待我审批',
      desc: '需要审批的流程'
    }, {
      id: 'done',
      name: '我已审批',
      desc: '查看已审批流程'
    }, {
      id: 'send',
      name: '我发起的',
      desc: '查看离职证明'
    }, {
      id: 'to',
      name: '抄送我的',
      desc: '需知晓的流程'
    }],
    activeId: 'wait',
    showList:[],
    authorityName: [],
    isBoss: false,
    redShow: [false,false,false,false],
    hightlight: [false, false, false, false], // 是否置于顶层高光
  },
  onLoad: function(option) {
    if (option && option.mode === 'isGuide') {
      this.data.isGuide = true
    } else {
      this.data.isGuide = false
    }
    this.setData({
      isGuide: this.data.isGuide
    })
  },
  onPullDownRefresh: function () {
    this.getList(this.data.activeId)
  },
  setGuide: function () {
    this.guide = this.selectComponent("#gudie-wrap")
    if (this.data.guide.guideStatus == 1) {
      this.guide.startSpeaking('棒棒哒！点击“我发起的”，就可以找到刚才给阿离办理的离职证明啦~')
      this.setData({
        'guide.clickLeft': '47%',
        'guide.clickBottom': '80%',
        hightlight: [false, false, true, false]
      })
    } else if (this.data.guide.guideStatus == 2) {
      this.guide.startSpeaking('很棒呢！你已经找到了，快点击进去分享给阿离吧~')
      this.setData({
        'guide.clickLeft': '35%',
        'guide.clickBottom': '60%',
        hightlight: [false, false, false, false]
      })
    } else if (this.data.guide.guideStatus == 3) {
      this.guide.startSpeaking('点击此处去审批阿离的离职~')
      this.setData({
        'guide.clickLeft': '35%',
        'guide.clickBottom': '60%',
        hightlight: [true, false, false, false]
      })
    }
  }, 
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的审批'
    })
    //
    if (this.data.isGuide) {
      this.setData({
        'guide.guideStatus': this.data.guide.guideStatus
      })
      this.setGuide()
    }
    // 恢复列表
    this.setData({
      activeId: this.data.activeId,
      redShow: [false, false, false, false]
    })
    // 
    this.getAuthorityName()
    this.getList(this.data.activeId)
      .then((res) => {
        if (res.auditInfo) {
          let audit = false
          res.auditInfo.forEach((el, index) => {
            if (el.readStatusDesc === '未读') {
              audit = true
            }
          })
          if (audit) {
            this.data.redShow[0] = true
          } else {
            this.data.redShow[0] = false
          }
        }
        if (res.copyInfo) {
          let copy = false
          res.copyInfo.forEach((el, index) => {
            if (el.readStatusDesc === '未读') {
              copy = true
            }
          })
          if (copy) {
            this.data.redShow[3] = true
          } else {
            this.data.redShow[3] = false
          }
        }
        this.setData({
          redShow: this.data.redShow
        })
      })
  },
  getAuthorityName: function () {
    app.globalData.userInfo.companyInfoList.forEach((el, index) => {
      if (el.companyId == wx.getStorageSync('companyId')) {
        this.setData({
          authorityName: el.authorityList
        })
      }
    })
    let powerArray = []
    this.data.authorityName.forEach((el, index) => {
      powerArray.push(el.authorityName)
    })
    if (!(powerArray.indexOf('我的审批') < 0)) {
      this.setData({
        isBoss: true
      })
    }
  },
  getList: function(type) {
    return new Promise((resolve, reject) => {
      apiTest.getAuditInfo({
        mode: this.data.isGuide ? 'guide': '',
        userId: app.globalData.userInfo.userInfo.id,
        companyId: wx.getStorageSync('companyId')
      })
        .then((res) => {
          if (type === 'wait') {
            this.setData({
              showList: res.auditInfo
            })
          } else if (type === 'done') {
            this.setData({
              showList: res.auditedInfo
            })
          } else if (type === 'send') {
            this.setData({
              showList: res.createdInfo
            })
          } else if (type === 'to') {
            this.setData({
              showList: res.copyInfo
            })
          }
          if (this.data.showList) {
            this.data.showList.forEach((el, index) => {
              el.color = colorBack(el.auditStatusDesc)
            })
          }
          this.setData({
            showList: this.data.showList
          })
          resolve(res)
        })
    })
  },
  changetab: function(e) {
    this.setData({
      activeId: e.detail
    })
    this.getList(e.detail)
      .then((res) => {
        if (res.auditInfo) {
          let audit = false
          res.auditInfo.forEach((el, index) => {
            if (el.readStatusDesc === '未读') {
              audit = true
            }
          })
          if (audit) {
            this.data.redShow[0] = true
          } else {
            this.data.redShow[0] = false
          }
        } 
        if (res.copyInfo) {
          let copy = false
          res.copyInfo.forEach((el, index) => {
            if (el.readStatusDesc === '未读') {
              copy = true
            }
          })
          if (copy) {
            this.data.redShow[3] = true
          } else {
            this.data.redShow[3] = false
          }
        }
        this.setData({
          redShow: this.data.redShow
        })

        // 如果是guide
        if (this.data.isGuide) {
          this.setData({
            'guide.guideStatus': '2'
          })
          this.setGuide()
        }
      })
  },
  gotoDetail: function (e) {
    if (this.data.isGuide) {
      if (this.data.activeId === 'wait') {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?departureid=' + e.currentTarget.dataset.departureid + '&activetab=' + this.data.activeId + '&mode=isGuide&guideStatus=5'
        })
      } else {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?departureid=' + e.currentTarget.dataset.departureid + '&activetab=' + this.data.activeId + '&mode=isGuide'
        }) 
      }
    } else {
      if (e.currentTarget.dataset.redcircle && e.currentTarget.dataset.redcircle === '未读') {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?departureid=' + e.currentTarget.dataset.departureid + '&activetab=' + this.data.activeId + '&setread=need'
        })
      } else {
        wx.navigateTo({
          url: '../departure_detail/departure_detail?departureid=' + e.currentTarget.dataset.departureid + '&activetab=' + this.data.activeId
        })
      } 
    }
  },
  setContact: function (e) {
    apiTest.doFollow({
      userId: app.globalData.userInfo.userInfo.id,
      departureId: e.currentTarget.dataset.departureid
    })
      .then((res) => {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 2000
        })
        this.data.showList[e.currentTarget.dataset.index].followStatus = true
        this.setData({
          showList: this.data.showList
        })
      })
  },
  gotoChat: function (e) {
    wx.navigateTo({
      url: '../chat/chat?departureId=' + e.currentTarget.dataset.departureid,
    })
  }
})