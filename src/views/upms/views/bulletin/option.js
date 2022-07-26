export const tableOption={
  page: true,
  // addBtn: false,
  // editBtn: false,
  canncal: false,
  align: 'center',
  menuAlign: 'center',
  search: true,
  cancal: false,
  showoverflow: true,
  column: [
    {
      label: '标题',
      search: true,
      prop: 'title',
    },
    {
      label: '内容',
      prop: 'content',
      type: 'textarea'
    },
    {
      label: '状态',
      prop: 'publish',
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      slot: true,
    },
    {
      label: "生效时间",
      prop: "startTime",
      addDisplay: false,
      editDisplay: false,
      // sort: true
    },
  ]
}
