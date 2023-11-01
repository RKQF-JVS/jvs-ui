<template>
  <div class="err-code-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='网关路由表'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @delRow="delRowHandle"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button type="primary" @click="handleRefresh()">刷新缓存</jvs-button>
      </template>
      <template slot="menuRight">
        <p style="cursor:pointer;display: flex;align-items: center;" @click="searchChange(queryParams)">
          <span>刷新</span>
          <i class="el-icon-refresh" style="cursor:pointer;margin-left:3px;"></i>
        </p>
      </template>
    </jvs-table>
  </div>
</template>

<script>
import {addGatewayRoute, delGatewayRoute, editGatewayRoute, getGatewayRouteList, refreshGatewayRouteList} from "./api";

export default {
  name: "index",
  data () {
    return {
      tableData: [],
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: {
        showOverflow: true,
        search: true,
        // menu: false,
        // addBtn: false,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: 'id',
            prop: 'id',
          },
          {
            label: 'path',
            prop: 'path',
          },
          {
            label: '备注',
            prop: 'remark',
          },
          {
            label: '转发',
            prop: 'uri',
          },
        ]
      },
    }
  },
  methods: {
    // 刷新
    handleRefresh() {
      refreshGatewayRouteList().then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('刷新成功')
          this.getList()
        }
      })
    },
    // 编辑、查看
    editRowHandle(row) {
      editGatewayRoute(row).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('修改成功')
          this.getList()
        }
      })
    },
    // 添加
    addRowHandle(form) {
      addGatewayRoute(form).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    },
    // 删除
    delRowHandle (row) {
      delGatewayRoute(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getGatewayRouteList(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
