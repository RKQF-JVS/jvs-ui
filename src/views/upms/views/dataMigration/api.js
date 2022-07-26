import request from '@/router/axios'

// 操作日志分页查询
export const getLogs = (params) => {
  return request({
    url: `/mgr/jvs-auth/data/service/page`,
    method: 'get',
    params:  params
  })
}

// 新增
export const addRow = (data) => {
  return request({
    url: `/mgr/jvs-auth/version/save`,
    method: 'post',
    data:  data
  })
}