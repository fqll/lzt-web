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
      id: 'apply',
      name: '申请加入'
    }, {
      id: 'done',
      name: '已加入'
    }],
    activeId: 'apply',
    employeeId: '', // 当前操作的员工id
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
    redShow: [false, false]
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '员工权限'
    })
  },
  onPullDownRefresh: function () {
    this.onShow()
  },
  onShow: function () {
    this.getList(this.data.activeId)
    // 设置角色选项
    apiTest.getAuthorityList()
      .then((res) => {
        let authorityData = cloneDeep(res)
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
  },
  getList: function (type, nickName) {
    apiTest.getUserList({
      companyId: wx.getStorageSync('companyId'),
      auditStatus: type === 'apply' ? 0 : 1,
      nickName: nickName ? nickName: ''
    })
      .then((res) => {
        if (type === 'apply') {
          this.data.applyList = cloneDeep(res)
          this.setData({
            applyList: this.data.applyList
          })
          if (this.data.applyList.length > 0) {
            this.setData({
              redShow: [true, false]
            })
          } else {
            this.setData({
              redShow: [false, false]
            })
          }
        } else {
          this.data.doneList = cloneDeep(res)
          this.setData({
            doneList: this.data.doneList
          })
        }
      })
  },
  searchPeople: function () {
    this.getList(this.data.activeId, this.data.keyWords)
  },
  changetab: function (e) {
    this.setData({
      activeId: e.detail
    })
    this.getList(e.detail)
  },
  rejectApply: function (e) {
    apiTest.auditAttend({
      userId: app.globalData.userInfo.userInfo.id,
      companyId: wx.getStorageSync('companyId'),
      auditResult: 2,
      employeeId: e.currentTarget.dataset.employeeid,
      roleId: ''
    })
      .then((res) => {
        wx.showToast({
          title: '拒绝成功',
          icon: 'success',
          duration: 2000
        })
        this.getList(this.data.activeId)
      })
  },
  keyWordsInput: function (e) {
    // console.log(e.detail.value)
    this.setData({
      keyWords: e.detail.value
    })
  },
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
        err =  el.keyErr
      }
    })
    return err
  },
  formReset: function (e) {
    console.log(e)
  },
  checkboxChange: function (e) {
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
  }
})