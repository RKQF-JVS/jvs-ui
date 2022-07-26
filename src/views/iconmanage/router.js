export default [
	{
		path: '/iconList',
		name: '图标库',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	}
]
