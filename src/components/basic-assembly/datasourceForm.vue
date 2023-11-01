<template>
  <div class="datasource-info-list">
    <div>
      <el-input size="mini" placeholder="请选择数据" :disabled="disabled" v-model="userStr" class="input-with-select" @focus="enableinputHandle">
        <div slot="append" v-if="!disabled">
          <jvs-button icon="el-icon-search" type="info" :disabled="disabled" @click="openDialog"></jvs-button>
          <jvs-button icon="el-icon-delete" type="warning" :disabled="disabled" @click="clearUser"></jvs-button>
        </div>
      </el-input>
    </div>
    <el-dialog
      title="选择数据"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
      fullscreen
      class="form-fullscreen-dialog datasource-info-list-dialog"
    >
      <div class="datasource-info-box">
        <jvs-table
          :class="{'table-info-table': true, 'table-info-table-empty': tableData.length == 0}"
          :loading="tableLoading"
          :page="page"
          :option="option"
          :data="tableData"
          :selectable="selectable"
          @on-load="getList"
          @row-click="selectOne"
          @search-change="searchChange"
          @selection-change="selectChange"
        >
          <template slot="headerTop">
            <jvs-form :option="queryOption" :formData="queryParams" @submit="searchChange"></jvs-form>
          </template>
          <template slot="roleName" slot-scope="scope">
            <span>{{scope.row.roleName | formatRoleName}}</span>
          </template>
        </jvs-table>
      </div>
      <el-row style="display:flex;justify-content:center;align-items:center;">
        <jvs-button size="mini" type="primary" @click="submit">确定</jvs-button>
        <jvs-button size="mini" @click="cancel">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDataSourceInfoList } from "../api";
import {columnTypeList} from '@/const/columnTypeList'
import {sendMyRequire} from '@/api/newDesign'

