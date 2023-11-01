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
                  label: "分割线",
                  prop: "demo",
                  type: "divider",
                  text: "我是分界线",
                  contentposition: "center",
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
  name: 'divider',
  data(){
    return {
      detail: {
        title: 'divider 分割线',
        info: '区隔内容的分割线',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "分割线",
            prop: "demo",
            type: "divider",
            text: "我是分界线",
            contentposition: "center",
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
          param: 'text',
          introduce: '文字',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'contentposition',
          introduce: '设置分割线文案的位置',
          type: 'string',
          value: 'left | right | center',
          default: 'center'
        },
      ]
    }
  }
}
</script>