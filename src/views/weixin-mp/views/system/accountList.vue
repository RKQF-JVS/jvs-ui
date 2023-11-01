<template>
  <div class="app-container">
    <jvs-table pageheadertitle='账号管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="menuLeft">
        <jvs-button type="primary" size="mini" @click="handleCreate">新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</jvs-button>
        <jvs-button type="text" size="mini" @click="generateQRUrl(scope.row)">生成二维码</jvs-button>
        <jvs-button type="text" size="mini" @click="handleDelete(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body :before-close="handleClose">
      <jvs-form v-if="dialogFormVisible" :option="option" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, updateRow, deleteRow, generateQRUrl } from '../../api/wx-account'
export default {
  filters: {},
  data() {
    return {
      tableData: [],
      queryParams: {},
      option: {
        cancal: false,
        search: true,
        page: true,
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 200,
        column: [
          {
            label: '公众号名称',
            prop: 'name',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入公众号名称', trigger: 'blur' }]
          },
          {
            label: '二维码',
            prop: 'qrUrl',
            type: 'image',
            width: 100,
            display: false
          },
          {
            label: '公众号ID',
            prop: 'account',
            rules: [{ required: true, message: '请输入公众号ID', trigger: 'blur' }]
          },
          {
            label: 'AppID',
            prop: 'appid',
            rules: [{ required: true, message: '请输入AppID', trigger: 'blur' }]
          },
          {
            label: 'AppSecret',
            prop: 'appsecret',
            rules: [{ required: true, message: '请输入AppSecret', trigger: 'blur' }]
          },
          {
            label: 'Token',
            prop: 'token',
            rules: [{ required: true, message: '请输入Token', trigger: 'blur' }],
          },
          {
            label: 'URL',
            prop: 'url',
            rules: [{ required: true, message: '请输入URL', trigger: 'blur' }],
            tips: {
              position: 'bottom',
              text: 'http://{域名}/api/wx/portal/{appid}'
            }
          },
          {
            label: 'AesKey',
            prop: 'aeskey',
            rules: [{ required: true, message: '请输入AesKey', trigger: 'blur' }]
          }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      rowData: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
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
    handleClose () {
      this.dialogFormVisible = false
      this.rowData = {}
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      createRow(this.rowData).then(() => {
        this.getList()
        this.handleClose()
        this.$message.success("创建成功")
      })
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData(form) {
      updateRow(this.rowData).then(() => {
        this.getList()
        this.handleClose()
        this.$message.success("更新成功")
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { 'id': row.id }
          deleteRow(params).then(() => {
            this.$message.success("删除成功")
            this.getList()
          })
        })
    },
    generateQRUrl(row) {
      this.$confirm('确定生成二维码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, row)
        generateQRUrl(tempData).then(() => {
          this.getList()
          this.$message.success("生成二维码成功")
        })
      })
    }
  }

}
</script>
