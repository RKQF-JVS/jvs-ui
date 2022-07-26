<template>
  <div :class="{'table-form': true, 'table-form-noteditable': !item.editable}">
    <jvs-table
      :pageheadertitle="item.editable ? '' : item.label"
      :option="options"
      :page="page"
      :data="tableData"
      @on-load="getList"
    >
      <template slot="menu" slot-scope="scope">
        <div style="width: 100%;display: flex;justify-content: center;">
          <jvs-button v-if="!item.editable && item.editBtn" size="mini" type="text" @click="showForm(item, 'edit', scope.row, scope.index)">编辑</jvs-button>
          <jvs-button v-if="!item.editable && item.viewBtn" size="mini" type="text" @click="showForm(item, 'view', scope.row, scope.index)">详情</jvs-button>
          <slot name="menuBtn" :row="scope.row" :index="scope.index"></slot>
          <jvs-button v-if="!item.editable && item.delBtn" size="mini" type="text" @click="delRowHandle(scope.row, scope.index)">删除</jvs-button>
        </div>
      </template>
      <template slot="menuLeft">
        <jvs-button v-if="!item.editable && item.addBtn" size="mini" type="primary" @click="showForm(item, 'add')">新增</jvs-button>
      </template>
      <template v-for="(item, index) in options.tableColumn" :slot="item.prop" slot-scope="scope">
        <div :key="item.prop+'node'+index">
          <div v-if="item.text && item.text.label && scope.row[item.prop] == item.text.value" :key="item.prop+'text'">
            <span>{{item.text.label}}</span>
          </div>
          <div v-if="item.needSlot !== true && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && displayByBind(item, scope.row)" :key="item.prop+'item'">
            <tableFormItem
              :style="'justify-content:'+ (options.align == 'center' ? 'center' : 'flex-start')"
              :form="scope.row"
              :item="item"
              :roleOption="roleOption"
              :userList="userList"
              :departmentList="departmentList"
              :postList="postList"
              @formChange="formChange"
            ></tableFormItem>
          </div>
          <div v-if="displayByBind(item, scope.row) && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && item.needSlot === true" :key="item.prop+'needslotitem'">
            <slot :name="item.prop+'Item'" :row="scope.row" :index="scope.index"></slot>
          </div>
        </div>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {getSelectData} from '@/api/index'
