<template>
  <div class="version-logs">
    <jvs-table
      :page="page"
      pageheadertitle='版本管理'
      :option="tableOption"
      :data="tableData"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" icon="el-icon-plus" @click="addHandle">新增</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      title="新增"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form :option="formOption" :formData="rowData" @submit="submitHandle"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getLogs, addRow} from './api'
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
            label: '环境编号',
            prop: 'envName',
          },
          {
            label: '环境编号',
            prop: 'envCode',
            // type: 'radio',
            dicData: [
              {label: "uat", value: "uat"},
              {label: "pro", value:"pro"}
            ],
            search: true
          },
          {
            label: '项目负责人',
            prop: 'principalProject'
          },
          {
            label: '测试负责人',
            prop: 'principalTest'
          },
          // {
          //   label: '部署人员',
          //   prop: 'principalDeploy'
          // },
          {
            label: '上线时间',
            prop: 'releaseTime'
          },
          {
            label: '服务名',
            prop: 'serviceName'
          },
          {
            label: '部署镜像',
            prop: 'imageDeploy'
          },
          {
            label: '版本号',
            prop: 'version'
          },
        ]
      },
      dialogVisible: false,
      rowData: {},
      formOption: {
        cancal: false,
        column: [
          {
            label: '环境名称',
            prop: 'envName',
            maxlength: 100,
            rules: [ {required: true, message: "环境名称不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '环境编号',
            prop: 'envCode',
            defaultValue: 'uat',
            type: 'radio',
            dicData: [
              {label: "uat", value: "uat"},
              {label: "pro", value:"pro"}
            ],
            rules: [ {required: true, message: "环境编号不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '项目负责人',
            prop: 'principalProject',
            maxlength: 100,
          },
          {
            label: '测试负责人',
            prop: 'principalTest',
            maxlength: 100,
          },
          {
            label: '部署人员',
            prop: 'principalDeploy',
            maxlength: 100,
          },
          {
            label: '上线时间',
            prop: 'releaseTime',
            type: 'datePicker',
            datetype: 'datetime',
            rules: [ {required: true, message: "上线时间不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '项目名',
            prop: 'projectName',
            maxlength: 100,
            rules: [ {required: true, message: "环境名称不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '服务名',
            prop: 'serviceName',
            maxlength: 100,
            rules: [ {required: true, message: "项目名不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '服务描述',
            prop: 'serviceDesc',
            maxlength: 100,
          },
          {
            label: 'sit环境的docker镜像地址',
            prop: 'imageSit',
            rules: [ {required: true, message: "sit环境的docker镜像地址不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '部署的docker镜像地址',
            prop: 'imageDeploy',
            maxlength: 100,
            rules: [ {required: true, message: "部署的docker镜像地址不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '版本号',
            prop: 'version',
            maxlength: 100,
            rules: [ {required: true, message: "版本号不能为空", trigger: ["blur", "change"]} ]
          },
          {
            label: '服务暴露的端口号',
            prop: 'port',
            min: 0,
            max: 65535,
            type: 'inputNumber'
          },
          {
            label: '测试报告',
            prop: 'testingReport',
            maxlength: 100,
            type: 'textarea'
          },
          {
            label: '功能清单',
            prop: 'functionList',
            maxlength: 100,
          },
          {
            label: '操作文档',
            prop: 'operationDoc',
            maxlength: 100,
          },
          {
            label: '预估风险',
            prop: 'riskDesc',
            maxlength: 100,
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
          this.handleClose()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
