import Vue from "vue";
import VueRouter from "vue-router";
import PageRouter from "./page/";
import ViewsRouter from "./views/";
import jvsRouter from "./jvs-router";
import Store from "../store/";
import childrenRouter from './children'
Vue.use(VueRouter);
let Router = new VueRouter({
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      };
    }
  },
  routes: [].concat([])
});
jvsRouter.install(Router, Store);
Router.$jvsRouter.formatRoutes(Store.state.user.menu, false);
Router.addRoutes([...PageRouter, ...ViewsRouter, ...childrenRouter]);
export default Router;
