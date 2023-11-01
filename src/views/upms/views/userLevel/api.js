import request from '@/router/axios'
let base = '/mgr/jvs-auth/'

// 获取用户等级列表
export const getUserLevelList = () => {
  return request({
    url: base + `level/all`,
    method: 'get',
  })
}

// 新增
export const add = (data) => {
  return request({
    url: base + `/level`,
    method: 'post',
    data:  data
  })
}

// 编辑
export const edit = (data) => {
  return request({
    url: base + `/level`,
    method: 'put',
    data:  data
  })
}

// 删除
export const del = (data) => {
  return request({
    url: base + `/level/${data.id}`,
    method: 'delete',
    // params:  data
  })
}
