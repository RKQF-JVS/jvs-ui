import request from '@/router/axios'
const base = '/mgr/jvs-auth/router'
import config from '../../package.json'
let version = config.version.split('.').join('')
// 发送本地路由
export const sendRouter= (data) => {
    return request({
        url: `${base}/router/list`,
        method: 'post',
        data: data,
        headers: {
            client: 'jvs-page-ui', // fixme 请修改为当前的项目名称
            name: encodeURI('列表页'), // fixme 请修改为当前的项目中文名称
            version: version,
        }
    })
}

// 根据jti 获取token
export const getToken = (str) => {
    return request({
        url: `/auth/token/convert/` + str,
        method: 'get',
    })
}

// 获取下拉列表
export const getSelectData = (str) => {
    return request({
        url: str,
        method: 'get',
    })
  }