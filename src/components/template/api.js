import request from '@/router/axios'
let base = '/mgr/jvs-design/'

// 发布到模板
export function pubTemplate(data) {
  return request({
    url: `/mgr/jvs-design/design/template/save`,
    method: "post",
    data: data
  });
}

// 新增应用目录
export function addCataType(data) {
  return request({
    url: `/mgr/jvs-design/app/${data.appId}/JvsApp/design/add/type`,
    method: "post",
    data: data
  });
}

// 修改应用目录
export function editCataType(data) {
  return request({
    url: `/mgr/jvs-design/app/${data.appId}/JvsApp/design/update/type`,
    method: "post",
    data: data
  });
}

// 删除应用目录
export function delCataType(params) {
  return request({
    url: `/mgr/jvs-design/app/${params.appId}/JvsApp/design/del/type`,
    method: "delete",
    params: params
  });
}

// 修改应用设计名称
export function editDesign(data) {
  return request({
    url: `/mgr/jvs-design/app/${data.appId}/JvsApp/design/update`,
    method: "put",
    params: data
  });
}

// 删除设计
export function delDesign(params) {
  return request({
    url: `/mgr/jvs-design/app/${params.appId}/JvsApp/design/del`,
    method: "delete",
    params: params
  });
}

// 分页查询
export const pageList = (params) => {
  return request({
    url: base + `/app/JvsApp/page`,
    method: 'get',
    params:  params
  })
}

// 获取应用菜单信息
export const getAppDetail = (appId) => {
  return request({
    url: `/mgr/jvs-design/use/${appId}`,
    method: 'get',
  })
}

// 获取进度
export const getSchedule = (modelId) => {
  return request({
    url: base + `/JvsApp/schedule/${modelId}`,
    method: 'get',
  })
}

// 新增
export const add = (data) => {
  return request({
    url: base + `/app/save`,
    method: 'post',
    data:  data
  })
}

// 编辑
export const edit = (data) => {
  return request({
    url: base + `/app/${data.id}/edit`,
    method: 'put',
    data:  data
  })
}

// 编辑模板
export const editTemplate = (data) => {
  return request({
    url: base + `/JvsAppTemplate`,
    method: 'put',
    data:  data
  })
}

// 下载模板
export const downloadTemplate = (data) => {
  return request({
    url: base + `/JvsAppTemplate/download/${data.id}`,
    method: 'get',
    responseType: 'arraybuffer',
  })
}

// 删除应用
export const del = (id) => {
  return request({
    url: base + `/app/${id}/del`,
    method: 'delete',
  })
}

// 删除应用模板
export const delTemplate = (templateId) => {
  return request({
    url: base + `/JvsAppTemplate/del/${templateId}`,
    method: 'delete',
  })
}

// 分页查询模板
export const templateList = (params) => {
  return request({
    url: base + `JvsAppTemplate/list`,
    method: 'get',
    params: params
  })
}

// 获取模板权限
export const getTemplateAdmin = () => {
  return request({
    url: base + `JvsAppTemplate/admin`,
    method: 'get'
  })
}

// 获取模板类型
export const getTemplateType = () => {
  return request({
    url: base + `JvsAppTemplate/types`,
    method: 'get'
  })
}

// 获取模板详情
export const getTemplateDetail = (templateId) => {
  return request({
    url: base + `/JvsAppTemplate/detail/${templateId}`,
    method: 'get'
  })
}

// 发布
export const publish = (id) => {
  return request({
    url: base + `/app/${id}/deploy`,
    method: 'put',
  })
}

// 发布到模板
export const publishToTemplate = (data) => {
  return request({
    url: base + `/JvsAppTemplate/deploy`,
    method: 'post',
    data: data
  })
}

// 卸载
export const unload = (id) => {
  return request({
    url: base + `/app/${id}/unload`,
    method: 'put',
  })
}


// 获取所有的逻辑列表
export function getAllRule (id) {
  return request({
    url: `/mgr/jvs-design/app/${id}/design/rule/all`,
    method: 'get'
  })
}

// 查询所有模型
export const getAllModel = (appId) => {
  return request({
    url: `/mgr/jvs-design/app/${appId}/data/model/all`,
    method: 'get'
  })
}

// 查询模型下所有字段
export const getModelAllFields = (jvsAppId, modelId, designId) => {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/data/model/list/${modelId}`,
    method: 'get',
    headers: {
      designId: designId
    }
  })
}

// 查询数据集分页
export const getDataModel = (params) => {
  let obj = {}
  for(let i in params) {
    if(i != 'appId') {
      obj[i] = params[i]
    }
  }
  return request({
    url: `/mgr/jvs-design/app/${params.appId}/data/model/list`,
    method: 'get',
    params:  obj
  })
}

// 查询数据集分页
export const addIndexField = (jvsAppId, modelId, fieldKey) => {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/data/model/indexField/${modelId}/${fieldKey}`,
    method: 'post',
  })
}

// 获取所有设计数据
export const getAllUse = (appId) => {
  return request({
    url: `/mgr/jvs-design/app/${appId}/use/all`,
    method: 'get'
  })
}

// 获取应用密钥
export const getSecret = (appId) => {
  return request({
    url: `/mgr/jvs-design/app/${appId}/secret`,
    method: 'get',
  })
}

// 获取应用所有工作流
export const getAllWorkflowByApp = (appId) => {
  return request({
    url: `/mgr/jvs-design/app/${appId}/workflow/design`,
    method: 'get',
  })
}


// 获取帐号密码ip的mysql数据
export const getMysql = (params, jvsAppId) => {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/JvsApp/sync/ip`,
    method: 'post',
    data: params
  })
}

// 同步数据
export const syncData = (params, jvsAppId) => {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/JvsApp/sync/sync`,
    method: 'post',
    data: params
  })
}

// 同步操作返回进度
export const getSyncProcess = (jvsAppId) => {
  return request({
    url: `/mgr/jvs-design/app/${jvsAppId}/JvsApp/sync/sync`,
    method: 'get',
  })
}

// 应用操作日志分页
export const getAppLogPage = (params) => {
  let obj = {}
  for(let i in params) {
    if(i != 'jvsAppId') {
      obj[i] = params[i]
    }
  }
  return request({
    url: `/mgr/jvs-design/app/${params.jvsAppId}/jvsLog/page`,
    method: 'get',
    params:  obj
  })
}


// 设置应用详情
export const setLongtext = (params) => {
  return request({
    url: base + `app/${params.id}/text`,
    method: 'put',
    data: params
  })
}

// 指定首页
export const setIndexPage = (data) => {
  return request({
    url: `/mgr/jvs-auth//tenant/default/index`,
    method: 'put',
    data: data
  })
}
