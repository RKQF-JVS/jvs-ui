import request from '@/router/axios'
let base = '/mgr/report'
// 获取设计
export function xxxx (id) {
  return request({
    url: base + `/api/screen/template/${id}`,
    method: 'get'
  })
}