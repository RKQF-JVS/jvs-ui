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
                  label: "自定义选择",
                  prop: "demo1",
                  type: "datasource"
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
      <jvs-table pageheadertitle="请求参数" :option="option" :data="requestTable"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption, requestData} from '../../attr'
export default {
  name: 'DatasourceForm',
  data(){
    return {
      detail: {
        title: 'datasource 自定义选择',
        info: '自定义选择数据表中的数据',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "自定义选择",
            prop: "demo1",
            type: "datasource"
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
          param: 'disabled',
          introduce: '禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'multiple',
          introduce: '是否多选',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'sourceType',
          introduce: '数据来源',
          type: 'string',
          value: 'api | database',
          default: '-'
        },
        {
          param: 'databaseName',
          introduce: '数据库名，sourceType=database时设置',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'tableName',
          introduce: '数据表名，sourceType=database时设置',
          type: 'string',
          value: 'left | center | right',
          default: '-'
        },
        {
          param: 'infoColumnFields',
          introduce: '展示信息，sourceType=database时设置',
          type: 'array',
          value: '[{dataType: "字段类型", columnComment: "注释，用于显示label", fieldName: "字段名，对应prop"}]',
          default: '-'
        },
        {
          param: 'queryColumnFields',
          introduce: '查询条件，sourceType=database时设置',
          type: 'array',
          value: '[{dataType: "字段类型", columnComment: "注释，用于显示label", fieldName: "字段名，对应prop"}]',
          default: '-'
        },
        {
          param: 'queryProp',
          introduce: '查询条件，sourceType=api时设置',
          type: 'array',
          value: '[ {label: "", value: ""} ]',
          default: '-'
        },
        {
          param: 'infoColumn',
          introduce: '显示字段，sourceType=api时设置',
          type: 'array',
          value: '[ {label: "", value: ""} ]',
          default: '-'
        },
        {
          param: 'apiHttp',
          introduce: '接口配置，sourceType=api时设置',
          type: 'object',
          value: '详情如下-请求配置',
          default: '-'
        },
        {
          param: 'showProp',
          introduce: '显示字段',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'sendProp',
          introduce: '提交字段',
          type: 'string',
          value: '-',
          default: '-'
        }
      ],
      requestTable: requestData
    }
  }
}
</script>