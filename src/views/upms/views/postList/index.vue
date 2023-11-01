<template>
  <div class="post-manage-box">
    <div class="post-manage">
      <jvs-table
        pageheadertitle='岗位管理'
        :index="false"
        :page="page"
        :option="option"
        :data="tableData"
        :loading="tableLoading"
        @on-load="getList"
        @search-change="searchChange"
      >
        <template slot="menuLeft">
          <jvs-button type="primary" size="mini" @click="dialogVisibleShow('add', null, null, 'post')" permisionFlag="upms_post_add">添加岗位</jvs-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <jvs-button type="text" size="mini" v-if="jobId !== ''" permisionFlag="upms_post_remove" @click="delUSerPost(scope.row)"><span style="color: #F56C6C;">移除</span></jvs-button>
        </template>
        <template slot="roleName" slot-scope="scope">
          <el-tag v-for="ritem in scope.row.roleName" :key="ritem" style="margin-right:5px;">{{ritem}}</el-tag>
        </template>
        <template slot="jobId" slot-scope="scope">
          <span>{{getLabelOfPost(scope.row.jobId)}}</span>
        </template>
      </jvs-table>
      <div class="treeBox post-treeBox">
        <div :class="{'treeBox-title': true, 'treeBox-title-check': !jobId}" @click="queryAllHandle">全部</div>
        <el-tree
          ref="postTree"
          :data="postData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :loading="postLoading"
          :props="defaultPostProps"
          @node-click="postHandleClick"
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
                  <li v-if="$permissionMatch('upms_post_addUser')" @click.stop="addUser(data)">
                    <!-- <i class="el-icon-delete iconhover"></i> -->
                    <span>添加成员</span>
                  </li>
                  <li v-if="$permissionMatch('upms_post_edit') && (!(data.children && data.children.length > 0))" @click.stop="() => dialogVisibleShow('edit', node, data, 'post')">
                    <!-- <i class="el-icon-setting iconhover"></i> -->
                    <span>编辑</span>
                  </li>
                  <li v-if="$permissionMatch('upms_post_delete') && (!(data.children && data.children.length > 0))" @click.stop="() => remove(data)">
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
        <jvs-form v-if="formType == 'post'" :option="postFormOption" :formData="postForm" @submit="postSubmitHandle" @cancalClick="handleClose">
          <template slot="datapermisionForm">
            <span>默认只查询同级部门数据</span>
          </template>
          <template slot="dataScopeTypeForm">
            <div class="permision-radio" style="display: flex; align-items: center;height:auto;min-height:28px;flex-wrap: wrap;padding-bottom: 10px;">
              <el-radio-group v-model="postForm.dataScopeType" size="mini" style="width: 100%;">
                <el-radio label="all_dept">所有部门</el-radio>
                <el-radio label="curr_dept">当前部门</el-radio>
                <el-radio label="curr_dept_tree">当前部门及以下</el-radio>
                <el-radio label="all_job">所有岗位</el-radio>
                <el-radio label="curr_job">当前岗位</el-radio>
                <el-radio label="self">用户自己创建数据</el-radio>
                <el-radio label="customize">自定义权限</el-radio>
              </el-radio-group>
              <div
                class="tree-auth"
                v-if="postForm.dataScopeType === 'customize'"
                style="margin-top: 10px;display:flex;"
              >
                <el-cascader
                  v-model="deptIds"
                  placeholder="请选择部门"
                  size="mini"
                  :options="treedata"
                  clearable
                  :show-all-levels="false"
                  :props="{
                    expandTrigger: 'hover',
                    checkStrictly: true,
                    multiple: true,
                    children: 'children',
                    label: 'name',
                    value: 'id'
                  }"
                  :collapse-tags="true"
                >
                </el-cascader>
                <el-select v-model="jobIds" placeholder="请选择岗位" size="mini" multiple :collapse-tags="true" style="margin-left:10px;">
                  <el-option
                    v-for="item in postData"
                    :key="'customize-select-option'+item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </template>
          <template slot="customScopeForm" v-if="false">
            <el-cascader
              style="width:100%;"
              v-model="customizeList"
              size="mini"
              :options="cascaderPptions"
              clearable
              :show-all-levels="false"
              :props="{
                expandTrigger: 'hover',
                multiple: true,
                children: 'list',
              }"
            >
            </el-cascader>
          </template>
          <template slot="deptIdForm">
            <el-cascader
              style="width:100%;"
              v-model="postForm.deptId"
              size="mini"
              :options="treedata"
              clearable
              :disabled="title == '添加岗位' ? false : true"
              :show-all-levels="false"
              :props="{
                expandTrigger: 'hover',
                checkStrictly: true,
                multiple: false,
                children: 'children',
                label: 'name',
                value: 'id'
              }"
            >
            </el-cascader>
          </template>
        </jvs-form>
      </div>
    </el-dialog>
    <userSelector
      ref="userSelector"
      :userEnable="true"
      :currentActiveName="'user'"
      :selectable="true"
      :dialogTitle="'人员选择'"
      @submit="addCheckUSer"
    />
  </div>
