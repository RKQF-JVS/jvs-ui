
import assembly from './assembly'
import formatKey from './format'
export default class MSlider extends assembly{
  constructor (
    type='slider',
    label='滑块',
    span=24,
    prop='slider'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','min','max','defaultUrl',
    'disabled','step','showstops','showinput','range','defaultValue','sqlType'
    ]
    this.linkbind = ''
    this.min = 0
    this.max = 100
    this.disabled = false
    this.step = 1
    this.showstops = false
    this.showinput = false
    // 多选
    this.range = false
    this.defaultValue = null
    this.defaultUrl = ''
    this.sqlType = 'double'

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
 
}