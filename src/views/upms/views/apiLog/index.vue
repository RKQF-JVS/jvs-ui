<template>
  <div class="apilog-manage">
    <jvs-table
      :option="tableOption" 
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='请求日志'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
    >
    </jvs-table>
  </div>
</template>
<script>
import {getLogs} from './api'
export default {
  name: 'apilog-manage',
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
            label: 'TID',
            prop: 'tid',
            search: true
          },
          {
            label: '服务名',
            prop: 'service',
            search: true
          },
          {
            label: '主机',
            prop: 'host',
            search: true
          },
          {
            label: '端口',
            prop: 'port',
            search: true
          },
          {
            label: '日志级别',
            prop: 'level',
            search: true,
            type: 'select',
            dicData: [
              {label: 'TRACR', value: 'TRACR'},
              {label: 'DEBUG', value: 'DEBUG'},
              {label: 'INFO', value: 'INFO'},
              {label: 'WARN', value: 'WARN'},
              {label: 'ERROR', value: 'ERROR'}
            ]
          },
          {
            label: '日志内容',
            prop: 'message',
            search: true,
          },
          {
            label: '线程',
            prop: 'thread',
            search: true
          },
          {
            label: '打印位置',
            prop: 'filepath',
            search: true
          },
          {
            label: '开始时间',
            prop: 'startDate',
            type: 'datePicker',
            datetype: 'date',
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            hide: true,
            search: true
          },
          {
            label: '截至时间',
            prop: 'endDate',
            type: 'datePicker',
            datetype: 'date',
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            hide: true,
            search: true
          },
          {
            label: '是否按时间升序',
            prop: 'asc',
            type: 'select',
            hide: true,
            dicData: [
              {label: '是', value: true},
              {label: '否', value: false}
            ],
            search: true
          },
          {
            label: '日志时间',
            prop: 'day',
            datetype: 'datetime',
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
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
        if (res.data.code==0 && res.data.data) {
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
</style>