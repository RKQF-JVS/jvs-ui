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
                  label: "选项卡",
                  prop: "demo1",
                  type: "tab",
                  activeName: "1",
                  dicData: [
                    {
                      label: "选项一",
                      name: "1"
                    },
                    {
                      label: "选项二",
                      name: "2"
                    }
                  ]
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
  name: 'Tab',
  data(){
    return {
      detail: {
        title: 'tab 选项卡',
        info: '分隔内容上有关联但属于不同类别的数据集合',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "选项卡",
            prop: "demo1",
            type: "tab",
            activeName: "1",
            dicData: [
              {
                label: "选项一",
                name: "1"
              },
              {
                label: "选项二",
                name: "2"
              }
            ]
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
          param: 'dicData',
          introduce: '选项卡配置数据 {label: "", name: ""}',
          type: 'array',
          value: '-',
          default: '-'
        }
      ]
    }
  }
}
</script>