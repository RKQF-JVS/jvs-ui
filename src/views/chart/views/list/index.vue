<template>
  <div class="gallery-list-content">
    <jvs-table
      v-if="typeOn"
      :option="option"
      :data="listData"
      :formData="queryParam"
      :page="page"
      :loading="tableLoading"
      pageheadertitle="图表设计"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="designChart(scope.row)">设计</jvs-button>
        <jvs-button size="mini" type="text" @click="viewPage(scope.row)" v-if="scope.row.isDeploy">查看</jvs-button>
        <!-- <jvs-button size="mini" type="text" @click="downloadHande(scope.row)">下载源码</jvs-button> -->
        <jvs-button size="mini" type="text"  v-if="scope.row.isDeploy" @click="unPublishPage(scope.row)">卸载</jvs-button>
        <jvs-button size="mini" type="text"  v-if="!scope.row.isDeploy" @click="publishPage(scope.row)">发布</jvs-button>
        <jvs-button size="mini" type="text"  v-if="!scope.row.isDeploy" @click="delRowHandle(scope.row)">删除</jvs-button>
      </template>
      <template slot="isDeploy" slot-scope="scope">
        <el-tag size="mini" :type="scope.row.isDeploy ? '' : 'info'">{{getIsDeployText(scope.row.isDeploy)}}</el-tag>
      </template>
      <template slot="url" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="handleCopy(scope.row)">复制</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :visible.sync="designVisible"
      :before-close="handleCloseDesign"
      :fullscreen="dialogType == 'design'"
      :modal="dialogType == 'design' ? false : true"
      :class="dialogType == 'design' ? 'no-header-dialog form-fullscreen-dialog' : 'form-fullscreen-dialog' "
    >
      <!-- 设计 -->
      <div v-if="dialogType == 'design' && designVisible" style="height:100%;">
        <newDesign :infoData="infoData" :rowData="rowData" @close="closeHandle" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getChartList, createPage, deployPage, deletePage, getChartDesign, disablePage, getChartTypes, editPage } from '../../api/chart.js'
