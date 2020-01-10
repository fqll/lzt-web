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
    formData: {
      companyName: '',
      nickName: '',
      creditCode: '',
      incumbentsCount: '',
      logUrl: '',
      userId: '',
      processMode: ''
    },
    auditIndex: '',
    audits: ['否', '是'],
    prepage: ''
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '申请创建公司'
    })
    if (option.prepage) {
      this.setData({
        prepage: option.prepage
      })
    }
    // apiTest.getRoleList()
    //   .then((res) => {
    //     this.data.rolesData = cloneDeep(res)
    //     this.data.roles = []
    //     this.data.rolesData.forEach((el, index) => {
    //       this.data.roles.push(el.roleInfo.roleName)
    //       this.setData({
    //         roles: this.data.roles
    //       })
    //     })
    //   })
  },
  auditChange: function (e) {
    this.setData({
      auditIndex: e.detail.value
    })
  },
  pageBack: function () {
    console.log('返回')
    if (this.data.prepage === 'contact') {
      wx.redirectTo({
        url: '../contact_index/contact_index?prepage=changecompany',
      })
    } else if (this.data.prepage === 'changecompany') {
      wx.redirectTo({
        url: '../change_company/change_company',
      })
    }
  },
  sumbitDepart: function() {
    let preCheck = false
    // 前端验证
    if (this.data.formData.companyName === '') {
      wx.showToast({
        title: '填写公司名称',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.formData.nickName === '') {
      wx.showToast({
        title: '填写你的名字',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.formData.incumbentsCount < 1) {
      wx.showToast({
        title: '在职人数不应少于一人',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.formData.creditCode === '') {
      wx.showToast({
        title: '填写企业代码',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.auditIndex === '') {
      wx.showToast({
        title: '请选择',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.data.formData.processMode = this.data.auditIndex == 0 ? 1: 0
      this.data.formData.logUrl = ''
      let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      this.data.formData.userId = userInfo.userInfo.id
      apiTest.postCreateCompany(this.data.formData)
        .then((res) => {
          wx.showToast({
            title: '创建成功!',
            duration: 1000
          })
          if (this.data.auditIndex == 0) {
            wx.setStorageSync('companyId', res)
            wx.redirectTo({
              url: '../share_page/share_page',
            })
          } else {
            wx.setStorageSync('companyId', res)
            wx.redirectTo({
              url: '../tool_index/tool_index?companyId=' + res,
            })
          }
        })
    }
  },
  // input监听事件
  companyNameInput: function(e) {
    this.data.formData.companyName = e.detail.value
  },
  nickNameInput: function(e) {
    this.data.formData.nickName = e.detail.value
  },
  incumbentsCountInput: function(e) {
    this.data.formData.incumbentsCount = e.detail.value
  },
  creditCodeInput: function(e) {
    this.data.formData.creditCode = e.detail.value
  }
})