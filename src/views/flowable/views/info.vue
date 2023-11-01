<template>
  <div class="process-info">
    <jvs-tab :option="tabOption" size="mini" :active="active">
      <template slot="form">
        <div>
          <iframe
            :src="formUrl"
            class="iframe"
            scrolling="no"
            v-if="isOut"
          >
          </iframe>
          <showForm v-if="!isOut && formShow" :formUrl="formUrl" :defaultFormData="defaultFormData" :btnHide="btnHide" @close="closeHandle" />
      </div>
      </template>
      <template slot="info">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in historyList" :key="item.nodeId+'_'+index" :timestamp="item.time" placement="top">
            <div class="history-item">
              <p style="position:relative;">
                <span style="font-weight: 600;">{{item.nodeName}}</span>
                <el-tag size="mini" type="info" effect="dark" v-if="item.mode" style="margin-left:10px;">{{ getModeLabel(item.mode) }}</el-tag>
                <el-tag size="mini" type="info" effect="dark" v-if="item.durationTime" style="margin-left:10px;">{{ item.durationTime }}</el-tag>
                <jvs-button v-if="item.formId" size="mini" type="text" style="position: absolute;top: -5px;right: 0;" @click="viewChange(item)">提交记录</jvs-button>
              </p>
              <jvs-table class="auto-height-table" :option="index > 0 ? logOption : startLogOption" :data="item.approveResultDtos" v-if="item.approveResultDtos && item.approveResultDtos.length > 0">
                <template slot="time" slot-scope="scope">
                  <span>{{scope.row.time ? scope.row.time : '-'}}</span>
                </template>
                <template slot="nodeOperationTypeEnum" slot-scope="scope">
                  <span>{{getTypeEnumLabel(scope.row)}}</span>
                </template>
              </jvs-table>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
      <template slot="image">
        <div class="viewDesign" :style="'transform: scale(' + 80 / 100 + '); transform-origin: 50% 0px 0px; width: 100%;'">
          <processImage v-if="flowDesign" :process="flowDesign"></processImage>
          <el-row>
            <div class="end">
              <div></div>
              <div></div>
              <div class="end-node">流程结束</div>
            </div>
          </el-row>
        </div>
      </template>
    </jvs-tab>
    <!-- 变更信息 -->
    <changeInfo ref="changeInfo"></changeInfo>
  </div>
</template>
<script>
import {queryDetailHistoryInfo, queryEchoForm} from '../api/flowable'
import showForm from './componet/info'
import processImage from './design/process/processImage.vue'
import changeInfo from './componet/changeInfo.vue'
export default {
  name: 'process-info',
  components: {showForm, processImage, changeInfo},
  props: {
    rowData: {
      type: Object
    },
    btnHide: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      active: 'form',
      tabOption: {
        type: 'card', // border-card
        column: [
          {
            label: '表单信息',
            name: 'form'
          },
          {
            label: '流程信息',
            name: 'info'
          },
          {
            label: '流程图',
            name: 'image'
          }
        ]
      },
      formUrl: '',
      historyList: [],
      startLogOption: {
        addBtn: false,
        menu: false,
        showOverflow: true,
        search: false,
        align: 'center',
        menuAlign: 'center',
        hideTop: true,
        column: [
          {
            label: '审批人',
            prop: 'userName'
          },
          {
            label: '时间',
            prop: 'time',
            slot: true
          }
        ]
      },
      logOption: {
        addBtn: false,
        menu: false,
        showOverflow: true,
        search: false,
        align: 'center',
        menuAlign: 'center',
        hideTop: true,
        column: [
          {
            label: '审批人',
            prop: 'userName'
          },
          {
            label: '审批状态',
            prop: 'nodeOperationTypeEnum',
            slot: true
          },
          {
            label: '时间',
            prop: 'time',
            slot: true
          }
        ]
      },
      isOut: false,
      defaultFormData: {}, // 表单数据值
      formShow: false, // 设计表单显示
      flowDesign: null, // 流程图节点信息
    }
  },
  created () {
    if(this.rowData) {
      this.init()
      if(this.rowData.formId) {
        this.formUrl = `/page-design-ui/#/form/info?id=${this.rowData.formId}&dataModelId=${this.rowData.dataModelId}`
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
  },
  methods: {
    async init () {
      if(this.rowData.dataId) {
        await this.getEchoFormData()
        this.queryDetailHistoryInfoHandle()
      }
    },
    // 表单回显
    async getEchoFormData () {
      await queryEchoForm(this.rowData.dataModelId, this.rowData.dataId).then(res => {
        if(res.data.code == 0) {
          this.defaultFormData = res.data.data
          this.formShow = true
        }
      })
    },
    // 流程信息
    queryDetailHistoryInfoHandle () {
      if(this.rowData.id) {
        queryDetailHistoryInfo(this.rowData.id).then(res => {
          if(res.data && res.data.code == 0) {
            this.historyList = res.data.data.flowTaskProgressDtos
            // console.log(this.historyList)
            this.flowDesign = res.data.data.flowDesign
          }
        })
      }
    },
    closeHandle (bool) {
      if(bool) {
        this.$emit('close', bool)
      }
    },
    getModeLabel (val) {
      let label = ''
      switch(val) {
        case 'AND':
          label = '会签';break;
        case 'OR':
          label = '或签';break;
        case 'NEXT':
          label = '非会签';break;
        default: ;break;
      }
      return label
    },
    getTypeEnumLabel (row) {
      let label = '-'
      switch(row.nodeOperationTypeEnum) {
        case 'PASS':
          label = '已通过';break;
        case 'REFUSE':
          label = '已拒绝';break;
        case 'BACK':
          label = '已驳回';break;
        default: 
          label = '处理中';break;
      }
      return label
    },
    viewChange (item) {
      let temp = JSON.parse(JSON.stringify(item))
      this.$set(temp, 'dataId', this.rowData.dataId)
      this.$refs.changeInfo.openDialog(temp)
    }
  }
}
</script>
<style lang="scss" scoped>
.viewDesign {
    box-sizing: border-box;
    overflow: hidden;
    overflow: auto;
    ::v-deep .el-row {
      display: flex;
      justify-content: center;
      .end {
        .end-node {
          margin-top: 18px;
          border-radius: 15px;
          padding: 5px 10px;
          font-size: small;
          color: #747474;
          background-color: #f2f2f2;
          box-shadow: 0 0 10px 0 #bcbcbc;
          margin-bottom: 10px;
        }
      }
    }
    ::v-deep .arrow{
      .el-card:hover{
        .SP, .TJ, .CS{
          .el-icon-close, .el-icon-copy-document{
            display: none;
          }
        }
      }
      .line-y{
        .el-button.is-circle{
          display: none;
        }
      }
    }
    ::v-deep .add-tj{
      display: none;
    }
    ::v-deep .fc{
      .bdtb{
        margin-top: 0;
      }
    }
  }
</style>
<style lang="scss">
.process-info{
  padding: 20px 40px;
  .iframe{
    border: 0;
    width: 100%;
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
  .table-body-box{
    .el-table{
      .el-table__body-wrapper{
        height: auto!important;
      }
    }
  }
}
</style>
