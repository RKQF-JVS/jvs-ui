export default [
  {
    path: "/doc/demo",
    name: "案例",
    component: () =>
      import(/* webpackChunkName: "page" */ "./views/demo/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/doc/index",
    name: "文档 | 组件说明",
    component: () =>
      import(/* webpackChunkName: "page" */ "./views/index/menu"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/doc/permission",
    name: "权限配置",
    component: () =>
      import(/* webpackChunkName: "page" */ "./views/permission/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/doc/tbshare",
    name: "前端开发文档",
    component: () =>
      import(/* webpackChunkName: "page" */ "./views/tb/share"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  }
];
