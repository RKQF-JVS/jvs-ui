import request from "@/router/axios";
// 修改用户
export function editUser(data) {
  return request({
    url: `/mgr/jvs-auth/user/update`,
    method: "put",
    data: data
  });
}

// 检查配置是否配置了如果有配置则可以使用，未配置，则不能使用
export const getEnableTypes = ()=>{
  return request({
    url:`/mgr/jvs-auth/tenant/admin/base/check`,
    method:'get'
  })
}