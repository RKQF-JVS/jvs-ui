import gallery from './gallery'
export default class GStackArea extends gallery {
  constructor(shape='AreaChart') {
    super(shape);
    this.name='堆叠面积图'
    this.setting={
      name: '堆叠面积图',
      unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: 'stack', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
    }
    this.dicData=[
      { label: '基础面积图', value: 'base' },
      { label: '堆叠面积图', value: 'stack' },
    ]
    this.showForm=['name', 'unit', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
    this.column=[
      {
        "key": "项"
      },
      {
        "key": "1750"
      },
      {
        "key": "1800"
      },
      {
        "key": "1850"
      },
      {
        "key": "1900"
      },
      {
        "key": "1950"
      },
      {
        "key": "1999"
      },
      {
        "key": "2000"
      }
    ],
    this.tableData=[
      {
        name:"Asia",
        data:[{
          xAxis:'1750',
          yAxis:502
        },{
          xAxis:'1800',
          yAxis:502
        },{
          xAxis:'1850',
          yAxis:635
        },{
          xAxis:'1900',
          yAxis:5268
        },{
          xAxis:'1950',
          yAxis:4400
        },{
          xAxis:'1950',
          yAxis:4400
        },{
          xAxis:'1999',
          yAxis:3634
        },{
          xAxis:'2000',
          yAxis:947
        },]
      },
      {
        name:"Africa",
        data:[{
          xAxis:'1750',
          yAxis:106
        },{
          xAxis:'1800',
          yAxis:107
        },{
          xAxis:'1850',
          yAxis:111
        },{
          xAxis:'1900',
          yAxis:1766
        },{
          xAxis:'1950',
          yAxis:221
        },{
          xAxis:'1950',
          yAxis:221
        },{
          xAxis:'1999',
          yAxis:767
        },{
          xAxis:'2000',
          yAxis:133
        },]
      },
      {
        name:"Europe",
        data:[{
          xAxis:'1750',
          yAxis:163
        },{
          xAxis:'1800',
          yAxis:203
        },{
          xAxis:'1850',
          yAxis:111
        },{
          xAxis:'1900',
          yAxis:276
        },{
          xAxis:'1950',
          yAxis:628
        },{
          xAxis:'1950',
          yAxis:547
        },{
          xAxis:'1999',
          yAxis:729
        },{
          xAxis:'2000',
          yAxis:408
        },]
      },
    ]
  }
}
