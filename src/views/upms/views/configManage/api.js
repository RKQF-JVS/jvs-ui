import request from '@/router/axios'

// 配置管理分页查询
export const getConfigPage = (params) => {
  return request({
    url: `/mgr/jvs-auth/config`,
    method: 'get',
    params:  params
  })
}

// 新增
export const addConfig = (data) => {
  return request({
    url: `/mgr/jvs-auth/config`,
    method: 'post',
    data:  data
  })
}

// 修改
export const editConfig = (data) => {
  return request({
    url: `/mgr/jvs-auth/config`,
    method: 'put',
    data:  data
  })
}

// 删除
export const delConfig = (configId) => {
  return request({
    url: `/mgr/jvs-auth/config/${configId}`,
    method: 'delete'
  })
}

// 重新加载
export const reloadConfig = () => {
  return request({
    url: `/mgr/jvs-auth/config/reload`,
    method: 'put'
  })
}
