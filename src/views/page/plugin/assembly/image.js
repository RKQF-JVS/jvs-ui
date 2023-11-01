
import assembly from './assembly'
import formatKey from './format'
export default class MImage extends assembly{
  constructor (
    type='image',
    label='图片',
    span=24,
    prop='image'+ formatKey.numberToString(new Date().getTime()),
    fileList = [],
    dialogVisible = false,
    dialogImageUrl = '',
  ) {
    super(type,label,span,prop,fileList,dialogImageUrl,dialogVisible,fileList);
    this.showFrom = ['label', 'span', 'prop','url','fit','jurisdiction','sqlType']
    this.url = ''
    this.fit = ''
    this.fileList = fileList
    this.rules = []
    this.dialogImageUrl = dialogImageUrl
    this.dialogVisible = dialogVisible
    this.sqlType = 'array'
    this.linkbind = ''

    this.handlePictureCardPreview = (url) => {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    }
    this.showJurisdiction = ['所有用户']
  }
}