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
    this.showFrom = ['label','span','multiple','prop','sqlType', 'disabled'] // , 'regular'
    this.rules = []
    this.sqlType = 'array'
    // 校验
    this.rules = [
      { required: false, message: '请选择角色' , trigger: 'change' }
    ]
  }
}