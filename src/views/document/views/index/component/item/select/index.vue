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
                  label: "下拉框",
                  prop: "demo1",
                  type: "select",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ]
                },
                {
                  label: "禁用状态",
                  prop: "demo2",
                  type: "select",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                  disabled: true
                },
                {
                  label: "可清空选择",
                  prop: "demo3",
                  type: "select",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                  clearable: true
                },
                {
                  label: "多选",
                  prop: "demo4",
                  type: "select",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                  multiple: true
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
  name: 'Select',
  data(){
    return {
      detail: {
        title: 'select 选择器',
        info: '当选项过多时，使用下拉菜单展示并选择内容',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "下拉框",
            prop: "demo1",
            type: "select",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ]
          },
          {
            label: "禁用状态",
            prop: "demo2",
            type: "select",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            disabled: true
          },
          {
            label: "可清空选择",
            prop: "demo3",
            type: "select",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            clearable: true
          },
          {
            label: "多选",
            prop: "demo4",
            type: "select",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            multiple: true
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
          param: 'clearable',
          introduce: '是否可清空',
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
          param: 'multiple',
          introduce: '是否多选',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'collapsetags',
          introduce: '多选时是否将选中值按文字的形式展示',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'filterable',
          introduce: '是否可搜索',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'allowcreate',
          introduce: '是否允许用户创建新条目，需配合 filterable 使用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'dicData',
          introduce: '字典数据',
          type: 'array',
          value: '-',
          default: '-'
        },
        {
          param: 'dicUrl',
          introduce: '接口提供字典数据, 优先级高于dicData',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'props',
          introduce: '字典字段映射关系',
          type: 'object',
          value: '-',
          default: '{label: "label", value: "value"}'
        },
      ]
    }
  }
}
</script>