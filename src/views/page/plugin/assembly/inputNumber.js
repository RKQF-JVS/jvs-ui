
import assembly from './assembly'
import formatKey from './format'
export default class MInputNumber extends assembly{
  constructor (
    type='inputNumber',
    label='计数器',
    span=24,
    prop='inputNumber'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','min','max','sqlType',
      'step','stepstrictly','precision','disabled','controlsposition','placeholder','defaultValue','defaultUrl'
    ]
    this.linkbind = ''
    this.min = 0
    this.max = 10000
    this.step = 1
    this.stepstrictly = false
    this.precision = 1
    this.disabled = false
    this.controlsposition = 'right'
    this.placeholder = '请输入' + this.label
    this.defaultValue = null
    this.defaultUrl = ''
    this.sqlType = 'double'
    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
}