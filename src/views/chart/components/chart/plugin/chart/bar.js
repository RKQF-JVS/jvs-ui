/***
 * @Author: 罗兴
 * @LastEditors: 罗兴
 * @Date: 2021-09-29 21:10:04
 * @LastEditTime: 2021-10-13 15:39:28
 * @FilePath: \jvs-ui\src\views\chart\components\chart\plugin\chart\bar.js
 * @Description: file content
 */
import gallery from './gallery'
export default class GBarChart extends gallery {
  constructor(shape='BarChart') {
    super(shape);
    this.name='分组条形图'
    this.setting={
      name: '分组条形图',
      // unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: 'group', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
    },
    this.dicData=[
      { label: '分组条形图', value: 'group' },
      { label: '基础条形图', value: 'base' },
    ],
    this.showForm=['name', 'unit', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
    this.column=[
      {
        "key": "项"
      },
      {
        "key": "1月"
      },
      {
        "key": "2月"
      },
      {
        "key": "3月"
      },
      {
        "key": "4月"
      },
      {
        "key": "5月"
      }
    ],
    this.tableData=[
      {
        "name":"电信",
        "data":[
          {
            "xAxis":"1月",
            "yAxis":18.9
          },
          {
            "xAxis":"2月",
            "yAxis":28.8
          },
          {
            "xAxis":"3月",
            "yAxis":39.3
          },
          {
            "xAxis":"4月",
            "yAxis":81.4
          },
          {
            "xAxis":"5月",
            "yAxis":47
          }
        ]
      },
      {
        "name":"微博",
        "data":[
          {
            "xAxis":"1月",
            "yAxis": 12.4
          },
          {
            "xAxis":"2月",
            "yAxis":23.2
          },
          {
            "xAxis":"3月",
            "yAxis":34.5
          },
          {
            "xAxis":"4月",
            "yAxis":99.7
          },
          {
            "xAxis":"5月",
            "yAxis":52.6
          }
        ]
      },
      // {
      //   "项": "",
      //   "1月": 18.9,
      //   "2月": 28.8,
      //   "3月": 39.3,
      //   "4月": 81.4,
      //   "5月": 47
      // },
      // {
      //   "项": "微博",
      //   "1月": 12.4,
      //   "2月": 23.2,
      //   "3月": 34.5,
      //   "4月": 99.7,
      //   "5月": 52.6
      // }
    ]
  }
}
