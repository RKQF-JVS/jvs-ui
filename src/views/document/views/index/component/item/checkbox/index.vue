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
                  label: "多选",
                  prop: "demo1",
                  type: "checkbox",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                },
                {
                  label: "禁用状态",
                  prop: "demo2",
                  type: "checkbox",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                  disabled: true
                },
                {
                  label: "按钮形状",
                  prop: "demo3",
                  type: "checkbox",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ],
                  checkboxtype: "button"
                },
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
  name: 'Checkbox',
  data(){
    return {
      detail: {
        title: 'checkbox 多选框',
        info: '一组备选项中进行多选',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "多选",
            prop: "demo1",
            type: "checkbox",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
          },
          {
            label: "禁用状态",
            prop: "demo2",
            type: "checkbox",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            disabled: true
          },
          {
            label: "按钮形状",
            prop: "demo3",
            type: "checkbox",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            checkboxtype: "button"
          },
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
          param: 'checkboxtype',
          introduce: '按钮样式',
          type: 'string',
          value: 'fang | button',
          default: 'fang'
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