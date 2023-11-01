/***
 * @Author: 罗兴
 * @LastEditors: 罗兴
 * @Date: 2021-09-29 21:10:04
 * @LastEditTime: 2021-10-14 14:50:33
 * @FilePath: \jvs-ui\src\views\chart\components\chart\plugin\chart\scatter.js
 * @Description: file content
 */
import gallery from './gallery'
export default class GScatter extends gallery {
  constructor(shape='ScatterChart') {
    super(shape);
    this.name='基础散点图'
    this.setting={
      name: '基础散点图',
      // unit: '', // 单位
      titleWeight: 10,
      titleSize: 15,
      cardshow: false, // 是否卡片显示
      border: 0,
      back: '#fff',
      type: 'base', // 展示类型
      datatype: '1', // ?????????????
      url: '', // ???????????????????
      xUnit:'cm',
      yUnit:'kg'
    },
    this.dicData=[
      { label: '基础散点图', value: 'base' },
      { label: '气泡图', value: 'bubble' },
    ]
    this.showForm=['name', 'unit', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
    this.column=[],
    this.tableData=[]
  }
}
