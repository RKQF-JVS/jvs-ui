
import assembly from './assembly'
import formatKey from './format'
export default class MTextareaReadOnly extends assembly{
  constructor (
    type='textareaReadOnly',
    label='文本域',
    span=24,
    prop='textareaReadOnly'+ formatKey.numberToString(new Date().getTime()),
    rows=1
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','jurisdiction', 'sqlType']
    this.disabled = true
    this.placeholder = '.........'
    // 校验
    this.rules = []
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
  }
}