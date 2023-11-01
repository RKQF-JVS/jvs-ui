<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <div class="demo-item">
        <h5>典型表单</h5>
        <span>包括各种表单项，比如输入框、选择器、开关、单选框、多选框等</span>
        <br />
        <span>rules设置校验规则,详情表单项属性配置及参考element校验</span>
        <div class="show">
          <jvs-form :option="formOption1" :formData="formData"></jvs-form>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-form :option="formOption" :formData="formData"></jvs-form>

            formData: {
              checkbox: []
            },
            formOption: {
              column: [
                {
                  label: "文本框",
                  prop: "inut",
                  rules: [
                    { required: true, message: "请输入文本框", trigger: "blur" },
                  ]
                },
                {
                  label: "下拉选择",
                  prop: "select",
                  type: "select",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ]
                },
                {
                  label: "单选框",
                  prop: "radio",
                  type: "radio",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ]
                },
                {
                  label: "多选框",
                  prop: "checkbox",
                  type: "checkbox",
                  dicData: [
                    {label: "选项一", value: "1"},
                    {label: "选项二", value: "2"}
                  ]
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>行内表单</h5>
        <span>当垂直方向空间受限且表单较简单时，可以在一行内放置表单</span>
        <br/>
        <span>inline为true时单项保持一行内, 调节span设置一行内的单项个数, isSearch为true时按钮栏随单项流动</span>
        <div class="show">
          <jvs-form :option="formOption2" :formData="formData"></jvs-form>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-form :option="formOption" :formData="formData"></jvs-form>

            formData: {
              checkbox: []
            },
            formOption: {
              column: [
                inline: true,
                isSearch: true,
                column: [
                  {
                    label: "文本框",
                    prop: "inut",
                    span: 8
                  },
                  {
                    label: "下拉选择",
                    prop: "select",
                    type: "select",
                    dicData: [
                      {label: "选项一", value: "1"},
                      {label: "选项二", value: "2"}
                    ],
                    span: 8
                  },
                ]
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>表单插槽</h5>
        <span>自定义表单部分位置内容</span>
        <div class="show">
          <div class="show">
            <jvs-form :option="formOption3" :formData="formData">
              <template slot="formTop">
                <span>顶部插槽 formTop</span>
              </template>
              <template slot="inputForm">
                <el-input size="mini" v-model="formData.input"></el-input>
              </template>
              <template slot="formButton">
                <jvs-button>底部插槽 formButton</jvs-button>
              </template>
            </jvs-form>
          </div>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-form :option="formOption" :formData="formData">
              <template slot="formTop">
                <span>顶部插槽 formTop</span>
              </template>
              <template slot="inputForm">
                <el-input size="mini" v-model="formData.input"></el-input>
              </template>
              <template slot="formButton">
                <jvs-button>底部插槽 formButton</jvs-button>
              </template>
            </jvs-form>

            formData: {
              input: ""
            },
            formOption: {
              column: [
                column: [
                  {
                    label: "自定义插槽",
                    prop: "input",
                    formSlot: true
                  }
                ]
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="表单属性" :option="param" :data="paramData"></jvs-table>
      <jvs-table pageheadertitle="表单配置" :option="param" :data="optionParam"></jvs-table>
      <jvs-table pageheadertitle="表单项通用设置" :option="param" :data="allhaveParam"></jvs-table>
      <jvs-table pageheadertitle="事件说明" :option="event" :data="eventData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {form_column, param_data, form_option, event_data} from './form'
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'Form',
  data () {
    return {
      detail: {
        title: 'Form 表单',
        info: '由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据',
        useInfo: '<jvs-form></jvs-form>'
      },
      formData: {
        checkbox: []
      },
      formOption1: {
        column: form_column
      },
      formOption2: {
        inline: true,
        isSearch: true,
        column: [
          {
            label: "文本框",
            prop: "inut",
            span: 8
          },
          {
            label: "下拉选择",
            prop: "select",
            type: "select",
            dicData: [
              {label: "选项一", value: "1"},
              {label: "选项二", value: "2"}
            ],
            span: 8
          },
        ]
      },
      formOption3: {
        column: [
          {
            label: "自定义插槽",
            prop: "input",
            formSlot: true
          }
        ]
      },
      param: paramOption,
      paramData: param_data,
      optionParam: form_option,
      event: eventOption,
      eventData: event_data,
      allhaveParam: [
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
          param: 'display',
          introduce: '是否显示',
          type: 'boolean',
          value: '-',
          default: 'true'
        },
        {
          param: 'formSlot',
          introduce: '是否自定义',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'defaultValue',
          introduce: '默认值',
          type: '-',
          value: '-',
          default: '-'
        },
        {
          param: 'linkbind',
          introduce: '控制值，父级组件对应的表单值,支持英文逗号隔开的数字字符',
          type: 'number | string | array',
          value: '-',
          default: '-'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>