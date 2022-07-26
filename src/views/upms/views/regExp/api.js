import request from "@/router/axios";

// 获取列表
export function getPageList(params) {
  return request({
    url: `/mgr/jvs-auth/regexp/list`,
    method: "get",
    params: params
  });
}

// 所有类型
export function typeList(params) {
  return request({
    url: `/mgr/jvs-auth/regexp/types`,
    method: "get",
    params: params
  });
}

// 正则字典新增节点
export function add(data) {
  return request({
    url: `/mgr/jvs-auth/regexp`,
    method: "post",
    data: data
  });
}

// 修改正则字典
export function edit(data) {
  return request({
    url: `/mgr/jvs-auth/regexp`,
    method: "put",
    data: data
  });
}

// 删除正则字典
export function del(id) {
  return request({
    url: `/mgr/jvs-auth/regexp/${id}`,
    method: "delete"
  });
}
