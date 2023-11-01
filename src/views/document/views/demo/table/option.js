export const tableOption = {
  title: "表格的标题",
  page: true,
  align: "center",
  menuAlign: "center",
  viewBtn: true,
  addBtn: true,
  editBtn: true,
  selection: true,
  search: true, // false,
  showOverflow: true,

  // 搜索表单设置
  formAlign: "right", //对其方式
  inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
  labelWidth: "auto", // label宽
  submitBtn: true, // 提交按钮是否显示，默认显示
  submitBtnText: "查询", // 提交按钮文字，默认 提交
  emptyBtn: true, // 重置按钮，默认显示
  emptyBtnText: "清空", // 重置按钮文字，默认 重置
  column: [
    {
      label: "消息标题",
      prop: "title",
      search: true,
      span: 6,
      align: "left"
    },
    {
      label: "内容",
      prop: "content",
      span: 6,
      hide: true
    },
    {
      label: "状态",
      prop: "status",
      span: 6,
      color: "red",
      type: "select",
      dicData: [
        { label: "未读", value: 0 },
        { label: "已读", value: 1 }
      ]
    },
    {
      label: "创建时间",
      prop: "createTime",
      align: "right",
      color: "blue",
      span: 6,
      type: "DatePicker",
      datetype: "datetime",
      format: "yyyy-MM-dd hh:mm:ss",
      valueFormat: "yyyy-MM-dd hh:mm:ss"
    }
  ]
};
