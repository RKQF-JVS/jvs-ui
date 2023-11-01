export const form_column = [
  {
    label: "文本框",
    prop: "inut",
    rules: [
      { required: true, message: "请输入文本框", trigger: "blur" },
    ]
  },
  {
    label: "下拉选择",
    prop: "select",
    type: "select",
    dicData: [
      {label: "选项一", value: "1"},
      {label: "选项二", value: "2"}
    ]
  },
  {
    label: "单选框",
    prop: "radio",
    type: "radio",
    dicData: [
      {label: "选项一", value: "1"},
      {label: "选项二", value: "2"}
    ]
  },
  {
    label: "多选框",
    prop: "checkbox",
    type: "checkbox",
    dicData: [
      {label: "选项一", value: "1"},
      {label: "选项二", value: "2"}
    ]
  }
]

export const param_data = [
  {
    param: "refs",
    introduce: "绑定的form对象",
    type: "string",
    value: "-",
    default: "ruleForm"
  },
  {
    param: "formData",
    introduce: "表单值对象",
    type: "object",
    value: "-",
    default: "-"
  },
  {
    param: "defalutFormData",
    introduce: "表单初始值数据",
    type: "object",
    value: "-",
    default: "-"
  },
  {
    param: "size",
    introduce: "用于控制该表单内组件的尺寸",
    type: "string",
    value: "medium / small / mini",
    default: "mini"
  },
  {
    param: "disabled",
    introduce: "是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效",
    type: "boolean",
    value: "-",
    default: "false"
  },
  {
    param: "option",
    introduce: "表单配置",
    type: "object",
    value: "-",
    default: "-"
  }
]

export const form_option = [
  {
    param: "formAlign",
    introduce: "对齐方式",
    type: "string",
    value: "left | right | top",
    default: "right"
  },
  {
    param: "inline",
    introduce: "表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单",
    type: "boolean",
    value: "-",
    default: "false"
  },
  {
    param: "labelWidth",
    introduce: "表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto",
    type: "string",
    value: "-",
    default: "-"
  },
  {
    param: "submitBtn",
    introduce: "提交按钮",
    type: "boolean",
    value: "-",
    default: "true"
  },
  {
    param: "submitBtnText",
    introduce: "提交按钮文字",
    type: "string",
    value: "-",
    default: "提交"
  },
  {
    param: "submitLoading",
    introduce: "提交按钮loading",
    type: "boolean",
    value: "-",
    default: "false"
  },
  {
    param: "emptyBtn",
    introduce: "重置按钮",
    type: "boolean",
    value: "-",
    default: "true"
  },
  {
    param: "emptyBtnText",
    introduce: "重置按钮文字",
    type: "string",
    value: "-",
    default: "重置"
  },
  {
    param: "cancal",
    introduce: "取消按钮",
    type: "boolean",
    value: "-",
    default: "true"
  },
  {
    param: "cancalBtnText",
    introduce: "取消按钮文字",
    type: "string",
    value: "-",
    default: "取消"
  },
  {
    param: "isSearch",
    introduce: "是否为查询表单",
    type: "boolean",
    value: "-",
    default: "false"
  },
  {
    param: "btnHide",
    introduce: "是否隐藏按钮",
    type: "boolean",
    value: "-",
    default: "false"
  },
  {
    param: "column",
    introduce: "表单项集合",
    type: "array",
    value: "-",
    default: "-"
  }
]

export const event_data = [
  {
    name: "submit",
    introduce: "提交表单，校验通过后，参数返回表单对象",
    param: "表单对象 form",
  },
  {
    name: "reset",
    introduce: "重置事件",
    param: "ref名称",
  },
  {
    name: "cancalClick",
    introduce: "取消事件",
    param: "-",
  },
  {
    name: "formChange",
    introduce: "监听表单项变化",
    param: "表单对象 form",
  },
]