import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: '/api/wx/receive/text/list',
    method: 'post',
    params:data
  })
}

export function createRow(data) {
  return request({
    url: '/api/wx/receive/text/add',
    method: 'post',
    data
  })
}

export function updateRow(data) {
  return request({
    url: '/api/wx/receive/text/update',
    method: 'post',
    data
  })
}
export function deleteRow(data) {
  return request({
    url: '/api/wx/receive/text/delete',
    method: 'post',
    params:data
  })
}
