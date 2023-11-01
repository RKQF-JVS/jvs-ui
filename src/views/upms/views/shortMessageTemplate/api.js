import request from '@/router/axios'

// 获取短信消息模板列表数据
export const getShortMessageTempList=(params) => {
  return request({
    url: `/mgr/jvs-auth/tenant/admin/base/SMS/message`,
    method: 'get',
    params: params
  })
}


// 设置为绑定模板
export const setBand=(params) => {
  return request({
    url: `/mgr/jvs-auth//tenant/admin/base/SMS/login/messageCode`,
    method: 'get',
    params: params
  })
}
