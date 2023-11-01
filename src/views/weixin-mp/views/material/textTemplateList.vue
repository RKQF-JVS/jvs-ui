<template>
  <div class="app-container">
    <jvs-table pageheadertitle='文本管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="menuLeft">
        <jvs-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate">新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</jvs-button>
        <jvs-button type="text" size="mini" @click="handleDelete(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body :before-close="dialogFormClose">
      <jvs-form v-if="dialogFormVisible" :option="option" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, updateRow, deleteRow } from '../../api/wx-text-template'
export default {
  filters: {},
  data() {
    return {
      tableData: [],
      queryParams: {},
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: {
        cancal: false,
        search: true,
        page: true,
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        column: [
          {
            label: '模板名称',
            prop: 'tplName',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
          },
          {
            label: '模板内容',
            prop: 'content',
            rules: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
          },
          {
            label: '是否已关联欢迎语',
            prop: 'isRelatedSubscribeText',
            display: false
          },
          {
            label: '是否已关联关键字',
            prop: 'isRelatedReceiveText',
            display: false
          },
          {
            label: '是否已关联菜单',
            prop: 'isRelatedMenu',
            display: false
          }
        ]
      },
      rowData: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      },
    }
  },
  created() {},
  methods: {
    getList() {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      if(!this.queryParams || !this.queryParams.tplName) {
        this.queryParams = {
          tplName: ''
        }
      }
      fetchList(Object.assign(query, this.queryParams)).then(res => {
        this.tableLoading = false
        this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
      }).catch(e => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      createRow(this.rowData).then(() => {
        this.getList()
        this.dialogFormClose()
        this.$message.success('创建成功')
      })
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const tempData = Object.assign({}, this.rowData)
      updateRow(tempData).then(() => {
        this.getList()
        this.dialogFormClose()
        this.$message.success('更新成功')
      })
    },
    dialogFormClose () {
      this.rowData = {}
      this.dialogFormVisible = false
    },
    handleDelete(row) {
      if (row.isRelatedSubscribeText == '1' || row.isRelatedReceiveText == '1' || row.isRelatedMenu == '1') {
        this.$message({ message: '请先解除关联', type: 'warning' })
        return false
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { 'id': row.id }
          deleteRow(params).then(() => {
            this.$message.success('删除成功')
            this.getList()
          })
        })
    }
  }
}
</script>
