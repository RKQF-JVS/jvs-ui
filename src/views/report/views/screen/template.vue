<template>
  <div class="dictionaries-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='大屏模板管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addHandle"
      @editRow="editHandle"
      @delRow="delRowHandle"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="screenDesign(scope.row)">设计</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :modal="false"
      title=""
      class="screen-design-dialog"
      :visible.sync="dialogVisible"
      fullscreen
      append-to-body
      :before-close="handleClose">
      <screenDesign v-if="dialogVisible" :rowData="rowData"></screenDesign>
    </el-dialog>
  </div>
</template>
<script>
import {getTableList, addRow, editRow, delRow} from './api'
export default {
  name: 'report-type',
  components: {
    screenDesign: require('./screenDesign.vue').default
  },
  data () {
    return {
      dialogVisible: false,
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {}, // 行数据
      tableData: [],
      tableOption: {
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        viewBtn: true,
        addBtn: true,
        editBtn: true,
        delBtn: true,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '模板名称',
            prop: 'tplName',
            search: true,
            rules: [{ required: true, message: '请输入模板名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '大屏宽度',
            prop: 'width',
            type: 'inputNumber',
            rules: [{ required: true, message: '请输入大屏宽度', trigger: ['blur', 'change'] }]
          },
          {
            label: '大屏高度',
            prop: 'height',
            type: 'inputNumber',
            rules: [{ required: true, message: '请输入大屏高度', trigger: ['blur', 'change'] }]
          }
        ]
      },
      dialogVisible: false,
      rowData: {}
    }
  },
  methods: {
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getTableList(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData = res.data.data.records
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 新增
    addHandle (form) {
      addRow(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    },
    // 编辑
    editHandle (form) {
      editRow(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('编辑成功')
          this.getList()
        }
      })
    },
    // 删除
    delRowHandle (row) {
      delRow(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    screenDesign(row){
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.rowData = {}
    }
  }
}
</script>
<style lang="scss">
.screen-design-dialog{
  .el-dialog{
    .el-dialog__header{
      padding: 0!important;
      height: 0!important;
      .el-dialog__headerbtn{
        z-index: 9999999;
      }
    }
    .el-dialog__header::before{
      display: none!important;
    }
    .el-dialog__body{
      padding: 0;
      height: 100%;
    }
  }
}
</style>

