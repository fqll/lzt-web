//index.js
//获取应用实例
import {
  ApiTest
} from '../../common/api/testNet.js'
import {
  cloneDeep,
  getProcessMode
} from "../../utils/util.js"
var apiTest = new ApiTest

const app = getApp()

Page({
  data: {
    hasSave: false, // 没有草稿
    fromSave: false, // 不是从草稿箱进来的
    guide: {
      highLight: [false, false],
      showTop: true,
      clickLeft: '',
      clickBottom: '',
      clickShow: false
    },
    previewData: {

    },
    previewShow: false, // 预览弹窗
    isGuide: false,
    formId: '',
    reasonOnes: [],
    reasonOneIndex: '',
    personals: [],
    personalIndex: '',
    officals: [],
    officalIndex: '',
    audits: ['否', '是'],
    auditIndex: '',
    genders: ['男', '女'],
    genderIndex: '',
    entryDate: '',
    departureDate: '',
    applyDate: '',
    auditList: [],
    backInfo: '',
    copyList: [],
    reasonOneData: [],
    officalData: [],
    personalData: [],
    eData: {},
    formData: {
      userId: '',
      departureInfo: {
        companyId: '',
        employeeName: '',
        gender: '',
        idCardNo: '',
        department: '',
        employeePost: '',
        departureReason: '',
        personalDepartureReason: '',
        officialDepartureReason: '',
        entryDate: '',
        submitDate: '',
        departureDate: '',
        remark: ''
      },
      auditUserList: [],
      copyUserList: []
    }
  },
  onLoad: function(option) {
    wx.setNavigationBarTitle({
      title: '开具离职证明'
    })

    if (option.mode && option.mode === 'isGuide') {
      this.data.isGuide = true
    } else {
      this.data.isGuide = false
    }
    this.setData({
      isGuide: this.data.isGuide
    })

    this.getSelectThen()
      .then(() => {
        // 如果是保存来的，填充表单
        if (!this.data.isGuide && option.from && option.from === 'save') {
          this.fillForm(option.id)
          this.setData({
            fromSave: true
          })
        }
        // guide
        if (this.data.isGuide) {
          this.setGuide()
        }
      })

    this.searchDraft()
  },
  gotoDraft: function() {
    wx.navigateTo({
      url: '../draft_index/draft_index',
    })
  },
  searchDraft: function() {
    apiTest.getDraftList({
        userId: app.globalData.userInfo.userInfo.id,
        companyId: wx.getStorageSync('companyId')
      })
      .then((res) => {
        this.data.showList = cloneDeep(res.draftList)
        if (this.data.showList.length > 0) {
          this.setData({
            hasSave: true
          })
        } else {
          this.setData({
            hasSave: false
          })
        }
      })
  },
  getSelectThen: function() {
    let res1 = false,
      res2 = false,
      res3 = false
    return new Promise((resolve, reject) => {
      apiTest.getSelectList({
          type: 'departureReasonEnum'
        })
        .then((res) => {
          res.forEach((el, index) => {
            this.data.reasonOnes.push(el.name)
          })
          this.setData({
            reasonOnes: this.data.reasonOnes,
            reasonOneData: res
          })
          res1 = true
          if (res2 && res3) {
            resolve()
          }
        })
      apiTest.getSelectList({
          type: 'personalDepartureReason'
        })
        .then((res) => {
          res.forEach((el, index) => {
            this.data.personals.push(el.name)
          })
          this.setData({
            personals: this.data.personals,
            personalData: res
          })
          res2 = true
          if (res1 && res3) {
            resolve()
          }
        })
      apiTest.getSelectList({
          type: 'officialDepartureReason'
        })
        .then((res) => {
          res.forEach((el, index) => {
            this.data.officals.push(el.name)
          })
          this.setData({
            officals: this.data.officals,
            officalData: res
          })
          res3 = true
          if (res2 && res1) {
            resolve()
          }
        })
    })
  },
  changeGuide: function(bool) {
    if (bool) {
      this.guide.startSpeaking('选择"是"，则在之后审批时要手动去选择是否关注阿离~')
    } else {
      this.guide.startSpeaking('选择"否"，则默认关注了阿离，这样之后的企业可以联系你并询问阿离的工作情况~')
    }

  },
  setGuide: function() {
    this.guide = this.selectComponent("#gudie-wrap")
    this.guide.startSpeaking('基础信息已填写完毕，滑动屏幕点击下方的按钮即可帮我开具离职证明，也可切换“是否需要审批”来查看提示~')
    this.setData({
      'guide.highLight': [true, true],
      'guide.clickLeft': '15%',
      'guide.clickBottom': '-3%'
    })
    // 填充数据
    let res = {
      cancelable: false,
      chatAble: false,
      departureAuditList: [],
      departureCopyList: [],
      followStatus: false,
      modifiable: false,
      departureInfo: {
        auditStatus: "-1",
        auditStatusDesc: "草稿",
        auditUserId: null,
        code: "nd81bO",
        companyId: 80,
        delayEntryDate: null,
        department: "web",
        departureDate: "2019-11-13",
        departureReason: "1",
        departureReasonDesc: "个人原因",
        employeeId: null,
        employeeName: "阿离",
        employeePost: "java",
        entryDate: "2018-05-14",
        gender: "女",
        id: 143,
        idCardNo: "510113199209130038",
        isCheck: "0",
        nextCompanyId: null,
        officialDepartureReason: "",
        officialDepartureReasonDesc: null,
        officialEvaluate: null,
        personalDepartureReason: "0",
        personalDepartureReasonDesc: "行业前景",
        personalEvaluate: null,
        remark: null,
        submitDate: "2019-11-13",
      }
    }

    this.data.formData = cloneDeep(res.departureInfo)
    this.data.genderIndex = this.getIndex(this.data.formData.gender, this.data.genders)
    this.data.entryDate = this.data.formData.entryDate
    this.data.reasonOneIndex = this.getIndex(this.data.formData.departureReasonDesc, this.data.reasonOnes)
    this.data.personalIndex = this.getIndex(this.data.formData.personalDepartureReasonDesc, this.data.personals)
    this.data.officalIndex = this.getIndex(this.data.formData.officialDepartureReasonDesc, this.data.officals)
    this.data.applyDate = this.data.formData.submitDate
    this.data.departureDate = this.data.formData.departureDate
    this.data.auditList = cloneDeep(res.departureAuditList)
    this.data.copyList = cloneDeep(res.departureCopyList)
    this.setData({
      formData: this.data.formData,
      genderIndex: this.data.genderIndex,
      entryDate: this.data.entryDate,
      reasonOneIndex: this.data.reasonOneIndex,
      personalIndex: this.data.personalIndex,
      officalIndex: this.data.officalIndex,
      applyDate: this.data.applyDate,
      departureDate: this.data.departureDate,
      auditList: this.data.auditList,
      copyList: this.data.copyList,
      auditIndex: 0
    })
  },
  getIndex: function(desc, array) {
    let index = array.indexOf(desc) < 0 ? '' : array.indexOf(desc)
    return index
  },
  fillForm: function(id) {
    this.setData({
      formId: id
    })
    apiTest.getDepartureInfo({
        id: id,
        userId: app.globalData.userInfo.userInfo.id
      })
      .then((res) => {
        this.data.formData = cloneDeep(res.departureInfo)
        this.data.genderIndex = this.getIndex(this.data.formData.gender, this.data.genders)
        this.data.entryDate = this.data.formData.entryDate
        this.data.reasonOneIndex = this.getIndex(this.data.formData.departureReasonDesc, this.data.reasonOnes)
        this.data.personalIndex = this.getIndex(this.data.formData.personalDepartureReasonDesc, this.data.personals)
        this.data.officalIndex = this.getIndex(this.data.formData.officialDepartureReasonDesc, this.data.officals)
        this.data.applyDate = this.data.formData.submitDate
        this.data.departureDate = this.data.formData.departureDate
        this.data.auditList = cloneDeep(res.departureAuditList)
        this.data.copyList = cloneDeep(res.departureCopyList)
        this.setData({
          formData: this.data.formData,
          genderIndex: this.data.genderIndex,
          entryDate: this.data.entryDate,
          reasonOneIndex: this.data.reasonOneIndex,
          personalIndex: this.data.personalIndex,
          officalIndex: this.data.officalIndex,
          applyDate: this.data.applyDate,
          departureDate: this.data.departureDate,
          auditList: this.data.auditList,
          copyList: this.data.copyList
        })
      })
  },
  showErr: function(err) {
    wx.showToast({
      title: err,
      icon: 'none',
      duration: 2000
    })
  },
  formSubmit: function(e) {
    if (e.detail.target.id === 'submit') {
      var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // 如果是提交
      if (e.detail.value.name === '') {
        this.showErr('填写名字')
      } else if (this.data.genderIndex === '') {
        this.showErr('选择性别')
      } else if (!regIdNo.test(e.detail.value.cardNo)) {
        this.showErr('填写正确的身份证号码')
      } else if (this.data.entryDate === '') {
        this.showErr('选择日期')
      } else if (this.data.reasonOneIndex === '' || (this.data.personalIndex === '' && this.data.officalIndex === '')) {
        this.showErr('选择原因')
      } else if (e.detail.value.depart === '') {
        this.showErr('填写部门')
      } else if (e.detail.value.post === '') {
        this.showErr('填写职务')
      } else if (this.data.applyDate === '') {
        this.showErr('选择日期')
      } else if (this.data.departureDate === '') {
        this.showErr('选择日期')
      } else if (this.data.auditIndex === '') {
        this.showErr('选择审批')
      } else if (this.data.auditIndex == 1 && this.data.auditList.length == 0) {
        this.showErr('至少一个审批人')
      } else if (this.data.isGuide && this.data.auditIndex != 1) {
        // 如果是引导模式，让他必须选择需要审批
        this.showErr('引导模式下审批请选择“是”')
        this.guide.startSpeaking('小离希望这份离职手续由你亲自审批呢~')
      } else {
        // 通过验证，先生成预览
        // let id = wx.getStorageSync('companyId')
        // let name = ''
        // app.globalData.userInfo.companyInfoList.forEach((el, index) => {
        //   if (id == el.companyId) {
        //     name = el.companyName
        //   }
        // })
        // this.data.previewData = {
        //   employeeName: e.detail.value.name,
        //   gender: this.data.genderIndex === '' ? '' : this.data.genderIndex == 0 ? '男' : '女',
        //   idCardNo: e.detail.value.cardNo,
        //   department: e.detail.value.depart,
        //   employeePost: e.detail.value.post,
        //   entryDate: this.data.entryDate,
        //   departureDate: this.data.departureDate,
        //   departureReasonDesc: this.data.reasonOneData[this.data.reasonOneIndex].name,
        //   submitDate: this.data.applyDate,
        //   departureDate: this.data.departureDate,
        //   companyName: name,
        //   departureDate: this.data.departureDate
        // }
        // this.setData({
        //   previewData: this.data.previewData,
        //   eData: e,
        //   previewShow: true
        // })
        // 比较时间
        let result1 = this.timeCompare(this.data.applyDate, this.data.entryDate) // 申请离职和入职比较
        let result2 = this.timeCompare(this.data.departureDate, this.data.entryDate) // 解除劳动和申请比较
        let result3 = this.timeCompare('', this.data.entryDate) // 解除劳动和申请比较
        if (!result3) {
          this.showErr('入职时间不能晚于今日')
        } else if (!result1) {
          this.showErr('申请离职时间不能早于入职时间')
        } else if (!result2) {
          this.showErr('解除劳动时间不能早于申请离职时间')
        } else {
          // 直接创建成功
          this.setData({
            eData: e
          })
          this.sureSubmit()
        }
      }
    } else if (e.detail.target.id === 'save') {
      // 整合aduitList，copyList
      let auditUserList = [],
        copyUserList = []
      this.data.auditList.forEach((el, index) => {
        auditUserList.push({
          userId: el.userId,
          auditOrder: index + 1
        })
      })
      this.data.copyList.forEach((el, index) => {
        copyUserList.push({
          userId: el.userId,
          auditOrder: index + 1
        })
      })
      //
      apiTest.createNewDeparture({
          saveType: 0,
          mode: '',
          userId: app.globalData.userInfo.userInfo.id,
          departureInfo: {
            id: this.data.formId ? this.data.formId : null,
            companyId: wx.getStorageSync('companyId'),
            employeeName: e.detail.value.name,
            gender: this.data.genderIndex === '' ? '' : this.data.genderIndex == 0 ? '男' : '女',
            idCardNo: e.detail.value.cardNo,
            department: e.detail.value.depart,
            employeePost: e.detail.value.post,
            departureReason: this.data.reasonOneIndex === '' ? '' : this.data.reasonOneData[this.data.reasonOneIndex].value,
            personalDepartureReason: this.data.reasonOneIndex === '' ? '' : this.data.reasonOneData[this.data.reasonOneIndex].name === '公司原因' ? '' : this.data.personalIndex === '' ? '' : this.data.personalData[this.data.personalIndex].value,
            officialDepartureReason: this.data.reasonOneIndex === '' ? '' : this.data.reasonOneData[this.data.reasonOneIndex].name === '公司原因' ? this.data.officalIndex === '' ? '' : this.data.officalData[this.data.officalIndex].value : '',
            entryDate: this.data.entryDate,
            submitDate: this.data.applyDate,
            departureDate: this.data.departureDate,
            remark: e.detail.value.note
          },
          auditUserList: auditUserList,
          copyUserList: copyUserList
        })
        .then((res) => {
          wx.showToast({
            title: '保存成功',
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
  saveForm: function() {

  },
  timeCompare: function(time1, time2) {
    var oDate1 = time1 ? new Date(time1): new Date();
    var oDate2 = time2 ? new Date(time2): new Date();
    if (oDate1.getTime() > oDate2.getTime()) {
      return true
    } else if (oDate1.getTime() < oDate2.getTime()) {
      return false
    } else {
      return true
    }
  },
  sureSubmit: function() {
    //
    let e = this.data.eData
    // 整合aduitList，copyList
    let auditUserList = [],
      copyUserList = []
    this.data.auditList.forEach((el, index) => {
      auditUserList.push({
        userId: el.userId,
        auditOrder: index + 1
      })
    })
    this.data.copyList.forEach((el, index) => {
      copyUserList.push({
        userId: el.userId,
        auditOrder: index + 1
      })
    })
    //
    apiTest.createNewDeparture({
        saveType: 1,
        mode: this.data.isGuide ? 'guide' : '',
        userId: app.globalData.userInfo.userInfo.id,
        departureInfo: {
          id: this.data.formId ? this.data.formId : null,
          companyId: wx.getStorageSync('companyId'),
          employeeName: e.detail.value.name,
          gender: this.data.genderIndex === '' ? '' : this.data.genderIndex == 0 ? '男' : '女',
          idCardNo: e.detail.value.cardNo,
          department: e.detail.value.depart,
          employeePost: e.detail.value.post,
          departureReason: this.data.reasonOneIndex === '' ? '' : this.data.reasonOneData[this.data.reasonOneIndex].value,
          personalDepartureReason: this.data.reasonOneIndex === '' ? '' : this.data.reasonOneData[this.data.reasonOneIndex].name === '公司原因' ? '' : this.data.personalIndex === '' ? '' : this.data.personalData[this.data.personalIndex].value,
          officialDepartureReason: this.data.reasonOneData[this.data.reasonOneIndex].name === '公司原因' ? this.data.officalIndex === '' ? '' : this.data.officalData[this.data.officalIndex].value : '',
          entryDate: this.data.entryDate,
          submitDate: this.data.applyDate,
          departureDate: this.data.departureDate,
          remark: this.data.auditIndex == 1 ? e.detail.value.note : ''
        },
        auditUserList: this.data.auditIndex == 1 ? auditUserList : [],
        copyUserList: this.data.auditIndex == 1 ? copyUserList : []
      })
      .then((res) => {
        wx.showToast({
          title: '创建成功',
          duration: 1000
        })
        setTimeout(() => {
          if (this.data.isGuide) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
              isGuide: true,
              'guide.guideStatus': '2'
            })
          }
          if (this.data.auditIndex == 1) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.navigateTo({
              url: '../departure_detail/departure_detail?activetab=send&departureid=' + res + '&backmakeup=show',
            })
          }
        }, 1000)
      })
  },
  closePreview: function() {
    this.setData({
      previewShow: false
    })
  },
  formReset: function(e) {
    console.log(e)
  },
  selectDone: function(person) {
    if (person.type === 'audit') {
      this.data.auditList.push(person)
      this.setData({
        auditList: this.data.auditList
      })
    } else {
      this.data.copyList.push(person)
      this.setData({
        copyList: this.data.copyList
      })
    }

  },
  delPerson: function(e) {
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    if (type === 'audit') {
      this.data.auditList.splice(index, 1)
      this.setData({
        auditList: this.data.auditList
      })
    } else {
      this.data.copyList.splice(index, 1)
      this.setData({
        copyList: this.data.copyList
      })
    }
  },
  // 选择
  genderChange: function(e) {
    this.setData({
      genderIndex: e.detail.value
    })
    console.log(this.data.genderIndex)
  },
  auditChange: function(e) {
    this.setData({
      auditIndex: e.detail.value
    })
    let processMode = getProcessMode()
    // 如果没有线上流程又选择了添加审批人
    if (e.detail.value == 1 && processMode == 0) {
      let that = this
      wx.showModal({
        title: '',
        content: '当前公司选择的是线下审批模式，是否要修改为线上审批并添加审批人？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../share_page/share_page',
            })
          } else if (res.cancel) {
            that.setData({
              auditIndex: 0
            })
          }
        }
      })
    } else if (e.detail.value == 1) {
      this.pageScrollToBottom()
    }
    // 如果是引导
    if (this.data.isGuide) {
      let bool = this.data.auditIndex == 0 ? false : true
      this.changeGuide(bool)
    }
  },
  startTimeChange: function(e) {
    this.setData({
      entryDate: e.detail.value
    })
  },
  applyTimeChange: function(e) {
    this.setData({
      applyDate: e.detail.value
    })
  },
  departureTimeChange: function(e) {
    this.setData({
      departureDate: e.detail.value
    })
  },
  reasonOneChange: function(e) {
    this.setData({
      reasonOneIndex: e.detail.value
    })
  },
  personalChange: function(e) {
    this.setData({
      personalIndex: e.detail.value
    })
  },
  officalChange: function(e) {
    this.setData({
      officalIndex: e.detail.value
    })
  },
  pageScrollToBottom: function() {
    console.log('触发')
    wx.createSelectorQuery().select('#create-wrap').boundingClientRect(function(rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  gotoSelect: function(e) {
    if (this.data.isGuide) {
      wx.navigateTo({
        url: '../select_auditCopy/select_auditCopy?mode=isGuide&type=' + e.currentTarget.dataset.type,
      })
    } else {
      wx.navigateTo({
        url: '../select_auditCopy/select_auditCopy?type=' + e.currentTarget.dataset.type,
      })
    }
  }
})