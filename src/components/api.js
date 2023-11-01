import request from '@/router/axios'

// 用户列表
export function getUserList(query) {
  return request({
    url: "/mgr/jvs-auth/usermanager/list",
    method: "get",
    params: query
  });
}

// 所有用户列表
export function getUserListAll(query) {
  return request({
    url: "/mgr/jvs-auth/user/all",
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

// 数据源下拉框
export function getDataSourceInfoList(data) {
  return request({
    url: "/mgr/jvs-design/datasource/dataSelect",
    method: "post",
    data: data
  });
}

// 获取图片列表
export const getImageList = (params) => {
  return request({
    // url: `/api/file/files/${params.bucketName}/${params.current}/${params.size}`,
    url: `/mgr/jvs-design//file/list`,
    method: 'get',
    params
  })
}

// 获取标签集
export const getLabelList = (params) => {
  return request({
    // url: `/api/file/files/${params.bucketName}/${params.current}/${params.size}`,
    url: `/mgr/jvs-design//fileLabel`,
    method: 'get',
    params
  })
}

// 获取数据集信息
export function getModelName(jvsAppId, modelId) {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/use/dynamic/data/modelName/${modelId}`,
    method: "get"
  });
}

// 修改数据集名称
export function editModelName(jvsAppId, modelName, modelId) {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/design/dynamic/data/${modelName}/${modelId}`,
    method: "put"
  });
}

// 数据模型配置
export function editModelSetting(jvsAppId, modelId, data) {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/design/dynamic/data/${modelId}`,
    method: "post",
    data: data
  });
}

// 数据联动
export function dataModelTriggering(jvsAppId, designId, modelId, data, headers) {
  let tp = {
    url: `/mgr/jvs-design/app/${jvsAppId}/use/dynamic/data/DataModelTriggering/${designId}/${modelId}`,
    method: "post",
    data: data
  }
  if(headers) {
    tp.headers = headers
  }
  return request(tp);
}