
import assembly from './assembly'
import formatKey from './format'
export default class MTimepicker extends assembly{
  constructor (
    type='timePicker',
    label='任意时间',
    span=24,
    prop='timepicker'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','disabled','placeholder','clearable','pickeroptions',
    'prefixicon','isrange','startplaceholder','endplaceholder','rangeseparator','sqlType'
    ]
    this.linkbind = ''
    this.disabled = false
    this.placeholder = '请输入' + this.label
    this.clearable = false
    this.prefixicon = 'el-icon-time'

    this.isrange = false
    this.startplaceholder = '开始时间'
    this.endplaceholder = '结束时间'
    this.rangeseparator = '至'
    this.defaultValue = new Date()
    this.sqlType = 'date'
    this.pickeroptions = {
      start: '09:00',
      end: '18:00',
      step: ''
    }

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
 
}