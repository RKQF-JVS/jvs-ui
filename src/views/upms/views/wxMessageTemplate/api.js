import request from '@/router/axios'

// 获取公众号消息模板列表数据
export const getWxMessageTempList=(params) => {
  return request({
    url: `/mgr/jvs-auth/tenant/admin/base/WECHAT_MP/message`,
    method: 'get',
    params: params
  })
}
