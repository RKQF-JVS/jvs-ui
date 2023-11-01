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
                  label: "部门",
                  prop: "demo",
                  type: "department",
                  showalllevels: false,
                  collapsetags: true,
                  multiple: false
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
  name: 'Department',
  data(){
    return {
      detail: {
        title: 'department 部门选择器',
        info: '选择单个或多个部门, 返回部门id',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "部门",
            prop: "demo",
            type: "department",
            showalllevels: false,
            collapsetags: true,
            multiple: false
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
          param: 'multiple',
          introduce: '可否多选',
          type: 'boolean',
          value: '-',
          default: 'true'
        },
        {
          param: 'showalllevels',
          introduce: '输入框中是否显示选中值的完整路径',
          type: 'boolean',
          value: '-',
          default: 'true'
        },
        {
          param: 'collapsetags',
          introduce: '多选模式下是否折叠Tag',
          type: 'boolean',
          value: '-',
          default: 'false'
        }
      ]
    }
  }
}
</script>