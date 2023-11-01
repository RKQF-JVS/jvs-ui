export const formOption = {
  inline: true,
  align: "right",
  labelWidth: "auto",
  column: [
    {
      label: "标题文本",
      prop: "basic",
      type: "title", // 类型为title
      span: 24
    },
    {
      label: "文本框",
      prop: "input",
      type: "input",
      span: 6,
      rules: [{ required: true, message: "请输入", trigger: "blur" }]
    },
    {
      label: "只读文本",
      prop: "inputReadOnly",
      type: "inputReadOnly",
      span: 6
    },
    {
      label: "作用域",
      prop: "textarea",
      type: "textarea",
      span: 6
    },
    {
      label: "只读文本域",
      prop: "textareaReadOnly",
      type: "textareaReadOnly",
      span: 6
    },
    {
      label: "子表单",
      prop: "formchild",
      type: "radio",
      dicData: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" }
      ],
      span: 24,
      children: [
        {
          label: "数字",
          prop: "number",
          type: "inputNumber",
          span: 8,
          linkbind: "1"
        },
        {
          label: "下拉选择",
          prop: "select",
          type: "select",
          span: 8,
          dicData: [{ label: "1", value: "1" }],
          linkbind: "1"
        },
        {
          label: "开关",
          prop: "switch",
          type: "switch",
          span: 8,
          linkbind: "2"
        }
      ]
    },
    {
      label: "滑块",
      prop: "slider",
      type: "slider",
      span: 24
    },
    {
      label: "固定时间选择",
      prop: "timeselect",
      type: "timeSelect",
      span: 12
    },
    {
      label: "时间选择",
      prop: "timepicker",
      type: "timePicker",
      span: 12
    },
    {
      label: "日期选择",
      prop: "datepicker",
      type: "datePicker",
      span: 12,
      datetype: "datetime"
    },
    {
      label: "图标选择",
      prop: "iconSelect",
      type: "iconSelect",
      span: 12
    },
    {
      label: "单选",
      prop: "radio",
      type: "radio",
      span: 12,
      dicData: [{ label: "1", value: "1" }]
    },
    {
      label: "复选",
      prop: "checkbox",
      type: "checkbox",
      span: 12,
      dicData: [{ label: "1", value: "1" }]
    },
    {
      label: "颜色",
      prop: "colorselect",
      type: "colorSelect",
      span: 12
    },
    {
      label: "图片",
      prop: "image",
      type: "image",
      span: 12,
      fileList: []
    },
    {
      label: "上传图片",
      prop: "imageUpload",
      type: "imageUpload",
      span: 12,
      action: "",
      fileList: []
    },
    {
      label: "文件",
      prop: "file",
      type: "file",
      span: 12,
      fileList: []
    },
    {
      label: "上传文件",
      prop: "fileUpload",
      type: "fileUpload",
      span: 12,
      action: "",
      fileList: []
    },
    // {
    //   label: '展示表格',
    //   prop: 'tableReadOnly',
    //   type: 'tableReadOnly',
    //   span: 24
    // },
    {
      label: "描述",
      prop: "box",
      type: "box",
      span: 24,
      text: "这是一段描述"
    },
    {
      label: "链接",
      prop: "link",
      type: "link",
      span: 24,
      text: "百度",
      openType: "_blank"
    },
    {
      label: "嵌套页",
      prop: "iframe",
      type: "iframe",
      span: 24,
      iframeurl: "",
      permisionFlag: "iframe"
    },
    {
      label: "插槽",
      prop: "myslot",
      span: 24,
      formSlot: true
    }
  ]
};
