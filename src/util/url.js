import Vue from 'vue'
import {downloadRequest} from '@/api/common'
export default {
  install (Vue, options) {
    // 打开链接 用于 预览、下载、打开地址
    Vue.prototype.$openUrl=function (url, type) {
      let typeTemp='_blank'
      if (type) {
        typeTemp=type
      }
      if (url) {
        let link=document.createElement('a')
        link.style.display='none'

        // 文件流下载 导出
        if(url.startsWith('/mgr')) {
          downloadRequest(url).then(res => {
            let name = res.headers["content-disposition"].split(";")[1]
            name = name.split("=")[1]
            name = decodeURI(name)

            if(name) {
              link.download = name
            }
            var blob = new Blob([res.data]) //,{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
            link.href = URL.createObjectURL(blob)
          })
        }else{
          link.target=typeTemp
          link.href=url
        }
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
