<template>
  <div class="table-info-form">
    <tableForm :option="option" :data="tableData"
      @showChineseChange="noticeGetColumn"
      @dbJavaTypeChange="noticeGetColumn"
      @columnNameChange="noticeGetColumn"
      @columnCommentChange="noticeGetColumn"
      @dataTypeChange="noticeGetColumn"
      @showChange="noticeGetColumn"
      @enableQueryChange="enableQueryChange"
      @enableSortChange="enableSortChange"
      @aliasColumnNameChange="aliasColumnNameChange"
    >
      <template slot="menuBtn" slot-scope="scope">
        <div>
          <!-- <jvs-button type="text" v-if="scope.row.columnName != 'id' && scope.row.disabled !== true" @click="deleteRow(scope.row, scope.index)">删除</jvs-button> -->
          <jvs-button v-if="false" type="text" @click="seniorSet(scope.row, scope.index, 'senior')">高级</jvs-button>
<!--          <jvs-button type="text" :style="!scope.row.columnRemark ? 'color: #c0c4cc;' : ''" @click="seniorSet(scope.row, scope.index, 'remark')">备注</jvs-button>-->
          <jvs-button type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
        </div>
      </template>
      <!-- 数据表  字段 -->
      <template slot="tableNameColumnNameItem" slot-scope="scope">
        <el-cascader
          v-model="scope.row.tableNameColumnName"
          :options="tableOptionTree"
          :props="{ expandTrigger: 'hover'}"
          :show-all-levels="false"
          filterable
          @change="tableNameColumnNameChange(scope.row, scope.index)">
          <template slot-scope="{ node, data }">
            <span>{{ data.value }}</span>
            <span style="float:right;">{{ data.columnComment}}</span>
          </template>
        </el-cascader>
      </template>
      <!-- 显示设置 -->
      <template slot="showsetItem" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="seniorSet(scope.row, scope.index, 'senior')">配置</jvs-button>
      </template>
      <!-- 显示中文名 -->
      <template slot="showChineseItem" slot-scope="scope">
        <el-select
          v-model="scope.row.showChinese" clearable allow-create filterable placeholder="请选择中文名" size="mini" @change="chineseChange(scope.row)"
        >
          <el-option
            v-for="(item, key) in fieldsData"
            :key="key"
            :label="item.fieldName"
            :value="item.fieldKey">
          </el-option>
        </el-select>
      </template>
      <!-- 显示字段名 -->
      <template slot="aliasColumnNameItem" slot-scope="scope">
      </template>
      <!-- 表名称 -->
      <template slot="tableNameItem" slot-scope="scope">
        <el-select v-if="modelType == 'DEVELOP'"
          v-model="scope.row.tableName" placeholder="请选择数据表" size="mini"
          @change="getTableColumnHandle(scope.row, scope.index)"
        >
          <el-option
            v-for="item in tableOption"
            :key="item.tableName+scope.index"
            :label="item.tableName"
            :value="item.tableName">
          </el-option>
        </el-select>
        <div v-else><span>{{scope.row.info}}</span><span v-if="scope.row.tableName">({{scope.row.tableName}})</span></div>
      </template>
      <!-- 字段名 -->
      <template slot="columnNameItem" slot-scope="scope">
        <div v-if="scope.row.columnOption">
          <el-select v-if="modelType == 'DEVELOP'"
            v-model="scope.row.columnName" placeholder="请选择数据表" size="mini"
            @change="columnNameChangeHandle(scope.row, scope.index)"
          >
            <el-option
              v-for="item in scope.row.columnOption"
              :key="item.columnName"
              :label="item.columnName"
              :value="item.columnName">
              <span style="float: left">{{ item.columnName }}</span>
              <span style="float: right; color: #8492a6;font-size:12px;">{{ item.columnComment }}</span>
            </el-option>
          </el-select>
        </div>
        <!-- <div v-else><span>{{scope.row.columnComment}}</span><span v-if="scope.row.columnName">({{scope.row.columnName}})</span></div> -->
      </template>
      <!-- 数据类型 -->
      <template slot="dbJavaTypeItem" slot-scope="scope">
        <span>{{$getLabelByValue(scope.row.dbJavaType, 'fieldType')}}</span>
      </template>
      <!-- 查询类型 -->
      <template slot="queryTypeItem" slot-scope="scope">
        <jvs-button v-if="scope.row.enableQuery" size="mini" type="text" @click="querySetHandle(scope.row, scope.index)">配置</jvs-button>
        <!-- <el-select size="mini" v-if="scope.row.enableQuery" v-model="scope.row.queryType" placeholder="请选择查询类型" :disabled="!(scope.row.associatedFields) == false">
          <el-option
            v-for="(label, key) in $store.state.labelValue.querySpec[scope.row.dbJavaType]"
            :key="key"
            :label="label"
            :value="key">
          </el-option>
        </el-select> -->
      </template>
      <!-- 排序 -->
      <template slot="ordinalPositionItem" slot-scope="scope">
        <div class="sort-item">
          <i v-if="scope.index > 0" class="el-icon-top" style="margin-right:10px;" @click="sortHandle('up', scope.index)"></i>
          <i v-if="scope.index < tableData.length -1" class="el-icon-bottom" @click="sortHandle('down', scope.index)"></i>
        </div>
      </template>
    </tableForm>
    <el-row style="margin-top:10px;">
      <jvs-button size="mini" @click="addRowHandle">新增一行</jvs-button>
    </el-row>
    <!-- 表格字段高级配置 备注设置 -->
    <el-dialog
      :title="dialogType == 'senior' ? '显示设置' : '备注'"
      v-if="dialogVisibleTableMore"
      :visible.sync="dialogVisibleTableMore"
      :before-close="handleCloseTableMore"
      :class="{'form-fullscreen-dialog advancedSettingsDialog': dialogType == 'senior'}"
      append-to-body
      :fullscreen="dialogType == 'senior'"
    >
      <!-- 高级设置 -->
      <div v-if="dialogType == 'senior'">
        <jvs-form :option="seniorSetOption" :formData="advancedSettings" >
          <template slot="dbJavaTypeForm">
            <el-select size="mini" v-model="rowData.dbJavaType" @change="dbJavaTypeChange(rowData.dbJavaType, 'onlyChange')">
              <el-option v-for="ti in viewTypeDicData" :key="ti.value+ti.label" :label="ti.label" :value="ti.value"></el-option>
            </el-select>
          </template>
          <!-- 字典来源 -->
          <template slot="dictSourceForm">
            <el-select size="mini" v-model="advancedSettings.dictSource" clearable @change="dictSourceChange">
              <el-option label="配置项" value="option"></el-option>
              <el-option label="接口api" value="url"></el-option>
              <el-option label="系统字典" value="system"></el-option>
            </el-select>
          </template>
          <!-- 字典配置 -->
          <template slot="dictionaryForm">
            <!-- getItemOfColumnTypeByValue -->
            <el-table
              v-if='advancedSettings.dictionary && advancedSettings.dictionary.length > 0'
              border
              :data="advancedSettings.dictionary"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              size='mini'
            >
              <el-table-column label="显示值" align="center">
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model="scope.row.label"
                    placeholder="请输入内容"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="传递值" align="center">
                <template slot-scope="scope">
                  <!-- :disabled="rowData.disabled !== false" -->
                  <div style="display:flex;align-items:center;">
                    <el-input
                      size="mini"
                      v-model="scope.row.value"
                      placeholder="请输入内容"
                    ></el-input>
                    <el-tooltip class="item" effect="dark" content="传递值均为字符串" placement="top" style="margin-left: 5px;">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <!-- v-if="rowData.disabled == false" -->
              <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <div>
                    <jvs-button size="mini" type="text" @click="deleteEnumItem(scope.$index, scope.row)">删除</jvs-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="margin-top:10px;">
              <!-- v-if="rowData.disabled == false" -->
              <jvs-button size="mini"  @click="addEnumItem">添加</jvs-button>
            </el-row>
          </template>
          <template slot="dictionaryHttpForm">
            <dataSourceForm ref="datasourceForm" :showBtn="false" sourceType="data_origin_request" labelText="数据来源类型" :form="{http: advancedSettings.dictionaryHttp}" @submit="dictionaryHttpSubmitHandle"></dataSourceForm>
          </template>
        </jvs-form>
        <el-row style="display:flex;justify-content: center;">
          <img v-if="rowData.dbJavaType == 'image'"  src="" :style="'display:block;width:'+advancedSettings.width+'px;height:'+advancedSettings.height+'px;'">
        </el-row>
      </div>
      <!-- 备注 -->
      <div v-if="dialogType == 'remark'">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入备注"
          v-model="columnRemark">
        </el-input>
      </div>
      <!-- v-if="advancedSettings.dictSource !== 'url'" -->
      <el-row style="margin-top:20px;display:flex;justify-content: center;">
        <jvs-button type="primary" @click="submitSeniorSetting">确定</jvs-button>
        <jvs-button @click="handleCloseTableMore">取消</jvs-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="查询配置"
      v-if="queryVisible"
      :visible.sync="queryVisible"
      append-to-body
      :before-close="queryClose">
      <jvs-form :option="querysetOption" :formData="queryItem" @cancalClick="queryClose" @submit="querySetSubmit">
        <template slot="queryTypeForm">
          <el-select size="mini" v-if="queryItem.enableQuery" v-model="queryItem.queryType" placeholder="请选择查询类型" :disabled="!(queryItem.associatedFields) == false">
            <el-option
              v-for="(label, key) in $store.state.labelValue.querySpec[queryItem.dbJavaType]"
              :key="key"
              :label="label"
              :value="key">
            </el-option>
          </el-select>
          <p v-if="!queryItem.aliasColumnName" style="color:#f56c6c;font-size:12px;margin:0;">填写显示字段名后可配置查询组件</p>
        </template>
        <template slot="propForm">
          <el-input :class="{'is-error-input': errTip}" size="mini" v-model="queryItem.queryConditionConfig.prop" @input="validateProp"></el-input>
          <span v-if="errTip" class="el-form-item__error">请输入字段名称</span>
        </template>
        <template slot="componentTypeForm">
          <el-select size="mini" v-if="queryItem.enableQuery" v-model="queryItem.queryConditionConfig.type" placeholder="请选择组件类型" clearable @change="searchSetChange">
            <el-option
              v-for="(qt, qi) in querysetTypeList"
              :key="qt.value+'queryType'+qi"
              :label="qt.label"
              :value="qt.value">
            </el-option>
          </el-select>
        </template>
        <template slot="infoForm">
          <formItemSetting
            v-if="queryItem.queryConditionConfig.prop && queryItem.queryConditionConfig.type"
            :form="queryItem.queryConditionConfig"
            :classifyDictList="classifyDictList"
            :systemDictList="systemDictList"
            :tableOption="tableOption"
          ></formItemSetting>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import pinyin from 'js-pinyin'
