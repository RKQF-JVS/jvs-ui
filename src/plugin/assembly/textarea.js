
import assembly from './assembly'
import formatKey from './format'
export default class MTextarea extends assembly{
  constructor (
    type='textarea',
    label='文本域',
    span=24,
    prop='textarea'+ formatKey.numberToString(new Date().getTime()),
    rows=1
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','rows','minlength','maxlength','showwordlimit','placeholder',
      'clearable','disabled','defaultValue','sqlType'
    ]
    this.linkbind = ''
    this.rows = rows
    this.minlength = 0
    this.maxlength = 100
    this.showwordlimit = true
    this.placeholder = '请输入' + this.label
    this.clearable = true
    this.disabled = false
    this.defaultValue = ''
    this.sqlType = 'varchar'
    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
}