import {sendMyRequire} from '@/api/newDesign'
export default {
  name: 'table-Form',
  components: {
    // 异步import，formitem引用了tableForm，嵌套时异步引用
    tableFormItem: () => import('@/components/basic-assembly/formitem'),
  },
  props: {
    item: {
      type: Object
    },
    option: {
      type: Object
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    originOption: {
      type: Object
    },
    defalutSet: {
      type: Object
    },
    rowData: {
      type: Object
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 部门列表
    departmentList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 岗位列表
    postList: {
      type: Array,
      default: () => {
        return []
      }
    },
    resetRadom: {
      type: Number
    }
  },
  computed: {
    options (){
      let temp = JSON.parse(JSON.stringify(this.option))
      if(temp.column && !temp.tableColumn) {
        temp.tableColumn = temp.column
      }
      if(this.item.editable) {
        for(let i in temp.tableColumn) {
          temp.tableColumn[i].slot = true
        }
      }
      if(!temp.column) {
        temp.column = temp.tableColumn
      }
      if(this.item.editable) {
        if(this.item.delBtn) {
          temp.menu = true
        }else{
          temp.menu = false
        }
      }else{
        if(this.item.editBtn || this.item.viewBtn || this.item.delBtn) {
          temp.menu = true
        }else{
          temp.menu = false
        }
      }
      if(this.item.page && this.item.editable) {
        temp.page = true
      }else{
        temp.page = false
      }
      if(this.item.menuFix) {
        temp.menuFix = this.item.menuFix
      }
      temp.menuAlign = 'center'
      return temp
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      title: '',
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      openType: '', // 弹框类型
      rowIndex: -1, // 行数据index
      loadTimes: -1, // 加载次数
      initData: []
    }
  },
  methods: {
    init () {
      for(let i in this.options.tableColumn) {
        if(this.options.tableColumn[i].dicUrl) {
          getSelectData(this.options.tableColumn[i].dicUrl).then(res => {
            if(res.data.code == 0) {
               for(let sitem in res.data.data){
                if(typeof sitem == 'string') {
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem][this.options.tableColumn[i].props.label ? this.options.tableColumn[i].props.label : 'label'],
                    value: res.data.data[sitem][this.options.tableColumn[i].props.value ? this.options.tableColumn[i].props.value : 'value']
                  })
                }
              }
            }
          })
        }
        if(this.options.tableColumn[i].dicData) {
          let temp = []
          let bool = false
          for(let j in this.options.tableColumn[i].dicData) {
            if(typeof this.options.tableColumn[i].dicData[j] == 'string') {
              bool = true
              temp.push({
                label: this.options.tableColumn[i].dicData[j],
                value: this.options.tableColumn[i].dicData[j]
              })
            }
          }
          if(bool) {
            this.options.tableColumn[i].dicData = temp
          }
        }
      }
    },
    // 下拉选择change
    valueChange (item, row) {
      this.$emit((item.prop+'Change'), {
        item: item,
        row: row
      })
    },
    // 根据绑定字段值决定显隐
    displayByBind (item, row) {
      let temp = true
      if(item.display) {
        if(typeof item.display.value == 'object' && (item.display.value instanceof Array)) {
          if(item.display.value.indexOf(row[item.display.key]) > -1) {
            temp = true
          }else{
            temp = false
          }
        }else{
          if(row[item.display.key] == item.display.value) {
            temp = true
          }else{
            temp = false
          }
        }
      }else{
        temp = true
      }
      return temp
    },
    formChange (form) {
      this.$emit('formChange', form)
    },
    // 打开表单
    showForm (item, type, row, index) {
      this.openType = type
      if(index || index == 0) {
        this.rowIndex = index
      }
      let code = ""
      if(type == 'add') {
        code = item.addBtnFormCode
        this.title = '新增'
      }else if(type == 'edit'){
        code = item.editBtnFormCode
        this.title = '编辑'
      }else{
        code = item.viewBtnFormCode
        this.title = '详情'
      }
      if(code) {
        this.$refs.formDialog.childFormInit(code, row)
      }
    },
    childFormSubmit (form) {
      if(typeof form == 'object') {
        if(form) {
          if(this.openType == 'add') {
            this.tableData.push(form)
            this.getList()
          }
          if(this.openType == 'edit') {
            if(this.rowIndex > -1) {
              this.$set(this.tableData, this.rowIndex, form)
            }
            this.getList()
          }
        }else{
          this.getList()
        }
      }else{
        // 当前只存在false情况
      }
    },
    // 表格数据api来源
    getList () {
      if(this.item.tableEchoRequest && !this.item.editable) {
        // 请求接口
        let tp = JSON.parse(JSON.stringify(this.item.tableEchoRequest))
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          let query = {}
          if(this.item.page) {
            query.current = this.page.currentPage
            query.size = this.page.pageSize
          }
          if(this.rowData) {
            query = Object.assign(query, this.rowData)
          }
          sendMyRequire(tp, query).then(res => {
            if(res.data.code == 0) {
              if(this.item.page) {
                this.tableData = res.data.data.records
                this.page.currentPage = res.data.data.current
                this.page.total = res.data.data.total
                this.initData = JSON.parse(JSON.stringify(res.data.data.records))
              }else{
                this.tableData = res.data.data
                this.initData = JSON.parse(JSON.stringify(res.data.data))
              }
              this.$forceUpdate()
            }
          })
        }
      }else{
        if(this.loadTimes == -1 && this.data) {
          this.tableData = JSON.parse(JSON.stringify(this.data))
          this.initData = JSON.parse(JSON.stringify(this.data))
          this.$forceUpdate()
        }
      }
      this.loadTimes++
    },
    // 删除
    delRowHandle (row, index) {
      if(this.item.editable) {
        this.tableData.splice(index, 1)
      }else{
        if(this.item.tableDeleteRequest && this.item.tableDeleteRequest.url) {
          // 请求接口
          let tp = JSON.parse(JSON.stringify(this.item.tableDeleteRequest))
          if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
            tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
          }
          if(tp && tp.url) {
            sendMyRequire(tp, row).then(res => {
              if(res.data.code == 0) {
                this.getList()
                this.$forceUpdate()
              }
            })
          }
        }else{
          this.tableData.splice(index, 1)
        }
      }
    },
    reset () {
      this.$set(this, 'tableData', this.data)
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      }
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.$emit('setTable', newVal)
      }
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.reset()
        }
      }
    },
    data: {
      handler (newVal, oldVal) {
        if(this.item.editable) {
          this.tableData = this.data
          this.$forceUpdate()
        }
      }
    }
  }
}
</script>
<style lang="scss">
.table-form{
  overflow: hidden;
  .el-card{
    border-width: 0;
  }
  .jvs-table{
    .el-table{
      .el-table__header-wrapper{
        margin-top: 0;
      }
      .el-table__body-wrapper{
        .el-table__empty-block{
          border-top: 0;
        }
      }
      .cell{
        >div{
          width: 100%;
        }
        .el-radio-group, .el-checkbox-group{
          width: 100%;
          div{
            display: flex;
            flex-wrap: wrap;
            .el-radio, .el-checkbox{
              min-width: 50%;
              margin-right: 0;
              text-align: left;
            }
          }
        }
      }
      .el-table__fixed, .el-table__fixed-right{
        margin-top: 0;
      }
    }
    .el-table.el-table--border{
      .el-table__body-wrapper{
        .el-table__empty-block{
          border-top: 0;
          border-left: 0;
        }
      }
    }
  }
  .table-body-box{
    .el-table__body-wrapper{
      height: auto!important;
    }
    .el-table__body-wrapper::-webkit-scrollbar{
      height: 8px;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb{
      border-radius: 20px;
    }
    .el-table__fixed-right{
      padding-bottom: 4px;
    }
  }
  .el-table__row{
    .el-input{
      font-size: 12px;
      .el-input__inner{
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
.table-form-noteditable{
  padding: 10px;
  .jvs-table{
    .jvs-table-titleTop{
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .table-body-box{
      padding: 0;
    }
  }
}
</style>
