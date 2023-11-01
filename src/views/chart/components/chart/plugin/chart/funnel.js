/***
 * @Author: 罗兴
 * @LastEditors: 罗兴
 * @Date: 2021-09-29 21:10:04
 * @LastEditTime: 2021-10-15 10:13:42
 * @FilePath: \jvs-ui\src\views\chart\components\chart\plugin\chart\funnel.js
 * @Description: file content
 */
import gallery from './gallery'
export default class GFunnelChart extends gallery {
  constructor(shape='FunnelChart') {
    super(shape);
    this.name='漏斗图'
    this.setting = {
      name: '基础漏斗图',
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
      this.showForm=['name', 'unit', 'titleWeight', 'titleSize', 'cardshow', 'border', 'back', 'type'],
      this.column=[]
      this.tableData=[
        { type: '浏览网站', value: 50000 },
        { type: '放入购物车', value: 35000 },
        { type: '生成订单', value: 25000 },
        { type: '支付订单', value: 15000 },
        { type: '完成交易', value: 8000 }
      ]
  }
}
