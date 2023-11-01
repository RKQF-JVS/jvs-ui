import request from '@/router/axios'

// 操作日志分页查询
export const getAccList = (params) => {
  return request({
    url: `/mgr/jvs-auth/account/page`,
    method: 'get',
    params:  params
  })
}

// 恢复用户 注销用户
export function enableDisUser(userId, cancelFlag) {
  let able = 'disabled'
  if(cancelFlag) {
    able = 'enable'
  }
  return request({
    url: `/mgr/jvs-auth/account/users/${able}/${userId}`,
    method: "delete"
  });
}

// 超级管理员修改用户密码
export const setUserPassWord = (userId, data) => {
  return request({
    url: `/mgr/jvs-auth/account/users/update/password/${userId}`,
    method: 'post',
    data:  data
  })
}
