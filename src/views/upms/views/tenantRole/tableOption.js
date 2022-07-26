export const tableOption = {
  page: true,
  align: "center",
  menu: true,
  menuAlign: "center",
  menuWidth: 200,
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  selection: true,
  search: false, // false,
  showOverflow: true,
  dialogEscape: false, // 是否可以通过esc关闭弹窗
  dialogClickModal: false, // 是否可以通过点击modal关闭弹窗
  // 搜索表单设置
  formAlign: "right", //对其方式
  inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
  labelWidth: "auto", // label宽
  submitBtn: true, // 提交按钮是否显示，默认显示
  submitBtnText: "查询", // 提交按钮文字，默认 提交
  emptyBtn: true, // 重置按钮，默认显示
  emptyBtnText: "清空", // 重置按钮文字，默认 重置
  cancal: false,
  column: [
    {
      label: '系统名称', // '公司简称',
      prop: 'shortName',
    },
    {
      label: '公司全称',
      prop: 'name',
    },
  ]
};
