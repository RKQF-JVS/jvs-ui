import request from '@/router/axios'

// 获取图标库
export function getIcon () {
  return request({
    url: `/mgr/jvs-auth/icon/all`,
    method: 'get'
  })
}