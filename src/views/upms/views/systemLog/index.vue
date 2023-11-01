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
const endLimit = new Date().getFullYear()+'-'+( (new Date().getMonth()+1) > 9 ? (new Date().getMonth()+1) : ('0'+(new Date().getMonth()+1)) )+'-'+( new Date().getDate() > 9 ? new Date().getDate() : ('0'+new Date().getDate()))
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
        // align: "center",
        // menuAlign: "center",
        menu: false,
        page: true,
        search: true,
        showOverflow: true,
        hideTop: true,
        column: [
          {
            label: "账号",
            prop: "accountName",
            search: true,
            searchSpan: 8
          },
          {
            label: "姓名",
            prop: "realName",
            search: true,
            searchSpan: 8
          },
          {
            label: "登录类型",
            prop: "loginType",
            search: true,
            searchSpan: 8
          },
          {
            label: "IP",
            prop: "ip"
          },
          {
            label: "终端",
            prop: "clientName",
          },
          {
            label: "设备",
            prop: "userAgent"
          },
          {
            label: "时间",
            prop: "operateTime"
          },
          {
            label: "时间",
            prop: "searchTime",
            type: 'datePicker',
            datetype: 'datetimerange',
            searchSpan: 9,
            hide: true,
            search: true,
            startLimit: "",
            endLimit: endLimit
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
      if(this.queryParams.accountName) {
        obj.accountName = this.queryParams.accountName
      }
      if(this.queryParams.realName) {
        obj.realName = this.queryParams.realName
      }
      if(this.queryParams.loginType) {
        obj.loginType = this.queryParams.loginType
      }
      if(this.queryParams.clientId) {
        obj.clientId = this.queryParams.clientId
      }
      if(this.queryParams.current) {
        obj.current = this.queryParams.current
      }
      if(this.queryParams.searchTime && this.queryParams.searchTime.length > 0) {
        obj.beginDate = this.queryParams.searchTime[0]
        if(this.queryParams.searchTime.length > 1) {
          obj.endDate = this.queryParams.searchTime[1]
        }
      }
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
