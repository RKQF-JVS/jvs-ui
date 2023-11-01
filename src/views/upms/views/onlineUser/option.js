export const tableOption = {
  page: false,
  // align: 'center',
  // menuAlign: 'center',
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  selection: false,
  search: false,
  inline: true,
  showOverflow: true,
  isSearch: true,
  labelWidth: 'auto',
  submitBtnText: '查询',
  menuWidth: '150px',
  cancal: false,
  hideTop: true,
  // menuWidth: 100,
  column: [
    {
      label: '头像',
      prop: 'headImg',
      slot: true
    },
    {
      label: '姓名',
      prop: 'realName',
      slot: true
    },
    {
      label: '邮箱',
      prop: 'email',
      slot: true
    },
    {
      label: '终端名称',
      prop: 'clientName',
      slot: true
    },
    {
      label: '有效时间',
      prop: 'expiration',
      slot: true
    },
    {
      label: '手机号',
      prop: 'phone',
      slot: true
    },
    {
      label: 'IP',
      prop: 'ip',
      slot: true
    },
    {
      label: '设备信息',
      prop: 'userAgent',
      slot: true
    }
  ]
}
