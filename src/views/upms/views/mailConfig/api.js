import request from '@/router/axios'

// 保存邮箱配置
export const saveMailConfig=(params, tenantId) => {
  return request({
    url: `/mgr/jvs-auth/sys/config/${tenantId}/frame/EMAIL`,
    method: 'post',
    data: params
  })
}

// 获取邮箱配置
export const getMailConfig=() => {
  return request({
    url: `/mgr/jvs-auth/tenant/admin/base/config/EMAIL`,
    method: 'get',
  })
}
