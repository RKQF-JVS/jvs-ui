/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import {validatenull} from '@/util/validate'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getStore} from '@/util/store'
NProgress.configure({showSpinner: false})

/**
 * 导航守卫，相关内容可以参考:
 * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
 */
router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
    return ele.value === to.fullPath
  })) {
    to.meta.$keepAlive = true
  } else {
    NProgress.start()
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = false
    }
  }
  const meta = to.meta || {}
  // 第三方跳转登录不做拦截
  if(to.path == '/login' && to.query && to.query.app_client_id && to.query.call_back_url) {
    let url = ""
    url = to.fullPath
    localStorage.setItem('loginQuery', url)
    next('/login')
  }else{
    routerAddTags(to,meta,next,from)
  }
  //todo 先跳过登录
  // next()

})

router.afterEach(() => {
  NProgress.done()
  const title = store.getters.tag.label
  router.$jvsRouter.setTitle(title)
})


function routerAddTags(to, meta, next, from) {
  if (getStore({name: 'access_token'}) && store.getters.tenantId) { // store.getters.access_token && store.getters.tenantId
    if (to.path === '/login') {
      if(to.query && to.query.source && to.query.uuid) {
        next('/info/index?act=userManager')
      }else{
        let url = localStorage.getItem('loginQuery')
        if(url) {
          localStorage.clear()
          localStorage.setItem('loginQuery', url)
          next('/login')
        }else{
          next({path: '/'})
        }
      }
    } else {
      const value = to.query.src || to.fullPath
      const label = to.query.name || to.name
      if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
        store.commit('ADD_TAG', {
          label: label,
          value: value,
          params: to.params,
          query: to.query,
          hash: to.hash,
          group: router.$jvsRouter.group || []
        })
      }
      if (store.getters.roles.length === 0) {
        // next('/login')
        next()
      } else {
        next()
      }
    }
  } else {
    if (meta.isAuth === false) {
      next()
    } else {
      let str = ""
      if(to.query && to.query.source && to.query.uuid) {
        str += `?act=${to.query.act}&source=${to.query.source}&uuid=${to.query.uuid}`
      }
      if(store.state.common.template) {
        next(store.state.common.template + str)
      }else{
        next('/login' + str)
      }
    }
  }
}
