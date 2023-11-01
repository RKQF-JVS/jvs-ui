<template>
  <div class="datasource-origin">
    <el-row style="display:flex;align-items:center;margin-bottom: 15px;" v-if="showType">
      <span class="el-form-item__label">{{labelText ? labelText : '数据来源'}}</span>
      <el-select size="mini" v-model="rowData.type" :placeholder="'请选择'+(labelText ? labelText : '数据来源')" @change="changeHandle">
        <el-option
          v-for="(item, key) in $store.state.labelValue.dataOriginType"
          :key="key"
          v-show="(typeList && typeList.length > 0) ? (typeList.indexOf(key) >  -1) : true"
          :label="item"
          :value="key">
        </el-option>
      </el-select>
    </el-row>
    <!-- http请求 -->
    <jvs-form ref="httpForm" :option="httpOption" :formData="rowData.http" v-if="sourceTypeString == 'data_origin_request'" @submit="submitHandle" @formChange="formChange">
      <template slot="headersForm">
        <el-table
          border
          :data="headers"
          class="tb-edit"
          style="width: 100%"
          highlight-current-row
          size='mini'
        >
          <el-table-column label="key" align="center">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.key"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="value" align="center">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.value"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <div>
                <jvs-button size="mini" type="text" @click="deleteOne(scope.$index, scope.row, headers)">删除</jvs-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top:10px;">
          <jvs-button size="mini"  @click="addOne(headers)">添加</jvs-button>
        </el-row>
      </template>
      <template slot="parametersForm">
        <el-table
          border
          :data="parameters"
          class="tb-edit"
          style="width: 100%"
          highlight-current-row
          size='mini'
        >
          <el-table-column label="参数名" align="center">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.key"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="参数值" align="center">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.value"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <div>
                <jvs-button size="mini" type="text" @click="deleteOne(scope.$index, scope.row, parameters)">删除</jvs-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top:10px;">
          <jvs-button size="mini"  @click="addOne(parameters)">添加</jvs-button>
        </el-row>
      </template>
    </jvs-form>
    <!-- js -->
    <jvs-form :option="jsOption" :formData="rowData" v-if="sourceTypeString == 'data_origin_js'"  @submit="submitHandle" @formChange="formChange"></jvs-form>
    <!-- sql -->
    <jvs-form :option="sqlOption" :formData="rowData.sql" v-if="sourceTypeString == 'data_origin_sql'"  @submit="submitHandle" @formChange="formChange"></jvs-form>
    <!-- 字典 -->
    <tableForm :option="dictionaryOption" :data="rowData.dictionary" v-if="sourceTypeString == 'data_origin_dictionary'">
      <template slot="menuBtn" slot-scope="scope">
        <jvs-button size="mini" type='text' @click="deleteOne(scope.$index, scope.row, rowData.dictionary)">删除</jvs-button>
      </template>
    </tableForm>
    <el-row style="margin-top: 10px" v-if="sourceTypeString == 'data_origin_dictionary'">
      <jvs-button size="mini" @click="addOne(rowData.dictionary)">新增一行</jvs-button>
    </el-row>
    <!-- 逻辑引擎 -->
    <jvs-form :option="ruleOption" :formData="rowData.rule" v-if="sourceTypeString == 'data_origin_rule'"  @submit="submitHandle" @formChange="formChange"></jvs-form>
  </div>
