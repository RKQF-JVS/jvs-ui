
import assembly from './assembly'
import formatKey from './format'
export default class MFileUpload extends assembly{
  constructor (
    type='fileUpload',
    label='上传文件',
    span=24,
    prop='fileUpload'+ formatKey.numberToString(new Date().getTime()),
    action='',
    multipleUpload = false,
    limit= 1,
    fileList=[],
    headers={},
    headersStr=''
  ) {
    super(type,label,span,prop,action,multipleUpload,fileList,limit,headers);
    this.showFrom = ['label', 'span', 'prop', 'multipleUpload','action','limit','headers','headersStr','sqlType']
    // 校验
    this.rules = []
    this.action = action
    this.multipleUpload = multipleUpload
    this.fileList = fileList
    this.limit = limit
    this.headersStr = headersStr
    this.headers = headersStr && JSON.parse(headersStr) || {}
    this.sqlType = 'array'
    this.linkbind = ''

    this.handleSuccess = (response, file, fileList) => {
      if(response.code === 0){
        let obj = {
          name: file.name,
          url: response.data.previewUrl
        }
        // this.fileList.push(obj)
        let temp = {
          key: this.key,
          fileList: this.fileList
        }
        // this.$emit('file', temp)
      }
      // console.log(response)
      // this.fileList = fileList
    }
    this.handleError = (err, file, fileList) => {
      console.log(err)
    }

    this.handleRemove = (file, fileList) => {
      console.log(file, fileList);
      this.fileList = fileList
      let temp = {
        key: this.key,
        fileList: this.fileList
      }
      // this.$emit('file', temp)
    }
    // this.setRequestHeaderHandle = () => {
    //   if(this.headersStr) {
    //     let obj = JSON.parse(this.headersStr)
    //     if(obj.constructor === Object){
    //       this.headers = obj
    //     }
    //   }
    // }
  }
}