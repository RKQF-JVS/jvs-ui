import request from "@/router/axios";

// 分页查询网关地址忽略
export const getGatewayIgnoreList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayIgnorePathPo/page`,
    method: 'get',
    params: params
  })
}

// 刷新网关地址忽略
export const refreshGatewayIgnoreList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayIgnorePathPo/refresh`,
    method: 'get',
  })
}

// 新增网关地址忽略
export const addGatewayIgnore=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayIgnorePathPo/save`,
    method: 'post',
    data: data
  })
}

// 编辑网关地址忽略
export const editGatewayIgnore=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayIgnorePathPo/edit`,
    method: 'put',
    data: data
  })
}

// 删除网关地址忽略
export const delGatewayIgnore=(id) => {
  return request({
    url: `/mgr/jvs-auth/GatewayIgnorePathPo/del/${id}`,
    method: 'delete',
  })
}
