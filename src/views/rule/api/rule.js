import request from '@/router/axios'

// 保存一个新的 逻辑
export function SavaJSON (obj) {
  return request({
    url: `/mgr/rule/rule`,
    method: 'put',
    params: obj
  })
}

// 获取所有逻辑  (分页)
export function getList (obj) {
  return request({
    url: `/mgr/rule/rule/page`,
    method: 'get',
    params: obj
  })
}

// 删除
export function delEdition (id) {
  return request({
    url: `/mgr/rule/rule/${id}`,
    method: 'delete'
  })
}

// 修改信息
export function editJSON (id, obj) {
  return request({
    url: `/mgr/rule/rule/${id}`,
    method: 'put',
    data: obj
  })
}

// 根据key获取一个逻辑的设计信息
export function getTemplatejson (key) {
  return request({
    url: `/mgr/rule/rule/${key}`,
    method: 'get'
  })
}

// 定时任务设置
export function setTask (id, data) {
  return request({
    url: `/mgr/rule/rule/task/${id}`,
    method: 'post',
    data: data
  })
}

// 获取所有方法
export function getFuncList () {
  return request({
    url: `/mgr/rule/custom/function/list`,
    method: 'get'
  })
}

// 获取所有的方法分组
export function getFuncGroup () {
  return request({
    url: `/mgr/rule/custom/function/group`,
    method: 'get'
  })
}

// 根据逻辑Key获取所有的版本号
export function getVersionList (key) {
  return request({
    url: `/mgr/rule/rule/versions/${key}`,
    method: 'get'
  })
}

// 保存当前设计信息
export function saveOrUpdateDesign (data) {
  return request({
    url: `/mgr/rule/rule/design`,
    method: 'post',
    data: data
  })
}

// 测试运行逻辑 cron
export function getCronList (data) {
  return request({
    url: `/mgr/rule/cron`,
    method: 'post',
    data: data
  })
}

// 删除版本号
export function delVersion (id) {
  return request({
    url: `/mgr/rule/rule/design/${id}`,
    method: 'delete'
  })
}

// 获取类型资源信息
export function getClassType (key) {
  return request({
    url: `/mgr/rule/resources/getClassType`,
    method: 'get'
  })
}

// 方法测试
export function testFunction (data) {
  return request({
    url: `/mgr/rule/custom/function/test`,
    method: 'post',
    data: data
  })
}

// 逻辑测试
export function testLJ (id, data) {
  return request({
    url: `/mgr/rule/design/${id}`,
    method: 'get', //'put',
    // data: data
  })
}

// 代码说明
export function getCodeDoc () {
  return request({
    url: `/mgr/rule/design/doc`,
    method: 'get'
  })
}

// 逻辑得 启用 和 禁用
export function enable (id) {
  return request({
    url: `/mgr/rule/rule/design/enable/${id}`,
    method: 'get'
  })
}

// 分页查询某一个逻辑执行的日志服务
export function pageLog (key, params) {
  return request({
    url: `/mgr/rule/log/page/${key}`,
    method: 'get',
    params: params
  })
}

// 保存逻辑变量
export function saveParameter (data) {
  return request({
    url: `/mgr/rule/design/saveParameter`,
    method: 'post',
    data: data
  })
}

// 保存自定义配置参数
export function saveCustomOption (code, data) {
  return request({
    url: `/mgr/rule/design/customOption/${code}`,
    method: 'post',
    data: data
  })
}



// // 导出文件
// export function exportWordGet (data) {
//   return postRequest(`/rule-design/export/word`, data)
// }

// // 获取备注
// export function getExportWord (id) {
//   return postRequest(`/rule-design/export/${id}`)
// }

// // ----
// // 获取渲染json 数据
// export function getTemplatejson (id) {
//   return getRequest(`/rule-design/rule/${id}`)
// }

// // 保存一个设计图的草稿
// export function saveHtml (obj) {
//   return postRequest(`/rule-design/rule/rendering`, obj)
// }

// // 获取表 视图列表
// export function getBiao () {
//   return getRequest(`/rule-design/dynamic-table/getAll`)
// }

// 获取 可 执行得方法列表
// export function getFuncs () {
//   return getRequest(`/rule-design/custom/function/list`)
// }

// // 获取所有的数据类型
// export function getClassType () {
//   return getRequest(`/rule-design/resources/getClassType`)
// }

// // 测试运行
// export function testrun (id, obj) {
//   return postRequest(`/rule-design/test/run/${id}`, obj)
// }

// //  获取所有运算符
// export function fetchOperator () {
//   return getRequest(`/rule-design/resources/operator`)
// }

// //  获取所有运算符
// export function fetchOperator2 () {
//   return getRequest(`/rule-design/resources/if/operator`)
// }

// // 生成逻辑代码
// export function Generation (id) {
//   return getRequest(`/rule-design/design/${id}`)
// }

// // 方法的测试
// export function functiontest (data) {
//   return postRequest(`/rule-design/custom/function/test/`, data)
// }

// // 逻辑的测试
// export function ruletest (id, data, type) {
//   return putRequest(`/rule-design/design/${id}/${type}`, data)
// }

// // 逻辑的测试
// export function jsonExport (data) {
//   return postRequest(`/rule-design/json/export`, data)
// }

// // 风控参数获取
// export function riskParameter (secret) {
//   return getRequest(`/rule-design/pi/risk/parameter/${secret}`)
// }
