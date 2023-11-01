<template>
  <div class="task-form">
    <jvs-tab :active="active" :option="taskFormType == 'view' ? viewOption : tabOption" size="mini">
      <template slot="form">
        <!-- rowData.formKey -->
        <iframe
          :src="formUrl"
          class="iframe"
          scrolling="no"
          v-if="isOut"
        >
        </iframe>
        <showForm v-if="!isOut && formShow" :formUrl="formUrl" :defaultFormData="defaultFormData" :btnHide="taskFormType == 'view' ? true : false" :onlyView="taskFormType == 'view' ? true : false" @close="closeHandle" />
      </template>
      <template slot="process">
        <img v-if="imgSrc" :src="imgSrc" alt="" style="display:block;">
      </template>
      <template slot="info">
        <el-timeline>
          <el-timeline-item v-for="item in historyList" :key="item.processInstanceId" :timestamp="item.startTime" placement="top">
            <!-- <el-card>
              <p>{{item.assigneeName}}：<span>【{{item.activityName}}】</span></p>
              <p>开始时间：{{item.startTime}}</p>
              <p>结束时间：{{item.endTime}}</p>
              <p v-if="item.durationTime">用时：{{item.durationTime}}</p>
            </el-card> -->
            <div class="history-item">
              <p>
                <span style="font-weight: 600;">{{item.nodeName}}</span>
                <el-tag size="mini" type="info" effect="dark" v-if="item.countersignType" style="margin-left:10px;">{{ item.countersignType }}</el-tag>
                <el-tag size="mini" type="info" effect="dark" v-if="item.durationTime" style="margin-left:10px;">{{ item.durationTime }}</el-tag>
              </p>
              <!-- <p>开始时间：{{item.startTime}}</p>
              <p>结束时间：{{item.endTime}}</p>
              <p v-if="item.durationTime">用时：{{item.durationTime}}</p> -->
              <jvs-table class="auto-height-table" :option="logOption" :data="item.taskLogList" v-if="item.taskLogList && item.taskLogList.length > 0">
                <template slot="endTime" slot-scope="scope">
                  <span>{{scope.row.endTime ? scope.row.endTime : '-'}}</span>
                </template>
                <template slot="remark" slot-scope="scope">
                  <span>{{scope.row.remark ? scope.row.remark : '-'}}</span>
                </template>
              </jvs-table>
            </div>
          </el-timeline-item>
        </el-timeline>
        <!-- <jvs-table :page="page" :option="tableOption" :data="tableData" @on-load="getHistoryInfo"></jvs-table> -->
      </template>
    </jvs-tab>
  </div>
