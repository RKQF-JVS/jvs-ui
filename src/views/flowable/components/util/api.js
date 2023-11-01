import request from "@/router/axios";

// 默认请求
export const sendRequire = (url, method, data) => {
  let obj = {
    url: url,
    method: method
  }
  if(data) {
    if(method == 'get' || method == 'delete') {
      obj.params = data
    }else{
      obj.data = data
    }
  }
  return request(obj)
}

export function getUserList(query) {
  return request({
    url: "/mgr/jvs-auth/usermanager/list",
    method: "get",
    params: query
  });
}

// 获取用户的部门菜单
export function getDeptList() {
  return request({
    url: "/mgr/jvs-auth/dept/all",
    method: "get",
  });
}

// 获取全部角色信息
export function getRoleList() {
  return request({
    url: `/mgr/jvs-auth/role/all/userRole`,
    method: "GET"
  });
}

// 获取职位列表
export function getPostList() {
  return request({
    url: `/mgr/jvs-auth/job/list`,
    method: "GET"
  });
}

// 获取群组列表
export function getGroupList() {
  return request({
    url: "/mgr/jvs-auth/user/group/list",
    method: "GET"
  });
}
