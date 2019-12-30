
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
    auth: {
      type: String,
      value: 'avatorPower'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击黑色蒙版和取消
    //设置userInfo
    bindGetUserInfo(e) {
      if (e.detail.encryptedData) { //确认授权
        app.globalData.getAuthUserInfo()
          .then(() => {
            app.globalData.onlyGetUserInfo(app.globalData.userInfo.wxInfo.avatarUrl)
              .then(() => {
                let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
                this.data.user = cloneDeep(userInfo)
                this.setData({
                  user: this.data.user
                })
              })
            this.triggerEvent('closeModal')
          })
          .catch(() => {
            console.log('失败')
          })
      } else { //拒绝授权

      }
    },
    openMsgGet: function() {
      let that = this
      console.log(123)
      wx.requestSubscribeMessage({
        tmplIds: ['ePVSz7E6Wkio1tUr7ym2vIU8Sct5jgsv8NK2rb0p5r0'],
        success(res) {
          console.log(res)
          that.setData({
            isShow: false
          })
        },
        fail(err) {
          that.setData({
            isShow: false
          })
        }
      })
    }
  }
})