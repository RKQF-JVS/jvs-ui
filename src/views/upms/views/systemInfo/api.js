import request from '@/router/axios'

// 获取基础信息
export const getBasicDataInfo = () => {
  return request({
    url: `/mgr/jvs-auth//tenant/admin/base`,
    method: 'get',
  })
}

