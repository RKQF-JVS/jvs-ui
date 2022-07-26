import request from "@/router/axios";

// 角色下的租户
export function getTenantByRoleId(roleId, params) {
  return request({
    url: `/mgr/jvs-auth//role/tenant/user/${roleId}`,
    method: "GET",
    params: params
  });
}

// 移除租户
export function removeTenantByRoleId(roleId, tenantId) {
  return request({
    url: `/mgr/jvs-auth//role/tenant/${roleId}/${tenantId}`,
    method: "DELETE"
  });
}

// 租户添加到某个角色
export function addTenantToRole(roleId, data) {
  return request({
    url: `/mgr/jvs-auth//role/tenant/${roleId}`,
    method: "put",
    data: data
  });
}

// 获取所有租户
export function getAllTenant() {
  return request({
    url: `/mgr/jvs-auth//role/tenants`,
    method: "GET",
  });
}
