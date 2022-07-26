import request from '@/router/axios'
let base = '/mgr/jvs-auth/'

// 分页查询
export const pageList = (params) => {
  return request({
    url: base + `/bulletin/page`,
    method: 'get',
    params:  params
  })
}

// 新增
export const add = (data) => {
  return request({
    url: base + `/bulletin`,
    method: 'post',
    data:  data
  })
}

// 编辑
export const edit = (data) => {
  return request({
    url: base + `/bulletin`,
    method: 'put',
    data:  data
  })
}

// 删除
export const del = (data) => {
  return request({
    url: base + `/bulletin/${data.id}`,
    method: 'delete',
    params:  data
  })
}

// 发布
export const deploy = (data) => {
  return request({
    url: base + `/bulletin/deploy/${data}`,
    method: 'put',
    // data:  data
  })
}

// 卸载
export const unload = (data) => {
  return request({
    url: base + `/bulletin/unload/${data}`,
    method: 'put',
    // data:  data
  })
}
