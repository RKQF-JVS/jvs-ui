<!--  -->
<template>
  <div class="role-list-box" style="height:100%;">
    <jvs-table
      pageheadertitle='系统角色'
      ref="multipleTable"
      :data="tableData"
      tooltipEffect="dark"
      style="width: 100%;height:100%;"
      :loading="tableLoading"
      :option="option"
      :page="page"
      :defalutFormData="queryParams"
      @on-load="getList"
    >
      <template slot="menuLeft">
        <jvs-button icon="el-icon-plus" type="primary" size="mini" permisionFlag="upms_role_add" @click="addRole">新增角色</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" permisionFlag="upms_role_remove" @click="removeUser(scope.row)">移出用户</jvs-button>
      </template>
    </jvs-table>
    <div class="role-tree">
      <div class="el-tree">
        <div v-for="data in roleLsit" :key="'role-item-'+data.id" :class="{'el-tree-node ': true, 'is-current': (roleId == data.id)}">
          <div class="el-tree-node__content" @click="roleHandleClick(data)">
            <span class="is-leaf el-tree-node__expand-icon el-icon-caret-right"></span>
            <span class="customize-tree-node">
              <span>
                <i :class="data.icon"></i>
                <span class="customize-tree-node-label">{{ data.roleName }}</span>
              </span>
              <span class="more-icon">
                <el-popover
                  popper-class="hover-popver-list"
                  placement="right"
                  width="50"
                  v-model="data.moretool"
                  trigger="click">
                  <ul class="base-type-list">
                    <li v-if="$permissionMatch('upms_role_permision_menu')" @click.stop="authority(data)">
                      <span>菜单权限</span>
                    </li>
                    <li v-if="$permissionMatch('upms_role_edit')" @click.stop="editRole(data)">
                      <span>修改角色</span>
                    </li>
                    <li v-if="$permissionMatch('upms_role_delete')" @click.stop="() => delRow(data)">
                      <span>删除角色</span>
                    </li>
                    <li v-if="$permissionMatch('upms_role_addUser')" @click.stop="addUser(data)">
                      <span>添加人员</span>
                    </li>
                    <li v-if="$permissionMatch('upms_role_permision_data')" @click.stop="addDataAuthority(data)">
                      <span>数据权限</span>
                    </li>
                  </ul>
                  <i slot="reference" class="el-icon-more iconhover" @click.stop="moreRole(data)"></i>
                </el-popover>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加角色，修改角色 -->
    <role-form ref="roleForm" :list="tableData" @reFresh="reFresh"></role-form>
    <!-- 菜单权限 -->
    <menu-authority
      :menuAuthVisible="dialogVisible"
      :terminalList="terminalList"
      :currentTerminal="currentTerminal"
      :funOption="funOption"
      :menuAuthList="menuAuthList"
      :applicationList="applicationList"
      :permisionCheck="permisionCheck"
      :rowData="rowData"
      @handleClose="handleClose"
      @activeHandle="activeHandle"
    />
    <data-authority :dataAuthVisible="dataAuthVisible" :authList="authList" :isBindList="isBindList" :roleData="roleData" @dataAuthClose="dataAuthClose"/>
    <userSelector ref="userSelector" :selectable="true" @submit="addCheckUSer"></userSelector>
  </div>
</template>

