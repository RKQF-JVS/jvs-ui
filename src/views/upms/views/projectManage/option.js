export const tableOption={
  page: true,
  addBtn: false,
  editBtn: false,
  canncal: false,
  viewBtn: false,
  align: 'center',
  menuAlign: 'center',
  search: true,
  cancal: false,
  showoverflow: true,
  column: [
    {
      label: '实例名称',
      search: true,
      prop: 'name',
    },
    {
      label: '分类',
      prop: 'type',
    },
    {
      label: "图标",
      prop: "icon",
      type: 'iconSelect',
      hide: true
    },
    {
      label: '状态',
      prop: 'isDeploy',
      headerExplain: true,
      explainContent: '未发布：应用管理员可查看；已发布：权限设置人员可查看',
      slot: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
      addDisplay: false,
      editDisplay: false,
      // sort: true
    },
  ]
}
