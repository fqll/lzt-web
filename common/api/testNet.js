import {
  HTTP
} from "../js/http.js"

class ApiTest extends HTTP {
  getOpenId(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/openid/get',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  getUserInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getUserInfo',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 创建公司时获取可选择的角色
  getRoleList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getRoleList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  postCreateCompany(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/newCompany',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  getSearchCompany(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/getCompanyList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 申请加入公司
  postCompanyJoin(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/join',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  getRoleIndexInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getCurrentUserInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  getManageUserList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getManageUserList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 获取下拉列表选项
  getSelectList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/common/getSelectList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  createNewDeparture(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/newDeparture',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 员工填写表单按照id查询信息
  getFillDepartureInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getFillDepartureInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  submitDeparture(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/submitDeparture',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  auditDeparture(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/auditDeparture',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 关注
  doFollow(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/follow',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询离职
  getDelayEntry(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/entry/getDelayEntry',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 预备入职
  readyToEntry(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/entry/delayEntry',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 入职
  attendCompany(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/entry/join',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询聊天列表
  getChatList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/chat/getChatList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 发消息
  sendMsg(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/chat/sendMsg',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询加入公司待审批列表
  getAttendList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/getAuditUserList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 审批加入公司的员工
  auditAttend(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/audit',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询我的离职证明列表
  getDepartureList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getDepartureList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询员工列表
  getUserList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/getUserList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 更新员工角色信息
  updateRole(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/updateRole',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 校验员工姓名在企业中的唯一性
  checkNameUnique(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/checkNameUnique',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询公司小程序码
  getCompanyImage(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/getCompanyImage',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询公司详情
  getCompanyInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/getCompanyInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询审批信息
  getAuditInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getAuditInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询离职证明详情
  getDepartureInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getDepartureInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 撤回离职
  cancelDepartureInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/cancelDepartureInfo',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 分享离职表单
  shareDepartureInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/shareDepartureInfo',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 设置主企业
  setDefault(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/setDefault',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询离职员工库
  getQuitEmployeeList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getQuitEmployeeList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询公司离职率
  getDepartureRate(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getDepartureRate',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 修改公司在职人数
  updateIncumbentsCount(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/updateIncumbentsCount',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询全部权限
  getAuthorityList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/getAuthorityList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 设置审批信息为已读
  setAlreadyRead(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/setAlreadyRead',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询离职原因分析
  getDepartureReasonInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getDepartureReasonInfo',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 草稿箱
  getDraftList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/getDraftList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 删除草稿状态的离职表单
  deleteSave(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/deleteDeparture',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 编辑离职证明
  editDeparture(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/departure/editDeparture',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 工作台首页展示待办事项红点
  getUserIndex (data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/index',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 查询引导版本待办理预入职离职证明详情
  getEntryGuideInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/guide/getEntryDepartureInfoDetail',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 完善用户信息
  completedUserInfo(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/user/completedUserInfo',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
  // 查询背调列表
  getEmployeeCheckList(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/entry/getEmployeeCheckList',
      data: data,
      method: 'GET',
      contentType: 'application/json'
    })
  }
  // 邀请加入公司
  companyInvite(data) {
    return this.request({
      urlAbbr: 'wx',
      url: '/company/invite',
      data: data,
      method: 'POST',
      contentType: 'application/json'
    })
  }
}
export {
  ApiTest
}