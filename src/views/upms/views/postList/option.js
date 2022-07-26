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
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    },
    {
      label: '手机号',
      prop: 'phone',
      span: 6,
      rules: [
        { required: true, message: '请输入真名', trigger: 'blur' }
      ]
    },
    {
      label: '角色',
      prop: 'roleName',
      span: 24,
      slot: true,
      display: false,
      hide: true
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

export const userpostOption = {
  cancal: false,
  formAlign: 'top',
  column: [
    {
      label: '姓名',
      prop: 'realName',
      disabled: true
    },
    {
      label: '岗位',
      prop: 'postId',
      formSlot: true,
      tips: {
        position: 'bottom',
        text: '修改岗位后数据权限将改变'
      }
    }
  ]
} 