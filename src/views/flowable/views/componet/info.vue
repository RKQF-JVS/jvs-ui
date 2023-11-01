<template>
  <!-- 挂载表单 -->
  <div class="form-show-info">
    <div v-if="data.viewJson">
      <jvs-form :option="formOption" :formData="formData" @submit="formSubmit">
        <!-- 自定义按钮 -->
        <template slot="formButton">
          <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :loading="item.loading" :disabled="oprationDisable" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
        </template>
        <!-- 发起人自选 -->
        <template slot="approversForm">
          <div v-if="approverList && approverList.length > 0">
            <div v-for="item in approverList" :key="'approver-'+item.nodeId">
              <p><span style="color:#f56c6c;margin-right:4px;">*</span> {{item.nodeName}}</p> 
              <el-tag
                type="primary"
                v-for="(user, index) in item.approvers"
                size="mini"
                style="margin: 5px 10px 5px 0"
                @close="item.approvers.splice(index, 1)"
                closable
                :key="'choose-user'+index"
                >{{ user.name }}
              </el-tag>
              <el-button type="primary" size="mini" icon="el-icon-plus" style="margin: 0px" round @click="chooseUser(item)">选择人员</el-button>
            </div>
          </div>
        </template>
      </jvs-form>
    </div>
    <el-dialog
      title="指派"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <userForm :form="assUserForm" :prop="'userId'" :enableinput="false" :selectable="false" />
      <el-row style="display:flex;justify-content: center;align-items: center;margin-top: 20px;">
        <jvs-button size="mini" type="primary" @click="assignSubmit">提交</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>

    <!-- 选择人员 -->
    <userSelector ref="approversUserSelector" :selectable="true" :autoClose="true" :deptable="false" @submit="approverSubmit"></userSelector>

  </div>
