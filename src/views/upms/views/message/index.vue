<template>
  <div class="message-manage">

    <jvs-table
      pageheadertitle='消息管理'
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchHandle"
    >
      <template slot="menuLeft">
<!--        <jvs-button type="primary" size="mini" @click="addMessage" v-if="$permissionMatch('upms_mgr_xiao_xi_guan_li_xin_zeng')">新增</jvs-button>-->
        <jvs-button v-if="configArr.indexOf('SMS') > -1" type="primary" size="mini" @click="addMessage('新增短信消息', 'sms')" icon="el-icon-plus">短信消息</jvs-button>
        <jvs-button v-if="configArr.indexOf('EMAIL') > -1" type="primary" size="mini" @click="addMessage('新增邮件消息', 'email')" icon="el-icon-plus">邮件消息</jvs-button>
        <jvs-button type="primary" size="mini" @click="addMessage('新增站内信', 'interior')" icon="el-icon-plus">站内信</jvs-button>
<!--        <jvs-button v-if="configArr.indexOf('WECHAT_MP_MESSAGE') > -1" type="primary" size="mini" @click="addMessage('新增公众号消息', 'WECHAT_MP_MESSAGE')" icon="el-icon-plus">公众号消息</jvs-button>-->
<!--        <jvs-button v-if="configArr.indexOf('WX_ENTERPRISE') > -1" type="primary" size="mini" @click="addMessage('新增企业微信消息', 'WX_ENTERPRISE')" icon="el-icon-plus">企业微信消息</jvs-button>-->
        <jvs-button v-if="configArr.indexOf('DING_H5') > -1" type="primary" size="mini" @click="addMessage('新增钉钉消息', 'DING_H5')" icon="el-icon-plus">钉钉消息</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="editHandle(scope.row, 'view')">查看</jvs-button>
        <jvs-button type="text" size="mini" :disabled="retryDisable" v-if="scope.row.status === 1 && $permissionMatch('upms_mgr_xiao_xi_guan_li_zhong_fa')" @click="retryMessageHandle(scope.row)">重发</jvs-button>
        <jvs-button type="text" size="mini" v-if="[0, 2].indexOf(scope.row.status) > -1 && $permissionMatch('upms_mgr_xiao_xi_guan_li_xiu_gai')" @click="editHandle(scope.row, 'edit')">编辑</jvs-button>
        <jvs-button type="text" size="mini" :disabled="retryDisable" v-if="[0, 2].indexOf(scope.row.status) > -1 && $permissionMatch('upms_mgr_xiao_xi_guan_li_fa_song')" @click="sendMessageHandle(scope.row, scope.index)">发送</jvs-button>
        <jvs-button type="text" size="mini" v-if="[0, 2].indexOf(scope.row.status) > -1 && $permissionMatch('upms_mgr_xiao_xi_guan_li_shan_chu')" @click="deleteMessageHandle(scope.row)">删除</jvs-button>
      </template>
      <template slot="recipients" slot-scope="scope">
        <!-- <span v-for="(item, index) in scope.row.recipients" :key="item+index">{{item.realName ? item.realName : ''}}{{(scope.row.recipients.length - 1 >  index && item.realName)? ',' : ''}}</span> -->
        <el-tag v-for="(item, index) in scope.row.recipients" :key="item+index" v-show="item.name">{{item.name}}</el-tag>
      </template>
      <template slot="status" slot-scope="scope">
        <span :style="scope.row.status == 0 ? 'color: #F56C6C;' : (scope.row.status === 1 ? 'color: #67C23A;' : 'color: #E6A23C;')">
          {{scope.row.status == 0 ? '失败' : (scope.row.status === 1 ? '成功' : (scope.row.status === 2 ? '未发送' : '发送中'))}}
        </span>
      </template>
      <template slot="sendMessageType" slot-scope="scope">
        <span :style="'color:'+getValByAttrOfDic(scope.row.sendMessageType, 'value', 'color')">{{getValByAttrOfDic(scope.row.sendMessageType, 'value', 'label')}}</span>
      </template>
    </jvs-table>
    <!-- </el-scrollbar> -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
      fullscreen
      :title="title"
      class="form-fullscreen-dialog"
      :close-on-click-modal="false"
    >
      <sms ref="sms" v-if="dialogType === 'sms'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>
