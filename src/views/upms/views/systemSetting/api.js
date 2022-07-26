import request from '@/router/axios'

// 获取当前租户信息
export const getTenantInfo= () => {
    return request({
        url: `/mgr/jvs-auth/index/this/tenant`,
        method: 'get'
    })
}