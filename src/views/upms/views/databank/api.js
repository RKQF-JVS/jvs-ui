import request from '@/router/axios'

// 获取数据源表结构
export function getSourcestructure(data) {
    return request({
        url: `/mgr/jvs-data-factory/data/source/get/structure/${data.dataSourceId}/${data.tableName}`,
        method: "get"
    });
}
// 获取数据源表结构-new
export function getSourcestructureNew(data) {
  return request({
      url: `/mgr/jvs-data-factory/data/source/select/structure/${data.dataSourceId}/${data.sourceType}/${data.sourceType=='dataModel'?data.id:data.tableName}`,
      method: "get"
  });
}


// 获取指定数据源的表
export function getSourcetable(data) {
    return request({
        url: `/mgr/jvs-data-factory/data/source/list/table`,
        method: "get",
        params:data
    });
}
// 获取指定数据源的表-new
export function getSourceTableNew(data){
  return request({
    url:`/mgr/jvs-data-factory/data/source/select/structure/${data.id}/${data.sourceType}`,
    method:'get',
  })
}
// 获取所有数据源
export function sourceList() {
    return request({
        url: `/mgr/jvs-data-factory/data/source/list`,
        method: "get"
    });
}
// 保存数据源
export const setsourceSave = (data) => {
    return request({
      url: `/mgr/jvs-data-factory/data/source/save`,
      method: 'post',
      data:  data
    })
}
// 可选数据来源
export function sourceSelect(params) {
    return request({
        url: `/mgr/jvs-data-factory/data/source/select`,
        method: "get",
        params: params
    });
}
// 重新同步
export const sourceStructure = (data) => {
    return request({
      url: `/mgr/jvs-data-factory/data/source/sync/structure`,
      method: 'post',
      data:  data
    })
}
// 删除数据源
export const delSource = (id) => {
    return request({
        url: `/mgr/jvs-data-factory/data/source/${id}`,
        method: "delete"
    });
}
// 获取所有类型
export const getAllFileType= ()=>{
  return request({
    url:'/mgr/jvs-data-factory/data/source/get/field/type',
    method:'get'
  })
}
// 更新数据类型
export const changeFileType = (data)=>{
  return request({
    url:`/mgr/jvs-data-factory/data/source/update/structure`,
    method:'put',
    data
  })
}
