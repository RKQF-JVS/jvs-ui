<template>
  <div :class="{'form-design-list': true, 'flowable-form-design-list-no-close': isFlowDesign, 'flowable-form-design-list': data.viewJson.formType == 'flowable'}">
<!--    <title-page-header title="表单设计"-->
<!--      :hassave="(data.modelId || ($route.query && $route.query.name)) || isClient ? true : (hassave ? true: false)"-->
<!--      :hasclose="hasclose || isClient"-->
<!--      :needLoading="true"-->
<!--      @save="toolClick('save')"-->
<!--      @close="closeHandle"-->
<!--    >-->
    <title-page-header title="表单设计"
     :hassave="false"
     :hasclose="false"
     :needLoading="true"
     @save="toolClick('save')"
     @close="closeHandle"
    >
      <template slot="left">
        <div class="cont-top">
          <div class="cont-top-item" v-if="designData">
            <p>{{designData.name || data.name}}</p>
            <p><el-tag size="mini" :type="designData.isDeploy ? '' : 'info'">{{designData.isDeploy ? '已发布' : '未发布'}}</el-tag></p>
          </div>
          <div class="cont-top-item" v-else-if="data">
            <p>{{data.name || data.name}}</p>
            <p><el-tag size="mini" :type="data.isDeploy ? '' : 'info'">{{data.isDeploy ? '已发布' : '未发布'}}</el-tag></p>
          </div>
        </div>
      </template>
      <template slot="right">
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="一列" placement="top">-->
<!--            <svg class="icon form-design-tool" aria-hidden="true" @click="setColumn(24)">-->
<!--              <use xlink:href="#icon-column-vertical"></use>-->
<!--            </svg>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="两列" placement="top">-->
<!--            <svg class="icon form-design-tool" aria-hidden="true" @click="setColumn(12)">-->
<!--              <use xlink:href="#icon-column-horizontal"></use>-->
<!--            </svg>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="清空" placement="top">-->
<!--            <i class="el-icon-delete form-design-tool" @click="clearAll()"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="权限" placement="top">-->
<!--            <svg class="icon form-design-tool" aria-hidden="true" @click="setPermission()">-->
<!--              <use xlink:href="#icon-user"></use>-->
<!--            </svg>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="复制地址" placement="top">-->
<!--            <span-->
<!--              v-clipboard:copy="getpageUrl(designData)"-->
<!--              v-clipboard:success="onCopy"-->
<!--              v-clipboard:error="onError"-->
<!--              @click="onCopy"-->
<!--              style="line-height:0px;"-->
<!--            >-->
<!--              <svg class="icon form-design-tool" aria-hidden="true">-->
<!--                <use xlink:href="#icon-link"></use>-->
<!--              </svg>-->
<!--            </span>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="其他设置" placement="top">-->
<!--            <i class="el-icon-setting form-design-tool" @click="otherSetting()"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
        <p class="design-tool">
          <el-tooltip effect="dark" content="设置" placement="top">
            <i class="el-icon-setting form-design-tool" @click="handleSetting()"></i>
          </el-tooltip>
        </p>
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="数据关联设置" placement="top">-->
<!--            <i class="el-icon-set-up form-design-tool" @click="callbackSetting()"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
        <p class="design-tool">
          <el-tooltip effect="dark" content="预览" placement="top">
            <i class="el-icon-view form-design-tool" @click="toolClick('preview')"></i>
          </el-tooltip>
        </p>
<!--        <p class="design-tool" v-if="hasjson || toolShow || isFlowDesign || isClient">-->
<!--          <el-tooltip effect="dark" content="数据结构" placement="top">-->
<!--            <i class="el-icon-c-scale-to-original form-design-tool" @click="toolClick('json')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
        <p>
          <el-tooltip v-show="saveLoading" effect="dark" content="保存" placement="top">
            <i class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
          </el-tooltip>
          <el-tooltip v-show="!saveLoading" effect="dark" content="保存" placement="top">
            <img :src="saveIcon" alt="" style="display:block;padding:2px;width:16px;height:16px;" @click="toolClick('save')">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="发布" placement="top">
            <i v-if="publishLoading" class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
            <i v-else class="el-icon-s-promotion" style="font-size:20px;color:#353535;cursor:pointer;" @click="publishClick"></i>
          </el-tooltip>
        </p>
