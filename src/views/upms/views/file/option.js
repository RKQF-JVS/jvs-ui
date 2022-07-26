export const tableOption={
  page: true,
  align: 'center',
  menuAlign: 'center',
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  selection: false,
  search: true,
  showOverflow: true,
  searchBtnText: '查询',
  labelWidth: 'auto',
  cancal: false,
  column: [
    {
      label: '文件类型',
      prop: 'fileType',
      slot: true,
      type: 'select',
      dicData: [],
      search: true,
      searchSpan: 4,
      filterable: true,
      allowcreate: true
    },
    {
      label: '桶名',
      prop: 'bucketName',
      type: 'select',
      dicData: [],
      search: true,
      searchSpan: 4,
      filterable: true,
      allowcreate: true
    },
    {
      label: '文件路径',
      prop: 'filePath'
    },
    {
      label: '大小',
      prop: 'fileSize'
    },
    // {
    //   label: '文件名',
    //   prop: 'fileName',
    //   search: true,
    //   searchSpan: 4,
    // },
    {
      label: '创建时间',
      prop: 'createTime',
      dateType: "datetime",
      format: "yyyy-MM-dd hh:mm:ss",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
    },
  ]
}
