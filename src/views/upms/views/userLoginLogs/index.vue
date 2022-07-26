<template>
  <div class="user-login-logs">
    <jvs-table
      :page="page"
      pageheadertitle='登录日志'
      :option="tableOption"
      :data="tableData"
      @on-load="getList"
      @search-change="searchChange"
    ></jvs-table>
  </div>
</template>
<script>
import {getLogs} from './api'
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
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        align: "center",
        menuAlign: "center",
        menu: false,
        page: true,
        search: true,
        showOverflow: true,
        column: [
          {
            label: "账号",
            prop: "accountName",
          },
          {
            label: "姓名",
            prop: "realName",
          },
          {
            label: "登录类型",
            prop: "loginType"
          },
          {
            label: "IP",
            prop: "ip"
          },
          {
            label: "终端",
            prop: "clientId"
          },
          {
            label: "设备",
            prop: "userAgent"
          },
          {
            label: "时间",
            prop: "operateTime"
          }
        ]
      }
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
  }
}
</script>
<style lang="scss" scoped>

</style>