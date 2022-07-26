<template>
  <div class="oprationlog-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='请求日志'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="viewHandle(scope.row)">详细信息</jvs-button>
      </template>
      <template slot="operationType" slot-scope="scope">
        <span :style="getStyle(scope.row.operationType)">{{scope.row.operationType}}</span>
      </template>
    </jvs-table>
    <el-dialog
      title="错误详情"
      fullscreen
      class="form-fullscreen-dialog"
      append-to-body
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form style="padding: 0 160px;" :option="formOption" :formData="rowData">
        <template slot="parametersForm">
          <json-viewer
            style="margin-top: 10px"
            :value="rowData.parameters"
            :expand-depth="2000"
            copyable
            boxed
            sort
          ></json-viewer>
        </template>
        <template slot="returnObjForm">
          <json-viewer
            style="margin-top: 10px"
            :value="rowData.returnObj"
            :expand-depth="2000"
            copyable
            boxed
            sort
          ></json-viewer>
        </template>
        <template slot="elementsForm">
          <json-viewer
            style="margin-top: 10px"
            :value="rowData.elements"
            :expand-depth="2000"
            copyable
            boxed
            sort
          ></json-viewer>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getLogs, getLogInfo} from './api'
import {dateFormat} from "@/util/date";
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
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        align: 'center',
        menuAlign: 'center',
        search: true,
        page: true,
        cancal: false,
        column: [
          {
            label: '服务名',
            prop: 'businessName',
            span: 6,
            search: true
          },
          {
            label: '功能名',
            prop: 'functionName'
          },
          {
            label: '操作类型',
            prop: 'operationType',
            slot: true
          },
          {
            label: '方法名',
            prop: 'methodName'
          },
          {
            label: 'API地址',
            prop: 'api'
          },
          {
            label: '终端',
            prop: 'clientId'
          },
          {
            label: '请求ip地址',
            prop: 'ip'
          },
          {
            label: 'tid',
            prop: 'tid'
          },
          {
            label: '错误时间',
            prop: 'createDate',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
          {
            label: "日期时间范围",
            prop: "dateRange",
            type: "datePicker",
            datetype: "datetimerange",
            defaultValue: [dateFormat(new Date()).split(' ')[0] + ' 00:00:00', dateFormat(new Date()).split(' ')[0] + ' 23:59:59'],
            search: true,
            clearable: false,
            hide: true,
            span: 8,
          },
        ]
      },
      rowData: null,
      dialogVisible: false,
      formOption: {
        btnHide: true,
        disabled: true,
        column: [
          {
            label: '服务名',
            prop: 'businessName',
            search: true
          },
          {
            label: '功能名',
            prop: 'functionName'
          },
          {
            label: '开始时间',
            prop: 'startTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
          {
            label: '结束时间',
            prop: 'endTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
          {
            label: '方法名',
            prop: 'methodName'
          },
          {
            label: '类名',
            prop: 'className'
          },
          {
            label: 'API地址',
            prop: 'api'
          },
          {
            label: '请求ip地址',
            prop: 'ip'
          },
          {
            label: 'tid',
            prop: 'tid'
          },
          {
            label: '用户名',
            prop: 'userName'
          },
          {
            label: '环境参数',
            prop: 'env'
          },
          {
            label: '耗时',
            prop: 'consumingTime'
          },
          {
            label: '请求json',
            prop: 'parameters',
            formSlot: true
          },
          {
            label: '返回json',
            prop: 'returnObj',
            formSlot: true
          },
          {
            label: '错误信息',
            prop: 'exceptionMessage',
          },
          {
            label: '详细信息',
            prop: 'elements',
            formSlot: true
          },
        ]
      }
    }
  },
  created() {
    this.queryParams.dateRange = [dateFormat(new Date()).split(' ')[0] + ' 00:00:00', dateFormat(new Date()).split(' ')[0] + ' 23:59:59']
  },
  methods: {
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      if (this.queryParams.dateRange) {
        this.tableLoading = true
        const arr = [...this.queryParams.dateRange]
        this.queryParams.startTime = arr[0]
        this.queryParams.endTime = arr[1]
        let temp = JSON.parse(JSON.stringify(this.queryParams))
        temp.dateRange = undefined
        getLogs(Object.assign(query, temp)).then(res => {
          if (res.data.code==0) {
            this.page.total=res.data.data.total
            this.page.currentPage=res.data.data.current
            this.tableData=res.data.data.records
            this.tableLoading = false
          }
        })
      } else {
        this.$message.warning('请选择时间范围！')
      }
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    viewHandle (row) {
      this.rowData = row
      if(this.rowData.returnObj && this.rowData.returnObj.startsWith('return:')) {
        this.rowData.returnObj = this.rowData.returnObj.replace(/return:/g, "")
        this.rowData.returnObj = JSON.parse(this.rowData.returnObj)
      }
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.rowData = null
    },
    getStyle (type) {
      let color = ''
      switch(type) {
        case '新增': color = '#67C23A';break;
        case '修改': color = '#E6A23C';break;
        case '删除': color = '#F56C6C';break;
        case '启用': color = '#409EFF';break;
        case '禁用': color = '#909399';break;
        case '登录': color = '#dbde0e';break;
        default: color = '';break;
      }
      if(color) {
        return `color:${color};`
      }else{
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.oprationlog-manage{
  .el-col-6{
    width: auto;
  }
}
</style>
