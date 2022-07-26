import request from '@/router/axios'

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

// 自定义请求
export const sendMyRequire = (http, data) => {
  let obj = {
    url: http.url,
    method: http.httpMethod,
    headers: {
      'Content-Type': http.requestContentType
    }
  }
  if(data) {
    if(http.requestContentType == 'application/x-www-form-urlencoded') {
      obj.params = data
    }else{
      obj.data = data
    }
  }
  if(http.headers) {
    obj.headers = Object.assign(http.headers, http.headers)
  }
  return request(obj)
}

// 获取详情
export const getDetail=(params) => {
  return request({
    url: `/mgr/jvs-design/form/design`,
    method: 'get',
    params: params
  })
}

// 分类字典列表
export const getClassifyDict = (params) => {
  return request({
    url: `/mgr/jvs-auth/tree/list`,
    method: "get",
    params: params
  });
};

// 根据唯一名称查询字典,返回字段树
export const getClassifyDictTree = (uniqueName) => {
  return request({
    url: `/mgr/jvs-design/form/design/tree/${uniqueName}`,
    method: "get"
  });
};

// 所有字典
export const getSystemDict = (params) => {
  return request({
    url: `/mgr/jvs-auth/api/dict/list/dicts`,
    method: "get",
    params: params
  });
};


// 所有字典项
export const getSystemDictItems = (uniqId) => {
  return request({
    url: `/mgr/jvs-design/form/design/items`,
    method: "get",
    params: {uniqId: uniqId}
  });
};

// 数据源列表
export const getDatasource = () => {
  return request({
    url: `/mgr/datasource/api`,
    method: "get"
  });
};

// 获取所有key对应值
export const getKeyValue= () => {
  return request({
      url: `/mgr/jvs-design/design/labelValue`,
      method: 'get'
  })
}
