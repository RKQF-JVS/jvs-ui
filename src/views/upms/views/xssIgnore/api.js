import request from "@/router/axios";

// 分页查询网关路由列表
export const getGatewayIgnorePathPoList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayXss/page`,
    method: 'get',
    params: params
  })
}

// 刷新网关路由
export const refreshGatewayIgnorePathPoList=(params) => {
  return request({
    url: `/mgr/jvs-auth/GatewayXss/refresh`,
    method: 'get',
  })
}

// 新增网关路由
export const addGatewayIgnorePathPo=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayXss/save`,
    method: 'post',
    data: data
  })
}

// 编辑网关路由
export const editGatewayIgnorePathPo=(data) => {
  return request({
    url: `/mgr/jvs-auth/GatewayXss/edit`,
    method: 'put',
    data: data
  })
}

// 删除网关路由
export const delGatewayIgnorePathPo=(id) => {
  return request({
    url: `/mgr/jvs-auth/GatewayXss/del/${id}`,
    method: 'delete',
  })
}
