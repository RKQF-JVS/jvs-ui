import request from '@/router/axios'

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