</template>
<script>
import userSelector from '@/components/basic-assembly/userSelector'
import { getFlowableForm, startProcess, completeProcess, zhipaiProcess, weipaiProcess, saveProcess } from "./api";
import { getUserList } from './api'
import userForm from '@/components/basic-assembly/userForm'
import {sendMyRequire, getKeyValue} from '@/api/newDesign'
export default {
  name: 'form-show-info',
  components: {userForm, userSelector},
  props: {
    formUrl: {
      type: String
    },
    btnHide: {
      type: Boolean,
      default: false
    },
    defaultFormData: {
      type: Object
    },
    onlyView: {
      type: Boolean,
      default: false
    },
    approverList: {
      type: Array
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
        cancal: false,
        column: []
      },
      flowableInfo: {},
      isFlowable: false,
      processName: '',
      nodeDicData: [], // 节点列表信息
      userDicData: [], // 用户列表
      dialogVisible: false,
      assUserForm: {
        userId: ''
      },
      showAssignBool: false,
      count: 0,
      flowData: {},
      buttonList: null,
      btnSetList: [],
      formRemark: '', // 自带的审批意见
      dataTemp: null,
      taskNormalForm: false, // 是否为使用发起人表单的审核节点表单
      currentNode: {}, // 当前用户节点
      oprationDisable: false
    }
  },
  created () {
    // if(!this.$store.state.labelValue) {
    //   this.getKeyValueHandle()
    // }
    // // 获取用户列表
    // this.getUserListHandle()
    // 通过url获取参数
    let paramList = []
    if(this.formUrl.split('?').length > 1) {
      paramList = this.formUrl.split('?')[1].split('&')
      if(paramList.length > 0) {
        for(let i in paramList) {
          let tp = paramList[i].split('=')
          this.flowableInfo[tp[0]] = tp[1]
        }
        this.initPage()
      }
    }
  },
  methods: {
    async initPage () {
      // 判断是否属于工作流
      if(this.flowableInfo.flowId) {
        this.isFlowable = true
      }
      // 表单结构
      if(this.flowableInfo.id) {
        this.getFlowableFormHandle()
      }
    },
    initForm (formDesign) {
      this.getSelectItem(formDesign.formdata)
      this.formType = formDesign.formType || 'flowable'
      if(this.flowableInfo.taskId && formDesign.formType == 'normalForm') {
        this.taskNormalForm = true
      }
      this.getFormColumn(formDesign.formType, formDesign)
    },
    // 表单配置
    getFormColumn (type, formDesign) {
      if(formDesign.formdata && formDesign.formdata.length > 0) {
        let forms = formDesign.formdata[0].forms
        forms.push({
          label: '',
          prop: 'approvers',
          formSlot: true,
          hideLabel: true
        })
        this.formOption = this.formatFormOption(type, forms, formDesign.formdata[0].formsetting)
        this.formData = {}
        // 表单默认值初始化
        if(this.defaultFormData) {
          this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
        }
        if(this.onlyView) {
          this.formOption.disabled =  true
        }
        // console.log('表单实际回显赋值数据。。。。。。')
        // console.log(this.formData)
        // console.log(this.formOption)
      }else{
        // console.log(formDesign)
      }
    },
    // 格式化表单配置项
    formatFormOption (type, forms, formsetting) {
      let btlist = []
      for(let i in formsetting.btnSetting){
        if(["submit", "empty"].indexOf(formsetting.btnSetting[i].buttonType) == -1) {
          formsetting.btnSetting[i].loading = false
          btlist.push(formsetting.btnSetting[i])
        }
      }
      if(this.taskNormalForm) {
        // 需要在节点设计！！！！！！！！！！！！！！！！！！！！！！！！！！！
        btlist = [
          {name: '通过', url: 'ok', enable: true},
          {name: '拒绝', url: 'fail', enable: true},
          // {name: '驳回', url: 'reject', enable: true},
          // {name: '保存', url: 'save', enable: true},
          // {name: '指派', url: 'zhipai', enable: true},
          // {name: '委派', url: 'weipai', enable: true}
        ]
        for(let bi in btlist) {
          btlist[bi].loading = false
        }
      }
      let temp = {
        column: JSON.parse(JSON.stringify(forms)),
        btnSetting: btlist,
        size: formsetting.formsize,
        formAlign: formsetting.labelposition,
        labelWidth: formsetting.labelwidth + 'px',
        fullscreen: formsetting.fullscreen,
        submitBtn: this.taskNormalForm ? false : formsetting.submitBtn,
        emptyBtn: this.taskNormalForm ? false : formsetting.emptyBtn,
        flag: formsetting.falg,
        submitLoading: false,
      }
      for(let c in temp.column) {
        if(temp.column[c].type == 'SWITCH') {
          temp.column[c].type = 'switch'
        }
      }
      if(type == 'flowable'){
        temp.submitBtn = false
        temp.emptyBtn =  false
        temp.cancal = false
      }else{
        temp.disabled = false
        temp.btnHide = false
        temp.cancal = false
      }
      if(this.btnHide) {
        temp.btnHide = true
        // 不可编辑，组件只读
        if(temp.column && temp.column.length > 0) {
          for(let i in temp.column) {
            temp.column[i].disabled = true
          }
        }
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
      // console.log(this.isFlowable)
      // console.log(this.formType)
      // 工作流-开始节点(发起人)表单提交
      if(this.isFlowable) {
        // 启动流程
        if(this.formType == 'normalForm') {
          // 校验自选人不为空
          let emptyTips = []
          for(let i in this.approverList) {
            if(!this.approverList[i].approvers || this.approverList[i].approvers.length == 0) {
              emptyTips.push(this.approverList[i].nodeName)
            }
          }
          if(emptyTips.length > 0) {
            this.$message.warning(emptyTips.join('、') + '的选择人员不能为空')
            return false
          }
          let obj = {
            data: formsdata,
            id: this.flowableInfo.flowId,
          }
          if(this.approverList && this.approverList.length > 0) {
            obj.approvers = this.approverList
          }
          this.formOption.submitLoading = true
          startProcess(obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success('流程启动成功')
              this.$emit('close', true)
              this.formOption.submitLoading = false
            }
          }).catch(e => {
            this.formOption.submitLoading = false
          })
        }
      }
    },
    // 自定义按钮事件
    slotbtnClickHandle (row, index) {
      // 流程提交
      if(this.isFlowable) {
        if(['ok', 'fail', 'reject', 'rollback'].indexOf(row.url) > -1) {
          let tp = ""
          switch(row.url) {
            case "ok": tp = "PASS";break;
            case "fail": tp = "REFUSE";break;
            case "reject": tp = "BACK";break;
            default : ;break;
          }
          if(tp) {
            let obj = {
              id: this.flowableInfo.taskId,
              data: this.formData,
              nodeOperationType: tp,
              sign: false,
              nodeId: this.flowableInfo.nodeId
            }
            row.loading = true
            this.oprationDisable = true
            completeProcess(obj).then(res => {
              if(res.data.code == 0) {
                this.$message.success(row.name + '成功')
                row.loading = false
                this.oprationDisable = false
                this.$emit('close', true)
              }
            }).catch(e => {
              row.loading = false
              this.oprationDisable = false
            })
          }
        }else{
          let obj = {
            id: this.flowableInfo.taskId,
            data: this.formData,
          }
          return false
          if(row.type == 'save') {
            saveProcess(this.flowableInfo.taskId, obj).then(res => {
              if(res.data.code == 0) {
                this.$message.success('保存成功')
                this.$emit('close', true)
              }
            })
          }else if(row.type == 'assign') {
            this.dialogVisible = true
          }else if(row.type == 'weipai') {
            weipaiProcess(this.flowableInfo.taskId, this.userId).then(res => {
              if(res.data.code == 0) {
                this.$message.success('委派成功')
                this.$emit('close', true)
              }
            })
          }else{
            let tp = null
            tp = JSON.parse(JSON.stringify(row))
            if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
              tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
            }
            if(tp && tp.url) {
              sendMyRequire(tp, this.formData).then(res => {
                if(res.data.code == 0) {
                  this.$message.success(res.data.msg)
                }
              })
            }
          }
        }
      }else{
        let tp = null
        tp = JSON.parse(JSON.stringify(row))
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          sendMyRequire(tp, this.formData).then(res => {
            if(res.data.code == 0) {
              this.$message.success(res.data.msg)
            }
          })
        }
      }
    },
    // 获取工作流表单
    getFlowableFormHandle () {
      getFlowableForm(this.flowableInfo.id).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.viewJson) {
            let view = JSON.parse(res.data.data.viewJson)
            this.data.viewJson = view
            this.initForm(this.data.viewJson)
          }
        }
      })
    },
    // 关闭指派
    handleClose () {
      this.dialogVisible = false
      this.userForm = {
        userId: ''
      }
    },
    // 指派提交
    assignSubmit () {
      zhipaiProcess(this.flowableInfo.taskId, this.assUserForm.userId).then(res => {
        if(res.data.code == 0) {
          this.$message.success('指派成功')
          this.$emit('close', true)
        }
      })
    },
    // 获取用户列表
    async getUserListHandle () {
      await getUserList().then(res => {
        if(res.data.code == 0) {
          this.userDicData = res.data.data
        }
      })
    },
    // 获取所有label value 对应值
    getKeyValueHandle () {
      getKeyValue().then(res => {
        if(res.data.code == 0) {
          this.labelValue = res.data.data
          this.$store.state.labelValue = this.labelValue
        }
      })
    },
    // 发起人自选人
    chooseUser (item) {
      this.currentNode = JSON.parse(JSON.stringify(item))
      this.$refs.approversUserSelector.openDialog()
    },
    // 发起人自选提交
    approverSubmit (list) {
      for(let i in this.approverList) {
        if(this.approverList[i].nodeId == this.currentNode.nodeId) {
          this.$set(this.approverList[i], 'approvers', list.map((s) => {
            return { id: s.id, name: s.realName, type: s.type ? s.type : 'user' };
          }))
        }
      }
    }
  }
}
</script>
<style lang="scss">
.form-show-info{
  .jvs-form {
  }
}
</style>
