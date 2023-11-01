import request from '@/router/axios'
import store from '@/store'
import {loadSVGStyle } from "@/util/util";

// 获取图标库
const getIcon = function() {
  return request({
    url: `/icon/all`,
    // url: `/mgr/jvs-auth/icon/all`,
    method: 'get',
    // params:{
    //   names:['流程图2','流程图1','流程图','未知图标库4','未知图标库','未知图标库2','未知图标库3','企业知识库图标']
    // }
  })
}
const getIconLib = function() {
  let allList = []
  getIcon().then(res => {
    if(res.data && res.data.code == 0 && res.data.data) {
      let data  = res.data.data
      store.commit('setLib', data)
      let tps = []
      data.forEach(ele => {
        tps.push(ele.label)
        if(ele.description){
          loadSVGStyle(ele.description,'js');
        }
        if(ele.value){
          loadSVGStyle(ele.value,'css');
        }
        allList = [...allList, ...[...ele.list]]
      });
      store.commit('setAllType', tps)
      store.commit('setIconList', allList)
    }
  })
}
export default getIconLib
