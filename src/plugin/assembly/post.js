import assembly from './assembly'
import formatKey from './format'
export default class MRole extends assembly{
  constructor (
    type='post',
    label='岗位选择',
    span=24,
    prop='post'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = true
    this.showFrom = ['label','span','multiple','prop','sqlType']
    this.rules = []
    this.sqlType = 'array'
  }
}