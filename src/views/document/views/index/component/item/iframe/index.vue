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
                  label: "其他页面",
                  prop: "demo1",
                  type: "iframe",
                  iframeurl: "https://www.baidu.com",
                  iframeheight: "300px"
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
  name: 'iframe',
  data(){
    return {
      detail: {
        title: 'iframe 嵌入页面',
        info: '通过iframe引入其他页面',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "其他页面",
            prop: "demo1",
            type: "iframe",
            iframeurl: "https://www.baidu.com",
            iframeheight: "300px"
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
          param: 'iframeurl',
          introduce: '页面地址',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'iframeheight',
          introduce: '页面高度',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>