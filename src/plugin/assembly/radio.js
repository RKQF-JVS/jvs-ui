
import assembly from './assembly'
import formatKey from './format'
export default class MRadio extends assembly{
  constructor (
    type='radio',
    label='单选',
    span=24,
    prop='radio'+ formatKey.numberToString(new Date().getTime()),
    children=[],
    text='',
    currVal=''
  ) {
    super(type,label,span,prop,children,text,currVal);
    this.showFrom = ['label', 'span', 'prop', 'sqlType',
      'disabled','radiotype','datatype','option','url','defaultValue','defaultUrl','hasChildren'
    ]
    // button
    this.hasChildren = false
    this.linkbind = ''
    this.radiotype = 'yuan'
    this.disabled = false
    this.children = children
    this.text = text
    this.currVal = currVal
    this.defaultValue = ''
    this.defaultUrl = ''
    this.sqlType = 'varchar'
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
    // 校验
    this.rules = [
      { required: false, message: '请选择' + this.label , trigger: 'change' },
    ]
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