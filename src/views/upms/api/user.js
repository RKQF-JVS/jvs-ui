import request from "@/router/axios";

// 重置密码
export function resetPass(id) {
  return request({
    url: `/mgr/jvs-auth/usermanager/password/reset/${id}`,
    method: "get"
  });
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/mgr/jvs-auth/usermanager/${userId}`,
    method: "delete"
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: `/mgr/jvs-auth/usermanager`,
    method: "post",
    data: data
  });
}

// 修改用户
export function editUser(data) {
  return request({
    url: `/mgr/jvs-auth/usermanager`,
    method: "put",
    data: data
  });
}


// 远程搜索用户
export function queryUser(type, value) {
  return request({
    url: `/mgr/jvs-auth/usermanager/user/${type}/${value}`,
    method: "get"
  });
}

// 职位列表
export function getPost(deptId) {
  return request({
    url: `/mgr/jvs-auth/job/list/${deptId}`,
    method: "get"
  });
}

// 所有职位列表
export function getAllPost() {
  return request({
    url: `/mgr/jvs-auth/job/list`,
    method: "get"
  });
}

// 上传用户文件
export function uploadUser(data) {
  return request({
    url: `/mgr/jvs-auth/usermanager/import/preview`,
    method: "post",
    data: data
  });
}

// 用户导入
export function importUser(data) {
  return request({
    url: `/mgr/jvs-auth/usermanager/import/users`,
    method: "post",
    data: data
  });
}

// 取消导入用户
export function cancelImport(cancels) {
  return request({
    url: `/mgr/jvs-auth/usermanager/cancelImport`,
    method: "delete",
    headers: {
      cancels: cancels
    }
  });
}