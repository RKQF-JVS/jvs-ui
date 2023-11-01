import request from '@/router/axios'
let base = '/mgr/report'

// 列表
export function getTableList (params) {
  return request({
    url: base + `/api/screen/template/page`,
    method: 'get',
    params: params
  })
}

// 新增
export function addRow (data) {
  return request({
    url: base + `/api/screen/template/save`,
    method: 'post',
    data: data
  })
}

// 编辑
export function editRow (data) {
  return request({
    url: base + `/api/screen/template/update`,
    method: 'put',
    data: data
  })
}

// 删除
export function delRow (id) {
  return request({
    url: base + `/api/screen/template/${id}`,
    method: 'delete'
  })
}

// 获取设计
export function getScreenDesignInfo (id) {
  return request({
    url: base + `/api/screen/template/${id}`,
    method: 'get'
  })
}

// 保存设计
export function saveDesign (data) {
  return request({
    url: base + `/api/screen/template/design`,
    method: 'post',
    data: data
  })
}