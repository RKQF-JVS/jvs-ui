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
                  label: "图片",
                  prop: "demo",
                  type: "image"
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
      <jvs-table pageheadertitle="值参数, 本身为数组,包含名称和地址属性" :option="option" :data="attrData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption} from '../../attr'
export default {
  name: 'ImageCom',
  data(){
    return {
      detail: {
        title: 'image 图片',
        info: '图片容器，保留原生img的特性',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "图片",
            prop: "demo",
            type: "image"
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
          param: 'fit',
          introduce: '确定图片如何适应容器框',
          type: 'string',
          value: 'fill | contain | cover | none | scale-down',
          default: '-'
        },
      ],
      attrData: [
        {
          param: 'name',
          introduce: '图片名称',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'url',
          introduce: '图片地址',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>