<template>
  <div class="dictionaries-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='终端管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="handleView(scope.row)">查看</jvs-button>
      </template>
      <template slot="menuLeft">
        <jvs-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="75%"
      :before-close="handleClose">
      <jvs-form v-if="dialogVisible" :option="formOption" :formData="formData" @submit="handleAddSubmit"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getAppList, addApp, editApp, delApp, getAppById} from './api'
import tableForm from '@/components/basic-assembly/tableForm'
export default {
  name: 'application-manage',
  components: {tableForm},
  data () {
    return {
      title: '新增',
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
      formData: {},
      formOption: {
        submitLoading: false,
        cancal: false,
        column: [
          {
            label: '终端名称',
            prop: 'name',
            maxlength: 10,
            disabled: false,
            rules: [{ required: true, message: '请输入终端名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '描述',
            prop: 'describes',
            disabled: false,
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: 'app_id',
            prop: 'appKey',
            disabled: false,
            rules: [{ required: true, message: '请输入appId', trigger: 'blur' }],
          },
          {
            label: 'app_secret',
            prop: 'appSecret',
            disabled: true,
            display: false
          },
        ]
      },
      tableOption: {
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        viewBtn: false,
        addBtn: false,
        editBtn: true,
        delBtn: true,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '终端名称',
            prop: 'name',
            maxlength: 10,
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入终端名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '描述',
            prop: 'describes',
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: 'app_id',
            prop: 'appKey',
            disabled: true,
            rules: [{ required: true, message: '请输入appId', trigger: 'blur' }],
          },
          {
            label: 'app_secret',
            prop: 'appSecret',
            hide: true,
            disabled: true,
            rules: [{ required: true, message: '请输入appSecret', trigger: 'blur' }],
            addDisplay: false,
          },
        ]
      },
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
      getAppList(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 关闭弹窗
    handleClose() {
      this.formData = {}
      this.dialogVisible = false
    },
    // 新增终端
    handleAdd() {
      this.title = '新增'
      this.formOption.submitBtn = true
      this.formOption.emptyBtn = true
      this.formOption.column.forEach((item, key) => {
        item.disabled = false
        if (key === 3) {
          item.display = false
        }
      })
      this.dialogVisible = true
    },
    // 查看终端
    handleView(row) {
      this.title = '查看'
      this.formOption.column.forEach((item, key) => {
        item.disabled = true
        if (key === 3) {
          item.display = true
        }
      })
      this.formOption.submitBtn = false
      this.formOption.emptyBtn = false
      getAppById(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.formData = JSON.parse(JSON.stringify(res.data.data))
          this.dialogVisible = true
        }
      })
    },
    // 新增终端提交
    handleAddSubmit(form) {
      this.formOption.submitLoading = true
      addApp(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增终端成功')
          this.formOption.submitLoading = false
          this.handleClose()
          this.getList()
        } else {
          this.formOption.submitLoading = false
          this.handleClose()
        }
      }).catch(e => {
        this.formOption.submitLoading = false
        this.handleClose()
      })
    },
    // 新增
    addRowHandle (row) {
    },
    // 修改
    editRowHandle (row) {
      this.tableOption.submitLoading = true
      editApp(row).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改终端成功')
          this.tableOption.submitLoading =false
          this.getList()
        }
      }).catch(e => {
        this.tableOption.submitLoading = false
      })
    },
    // 删除
    delRowHandle (row) {
      delApp(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除字典成功')
          this.getList()
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
