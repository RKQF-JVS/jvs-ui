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
                  label: "固定时间",
                  prop: "demo1",
                  type: "timeSelect"
                },
                {
                  label: "禁用",
                  prop: "demo2",
                  type: "timeSelect",
                  disabled: true
                }
              ]
            }
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
  name: 'TimeSelect',
  data(){
    return {
      detail: {
        title: 'timeSelect 固定时间点',
        info: '用于选择或输入日期',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "固定时间",
            prop: "demo1",
            type: "timeSelect"
          },
          {
            label: "禁用",
            prop: "demo2",
            type: "timeSelect",
            disabled: true
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
          param: 'disabled',
          introduce: '禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'clearable',
          introduce: '是否可清空',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'placeholder',
          introduce: '输入框占位文本',
          type: 'string',
          value: '-',
          default: 'label的值'
        },
        {
          param: 'prefixicon',
          introduce: '自定义头部图标的类名',
          type: 'string',
          value: '-',
          default: 'el-icon-time'
        },
        {
          param: 'defaultValue',
          introduce: '默认值',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>