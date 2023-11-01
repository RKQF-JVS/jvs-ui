export default [
	{
		path: '/accountList',
		name: '账号管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/system/accountList'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: "/subscribeTextList",
		name: "欢迎语管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/system/subscribeTextList"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/menuList",
		name: "公众号菜单",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/system/menuList"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/accountFansList",
		name: "粉丝管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/system/accountFansList"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/fansMsgList",
		name: "粉丝消息",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/system/fansMsgList"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},

	// 素材管理
	{
		path: "/textTemplateList",
		name: "文本管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/material/textTemplateList"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/newsTemplateList',
		name: '图文管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/material/newsTemplateList'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: '/newsTemplateForm',
		name: '编辑图文',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/material/newsTemplateForm'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	}
]
