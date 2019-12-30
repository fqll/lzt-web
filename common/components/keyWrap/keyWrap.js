
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击黑色蒙版和取消
    //设置userInfo
    inputContent(e) {
      this.data.num = e.detail.value
    },
    onSure() {
      if (this.data.num) {
        this.triggerEvent('makeSure', this.data.num)
      } else {
        wx.showToast({
          title: '请填写',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})