<!--        <p class="design-tool" v-if="hasimport || toolShow">-->
<!--          <el-upload-->
<!--            :action="`/mgr/jvs-design/form/design/import?formId=${designData ? designData.id : data.id}`"-->
<!--            :multiple="false"-->
<!--            :limit="1"-->
<!--            ref="uploadBtn"-->
<!--            :file-list="fileList"-->
<!--            :show-file-list="false"-->
<!--            :on-success="uploadSuccess"-->
<!--            :on-error="errHandle"-->
<!--            :headers="headers"-->
<!--          >-->
<!--            <el-tooltip effect="dark" content="导入" placement="top">-->
<!--              <i class="el-icon-folder-add form-design-tool"></i>-->
<!--            </el-tooltip>-->
<!--          </el-upload>-->
<!--        </p>-->
<!--        <p class="design-tool" v-if="hasexport || toolShow">-->
<!--          <el-tooltip effect="dark" content="导出" placement="top">-->
<!--            <i class="el-icon-folder-remove form-design-tool" @click="toolClick('export')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
      </template>
    </title-page-header>
    <div class="design-form-cont flowable-ui-design-form-cont" v-if="formBool">
      <div v-if="data.viewJson" style="height:100%;">
        <normalForm
          ref="normalForm"
          v-if="['normalForm', 'flowable', 'detailForm'].indexOf(data.viewJson.formType) > -1"
          :formdata="data.viewJson.formdata[0]"
          :isFlowable="data.viewJson.isFlowable"
          :flowableDom="data.viewJson.flowableDom"
          :fields="fieldsData"
          :columnNameList="fieldsData"
          :isDetail="isDetail"
          :tableOption="tableOption"
          :masterTable="(designData ? designData.id : data.id)+''"
          :isFlowDesign="isFlowDesign"
          :formType="data.viewJson.formType"
          @save="saveForm"
        />
        <detailForm
          v-if="false && data.viewJson.formType == 'detailForm'"
          :formdata="data.viewJson.formdata[0]"
          :formType="data.viewJson.formType"
          :fields="fieldsData"
          :columnNameList="fieldsData"
          :masterTable="(designData ? designData.id : data.id)+''"
          @save="saveForm"
        />
        <levelForm
          v-if="data.viewJson.formType == 'multiLevelForm'"
          :formdata="data.viewJson.formdata"
          :column="data.viewJson.column"
          :isFlowable="data.viewJson.isFlowable"
          :flowableDom="data.viewJson.flowableDom"
          :fields="fieldsData"
          :columnNameList="fieldsData"
          :masterTable="(designData ? designData.id : data.id)+''"
          @save="saveForm"
        />
        <stepForm v-if="data.viewJson.formType == 'stepForm'"
          :formdata="data.viewJson.formdata[0]"
          :column="data.viewJson.column"
          :fields="fieldsData"
          :columnNameList="fieldsData"
          :masterTable="(designData ? designData.id : data.id)+''"
          @save="saveForm" />
        <processForm v-if="false && data.viewJson.formType == 'flowable'"
          :formdata="data.viewJson.formdata"
          :column="data.viewJson.column"
          :fields="fieldsData"
          :columnNameList="fieldsData"
          :masterTable="(designData ? designData.id : data.id)+''"
          @save="saveForm" />
      </div>
    </div>
    <!-- 表单设置 -->
    <el-dialog
      v-if="designDialogVisible"
      :visible.sync="designDialogVisible"
      :before-close="handleCloseDesignDialog"
      append-to-body
      :title="tpString == 'edit' ? '修改' : '新增'"
    >
      <jvs-form :formData="setForm" :option="setOption" @submit="formSubmit"></jvs-form>
    </el-dialog>
    <!-- 其他设置 -->
    <el-dialog
      title="其他设置"
      :visible.sync="otherSettingVisible"
      width="30%"
      append-to-body
      :before-close="handleClientTypeClose">
      <el-form class="demo-form-inline" label-width="90px">
        <el-form-item label="客户端类型">
          <el-radio-group v-model="clientType" @change="handleClientChange">
            <el-radio :label="'pc'">PC</el-radio>
            <el-radio :label="'mobile'">Mobile</el-radio>
            <el-radio :label="'all'">双端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否免登录">
          <el-radio-group v-model="checkLogin">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClientTypeClose">取 消</el-button>
        <el-button type="primary" @click="handleClientTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置 -->
    <el-dialog
      title="设置"
      :visible.sync="settingVisible"
      width="60%"
      append-to-body
      :before-close="handleSettingClose">
      <div style="height: 50vh">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="权限设置" name="permission">
            <permission
              ref="permissionConfig"
              v-if="settingVisible"
              :operationList="operationList"
              :role="role"
              :roleType="roleType"
              @handleClosePermission="handleClosePermission"
              @submitPermission="submitPermission"
            />
          </el-tab-pane>
          <el-tab-pane label="数据设置" name="callBack">
            <el-form style="padding: 0 20px;" class="demo-form-inline" label-width="100px" label-position="top">
              <el-form-item label="">
                <span style="color: #a3a3a3">所有的数据都会以网络请求到此地址进行数据转换。可进行业务二次对接。</span>
                <el-table
                  border
                  :data="callbackSettingData"
                  :span-method="arraySpanMethod"
                  class="tb-edit button-set-table"
                  style="width: 100%"
                  size='mini'
                >
                  <!-- 表头文字说明 -->
                  <el-table-column label="事件" width="150px">
                    <template slot-scope="scope">
                      {{ scope.row.desc }}
                    </template>
                  </el-table-column>
                  <el-table-column label="回调地址">
                    <template slot="header" slot-scope="scope">
                      <span>回调地址 </span>
                      <el-tooltip effect="light" content="默认请求方式为post" placement="top">
                        <i class="el-icon-info info-icon" style="cursor: pointer"/>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;">
                        <el-input
                          size="mini"
                          v-model="scope.row.callbackUrl"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否异步回调" width="150px">
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;">
                        <el-checkbox size="mini" v-model="scope.row.callbackAsync"></el-checkbox>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSettingClose">取 消</el-button>
        <el-button type="primary" @click="handleSettingSubmit">确 定</el-button>
      </span>
    </el-dialog>
