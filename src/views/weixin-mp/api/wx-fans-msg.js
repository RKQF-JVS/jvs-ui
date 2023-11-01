import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: `/mgr/weixin-mp/wx/fans/msg/list`,
    method: 'get',
    params: data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/fans/msg/add`,
    method: 'post',
    data: data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/fans/msg/update`,
    method: 'post',
    data: data
  })
}

export function updateResContent(data) {
  return request({
    url: `/mgr/weixin-mp/wx/fans/msg/updateResContent`,
    method: 'post',
    data: data
  })
}

export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/fans/msg/delete`,
    method: 'post',
    params: data
  })
}
