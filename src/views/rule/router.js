const base= '' // '/rule-design-ui'
export default [
  {
    path: base+'/ruleList',
    name: '列表',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/list'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: base + '/ruleDesign',
    name: 'design',
    component: () =>
      import( /* webpackChunkName: "page" */ './views/newDesign') // design')
  }
]
