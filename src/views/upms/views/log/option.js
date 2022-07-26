export const tableOption={
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
  submitBtnText: '查询',
  labelWidth: 'auto',
  cancal: false,
  column: [
    {
      label: '链路',
      prop: 'tid',
      width: '200px'
    },
    {
      label: '用户名',
      prop: 'userName'
    },
    {
      label: '功能名',
      prop: 'functionName'
    },
    {
      label: '服务名',
      prop: 'businessName'
    },
    {
      label: '开始时间',
      prop: 'startTime'
    },
    {
      label: 'IP',
      prop: 'ip'
    },
    {
      label: 'API',
      prop: 'api'
    },
    {
      label: '消耗时间',
      prop: 'consumingTime'
    },
  ]
}

export const searchOption={
  inline: true,
  submitBtnText: '查询',
  labelWidth: 'auto',
  isSearch: true,
  cancal: false,
  column: [
    {
      label: '链路ID',
      prop: 'tid',
      span: 6
    },
    {
      label: '功能名',
      prop: 'functionName',
      span: 6
    },
    {
      label: '用户名',
      prop: 'userName',
      span: 5
    },
    {
      label: '时间段',
      prop: 'timerange',
      span: 7,
      type: "datePicker",
      datetype: 'datetimerange',
      format: "yyyy-MM-dd HH:mm:ss",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
    },
    {
      label: 'IP地址',
      prop: 'ip',
      span: 6
    },
    {
      label: '内容',
      prop: 'content',
      span: 6
    },
    {
      label: '接口地址',
      prop: 'api',
      span: 6
    }
  ]
}
