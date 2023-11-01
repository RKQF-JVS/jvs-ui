import gallery from './gallery'
export default class GPie extends gallery {
  constructor(shape='Pie') {
    super(shape);
    this.name='饼图'
    this.setting={
      name: '饼图',
      // unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: '1', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
    },
    this.dicData=[
        { label: '基础饼图', value: '1' },
        { label: '饼图(内部文字)', value: '2' },
        { label: '基础环图', value: '3' },
        { label: '南丁格尔图', value: '4' },
        { label: '南丁格尔环图', value: '5' }
    ],
    this.showForm=['name', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
    this.tableData=[
        { type: '事例一', value: 40 },
        { type: '事例二', value: 21 },
        { type: '事例三', value: 17 },
        { type: '事例四', value: 13 },
        { type: '事例五', value: 9 }
    ]
  }
}
