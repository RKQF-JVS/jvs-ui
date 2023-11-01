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
                  label: "日期",
                  prop: "demo1",
                  type: "datePicker",
                  datetype: "date"
                },
                {
                  label: "周",
                  prop: "demo2",
                  type: "datePicker",
                  datetype: "week"
                },
                {
                  label: "月",
                  prop: "demo3",
                  type: "datePicker",
                  datetype: "month"
                },
                {
                  label: "年",
                  prop: "demo4",
                  type: "datePicker",
                  datetype: "year"
                },
                {
                  label: "多个日期",
                  prop: "demo5",
                  type: "datePicker",
                  datetype: "dates"
                },
                {
                  label: "日期范围",
                  prop: "demo6",
                  type: "datePicker",
                  datetype: "daterange"
                },
                {
                  label: "月份范围",
                  prop: "demo7",
                  type: "datePicker",
                  datetype: "monthrange"
                },
                {
                  label: "日期时间",
                  prop: "demo8",
                  type: "datePicker",
                  datetype: "datetime"
                },
                {
                  label: "日期时间范围",
                  prop: "demo9",
                  type: "datePicker",
                  datetype: "datetimerange"
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
      <jvs-table pageheadertitle="格式说明" :option="dateTypeOption" :data="typeData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption} from '../../attr'
export default {
  name: 'DatePicker',
  data(){
    return {
      detail: {
        title: 'datePicker 日期选择器',
        info: '用于选择或输入日期',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "日期",
            prop: "demo1",
            type: "datePicker",
            datetype: "date"
          },
          {
            label: "周",
            prop: "demo2",
            type: "datePicker",
            datetype: "week"
          },
          {
            label: "月",
            prop: "demo3",
            type: "datePicker",
            datetype: "month"
          },
          {
            label: "年",
            prop: "demo4",
            type: "datePicker",
            datetype: "year"
          },
          {
            label: "多个日期",
            prop: "demo5",
            type: "datePicker",
            datetype: "dates"
          },
          {
            label: "日期范围",
            prop: "demo6",
            type: "datePicker",
            datetype: "daterange"
          },
          {
            label: "月份范围",
            prop: "demo7",
            type: "datePicker",
            datetype: "monthrange"
          },
          {
            label: "日期时间",
            prop: "demo8",
            type: "datePicker",
            datetype: "datetime"
          },
          {
            label: "日期时间范围",
            prop: "demo9",
            type: "datePicker",
            datetype: "datetimerange"
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
          param: 'datetype',
          introduce: '格式类型',
          type: 'string',
          value: '-',
          default: '-'
        },
      ],
      dateTypeOption: {
        addBtn: false,
        menu: false,
        hideTop: true,
        column: [
          {
            label: "值",
            prop: "val"
          },
          {
            label: "格式",
            prop: "format"
          },
          {
            label: "注释",
            prop: "info"
          }
        ]
      },
      typeData: [
        {val: 'date', format: 'yyyy-MM-dd', info: '单个日期'},
        {val: 'dates', format: 'yyyy-MM-dd', info: '多个日期'},
        {val: 'daterange', format: 'yyyy-MM-dd', info: '日期范围'},
        {val: 'week', format: 'yyyy-MM-dd', info: 'yyyy 第 WW 周'},
        {val: 'month', format: 'yyyy-MM', info: '单月'},
        {val: 'monthrange', format: 'yyyy-MM', info: '月份范围'},
        {val: 'year', format: 'yyyy', info: '单年'},
        {val: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', info: '单个日期时间'},
        {val: 'datetimerange', format: 'yyyy-MM-dd HH:mm:ss', info: '日期时间范围'},
      ]
    }
  }
}
</script>