// 表单项
import MInput from '@/plugin/assembly/input'
import MTextarea from '@/plugin/assembly/textarea'
import MInputNumber from '@/plugin/assembly/inputNumber'
import MSwitch from '@/plugin/assembly/switch'
import MTimepicker from '@/plugin/assembly/timepicker'
import MDatePicker from '@/plugin/assembly/datePicker'
import MSelect from '@/plugin/assembly/select'
export default {
  name: "datasource-info-list",
  components: {},
  props: {
    item: {
      type: Object
    },
    form: {
      type: Object
    },
    prop: {
      type: String
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    resetRadom: {
      type: Number
    }
  },
  computed: {},
  filters: {
    formatRoleName (list) {
      let str = ''
      if(list) {
        str = list.join(',')
      }
      return str
    }
  },
  data () {
    return {
      queryParams: {},
      tableLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        viewBtn: false,
        addBtn: false,
        menu: false,
        selection: true,
        search: false,
        showOverflow: true,
        isSearch: true,
        labelWidth: 'auto',
        searchBtnText: '查询',
        highlightCurrentRow: true,
        cancal: false,
        column: []
      },
      queryOption: {
        isSearch: true,
        labelWidth: 'auto',
        submitBtnText: '查询',
        cancal: false,
        column: []
      },
      selected: {},
      dialogVisible: false,
      userStr: '',
      userList: [],
      userNameList: []
    }
  },
  methods: {
    init () {
      if(this.item.sourceType == "api") {
        if(this.item.queryProp) {
          let temp = []
          for(let i in this.item.queryProp) {
            temp.push({
              label: this.item.queryProp[i].label,
              prop: this.item.queryProp[i].value,
              span: 6
            })
          }
          this.queryOption.column = temp
        }
        if(this.item.infoColumn) {
          let temp = []
          for(let i in this.item.infoColumn) {
            temp.push({
              label: this.item.infoColumn[i].label,
              prop: this.item.infoColumn[i].value
            })
          }
          this.option.column = temp
        }
      }
      if(this.item.sourceType == "database") {
        if(this.item && this.item.tableName) {
          if(this.item.infoColumnFields && this.item.infoColumnFields.length > 0) {
            let temp = this.eachColumnList(this.item.infoColumnFields)
            this.option.column = temp
          }
          if(this.item.queryColumnFields && this.item.queryColumnFields.length > 0) {
            let temp = this.eachColumnList(this.item.infoColumnFields, 'search')
            this.queryOption.column = temp
          }
        }
      }
    },
    // 遍历字段列表生成表单项
    eachColumnList (list, type) {
      let temp = []
      for(let i in list) {
        let columnTemp = this.getIteTypeOfForm(list[i].dataType)
        if(!columnTemp) {
          columnTemp = {
            type: 'select'
          }
        }
        let obj = {}
        switch(columnTemp.type) {
          case 'input':
            obj = new MInput();
            obj.placeholder = '请输入' + list[i].columnComment;
            break;
          case 'textarea':
            obj = new MTextarea();
            obj.placeholder = '请输入' + list[i].columnComment;
            break;
          case 'inputNumber':
            obj = new MInputNumber();
            obj.placeholder = '请输入' + list[i].columnComment;
            break;
          case 'switch':
            obj = new MSwitch();
            break;
          case 'timePicker':
            obj = new MTimepicker();
            obj.placeholder = '请选择' + list[i].columnComment;
            break;
          case 'datePicker':
            obj = new MDatePicker();
            obj.placeholder = '请选择' + list[i].columnComment;
            break;
          case 'select':
            obj = new MSelect();
            obj.multiple = false;
            if(list[i].seniorSetting && list[i].seniorSetting.enumValues) {
              obj.dicData = list[i].seniorSetting.enumValues
            };
            obj.sqlType = 'enum';
            obj.placeholder = '请选择' + list[i].columnComment;
            break;
          default :
            obj = new MInput();
            obj.placeholder = '请输入' + list[i].columnComment;
            break;
        }
        obj.label = list[i].columnComment
        obj.prop = list[i].fieldName
        obj.searchSpan = 6
        obj.search = true
        if(type == 'search') {
          obj.span = 6
        }
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

    getList (isFirst) {
      if(this.item.sourceType == "database") {
        let bool = true
        let list = ['databaseName', 'tableName', 'infoColumn', 'showProp', 'sendProp']
        for(let i in list) {
          if(this.item[list[i]]) {
            bool = (bool && true)
            if(list[i] == 'infoColumn' && this.item.infoColumn.length == 0) {
              bool = (bool && false)
            }
          }else{
            bool = (bool && false)
          }
        }
        if(bool) {
          let info = []
          for(let f in this.item.infoColumn) {
            info.push(this.item.infoColumn[f].value)
          }
          let obj={
            databaseName: this.item.databaseName,
            tableName: this.item.tableName,
            selectedViewFieldName: info,
            displayValueFieldName: this.item.showProp,
            passValueFieldName: this.item.sendProp
          }
          let queryConditions = {}
          queryConditions = Object.assign(queryConditions, this.queryParams)
          let query = {
            current: this.page.currentPage,
            size: this.page.pageSize
          }
          if(queryConditions && JSON.stringify(queryConditions) != '{}') {
            query.queryConditions = queryConditions
          }
          this.tableLoading = true
          getDataSourceInfoList(Object.assign(obj, query)).then(res => {
            if (res.data.code==0) {
              this.userStr = ""
              this.tableData=res.data.data.records
              this.page.total=res.data.data.total
              this.page.currentPage=res.data.data.current
              this.tableLoading = false
              if(isFirst) {
                if(this.form[this.prop]) {
                  if(this.selectable) {
                    let temp = []
                    for(let i in this.tableData) {
                      if(this.form[this.prop].indexOf(this.tableData[i][this.item.sendProp]) > -1) {
                        temp.push(this.tableData[i][this.item.showProp]) // userName
                      }
                    }
                    this.userStr = temp.join(',')
                    this.userNameList = temp
                    this.userList = this.form[this.prop]
                  }else{
                    this.userStr = this.form[this.item.showProp]
                    for(let i in this.tableData) {
                      if(this.form[this.prop] == this.tableData[i][this.item.sendProp]) {
                        this.userStr = this.tableData[i][this.item.showProp] // userName
                      }
                    }
                  }
                }
              }
            }
          }).catch(e => {
            this.tableLoading = false
          })
        }
      }
      if(this.item.sourceType == 'api') {
        if(this.item.apiHttp) {
          let tp = JSON.parse(JSON.stringify(this.item.apiHttp))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          if(tp && this.item.showProp && this.item.sendProp) {
            this.tableLoading = true
            sendMyRequire(tp, {}).then(res => {
              if (res.data.code==0) {
                this.tableData=res.data.data.records
                this.page.total=res.data.data.total
                this.page.currentPage=res.data.data.current
                this.tableLoading = false
                if(isFirst) {
                  if(this.form[this.prop]) {
                    if(this.selectable) {
                      let temp = []
                      for(let i in this.tableData) {
                        if(this.form[this.prop].indexOf(this.tableData[i][this.item.sendProp]) > -1) {
                          temp.push(this.tableData[i][this.item.showProp])
                        }
                      }
                      this.userStr = temp.join(',')
                      this.userNameList = temp
                      this.userList = this.form[this.prop]
                    }else{
                      this.userStr = this.form[this.item.showProp]
                      for(let i in this.tableData) {
                        if(this.form[this.prop] == this.tableData[i][this.item.sendProp]) {
                          this.userStr = this.tableData[i][this.item.showProp]
                        }
                      }
                    }
                  }
                }
              }
            }).catch(e => {
              this.tableLoading = false
            })
          }
        }
      }
    },
    selectOne (data) {
      this.selected = data.row
    },
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    selectChange (data) {
      let temp = []
      let nm = []
      for(let i in data) {
        temp.push(data[i][this.item.sendProp])
        nm.push(data[i][this.item.showProp])
      }
      this.userList = temp
      this.userNameList = nm
    },
    submit () {
      if(this.selectable) {
        this.userStr = this.userNameList.join(',')
        this.form[this.prop] = this.userList
      }else{
        if(this.selected) {
          this.form[this.prop] = this.selected[this.item.sendProp]
          this.userStr = this.selected[this.item.showProp]
        }
      }
      this.$emit('change', this.form)
      this.handleClose()
    },
    cancel () {
      this.$emit('cancel', true)
      this.handleClose()
    },
    openDialog () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    },
    enableinputHandle () {
      this.openDialog()
    },
    clearUser () {
      this.userStr = ""
      if(this.selectable) {
        this.form[this.prop] = []
      }else{
        if(this.selected) {
          this.form[this.prop] = ""
        }
      }
    }
  },
  mounted () {},
  created () {
    this.init()
    this.getList(true)
  },
  watch: {
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.getList(true)
        }
      }
    }
  }
};
</script>

<style lang="scss">
.datasource-info-box{
  display: flex;
  width: 100%;
  overflow: hidden;
  height: calc(100% - 35px);
  .user-dept-tree{
    width: 150px;
  }
  .table-info-table{
    flex: 1;
    margin-left: 20px;
    width: calc(100% - 200px);
    box-sizing: border-box;
    .el-card{
      box-shadow: none;
      border: 0;
    }
    .el-card__body{
      border: 0;
    }
    .table-body-box{
      margin-top: 0!important;
    }
  }
  .table-info-table-empty{
    .el-table__body-wrapper{
      height: auto!important;
    }
  }
}
.datasource-info-list-dialog{
  .el-dialog.is-fullscreen{
    height: 100%;
    overflow: hidden;
    .el-dialog__body{
      width: 100%;
      position: unset;
      height: calc(100% - 45px);
      box-sizing: border-box;
      padding: 0;
    }
  }
}
.el-form-item.is-error{
  .datasource-info-list{
    .el-input-group__append{
      border-color: #F56C6C;
      .el-button{
        color: #F56C6C;
      }
    }
  }
}
</style>