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
            <jvs-form :option="formOption"></jvs-form>

            formOption: {
              column: [
                {
                  label: "链接",
                  prop: "demo",
                  type: "link",
                  text: "百度",
                  openType: "_blank"
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
  name: 'Link',
  data(){
    return {
      detail: {
        title: 'link 链接',
        info: '文字显示链接地址进行跳转',
      },
      formData: {
        demo: "https://www.baidu.com/"
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "链接",
            prop: "demo",
            type: "link",
            text: "百度",
            openType: "_blank"
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
          param: 'openType',
          introduce: '打开方式',
          type: 'string',
          value: '_self  |  _blank',
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