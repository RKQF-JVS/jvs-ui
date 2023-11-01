import assembly from './assembly'
import formatKey from './format'
export default class MBox extends assembly{
  constructor (
    type='box',
    label='',
    span=24,
    prop='box'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','jurisdiction','span','text','contentposition','fontsize','textcolor','fontweight','sqlType'
    ]
    this.label = '描述框'
    this.text = '这是一段描述'
    this.contentposition = 'center'
    this.fontsize = 18
    this.textcolor = '#333'
    this.fontweight = 'normal'
    this.rules = []
    this.fontweightOption = ['100','200','300','400','500','600','700','800','900','bold','bolder','lighter','normal','unset']
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
  }
}