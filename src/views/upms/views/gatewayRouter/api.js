import request from "@/router/axios";

// 分页查询网关路由列表
export const getGatewayRouteList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayRoutePo/page`,
    method: 'get',
    params: params
  })
}

// 刷新网关路由
export const refreshGatewayRouteList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayRoutePo/refresh`,
    method: 'get',
  })
}

// 新增网关路由
export const addGatewayRoute=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayRoutePo/save`,
    method: 'post',
    data: data
  })
}

// 编辑网关路由
export const editGatewayRoute=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayRoutePo/edit`,
    method: 'put',
    data: data
  })
}

// 删除网关路由
export const delGatewayRoute=(id) => {
  return request({
    url: `/mgr/jvs-auth/GatewayRoutePo/del/${id}`,
    method: 'delete',
  })
}
