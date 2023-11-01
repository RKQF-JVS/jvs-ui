import request from "@/router/axios";

// 获取部门列表
export function getDeptList() {
  return request({
    url: "/mgr/jvs-auth/dept/all",
    method: "get",
  });
}

// 添加部门
export function AddDept(data) {
  return request({
    url: "/mgr/jvs-auth/dept/save",
    method: "POST",
    data: data
  });
}

// 编辑部门菜单
export function editDept(data) {
  return request({
    url: "/mgr/jvs-auth/dept",
    method: "put",
    data: data
  });
}


// 删除部门
export function deleteDept(id) {
  return request({
    url: `/mgr/jvs-auth/dept/${id}`,
    method: "delete"
  });
}

// 获取当前部门下所有用户
export function getDeptUserList(params, orders) {
  return request({
    url: `/mgr/jvs-auth/user/page${orders}`,
    method: "get",
    params: params
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: `/mgr/jvs-auth/user/save`,
    method: "post",
    data: data
  });
}


// 修改用户
export function editUser(data) {
  return request({
    url: `/mgr/jvs-auth/user/update`,
    method: "put",
    data: data
  });
}

// 彻底删除用户
export function deleteUser(id) {
  return request({
    url: `/mgr/jvs-auth/user/user/${id}`,
    method: "delete",
  });
}

// 启用用户 禁用用户
export function enableDisUser(userId, cancelFlag) {
  let able = 'disabled'
  if(cancelFlag) {
    able = 'enable'
  }
  return request({
    url: `/mgr/jvs-auth/user/users/${able}/${userId}`,
    method: "delete"
  });
}


// 生成邀请码
export function inviteUser(params) {
  return request({
    url: `/mgr/jvs-auth/user/get/invite`,
    method: "get",
    // params: params
  });
}

// 设置邀请码是否需要审核默认不需要
export function setInviteCodeCheck(status, code) {
  return request({
    url: `/mgr/jvs-auth//user/get/invite/${status}/${code}`,
    method: "get",
    // params: params
  });
}

// 同步 钉钉 | 企业微信  组织机构(部门)
export function sysDepartment(type) {
  return request({
    url: `/mgr/jvs-auth/dept/pull/${type}`,
    method: "post"
  });
}

// 获取同步按钮
export function getSyncBtns() {
  return request({
    url: `/mgr/jvs-auth/dept/enable/pull/type`,
    method: "get"
  });
}
