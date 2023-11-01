import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: `/mgr/weixin-mp/wx/subscribe/text/list`,
    method: 'get',
    params: data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/subscribe/text/add`,
    method: 'post',
    data: data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/subscribe/text/update`,
    method: 'post',
    data: data
  })
}
export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/subscribe/text/delete`,
    method: 'post',
    params: data
  })
}

