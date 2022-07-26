import request from '@/router/axios'

// 分页查询
export const getFiles = (params) => {
  return request({
    url: `/mgr/jvs-auth/file/list`,
    method: 'get',
    params:  params
  })
}

// 预览
export const preview = (bucketName, params) => {
  return request({
    url: `/mgr/jvs-auth/file/link/${bucketName}`,
    method: 'get',
    params:  params
  })
}

// 下载
export const download = (bucketName, params) => {
  return request({
    url: `/mgr/jvs-auth/bytes/${bucketName}`,
    method: 'get',
    params:  params
  })
}

// 获取桶
export const getbuckets = () => {
  return request({
    url: `/mgr/jvs-auth/buckets`,
    method: 'get'
  })
}

// 获取文件类型集
export const getfileTypes = () => {
  return request({
    url: `/mgr/jvs-auth/fileTypes`,
    method: 'get'
  })
}