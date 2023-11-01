<template>
  <div class="custom-statistics-form">
    <tableForm :option="option" :data="tableData">
      <template slot="menuBtn" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
        <jvs-button size="mini" type="text" :style="!scope.row.statisticalRemark ? 'color: #c0c4cc;' : ''" @click="remarkRow(scope.row, scope.index)">备注</jvs-button>
      </template>
      <template slot="optionItem" slot-scope="scope">
        <jvs-button type='text' size="mini" @click="setOption(scope.row, scope.index)">配置</jvs-button>
      </template>
    </tableForm>
    <el-row style="margin-top: 10px">
      <jvs-button size="mini" @click="addRowHandle">新增一行</jvs-button>
    </el-row>
    <el-dialog
      title="配置"
      append-to-body
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      fullscreen
      class="form-fullscreen-dialog"
      :before-close="handleClose">
      <dataSourceForm labelText="数据来源类型" :sourceType="rowData.type" :form="rowData" @submit="submitHandle"></dataSourceForm>
    </el-dialog>
    <el-dialog
      title="备注"
      append-to-body
      v-if="remarkVisible"
      :visible.sync="remarkVisible"
      :before-close="remarkClose">
      <el-row>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入备注"
          v-model="statisticalRemark">
        </el-input>
      </el-row>
      <el-row style="margin-top:20px;display:flex;justify-content: center;">
        <jvs-button type="primary" @click="remarkHandle">确定</jvs-button>
        <jvs-button @click="remarkClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import tableForm from '../../../components/basic-design/tableForm'
import dataSourceForm from '../../../plugin/datasource'
export default {
  name: 'custom-statistics-form',
  components: { tableForm, dataSourceForm },
  props: {
    data: {
      type: Array
    },
    roleList: {
      type: Array
    }
  },
  computed: {
    tableData: {
      get () {
        return this.data
      },
      set () {}
    }
  },
  data(){
    return{
      option: {
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
            label: '统计名称',
            prop: 'name',
          },
          {
            label: '数据来源类型',
            prop: 'type',
            type: 'select',
            dicData: []
          },
          {
            label: '配置',
            prop: 'option',
            needSlot: true
          },
          {
            label: '是否同步查询',
            prop: 'syncQuery',
            type: 'switch'
          },
          {
            label: '是否开启',
            prop: 'enable',
            type: 'switch'
          }
        ]
      },
      dialogVisible: false, // 配置弹框
      index: -1, //当前行index
      rowData: {}, // 当前行
      httpOption: {
        cancal: false,
        column: [
          {
            label: '请求方式',
            prop: 'httpMethod',
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择请求方式', trigger: 'change' }]
          },
          {
            label: '媒体类型',
            prop: 'contentType',
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择媒体类型', trigger: 'change' }]
          },
          {
            label: '请求地址',
            prop: 'url',
            rules: [{ required: true, message: '请输入请求地址', trigger: 'blur' }]
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
          {
            label: '前置JS',
            prop: 'preJs'
          },
          {
            label: '后置JS',
            prop: 'afterJs'
          },
        ]
      },
      headers: [], // 请求头
      parameters: [], // 参数
      jsOption: {
        cancal: false,
        column: [
          {
            label: 'js',
            prop: 'js'
          }
        ]
      },
      sqlOption: {
        cancal: false,
        column: [
          {
            label: 'sql语句',
            prop: 'sql'
          },
          {
            label: '前置JS',
            prop: 'preJs'
          },
          {
            label: '后置JS',
            prop: 'afterJs'
          }
        ]
      },
      httpMethodDictData: [],
      contentTypeDicData: [],
      statisticalRemark: '', // 备注
      remarkVisible: false, // 按钮备注弹框
      currentIndex: -1, // 当前行index
    }
  },
  methods: {
    addRowHandle () {
      this.tableData.push({
        enable: false,
					http: {
						afterJs: "",
						contentType: "",
						headers: {},
						httpMethod: "",
						parameters: {},
						preJs: "",
						url: ""
					},
					js: "",
					sql: {
						afterJs: "",
						preJs: "",
						sql: ""
					},
					type: ""
      })
    },
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
    },
    // 配置
    setOption (row, index) {
      this.index = index
      this.rowData = JSON.parse(JSON.stringify(row))
      if(row.type) {
        this.dialogVisible = true
      }
    },
    // 数据类型来源dic设置
    setDicData () {
      let dic = this.$store.state.labelValue.dataOriginType
      let temp = []
      for(let i in dic) {
        if(i != 'data_origin_dictionary') {
          temp.push({
            label: dic[i],
            value: i
          })
        }
      }
      this.option.column.filter(item => {
        if(item.prop == 'type') {
          item.dicData = temp
        }
      })
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible = false
      this.rowData = {}
      this.headers = []
      this.parameters = []
    },
    // 配置提交
    submitHandle (form) {
      if(form) {
        let subData = {
          name: this.rowData.name,
          type: this.rowData.type,
          enable: this.rowData.enable,
          syncQuery: this.rowData.syncQuery
        }
        switch(this.rowData.type) {
          case 'data_origin_request':
            subData.http = form.http;
            break;
          case 'data_origin_sql':
            subData.sql = form.sql;
            break;
          case 'data_origin_dictionary':
            subData.dictionary = form.dictionary;
            break;
          case 'data_origin_js':
            subData.js = form.js;
            break;
          case 'data_origin_rule':
            subData.rule = {ruleId: form.ruleId}
            break;
          default : subData = form;break;
        }
        this.$set(this.tableData, this.index, subData)
        this.$forceUpdate()
        this.handleClose()
      }
    },
    // 备注
    remarkRow (row, index) {
      this.currentIndex = index
      if(row.statisticalRemark) {
        this.statisticalRemark = row.statisticalRemark
      }
      this.rowData = row
      this.remarkVisible = true
    },
    // 备注
    remarkHandle () {
      this.$set(this.tableData[this.currentIndex], 'statisticalRemark', this.statisticalRemark)
      this.$forceUpdate()
      this.remarkClose()
    },
    // 关闭备注
    remarkClose () {
      this.statisticalRemark = ""
      this.rowData = {}
      this.remarkVisible = false
    },
  },
  created () {
    this.setDicData()
  }
}
</script>
<style lang="scss" scoped>

</style>