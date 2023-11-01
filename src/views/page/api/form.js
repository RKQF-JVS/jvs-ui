import request from '@/router/axios'

// 名称集
export const getNameList = () => {
  return request({
      url: `/mgr/jvs-design/form/design/names`,
      method: 'get'
  })
}

// 详情
export const getDetailByName = (data) => {
  return request({
      url: `/mgr/jvs-design/form/design`,
      method: 'get',
      params: data
  })
}

// 新增表单
export const addForm = (data) => {
  return request({
      url: `/mgr/jvs-design/form/design`,
      method: 'post',
      data: data
  })
}

// 修改表单
export const updateForm = (data) => {
  return request({
      url: `/mgr/jvs-design/form/design`,
      method: 'put',
      data: data
  })
}

// 删除表单
export const deleteForm = (name) => {
  return request({
      url: `/mgr/jvs-design/form/design/${name}`,
      method: 'delete'
  })
}

// 发布
export const deployForm = (id) => {
  return request({
      url: `/mgr/jvs-design/form/design/deploy/${id}`,
      method: 'put'
  })
}

// 挂载表单拉取数据
export const getShowForm = (name) => {
  return request({
      url: encodeURI(`/mgr/jvs-design/form/design/mount/${name}`),
      method: 'get'
  })
}

// 查询可启动的流程列表
export const getAvailable = (params) => {
  return request({
      url: `/mgr/jvs-design/modeler/query/list`,
      method: 'post',
      data: params
  })
}

// 用户列表
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
    url: "/mgr/jvs-auth/role/all/userRole",
    method: "GET"
  });
}

// 获取职位列表
export function getPostList() {
  return request({
    url: "/mgr/jvs-auth/job/list",
    method: "GET"
  });
}

// 查询可选条件字段
export function queryAvailable(params) {
  return request({
    url: `/mgr/jvs-design/modeler/node/column/query/available`,
    method: "get",
    params: params
  });
}

// 所有正则
export function getRegExpList(params) {
  return request({
    url: `/mgr/jvs-design/form/design/regexp`,
    method: "get",
    params: params
  });
}
