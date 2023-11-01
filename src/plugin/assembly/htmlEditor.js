import assembly from './assembly'
import formatKey from './format'
export default class MHtmlEditor extends assembly{
  constructor (
    type='htmlEditor',
    label='富文本',
    span=24,
    prop='htmlEditor'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','jurisdiction']
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
    // 校验
    this.rules = []
  }
}