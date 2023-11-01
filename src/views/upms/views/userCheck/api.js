import request from '@/router/axios'
let base = '/mgr/jvs-auth/'

// 获取用户等级列表
export const getInviteUserPage = (params) => {
  return request({
    url: base + `invite/page`,
    method: 'get',
    params: params
  })
}

// 审核通过|拒绝
export const checkHandle = (id, status) => {
  return request({
    url: base + `invite/status/${status}/${id}`,
    method: 'put',
  })
}
