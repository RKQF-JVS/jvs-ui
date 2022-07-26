import request from "@/router/axios";
import store from "@/store";
import {scope, client_id, client_secret, grant_type, ETag} from '@/const/const'

export const loginByUsername = (username, password, code, randomStr) => {
  return request({
    url: `/auth/oauth/token`,
    headers: {
      isToken: false,
      ETag: ETag
    },
    method: "post",
    params: { username, password, grant_type, scope, client_id, client_secret }
  });
};

export const userManager = (data) => {
  return request({
    url: `/mgr/risk-gadget-jvs/usermanager?tenantId=${data.tenantId}&tenantName=${data.tenantName}&userName=${data.userName}`,
    method: 'post',
    data: data
  })
}

export const refreshToken = (refresh_token, tenantId) => {
  const grant_type = "refresh_token";
  return request({
    url: "/auth/oauth/token",
    headers: {
      isToken: false,
    },
    method: "post",
    params: { grant_type, scope, client_id, client_secret, refresh_token: refresh_token, switch: tenantId }
  });
};

// 获取系统基本信息
// ico、title、登录背景、logo
export function getDomain(params) {
  return request({
    url: "/api/domain",
    method: "get",
    headers: {
      isToken: false
    },
    params: { client_id }
  });
}

export function getQRcode(params) {
  return request({
    url: "/mgr/jvs-auth/oauth",
    method: "get",
    params: params
  });
}

export function getCheck(data) {
  return request({
    url: "/weixin/check",
    method: "get",
    params: data,
    // 设置超时时间,直接进行下一次请求
    timeout: 30 * 1000
  });
}

export function getAllTentan(data) {
  return request({
    url: "/mgr/jvs-auth/tenant/list",
    method: "get"
  });
}

// 发送验证码
export function getPhone(data) {
  return request({
    url: `/auth/phone/sms/verification/${data.phone}`,
    method: "get"
  });
}

// 注册发送验证码
export function getRegPhoneCode(data) {
  return request({
    url: `/auth/phone/sms/register/${data.phone}`,
    method: "get"
  });
}

// 忘记密码---发送验证码
export function getPhoneCode(data) {
  return request({
    url: `/mgr/jvs-auth/reset/code/${data.phone}/${data.idStr}`, // /mgr/jvs-auth/user/phone/${data.phone}
    method: "get"
  });
}

// 验证码登录
export function codeLogin(data) {
  return request({
    url: "/auth/login/other",
    method: "get",
    headers: {
      isToken: false,
      // ETag: "Basic ZnJhbWU=",
      // tenantId: store.getters.tenantId ? store.getters.tenantId : 0
    },
    params: { client_id, client_secret, login_other_auth_parameter: data }
  });
}
// 微信登录
export function wxOpenidLogin(data) {
  return request({
    url: "/auth/login/wx/token",
    method: "get",
    headers: {
      isToken: false,
      ETag: "Basic ZnJhbWU="
    },
    params: data
  });
}
// APP二维码登录
export function appQrLogin(data) {
  return request({
    url: "/mgr/jvs-auth/app/oauth",
    method: "get",
    headers: {
      isToken: false,
      ETag: "Basic ZnJhbWU="
    },
    params: data
  });
}

// 检查APP扫码
export function appCheck(data){
  return request({
    url: `/mgr/jvs-auth/app/check/${data.uuid}`,
    method: "get",
    headers: {
      isToken: false,
      ETag: "Basic ZnJhbWU="
    },
    params: data
  });
}
// app登录
export function appLogin(data) {
  return request({
    url: "/auth/login/app/token",
    method: "get",
    headers: {
      isToken: false,
      ETag: "Basic ZnJhbWU="
    },
    params: data
  });
}


export const resetPass = (data) => {
  return request({
    url: "/mgr/jvs-auth/reset/verify/password",
    headers: {
      isToken: false,
      ETag: "Basic ZnJhbWU=",
      // Accept: "application/x-www-form-urlencoded"
      "Content-type": "text/plain", // "application/json"
    },
    method: "post",
    data, // {ciphertext: str}
  });
};


// 获取登录账号关联的所有租户
export function getTenantByUser() {
  return request({
    url: "/mgr/jvs-auth/user/tenants",
    method: "get"
  });
}

// 切换租户登录
export function tenantLogin(tenantId) {
  return request({
    url: "/mgr/jvs-auth/user/switch/tenant?tenantId="+tenantId,
    method: "post"
  });
}

// 获取公告
export function getBulletin(appKey) {
  return request({
    url: `/mgr/jvs-auth//index/bulletin/${appKey}`,
    method: "get"
  });
}
