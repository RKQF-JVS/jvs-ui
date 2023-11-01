import request from '@/router/axios'

// 详情
export const getDesignInfo = (menuId, type) => {
  return request({
      url: `/mgr/jvs-design/design/detail/${menuId}`,
      method: 'get'
  })
}
// 详情
export const getDesignById = (id) => {
  return request({
      url: `/mgr/jvs-design/design/${id}`,
      method: 'get'
  })
}

// 更新
export const updateDesignInfo = (id, data) => {
  return request({
      url: `/mgr/jvs-design/design/update/${id}`,
      method: 'POST',
      data: data
  })
}

// // 部署的列表页详情
// export const getDesignTableInfo = (menuId) => {
//   return request({
//       url: `/mgr/jvs-design/design/deployed/${menuId}`,
//       method: 'get'
//   })
// }
// 部署的列表页详情
export const getDesignTableInfo = (menuId) => {
  return request({
      url: `/mgr/jvs-design//use/crud/${menuId}`,
      method: 'get'
  })
}
// 列表页预览
export const previewPage = (menuId) => {
  return request({
      url: `/mgr/jvs-design/design/detail/${menuId}`,
      method: 'get'
  })
}
// 查询单条数据详情
export const getSingleData = (modelId, dataId) => {
  return request({
    url: `/mgr/jvs-design//dynamic/data/query/single/${modelId}/${dataId}`,
    method: 'get'
  })
}
// 删除单条数据
export const delSingleData = (modelId, dataId, designId) => {
  return request({
    url: `/mgr/jvs-design//dynamic/data/delete/${modelId}/${dataId}`,
    method: 'delete',
    headers: {
      'designId': designId
    }
  })
}