import tableForm from '../../../components/basic-design/tableForm'
import {queryKeyList, columnTypeList, dataTypeList} from '../../../const/const'
import dataSourceForm from '../../../plugin/datasource'
import {createFormItem} from "../../../plugin/assemblyCreate"
import formItemSetting from '../../../plugin/formItemSetting'
import { getClassifyDict, getSystemDict } from '@/api/newDesign'
export default {
  name: 'table-info',
  components: {tableForm, dataSourceForm, formItemSetting},
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelType: {
      type: String
    },
    tableOption: {
      type: Array
    },
    fieldsData: {
      type: Array
    },
    needEmpty: {
      type: Number
    },
    roleList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    tableData: {
      get () {
        return this.data
      },
      set(){}
    },
    // 排序
    sortTypeDicData : {
      get () {
        let temp = []
        for(let i in this.$store.state.labelValue.sortType) {
          temp.push({
            label: this.$store.state.labelValue.sortType[i],
            value: i
          })
        }
        return temp
      },
      set(){}
    },
    // 查询
    queryTypeDicData : {
      get () {
        let temp = []
        return temp
      },
      set(){}
    },
    // 高级设置--显示类型
    viewTypeDicData : {
      get () {
        let temp = []
        for(let i in this.$store.state.labelValue.fieldType) {
          temp.push({
            label: this.$store.state.labelValue.fieldType[i],
            value: i
          })
        }
        return temp
      },
      set(){}
    },
    // 表字段树形结构
    tableOptionTree () {
      let temp = []
      for(let i in this.tableOption) {
        let obj = {}
        obj.label = this.tableOption[i].tableName
        obj.value = this.tableOption[i].tableName
        obj.columnComment = this.tableOption[i].info
        if(this.tableOption[i].autoTableFields && this.tableOption[i].autoTableFields.length > 0) {
          obj.children = []
          for(let j in this.tableOption[i].autoTableFields) {
            obj.children.push({
              label: this.tableOption[i].autoTableFields[j].columnName,
              value: this.tableOption[i].autoTableFields[j].columnName,
              aliasColumnName: this.tableOption[i].autoTableFields[j].aliasColumnName,
              columnComment: this.tableOption[i].autoTableFields[j].columnComment
            })
          }
        }
        temp.push(obj)
      }
      return temp
    }
  },
  data () {
    return {
      option: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        // disableList: ['columnName', 'columnComment', 'dataType'], // 需要禁用的字段
        cancal: false,
        showOverflow: true,
        column: [
          {
            label: '选择字段',
            prop: 'tableNameColumnName',
            needSlot: true,
            width: '200px',
            hide: true
          },
          {
            label: '表名称',
            prop: 'tableName',
            needSlot: true,
            hide: true
          },
          {
            label: '字段名称',
            prop: 'columnName',
            needSlot: true,
            hide: true
          },
          {
            label: '字段解释',
            prop: 'columnComment',
            watch: true,
            disabled: true,
            hide: true,
          },
          {
            label: '字段类型',
            prop: 'dataType',
            type: 'select',
            dicData: columnTypeList,
            watch: true,
            disabled: true,
            hide: true
          },
          {
            label: '显示中文名',
            prop: 'showChinese',
            watch: true,
            needSlot: true,
            width: '200px'
          },
          {
            label: '显示字段名',
            prop: 'aliasColumnName',
            headerExplain: true,
            explainContent: '字段名不能包含空格和特殊符号',
            watch: true,
            width: '200px'
          },
          {
            label: '数据类型',
            prop: 'dbJavaType',
            type: 'select',
            dicData: [],
            watch: true,
            hide: true,
            // disabled: true
            needSlot: false // true
          },
          {
            label: '是否显示',
            prop: 'show',
            type: 'switch',
            watch: true,
            hide: true,
            display: {
              key: 'supportShow',
              value: true
            },
          },
          {
            label: '显示配置',
            prop: 'showset',
            needSlot: true
          },
          {
            label: '是否查询',
            prop: 'enableQuery',
            type: 'switch',
            display: {
              key: 'supportQuery',
              value: true
            },
            watch: true
          },
          // {
          //   label: '查询配置',
          //   prop: 'queryType',
          //   type: 'select',
          //   dicData: dataTypeList,
          //   disabled: true,
          //   needSlot: true,
          //   display: {
          //     key: 'enableQuery',
          //     value: true
          //   },
          // },
          {
            label: '是否排序',
            prop: 'enableSort',
            type: 'switch',
            display: {
              key: 'supportSort',
              value: true
            },
            watch: true,
            hide: true
          },
          {
            label: '排序类型',
            prop: 'sortType',
            type: 'select',
            dicData: [],
            display: {
              key: 'enableSort',
              value: true
            },
            hide: true
          },
          {
            label: '是否统计',
            prop: 'enableStatistics',
            type: 'switch',
            display: {
              key: 'supportStatistics',
              value: true
            },
            hide: true
          },
          {
            label: '排序',
            prop: 'ordinalPosition',
            type: 'number',
            needSlot: true
          },
        ]
      },
      advancedSettings: {}, // 高级设置
      seniorSetOption: {
        btnHide: true,
        column: [
          {
            label: '显示宽度',
            prop: 'showWidth',
            type: 'slider',
            min: 180,
            max: 900
          },
          {
            label: '显示类型',
            prop: 'dbJavaType',
            type: 'select',
            dicData: [],
            formSlot: true
          },
          {
            label: '背景颜色',
            prop: 'backColor',
            type: 'colorSelect'
          },
          {
            label: '文本颜色',
            prop: 'textcolor',
            type: 'colorSelect'
          },
          {
            label: '显示文字',
            prop: 'text',
            display: true
          },
          {
            label: '打开方式',
            prop: 'openType',
            linkbind: 'field_link',
            type: 'radio',
            dicData: [
              {label: '新窗口', value: '_blank'},
              {label: '当前窗口', value: '_self'}
            ],
            display: true
          },
          {
            label: '图片宽度',
            prop: 'width',
            type: 'slider',
            min: 10,
            max: 300,
            display: true
          },
          {
            label: '图片高度',
            prop: 'height',
            type: 'slider',
            min: 10,
            max: 300,
            display: true
          },
          {
            label: '字典来源',
            prop: 'dictSource',
            display: true,
            formSlot: true,
            type: 'select',
            dicData: [
              {label: '配置项', value: 'option'},
              {label: '接口api', value: 'url'},
              {label: '系统字典', value: 'system'}
            ],
            children: [
              {
                label: '字典配置',
                prop: 'dictionary',
                formSlot: true,
                linkbind: 'option',
                display: false
              },
              {
                label: '',
                prop: 'dictionaryHttp',
                formSlot: true,
                linkbind: 'url',
                display: false
              },
              {
                label: '显示值',
                prop: 'dictLabelFieldName',
                linkbind: 'url'
              },
              {
                label: '传递值',
                prop: 'dictValueFieldName',
                linkbind: 'url'
              },
              {
                label: '字典配置',
                prop: 'dictionaryUniqId',
                display: true,
                linkbind: 'system',
                type: 'select',
                dicData: [],
                display: false,
                props: {
                  label: 'description',
                  value: 'uniqId'
                }
              },
            ]
          },
          // {
          //   label: '动态控制',
          //   prop: 'expressControl',
          //   type: 'tableForm',
          //   border: true,
          //   editable: true,
          //   addBtn: true,
          //   delBtn: true,
          //   align: 'center',
          //   menuAlign: 'center',
          //   tableColumn: [
          //     {
          //       label: '表达式',
          //       prop: 'express',
          //       width: '400px',
          //     },
          //     {
          //       label: '文本颜色',
          //       prop: 'color',
          //       type: 'colorSelect'
          //     },
          //     {
          //       label: '显示文字',
          //       prop: 'text'
          //     }
          //   ],
          //   tips: {
          //     position: 'bottom',
          //     text: "根据表达式确定显示样式，如果表达式为空，则所有的信息显示为统一类型" +
          //     "<br/>" +
          //     "动态控制将覆盖显示类型为字典、接口API的设置" +
          //     "<br/>" +
          //     '表达式举例： ${age} > 1 && ${name} == "xx" || ( !${sex} && ${no} >= 20 ) <br/>'+
          //     '显示文字举例： xxx纯文字&nbsp;&nbsp;&nbsp;&nbsp;或引用变量&nbsp;&nbsp;&nbsp;&nbsp;${name} + "纯文字" + ${age}    <br/>'+
          //     '运算符： > &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '>= &nbsp;&nbsp;&nbsp;&nbsp; '+
          //     '< &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '<= &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '!= &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '!== &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '== &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '=== &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '&& &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '|| &nbsp;&nbsp;&nbsp;&nbsp;'+
          //     '! &nbsp;&nbsp;&nbsp;&nbsp;'
          //   }
          //   // 'startsWith &nbsp;&nbsp;&nbsp;&nbsp;'+
          //   // 'endsWith &nbsp;&nbsp;&nbsp;&nbsp;'+
          //   // 'includes &nbsp;&nbsp;&nbsp;&nbsp;'
          // }
        ]
      },
      dialogVisibleTableMore: false,
      index: -1, // 当前行index
      rowData: {}, // 当前行数据
      dicDataList: [],
      dialogType: '', // 高级 senior   备注 remark
      columnRemark: '', // 备注
      querysetIndex: -1, // 查询设置行index
      queryItem: null,
      queryVisible: false,
      querysetOption: {
        submitBtnText: '确定',
        emptyBtn: false,
        labelWidth: '140px',
        column: [
          {
            label: '字段名称',
            prop: 'prop',
            formSlot: true,
          },
          {
            label: '查询类型',
            prop: 'queryType',
            formSlot: true
          },
          {
            label: '组件类型',
            prop: 'componentType',
            formSlot: true
          },
          {
            label: '',
            prop: 'info',
            formSlot: true
          }
        ]
      },
      querysetTypeList: [
        {label: "单行文本", value: "input"},
        {label: "下拉框", value: "select"},
        {label: "级联选择", value: "cascader"},
        {label: "计数器", value: "inputNumber"},
        {label: "滑块", value: "slider"},
        {label: "开关", value: "switch"},
        {label: "日期", value: "datePicker"},
        {label: "固定时间", value: "timeSelect"},
        {label: "任意时间", value: "timePicker"},
        {label: "单选", value: "radio"},
        {label: "多选", value: "checkbox"},
        {label: "部门选择", value: "department"},
        {label: "角色选择", value: "role"},
        {label: "用户选择", value: "user"},
        {label: "岗位选择", value: "post"},
        {label: "地区选择", value: "chinaArea"}
      ],
      classifyDictList: [],
      systemDictList: [],
      errTip: false
    };
  },
  methods: {
    // 中文名 change
    chineseChange(e) {
      // e.aliasColumnName = e.showChinese
      this.$set(e, 'aliasColumnName', e.showChinese)
    },
    // 新增一行
    addRowHandle () {
      this.tableData.push({ supportShow: true, dbJavaType: 'field_text',show:true })
      // this.tableData.push({
      //   disabled: false,
      //   ordinalPosition: this.tableData.length > 0 ? (Number.parseInt(this.tableData[this.tableData.length - 1].ordinalPosition) + 10) : 10
      //   // showJurisdiction: ["所有用户"],
      //   // export: ["所有用户"],
      //   // disabled: false
      // })
      this.noticeGetColumn()
      this.setValueOfOther(this.tableData[this.tableData.length-1], this.tableData.length-1)
    },
    // 删除一行
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
      this.noticeGetColumn()
    },
    // 中文名、 name、info、type 改变通知获取column
    noticeGetColumn (data) {
      if(data) {
        let row = data.row
        let index = -1
        if(this.modelType == 'DESIGN') {
          index = data.index
        }else{
          index = data.index
          if(index == -1 || (!index && index !== 0)) {
            index = this.getIndexOfTable('showChinese', row.showChinese, this.tableData)
          }
        }
        if(row.showChinese && row.showChinese != '') {
          let name = pinyin.getFullChars(row.showChinese)
          name = name[0].toLowerCase() + name.slice(1, name.length)
          if(row.disabled === false) {
            if(index > -1) {
              this.$set(this.tableData[index], 'columnName', name)
              this.$set(this.tableData[index], 'columnComment', row.showChinese)
              this.$forceUpdate()
            }
          }
          if(!row.aliasColumnName && index > -1) {
            this.$set(this.tableData[index], 'aliasColumnName', name)
          }
        }
        this.setValueOfOther(row, index)
        // if(row.dbJavaType) {
        //   let fitem = this.$store.state.labelValue.fieldTypeMore[row.dbJavaType]
        //   if(fitem) {
        //     this.$set(this.tableData[index], 'supportSort', fitem.supportSort)
        //     this.$set(this.tableData[index], 'supportSettings', fitem.supportSettings)
        //     this.$set(this.tableData[index], 'supportStatistics', fitem.supportStatistics)
        //     this.$set(this.tableData[index], 'supportQuery', (fitem.supportQueryType && fitem.supportQueryType.length > 0)? true : false)
        //     this.$set(this.tableData[index], 'componentType', fitem.componentType)
        //     this.$forceUpdate()
        //   }
        // }

        // if(row.dbJavaType) {
        //   if(index > -1) {
        //     this.$set(this.tableData[index], 'dataType', row.dbJavaType)
        //     this.$forceUpdate()
        //   }
        // }
      }
      this.$emit('getColumn', true)
    },
    // 显示字段名 改变  修改查询配置
    aliasColumnNameChange (data) {
      let index = data.index
      this.$emit('getReg', data.regErr)
      if(data.row) {
        let row = data.row
        if(row.queryConditionConfig) {
          row.queryConditionConfig.prop = row.aliasColumnName ? row.aliasColumnName : row.columnName
          this.$set(this.tableData[index], 'queryConditionConfig', row.queryConditionConfig)
        }
        this.setValueOfOther(this.tableData[index], index)
      }
    },
    // 高级设置
    seniorSet (row, index, dialogType) {
      this.dialogType = dialogType
      this.index = index
      if(dialogType == 'senior') {
        this.rowData = JSON.parse(JSON.stringify(row))
        this.seniorSetOption.column.filter(item => {
          if(item.prop == 'textType') {
            item.display = (row.advancedSettings && row.advancedSettings.viewTypes && row.advancedSettings.viewTypes.length > 0) ? true : false
            let temp = []
            if(row.advancedSettings && row.advancedSettings.viewTypes && row.advancedSettings.viewTypes.length > 0) {
              for(let i in this.viewTypeDicData) {
                if(row.advancedSettings.viewTypes.indexOf(this.viewTypeDicData[i].value) > -1) {
                  temp.push(this.viewTypeDicData[i])
                }
              }
              item.dicData = temp
            }else{
              item.dicData = []
              item.display = false
            }
          }
          let attObj = {
            text: 'field_link',
            openType: 'field_link',
            width: 'field_image',
            height: 'field_image',
            // dictionary: 'field_dictionary',
            dictSource: 'field_dictionary'
          }
          if(attObj[item.prop]){
            if(attObj[item.prop] == row.dbJavaType){
              item.display = true
            }else{
              item.display = false
            }
          }
        })
        this.advancedSettings = row.advancedSettings || {}
        if(this.advancedSettings && !this.advancedSettings.dictionary) {
          this.advancedSettings.dictionary = []
        }
        if(this.advancedSettings && !this.advancedSettings.dictionaryUniqId) {
          this.$set(this.advancedSettings, 'dictionaryUniqId', '')
        }
        this.dbJavaTypeChange(row.dbJavaType)
        this.dictSourceChange(this.advancedSettings.dictSource)
        if(row.showWidth && !this.advancedSettings.showWidth) {
          this.$set(this.advancedSettings, 'showWidth', row.showWidth)
        }
      }
      if(dialogType == 'remark') {
        if(row.columnRemark) {
          this.columnRemark = row.columnRemark
        }
      }
      // console.log(this.advancedSettings)
      this.dialogVisibleTableMore = true
    },
    // 关闭高级设置
    handleCloseTableMore () {
      this.dialogVisibleTableMore = false
      this.rowData = {}
      this.columnRemark = ''
    },
    // 提交高级设置
    submitSeniorSetting () {
      if(this.dialogType == 'senior') {
        // 清除其余类型历史数据
        if(this.rowData.dbJavaType != 'field_dictionary') {
          this.advancedSettings.dictionary = []
          this.advancedSettings.dictionaryHttp = {}
          this.advancedSettings.dictionaryUniqId = ""
          this.advancedSettings.dictLabelFieldName = ''
          this.advancedSettings.dictValueFieldName = ''
        }
        if(this.rowData.dbJavaType != 'field_image') {
          this.advancedSettings.width = 0
          this.advancedSettings.height = 0
        }
        if(this.rowData.dbJavaType != 'field_link') {
          this.advancedSettings.text = ""
          this.advancedSettings.openType = ""
        }
        let validate = true
        if(this.advancedSettings.dictSource == 'url') {
          if(this.$refs.datasourceForm && this.$refs.datasourceForm.$refs.httpForm) {
            this.$refs.datasourceForm.$refs.httpForm.$refs.ruleForm.validate( (bool, prop) => {
              validate = bool
              if(bool) {
                this.advancedSettings.dictionaryHttp = this.$refs.datasourceForm.form.http
              }
            })
          }
        }
        if(!validate) {
          return false
        }
        // 赋值
        this.rowData.advancedSettings = JSON.parse(JSON.stringify(this.advancedSettings))
        this.$set(this.tableData[this.index], 'advancedSettings', this.rowData.advancedSettings)
        this.$set(this.tableData[this.index], 'dbJavaType', this.rowData.dbJavaType)
        this.$set(this.tableData[this.index], 'showWidth', this.rowData.advancedSettings.showWidth)
        this.dbJavaTypeChange(this.rowData.dbJavaType)
        this.noticeGetColumn()
      }
      if(this.dialogType == 'remark') {
        this.$set(this.tableData[this.index], 'columnRemark', this.columnRemark)
      }
      this.handleCloseTableMore()
    },
    // 字典配置提交
    dictionaryHttpSubmitHandle (form) {
      this.advancedSettings.dictionaryHttp = form.http
      // this.submitSeniorSetting()
    },
    // 通过字段类型获取对应项
    getItemOfColumnTypeByValue (value, attr) {
      for(let i in columnTypeList) {
        if(columnTypeList[i].value == value || columnTypeList[i].value.toUpperCase() == value.toUpperCase()) {
          return columnTypeList[i][attr]
        }
      }
      return false
    },
    getIndexOfTable(attr, val, list, attr2, val2) {
      let index = -1
      for(let i in list) {
        if(attr2 && val2) {
          if(list[i][attr] == val && list[i][attr2] == val2) {
            index = i
          }
        }else{
          if(list[i][attr] == val) {
            index = i
          }
        }
      }
      return index
    },
    // 添加一个枚举数据
    addEnumItem () {
      if(!this.advancedSettings.dictionary) {
        this.advancedSettings.dictionary = []
      }
      this.advancedSettings.dictionary.push({
        label: '',
        value: ''
      })
      this.$forceUpdate()
    },
    deleteEnumItem (index, row) {
      this.advancedSettings.dictionary.splice(index, 1)
      this.$forceUpdate()
    },
    // 获取类型对应的查询类型列表
    getDicDataHandle (row, index) {
      let list = JSON.parse(JSON.stringify(queryKeyList))
      for(let i in list) {
        let temp = this.getItemOfColumnTypeByValue((row.dataType), 'sqlKeywords')
        let tpl = []
        for(let i in temp) {
          tpl.push(temp[i].value)
        }
        let tl = []
        list.filter(it => {
          if(tpl.indexOf(it.value) > -1) {
            it.disabled = true
            tl.push(it)
          }
        })
        this.dicDataList = tl
      }
      // this.option.column.filter(item => {
      //   if(item.prop == 'sqlKeyword') {
      //     let list = JSON.parse(JSON.stringify(queryKeyList))
      //     for(let i in list) {
      //       let temp = this.getItemOfColumnTypeByValue((row.dataType), 'sqlKeywords')
      //       let tpl = []
      //       for(let i in temp) {
      //         tpl.push(temp[i].value)
      //       }
      //       let tl = []
      //       list.filter(it => {
      //         if(tpl.indexOf(it.value) > -1) {
      //           it.disabled = true
      //           tl.push(it)
      //         }
      //       })
      //       this.dicDataList = tl
      //     }
      //   }
      // })
    },
    // 是否查询
    enableQueryChange (data) {
      if(data) {
        let row = data.row
        let index = -1
        if(this.modelType == 'DESIGN') {
          index = data.index
        }else{
          index = this.getIndexOfTable('columnName', row.columnName, this.tableData, 'tableName', row.tableName)
        }
        if(index > -1 && row.dbJavaType) {
          let tarr = Object.keys(this.$store.state.labelValue.querySpec[row.dbJavaType])[0]
          if(row.associatedFields) {
            tarr = 'query_eq'
          }
          this.$set(this.tableData[index], 'queryType', tarr)
          this.$forceUpdate()
        }
      }
      this.$emit('getColumn', true)
    },
    // 是否排序
    enableSortChange (data) {
      if(data) {
        let row = data.row
        let index = this.getIndexOfTable('columnName', row.columnName, this.tableData, 'tableName', row.tableName,)
        if(index > -1) {
          this.$set(this.tableData[index], 'sortType', this.sortTypeDicData[0].value)
          this.$forceUpdate()
        }
      }
      this.$emit('getColumn', true)
    },
    // 切换数据表,获取字段列表
    getTableColumnHandle (row, index, type) {
      let item = null
      if(type !== 'init' && type !== 'treeChange') {
        this.$set(this.tableData[index], 'columnName', '')
      }
      for(let i in this.tableOption) {
        if(this.tableOption[i].tableName == row.tableName) {
          item = this.tableOption[i]
        }
      }
      if(item) {
        this.$set(this.tableData[index], 'columnOption', item.autoTableFields)
        this.$set(this.tableData[index], 'tableId', item.id)
      }
      this.$forceUpdate()
    },
    // 字段切换
    columnNameChangeHandle (row, index) {
      let item = null
      for(let i in row.columnOption) {
        if(row.columnName == row.columnOption[i].columnName) {
          item = row.columnOption[i]
        }
      }
      if(item) {
        // if(!row.showChinese){
        //   this.$set(this.tableData[index], 'showChinese', item.columnComment)
        // }
        this.$set(this.tableData[index], 'showChinese', item.columnComment)
        // if(!row.dbJavaType) {
        //   this.$set(this.tableData[index], 'dbJavaType', item.dbJavaType)
        // }
        this.$set(this.tableData[index], 'dbJavaType', item.dbJavaType)
        let attr = ['aliasColumnName', 'componentType', 'supportShow', 'supportQuery', 'supportSort', 'supportSettings', 'supportStatistics']
        for(let t in attr) {
          this.$set(this.tableData[index], attr[t], item[attr[t]])
        }
      }
      this.setValueOfOther(row, index)
    },
    // 类型切换改变其他属性
    setValueOfOther (row, index, onlyChange) {
      if(row.dbJavaType) {
        let fitem = this.$store.state.labelValue.fieldTypeMore[row.dbJavaType]
        let arr = ['supportShow', 'supportSort', 'supportSettings', 'supportStatistics', 'supportQuery', 'componentType']
        if(fitem) {
          for(let i in arr) {
            if(arr[i] == 'supportQuery') {
              if(onlyChange !== 'onlyChange') {
                if(!fitem.supportQueryType || fitem.supportQueryType.length == 0) {
                  this.$set(this.tableData[index], 'enableQuery', false)
                }else{
                  if(fitem.supportQueryType.indexOf(row.queryType) == -1) {
                    this.$set(this.tableData[index], 'queryType', "")
                  }
                }
                this.$set(this.tableData[index], 'supportQuery', (fitem.supportQueryType && fitem.supportQueryType.length > 0)? true : false)
                // this.$set(this.tableData[index], 'enableQuery', this.tableData[index].supportQuery)
              }
            }else{
              this.$set(this.tableData[index], arr[i], fitem[arr[i]])
            }
          }
          this.$forceUpdate()
        }
      }
    },
    // 重排顺序
    sortHandle (type, index) {
      index = Number.parseInt(index)
      let own = JSON.parse(JSON.stringify(this.tableData[index]))
      let change = null
      if(type == 'up') {
        change = JSON.parse(JSON.stringify(this.tableData[index-1]))
        this.$set(this.tableData, (index-1), own)
        this.$set(this.tableData, index, change)
      }
      if(type == 'down') {
        change = JSON.parse(JSON.stringify(this.tableData[index+1]))
        this.$set(this.tableData, (index+1), own)
        this.$set(this.tableData, index, change)
      }
    },
    // 查询条件配置
    querySetHandle (row, index) {
      if(!row.queryConditionConfig) {
        row.queryConditionConfig = {
          type: ""
        }
      }
      this.queryItem = JSON.parse(JSON.stringify(row))
      this.querysetIndex = index
      this.querysetOption.column.filter(item => {
        if(['componentType', 'info'].indexOf(item.prop) > -1) {
          if(row.aliasColumnName) {
            item.display = true
          }else{
            item.display = false
          }
        }
      })
      this.queryVisible = true
    },
    // 关闭查询条件配置
    queryClose () {
      this.queryVisible = false
      this.queryItem = null
    },
    // 组件类型切换
    searchSetChange (val) {
      if(val) {
        this.queryItem.queryConditionConfig = createFormItem(val)
        this.queryItem.queryConditionConfig.span = 6
        this.queryItem.queryConditionConfig.label = this.queryItem.showChinese
        this.queryItem.queryConditionConfig.prop = this.queryItem.aliasColumnName
        this.queryItem.queryConditionConfig.placeholder = this.queryItem.showChinese
      }else{
        this.queryItem.queryConditionConfig = null
      }

    },
    // 查询设置提交
    querySetSubmit (form) {
      if(this.queryItem.queryConditionConfig.prop) {
        this.errTip = false
        this.$set(this.tableData, this.querysetIndex, form)
        this.queryClose()
      }else{
        this.errTip = true
      }
    },
    // 获取分类字典
    getClassifyDictHandle () {
      getClassifyDict().then(res => {
        if(res.data.code == 0) {
          this.classifyDictList = res.data.data
        }
      })
    },
    getSystemDictHandle () {
      getSystemDict().then(res => {
        if(res.data.code == 0) {
          this.systemDictList = res.data.data
          this.seniorSetOption.column.filter(item => {
            if(item.prop == 'dictSource') {
              item.children.filter(it => {
                if(it.prop == 'dictionaryUniqId') {
                  it.dicData = res.data.data
                }
              })
            }
          })
        }
      })
    },
    // 字典来源类型切换
    dictSourceChange (val) {
      let dictionaryBool = false
      let dictionaryHttpBool = false
      let dictionaryUniqIdBool = false
      switch(val) {
        case 'option':
          this.advancedSettings.dictionaryHttp = {};
          this.advancedSettings.dictionaryUniqId = "";
          dictionaryBool = true;
          dictionaryHttpBool = false;
          dictionaryUniqIdBool = false;
          break;
        case 'url':
          this.advancedSettings.dictionary = [];
          this.advancedSettings.dictionaryUniqId = "";
          dictionaryBool = false;
          dictionaryHttpBool = true;
          dictionaryUniqIdBool = false;
          break;
        case 'system':
          this.advancedSettings.dictionary = [];
          this.advancedSettings.dictionaryHttp = {};
          dictionaryBool = false;
          dictionaryHttpBool = false;
          dictionaryUniqIdBool = true;
          break;
        default:
          this.advancedSettings.dictionary = [];
          this.advancedSettings.dictionaryHttp = {};
          this.advancedSettings.dictionaryUniqId = "";
          dictionaryBool = false;
          dictionaryHttpBool = false;
          dictionaryUniqIdBool = false;
          break;
      }
      this.seniorSetOption.column.filter(ci => {
        if(ci.prop == 'dictSource') {
          ci.children.filter(item => {
            if(item.prop == 'dictionary') {
              item.display = dictionaryBool
            }
            if(item.prop == 'dictionaryHttp') {
              item.display = dictionaryHttpBool
            }
            if(item.prop == 'dictionaryUniqId') {
              item.display = dictionaryUniqIdBool
            }
          })
        }
      })
    },
    // 选择字段
    tableNameColumnNameChange (row, index) {
      if(row.tableNameColumnName && row.tableNameColumnName.length > 0) {
        row.tableName = row.tableNameColumnName[0]
        row.columnName = row.tableNameColumnName[1]
      }else{
        row.tableName = ""
        row.columnName = ""
      }
      this.getTableColumnHandle(row, index, 'treeChange')
      this.columnNameChangeHandle(row, index)
    },
    dbJavaTypeChange (val, onlyChange) {
      let index = this.index
      let row = this.rowData
      if(val) {
        let fitem = this.$store.state.labelValue.fieldTypeMore[val]
        if(fitem) {
          this.$set(this.tableData[index], 'componentType', fitem.componentType)
          this.$forceUpdate()
        }
      }
      if(row.dbJavaType) {
        if(index > -1) {
          this.$set(this.tableData[index], 'dataType', row.dbJavaType)
          this.setValueOfOther(row, index, onlyChange)
          this.$forceUpdate()
        }
      }
      this.seniorSetOption.column.filter(item => {
        if(item.prop == 'textType') {
          item.display = (this.advancedSettings && this.advancedSettings.viewTypes && this.advancedSettings.viewTypes.length > 0) ? true : false
          let temp = []
          if(this.advancedSettings && this.advancedSettings.viewTypes && this.advancedSettings.viewTypes.length > 0) {
            for(let i in this.viewTypeDicData) {
              if(this.advancedSettings.viewTypes.indexOf(this.viewTypeDicData[i].value) > -1) {
                temp.push(this.viewTypeDicData[i])
              }
            }
            item.dicData = temp
          }else{
            item.dicData = []
            item.display = false
          }
        }
        let attObj = {
          text: 'field_link',
          openType: 'field_link',
          width: 'field_image',
          height: 'field_image',
          dictSource: 'field_dictionary'
        }
        if(attObj[item.prop]){
          if(attObj[item.prop] == this.rowData.dbJavaType){
            item.display = true
          }else{
            item.display = false
          }
        }
      })
      this.$forceUpdate()
    },
    validateProp (value) {
      if(value) {
        this.errTip = false
      }else{
        this.errTip = true
      }
    }
  },
  created () {
    this.getClassifyDictHandle()
    this.getSystemDictHandle()
    this.option.column.filter(item => {
      if(item.prop == 'sortType') {
        item.dicData = this.sortTypeDicData
      }
    })
    this.seniorSetOption.column.filter(item => {
      if(item.prop == 'textType') {
        item.dicData = this.viewTypeDicData
      }
    })
    this.option.column.filter(item => {
      if(['tableName', 'columnName'].indexOf(item.prop) > -1) {
        if(this.modelType == 'DESIGN') {
          item.hide = true
        }
      }
      if(item.prop == 'dbJavaType') {
        item.dicData = this.viewTypeDicData
        item.needSlot = false
      }
    })
    this.seniorSetOption.column.filter(item => {
      if(item.prop == 'dbJavaType') {
        item.dicData = this.viewTypeDicData
      }
    })
    // 开发模式回显字段
    if(this.modelType == 'DEVELOP') {
      for(let i in this.tableData) {
        this.getTableColumnHandle(this.tableData[i], i, 'init')
      }
    }
    // 初始化赋值组件类型
    for(let i in this.tableData) {
      this.setValueOfOther(this.tableData[i], i, 'senior')
    }
  },
  watch: {
    needEmpty: {
      handler(newVal, oldVal) {
        if(newVal !== -1) {
          for(let i in this.tableData) {
            this.$set(this.tableData[i], 'tableName', '')
            this.$set(this.tableData[i], 'columnName', '')
          }
          this.$forceUpdate()
        }
      }
    },
    data: {
      handler(newVal, oldVal) {
        for(let i in this.data) {
          this.data[i].tableNameColumnName = []
          if(this.data[i].tableName && this.data[i].columnName) {
            this.data[i].tableNameColumnName = [this.data[i].tableName, this.data[i].columnName]
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sort-item{
  i{
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.advancedSettingsDialog{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      position: unset;
      width: 100%;
      padding: 0 50px;
      box-sizing: border-box;
    }
  }
}
.table-info-form{
  .el-table{
    .el-table__body-wrapper{
      overflow-y: hidden;
    }
  }
}
</style>
