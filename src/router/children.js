import upmsRouter from "@/views/upms/router";
import pageRouter from "@/views/page/router"
import chartRouter from "@/views/chart/router"
import ruleRouter from "@/views/rule/router"
import flowableRouter from "@/views/flowable/router"
import docRouter from "@/views/document/router"
import weixinMPRouter from "@/views/weixin-mp/router"
import reportRouter from "@/views/report/router"
import iconRouter from '@/views/iconmanage/router'
export default [...upmsRouter, ...pageRouter, ...chartRouter, ...ruleRouter, ...flowableRouter, ...docRouter, ...weixinMPRouter, ...reportRouter, ...iconRouter]
