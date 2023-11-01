import assembly from './assembly'
import formatKey from './format'
export default class MIframe extends assembly{
  constructor (
    type='iframe',
    label='',
    span=24,
    prop='iframe'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['jurisdiction','span','iframeheight','iframeurl','sqlType']
    this.iframeheight = ''
    this.iframeurl = ''
    this.showJurisdiction = ['所有用户']
    this.rules = []
    this.sqlType = 'varchar'
    this.linkbind = ''
  }
}