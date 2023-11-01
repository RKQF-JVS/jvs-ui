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
                  label: "计数器",
                  prop: "demo1",
                  type: "inputNumber"
                },
                {
                  label: "禁用",
                  prop: "demo2",
                  type: "inputNumber",
                  disabled: true
                },
                {
                  label: "步数为2",
                  prop: "demo3",
                  type: "inputNumber",
                  step: 2
                },
                {
                  label: "严格步数",
                  prop: "demo4",
                  type: "inputNumber",
                  stepstrictly: true
                },
                {
                  label: "精度为2",
                  prop: "demo5",
                  type: "inputNumber",
                  precision: 2
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
  name: 'InputNumber',
  data(){
    return {
      detail: {
        title: 'inputNumber 计数器',
        info: '仅允许输入标准的数字值，可定义范围',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "计数器",
            prop: "demo1",
            type: "inputNumber"
          },
          {
            label: "禁用",
            prop: "demo2",
            type: "inputNumber",
            disabled: true
          },
          {
            label: "步数为2",
            prop: "demo3",
            type: "inputNumber",
            step: 2
          },
          {
            label: "严格步数",
            prop: "demo4",
            type: "inputNumber",
            stepstrictly: true
          },
          {
            label: "精度为2",
            prop: "demo5",
            type: "inputNumber",
            precision: 2
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
          param: 'min',
          introduce: '设置计数器允许的最小值',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'max',
          introduce: '设置计数器允许的最大值',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'step',
          introduce: '计数器步长',
          type: 'number',
          value: '-',
          default: '1'
        },
        {
          param: 'stepstrictly',
          introduce: '是否只能输入 step 的倍数',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'precision',
          introduce: '数值精度',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'controlsposition',
          introduce: '控制按钮位置',
          type: 'string',
          value: 'right',
          default: '-'
        },
        {
          param: 'unit',
          introduce: '单位',
          type: 'string',
          value: '-',
          default: '-'
        }
      ]
    }
  }
}
</script>