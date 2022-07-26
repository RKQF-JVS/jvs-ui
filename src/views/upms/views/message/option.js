export const tableOption={
  page: true,
  align: 'center',
  menuAlign: 'center',
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  selection: false,
  search: true,
  inline: true,
  showOverflow: true,
  submitBtnText: '查询',
  labelWidth: '100px',
  cancal: false,
  column: [
    {
      label: '标题',
      prop: 'title'
    },
    {
      label: '收件人',
      prop: 'recipients',
      search: true,
      clearable: true,
      slot: true
    },
    {
      label: '发送状态',
      prop: 'status',
      dicData: [
        { label: '失败', value: 0 },
        { label: '成功', value: 1 },
        { label: '未发送', value: 2 },
        { label: '发送中', value: 3}
      ],
      slot: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      dateType: "datetime",
      format: "yyyy-MM-dd hh:mm:ss",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
    },
    {
      label: '发送类型',
      prop: 'sendType',
      type: 'select',
      dicData: [
        {label: '邮箱', value: 'email'},
        {label: '短信', value: 'sms'},
        {label: '站内信', value: 'interior'},
      ],
      search: true,
      clearable: true
    },
    {
      label: '消息类型',
      prop: 'sendMessageType',
      type: 'select',
      dicData: [
        {label: '广播消息', value: 'broadcast'},
        {label: '警告消息', value: 'warning'},
        {label: '通知消息', value: 'notification'},
        {label: '系统消息', value: 'system'},
        {label: '业务消息', value: 'business'}
      ],
      search: true,
      clearable: true,
      slot: true
    }
  ]
}

export const messFormOption={
  inline: false,
  size: 'mini',
  cancal: false,
  submitBtnText: '保存',
  emptyBtn: false,
  labelWidth: '90px',
  submitLoading: false,
  column: [
    {
      label: '发送类型',
      prop: 'sendType',
      type: 'select',
      dicData: [
        {label: '邮箱', value: 'email'},
        {label: '短信', value: 'sms'},
        {label: '站内信', value: 'interior'},
      ],
      clearable: true,
      rules: [
        { required: true, message: '请选择发送类型', trigger: 'change' },
      ]
    },
    {
      label: '消息类型',
      prop: 'sendMessageType',
      type: 'select',
      dicData: [
        {label: '广播消息', value: 'broadcast'},
        {label: '警告消息', value: 'warning'},
        {label: '通知消息', value: 'notification'},
        {label: '系统消息', value: 'system'},
        {label: '业务消息', value: 'business'}
      ],
      clearable: true,
      rules: [
        { required: true, message: '请选择消息类型', trigger: 'change' },
      ]
    },
    {
      label: '收件人',
      prop: 'recipients',
      clearable: true,
      formSlot: true,
      rules: [
        { required: true, message: '请选择收件人', trigger: 'change' },
      ]
    },
    {
      label: '标题',
      prop: 'title',
      clearable: true,
      maxlength: 50,
      showwordlimit: true,
      rules: [
        { required: true, message: '请输入标题', trigger: 'blur' },
      ]
    },
    {
      label: '内容',
      prop: 'content',
      clearable: true,
      formSlot: true,
      rules: [
        { required: true, message: '请输入内容', trigger: ['change', 'blur'] },
      ]
    },
    // {
    //   label: '附件',
    //   prop: 'files',
    //   type: 'fileUpload',
    //   fileList: [],
    //   action: ''
    // },
  ]
}
