<template>
  <!-- 挂载表单 -->
  <div class="form-show-info">
    <!-- 无权限 -->
    <div v-if="!permission" class="permission">
      <img src="@/const/img/permission.png" alt=""/>
    </div>
    <div v-if="data.viewJson && permission">
      <jvs-form v-if="(formType == 'normalForm' || formType == 'detailForm') && showForm" :option="formOption" :formData="formData" @submit="formSubmit">
        <!-- 自定义按钮 -->
<!--        <template slot="formButton" v-if="formOption.flag">-->
<!--          <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>-->
<!--        </template>-->
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
          <template slot="formButton" v-if="basicOption.flag">
            <jvs-button size="mini" v-for="(item, index) in basicOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
          </template>
        </jvs-form>
        <jvs-form :option="formOption" @submit="formSubmit" :formData="formData.form" @formChange="formChange">
          <!-- 自定义按钮 -->
          <template slot="formButton" v-if="formOption.flag">
            <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
          </template>
        </jvs-form>
      </div>
    </div>
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
import detailForm from '../../components/basic-design/detailForm'
import normalForm from '../../components/basic-design/normalForm'
import levelForm from '../../components/basic-design/levelForm'
import stepForm from '../../components/basic-design/stepForm'
import {getShowForm} from '../../api/form'
import {sendRequire} from '../../api/list'
import {getDetail, getFormInfo} from '../../api/formlist'
import { getFlowableForm, startProcess, completeProcess, zhipaiProcess, weipaiProcess } from "@/api/flowable";
import userForm from '../../plugin/userForm'
import {sendMyRequire, getKeyValue} from '../../api/list'
export default {
  name: 'form-show-info',
  components: {detailForm, normalForm, levelForm, stepForm, userForm},
  data(){
    return {
      permission: true,
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
      labelValue: null,
      showForm: false,
      pathQuery: {}
    }
  },
  async created () {
    await this.getKeyValueHandle()
    // 挂载的表单
    if(this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id
      this.pathQuery = JSON.parse(JSON.stringify(this.$route.query))
      delete this.pathQuery['name']
      if (this.$route.query.isDeploy === 'true') {
        getFormInfo(this.id).then(res => {
          if(res.data.code == 0) {
            this.data = JSON.parse(JSON.stringify(res.data.data))
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
              this.initForm(this.data.viewJson)
            }
          }
        }).catch( e => {
          this.permission = false
          // this.$router.push({
          //   path: "/404",
          //   query: {
          //     msg: e
          //   }
          // });
        })
      } else {
        getDetail(this.id).then(res => {
          if(res.data.code == 0) {
            this.data = JSON.parse(JSON.stringify(res.data.data))
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
              this.initForm(this.data.viewJson)
            }
            this.$message.warning('该设计未发布')
          }
        }).catch( e => {
          this.permission = false
          // this.$router.push({
          //   path: "/404",
          //   query: {
          //     msg: e
          //   }
          // });
        })
      }
    }
    // 流程表单
    if(this.$route.query) {
      if(this.$route.query.modelId) {
        this.flowableInfo.modelId = this.$route.query.modelId
      }
      if(this.$route.query.actId) {
        this.flowableInfo.actId = this.$route.query.actId
      }
      if(this.$route.query.taskId) {
        this.flowableInfo.taskId = this.$route.query.taskId
      }
      if(this.$route.query.assignId) {
        this.flowableInfo.assignId = this.$route.query.assignId
      }
      if(this.flowableInfo.modelId && this.flowableInfo.actId) {
        this.getFlowableFormHandle()
      }
    }
  },
  methods: {
    initForm (formDesign) {
      this.getSelectItem(formDesign.formdata)
      this.formType = formDesign.formType
      this.getFormColumn(formDesign.formType, formDesign)
      // 表单回显
      if(['normalForm', 'detailForm', 'flowable'].indexOf(formDesign.formType) > -1) {
        if(formDesign.formdata[0].formsetting && formDesign.formdata[0].formsetting.dataEchoRequest) {
          let tp = null
          tp = JSON.parse(JSON.stringify(formDesign.formdata[0].formsetting.dataEchoRequest))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          if(tp && tp.url) {
            this.showForm = false
            let tpa = {}
            if(tp.parameters) {
              tpa = JSON.parse(JSON.stringify(tp.parameters))
            }
            tpa = Object.assign(tpa, this.pathQuery)
            sendMyRequire(tp, tpa).then(res => {
              if(res.data.code == 0) {
                this.formData = res.data.data
                this.showForm = true
              }else{
                this.showForm = true
              }
            }).catch(e => {
              this.showForm = true
            })
          }else{
            this.showForm = true
          }
        }else{
          this.showForm = true
        }
      }
      // 多级表单
      if(formDesign.formType == 'levelForm'){
        let tempData = {}
        for(let i in formDesign.formdata) {
          let itemUrl = ''
          let itemObj = {}
          if(formDesign.formdata[i].formsetting.echoUrl) {
            itemUrl = formDesign.formdata[i].formsetting.echoUrl
          }
          if(itemUrl) {
            this.getItemForm(itemUrl, row, itemObj)
          }
          tempData[formDesign.column[i].name] = itemObj
        }
        this.formData = tempData
      }
      // // 详情  流程表单
      // if(formDesign.formType == 'detailForm' || formDesign.formType == 'flowable'){
      //   if(formDesign.formdata && formDesign.formdata[0].formsetting && formDesign.formdata[0].formsetting.echoUrl) {
      //     sendRequire(formDesign.formdata[0].formsetting.echoUrl, 'get', row).then(res => {
      //       if(res.data.code == 0) {
      //         this.formData = res.data.data
      //       }
      //     })
      //   }
      // }
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
      formsetting.submitBtn = false
      formsetting.emptyBtn = false
      const arr = formsetting.btnSetting.filter(item => {
        if (item.name === '提交' && item.buttonType !== 'custom') {
          formsetting.submitBtn = item.name === '提交' && item.buttonType === 'submit'
        }
        if (item.name === '重置' && item.buttonType !== 'custom') {
          formsetting.emptyBtn = item.name === '重置' && item.buttonType === 'empty'
        }
        return (item.buttonType === 'custom')
      })
      // if (formsetting.emptyBtn !== false)
      let temp = {
        column: JSON.parse(JSON.stringify(forms)),
        // btnSetting: formsetting.btnSetting,
        btnSetting: arr,
        size: formsetting.formsize,
        formAlign: formsetting.labelposition,
        labelWidth: formsetting.labelwidth + 'px',
        fullscreen: formsetting.fullscreen,
        flag: formsetting.flag,
        submitBtn: formsetting.submitBtn,
        emptyBtn: formsetting.emptyBtn
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
      const designId = this.$route.query.id
      const dataModelId = this.$route.query.dataModelId
      let form = null // 表单数据
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
        const http = {
          httpMethod: "POST",
          requestContentType: "application/json",
          responseContentType: "JSON",
          url: dataModelId ? `/mgr/jvs-design//dynamic/data/save/${dataModelId}` : '/mgr/jvs-design//dynamic/data/save',
          headers: {
            'designId': designId,
            'operator': encodeURI('提交')
          }
        }
        if(this.data.viewJson.formdata[0].formsetting) {
          // tp = JSON.parse(JSON.stringify(this.data.viewJson.formdata[0].formsetting.dataSubmissionRequest))
          tp = JSON.parse(JSON.stringify(http))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
        }
        // 普通表单
        if(this.formType == 'normalForm') {
          form = formsdata
        }
        // 多级表单
        else{
          form = formsdata.form
        }
        if(tp && tp.url) {
          let tob = JSON.parse(JSON.stringify(form))
          tob = Object.assign(tob, tp.parameters ? tp.parameters : {})
          sendMyRequire(tp, tob).then(res => {
            if(res.data.code == 0) {
              this.$message.success(res.data.msg)
            }
          })
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
        let tp = null
        tp = JSON.parse(JSON.stringify(row))
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          const designId = this.$route.query.id
          const dataModelId = this.$route.query.dataModelId
          tp.headers = {
            'designId': designId,
            'operator': encodeURI('提交')
          }
          let tob = JSON.parse(JSON.stringify(this.formData))
          tob = Object.assign(tob, tp.parameters ? tp.parameters : {})
          sendMyRequire(tp, tob).then(res => {
            if(res.data.code == 0) {
              this.$message.success(res.data.msg)
            }
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
    // 获取所有label value 对应值
    async getKeyValueHandle () {
      await getKeyValue().then(res => {
        if(res.data.code == 0) {
          this.labelValue = res.data.data
          this.$store.state.labelValue = this.labelValue
        }
      })
    },
  },
  watch: {
    $route (to, from) {
      if(to.fullPath != from.fullPath) {
        location.reload()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ass-box-form{

}
.form-show-info{
  background: #fff;
  height: 100%;
  padding: 4vh;
  overflow-y: auto;
  box-sizing: border-box;
  .permission{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100vw;
    img {
      height: 40vh;
    }
  }
}
</style>
