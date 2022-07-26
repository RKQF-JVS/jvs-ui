import request from '@/router/axios'
import store from '@/store'
import {loadSVGStyle } from "@/util/util";

// 获取图标库
const getIcon = function() {
  return request({
    url: `/mgr/jvs-auth/icon/all`,
    method: 'get'
  })
}
const getIconLib = function() {
  let allList = []
  getIcon().then(res => {
    if(res.data && res.data.code == 0) {
      let data  = res.data.data
      store.commit('setLib', data)
      let tps = []
      data.forEach(ele => {
        tps.push(ele.label)
        loadSVGStyle(ele.description);
        allList = [...allList, ...[...ele.list]]
      });
      store.commit('setAllType', tps)
      store.commit('setIconList', allList)
    }
  })
}
export default getIconLib