<template>
  <!-- 挂载表单 -->
  <div class="form-show-info-dialog">
    <el-dialog
      :title="title"
      append-to-body
      v-if="childFormVisible"
      :visible.sync="childFormVisible"
      :before-close="childFormClose"
      :fullscreen="(formType == 'normalForm' || formType == 'detailForm') ? formOption.fullscreen: false"
      :class="{'form-fullscreen-dialog':(formType == 'normalForm' || formType == 'detailForm') ? (formOption.fullscreen ? hasTabItem(formOption.fullscreen) : formOption.fullscreen): true}"
    >
      <div v-if="data.viewJson">
        <jvs-form v-if="formType == 'normalForm' || formType == 'detailForm'" :option="formOption" :formData="formData" @submit="formSubmit">
          <!-- 自定义按钮 -->
          <template slot="formButton">
            <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
          </template>
        </jvs-form>
        <jvs-form-level v-if="formType == 'multiLevelForm'" :option="formOption" :formData="formData" @submit="formSubmit">
        </jvs-form-level>
        <!-- 流程表单 -->
        <div v-if="formType == 'flowable'">
          <jvs-form :option="basicOption" @submit="formSubmit" :formData="formData.basic" @formChange="formChange">
            <!-- 自定义按钮 -->
            <template slot="formButton">
              <jvs-button size="mini" v-for="(item, index) in basicOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
            </template>
          </jvs-form>
          <jvs-form :option="formOption" @submit="formSubmit" :formData="formData.form" @formChange="formChange">
            <!-- 自定义按钮 -->
            <template slot="formButton">
              <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
            </template>
          </jvs-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="assType == 'zhipai' ? '指派' : '委派'"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <div class="ass-box-form">
        <userForm :form="userForm" prop="userId" :enableinput="false" />
      </div>
      <el-row style="display:flex;justify-content:center;align-items:center;margin-top:20px;">
        <jvs-button size="mini" type="primary" @click="assSubmit">提交</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {sendRequire, sendMyRequire} from '@/api/newDesign'
