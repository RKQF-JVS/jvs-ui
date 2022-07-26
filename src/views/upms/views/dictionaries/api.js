import request from '@/router/axios'

// 分页查询字典列表
export const getDictionaries=(params) => {
  return request({
    // url: `/mgr/jvs-auth/dict/page`,
    url: `/mgr/jvs-auth/dict/page`,
    method: 'get',
    params: params
  })
}

// 新增字典
export const addDict=(data) => {
  return request({
    url: `/mgr/jvs-auth/dict`,
    method: 'post',
    data: data
  })
}

// 修改字典
export const editDict=(data) => {
  return request({
    url: `/mgr/jvs-auth/dict`,
    method: 'put',
    data: data
  })
}

// 删除字典
export const delDict=(id) => {
  return request({
    url: `/mgr/jvs-auth/dict/${id}`,
    method: 'delete'
  })
}

// 通过id查询字典项
export const getDicItem=(id) => {
  return request({
    url: `/mgr/jvs-auth/dict/item/${id}`,
    method: 'get'
  })
}

// 新增或者修改字典项
export const addDicItem=(id, data) => {
  return request({
    url: `/mgr/jvs-auth/dict/item/${id}`,
    method: 'post',
    data: data
  })
}
