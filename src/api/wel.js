import request from "@/router/axios"

// 获取首页信息
export function getWelInfo() {
  return request({
    url: "/mgr/jvs-auth/index",
    method: "get"
  });
}

// 新增
export function addWelInfo(data) {
  return request({
    url: "/mgr/jvs-auth/index",
    method: "post",
    data: data
  });
}

// 删除
export function delWelInfo(id) {
  return request({
    url: `/mgr/jvs-auth/index/${id}`,
    method: "delete"
  });
}

// 页面列表
export function getPageList(type) {
  return request({
    url: `/mgr/jvs-auth/index/type/${type}`,
    method: "get"
  });
}

// 组件排序
export function sortWel(data) {
  return request({
    url: `/mgr/jvs-auth/index/sort`,
    method: "put",
    params: data
  });
}

// 查询任务列表
export function queryTaskList(query) {
  return request({
    url: `/mgr/jvs-design/task/query/list`,
    method: "post",
    data: query
  });
}