<script>
import { tableOption } from '../../const/role/index.js'
import userSelector from '@/components/basic-assembly/userSelector'
import roleForm from './roleForm'
import {
  delRoleId, editUserRole,
  getAllDataAuth,
  getAllMenu, getMenuAuth,
  getRoleDataAuth,
  getRoleList,
  getUserByRoleId,
  removeUSerByRoleId
} from './api'
import PageHeader from '@/components/page-header/PageHeader.vue';
import DataAuthority from "./dataAuthority";
import MenuAuthority from "./menuAuthority";
export default {
  components: {MenuAuthority, DataAuthority, 'role-form': roleForm, PageHeader, userSelector },
  data () {
    // 这里存放数据
    return {
      tableLoading: false,
      applicationList: [],
      option: tableOption,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {},
      dialogVisible: false,
      dataAuthVisible: false,
      authList: [], // 数据权限列表
      menuAuthList: [], // 菜单权限列表
      isBindList: [],
      roleData: {},
      rowData: {}, // 行数据
      title: '',
      dataOption: [], // 数据权限
      funOption: [], // 功能权限
      dept: {}, // 部门权限对象
      deptIds: [],
      permisionCheck: [],
      pathArr: [],
      perLoading: false,
      defaultProps: {
        label: 'roleName'
      },
      roleLoading: false,
      roleLsit: [], // 所有角色列表
      lastRole: null,
      roleId: undefined,
      currentTerminal: '',
      terminalList: []
    }
  },
  // 方法集合
  methods: {
    addCheckUSer (list) {
      const arr = list.map(item => {
        return item.id
      })
      editUserRole(this.rowData.id, arr).then(res => {
        if(res.data.code == 0) {
          this.$message.success('添加成员成功')
          this.$refs.userSelector.closeDialog()
          this.getList()
        }
      })
    },
    addUser (data) {
      this.rowData = data
      if(data) {
        data.moretool = false
      }
      this.$refs.userSelector.openDialog()
    },
    // 数据权限管理
    async addDataAuthority(data) {
      this.roleData = JSON.parse(JSON.stringify(data))
      await getRoleDataAuth(this.roleData.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.isBindList = [...res.data.data]
        }
      })
      await getAllDataAuth().then(res => {
        if (res.data && res.data.code == 0) {
          const arr = [...res.data.data]
          arr.forEach(aItem => {
            if(aItem.value) {
              for(let ix in aItem.value) {
                let item = aItem.value[ix]
                item.check = false
                item.dataId = ''
                item.disabled = true
                item.remark = {
                  createByIds: [],
                  dataScopeType: '',
                  deptIds: [],
                  jobIds: [],
                  userId: ''
                }
                item.roleId = this.roleData.id
                for(let index in this.isBindList) {
                  if (this.isBindList[index].dataId === item.id) {
                    item.check = true
                    item.disabled = false
                    item.dataId = this.isBindList[index].dataId
                    item.remark = this.isBindList[index].remark
                    item.roleId = this.isBindList[index].roleId
                  }
                }
              }
            }
          })
          this.authList = [...arr]
          this.dataAuthVisible = true
        }
      })
    },
    // 关闭数据权限管理弹窗
    dataAuthClose() {
      this.dataAuthVisible = false
    },
    getList (page) {
      this.tableLoading=true
      let obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        roleId: this.roleId
      }
      getUserByRoleId(obj).then(({ data }) => {
        this.tableLoading=false
        if (data.code===0) {
          this.tableData=data.data.records
          this.page.total = data.data.total
          this.page.currentPage = data.data.current
        }
      })
    },
    roleHandleClick (data, node, dom) {
      this.page.currentPage = 1
      if(this.roleId == data.id) {
        this.roleId = ""
        this.$forceUpdate()
      }else{
        this.roleId = data.id
      }
      this.getList()
    },
    // 删除
    delRow (row) {
      this.$confirm('将删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleId(row.id).then(({ data }) => {
          if (data.code===0) {
            this.$message.success("删除成功")
            this.getRoleListHandle()
            this.getList()
          }
        })
      }).catch(() => {});
    },
    // 刷新
    reFresh () {
      this.getRoleListHandle()
    },
    // 新增
    addRole () {
      this.$refs.roleForm.init('add', null)
    },
    // 修改
    editRole (row) {
      // console.log(row)
      this.$refs.roleForm.init('edit', row)
    },
    // 权限
    authority (row) {
      // this.$refs.authority.init('edit', row)
      this.rowData=row
      this.title='权限分配'
      getMenuAuth(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.menuAuthList = [...res.data.data]
        }
      })
      getAllMenu().then(res => {
        if (res.data && res.data.code==0) {
          this.applicationList = [...res.data.data]
          this.funOption = this.applicationList[0].children
          this.funOption.forEach(item => {
            item.checked = false
          })
          this.terminalList = [...res.data.data]
          this.currentTerminal = this.terminalList[0].id
          this.dialogVisible=true
        }
      })
    },
    // 权限
    handleClose () {
      this.permisionCheck = []
      this.dialogVisible=false
    },
    // 获取角色列表
    getRoleListHandle () {
      this.roleLoading = true
      getRoleList("userRole").then(res => {
        if (res.data.code==0) {
          this.roleLsit=res.data.data
          this.roleLoading = false
        }else{
          this.roleLoading = false
        }
      }).catch(e => {
        this.roleLoading = false
      })
    },
    // 角色更多
    moreRole (item) {
      if(this.lastRole) {
        this.lastRole.moretool = false
      }
      this.lastRole = item
    },
    // 移除角色下的用户
    removeUser (row) {
      this.$confirm('移出用户后权限将发生变化, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUSerByRoleId(this.roleId, row.userId).then(res => {
          this.$message.success("移出成功")
          this.getList()
        })
      }).catch(() => {});
    },
    // 切换终端
    activeHandle (item) {
      this.currentTerminal = item.id
      const index = this.applicationList.findIndex(temp => {
        return temp.id === item.id
      })
      this.funOption = this.applicationList[index].children
    },
  },
  created () {
    this.getRoleListHandle()
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.treebox {
  height: calc(100% - 178px);
  overflow: hidden;
  overflow-y: auto;
  background: #fff;
  padding: 0 20px;
  h3 {
    font-size: 16px;
    margin: 10px 0;
    padding: 0;
  }
}
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
.application-list{
  padding: 20px;
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  .el-button{
    border-color: transparent;
    background: #F3F3F3;
    color: #333333;
    margin-left: 20px;
  }
  .el-button:nth-of-type(1){
    margin-left: 0;
  }
  .el-button--primary{
    background: #3471FF;
    color: #fff;
  }
  .divider-line{
    position: absolute;
    width: calc(100% - 40px);
    border-bottom: 1px solid #DCDFE6;
    bottom: 0;
    left: 20px;
    margin: 0;
  }
}
</style>
<style lang="scss">
.transverseTreeDialog {
  .el-dialog.is-fullscreen {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow: hidden;
  }
  .el-dialog.is-fullscreen::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog__body{
    padding: 0;
    background: #f0f2f5;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .el-card {
      height: 100%;
      .el-card__body{
        background: #f0f2f5;
        padding: 0!important;
        height: 100%;
        .pageheader-top{
          padding: 10px;
          background: #fff;
          border-radius: 5px;
        }
      }
    }
  }
  .treebox:hover::-webkit-scrollbar{
    width: 8px;
  }
}
.transverseTreeDialog{
  .transverse-tree-node {
    .el-tree-node{
      width: 100%;
      .el-tree-node__children{
        .el-tree-node{
          width: 100%;
          .el-tree-node__children{
            // display: flex;
            flex-wrap: wrap;
            .el-tree-node{
              width: auto; // 100%;
              .el-tree-node{
                width: auto;
              }
            }
          }
        }
      }
    }
  }
}
.role-list-box{
  .role-tree {
    position: absolute;
    //top: 134px;
    top: 94px;
    left: 0;
    width: 250px;
    //height: calc(100% - 134px);
    height: calc(100% - 94px);
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
      .more-icon{
        display: none;
      }
    }
    .customize-tree-node:hover{
      .more-icon{
        display: block;
      }
    }
    .el-tree{
      min-height: calc(100% - 19px);
    }
    .el-tree-node{
      cursor: pointer;
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
  .role-tree::-webkit-scrollbar{
    display: none;
  }
  .el-table{
    width: calc(100% - 250px);
    margin-left: 250px;
  }
}
</style>
