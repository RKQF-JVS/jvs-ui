<template>
  <div class="sql-log">
    <jvs-table pageheadertitle='SQL日志' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="executedSql" slot-scope="scope">
        <el-popover
          placement="top-start"
          trigger="hover"
           width="400"
          >
          <div v-html="formatSQLHandle(scope.row.executedSql)"></div>
          <el-button slot="reference" size="mini" type="text">查看SQL</el-button>
        </el-popover>
      </template>
      <template slot="slowSql" slot-scope="scope">
        <span>{{scope.row.slowSql ? '是' : '-'}}</span>
      </template>
      <template slot="accessType" slot-scope="scope">
        <div v-if="showTableHandle(scope.row, 'bool')">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="800"
            >
            <jvs-table :option="accessTypeOption" :data="showTableHandle(scope.row, 'data')"></jvs-table>
            <el-button slot="reference" size="mini" type="text">查看</el-button>
          </el-popover>
        </div>
        <span v-else>{{scope.row.accessType || '-'}}</span>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {getLogs} from './api'
export default {
  data(){
    return {
      queryParams: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      option: {
        addBtn: false,
        menu: false,
        page: true,
        canncal: false,
        align: 'center',
        menuAlign: 'center',
        search: true,
        cancal: false,
        showOverflow: true,
        labelWidth: '90px',
        column: [
          {
            label: '服务名',
            prop: 'applicationName',
            search: true,
            searchSpan: 4
          },
          {
            label: 'SQL语句',
            prop: 'executedSql',
            search: true,
            searchSpan: 4,
            slot: true
          },
          {
            label: '访问类型',
            prop: 'accessType',
            slot: true
          },
          {
            label: '开始时间',
            prop: 'startTime',
            type: 'datePicker',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            search: true,
            searchSpan: 6
          },
          {
            label: '结束时间',
            prop: 'endTime',
            type: 'datePicker',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            search: true,
            searchSpan: 6
          },
          {
            label: '慢SQL',
            prop: 'slowSql',
            slot: true
          },
          {
            label: '消耗时间/ms',
            prop: 'consumingTime'
          }
        ]
      },
      accessTypeOption: {
        addBtn: false,
        menu: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: 'select_type',
            prop: 'select_type',
            width: 200
          },
          {
            label: 'table',
            prop: 'table'
          },
          {
            label: 'possible_keys',
            prop: 'possible_keys',
            width: 200
          },
          {
            label: 'key',
            prop: 'key'
          },
          {
            label: 'key_len',
            prop: 'key_len'
          },
          {
            label: 'ref',
            prop: 'ref'
          },
          {
            label: 'rows',
            prop: 'rows'
          },
          {
            label: 'filtered',
            prop: 'filtered'
          }
        ]
      }
    }
  },
  methods: {
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      this.tableLoading = true
      getLogs(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    // 格式化sql
    formatSQLHandle (str) {
      let sql = ''
      sql = str
      sql = sql.replace(/\n/g, '<br/ >')
      sql = sql.replace(/ /g, '&nbsp;')
      return sql
    },
    // 访问类型是否显示表格
    showTableHandle (row, type) {
      let str = row.accessType ? row.accessType : ''
      if(str) {
        let bool = false
        let table = []
        if(str.startsWith('[')) {
          bool = true
          table = JSON.parse(str)
        }
        if(type == 'bool') {
          return bool
        }
        if(type == 'data') {
          if(bool) {
            return table
          }else{
            return str
          }
        }
      }else{
        if(type == 'bool') {
          return false
        }
        if(type == 'data') {
          return '-'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>