import request from "@/router/axios";

// 获取全部角色信息
/**
 * tenantRole  租户角色
 * userRole   用户角色
 */
 export function getRoleList(type, data) {
  return request({
    url: `/mgr/jvs-auth/role/all/${type}`,
    method: "GET",
    params: data
  });
}

// 角色下的用户
export function getUserByRoleId(params) {
  return request({
    url: `/mgr/jvs-auth/role/user`,
    method: "GET",
    params: params
  });
}

// 添加角色
export function addRole(data) {
  return request({
    url: "/mgr/jvs-auth/role/save",
    method: "POST",
    data: data
  });
}
// 修改角色
export function editRole(data) {
  return request({
    url: "/mgr/jvs-auth/role/update",
    method: "PUT",
    data: data
  });
}

// 删除角色
export function delRoleId(id) {
  return request({
    url: `/mgr/jvs-auth/role/${id}`,
    method: "DELETE"
  });
}

// 移除用户
export function removeUSerByRoleId(roleId, userId) {
  return request({
    url: `/mgr/jvs-auth/role/user/${roleId}/${userId}`,
    method: "DELETE"
  });
}

// 获取角色数据权限
export function getRoleDataAuth(roleId) {
  return request({
    url: `/mgr/jvs-auth/role/role/data/${roleId}`,
    method: "GET",
  });
}

// 获取所有数据权限
export function getAllDataAuth() {
  return request({
    url: `/mgr/jvs-auth/role/role/data`,
    method: "GET",
  });
}

// 角色授权数据权限
export function bindRoleDataAuth(roleId, data) {
  return request({
    url: `/mgr/jvs-auth/role/role/data/${roleId}`,
    method: "PUT",
    data: data,
  });
}

// 获取所有菜单
export function getAllMenu() {
  return request({
    url: `/mgr/jvs-auth/role/role/menus`,
    method: "GET",
  });
}

// 获取角色菜单权限
export function getMenuAuth(roleId) {
  return request({
    url: `/mgr/jvs-auth/role/role/menus/${roleId}`,
    method: "GET",
  });
}

// 角色授权
export function bindMenuAuth(data, roleId) {
  return request({
    url: `/mgr/jvs-auth/role/role/${roleId}`,
    method: "PUT",
    data: data,
  });
}

// 用户添加到某个角色
export function editUserRole(roleId, data) {
  return request({
    url: `/mgr/jvs-auth/role/user/${roleId}`,
    method: "put",
    data: data
  });
}
