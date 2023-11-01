
import assembly from './assembly'
import formatKey from './format'
export default class MDivider extends assembly{
  constructor (
    type='divider',
    label='',
    span=24,
    prop='divider'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['span','text','contentposition','sqlType'
    ]
    this.text = ''
    this.contentposition = 'center'
    this.sqlType = 'varchar'
    this.rules = [
    ]
    this.linkbind = ''
  }
}