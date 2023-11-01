export default [
	{
		path: '/resource',
		name: '资源管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/resource/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: "/department",
		name: "部门管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/department/index"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/role",
		name: "角色管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/role/index"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/tenantRole",
		name: "租户角色",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/tenantRole/index"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/log",
		name: "日志管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/log/index"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: "/message",
		name: "消息管理",
		component: () =>
			import(/* webpackChunkName: "page" */ "./views/message/index"),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/tenant',
		name: '租户管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/tenant/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: '/oprationlog',
		name: '操作管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/oprationLog/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: '/dictionaries',
		name: '字典管理',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/dictionaries/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	// {
	// 	path: '/datapermision',
	// 	name: '数据权限',
	// 	component: () =>
	// 		import( /* webpackChunkName: "page" */ './views/dataPermision/index'),
	// 	meta: {
	// 		keepAlive: true,
	// 		isTab: true,
	// 		isAuth: false
	// 	}
	// },
	{
		path: '/sqllogs',
		name: 'SQL日志',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/sqlLog/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: '/apilogs',
		name: '请求日志',
		component: () =>
			import( /* webpackChunkName: "page" */ './views/apiLog/index'),
		meta: {
			keepAlive: true,
			isTab: true,
			isAuth: false
		}
	},
	{
		path: '/group',
		name: '人员群组',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/group/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/file',
		name: '文件管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/file/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/configlist',
		name: '配置管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/configManage/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/loginlogs',
		name: '用户登录日志',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/userLoginLogs/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/systemlogs',
		name: '系统日志',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/systemLog/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/basicsetting',
		name: '系统设置',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/systemSetting/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/treeDictionaries',
		name: '分类字典',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/treeDictionaries/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/regExpList',
		name: '正则字典',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/regExp/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/templateList',
		name: '模板管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/template/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/postList',
		name: '岗位管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/postList/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/errlogs',
		name: '错误日志',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/errorLog/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/version',
		name: '版本管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/versions/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/terminal',
		name: '终端管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/terminal/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/dataMigration',
		name: '数据迁移',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/dataMigration/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/application',
		name: '应用管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/application/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/inviteUser',
		name: '邀请 ',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/inviteUser/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/onlineUser',
		name: '在线用户',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/onlineUser/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/project',
		name: '项目管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/projectManage/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/bulletin',
		name: '公告管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/bulletin/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/errCode',
		name: '网关错误码',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/errCodeManage/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/gatewayUrl',
		name: '网关权限忽略配置',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/gatewayUrl/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/gatewayRouter',
		name: '网关自定义路由表',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/gatewayRouter/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/tempCenter',
		name: '模板中心配置',
		component: () =>
            import ( /* webpackChunkName: "page" */ '@/components/application/tempCenter'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/appRole',
		name: '应用角色管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ '@/components/application/appRole'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/accountManage',
		name: '应用角色管理',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/accountManage/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/gatewayIgnore',
		name: '网关加密忽略',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/gatewayIgnore/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/xssIgnore',
		name: '网关XSS忽略',
		component: () =>
            import ( /* webpackChunkName: "page" */ './views/xssIgnore/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
  {
    path: '/dataResource',
    name: '数据源管理',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/dataResource/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/systeminfo',
    name: '系统基本信息',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/systemInfo/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/shortmessage',
    name: '短信配置',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/shortMessage/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/shortmessagetemplate',
    name: '短信消息模板',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/shortMessageTemplate/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mailconfig',
    name: '邮箱配置',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/mailConfig/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/oauthconfig',
    name: 'oauth配置',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/oauthConfig/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/userlevel',
    name: '用户等级',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/userLevel/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/userdel',
    name: '删除用户',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/userDel/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/usercheck',
    name: '用户审核',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/userCheck/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/orgurl',
    name: '组织域名',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/orgUrl/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/orglogout',
    name: '注销组织',
    component: () =>
      import ( /* webpackChunkName: "page" */ './views/orgLogout/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
]
