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
