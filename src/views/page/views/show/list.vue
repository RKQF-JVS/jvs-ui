<template>
  <div class="table-show">
    <!-- 无权限 -->
    <div v-if="!permission" class="permission">
      <img src="@/const/img/permission.png" alt=""/>
    </div>
    <!-- 引用页面 -->
    <iframe v-if="iframepage && iframepage.address && iframepage.position == 'top'" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="auto" width="100%" :src="iframepage.address" :style="'height:'+(iframepage.height*clientHeight / 100 )+ 'px'"/>
    <jvs-table v-if="alreadLoad" refs="multipleTable" :loading="tableLoading" :pageheadertitle="menuName" :isClearSelect="isClearSelect" :page="page" :selectable="selectable" :option="option" :data="tableData" @on-load="getList" @selection-change="selectChange">
      <!-- 查询条件 -->
      <template slot="headerTop">
        <jvs-form class="search-form" v-if="query.length > 0" :option="searchOption" @submit="queryHandle"></jvs-form>
      </template>
      <!-- 顶部按钮 -->
      <template slot="menuLeft">
        <div style="display: flex;">
          <span v-for="(item, index) in topBtns" :key="item.name+index" style="margin:0 10px;display:flex;" v-show="$permissionMatch(item.permisionFlag) && showhidebutton(item, {}) && !(item.enable === false)">
            <el-upload
              v-if="item.type == 'btn_import' && $permissionMatch(item.permisionFlag)"
              class="upload-demo"
              :action="(item.preHttp && item.preHttp.url) ? item.preHttp.url : ''"
              :file-list="fileList"
              :on-success="uploadChangeHandle"
              :show-file-list="false"
              :disabled="!menuId"
            >
              <jvs-button size="mini">{{item.name}}</jvs-button>
            </el-upload>
            <!-- <jvs-button size="mini" style="margin: 0 10px;" v-if="item.type == 'IMPORT'"  @click="btnClickHandle(null, index, 'exportmodel')">导出模板</jvs-button> -->
            <jvs-button size="mini" :icon="item.type === 'btn_add' ? 'el-icon-plus' : ''" v-if="item.type !== 'btn_import'" @click="btnClickHandle(null, index, item)">{{item.name}}</jvs-button>
          </span>
        </div>
      </template>
      <!-- 顶部sql统计 -->
      <template slot="menuRight" :style="'display:flex;'">
        <el-alert
          v-for='(item,index) in customStatistics'
          :key="index+item.name"
          :closable='false'
          :center='true'
          style='width:200px;margin:0 0px 0px 10px;float:right;background: none;padding:0;'
          :title="item.name+':'+ item.sql "
          type="success">
        </el-alert>
      </template>
      <!-- 行内按钮 -->
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" v-for="(item, index) in lineBtns" :key="item.name+index" v-show="(true || $permissionMatch(item.permisionFlag)) && showhidebutton(item, scope.row) && !(item.enable === false)" @click="btnClickHandle(scope.row, scope.index, item)">{{item.name}}</jvs-button>
      </template>
      <!-- 标签插槽 -->
      <template v-for="(item, key) in getSlotData(option.column)" :slot="item.prop" slot-scope="scope">
        <el-tag size="mini" :key="key" :color="item.backColor"><span :style="`color: ${item.color}`">{{scope.row[item.prop]}}</span></el-tag>
      </template>
    </jvs-table>
    <!-- 引用页面 -->
    <iframe v-if="iframepage && iframepage.address && iframepage.position == 'bottom'" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="auto" width="100%" :src="iframepage.address" :style="'height:'+(iframepage.height*clientHeight / 100 )+ 'px'"/>
    <!-- 表单 -->
    <el-dialog
      :title="formTitle"
      v-if="formVisible"
      :visible.sync="formVisible"
      :fullscreen="(formType == 'normalForm' || formType == 'detailForm') ? formOption.fullscreen: false"
      :class="{'form-fullscreen-dialog':(formType == 'normalForm' || formType == 'detailForm') ? (formOption.fullscreen ? hasTabItem(formOption.fullscreen) : formOption.fullscreen): true}"
      append-to-body
      :before-close="handleCloseForm">
      <jvs-form v-if="formType == 'normalForm' || formType == 'detailForm'" :option="formOption" :formData="formData" :rowData="rowData" @submit="formSubmit">
        <!-- 自定义按钮 -->
        <template slot="formButton" v-if="formOption.flag">
          <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
        </template>
      </jvs-form>
      <jvs-form-level v-if="formType == 'multiLevelForm'" :option="formOption" :formData="formData" @submit="formSubmit">
      </jvs-form-level>
    </el-dialog>
  </div>
