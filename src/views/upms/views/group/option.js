export const tableOption = {
  page: true,
  align: 'center',
  menuAlign: 'center',
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
  menuWidth: '250px',
  cancal: false,
  column: [
    {
      label: '姓名',
      prop: 'realName',
      span: 6,
      search: true,
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ]
    },
    {
      label: '手机号',
      prop: 'phone',
      span: 6,
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' }
      ]
    },
    {
      label: '角色',
      prop: 'roleName',
      span: 24,
      hide: true,
      slot: true,
      display: false
    },
    {
      label: "部门",
      prop: "deptName",
      span: 6,
      addDisplay: false,
      editDisplay: false
    },
    {
      label: "岗位",
      prop: "jobName",
      span: 6,
      addDisplay: false,
      editDisplay: false
    },
  ]
}
