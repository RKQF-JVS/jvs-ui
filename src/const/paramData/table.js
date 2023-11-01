import { fontFamilyDicData, fontSizeDicData, rowLineHeightDicData, rowFontSizeDicData, fontWeightDicData, rowHeaderLineHeightDicData,textAlignDicData,} from './const'
export const tableParam = [
  {
    label: '字段名称',
    prop: 'field',
    span: 24
  },
  {
    label: '字体类型',
    prop: 'fontFamily',
    type: 'select',
    dicData: fontFamilyDicData
  },
  {
    label: '字体大小',
    prop: 'fontSize',
    type: 'select',
    dicData: fontSizeDicData
  },
  {
    label: '左右对齐',
    prop: 'textAlign',
    type: 'select',
    dicData: textAlignDicData
  },
  {
    label: '表格边框',
    prop: 'tableBorder',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '有边框', value: 'border'},
      {label: '无边框', value: 'noBorder'}
    ]
  },
  {
    label: '表头边框',
    prop: 'tableHeaderBorder',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '有边框', value: 'border'},
      {label: '无边框', value: 'noBorder'},
      {label: '上边框', value: 'topBorder'},
      {label: '下边框', value: 'bottomBorder'},
      {label: '上下边框', value: 'topBottomBorder'}
    ]
  },
  {
    label: '表头背景',
    prop: 'tableHeaderBackground',
    type: 'colorSelect'
  },
  {
    label: '表头行高',
    prop: 'tableHeaderRowHeight',
    type: 'select',
    dicData: rowHeaderLineHeightDicData
  },
  {
    label: '表头字体大小',
    prop: 'tableHeaderFontSize',
    type: 'select',
    dicData: rowFontSizeDicData,
    span: 24
  },
  {
    label: '表头字体粗细',
    prop: 'tableHeaderFontWeight',
    type: 'select',
    dicData: fontWeightDicData,
    span: 24
  },
  {
    label: '表头单元格边框',
    prop: 'tableHeaderCellBorder',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '有边框', value: 'border'},
      {label: '无边框', value: 'noBorder'}
    ],
    span: 24
  },
  {
    label: '表体行高',
    prop: 'tableBodyRowHeight',
    type: 'select',
    dicData: rowLineHeightDicData
  },
  {
    label: '表体行边框',
    prop: 'tableBodyRowBorder',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '有边框', value: 'border'},
      {label: '无边框', value: 'noBorder'},
      {label: '上边框', value: 'topBorder'},
      {label: '下边框', value: 'bottomBorder'},
      {label: '上下边框', value: 'topBottomBorder'}
    ]
  },
  {
    label: '表体单元格',
    prop: 'tableBodyCellBorder',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '有边框', value: 'border'},
      {label: '无边框', value: 'noBorder'}
    ]
  },
  {
    label: '拖动方向',
    prop: 'axis',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '横向', value: 'v'},
      {label: '竖向', value: 'h'}
    ]
  },
  {
    label: '最低高度',
    prop: 'lHeight',
    type: 'inputNumber',
    span: 24,
    placeholder: '文本过短或为空时的高度'
  },
  {
    label: '自动补全',
    prop: 'autoCompletion',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '是', value: true},
      {label: '否', value: false}
    ]
  },
  {
    label: '表格脚显示',
    prop: 'tableFooterRepeat',
    type: 'select',
    dicData: [
      {label: '默认', value: ''},
      {label: '不显示', value: 'no'},
      {label: '每页显示', value: 'page'},
      {label: '最后显示', value: 'last'}
    ]
  }
]