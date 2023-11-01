<template>
  <div class="cont">
    <jvs-table
      refs="multipleTable"
      :option="tableOption"
      :data="tableData"
      :loading="loading"
      :index="false"
      size="mini"
      :page="page"
      :selectable="false"
      @on-load="getData"
      @addRow="addHandle"
      @editRow="editHandle"
      @search-change="searchChange"
      pageheadertitle="逻辑引擎"
    >
      <template slot="menuLeft">
        <!-- <jvs-button size="small" @click="exportJson">导出</jvs-button>
        <el-upload
          size="small"
          action="/rule-design/json/import"
          :show-file-list="false"
          :file-list="fileList"
          :on-success="successHandle"
          :on-error="errHandle"
          style="display: inline-block; margin-left: 10px"
          accept=".txt"
        >
          <jvs-button size="small">导入</jvs-button>
        </el-upload> -->
        <jvs-button @click="bianj(null)" icon="el-icon-plus" size="mini">新增</jvs-button>
      </template>
      <template slot="address" slot-scope="scope">
        <el-button
          style="color: #66b1ff;"
          type="text"
          @click="onCopy"
          v-clipboard:copy="getpageUrl(scope.row)"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          size="mini"
        >复制</el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button @click="bianj(scope.row)" type="text" size="small">修改</jvs-button>
        <jvs-button @click="See(scope.row)" type="text" size="small">设计</jvs-button>
        <jvs-button type="text" size="small" @click="viewLogHandle(scope.row)">日志</jvs-button>
        <jvs-button type="text" size="small" @click="del(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>
    <el-dialog class="ljlog-no-header-dialog" title="日志" v-if="logVisible" :visible.sync="logVisible" :fullscreen="true" :before-close="handleClose">
      <!-- <title-page-header title="日志" :hassave="false" @close="handleClose"></title-page-header> -->
      <jvs-table class="logs-table" :loading="logLoading" :option="logOption" :data="logData" :page="logPage" @on-load="viewLog">
        <template slot="reqData" slot-scope="scope">
          <jvs-button v-if="scope.row.reqData" size="mini" type="text" @click="viewHandle(scope.row.reqData)">查看</jvs-button>
          <span v-else>-</span>
        </template>
        <template slot="resultVariableMap" slot-scope="scope">
          <jvs-button v-if="scope.row.resultVariableMap" size="mini" type="text" @click="viewHandle(scope.row.resultVariableMap)">查看</jvs-button>
          <span v-else>-</span>
        </template>
        <template slot="result" slot-scope="scope">
          <jvs-button v-if="scope.row.result" size="mini" type="text" @click="viewHandle(scope.row.result)">查看</jvs-button>
          <span v-else>-</span>
        </template>
        <template slot="errorMsg" slot-scope="scope">
          <jvs-button v-if="scope.row.errorMsg" size="mini" type="text" @click="viewHandle(scope.row.errorMsg)">查看</jvs-button>
          <span v-else>-</span>
        </template>
        <template slot="logs" slot-scope="scope">
          <jvs-button v-if="scope.row.logs" size="mini" type="text" @click="viewHandle(scope.row.logs, 'log')">查看</jvs-button>
          <span v-else>-</span>
        </template>
      </jvs-table>
    </el-dialog>
    <el-dialog :visible.sync="jsonVisible" width="50%" append-to-body :before-close="jsonClose">
      <div v-if="jsonVisible">
        <json-viewer v-if="!showLog" :value="currentJson" style="padding: 20px;"></json-viewer>
        <div v-if="showLog" v-html="currentJson" style="padding: 20px;"></div>
      </div>
    </el-dialog>
    <!-- v-if="setVisible" -->
    <el-dialog
      :class="'setDialog  '+ dialogClass"
      :title="setType == 'add' ? '新增' : '修改'"
      append-to-body
      :visible.sync="setVisible"
      width="80%"
      :before-close="setClose"
    >
      <setForm v-if="setVisible" :formData="formData" @save="saveHandle" @close="closeHandle" style="padding-bottom: 10px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delEdition, editJSON, SavaJSON, getFuncList, getFuncGroup, pageLog } from '../api/rule' //  jsonExport, enable
