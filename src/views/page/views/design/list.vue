<template>
  <div class="design-box">
    <!-- 表格 -->
    <div class="design-box-top" style="margin-right: 20px;">

      <!-- <jvs-button size="mini" @click="setHttpHandle">列表页请求配置</jvs-button> -->
      <!-- <jvs-button size="mini" @click="viewDataJson" v-if="infoData.modelType == 'DEVELOP'">数据结构</jvs-button> -->
<!--      <el-select v-if="false && infoData.modelType == 'DEVELOP'"-->
<!--        v-model="selectDataSourceName" placeholder="请选择数据源" size="mini" style="margin: 0 10px;"-->
<!--        @change="getSourceTableHandle"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in dataSourceOption"-->
<!--          :key="item.databaseName"-->
<!--          :label="item.name"-->
<!--          :value="item.databaseName">-->
<!--        </el-option>-->
<!--      </el-select>-->
      <!-- <jvs-button size="mini" v-if="infoData.modelType == 'DEVELOP'" @click="downloadHande">下载源码</jvs-button> -->
      <!-- <jvs-button size="mini" v-if="activeName !== 'basic'" @click="previewHandle">预览效果</jvs-button> -->
      <!-- <jvs-button size="mini" @click="enabledHandle">发布</jvs-button> -->
      <!-- <jvs-button size="mini" @click="backToList">返回</jvs-button> -->
    </div>
    <!-- 设计部分 -->
    <el-card class="mt10 deign-box-content" shadow="never" style="position:relative;" v-if="showTabs">
      <jvs-tab :active="activeName" :option="tabOption" @tab-click="handleClick" v-if="setShow">
        <!-- 基本配置 -->
        <template slot="basic">
          <basicInfo :formData="data" @tableChange="tableChange" />
        </template>
        <!-- 表格配置 -->
        <template slot="table">
          <!-- <tableInfo :data="data.viewJson.column" :roleList="roleList" @getColumn="getColumnHandle" /> -->
          <!-- 2021-02-01 新版 -->
          <tableInfo :fieldsData="fieldsData" :data="designColumn" :modelType="infoData.modelType" :tableOption="tableOption" :needEmpty="needEmpty"
            :roleList="roleList" @getReg="getReg" @getColumn="getColumnHandle" />
        </template>
        <!-- 查询条件 -->
        <template slot="search">
          <searchInfo :data="data.viewJson.query" :tableSetNameOption="tableSetNameOption" />
        </template>
        <!-- 排序条件 -->
        <template slot="sort">
          <sortInfo :data="data.viewJson.sort" :tableSetNameOption="tableSetNameOption" />
        </template>
        <!-- 按钮配置 -->
        <template slot="button">
          <!-- <buttonInfo :data="data.viewJson.btns" :roleList="roleList" :tableSetNameOption="tableSetNameOption" /> -->
          <buttonInfo
            :menuName="designData.menuName"
            :data="designData.buttons"
            :designColumn="designColumn"
            :designId="designId"
            :dataModelId="dataModelId"
            :infoData="infoData"
            :modelType="infoData.modelType"
            :tableOption="tableOption"
            :masterTable="masterTable"
            :allTable="designData.dataPage.tables"
            :defaultSubShowData="defaultSubShowData"
            :roleList="roleList"
            :tableSetNameOption="tableSetNameOption"
            :selectDataSourceName="selectDataSourceName"
            @handleSave="saveHandle"
          />
        </template>
        <!-- 自定义统计 -->
        <template slot="statistics">
          <!-- <customStatisticsInfo :data="data.viewJson.customStatistics" :tableSetNameOption="tableSetNameOption" :roleList="roleList" /> -->
          <customStatisticsInfo :data="designData.dataPage.headStatisticalData" :tableSetNameOption="tableSetNameOption" :roleList="roleList" />
        </template>
        <!-- 自定义参数 -->
        <template slot="parameter">
          <parameterInfo :data="data.viewJson.parameters" />
        </template>
        <!-- 嵌入页面 -->
        <template slot="pageurl">
          <!-- <iframepageInfo :iframepage="data.viewJson.iframepage" /> -->
          <iframepageInfo :iframePage="designData.dataPage.referencePages" />
        </template>
      </jvs-tab>
    </el-card>
    <!-- 预览效果 -->
    <el-dialog
      v-if="previewVisible"
      :visible.sync="previewVisible"
      fullscreen
      class="preview-no-header-dialog"
      append-to-body
      :before-close="handleClosePreview">
      <!-- <showTable :propData="data" /> -->
      <showTable :menuForm="menuFormData" :propData="designData" :infoData="infoData" />
    </el-dialog>
    <!-- 修改菜单 -->
    <el-dialog
      title="修改菜单"
      v-if="menuVisible"
      :visible.sync="menuVisible"
      :before-close="handleCloseMenu"
      append-to-body
    >
      <jvs-form
        :formData="menuForm"
        :option="menuFormOption"
        @submit="submitMenu"
      >
        <template slot="menuParentIdForm">
          <el-cascader
            style="width: 100%;"
            size="mini"
            v-model="menuForm.menuParentId"
            :show-all-levels="true"
            :options="secondTreeData"
            :props="{ expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
          >
          </el-cascader>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 版本回滚 -->
    <el-dialog
      title="版本回滚"
      v-if="backVisible"
      :visible.sync="backVisible"
      append-to-body
      width="40%"
      :before-close="handleCloseBackVision">
      <el-row style="display:flex;margin-top: 10px;align-items: center;">
        <span>版本号：</span>
        <el-select
          v-model="versions"
          placeholder="请选择历史版本号"
          size="mini"
          style="flex:1;"
        >
          <el-option v-for="(item, key) in versionList" :key="key" :label="key" :value="key"></el-option>
        </el-select>
      </el-row>

      <el-row style="display:flex;justify-content: center;margin-top: 10px;">
        <jvs-button size="mini" type="primary" @click="backHandle">回滚</jvs-button>
        <jvs-button size="mini" @click="handleCloseBackVision">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 数据结构 -->
    <el-dialog
      title="数据结构"
      v-if="viewDataVisible"
      :visible.sync="viewDataVisible"
      append-to-body
      fullscreen
      class="form-fullscreen-dialog json-show-dialog"
      :before-close="viewDataClose">
      <div class="row">
        <div>
          <h4>列表数据结构</h4>
          <json-viewer
          v-if="pageDataString"
          style="overflow:auto;flex:1;min-height:300px;"
          :value="pageDataString"
          :expand-depth="2000"
          copyable
          boxed
          sort
          >
          </json-viewer>
        </div>
        <div>
          <h4>查询条件数据结构</h4>
          <json-viewer
            v-if="queryDataString"
            style="overflow:auto;flex:1;min-height:300px;"
            :value="queryDataString"
            :expand-depth="2000"
            copyable
            boxed
            sort
            >
          </json-viewer>
        </div>
      </div>
      <div class="row" v-if="false">
        <div>
          <h4>自定义JSQL</h4>
          <codeEditor class="jsql-codeEditor" prop="customizeJsonCode" :code="designData.dataPage.customizeJsqlJson" @change="changeHandle"></codeEditor>
        </div>
        <div>
          <h4>JSQL</h4>
          <codeEditor class="jsql-codeEditor" prop="variableJsonCode" :readOnly="true" :code="designData.dataPage.jsqlJson"></codeEditor>
        </div>
      </div>
    </el-dialog>
    <!-- 请求配置 -->
    <el-dialog
      title="列表页请求配置"
      append-to-body
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      fullscreen
      class="form-fullscreen-dialog"
      :before-close="httpClose">
      <dataSourceForm sourceType="data_origin_request" :form="httpData" @submit="submitHandle"></dataSourceForm>
    </el-dialog>
  </div>
