/**
 * 用于查询条件设置组件
 * 后期可用于优化
 * 2021-04-22
 */

import MInput from './assembly/input'
import MTextarea from './assembly/textarea'
import MInputNumber from './assembly/inputNumber'
import MSelect from './assembly/select'
// import Mtable from './assembly/tableform'
import Mswitch from './assembly/switch'
import MSlider from './assembly/slider'
import Mtimeselect from './assembly/timeselect'
import MTimepicker from './assembly/timepicker'
import MDatePicker from './assembly/datePicker'
import MRadio from './assembly/radio'
import MCheckbox from './assembly/checkbox'
import MDivider from './assembly/divider'
import MP from './assembly/p'

import MImageUpload from './assembly/imageUpload'
import MFileUpload from './assembly/fileUpload'

import MColorSelect from './assembly/colorSelect'
import MIconSelct from './assembly/iconSelect'

import MTab from './assembly/tab'
import MTableForm from './assembly/tableform'

import MDepartment from './assembly/department'
import MRole from './assembly/role'
import MUser from './assembly/user'
import MPost from './assembly/post'
import MChinaArea from './assembly/chinaArea'

// 详情
import MInputReadOnly from './assembly/inputreadonly'
import MTextareaReadOnly from './assembly/textareareadonly'
import MImage from './assembly/image'
import MFile from './assembly/file'
import MBox from './assembly/box'
import MLink from './assembly/link'
import MIframe from './assembly/iframe'

// 2020-04-20 新增
import MHtmlEditor from './assembly/htmlEditor'
import MButton from './assembly/button'
import MCascader from './assembly/cascader'
import MDatasource from './assembly/datasource'

export const createFormItem =  function(type) {
  let obj={}
  // 表单
  if (type==='input') {
    obj=new MInput()
  } else if (type==='textarea') {
    obj=new MTextarea()
  } else if (type==='inputNumber') {
    obj=new MInputNumber()
  } else if (type==='select') {
    obj=new MSelect()
  } else if (type==='switch') {
    obj=new Mswitch()
  } else if (type==='slider') {
    obj=new MSlider()
  } else if (type==='timeSelect') {
    obj=new Mtimeselect()
  } else if (type==='timePicker') {
    obj=new MTimepicker()
  } else if (type==='datePicker') {
    obj=new MDatePicker()
  } else if (type==='radio') {
    obj=new MRadio()
  } else if (type==='checkbox') {
    obj=new MCheckbox()
  } else if (type==='tableForm') {
    obj=new MTableForm()
  } else if (type==='divider') {
    obj=new MDivider()
  } else if (type==='p') {
    obj=new MP()
  } else if (type==='imageUpload') {
    obj=new MImageUpload()
  } else if (type==='fileUpload') {
    obj=new MFileUpload()
  } else if (type==='colorSelect') {
    obj=new MColorSelect()
  } else if (type==='iconSelect') {
    obj=new MIconSelct()
  } else if (type==='tab') {
    obj=new MTab()
  } else if (type==='department') {
    obj=new MDepartment()
  } else if (type==='role') {
    obj=new MRole()
  } else if (type==='user') {
    obj=new MUser()
  } else if (type==='post') {
    obj=new MPost()
  } else if (type==='chinaArea') {
    obj=new MChinaArea()
  }
  // 详情
  else if (type==='inputReadOnly') {
    obj=new MInputReadOnly()
  } else if (type==='textareaReadOnly') {
    obj=new MTextareaReadOnly()
  } else if (type==='image') {
    obj=new MImage()
  } else if (type==='file') {
    obj=new MFile()
  } else if (type==='box') {
    obj=new MBox()
  } else if (type==='link') {
    obj=new MLink()
  } else if (type==='iframe') {
    obj=new MIframe()
  }

  // 2021-04-20 新增
  else if (type==='htmlEditor') {
    obj=new MHtmlEditor()
  } else if (type==='button') {
    obj=new MButton()
  }  else if (type==='cascader') {
    obj=new MCascader()
  }  else if (type==='datasource') {
    obj=new MDatasource()
  } 
  return obj
}