
//index.js
//获取应用实例
import { ApiTest } from '../../common/api/testNet.js'
import { cloneDeep } from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    guide: {
      type: 'entry',
      clickLeft: '',
      clickBottom: '',
      clickShow: false
    },
    isGuide: false,
    user: '',
    option: '',
    departureId: '',
    chatData: '',
    msgContent: '',
    interval: '',
    firstPull: true,
    lastIndex: '',
    lastTime: '',
    isDeafult: true,
    justOnce: true,
    nameCanSee: false,
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '聊天'
    })
    if (option.nameCanSee && option.nameCanSee == 'show') {
      this.data.nameCanSee = true
    }
    if (option.mode && option.mode === 'isGuide') {
      this.setData({
        isGuide: true
      })
      this.setGuide()
    } else {
      this.setData({
        isGuide: false
      })
    }
    //
    this.data.departureId = option.departureId
    this.upDateChatData()
    this.data.interval = setInterval(() => {
      this.upDateChatData()
    }, 6000)
    this.data.option = cloneDeep(option)
    this.setData({
      option: option
    })
  },
  setGuide: function () {
    this.guide = this.selectComponent("#gudie-wrap")
    this.guide.startSpeaking('在这里就可以和阿通的上一家企业联系了~')
    this.setData({
      'guide.clickLeft': '15%',
      'guide.clickBottom': '-3%'
    })
  },
  textInput: function (e) {
    this.data.msgContent = e.detail.value
  },
  setAvator: function () {
    let otherInfo = this.data.chatData.otherInfo
    this.data.chatData.chatList.forEach((el, index) => {
      if (otherInfo) {
        otherInfo.forEach((ol, ondex) => {
          if (ol.id == el.userId) {
            el.url = ol.portraitUrl
          }
        })
      }
    })
    this.setData({
      chatData: this.data.chatData
    })
  },
  // 刷新聊天数据
  upDateChatData: function () {
    return new Promise((resolve, reject) => {
      apiTest.getChatList({
        userId: app.globalData.userInfo.userInfo.id,
        companyId: wx.getStorageSync('companyId'),
        mode: this.data.isGuide ? 'guide': '',
        departureId: this.data.departureId
      })
        .then((res) => {
          this.data.chatData = cloneDeep(res)
          this.setData({
            chatData: this.data.chatData
          })
          // 设置聊天公司名字
          if (this.data.justOnce) {
            wx.setNavigationBarTitle({
              title: this.data.nameCanSee ? '正在与' + this.data.chatData.chatTitle + '公司聊天' : '正在与离职员工的下家公司聊天'
            })
            this.data.justOnce = false
          }
          // 设置头像数据
          this.setAvator()
          // 第一次拉取消息，确定上次会话时间展示位置
          if (this.data.firstPull && this.data.chatData.chatList.length > 0) {
            this.data.lastIndex = this.data.chatData.chatList.length - 1
            this.data.lastTime = this.data.chatData.chatList[this.data.lastIndex].chatTime
            this.data.lastTime = this.data.lastTime.replace(/\-/g, "/")
            let date = new Date(this.data.lastTime)
            this.data.lastTime = (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ' + ' ' + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes())
            this.data.firstPull = false
            this.setData({
              lastIndex: this.data.lastIndex,
              lastTime: this.data.lastTime
            })
          }
          // 滑动到最底部
          this.pageScrollToBottom()
          resolve()
        })
    })
  },
  fomatTime: function (time) {
    console.log(time)
    return '05/15'
  },
  sendMsg: function () {
    if (!this.data.msgContent) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      apiTest.sendMsg({
        departureId: this.data.departureId,
        mode: this.data.isGuide ? 'guide' : '',
        chatContent: this.data.msgContent,
        userId: this.data.chatData.selfInfo.id
      })
        .then((res) => {
          this.upDateChatData()
            .then((res) => {
              this.setData({
                msgContent: ''
              })
            })
        })
    }
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#message').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },
  onHide: function () {
    clearInterval(this.data.interval)
  },
  onUnload: function () {
    clearInterval(this.data.interval)
  }
});
