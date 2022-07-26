import request from "@/router/axios";

// 数据权限列表
export function getAuthPage(roleId, params) {
  return request({
    url: `/mgr/jvs-auth/data/page`,
    method: "GET",
    params: params
  });
}

// 添加数据权限
export function addDataAuth(data) {
  return request({
    url: "/mgr/jvs-auth/data/save",
    method: "POST",
    data: data
  });
}

// 修改数据权限
export function editDataAuth(data) {
  return request({
    url: "/mgr/jvs-auth/data",
    method: "PUT",
    data: data
  });
}

// 删除数据权限
export function delDataAuth(id) {
  return request({
    url: `/mgr/jvs-auth/data/${id}`,
    method: "DELETE"
  });
}
