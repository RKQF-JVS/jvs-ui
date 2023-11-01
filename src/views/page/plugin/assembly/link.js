import assembly from './assembly'
import formatKey from './format'
export default class MLink extends assembly{
  constructor (
    type='link',
    label='',
    span=24,
    prop='link'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['prop','label','jurisdiction','span','text','contentposition','fontsize','textcolor','fontweight','textdecoration','openType','sqlType'
    ]
    this.label = '链接'
    this.text = '显示文字'
    this.contentposition = 'center'
    this.fontsize = 16
    this.textcolor = '#409EFF'
    this.fontweight = 'normal'
    this.textdecoration = 'none'
    this.openType = '_blank'
    this.rules = []
    this.fontweightOption = ['100','200','300','400','500','600','700','800','900','bold','bolder','lighter','normal','unset']
    this.textdecorationOption = ['blink','dashed','dotted','double','inherit','initial','line-through','none','overline','solid','underline','unset','wavy']
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'varchar'
    this.linkbind = ''
  }
}