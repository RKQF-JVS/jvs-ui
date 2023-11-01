let path = ''
export default [
	{
		path: path + '/pageList',
		name: '列表页',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/list/index'),
		meta: {
			keepAlive: false,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: path + '/form',
		name: '表单设计',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/show/formDesignList'),
		meta: {
			keepAlive: false,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: path + '/formList',
		name: '表单设计',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/form/list'),
		meta: {
			keepAlive: false,
			isTab: true,
			isAuth: false
		}
	},
  {
		path: path + '/form/info',
		name: '表单',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/show/info'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: path + '/design',
		name: '列表设计页',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/design/list'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
  },
	{
		path: path + '/crud/design',
		name: '列表设计',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/list/design'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
  },
	{
		path: path + '/show',
		name: '详情页',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/show/list'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
    },
    {
		path: path + '/normalform/design',
		name: '普通表单设计器',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/form/normal'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
    },
    {
		path: path + '/levelform/design',
		name: '多级表单设计器',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/form/level'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
    },
    {
		path: path + '/stepform/design',
		name: '步骤表单设计器',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/form/step'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
    },
    {
		path: path + '/detailform/design',
		name: '详情表单设计器',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/form/detail'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	}
]
