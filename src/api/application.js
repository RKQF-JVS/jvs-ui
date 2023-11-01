import request from '@/router/axios'

// 获取基础信息
export function getBasicInfo() {
  return request({
    url: `/mgr/jvs-design/platform/base`,
    method: "get",
  });
}

// 应用操作日志分页
export function jvsLogPage(params) {
  return request({
    url: `/mgr/jvs-design/platform/app/jvsLog/page`,
    method: "get",
    params: params
  });
}

// 获取字典列表
export function getTreeList(params) {
  return request({
    url: `/mgr/jvs-design/platform/app/tree/list`,
    method: "get",
    params: params
  });
}

// 导出树形字典
export function exportTreeDic(params) {
  return request({
    url: `/mgr/jvs-design/platform/app/tree/export`,
    method: "get",
    responseType: 'arraybuffer',
    params: params
  });
}

// 树形字典新增节点
export function addTree(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/tree`,
    method: "post",
    data: data
  });
}

// 修改树形字典
export function editTree(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/tree`,
    method: "put",
    data: data
  });
}

// 删除树形字典
export function delTree(id) {
  return request({
    url: `/mgr/jvs-design/platform/app/tree/${id}`,
    method: "delete"
  });
}

// 获取正则字典列表
export function getRegexpList(params) {
  return request({
    url: `/mgr/jvs-design/platform/app/regexp/list`,
    method: "get",
    params: params
  });
}

// 所有类型
export function typeRegList(params) {
  return request({
    url: `/mgr/jvs-design/platform/app/regexp/types`,
    method: "get",
    params: params
  });
}

// 正则字典新增节点
export function addReg(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/regexp`,
    method: "post",
    data: data
  });
}

// 修改正则字典
export function editReg(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/regexp`,
    method: "put",
    data: data
  });
}

// 删除正则字典
export function delReg(id) {
  return request({
    url: `/mgr/jvs-design/platform/app/regexp/${id}`,
    method: "delete"
  });
}


// 获取系统默认扩展
export function getDefaultExtendRule() {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend/default`,
    method: "get"
  });
}

// 获取系统扩展
export function getExtendRule() {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend`,
    method: "get"
  });
}

// 新增系统扩展
export function addExtend(data) {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend`,
    method: "post",
    data: data
  });
}

// 修改系统扩展
export function editExtend(data) {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend`,
    method: "put",
    data: data
  });
}

// 删除系统扩展
export function delExtend(data) {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend/${data.id}`,
    method: "delete",
  });
}

// 获取类型
export function getExtendTypes() {
  return request({
    url: `/mgr/jvs-design/platform/rule/extend/types`,
    method: "get"
  });
}

// 获取所有模板
export function getTemplateList() {
  return request({
    url: `/mgr/jvs-design/platform/app/Config`,
    method: "get"
  });
}

// 新增模板数据
export function addTemplate(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/Config`,
    method: "post",
    data: data
  });
}

// 修改模板数据
export function editTemplate(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/Config`,
    method: "put",
    data: data
  });
}

// 修改模板数据
export function delTemplate(data) {
  return request({
    url: `/mgr/jvs-design/platform/app/Config/${data.id}`,
    method: "delete",
  });
}

// 获取应用角色下的用户
export function getAppRolePage(params) {
  return request({
    url: `/mgr/jvs-design/jvsApp/Role/all`,
    method: "get",
  });
}

// 设置应用管理员
export function setAppRole(data) {
  return request({
    url: `/mgr/jvs-design/jvsApp/Role/set`,
    method: "post",
    data: data
  });
}
