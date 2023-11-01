import request from '@/router/axios'

// 获取表单设计详情
export const getFlowableForm=(id) => {
  return request({
    url: `/mgr/jvs-design/form/design/${id}`,
    method: 'get'
  })
}

// 启动流程
export const startProcess=(data) => {
  return request({
    url: `/mgr/jvs-design/workflow/task/start`,
    method: 'post',
    data: data
  })
}

// 查询任务详情
export const getTaskInfo=(id) => {
  return request({
    url: `/mgr/jvs-design/workflow/task/${id}`,
    method: 'get'
  })
}

// 完成任务
export const completeProcess=(data) => {
  return request({
    url: `/mgr/jvs-design/workflow/task/approve`,
    method: 'post',
    data: data
  })
}









// 所有用户
export const getUserList=(params) => {
  return request({
    url: `/mgr/jvs-auth/user/all`,
    method: 'get',
    params: params
  })
}




// 保存任务
export const saveProcess=(taskId, data) => {
  return request({
    url: `/mgr/jvs-design/task/save/${taskId}`,
    method: 'post',
    data: data
  })
}

// 指派任务
export const zhipaiProcess=(taskId, userId) => {
  return request({
    url: `/mgr/jvs-design/task/assign/${taskId}/to/${userId}`,
    method: 'post'
  })
}

// 委派
export const weipaiProcess=(taskId, userId) => {
  return request({
    url: `/mgr/jvs-design/task/delegate/${taskId}/to/${userId}`,
    method: 'post'
  })
}
