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
                  label: "步骤条",
                  prop: "demo1",
                  type: "step",
                  activeName: "1",
                  dicData: [
                    {
                      label: "步骤一",
                      name: "first",
                      btns: [{name: "下一步", type: "next"}]
                    }, {
                      label: "步骤二",
                      name: "second",
                      btns: [{name: "上一步", type: "last"}, {name: "下一步", type: "next"}]
                    }, {
                      label: "步骤三",
                      name: "third",
                      btns: [{name: "上一步", type: "last"}]
                    }
                  ],
                  column: {
                    first: [
                      {label: "文本框", prop: "input"}
                    ],
                    second: [
                      {label: "文本域", prop: "textarea", type: "textarea"}
                    ]
                  }
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
      <jvs-table pageheadertitle="步骤按钮参数" :option="option" :data="btnData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption, requestData} from '../../attr'
export default {
  name: 'step-bar',
  data(){
    return {
      detail: {
        title: 'step 步骤条',
        info: '分步完成数据集填写',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "步骤条",
            prop: "demo1",
            type: "step",
            activeName: "first",
            dicData: [
              {
                label: "步骤一",
                name: "first",
                btns: [{name: "下一步", type: "next"}]
              }, {
                label: "步骤二",
                name: "second",
                btns: [{name: "上一步", type: "last"}, {name: "下一步", type: "next"}]
              }, {
                label: "步骤三",
                name: "third",
                btns: [{name: "上一步", type: "last"}]
              }
            ],
            column: {
              first: [
                {label: "文本框", prop: "input"}
              ],
              second: [
                {label: "文本域", prop: "textarea", type: "textarea"}
              ]
            }
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
          param: 'dicData',
          introduce: '步骤条配置数据 {label: "", name: "", btns: []}， btns详细参数如下',
          type: 'array',
          value: '-',
          default: '-'
        }
      ],
      btnData: [
        {
          param: 'name',
          introduce: '按钮名称',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'type',
          introduce: '按钮类型，流转按钮：last | next ',
          type: 'string',
          value: '-',
          default: '-'
        },
        ...requestData
      ]
    }
  }
}
</script>