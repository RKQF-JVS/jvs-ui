import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/list`,
    method: 'get',
    params: data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/add`,
    method: 'post',
    data: data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/update`,
    method: 'post',
    data: data
  })
}
export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/delete`,
    method: 'post',
    params: data
  })
}

export function syncAccountFans(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/syncAccountFans`,
    method: 'post',
    data: data
  })
}

export function sendMsg(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/fans/sendMsg`,
    method: 'post',
    data: data
  })
}
