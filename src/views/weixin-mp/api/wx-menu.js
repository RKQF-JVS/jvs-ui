import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/list`,
    method: 'post',
    params:data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/add`,
    method: 'post',
    data: data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/update`,
    method: 'post',
    data: data
  })
}
export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/delete`,
    method: 'post',
    params: data
  })
}

export function listTreeMenu() {
  return request({
    url: `/mgr/weixin-mp/wx/menu/listTreeMenu`,
    method: 'post'
  })
}
export function validateData(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/validateData`,
    method: 'post',
    data
  })
}
export function syncAccountMenu(data) {
  return request({
    url: `/mgr/weixin-mp/wx/menu/syncAccountMenu`,
    method: 'post',
    data
  })
}
