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
                  label: "文字描述",
                  prop: "demo1",
                  type: "box",
                  text: "这是一段文字",
                  textcolor: "red"
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
  name: 'BoxCom',
  data(){
    return {
      detail: {
        title: 'box 描述框',
        info: '文字段落描述',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "文字描述",
            prop: "demo1",
            type: "box",
            text: "这是一段文字",
            textcolor: "red"
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
          introduce: '对齐方式',
          type: 'string',
          value: 'left | center | right',
          default: '-'
        },
        {
          param: 'fontsize',
          introduce: '文字大小',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'textcolor',
          introduce: '文本颜色',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'fontweight',
          introduce: '文字粗细',
          type: 'string',
          value: '-',
          default: '-'
        }
      ]
    }
  }
}
</script>