import request from "@/router/axios";

// 获取所有应用
export function getAppList() {
  return request({
    url: `/mgr/jvs-auth/token/app/all`,
    method: "get",
  });
}

// 根据应用ID查询此应用下登录的人
export function getUserByAppId(params) {
  return request({
    url: `/mgr/jvs-auth//token/all`,
    method: "get",
    params: params
  });
}

// 后台强制退出
export function outUser(token) {
  return request({
    url: `/mgr/jvs-auth/token/${token}`,
    method: "delete",
  });
}