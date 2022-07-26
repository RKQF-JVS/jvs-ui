import request from "@/router/axios";

// 获取列表
export function getTreeList(params) {
  return request({
    url: `/mgr/jvs-auth/tree/list`,
    method: "get",
    params: params
  });
}

// 树形字典新增节点
export function addTree(data) {
  return request({
    url: `/mgr/jvs-auth/tree`,
    method: "post",
    data: data
  });
}

// 修改树形字典
export function editTree(data) {
  return request({
    url: `/mgr/jvs-auth/tree`,
    method: "put",
    data: data
  });
}

// 删除树形字典
export function delTree(id) {
  return request({
    url: `/mgr/jvs-auth/tree/${id}`,
    method: "delete"
  });
}