</template>
<script>
import tableForm from '../components/basic-design/tableForm'
import {getKeyValue} from '../api/list'
export default {
  components: {tableForm},
  props: {
    sourceType: {
      type: String,
    },
    labelText: {
      type: String,
      default: '数据来源'
    },
    showType: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    form: {
      type: Object
    },
    showBtn: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    typeList: {
      type: Array
    },
    disableItems: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data(){
    return {
      rowData: {
        dictionary: []
      },
      httpOption: {
        cancal: false,
        btnHide: this.showBtn == false ? true: false,
        column: [
          {
            label: '请求方式',
            prop: 'httpMethod',
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择请求方式', trigger: 'change' }]
          },
          {
            label: '请求媒体类型',
            prop: 'requestContentType',
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择媒体类型', trigger: 'change' }]
          },
          {
            label: '响应媒体类型',
            prop: 'responseContentType',
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择媒体类型', trigger: 'change' }]
          },
          {
            label: '请求地址',
            prop: 'url',
            // rules: [{ required: true, message: '请输入请求地址', trigger: 'blur' }]
          },
          {
            label: '请求头',
            prop: 'headers',
            formSlot: true
          },

          {
            label: '请求参数',
            prop: 'parameters',
            formSlot: true
          },
          // {
          //   label: '前置JS',
          //   prop: 'preJs'
          // },
          // {
          //   label: '后置JS',
          //   prop: 'afterJs'
          // },
        ]
      },
      headers: [], // 请求头
      parameters: [], // 参数
      jsOption: {
        cancal: false,
        btnHide: this.showBtn == false ? true: false,
        column: [
          {
            label: 'js',
            prop: 'js'
          }
        ]
      },
      sqlOption: {
        cancal: false,
        btnHide: this.showBtn == false ? true: false,
        column: [
          {
            label: '数据源',
            prop: 'databaseName',
            type: 'select',
            dicUrl: '/mgr/datasource/api',
            props: {
              label: 'name',
              value: 'databaseName'
            }
          },
          {
            label: 'sql语句',
            prop: 'selectSql',
            tips: {
              position: 'bottom',
              text: 'sq|语句只支持 MAX() &nbsp;&nbsp; SUM() &nbsp;&nbsp; AVG() &nbsp;&nbsp; MIN() &nbsp;&nbsp; COUNT()语法，如: <br/>'+
              'SELECT COUNT(1) FROM sys_ user WHERE age > ${age} AND sex = ${sex}<br/>'+
              '其中${age}和${sex}为引用变量，该变量的值来自于查询条件<br/>'+
              '如果查询条件中找不到${age}变量或值为空，则该统计sql会失效,没有显示效果。'
            }
          },
          // {
          //   label: '前置JS',
          //   prop: 'preJs'
          // },
          // {
          //   label: '后置JS',
          //   prop: 'afterJs'
          // }
        ]
      },
      ruleOption: {
        cancal: false,
        btnHide: this.showBtn == false ? true: false,
        column: [
          {
            label: '逻辑引擎',
            prop: 'ruleId',
            tips: {
              position: 'bottom',
              text: '请在逻辑引擎中进行设计'
            },
            type: 'select',
            dicUrl: '/api/rule/get/select',
            props: {
              label: 'name',
              value: 'key'
            }
          }
        ]
      },
      httpMethodDictData: [],
      contentTypeDicData: [],
      dictionaryOption: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        menuWidth: 100,
        cancal: false,
        column: [
          {
            label: '显示值',
            prop: 'label',
          },
          {
            label: '传递值',
            prop: 'value',
          }
        ]
      },
      sourceTypeString: ''
    }
  },
  methods: {
    // 表格添加一行
    addOne (list) {
      if(!list) {
        list = []
      }
      list.push({})
      this.$forceUpdate()
    },
    deleteOne (index, item, list) {
      list.splice(index, 1)
      this.$forceUpdate()
    },
    getConst () {
      let list = this.$store.state.labelValue
      // 请求方式
      this.getConstDic(this.httpMethodDictData, list.httpMethod, 'httpMethod')
      // 媒体类型
      this.getConstDic(this.contentTypeDicData, list.requestContentType, 'requestContentType')
      this.getConstDic(this.contentTypeDicData, list.responseContentType, 'responseContentType')
    },
    getConstDic (list, obj, attr) {
      list = []
      for(let i in obj) {
        list.push({
          label: obj[i],
          value: i
        })
      }
      this.httpOption.column.filter(item => {
        if(item.prop == attr) {
          item.dicData = list
        }
      })
    },
    // 配置提交
    submitHandle (form) {
      // 请求类型
      if(this.sourceTypeString == 'data_origin_request') {
        let temp = JSON.parse(JSON.stringify(form))
        let obj = {}
        for(let i in this.headers) {
          obj[this.headers[i].key] = this.headers[i].value
        }
        temp.headers = obj
        let obj2 = {}
        for(let i in this.parameters) {
          obj2[this.parameters[i].key] = this.parameters[i].value
        }
        temp.parameters = obj2
        this.rowData.http = temp
      }else if(this.sourceTypeString == 'data_origin_sql'){
        this.rowData.sql = form
      }else{
        for(let i in form) {
          this.rowData[i] = form[i]
        }
      }
      this.$emit('submit', this.rowData)
      this.$forceUpdate()
    },
    // 类型切换
    changeHandle (val) {
      this.sourceTypeString = val
    },
    // 表单change
    formChange (form) {
      if(this.showBtn === false) {
        this.submitHandle(form)
      }
    },
    // 获取所有label value 对应值
    async getKeyValueHandle () {
      await getKeyValue().then(res => {
        if(res.data.code == 0) {
          this.$store.state.labelValue = res.data.data
        }
      })
    },
  },
  async created () {
    if(this.sourceType) {
      this.sourceTypeString = this.sourceType
    }else{
      this.sourceTypeString = this.rowData.type
    }
    if(this.form) {
      if(this.form.type == "data_origin_sql") {
        if(!this.form.sql) {
          this.form.sql = {
            databaseName: '',
            sql: ''
          }
        }
      }
      if(this.form.type == "data_origin_request") {
        if(!this.form.http) {
          this.form.http = {}
        }
      }
      if(this.form.type == "data_origin_rule") {
        if(!this.form.rule) {
          this.form.rule = {
            ruleId: ''
          }
        }
      }
      this.rowData = this.form
      if(!this.rowData.dictionary) {
        this.rowData.dictionary = []
      }
      if(this.rowData.http) {
        if(this.rowData.http.headers) {
          let temp = []
          for(let i in this.rowData.http.headers) {
            temp.push({
              key: i,
              value: this.rowData.http.headers[i]
            })
          }
          this.headers = temp
        }
        if(this.rowData.http.parameters) {
          let temp = []
          for(let i in this.rowData.http.parameters) {
            temp.push({
              key: i,
              value: this.rowData.http.parameters[i]
            })
          }
          this.parameters = temp
        }
      }
      if(this.form.type) {
        this.changeHandle(this.form.type)
      }
    }
    if(!this.$store.state.labelValue) {
      await this.getKeyValueHandle()
    }
    this.getConst()
    this.httpOption.column.filter(item => {
      if(this.disableItems.indexOf(item.prop) > -1) {
        item.disabled = true
      }else{
        item.disabled = false
      }
    })
  }
}
</script>
<style lang="scss">
.datasource-origin{

}
</style>
