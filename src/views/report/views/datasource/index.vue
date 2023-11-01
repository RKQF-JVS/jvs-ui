<template>
  <div class="dictionaries-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='数据库管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addHandle"
      @editRow="editHandle"
      @delRow="delRowHandle"
    >
    </jvs-table>
  </div>
</template>
<script>
import {getTableList, addRow, editRow, delRow} from './api'
export default {
  name: 'report-type',
  components: {},
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
            label: '编码',
            prop: 'code',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '数据库名称',
            prop: 'name',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '数据库类型',
            prop: 'type',
            search: true,
            searchSpan: 4,
            type: 'select',
            multiple: false,
            dicData: [
              {label: 'mysql', value: 1},
              {label: 'oracle', value: 2},
              {label: 'sqlServer', value: 3}
            ],
            rules: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '数据库链接',
            prop: 'jdbcUrl',
            rules: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }]
          }
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
  }
}
</script>
<style lang="scss" scoped>
</style>

