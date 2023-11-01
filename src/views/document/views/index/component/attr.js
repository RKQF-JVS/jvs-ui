export const paramOption = {
  addBtn: false,
  menu: false,
  align: 'left',
  menuAlign: 'left',
  hideTop: true,
  column: [
    {
      label: '参数',
      prop: 'param'
    },
    {
      label: '说明',
      prop: 'introduce'
    },
    {
      label: '类型',
      prop: 'type'
    },
    {
      label: '可选值',
      prop: 'value'
    },
    {
      label: '默认值',
      prop: 'default'
    }
  ]
}

export const eventOption = {
  addBtn: false,
  menu: false,
  align: 'left',
  menuAlign: 'left',
  hideTop: true,
  column: [
    {
      label: '事件名称',
      prop: 'name'
    },
    {
      label: '说明',
      prop: 'introduce'
    },
    {
      label: '回调参数',
      prop: 'param'
    }
  ]
}

export const requestData = [
  {
    param: 'httpMethod',
    introduce: '请求方式',
    type: 'string',
    value: 'GET | POST | PUT | DELETE',
    default: '-'
  },
  {
    param: 'requestContentType',
    introduce: '请求类型',
    type: 'string',
    value: 'JSON | MULTIPART | FORM_URLENCODED',
    default: '-'
  },
  {
    param: 'responseContentType',
    introduce: '响应类型',
    type: 'string',
    value: 'JSON | MULTIPART',
    default: '-'
  },
  {
    param: 'url',
    introduce: '请求地址',
    type: 'string',
    value: '-',
    default: '-'
  },
  {
    param: 'headers',
    introduce: '请求头',
    type: 'array',
    value: '[ {key: value} ]',
    default: '-'
  },
  {
    param: 'parameters',
    introduce: '请求参数',
    type: 'array',
    value: '[ {key: value} ]',
    default: '-'
  },
]