<template>
  <div class="app-container">
    <jvs-table pageheadertitle='欢迎语管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="menuLeft">
        <jvs-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate">新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</jvs-button>
        <jvs-button type="text" size="mini" @click="handleDelete(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="dialogFormClose">
      <jvs-form v-if="dialogFormVisible" :option="option" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, updateRow, deleteRow } from '../../api/wx_subscribe_text'
import {fetchAllAccount} from '../../api/wx-account'
import { fetchAllTextTpl } from '../../api/wx-text-template'

export default {
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
            rules: [{ required: true, message: '请选择公众号', trigger: 'blur' }],
            type: 'select',
            dicUrl: '/mgr/weixin-mp/wx/account/listAll',
            method: 'post',
            props: {
              label: 'name',
              value: 'id'
            },
          },
          {
            label: '消息类型',
            prop: 'msgType',
            rules: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
            type: 'select',
            dicData: [
              {label: '文本消息', value: '1'}
            ]
          },
          {
            label: '模板名称',
            prop: 'tplId',
            type: 'select',
            // dicUrl: '/mgr/weixin-mp/wx/text/template/listAll',
            dicData: [],
            method: 'post',
            rules: [{ required: true, message: '请选择模板', trigger: 'blur' }],
            props: {
              label: 'tplName',
              value: 'id'
            },
          },
          {
            label: '模板名称',
            prop: 'tplName',
            display: false
          },
          {
            label: '模板内容',
            prop: 'tplContent',
            display: false
          },
        ]
      },
      rowData: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      }
    }
  },
  created() {
    this.getAllTextTpl()
  },
  methods: {
    getList() {
      this.fetchAllAccount()
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      fetchList(Object.assign(query, this.queryParams)).then(res => {
        if(res.data && res.data.code == 0) {
          this.tableLoading = false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    dialogFormClose () {
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
        this.dialogFormVisible = false
        this.$message.success('创建成功')
      })
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      let tempData = Object.assign({}, this.rowData)
      updateRow(tempData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$message.success('更新成功')
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
            this.$message.success('删除成功')
            this.getList()
          })
        })
    },
    fetchAllAccount () {
      fetchAllAccount().then(res => {
        if(res.data && res.data.code == 0) {
          this.option.column.filter(item => {
            if(item.prop == 'wxAccountId') {
              item.dicData = res.data.data
            }
          })
        }
      })
    },
    getAllTextTpl() {
      fetchAllTextTpl().then(res => {
        if(res.data && res.data.code == 0) {
          this.option.column.filter(item => {
            if(item.prop == 'tplId') {
              item.dicData = res.data.data
            }
          })
        }
      })
    }
  }
}
</script>
