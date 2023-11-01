import assembly from './assembly'
import formatKey from './format'
export default class MDepartment extends assembly{
  constructor (
    type='department',
    label='部门选择',
    span=24,
    prop='department'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = false
    this.showalllevels = true
    this.collapsetags = false
    this.emitPath = true
    this.showFrom = ['label','span','multiple','prop','sqlType', 'showalllevels', 'collapsetags', 'emitPath']
    this.sqlType = 'array'
    this.rules = []
  }
}
