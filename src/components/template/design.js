export const formColumn = [
  {
    label: "表单名称",
    prop: "name",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入表单名称', trigger: 'blur' },
      { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
    ],
  },
  {
    label: "表单描述",
    prop: "description",
    searchSpan: 4,
    search: true
  },
  {
    label: "图标",
    prop: "icon",
    type: 'iconSelect'
  }
]

export const pageColumn = [
  {
    label: "页面名称",
    prop: "name",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入页面名称', trigger: 'blur' },
      { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
    ],
  },
  // {
  //   label: "页面描述",
  //   prop: "description",
  //   searchSpan: 4,
  //   search: true
  // },
  {
    label: "图标",
    prop: "icon",
    type: 'iconSelect'
  }
]

export const flowColumn = [
  {
    label: "流程名称",
    prop: "name",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入流程名称', trigger: 'blur' },
    ],
  },
  {
    label: '流程分组',
    prop: 'designGroup',
    type: 'select',
    dicData: [],
    filterable: true,
    allowcreate: true,
    defaultValue: '未分类',
    tips:{
      position: 'bottom',
      text: '可以输入类型，或选择已经存在的分组'
    }
  },
  {
    label: '流程图标',
    prop: 'icon',
    type: 'iconSelect',
    iconType: 'svg',
    formSlot: true
  },
  {
    label: '终止模式',
    prop: 'enableCancel',
    type: 'radio',
    defaultValue: false,
    dicData: [
      {label: '允许申请人强制终止流程', value: true},
      {label: '禁止申请人强制终止流程', value: false}
    ],
    tips:{
      position: 'bottom',
      text: '申请人可以在流程流转到任何节点时进行强制终止，终止后将不能继续流转'
    }
  }
]

export const chartColumn = [
  {
    label: "图表名称",
    prop: "name",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入图表名称', trigger: 'blur' },
      { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
    ],
  },
  {
    label: "图表描述",
    prop: "description",
    searchSpan: 4,
    search: true
  },
  {
    label: "图标",
    prop: "icon",
    type: 'iconSelect'
  }
]

export const customColumn = [
  {
    label: "页面名称",
    prop: "name",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入页面名称', trigger: 'blur' },
      { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
    ],
  },
  {
    label: "目标地址",
    prop: "url",
    searchSpan: 4,
    search: true,
    rules: [
      { required: true, message: '请输入目标地址', trigger: 'blur' },
    ],
  },
  {
    label: "描述",
    prop: "description",
    searchSpan: 4,
    search: true
  },
  {
    label: "图标",
    prop: "icon",
    type: 'iconSelect'
  },
]
