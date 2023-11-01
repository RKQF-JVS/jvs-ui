import request from "@/router/axios"

// 工作流列表
export function getModelList(params) {
  return request({
    url: `/mgr/jvs-design/workflow/design/page`,
    method: "get",
    params: params
  });
}

// 流程分类列表
export function flowableType() {
  return request({
    url: `/mgr/jvs-design/workflow/design/groups`,
    method: "get"
  });
}

// 创建工作流
export function createModel(data) {
  return request({
    url: `/mgr/jvs-design/workflow/design`,
    method: "post",
    data: data
  });
}

// 工作流详情
export function getModelDetail(id) {
  return request({
    url: `/mgr/jvs-design/workflow/design/${id}`,
    method: "get"
  });
}

// 修改基本信息
export function editModel(data) {
  return request({
    url: `/mgr/jvs-design/workflow/design`,
    method: "put",
    data: data
  });
}

// 保存设计
export function designModel(data) {
  return request({
    url: `/mgr/jvs-design/workflow/design/save`,
    method: "put",
    data: data
  });
}

// 删除工作流
export function deleteModel(id) {
  return request({
    url: `/mgr/jvs-design/workflow/design/${id}`,
    method: "delete"
  });
}

// 发布流程
export function deployProcess(id) {
  return request({
    url: `/mgr/jvs-design/workflow/design/publish/${id}`,
    method: "put"
  });
}

// 停用流程
export function suspendProcess(id) {
  return request({
    url: `/mgr/jvs-design/workflow/design/stop/${id}`,
    method: "put"
  });
}

// 查询任务列表
export function queryTaskList(query) {
  return request({
    url: `/mgr/jvs-design/workflow/task/pendingApproves`,
    method: "get",
    params: query
  });
}

// 我的申请列表
export function applyList(query) {
  return request({
    url: `/mgr/jvs-design/workflow/task/selfs`,
    method: "get",
    params: query
  });
}

// 入口列表
export function entryList() {
  return request({
    url: `/mgr/jvs-design/workflow/design/havePermissionDesign`,
    method: "get"
  });
}

// 我的申请---查询流程数据，表单回显
export function queryEchoForm(modelId, dataId) {
  return request({
    url: `/mgr/jvs-design/dynamic/data/query/single/${modelId}/${dataId}`,
    method: "get"
  });
}

// 查询任务进度
export function queryDetailHistoryInfo(id) {
  return request({
    url: `/mgr/jvs-design/workflow/task/progress/${id}`,
    method: "get",
  });
}

// 我的申请--取消  /  终止  流程
export function candelProcess(id, data) {
  return request({
    url: `/mgr/jvs-design/workflow/task/stop/${id}`,
    method: "put",
    data: data
  });
}


// 节点表单数据变更记录
export function queryChangeInfo(dataId, version) {
  return request({
    url: `/mgr/jvs-design/data/log/query/single/${dataId}/${version}`,
    method: "get"
  });
}




// 领取任务
export function claimTask(taskId) {
  return request({
    url: `/mgr/jvs-design/task/claim/${taskId}`,
    method: "post"
  });
}

// 分配给其他人
export function assignTask(taskId, userId) {
  return request({
    url: `/mgr/jvs-design/task/assign/${taskId}/to/${userId}`,
    method: "post"
  });
}

// 完成任务
export const completeProcess = (taskId, data) => {
  return request({
      url: `/mgr/jvs-design/task/complete/${taskId}`,
      method: 'post',
      data: data
  })
}

// 保存任务
export const saveProcess = (taskId, data) => {
  return request({
      url: `/mgr/jvs-design/task/save/${taskId}`,
      method: 'post',
      data: data
  })
}

// 指派任务
export const zhipaiProcess = (taskId, userId) => {
  return request({
      url: `/mgr/jvs-design/task/assign/${taskId}/to/${userId}`,
      method: 'post'
  })
}

// 委派
export const weipaiProcess = (taskId, userId) => {
  return request({
    url: `/mgr/jvs-design/task/delegate/${taskId}/to/${userId}`,
    method: 'post'
  })
}