</template>
<script>
import { tableOption, userpostOption } from './option'
import { getPostList, addPost, editPost, delPost, getUserByJobId, editUserJob, removeUserByJob } from './api'
import {getDeptList } from '../department/api'
import dataPermision from '../dataPermision/index'
import userSelector from '@/components/basic-assembly/userSelector'
export default {
  name: 'post-manage',
  components: {dataPermision, userSelector},
  data () {
    return {
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: tableOption,
      tableData: [],
      tableLoading: false,
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
      jobIds: [],
      postData: [], // 岗位列表
      jobId: '', // 当前选中岗位id
      postLoading: false,
      defaultPostProps: {
        children: 'children',
        label: 'name',
        sort: 'sort'
      },
      postForm: {},
      postFormOption: {
        emptyBtn: false,
        submitBtnText: '确定',
        submitLoading: false,
        formAlign: 'top',
        column: [
          {
            label: '岗位名称',
            prop: 'name',
            rules: [
              { required: true, message: '名称不能为空' }
            ]
          },
          {
            label: '数据权限', // 部门数据权限
            prop: 'dataScopeType',
            formSlot: true,
            display: false
          }
        ]
      }
    }
  },
  created () {
    // this.getTreeDept() // 岗位权限，待定！！！！！！！！！！！！！！！
    this.getPostTree()
    this.formOption.column.filter(item => { item.span=24 })
    // this.option.delBtn = this.$permissionMatch("upms_mgr_shan_chu_yong_hu")
  },
  methods: {
    // 获取数据
    getList (page) {
      this.tableLoading = true
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage,
        jobId: this.jobId
      }
      getUserByJobId(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
        }
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    // 搜素回调
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 岗位更多
    morePost (item) {
      if(this.lastPost) {
        this.lastPost.moretool = false
      }
      this.lastPost = item
    },
    getTreeDept () {
      this.treeLoading = true;
      getDeptList().then(res => {
        if(res.data.code == 0) {
          this.treedata = this.getTree(res.data.data, 1)
          this.treeLoading = false;
        }
      })
    },
    getPostTree () {
      this.postLoading = true
      getPostList().then(res => { // this.selectOneId
        if(res.data.code == 0) {
          this.postData = res.data.data
          this.postLoading = false;
        }
      })
    },
    // 岗位选中
    postHandleClick (data, node, dom) {
      this.selectOneData = data
      if(this.jobId == data.id) {
        // this.jobId = ""
        // this.$refs.postTree.setCurrentKey(null)
        // this.$forceUpdate()
      }else{
        this.jobId = data.id
      }
      this.getList()
    },
    // 弹窗显示
    dialogVisibleShow (method, node, data, type) {
      this.method = method
      this.formType = type
      if(type == 'post') {
        if(data) {
          data.moretool = false
        }
        if (this.$refs.Form) {
          this.$refs.Form.resetFields();
        }
        this.postForm = {}
        if (method == 'add') {
          this.title = "添加岗位"
          this.postForm = {
            dataScopeType: "all_dept"
          }
        }else{
          this.title = '修改岗位'
          let obj = JSON.parse(JSON.stringify(data))
          if(obj.customScope) {
            if(obj.customScope.startsWith('{')) {
              let temp = JSON.parse(obj.customScope)
              this.deptIds = temp.deptIds
              this.jobIds = temp.jobIds
            }
          }
          this.postForm = obj
        }
      }
      if(type == 'user'){
        this.title = '修改用户岗位'
        this.rowData = JSON.parse(JSON.stringify(data))
      }
      this.dialogVisible = true
    },
    remove (data) {
      this.$confirm('将删除此岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPost(data.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success({
              showClose: true,
              message: '删除岗位成功',
            })
            this.getPostTree()
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
      this.jobIds = []
    },
    // 获取路径结果
    getDeptPath (val, list) {
      for(let i in list) {
        if(list[i].id == val) {
          this.pathArr = list[i].path
        }else{
          if(list[i].children && list[i].children.length > 0) {
            this.getDeptPath(val, list[i].children)
          }
        }
      }
    },
    // 递归树清掉空的children
    getTree (tree = [], level) {
      let arr = [];
      if (tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.name = item.name;
          obj.id = item.id;
          obj.sort = item.sort
          obj.parentId = item.parentId
          obj.leaderId = item.leaderId
          obj.level = level
          if (item.children && item.children.length > 0) {
            obj.children = this.getTree(item.children, level+1);
          }
          arr.push(obj);
        });
      }
      return arr
    },
    // 提交 岗位
    postSubmitHandle (form) {
      let obj = JSON.parse(JSON.stringify(form))
      let custObj = {deptIds: this.deptIds, jobIds: this.jobIds}
      obj.customScope = JSON.stringify(custObj)
      this.postFormOption.submitLoading = true
      if(this.method == 'add') {
        addPost(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('添加岗位成功')
            this.postFormOption.submitLoading = false
            this.handleClose()
            this.getPostTree()
          }
        }).catch(e => {
          this.postFormOption.submitLoading = false
        })
      }
      if(this.method == 'edit') {
        editPost(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改岗位成功')
            this.postFormOption.submitLoading = false
            this.handleClose()
            this.getPostTree()
          }
        }).catch(e => {
          this.postFormOption.submitLoading = false
        })
      }
    },
    delUSerPost (row) {
      this.$confirm('将移出该用户岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        removeUserByJob(row.userId).then(res => {
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
        this.jobId = data.id
      }
      this.$refs.userSelector.openDialog()
    },
    addCheckUSer (list) {
      editUserJob(this.jobId, list).then(res => {
        if(res.data.code == 0) {
          this.$message.success('添加成员成功')
          this.$refs.userSelector.closeDialog()
          this.getList()
        }
      })
    },
    queryAllHandle () {
      this.jobId = ""
      this.$refs.postTree.setCurrentKey(null)
      this.$forceUpdate()
      this.getList()
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
.post-manage-box {
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
    //top: 94px;
    //top: 132px;
    top: 0;
    left: 0;
    width: 250px;
    //height: calc(100% - 94px);
    //height: calc(100% - 132px);
    height: calc(100% - 10px);
    overflow: hidden;
    overflow-y: auto;
    padding-left: 20px;
    //border-right: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    .treeBox-title{
      font-size: 14px;
      padding-left: 24px;
      display: block;
      background: #fff;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
    }
    .treeBox-title:hover{
      background: #EFF2F7;
    }
    .treeBox-title-check{
      background: #F5F7FA;
    }
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
      min-height: calc(100% - 35px);
    }
    .el-tree-node{
      .el-tree-node__content{
        padding-left: 6px!important;
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
  .jvs-table-top{
    width: calc(100% - 250px);
    margin-left: 250px;
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
