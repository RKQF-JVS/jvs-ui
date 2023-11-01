export const list = [
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄"
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄"
  },
  {
    date: "016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄"
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄"
  }
]

export const columnTemp=[
  {
    label: "日期",
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address"
  }
]

export const tableParam = [
  {
    param: 'data',
    introduce: '显示的数据',
    type: 'array',
    value: '-',
    default: '-'
  },
  // {
  //   param: 'stripe',
  //   introduce: '是否为斑马纹 table',
  //   type: 'boolean',
  //   value: '-',
  //   default: 'false'
  // },
  {
    param: 'size',
    introduce: 'Table 的尺寸',
    type: 'string',
    value: 'medium | small | mini',
    default: '-'
  },
  {
    param: 'index',
    introduce: '是否显示索引',
    type: 'boolean',
    value: 'true | false',
    default: 'false'
  },
  {
    param: 'page',
    introduce: '分页参数',
    type: 'object',
    value: '-',
    default: '-'
  },
  {
    param: 'showHeader',
    introduce: '是否显示表头',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'highlightCurrentRow',
    introduce: '是否要高亮当前行',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'tooltipEffect',
    introduce: '超出隐藏鼠标移入显示内提示内容的主题',
    type: 'string',
    value: 'dark | light',
    default: '-'
  },
  {
    param: 'loading',
    introduce: '是否提示 等待加载',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'refs',
    introduce: '绑定的表格对象名称',
    type: 'string',
    value: '-',
    default: 'multipleTable'
  },
  {
    param: 'pageheadertitle',
    introduce: '表格顶部标题',
    type: 'string',
    value: '-',
    default: '-'
  },

  {
    param: 'selectable',
    introduce: '是否可以多选, 不建议使用此功能',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'isClearSelect',
    introduce: '是否清空多选',
    type: 'number',
    value: '随机数Math.random()',
    default: '0'
  },
  {
    param: 'option',
    introduce: '表格对应字段配置',
    type: 'object',
    value: '-',
    default: '-'
  }
]
export const option_data = [
  {
    param: 'border',
    introduce: '是否带有纵向边框',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'page',
    introduce: '是否分页',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'align',
    introduce: 'body列对齐方式',
    type: 'string',
    value: 'left | right | center',
    default: 'left'
  },
  {
    param: 'menuFix',
    introduce: '操作栏固定位置',
    type: 'string',
    value: 'left | right',
    default: 'right'
  },
  {
    param: 'menuAlign',
    introduce: '表头对齐方式',
    type: 'string',
    value: 'left | right | center',
    default: 'left'
  },
  {
    param: 'menuWidth',
    introduce: '操作栏宽度',
    type: 'string | number',
    value: '-',
    default: '-'
  },
  {
    param: 'indexLabel',
    introduce: '索引名称',
    type: 'string',
    value: '-',
    default: '序号'
  },
  {
    param: 'showOverflow',
    introduce: '超出是否合并移入悬浮tip显示',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'highlightCurrentRow',
    introduce: '是否高亮显示当前行',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'dialogWidth',
    introduce: '表单弹框宽',
    type: 'string',
    value: 'px 或 %',
    default: '75%'
  },

  {
    param: 'dialogClickModal',
    introduce: '是否可以通过点击modal关闭弹窗',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'dialogEscape',
    introduce: '是否可以通过esc关闭弹窗',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'addBtn',
    introduce: '新增按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'addBtnText',
    introduce: '新增按钮文字',
    type: 'string',
    value: '-',
    default: '新增'
  },
  {
    param: 'addDialogText',
    introduce: '新增表单弹框文字',
    type: 'string',
    value: '-',
    default: '新增'
  },
  {
    param: 'viewBtn',
    introduce: '查看按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'viewBtnText',
    introduce: '查看按钮文字',
    type: 'string',
    value: '-',
    default: '查看'
  },
  {
    param: 'editBtn',
    introduce: '编辑按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'editBtnText',
    introduce: '编辑按钮文字',
    type: 'string',
    value: '-',
    default: '编辑'
  },
  {
    param: 'editDialogText',
    introduce: '编辑表单弹框文字',
    type: 'string',
    value: '-',
    default: '编辑'
  },
  {
    param: 'delBtn',
    introduce: '删除按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'delBtnText',
    introduce: '删除按钮文字',
    type: 'string',
    value: '-',
    default: '删除'
  },
  {
    param: 'formAlign',
    introduce: '查询条件表单对齐方式',
    type: 'string',
    value: '-',
    default: 'right'
  },
  {
    param: 'inline',
    introduce: '表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'labelWidth',
    introduce: 'label宽, auto 或 px',
    type: 'string | number',
    value: '-',
    default: '-'
  },
  {
    param: 'submitBtn',
    introduce: '提交按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'submitBtnText',
    introduce: '提交按钮文字',
    type: 'string',
    value: '-',
    default: '提交'
  },
  {
    param: 'submitLoading',
    introduce: '默认表单提交按钮loading',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'emptyBtn',
    introduce: '重置按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'emptyBtnText',
    introduce: '重置按钮文字',
    type: 'string',
    value: '-',
    default: '重置'
  },
  {
    param: 'search',
    introduce: '是否开启查询',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'searchBtn',
    introduce: '搜索表单的查询按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'searchBtnText',
    introduce: '查询按钮文字',
    type: 'string',
    value: '-',
    default: '查询'
  },
  {
    param: 'searchLoading',
    introduce: '查询表单提交按钮loading',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'searchEmptyBtn',
    introduce: '搜索表单重置按钮',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'searchEmptyBtnText',
    introduce: '搜索表单重置按钮文字',
    type: 'string',
    value: '-',
    default: '重置'
  },
  {
    param: 'hideTop',
    introduce: '是否隐藏表格顶部，当无查询条件及顶部按钮时置为true',
    type: 'boolean',
    value: '-',
    default: 'false'
  }
]
export const column_item = [
  {
    param: 'label',
    introduce: '表头文字',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'prop',
    introduce: '字段名称',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'search',
    introduce: '是否搜索，用于搜索的字段只存在一级，具备联动控制的二级字段不能作为搜索字段',
    type: 'boolean',
    value: '-',
    default: 'false'
  },

  {
    param: 'slot',
    introduce: '是否自定义',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'hide',
    introduce: '当前列在表格是否隐藏',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'color',
    introduce: '颜色特殊显示',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'align',
    introduce: '对齐方式, 默认与table保持一致',
    type: 'string',
    value: 'left | right | center',
    default: '-'
  },
  {
    param: 'span',
    introduce: '对应表单项项栅格比',
    type: 'number',
    value: '-',
    default: '24'
  },
  {
    param: 'searchSpan',
    introduce: '对应查询条件栅格比',
    type: 'number',
    value: '-',
    default: '24'
  },
  {
    param: 'permisionFlag',
    introduce: '权限标识',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'addDisplay',
    introduce: '新增是否显示',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'addDisabled',
    introduce: '新增是否禁用',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'editDisplay',
    introduce: '编辑是否显示',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'editDisabled',
    introduce: '编辑是否禁用',
    type: 'boolean',
    value: '-',
    default: 'false'
  },
  {
    param: 'viewDisplay',
    introduce: '预览是否显示',
    type: 'boolean',
    value: '-',
    default: 'true'
  },
  {
    param: 'expressControl',
    introduce: '动态控制显示',
    type: 'array',
    value: '[{express: "包含${行数据字段名}的逻辑运算表达式", text: "满足表达式显示的文字", color: "满足表达式显示的字体颜色"}]',
    default: '-'
  },
  {
    param: 'type',
    introduce: '显示类型',
    type: 'string',
    value: 'datetime | link | image',
    default: '-'
  },
  {
    param: 'dicData',
    introduce: '字典数据',
    type: 'Array',
    value: '[{label: "", value: ""}]',
    default: '-'
  },
  {
    param: 'props',
    introduce: '字典显示传值对应字段',
    type: 'Object',
    value: '{label: "显示值", value: "传递值"}',
    default: '-'
  },
  {
    param: 'color',
    introduce: '文字颜色',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'text',
    introduce: '链接显示的文字',
    type: 'string',
    value: '仅对链接类型有效',
    default: '-'
  },
  {
    param: 'width',
    introduce: '图片宽度',
    type: 'number',
    value: '仅对图片类型有效',
    default: '-'
  },
  {
    param: 'height',
    introduce: '图片高度',
    type: 'number',
    value: '仅对图片类型有效',
    default: '-'
  },
]
export const event_data = [
  {
    name: 'on-load',
    introduce: '初始化表格',
    param: '分页信息参数page',
  },
  {
    name: 'search-change',
    introduce: '条件查询',
    param: '搜索条件form数据',
  },
  {
    name: 'selection-change',
    introduce: '多选',
    param: '已选行数据',
  },
  {
    name: 'row-click',
    introduce: '点击一行',
    param: '{ row, column, cell, event }',
  },
  {
    name: 'size-change',
    introduce: '分页大小改变',
    param: '分页信息参数page',
  },
  {
    name: 'current-change',
    introduce: '当前页改变',
    param: '分页信息参数page',
  },
  {
    name: 'addRow',
    introduce: '新增行',
    param: '新增表单数据',
  },
  {
    name: 'editRow',
    introduce: '编辑行',
    param: '编辑的表单数据',
  },
  {
    name: 'delRow',
    introduce: '删除行',
    param: '当前行数据',
  },
]