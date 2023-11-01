<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <div class="demo">
      <div class="demo-item">
        <h5>示例</h5>
        <span></span>
        <div class="show">
          <jvs-form :option="formOption"></jvs-form>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-form :option="formOption"></jvs-form>

            formOption: {
              column: [
                {
                  label: "文本框",
                  prop: "demo1",
                  type: "input"
                },
                {
                  label: "禁用状态",
                  prop: "demo2",
                  type: "input",
                  disabled: true
                },
                {
                  label: "可清空",
                  prop: "demo3",
                  type: "input",
                  clearable: true
                },
                {
                  label: "密码框",
                  prop: "demo4",
                  type: "input",
                  showpassword: true
                },
                {
                  label: "带 icon 的输入框",
                  prop: "demo5",
                  type: "input",
                  prefixicon: "el-icon-search",
                  suffixicon: "el-icon-date"
                }
              ]
            },
          `'>
          </codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="参数配置" :option="option" :data="tableData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption} from '../../attr'
export default {
  name: 'Input',
  data(){
    return {
      detail: {
        title: 'input 输入框',
        info: '通过鼠标或键盘输入字符',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "文本框",
            prop: "demo1",
            type: "input"
          },
          {
            label: "禁用状态",
            prop: "demo2",
            type: "input",
            disabled: true
          },
          {
            label: "可清空",
            prop: "demo3",
            type: "input",
            clearable: true
          },
          {
            label: "密码框",
            prop: "demo4",
            type: "input",
            showpassword: true
          },
          {
            label: "带 icon 的输入框",
            prop: "demo5",
            type: "input",
            prefixicon: "el-icon-search",
            suffixicon: "el-icon-date"
          }
        ]
      },
      option: paramOption,
      tableData: [
        {
          param: 'label',
          introduce: '文字',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'prop',
          introduce: '绑定字段',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'showwordlimit',
          introduce: '是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        // {
        //   param: 'minlength',
        //   introduce: '原生属性，最小输入长度',
        //   type: 'number',
        //   value: '-',
        //   default: '-'
        // },
        {
          param: 'maxlength',
          introduce: '原生属性，最大输入长度',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'placeholder',
          introduce: '输入框占位文本',
          type: 'string',
          value: '-',
          default: 'label的值'
        },
        {
          param: 'clearable',
          introduce: '是否可清空',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'showpassword',
          introduce: '是否显示切换密码图标',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'disabled',
          introduce: '禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'prepend',
          introduce: 'prepend',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'append',
          introduce: '输入框后置内容',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'prefixicon',
          introduce: '输入框头部图标',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'suffixicon',
          introduce: '输入框尾部图标',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'regularExpression',
          introduce: '正则表达式',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'regularMessage',
          introduce: '校验错误提示',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>