import request from "@/router/axios"

// 人员群组列表
export function getGroupList(params) {
  return request({
    url: `/mgr/jvs-auth//user/group/list`,
    method: "get",
    params: params
  });
}

// 新增
export function addGroup(data) {
  return request({
    url: `/mgr/jvs-auth//user/group`,
    method: "post",
    data: data
  });
}

// 编辑
export function editGroup(data) {
  return request({
    url: `/mgr/jvs-auth/user/group`,
    method: "put",
    data: data
  });
}

// 删除
export function deleteGroup(id) {
  return request({
    url: `/mgr/jvs-auth/user/group/${id}`,
    method: "delete"
  });
}

// 群组下的用户
export function getUserByGroupId(params) {
  return request({
    url: `/mgr/jvs-auth/user/group/users`,
    method: "get",
    params: params
  });
}

// 用户添加到某个群组
export function editUserGroup(groupId, data) {
  return request({
    url: `/mgr/jvs-auth/user/group/user/${groupId}`,
    method: "put",
    data: data
  });
}

// 群组移除用户
export function removeUserByGroup(userId, groupId) {
  return request({
    url: `/mgr/jvs-auth/user/group/user/${userId}/${groupId}`,
    method: "delete",
  });
}
