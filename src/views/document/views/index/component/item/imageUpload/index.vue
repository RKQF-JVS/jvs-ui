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
                  label: "上传图片",
                  prop: "demo1",
                  type: "imageUpload",
                  action: "",
                  fileList: []
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
  name: 'imageUpload',
  data(){
    return {
      detail: {
        title: 'ImageUpload 上传',
        info: '上传图片',
      },
      formOption: {
        btnHide: true,
        column: [
          {
            label: "上传图片",
            prop: "demo1",
            type: "imageUpload",
            action: "",
            fileList: []
          }
        ]
      },
      option: paramOption,
      tableData: [
        {
          param: 'action',
          introduce: '必选参数，上传的地址',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'multipleUpload',
          introduce: '是否支持多选文件',
          type: 'boolean',
          value: '-',
          default: '-'
        },
        {
          param: 'limit',
          introduce: '最大允许上传个数',
          type: 'number',
          value: '-',
          default: '-'
        },
        {
          param: 'headers',
          introduce: '设置上传的请求头部',
          type: 'object',
          value: '-',
          default: '-'
        },
        {
          param: 'fileList',
          introduce: '上传的文件列表, 接口需返回的文件参数 {originalFileName: "源文件名称", fileLink: "文件地址", fileName: "生成文件名称"}',
          type: 'array',
          value: '-',
          default: '-'
        },
        // {
        //   param: 'handleSuccess',
        //   introduce: '文件上传成功时的钩子',
        //   type: 'function(response, file, fileList)',
        //   value: '-',
        //   default: '-'
        // },
        // {
        //   param: 'handleError',
        //   introduce: '文件上传失败时的钩子',
        //   type: 'function(err, file, fileList)',
        //   value: '-',
        //   default: '-'
        // },
        // {
        //   param: 'handleRemove',
        //   introduce: '文件列表移除文件时的钩子',
        //   type: 'function(file, fileList)',
        //   value: '-',
        //   default: '-'
        // }
      ]
    }
  }
}
</script>