import request from "@/router/axios";

// 分页查询错误码列表
export const getErrCodeList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayCodePo/page`,
    method: 'get',
    params: params
  })
}

// 刷新错误码列表
export const refreshErrCodeList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayCodePo/refresh`,
    method: 'get',
  })
}

// 新增错误码
export const addErrCode=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayCodePo/save`,
    method: 'post',
    data: data
  })
}

// 编辑错误码
export const editErrCode=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayCodePo/edit`,
    method: 'put',
    data: data
  })
}

// 删除错误码
export const delErrCode=(id) => {
  return request({
    url: `/mgr/jvs-auth/GatewayCodePo/del/${id}`,
    method: 'delete',
  })
}
