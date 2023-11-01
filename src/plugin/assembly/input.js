import assembly from './assembly'
import formatKey from './format'

export default class MInput extends assembly{
    constructor (
      type='input',
      label='文本框',
      span=24,
      prop='input'+ formatKey.numberToString(new Date().getTime())
    ) {
      super(type,label,span,prop);
      this.showFrom = ['label', 'span', 'prop','minlength','maxlength','showwordlimit','placeholder','sqlType',
        'clearable','showpassword','disabled','prefixicon','suffixicon','prepend','append','defaultValue','regular','defaultUrl'
      ]
      this.linkbind = ''
      this.minlength = 0
      this.maxlength = 100
      this.showwordlimit = true
      this.placeholder = '请输入' + this.label
      this.clearable = true
      this.showpassword	 = false
      this.disabled = false
      this.prefixicon = 'el-icon-edit'
      this.suffixicon = ''
      this.prepend = ''
      this.append = ''
      this.defaultValue = ''
      this.regularExpression = ''
      this.regularMessage = ''
      this.defaultUrl = ''
      this.sqlType = 'varchar'
      // 校验
      this.rules = [
        { required: false, message: '请输入' + this.label , trigger: 'change' }
      ]
    }
  }