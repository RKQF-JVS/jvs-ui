import request from '@/router/axios'

// 名称集
export const getFlowableForm = (params) => {
  return request({
      url: `/mgr/crud/form/design/flowable`,
      method: 'get',
      params: params
  })
}

// 启动流程
export const startProcess = (data) => {
  return request({
      url: `/mgr/jvs-design/process/instance/start`,
      method: 'post',
      data: data
  })
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

// 查询任务详情
export const getTaskInfo = (taskId) => {
  return request({
      url: `/mgr/jvs-design/task/query/detail/${taskId}`,
      method: 'get'
  })
}

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

// 获取用户列表
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

// 我的申请--查询历史数据
export function queryApplyHistoryInfo(processInstanceId, data) {
  return request({
    url: `/mgr/jvs-design/task/history/query/log/${processInstanceId}`,
    method: "post",
    data: data
  });
}

// 我的申请--流程图
export function queryApplyImage(processInstanceId) {
  return request({
    url: `/mgr/jvs-design/task/history/query/diagram/${processInstanceId}`,
    method: "get"
  });
}

// 查询任务详细日志
export function queryDetailHistoryInfo(processInstanceId) {
  return request({
    url: `/mgr/jvs-design/task/history/query/log/detail/${processInstanceId}`,
    method: "post",
  });
}

// 我的申请---查询流程数据，表单回显
export function queryEchoForm(processInstanceId) {
  return request({
    url: `/mgr/jvs-design/process/instance/query/variables/${processInstanceId}`,
    method: "get"
  });
}
