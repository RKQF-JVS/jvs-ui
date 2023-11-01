<template>
  <div class="apply-list">
    <jvs-table
      pageheadertitle='我的申请'
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchHandle"
    >
      <template slot="updateTime" slot-scope="scope">
        <span>{{scope.row.taskStatus == 1 ? '' : scope.row.updateTime}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="viewHandle(scope.row)">查看进度</jvs-button>
        <jvs-button type="text" size="mini" v-if="scope.row.taskStatus == 1 && scope.row.extend && scope.row.extend.enableCancel" @click="cancelDelHandle(scope.row, '取消')">取消</jvs-button>
        <!-- <jvs-button type="text" size="mini" v-if="scope.row.ended"  @click="cancelDelHandle(scope.row, '删除')">删除</jvs-button> -->
      </template>
    </jvs-table>
    <!-- 删除  取消  的理由 -->
    <el-dialog :title="mstr+'理由'" :visible.sync="reasonVisible" v-if="reasonVisible" append-to-body :before-close="reasonClose">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入理由"
        v-model="reasonForm.reason">
      </el-input>
      <el-row style="margin-top:20px;display:flex;align-items:center;justify-content:center;">
        <jvs-button size="mini" type="primary" @click="cacelDelSubmit">确定</jvs-button>
        <jvs-button size="mini" @click="reasonClose">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 进度 -->
    <el-dialog class="form-fullscreen-dialog form-fullscreen-dialog-allbody" title="进度" fullscreen :visible.sync="infoVisible" v-if="infoVisible" append-to-body :before-close="infoClose">
      <infoForm :rowData="rowData" :btnHide="true" @close="closeHandle" />
    </el-dialog>
  </div>
</template>
<script>
import {applyList, candelProcess} from "../api/flowable"
import infoForm from './info'
export default {
  name: 'task-list',
  components: {infoForm},
  data(){
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
            searchSpan: 4,
            search: true
          },
          {
            label: '状态',
            prop: 'taskStatus',
            search: true,
            searchSpan: 4,
            type: 'select',
            dicData: [
              {label: '待审批', value: 1},
              {label: '已通过', value: 2},
              {label: '已拒绝', value: 3},
              {label: '已终止', value: 4}
            ]
          },
          {
            label: '流程发起人',
            prop: 'createBy'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            type: "datePicker",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss"
          },
          {
            label: '完成时间',
            prop: 'updateTime',
            slot: true,
            datetype: 'datetime',
            type: "datePicker",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss"
          }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      // 取消  删除  理由
      reasonVisible: false,
      reasonForm: {},
      rowData: {},
      mstr: '',
      infoVisible: false
    }
  },
  methods: {
    // 获取数据
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      temp = Object.assign(temp, query)
      applyList(temp).then(res => {
        if (res.data.code==0) {
          this.tableData = res.data.data.records
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
      this.queryParams = form
      this.getList()
    },
    // 取消 删除
    cancelDelHandle (row, str) {
      this.mstr = str
      this.rowData = row
      this.reasonVisible = true
    },
    reasonClose () {
      this.reasonVisible = false
    },
    // 确定  取消 删除
    cacelDelSubmit () {
      let obj = {
        reason: this.reasonForm.reason
      }
      candelProcess(this.rowData.id, obj).then(res => {
        if(res.data.code == 0) {
          this.$message.success(this.mstr+"成功")
          this.getList()
          this.reasonClose()
        }
      })
    },
    viewHandle (row) {
      this.rowData = row
      this.infoVisible = true
    },
    infoClose () {
      this.infoVisible = false
    },
    closeHandle (bool) {
      if(bool) {
        this.infoClose()
        this.getList()
      }
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
