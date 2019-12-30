
import { cloneDeep } from "../../../utils/util.js"
//index.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    num: {
      type: Number,
      value: ''
    },
    type: {
      type: String,
      value: 'number'
    },
    name: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击黑色蒙版和取消
    //设置userInfo
    bindGetUserInfo(e) {
      this.triggerEvent('closeModal')
    },
    inputContent(e) {
      this.data.num = e.detail.value
    },
    inputName(e) {
      this.data.name = e.detail.value
      this.data.content = e.detail.value
      this.setData({
        content: e.detail.value
      })
    },
    cancel() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('cancelForm')
    },
    sureShare () {
      this.triggerEvent('rejectForm', this.data.name)
    },
    onSure() {
      if (this.data.type === 'number') {
        if (this.data.num) {
          this.triggerEvent('rejectForm', this.data.num)
        } else {
          wx.showToast({
            title: '请填写人数',
            icon: 'none',
            duration: 2000
          })
        }
      } else if (this.data.type === 'name') {
        if (this.data.name) {
          this.triggerEvent('rejectForm', this.data.name)
        } else {
          wx.showToast({
            title: '请填写代称',
            icon: 'none',
            duration: 2000
          })
        }
      } 
    }
  }
})