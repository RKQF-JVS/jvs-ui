import request from '@/router/axios'
import { client_id} from '@/const/const'

// 获取未读消息数量
export const getUnread = () => {
  return request({
    url: `/mgr/jvs-auth/userlog/unread`,
    method: "get"
  });
};

//获取所有系统列表
export const getAllSystemList = (clientId) => {
  return request({
    // url: `/mgr/jvs-auth/system/all`,
    url: `/mgr/jvs-auth/index/menu/${clientId}`,
    method: "get",
    // params: clientId
  });
};

//获取咨询支持
export const getSupport = () => {
  return request({
    url: `/get/nacos/config/apply_version_pricing.js`,
    method: "get",
  });
};

// 退出登录
export const loginoutHandle = () => {
  return request({
    url: `/auth/token/logout`,
    method: "get"
  });
};

// 修改租户
export function editUser(data) {
  return request({
    url: `/mgr/jvs-auth/tenant`,
    method: "put",
    data: data
  });
}

// 获取当前租户信息
export const getTenantInfo= () => {
  return request({
      // url: `/mgr/jvs-auth/tenant/this`,
      url: `/mgr/jvs-auth/index/this/tenant`,
      method: 'get'
  })
}

// 修改主题
export function editTheme(data) {
  return request({
    url: `/mgr/jvs-auth/tenant/theme`,
    method: "put",
    data: data
  });
}

// 菜单搜索
export const getSearchMenu= (search, appId) => {
  return request({
      url: `/mgr/jvs-auth/index/menu/${search}/${appId}`,
      method: 'get'
  })
}

// 获取前端跳转链接字典
export const getSystemHelpDict = (type) => {
  return request({
    url: `/mgr/jvs-auth/dict/type/${type}`,
    method: 'get'
  })
}

// 获取应用公告列表
export const getBulletinList = () => {
  return request({
    url: `/mgr/jvs-auth//index/bulletin/${client_id}`,
    method: 'get'
  })
}
