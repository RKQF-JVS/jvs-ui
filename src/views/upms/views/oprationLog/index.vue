<template>
  <div class="oprationlog-manage">
    <jvs-table
      :option="tableOption" 
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='操作管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="modificationContent" slot-scope="scope">
        <el-popover
          placement="top-start"
          trigger="hover"
           width="90%"
          >
          <div v-html="scope.row.modificationContent" style="width: 100%;"></div>
          <span class="modificationContent-span" slot="reference" size="mini" type="text">{{scope.row.modificationContent}}</span>
        </el-popover>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {getLogs, getLogInfo} from './api'
export default {
  name: 'oprationlog-manage',
  data () {
    return {
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
        addBtn: false,
        menu: false,
        align: 'center',
        menuAlign: 'center',
        search: true,
        page: true,
        cancal: false,
        column: [
          {
            label: '业务ID',
            prop: 'businessId',
            search: true
          },
          {
            label: '用户',
            prop: 'userName',
            search: true
          },
          {
            label: '业务类型',
            prop: 'businessType',
            search: true
          },
          {
            label: '操作行为',
            prop: 'modificationContent',
            search: true,
            width: 250,
            showOverflow: false,
            slot: true
          },
          {
            label: 'IP地址',
            prop: 'ip',
            search: true
          },
          {
            label: '时间',
            prop: 'createDate',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          }
        ]
      }
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
      getLogs(Object.assign(query, temp)).then(res => {
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
  }
}
</script>
<style lang="scss" scoped>
.modificationContent-span{
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>