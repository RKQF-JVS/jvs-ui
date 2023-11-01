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
                  label: "表单卡片",
                  prop: "demo1",
                  type: "formbox",
                  children: [
                    {
                      label: "文本框",
                      prop: "input"
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
  name: 'form-card',
  data(){
    return {
      detail: {
        title: 'formbox 表单卡片',
        info: '用户新增多个重复内容的表单',
      },
      formOption: {
        column: [
          {
            label: "表单卡片",
            prop: "demo1",
            type: "formbox",
            children: [
              {
                label: "文本框",
                prop: "input"
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
          param: 'children',
          introduce: '表单项集合',
          type: 'array',
          value: 'children不应包含 表单卡片(formbox)',
          default: '-'
        }
      ]
    }
  }
}
</script>