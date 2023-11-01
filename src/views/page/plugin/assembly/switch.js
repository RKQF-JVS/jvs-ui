
import assembly from './assembly'
import formatKey from './format'
export default class MSwitch extends assembly{
  constructor (
    type='switch',
    label='开关',
    span=24,
    prop='switch'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','disabled','activetext','inactivetext',
    'activecolor','inactivecolor','defaultValue','defaultUrl','sqlType','hasChildren'
    ]
    this.linkbind = ''
    this.hasChildren = false
    this.children = []
    this.disabled = false
    this.activetext = '开'
    this.inactivetext = '关'
    this.activecolor = '#409EFF'
    this.inactivecolor = '#C0CCDA'
    this.defaultValue = false
    this.defaultUrl = ''
    this.sqlType = 'bit'

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
 
}