
import assembly from './assembly'
import formatKey from './format'
export default class MDatePicker extends assembly{
  constructor (
    type='datePicker',
    label='日期',
    span=24,
    prop='datePicker'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','disabled','placeholder','clearable','startLimit',
    'prefixicon','datetype','startplaceholder','endplaceholder','rangeseparator','endLimit','sqlType'
    ]
    this.placeholder = '请输入' + this.label
    this.clearable = false
    this.disabled = false
    this.prefixicon = 'el-icon-time'
    this.datetype = 'date'
    this.startplaceholder = '开始时间'
    this.endplaceholder = '结束时间'
    this.rangeseparator = '至'
    this.startLimit = ''
    this.endLimit = ''
    this.defaultValue = '' //new Date()
    this.sqlType = 'date'
    this.linkbind = ''

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' }
    ]
  }
 
}