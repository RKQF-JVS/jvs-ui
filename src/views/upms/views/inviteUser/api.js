import request from "@/router/axios";

// 根据邀请码获取 公司信息，邀请人名
export function getTenantInfo(params) {
  return request({
    url: '/gateway/invite',
    method: "get",
    params: params
  });
}

// 用户填写邀请码
export function inviteCode(code) {
  return request({
    url: `/mgr/jvs-auth/invite/${code}`,
    method: "put",
  });
}
