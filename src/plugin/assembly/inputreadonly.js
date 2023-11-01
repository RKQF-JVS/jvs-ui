
import assembly from './assembly'
import formatKey from './format'
export default class MInputReadOnly extends assembly{
  constructor (
    type='inputReadOnly',
    label='文本框',
    span=24,
    prop='inputReadOnly'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','jurisdiction','sqlType']
    this.placeholder = '.........'
    this.disabled = true
    // 校验
    this.rules = []
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
  }
}