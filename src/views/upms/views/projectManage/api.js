import request from '@/router/axios'
let base = '/mgr/jvs-design/'

// 分页查询
export const pageList = (params) => {
  return request({
    url: base + `/JvsApp/page`,
    method: 'get',
    params:  params
  })
}

// 新增
export const add = (data) => {
  return request({
    url: base + `/JvsApp/save`,
    method: 'post',
    data:  data
  })
}

// 编辑
export const edit = (data) => {
  return request({
    url: base + `/JvsApp/edit`,
    method: 'put',
    data:  data
  })
}

// 删除
export const del = (id) => {
  return request({
    url: base + `/JvsApp/del/${id}`,
    method: 'delete',
  })
}

// 分页查询模板
export const templateList = (params) => {
  return request({
    url: base + `/JvsApp/template`,
    method: 'get',
    params:  params
  })
}

// 发布
export const publish = (id) => {
  return request({
    url: base + `/JvsApp/deploy/${id}`,
    method: 'put',
  })
}

// 发布到模板
export const publishToTemplate = (data) => {
  return request({
    url: base + `/JvsApp/deployTemplate`,
    method: 'post',
    data: data
  })
}

// 卸载
export const unload = (id) => {
  return request({
    url: base + `/JvsApp/unload/${id}`,
    method: 'put',
  })
}

// 获取应用类型字典
export const getProjectType = (params) => {
  return request({
    url: `/mgr/jvs-auth//api/dict/type/jvsapp`,
    method: 'get',
  })
}
