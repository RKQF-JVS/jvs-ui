import request from '@/router/axios'
// 我的资源列表
export const getUserPermission= () => {
    return request({
        url: `/mgr/jvs-auth/my/permission`,
        method: 'get'
    })
}

// 修改我的资源列表
export const editUserPermission= (data) => {
    return request({
        url: `/mgr/jvs-auth/my/permission`,
        method: 'put',
        data: data
    })
}