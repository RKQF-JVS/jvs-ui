import request from "@/router/axios";

// 获取当前部门
export function getCurrentDept(data) {
  return request({
    url: "/mgr/jvs-auth/dept",
    method: "post",
    data: data
  });
}

// 获取当前部门下面的所有员工
export function getCurrDeptUser(data) {
  return request({
    url: "/mgr/jvs-auth/dept/user/" + data.id,
    method: "GET",
    params: data
  });
}

// 添加部门菜单
export function AddDept(data) {
  return request({
    url: "/mgr/jvs-auth/dept",
    method: "POST",
    data: data
  });
}

// 获取用户的部门菜单
export function getDeptList() {
  return request({
    url: "/mgr/jvs-auth/dept/all",
    method: "get",
  });
}

// 获取当前部门下所有用户
export function getDeptUserList(params) {
  return request({
    url: `/mgr/jvs-auth/dept/page`,
    method: "get",
    params: params
  });
}

// 获取所有岗位
export function getPostList(deptId) {
  let str = '/mgr/jvs-auth/job/list'
  if(deptId) {
    str = `/mgr/jvs-auth/job/list/${deptId}`
  }
  return request({
    url: str,
    method: "get",
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
export function delPost(id) {
  return request({
    url: `/mgr/jvs-auth/job/${id}`,
    method: "delete",
  });
}
