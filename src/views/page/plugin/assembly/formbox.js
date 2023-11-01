
import assembly from './assembly'
import formatKey from './format'
export default class MTableForm extends assembly{
  constructor (
    type='formbox',
    label='表单卡片',
    col=24,
    prop='formbox'+ formatKey.numberToString(new Date().getTime()),
  ) {
    super(type,label,col,prop);
    this.showFrom = ['label', 'col', 'prop', 'sqlType']
    this.sqlType = 'array'
    // 表格的校验在内部的组件中
    this.rules = []
    this.hasChildren = true
    this.children = []
    // { key: 'name', type: 'input',label: '名称', rules:[{ required: true, message: '名称不能为空', trigger: 'change'}] },
    // { key: 'name2', type: 'input',label: '名称2', rules:[{ required: true, message: '名称不能为空', trigger: 'change'}] },
  }
  addcolumn (data) {
    this.children.push(data)
  }
  deletecolumn (prop) {
    this.children = this.children.filter(item => item.prop != prop)
  }
}