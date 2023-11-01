import request from '@/router/axios'

// 获取列表
export const getChartList= (data) => {
  return request({
    url: `/mgr/jvs-design/page/page`,
    method: 'get',
    params: data
  })
}

// 通过id获取页面数据(设计/预览)
export const previewChartDesign = (id, params) => {
  return request({
    url: `/mgr/jvs-design/page/design/${id}`,
    method: 'post',
    data: params
  })
}
// 获取部署的页面详情
export const getUseChart = (id, params) => {
  return request({
    url: `/mgr/jvs-design/use/chart/${id}`,
    method: 'get',
    params: params
  })
}
// 新建页面
export const createPage = (data) => {
  return request({
    url: `/mgr/jvs-design/page`,
    method: 'post',
    data: data
  })
}

// 编辑页面
export const editPage = (data) => {
  return request({
    url: `/mgr/jvs-design/page/baseInfo`,
    method: 'put',
    data: data
  })
}

// 获取列表页类型
export const getChartTypes= (data) => {
  return request({
    url: `/mgr/jvs-design/page/types`,
    method: 'get',
    params: data
  })
}

// 根据ID获取设计
export const getChartDesign= (id) => {
  return request({
    url: `/mgr/jvs-design/page/design/by/${id}`,
    method: 'post'
  })
}

// 部署
export const deployPage = (data) => {
  return request({
      url: `/mgr/jvs-design/page/deploy/${data.id}`,
      method: 'post',
      // data: data
  })
}

// 删除
export const deletePage = (id) => {
  return request({
      url: `/mgr/jvs-design/page/${id}`,
      method: 'delete'
  })
}

// 禁用
export const disablePage = (id) => {
  return request({
      url: `/mgr/jvs-design/page/unload/${id}`,
      method: 'put'
  })
}

// 获取菜单
export const saveChart = (data) => {
  return request({
    url: `/mgr/jvs-design/page`,
    method: 'put',
    data: data
  })
}

// 获取数据源
export const getSource = (str) => {
  return request({
    url: `/mgr/jvs-design/data/source/${str}`,
    method: 'get',
  })
}

// 测试数据
export const testData = (data) => {
  return request({
    url: `/mgr/jvs-design/test`,
    method: 'post',
    data: data
  })
}

// 发布版本
export const publish = (id) => {
  return request({
    url: `/mgr/jvs-design/page/publish/${id}`,
    method: 'put'
  })
}

// 根据id获取设计
export const getVersionData = (id) => {
  return request({
    url: `/mgr/jvs-design/page/design/by/${id}`,
    method: 'get',
  })
}

// 获取图片列表
export const getImageList = (params) => {
  return request({
    // url: `/api/file/files/${params.bucketName}/${params.current}/${params.size}`,
    url: `/mgr/jvs-design//file/list`,
    method: 'get',
    params
  })
}

// 获取标签集
export const getLabelList = (params) => {
  return request({
    // url: `/api/file/files/${params.bucketName}/${params.current}/${params.size}`,
    url: `/mgr/jvs-design//fileLabel`,
    method: 'get',
    params
  })
}

// 预览图片(单个)
export const previewImage = (params, query) => {
  return request({
    url: `/api/file/filelink/${params.bucketName}`,
    method: 'get',
    params: query
  })
}

// 获取图片集合
export const getImages = (data) => {
  return request({
    url: `/api/file/filelinks`,
    method: 'post',
    data: data
  })
}

// // 执行逻辑
// export const getImages = (data) => {
//   return request({
//     url: `/api/file/filelinks`,
//     method: 'post',
//     data: data
//   })
// }
