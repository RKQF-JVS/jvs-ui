import request from '@/router/axios'

// 获取移动端基础配置
export const getConfig=(params) => {
  return request({
    // url: `/mgr/jvs-auth/sys/config/${params.name}`,
    url: `/mgr/jvs-auth/tenant/admin/base/config/${params.name}`,
    method: 'get',
  })
}

// 移动端基础配置
export const setConfig=(data, tenantId) => {
  return request({
    // url: `/mgr/jvs-auth/sys/config/${data.role}/${data.name}`,
    url: `/mgr/jvs-auth/sys/config/${tenantId}/frame/APPBASCSETTING`,
    method: 'post',
    data: data
  })
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
