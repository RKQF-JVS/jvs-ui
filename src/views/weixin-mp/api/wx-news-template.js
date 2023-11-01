import request from "@/router/axios";

export function fetchList(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/list`,
    method: 'get',
    params:data
  })
}

export function createRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/add`,
    method: 'post',
    data
  })
}

export function updateRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/update`,
    method: 'post',
    data
  })
}
export function deleteRow(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/delete`,
    method: 'post',
    params:data
  })
}

export function addNews(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/addNews`,
    method: 'post',
    data
  })
}

export function getNews(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/getNews`,
    method: 'post',
    params:data
  })
}

export function uploadNews(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/uploadNews`,
    method: 'post',
    data
  })
}
//查询已经上传的图文
export function fetchAllNewsTpl(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/listAll`,
    method: 'post',
    params:data
  })
}

//查询过滤某个公众号下的粉丝
export function filterFans(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/filterFans`,
    method: 'post',
    params:data
  })
}

export function sendNewsPreview(data) {
  return request({
    url: `/mgr/weixin-mp/wx/news/template/sendNewsPreview`,
    method: 'post',
    data
  })
}

