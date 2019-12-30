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
    activeId: {
      type: String,
      value: ''
    },
    tabs: {
      type: Array,
      value: []
    },
    redShow: {
      type: Array,
      value: []
    },
    highlight: {
      type: Array,
      value: []
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
    changeTab: function (e) {
      this.setData({
        activeId: e.currentTarget.dataset.id
      })
      this.triggerEvent('changetab', e.currentTarget.dataset.id)
    }
  }
})