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
                  label: "静态表格",
                  prop: "demo1",
                  type: "reportTable",
                  rowcolumn: "月份",
                  dicData: [
                    {label: "9月", value: "one"},
                    {label: "8月", value: "two"},
                    {label: "7月", value: "three"}
                  ],
                  tableColumn: [
                    {
                      label: "利润",
                      prop: "input"
                    },
                    {
                      label: "成本",
                      prop: "inputNumber",
                      type: "inputNumber"
                    },
                    {
                      label: "峰值基地",
                      prop: "city",
                      type: "radio",
                      dicData: [
                        {label: "北京", value: "Beijing"},
                        {label: "上海", value: "Shanghai"},
                        {label: "天津", value: "Tianjin"},
                        {label: "重庆", value: "Chongqing"}
                      ]
                    }
                  ]
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
  name: 'report-table',
  data(){
    return {
      detail: {
        title: 'reportTable 静态表格',
        info: '用于记录比对多个状态下的数据',
      },
      formOption: {
        column: [
          {
            label: "静态表格",
            prop: "demo1",
            type: "reportTable",
            rowcolumn: "月份",
            dicData: [
              {label: "9月", value: "one"},
              {label: "8月", value: "two"},
              {label: "7月", value: "three"}
            ],
            tableColumn: [
              {
                label: "利润",
                prop: "input"
              },
              {
                label: "成本",
                prop: "inputNumber",
                type: "inputNumber"
              },
              {
                label: "峰值基地",
                prop: "city",
                type: "radio",
                dicData: [
                  {label: "北京", value: "Beijing"},
                  {label: "上海", value: "Shanghai"},
                  {label: "天津", value: "Tianjin"},
                  {label: "重庆", value: "Chongqing"}
                ]
              }
            ]
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
          param: 'rowcolumn',
          introduce: '总标题',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'dicData',
          introduce: '表格列字段',
          type: 'array',
          value: '[ {label: "", value: ""} ]',
          default: '-'
        },
        {
          param: 'tableColumn',
          introduce: '表格行字段',
          type: 'array',
          value: '表单项集合，不应包含自身、分割线(divider)、小标题(p)、选项卡(tab)、步骤条(step)、表单卡片(formbox)、表格(tableForm)、富文本(htmlEditor)',
          default: '-'
        }
      ]
    }
  }
}
</script>