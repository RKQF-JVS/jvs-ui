import request from "@/router/axios";

// 获取权限
export function getAuth(id) {
  return request({
    url: `/mgr/jvs-auth/role/access/authorization/${id}`,
    method: "get"
  });
}

// 保存权限
export function saveAuth(id, data) {
    return request({
      url: `/mgr/jvs-auth/role/access/authorization/${id}`,
      method: "post",
      data: data
    });
  }