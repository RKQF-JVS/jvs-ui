import request from "@/router/axios"

// 根据变量中心类别名称获取全部函数
export function getFuncList(requestPrefix, useCase, id) {
  let obj = {
    url: `/mgr/${requestPrefix}/jvsFunction/functions`,
    method: "get",
  }
  if(useCase) {
    obj.params = {
      useCase: useCase,
      id: id
    }
  }
  return request(obj);
}

// 新增函数
export function addEditExec(requestPrefix, data) {
  return request({
    url: `/mgr/${requestPrefix}/jvsFunction/save/exec`,
    method: "post",
    data: data
  });
}

// 根据函数执行ID获取函数执行
export function doExec(requestPrefix, execId, useCase, data, headers) {
  let tp = {
    url: `/mgr/${requestPrefix}/jvsFunction/exec/${execId}/${useCase}`,
    method: "post",
    data: data
  }
  if(headers) {
    tp.headers = headers
  }
  return request(tp);
}

// 根据id获取表达式信息
export function getExec(id) {
  return request({
    url: `/mgr/jvs-design/jvsFunction/exec/${id}`,
    method: "get",
  });
}

// 删除公式
export function deleteExec(designId, id) {
  return request({
    url: `/mgr/jvs-design//jvsFunction/exec/${designId}/${id}`,
    method: "delete",
  });
}