</template>
<script>
import {getTableInfo, sendRequire, sendMyRequire, getKeyValue} from '../../api/list'
import {delSingleData, getDesignTableInfo, getSingleData, previewPage} from '../../api/design'
import {getSystemDictItems} from '@/api/newDesign'
import {getCrudDataPage, getStatistics} from '../../api/newDesign'
import pinyin from 'js-pinyin'
import {getFormInfo} from '../../api/formlist'
export default {
  props: {
    propData: {
      type: Object
    },
    infoData: {
      type: Object
    },
    menuForm: {
      type: Object
    }
  },
  data () {
    return {
      permission: true,
      menuId: '',
      data: {},
      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        // viewBtn: false,
        delBtn: false,
        search: true,
        showOverflow: true,
        cancal: false,
        column: [],
      },
      tableData: [],
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
      },
      selectable: false, // 是否可以多选
      // 查询条件配置
      queryParams: {},
      searchOption: {
        isSearch: true,
        cancal: false,
        submitBtnText: '查询',
        column: [],
        labelWidth: 'auto',
      },
      column: [], // 字段集
      topBtns: [], // 顶部按钮
      lineBtns: [], // 行内按钮
      fileList: [], // 导入 文件列表
      query: [], // 查询条件
      customStatistics: [], // 自定义统计
      iframepage: {}, // 嵌套页面
      clientHeight: 0,
      // 表单
      formType: '',
      formTitle: '',
      formVisible: false,
      formData: {},
      formOption: {
        column: []
      },
      action: '',
      // 默认请求
      developmentConfig: {},
      rowData: {}, // 行数据
      itemData: {}, // 当前按钮
      selectList: [], // 多选行数据
      isClearSelect: 0, // 是否清空选择, 随机数
      selectFormItems: [], // 表单里的下拉选择项
      // 2021-02-04 新版本
      menuName: '',
      preHttp: {},
      demoData: {}, // 示例数据
      hasService: false, // 是否有服务
      loadTimes: -1,
      alreadLoad: false,
      pathQuery: {},
      formDesignId: '', // 表单id
      dataId: '',
    }
  },
  created () {
    this.getKeyValueHandle()
    if(this.menuForm) {
      this.menuName = this.menuForm.menuName
    }
    // 在线
    this.initQueryInfo()
    // 预览
    if(this.propData) {
      this.data = this.propData
      this.init()
      this.menuName = this.data.menuName
    }
    this.clientHeight = document.documentElement.clientHeight
  },
  methods: {
    getSlotData(arr) {
      return arr.filter(item => {
        return item.backColor
      })
    },
    // 获取路由参数初始化
    initQueryInfo () {
      this.queryParams = {}
      this.page = {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [20, 50, 100, 200, 500, 1000]
      }
      if(this.$route.query && this.$route.query.id) {
        this.menuId = this.$route.query.id
        this.getDesignInfoHandle()
        this.pathQuery = JSON.parse(JSON.stringify(this.$route.query))
        // delete this.pathQuery['id']
      }
      // if(this.$route.query && this.$route.query.dataModelId) {
      //   this.getListData()
      // }
    },
    // 获取列表数据
    getListData() {
      this.tableLoading = true
      if (!this.menuId) {
        this.tableData = [this.demoData]
        this.page.total = 1
        this.tableLoading = false
        // this.statisticsHandle()   // 仅用于调试
      } else {
        let obj = {}
        obj.size = this.page.pageSize
        obj.current = this.page.currentPage
        for(let i in this.queryParams) {
          if(this.queryParams[i] || this.queryParams[i] === 0 || this.queryParams[i] === false || (typeof this.queryParams[i] == 'number')) {
            obj[i] = this.queryParams[i]
          }
        }
        if(this.data.dataPage && this.data.dataPage.http) {
          let tp = JSON.parse(JSON.stringify(this.data.dataPage.http))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          obj = Object.assign(obj, tp.parameters)
        }
        getCrudDataPage(obj, this.$route.query.dataModelId, this.$route.query.id).then(res => {
          let totalPage = 1
          if(res.data.code == 0 && res.data.data) {
            this.tableData = res.data.data.records
            this.page.total = res.data.data.total
            this.page.currentPage = res.data.data.current
            this.tableLoading = false
            totalPage = res.data.data.pages
          }
          if(this.page.total > 0 && this.tableData.length > 0) {
            if(Math.ceil(this.page.total / this.page.pageSize) !== Number.parseInt(totalPage)) {
              this.page.currentPage = 1
            }
          }else{
            this.page.currentPage = 1
          }
          this.$forceUpdate()
        })
      }
      },
    // 存在id时获取数据
    getDesignInfoHandle () {
      this.designColumn = []
      if (this.$route.query.isDeploy === 'true' || (this.infoData && this.infoData.isDeploy)) {
        getDesignTableInfo(this.menuId).then(res => {
          if(res.data.code == 0 && res.data.data) {
            const arr = [...res.data.data.buttons]
            this.topBtns = arr.filter(item => {
              return item.position === 'top'
            })
            this.upDataHandle(res.data.data)
            // this.menuName = res.data.data.menuName
            // this.hasService = res.data.data.hasService
            // this.getList()
            this.getListData()
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
        previewPage(this.menuId).then(res => {
          if(res.data.code == 0 && res.data.data) {
            if(res.data.code == 0 && res.data.data) {
              const arr = [...res.data.data.buttons]
              this.topBtns = arr.filter(item => {
                return item.position === 'top'
              })
              this.upDataHandle(res.data.data)
              // this.menuName = res.data.data.menuName
              // this.hasService = res.data.data.hasService
              // this.getList()
              this.getListData()
              this.$message.warning('该设计未发布')
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
      }
    },
    // 更新设计
    upDataHandle (data) {
      if(data.dataPage && !data.dataPage.headStatisticalData) {
        data.dataPage.headStatisticalData = []
      }
      if(data.dataPage && !data.dataPage.referencePages) {
        data.dataPage.referencePages = [
          {
            address: "",
            enable: false,
            height: 0,
            position: ""
          }
        ]
      }
      this.data = data
      this.init()
    },
    // 初始化
    init () {
      if(!this.data.dataPage) {
        return false
      }
      let tempList = JSON.parse(JSON.stringify(this.data.dataPage.autoTableFields))
      this.column = tempList

      // 按钮
      let tb = []
      let lb = []
      let isSelect = false
      let showMenu = false
      for(let i in this.data.buttons) {
        if(this.data.buttons[i].position == 'top') {
          tb.push(this.data.buttons[i])
          if(this.data.buttons.type == 'btn_export') {
            isSelect = true
          }
        }
        if(this.data.buttons[i].position == 'line') {
          lb.push(this.data.buttons[i])
          if(!(this.data.buttons[i].enable === false)) {
            showMenu = true
          }
        }
      }
      // 存在导出时，表格可多选
      // if(isSelect) {
      //   this.selectable = true
      // }
      // this.topBtns = tb
      this.lineBtns = lb
      this.option.menu = showMenu

      // 查询条件
      this.query = []
      // 顶部自定义统计
      this.customStatistics = []
      for(let h in this.data.dataPage.headStatisticalData) {
        if(this.data.dataPage.headStatisticalData[h].enable) {
          this.customStatistics.push({
            name: this.data.dataPage.headStatisticalData[h].name,
            sql: 'xxxxx'
          })
        }
      }
      // 嵌套页面
      this.iframepage = (this.data.dataPage.referencePages && this.data.dataPage.referencePages.length > 0) ? this.data.dataPage.referencePages[0] : {}
      this.formatTable()
      // 在线时才可调接口
      if(this.menuId) {
        // 分页查询
        this.getList()
      }
    },
    // 数据配置
    formatTable () {
      // 生成table配置
      this.getTableColumn()
    },
    // 格式化column
    async getTableColumn () {
      let temp = [] // 表格配置项
      let queryTemp = [] // 查询条件项
      let bool = false // 是否显示合计
      this.demoData = {}
      for(let i in this.column) {
        let obj = {
          label: this.column[i].showChinese,
          prop: this.column[i].aliasColumnName ? this.column[i].aliasColumnName : this.column[i].columnName,
          hide: !this.column[i].show,
          width: this.column[i].showWidth || 'auto'
        }
        // if(this.column[i].showWidth && this.option.menu && i < this.column.length-1) {
        //   obj.width = this.column[i].showWidth || 200
        // }
        if(this.column[i].componentType) {
          obj.type = this.column[i].componentType
        }
        this.demoData[obj.prop] = '示例'
        if(this.column[i].advancedSettings) {
          if(this.column[i].advancedSettings.textcolor) {
            obj.color = this.column[i].advancedSettings.textcolor
          }
          if(this.column[i].advancedSettings.backColor) {
            obj.backColor = this.column[i].advancedSettings.backColor
            if (obj.backColor) {
              obj.slot = true
            }
          }
          if(this.column[i].advancedSettings.dictionary) {
            obj.dicData = this.column[i].advancedSettings.dictionary
          }
          // 字典匹配
          if(this.column[i].advancedSettings.dictSource){
            switch(this.column[i].advancedSettings.dictSource) {
              case 'option':
                if(this.column[i].advancedSettings.dictionary) {
                  obj.dicData = this.column[i].advancedSettings.dictionary
                }
                break;
              case 'url':
                if(this.column[i].advancedSettings.dictionaryHttp) {
                  // 请求接口
                  let tp = JSON.parse(JSON.stringify(this.column[i].advancedSettings.dictionaryHttp))
                  if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                    tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                  }
                  if(tp && tp.url) {
                    await sendMyRequire(tp, tp.parameters).then(res => {
                      if(res.data.code == 0) {
                        obj.dicData = res.data.data
                        let propsTemp = {
                          label: 'label',
                          value: 'value'
                        }
                        if(this.column[i].advancedSettings.dictLabelFieldName) {
                          propsTemp.label = this.column[i].advancedSettings.dictLabelFieldName
                        }
                        if(this.column[i].advancedSettings.dictValueFieldName) {
                          propsTemp.value = this.column[i].advancedSettings.dictValueFieldName
                        }
                        obj.props = propsTemp
                      }
                    })
                  }
                }
                break;
              case 'system':
                if(this.column[i].advancedSettings.dictionaryUniqId) {
                  // 拉取数据
                  await getSystemDictItems(this.column[i].advancedSettings.dictionaryUniqId).then(res => {
                    if(res.data.code == 0 && res.data.data) {
                      obj.dicData = res.data.data
                    }
                  })
                }
                break;
              default: break;
            }
          }
          if(obj.type == 'image') {
            obj.width = this.column[i].advancedSettings.width < 80 ? 80 : this.column[i].advancedSettings.width
            obj.height = this.column[i].advancedSettings.height < 80 ? 80 :this.column[i].advancedSettings.height
          }
          if(obj.type == 'link') {
            obj.openType = this.column[i].advancedSettings.openType
            obj.text = this.column[i].advancedSettings.text
          }
          // 动态控制
          if(this.column[i].advancedSettings.expressControl) {
            obj.expressControl = this.column[i].advancedSettings.expressControl
          }
        }
        // 日期  时间 配置
        if(this.column[i].componentType == 'datePicker' || this.column[i].componentType == 'timePicker') {
          obj.datetype = this.column[i].dataType
          switch(this.column[i].dbJavaType) {
            case 'field_date_time':
              obj.datetype = 'datetime';
              obj.format = "yyyy-MM-dd hh:mm:ss";
              obj.valueFormat = "yyyy-MM-dd hh:mm:ss";
              break;
            case 'field_date':
              obj.datetype = 'date';
              obj.format = "yyyy-MM-dd";
              obj.valueFormat = "yyyy-MM-dd";
              break;
            case 'field_time':
              obj.format = "HH:mm:ss";
              obj.valueFormat = "HH:mm:ss";
              break;
            default : obj.datetype = 'datetime';
              obj.format = "yyyy-MM-dd hh:mm:ss";
              obj.valueFormat = "yyyy-MM-dd hh:mm:ss";
              break;
          }
        }
        temp.push(obj)
        if(this.column[i].enableStatistics == true) {
          bool = true
        }
        // 查询条件
        if(this.column[i].enableQuery) {
          queryTemp.push(this.column[i])
        }
      }
      this.option.column = temp
      this.option.showsummary = bool
      this.query = queryTemp
      // console.log(queryTemp)
      // 生成查询条件配置
      this.getQueryColumn()
      this.alreadLoad = true
      this.$forceUpdate()
    },
    // 格式化查询条件
    getQueryColumn () {
      let temp = []
      for(let i in this.query) {
        // 自定义了查询条件
        if(this.query[i].queryConditionConfig && this.query[i].queryConditionConfig.type) {
          temp.push(this.query[i].queryConditionConfig)
          this.queryParams[this.query[i].queryConditionConfig.prop] = null
        }else{
          let fitem = this.$store.state.labelValue.fieldTypeMore[this.query[i].dbJavaType]
          let name = ""
          if(this.query[i].showChinese) {
            name = pinyin.getFullChars(this.query[i].showChinese)
            name = name[0].toLowerCase() + name.slice(1, name.length)
          }
          let obj = {
            label: this.query[i].showChinese,
            prop: this.query[i].aliasColumnName ? this.query[i].aliasColumnName : name,
            span: 5,
          }
          if(fitem) {
            obj.type = fitem.componentType
          }
          if(obj.type == 'SWITCH') {
            obj.type = 'switch'
          }
          if(obj.type == 'user') {
            obj.allowinput = false
          }
          let endObj = {
            label: '~',
            prop: (this.query[i].aliasColumnName ? this.query[i].aliasColumnName : name) +'End',
            span: 5,
            placeholder: this.query[i].showChinese
          }
          if(this.query[i].sqlKeyword == 'BETWEEN') {
            obj.prop = (this.query[i].aliasColumnName ? this.query[i].aliasColumnName : name) + 'Start'
          }
          // 下拉框
          if(obj.type == 'select') {
            if(this.query[i].advancedSettings) {
              if(this.query[i].advancedSettings.dictionary) {
                obj.dicData = this.query[i].advancedSettings.dictionary
              }
            }
            if(this.query[i].queryDataOrigin) {
              if(this.query[i].queryDataOrigin.type) {
                switch (this.query[i].queryDataOrigin.type) {
                  case 'data_origin_request' :
                    // 挂载时发送请求
                    if(this.menuId) {
                      obj.dicUrl = this.query[i].queryDataOrigin.http.url;
                      obj.url = this.query[i].queryDataOrigin.http.url;
                      obj.dicUrlHttp = this.query[i].queryDataOrigin.http;
                    }
                    break;
                  case 'data_origin_sql' :
                    obj.dicSql = this.query[i].queryDataOrigin.sql;
                    break;
                  case 'data_origin_js' :
                    obj.dicJS = this.query[i].queryDataOrigin.js;
                    break;
                  default : break;
                }
              }
            }
            // 配置props
            obj.props = {
              label: 'label',
              value: 'value'
            }
            if(this.query[i].associatedFields) {
              obj.props.value = this.query[i].associatedFields.columnName
            }
            if(this.query[i].displayField) {
              obj.props.label = this.query[i].displayField.columnName
            }
          }
          // 日期  时间 配置
          if(obj.type == 'datePicker' || obj.type == 'timePicker') {
            obj.datetype = this.query[i].dataType
            switch(this.query[i].dbJavaType) {
              case 'field_date_time':
                obj.datetype = 'datetime';
                obj.format = "yyyy-MM-dd hh:mm:ss";
                obj.valueFormat = "yyyy-MM-dd hh:mm:ss";
                break;
              case 'field_date' :
                obj.datetype = 'date';
                obj.format = "yyyy-MM-dd";
                obj.valueFormat = "yyyy-MM-dd";
                break;
              case 'field_time' :
                obj.format = "HH:mm:ss";
                obj.valueFormat = "HH:mm:ss";
                break;
              default : obj.datetype = 'datetime';
                obj.format = "yyyy-MM-dd hh:mm:ss";
                obj.valueFormat = "yyyy-MM-dd hh:mm:ss";
                break;
            }
          }
          temp.push(obj)
          if(this.query[i].sqlKeyword == 'BETWEEN') {
            temp.push(endObj)
          }
          this.queryParams[this.query[i].aliasColumnName] = null
        }
      }
      this.searchOption.column = temp
    },
    // 表单配置
    getFormColumn (type, item) {
      if(item.form.formdata && item.form.formdata.length > 0) {
        // 兼容历史设计数据
        this.formatFormItem(item.form.formdata)
        if(type == 'normalForm' || type == 'detailForm') {
          this.formOption = this.formatFormOption(type, item.form.formdata[0].forms, item.form.formdata[0].formsetting)
        }else{
          let ct = []
          for(let i in item.form.column) {
            let obj = {
              defaultData: item.form.column[i].defaultData,
              formOption: {},
              label: item.form.column[i].label,
              name: item.form.column[i].name,
              show: item.form.column[i].show || true
            }
            obj.formOption = {
              btnSetting: item.form.formdata[i].formsetting.btnSetting,
              size: item.form.formdata[i].formsetting.formsize,
              formAlign: item.form.formdata[i].formsetting.labelposition,
              labelWidth: item.form.formdata[i].formsetting.labelwidth + '',
              column: item.form.formdata[i].forms,
            }
            ct.push(obj)
          }
          this.formOption = {
            type: 'card',
            column: ct,
            formdata: item.form.formdata
          }
        }
      }else{
        this.formOption = {
          btnHide: true,
          column: []
        }
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
        cancal: false,
        flag: formsetting.flag,
        submitBtn: formsetting.submitBtn,
        emptyBtn: formsetting.emptyBtn
      }
      if(type == 'detailForm') {
        temp.disabled = true
        temp.btnHide = true
      }else{
        temp.disabled = false
        temp.btnHide = false
      }
      return temp
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
    // 获取select项，表单值为数组
    getSelectItem (list) {
      let temp = []
      for(let i in list) {
        for(let j in list[i].forms) {
          if(list[i].forms[j].type == 'select' && list[i].forms[j].multiple) {
            temp.push(list[i].forms[j].prop)
          }
        }
      }
      this.selectFormItems = temp
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
    // 动态显示按钮
    showhidebutton (item, rowData) {
      let bool = true
      if(item.expressControl) {
        var str = item.expressControl
        str = str.replace(/\$\{/g,"row.")
        str = str.replace(/}/g, "")
        let row = rowData
        if(eval(str)) {
          bool = true
        }else{
          bool = false
        }
      }
      return bool
    },




    // 表格分页查询
    getList (page) {
      if(!this.menuId || this.hasService == false) {
        this.tableData = [this.demoData]
        this.page.total = 1
        this.tableLoading = false
        // this.statisticsHandle()   // 仅用于调试
      }else{
        let obj = {}
        obj.size = this.page.pageSize
        obj.current = this.page.currentPage
        for(let i in this.queryParams) {
          if(this.queryParams[i] || this.queryParams[i] === 0 || this.queryParams[i] === false || (typeof this.queryParams[i] == 'number')) {
            obj[i] = this.queryParams[i]
          }
        }
        if(this.data.dataPage && this.data.dataPage.http) {
          let tp = JSON.parse(JSON.stringify(this.data.dataPage.http))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          obj = Object.assign(obj, tp.parameters)
          sendMyRequire(tp, obj).then(res => { // Object.assign(obj, this.pathQuery)
            let totalPage = 1
            if(res.data.code == 0 && res.data.data) {
              this.tableData = res.data.data.records
              this.page.total = res.data.data.total
              this.page.currentPage = res.data.data.current
              this.tableLoading = false
              totalPage = res.data.data.pages
            }
            if(this.page.total > 0 && this.tableData.length > 0) {
              if(Math.ceil(this.page.total / this.page.pageSize) !== Number.parseInt(totalPage)) {
                this.page.currentPage = 1
              }
            }else{
              this.page.currentPage = 1
            }
            this.$forceUpdate()
          })
        }
        // 统计
        this.statisticsHandle()
      }
    },
    // 条件查询
    queryHandle (form) {
      this.queryParams = form
      this.getListData()
    },
    // 多选
    selectChange (data) {
      this.selectList = data
    },
    // 统计查询
    statisticsHandle () {
      if(this.data.dataPage && this.data.dataPage.headStatisticalData && this.data.dataPage.headStatisticalData.length > 0) {
        let list = this.data.dataPage.headStatisticalData
        for(let i in list) {
          if(this.loadTimes === -1 || (this.loadTimes > -1 && list[i].syncQuery)) {
            // 网络请求
            if(list[i].type == 'data_origin_request') {
              if(list[i].http && list[i].http.url) {
                let tp = JSON.parse(JSON.stringify(list[i].http))
                tp.requestContentType  && (tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType])
                sendMyRequire(tp, tp.parameters).then(res => {
                  if(res.data.code == 0) {
                    this.customStatistics[i].sql = res.data.data
                  }
                })
              }
            }
            // sql
            if(list[i].type == 'data_origin_sql') {
              if(list[i].sql) {
                let to = {}
                if(list[i].syncQuery) {
                  to = Object.assign({}, this.queryParams)
                }
                getStatistics(this.menuId, list[i].statisticsCode, to).then(res => {
                  if(res.data.code == 0) {
                    this.customStatistics[i].sql = res.data.data[list[i].name]
                  }
                })
              }
            }
            // 逻辑引擎
            if(list[i].type == 'data_origin_rule') {
              if(list[i].rule && list[i].rule.ruleId) {
                let tp = {
                  httpMethod: "GET",
                  parameters: {},
                  requestContentType: "FORM_URLENCODED",
                  responseContentType: "JSON",
                  url: `/api/rule/run/${list[i].rule.ruleId}`,
                }
                tp.requestContentType  && (tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType])
                sendMyRequire(tp, tp.parameters).then(res => {
                  if(res.data.code == 0) {
                    this.customStatistics[i].sql = res.data.data
                  }
                })
              }
            }
          }
        }
      }
      this.loadTimes++
    },
    // 按钮点击事件
    async btnClickHandle (row, index, item) {
      if (row && row.id) {
        this.dataId = row.id
        this.rowData = JSON.parse(JSON.stringify(row))
      } else {
        this.dataId = null
      }
      this.formDesignId = item.formId
      // 预览模式不发请求
      // if(!this.menuId) {
      //   return false
      // }
      this.itemData = item
      // // 导出模板
      // if(item.type == 'btn_download_template') {
      //   if(this.developmentConfig.defaultDownloadExportTemplateUri) {
      //     this.$openUrl(this.developmentConfig.defaultDownloadExportTemplateUri, '_self')
      //   }
      // }else{
        // 表单
        if(['btn_add', 'btn_modify', 'btn_detail', 'btn_form'].indexOf(item.type) > -1) {
          await getFormInfo(item.formId).then(res => {
            if(res.data.code == 0) {
              if(res.data.data.viewJson) {
                item.form = JSON.parse(res.data.data.viewJson)
              }
            }
          })
          if(!item.form || !item.form.formdata) {
            return false
          }
          this.getSelectItem(item.form.formdata)
          this.formTitle = item.name
          this.formType = item.form.formType
          this.getFormColumn(item.form.formType, item)
          // 修改  详情
          if(item.type == 'btn_modify' || item.type == 'btn_detail'){
            // 修改
            if(item.type == 'btn_modify') {
              // 普通表单
              if(item.form.formType == 'normalForm') {
                if(this.menuId) {
                  // 无服务状态
                  if(this.hasService == false) {
                    getSingleData(this.$route.query.dataModelId, row.id).then(res => {
                      if (res.data && res.data.code == 0) {
                        this.formData = res.data.data
                        this.formVisible = true
                      }
                    })
                  }else{
                    // 回显
                    if(item.form.formdata && item.form.formdata[0].formsetting.dataEchoRequest && item.form.formdata[0].formsetting.dataEchoRequest.url){
                      let tp = JSON.parse(JSON.stringify(item.form.formdata[0].formsetting.dataEchoRequest))
                      if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                        tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                      }
                      let trow = JSON.parse(JSON.stringify(row))
                      // 挂载时发送请求
                      if(this.menuId) {
                        if(tp.url) {
                          sendMyRequire(tp, Object.assign(trow, tp.parameters)).then(res => {
                            if(res.data.code == 0) {
                              this.formData = JSON.parse(JSON.stringify(res.data.data))
                              this.formVisible = true
                            }
                          })
                        }
                      }
                    }else{
                      this.formVisible = true
                    }
                  }
                }else{
                  this.formData = this.demoData
                  // console.log(this.formData )
                  this.formVisible = true
                }
              }
              // 多级表单
              else{
                let tempData = {}
                if(this.menuId) {
                  for(let i in item.form.formdata) {
                    let itemUrl = ''
                    let itemObj = {}
                    if(item.form.formdata[i].formsetting.echoUrl) {
                      itemUrl = item.form.formdata[i].formsetting.echoUrl
                    }
                    if(itemUrl) {
                      this.getItemForm(itemUrl, row, itemObj)
                    }
                    tempData[item.form.column[i].name] = itemObj
                  }
                }
                this.formData = tempData
                this.formVisible = true
              }
            }else{
              // 详情
              // 回显
              // 挂载时发送请求
              if(this.menuId) {
                // 无服务状态
                if(this.hasService == false) {
                  getSingleData(this.$route.query.dataModelId, row.id).then(res => {
                    if (res.data && res.data.code == 0) {
                      this.formData = res.data.data
                      this.formVisible = true
                    }
                  })
                }else{
                  if(item.form.formdata && item.form.formdata[0].formsetting.dataEchoRequest && item.form.formdata[0].formsetting.dataEchoRequest.url){
                      let tp = JSON.parse(JSON.stringify(item.form.formdata[0].formsetting.dataEchoRequest))
                    if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                      tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                    }
                    let tob = JSON.parse(JSON.stringify(row))
                    sendMyRequire(tp, Object.assign(tob, tp.parameters)).then(res => {
                      if(res.data.code == 0) {
                        this.formData = res.data.data
                        this.formVisible = true
                      }
                    })
                  }
                }
              }else{
                this.formData = this.demoData
                this.formVisible = true
              }
            }
          }else{
            if(this.hasService == false) {
              this.formData = {}
              this.formVisible = true
            }else{
              // 回显
              if(item.form.formdata && item.form.formdata[0].formsetting.dataEchoRequest && item.form.formdata[0].formsetting.dataEchoRequest.url){
                let tp = JSON.parse(JSON.stringify(item.form.formdata[0].formsetting.dataEchoRequest))
                if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                  tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                }
                // 挂载时发送请求
                if(this.menuId) {
                  let trow = {}
                  if(row) {
                    trow = JSON.parse(JSON.stringify(row))
                  }
                  sendMyRequire(tp, Object.assign(trow, tp.parameters)).then(res => {
                    if(res.data.code == 0) {
                      this.formData = res.data.data
                      this.formVisible = true
                    }
                  })
                }
              }else{
                this.formData = {}
                this.formVisible = true
              }
            }
          }
        }else{
          if(!this.menuId) {
            return false
          }
          // 删除
          if(item.type == 'btn_delete') {
            let bool = false
            if(this.tableData.length == 1) {
              bool = true
            }
            this.$confirm('确认删除？').then(_ => {
              if(item.preHttp && item.preHttp.url && item.preHttp.httpMethod && item.preHttp.requestContentType) {
                let tp = JSON.parse(JSON.stringify(item.preHttp))
                if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                  tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                }
                let tob = JSON.parse(JSON.stringify(row))
                sendMyRequire(tp, Object.assign(tob, tp.parameters)).then(res => {
                  if(res.data.code == 0) {
                    this.$message.success("删除成功")
                    if(bool) {
                      this.page.currentPage -= 1
                    }
                    // this.getList()
                    this.getListData()
                  }
                })
              } else {
                delSingleData(this.$route.query.dataModelId, row.id, this.$route.query.id).then(res => {
                  if (res.data && res.data.code == 0) {
                    this.$message.success("删除成功")
                    if(bool) {
                      this.page.currentPage -= 1
                    }
                    this.getListData()
                  }
                })
              }
            }).catch(_ => {})
          }
          // 网络请求
          if(item.type == 'btn_network_request') {
            let tp = JSON.parse(JSON.stringify(item.netHttp))
            if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
              tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
            }
            let pa = JSON.parse(JSON.stringify(row))
            pa = Object.assign(pa, tp.parameters)
            sendMyRequire(tp, pa).then(res => {
              if(res.data.code == 0) {
                this.getList()
              }
            })
          }else{
            // 导出模板 导出
            if(['btn_download_template', 'btn_export'].indexOf(item.type) > -1 && item.preHttp) {
              if(item.preHttp.url) {
                if(item.preHttp.httpMethod == 'GET') {
                  let pstring = ''
                  let tarr = []
                  if(item.preHttp.parameters) {
                    for(let p in item.preHttp.parameters) {
                      tarr.push(p + '=' + item.preHttp.parameters[p])
                    }
                    if(tarr.length > 0) {
                      pstring += '?'
                      pstring += tarr.join('&')
                    }
                  }
                  if(this.queryParams) {
                    let trr = []
                    for(let tr in this.queryParams) {
                      trr.push(tr+ '=' + this.queryParams[tr])
                    }
                    if(trr.length > 0) {
                      if(tarr.length == 0) {
                        pstring += '?'
                      }
                      pstring += trr.join('&')
                    }
                  }
                  this.$openUrl(item.preHttp.url + pstring, '_self')
                }else{
                  let tp = JSON.parse(JSON.stringify(item.preHttp))
                  if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
                    tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
                  }
                  sendMyRequire(tp, tp.parameters).then(res => {
                    if(res.data.code == 0) {
                      // console.log(res.data.data)
                    }
                  })
                }
              }
            }
            // 下载模板
            if(item.type == 'btn_download_template') {
              if(item.preHttp && item.preHttp.url) {
                this.$openUrl(item.preHttp.url, '_self')
              }
            }
            // 外链 内嵌 地址
            if(["btn_embedded_address", "btn_external_link_address"].indexOf(item.type) > -1) {
              if(item.address) {
                this.$openUrl(item.address, item.type == 'btn_embedded_address' ? '_self' : '_blank')
              }
            }
          }
        }
      // }
    },
    // 上传
    uploadChangeHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.getList()
      }
    },
    // 关闭表单
    handleCloseForm () {
      this.formVisible = false
    },
    // 表单提交
    formSubmit (formsdata) {
      if(!this.menuId) {
        return false
      }
      let form = null // 表单数据
      let url = ''
      let method = ''
      let msg = ''
      let tp = null
      const dataModelId = this.$route.query.dataModelId
      const designId = this.formDesignId
      // 普通表单
      if(this.itemData.form.formType == 'normalForm') {
        form = formsdata
        const http = {
          httpMethod: "POST",
          requestContentType: "application/json",
          responseContentType: "JSON",
          url: this.dataId ? `/mgr/jvs-design//dynamic/data/update/${dataModelId}/${this.dataId}` : `/mgr/jvs-design//dynamic/data/save/${dataModelId}`,
          headers: {
            'designId': designId,
            'operator': encodeURI('提交')
          }
        }
        if(this.itemData.form.formdata && this.itemData.form.formdata[0] && this.itemData.form.formdata[0].formsetting) {
          tp = JSON.parse(JSON.stringify(http))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
        }
        // if(this.itemData.form.formdata && this.itemData.form.formdata[0] && this.itemData.form.formdata[0].formsetting && this.itemData.form.formdata[0].formsetting.dataSubmissionRequest) {
        //   tp = JSON.parse(JSON.stringify(this.itemData.form.formdata[0].formsetting.dataSubmissionRequest))
        //   if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
        //     tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        //   }
        // }
      }
      // 多级表单
      else{
        if(formsdata.url) {
          url = formsdata.url
        }
        form = formsdata.form
      }
      switch (this.itemData.type){
        case 'btn_add': //'SAVE':
          method = 'post';
          msg = '新增成功';
          break;
        case 'btn_modify': //'EDIT':
          method = 'put';
          msg = '修改成功';
          break;
        case 'btn_form': //'FORM':
          msg = '';
          if(this.itemData.position == 'top') {
            method = 'post';
          }else{
            method = 'put';
          };
          break;
        default : ;break;
      }
      if(tp) {
        let tempObj = JSON.parse(JSON.stringify(form))
        sendMyRequire(tp, Object.assign(tempObj, tp.parameters)).then(res => {
           if(res.data.code == 0) {
            if(msg) {
              this.$message.success(msg)
            }else{
              if(res.data.msg) {
                this.$message.success(res.data.msg)
              }
            }
            this.getListData()
            // this.getList()
            this.handleCloseForm()
          }
        })
      }
    },
    // 自定义按钮事件
    slotbtnClickHandle (row, index) {
      let tp = null
      tp = JSON.parse(JSON.stringify(row))
      if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
        tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
      }
      if(tp && tp.url) {
        let tob = JSON.parse(JSON.stringify(this.formData))
        sendMyRequire(tp, Object.assign(tob, tp.parameters)).then(res => {
           if(res.data.code == 0) {
            if(res.data.msg) {
              this.$message.success(res.data.msg)
            }
            this.getList()
            this.handleCloseForm()
          }
        })
      }
      // if(row.url) {
      //   sendRequire(row.url, 'post', this.formData).then(res => {
      //     this.$message.success(res.data.msg)
      //     this.getList()
      //   })
      // }
    },
    // 同步获取数据
    async getItemForm (itemUrl, row, itemObj) {
      await sendRequire(itemUrl, 'get', row).then(res => {
        if(res.data.code == 0) {
          itemObj = res.data.data
        }
      })
    },
    // 兼容历史设计数据
    formatFormItem (formdata) {
      for(let i in formdata) {
        if(formdata[i].forms) {
          for(let j in formdata[i].forms) {
            let item = this.getItemByValOfArr(formdata[i].forms[j].prop, 'aliasColumnName', formdata[i].autoTableFields)
            // 字典 来源 和 配置
            if(formdata[i].forms[j].url || formdata[i].forms[j].dicUrl) {
              if(this.menuId) {
                formdata[i].forms[j].dicUrl = formdata[i].forms[j].url
              }else{
                formdata[i].forms[j].dicUrl = ''
                formdata[i].forms[j].url = ''
              }
              if(item) {
                if(!formdata[i].forms[j].props) {
                  formdata[i].forms[j].props = {
                    label: '',
                    value: ''
                  }
                }
                if(!formdata[i].forms[j].props.label && item.displayField) {
                  formdata[i].forms[j].props.label = item.displayField.columnName
                }
                if(!formdata[i].forms[j].props.value && item.associatedFields) {
                  formdata[i].forms[j].props.value = item.associatedFields.columnName
                }
              }
            }else{
              formdata[i].forms[j].props = {
                label: 'label',
                value: 'value'
              }
            }
            if(formdata[i].forms[j].type == 'select') {
              // 单选 多选
              if(item.correspondence == "ONE_TO_N") {
                formdata[i].forms[j].multiple = true
              }else{
                formdata[i].forms[j].multiple = false
              }
            }
            // 日期  时间 配置
            if(formdata[i].forms[j].type == 'datePicker' || formdata[i].forms[j].type == 'timePicker') {
              if(item) {
                formdata[i].forms[j].datetype = item.dataType
                if(item) {
                  switch(item.dbJavaType) {
                    case 'field_date_time':
                      formdata[i].forms[j].datetype = 'datetime';
                      formdata[i].forms[j].format = "yyyy-MM-dd hh:mm:ss";
                      formdata[i].forms[j].valueFormat = "yyyy-MM-dd hh:mm:ss";
                      break;
                    case 'field_date':
                      formdata[i].forms[j].datetype = 'date';
                      formdata[i].forms[j].format = "yyyy-MM-dd";
                      formdata[i].forms[j].valueFormat = "yyyy-MM-dd";
                      break;
                    case 'field_time':
                      formdata[i].forms[j].format = "HH:mm:ss";
                      formdata[i].forms[j].valueFormat = "HH:mm:ss";
                      break;
                    default : formdata[i].forms[j].datetype = 'datetime';
                      formdata[i].forms[j].format = "yyyy-MM-dd hh:mm:ss";
                      formdata[i].forms[j].valueFormat = "yyyy-MM-dd hh:mm:ss";
                      break;
                  }
                }
              }
            }
            if(formdata[i].forms[j].type == 'user') {
              formdata[i].forms[j].allowinput = false
            }
            // 只读文本
            // if(formdata[i].forms[j].type == 'inputReadOnly') {
            //   console.log(formdata[i].forms[j])
            // }
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
      return bool // result
    }
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
<style lang="scss">
.table-show{
  .permission{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    img {
      height: 40vh;
    }
  }
  .table-top{
    .table-top-left{
      // margin: 10px 0;
    }
    .table-top-right{
      flex-wrap: wrap;
    }
  }
}

</style>
