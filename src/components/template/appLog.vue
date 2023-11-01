<template>
  <div class="app-log-table">
    <jvs-table
      :loading="tableLoading"
      :page="page"
      :option="option"
      :data="tableData"
      @on-load="getList"
      @search-change="searchChange"
    ></jvs-table>
  </div>
</template>

<script>
import {getAppLogPage} from "@/components/template/api";

export default {
  name: "appLog",
  props: {
    appInfo: {
      type: Object
    }
  },
  data () {
    return {
      tableLoading: false,
      queryParam: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: {
        showOverflow: true,
        search: true,
        menu: false,
        addBtn: false,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '应用名称',
            prop: 'jvsAppName',
          },
          {
            label: '操作人',
            prop: 'createBy',
            search: true,
          },
          {
            label: '创建时间',
            prop: 'createTime',
            dateType: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
          {
            label: '描述',
            prop: 'description',
          },
        ]
      },
      tableData: []
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      let obj={
        current: this.page.currentPage,
        size: this.page.pageSize,
        jvsAppId: this.appInfo.id
      }
      getAppLogPage(Object.assign(obj, this.queryParam)).then(res => {
        if(res.data && res.data.code == 0) {
          this.tableData = [...res.data.data.records]
          this.page.total = res.data.data.total
          this.page.currentPage = res.data.data.current
          this.tableLoading = false
        } else {
          this.tableLoading = false
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParam = form
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.app-log-table{
  .jvs-table/deep/{
    .table-top{
      display: none;
    }
    .jvs-table-top .el-card__body .search-form{
      border-bottom: 0;
    }
    .table-body-box{
      padding: 0;
      .el-table{
        .el-table__header-wrapper{
          tr{
            th{
              background: #f6f6f6;
            }
          }
        }
      }
    }
    .el-table__body-wrapper{
      height: calc(100vh - 345px)!important;
    }
  }
}
</style>
