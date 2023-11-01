<template>
  <div class="button-info">
    <tableForm
      :option="option"
      :data="tableData"
      @nameChange="buttonNameValidate"
      @positionChange="positionChangeHandle"
      @typeChange="typeChangeHandle"
    >
      <!-- 按钮名称 -->
      <template slot="nameItem" slot-scope="scope">
        <div>
          <el-input v-model="scope.row.name" placeholder="请输入" size="mini" :disabled="scope.index < 7"></el-input>
        </div>
      </template>
      <!-- 按钮类型 -->
      <template slot="typeItem" slot-scope="scope">
        <!-- <span v-if="scope.row.type == 'btn_download_template'">导出模板</span> -->
        <!-- 默认按钮 -->
        <div>
          <el-select v-model="scope.row.type" placeholder="请选择" size="mini" v-if="scope.index < 7" :disabled="scope.index < 7">
            <el-option
              v-for="item in buttonTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- 自定义按钮 -->
          <el-select size="mini" v-model="scope.row.type" placeholder="请选择" v-if="scope.index > 6">
            <el-option
              v-for="item in buttonTypeItemshow()"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <!-- 按钮位置 -->
      <template slot="positionItem" slot-scope="scope">
        <div>
          <el-select v-model="scope.row.position" placeholder="请选择" size="mini" :disabled="scope.index < 7">
            <el-option
              v-for="item in buttonPosition"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <!-- 按钮位置 -->
      <template slot="enableItem" slot-scope="scope">
        <div>
          <el-switch
            v-model="scope.row.enable"
            :disabled="scope.index < 7 && scope.index > 3">
          </el-switch>
        </div>
      </template>
      <!-- 操作栏 -->
      <template slot="menuBtn" slot-scope="scope">
        <!-- <jvs-button type="text" @click="openclose(scope.row, scope.index)">{{scope.row.enable ? '隐藏': '显示'}}</jvs-button> -->
        <jvs-button
          v-if="scope.row.type"
          type="text"
          @click="configBtnHandle(scope.row, scope.index)"
          size="mini"
          >设计</jvs-button
        >
<!--        <jvs-button-->
<!--          type="text"-->
<!--          @click="remarkRow(scope.row, scope.index, 'senior')"-->
<!--          size="mini"-->
<!--          >高级</jvs-button-->
<!--        >-->
        <jvs-button
          type="text"
          @click="deleteRow(scope.row, scope.index)"
          v-if="scope.row.isDefault == false"
          size="mini"
          >删除</jvs-button
        >