</template>
<script>
import {getDesignInfo, updateDesignInfo} from '../../api/design'
import {getTableInfo, getRoleList, addDesign, updateDesign, enableMenu, getSourceCode, updateMenu, removeMenu,
getHistory, getDataSource, getSourceTable} from '../../api/list'
import {defaultBtnList, columnTypeList} from '../../const/const'
import showTable from '../show/list'
import basicInfo from './list/basic'
import tableInfo from './list/table'
import searchInfo from './list/search'
import sortInfo from './list/sort'
import buttonInfo from './list/button'
import customStatisticsInfo from './list/customStatistics'
import parameterInfo from './list/parameter'
import iframepageInfo from './list/iframe'
import dataSourceForm from '../../plugin/datasource'

import codeEditor from './coder' // json编译器

// 表单项
import MInput from '../../plugin/assembly/input'
import MTextarea from '../../plugin/assembly/textarea'
import MInputNumber from '../../plugin/assembly/inputNumber'
import MSwitch from '../../plugin/assembly/switch'
import MTimepicker from '../../plugin/assembly/timepicker'
import MDatePicker from '../../plugin/assembly/datePicker'
import MInputReadOnly from '../../plugin/assembly/inputreadonly'
import MSelect from '../../plugin/assembly/select'
import {getDataStr} from "../../api/formlist";