<!--    <permission-->
<!--      :permissionVisible="permissionVisible"-->
<!--      :operationList="operationList"-->
<!--      :role="role"-->
<!--      :roleType="roleType"-->
<!--      @handleClosePermission="handleClosePermission"-->
<!--      @submitPermission="submitPermission"-->
<!--    />-->
  </div>
</template>
<script>
import {getNameList, getDetailByName, addForm, updateForm, deleteForm, deployForm, getFormCode, queryAvailable} from '../../api/form'
import {getFlowableForm} from '@/api/flowable'
import saveicon from "@/const/img/保存.png"
import {getDataStr, getDetail} from '../../api/formlist'
import Permission from "../../components/design/permission";

import PageHeader from '@/components/page-header/PageHeader'
import detailForm from '../../components/basic-design/detailForm'
import normalForm from '../../components/basic-design/normalForm'
import levelForm from '../../components/basic-design/levelForm'
import stepForm from '../../components/basic-design/stepForm'
import processForm from '../../components/basic-design/processForm'

import MInput from '../../plugin/assembly/input'
import MTextarea from '../../plugin/assembly/textarea'
import MInputNumber from '../../plugin/assembly/inputNumber'
import MSelect from '../../plugin/assembly/select'
import MDatePicker from '../../plugin/assembly/datePicker'
import MRadio from '../../plugin/assembly/radio'
import MCheckbox from '../../plugin/assembly/checkbox'
import MImageUpload from '../../plugin/assembly/imageUpload'
import MFileUpload from '../../plugin/assembly/fileUpload'
import MInputReadOnly from '../../plugin/assembly/inputreadonly'
import MTextareaReadOnly from '../../plugin/assembly/textareareadonly'
import MFile from '../../plugin/assembly/file'
import MImage from '../../plugin/assembly/image'
import MDepartment from '../../plugin/assembly/department'
import MUser from '../../plugin/assembly/user'
import MRole from '../../plugin/assembly/role'
import {getModelSetting, updateModelSetting} from "../../../../api/newDesign";

