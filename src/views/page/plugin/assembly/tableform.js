
import assembly from './assembly'
import formatKey from './format'
import Minput from './input'
export default class MTableForm extends assembly{
  constructor (
    type='tableForm',
    label='表格',
    span=24,
    prop='tableForm'+ formatKey.numberToString(new Date().getTime()),
    tableColumn=[]
  ) {
    super(type,label,span,prop,tableColumn);
    this.showFrom = ['label', 'span', 'prop','border','stripe','sqlType', 'editable'] // 'disabled'

    this.border = true
    this.page = false
    this.editable = true
    this.addBtn = true
    this.addBtnFormCode = ""
    this.editBtn = true
    this.editBtnFormCode = ""
    this.viewBtn = true
    this.delBtn = true
    this.stripe = false
    this.sqlType = 'array'
    // 表格的校验在内部的组件中
    this.rules = []
    // 表单表头
    this.tableColumn = [new Minput()]
    this.menuFix = false
    // { key: 'name', type: 'input',label: '名称', rules:[{ required: true, message: '名称不能为空', trigger: 'change'}] },
    // { key: 'name2', type: 'input',label: '名称2', rules:[{ required: true, message: '名称不能为空', trigger: 'change'}] },
  }
  addcolumn (data) {
    this.tableColumn.push(data)
  }
  deletecolumn (id) {
    this.tableColumn = this.tableColumn.filter(item => item.prop != id)
  }
}