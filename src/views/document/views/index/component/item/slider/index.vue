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
                  label: "滑块",
                  prop: "demo1",
                  type: "slider"
                },
                {
                  label: "显示间断点",
                  prop: "demo2",
                  type: "slider",
                  showstops: true
                },
                {
                  label: "带有输入框",
                  prop: "demo3",
                  type: "slider",
                  showinput: true
                },
                {
                  label: "范围选择",
                  prop: "demo4",
                  type: "slider",
                  range: true,
                  min: 10,
                  max: 100
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
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'Slider',
  data(){
    return {
      detail: {
        title: 'slider 滑块',
        info: '通过拖动滑块在一个固定区间内进行选择',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "滑块",
            prop: "demo1",
            type: "slider"
          },
          {
            label: "显示间断点",
            prop: "demo2",
            type: "slider",
            showstops: true
          },
          {
            label: "带有输入框",
            prop: "demo3",
            type: "slider",
            showinput: true
          },
          {
            label: "范围选择",
            prop: "demo4",
            type: "slider",
            range: true,
            min: 10,
            max: 100
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
          param: 'min',
          introduce: '最小值',
          type: 'number',
          value: '-',
          default: '0'
        },
        {
          param: 'max',
          introduce: '最大值',
          type: 'number',
          value: '-',
          default: '100'
        },
        {
          param: 'step',
          introduce: '步长',
          type: 'number',
          value: '-',
          default: '1'
        },
        {
          param: 'range',
          introduce: '是否为范围选择',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'showstops',
          introduce: '是否显示间断点',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'showinput',
          introduce: '是否显示输入框，仅在非范围选择时有效',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'unit',
          introduce: '单位',
          type: 'string',
          value: '-',
          default: '-'
        }
      ],
      event: eventOption,
      eventData: [
        {
          name: 'click',
          introduce: '点击事件',
          param: '-',
        }
      ]
    }
  }
}
</script>