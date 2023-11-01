import request from '@/router/axios'

// 公共的字典转换接口
export function byKeyDicData (url) {
  return request({
    url: url,
    method: 'get'
  })
}

// 部门人员树
export function getDeptUserTree(){
  return request({
    url: `/mgr/jvs-auth//dept/user/tree`,
    method:'get'
  })
}

// 根据类型返回树数据
export function getUserTreeType(data){
  return request({
    url: `/mgr/jvs-auth//user/user/selected`,
    method:'post',
    data: data
  })
}

// 分页查询用户
export function getUserListPage(params){
  return request({
    url: `/mgr/jvs-auth//user/user/selected/page`,
    method: 'get',
    params: params
  })
}

// 搜索用户
export function searchUser(params){
  return request({
    url: `/mgr/jvs-auth//user/user/search`,
    method:'get',
    params: params
  })
}

// 导出  下载文件
export const downloadRequest = (url) => {
  return request({
    url: url,
    method: 'get',
    responseType: 'arraybuffer',
  })
}

// 获取全部角色信息
export function getRoleList() {
  return request({
    url: `/mgr/jvs-auth/role/all/userRole`,
    method: "GET"
  });
}

// 获取所有用户
export function getUserListAll() {
  return request({
    url: `/mgr/jvs-auth//user/all`,
    method: "GET"
  });
}

// 获取所有用户
export function getSelectedUsers(data) {
  return request({
    url: `/mgr/jvs-auth//user/all`,
    method: "post",
    data: data
  });
}

// 执行逻辑
export const ruleRun = (jvsAppId, ruleKey, data, headers) => {
  let tp = {
    url: `/mgr/jvs-design/app/${jvsAppId}/design/rule/run/${ruleKey}`,
    method: 'post',
    data: data
  }
  if(headers) {
    tp.headers = headers
  }
  return request(tp)
}

// 获取配置文件名
export const getPlugins = (name)=>{
  return request({
    // url: `/mgr/document/jvs-knowledge-plugins/${name}`,
    url:`/get/nacos/config/${name}`,
    method: 'get',
    headers: {
      isToken: false,
    },
  })
}

// 获取应用授权信息
export function getLicense(data){
  return request({
    url:`/mgr/jvs-auth/license`,
    method:'get',
    params:data
  })
}

// 更新授权
export function updateLicense(data){
  return request({
    url:`/mgr/jvs-auth/license`,
    method:'post',
    headers: {
      serialize:false,
      type:"FormData",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:data
  })
}

// 校验
export function veriLicense(data){
  return request({
    url:`/mgr/jvs-auth/license/verification`,
    method:"get",
    isReturn:true,
    params:data
  })
}

// 判断是否有授权
export function checkLicense(data){
  return request({
    url:`/mgr/jvs-auth/license/check`,
    method:'get',
    params:data
  })
}

// 消息通知选择人员选项
export function getNOticeUserOption(jvsAppId, modelId){
  return request({
    url:`/mgr/jvs-design/app/${jvsAppId}/data/notice/user/options/${modelId}`,
    method:'get'
  })
}

// 检查配置是否配置了如果有配置则可以使用，未配置，则不能使用
export function getTenantConfig(){
  return request({
    url:`/mgr/jvs-auth//tenant/admin/base/check`,
    method:'get'
  })
}
