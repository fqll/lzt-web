//index.js
//获取应用实例
import {
  ApiTest
} from '../../common/api/testNet.js'
import {
  cloneDeep,
  colorBack
} from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    keyShow: false,
    isGuide: false,
    guide: {
      clickShow: true,
      showTop: false,
      guideStatus: '1', // 1为引导点击我发起的，2为引导点击进入分享,3为待入职进入的详情,4为入职，5为审批
      clickLeft: '',
      clickBottom: '',
      entryGuide: true,
      preEntry: false,
      entryBtn: false,
      exitBtn: false,
      type: 'leave'
    },
    detailData: {},
    activeTab: '',
    myId: '',
    wayIndex: '',
    ways: [],
    departureId: '',
    isOver: false,
    isSelf: false,
    canAttend: false,
    canAttendCompnayDesc: [],
    canAttendCompnay: [],
    authorityName: [],
    joindone: '',
    isFollowed: false,
    canConcern: false,
    setRead: false,
    backmakeup: false,
    timer: {
      use: false,
      interval: ''
    }
  },
  onLoad: function(option) {
    console.log(option)
    wx.hideShareMenu()
    // 计算导航
    // this.countNav()
    // wx.setNavigationBarTitle({
    //   title: '详情'
    // })
    wx.showLoading({
      title: '正在加载',
    })
    // 获取权限
    // app.globalData = {}
    this.checkUserInfo()
      .then(() => {
        console.log('jinr')
        this.getAuthorityName()
        if (option.backmakeup === 'show') {
          this.setData({
            backmakeup: true
          })
        }

        // if (option.mode && option.mode === 'isGuide') {
        //   this.data.isGuide = true
        // } else {
        //   this.data.isGuide = false
        // }
        // this.setData({
        //   isGuide: this.data.isGuide
        // })

        // if (option.guideStatus) {
        //   this.setData({
        //     'guide.entryGuide': false,
        //     'guide.guideStatus': option.guideStatus,
        //     'guide.type': 'entry'
        //   })
        // }

        // 如果是下家查看已加入的员工，设置joindone
        if (option.joindone && option.joindone === 'done') {
          this.setData({
            joindone: 'joindone'
          })
        }
        // 查看是否需要设置已读
        if (option.setread && option.setread === 'need') {
          this.setData({
            setRead: true
          })
        }
        // 查询下拉列表配置
        apiTest.getSelectList({
          type: 'sendType'
        })
          .then((res) => {
            app.globalData.sendType = cloneDeep(res)
            app.globalData.sendType.forEach((el, index) => {
              this.data.ways.push(el.name)
            })
            this.setData({
              ways: this.data.ways
            })
          })

        this.data.activeTab = option.activetab
        this.data.departureId = option.departureid
        // 如果是扫码进的
        if (option.scene) {
          // 小程序扫图片码直接进
          let scene = decodeURIComponent(option.scene)
          console.log('获取到参数')
          console.log(scene)
          let array = scene.split('&')
          array.forEach((el, index) => {
            let array2 = el.split('=')
            if (array2[0] === 't') {
              this.data.activeTab = array2[1]
            } else if (array2[0] === 'i') {
              this.data.departureId = array2[1]
            }
          })
        }

        this.setData({
          myId: app.globalData.userInfo.userInfo.id,
          activeTab: this.data.activeTab,
          departureId: this.data.departureId
        })
        // 如果是分享过来的，需验证
        if (this.data.activeTab === 'share') {
          this.setData({
            keyShow: true
          })
        } else {
          this.setData({
            keyShow: false
          })
        }

        if (this.data.isGuide) {
          if (this.data.guide.guideStatus != 5) {
            this.setData({
              isOver: true
            })
          } else {
            this.setData({
              isOver: false
            })
          }
          this.setGuide()
        }

        if (this.data.isGuide && (this.data.guide.guideStatus == 3 || this.data.guide.guideStatus == 4)) {
          return
        }
        apiTest.getDepartureInfo({
          mode: this.data.isGuide ? 'guide' : '',
          id: option.departureid,
          userId: app.globalData.userInfo.userInfo.id
        })
          .then((res) => {
            wx.hideLoading()
            this.data.detailData = cloneDeep(res)
            this.data.detailData.color = colorBack(res.departureInfo.auditStatusDesc)
            this.data.detailData.departureAuditList.forEach((el, index) => {
              el.color = colorBack(el.auditStage)
            })
            this.setData({
              detailData: this.data.detailData
            })
            if (this.data.detailData.followStatus) {
              this.setData({
                isFollowed: true
              })
            }
            if (this.data.detailData.departureInfo.auditStatusDesc === '已办结' && this.data.guide.guideStatus != 5) {
              this.setData({
                isOver: true
              })
            }
            if (this.data.detailData.departureInfo.employeeId == app.globalData.userInfo.userInfo.id) {
              this.setData({
                isSelf: true
              })
            }
            if (this.data.activeTab === 'share') {
              this.checkCanAttend()
            }
            // 如果需要设置已读，则设置
            if (this.data.setRead) {
              this.read()
            }
            //
          })
          .catch(() => {
            wx.hideLoading()
          })
      })
  },
  detailBack: function () {
    if (this.data.backmakeup) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        formId: this.data.departureId
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  makeSure: function (e) {
    let that = this
    let answer = e.detail
    // 检验是否正确
    let idCardNo = this.data.detailData.departureInfo.idCardNo
    let nowId = idCardNo.slice(idCardNo.length - 4, idCardNo.length)
    console.log(nowId)
    if (nowId === answer) {
      wx.showToast({
        title: '核验正确！',
        duration: 2000
      })
      setTimeout(() => {
        that.setData({
          keyShow: false
        })
      }, 1000)
    } else {
      wx.showToast({
        title: '填写错误！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  gotoPreEntry: function() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    prevPage.setData({
      isGuide: true,
      'guide.guideStatus': '3'
    })
    wx.navigateBack({
      delta: 2
    })
  },
  doEntry: function() {
    wx.showToast({
      title: '入职成功！',
      duration: 1000
    })
    setTimeout(() => {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        isGuide: true,
        'guide.guideStatus': '2'
      })
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  },
  doExit: function() {
    this.guide.startSpeaking('阿通希望与您再次相会~')
    setTimeout(() => {
      let companyId = wx.getStorageSync('companyId') ? wx.getStorageSync('companyId') : ''
      app.globalData.findGoCompany(companyId, 'guideJump')
    }, 3000)
  },
  gotoEntryGuide: function() {
    this.setData({
      'guide.guideStatus': 2,
      'guide.entryGuide': false,
      'guide.type': 'entry',
      'guide.preEntry': true
    })
    this.setGuide()
  },
  setGuide: function() {
    this.guide = this.selectComponent("#gudie-wrap")
    if (this.data.guide.guideStatus == 1) {
      this.guide.startSpeaking('这是最后一步啦！把离职证明分享给阿离，这样阿离就可以拿到离职证明到下一家公司去入职并接受背景调查了~')
      this.setData({
        'guide.type': 'leave',
        'guide.clickLeft': '10%',
        'guide.clickBottom': '80%'
      })
    } else if (this.data.guide.guideStatus == 2) {
      // 请求一次分享的离职申请
      this.getEntryDetail()
      // setGuide
      this.guide.startSpeaking('Hi！我是阿离的朋友阿通，这是我通过微信分享给您的离职证明，我想要加入贵公司，麻烦帮我办理一下待入职，谢谢啦~')
      this.setData({
        'guide.clickLeft': '5%',
        'guide.clickBottom': '80%'
      })
    } else if (this.data.guide.guideStatus == 3) {
      // 请求一次分享的离职申请
      this.getEntryDetail()
      this.guide.startSpeaking('这就是我的待入职详情，点击入职我就加入到贵公司了，您还可以尝试和我之前的企业沟通联系哦~')
      this.setData({
        'guide.entryBtn': true,
        'guide.clickLeft': '5%',
        'guide.clickBottom': '80%'
      })
    } else if (this.data.guide.guideStatus == 4) {
      // 请求一次分享的离职申请
      this.getEntryDetail()
      this.guide.startSpeaking('您现在看到的是阿通以前的离职信息,阿通很高兴成为您的员工！')
      this.setData({
        'guide.entryBtn': false,
        'guide.exitBtn': true,
        'guide.clickLeft': '5%',
        'guide.clickBottom': '80%'
      })
    } else if (this.data.guide.guideStatus == 5) {
      // 完成审批
      this.guide.startSpeaking('棒棒哒！现在点击关注，代表你对阿离有特殊的印象，之后阿离去面试的下一家企业就可以通过离职通联系你~')
      this.setData({
        'guide.type': 'leave',
        'guide.clickShow': false,
        'guide.showTop': true,
        'guide.clickLeft': '10%',
        'guide.clickBottom': '0'
      })
    }
  },
  read: function() {
    apiTest.setAlreadyRead({
        userId: app.globalData.userInfo.userInfo.id,
        auditRoleType: this.data.activeTab === 'wait' ? 1 : 0,
        departureId: this.data.departureId
      })
      .then((res) => {

      })
  },
  getEntryDetail: function() {
    apiTest.getEntryGuideInfo()
      .then((res) => {
        this.data.detailData = cloneDeep(res)
        this.setData({
          detailData: this.data.detailData,
          canAttend: (this.data.guide.guideStatus == 3 || this.data.guide.guideStatus == 4) ? false : true,
          isOver: true,
          activeTab: (this.data.guide.guideStatus == 3 || this.data.guide.guideStatus == 4) ? 'join' : 'share'
        })

      })
  },
  gotoChat: function(e) {
    wx.navigateTo({
      url: '../chat/chat?departureId=' + e.currentTarget.dataset.id,
    })
  },
  attendCompany: function() {
    apiTest.attendCompany({
        userId: app.globalData.userInfo.userInfo.id,
        departureId: this.data.departureId,
        companyId: wx.getStorageSync('companyId')
      })
      .then((res) => {
        wx.showToast({
          title: '入职成功！',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
  },
  contactDeparture: function() {
    if (this.data.guide.guideStatus == 5) {
      // 引导模式
      wx.showToast({
        title: '关注成功',
        icon: 'success',
        duration: 2000
      })
      // 完成审批
      this.guide.startSpeaking('很不错，现在就麻烦同意阿离的离职手续吧~')
      this.setData({
        'guide.clickLeft': '30%',
        'guide.clickBottom': '0'
      })
      this.setData({
        isFollowed: true
      })
    } else {
      if (!this.data.isFollowed) {
        apiTest.doFollow({
            userId: this.data.myId,
            departureId: this.data.departureId
          })
          .then((res) => {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              isFollowed: true
            })
          })
      }
    }
  },
  checkUserInfo: function () {
    return new Promise((resolve, reject) => {
      let that = this
      if (app.globalData.userInfo && app.globalData.userInfo.userInfo && app.globalData.userInfo.userInfo.id) {
        if (that.data.timer.use) {
          clearInterval(that.data.timer.interval);
        }
        resolve()
      } else {
        if (!that.data.timer.use) {
          that.data.timer.use = true
          that.data.timer.interval = setInterval(() => {
            if (app.globalData.userInfo && app.globalData.userInfo.userInfo && app.globalData.userInfo.userInfo.id) {
              if (that.data.timer.use) {
                clearInterval(that.data.timer.interval);
              }
              resolve()
            } else {
            }
          }, 500)
        }
      }
    })
    // return new Promise((resolve, reject) => {
    //   let that = this
    //   if (app.globalData.userInfo && app.globalData.userInfo.userInfo && app.globalData.userInfo.userInfo.id) {
    //     console.log('拿到')
    //     console.log(app.globalData.userInfo)
    //     clearInterval(that.data.timer.interval);
    //     resolve()
    //   } else {
    //     console.log('循环')
    //     if (!that.data.timer.use) {
    //       that.data.timer.use = true
    //       that.data.timer.interval = setInterval(() => {
    //         that.checkUserInfo()
    //       }, 500)
    //     }
    //   }
    // })
  },
  getAuthorityName: function() {
    console.log('去请求权限')
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
    if (!(powerArray.indexOf('离职分析') < 0)) {
      this.setData({
        canConcern: true
      })
    } else if (this.data.guide.guideStatus == 5) {
      // 如果是审批引导
      this.setData({
        canConcern: true,
        isFollowed: false
      })
    }
  },
  // 判断是否拥有直接把此人加入公司的权限
  checkCanAttend: function() {
    app.globalData.userInfo.companyInfoList.forEach((el, index) => {
      let powerArray = []
      el.authorityList.forEach((ol, ondex) => {
        powerArray.push(ol.authorityName)
      })
      // 根据是否有入职背掉权限来判定是否选择此公司待入职
      if (!(powerArray.indexOf('入职办理') < 0)) {
        this.data.canAttendCompnayDesc.push(el)
      }
    })
    console.log('现在检测是否可以入职')
    console.log(app.globalData.userInfo.companyInfoList)
    console.log(this.data.canAttendCompnayDesc)
    if (this.data.canAttendCompnayDesc.length == 0) {
      this.setData({
        canAttend: false
      })
    } else {
      this.setData({
        canAttend: true
      })
    }
  },
  gotoReject: function() {
    wx.navigateTo({
      url: '../reject_departure/reject_departure?departureid=' + this.data.detailData.departureInfo.id,
    })
  },
  agreeDeparture: function() {
    if (this.data.guide.guideStatus == 5) {
      wx.showToast({
        title: '审批成功',
        duration: 1000
      })
      setTimeout(() => {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          isGuide: true,
          'guide.guideStatus': '1'
        })
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    } else {
      apiTest.auditDeparture({
          userId: app.globalData.userInfo.userInfo.id,
          departureId: this.data.detailData.departureInfo.id,
          auditResult: 1,
          auditOpinions: ''
        })
        .then((res) => {
          wx.showToast({
            title: '审批成功',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        })
    }
  },
  wayChange: function(e) {
    this.setData({
      wayIndex: e.detail.value
    })
  },
  cancelDeparture: function() {
    let that = this
    wx.showModal({
      title: '',
      content: '确认撤回吗？',
      success(res) {
        if (res.confirm) {
          apiTest.cancelDepartureInfo({
              id: that.data.detailData.departureInfo.id,
              userId: app.globalData.userInfo.userInfo.id
            })
            .then((res) => {
              wx.showToast({
                title: '撤回成功',
                duration: 1000
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            })
        } else if (res.cancel) {

        }
      }
    })
  },
  formSubmit: function(e) {
    let input = ''
    let rulePhone = /^[1][3,4,5,7,8][0-9]{9}$/
    let ruleMail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
    let result = false
    if (this.data.ways[this.data.wayIndex] === '邮件发送') {
      input = e.detail.value.email
      result = ruleMail.test(e.detail.value.email)
    } else if (this.data.ways[this.data.wayIndex] === '短信发送') {
      input = e.detail.value.phone
      result = rulePhone.test(e.detail.value.phone)
    }
    if (!result) {
      wx.showToast({
        title: '请输入正确',
        icon: 'none',
        duration: 2000
      })
    } else {
      apiTest.shareDepartureInfo({
        id: this.data.departureId,
        sendType: this.data.ways[this.data.wayIndex] === '邮件发送' ? 2 : 1,
        address: input
      })
        .then((res) => {
          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        })
    }
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      return {
        title: '离职证明',
        path: '/pages/departure_detail/departure_detail?departureid=' + this.data.departureId + '&activetab=share',
        imageUrl: "./images/bg.png",
        success: (res) => {
          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    } else {}
  },
  attendToJoin: function () {
    // 有人事在的公司才能加入
    this.data.canAttendCompnay = []
    this.data.canAttendCompnayDesc.forEach((el, index) => {
      this.data.canAttendCompnay.push(el.companyName)
    })
    let that = this
    wx.showActionSheet({
      itemList: that.data.canAttendCompnay,
      success(res) {
        apiTest.attendCompany({
          userId: app.globalData.userInfo.userInfo.id,
          departureId: that.data.detailData.departureInfo.id,
          companyId: that.data.canAttendCompnayDesc[res.tapIndex].companyId
        })
          .then((res) => {
            wx.showToast({
              title: '入职成功！',
              duration: 2000
            })
            setTimeout(() => {
              wx.setStorageSync('companyId', that.data.canAttendCompnayDesc[res.tapIndex].companyId)
              wx.redirectTo({
                url: '../search_departure/search_departure?companyId=' + wx.getStorageSync('companyId') + '&activeId=done',
              })
            }, 1000)
          })
      },
      fail(res) { }
    })
  },
  attendToEntry: function() {
    // 有人事在的公司才能加入
    this.data.canAttendCompnay = []
    this.data.canAttendCompnayDesc.forEach((el, index) => {
      this.data.canAttendCompnay.push(el.companyName)
    })
    let that = this
    wx.showActionSheet({
      itemList: that.data.canAttendCompnay,
      success(res) {
        apiTest.readyToEntry({
            userId: app.globalData.userInfo.userInfo.id,
            departureId: that.data.detailData.departureInfo.id,
            companyId: that.data.canAttendCompnayDesc[res.tapIndex].companyId
          })
          .then((ress) => {
            wx.showToast({
              title: '待入职成功！',
              duration: 2000
            })
            wx.setStorageSync('companyId', that.data.canAttendCompnayDesc[res.tapIndex].companyId)
            setTimeout(() => {
              wx.setStorageSync('companyId', that.data.canAttendCompnayDesc[res.tapIndex].companyId)
              wx.redirectTo({
                url: '../search_departure/search_departure?companyId=' + wx.getStorageSync('companyId') + '&activeId=will',
              })
            }, 1000)
          })
      },
      fail(res) {}
    })
  }
})