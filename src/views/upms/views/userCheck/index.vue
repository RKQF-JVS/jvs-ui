<template>
  <div class="user-check-page">
    <jvs-table
      :pageheadertitle='pageheadertitle'
      :option="option"
      :data="tableData"
      :loading="tableLoading"
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type='text' @click="handlePass(scope.row, true)">通过</jvs-button>
        <jvs-button size="mini" type='text' @click="handlePass(scope.row, false)">不通过</jvs-button>
      </template>
      <template slot="headImg" slot-scope="scope">
        <img v-if="scope.row.headImg" :src="scope.row.headImg" alt="" style="display: inline-block;width: 40px;height: 40px;border-radius: 50%;overflow: hidden;">
      </template>
    </jvs-table>
  </div>
</template>
<script>
import { tableOption } from './option'
import {enableDisUser, getDeptUserList} from "@/views/upms/views/department/api";
import {checkHandle, getInviteUserPage} from "./api";
export default {
  components: {},
  props: {
    propData: {
      type: Object
    }
  },
  data () {
    return {
      tableLoading: false, // loading显示
      tableData: [], // 列表数据
      pageheadertitle: '用户审核', // fixed me  表名
      option: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    // 禁用 启用
    handlePass (row, bool) {
      checkHandle(row.id, bool).then(res => {
        this.$message.success('操作成功')
        this.getList()
      })
    },
    // 表格分页查询
    getList (page) {
      this.tableLoading = true
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage,
        cancelFlag: true
      }
      getInviteUserPage(Object.assign(this.queryParams, obj)).then(({ data }) => {
        this.tableLoading=false
        if(data.code == 0 && data.data) {
          this.tableData = data.data.records
          this.page.currentPage = data.data.current
          this.page.total = data.data.total
        }
      }).catch(err => {
        this.tableLoading=false
      })
    },
    // 条件查询
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
  }
}
</script>
<style lang="scss">
.user-check-page{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      padding: 0;
    }
  }
}
</style>
