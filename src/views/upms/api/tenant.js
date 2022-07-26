import request from "@/router/axios";

// 获取租户数据列表
export function getTenantList(data) {
  return request({
    url: "/mgr/jvs-auth/tenant/page",
    method: "get",
    params: data
  });
}

// 删除租户
export function deleteTenant(id) {
  return request({
    url: `/mgr/jvs-auth/tenant/${id}`,
    method: "delete"
  });
}

// 新增租户
export function addTenant(data) {
  return request({
    url: `/mgr/jvs-auth/tenant`,
    method: "post",
    data: data
  });
}

// 修改租户
export function editTenant(data) {
  return request({
    url: `/mgr/jvs-auth/tenant/info`,
    method: "put",
    data: data
  });
}

// 禁用或启用租户
export function enableTenant(id, state) {
  return request({
    url: `/mgr/jvs-auth/tenant/enable/${id}/${state}`,
    method: "put"
  });
}

// 权限菜单树
export function getMenuTree() {
  return request({
    url: "/mgr/jvs-auth/menu/tree",
    method: "get"
  });
}

// 租户权限回显
export function getPermision(id) {
  return request({
    url: `/mgr/jvs-auth/tenant/permissions/${id}`,
    method: "get"
  });
}

// 设置租户权限
export function permissions(id, data) {
  return request({
    url: `/mgr/jvs-auth/tenant/permissions/${id}`,
    method: "post",
    data: data
  });
}

// 获取租户详情
export function getTenantDetail(tenantId) {
  return request({
    url: `/mgr/jvs-auth/tenant/info/${tenantId}`,
    method: "get"
  });
}
