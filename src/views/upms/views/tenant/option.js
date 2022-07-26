import Vue from "vue"
export const tableOption={
  page: true,
  align: 'center',
  menuAlign: 'center',
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false, // Vue.prototype.$permissionMatch("upms_mgr_zu_hu_shan_chu_zu_hu"), // true,
  selection: false,
  search: true,
  inline: true,
  showOverflow: true,
  isSearch: true,
  labelWidth: 'auto',
  submitBtnText: '查询',
  cancal: false,
  column: [
    // {
    //   label: '基本信息设置',
    //   type: 'title',
    //   hide: true,
    //   span: 24
    // },
    {
      label: '系统名称', // '公司简称',
      prop: 'shortName',
      span: 16,
      maxlength: 20,
      showwordlimit: true,
      rules: [
        { required: true, message: '请输入系统名称', trigger: 'blur' }
      ],
      tips: {
        position: 'bottom',
        text: '系统名称建议使用10字汉字，此名称将被作为登录页、页面标题、首页信息展示。'
      }
    },
    {
      label: '公司全称',
      prop: 'name',
      span: 16,
      search: true,
      searchSpan: 4,
      rules: [
        { required: true, message: '请输入公司全称', trigger: 'blur' }
      ],
      tips: {
        position: '',
        text: ''
      }
    },
    {
      label: '登录域名',
      prop: 'loginDomain',
      span: 16,
      prepend: 'https://',
      append: '.jvs.bctools.cn',
      rules: [
        { required: false, message: '请输入登录域名', trigger: 'blur' }
      ],
      tips: {
        position: 'bottom',
        text: '请填写2-15位英文字符'
      },
      regularExpression: '^[a-z]{2,15}$',
      regularMessage: '格式错误'
    },
    {
      label: '状态',
      prop: 'enable',
      display: false,
      span: 16,
      dicData: [
        {label: '启用', value: true},
        {label: '禁用', value: false}
      ]
    },
    {
      label: '手机',
      prop: 'phone',
      span: 16,
      // search: true,
      rules: [
        { required: true, message: '请填写系统管理员的手机号', trigger: 'blur' }
      ],
      hide: true,
      tips: {
        position: 'bottom',
        text: '手机号默认为管理员帐号'
      },
      display: false
    },
    {
      label: '公司地址',
      prop: 'addr',
      span: 16,
      hide: true
    },
    {
      label: '公司简介',
      prop: 'descMsg',
      span: 16,
      hide: true
    },
    {
      label: '默认首页',
      prop: 'defaultIndexUrl',
      span: 16,
      hide: true,
      tips: {
        position: 'bottom',
        text: '用户登录后，访问的第一个页面，默认情况为动态配置页面。可根据业务系统选择不一样的首页地址。具体填写请联系运维部署人员。'
      }
    },
    {
      label: '登录类型',
      prop: 'loginTypes',
      span: 16,
      type: 'checkbox',
      multiple: true,
      slot: true,
      formSlot: true,
      dicData: [
        {label: '帐号密码', value: 'password'},
        {label: '手机号', value: 'phone'},
        {label: '微信二维码', value: 'wx_qr'},
        {label: 'APP二维码', value: 'app_qr'}
      ],
      rules: [
        { required: true, message: '请选择登录类型', trigger: 'change' }
      ],
      display: false,
      hide: true
    },
    {
      label: 'AppId',
      prop: 'appId',
      display: false,
      hide: true,
      span: 16,
    },
    {
      label: 'AppSecret',
      prop: 'secret',
      display: false,
      hide: true,
      tips: {
        position: 'bottom',
        text: '请填写微信的AppSecret,<a style="color:#409EFF;text-decoration:underline;" href="https://pay.weixin.qq.com/static/ pay_ setting/appid_ _protocol.shtml" target="_blank">详情帮助</a>'
      },
      span: 16,
    },
    {
      label: "创建时间",
      prop: "createTime",
      // span: 6,
      display: false,
      type: "datePicker",
      datetype: 'datetime',
      format: "yyyy-MM-dd HH:mm:ss",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      span: 12
    },
    {
      label: '页面配置',
      type: 'title',
      hide: true,
      span: 24
    },
    {
      label: 'ICON',
      prop: 'icon',
      span: 24,
      hide: true,
      formSlot: true
    },
    {
      label: 'LOGO',
      prop: 'logo',
      hide: true,
      formSlot: true,
      span: 24,
    },
    {
      label: '背景图',
      prop: 'bgImg',
      hide: true,
      formSlot: true,
      span: 24,
    },
    {
      label: '登录模板',
      prop: 'templateId',
      // formSlot: true,
      hide: true,
      display: false,
      span: 16,
    }
  ]
}
