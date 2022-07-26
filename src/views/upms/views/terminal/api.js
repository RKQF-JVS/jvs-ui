import request from '@/router/axios'

// 操作日志分页查询
export const getLogs = (params) => {
  return request({
    url: `/mgr/jvs-auth/oauthClient/page`,
    method: 'get',
    params:  params
  })
}

// 新增
export const addRow = (data) => {
  return request({
    url: `/mgr/jvs-auth/oauthClient`,
    method: 'post',
    data:  data
  })
}

// 修改
export const editRow = (data) => {
  return request({
    url: `/mgr/jvs-auth/oauthClient/edit`,
    method: 'put',
    data:  data
  })
}

// 删除
export const delRow = (clientId) => {
  return request({
    url: `/mgr/jvs-auth/oauthClient/${clientId}`,
    method: 'delete'
  })
}