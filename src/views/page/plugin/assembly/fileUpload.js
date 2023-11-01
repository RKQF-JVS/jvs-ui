
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
    this.showFrom = ['label', 'span', 'prop', 'multipleUpload','action','limit','headers','headersStr','sqlType'] // , 'regular'
    // 校验
    this.rules = [
      { required: false, message: '请上传文件' , trigger: 'change' }
    ]
    this.action = action
    this.multipleUpload = multipleUpload
    this.fileList = fileList
    this.limit = limit
    this.headersStr = headersStr
    this.headers = headersStr && JSON.parse(headersStr) || {}
    this.sqlType = 'array'
    this.linkbind = ''
    this.uploadHttp = {
      httpMethod: "POST",
      requestContentType: "MULTIPART",
      responseContentType: "JSON",
      url: "/mgr/jvs-auth/upload/jvs-public"
    }
    this.action = "/mgr/jvs-auth/upload/jvs-public"

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
      this.fileList = fileList
    }
  }
}