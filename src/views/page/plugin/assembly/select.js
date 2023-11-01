
import assembly from './assembly'
import formatKey from './format'
export default class MSelect extends assembly{
  constructor (
    type='select',
    label='下拉框',
    span=24,
    prop='select'+ formatKey.numberToString(new Date().getTime()),
    text='',
    currVal='',
    children=[]
  ) {
    super(type,label,span,prop,children,text,currVal);
    this.showFrom = ['label', 'span', 'prop','multiple','collapsetags','placeholder','defaultUrl',
      'clearable','disabled','filterable','allowcreate','datatype','option','url','defaultValue','sqlType','hasChildren'
    ]
    this.hasChildren = false
    this.children = children
    this.multiple = true
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

    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
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