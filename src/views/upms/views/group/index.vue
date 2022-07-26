<template>
  <div class="group-manage-box">
    <div class="group-manage">
      <jvs-table
        pageheadertitle='群组管理'
        :index="false"
        :page="page"
        :option="option"
        :data="tableData"
        @on-load="getList"
      >
        <template slot="menuLeft">
          <jvs-button type="primary" size="mini" @click="dialogVisibleShow('add', null, null, 'post')" permisionFlag="upms_group_add">添加群组</jvs-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <jvs-button type="text" size="mini" permisionFlag="upms_group_remove" @click="delUSerGroup(scope.row)">移出</jvs-button>
        </template>
        <template slot="roleName" slot-scope="scope">
          <el-tag v-for="ritem in scope.row.roleName" :key="ritem" style="margin-right:5px;">{{ritem}}</el-tag>
        </template>
<!--        <template slot="jobId" slot-scope="scope">-->
<!--          <span>{{getLabelOfPost(scope.row.jobId)}}</span>-->
<!--        </template>-->
      </jvs-table>
      <div class="treeBox post-treeBox">
        <el-tree
          ref="groupTree"
          :data="postData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :loading="groupLoading"
          :props="defaultGroupProps"
          @node-click="groupHandleClick"
        >
          <span slot-scope="{ node, data }" class="customize-tree-node">
            <span>
              <i :class="node.icon"></i>
              <span class="customize-tree-node-label">{{ node.label }}</span>
            </span>
            <span class="more-icon">
              <el-popover
                popper-class="hover-popver-list"
                placement="right"
                width="50"
                v-model="data.moretool"
                trigger="click">
                <ul class="base-type-list">
                  <li v-if="$permissionMatch('upms_group_addUser')" @click.stop="addUser(data)">
                    <!-- <i class="el-icon-delete iconhover"></i> -->
                    <span>添加成员</span>
                  </li>
                  <li v-if="$permissionMatch('upms_group_edit') && (!(data.childList && data.childList.length > 0))" @click.stop="() => dialogVisibleShow('edit', node, data, 'post')">
                    <!-- <i class="el-icon-setting iconhover"></i> -->
                    <span>编辑</span>
                  </li>
                  <li v-if="$permissionMatch('upms_group_delete') && (!(data.childList && data.childList.length > 0))" @click.stop="() => remove(data)">
                    <!-- <i class="el-icon-delete iconhover"></i> -->
                    <span>删除</span>
                  </li>
                </ul>
                <i slot="reference" class="el-icon-more iconhover" @click.stop="morePost(data)"></i>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      :title="title"
      width="680px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div v-if="dialogVisible">
        <jvs-form :option="groupFormOption" :formData="postForm" @submit="groupSubmitHandle" @cancalClick="handleClose">
        </jvs-form>
      </div>
    </el-dialog>
    <userSelector ref="userSelector" :selectable="true" @submit="addCheckUSer"></userSelector>
  </div>
