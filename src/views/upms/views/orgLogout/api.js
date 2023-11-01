import request from "@/router/axios";

// 注销租户
export function tenantLogout() {
  return request({
    url: `/mgr/jvs-auth/tenant/admin/base`,
    method: "delete",
  });
}