export default {
  components: {PageHeader, detailForm, normalForm, levelForm, stepForm, processForm, Permission},
  props: {
    hassave: {
      type: Boolean,
      default: false
    },
    hasclose: {
      type: Boolean,
      default: false
    },
    hasjson: {
      type: Boolean,
      default: false
    },
    hasimport: {
      type: Boolean,
      default: false
    },
    hasexport: {
      type: Boolean,
      default: false
    },
    designData: {
      type: Object
    }
  },
  data(){
    return {
      saveLoading: false, // 保存loading
      publishLoading: false, // 发布loading
      saveIcon: saveicon,
      role: [], // 权限设置
      roleType: true, // 权限类型,true 应用 权限，false 自定义权限
      operationList: [], // 操作权限list
      permissionVisible: false, // 权限弹框
      settingVisible: false, // 设置弹框
      activeName: 'permission', // tabs
      otherSettingVisible: false,
      callbackSettingVisible: false,
      clientType: 'pc',
      checkLogin: true,
      data: {
        name: "",
        type: "normalForm", // "flowable"
        id: '',
        viewJson: {
          formType: "normalForm", // "flowable"
          formdata: [
            {
              forms: [],
              formsetting: {
                labelposition: 'top',
                labelwidth: 80,
                formsize: 'mini',
                fullscreen: false,
                submitBtn: true,
                emptyBtn: true,
                cancal: false
              }
            },
            {}
          ]
        }
      },
      formBool: false,
      designDialogVisible: false, // 表单设置  名称  类型
      tpString: '', // 设置类型  新增add   修改 edit
      setForm: {
        name: '',
        type: ''
      },
      setOption: {
        column: [
          {
            label: '表单名称',
            prop: 'name',
            rules: [
              { required: true, message: '请输入表单名称', trigger: 'blur' },
            ]
          },
          {
            label: '表单类型',
            prop: 'type',
            type: 'select',
            disabled: false,
            dicData: [
              {
                label: '普通表单',
                value: 'normalForm' // 'NORMALFORM'
              },
              {
                label: '详情表单',
                value: 'detailForm' // 'DETAILFORM'
              },
              {
                label: '多级表单',
                value: 'multiLevelForm' // 'MULTILEVELFORM'
              },
              {
                label: '流程表单',
                value: 'flowable' // 'FLOWABLE'
              },
            ],
            rules: [
              { required: true, message: '请选择表单类型', trigger: 'change' },
            ]
          }
        ]
      },
      formTypeDict: [], // 已有表单
      columns: [],
      actId: '', // 节点id
      modelId: '', // 模型id
      formFields: [], // 字段设置
      queryFormType: 'normalForm',
      fieldsData: [], // 默认的字段
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
      toolShow: false,
      isFlowDesign: false, // 是否来自工作流的设计
      isClient: false, // 是否来自应用跳转
      tableOption: [],
      isDetail: false, // 是否为列表页详情按钮
      callbackSettingData: [
      ],
    }
  },
  async created () {
    // this.getFormName()
    if(this.$route.query) {
      this.isDetail = this.$route.query.isDetail === 'true'
      if(this.$route.query.id) {
        this.isClient = true
        await this.getDesignFormInfo({id: this.$route.query.id})
      }
      if(this.$route.query.dataModelId) {
        await this.getDesignDataStr(this.$route.query.dataModelId)
        await this.getModelSetting(this.$route.query.dataModelId)
      }
      if(this.$route.query.formType) {
        this.queryFormType = this.$route.query.formType
        // console.log(this.queryFormType)
      }
    }
    if(this.designData) {
      this.role = JSON.parse(JSON.stringify(this.designData.role))
      this.roleType = JSON.parse(JSON.stringify(this.designData.roleType))
      this.getDesignFormInfo(this.designData)
    }
  },
  methods: {
    // 设置
    handleSetting() {
      this.setPermission()
      this.settingVisible = true
    },
    // 关闭设置弹窗
    handleSettingClose() {
      this.settingVisible = false
    },
    // 设置提交
    async handleSettingSubmit () {
      await this.callbackSettingSubmit()
      await this.$refs.permissionConfig.handleConfirm()
      this.settingVisible = false
      this.$message.success('设置成功')
    },
    // 发布
    publishClick() {
      this.publishLoading = true
      const row = this.data
      if(row.id) {
        if(row.isDeploy) {
          this.$confirm('设计已经发布，此次保存可能会影响使用，是否继续操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deployForm(row.id).then(res => {
              if(res.data.code == 0) {
                this.publishLoading = false
                this.$message.success('发布成功')
              }
            })
          }).catch(e => {
            this.publishLoading = false
          })
        }else{
          this.$confirm('是否确认发布？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deployForm(row.id).then(res => {
              if(res.data.code == 0) {
                this.publishLoading = false
                this.$message.success('发布成功')
              }
            })
          }).catch(e => {
            this.publishLoading = false
          })
        }
      }
    },
    // 设置列数
    setColumn(num) {
      this.$refs.normalForm.handleSetColumn(num)
    },
    // 清空
    clearAll() {
      this.$refs.normalForm.handleClear()
    },
    // 设置权限
    setPermission() {
      if (this.data && this.data.viewJson && this.data.viewJson.formdata) {
        let arr = []
        arr = this.data.viewJson.formdata[0].formsetting.btnSetting.map(item => {
          return item.name
        })
        // if (this.data.viewJson.formdata[0].formsetting.submitBtn) {
        //   arr.push('提交')
        // }
        // if (this.data.viewJson.formdata[0].formsetting.emptyBtn) {
        //   arr.push('重置')
        // }
        this.operationList = [...arr]
      }
      this.permissionVisible = true
    },
    // 关闭权限设置弹窗
    handleClosePermission() {
      // this.roleType = true
      this.permissionVisible = false
    },
    // 权限提交
    submitPermission(arr, roleType) {
      // this.roleType = roleType
      // this.role = [...arr]
      this.data.roleType = roleType
      this.data.role = [...arr]
      let temp = JSON.parse(JSON.stringify(this.data))
      temp.viewJson = JSON.stringify(this.data.viewJson)
      updateForm(temp).then(res => {
        if(res.data.code == 0) {
        }
      })
      // const params = {
      //   roleType: roleType,
      //   role: [...arr],
      //   id: this.$route.query.id
      // }
      // updateForm(params).then(res => {
      //   if(res.data.code == 0) {
      //     this.$message.success("设置成功")
      //     this.$emit('getList')
      //   }
      // })
    },
    // 获取数据关联设置
    getModelSetting(modelId) {
      getModelSetting(modelId).then(res => {
        if (res.data && res.data.code == 0) {
          this.callbackSettingData = [...res.data.data.eventList]
        }
      })
    },
    callbackSettingClose() {
      this.callbackSettingVisible = false
    },
    callbackSettingSubmit() {
      const params = {
        eventList: [...this.callbackSettingData]
      }
      updateModelSetting(params, this.$route.query.dataModelId).then(res => {
        if (res.data && res.data.code == 0) {
          this.callbackSettingVisible = false
          this.getModelSetting(this.$route.query.dataModelId)
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      return [1, 1];
      if (rowIndex < 3) {
        if (columnIndex === 1) {
          return [1, 2];
        } else if (columnIndex === 0) {
          return [1, 1];
        }
      }
    },
    handleClientTypeClose() {
      this.otherSettingVisible = false
    },
    handleClientTypeSubmit() {
      this.otherSettingVisible = false
    },
    handleClientChange() {
      this.$refs.normalForm.handleClear()
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      str += ('/page-design-ui/#/form/info?id='+this.$route.query.id + (this.$route.query.dataModelId ? `&dataModelId=${this.$route.query.dataModelId}` : '') + `&isDeploy=${this.data.isDeploy}`)
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
      if(e.text) {
        this.$message.success('复制成功')
      }
    },
    onError (e) {
      console.log(e)
    },
    // 新增  修改
    formSetHandle (tp) {
      this.tpString = tp
      if(tp == 'add') {
        this.setOption.column[1].disabled = false
        this.setForm = {
          name: '',
          type: ''
        }
        this.designDialogVisible = true
      }else{
        this.setOption.column[1].disabled = true
        this.setForm.name = this.data.name
        this.setForm.type = this.data.type
        this.designDialogVisible = true
      }
    },
    // 关闭 新增  修改 表单 弹框
    handleCloseDesignDialog () {
      this.designDialogVisible = false
    },
    // 新增 修改 表单   提交
    formSubmit (form) {
      if(this.tpString == 'add') {
        this.data = {
          name: form.name,
          type: form.type,
          id: '',
          viewJson: {
            formType: form.type,
            formdata: [{
              forms: [],
              formsetting: {}
            }]
          }
        }
        this.formBool = true
        this.handleCloseDesignDialog()
      }
      if(this.tpString == 'edit') {
        this.data.name = form.name
        this.data.type = form.type
        let temp = JSON.parse(JSON.stringify(this.data))
        temp.viewJson = JSON.stringify(this.data.viewJson)
        updateForm(temp).then(res => {
          if(res.data.code == 0) {
            this.$message.success("修改成功")
            this.getFormName()
            this.data = res.data.data
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
            }
            this.formBool = true
            this.handleCloseDesignDialog()
          }
        })
      }
    },
    // 删除表单
    deleteFormHandle () {
      deleteForm(this.data.name).then(res => {
        if(res.data.code == 0) {
          this.$message.success("删除成功")
          this.getFormName()
          this.formBool = false
          this.data = {
            name: '',
            formType: '',
            id: '',
            viewJson: null
          }
        }
      })
    },
    getFormName () {
      getNameList().then(res => {
        if(res.data.code == 0) {
          this.formTypeDict = res.data.data
        }
      })
    },
    formNameChange (val) {
      this.formBool = false
      this.data = {
        name: '',
        formType: '',
        id: '',
        viewJson: null
      }
      if(val) {
        getDetailByName({name: val}).then(res => {
          if(res.data.code == 0 && res.data.data) {
            this.data = res.data.data
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
            }
            this.formBool = true
          }
        })
      }
    },
    // 其他设置
    otherSetting() {
      this.otherSettingVisible = true
    },
    // 数据关联设置
    callbackSetting() {
      this.callbackSettingVisible = true
    },
    saveForm (data, clientType, checkLogin) {
      if(data.column) {
        this.data.viewJson.column = data.column
      }
      // 单个表单表单项数据设置同步
      if(data && data.forms) {
        this.data.viewJson.formdata[0] = data
      }
      // 多个表单
      if(data.formdata) {
        this.data.viewJson.formdata = data.formdata
      }
      let temp = JSON.parse(JSON.stringify(this.data))
      temp.viewJson.flowableFormDesign = null
      temp.viewJson = JSON.stringify(temp.viewJson)
      temp.supportedClientType = this.clientType
      temp.checkLogin = this.checkLogin
      // temp.role = this.roleType ? undefined : this.role
      // temp.roleType = this.roleType
      if (this.data.isDeploy) {
        this.$confirm('设计已发布，保存使用新的设计，此操作无法恢复，是否确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateForm(temp).then(res => {
            if(res.data.code == 0) {
              this.saveLoading = false
              this.$message.success("保存成功")
              this.$emit('getList')
              if(this.$store.state.formCode) {
                this.$openUrl(`/page-design-ui/#/form?name=${this.$store.state.formCode}`)
                this.$store.state.formCode = ""
              }
            }
          })
        }).catch(e => {
          this.saveLoading = false
        })
      } else {
        updateForm(temp).then(res => {
          if(res.data.code == 0) {
            this.saveLoading = false
            this.$message.success("保存成功")
            this.$emit('getList')
            if(this.$store.state.formCode) {
              this.$openUrl(`/page-design-ui/#/form?name=${this.$store.state.formCode}`)
              this.$store.state.formCode = ""
            }
          }
        })
      }
    },
    // 保存
    saveHandle () {
      let temp = JSON.parse(JSON.stringify(this.data))
      temp.viewJson = JSON.stringify(this.data.viewJson)
      if(this.data.id) {
        updateForm(temp).then(res => {
          if(res.data.code == 0) {
            this.$message.success("保存成功")
            this.getFormName()
            this.data = res.data.data
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
            }
          }
        })
      }else{
        addForm(temp).then(res => {
          if(res.data.code == 0) {
            this.$message.success("新增成功")
            this.data = res.data.data
            if(res.data.data.viewJson) {
              this.data.viewJson = JSON.parse(res.data.data.viewJson)
            }
            this.getFormName()
          }
        })
      }
    },
    // 发布
    deployHandle () {
      deployForm(this.data.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success("发布成功")
          this.data = res.data.data
          if(res.data.data.viewJson) {
            this.data.viewJson = JSON.parse(res.data.data.viewJson)
          }
        }
      })
    },
    // 下载源码
    downloadHandle () {
      this.$openUrl(`/mgr/jvs-design/maven/generate/form/${this.data.id}`, '_self')
    },
    // 预览
    toolClick (type) {
      if (type === 'save') {
        this.saveLoading = true
      }
      this.$root.eventBus.$emit('toolEvent', type)
    },
    closeHandle () {
      if (this.isClient) {
        window.close()
      } else {
        this.$emit('close', true)
      }
    },
    uploadSuccess (res, file, fileList) {
      this.formBool = false
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.fileList = []
        this.getDesignFormInfo(res.data)
      }else{
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    // 导入失败
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
    // 获取设计数据结构
    getDesignDataStr(id) {
      getDataStr(id).then(res => {
        if(res.data && res.data.code == 0) {
          this.tableOption = [...res.data.data]
        }
      })
    },
    // 通过表单参数获取设计数据
    getDesignFormInfo (row) {
      this.formBool = false
      let viewJson = {
        formType: "normalForm",
        formdata: [
          {
            forms: [],
            formsetting: {
              labelposition: 'top',
              labelwidth: 80,
              formsize: 'mini',
              fullscreen: false,
              submitBtn: true,
              emptyBtn: true
            }
          }
        ]
      }
      if (row.id) {
        getDetail(row.id).then(res => {
          if(res.data.code == 0) {
            this.data = res.data.data
            this.clientType = this.data.supportedClientType
            this.checkLogin = this.data.checkLogin
            this.role = JSON.parse(JSON.stringify(this.data.role))
            this.roleType = JSON.parse(JSON.stringify(this.data.roleType))
            if(!this.data.viewJson || JSON.stringify(this.data.viewJson) == '{}') {
              this.data.viewJson = viewJson
            }else{
              this.data.viewJson = JSON.parse(this.data.viewJson)
            }
            for(let f in this.data.viewJson.formdata) {
              for(let i in this.data.viewJson.formdata[f].forms) {
                if(this.data.viewJson.formdata[f].forms[i].type == 'SWITCH'){
                  this.data.viewJson.formdata[f].forms[i].type = 'switch'
                }
              }
            }
            if(this.queryFormType == 'flowable') {
              this.$set(this.data.viewJson, 'formType', 'flowable')
            }
            console.log(this.data)
            this.formBool = true
          }
        })
      }
    },
  }
}
</script>
<style lang="scss">
.el-tabs__item{
  font-weight: bold;
}
.form-design-list{
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 10px;
  background: #f0f2f5;
  -webkit-box-sizing: border-box;
  .cont-top {
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #606266;
    background: #fff;
    // margin-top: 8px;
    // padding: 8px 0;
    border-radius: 5px;
    .cont-top-item {
      display: flex;
      justify-content: space-between;
      p {
        margin: 0 10px;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .title-page-header{
    margin-top: 0;
  }
  .el-card{
    // padding: 0 10px;
  }
  .design-title-bar {
    // position: fixed;
    // width: calc(100% - 20px);
    // left: 10px;
    // z-index: 99;
    // padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #fff;
    box-sizing: border-box;
    div{
      display: flex;
      align-items: center;
    }
    .left{
      .el-select, .el-button {
        margin-right: 20px;
      }
    }
    .right{
      .el-select, .el-button {
        margin-left: 20px;
      }
    }
  }
  .design-form-cont{
    top: 102px;
    position: absolute;
    margin-top: 8px;
    width: 100%;
    height: calc(100% - 102px);
    .level-form-design{
      background-color: #fff;
    }
    .detailForm, .subform{
      .el-card{
        position: relative;
        .el-card__header{
          position: fixed;
          width: calc(100% - 572px);
          z-index: 999;
          background: #fff;
          box-sizing: border-box;
        }
        .el-card__body{
          margin-top: 59px;
        }
      }
    }
  }
  .flowable-ui-design-form-cont{
    top: 52px;
    height: calc(100% - 52px);
    .el-col{
      height: calc(100% - 80px)!important;
    }
  }
}
.design-tool{
  position: relative;
  z-index: 999;
  .form-design-tool{
    font-size: 20px;
    cursor: pointer;
    color: #353535;
    cursor: pointer;
    &:hover{
      color: #0D76FC;
    }
  }
  .icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
}
.flowable-form-design-list{
  .title-page-header{
    .title-page-header{
      width: calc(100% - 52px);
    }
    .pageheader-top{
      .right-box{
        border-right: 1px solid #dcdfe6;
      }
    }
  }
}
.flowable-form-design-list-no-close{
  // .title-page-header{
  //   width: calc(100% - 52px);
  // }
  .right-box{
    margin-right: 52px;
    border-right: 1px solid #dcdfe6;
  }
}
</style>