import setForm from './design/form'
import eventBus from "../utils/eventBus";
export default {
  components: {
    setForm
  },
  data () {
    return {
      loading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper" // 分页工具
      },
      queryForm: {}, // 查询条件
      tableOption: {
        addBtn: false,
        editBtn: false,
        editBtnText: '修改',
        viewBtn: false,
        delBtn: false,
        page: true,
        align: 'center',
        menuAlign: 'center',
        search: true,
        searchBtnText: '查询',
        cancal: false,
        column: [
          {
            label: 'secret',
            prop: 'secret',
            addDisplay: false,
            editDisplay: false,
            hide: true,
          },
          {
            label: '名称',
            prop: 'name',
            search: true,
            searchSpan: 4,
            // span: 6,
            rules: [
              { required: true, message: '请输入逻辑名称', trigger: 'blur' },
            ]
          },
          {
            label: '逻辑介绍',
            prop: 'content',
            span: 24,
            hide: true,
            rules: [
              { required: true, message: '请输入逻辑介绍', trigger: 'blur' },
            ]
          },
          {
            label: '启动状态',
            prop: 'enable',
            addDisplay: false,
            editDisplay: false,
            dicData: [
              {label: '启用', value: true},
              {label: '禁用', value: false}
            ]
          },
          {
            label: '使用版本号',
            prop: 'version',
            addDisplay: false,
            editDisplay: false,
            hide: true
          },
          {
            label: '创建时间',
            prop: 'createTime',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '修改时间',
            prop: 'updateTime',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '地址',
            prop: 'address',
            slot: true,
            addDisplay: false,
            editDisplay: false
          },
        ]
      },
      tableData: [],
      fileList: [],
      multipleTable: [],
      currentJson: '', // 需要显示的json字符串
      jsonVisible: false, // json弹框
      logVisible: false, // 日志弹框
      logLoading: false,
      logPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper" // 分页工具
      },
      logData: [],
      logOption: {
        addBtn: false,
        menu: false,
        page: true,
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        cancal: false,
        hideTop: true,
        column: [
          {
            label: '环境',
            prop: 'runType'
          },
          {
            label: '执行状态',
            prop: 'status',
            dicData: [
              {label: '成功', value: true},
              {label: '失败', value: false}
            ]
          },
          {
            label: '执行的版本号',
            prop: 'version'
          },
          {
            label: '开始时间',
            prop: 'startTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
          {
            label: '结束时间',
            prop: 'endTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
          {
            label: '执行总耗时(ms)',
            prop: 'totalExecutionTime'
          },
          {
            label: '请求数据值',
            prop: 'reqData',
            slot: true
          },
          {
            label: '执行后的变量结果',
            prop: 'resultVariableMap',
            slot: true
          },
          {
            label: '返回数据',
            prop: 'result',
            slot: true
          },
          {
            label: '错误信息',
            prop: 'errorMsg',
            slot: true
          },
          {
            label: '打印的日志',
            prop: 'logs',
            slot: true
          }
        ]
      },
      showLog: false,
      rowData: null,
      setType: '',
      setVisible: false,
      formData: {},
      dialogClass: '',
      groupList: []
    }
  },
  created () {
    if (this.$route.query.token) {
      this.$store.commit('SET_ACCESS_TOKEN', this.$route.query.token)
    }
    this.getFuncListHandle()
    this.getFuncGroupHandle()
    eventBus.$on("regetFunc", bool => {
      if(bool) {
        this.getFuncListHandle()
      }
    });
  },
  methods: {
    // 获取所有方法
    getFuncListHandle () {
      getFuncList().then(res => {
        // console.log(res.data.data)
        this.$store.commit('set_funcs', res.data.data)
      })
    },
    successHandle (response, file, fileList) {
      if (response.code===0) {
        this.getData()
        this.$message.success('上传成功！')
      } else {
        this.$message.error(response.msg)
      }
    },
    errHandle (err, file, fileList) {
      console.log(err)
      this.$message.error('导入失败！')
      // this.dialogVisibleSource = true
    },
    exportJson () {
      let data=this.$refs.multipleTable.selection
      if (data.length===0) {
        this.$message.error('请选择，需要导出的数据')
        return
      }
      let obj=[]
      data.filter(e => obj.push(e.id))
      jsonExport(obj).then(res => {
        const element=document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(res.data))
        element.setAttribute('download', new Date().getTime()+Math.random()+'.txt')
        element.style.display='none'
        element.click()
      })
    },
    getData () {
      this.loading=true
      let obj = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      getList({ ...obj, ...this.queryForm}).then(res => {
        if(res.data.code == 0) {
          this.loading=false
          this.tableData=res.data.data.records
          this.page.total=res.data.data.total
          this.page.current=res.data.data.current
        }
      }).catch(e => {
        this.loading=false
      })
    },
    del (row) {
      this.$confirm('此操作将永久删除该设计,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delEdition(row.id).then(res => {
          this.$message.success('删除成功')
          this.getData()
        })
      }).catch(() => {
      })
    },
    qyjy (id) {
      enable(id).then(res => {
        this.getData()
      })
    },
    add () {
      this.dialogVisible=true
      this.form={
        cronTab: false,
        cronRule: {
          jobCron: '0 * * * * ?'
        }
      }
    },
    bianj (row) {
      if(row) {
        this.formData = JSON.parse(JSON.stringify(row))
        this.dialogClass = 'mydialog'
        this.setType = 'edit'
      }else{
        this.formData = {}
        this.dialogClass = ''
        this.setType = 'add'
      }
      this.setVisible = true
      this.$forceUpdate()
    },
    See (row) {
      this.$router.push({ path: '/ruleDesign', query: { id: row.secret, name: row.name } })
    },
    // 查看日志
    viewLogHandle (row) {
      if(row) {
        this.rowData = row
        this.logVisible = true
      }
    },
    viewLog () {
      let row = null
      if(this.rowData) {
        row = this.rowData
      }
      if(row) {
        pageLog(row.secret, {current: this.logPage.currentPage, size: this.logPage.pageSize}).then(res => {
          if(res.data.code == 0) {
            this.logData = res.data.data.records
            this.logPage.currentPage = res.data.data.current
            this.logPage.total = res.data.data.total
          }
        })
      }
    },
    // 关闭日资查看
    handleClose () {
      this.logVisible = false
      this.rowData = null
    },
    // 查看数据
    viewHandle (data, type) {
      this.currentJson = data // JSON.parse(data)
      if(type == 'log') {
        this.showLog = true
        this.currentJson = this.currentJson.replace(/\n+/g, '<br/>')
      }else{
        this.showLog = false
      }
      this.jsonVisible = true
    },
    // 关闭json弹框
    jsonClose () {
      this.jsonVisible = false
      this.currentJson = ''
    },
    // 新增一个逻辑引擎
    addHandle (obj) {
      SavaJSON(obj).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.setClose()
          this.getData()
        }
      })
    },
    // 搜索
    searchChange (form) {
      this.queryForm = form
      this.getData()
    },
    // 编辑
    editHandle (obj) {
      let temp = JSON.parse(JSON.stringify(obj))
      editJSON(obj.id, temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改成功')
          this.setClose()
          this.getData()
        }
      })
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      let append = 'mgr'
      if(row.externalEnable === true) {
        append = 'api'
      }
      str += (`/${append}/rule/run/`+row.secret)
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
    saveHandle (form) {
      if(this.setType == 'add') {
        this.addHandle(form)
      }
      if(this.setType == 'edit') {
        this.editHandle(form)
      }
    },
    setClose () {
      this.setVisible = false
      this.$set(this, 'formData', {})
      this.setType = ''
    },
    closeHandle (bool) {
      if(bool) {
        this.setClose()
      }
    },
    // 获取方法分组
    getFuncGroupHandle () {
      getFuncGroup().then(res => {
        if(res.data.code == 0) {
          this.$store.commit('set_funcgroup', res.data.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.ljlog-no-header-dialog{
  // .el-dialog__header{
  //   display: none;
  //   padding: 0!important;
  // }
  .el-dialog__body{
    padding-top: 0!important;
  }
  .logs-table{
    height: calc(100vh - 53px);
    .table-body-box{
      height: calc(100% - 72px);
      .el-table{
        height: 100%;
        margin-top: 0!important;
        .el-table__header-wrapper{
          margin-top: 0;
        }
        .el-table__body-wrapper{
          height: calc(100% - 36px);
        }
      }
    }
  }
}
.setDialog{
  .el-dialog{
    .el-dialog__header{
      padding: 20px 20px 10px!important;
      .el-dialog__headerbtn{
        top: 20px;
      }
    }
    .el-dialog__body{
      padding-bottom: 10px!important;
    }
  }
}
</style>
