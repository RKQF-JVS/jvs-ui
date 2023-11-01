import request from '@/router/axios'

export function messageaPage (query) {
    return request({
        // url: '/mgr/jvs-auth/userlog/page',
        url: '/mgr/message-push/station/inside/notice/page',
        method: 'get',
        params: query
    })
}
export function messageAll () {
    return request({
        url: '/mgr/message-push/station/inside/notice/list',
        method: 'get',
    })
}
// 标记所有为已读
export const messageAllRead = ()=>{
  return request({
    url:`/mgr/message-push/station/inside/notice/all/read`,
    method:'get'
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

// 查询单条消息详情
export function getMessageDetail (id) {
  return request({
    // url: `/mgr/jvs-auth//userlog/${id}`,
    url: `/mgr/message-push//station/inside/notice/${id}/detail`,
    method: 'get',
  })
}
