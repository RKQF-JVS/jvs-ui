/***
 * @Author: 罗兴
 * @LastEditors: 罗兴
 * @Date: 2021-09-29 21:10:04
 * @LastEditTime: 2021-10-15 11:18:39
 * @FilePath: \jvs-ui\src\views\chart\components\chart\plugin\chart\dashBoard.js
 * @Description: file content
 */
import gallery from './gallery'
export default class GDashBoard extends gallery {
  constructor(shape='DashBoard') {
    super(shape);
    this.name='仪表盘'
    this.setting={
      name: '仪表盘',
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
    this.dicData=[],
    this.showForm=['name', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type']
    this.column=[]
    this.tableData=[
      {value: 5.6}
    ]
  }
}
