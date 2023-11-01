<template>
  <div class="app-container">
    <jvs-table pageheadertitle='图文管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="menuLeft">
        <jvs-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate">新增</jvs-button>
      </template>
      <template slot="isUpload" slot-scope="scope">
        <span>{{scope.row.isUpload ? '是' : '否'}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</jvs-button>
        <jvs-button type="text" size="mini" @click="toTemplateForm(scope.row)">图文</jvs-button>
        <jvs-button v-if="scope.row.isUpload" type="text" size="mini" @click="handleSendPreview(scope.row)">预览</jvs-button>
        <jvs-button type="text" size="mini" @click="handleDelete(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <jvs-form v-if="dialogFormVisible" :option="option" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>

    <!-- 编辑图文 -->
    <el-dialog title="编辑图文" width="80%" :visible.sync="templateFormVisible" append-to-body :before-close="templateFormClose">
      <newsTemplateForm v-if="templateFormVisible" :rowData="rowData" @close="closeHandle"></newsTemplateForm>
    </el-dialog>

    <!--发送预览窗口-->
    <el-dialog title="发送预览" :visible.sync="viewVisible" :before-close="cancelSendPreview">
      <jvs-form v-if="viewVisible" :option="viewOption" :formData="viewForm" @submit="sendDataPreview" @cancalClick="cancelSendPreview"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, updateRow, deleteRow, filterFans, sendNewsPreview } from '../../api/wx-news-template'
import newsTemplateForm from './newsTemplateForm'
import { fetchAllAccount } from '../../api/wx-account'

export default {
  components: {newsTemplateForm},
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
            label: '公众号名称',
            prop: 'wxAccountId',
            search: true,
            searchSpan: 4,
            type: 'select',
            dicUrl: '/mgr/weixin-mp/wx/account/listAll',
            method: 'post',
            dicData: [],
            props: {
              label: 'name',
              value: 'id'
            },
            rules: [{ required: true, message: '请选择公众号', trigger: 'blur' }]
          },
          {
            label: '模板名称',
            prop: 'tplName',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
          },
          {
            label: '是否已上传微信',
            prop: 'isUpload',
            display: false,
            slot: true
          },
          {
            label: '图文数量',
            prop: 'countArticle',
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
      templateFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      accountListOptions: [],
      viewVisible: false,
      viewOption: {
        emptyBtn: false,
        submitBtnText: '发送',
        column: [
          {
            label: '公众号',
            prop: 'wxAccountId',
            type: 'select',
            dicUrl: '/mgr/weixin-mp/wx/account/listAll',
            method: 'post',
            props: {
              label: 'name',
              value: 'id'
            },
          },
          {
            label: '粉丝名称',
            prop: 'fansSelected',
            type: 'select',
            dicUrl: '',
            multiple: true
          }
        ]
      },
      viewForm: {
        'newsId': '',
        'wxAccountId': '',
        'fansSelected': []
      },
      fansOptions: [],
      loading: false,
      fansSelected: []
    }
  },
  created() {
    this.getAllAccount()
  },
  methods: {
    getList() {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      fetchList(Object.assign(query, {tplName: ''}, this.queryParams)).then(res => {
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
    getAllAccount () {
      fetchAllAccount().then(res => {
        if(res.data.code == 0) {
          this.option.column.filter(item => {
            if(item.prop == 'wxAccountId') {
              item.dicData = res.data.data
            }
          })
        }
      })
    },
    toTemplateForm (row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.templateFormVisible = true
    },
    templateFormClose () {
      this.templateFormVisible = false
      this.rowData = {}
    },
    closeHandle () {
      this.templateFormClose()
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      createRow(this.rowData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$message.success("创建成功")
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
        this.dialogFormVisible = false
        this.$message.success("更新成功")
      })
    },
    handleDelete(row) {
      if (row.isRelatedMenu == '1') {
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
            this.$message.success("删除成功")
            this.getList()
          })
        })
    },
    handleUpload() {
      this.$confirm('确定上传图文到微信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { 'id': row.id }
        deleteRow(params).then(() => {
          this.$message.success("上传成功")
          this.getList()
        })
      })
    },
    formatNewsType(row, column) {
      if (row.countArticle == 0) {
        return ''
      }
      if (row.countArticle == 1) {
        return '单图文'
      }
      if (row.countArticle > 1) {
        return '多图文'
      }
    },
    handleSendPreview(row) {
      this.viewForm.newsId = row.id
      this.viewForm.wxAccountId = row.wxAccountId
      this.viewForm.fansSelected = []
      this.viewVisible = true
    },
    cancelSendPreview() {
      this.viewVisible = false
      this.fansOptions = []
    },
    filterFans(value) {
      if (!value) {
        return false
      }
      this.loading = true
      var params = { 'wxAccountId': this.viewForm.wxAccountId, 'nicknameStr': value }
      filterFans(params).then(res => {
        this.loading = false
        this.fansOptions = res.data
      })
    },
    sendDataPreview() {
      if (this.viewForm.fansSelected.length == 0) {
        this.$message({ message: '请选择粉丝', type: 'warning' })
        return false
      }

      this.$confirm('确定发送预览图文?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = Object.assign({}, this.viewForm)
        sendNewsPreview(params).then(res => {
          this.cancelSendPreview()
          this.$message.success("发送成功")
        })
      })
    }
  }
}
</script>
