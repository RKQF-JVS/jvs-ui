
export const imageParam = [
  {
    label: '字段名称',
    prop: 'field',
    span: 24
  },
  {
    label: '图片地址',
    prop: 'src',
    span: 24,
    type: 'textarea',
    rows: 4
  },
  {
    label: '本地上传',
    prop: 'upload',
    span: 24,
    formSlot: true
  },
  {
    label: '显示规则',
    prop: 'showInPage',
    type: 'select',
    span: 24,
    dicData: [
      {label: '默认', value: ''},
      {label: '首页', value: 'first'},
      {label: '奇数页', value: 'odd'},
      {label: '偶数页', value: 'even'},
      {label: '尾页', value: 'last'}
    ]
  },
  {
    label: '位置固定',
    prop: 'fixed',
    type: 'select',
    span: 24,
    dicData: [
      {label: '默认', value: ''},
      {label: '否', value: false},
      {label: '是', value: true}
    ]
  },
  {
    label: '拖动方向',
    prop: 'axis',
    type: 'select',
    span: 24,
    dicData: [
      {label: '默认', value: ''},
      {label: '横向', value: 'v'},
      {label: '竖向', value: 'h'}
    ]
  },
  {
    label: '旋转角度',
    prop: 'transform',
    type: 'inputNumber',
    span: 24
  }
]