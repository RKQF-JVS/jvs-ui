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
                  label: "文件",
                  prop: "demo1",
                  type: "file"
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
  name: 'FileCom',
  data(){
    return {
      detail: {
        title: 'file 文件列表',
        info: '文件显示,点击文字进行下载或预览',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "文件",
            prop: "demo1",
            type: "file"
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
      ],
      attrData: [
        {
          param: 'name',
          introduce: '文件名称',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'url',
          introduce: '文件地址',
          type: 'string',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>