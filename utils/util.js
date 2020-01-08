const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 深度拷贝数据
const cloneDeep = function (obj) {
  let objCloned;
  if (Array.isArray(obj)) {
    objCloned = [];
    for (let i = 0; i < obj.length; i++) {
      objCloned[i] = cloneDeep(obj[i]);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    objCloned = {};
    Object.getOwnPropertyNames(obj).map(item =>
      objCloned[item] = cloneDeep(obj[item]));
  }
  return obj;
};
// 返回颜色
const colorBack = function (text) {
  if (text === '待审批') {
    return '#f12b47'
  } else if (text === '同意离职' || text === '已办结') {
    return '#4885fa'
  } else if (text === '已撤回') {
    return '#999999'
  } else if (text === '拒绝离职' || text === '审批退回') {
    return '#f12b47'
  }
};
const getProcessMode = function () {
  let companyId = wx.getStorageSync('companyId')
  let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
  let processMode = ''
  userInfo.companyInfoList.forEach((el, index) => {
    if (el.companyId == companyId) {
      processMode = el.processMode
    }
  })
  return processMode
}
module.exports = {
  formatTime: formatTime,
  cloneDeep: cloneDeep,
  colorBack: colorBack,
  getProcessMode: getProcessMode
}
