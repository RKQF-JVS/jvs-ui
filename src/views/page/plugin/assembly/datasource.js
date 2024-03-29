
import assembly from './assembly'
import formatKey from './format'
export default class MDatasource extends assembly{
  constructor (
    type='datasource',
    label='自定义选择',
    span=24,
    prop='datasource'+ formatKey.numberToString(new Date().getTime()),
    text='',
    currVal=''
  ) {
    super(type,label,span,prop,text,currVal);
    this.showFrom = ['label', 'span', 'prop','collapsetags','placeholder',
      'disabled','sqlType', 'sourceTable', 'multiple' // , 'regular'
    ]
    this.hasChildren = false
    this.multiple = false
    this.collapsetags = false
    this.disabled = false
    this.filterable = true
    this.allowcreate = false
    this.placeholder = '请输入' + this.label
    this.clearable = true
    this.defaultValue = ''
    this.defaultUrl = ''
    this.sqlType = 'array'
    this.parentKey = ''
    // 数据类型 option 和 url
    this.datatype = 'option'
    // 请求接口
    this.url = ''
    // 下拉框的选项
    this.dicData = [{
      value: 'Beijing',
      label: '北京'
    }, {
      value: 'Shanghai',
      label: '上海'
    }, {
      value: 'Tianjin',
      label: '天津'
    }, {
      value: 'ChongQing',
      label: '重庆'
    }]
    this.text = text
    this.currVal = currVal
    this.linkbind = ''
    this.sourceType = ''

    // 校验
    this.rules = [
      { required: false, message: '请选择' + this.label , trigger: 'change' },
    ]

    // 字典的label value配置
    this.props = {
      label: '',
      value: ''
    }

    this.changeHandle = (val) => {
      this.currVal = val
      // this.$emit('changeValHandle', val)
      // console.log(val,'change...')
    }
  }

  deleteOption (index) {
    this.dicData.splice(index, 1)
  }
  addoption () {
    this.dicData.push({label: '新的选择', value: ('newValue' + this.dicData.length)})
  }
}