//本地api
const apiLocalUrl_wx = "http://departure.local.fanqiele.com"
//正式api
const apiProUrl_wx = "https://departure.fanqiele.com"
// 审核apit
const apiAuditUrl_wx = "https://preview.fanqiele.com/"
// 以后测试环境
const apiTestUrl_wx = "https://lzt.fanqiele.com/"
//微信appId
var appId;
if (wx.getAccountInfoSync) {
  appId = wx.getAccountInfoSync().miniProgram.appId;
} else {
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
} 
module.exports= {
  appId: appId,
  apiUrl_wx: apiProUrl_wx
}