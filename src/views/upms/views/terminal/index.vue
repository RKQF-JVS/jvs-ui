<template>
  <div class="terminal-logs">
    <jvs-table
      :page="page"
      pageheadertitle='终端管理'
      :option="tableOption"
      :data="tableData"
      @on-load="getList"
      @search-change="searchChange"
    >
      <!-- <template slot="menuLeft">
        <jvs-button size="mini" @click="addHandle">新增</jvs-button>
      </template> -->
    </jvs-table>
    <el-dialog
      title="新增"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      
    </el-dialog>
  </div>
</template>
<script>
import {getLogs, addRow, editRow, delRow} from './api'
export default {
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
      tableLoading: false,
      tableOption: {
        addBtn: true,
        editBtn: true,
        viewBtn: true,
        align: "center",
        menuAlign: "center",
        page: true,
        search: true,
        showOverflow: true,
        cancal: false,
        column: [
          {
            label: '编号',
            prop: 'clientId',
          },
          {
            label: '密钥',
            prop: 'clientSecret'
          },
          {
            label: '授权模式',
            prop: 'authorizedGrantTypes',
            type: 'select',
            dicData: [
              {label: '授权码模式', value: 'authorization_code'},
              {label: '密码模式', value: 'password'},
              {label: '刷新token', value: 'refresh_token'},
              {label: '隐式模式', value: 'implicit'},
              {label: '客户端模式', value: 'client_credentials'}
            ]
          },
          {
            label: '令牌时效',
            prop: 'accessTokenValidity'
          },
          {
            label: '刷新时效',
            prop: 'refreshTokenValidity'
          }
        ]
      },
      dialogVisible: false,
      rowData: {}
    }
  },
  methods: {
    getList (page) {
      this.tableLoading = true
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      obj = Object.assign(obj, this.queryParams)
      getLogs(obj).then(res => {
        if(res.data.code == 0) {
          this.tableLoading = false
          this.tableData = res.data.data.records
          this.page.currentPage = res.data.data.current
          this.page.total = res.data.data.total
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    addHandle () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.rowData = {}
    },
    submitHandle (form) {
      addRow(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>