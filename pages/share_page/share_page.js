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
    inputName: '',
    tabs: [{
      id: 'invite',
      name: '邀请加入',
      desc: '邀请好友添加审批人'
    }, {
      id: 'apply',
      name: '申请加入',
      desc: '扫码或填写邀请码加入'
    }, {
      id: 'done',
      name: '已加入',
      desc: '查看已添加的审批人'
    }],
    activeId: 'invite',
    codeData: '',
    powerArray: [],
    shareCode: '',
    companyInfo: {
      id: '',
      name: ''
    },
    inviteList: [],
    inputShow: false,
    employeeId: '', // 从这里往下是原员工权限的，当前操作的员工id
    applyList: [],
    doneList: [],
    items: [
    ],
    isShow: false,
    keyWords: '',
    formData: {
      nickName: '',
      authorityName: ''
    },
    redShow: [false, false, false]
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '添加审批人'
    })
    this.askCompanyInfo()
    // wx.showLoading({
    //   title: '正在加载',
    // })
    // this.asks()
    //   .then(() => {
    //     wx.hideLoading()
    //   })
  },
  onPullDownRefresh: function () {
    this.onShow()
  },
  onShow: function () {
    this.getList(this.data.activeId)
    // 设置角色选项
    if (this.data.activeId !== 'invite') {
      apiTest.getAuthorityList()
        .then((res) => {
          let authorityData = cloneDeep(res)
          this.setData({
            items: []
          })
          authorityData.forEach((el, index) => {
            this.data.items.push({
              title: el.authorityName,
              desc: el.authorityName + '的权限',
              value: el.id
            })
          })
          this.setData({
            items: this.data.items
          })
        })
    }
  },
  gotoShareDetail: function () {
    wx.navigateTo({
      url: '../share_detail/share_detail',
    })
  },
  getList: function (type, nickName) {
    apiTest.getUserList({
      companyId: wx.getStorageSync('companyId'),
      auditStatus: type === 'apply' ? 0 : type === 'done' ? 1 : 3,
      nickName: nickName ? nickName : ''
    })
      .then((res) => {
        if (type === 'apply') {
          this.data.applyList = cloneDeep(res)
          this.setData({
            applyList: this.data.applyList
          })
          if (this.data.applyList && this.data.applyList.length > 0) {
            this.setData({
              redShow: [false, true, false]
            })
          } else {
            this.setData({
              redShow: [false, false, false]
            })
          }
        } else if (type === 'done') {
          this.data.doneList = cloneDeep(res)
          this.setData({
            doneList: this.data.doneList
          })
        } else if (type === 'invite') {
          this.setData({
            inviteList: res
          })
        }
      })
  },
  searchPeople: function () {
    this.getList(this.data.activeId, this.data.keyWords)
  },
  getNum: function(e) {
    this.setData({
      inputShow: false
    })
    let num = e.detail
    // this.data.inviteList.push({
    //   name: num
    // })
    // this.setData({
    //   inviteList: this.data.inviteList
    // })
    // 去更新邀请列表
    apiTest.companyInvite({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: wx.getStorageSync('companyId'),
      nickName: num
    })
      .then((res) => {
        this.data.inviteList.push({
          nickName: num
        })
        this.setData({
          inviteList: this.data.inviteList
        })
      })
  },
  askCompanyInfo: function () {
    apiTest.getCompanyInfo({
      companyId: wx.getStorageSync('companyId')
    })
      .then((res) => {
        this.setData({
          'companyInfo.id': res.companyInfo.id,
          'companyInfo.name': res.companyInfo.companyName
        })
      })
  },
  asks: function() {
    let ask1 = false,
      ask2 = false
    return new Promise((resolve, reject) => {
      apiTest.getCompanyInfo({
          companyId: wx.getStorageSync('companyId')
        })
        .then((res) => {
          ask1 = true
          if (ask2) {
            resolve()
          }
          this.setData({
            'companyInfo.id': res.companyInfo.id,
            'companyInfo.name': res.companyInfo.companyName,
            shareCode: res.shareCode
          })
        })
      apiTest.getCompanyImage({
          companyId: wx.getStorageSync('companyId')
        })
        .then((res) => {
          ask2 = true
          if (ask1) {
            resolve()
          }
          let codeData = res.data
          this.setData({
            codeData: wx.arrayBufferToBase64(codeData)
          })
        })
    })
  },
  changetab: function(e) {
    this.setData({
      activeId: e.detail
    })
    this.onShow()
  },
  openInput: function(e) {
    this.setData({
      inputShow: true
    })
  },
  onShareAppMessage: function(res) {
    let that = this
    console.log(res)
    if (res.from === 'button') {
      if (this.data.activeId === 'dup') {
        return {
          title: '邀请您加入' + that.data.companyInfo.name + '公司',
          path: '/pages/join_company/join_company?companyid=' + this.data.companyInfo.id + '&companyname=' + this.data.companyInfo.name,
          imageUrl: "",
          success: (res) => {
            console.log(res)
          }
        }
      } else {
        return {
          title: '邀请加入' + that.data.companyInfo.name + '公司',
          path: '/pages/join_company/join_company?name=' + res.target.dataset.name + '&companyid=' + this.data.companyInfo.id + '&companyname=' + this.data.companyInfo.name,
          imageUrl: "",
          success: (res) => {
            console.log(res)
          }
        }
      }
    }
  },
  // apply和done的方法
  formSubmit: function (e) {
    for (let key in e.detail.value) {
      if (e.detail.value[key] === '') {
        wx.showToast({
          title: this.getErrDesc(key),
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if (this.data.activeId === 'done') {
      apiTest.checkNameUnique({
        companyId: wx.getStorageSync('companyId'),
        employeeId: this.data.employeeId,
        nickName: e.detail.value.name
      })
        .then((res) => {
          if (res) {
            apiTest.updateRole({
              userId: app.globalData.userInfo.userInfo.id,
              companyId: wx.getStorageSync('companyId'),
              auditResult: 1,
              employeeId: this.data.employeeId,
              authorityList: e.detail.value.checkboxIds,
              nickName: e.detail.value.name
            })
              .then((res) => {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                this.setData({
                  isShow: false
                })
                app.globalData.onlyGetUserInfo(true)
                this.getList(this.data.activeId)
              })
          } else {
            wx.showToast({
              title: '重名',
              icon: 'none',
              duration: 2000
            })
          }
        })
    } else {
      apiTest.auditAttend({
        userId: app.globalData.userInfo.userInfo.id,
        companyId: wx.getStorageSync('companyId'),
        auditResult: 1,
        employeeId: this.data.employeeId,
        authorityList: e.detail.value.checkboxIds
      })
        .then((res) => {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            isShow: false
          })
          this.getList(this.data.activeId)
        })
    }
  },
  getErrDesc: function (key) {
    let rules = [{
      key: 'rolesId',
      keyErr: '请选择'
    }, {
      key: 'name',
      keyErr: '请填写'
    }]
    let err = ''
    rules.forEach((el, index) => {
      if (el.key === key) {
        err = el.keyErr
      }
    })
    return err
  },
  formReset: function (e) {
    console.log(e)
  },
  showSetting: function (e) {
    this.setData({
      isShow: true,
      employeeId: e.currentTarget.dataset.employeeid
    })
    if (this.data.activeId === 'done') {
      // 将弹框里的默认值赋上
      apiTest.getRoleIndexInfo({
        companyId: wx.getStorageSync('companyId'),
        userId: e.currentTarget.dataset.employeeid
      })
        .then((res) => {
          let companyInfo = cloneDeep(res.companyInfo)
          let powerArray = []
          this.data.items.forEach((el, index) => {
            let result = false
            companyInfo.authorityList.forEach((ol, odnex) => {
              if (ol.authorityName === el.title) {
                result = true
                powerArray.push({
                  name: el.authorityName,
                  check: true
                })
              }
            })
            if (!result) {
              powerArray.push({
                name: el.authorityName,
                check: false
              })
            }
          })
          this.setData({
            'formData.nickName': e.currentTarget.dataset.nickname,
            'formData.authorityList': powerArray
          })
        })
    }
  },
  closeSetting: function () {
    this.setData({
      isShow: false
    })
  },
  keyWordsInput: function (e) {
    // console.log(e.detail.value)
    this.setData({
      keyWords: e.detail.value
    })
  },
})