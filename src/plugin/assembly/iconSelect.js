import assembly from './assembly'
import formatKey from './format'
export default class MIconSelect extends assembly{
  constructor (
    type='iconSelect',
    label='图标选择',
    span=24,
    prop='iconSelect'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','jurisdiction', 'span','fontsize','fontweight','sqlType', // , 'text' ,'textcolor' ,'contentposition'
    ]
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
    // 校验
    this.rules = []
  }
}