<!--        <jvs-button-->
<!--          type="text"-->
<!--          @click="remarkRow(scope.row, scope.index, 'remark')"-->
<!--          size="mini"-->
<!--          :style="!scope.row.buttonRemark ? 'color: #c0c4cc;' : ''"-->
<!--          >备注</jvs-button-->
<!--        >-->
        <!-- <jvs-button type="text"
          @click="copyRow(scope.row, scope.index)"
          v-show="scope.row.type !== 'export_model'"
          v-if="scope.row.type==='save_form' || scope.row.type==='update_form'"
        >复制</jvs-button> -->
      </template>
    </tableForm>
    <el-row style="margin-top: 10px">
      <jvs-button size="mini" @click="addRowHandle">添加按钮</jvs-button>
    </el-row>
    <!-- 配置表单 -->
    <!-- 选择配置页面类型 -->
    <el-dialog
      v-if="formTypeDialogVisible"
      :visible.sync="formTypeDialogVisible"
      :before-close="handleCloseformTypeDialog"
      append-to-body
      title="设计"
    >
      <!-- 请求配置 -->
      <div v-if="['btn_network_request'].indexOf(currentBtn.type) > -1">
        <dataSourceForm :sourceType="sourceType" labelText="数据来源类型" :form="{http: currentBtn.netHttp}" @submit="netSubmitHandle"></dataSourceForm>
      </div>
      <!-- 删除 导入  -->
      <div v-if="['btn_delete', 'btn_import'].indexOf(currentBtn.type) > -1">
        <dataSourceForm :sourceType="sourceType" labelText="数据来源类型" :form="{http: currentBtn.preHttp}" @submit="preHttpSubmitHandle"></dataSourceForm>
      </div>
      <!-- 导出 字段 -->
      <div v-if="['btn_export'].indexOf(currentBtn.type) > -1" class="select-multiple-table">
        <jvs-table
          :refs="'select-multiple-table'"
          :selectable="true"
          :defaultAllSelect="true"
          :option="columnTableOption"
          :data="columnTableData"
          :selectedRows="selectedRows"
          @selection-change="selectionChange"
        ></jvs-table>
        <dataSourceForm style="margin-top:10px;" :sourceType="sourceType" labelText="数据来源类型" :form="{http: currentBtn.preHttp}" @submit="preHttpSubmitHandle"></dataSourceForm>
      </div>
      <!-- 下载模板 -->
      <div v-if="currentBtn.type == 'btn_download_template'" class="select-multiple-table">
        <jvs-table
          :refs="'select-multiple-table'"
          :selectable="true"
          :defaultAllSelect="true"
          :option="columnTableOption"
          :data="exportColumnData"
          :selectedRows="selectedRows"
          @selection-change="selectionChange"
        ></jvs-table>
        <dataSourceForm style="margin-top:10px;" :sourceType="sourceType" labelText="数据来源类型" :form="{http: currentBtn.preHttp}" @submit="preHttpSubmitHandle"></dataSourceForm>
      </div>
      <el-row v-if="['btn_external_link_address', 'btn_embedded_address'].indexOf(currentBtn.type) > -1" style="display:flex;align-items:center;">
        <span class="el-form-item__label" style="width:90px;">地址</span>
        <el-input size="mini" v-model="currentBtn.address"></el-input>
      </el-row>
      <el-row
        style="display: flex; justify-content: center"
        v-if="['btn_delete', 'btn_import', 'btn_export', 'btn_download_template', 'btn_network_request'].indexOf(currentBtn.type) == -1"
      >
        <jvs-button
          type="primary"
          size="mini"
          @click="formTypeSubmit"
          style="margin-top: 10px"
          >确定</jvs-button
        >
        <jvs-button
          size="mini"
          @click="handleCloseformTypeDialog"
          style="margin-top: 10px"
          >取消</jvs-button
        >
      </el-row>
    </el-dialog>
    <!-- 设计表单 -->
    <el-dialog
      v-if="designDialogVisible"
      :visible.sync="designDialogVisible"
      :fullscreen="true"
      :before-close="handleCloseDesignDialog"
      append-to-body
      class="form-design-no-header-dialog"
    >
      <title-page-header title="表单设计器" :needLoading="true" @save="toolClick('save')" @close="handleCloseDesignDialog">
        <template slot="right">
          <p>
            <el-tooltip effect="dark" content="预览" placement="top">
              <i class="el-icon-view form-design-tool" @click="toolClick('preview')"></i>
            </el-tooltip>
          </p>
          <p>
            <el-tooltip effect="dark" content="数据结构" placement="top">
              <i class="el-icon-c-scale-to-original form-design-tool" @click="toolClick('json')"></i>
            </el-tooltip>
          </p>
          <p v-if="masterTable">
            <el-upload
              :action="`/mgr/jvs-design/form/design/import?formId=${masterTable}`"
              :multiple="false"
              :limit="1"
              ref="uploadBtn"
              :file-list="fileList"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="errHandle"
              :headers="headers"
            >
              <el-tooltip effect="dark" content="导入" placement="top">
                <i class="el-icon-folder-add form-design-tool"></i>
              </el-tooltip>
            </el-upload>
          </p>
          <p v-if="masterTable">
            <el-tooltip effect="dark" content="导出" placement="top">
              <i class="el-icon-folder-remove form-design-tool" @click="toolClick('export')"></i>
            </el-tooltip>
          </p>
        </template>
      </title-page-header>
      <div class="design-form-cont" v-if="boolShow">
        <normalForm
          v-if="['normalForm', 'detailForm'].indexOf(currentBtn.form.formType) > -1"
          :formdata="currentBtn.form.formdata[0]"
          :fields="tableSetNameOption"
          :isFlowable="currentBtn.form.isFlowable"
          :flowableDom="currentBtn.form.flowableDom"
          :fineGrainedType="currentBtn.fineGrainedType"
          :columnNameList="currentBtn.form.formdata[0].autoTableFields"
          :tableOption="tableOption"
          :masterTable="masterTable"
          :allTable="allTable"
          :selectDataSourceName="selectDataSourceName"
          @save="saveForm"
          @flowChange="flowChangeHandle"
          @freshFormData="freshFormDataHandle"
        />
        <detailForm
          v-if="false && currentBtn.form.formType == 'detailForm'"
          :formdata="currentBtn.form.formdata[0]"
          :fields="tableSetNameOption"
          :columnNameList="currentBtn.form.formdata[0].autoTableFields"
          :tableOption="tableOption"
          :masterTable="masterTable"
          :allTable="allTable"
          @save="saveForm"
        />
        <levelForm
          v-if="currentBtn.form.formType == 'multiLevelForm'"
          :formdata="currentBtn.form.formdata"
          :fields="tableSetNameOption"
          :column="currentBtn.form.column"
          :isFlowable="currentBtn.form.isFlowable"
          :tableOption="tableOption"
          :flowableDom="currentBtn.form.flowableDom"
          :fineGrainedType="currentBtn.fineGrainedType"
          :masterTable="masterTable"
          :allTable="allTable"
          @save="saveForm"
          @flowChange="flowChangeHandle"
        />
        <stepForm v-if="currentBtn.form.formType == 'stepForm'"
          :formdata="currentBtn.form.formdata"
          :fields="tableSetNameOption"
          :column="currentBtn.form.column"
          :tableOption="tableOption"
          :isFlowable="currentBtn.form.isFlowable"
          :flowableDom="currentBtn.form.flowableDom"
          :fineGrainedType="currentBtn.fineGrainedType"
          :masterTable="masterTable"
          :allTable="allTable"
          @save="saveForm"
          @flowChange="flowChangeHandle"
         />
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogType == 'remark' ? '备注' : '高级设置'"
      append-to-body
      v-if="remarkVisible"
      :visible.sync="remarkVisible"
      :before-close="remarkClose">
      <el-row v-if="dialogType == 'remark'">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入备注"
          v-model="buttonRemark">
        </el-input>
      </el-row>
      <el-row v-else>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入按钮显示隐藏表达式用于显示或隐藏按钮"
          v-model="buttonRemark">
        </el-input>
        <p style="color:#999;">表达式动态控制按钮显示，效果将覆盖按钮外围显示设置</p>
        <span style="color:#999;">表达式举例： ${age} > 1 && ${name} == "xx" || ( !${sex} && ${no} >= 20 )</span>
      </el-row>
      <el-row style="margin-top:20px;display:flex;justify-content: center;">
        <jvs-button type="primary" @click="remarkHandle">确定</jvs-button>
        <jvs-button @click="remarkClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

