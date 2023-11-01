import assembly from './assembly'
import formatKey from './format'
export default class MCascader extends assembly{
  constructor (
    type='cascader',
    label='级联选择',
    span=24,
    prop='cascader'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = false
    this.showalllevels = true
    this.collapsetags = false
    this.emitPath = true
    this.emitKey = 'uniqueName'
    this.dictName = '' // 选择树形结构数据，分类字典名称
    this.showFrom = ['label','span','multiple','prop','sqlType', 'showalllevels', 'collapsetags', 'emitPath', 'cascaderOption', 'disabled'] // , 'regular'
    this.sqlType = 'array'
    // 校验
    this.rules = [
      { required: false, message: '请选择' + this.label , trigger: 'change' }
    ]
  }
}