</template>
<script>
import {queryApplyHistoryInfo, queryApplyImage, queryDetailHistoryInfo, queryEchoForm} from './componet/api'
import showForm from './componet/info'
export default {
  name: 'task-form',
  components: {showForm},
  props: {
    rowData: {
      type: Object
    },
    taskFormType: {
      type: String
    }
  },
  data(){
    return {
      active: 'form',
      tabOption: {
        type: 'card',
        column: [
          {
            label: '审批信息',
            name: 'form'
          },
          {
            label: '流程进度',
            name: 'process'
          },
          {
            label: '流转信息',
            name: 'info'
          }
        ]
      },
      viewOption: {
        type: 'card',
        column: [
          {
            label: '表单信息',
            name: 'form'
          },
          {
            label: '流程进度',
            name: 'process'
          },
          {
            label: '流转信息',
            name: 'info'
          }
        ]
      },
      tableData: [],
      tableOption: {
        page: true,
        addBtn: false,
        menu: false,
        showOverflow: true,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '执行环节',
            prop: 'activityName'
          },
          {
            label: '执行人',
            prop: 'assigneeName'
          },
          {
            label: '开始时间',
            prop: 'startTime'
          },
          {
            label: '结束时间',
            prop: 'endTime'
          },
          {
            label: '审批意见',
            prop: 'remark'
          },
          {
            label: '任务历时/ms',
            prop: 'durationTime'
          },
          {
            label: '审批结果',
            prop: 'resultName'
          }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 50, 100, 200, 500, 1000]
      },
      imgSrc: '',
      formUrl: '', // '/page-design-ui/#/form/info?'
      isOut: false,
      historyList: [],
      logOption: {
        addBtn: false,
        menu: false,
        showOverflow: true,
        search: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '审批人',
            prop: 'assigneeName'
          },
          {
            label: '审批结果',
            prop: 'resultName'
          },
          {
            label: '意见',
            prop: 'remark',
            slot: true
          },
          {
            label: '时间',
            prop: 'endTime',
            slot: true
          }
        ]
      },
      defaultFormData: {}, // 表单回显数据
      formShow: false, // 设计表单显示
    }
  },
  created () {
    if(this.rowData.processInstanceId) {
      this.getImgHandle()
      // this.getHistoryInfo()
      this.queryDetailHistoryInfoHandle()
      if(this.taskFormType == 'view') {
        this.getEchoFormData()
      }
    }
    // 进度
    if(this.taskFormType == 'view') {
      if(this.rowData.startFormKey) {
        this.formUrl = this.rowData.startFormKey
        if(this.formUrl) {
          if(this.formUrl.startsWith('htt')) {
            this.isOut = true
          }else{
            if(this.formUrl.startsWith('/page-design-ui')) {
              this.isOut = false
            }else{
              this.isOut = true
            }
          }
        }
      }
    }
    // 办理
    else{
      if(this.rowData.formKey) {
        this.formUrl = this.rowData.formKey
        this.formUrl += `&taskId=${this.rowData.taskId}`
        if(this.rowData.assignee) {
          this.formUrl += `&assignId=${this.rowData.assignee.id}`
        }
        if(this.formUrl) {
          if(this.formUrl.startsWith('htt')) {
            this.isOut = true
          }else{
            if(this.formUrl.startsWith('/page-design-ui')) {
              this.isOut = false
              this.defaultFormData = null
            }else{
              this.isOut = true
            }
          }
        }
        this.formShow = true
      }
    }
  },
  methods: {
    // 流转记录
    getHistoryInfo () {
      if(this.rowData.processInstanceId) {
        let obj = {
          current: this.page.currentPage,
          size: this.page.pageSize
        }
        queryApplyHistoryInfo(this.rowData.processInstanceId, obj).then(res => {
          if(res.data.code == 0) {
            this.tableData = res.data.data.data
            this.page.currentPage = res.data.data.current
            this.page.total = res.data.data.total
          }
        })
      }
    },
    // 表单回显
    getEchoFormData () {
      queryEchoForm(this.rowData.processInstanceId).then(res => {
        if(res.data.code == 0) {
          this.defaultFormData = res.data.data
          this.formShow = true
        }
      })
    },
    // 流程进度图
    getImgHandle () {
      queryApplyImage(this.rowData.processInstanceId).then(res => {
        if(res.data.code == 0) {
          this.imgSrc = res.data.data
        }
      })
    },
    closeHandle (bool) {
      if(bool) {
        this.$emit('close', bool)
      }
    },
    // 流程信息
    queryDetailHistoryInfoHandle () {
      if(this.rowData.processInstanceId) {
        queryDetailHistoryInfo(this.rowData.processInstanceId).then(res => {
          if(res.data.code == 0) {
            this.historyList = res.data.data.data
          }
        })
      }
    },
  }
}
</script>
<style lang="scss">
.task-form{
  .el-tabs{
    .el-tabs__content{
      min-height: 80vh;
      .el-tab-pane{
        height: 100%;
        .iframe{
          position: absolute;
          width: 100%;
          height: 100%;
          border: 0;
        }
      }
    }
  }
  .el-timeline{
   .el-timeline-item{
     .el-timeline-item__content{
      .history-item{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        padding: 8px 10px;
        // border: 1px solid #ccc;
        margin: 20px;
      }
     }
   } 
  }
}
.auto-height-table{
  .el-table__body-wrapper{
    height: auto!important;
  }
}
</style>