import request from '@/router/axios'

// 列表
export const getPageList = (params) => {
  return request({
      url: `/mgr/jvs-design/design/page`,
      method: 'get',
      params: params
  })
}

// 新建页面
export const createPage = (params) => {
  return request({
      url: `/mgr/jvs-design/design/create`,
      method: 'post',
      data: params
  })
}

//获取所有系统列表
export const getAllSystemList = (clientId, params) => {
  return request({
    url: `/mgr/jvs-auth/index/menu/${clientId}`,
    method: "get",
    params: params
  });
};

// 部署
export const deployPage = (data) => {
  return request({
      url: `/mgr/jvs-design/design/deploy/${data.id}`,
      method: 'post',
      data: data
  })
}

// 删除
export const deletePage = (id) => {
  return request({
      url: `/mgr/jvs-design/design/del/${id}`,
      method: 'delete'
  })
}

// 卸载菜单
export const unloadPage = (id) => {
  return request({
      url: `/mgr/jvs-design/design/unload/${id}`,
      method: 'post'
  })
}

// 修改页面
export const editPage = (data) => {
  return request({
      url: `/mgr/jvs-design/design/rename`,
      method: 'put',
      data: data
  })
}

// sql统计
export const getStatistics = (designId, statisticsCode, data) => {
  return request({
    url: `/mgr/jvs-design/datasource/statistics/${designId}/${statisticsCode}`,
    method: "post",
    data: data
  });
};

// 获取详情
export const getDetail=(params) => {
  return request({
    url: `/mgr/jvs-design/form/design`,
    method: 'get',
    params: params
  })
}


// 获取所有应用
export const getAllApp=(params) => {
  return request({
    url: `/mgr/jvs-design//JvsApp/all`,
    method: 'get',
    params: params
  })
}

// 获取列表页按钮formId
export const getButtonFormId=(dataModelId, designId, buttonName) => {
  return request({
    url: `/mgr/jvs-design//design/generateForm/${dataModelId}/${designId}/${buttonName}`,
    method: 'get',
  })
}

// 列表页分页查询数据
export const getCrudDataPage=(params, modelId, designId) => {
  return request({
    url: `/mgr/jvs-design//dynamic/data/query/page/${modelId}`,
    method: 'get',
    params: params,
    headers: {
      'designId': designId
    }
  })
}
