<template>
  <div class="app-manage-box">
    <div class="app-manage">
      <jvs-table
        pageheadertitle='在线用户'
        :index="false"
        :option="option"
        :data="tableData"
        @on-load="getList"
      >
        <template slot="menu" slot-scope="scope">
          <jvs-button type="text" size="mini" permisionFlag="" @click="handleView(scope.row)">查看</jvs-button>
          <jvs-button type="text" size="mini" permisionFlag="" @click="outUSerHandle(scope.row)"><span style="color: #F56C6C;">结束会话</span></jvs-button>
        </template>
        <template slot="headImg" slot-scope="scope">
          <img v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.headImg" :src="scope.row.additionalInformation.userDto.headImg" style="display:inline-block;width:40px;height:40px;border-radius:50%;overflow:hidden;">
        </template>
        <template slot="realName" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.realName" >{{scope.row.additionalInformation.userDto.realName}}</span>
        </template>
        <template slot="email" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.email" >{{scope.row.additionalInformation.userDto.email}}</span>
        </template>
        <template slot="expiration" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.expiration" >{{getFormatTime(scope.row.additionalInformation.userDto.expiration)}}</span>
        </template>
        <template slot="phone" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.phone" >{{scope.row.additionalInformation.userDto.phone}}</span>
        </template>
        <template slot="ip" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.ip" >{{scope.row.additionalInformation.userDto.ip}}</span>
        </template>
        <template slot="userAgent" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.userAgent">{{scope.row.additionalInformation.userDto.userAgent}}</span>
        </template>
        <template slot="clientName" slot-scope="scope">
          <span v-if="scope.row && scope.row.additionalInformation && scope.row.additionalInformation.userDto && scope.row.additionalInformation.userDto.clientName">{{scope.row.additionalInformation.userDto.clientName}}</span>
        </template>
      </jvs-table>
      <div class="treeBox">
        <el-tree
          ref="appTree"
          :data="appList"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :loading="appLoading"
          :props="defaultPostProps"
          @node-click="appHandleClick"
        >
          <span slot-scope="{ node, data }" class="customize-tree-node">
            <span>
              <i :class="node.icon"></i>
              <span class="customize-tree-node-label">{{ node.label }}</span>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form v-if="formData" label-width="80px" :model="formData">
        <el-form-item label="头像">
          <img v-if="formData.headImg" :src="formData.headImg" style="display:inline-block;width:40px;height:40px;border-radius:50%;overflow:hidden;" alt="">
        </el-form-item>
        <el-form-item label="账号">
          {{formData.accountName}}
        </el-form-item>
        <el-form-item label="名称">
          {{formData.realName}}
        </el-form-item>
        <el-form-item label="手机号">
          {{formData.phone}}
        </el-form-item>
        <el-form-item label="登录类型">
          {{formData.loginType}}
        </el-form-item>
        <el-form-item label="设备">
          {{formData.userAgent}}
        </el-form-item>
        <el-form-item label="岗位">
          {{formData.jobName}}
        </el-form-item>
        <el-form-item label="部门">
          {{formData.deptName}}
        </el-form-item>
        <el-form-item label="职工编号">
          {{formData.employeeNo}}
        </el-form-item>
<!--        <el-form-item label="有效时间">-->
<!--          {{formData.expiration ? getFormatTime(formData.expiration) : ''}}-->
<!--        </el-form-item>-->
        <el-form-item label="过期时间">
          {{(formData.refreshToken && formData.refreshToken.expiration) ? getFormatTime(formData.refreshToken.expiration) : ''}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { tableOption } from './option'
import { getAppList, getUserByAppId, outUser} from './api'
export default {
  name: 'app-manage',
  components: {},
  data () {
    return {
      formData: {},
      dialogVisible: false,
      queryParams: {},
      option: tableOption,
      tableData: [],
      selectOneData: null,
      appList: [], // 应用列表
      appid: '', // 当前选中应用id
      appLoading: false,
      defaultPostProps: {
        children: 'children',
        label: 'name',
        sort: 'sort'
      },
    }
  },
  created () {
    this.getAppTree()
  },
  methods: {
    // 查看数据 弹窗关闭
    handleClose() {
      this.dialogVisible = false
    },
    // 获取数据
    getList (page) {
      if(this.appid) {
        let obj = {
          appId: this.appid
        }
        getUserByAppId(obj).then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data
          }
        })
      }else{
        this.tableData = []
      }
    },
    getAppTree () {
      this.appLoading = true
      getAppList().then(res => {
        if(res.data.code == 0) {
          this.appList = res.data.data
          this.appLoading = false;
        }
      })
    },
    // 应用选中
    appHandleClick (data, node, dom) {
      this.selectOneData = data
      if(this.appid == data.appKey) {
        this.appid = ""
        this.$refs.appTree.setCurrentKey(null)
        this.$forceUpdate()
      }else{
        this.appid = data.appKey
      }
      this.getList()
    },
    // 获取时间
    getFormatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 查看详情
    handleView(obj) {
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(obj.additionalInformation.userDto))
      this.formData.expiration = obj.expiration
      this.formData.refreshToken = obj.refreshToken
    },
    // 强制退出
    outUSerHandle (row) {
      this.$confirm("是否强制退出该用户？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outUser(row.value).then(res => {
          if(res.data.code == 0) {
            this.$message.success('该用户成功退出')
            this.getList()
          }
        })
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.base-type-list{
  padding: 0;
  margin: 0;
  li{
    display: flex;
    align-items: center;
    margin: 0;
    //margin-bottom: 10px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding: 6px 24px;
    i{
      margin-right: 10px;
      font-size: 14px!important;
    }
  }
  li:hover{
    background: #F5F7FA;
  }
  li:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.app-manage-box {
  position: relative;
  height: 100%;
  .treeBox {
    position: absolute;
    //top: 65px;
    top: 24px;
    left: 0;
    width: 250px;
    //height: calc(100% - 65px);
    height: calc(100% - 24px);
    overflow: hidden;
    overflow-y: auto;
    padding-left: 20px;
    border-right: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    .customize-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .customize-tree-node-label{
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 174px;
      }
    }
    .el-tree{
      min-height: calc(100% - 19px);
    }
    .el-tree-node{
      .el-tree-node__content{
        width: 100%;
      }
    }
    .el-tree-node.is-current{
      >.el-tree-node__content{
        background-color: #F5F7FA;
      }
    }
  }
  .treeBox::-webkit-scrollbar{
    display: none;
  }
  .el-table{
    width: calc(100% - 250px);
    margin-left: 250px;
  }
}
.form-itme-tree {
  .el-tree-node__content:hover{
    border: none;
    background-color: #fff;
  }
}
</style>