import {getDetailByName, updateForm} from '../../../api/form'

import { btnType } from '../../../const/const'
import tableForm from '../../../components/basic-design/tableForm'
import detailForm from '../../../components/basic-design/detailForm'
import normalForm from '../../../components/basic-design/normalForm'
import levelForm from '../../../components/basic-design/levelForm'
import stepForm from '../../../components/basic-design/stepForm'

// 表单项
import MInput from '../../../plugin/assembly/input'
import MTextarea from '../../../plugin/assembly/textarea'
import MInputNumber from '../../../plugin/assembly/inputNumber'
import MSwitch from '../../../plugin/assembly/switch'
import MTimepicker from '../../../plugin/assembly/timepicker'
import MDatePicker from '../../../plugin/assembly/datePicker'
import MSelect from '../../../plugin/assembly/select'
import MUser from '../../../plugin/assembly/user'
import MDepartment from '../../../plugin/assembly/department'
import MRole from '../../../plugin/assembly/role'
import MPost from '../../../plugin/assembly/post'

import MInputReadOnly from '../../../plugin/assembly/inputreadonly'
import MTextareaReadOnly from '../../../plugin/assembly/textareareadonly'
import MImage from '../../../plugin/assembly/image'
import MFile from '../../../plugin/assembly/file'

import dataSourceForm from '../../../plugin/datasource'
import pinyin from 'js-pinyin'
import {updateDesignInfo} from "../../../api/design";
import {getButtonFormId} from "../../../api/newDesign";

