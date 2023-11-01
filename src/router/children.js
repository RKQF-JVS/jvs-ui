import upmsRouter from "@/views/upms/router";
import docRouter from "@/views/document/router"
import weixinMPRouter from "@/views/weixin-mp/router"
import iconRouter from '@/views/iconmanage/router'
export default [...upmsRouter, ...docRouter, ...weixinMPRouter, ...iconRouter]

// 监听子页面传值
window.addEventListener('message',function(e){
  if(e.data) {
    if(e.data.command == 'fresh') {
      location.reload()
    }
  }
},false);
