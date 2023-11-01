import {fontFamilyDicData, fontSizeDicData, fontWeightDicData, letterSpacingDicData, textDecorationDicData, 
  textTypeDicData, textAlignDicData, barcodeModeDicData, borderDicData, borderWidthDicData, paddingDicData
} from './const'
export const textParam = [
  {
    label: '显示标题',
    prop: 'title',
    span: 24
  },
  {
    label: '字段名称',
    prop: 'field',
    span: 24
  },
  {
    label: '默认显示',
    prop: 'testData',
    span: 24
  },
  {
    label: '字体类型',
    prop: 'fontFamily',
    type: 'select',
    dicData: fontFamilyDicData
  },
  {
    label: '字里间距',
    prop: 'letterSpacing',
    type: 'select',
    dicData: letterSpacingDicData
  },
  {
    label: '字体大小',
    prop: 'fontSize',
    type: 'select',
    dicData: fontSizeDicData
  },
  {
    label: '字体粗细',
    prop: 'fontWeight',
    type: 'select',
    dicData: fontWeightDicData
  },
  // {
  //   label: '字体颜色',
  //   prop: 'color',
  //   type: 'colorSelect'
  // },
  {
    label: '文本修饰',
    prop: 'textDecoration',
    type: 'select',
    dicData: textDecorationDicData
  },
  {
    label: '左右对齐',
    prop: 'textAlign',
    type: 'select',
    dicData: textAlignDicData
  },
  {
    label: '上下对齐',
    prop: 'textContentVerticalAlign',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '垂直居中', value: 'middle'},
      {label: '底部', value: 'bottom'},
    ]
  },
  {
    label: '字体行高',
    prop: 'lineHeight',
    type: 'select',
    dicData: fontSizeDicData
  },
  {
    label: '打印类型',
    prop: 'textType',
    type: 'select',
    dicData: textTypeDicData
  },
  {
    label: '条形码格式',
    prop: 'barcodeMode',
    type: 'select',
    dicData: barcodeModeDicData,
    displayExpress: [{prop: 'textType', value: 'barcode'}]
  },
  {
    label: '标题显隐',
    prop: 'hideTitle',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '显示', value: false},
      {label: '隐藏', value: true}
    ]
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
    displayExpress: [{prop: 'hideTitle', value: 'false,""'}]
  },
  {
    label: '隐藏规则',
    prop: 'unShowInPage',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '首页', value: 'first'},
      {label: '尾页', value: 'last'}
    ],
    displayExpress: [{prop: 'hideTitle', value: 'true'}]
  },
  {
    label: '位置固定',
    prop: 'fixed',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '否', value: false},
      {label: '是', value: true}
    ]
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
    label: '旋转角度',
    prop: 'transform',
    type: 'inputNumber',
    span: 24
  },
  {
    label: '边框设置',
    type: 'title',
    span: 24
  },
  {
    label: '左边框',
    prop: 'borderLeft',
    type: 'select',
    dicData: borderDicData
  },
  {
    label: '上边框',
    prop: 'borderTop',
    type: 'select',
    dicData: borderDicData
  },
  {
    label: '右边框',
    prop: 'borderRight',
    type: 'select',
    dicData: borderDicData
  },
  {
    label: '下边框',
    prop: 'borderBottom',
    type: 'select',
    dicData: borderDicData
  },
  {
    label: '边框大小',
    prop: 'borderWidth',
    type: 'select',
    dicData: borderWidthDicData
  },
  // {
  //   label: '边框颜色',
  //   prop: 'borderColor',
  //   type: 'colorSelect'
  // },
  {
    label: '左内边距',
    prop: 'contentPaddingLeft',
    type: 'select',
    dicData: paddingDicData
  },
  {
    label: '上内边距',
    prop: 'contentPaddingTop',
    type: 'select',
    dicData: paddingDicData
  },
  {
    label: '右内边距',
    prop: 'contentPaddingRight',
    type: 'select',
    dicData: paddingDicData
  },
  {
    label: '下内边距',
    prop: 'contentPaddingBottom',
    type: 'select',
    dicData: paddingDicData
  },
  // {
  //   label: '背景颜色',
  //   prop: 'backgroundColor',
  //   type: 'colorSelect'
  // }
]
