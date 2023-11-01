import assembly from './assembly'
import formatKey from './format'
export default class MStep extends assembly{
  constructor (
    type='step',
    label='步骤条',
    span=24,
    prop='step'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','url','datatype','dicData','jurisdiction','sqlType', 'option']
    // 数据类型 option 和 url
    this.datatype = 'option'
    // 请求接口
    this.url = ''
    // 下拉框的选项
    this.dicData = [{
      label: '步骤一',
      name: 'first'
    }, {
      label: '步骤二',
      name: 'second'
    }, {
      label: '步骤三',
      name: 'third'
    }]

    this.activeName = this.dicData[0].name
    this.column = {} // 选项对应的表单项
    // 校验
    this.rules = []
    this.showJurisdiction = ['所有用户']
    this.sqlType = 'object'
    this.linkbind = ''

    this.toolAlign = 'center'
    this.props = {
      label: '',
      value: ''
    }
  }
  addcolumn (key,data) {
    if(!this.column[key]) {
      this.column[key] = []
    }
    this.column[key].push(data)
  }
  deletecolumn (key,prop) {
    this.column[key] = this.column[key].filter(item => item.prop != prop)
    console.log(this.column)
  }
  deletedicData (index) {
    this.dicData.splice(index, 1)
  }
  adddicData () {
    let obj = {}
    let key = 'newValue' + this.dicData.length
    obj[key] = []
    this.column[key] = obj
    this.dicData.push({label: '新的选择', value: ('newValue' + this.dicData.length)})
  }
  handleClick(activeName) {
    if(activeName || activeName === 0 || activeName === false) {
      this.activeName = activeName
    }
  }
}