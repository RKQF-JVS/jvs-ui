import assembly from './assembly'
import formatKey from './format'
export default class MChinaArea extends assembly{
  constructor (
    type='chinaArea',
    label='地区选择',
    span=24,
    prop='chinaArea'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = false
    this.showalllevels = true
    this.collapsetags = false
    this.emitPath = true
    this.showFrom = ['label','span','multiple','prop','sqlType', 'showalllevels', 'collapsetags', 'emitPath', 'emitKey']
    this.sqlType = 'array'
    this.rules = []
  }
}