import assembly from './assembly'
import formatKey from './format'
export default class MColorSelect extends assembly{
  constructor (
    type='colorSelect',
    label='颜色选择',
    span=24,
    prop='colorSelect'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','jurisdiction','span','fontweight','sqlType', // 'fontsize' // 'text','contentposition',  ,'textcolor'
    ]
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
    // 校验
    this.rules = []
  }
}