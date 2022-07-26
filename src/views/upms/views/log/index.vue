<template>
  <div class="log-manage">
  
    <jvs-table
      pageheadertitle='日志管理'
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="headerTop">
        <jvs-form
          :defaultFormData="queryParams"
          :formData="queryParams"
          :option="searchOption"
          @submit="searchHandle"
        ></jvs-form>
      </template>

      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="viewItem(scope.row)">查看</jvs-button>
      </template>
    </jvs-table>
    <!-- </el-scrollbar> -->
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <h4 class="timeline-title">
        <span>{{rowData.tid}}</span>
        <span>{{rowData.startTime}}{{rowData.startTime ? ('~' + rowData.startTime) : ''}}</span>
        <span>{{rowData.consumingTime}}ms</span>
      </h4>
      <div class="timeline-box">
        <el-timeline :reverse="reverse" class="el-timeline-funciton">
          <div class="data-timeline-loading" v-if="dataViewLoading">
            <i class="el-icon-loading"></i>
          </div>
          <el-timeline-item
            v-for="(activity, index) in dataViewList"
            :key="index"
            :timestamp="activity.startTime"
            :color="activity.id == currentNode.id ? '#4A8FF0' : ''"
          >
            <span @click="viewOneInfo(activity)" :style="activity.id == currentNode.id ? 'color:#4A8FF0;' : ''">{{activity.functionName}}</span>
          </el-timeline-item>
        </el-timeline>
        <div class="info-item" >
          <el-row> <i>服务名：</i><span>{{currentNode.businessName}}</span> </el-row>
          <el-row> <i>IP地址：</i><span>{{currentNode.ip}}</span> </el-row>
          <el-row> <i>api：</i><span>{{currentNode.api}}</span> </el-row>
          <el-row> <i>类名：</i><span>{{currentNode.className}}</span> </el-row>
          <el-row> <i>方法名：</i><span>{{currentNode.functionName}}</span> </el-row>
          <el-row v-if="currentNode.threadUser">
            <i>用户数据：</i>
            <json-viewer
              style="margin-top: 10px"
              :value="(currentNode.threadUser && JSON.parse(currentNode.threadUser))"
              :expand-depth="2000"
              copyable
              boxed
              sort
            ></json-viewer>
          </el-row>
           <el-row v-if="currentNode.parameters">
            <i>请求参数：</i>
            <json-viewer
              style="margin-top: 10px"
              :value="currentNode.parameters"
              :expand-depth="2000"
              copyable
              boxed
              sort
            ></json-viewer>
          </el-row>
           <el-row v-if="currentNode.returnObj">
            <i>返回数据：</i>
            <json-viewer
              style="margin-top: 10px"
              :value="(currentNode.returnObj && currentNode.returnObj.indexOf('return') != -1) ? JSON.parse((currentNode.returnObj.split('return:')[1])) : currentNode.returnObj"
              :expand-depth="2000"
              copyable
              boxed
              sort
            ></json-viewer>
          </el-row>
        </div>
        <div class="data-timeline">
          <el-timeline :reverse="reverse">
            <div class="data-timeline-loading" v-if="viewDataLoading">
              <i class="el-icon-loading"></i>
            </div>
            <el-timeline-item
              v-for="(activity, index) in viewData"
              :key="index"
              :timestamp="activity.createDate">
              ({{activity.businessId}})({{activity.businessType}}){{ activity.modificationContent }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tableOption, searchOption } from './option'
import { getLog, getDetail, getDataLog } from '../../api/log'
export default {
  name: 'log-manage',
  data () {
    return {
      // 查询条件
      queryParams: {
        tid: '',
        functionName: '',
        userName: '',
        timerange: [],
        ip: '',
        content: '',
        api: ''
      }, 
      tableData: [], // 表格数据
      tableLoading: false,
      option: tableOption, // 表格配置
      searchOption: searchOption, // 查询表单配置
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {}, // 行数据
      viewData: [], // 查看数据
      dialogVisible: false,
      reverse: true,
      dataViewList: [],
      dataViewLoading: false,
      viewDataLoading: false,
      currentNode: {
        id: ''
      }, // 当前节点
    }
  },
  methods: {
    //   获取数据
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      temp.timerange = null
      if(this.queryParams.timerange) {
        if(this.queryParams.timerange[0]) {
          temp.startTime = this.queryParams.timerange[0]
        }
        if(this.queryParams.timerange[1]) {
          temp.endTime = this.queryParams.timerange[1]
        }
      }
      getLog(Object.assign(query, temp)).then(res => {
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
    // 查看
    viewItem (item) {
      this.dataViewLoading = true
      this.viewDataLoading = true
      this.viewData = []
      this.dataViewList = []
      this.rowData = item
      if(item.tid) {
        getDetail(item.tid).then(res => {
          if(res.data.code == 0) {
            this.viewData = res.data.data
            this.dialogVisible=true
            this.viewDataLoading = false
          }
        })
        getDataLog(item.tid).then(res => {
          if(res.data.code == 0) {
            this.dataViewList = res.data.data
            this.dialogVisible=true
            this.dataViewLoading = false
          }
        })
      }else{
        this.dialogVisible = true
      }
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible=false
    },
    // 时间轴点击
    viewOneInfo (item) {
      this.currentNode = JSON.parse(JSON.stringify(item))
      console.log(this.currentNode)
    },
    // 搜索
    searchHandle (form) {
      this.queryParams = form
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.log-manage {
  height: 100%;
  .el-form {
    .el-date-editor--datetimerange.el-input__inner {
      width: auto;
    }
  }
  .timeline-box {
    display: flex;
    justify-content: space-between;
    .el-timeline-funciton {
      width: 20%;
      .el-timeline-item__content{
        span{
          cursor: pointer;
        }
      }
    }
    .info-item {
      width: 60%;
      .el-row{
        display: flex;
        margin: 20px 0;
        i{
          font-style: normal;
          min-width: 100px;
          text-align: right;
        }
        span, .jv-container{
          flex: 1;
        }
      }
    }
  }
  .timeline-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20%;
  }
  .data-timeline{
    width: 40%;
    position: relative;
    .data-timeline-loading{
      position: absolute;
      width: 100%;
    }
  }
}
</style>