<template>
  <div class="task-list" v-if="isMounted">
    <jvs-table
      pageheadertitle="待办任务"
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchHandle"
    >
      <template slot="menu" slot-scope="scope">
        <div>
          <!-- <jvs-button type="text" size="mini" v-if="scope.row.taskStatus == 1" @click="claimHandle(scope.row)">签收</jvs-button> -->
          <jvs-button type="text" size="mini" v-if="scope.row.taskStatus == 1" @click="dealHandle(scope.row)">办理</jvs-button>
          <!-- <jvs-button type="text" size="mini" v-if="true ||scope.row.taskStatus == 2" @click="sendHandle(scope.row)">委派</jvs-button> -->
          <!-- <jvs-button type="text" size="mini" v-if="scope.row.taskStatus == 2" @click="dealHandle(scope.row)">取消签收</jvs-button> -->
          <!-- 不一定会进表单。。 -->
          <jvs-button type="text" size="mini" @click="dealHandle(scope.row, 'view')">进度</jvs-button>
        </div>
      </template>
    </jvs-table>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      fullscreen
      :before-close="handleClose"
      :title="taskFormType == 'view' ? '进度' : '办理'"
      class="form-fullscreen-dialog form-fullscreen-dialog-allbody"
    >
      <taskForm :rowData="rowData" :taskFormType="taskFormType" @close="closeHandle" />
    </el-dialog>
    <el-dialog
      v-if="viewVisible"
      :visible.sync="viewVisible"
      append-to-body
      title="查看进度"
      width="70%"
      :before-close="viewClose"
    >
      <img :src="imgSrc" alt="" style="display: block; width: 100%; height: 100%" />
    </el-dialog>
    <el-dialog
      v-if="userVisible"
      :visible.sync="userVisible"
      append-to-body
      title="委派"
      width="90%"
      :before-close="userClose"
    >
      <userListTool :form="rowData.assignee" prop="id" />
      <el-row
        style="
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <jvs-button size="mini" type="primary" @click="assignHandle"
          >确定</jvs-button
        >
        <jvs-button size="mini" @click="userClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { queryTaskList, claimTask, assignTask } from "../api/flowable"
import taskForm from './taskForm'
import userListTool from '../components/util/user'
export default {
  name: 'task-list',
  components: { taskForm, userListTool },
  data () {
    return {
      // 查询条件
      queryParams: {},
      tableData: [], // 表格数据
      tableLoading: false,
      option: {
        align: 'center',
        menuAlign: 'center',
        page: true,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        showOverflow: true,
        search: true,
        searchBtnText: '查询',
        cancal: false,
        column: [
          {
            label: '流程名称',
            prop: 'name',
            search: true,
            searchSpan: 4
          },
          {
            label: '当前环节',
            prop: 'nodeName',
          },
          {
            label: '发起人',
            prop: 'createBy',
            search: true,
            searchSpan: 4
          },
          // {
          //   label: '状态',
          //   prop: 'taskStatus',
          //   hide: true,
          //   search: true,
          //   type: 'select',
          //   dicData: [
          //     {label: '待审批', value: 1},
          //     {label: '已通过', value: 2},
          //     {label: '已拒绝', value: 3},
          //     {label: '已终止', value: 4}
          //   ],
          //   searchSpan: 4
          // },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            type: "datePicker",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      rowData: {},
      dialogVisible: false,
      viewVisible: false,
      imgSrc: '',
      userVisible: false,
      taskFormType: '',
      isMounted: false
    }
  },
  methods: {
    // 获取数据
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading=true
      let temp=JSON.parse(JSON.stringify(this.queryParams))
      temp=Object.assign(temp, query)
      queryTaskList(temp).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.tableLoading=false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
        }
      }).catch(e => {
        this.tableLoading=false
      })
    },
    // 搜索
    searchHandle (form) {
      this.queryParams=form
      this.getList()
    },
    // 处理
    dealHandle (row, type) {
      if (type) {
        this.taskFormType=type
      } else {
        this.taskFormType=""
      }
      this.rowData=row
      this.dialogVisible=true
    },
    handleClose () {
      this.dialogVisible=false
    },
    viewClose () {
      this.viewVisible=false
      this.imgSrc=''
    },
    // 签收
    claimHandle (row) {
      this.rowData=row
      claimTask(row.taskId).then(res => {
        if (res.data.code==0) {
          this.$message.success("签收成功")
          this.getList()
        }
      })
    },
    // 委派
    sendHandle (row) {
      this.rowData=row
      this.userVisible=true
    },
    // 关闭委派弹框
    userClose () {
      this.userVisible=false
    },
    // 委派提交
    assignHandle () {
      assignTask(this.rowData.taskId, this.rowData.assignee.id).then(res => {
        if (res.data.code==0) {
          this.$message.success("委派成功")
          this.getList()
        }
      })
      this.userClose()
    },
    closeHandle (bool) {
      if (bool) {
        this.handleClose()
        this.getList()
      }
    }
  },
  mounted () {
    let that=this
    window.addEventListener('message', (e) => {
      if (e.data.type==='setLocalStorage') {
        that.$store.commit("SET_ACCESS_TOKEN", e.data.data.TOKEN)
        that.$store.commit("SET_USER_INFO",{tenantId:e.data.data.tenantId})
        that.isMounted=true
      }
    })
    if (that.$store.getters.access_token) {
      that.isMounted=true
    }
  }
}
</script>
<style lang="scss">
.form-fullscreen-dialog-allbody{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      width: 100%;
      left: 0;
      box-sizing: border-box;
      padding: 8px 10px;
    }
  }
}
</style>
