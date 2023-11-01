export default [
  {
    path: '/report/type',
    name: '报表类型管理',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/types/index.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/report/datasource',
    name: '数据集管理',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/datasource/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/report/screenTemplate',
    name: '大屏模板管理',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/screen/template'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/report/screenDesign',
    name: '大屏设计',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/screen/screenDesign.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/report/screenPreview',
    name: '大屏预览',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/screen/preview/index.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  // {
  //   path: '/reportTpl',
  //   name: '报表模板管理',
  //   component: () =>
  //     import( /* webpackChunkName: "page" */ './views/'),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // },
  // {
  //   path: '/roleReport',
  //   name: '查看报表',
  //   component: () =>
  //     import( /* webpackChunkName: "page" */ './views/'),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // },
  // {
  //   path: '/screenManage',
  //   name: '大屏管理',
  //   component: () =>
  //     import( /* webpackChunkName: "page" */ './views/'),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // },
  // {
  //   path: '/reportDesign',
  //   name: '报表设计',
  //   component: () =>
  //     import( /* webpackChunkName: "page" */ './views/'),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // },
  // {
  //   path: '/screenView',
  //   name: '大屏',
  //   component: () =>
  //     import( /* webpackChunkName: "page" */ './views/'),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // }
]
