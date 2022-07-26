import request from "@/router/axios";

// 岗位列表
export function getPostList() {
  return request({
    url: `/mgr/jvs-auth/job/list`,
    method: "get",
  });
}

// 岗位下的用户
export function getUserByPostId(params) {
  return request({
    url: `/mgr/jvs-auth/job/users`,
    method: "get",
    params: params
  });
}

// 添加岗位
export function addPost(data) {
  return request({
    url: `/mgr/jvs-auth/job`,
    method: "post",
    data: data
  });
}

// 修改岗位
export function editPost(data) {
  return request({
    url: `/mgr/jvs-auth/job`,
    method: "put",
    data: data
  });
}

// 删除岗位
export function delPost(jobId) {
  return request({
    url: `/mgr/jvs-auth/job/${jobId}`,
    method: "delete",
  });
}

// 岗位移除用户
export function removeUserByJob(userId) {
  return request({
    url: `/mgr/jvs-auth/job/user/${userId}`,
    method: "delete",
  });
}

// 用户添加到某个岗位
export function editUserJob(jobId, data) {
  return request({
    url: `/mgr/jvs-auth/job/user/${jobId}`,
    method: "put",
    data: data
  });
}
