import assembly from './assembly'
import formatKey from './format'
export default class MButton extends assembly{
  constructor (
    type='button',
    label='按钮',
    span=24,
    prop='button'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','span','jurisdiction', 'text', 'disabled', 'style']
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
    this.text = '按钮'
    // 校验
    this.rules = []
  }
}