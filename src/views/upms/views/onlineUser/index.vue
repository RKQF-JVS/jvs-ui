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
          <jvs-button type="text" size="mini" permisionFlag="" @click="outUSerHandle(scope.row)">强制退出</jvs-button>
        </template>
        <template slot="headImg" slot-scope="scope">
          <img v-if="scope.row && scope.row.userDto && scope.row.userDto.headImg" :src="scope.row.userDto.headImg" style="display:inline-block;width:40px;height:40px;border-radius:50%;overflow:hidden;">
        </template>
        <template slot="realName" slot-scope="scope">
          <span v-if="scope.row && scope.row.userDto && scope.row.userDto.realName" >{{scope.row.userDto.realName}}</span>
        </template>
        <template slot="email" slot-scope="scope">
          <span v-if="scope.row && scope.row.userDto && scope.row.userDto.email" >{{scope.row.userDto.email}}</span>
        </template>
        <template slot="phone" slot-scope="scope">
          <span v-if="scope.row && scope.row.userDto && scope.row.userDto.phone" >{{scope.row.userDto.phone}}</span>
        </template>
        <template slot="ip" slot-scope="scope">
          <span v-if="scope.row && scope.row.userDto && scope.row.userDto.ip" >{{scope.row.userDto.ip}}</span>
        </template>
        <template slot="userAgent" slot-scope="scope">
          <span v-if="scope.row && scope.row.userDto && scope.row.userDto.userAgent">{{scope.row.userDto.userAgent}}</span>
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
  </div>
</template>
<script>
import { tableOption } from './option'
import { getAppList, getUserByAppId, outUser} from './api'
export default {
  name: 'app-manage',
  components: {},
  data () {
    return {
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
    // 强制退出
    outUSerHandle (row) {
      this.$confirm("是否强制退出该用户？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outUser(row.access_token).then(res => {
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
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px 10px;
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
