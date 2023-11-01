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
                  label: "文本域",
                  prop: "textarea1",
                  type: "textarea"
                },
                {
                  label: "禁用状态",
                  prop: "demo2",
                  type: "textarea",
                  disabled: true
                },
                {
                  label: "rows = 5",
                  prop: "demo3",
                  type: "textarea",
                  rows: 5
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
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'TextArea',
  data(){
    return {
      detail: {
        title: 'textarea 文本域',
        info: '通过鼠标或键盘输入字符',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "文本域",
            prop: "textarea1",
            type: 'textarea'
          },
          {
            label: "禁用状态",
            prop: "demo2",
            type: "textarea",
            disabled: true
          },
          {
            label: "rows = 5",
            prop: "demo3",
            type: "textarea",
            rows: 5
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
          param: 'rows',
          introduce: '文本域行数',
          type: 'number',
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
        {
          param: 'minlength',
          introduce: '原生属性，最小输入长度',
          type: 'number',
          value: '-',
          default: '-'
        },
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
          param: 'disabled',
          introduce: '禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'autoSize',
          introduce: '高度根据文本内容自动进行调整，object类型: { minRows: 2, maxRows: 4}',
          type: 'boolean / object',
          value: '-',
          default: 'false'
        }
      ]
    }
  }
}
</script>