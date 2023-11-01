import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: '/mgr/weixin-mp/wx/account/list',
    method: 'get',
    params: data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/add`,
    method: 'post',
    data: data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/update`,
    method: 'post',
    data: data
  })
}
export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/delete`,
    method: 'post',
    params: data
  })
}

export function fetchAllAccount() {
  return request({
    url: `/mgr/weixin-mp/wx/account/listAll`,
    method: 'post'
  })
}

export function generateQRUrl(data) {
  return request({
    url: `/mgr/weixin-mp/wx/account/generateQRUrl`,
    method: 'post',
    data
  })
}

export function listTreeWxAccount() {
  return request({
    url: `/mgr/weixin-mp/wx/account/listTreeWxAccount`,
    method: 'post'
  })
}
