
import assembly from './assembly'
import formatKey from './format'
export default class MTimepicker extends assembly{
  constructor (
    type='timeSelect',
    label='固定时间',
    span=24,
    prop='timeselect'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','disabled','placeholder','pickeroptions','clearable','sqlType',
    'prefixicon'
    ]
    this.linkbind = ''
    this.disabled = false
    this.placeholder = '请输入' + this.label
    this.clearable = false
    this.prefixicon = 'el-icon-time'

    this.pickeroptions = {
      start: '09:00',
      end: '18:00',
      step: '00:15'
    }
    this.defaultValue = this.pickeroptions.start
    this.sqlType = 'date'

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
 
}