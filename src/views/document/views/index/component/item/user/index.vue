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
                  label: "用户",
                  prop: "demo",
                  type: "user",
                  allowinput: false
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
  name: 'User',
  data(){
    return {
      detail: {
        title: 'user 用户选择',
        info: '选择单个或多个用户, 返回用户id',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "用户",
            prop: "demo",
            type: "user",
            allowinput: false
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
          param: 'multiple',
          introduce: '可否多选',
          type: 'boolean',
          value: '-',
          default: '-'
        },
        {
          param: 'allowinput',
          introduce: '是否允许输入文字',
          type: 'boolean',
          value: '-',
          default: 'true'
        },
        {
          param: 'defaultValue',
          introduce: '默认值, 单个或多个用户id',
          type: 'number | array',
          value: '-',
          default: '-'
        },
      ]
    }
  }
}
</script>