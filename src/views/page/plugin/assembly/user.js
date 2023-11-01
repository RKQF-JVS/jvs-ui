import assembly from './assembly'
import formatKey from './format'
export default class MUser extends assembly{
  constructor (
    type='user',
    label='用户选择',
    span=24,
    prop='user'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.multiple = false
    this.allowinput = false
    this.showFrom = ['label','span','multiple','prop','sqlType', 'allowinput', 'disabled'] // , 'regular'
    this.rules = []
    this.sqlType = 'array'
    // 校验
    this.rules = [
      { required: false, message: '请选择用户', trigger: 'change' }
    ]
  }
}