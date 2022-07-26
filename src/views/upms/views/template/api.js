import request from "@/router/axios";

// 获取列表
export function getPageList(params) {
  return request({
    url: `/mgr/jvs-auth/template/list`,
    method: "get",
    params: params
  });
}

// 新增
export function add(data) {
  return request({
    url: `/mgr/jvs-auth/template/add`,
    method: "post",
    data: data
  });
}

// 修改
export function edit(data) {
  return request({
    url: `/mgr/jvs-auth/template/update`,
    method: "put",
    data: data
  });
}

// 删除
export function del(id) {
  return request({
    url: `/mgr/jvs-auth/template/${id}`,
    method: "delete"
  });
}

// 设计
export function design(data) {
  return request({
    url: `/mgr/jvs-auth/template/update`,
    method: "put",
    data: data
  });
}