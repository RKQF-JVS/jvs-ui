
import assembly from './assembly'
import formatKey from './format'
import Minput from './input'
export default class MReportTable extends assembly{
  constructor (
    type='reportTable',
    label='静态表格',
    span=24,
    prop='reportTable'+ formatKey.numberToString(new Date().getTime()),
    tableColumn=[]
  ) {
    super(type,label,span,prop,tableColumn);
    this.showFrom = ['label', 'span', 'prop','border','stripe','url','datatype','dicData', 'option'] // 'disabled'
    this.rules = []
    this.sqlType = 'object'
    // 数据类型 option 和 url
    this.datatype = 'option'
    // 请求接口
    this.url = ''
    // 下拉框的选项
    this.dicData = [{
      label: '标题一',
      value: 'one'
    }, {
      label: '标题二',
      value: 'two'
    }, {
      label: '标题三',
      value: 'three'
    }]

    this.rowcolumn = "总标题"
    // 表单表头
    this.tableColumn = [new Minput()]
  }
  addcolumn (data) {
    this.tableColumn.push(data)
  }
  deletecolumn (id) {
    this.tableColumn = this.tableColumn.filter(item => item.prop != id)
  }
}