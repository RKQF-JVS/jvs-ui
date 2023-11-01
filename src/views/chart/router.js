export default [
	{
		path: '/chart',
		name: '图表引擎',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/list/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
  {
    path: '/chartShow',
    name: '预览',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/list/show'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/chartDesign',
    name: '设计',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/list/design'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  }
]
