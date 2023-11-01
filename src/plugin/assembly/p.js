
import assembly from './assembly'
import formatKey from './format'
export default class MP extends assembly{
  constructor (
    type='p',
    label='',
    span=24,
    prop='p'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','span','text','contentposition','fontsize','textcolor','sqlType'
    ]
    this.linkbind = ''
    this.text = '某某表单'
    this.contentposition = 'center'
    this.fontsize = 18
    this.textcolor = '#333'
    this.sqlType = 'varchar'
    this.rules = [
    ]
  }
}