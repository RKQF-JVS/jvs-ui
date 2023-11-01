import {borderWidthDicData, borderDicData} from './const'
export const otherParam = [
  // {
  //   label: '边框颜色',
  //   prop: 'borderColor',
  //   type: 'colorSelect'
  // },
  {
    label: '边框大小',
    prop: 'borderWidth',
    type: 'select',
    dicData: borderWidthDicData,
    span: 24
  },
  {
    label: '显示规则',
    prop: 'showInPage',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '首页', value: 'first'},
      {label: '奇数页', value: 'odd'},
      {label: '偶数页', value: 'even'},
      {label: '尾页', value: 'last'}
    ],
    span: 24
  },
  {
    label: '位置固定',
    prop: 'fixed',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '否', value: false},
      {label: '是', value: true}
    ],
    span: 24
  },
  // {
  //   label: '拖动方向',
  //   prop: 'axis',
  //   type: 'select',
  //   dicData: [
  //     {label: '默认', value: ''},
  //     {label: '横向', value: 'v'},
  //     {label: '竖向', value: 'h'}
  //   ]
  // },
  {
    label: '边框样式',
    prop: 'borderStyle',
    type: 'select',
    dicData: borderDicData,
    span: 24
  }
]