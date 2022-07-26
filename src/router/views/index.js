import Layout from '@/page/main/index/'
export default [{
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
        path: 'index',
        name: '首页',
        closable:true,
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/page/main/wel')
    }]
}, {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
        path: 'index',
        name: '个人信息',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/main/user/info'),
    }]
},{
    path: '/userinfo',
    name: '个人信息',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/main/user/index'),
    meta: {
        keepAlive: true,
        isTab: true,
        isAuth: false
    }
}]