import {getDetail} from '@/api/newDesign'
import { getFlowableForm, startProcess, completeProcess, zhipaiProcess, weipaiProcess } from "@/api/flowable";
import userForm from '@/components/basic-assembly/userForm'
export default {
  name: 'form-show-info',
  components: {userForm},
  props: {
    title: {
      type: String
    }
  },
  data(){
    return {
      name: '',
      data: {
        name: '',
        formType: '',
        id: '',
        viewJson: null
      },
      // 表单
      formType: '',
      formData: {},
      selectFormItems: [], // 表单里的下拉选择项
      basicOption: {
        disabled: true,
        btnHide: true,
        column: []
      },
      formOption: {
        submitBtn: false,
        emptyBtn: false,
        column: []
      },
      flowableInfo: {},
      isFlowable: false,
      processName: '',
      submtData: {},
      userForm: {
        userId: ''
      }, // 用户表单
      assType: '',
      dialogVisible: false,
      childFormVisible: false, // 弹框显示表单
    }
  },
  created () {},
  methods: {
    async getDesignInfoByNameType (obj, initData) {
      await getDetail(obj).then(res => {
        if(res.data.code == 0) {
          this.data = res.data.data
          if(res.data.data.viewJson) {
            this.data.viewJson = JSON.parse(res.data.data.viewJson)
            this.initForm(this.data.viewJson, initData)
          }
        }
      })
    },
    initForm (formDesign, initData) {
      this.getSelectItem(formDesign.formdata)
      this.formType = formDesign.formType
      this.getFormColumn(formDesign.formType, formDesign)
      // 普通表单
      if(['normalForm', 'detailForm', 'flowable'].indexOf(formDesign.formType) > -1) {
        if(formDesign.formdata[0].formsetting && formDesign.formdata[0].formsetting.dataEchoRequest) {
          let tp = JSON.parse(JSON.stringify(formDesign.formdata[0].formsetting.dataEchoRequest))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          if(tp && tp.url) {
            sendMyRequire(tp, initData).then(res => {
              if(res.data.code == 0) {
                this.formData = res.data.data
              }
            })
          }else{
            if(initData) {
              this.formData = JSON.parse(JSON.stringify(initData))
            }
          }
        }
      }
    },
    // 表单配置
    getFormColumn (type, formDesign) {
      if(formDesign.formdata && formDesign.formdata.length > 0) {
        if(type == 'normalForm' || type == 'detailForm') {
          this.formOption = this.formatFormOption(type, formDesign.formdata[0].forms, formDesign.formdata[0].formsetting)
        }else if(type == 'flowable'){
          this.basicOption = this.formatFormOption('detailForm', formDesign.formdata[0].forms, formDesign.formdata[0].formsetting)
          this.formOption = this.formatFormOption(type, formDesign.formdata[1].forms, formDesign.formdata[1].formsetting)
        }else{
          let ct = []
          for(let i in formDesign.column) {
            let obj = {
              defaultData: formDesign.column[i].defaultData,
              formOption: {},
              label: formDesign.column[i].label,
              name: formDesign.column[i].name,
              show: formDesign.column[i].show || true
            }
            obj.formOption = {
              btnSetting: formDesign.formdata[i].formsetting.btnSetting,
              size: formDesign.formdata[i].formsetting.formsize,
              formAlign: formDesign.formdata[i].formsetting.labelposition,
              labelWidth: formDesign.formdata[i].formsetting.labelwidth + '',
              column: formDesign.formdata[i].forms,
            }
            ct.push(obj)
          }
          this.formOption = {
            type: 'card',
            column: ct,
            formdata: formDesign.formdata
          }
        }
      }else{
        console.log(formDesign)
      }
    },
    // 格式化表单配置项
    formatFormOption (type, forms, formsetting) {
      let temp = {
        column: JSON.parse(JSON.stringify(forms)),
        btnSetting: formsetting.btnSetting,
        size: formsetting.formsize,
        formAlign: formsetting.labelposition,
        labelWidth: formsetting.labelwidth + 'px',
        fullscreen: formsetting.fullscreen
      }
      if(type == 'detailForm') {
        temp.disabled = true
        temp.btnHide = true
      }else if(type == 'flowable'){
        temp.submitBtn = false
        temp.emptyBtn =  false
        temp.cancal = false
      }else{
        temp.disabled = false
        temp.btnHide = false
        temp.cancal = false
      }
      return temp
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
    // 表单提交
    formSubmit (formsdata) {
      let form = null // 表单数据
      let msg = ''
      // 工作流表单提交
      if(this.isFlowable) {
        // 启动流程
        if(this.formType == 'normalForm') {
          let obj = {
            params: formsdata,
            modelId: this.flowableInfo.modelId
          }
          startProcess(obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success('流程启动成功')
            }
          })
        }
      }else{
        let tp = null
        // 普通表单
        if(this.formType == 'normalForm') {
          form = formsdata
          if(this.data.viewJson.formdata[0].formsetting && this.data.viewJson.formdata[0].formsetting.dataSubmissionRequest) {
            tp = JSON.parse(JSON.stringify(this.data.viewJson.formdata[0].formsetting.dataSubmissionRequest))
          }
        }
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          sendMyRequire(tp, form).then(res => {
            if(res.data.code == 0) {
              if(msg) {
                this.$message.success(msg)
                this.$emit('submit', res.data.data ? res.data.data : form)
                this.childFormClose()
              }else{
                if(res.data.msg) {
                  this.$message.success(res.data.msg)
                  this.$emit('submit', res.data.data ? res.data.data : form)
                  this.childFormClose()
                }
              }
            }
          }).catch(e => {
            this.$emit('submit', false)
          })
        }else{
          this.$emit('submit', form)
          this.childFormClose()
        }
      }
    },
    // 自定义按钮事件
    slotbtnClickHandle (row, index) {
      // 流程提交
      if(this.isFlowable) {
        if(index < 3) {
          let obj = {
            params: this.submtData,
            remark: this.submtData.remark,
            result: row.url
          }
          completeProcess(this.flowableInfo.taskId, obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success(row.name + '成功')
            }
          })
        }else if(index > 2 && index < 6) {
          let obj = {
            params: this.submtData,
            remark: this.submtData.remark,
          }
          if(row.url == 'save') {
            saveProcess(obj).then(res => {
              if(res.data.code == 0) {
                this.$message.success('保存成功')
              }
            })
          }
          if(row.url == 'zhipai') {
            this.dialogVisible = true
            this.assType = "zhipai"
          }
          if(row.url == 'weipai') {
            this.dialogVisible = true
            this.assType = "weipai"
          }
        }
      }else{
        if(row.url) {
          sendRequire(row.url, 'post', this.formData).then(res => {
            this.getList()
          })
        }
      }
    },
    // 获取工作流表单
    getFlowableFormHandle () {
      let obj = {
        actId: this.flowableInfo.actId,
        modelId: this.flowableInfo.modelId
      }
      getFlowableForm(obj).then(res => {
        if(res.data.code == 0) {
          this.processName = res.data.data.name
          if(res.data.data.viewJson) {
            let view = JSON.parse(res.data.data.viewJson)
            this.data.viewJson = view
            this.initForm(this.data.viewJson)
          }
          if(res.data.data.type == 'flowable') {
            this.isFlowable = true
          }
        }
      })
    },
    // 表单change
    formChange (form) {
      this.submtData = form
    },
    // 关闭 指派 委派
    handleClose () {
      this.dialogVisible = false
      this.userForm = {
        userId: ''
      }
    },
    assSubmit () {
      if(this.assType == "zhipai") {
        zhipaiProcess(this.flowableInfo.taskId, this.userForm.userId).then(res => {
          if(res.data.code == 0) {
            this.$message.success('指派成功')
            this.handleClose()
          }
        })
      }else{
        weipaiProcess(this.flowableInfo.taskId, this.userForm.userId).then(res => {
          if(res.data.code == 0) {
            this.$message.success('委派成功')
            this.handleClose()
          }
        })
      }
    },
    async childFormInit (code, row) {
      await this.getDesignInfoByNameType({type: 'normalForm', name: code}, row)
      this.childFormVisible = true
    },
    childFormClose () {
      this.childFormVisible = false
      this.formData = {}
    },
    // 判断是否有tab组件
    hasTabItem (bool) {
      let result = bool
      if(this.formOption && this.formOption.column) {
        for(let i in this.formOption.column) {
          if(this.formOption.column[i].type == 'tab' && this.formOption.column[i].dicData && this.formOption.column[i].dicData.length > 4) {
            result = false
          }
          if(this.formOption.column[i].type == 'tableForm' && !this.formOption.column[i].editable) {
            result = false
          }
        }
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.ass-box-form{

}
</style>