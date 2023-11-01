import request from '@/router/axios'
let base = '/mgr/report'
// 列表
export function getTableList (params) {
  return request({
    url: base + `/api/reportDatasource/getTableList`,
    method: 'get',
    params: params
  })
}

// 新增
export function addRow (data) {
  return request({
    url: base + `/api/reportDatasource/insert`,
    method: 'post',
    data: data
  })
}

// 编辑
export function editRow (data) {
  return request({
    url: base + `/api/reportDatasource/update`,
    method: 'put',
    data: data
  })
}

// 删除
export function delRow (id) {
  return request({
    url: base + `/api/reportDatasource/delete/${id}`,
    method: 'delete'
  })
}