import newDesign from './design'
import {getAllApp} from "../../../page/api/newDesign";
export default {
  components: {newDesign},
  // components: {},
  data () {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParam: {}, // 查询参数
      tableLoading: false,
      listData: [],
      option: {
        cancal: false,
        viewBtn: false,
        delBtn: false,
        page: true,
        align: 'center',
        menuAlign: 'center',
        menuWidth: '200px',
        search: true,
        submitBtnText: '提交',
        // inline: true,
        showOverflow: true,
        column: [
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicData: [],
            search: true,
            searchSpan: 4,
            clearable: true,
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
          {
            label: '图表名称',
            prop: 'name',
            search: true,
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
          },
          {
            label: '图表分组',
            type: 'select',
            searchSpan: 4,
            prop: 'type',
            dicData: [],
            rules: [
              { required: true, message: '请选择分组', trigger: 'blur' }
            ],
          },
          {
            label: '描述',
            search: true,
            searchSpan: 4,
            prop: 'description'
          },
          {
            label: "图标",
            hide: true,
            prop: "icon",
            type: 'iconSelect'
          },
          {
            label: '创建人',
            prop: 'createBy',
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '更新人',
            prop: 'updateBy',
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '状态',
            prop: 'isDeploy',
            headerExplain: true,
            explainContent: '未发布：应用管理员可查看；已发布：权限设置人员可查看',
            slot: true,
            dicData: [
              { label: '已发布', value: true },
              { label: '未发布', value: false },
            ],
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '地址',
            prop: 'url',
            slot: true,
            addDisplay: false,
            editDisplay: false,
          },
        ]
      },
      designVisible: false, // 弹框
      rowData: {}, // 行数据
      dialogType: '', // 弹框类型
      pageForm: {
        refreshTime: '',
        privilegeType: ''
      }, // 页面基本信息
      parentError: false,
      infoData: {}, // 图表数据数据
      typeOn: false,
    }
  },
  methods: {
    // 显示状态
    getIsDeployText(val) {
      return val ? '已发布' : '未发布'
    },
    getSearchType() {
      getChartTypes().then(res => {
        if (res.data.code == 0) {
          const arr = res.data.data.map(item => {
            return { label: item, value: item }
          })
          this.option.column[2].dicData = [...arr]
        }
      }).catch(() => {
      })
    },
    // 复制地址
    handleCopy(row) {
      const url = `${window.document.URL.split('#')[0]}#/chartShow?type=pc&id=${row.id}`
      const text = document.createElement('input')
      text.value = url
      document.body.appendChild(text)
      text.select()
      document.execCommand('Copy')
      document.body.removeChild(text)
      this.$message.success('复制成功！')
      this.$openUrl(url, '_blank')
    },
    getList (page) {
      let obj={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      getChartList(Object.assign(obj, this.queryParam)).then(res => {
        if (res.data.code==0&&res.data.data) {
          this.listData=res.data.data.records
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParam=form
      this.getList()
    },
    // 查看
    viewPage (row) {
      this.$openUrl(`/chart-design-ui/#/chartShow?model=view&type=pc&id=${row.id}`, '_blank')
      // this.$router.push({path:'/show',query: {id: row.menuId, type: 'pc', model: 'view'}})
    },
    // 删除
    delRowHandle (row) {
      let str='ddd'
      if (row.isDeploy) {
        str='该图表页已经挂载到菜单下，确定要删除吗？'
      } else {
        str='确定要删除该图表设计吗？'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(row.id).then(res => {
          if (res.data.code==0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(e => { })
    },
    // 设计
    designChart (row) {
      if (row.id) {
        let str = ''
        str = location.origin + ('/chart-design-ui/#/chartDesign?id='+row.id)
        this.$openUrl(str, '_blank')
      }
      // this.rowData = row
      // this.dialogType = 'design'
      // getChartDesign(row.id).then(res => {
      //   if(res.data.code == 0) {
      //     this.infoData = res.data.data
      //     this.designVisible = true
      //   }
      // })
    },
    // 新增页面
    addRowHandle (form) {
      this.option.submitLoading = true
      createPage(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
          this.option.submitLoading = false
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    // 编辑页面
    editRowHandle(form) {
      this.option.submitLoading = true
      editPage(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('编辑成功')
          this.getList()
          this.option.submitLoading = false
        }
      }).catch(() => {
        this.option.submitLoading = false
      })
    },
    // 部署
    publishPage (row) {
      this.rowData = row
      this.$confirm('此操作将发布该图表，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = JSON.parse(JSON.stringify(row))
        // obj.id = this.rowData.code
        obj.id = this.rowData.id
        deployPage(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('发布成功')
            this.getList()
            // this.handleCloseDesign()
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消发布'
        // });
      });
    },
    // 禁用
    unPublishPage (row) {
      disablePage(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('卸载成功')
          this.getList()
        }
      })
    },
    // 关闭弹框
    handleCloseDesign () {
      this.designVisible = false
      this.rowData = {}
      this.pageForm = {}
      this.publishForm = {}
      this.parentError = false
    },
    saveHandle (data) {
      this.infoShow = false
      this.itemInfo.data.setting = data.data.setting
      this.itemInfo.data.tableData = data.data.tableData
      this.itemInfo.dataSource = data.dataSource
      this.layout[this.index] = this.itemInfo
      if(data.isNull) {
        this.itemInfo.isNull = data.isNull
      }else{
        this.itemInfo.isNull = false
      }
      this.$forceUpdate()
    },
    // 设计通知关闭
    closeHandle (bool) {
      if(bool) {
        this.handleCloseDesign()
      }
    },
    // 获取所有应用
    async getAllApp() {
      await getAllApp().then(res => {
        if (res.data && res.data.code == 0) {
          const arr = [...res.data.data]
          this.option.column[0].dicData = arr.map(item => {
            return { label: item.name, value: item.id }
          })
        }
      })
    },
  },
  async created () {
    await this.getSearchType()
    await this.getAllApp()
    this.typeOn = true
  },
}
</script>
<style lang="scss" scoped>
::v-deep.no-header-dialog{
  .title-page-header{
    margin-top: 0;
  }
  .el-dialog.is-fullscreen{
    overflow: hidden;
  }
  .el-dialog__header{
    padding: 0;
    display: none!important;
    .el-dialog__headerbtn{
      z-index: 9;
    }
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
}
.validate-item{
  position: relative;
  .err-item{
    .el-input{
      .el-input__inner{
        border-color: #F56C6C;
      }
    }
  }
}
</style>
