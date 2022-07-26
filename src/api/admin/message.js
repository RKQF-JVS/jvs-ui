import request from '@/router/axios'

export function messageaPage (query) {
    return request({
        url: '/mgr/jvs-auth/userlog/page',
        method: 'get',
        params: query
    })
}

export function deleteMessage (id) {
    return request({
        url: `/mgr/jvs-auth/userlog/hide/${id}`,
        method: 'delete'
    })
}

export function readMessage (id) {
    return request({
        url: `/mgr/jvs-auth/userlog/read/${id}`,
        method: 'put'
    })
}