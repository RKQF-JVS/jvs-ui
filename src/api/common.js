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
    method: 'get'
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
