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
                  label: "一个职位",
                  prop: "demo1",
                  type: "post"
                },
                {
                  label: "多个职位",
                  prop: "demo2",
                  type: "post",
                  multiple: true
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
  name: 'postCom',
  data(){
    return {
      detail: {
        title: 'post 岗位选择',
        info: '选择单个或多个岗位, 返回岗位id',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "一个职位",
            prop: "demo1",
            type: "post"
          },
          {
            label: "多个职位",
            prop: "demo2",
            type: "post",
            multiple: true
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
          default: 'true'
        }
      ]
    }
  }
}
</script>