<!--      <we-chat-mp-message v-if="dialogType === 'WECHAT_MP_MESSAGE'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>-->
      <email v-if="dialogType === 'email'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>
      <interior v-if="dialogType === 'interior'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>
      <wx-enterprise v-if="dialogType === 'WX_ENTERPRISE'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>
      <ding v-if="dialogType === 'DING_H5'" :isAdd="isAdd" :isView="isView" :rowData="rowData" @editSubmit="editSubmit"/>
    <!-- :fullscreen="rowData.sendType == 'sms' ? false: true" -->
      <jvs-form v-if="false" ref="messInfoForm" :option="searchOption" :formData="rowData" @submit="editSubmit">
        <!-- 联系人 -->
        <template slot="recipientsForm">
          <!-- 用户组件 -->
          <userForm :sendType="rowData.sendType" :defaultValue="rowData.recipients" @userSelectChange="userSelectChange"/>
        </template>
        <!-- 内容 -->
        <template slot="contentForm">
          <!-- 短信 -->
          <el-input
            v-if="rowData && rowData.sendType == 'sms'"
            type="textarea"
            :rows="2"
            placeholder="请输入短信内容"
            v-model="rowData.content">
          </el-input>
          <!-- 邮件、站内信 -->
          <div v-if="rowData && rowData.sendType !== 'sms'">
            <htmlContent ref="htmlDesigner" :editorProp="editor" :searchOption="searchOption" :rowData="rowData" @clear="clear" @validate="validate" />
            <div v-if="contentValidate" class="el-form-item__error">请填写内容</div>
          </div>
        </template>
        <template slot="formButton">
          <jvs-button size="mini" type="primary" v-if="rowData && rowData.id" :loading="sendLoading" @click="saveSend">保存并发送</jvs-button>
          <jvs-button size="mini" @click="handleClose">取消</jvs-button>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import { tableOption, messFormOption } from './option'
