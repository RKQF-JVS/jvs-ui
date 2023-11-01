
import assembly from './assembly'
import formatKey from './format'
export default class MCheckbox extends assembly{
  constructor (
    type='checkbox',
    label='多选',
    span=24,
    prop='checkbox'+ formatKey.numberToString(new Date().getTime())
  ) {
    super(type,label,span,prop);
    this.showFrom = ['label', 'span', 'prop','sqlType',
      'disabled','checkboxtype','datatype','option','url','min','max','defaultValue','defaultUrl'
    ]
    this.linkbind = ''
    // button
    this.checkboxtype = 'fang'
    this.disabled = false
    this.min = 0
    this.max = 2

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
    this.defaultValue = ''
    this.defaultUrl = ''
    this.sqlType = 'array'
    // 校验
    this.rules = [
      { required: false, message: '请输入' + this.label , trigger: 'change' },
    ]
  }
  
  deleteOption (index) {
    this.dicData.splice(index, 1)
  }
  addoption () {
    this.dicData.push({label: '新的选择', value: ('newValue' + this.option.length)})
  }
}