export default {
  name: 'button-info',
  components: { tableForm, detailForm, normalForm, levelForm, stepForm, dataSourceForm },
  props: {
    menuName: {
      type: String
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    designColumn: {
      type: Array
    },
    infoData: {
      type: Object
    },
    designId: {
      type: String
    },
    dataModelId: {
      type: String
    },
    modelType: {
      type: String
    },
    tableOption: {
      type: Array
    },
    roleList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableSetNameOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    allTable: {
      type: Array
    },
    selectDataSourceName: {
      type: String
    }
  },
  computed: {
    tableData: {
      get () {
        let temp = this.data
        for(let i in temp) {
          if(["btn_add", "btn_modify", "btn_detail", "btn_form"].indexOf(temp[i].type) > -1) {
            if(!temp[i].form || !temp[i].form.formdata || temp[i].form.formdata.length == 0) {
              this.initDefaultForm(temp[i])
            }else{
              if(temp[i].form) {
                for(let j in temp[i].form.formdata) {
                  if(!temp[i].form.formdata[j].forms) {
                    temp[i].form.formdata[j].forms = this.eachColumnList(temp[i].form.formType, temp[i]).column
                  }
                  if(!temp[i].form.formdata[j].formJson) {
                    temp[i].form.formdata[j].formJson = this.eachColumnList(temp[i].form.formType, temp[i]).formJson
                  }
                  this.formatFormItem(temp[i].form.formdata)
                }
              }
            }
            if(!temp[i].formType) {
              temp[i].formType = temp[i].type == 'btn_detail' ? 'detailForm' : 'normalForm'
            }
          }
          if(!temp[i].permisionFlag) {
            temp[i].permisionFlag = temp[i].position + '-' + temp[i].type + '-' + new Date().getTime()
          }
        }
        temp.forEach((item, index) => {
          if (index < 7 && index > 3) {
            item.enable = false
          }
        })
        return temp
      },
      set () { }
    },
    columnTableData: {
      get () {
        let temp = []
        for(let i in this.designColumn) {
          // if(this.designColumn[i].show) {
          //   temp.push(this.designColumn[i])
          // }
          temp.push(this.designColumn[i])
        }
        return temp
      },
      set () { }
    },
    exportColumnData : {
      get () {
        let temp = []
        for(let i in this.designColumn) {
          // if(this.designColumn[i].tableName == this.masterTable && this.designColumn[i].isFrameField === false) {
          //   temp.push(this.designColumn[i])
          // }
          temp.push(this.designColumn[i])
        }
        return temp
      },
      set () {}
    }
  },
  // created () {console.log(this.tableData)},
  data () {
    return {
      // 按钮设置表单配置
      option: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        cancal: false,
        column: [
          {
            label: '按钮名称',
            prop: 'name',
            // disabled: true
            needSlot: true,
            watch: true
          },
          {
            label: '按钮位置',
            prop: 'position',
            type: 'select',
            dicData: [
              // { label: '顶部', value: 'top' },
              // { label: '行内', value: 'line' },
            ],
            disabled: true,
            needSlot: true,
            watch: true
          },
          {
            label: '按钮类型',
            prop: 'type',
            type: 'select',
            dicData: [],
            disabled: true,
            watch: true,
            needSlot: true
          },
          {
            label: '是否显示',
            prop: 'enable',
            type: 'switch',
            needSlot: true
          },
        ]
      },
      // 表单类型--下拉列表
      formTypeDict: [
        {
          label: '普通表单',
          value: 'normalForm'
        },
        {
          label: '详情表单',
          value: 'detailForm'
        },
        // {
        //   label: '多级表单',
        //   value: 'multiLevelForm'
        // },
        // {
        //   label: '步骤表单',
        //   value: 'stepForm'
        // },
        // {
        //   label: '流程表单',
        //   value: 'processForm'
        // }
      ],
      // 可配置的按钮类型
      enableConfigTypeList: ['save_form', 'update_form', 'show_label', 'network_post_url', 'network_get_url', 'export_excel'],
      currentBtn: {}, // 当前按钮
      formTypeDialogVisible: false, // 选择表单类型
      designDialogVisible: false, // 设计表单弹框
      // 导出配置
      exportSettingOption: {
        btnHide: true,
        column: [
          // {
          //   label: '绑定字段',
          //   prop: 'exportKey',
          //   type: 'select',
          //   dicData: [],
          //   display: true
          // },
          {
            label: '导出字段',
            prop: 'exportName',
            type: 'select',
            multiple: true,
            dicData: []
          },
        ]
      },
      // 导出配置--表单值
      exportSetting: {
        // exportKey: '', // 绑定字段
        exportName: [], // 导出字段
      },
      // 网络请求
      networkForm: {
        type: '',
        url: '',
        headers: [],
        body: ''
      },
      // 网络请求配置
      networkOption: {
        btnHide: true,
        column: [
          {
            label: '请求类型',
            prop: 'type',
            type: 'select',
            dicData: [
              {label: 'GET', value: 'GET'},
              {label: 'POST', value: 'POST'},
              {label: 'DELETE', value: 'DELETE'},
              {label: 'PUT', value: 'PUT'}
            ]
          },
          {
            label: '地址',
            prop: 'url'
          },
          {
            label: '请求头',
            prop: 'headers',
            formSlot: true
          }
        ]
      },
      // 请求头
      headersOption: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: 'key',
            prop: 'key'
          },
          {
            label: 'value',
            prop: 'value'
          }
        ]
      },
      // 按钮类型列表
      buttonTypeList: [],
      // 按钮位置列表
      buttonPosition: [
        { label: '顶部', value: 'top' },
        { label: '行内', value: 'line' },
      ],
      tableColumn: [],
      sourceType: 'data_origin_request', // 数据来源类型， 默认为网络请求
      // 导出 字段显示配置
      columnTableOption: {
        addBtn: false,
        menu: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        cancal: false,
        showOverflow: true,

        column: [
          // {
          //   label: '表名称',
          //   prop: 'tableName',
          //   needSlot: true,
          //   hide: true,
          // },
          // {
          //   label: '字段名称',
          //   prop: 'columnName',
          //   hide: true,
          // },
          {
            label: '显示字段名',
            prop: 'aliasColumnName',
          },
          {
            label: '显示中文名',
            prop: 'showChinese',
          },
        ]
      },
      buttonRemark: '', // 按钮备注
      remarkVisible: false, // 按钮备注弹框
      currentIndex: -1, // 当前按钮index
      masterTable: null, // 表单的id
      boolShow: true, // 表单设计内容 显隐
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
      formId: '',
      dialogType: '', // 高级设置   备注
    }
  },
  methods: {
    // 添加按钮
    addRowHandle () {
      this.tableData.push({
        id: 'BTN'+new Date().getTime(),
        name: '按钮名称',
        position: 'top',
        // showJurisdiction: ['所有用户'],
        type: '',
        netHttp: {}, // 网络请求
        // 进一步配置的数据
        disabled: false,
        fineGrainedType: '',
        form: {
          formdata: [],
          formType: ''
        },
        enable: true,
        isDefault: false
      })
      // this.positionChangeHandle({ item: {}, row: { position: 'top' } })
      // let temp = []
      // for (let i in btnType) {
      //   if (['FORM', 'NETWORK'].indexOf(btnType[i].value) > -1) {
      //     temp.push(btnType[i])
      //   }
      // }
      // this.option.column.filter(it => {
      //   if (it.prop=='type') {
      //     it.dicData=temp
      //   }
      // })
    },
    // 删除按钮
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
    },
    // 按钮备注
    remarkRow (row, index, type) {
      this.dialogType = type
      this.currentIndex = index
      if(type == 'remark') {
        if(row.buttonRemark) {
          this.buttonRemark = row.buttonRemark
        }
      }
      if(type == 'senior') {
        if(row.expressControl) {
          this.buttonRemark = row.expressControl
        }
      }
      this.currentBtn = row
      this.remarkVisible = true
    },
    // 备注
    remarkHandle () {
      if(this.dialogType == 'remark') {
        this.$set(this.tableData[this.currentIndex], 'buttonRemark', this.buttonRemark)
      }
      if(this.dialogType == 'senior') {
        this.$set(this.tableData[this.currentIndex], 'expressControl', this.buttonRemark)
      }
      this.remarkClose()
    },
    // 关闭备注
    remarkClose () {
      this.buttonRemark = ""
      this.remarkVisible = false
    },
    // 复制按钮
    copyRow (row, index) {
      this.tableData.push(row)
    },
    // 配置按钮
    configBtnHandle (row, index) {
      if(['btn_add', 'btn_modify', 'btn_detail', 'btn_form'].indexOf(row.type) > -1) {
        if (row.formId) {
          let str = ''
          str = location.origin + ('/page-design-ui/#/form?id='+row.formId + (this.dataModelId ? `&dataModelId=${this.dataModelId}` : '') + `&isDetail=${row.type === 'btn_detail'}`)
          this.$openUrl(str, '_blank')
        } else {
          getButtonFormId(this.dataModelId, this.designId, row.name).then(res => {
            if (res.data && res.data.code == 0) {
              row.formId = res.data.data
              this.$emit('handleSave')
              let str = ''
              str = location.origin + ('/page-design-ui/#/form?id='+res.data.data + (this.dataModelId ? `&dataModelId=${this.dataModelId}` : '') + `&isDetail=${row.type === 'btn_detail'}`)
              this.$openUrl(str, '_blank')
            }
          })
        }
      }
      // console.log(row)
      if(row.form) {
        if(!row.form.formdata) {
          row.form.formdata = []
        }
      }
      if(!row.formName) {
        row.formName = row.type + row.formType + '_' + new Date().getTime()
      }
      if(['btn_delete', 'btn_import', 'btn_network_request', 'btn_export', 'btn_download_template', 'btn_embedded_address', 'btn_external_link_address'].indexOf(row.type) > -1) {
        this.currentBtn=row
        // 网络请求 处理数据回显
        if(['btn_network_request'].indexOf(this.currentBtn.type) > -1) {
          // let obj = JSON.parse(JSON.stringify(this.currentBtn.netHttp))
          // this.currentBtn.netHttp = obj
          this.formTypeDialogVisible = true
        }
        // 导出  下载模板
        else if(['btn_export', 'btn_download_template'].indexOf(this.currentBtn.type) > -1){
          if(this.currentBtn.type == 'btn_export') {
            this.selectedRows = this.currentBtn.exportFields
          }else{
            this.selectedRows = this.currentBtn.importFields
          }
          this.formTypeDialogVisible = true
        }
        // 内嵌地址  外链地址
        else if(["btn_embedded_address", "btn_external_link_address"].indexOf(this.currentBtn.type) > -1) {
          this.formTypeDialogVisible = true
        }else {}
        if(['btn_delete', 'btn_import', 'btn_export', 'btn_download_template'].indexOf(this.currentBtn.type) > -1) {
          this.formTypeDialogVisible = true
        }
      }else{
        // 表单
        // this.updateFormcontent(row)
      }
    },
    // 按钮位置改变，对应按钮类型改变
    positionChangeHandle (data) {
      let item=data.item
      let row=data.row
      let temp=[]
      for (let i in btnType) {
        if (btnType[i].position.indexOf(row.position)>-1) {
          if (['FORM', 'NETWORK'].indexOf(btnType[i].value) > -1) {
            temp.push(btnType[i])
          }
        }
      }
      this.option.column.filter(it => {
        if (it.prop=='type') {
          it.dicData=temp
        }
      })
    },
    // 按钮类型改变
    typeChangeHandle (data) {
      let item=data.item
      let row=data.row
      if(row.type == 'NETWORK') {
        row.fineGrainedType = 'NETWORK'
      }
      if(row.type == 'FORM') {
        row.fineGrainedType = 'FORM'
      }
      // 导入时，添加一个导出模板按钮
      // if (row.type=='import_excel') {
      //   this.tableData.push({
      //     name: '导出模板',
      //     position: 'top',
      //     showJurisdiction: ['所有用户'],
      //     type: 'export_model'
      //   })
      // }
    },
    // 关闭选择表单类型
    handleCloseformTypeDialog () {
      this.formTypeDialogVisible=false
    },
    // 确定表单类型
    formTypeSubmit () {
      // this.designDialogVisible=true
      if(this.currentBtn.type == 'NETWORK') {
        let temp = JSON.parse(JSON.stringify(this.networkForm))
        let obj = {}
        for(let i in this.networkForm.headers) {
          obj[this.networkForm.headers[i].key] = this.networkForm.headers[i].value
        }
        temp.headers = obj
        this.currentBtn.networkForm = temp
      }
      if(this.currentBtn.type == 'btn_export') {
        this.currentBtn.exportFields = this.exportSetting.exportName
      }
      if(this.currentBtn.type == 'btn_download_template') {
        this.currentBtn.importFields = this.exportSetting.exportName
      }
      this.handleCloseformTypeDialog()
    },
    // 关闭设计表单
    handleCloseDesignDialog () {
      this.designDialogVisible=false
    },
    // 保存表单设计
    saveForm (data) {
      // this.currentBtn.formdata = data
      // console.log(data)
      if(this.currentBtn.form.formType == 'normalForm' || this.currentBtn.form.formType == 'detailForm') {
        this.currentBtn.form.formdata = [data]
      }else{
        this.currentBtn.form.formdata = data.formdata
        this.currentBtn.form.column = data.column
      }
      this.data = this.tableData
      // this.handleCloseDesignDialog()

      // 单独保存表单数据
      updateForm({name: this.currentBtn.formName, type: this.currentBtn.formType,
        viewJson: JSON.stringify(this.currentBtn.form)}).then(res => {
        if(res.data.code == 0) {
          this.$message.success("保存成功")
        }
      })
    },
    // 保存flowable设计参数
    flowChangeHandle (data) {
      if(this.currentBtn.form.formType == 'normalForm' || this.currentBtn.form.formType == 'multiLevelForm') {
        if(data.isFlowable) {
          this.currentBtn.form.isFlowable = data.isFlowable
        }else{
          this.currentBtn.form.isFlowable = false
        }
        if(data.flowableDom) {
          this.currentBtn.form.flowableDom = data.flowableDom
        }else{
          this.currentBtn.form.flowableDom = {}
        }
      }
    },
    // 添加请求头
    addHeader () {
      this.networkForm.headers.push({})
    },
    // 删除请求头
    deleteHeader (row, index) {
      this.networkForm.headers.splice(index, 1)
    },
    // 切换表单类型，重置数据
    formTypeChange () {
      if(this.currentBtn.form.formType == "multiLevelForm") {
        this.currentBtn.form.formdata = [
          {
            forms: [],
            formsetting: {
              labelposition: 'top',
              labelwidth: 80,
              formsize: 'mini',
              btnSetting: [],
              fullscreen: false
            },
            autoTableFields: this.columnTableData, // 全部的字段？？？？？？？？
          },
          {
            forms: [],
            formsetting: {
              labelposition: 'top',
              labelwidth: 80,
              formsize: 'mini',
              btnSetting: []
            },
            autoTableFields: this.columnTableData, // 全部的字段？？？？？？？？
          }
        ]
      }else{
        this.currentBtn.form.formdata = [
          {
            forms: [],
            formsetting: {
              labelposition: 'top',
              labelwidth: 80,
              formsize: 'mini',
              btnSetting: [],
              fullscreen: false
            },
            autoTableFields: this.columnTableData, // 全部的字段？？？？？？？？
          }
        ]
      }
    },
    // 按钮  显示 隐藏  设置
    openclose (row, index) {
      row.enable = !row.enable
    },
    getConst () {
      // 按钮类型dic
      this.buttonTypeList = this.setDicData('buttonType', 'type')
    },
    setDicData (key, prop) {
      let labelValue = this.$store.state.labelValue[key]
      let temp = []
      for(let i in labelValue) {
        temp.push({
          label: labelValue[i],
          value: i
        })
      }
      this.option.column.filter(item => {
        if(item.prop == prop) {
          item.dicData = temp
        }
      })
      return temp
    },
    // 按钮类型根据位置和是否默认过滤
    buttonTypeItemshow () {
      let temp = []
      for(let i in this.buttonTypeList) {
        let bool = false
        switch (this.buttonTypeList[i].value) {
          case 'btn_embedded_address' :
          case 'btn_external_link_address':
          case 'btn_network_request':
          case 'btn_form':
            bool = true;
            break;
          default : bool = false;break;
        }
        if(bool) {
          temp.push(this.buttonTypeList[i])
        }
      }
      return temp
    },
    // 表单类型是否可以切换
    formTypeDisableHandle (btnType, formType, val) {
      let bool = true
      if(btnType == 'btn_form' && val != 'detailForm') {
        bool = false
      }else{
        bool = true
      }
      return bool
    },
    // 遍历字段列表生成表单项
    eachColumnList (type, currentBtn) {
      let temp = []
      let formJson = {}
      for(let i in currentBtn.form.formdata[0].autoTableFields) {
        let obj = {}
        if(type == 'detailForm') {
          switch(currentBtn.form.formdata[0].autoTableFields[i].componentType) {
            case 'inputReadOnly':
              obj = new MInputReadOnly();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'textareaReadOnly':
              obj = new MTextareaReadOnly();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'image':
              obj = new MImage();
              break;
            case 'file':
              obj = new MFile();
              break;
            default :
              obj = new MInputReadOnly();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
          }
        }else{
          switch(currentBtn.form.formdata[0].autoTableFields[i].componentType) {
            case 'input':
              obj = new MInput();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'textarea':
              obj = new MTextarea();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'inputNumber':
              obj = new MInputNumber();
              // 整数 或 小数
              if(currentBtn.form.formdata[0].autoTableFields[i].isFloat == true) {
                obj.precision = 4
                formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = 1.0001;
              }else{
                obj.precision = 0
                formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = 1;
              }
              break;
            case 'SWITCh':
              obj = new MSwitch();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = false;
              break;
            case 'timePicker':
              obj = new MTimepicker();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "10:00:00";
              break;
            case 'datePicker':
              obj = new MDatePicker();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "2021-02-05 10:00:00";
              break;
            case 'select':
              obj = new MSelect();
              obj.multiple = false;
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              if(currentBtn.form.formdata[0].autoTableFields[i].associatedFieldHttp) {
                obj.url = currentBtn.form.formdata[0].autoTableFields[i].associatedFieldHttp
                obj.datatype = 'url'
              }
              if(currentBtn.form.formdata[0].autoTableFields[i].associatedFields) {
                obj.props.value = currentBtn.form.formdata[0].autoTableFields[i].associatedFields.columnName
              }
              if(currentBtn.form.formdata[0].autoTableFields[i].displayField) {
                obj.props.label = currentBtn.form.formdata[0].autoTableFields[i].displayField.columnName
              }
              if(currentBtn.form.formdata[0].autoTableFields[i].advancedSettings && currentBtn.form.formdata[0].autoTableFields[i].advancedSettings.dictionary) {
                obj.dicData = currentBtn.form.formdata[0].autoTableFields[i].advancedSettings.dictionary
              }
              // if(this.data.viewJson.column[i].seniorSetting && this.data.viewJson.column[i].seniorSetting.enumValues) {
              //   obj.dicData = this.data.viewJson.column[i].seniorSetting.enumValues
              // };
              // obj.sqlType = 'enum';
              break;
            case 'inputReadOnly':
              obj = new MInputReadOnly();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'user':
              obj = new MUser();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'department':
              obj = new MDepartment();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'role':
              obj = new MRole();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            case 'post':
              obj = new MPost();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
            default :
              obj = new MInput();
              formJson[currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName] = "";
              break;
          }
        }
        obj.label = currentBtn.form.formdata[0].autoTableFields[i].columnComment
        obj.prop = currentBtn.form.formdata[0].autoTableFields[i].aliasColumnName
        // if(columnTemp.datetype) {
        //   obj.datetype = columnTemp.datetype
        // }
        // if(columnTemp.num == 'int') {
        //   obj.precision = 0
        // }
        temp.push(obj)
      }
      return {column: temp, formJson: JSON.stringify(formJson)}
    },
    // 生成默认表单
    initDefaultForm (currentBtn) {
      // 表单
      if (["btn_add", "btn_modify", "btn_detail", "btn_form"].indexOf(currentBtn.type) > -1) {
        if(!currentBtn.form) {
          currentBtn.form = {}
        }
        // 新增的表单按钮 填充 autoTableFields
        if(!currentBtn.form.formdata || currentBtn.form.formdata.length == 0) {
          currentBtn.form.formdata = [
            {
              forms: [],
              formsetting: {
                labelposition: 'top',
                labelwidth: 80,
                formsize: 'mini',
                btnSetting: [],
                fullscreen: false
              },
              autoTableFields: []
            }
          ]
        }
        if(!currentBtn.form.formType) {
          currentBtn.form.formType = currentBtn.type == 'btn_detail' ? 'detailForm' : 'normalForm'
        }
        let tob = this.eachColumnList(currentBtn.form.formType, currentBtn)
        let defaultForm = {
          forms: tob.column,
          formsetting: {
            labelposition: 'top',
            labelwidth: 80,
            formsize: 'mini',
            btnSetting: [],
            fullscreen: false
          },
          formJson: tob.formJson,
          // autoTableFields: currentBtn.form.formdata[0].autoTableFields
        }
        if(!currentBtn.form) {
          currentBtn.form = {
            type: '',
            formdata: [defaultForm],
            autoTableFields: []
          }
        }
        if(!currentBtn.form.formdata || currentBtn.form.formdata.length == 0 || !currentBtn.form.formdata[0].forms) {
          currentBtn.form.formdata = [defaultForm]
        }
        // console.log(currentBtn.form.formdata)
      }
    },
    //网络请求配置
    netSubmitHandle (form) {
      if(form) {
        this.currentBtn.netHttp = form.http
        this.handleCloseformTypeDialog()
      }
      // console.log(this.tableData)
    },
    // 按钮请求配置
    preHttpSubmitHandle (form) {
      if(form) {
        this.currentBtn.preHttp = form.http
      }
      this.handleCloseformTypeDialog()
    },
    // 导出字段选择
    selectionChange (val) {
      if(this.currentBtn.type == 'btn_export') {
        this.currentBtn.exportFields = val
      }else{
        this.currentBtn.importFields = val
      }
    },
    // 兼容历史数据
    formatFormItem (formdata) {
      for(let i in formdata) {
        if(formdata[i].forms) {
          for(let j in formdata[i].forms) {
            // 下拉配置
            let item = this.getItemByValOfArr(formdata[i].forms[j].prop, 'aliasColumnName', formdata[i].autoTableFields)
            if(item) {
              if(formdata[i].forms[j].type == 'select') {
                if(!formdata[i].forms[j].props) {
                  formdata[i].forms[j].props = {
                    label: 'label',
                    value: 'value'
                  }
                }
                if(item.displayField) {
                  formdata[i].forms[j].props.label = item.displayField.columnName
                }
                if(item.associatedFields) {
                  formdata[i].forms[j].props.value = item.associatedFields.columnName
                }
                if(formdata[i].forms[j].url) {
                  formdata[i].forms[j].dicUrl = formdata[i].forms[j].url
                  formdata[i].forms[j].datatype = 'url'
                }
              }
              // 必填校验
              if(item.isNullable == 'NO'){
                if(formdata[i].forms[j].rules && formdata[i].forms[j].rules.length > 0) {
                  formdata[i].forms[j].rules[0].required = true
                  formdata[i].forms[j].rules[0].message = item.columnComment + '不能为空'
                }else{
                  formdata[i].forms[j].rules.push({required: true, message: (item.columnComment + '不能为空'), trigger: ["blur", "change"]})
                }
              }
            }
            // 兼容switch
            if(formdata[i].forms[j].type == 'SWITCH') {
              formdata[i].forms[j].type = 'switch'
            }
          }
        }
      }
    },
    // 根据val获取数据对应项
    getItemByValOfArr (val, attr, list) {
      for(let i in list) {
        if(list[i][attr] == val) {
          return list[i]
        }
      }
      return false
    },
    // 按钮名称重复校验
    buttonNameValidate (data) {
      let index = data.index
      let row = data.row
      let count = 0
      for(let i in this.tableData) {
        if(this.tableData[i].name == row.name) {
          count++
        }
      }
      if(count > 1 || !row.name) {
        let name = '新增按钮' + new Date().getTime()
        this.$set(this.tableData[index], 'name', name)
      }
    },
    // 刷新表单的内容
    freshFormDataHandle(bool) {
      if(bool) {
        let row = JSON.parse(JSON.stringify(this.currentBtn))
        this.boolShow = false
        // this.updateFormcontent(row)
      }
    },
    // 更新表单内容
    updateFormcontent (row) {
      getDetailByName({name: row.formName, type: row.formType, classify: this.menuName, description: row.name}).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.viewJson.startsWith('{') && res.data.data.viewJson != '{}') {
            row.form = JSON.parse(res.data.data.viewJson)
          }
          if(res.data.data.id) {
            this.masterTable = res.data.data.id + ""
          }
          this.currentBtn=row
          // 仅设计
          if(this.modelType == 'DESIGN') {
            // 表单  设计时  字段选项设置  默认填充表格的所有字段
            let tl = JSON.parse(JSON.stringify(this.designColumn))
            for(let t in tl) {
              if(tl[t].showChinese) {
                tl[t].aliasColumnName = pinyin.getFullChars(tl[t].showChinese)
                tl[t].aliasColumnName = tl[t].aliasColumnName[0].toLowerCase() + tl[t].aliasColumnName.slice(1, tl[t].aliasColumnName.length)
                tl[t].columnComment = tl[t].showChinese
              }else{
                tl.splice(t, 1) // 排除空的字段
              }
            }
            this.currentBtn.form.formdata[0].autoTableFields = tl
            // let ctp = this.eachColumnList(this.currentBtn.form.formType, this.currentBtn)
            // this.currentBtn.form.formdata[0].forms = ctp.column
            // this.currentBtn.form.formdata[0].formJson = ctp.formJson
          }else{
            this.currentBtn.form.formdata[0].autoTableFields = []
          }
          this.formatFormItem(this.currentBtn.form.formdata)
          this.boolShow = true
          this.designDialogVisible = true
          this.$forceUpdate()
        }
      })
    },
    // 预览
    toolClick (type) {
      this.$root.eventBus.$emit('toolEvent', type)
    },
    uploadSuccess (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.fileList = []
        this.freshFormDataHandle(true)
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
  },
  created () {
    this.getConst()
  },
  watch: {
    tableSetNameOption (newVal, oldVal) {
      this.exportSettingOption.column.filter( item => {
        item.dicData = newVal
      })
    },
    'networkForm.type': {
      handler(newVal, oldVal) {
        this.networkOption.column.filter(item => {
          if(item.prop == 'body') {
            if(newVal == 'get') {
              item.display = false
            }else{
              item.display = true
            }
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.design-title-bar {
  position: fixed;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  .el-row {
    .el-select,
    .el-button {
      margin-left: 20px;
    }
  }
}
.design-form-cont{
  margin-top: 10px;
  height: calc(100% - 54px);
  overflow: hidden;
}
</style>
<style lang="scss">
.form-design-no-header-dialog{
  height: 100%;
  overflow: hidden;
  .el-dialog__header{
    display: none!important;
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
    overflow: hidden;
    padding: 8px 10px;
    background: #f0f2f5;
    box-sizing: border-box;
  }
  .title-page-header{
    margin-top: 0;
    z-index: 99999999;
    position: relative;
  }
  .form-design-tool{
    font-size: 25px;
    cursor: pointer;
    color: #353535;
  }
}
.select-multiple-table{
  .jvs-table{
    .jvs-table-titleTop{
      display: none;
    }
    .table-body-box{
      .el-table{
        margin-top: 0;
        .el-table__header-wrapper{
          margin-top: 0;
        }
        .el-table__body-wrapper{
          height: auto!important;
        }
      }
    }
  }
}
</style>
