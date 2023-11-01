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
                  label: "文字",
                  prop: "demo",
                  type: "p",
                  text: "举个例子",
                  contentposition: "center",
                  fontsize: 20,
                  textcolor: "#ccc"
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
  name: 'PCom',
  data(){
    return {
      detail: {
        title: 'p 文字',
        info: '文本显示',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "文字",
            prop: "demo",
            type: "p",
            text: "举个例子",
            contentposition: "center",
            fontsize: 20,
            textcolor: "#ccc"
          }
        ]
      },
      option: paramOption,
      tableData: [
        {
          param: 'text',
          introduce: '需要显示的文字内容',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'contentposition',
          introduce: '对齐方式',
          type: 'string',
          value: 'left | center | right',
          default: 'left'
        },
        {
          param: 'fontsize',
          introduce: '字体大小',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'textcolor',
          introduce: '字体颜色',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>