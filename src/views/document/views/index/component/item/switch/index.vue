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
                  label: "开关",
                  prop: "demo1",
                  type: "switch"
                },
                {
                  label: "文字描述",
                  prop: "demo2",
                  type: "switch",
                  activetext: "打开",
                  inactivetext: "关闭"
                },
                {
                  label: "禁用状态",
                  prop: "demo3",
                  type: "switch",
                  disabled: true
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
  name: 'switchDoc',
  data(){
    return {
      detail: {
        title: 'switch 开关',
        info: '表示两种相互对立的状态间的切换，多用于触发「开/关」',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "开关",
            prop: "demo1",
            type: "switch"
          },
          {
            label: "文字描述",
            prop: "demo2",
            type: "switch",
            activetext: "打开",
            inactivetext: "关闭"
          },
          {
            label: "禁用状态",
            prop: "demo3",
            type: "switch",
            disabled: true
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
          param: 'activetext',
          introduce: 'switch 打开时的文字描述',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'activecolor',
          introduce: 'switch 打开时的背景色',
          type: 'string',
          value: '-',
          default: '#409EFF'
        },
        {
          param: 'inactivetext',
          introduce: 'switch 关闭时的文字描述',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'inactivecolor',
          introduce: 'switch 关闭时的背景色',
          type: 'string',
          value: '-',
          default: '#C0CCDA'
        },
      ]
    }
  }
}
</script>