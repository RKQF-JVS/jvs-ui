import request from '@/router/axios'

// 添加关键字信息
export function addDataAuth(data) {
    return request({
      url: "/mgr/jvs-auth/wx/save",
      method: "POST",
      data: data
    });
  }

  // 修改关键字信息
  export function editDataAuth(data) {
    return request({
      url: "/mgr/jvs-auth/wx",
      method: "PUT",
      data: data
    });
  }

  // 删除关键字信息
  export function delDataAuth(id) {
    return request({
      url: `/mgr/jvs-auth/wx/${id}`,
      method: "DELETE"
    });
  }

  // 数据关键字列表
export function getAuthPage(roleId, params) {
    return request({
      url: `/mgr/jvs-auth/wx/page`,
      method: "GET",
      params: params
    });
  }

// 指定管理员
export function setTenantManager(tenantId, userId) {
    return request({
      url: `/mgr/jvs-auth/tenant/${tenantId}/${userId}`,
      method: "GET"
    });
  }

// 获取租户应用配置
export const getAppSetByTenant=(tenantId) => {
  return request({
    url: `/mgr/jvs-auth/sys/config/tenant/app/${tenantId}`,
    method: 'get',
  })
}

// 保存租户应用配置
export const saveAppSetByTenant=(tenantId, appId, type, data) => {
  return request({
    url: `/mgr/jvs-auth/sys/config/${tenantId}/${appId}/${type}`,
    method: 'post',
    data: data
  })
}
