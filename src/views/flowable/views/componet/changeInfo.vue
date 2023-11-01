<template>
  <el-dialog
    title="提交记录"
    append-to-body
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <div v-if="dialogVisible">
      <jvs-form :option="formOption" :formData="formData"></jvs-form>
    </div>
  </el-dialog>
</template>
<script>
import {queryChangeInfo} from '../../api/flowable'
import {getFlowableForm} from './api'
export default {
  name: 'change-info-form',
  data () {
    return {
      dialogVisible: false,
      data: {
        name: '',
        formType: '',
        id: '',
        viewJson: null
      },
      selectFormItems: [], // 表单里的下拉选择项
      formData: {},
      formOption: {
        submitBtn: false,
        emptyBtn: false,
        cancal: false,
        column: []
      },
    }
  },
  methods: {
    openDialog (info) {
      this.getFlowableFormHandle(info.formId)
      this.queryChangeInfoHandle(info.dataId, info.dataVersion ? info.dataVersion : 1, info)
    },
    handleClose () {
      this.dialogVisible = false
      this.formData = {}
    },
    queryChangeInfoHandle (dataId, version) {
      queryChangeInfo(dataId, version).then(res => {
        if(res.data && res.data.code == 0) {
          this.$set(this, 'formData', res.data.data)
          this.dialogVisible = true
          this.$forceUpdate()
        }
      })
    },
    // 获取表单结构
    getFlowableFormHandle (id) {
      getFlowableForm(id).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.viewJson) {
            let view = JSON.parse(res.data.data.viewJson)
            this.data.viewJson = view
            this.initForm(this.data.viewJson)
          }
        }
      })
    },
    initForm (formDesign) {
      this.getSelectItem(formDesign.formdata)
      this.getFormColumn(formDesign)
    },
    // 获取select项，表单值为数组
    getSelectItem (list) {
      let temp = []
      for(let i in list) {
        for(let j in list[i].forms) {
          if(list[i].forms[j].type == 'select') {
            temp.push(list[i].forms[j].prop)
          }
        }
      }
      this.selectFormItems = temp
    },
    // 表单配置
    getFormColumn (formDesign) {
      if(formDesign.formdata && formDesign.formdata.length > 0) {
        let forms = formDesign.formdata[0].forms
        this.formOption = this.formatFormOption(forms, formDesign.formdata[0].formsetting)
        this.formOption.disabled =  true
      }else{
        // console.log(formDesign)
      }
    },
    // 格式化表单配置项
    formatFormOption (forms, formsetting) {
      let btlist = []
      let temp = {
        column: JSON.parse(JSON.stringify(forms)),
        btnSetting: btlist,
        size: formsetting.formsize,
        formAlign: formsetting.labelposition,
        labelWidth: formsetting.labelwidth + 'px',
        fullscreen: formsetting.fullscreen,
        submitBtn: false,
        emptyBtn: false,
        submitLoading: false,
        btnHide: true,
        cancal: false
      }
      for(let c in temp.column) {
        if(temp.column[c].type == 'SWITCH') {
          temp.column[c].type = 'switch'
        }
      }
      if(temp.column && temp.column.length > 0) {
        for(let i in temp.column) {
          temp.column[i].disabled = true
        }
      }
      return temp
    },
  },
}
</script>