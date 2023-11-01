import assembly from './assembly'
import formatKey from './format'
export default class MRole extends assembly{
  constructor (
    type='role',
    label='角色选择',
    span=24,
    prop='role'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = true
    this.showFrom = ['label','span','multiple','prop','sqlType']
    this.rules = []
    this.sqlType = 'array'
  }
}