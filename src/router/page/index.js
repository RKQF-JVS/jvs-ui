import Layout from '@/page/main/index/'
export default [{
        path: '/login',
        name: '登录页',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/page/main/login/index'),
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/404',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/components/error-page/404'),
        name: '404',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }

    },
    {
        path: '/',
        name: '主页',
        redirect: '/wel'
    },
    {
        path: '/myiframe',
        component: Layout,
        redirect: '/myiframe',
        children: [{
            path: ":routerPath",
            name: 'iframe',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/components/iframe/main'),
            props: true
        }]
    },
    {
        path: '*',
        redirect: '/404',
    },
    // {
    //     path: '/pageconfig',
    //     component: () => import ('@/views/admin/pageconfig/index'),
    //     meta: {
    //         keepAlive: true,
    //         isTab: false,
    //         isAuth: false
    //     }
    // },
    {
        path: '/usermessage',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/page/main/message/index'),
        name: '消息中心',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/login/callback',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/main/wx/login'),
        name: '微信扫码登录',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    }
]
