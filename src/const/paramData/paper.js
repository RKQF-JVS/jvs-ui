import {fontFamilyDicData} from './const'
export const paperParam = [
  {
    label: '打印规则',
    prop: 'panelPaperRule',
    type: 'select',
    span: 12,
    dicData: [
      {label: '默认', value: ''},
      {label: '保持奇数', value: 'odd'},
      {label: '保持偶数', value: 'even'}
    ]
  },
  {
    label: '字体',
    prop: 'fontFamily',
    type: 'select',
    dicData: fontFamilyDicData,
    span: 12
  },
  {
    label: '首页页尾',
    prop: 'firstPaperFooter',
    span: 24,
    type: 'inputNumber'
  },
  {
    label: '偶数页页尾',
    prop: 'evenPaperFooter',
    span: 24,
    type: 'inputNumber'
  },
  {
    label: '奇数页页尾',
    prop: 'oddPaperFooter',
    span: 24,
    type: 'inputNumber'
  },
  {
    label: '尾页页尾',
    prop: 'lastPaperFooter',
    span: 24,
    type: 'inputNumber'
  },
  {
    label: '左偏移',
    prop: 'leftOffset',
    span: 24,
    placeholder: '偏移量pt',
    type: 'inputNumber'
  },
  {
    label: '顶部偏移',
    prop: 'topOffset',
    span: 24,
    placeholder: '偏移量pt',
    type: 'inputNumber'
  },
  {
    label: '纸张方向(仅自定义纸张有效)',
    prop: 'orient',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '纵向', value: 1},
      {label: '横向', value: 2}
    ]
  },
  {
    label: '页码格式',
    prop: 'paperNumberFormat',
    placeholder: 'paperNo-paperCount'
  }
]