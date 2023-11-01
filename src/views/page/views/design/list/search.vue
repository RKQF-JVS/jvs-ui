<template>
  <div class="search-info-form">
    <tableForm :option="option" :data="tableData" @columnNameChange="columnNameChange" @typeChange="typeChange">
      <template slot="menuBtn" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
      </template>
      <!-- 查询类型 -->
      <template slot="sqlKeywordItem" slot-scope="scope">
        <el-select size="mini" v-model="scope.row.sqlKeyword" placeholder="请选择查询类型" @focus="getDicDataHandle(scope.row, scope.index)">
          <el-option
            v-for="item in dicDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template slot="dataoptionItem" slot-scope="scope">
        <jvs-button size="mini" @click="setOptionHandle(scope.row, scope.index)">点击配置</jvs-button>
      </template>
    </tableForm>
    <el-row style="margin-top: 10px">
      <jvs-button size="mini" @click="addRowHandle">新增查询条件</jvs-button>
    </el-row>
    <!-- 配置下拉选框值 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
    >
      <jvs-form :option="selectFormOption" :formData="rowData" @submit="dataConfigSubmit">
        <template slot="optionForm">
          <tableForm :option="selectOption" :data="rowData.dataConfig.option">
            <template slot="menuBtn" slot-scope="scope">
              <jvs-button size="mini" @click="deleteOptionRow(scope.row, scope.index)">删除</jvs-button>
            </template>
          </tableForm>
          <el-row style="margin-top:10px;">
            <jvs-button size="mini" @click="addOptionRow">增加选项</jvs-button>
          </el-row>
        </template>
        <template slot="propsForm">
          <el-row :span='24'>
            <el-col :span="12" style="display:flex;align-items:center;margin: 10px;">
              <span style="width: 70px;">label:</span>
              <el-input size="mini" v-model="propObj.label"></el-input>
            </el-col>
            <el-col :span="12" style="display:flex;align-items:center;margin: 10px;">
              <span style="width: 70px;">value:</span>
              <el-input size="mini" v-model="propObj.value"></el-input>
            </el-col>
          </el-row>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import tableForm from '../../../components/basic-design/tableForm'
