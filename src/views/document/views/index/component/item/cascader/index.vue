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
                  label: "级联选择",
                  prop: "demo1",
                  type: "cascader"
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
  name: 'Cascader',
  data(){
    return {
      detail: {
        title: 'cascader 级联选择',
        info: '当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "级联选择",
            prop: "demo1",
            type: "cascader"
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
          param: 'dictName',
          introduce: '字典名称，选取系统中的树形字典dictName',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'disabled',
          introduce: '是否禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
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
        },
        {
          param: 'multiple',
          introduce: '是否多选',
          type: 'boolean',
          value: '-',
          default: 'true'
        },
        {
          param: 'emitKey',
          introduce: '传递值字段',
          type: 'string',
          value: '-',
          default: 'code'
        },
        {
          param: 'emitPath',
          introduce: '在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值',
          type: 'boolean',
          value: '-',
          default: 'true'
        }
      ]
    }
  }
}
</script>