export default {
  components: {
    showTable, basicInfo, tableInfo, searchInfo, sortInfo, buttonInfo,
    customStatisticsInfo, parameterInfo, iframepageInfo, dataSourceForm, codeEditor},
  props: {
    infoData: {
      type: Object
    },
    roleType: {
      type: Boolean
    },
    role: {
      type: Array
    },
    menuId: {
      type: Number
    },
    menuName: {
      type: String
    },
    menuFormData: {
      type: Object
    },
    menuDicData: {
      type: Array
    },
    systemId: {
      type: String
    },
    treeData: {
      type: Array
    },
    saveRandom: {
      type: String
    },
    designId: {
      type: String
    },
    dataModelId: {
      type: String
    }
  },
  computed : {
    secondTreeData: {
      get () {
        let temp = []
        for(let i in this.treeData) {
          let obj = {
            name: this.treeData[i].name,
            id: this.treeData[i].id
          }
          if(this.treeData[i].children && this.treeData[i].children.length > 0) {
            obj.children = []
            for(let j in this.treeData[i].children) {
              let tobj = {
                name: this.treeData[i].children[j].name,
                id: this.treeData[i].children[j].id
              }
              obj.children.push(tobj)
            }
          }
          temp.push(obj)
        }
        return temp
      }
    }
  },
  data () {
    return {
      // 数据对象
      data: {
        id: '',
        menuId: '',
        menuName: '',
        dataSourceId: '',
        tableId: '',
        enable: false,
        type: 'senior',
        deployVersion: '', // 版本号
        // fields: [], // 默认字段
        // 设置相关参数
        viewJson: {
          column: [], // 表格配置--字段
          query: [], // 查询条件
          sort: [], // 排序条件
          // 按钮
          btns: JSON.parse(JSON.stringify(defaultBtnList)),
          // sql 查询
          customStatistics: [],
          // 自定义参数
          // parameters: [],
          // 引用页面
          iframepage: {
            url: '',
            position: 'bottom',
            width: 100,
            height: 100
          }
        }
      },
      // tab参数
      activeName: 'table', // 当前设计
      setShow: true, // false, // 获取角色列表后显示
      tabOption: {
        type: 'card',
        column: [
          // {label: '基本配置', name: 'basic'},
          {label: '表格配置', name: 'table'},
          // {label: '查询条件', name: 'search'},
          // {label: '排序条件', name: 'sort'},
          {label: '按钮配置', name: 'button'},
          // {label: '自定义统计', name: 'statistics'},！！！！！！！！！！！！！！
          // {label: '自定义参数', name: 'parameter'},
          // {label: '引用页面', name: 'pageurl'},！！！！！！！！！！！！
          // {label: '固定状态查询', name: 'fixedstatus'},
          // {label: '树形展示', name: 'tree'},
          // {label: '开发维护', name: 'dev'},
        ]
      },
      // table参数
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: {
        cancal: false,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        page: false,
        align: 'center',
        menuAlign: 'center',
        selection: true,
        search: true,
        showOverflow: true,
        // 搜索表单设置
        formAlign: 'right', //对其方式
        inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
        labelWidth: 'auto', // label宽
        submitBtn: true, // 提交按钮是否显示，默认显示
        submitBtnText: '查询', // 提交按钮文字，默认 提交
        column: []
      },
      tableData: [],
      tableSetNameOption: [], // 显示的字段
      tableSetNameOptionDefault: [], // 除自定义外的所有字段
      tableSetNameOptionAll: [], // 全部字段
      roleList: [], // 角色列表
      previewVisible: false, // 预览弹框
      keyList: [], // 字段名列表

      menuVisible: false, // 菜单弹框
      // 菜单
      menuForm: {},
      menuFormOption: {
        cancal: false,
        column: [
          // {
          //   label: "系统名称",
          //   prop: "systemId",
          //   type: 'select',
          //   dicUrl: '/mgr/jvs-auth/system/all',
          //   props: {
          //     label: 'name',
          //     value: 'id'
          //   },
          //   disabled: true
          // },
          {
            label: "上级菜单",
            prop: "menuParentId",
            formSlot: true,
            // type: 'select',
            // dicData: [],
            rules: [{ required: true, message: '请选择上级菜单', trigger: 'change' },]
          },
          {
            label: "名称",
            prop: "menuName",
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' },]
          },
          {
            label: "图标",
            prop: "menuIcon",
            type: 'iconSelect'
          },
          {
            label: "排序",
            prop: "menuSort",
            type: "inputNumber",
          }
        ]
      },
      backVisible: false, // 版本回滚弹框
      versions: '', // 版本号
      versionList: [], // 版本列表
      // 2021-02-01 新版---------------------------
      // 整体数据结构
      designData:  {
        dataPage: {
          referencePages: [
            {
              address: "",
              enable: false,
              height: 0,
              position: ""
            }
          ]
        }
      },
      designColumn: [], // 表格配置数据
      submitLoding: false,
      defaultSubShowData: {}, // 默认业务数据
      masterTable: '', // 表单id
      showTabs: false,
      design_default_btn: [
        {
          name: '新增', position: 'top', type: "btn_add", isDefault: true, enable: true,
          form: {
            formType: "normalForm",
            formdata: [
              {
                formsetting: {
                  labelposition: 'top',
                  labelwidth: 80,
                  formsize: 'mini',
                  btnSetting: [],
                  fullscreen: false
                },
                autoTableFields: []
              }
            ],
          }
        },
        {
          name: '修改', position: 'line', type: "btn_modify", isDefault: true, enable: true,
          form: {
            formType: "normalForm",
            formdata: [
              {
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
        },
        {
          name: '删除', position: 'line', type: "btn_delete", isDefault: true, enable: true,
          form: {
            formType: "normalForm",
            formdata: []
          }
        },
        {
          name: '详情', position: 'line', type: "btn_detail", isDefault: true, enable: true,
          form: {
            formType: "detailForm",
            formdata: [
              {
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
        },
        {name: '导入', position: 'top', type: "btn_import", isDefault: true, enable: true, form: null},
        {name: '导出', position: 'top', type: "btn_export", isDefault: true, enable: true, form: null},
        {name: '下载模板', position: 'top', type: "btn_download_template", isDefault: true, enable: true, form: null}
      ],
      selectDataSourceId: '', // 数据源id
      selectDataSourceName: '', // 选择的数据源名称
      dataSourceOption: [], // 数据源列表
      tableOption: [], // 数据表列表
      needEmpty: -1, // 是否切换了数据源
      viewDataVisible: false, // 查看数据结构
      pageDataString: {}, // 列表数据结构
      queryDataString: {}, // 查询条件数据结构
      dialogVisible: false, // 列表页请求配置
      httpData: {}, // 请求配置
      fieldsData: [], // 设计数据结构
      regErr: [], // 正则校验结果
    }
  },
  created () {
    // 开发模式 选择数据源
    // if(this.infoData.modelType == 'DEVELOP') {
      // this.getDataSourceHandle()
    // }
    this.initHandle()
    this.getDesignDataStr(this.dataModelId)

    this.$root.eventBus.$off("pageEvent")
    this.$root.eventBus.$on("pageEvent", newVal => {
      switch(newVal) {
        case 'save': this.saveHandle();break;
        case 'http': this.setHttpHandle();break;
        case 'json': this.viewDataJson();break;
        case 'download': this.downloadHande();break;
        case 'preview': this.previewHandle();break;
        case 'permission': this.permissionHandle();break;
        default: ;break;
      }
    });
  },
  beforeDestory () {
    this.$root.eventBus.$off("pageEvent")
  },
  methods: {
    // 获取设计数据结构
    getDesignDataStr(id) {
      getDataStr(id).then(res => {
        if(res.data && res.data.code == 0) {
          const arr = [...res.data.data]
          this.fieldsData = arr.filter(item => {
            return item.fieldName !== ''
          })
        }
      })
    },
    async initHandle () {
      if(this.infoData.id) {
        await this.getDesignInfoHandle()
      }
    },
    // 拉取设计数据
    async getDesignInfoHandle () {
      // this.designColumn = []
      await getDesignInfo(this.infoData.id, this.infoData.modelType).then(res => {
        if(res.data.code == 0) {
          this.upDataHandle(res.data.data)
          this.$emit('getDesignData', res.data.data)
        }
      })
    },
    // 更新设计
    async upDataHandle (data) {
      this.showTabs = true
      this.designColumn = []
      if(!data.dataPage) {
        data.dataPage = {
          tables: [],
          iframePage: [{}]
        }
      }
      if(data.dataPage) {
        if(!data.dataPage.headStatisticalData) {
          data.dataPage.headStatisticalData = []
        }
        if(!data.dataPage.referencePages) {
          data.dataPage.referencePages = [
            {
              address: "",
              enable: false,
              height: 0,
              position: ""
            }
          ]
        }
        if(data.dataPage.databaseName) {
          this.selectDataSourceName = data.dataPage.databaseName
        }
      }
      // 默认填充按钮数据
      if(!data.buttons) {
        data.buttons = this.design_default_btn
      }
      this.designData = data
      if(this.designData.dataPage && this.designData.dataPage.autoTableFields) {
        this.designColumn = this.designData.dataPage.autoTableFields
      }
      // 生成默认业务数据
      this.genDefaultData()
      if(this.infoData.modelType == 'DESIGN') {
        this.showTabs = true
      }else{
        this.getSourceTableHandle(this.selectDataSourceName, -1)
      }
      this.$forceUpdate()
    },
    // 获取数据源列表
    getDataSourceHandle () {
      getDataSource().then(res => {
        if(res.data.code == 0) {
          this.dataSourceOption = res.data.data
        }
      })
    },
    // 根据返回数据渲染页面
    setDataHandle (res) {
      if(res.data.code == 0 && res.data.data) {
        this.data.id = res.data.data.id
        this.data.dataSourceId = res.data.data.dataSourceId
        this.data.tableId = res.data.data.tableId
        this.data.menuName = res.data.data.menuName
        this.data.deployVersion = res.data.data.deployVersion
        this.data.menuId = res.data.data.menuId
        this.versionList = res.data.data.historyVersions
        // this.data.fields = res.data.data.autoTableFields
        // this.data.tableName = res.data.data.tableName
        if(res.data.data.viewJson) {
          let tps = JSON.parse(res.data.data.viewJson)
          if(typeof tps == 'string') {
            this.data.viewJson = JSON.parse(tps)
          }else{
            this.data.viewJson = tps
          }
          this.activeName = 'table'
          if(!this.data.viewJson.btns || this.data.viewJson.btns.length == 0) {
            this.data.viewJson.btns = JSON.parse(JSON.stringify(defaultBtnList))
          }
          if(!this.data.viewJson.iframepage) {
            this.$set(this.data.viewJson, 'iframepage', {
              url: '',
              position: 'bottom',
              height: 100
            })
          }
          this.setTableColumnNameOption()
        }
      }
    },
    // 选项卡切换
    handleClick (tab) {
      this.activeName = tab
    },
    // 获取数据表相关数据
    tableChange (obj) {
      let parmas = JSON.parse(JSON.stringify(obj))
      parmas.menuId = this.menuId
      getTableInfo(parmas).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.viewJson) {
            this.data.viewJson = JSON.parse(res.data.data.viewJson)
            if(!this.data.viewJson.iframepage) {
              this.$set(this.data.viewJson, 'iframepage', {
                url: '',
                position: 'bottom',
                height: 100
              })
            }
            // 重新生成默认的设计结构
            this.initOptionData(this.data.viewJson.column)
            this.setTableColumnNameOption()
          }
          this.$forceUpdate()
        }
      }).catch(e => {
        console.log(e)
        // 重新生成默认的设计结构
        this.initOptionData([])
        this.setTableColumnNameOption()
        this.activeName = 'table'
      })
    },
    // 格式化数据为各项配置参数
    initOptionData (list) {
      this.keyList = []
      let column = []
      let query = []
      let sort = []
      let parameters = []
      list.map((item, index) => {
        this.keyList.push(item.columnName)
        let columnitem = {
          columnName: item.columnName,
          columnComment: item.columnComment,
          dataType: item.dataType,
          dataOriginType: item.dataOriginType,
          showChinese: item.columnComment,
          show: true,
          // showJurisdiction: ["所有用户"],
          // export: ["所有用户"],
          statistics: false,
          ordinalPosition: index * 10,
          seniorSetting: item.seniorSetting ? item.seniorSetting : {
            echoType: '', // 字段类型
            text: '', // 超链接文字
            // dict: '', // 数据字典接口
            openType: '_blank',
            textcolor: '',
          },
          disabled: item.disabled,
          foreignKey: item.foreignKey || ''
        };
        column.push(columnitem)
      })
      this.data.viewJson.column = column
      this.data.viewJson.query = query
      this.data.viewJson.sort = [] // sort
      // this.data.viewJson.parameters = parameters
      this.data.viewJson.iframepage = {}
      // 根据字段生成按钮默认设置
      this.data.viewJson.btns = this.getDefaultFormSet(defaultBtnList)
      this.data.viewJson.customStatistics = []
      // this.data.viewJson.iframepage = {
      //   url: '',
      //   position: 'bottom',
      //   // width: 100,
      //   height: 100
      // }
      // 切换到--表格配置
      this.activeName = 'table'
      // console.log("根据字段生成的默认设计。。。。")
      // console.log(this.data)
    },
    // 获取表格数据可选项
    setTableColumnNameOption () {
      this.tableSetNameOption = []
      this.tableSetNameOptionDefault = []
      this.tableSetNameOptionAll = []
      for(let i in this.data.viewJson.column){
        if(this.data.viewJson.column[i].show === true){
          this.tableSetNameOption.push({
            label: this.data.viewJson.column[i].columnComment,
            value: this.data.viewJson.column[i].columnName,
            dataType: this.data.viewJson.column[i].dataType,
            seniorSetting: this.data.viewJson.column[i].seniorSetting
          })
        }
        if(this.data.viewJson.column[i].disabled === false){
        }else{
          this.tableSetNameOptionDefault.push({
            label: this.data.viewJson.column[i].columnComment,
            value: this.data.viewJson.column[i].columnName,
            dataType: this.data.viewJson.column[i].dataType,
            seniorSetting: this.data.viewJson.column[i].seniorSetting
          })
        }
        this.tableSetNameOptionAll.push({
          label: this.data.viewJson.column[i].columnComment,
          value: this.data.viewJson.column[i].columnName,
          dataType: this.data.viewJson.column[i].dataType,
          seniorSetting: this.data.viewJson.column[i].seniorSetting
        })
      }
    },
    // 获取角色列表
    async getRoleListHandle () {
      await getRoleList().then(res => {
        if(res.data.code == 0) {
          this.roleList = res.data.data
          this.setShow = true
        }
      })
    },
    // 返回
    backToList () {
      // this.$router.push("/list")
      this.$emit('closeDesign', true)
    },
    // 表格配置通知获取字段
    getColumnHandle (bool) {
      if(bool) {
        this.setTableColumnNameOption()
        this.$forceUpdate()
      }
    },
    // 获取正则校验结果
    getReg(reg) {
      this.regErr = reg
    },
    // 格式化列表页数据
    formatPageData () {
      // 查询条件  格式
      this.genDefaultData()
      let queryJson = this.genDefaultData('search') // JSON.parse(JSON.stringify(this.defaultSubShowData))
      queryJson.size = 20
      queryJson.current = 1
      this.designData.dataPage.queryJson = JSON.stringify(queryJson)
      // 表格数据  格式
      let dataPageJson = {
        records: JSON.parse(JSON.stringify([this.defaultSubShowData])),
        current: 1,
        total: 0
      }
      this.designData.dataPage.dataPageJson = JSON.stringify(dataPageJson)
      this.designData.dataPage.autoTableFields = this.designColumn
      if(this.selectDataSourceName) {
        this.designData.dataPage.databaseName = this.selectDataSourceName
      }
    },
    // 设置权限
    permissionHandle() {
      this.$emit('getButtons', this.designData.buttons)
    },
    // 保存列表设计
    saveHandle () {
      if(this.submitLoding) {
        return false
      }
      if (!this.regErr) {
        this.$message.error('字段名不能包含空格和特殊符号')
        return false
      }
      if (this.designData.dataPage && this.designData.dataPage.autoTableFields) {
        const arr = [...this.designData.dataPage.autoTableFields]
        for (let i in arr) {
          this.fieldsData.forEach(item => {
            if (item.fieldKey === arr[i].showChinese) {
              arr[i].showChinese = item.fieldName
            }
          })
        }
      }
      this.formatPageData()
      this.designData.role = this.roleType ? undefined : this.role
      this.designData.roleType = this.roleType
      if (this.infoData.isDeploy) {
        this.$confirm('设计已发布，保存使用新的设计，此操作无法恢复，是否确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitLoding = true
          updateDesignInfo(this.infoData.id, this.designData).then(res => {
            if(res.data.code == 0) {
              this.$message.success('保存成功')
              this.submitLoding = false
              // this.upDataHandle(res.data.data)
              this.getDesignInfoHandle()
              this.$emit('getList')
            }
          }).catch(e => {
            this.submitLoding = false
          })
        }).catch(e => {
          this.$emit('handleSaveLoading')
        })
      } else {
        this.submitLoding = true
        updateDesignInfo(this.infoData.id, this.designData).then(res => {
          if(res.data.code == 0) {
            this.$message.success('保存成功')
            this.submitLoding = false
            // this.upDataHandle(res.data.data)
            this.getDesignInfoHandle()
            this.$emit('getList')
          }
        }).catch(e => {
          this.submitLoding = false
        })
      }
    },
    saveHandleOld () {
      let json = JSON.stringify(this.data.viewJson)
      let obj = JSON.parse(JSON.stringify(this.data))
      obj.viewJson = json
      // console.log(this.data.viewJson)
      // console.log(obj)
      // return false
      // console.log(JSON.stringify(obj))
      if(obj.id){
        updateDesign(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('更新成功')
            // this.getDesignInfoHandle()
            this.setDataHandle(res)
          }
        })
      }else{
        addDesign(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('新增成功')
            // this.getDesignInfoHandle()
            this.setDataHandle(res)
          }
        })
      }
    },
    // 预览效果
    previewHandle () {
      this.formatPageData()
      this.previewVisible = true
    },
    // 关闭预览
    handleClosePreview () {
      console.log(0)
      this.previewVisible = false
    },
    // 发布
    enabledHandle () {
      enableMenu(this.menuId).then(res => {
        if(res.data.code == 0) {
          this.$message.success('发布成功')
          this.setDataHandle(res)
          this.getVersion()
        }
      })
    },
    // 生成默认按钮设置
    getDefaultFormSet (list) {
      for(let i in list) {
        switch(list[i].type) {
          case 'IMPORT':
            list[i].importSetting = JSON.parse(JSON.stringify(this.keyList));break;
          case 'EXPORT':
            list[i].exportSetting = JSON.parse(JSON.stringify(this.keyList));break;
          case 'FORM':
            // 详情表单
            let formdata = {
              forms: [],
              formsetting: {
                btnSetting: [],
                formsize: "mini",
                labelposition: "top",
                labelwidth: 80
              }
            }
            if(list[i].fineGrainedType == 'DETAIL') {
              formdata.forms = this.eachColumnList('detail')
              list[i].formDesign.formType = 'detailForm'
            }else{
              formdata.forms = this.eachColumnList('form')
              list[i].formDesign.formType = 'normalForm'
            }
            list[i].formDesign.formdata = [formdata]
            break;
          case 'NETWORK':
            list[i].networkForm = {type: 'delete', headers: {}, url: ''}
          default: ;break;
        }
      }
      return JSON.parse(JSON.stringify(list))
    },
    // 遍历字段列表生成表单项
    eachColumnList (type) {
      let temp = []
      for(let i in this.data.viewJson.column) {
        let columnTemp = this.getIteTypeOfForm(this.data.viewJson.column[i].dataType)
        if(!columnTemp) {
          columnTemp = {
            type: 'select'
          }
        }
        let obj = {}
        if(type == 'detail') {
          obj = new MInputReadOnly()
        }else{
          switch(columnTemp.type) {
            case 'input':
              obj = new MInput();
              break;
            case 'textarea':
              obj = new MTextarea();
              break;
            case 'inputNumber':
              obj = new MInputNumber();
              break;
            case 'switch':
              obj = new MSwitch();
              break;
            case 'timePicker':
              obj = new MTimepicker();
              break;
            case 'datePicker':
              obj = new MDatePicker();
              break;
            case 'select':
              obj = new MSelect();
              obj.multiple = false;
              if(this.data.viewJson.column[i].seniorSetting && this.data.viewJson.column[i].seniorSetting.enumValues) {
                obj.dicData = this.data.viewJson.column[i].seniorSetting.enumValues
              };
              obj.sqlType = 'enum';
              break;
            default :
              obj = new MInput();
              break;
          }
        }
        obj.label = this.data.viewJson.column[i].showChinese
        obj.prop = this.data.viewJson.column[i].columnName
        if(columnTemp.datetype) {
          obj.datetype = columnTemp.datetype
        }
        if(columnTemp.num == 'int') {
          obj.precision = 0
        }
        temp.push(obj)
      }
      return temp
    },
    // 根据数据类型获取表单项组件类型
    getIteTypeOfForm (type) {
      for(let i in columnTypeList) {
        if(columnTypeList[i].value == type) {
          return columnTypeList[i]
        }
      }
    },
    // 下载源码
    downloadHande () {
      this.$openUrl(`/mgr/jvs-design/design/code/${this.infoData.id}`, '_blank') // '_self')

      // this.$openUrl(`/mgr/jvs-design/maven/generate/${this.data.id}`, '_self')
      // getSourceCode(this.data.id).then(res => {
      //   // let name = res.headers["content-disposition"].split(";")[1]
      //   // name = name.split("=")[1]
      //   // name = decodeURI(name)
      //   // this.downloadFile(name, res.data)
      //   this.downloadFile(null, res.data)
      // })
    },
    // 下载文件
    downloadFile(filename, content) {
      var elink = document.createElement('a')
      if(filename) {
        elink.download = filename
      }
      elink.style.display = 'none'

      var blob = new Blob([content]) //,{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
      elink.href = URL.createObjectURL(blob)

      document.body.appendChild(elink)
      elink.click()

      document.body.removeChild(elink)
    },
    // 切换数据源
    getSourceTableHandle (val, needEmpty) {
      // for(let i in this.dataSourceOption) {
      //   if(this.dataSourceOption[i].databaseName == val) {
      //     this.selectDataSourceId = this.dataSourceOption[i].id
      //   }
      // }
      if(val) {
        getSourceTable(val).then(res => {
          if(res.data.code == 0) {
            this.tableOption = res.data.data
            if(needEmpty === -1) {
              this.needEmpty = -1
            }else{
              this.needEmpty = Math.random()
            }
            if(this.infoData.modelType == 'DEVELOP') {
              this.showTabs = true
              this.$forceUpdate()
            }
          }else{
            if(needEmpty === -1) {
              this.needEmpty = -1
            }else{
              this.needEmpty = Math.random()
            }
            if(this.infoData.modelType == 'DEVELOP') {
              this.showTabs = true
              this.$forceUpdate()
            }
          }
        }).catch(e => {
          if(needEmpty === -1) {
            this.needEmpty = -1
          }else{
            this.needEmpty = Math.random()
          }
          if(this.infoData.modelType == 'DEVELOP') {
            this.showTabs = true
            this.$forceUpdate()
          }
        })
      }else{
        if(this.infoData.modelType == 'DEVELOP') {
          this.showTabs = true
          this.$forceUpdate()
        }
      }
    },
    // 版本回滚
    rebackVision () {
      this.backVisible = true
    },
    // 确定回滚
    backHandle () {
      // this.getDesignInfoHandle('back')
      let temp = this.versionList[this.versions]
      if(temp) {
        if(temp.dataPage && !temp.dataPage.headStatisticalData) {
          temp.dataPage.headStatisticalData = []
        }
        if(temp.dataPage && !temp.dataPage.referencePages) {
          temp.dataPage.referencePages = [
            {
              address: "",
              enable: false,
              height: 0,
              position: ""
            }
          ]
        }
        this.designData = temp
        this.handleCloseBackVision()
      }
    },
    // 关闭版本回滚
    handleCloseBackVision () {
      this.backVisible = false
    },
    // 修改菜单
    editMenu () {
      // this.menuFormOption.column.filter(item => {
      //   if(item.prop == 'menuParentId') {
      //     item.dicData = this.menuDicData
      //   }
      // })
      this.menuForm = {
        menuParentId: [this.systemId, this.menuFormData.menuParentId],
        menuName: this.menuFormData.menuName,
        menuIcon: this.menuFormData.menuIcon,
        menuSort: this.menuFormData.menuSort,
        menuId: this.data.menuId || this.menuFormData.menuId
      }
      this.menuVisible=true
    },
    // 关闭修改弹框
    handleCloseMenu () {
      this.menuVisible = false
    },
    // 提交
    submitMenu (form) {
      let obj = form
      form.id = this.data.menuId || form.menuId
      form.parentId = form.menuParentId
      updateMenu(obj).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改菜单成功')
          this.handleCloseMenu() // 关闭弹框
          this.getDesignInfoHandle() // 重新拉数据
        }
      })
    },
    // 删除菜单
    deleteMenu () {
      this.$confirm('确认删除？').then(_ => {
        removeMenu(this.menuId).then(res => {
          this.backToList()
        })
      }).catch(_ => {})
    },
    // 版本列表
    getVersion () {
      getHistory(this.menuId).then(res => {
        if(res.data.code == 0) {
          this.versionList = res.data.data
        }
      })
    },
    // 生成默认业务数据格式
    genDefaultData (from) {
      let obj = {}
      for(let i in this.designColumn) {
        let type = ""
        let itemObj = {}
        let key = ""
        if(from == 'search' && this.designColumn[i].queryConditionConfig && this.designColumn[i].queryConditionConfig.type) {
          type = this.designColumn[i].queryConditionConfig.type
          itemObj = this.designColumn[i].queryConditionConfig
          key = this.designColumn[i].queryConditionConfig.prop
        }else{
          type = this.designColumn[i].componentType
          itemObj = this.designColumn[i]
          key = this.designColumn[i].aliasColumnName
        }
        // console.log(itemObj)
        switch(type) {
          case 'inputNumber':
            if(itemObj.isFloat == true) {
              obj[key] = 1.0001;
            }else{
              obj[key] = 1;
            }
            break;
          case 'input':
            obj[key] = "";
            break;
          case 'timePicker':
            if(itemObj.isrange) {
              obj[key] = ["10:00:00", "12:00:00"];
            }else{
              obj[key] = "10:00:00";
            }
            break;
          case 'datePicker':
            if(['daterange','datetimerange', 'monthrange'].indexOf(itemObj.datetype) > -1) {
              if(itemObj.datetype == 'daterange') {
                obj[key] = ["2021-04-23", "2021-04-24"]
              }
              if(itemObj.datetype == 'datetimerange') {
                obj[key] = ["2021-04-23 10:00:00", "2021-04-24 10:00:00"]
              }
              if(itemObj.datetype == 'monthrange') {
                obj[key] = ["2021-04", "2021-05"]
              }
            }else{
              obj[key] = "2021-04-23";
            }
            break;
          case 'timeSelect':
            obj[key] = "10:00";
            break;
          case 'switch':
            obj[key] = false;
            break;
          case 'select':
          case 'role':
          case 'user':
          case 'post':
            if(itemObj.multiple) {
              obj[key] = []
            }else{
              obj[key] = ""
            }
            break;
          case 'checkbox':
            obj[key] = []
            break;
          case 'department':
          case 'cascader':
          case 'chinaArea':
            if(itemObj.multiple) {
              if(itemObj.emitPath) {
                obj[key] = [ [1,2,3], [1,2,4] ]
              }else{
                obj[key] = [3, 4]
              }
            }else{
              if(itemObj.emitPath) {
                obj[key] = [1,2,3]
              }else{
                obj[key] = 3
              }
            }
            break;
          default :
            obj[key] = "";
            break;
        }
      }
      if(from == 'search') {
        return obj
      }else{
        this.defaultSubShowData = obj
      }
    },
    // 查看数据结构
    viewDataJson () {
      this.genDefaultData()
      this.queryDataString = this.genDefaultData('search') //JSON.parse(JSON.stringify(this.defaultSubShowData))
      this.queryDataString.size = 20
      this.queryDataString.current = 1
      // 表格数据  格式
      this.pageDataString = {
        records: JSON.parse(JSON.stringify([this.defaultSubShowData])),
        current: 1,
        total: 0
      }
      this.viewDataVisible = true
    },
    viewDataClose () {
      this.viewDataVisible = false
    },
    // 打开地址设置
    setHttpHandle () {
      if(this.designData && this.designData.dataPage && this.designData.dataPage.http) {
        this.httpData = {
          http: JSON.parse(JSON.stringify(this.designData.dataPage.http))
        }
      }
      this.dialogVisible = true
    },
    httpClose () {
      this.dialogVisible = false
    },
    submitHandle (form) {
      this.$set(this.designData.dataPage, 'http', form.http)
      this.httpClose()
    },
    // editor赋值
    changeHandle (code) {
      this.$set(this.designData.dataPage, 'customizeJsqlJson', code)
    },
  }
}
</script>
<style lang="scss">
.design-box{
  position: relative;
  margin-top: 10px;
  height: calc(100% - 55px);
  background: #fff;
  .design-box-top{
    position: absolute;
    top: 17px;
    right: 20px;
    width: 50%;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
  }
  .deign-box-content{
    border: 0;
    .table-form{
      .el-card {
        border: 0;
      }
    }
    .el-card__body{
      padding: 10px;
      .el-tabs__content{
        overflow: auto;
        height: calc(100vh - 150px);
      }
    }
    .table-body-box{
      padding: 0;
    }
  }
}
.preview-no-header-dialog{
  .el-dialog__header{
    height: 0!important;
    padding: 0!important;
    .el-dialog__headerbtn{
      z-index: 1;
    }
  }
  .el-dialog__header::before, .el-dialog__header::after{
    display: none!important;
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
    .table-show{
      height: 100%;
      .jvs-table{
        height: 100%;
      }
    }
  }
  .jvs-table{
    .jvs-table-top{
      border: 0;
    }
  }
}
.jsql-codeEditor{
  width: 100%;
  height: 500px;
  position: relative;
}
.json-show-dialog{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      width: 100%;
      padding: 20px 10px;
      padding-top: 0;
      position: unset;
      box-sizing: border-box;
      .row{
        display: flex;
        justify-content: space-between;
        >div{
          width: 49%;
        }
      }
    }
  }
}
</style>
