<template>
  <div class="data-authority">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      pageheadertitle='数据权限'
      :data="tableData"
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
    </jvs-table>
  </div>
</template>

<script>
import {addDataAuth, delDataAuth, editDataAuth, getAuthPage} from "./api";

export default {
  name: "dataAuthority",
  data() {
    return {
      // 查询条件
      queryParams: {},
      tableLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableOption: {
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        addBtn: this.$permissionMatch("upms_dataAuth_add"),
        editBtn: this.$permissionMatch("upms_dataAuth_edit"),
        delBtn: this.$permissionMatch("upms_dataAuth_delete"),
        viewBtn: false,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '名称',
            prop: 'name',
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          },
          {
            label: '功能',
            prop: 'functionName',
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
            showwordlimit: true,
            maxlength: 10
          },
          // {
          //   label: '应用ID',
          //   prop: 'applyId',
          //   rules: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
          // },
          {
            label: '描述',
            prop: 'describes',
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: '网络接口',
            prop: 'api',
            rules: [{ required: true, message: '请输入网络接口', trigger: 'blur' }],
          },
          {
            label: '请求方法',
            prop: 'type',
            type: 'select',
            dicData: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'DELETE', value: 'DELETE' },
              { label: 'PUT', value: 'PUT' },
            ],
            rules: [{ required: true, message: '请选择请求方法', trigger: ['blur', 'change'] }]
          },
        ]
      },
    }
  },
  methods: {
    // 获取数据权限列表
    getList() {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getAuthPage(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      })
    },
    searchChange() {},
    // 添加数据权限
    addRowHandle(form) {
      const params = JSON.parse(JSON.stringify(form))
      addDataAuth(params).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('添加成功！')
          this.getList()
        }
      })
    },
    // 编辑数据权限
    editRowHandle(row) {
      const params = JSON.parse(JSON.stringify(row))
      editDataAuth(params).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('修改成功！')
          this.getList()
        }
      })
    },
    // 删除数据权限
    delRowHandle(row) {
      delDataAuth(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('删除成功！')
          this.getList()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.data-authority{
}
</style>
