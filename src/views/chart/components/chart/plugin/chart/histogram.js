import gallery from './gallery'
export default class GHist extends gallery {
  constructor(shape='HistogramChart') {
    super(shape);
    this.name='柱状图'
    this.setting={
      name: '分组柱状图',
      unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: 'group', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
      step:2 // 直方图的步长
    },
    this.dicData=[
      { label: '基础柱状图', value: 'base' },
      { label: '分组柱状图', value: 'group' },
      { label: '堆叠柱状图', value: 'stack' },
      { label: '直方图', value: 'hist' },
      { label: '百分比柱状图', value: 'percent' }
    ],
    this.showForm=['name', 'unit', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
    this.column=[
      {
        "key": "项"
      },
      {
        "key": "整体"
      },
      {
        "key": "非技术岗"
      },
      {
        "key": "技术岗"
      }
    ]
    this.tableData=[
      {
        "name":"Apple",
        "data":[
          {
            "xAxis":"整体",
            "yAxis":30
          },
          {
            "xAxis":"非技术岗",
            "yAxis":40
          },
          {
            "xAxis":"技术岗",
            "yAxis":35
          }
        ]
      },
      {
        "name":"Facebook",
        "data":[
          {
            "xAxis":"整体",
            "yAxis":35
          },
          {
            "xAxis":"非技术岗",
            "yAxis":65
          },
          {
            "xAxis":"技术岗",
            "yAxis":35
          }
        ]
      },
      {
        "name":"Google",
        "data":[
          {
            "xAxis":"整体",
            "yAxis":28
          },
          {
            "xAxis":"非技术岗",
            "yAxis":47
          },
          {
            "xAxis":"技术岗",
            "yAxis":25
          }
        ]
      }
    ]
  }
}
