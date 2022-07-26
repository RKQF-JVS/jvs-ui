import request from "@/router/axios";

// 获取权限
export function getLog(params) {
  return request({
    url: `/mgr/jvs-auth/log`,
    method: "get",
    params: params
  });
}

// 根据链路查询用户操作数据
export function getDetail(tid) {
  return request({
    url: `/mgr/jvs-auth/log/modification/${tid}`,
    method: "get"
  });
}

// 根据链路查询用户接口调用日志
export function getDataLog(tid) {
  return request({
    url: `/mgr/jvs-auth/log/tid/${tid}`,
    method: "get"
  });
}
