import request from "@/router/axios";

const base = "/mgr";

// 修改密码
export function editPass(obj) {
  return request({
    url: `/mgr/jvs-auth//index/user/change/password`,
    method: "post",
    data: obj
  });
}

// 获取当前用户信息
export function getUserInfo() {
  return request({
    url: "/mgr/jvs-auth/index/user/info",
    method: "get"
  });
}

// 获取当前登录用户所在租户信息
export function getUserTenantInfo() {
  return request({
    url: "/mgr/jvs-auth/index/this/tenant",
    method: "get"
  });
}

// 我的组织
export function getMyTenantList() {
  return request({
    url: "/mgr/jvs-auth/index/my/tenants",
    method: "get"
  });
}

// 解散我的组织
export function delMyTenantList(tenantId) {
  return request({
    url: `/mgr/jvs-auth/index/my/tenant/${tenantId}`,
    method: "delete"
  });
}

// 已经加入的组织
export function getJoinTenantList() {
  return request({
    url: "/mgr/jvs-auth/index/tenants",
    method: "get"
  });
}

// 退出组织
export function delJoinTenantList(tenantId) {
  return request({
    url: `/mgr/jvs-auth//index/tenant/${tenantId}`,
    method: "get"
  });
}

// 绑定邮箱
export function bindEmail(data) {
  return request({
    url: "/mgr/jvs-auth/index/bind/email",
    method: "put",
    params: data
  });
}

// 解绑邮箱
export function unbindEmail() {
  return request({
    url: "/mgr/jvs-auth/index/bind/email",
    method: "delete"
  });
}

// 发送邮箱验证码
export function sendEmailCode(params) {
  return request({
    url: "/mgr/jvs-auth/index/send/email/code",
    method: "get",
    params: params
  });
}

// 绑定手机
export function bindPhone(data) {
  return request({
    url: "/mgr/jvs-auth/index/bind/phone",
    method: "put",
    params: data
  });
}

// 解除手机绑定
export function unbindPhone() {
  return request({
    url: "/mgr/jvs-auth/index/bind/phone",
    method: "delete"
  });
}

// 发送手机验证码
export function sendPhoneCode(phone) {
  return request({
    url: `/auth/phone/sms/bind/${phone}`, // `/auth/phone/sms/verification/${phone}`,
    method: "get",
  });
}

// 绑定微信
export function bindWX(params) {
  return request({
    url: "/mgr/jvs-auth/index/bind/wx",
    method: "put",
    params: params
  });
}

// 解除微信绑定
export function unbindWX() {
  return request({
    url: "/mgr/jvs-auth/index/bind/wx",
    method: "delete"
  });
}

// 修改密码
export function setPassWord(data) {
  return request({
    url: "/mgr/jvs-auth/index/user/change/password",
    method: "post",
    data: data
  });
}

// 注销帐号
export function loginOff() {
  return request({
    url: "/mgr/jvs-auth/index/logoff",
    method: "put",
  });
}

// 获取短信验证码
export function getMessCode(phone) {
  // return request({
  //   url: `${base}/msg/phone/${phone}`,
  //   method: "get"
  // });
  return request({
    url: `${base}/upms/user/phone/${phone}`,
    method: "get"
  });
}

// 重置手机号或绑定
export function editPhone(obj) {
  return request({
    url: `${base}/upms/user/phone/binding/${obj.phone}/${obj.code}`,
    method: "put",
    data: obj
  });
}

export function fetchList(query) {
  return request({
    url: "/admin/user/page",
    method: "get",
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: "/admin/user",
    method: "post",
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "get"
  });
}

export function delObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "delete"
  });
}

export function putObj(obj) {
  return request({
    url: "/admin/user",
    method: "put",
    data: obj
  });
}

export function getDetails(obj) {
  return request({
    url: "/admin/user/details/" + obj,
    method: "get"
  });
}

// 通过code置换用户信息
export function codeGetUserInfo(data) {
  return request({
    url: `/mgr/jvs-auth/oauth/${data.code}`,
    method: "get"
  });
}
// 绑定openId
export function bindOpenId(data) {
  return request({
    url: `/mgr/jvs-auth/user/wx/binding/${data.openId}`,
    method: "post"
  });
}
