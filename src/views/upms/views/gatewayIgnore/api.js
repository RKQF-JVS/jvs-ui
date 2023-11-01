import request from "@/router/axios";

// 分页查询网关加密忽略列表
export const getGatewayIgnoreList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayEncode/page`,
    method: 'get',
    params: params
  })
}

// 刷新网关加密忽略
export const refreshGatewayIgnore=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayEncode/refresh`,
    method: 'get',
  })
}

// 新增网关加密忽略
export const addGatewayIgnore=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayEncode/save`,
    method: 'post',
    data: data
  })
}

// 编辑网关加密忽略
export const editGatewayIgnore=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayEncode/edit`,
    method: 'put',
    data: data
  })
}

// 删除网关加密忽略
export const delGatewayIgnore=(id) => {
  return request({
    url: `/mgr/jvs-auth//GatewayEncode/del/${id}`,
    method: 'delete',
  })
}
