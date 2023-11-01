
import assembly from './assembly'
import formatKey from './format'
export default class MFile extends assembly{
  constructor (
    type='file',
    label='文件',
    span=24,
    prop='file'+ formatKey.numberToString(new Date().getTime()),
    fileList = [{name: '', url: ''}]
  ) {
    super(type,label,span,prop,fileList);
    this.showFrom = ['label', 'span', 'prop','jurisdiction','sqlType']
    this.fileList = fileList
    this.rules = []
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'array'
    this.linkbind = ''
  }
}