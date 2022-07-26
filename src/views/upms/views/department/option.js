import Vue from "vue"
export const tableOption = {
    page: true,
    align: 'center',
    menuAlign: 'center',
    viewBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false, // Vue.prototype.$permissionMatch("yong_hu_guan_lishan_chu_yong_hu"),
    selection: false,
    search: false,
    inline: true,
    showOverflow: true,
    isSearch: true,
    labelWidth: 'auto',
    submitBtnText: '查询',
    menuWidth: '250px',
    cancal: false,
    column: [
      {
        label: '头像',
        prop: 'headImg',
        display: false,
        type: 'image',
        slot: true
      },
      {
        label: '用户名',
        prop: 'accountName',
        span: 6,
        formSlot: true,
        rules: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        display: false,
        hide: true
      },
      {
        label: '姓名',
        prop: 'realName',
        span: 6,
        rules: [
          { required: true, message: '请输入真名', trigger: 'blur' }
        ]
      },
      {
        label: '昵称',
        prop: 'nickName',
        span: 6,
        hide: true,
        display: false
      },
      {
        label: '性别',
        prop: 'sex',
        span: 6,
        type: 'radio',
        dicData: [
          {label: '男', value: 'male'},
          {label: '女', value: 'female'},
          {label: '保密', value: 'unknown'}
        ],
      },
      {
        label: '手机号',
        prop: 'phone',
        span: 6,
        rules: [
          { required: true, message: '请输入手机号', trigger: ['blur'] }
        ]
      },
      {
        label: '角色',
        prop: 'roleName',
        span: 24,
        hide: true,
        slot: true,
        display: false,
      },
      {
        label: '角色',
        prop: 'roleIds',
        span: 24,
        dicData: [],
        multiple: true,
        hide: true,
        formSlot: true,
        props: {
          label: 'roleName',
          value: 'id'
        },
        // tips: {
        //   position: 'bottom',
        //   text: '用作功能权限'
        // },
        display: false
      },
      {
        label: "部门",
        prop: "deptId",
        span: 6,
        hide: true,
        formSlot: true,
      },
      {
        label: '部门',
        prop: 'deptName',
        span: 24,
        display: false
        // tips: {
        //   position: 'bottom',
        //   text: '用作数据权限'
        // },
      },
      {
        label: '邮箱',
        prop: 'email',
        span: 6,
        hide: true,
        rules: [
          { required: true, message: '请输入邮箱', trigger: ['blur'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      {
        label: "岗位",
        prop: "jobName",
        span: 6,
        display: false
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
        sort: true,
        span: 12
      },
      {
        label: "职位",
        prop: "jobId",
        span: 6,
        hide: true,
        type: "select",
        slot: true,
        placeholder: '请输入或选择职位',
        clearable: true,
        dicData: [],
        props: {
          label: 'name',
          value: 'id'
        },
        // tips: {
        //   position: 'bottom',
        //   text: '用作数据权限'
        // },
        filterable: true
      },
      {
        label: '账号等级',
        prop: 'level',
        span: 24,
        hide: true,
        type: 'inputNumber',
        min: 1,
        precision: 0,
        // tips: {
        //   position: 'bottom',
        //   text: '用作数据权限'
        // },
      },
      {
        label: '状态',
        prop: 'lockFlag',
        type: 'switch',
        span: 24,
        hide: true,
        dicData: [
          { label: '未锁定', value: false },
          { label: '锁定', value: true }
        ],
        activetext: '锁定',
        inactivetext: '未锁定',
        tips: {
          position: 'bottom',
          text: '用户锁定后，将无法登录'
        },
        display: false
      },
      {
        label: '职工编号',
        prop: 'employeeNo',
        span: 6,
        hide: true
      },
      {
        label: '生日',
        prop: 'birthday',
        span: 6,
        hide: true,
        type: 'datePicker',
        datetype: 'date',
        format: "yyyy-MM-dd",
        valueFormat: "yyyy-MM-dd",
        display: false
      },
      {
        label: '入职日期',
        prop: 'hireDate',
        span: 6,
        hide: true,
        type: 'datePicker',
        datetype: 'date',
        format: "yyyy-MM-dd",
        valueFormat: "yyyy-MM-dd",
        display: false
      }
    ]
  }

export const importOptionData = {
  addBtn: false,
  search: false,
  viewBtn: false,
  editBtn: false,
  page: false,
  delBtn: false,
  showOverflow: false,
  align: 'center',
  menuAlign: 'center',
  column: [
    {
      label: '用户名',
      prop: 'accountName',
      span: 6,
      search: true,
      formSlot: true,
      slot: true,
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      width: 150,
    },
    {
      label: '姓名',
      prop: 'realName',
      span: 6,
      slot: true,
      rules: [
        { required: true, message: '请输入真名', trigger: 'blur' }
      ],
      width: 100,
    },
    {
      label: '昵称',
      prop: 'nickName',
      slot: true,
      span: 6,
    },
    {
      label: '性别',
      prop: 'sex',
      span: 6,
      // hide: true,
      slot: true,
      type: 'radio',
      width: 150,
      dicData: [
        {label: '男', value: '男'},
        {label: '女', value: '女'}
      ],
    },
    {
      label: '邮件',
      prop: 'email',
      span: 6,
      rules: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
      slot: true,
      width: 150
    },
    {
      label: '手机号',
      prop: 'phone',
      span: 6,
      search: true,
      rules: [
        { required: true, message: '请输入手机号', trigger: ['blur'] }
      ],
      width: 150,
      slot: true
    },
    {
      label: '角色',
      prop: 'roleId',
      span: 24,
      dicData: [],
      multiple: true,
      formSlot: true,
      slot: true,
      props: {
        label: 'roleName',
        value: 'id'
      },
      width: 200
    },
    {
      label: '部门',
      prop: 'deptId',
      span: 24,
      formSlot: true,
      slot: true,
      width: 150
    },
    {
      label: "职位",
      prop: "jobId",
      span: 6,
      type: "select",
      slot: true,
      placeholder: '请输入或选择职位',
      // dicUrl: '',
      dicData: [],
      props: {
        label: 'name',
        value: 'id'
      },
      width: 150
      // allowcreate: true,
      // filterable: true
    },
    {
      label: '职工编号',
      prop: 'employeeNo',
      span: 6,
      type: 'input',
      slot: true,
      width: 150
    },
    {
      label: '生日',
      prop: 'birthday',
      span: 6,
      type: 'datePicker',
      datetype: 'date',
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      slot: true,
      width: 230
    },
    {
      label: '入职日期',
      prop: 'hireDate',
      span: 6,
      type: 'datePicker',
      datetype: 'date',
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      slot: true,
      width: 230
    },
    {
      label: '锁定',
      prop: 'status',
      type: 'switch',
      span: 24,
      slot: true,
      dicData: [
        { label: '未锁定', value: false },
        { label: '锁定', value: true }
      ],
      activetext: '锁定',
      inactivetext: '未锁定'
    },
  ]
}
