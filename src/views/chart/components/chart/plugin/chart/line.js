/***
 * @Author: 罗兴
 * @LastEditors: 罗兴
 * @Date: 2021-09-29 21:10:04
 * @LastEditTime: 2021-10-09 11:28:45
 * @FilePath: \jvs-ui\src\views\chart\components\chart\plugin\chart\line.js
 * @Description: file content
 */
import gallery from './gallery'
export default class GLine extends gallery {
  constructor(shape='LineChart') {
    super(shape);
    this.name='折线图'
    this.setting={
      name: '基础折线图',
      unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: 'line', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
    },
      this.dicData=[
        { label: '基础折线图', value: 'line' },
        { label: '多折线图', value: 'lines' },
        { label: '其他折线图', value: 'other' }
      ],
      //
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
        // {
        //   "项": "电信",
        //   "1月": 18.9,
        //   "2月": 28.8,
        //   "3月": 39.3,
        //   "4月": 81.4,
        //   "5月": 47
        // }
        // { x: '1月', y: 18.9, '项': '电信' },
        // { x: '2月', y: 28.8, '项': '电信' },
        // { x: '3月', y: 39.3, '项': '电信' },
        // { x: '4月', y: 81.4, '项': '电信' },
        // { x: '5月', y: 47, '项': '电信' }
      ]
  }
}