import {queryKeyList, columnTypeList, dataTypeList} from '../../../const/const'
export default {
  name: 'search-info',
  components: {tableForm},
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableSetNameOption: {
      type: Array
    }
  },
  computed: {
    tableData: {
      get () {
        return this.data
      },
      set(){}
    }
  },
  data () {
    return {
      // 配置
      option: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        menu: true,
        disableList: ['columnComment', 'sqlKeyword'],
        cancal: false,
        column: [
          {
            label: '字段名称',
            prop: 'columnName',
            type: 'select',
            dicData: [],
            watch: true, // 是否监听字段值变化
          },
          {
            label: '字段解释',
            prop: 'columnComment',
          },
          {
            label: '显示中文名',
            prop: 'showChinese',
            hide: true
          },
          {
            label: '输入类型',
            prop: 'type',
            type: 'select',
            watch: true,
            disabled: true,
            dicData: [
              {label: '输入框', value: 'input'},
              {label: '日期', value: 'date'},
              // {label: '日期范围', value: 'daterange'},
              {label: '时间', value: 'time'},
              // {label: '时间范围', value: 'timerange'},
              {label: '日期时间', value: 'datetime'},
              // {label: '日期时间范围', value: 'datetimerange'},
              {label: '数字', value: 'inputNumber'},
              {label: '下拉选择', value: 'select'},
            ]
          },
          {
            label: '查询类型',
            prop: 'sqlKeyword',
            type: 'select',
            dicData: dataTypeList,//[],//queryKeyList,
            disabled: true,
            needSlot: true
          }
        ]
      },
      rowData: {}, // 当前行
      itemData: {}, // 当前项
      dialogVisible: false, // 配置下拉选择的数据
      // 下拉选择表单配置
      selectFormOption: {
        submitBtnText: '确定',
        column: [
          {
            label: '数据类型',
            prop: 'datatype',
            type: 'select',
            dicData: [
              {label: '接口地址', value: 'url'},
              {label: '配置数据', value: 'option'},
            ],
            children: [
              {
                label: '接口地址',
                prop: 'url',
                linkbind: 'url'
              },
              {
                label: '',
                prop: 'option',
                linkbind: 'option',
                formSlot: true
              },
              {
                label: '对应值',
                prop: 'props',
                formSlot: true,
                linkbind: 'url'
              },
            ]
          },
        ]
      },
      // 下拉选择数据配置
      selectOption: {
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
            label: '显示值',
            prop: 'label'
          },
          {
            label: '传递值',
            prop: 'value'
          }
        ]
      },
      propObj: {
        label: '',
        value: ''
      },
      dicDataList: []
    }
  },
  methods: {
    // 配置下拉选择的数据
    setOptionHandle (row, index) {
      this.rowData = row // JSON.parse(JSON.stringify(row))
      if(!this.rowData.dataConfig) {
        this.rowData.dataConfig = {}
      }
      if(!this.rowData.dataConfig.option) {
        this.rowData.dataConfig.option = []
      }
      this.dialogVisible = true
    },
    // 关闭配置下拉选择数据弹框
    handleClose () {
      this.dialogVisible = false
    },
    // 添加下拉数据选项
    addOptionRow () {
      this.rowData.dataConfig.option.push({
        columnName: '',
        columnComment: '',
        showChinese: '',
        sqlKeyword: ''
      })
    },
    // 删除下拉数据选项
    deleteOptionRow (row, index) {
      this.rowData.dataConfig.option.splice(index, 1)
    },
    // 新增查询条件
    addRowHandle () {
      this.tableData.push({
        columnName: '',
        columnComment: '',
        showChinese: '',
        sqlKeyword: '',
        type: ''
      })
    },
    // 删除查询条件
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
    },
    // name改变
    columnNameChange (data) {
      this.rowData = data.row
      this.itemData = data.item
      let item = data.item
      let row = data.row
      let tempLabel = ''
      let dtype = ''
      let dicList = []
      for(let i in item.dicData) {
        if(item.props) {
          if(item.dicData[i][item.props.value] == row[item.prop]) {
            tempLabel = item.dicData[i][item.props.label]
            dtype = item.dicData[i].dataType
            if(item.dicData[i].seniorSetting && item.dicData[i].seniorSetting.enumValues) {
              dicList = item.dicData[i].seniorSetting.enumValues
            }
          }
        }else{
          if(item.dicData[i].value == row[item.prop]) {
            tempLabel = item.dicData[i].label
            dtype = item.dicData[i].dataType
            if(item.dicData[i].seniorSetting && item.dicData[i].seniorSetting.enumValues) {
              dicList = item.dicData[i].seniorSetting.enumValues
            }
          }
        }
      }
      row.columnComment = tempLabel
      row.showChinese = tempLabel
      row.queryKey = dtype
      if(dtype && dtype == 'enum') {
        row.type = 'select'
        row.sqlKeyword = 'EQ'
        row.disabled = true
        // row.dataoption =  dicList
      }else{
        row.disabled = false
        row.dataoption = []
        row.sqlKeyword = ''
        row.type = ''
      }
      this.option.column.filter(item => {
        if(item.prop == 'sqlKeyword') {
          if(dtype && dtype == 'enum') {
            // item.dicData = [
            //   {label: '下拉选择', value: 'select'},
            // ]
            item.disabled = true
          }else{
            item.disabled = false
            // item.dicData = [
            //   {label: '输入框', value: 'input'},
            //   {label: '日期', value: 'date'},
            //   {label: '时间', value: 'time'},
            //   {label: '日期时间', value: 'datetime'},
            //   {label: '数字', value: 'inputNumber'},
            // ]
          }
        }
      })
    },
    // 配置数据类型
    dataConfigSubmit (form) {
      form.dataConfig.props = this.propObj
      this.rowData.dataConfig = JSON.parse(JSON.stringify(form.dataConfig))
      this.handleClose()
    },
    // 输入类型改变
    typeChange (data) {
      let item = data.item
      let row = data.row
      if(row.type == 'select') {
        row.sqlKeyword = 'EQ'
        row.disabled = true
      }else if(['daterange', 'timerange', 'datetimerange'].indexOf(row.type) > -1) {
        row.sqlKeyword = 'BETWEEN'
        row.disabled = true
      }else{
        row.disabled = false
        row.sqlKeyword = ''
      }
      this.$forceUpdate()
    },
    // 通过字段类型获取对应项
    getItemOfColumnTypeByValue (value, attr) {
      for(let i in dataTypeList) {
        if(dataTypeList[i].value == value) {
          return dataTypeList[i][attr]
        }
      }
      // for(let i in columnTypeList) {
      //   if(columnTypeList[i].value == value) {
      //     return columnTypeList[i][attr]
      //   }
      // }
      return false
    },
    // 获取类型对应的查询类型列表
    getDicDataHandle (row, index) {
      this.option.column.filter(item => {
        if(item.prop == 'sqlKeyword') {
          let list = JSON.parse(JSON.stringify(queryKeyList))
          for(let i in list) {
            let temp = this.getItemOfColumnTypeByValue((row.queryKey), 'sqlKeywords')
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
        }
      })
    }
  },
  watch: {
    tableSetNameOption (newVal, oldVal) {
      this.option.column.filter( item => {
        if(item.prop == 'columnName') {
          let temp = []
          for(let i in newVal) {
            // console.log(newVal[i].dataType)
            temp.push(newVal[i])
            // if(this.getItemOfColumnTypeByValue(newVal[i].dataType, 'isSearch')) {
            //   temp.push(newVal[i])
            // }
          }
          item.dicData = temp
        }
      })
    } 
  }
}
</script>
<style lang="scss" scoped>
</style>