</template>
<script>
import { tableOption } from './option'
import {getGroupList, addGroup, editGroup, deleteGroup, getUserByGroupId, editUserGroup, removeUserByGroup} from './api'
import dataPermision from '../dataPermision/index'
import userSelector from '@/components/basic-assembly/userSelector'
export default {
  name: 'group-manage',
  components: {dataPermision, userSelector},
  data () {
    return {
      groupId: undefined, // 群组id
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: tableOption,
      tableData: [],
      rowData: {},
      title: '新增',
      method: '',
      dialogVisible: false,
      //部门表单添加、修改
      Form: {
        name: '',
        parentId: null,
        sort: 0
      },
      formOption: {
        cancal: false,
        column: JSON.parse(JSON.stringify(tableOption.column))
      },
      formType: '',
      treedata: [],
      selectOneData: null,
      lastPost: null,
      deptIds: [],
      groupIds: [],
      postData: [], // 群组列表
      groupLoading: false,
      defaultGroupProps: {
        children: 'childList',
        label: 'name',
        sort: 'sort'
      },
      postForm: {},
      groupFormOption: {
        emptyBtn: false,
        submitBtnText: '确定',
        submitLoading: false,
        formAlign: 'top',
        column: [
          {
            label: '群组名称',
            prop: 'name',
            rules: [
              { required: true, message: '名称不能为空' }
            ]
          }
        ]
      },
    }
  },
  created () {
    this.getGroupTree()
    this.formOption.column.filter(item => { item.span=24 })
    // this.option.delBtn = this.$permissionMatch("upms_mgr_shan_chu_yong_hu")
  },
  methods: {
    // 获取数据
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage,
        groupId: this.groupId
      }
      getUserByGroupId(obj).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
        }
      })
    },
    // 群组更多
    morePost (item) {
      if(this.lastPost) {
        this.lastPost.moretool = false
      }
      this.lastPost = item
    },
    getGroupTree () {
      this.groupLoading = true
      getGroupList().then(res => { // this.selectOneId
        if(res.data && res.data.code == 0) {
          this.postData = res.data.data || []
          this.groupLoading = false;
        }
      })
    },
    // 群组选中
    groupHandleClick (data, node, dom) {
      this.selectOneData = data
      if(this.groupId == data.id) {
        this.groupId = ""
        this.$refs.groupTree.setCurrentKey(null)
        this.$forceUpdate()
      }else{
        this.groupId = data.id
      }
      this.getList()
    },
    // 弹窗显示
    dialogVisibleShow (method, node, data, type) {
      this.method = method
      this.formType = type
      if(data) {
        data.moretool = false
      }
      if (this.$refs.Form) {
        this.$refs.Form.resetFields();
      }
      this.postForm = {}
      if (method == 'add') {
        this.title = "添加群组"
      }else{
        this.title = '修改群组'
        let obj = JSON.parse(JSON.stringify(data))
        if(obj.customScope) {
          if(obj.customScope.startsWith('{')) {
            let temp = JSON.parse(obj.customScope)
            this.deptIds = temp.deptIds
            this.groupIds = temp.jobIds
          }
        }
        this.postForm = obj
      }
      this.dialogVisible = true
    },
    remove (data) {
      this.$confirm('将删除此群组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(data.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success({
              showClose: true,
              message: '删除群组成功',
            })
            this.getGroupTree()
          }
        })
      }).catch(() => {
      });
    },
    // 弹窗关闭的方法
    handleClose () {
      this.dialogVisible = false
      this.deptIds = []
      this.customizeList = []
      this.groupIds = []
    },
    // 提交 群组
    groupSubmitHandle (form) {
      let obj = JSON.parse(JSON.stringify(form))
      // let custObj = {deptIds: this.deptIds, jobIds: this.groupIds}
      // obj.customScope = JSON.stringify(custObj)
      this.groupFormOption.submitLoading = true
      if(this.method == 'add') {
        addGroup(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('添加群组成功')
            this.groupFormOption.submitLoading = false
            this.handleClose()
            this.getGroupTree()
          }
        }).catch(e => {
          this.groupFormOption.submitLoading = false
        })
      }
      if(this.method == 'edit') {
        editGroup(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改群组成功')
            this.groupFormOption.submitLoading = false
            this.handleClose()
            this.getGroupTree()
          }
        }).catch(e => {
          this.groupFormOption.submitLoading = false
        })
      }
    },
    delUSerGroup (row) {
      this.$confirm('将移出该用户群组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        // return false
        removeUserByGroup(row.id, this.groupId).then(res => {
          if(res.data.code == 0) {
            this.$message.success('移出成功')
            this.getList()
          }
        })
      }).catch(() => {
      });
    },
    addUser (data) {
      if(data) {
        data.moretool = false
        this.groupId = data.id
      }
      this.$refs.userSelector.openDialog()
    },
    addCheckUSer (list) {
      const arr = list.map(item => {
        return item.id
      })
      editUserGroup(this.groupId, arr).then(res => {
        if(res.data.code == 0) {
          this.$message.success('添加成员成功')
          this.$refs.userSelector.closeDialog()
          this.getList()
        }
      })
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
.group-manage-box {
  position: relative;
  height: 100%;
  .error-tip-item{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .error-tip {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
    }
  }
  .treeBox {
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
.error-tip-item{
  .err-item{
    .el-input__inner{
      border-color: #f56c6c;
    }
  }
}
.permision-radio{
  .el-radio-group{
    display: flex;
    flex-wrap: wrap;
    .el-radio{
      width: 25%;
      margin-right: 0;
      margin-bottom: 10px;
      .el-radio__input{
        .el-radio__inner{
          border-radius: 0;
        }
        .el-radio__inner::after{
          box-sizing: content-box;
          content: "";
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 7px;
          left: 4px;
          position: absolute;
          top: 1px;
          transform: rotate(45deg) scaleY(0);
          width: 3px;
          transition: transform .15s ease-in .05s;
          transform-origin: center;
          border-radius: 0;
          background: none;
        }
      }
      .el-radio__input.is-checked{
        .el-radio__inner::after{
          transform: rotate(45deg) scaleY(1);
        }
      }
    }
  }
}
</style>
