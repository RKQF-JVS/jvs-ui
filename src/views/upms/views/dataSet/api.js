import request from "@/router/axios";

// 获取数据集列表
export function getDataModel(param) {
  return request({
    url: "/mgr/jvs-design//tenant/admin/base/datamodel/page",
    method: "get",
    param: param
  });
}
// 删除数据集
export function deleteDataModel(param) {
  return request({
    url: `/mgr/jvs-design//app/${param.appId}/design/dynamic/data/${param.id}`,
    method: "delete",
  });
}
