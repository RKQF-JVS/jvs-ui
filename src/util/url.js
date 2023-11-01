import Vue from 'vue'
import {downloadRequest} from '@/api/common'
export default {
  install (Vue, options) {
    // 打开链接 用于 预览、下载、打开地址
    Vue.prototype.$openUrl=function (url, type, dictKey) {
      if (dictKey) {
        this.$store.state.common.systemHelpDict.forEach(item => {
          if (item.label === dictKey) {
            url = item.value
          }
        })
      }
      let typeTemp='_blank'
      if (type) {
        typeTemp=type
      }
      if (url) {
        let link=document.createElement('a')
        link.style.display='none'

        // 文件流下载 导出
        if(url.startsWith('/mgr') && !url.includes('print')) {
          downloadRequest(url).then(res => {
            let name = res.headers["content-disposition"].split(";")[1]
            name = name.split("=")[1]
            name = decodeURI(name)
            if(name) {
              link.download = name
            }
            let isExcel = false
            if(name && name.includes('.') && ['xlsx', 'xls'].indexOf(name.split('.')[1]) > -1) {
              isExcel = true
            }
            var blob = new Blob([res.data], isExcel ? {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'} : null)
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        }else{
          link.target=typeTemp
          link.href=url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
  }
}
