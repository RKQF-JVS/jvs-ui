import request from '@/router/axios'

// 操作日志分页查询
export const getLogs = (params) => {
  return request({
    url: `/mgr/jvs-auth/login/log/page`,
    method: 'get',
    params:  params
  })
}