<template>
  <div class="app-container">
    <jvs-table pageheadertitle='消息管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="nicknameStr" slot-scope="scope">
        <span>{{ scope.row.nicknameStr }}</span>
        <br>
        <el-tag v-for="(item, index) in scope.row.tagList" :key="index" type="small" style="margin-top: 5px;margin-right: 5px;" hit>
          {{ item.name }}
        </el-tag>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6">
            <div class="grid-content bg-purple" />
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light" />
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" />
          </el-col>
        </el-row>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">回复</jvs-button>
        <jvs-button type="text" size="mini" @click="handleDelete(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>

    <el-dialog title="快捷回复" :visible.sync="dialogFormVisible" :before-close="closeHandle">
      <jvs-form v-if="dialogFormVisible" :option="formOption" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, deleteRow, updateResContent } from '../../api/wx-fans-msg'
import { fetchAllAccount } from '../../api/wx-account'

export default {
  filters: {},
  data() {
    return {
      tableData: [],
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: {
        cancal: false,
        search: true,
        align: 'center',
        menuAlign: 'center',
        page: true,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        column: [
          {
            label: '公众号',
            prop: 'wxAccountName',
            searchSpan: 4,
            search: true
          },
          {
            label: '昵称',
            prop: 'nicknameStr',
            slot: true
          },
          {
            label: '头像',
            prop: 'headimgUrl',
            type: 'image',
          },
          {
            label: '消息类型',
            prop: 'msgType'
          },
          {
            label: '粉丝发送内容',
            prop: 'content'
          },
          {
            label: '粉丝发送图片',
            prop: 'picPath'
          },
          {
            label: '回复内容',
            prop: 'resContent'
          },
          {
            label: '是否已回复',
            prop: 'isRes'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '更新时间',
            prop: 'updateTime'
          },
        ]
      },
      rowData: {},
      formOption: {
        cancal: false,
        column: [
          {
            label: '回复内容',
            prop: 'resContent',
            type: 'textarea',
            rows: 7,
            maxlength: 100,
            rules: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      accountListOptions: []
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
      this.getAccountList()
      fetchList(Object.assign(query, this.queryParams)).then(res => {
        if(res.data && res.data.code == 0) {
          this.tableLoading = false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData= res.data.data.records
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRow(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      // 回复内容置为空
      this.$set(this.rowData, 'resContent', '')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      let tempData = { id: this.rowData.id, resContent: this.rowData.resContent, isRes: '1' }
      updateResContent(tempData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$message.success("更新成功")
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { 'id': row.id }
        deleteRow(params).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    closeHandle () {
      this.dialogFormVisible = false
      this.rowData = {}
    },
    getAccountList() {
      fetchAllAccount().then(response => {
        this.accountListOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.accountListOptions.push({ 'key': response.data[i].id + '', 'display_name': response.data[i].name })
        }
      })
    },
    formatMsgType(row, column) {
      switch (row.msgType) {
        case 'text':
          return '文本'
          break
        case 'image':
          return '图片'
          break
        default :
          return ''
          break
      }
    }
  }
}
</script>
