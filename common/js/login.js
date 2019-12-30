import {appId} from "../../config/config.js"

// 微信授权
const wxAuthorize = () => {
  return new Promise((resolve, reject) => {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

// 登陆
const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res.code)
      }
    })
  })
}

export{
  wxAuthorize,
  wxLogin
}