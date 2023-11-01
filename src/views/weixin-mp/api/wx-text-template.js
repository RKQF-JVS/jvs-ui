import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: '/mgr/weixin-mp//wx/text/template/list',
    method: 'get',
    params: data
  })
}

export const createRow = (data) => {
  return request({
    url: `/mgr/weixin-mp/wx/text/template/add`,
    method: 'post',
    data:  data
  })
}

export function updateRow(data) {
  return request({
    url: '/mgr/weixin-mp/wx/text/template/update',
    method: 'post',
    data: data
  })
}
export function deleteRow(data) {
  return request({
    url: '/mgr/weixin-mp/wx/text/template/delete',
    method: 'post',
    data:data
  })
}

export function fetchAllTextTpl() {
  return request({
    url: '/mgr/weixin-mp/wx/text/template/listAll',
    method: 'post'
  })
}
