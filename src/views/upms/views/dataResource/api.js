import request from '@/router/axios'

// 分页查询数据源列表
export const getDatasourceList=(params) => {
  return request({
    url: `/mgr/jvs-generator/gen/datasource/page`,
    method: 'get',
    params: params
  })
}

// 新增数据源
export const addDatasource=(data) => {
  return request({
    url: `/mgr/jvs-generator/gen/datasource`,
    method: 'post',
    data: data
  })
}

// 修改数据源
export const editDatasource=(data) => {
  return request({
    url: `/mgr/jvs-generator/gen/datasource`,
    method: 'put',
    data: data
  })
}

// 删除数据源
export const delDatasource=(id) => {
  return request({
    url: `/mgr/jvs-generator/gen/datasource/${id}`,
    method: 'delete',
  })
}
// 连接测试
export const testConnect=(id) => {
  return request({
    url: `/mgr/jvs-generator/gen/datasource/test/${id}`,
    method: 'get',
  })
}