import sms from './components/sms'
import interior from './components/interior'
import weChatMpMessage from './components/wechatMpMessage'
import {getMessage, addMessage, editMessage, sendMessage, retryMessage, deleteMessage} from '../../api/message'
import userForm from './userForm'
import htmlContent from './html'
import Email from "./components/email";
import WxEnterprise from "@/views/upms/views/message/components/wxEnterprise";
import Ding from "@/views/upms/views/message/components/ding";
import {getTenantConfig} from "@/api/common";
export default {
  name: 'message-manage',
  components: {Ding, WxEnterprise, Email, userForm, htmlContent, sms, weChatMpMessage, interior},
  data () {
    return {
      isAdd: false,
      isView: false,
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
      searchOption: messFormOption, // 查询表单配置
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {}, // 行数据
      viewData: [], // 查看数据
      dialogVisible: false,
      dialogType: '',
      reverse: true,
      dataViewList: [],
      dataViewLoading: false,
      viewDataLoading: false,
      currentNode: {
        id: ''
      }, // 当前节点
      title: '',
      editor: null, // 富文本
      contentValidate: false,
      retryDisable: false, // 发送禁用
      subForm: null,
      sendLoading: false,
      configArr: [], // 消息类型配置
    }
  },
  created() {
    this.getTenantConfig()
  },
  methods: {
    // 获取消息类型配置
    getTenantConfig() {
      getTenantConfig().then(res => {
        if (res.data && res.data.code == 0) {
          this.configArr = res.data.data || []
        }
      })
    },
    // 新增
    addMessage (title, type) {
      this.isAdd = true
      this.isView = false
      this.title = title
      this.dialogVisible = true
      this.dialogType = type
      // this.title = '新增'
      // this.searchOption.disabled = false
      // this.rowData = {
      //   content: ""
      // }
      // this.dialogVisible = true
    },
    //   获取数据
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      temp = Object.assign(temp, query)
      getMessage(temp).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          for(let i in this.tableData) {
            // if(this.tableData[i].recipients) {
            //   this.tableData[i].recipients = JSON.parse(this.tableData[i].recipients)
            // }
          }
          this.tableLoading=false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
        }
      })
    },
    // 编辑
    editHandle (row, type) {
      this.isAdd = false
      if(type == 'view') {
        this.title = '查看'
        // this.searchOption.disabled = true
        this.isView = true
      }
      if(type == 'edit') {
        this.title = '编辑'
        this.isView = false
        // this.searchOption.disabled = false
      }
      // let temp = []
      // for(let i in this.rowData.recipients) {
      //   if(this.rowData.recipients[i]) {
      //     temp.push(this.rowData.recipients[i])
      //   }
      // }
      // this.rowData.recipients = temp
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogType = row.sendType
      this.dialogVisible = true
    },
    // 提交编辑
    editSubmit (form, type) {
      if (this.isAdd) {
        addMessage(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success('新增成功')
            this.getList()
            this.handleClose()
          }
        }).catch(e => {
        })
      } else {
        editMessage(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改成功')
            this.getList()
            if(type == 'send') {
              this.sendMessageHandle(form)
            }else{
              this.handleClose()
            }
          }
        }).catch(e => {
          this.sendLoading = false
        })
      }
      return
      this.subForm = JSON.parse(JSON.stringify(form))
      this.subForm.recipients = JSON.stringify(this.subForm.recipients)
      if(this.subForm.sendType !== 'sms') {
        if(this.$refs.htmlDesigner) {
          this.$refs.htmlDesigner.submit()
        }
      }
      if(!this.subForm.content) {
        if(type == 'send') {
          this.sendLoading = false
        }
        return false
      }
      if(this.title == '新增') {
        this.searchOption.submitLoading = true
        addMessage(this.subForm).then(res => {
          if(res.data.code == 0) {
            this.$message.success('新增成功')
            this.getList()
            this.handleClose()
            this.searchOption.submitLoading = false
          }
        }).catch(e => {
          this.searchOption.submitLoading = false
        })
      }else{
        if(type !== 'send') {
          this.searchOption.submitLoading = true
        }
        editMessage(this.subForm).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改成功')
            this.getList()
            if(type == 'send') {
              this.sendMessageHandle(this.subForm)
            }else{
              this.searchOption.submitLoading = false
              this.handleClose()
            }
          }
        }).catch(e => {
          this.sendLoading = false
        })
      }
    },
    // 保存并发送
    saveSend () {
      this.sendLoading = true
      this.editSubmit(this.rowData, 'send')
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible=false
      this.subForm = null
      this.searchOption.submitLoading = false
      this.sendLoading = false
      this.$forceUpdate()
    },
    // 搜索
    searchHandle (form) {
      this.queryParams = form
      this.getList()
    },
    // 发送
    sendMessageHandle (row, index) {
      // this.$set(this.tableData[index], 'status', true)
      // this.$forceUpdate()
      this.retryDisable = true
      if(!row.id) {
        row.id = this.rowData.id
      }
      sendMessage(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('消息发送中')
          this.retryDisable = false
          this.getList()
          this.sendLoading = false
          this.handleClose()
          this.$forceUpdate()
        }
      }).catch(e => {
        this.retryDisable = false
        this.sendLoading = false
      })
    },
    // 重发
    retryMessageHandle (row) {
      this.retryDisable = true
      retryMessage(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('消息重新发送中')
          this.getList()
          this.retryDisable = false
        }
      }).catch(e => {
        this.retryDisable = false
      })
    },
    // 删除
    deleteMessageHandle (row) {
      this.$confirm('确认删除此消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessage(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 选择的用户改变
    userSelectChange (data) {
      this.rowData.recipients = data
      if(this.$refs.messInfoForm) {
        let _this = this
        if(this.$refs.messInfoForm.$refs.ruleForm) {
          let _this = this
          if(data.length > 0) {
            setTimeout(function (){
              _this.$refs.messInfoForm.$refs.ruleForm.clearValidate(['recipients'])
            }, 30)
          }
        }
      }
    },
    // 字典颜色
    getValByAttrOfDic (val1, attr1, attr2) {
      let str = ''
      let dicData = [
        {label: '广播消息', value: 'broadcast', color: '#f56c6c'},
        {label: '警告消息', value: 'warning', color: '#ed1b24'},
        {label: '通知消息', value: 'notification', color: '#e6e1e8'},
        {label: '系统消息', value: 'system', color: '#aeaeae'},
        {label: '业务消息', value: 'business', color: '#4a8ff0'}
      ]
      for(let i in dicData) {
        if(dicData[i][attr1] == val1) {
          str = dicData[i][attr2]
        }
      }
      return str
    },
    // 清除校验
    clear (props) {
      this.$refs.messInfoForm.$refs.ruleForm.clearValidate(props)
    },
    // 手动校验
    validate (props) {
      this.$refs.messInfoForm.$refs.ruleForm.validateField(props)
    }
  },
  watch: {
    'rowData.sendType' : {
      handler (newVal, oldVal) {
        let show = false
        if(newVal) {
          show = true
        }else{
          show = false
        }
        this.searchOption.column.filter(item => {
          if(item.prop == 'recipients') {
            item.display = show
          }
        })
        this.$forceUpdate()
      }
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
