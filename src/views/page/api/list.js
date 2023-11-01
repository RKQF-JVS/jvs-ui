import request from '@/router/axios'

// 根据数据源获取数据表
export const getTableList = (datasourceName) => {
  return request({
      url: `/mgr/jvs-design/datasource/tables/${datasourceName}`,
      method: 'get'
  })
}

// 根据数据表id获取相关数据
export const getTableInfo = (params) => {
  return request({
      // url: `/mgr/jvs-design/datasource/table/${tableId}`,
      url: '/mgr/jvs-design/design',
      method: 'get',
      params: params
  })
}

// 获取角色列表
export const getRoleList = () => {
  return request({
      url: `/crud-design/role/list`,
      method: 'get',
  })
}

// 获取所有菜单
export const getMenu = (params) => {
  return request({
      url: `/mgr/jvs-design/menu`,
      method: 'get',
      params: params
  })
}

// 新增菜单
export const addMenu = (data) => {
  return request({
      url: `/mgr/jvs-design/menu`,
      method: 'post',
      data: data
  })
}

// // 根据菜单id拉取设计信息
// export const getDesignInfo = (menuId) => {
//   return request({
//       url: `/mgr/jvs-design/design/${menuId}`,
//       method: 'get'
//   })
// }

// 部署
export const enableMenu = (id) => {
  return request({
      url: `/mgr/jvs-design/design/deploy/${id}`,
      method: 'post'
  })
}

// 新增设计
export const addDesign = (data) => {
  return request({
      url: `/mgr/jvs-design/design`,
      method: 'post',
      data: data
  })
}

// 更新
export const updateDesign = (data) => {
  return request({
      url: `/mgr/jvs-design/design`,
      method: 'put',
      data: data
  })
}

// 生成代码
export const getSourceCode = (designId) => {
  return request({
      url: `/mgr/jvs-design/maven/generate/${designId}`,
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

// 修改菜单
export const updateMenu = (data) => {
  return request({
      url: `/mgr/jvs-design/menu/modify`,
      method: 'post',
      data: data
  })
}

// 删除菜单
export const removeMenu = (menuId) => {
  return request({
      url: `/mgr/jvs-design/menu/remove/${menuId}`,
      method: 'delete'
  })
}

// 获取系统列表
export const getAllSystem = (clientId) => {
  return request({
    url: `/mgr/jvs-auth/index/menu/${clientId}`,
    method: "get"
  });
};

// 获取一级菜单
export const getParentMenu= (data) => {
  return request({
      url: `/mgr/jvs-design/menu/parent`,
      method: 'get',
      params: data
  })
}

// 获取所有key对应值
export const getKeyValue= () => {
  return request({
      url: `/mgr/jvs-design/design/labelValue`,
      method: 'get'
  })
}

// 部署历史
export const getHistory= (menuId) => {
  return request({
      url: `/mgr/jvs-design/design/history/${menuId}`,
      method: 'get'
  })
}

// 自定义请求
export const sendMyRequire = (http, data) => {
  let headers = http.headers || {}
  headers['Content-Type'] = http.requestContentType
  let obj = {
    url: http.url,
    method: http.httpMethod,
    headers: headers
  }
  if(data) {
    if(http.requestContentType == 'application/x-www-form-urlencoded') {
      obj.params = data
    }else{
      obj.data = data
    }
  }
  return request(obj)
}

export const addCustomTable = (data) => {
  return request({
      url: `/mgr/jvs-design/datasource/addCustomTable`,
      method: 'post',
      data: data
  })
}

// 获取所有数据源列表
export const getDataSource = () => {
  return request({
      url: `/mgr/jvs-design/datasource`,
      method: 'get'
  })
}

// 获取数据源下的所有表
export const getSourceTable = (datasourceName) => {
  return request({
      url: `/mgr/jvs-design/datasource/tables/${datasourceName}`,
      method: 'get'
  })
}
