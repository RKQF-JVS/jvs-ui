import request from '@/router/axios'

// 保存oauth配置
export const saveOauthConfig=(params, tenantId) => {
  return request({
    url: `/mgr/jvs-auth/sys/config/${tenantId}/frame/OAUTHLOGIN`,
    method: 'post',
    data: params
  })
}

// 获取oauth配置
export const getOauthConfig=() => {
  return request({
    url: `/mgr/jvs-auth/tenant/admin/base/config/OAUTHLOGIN`,
    method: 'get',
  })
}
