export const localMenu =  {
  platformMenu: [
    {
      name: '平台',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/accountManage",
            name: "账号管理",
          },
          name: "账号管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "iconxiaoneiduanqishangwangzhanghaoshenqingbiao",
            url: "/jvs-upms-ui/tenant",
            name: "租户组织",
          },
          name: "租户组织",
        },
        {
          extend: {
            newWindow: false,
            icon: "iconfenjianhuoguanli",
            url: "/jvs-upms-ui/tenantRole",
            name: "平台角色",
          },
          name: "平台角色",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/systemlogs",
            name: "系统日志",
          },
          name: "系统日志",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/errlogs",
            name: "操作日志",
          },
          name: "操作日志",
        },
      ]
    },
    {
      name: '扩展开发',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "iconsaomiaoguanli",
            url: "/jvs-upms-ui/application",
            name: "终端管理",
          },
          name: "终端管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "iconxinjianwangluoIPwangluoshenqingbiao",
            url: "/jvs-upms-ui/resource",
            name: "菜单管理",
          },
          name: "菜单管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "icon-laodongnenglijianding",
            url: "/jvs-upms-ui/dictionaries",
            name: "系统字典",
          },
          name: "系统字典",
        },
        {
          extend: {
            newWindow: true,
            icon: "iconhoucangguanlisvg1",
            url: "/jvs-upms-ui/iconList",
            name: "图标库",
          },
          name: "图标库",
        },
      ]
    },
    {
      name: '网关配置',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "icon-icon_4-04",
            url: "/jvs-upms-ui/gatewayRouter",
            name: "网关自定义路由表",
          },
          name: "网关自定义路由表",
        },
        {
          extend: {
            newWindow: false,
            icon: "icon-icon_4-04",
            url: "/jvs-upms-ui/gatewayIgnore",
            name: "网关加密忽略",
          },
          name: "网关加密忽略",
        },
        {
          extend: {
            newWindow: false,
            icon: "icon-icon_4-04",
            url: "/jvs-upms-ui/xssIgnore",
            name: "网关XSS忽略",
          },
          name: "网关XSS忽略",
        },
        {
          extend: {
            newWindow: false,
            icon: "icon-icon_4-03",
            url: "/jvs-upms-ui/errCode",
            name: "网关错误码",
          },
          name: "网关错误码",
        },
        {
          extend: {
            newWindow: false,
            icon: "icon-icon_1-24",
            url: "/jvs-upms-ui/gatewayUrl",
            name: "网关权限忽略配置",
          },
          name: "网关权限忽略配置",
        },
      ]
    },
  ],
  systemMenu: [
    {
      name: '组织',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/systeminfo",
            name: "基本信息",
          },
          name: "基本信息",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/group",
            name: "团队管理",
          },
          name: "团队管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/role",
            name: "角色管理",
          },
          name: "角色管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/department",
            name: "用户管理",
          },
          name: "用户管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/usercheck",
            name: "用户审核",
          },
          name: "用户审核",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/postList",
            name: "岗位管理",
          },
          name: "岗位管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/bulletin",
            name: "公告管理",
          },
          name: "公告管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/message",
            name: "消息管理",
          },
          name: "消息管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/userLevel",
            name: "用户等级",
          },
          name: "用户等级",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/userdel",
            name: "删除用户",
          },
          name: "删除用户",
        },
      ],
    },
    {
      name: '系统',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/onlineUser",
            name: "会话管理",
          },
          name: "会话管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/loginlogs",
            name: "登录日志",
          },
          name: "登录日志",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/file",
            name: "文件管理",
          },
          name: "文件管理",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/orglogout",
            name: "注销组织",
          },
          name: "注销组织",
        },
      ],
    },
    {
      name: '开发者',
      children: [
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/shortmessagetemplate",
            name: "短信消息模板",
          },
          name: "短信消息模板",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/mailconfig",
            name: "邮箱配置",
          },
          name: "邮箱配置",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/shortmessage",
            name: "短信配置",
          },
          name: "短信配置",
        },
        {
          extend: {
            newWindow: false,
            icon: "",
            url: "/jvs-upms-ui/oauthconfig",
            name: "oauth配置",
          },
          name: "oauth配置",
        },
        // {
        //   extend: {
        //     newWindow: false,
        //     icon: "",
        //     url: "",
        //     name: "集成自动化",
        //   },
        //   name: "集成自动化",
        // },
      ],
    },
  ]
}
