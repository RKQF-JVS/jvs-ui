import request from "@/router/axios";

// 获取权限
export function getAuthority(params) {
  return request({
    url: `/mgr/jvs-auth/authority/page`,
    method: "get",
    params: params
  });
}

// 新增权限
export function addAuthority(data) {
  return request({
    url: `/mgr/jvs-auth/authority`,
    method: "post",
    data: data
  });
}

// 修改权限
export function editAuthority(data) {
  return request({
    url: `/mgr/jvs-auth/authority`,
    method: "put",
    data: data
  });
}

// 删除权限
export function deleteAuthority(id) {
  return request({
    url: `/mgr/jvs-auth/authority/${id}`,
    method: "delete"
  });
}