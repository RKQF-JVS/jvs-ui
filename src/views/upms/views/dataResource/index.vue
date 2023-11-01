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
      @delRow="delRowHandle"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="connectTest(scope.row)">连接测试</jvs-button>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {
  getDatasourceList,
  addDatasource,
  editDatasource, delDatasource, testConnect
} from './api'
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
      tableData: [],
      tableOption: {
        showOverflow: true,
        search: true,
        viewBtn: false,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '数据库名称',
            prop: 'dataBaseName',
            maxlength: 10,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入数据库名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '连接名',
            prop: 'connName',
            maxlength: 10,
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入连接名', trigger: ['blur', 'change'] }]
          },
          {
            label: '数据库类型',
            prop: 'dbType',
            type: 'select',
            search: true,
            dicData: [{
              label: 'MySQL',
              value: 'mysql'
            }],
            rules: [{ required: true, message: '请选择数据库类型', trigger: 'blur' }],
          },
          {
            label: '数据库URL',
            prop: 'connUrl',
            rules: [{ required: true, message: '请输入数据库URL', trigger: 'blur' }],
          },
          {
            label: '用户名',
            prop: 'username',
            rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          },
          {
            label: '密码',
            prop: 'password',
            rules: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
      getDatasourceList(Object.assign(query, temp)).then(res => {
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
    // 删除
    delRowHandle (row) {
      delDatasource(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    // 新增数据源
    addRowHandle(form) {
      addDatasource(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    },
    // 编辑数据源
    editRowHandle(form) {
      editDatasource(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改成功')
          this.getList()
        }
      })
    },
    // 连接测试
    connectTest(row) {
      testConnect(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('连接成功')
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>
