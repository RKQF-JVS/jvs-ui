import request from '@/router/axios'
let base = '/mgr/report'
// 列表
export function getTableList (params) {
  return request({
    url: base + `/api/reportDatasource/page`,
    method: 'get',
    params: params
  })
}

// 新增
export function addRow (data) {
  return request({
    url: base + `/api/reportDatasource/save`,
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
    url: base + `/api/reportDatasource/${id}`,
    method: 'delete'
  })
}