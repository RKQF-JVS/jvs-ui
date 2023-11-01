import request from '@/router/axios'

// 列表
export const getPageList=(params, orders) => {
  return request({
    url: `/mgr/jvs-design/form/design/page${orders}`,
    method: 'get',
    params: params
  })
}

// 归类列表
export const getTypeList=() => {
  return request({
    url: `/mgr/jvs-design/form/design/types`,
    method: 'get'
  })
}

// 新增
export const addForm=(data) => {
  return request({
    url: `/mgr/jvs-design/form/design`,
    method: 'post',
    data: data
  })
}

// 编辑
export const editForm=(data) => {
  return request({
    url: `/mgr/jvs-design/form/design`,
    method: 'put',
    data: data
  })
}

// 获取详情
export const getDetail=(id) => {
  return request({
    url: `/mgr/jvs-design/form/design/${id}`,
    method: 'get',
    // params: params
  })
}

// 获取设计数据结构
export const getDataStr=(id) => {
  return request({
    url: `/mgr/jvs-design//dynamic/data/fields/${id}`,
    method: 'get',
    // params: params
  })
}

// 部署
export const deployForm=(id) => {
  return request({
    url: `/mgr/jvs-design/form/design/deploy/${id}`,
    method: 'put',
  })
}

// 卸载
export const undeployForm=(id) => {
  return request({
    url: `/mgr/jvs-design/form/design/unload/${id}`,
    method: 'post',
  })
}

// 删除
export const delForm=(id) => {
  return request({
    url: `/mgr/jvs-design/form/design/del/${id}`,
    method: 'delete'
  })
}

// // 部署的表单详情
// export const getFormInfo=(key) => {
//   return request({
//     url: `/mgr/jvs-design/form/design/deployed/${key}`,
//     method: 'get'
//   })
// }

// 部署的表单详情
export const getFormInfo=(id) => {
  return request({
    url: `/mgr/jvs-design/use/form/${id}`,
    method: 'get'
  })
}
