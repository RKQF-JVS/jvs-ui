<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <div class="demo">
      <div class="demo-item">
        <h5>示例</h5>
        <span></span>
        <div class="show">
          <jvs-form :option="formOption" :formData="formData"></jvs-form>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-form :option="formOption" :formData="formData"></jvs-form>

            formData: { 
              demoOne: [{demo1: "举个例子", demo2: 2}],
              demoTwo: [{demo1: "举个例子", demo2: 2}] 
            },
            formOption: {
              column: [
                {
                  label: "行内编辑",
                  prop: "demoOne",
                  type: "tableForm",
                  editable: true,
                  addBtn: true,
                  delBtn: true,
                  tableColumn: [
                    {
                      label: "文本框",
                      prop: "demo1"
                    },
                    {
                      label: "计数器",
                      prop: "demo2",
                      type: "inputNumber"
                    }
                  ]
                },
                {
                  label: "展示表格",
                  prop: "demoTwo",
                  type: "tableForm",
                  editable: false,
                  addBtn: true,
                  editBtn: true,
                  viewBtn: true,
                  delBtn: true,
                  tableColumn: [
                    {
                      label: "文本框",
                      prop: "demo1"
                    },
                    {
                      label: "计数器",
                      prop: "demo2",
                      type: "inputNumber"
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
  name: 'TableForm',
  data(){
    return {
      detail: {
        title: 'tableForm 可编辑表格',
        info: '表格行数据可编辑',
      },
      formData: {
        demoOne: [{demo1: "举个例子", demo2: 2}],
        demoTwo: [{demo1: "举个例子", demo2: 2}]
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "行内编辑",
            prop: "demoOne",
            type: "tableForm",
            editable: true,
            addBtn: true,
            delBtn: true,
            tableColumn: [
              {
                label: "文本框",
                prop: "demo1"
              },
              {
                label: "计数器",
                prop: "demo2",
                type: "inputNumber"
              }
            ]
          },
          {
            label: "展示表格",
            prop: "demoTwo",
            type: "tableForm",
            editable: false,
            addBtn: true,
            editBtn: true,
            viewBtn: true,
            delBtn: true,
            tableColumn: [
              {
                label: "文本框",
                prop: "demo1"
              },
              {
                label: "计数器",
                prop: "demo2",
                type: "inputNumber"
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
          param: 'editable',
          introduce: '是否行内编辑',
          type: 'boolean',
          value: 'true | false',
          default: '-'
        },
        {
          param: 'addBtn',
          introduce: '新增按钮',
          type: 'boolean',
          value: 'true | false',
          default: '-'
        },
        {
          param: 'addBtnFormCode',
          introduce: '新增表单name',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'editBtn',
          introduce: '编辑按钮，仅在editable为false生效',
          type: 'boolean',
          value: 'true | false',
          default: '-'
        },
        {
          param: 'editBtnFormCode',
          introduce: '编辑表单name',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'viewBtn',
          introduce: '查看按钮，仅在editable为false生效',
          type: 'boolean',
          value: 'true | false',
          default: '-'
        },
        {
          param: 'viewBtnFormCode',
          introduce: '详情表单name',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'delBtn',
          introduce: '删除按钮',
          type: 'boolean',
          value: 'true | false',
          default: '-'
        },
        {
          param: 'tableColumn',
          introduce: '列项配置, 每项为表单项',
          type: 'array',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>