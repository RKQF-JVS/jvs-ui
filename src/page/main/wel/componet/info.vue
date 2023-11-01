<template>
  <!-- 挂载表单 -->
  <div class="form-show-info">
    <div v-if="data.viewJson">
      <jvs-form v-if="formType == 'normalForm' || formType == 'detailForm'" :option="formOption" :formData="formData" @submit="formSubmit">
        <!-- 自定义按钮 -->
        <template slot="formButton">
          <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
        </template>
        <template slot="nextAssignmentForm">
          <div v-if="showAssignBool">
            <jvs-form :option="nextAssignmentOption" :formData="nextAssignment"></jvs-form>
          </div>
        </template>
      </jvs-form>
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
            <jvs-button size="mini" v-for="(item, index) in btnSetList" :key="item.chineseName+'slotbtn'+index" v-if="item.enable" @click="slotbtnClickHandle(item, index)">{{item.chineseName}}</jvs-button>
          </template>
          <template slot="nextAssignmentForm">
            <div v-if="showAssignBool">
              <jvs-form :option="nextAssignmentOption" :formData="nextAssignment"></jvs-form>
            </div>
          </template>
        </jvs-form>
      </div>
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
  </div>
</template>
<script>
// import detailForm from '@/components/basic-design/detailForm'
// import normalForm from '@/components/basic-design/normalForm'
// import levelForm from '@/components/basic-design/levelForm'
// import stepForm from '@/components/basic-design/stepForm'
// import {getShowForm} from '@/api/form'
import MInput from '@/plugin/assembly/input'
import MTextarea from '@/plugin/assembly/textarea'
import MInputNumber from '@/plugin/assembly/inputNumber'
import MSelect from '@/plugin/assembly/select'
import MDatePicker from '@/plugin/assembly/datePicker'
import MRadio from '@/plugin/assembly/radio'
import MCheckbox from '@/plugin/assembly/checkbox'
import MImageUpload from '@/plugin/assembly/imageUpload'
import MFileUpload from '@/plugin/assembly/fileUpload'
import MInputReadOnly from '@/plugin/assembly/inputreadonly'
import MTextareaReadOnly from '@/plugin/assembly/textareareadonly'
import MFile from '@/plugin/assembly/file'
import MImage from '@/plugin/assembly/image'
import {sendRequire, getUserList, getFlowableForm, startProcess, completeProcess, zhipaiProcess, weipaiProcess, getTaskInfo, saveProcess } from "./api";
import userForm from './userForm'
export default {
  name: 'form-show-info',
  components: {userForm},
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
      submtData: {},
      contItem: [
        {
          label: '执行节点',
          prop: 'node',
          type: 'select',
          dicData: []
        },
        {
          label: '开启一票否决',
          prop: 'noone',
          type: 'select',
          dicData: [
            {label: '是', value: true},
            {label: '否', value: false}
          ],
          children: [
            {
              label: '人员选择',
              prop: 'user',
              linkbind: true,
              type: 'user',
              multiple: true,
              allowinput: false
            }
          ]
        },
        {
          label: '会签规则',
          prop: 'rule',
          type: 'select',
          dicData: [
            {label: '全票通过', value: 'allVotesPassed'},
            {label: '一票通过', value: 'oneVotePassed'},
            // {label: '全票拒绝', value: 'qpjj'},
            {label: '通过比例', value: 'passedPercent'},
            {label: '通过票数', value: 'passedCount'},
            {label: '拒绝比例', value: 'failPercent'},
            {label: '拒绝票数', value: 'failCount'},
          ],
          children: [
            {
              label: '百分比',
              prop: 'rate',
              linkbind: ['passedPercent', 'failPercent'],
            },
            {
              label: '票数',
              prop: 'piaoshu',
              linkbind: ['passedCount', 'failCount'],
            }
          ]
        },
        {
          label: '人员选择',
          prop: 'userList',
          type: 'select',
          multiple: true,
          dicData: [
            {label: 'admin', value: 1}
          ]
        }
      ],
      // 后续节点信息
      nextAssignment: {
        nextUserList: []
      },
      nextAssignmentOption: {
        btnHide: true,
        column: [
          {
            label: '执行节点',
            prop: 'nextNodeId',
            type: 'select',
            dicData: [],
            props: {
              label: 'name',
              value: 'nodeId'
            },
            display: true
          },
          {
            label: '开启一票否决',
            prop: 'enableOneBallotVeto',
            type: 'select',
            dicData: [
              {label: '是', value: true},
              {label: '否', value: false}
            ],
            children: [
              {
                label: '否决人员选择',
                prop: 'userList',
                linkbind: true,
                type: 'user',
                multiple: true,
                allowinput: false,
              }
            ]
          },
          {
            label: '会签规则',
            prop: 'rule',
            type: 'select',
            dicData: [
              {label: '全票通过', value: 'allVotesPassed'},
              {label: '一票通过', value: 'oneVotePassed'},
              {label: '全票拒绝', value: 'qpjj'},
              {label: '通过比例', value: 'passedPercent'},
              {label: '通过票数', value: 'passedCount'},
              {label: '拒绝比例', value: 'failPercent'},
              {label: '拒绝票数', value: 'failCount'},
            ],
            display: true,
            children: [
              {
                label: '百分比',
                prop: 'percent',
                linkbind: ['passedPercent', 'failPercent'],
                type: 'inputNumber'
              },
              {
                label: '票数',
                prop: 'percent',
                linkbind: ['passedCount', 'failCount'],
                type: 'inputNumber'
              }
            ]
          },
          {
            label: '人员选择',
            prop: 'nextUserList',
            type: 'select',
            multiple: true,
            dicData: [],
            display: true,
            props: {
              label: 'userName',
              value: 'id'
            }
          }
        ]
      },
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
      btnSetList: []
    }
  },
  created () {
    // 获取用户列表
    this.getUserListHandle()
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
      // 查询任务详情
      if(this.flowableInfo.taskId) {
        await this.getTaskInfoHandle()
      }
      // 表单结构
      if(this.flowableInfo.modelId && this.flowableInfo.actId) {
        this.getFlowableFormHandle()
      }
    },
    initForm (formDesign) {
      this.getSelectItem(formDesign.formdata)
      this.formType = formDesign.formType || 'flowable'
      this.getFormColumn(formDesign.formType, formDesign)
      // 流程表单
      if(formDesign.formType == 'flowable'){
        if(this.flowData.params) {
          this.formData.basic = JSON.parse(JSON.stringify(this.flowData.params))
          this.formData.form = JSON.parse(JSON.stringify(this.flowData.params))
          this.submtData = JSON.parse(JSON.stringify(this.flowData.params))
          this.$set(this.formData.form, "remark", this.flowData.remark)
        }
      }
    },
    // 表单配置
    getFormColumn (type, formDesign) {
      if(formDesign.formdata && formDesign.formdata.length > 0) {
        if(type == 'flowable'){
          // this.nextAssignmentOption.labelWidth = formDesign.formdata[0].formsetting.labelWidth + 'px'
          formDesign.formdata[0].formsetting.labelwidth = 80
          this.basicOption = this.formatFormOption('detailForm', formDesign.formdata[0].forms, formDesign.formdata[0].formsetting)
          this.basicOption.btnHide = true
          let forms = formDesign.formdata[1].forms
          forms.push({
            label: '审批意见',
            prop: 'remark',
            type: 'textarea'
          })
          forms.push({
            label: '',
            prop: 'nextAssignment',
            formSlot: true,
            hideLabel: true
          })
          // forms = forms.concat(this.contItem)
          formDesign.formdata[1].formsetting.labelwidth = 80
          this.formOption = this.formatFormOption(type, forms, formDesign.formdata[1].formsetting)
          if(!this.btnSetList) {
            this.btnSetList = this.formOption.btnSetting
          }
          // 表单默认值初始化
          if(this.defaultFormData) {
            this.formData.basic = this.defaultFormData
          }
        }else{
          let forms = formDesign.formdata[0].forms
          // this.nextAssignmentOption.labelWidth = formDesign.formdata[0].formsetting.labelWidth + 'px'
          forms.push({
            label: '',
            prop: 'nextAssignment',
            formSlot: true,
            hideLabel: true
          })
          // forms = forms.concat(this.contItem)
          formDesign.formdata[0].formsetting.labelWidth = 80
          this.formOption = this.formatFormOption(type, forms, formDesign.formdata[0].formsetting)
          this.formData = {
            userList: []
          }
          // 表单默认值初始化
          if(this.defaultFormData) {
            this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
          }
          if(this.onlyView) {
            this.formOption.disabled =  true
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
        fullscreen: formsetting.fullscreen,
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
      let url = ''
      let method = ''
      let msg = ''
      // 工作流表单提交
      if(this.isFlowable) {
        // 启动流程
        if(this.formType == 'normalForm') {
          let obj = {
            params: formsdata,
            modelId: this.flowableInfo.modelId,
          }
          startProcess(obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success('流程启动成功')
              this.$emit('close', true)
            }
          })
        }
      }
    },
    // 自定义按钮事件
    slotbtnClickHandle (row, index) {
      let nextAssignment = {
        countersignRule: {
          enableOneBallotVeto: this.nextAssignment.enableOneBallotVeto,
          percent: this.nextAssignment.percent,
          rule: this.nextAssignment.rule,
          userList: this.nextAssignment.userList
        },
        nextNodeId: this.nextAssignment.nextNodeId,
        nextUserList: this.nextAssignment.nextUserList
      }
      if(typeof nextAssignment.nextUserList == 'string') {
        nextAssignment.nextUserList = [nextAssignment.nextUserList]
      }
      // 流程提交
      if(this.isFlowable) {
        if(['ok', 'fail', 'reject', 'rollback'].indexOf(row.type) > -1) {
          let obj = {
            params: this.formData.basic, // this.submtData,
            remark: this.submtData.remark,
            result: row.type,
            nextAssignment: nextAssignment
          }
          completeProcess(this.flowableInfo.taskId, obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success(row.chineseName + '成功')
              this.$emit('close', true)
            }
          })
        }else{
          let obj = {
            params: this.formData.basic, // this.submtData,
            remark: this.submtData.remark,
            nextAssignment: nextAssignment
          }
          if(row.type == 'save') {
            saveProcess(this.flowableInfo.taskId, obj).then(res => {
              if(res.data.code == 0) {
                this.$message.success('保存成功')
                this.$emit('close', true)
              }
            })
          }
          if(row.type == 'assign') {
            this.dialogVisible = true
          }
          if(row.type == 'weipai') {
            weipaiProcess(this.flowableInfo.taskId, this.userId).then(res => {
              if(res.data.code == 0) {
                this.$message.success('委派成功')
                this.$emit('close', true)
              }
            })
          }
        }
      }else{
        if(row.url) {
          sendRequire(row.url, 'post', this.formData).then(res => {
            this.getList()
            this.$emit('close', true)
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
          if(res.data.data.viewJson) {
            let view = JSON.parse(res.data.data.viewJson)
            if(view.flowableFormDesign) {
              this.getFormItemOfDesign(res.data.data.viewJson)
            }else{
              this.data.viewJson = view
              this.initForm(this.data.viewJson)
            }
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
    // 根据设计结构合成表单
    getFormItemOfDesign(viewJson) {
      if(viewJson) {
        let view = JSON.parse(viewJson)
        this.formType = view.formType
        this.fieldsData = []
        if(view.flowableFormDesign) {
          this.formFields = view.flowableFormDesign.formFields
          let tp = []
          for(let i in this.formFields) {
            let obj = {}
            switch(this.formFields[i].type) {
              case 'input':
                if(this.formType == 'normalForm') {
                  obj = new MInput();
                }else{
                  obj = new MInputReadOnly();
                }
                break;
              case 'datePicker':
                obj = new MDatePicker();
                break;
              case 'select':
                obj = new MSelect();
                break;
              case 'textarea':

                if(this.formType == 'normalForm') {
                  obj = new MTextarea();
                }else{
                  obj = new MTextareaReadOnly()
                }
                break;
              case 'fileUpload':
                if(this.formType == 'normalForm') {
                  obj = new MFileUpload();
                }else{
                  obj = new MFile();
                }
                break;
              case 'imageUpload':
                if(this.formType == 'normalForm') {
                  obj = new MImageUpload();
                }else{
                  obj = new MImage()
                }
                break;
              case 'radio':
                obj = new MRadio();
                break;
              case 'checkbox':
                obj = new MCheckbox();
                break;
              case 'inputNumber':
                obj = new MInputNumber();
                break;
              case 'money':
                obj = new MInputNumber();
                break;
              case 'dateTime':
                obj = new MDatePicker();
                obj.dateType = 'dateTime';
                break;
              case 'week':
                obj = new MDatePicker();
                obj.dateType = 'week';
                break;
              default :
                obj = new MInput();
                break;
            }
            obj.label = this.formFields[i].showChinese
            obj.prop = this.formFields[i].columnName
            this.fieldsData.push({
              label: obj.label,
              value: obj.prop
            })
            if(this.formType == 'normalForm') {
              obj.disabled = false
            }else{
              obj.disabled = true
            }
            tp.push(obj)
          }
          if(!this.data.viewJson) {
            this.data.viewJson = {
              formType: "flowable",
              formdata: [
                {
                  forms: [],
                  formsetting: {
                    labelposition: 'top',
                    labelwidth: 200,
                    formsize: 'mini'
                  }
                },
                {
                  forms: [],
                  formsetting: {
                    labelposition: 'top',
                    labelwidth: 200,
                    formsize: 'mini',
                    btnSetting: [
                      {name: '通过', url: 'ok', enable: true},
                      {name: '拒绝', url: 'fail', enable: true},
                      {name: '驳回', url: 'reject', enable: true},
                      {name: '保存', url: 'save', enable: true},
                      {name: '指派', url: 'zhipai', enable: true},
                      // {name: '委派', url: 'weipai', enable: true}
                    ]
                  }
                }
              ]
            }
          }
          this.data.viewJson.formType = this.formType
          this.data.viewJson.formdata[0].forms = tp
          // 非开始节点 默认填充审批意见
          if(this.formType == 'flowable') {
            // if(!this.data.viewJson.formdata[1]) {
            //   this.data.viewJson.formdata.push({})
            // }
            // let suitem = new MTextarea()
            // suitem.label = '审批意见'
            // suitem.prop = 'remark'
            // this.data.viewJson.formdata[1].forms = [suitem]
            this.formData = {
              basic: {},
              form: {}
            }
          }
        }else{
          this.data.viewJson = view
          for(let i in view.formdata) {
            if(view.formdata[i].forms) {
              for(let j in view.formdata[i].forms) {
                this.fieldsData.push({
                  label: view.formdata[i].forms[j].label,
                  value: view.formdata[i].forms[j].prop
                })
              }
            }
          }
        }
        this.initForm(this.data.viewJson)
      }
    },
    // 获取任务详情
    async getTaskInfoHandle () {
      await getTaskInfo(this.flowableInfo.taskId).then(res => {
        if(res.data.code == 0 && res.data.data) {
          let data = res.data.data
          if(data.taskCompleteInfo) {
            this.flowData = data.taskCompleteInfo
            if(data.taskCompleteInfo.nextAssignment) {
              let obj = JSON.parse(JSON.stringify(data.taskCompleteInfo.nextAssignment))
              for(let o in obj.countersignRule) {
                obj[o] = obj.countersignRule[o]
              }
              this.nextAssignment = obj
            }else{
              this.nextAssignmentOption.column.filter(item => {
                if(item.prop != 'nextNodeId') {
                  item.display = false
                }else{
                  item.display = true
                }
              })
            }
            if(data.taskCompleteInfo.params) {
              this.formData.basic = JSON.parse(JSON.stringify(this.flowData.params))
              this.submtData = JSON.parse(JSON.stringify(this.flowData.params))
            }
            if(data.taskCompleteInfo.remark) {
              this.formData.form = {
                remark: data.taskCompleteInfo.remark
              }
            }
            if(data.nextNodeInfo){
              this.nextAssignmentOption.column[0].dicData = data.nextNodeInfo
              this.nodeDicData = data.nextNodeInfo
              if(data.nextNodeInfo.length > 0) {
                this.showAssignBool = true
                if(data.nextNodeInfo.length > 1 && data.isNextUserDecide) {
                  this.nextAssignmentOption.column[0].display = true
                }else{
                  this.nextAssignmentOption.column[0].display = false
                  this.setNext(this.nodeDicData[0], !this.nodeDicData[0].userTaskType == 'normal')
                }
              }else{
                this.showAssignBool = false
              }
            }
          }
          if(data.buttonList) {
            this.btnSetList = data.buttonList
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
          this.userDicData = res.data.data.records
        }
      })
    },
    // 人员选择  可否多选  字典配置
    setNext (AItem, bool) {
      this.nextAssignmentOption.column.filter(item => {
        if(item.prop == 'nextUserList') {
          item.multiple = bool
          let temp = []
          for(let j in this.userDicData) {
            if(AItem.userList.indexOf(this.userDicData[j].id) > -1) {
              temp.push(this.userDicData[j])
            }
          }
          item.dicData = temp
          if(AItem.isUserDefined) {
            item.display = true
          }else{
            item.display = false
          }
          // if(temp.length > 0) {
          //   if(AItem.isUserDefined) {
          //     item.display = true
          //   }else{
          //     item.display = false
          //   }
          // }else{
          //   item.display = false
          // }
        }
        if(item.prop == 'enableOneBallotVeto') {
          if(AItem.userTaskType !== 'normal'){ // 'parallel') {
            item.display = true
          }else{
            item.display = false
          }
          if(AItem.isUserDefined !== true) {
            item.display = false
          }
        }
        if(item.prop == 'rule') {
          if(AItem.userTaskType !== 'normal' ){ // 'parallel') {
            item.display = true
          }else{
            item.display = false
          }
          if(AItem.isUserDefined !== true) {
            item.display = false
          }
        }
      })
    }
  },
  watch: {
    'nextAssignment.nextNodeId': {
      handler(newVal, oldVal) {
        if(newVal != oldVal) {
          for(let i in this.nodeDicData) {
            if(this.nodeDicData[i].nodeId == newVal) {
              let bool = false
              if(this.nodeDicData[i].userTaskType == 'normal') {
                bool = false
              }else{
                bool = true
              }
              // else if(this.nodeDicData[i].userTaskType == 'parallel'){
              //   bool = true
              // }
              // 人员选择  可否多选  字典配置
              this.setNext(this.nodeDicData[i], bool)
              // 人员选择   重新初始化值 单选多选
              if(bool) {
                if(this.count > 0) {
                  this.nextAssignment.nextUserList = []
                }else{
                  if(typeof this.nextAssignment.nextUserList == 'string') {
                    this.nextAssignment.nextUserList = []
                  }
                }
              }else{
                if(this.count > 0) {
                  this.nextAssignment.nextUserList = ""
                }else{
                  this.nextAssignment.nextUserList = this.nextAssignment.nextUserList[0]
                }
              }
            }
          }
          this.count++
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
