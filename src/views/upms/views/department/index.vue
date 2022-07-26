<!-- 部门管理 -->
<template>
  <div style="height: 100%;">
    <div class="department-list-manage">
      <jvs-table
        pageheadertitle='组织机构'
        refs="multipleTable"
        :data="tableData"
        tooltipEffect="dark"
        style="width: 100%"
        :loading="tableLoading"
        :option="option"
        :page="page"
        :defalutFormData="queryParams"
        @on-load="getList"
        @size-change="sizeChange"
        @sort-change="handleSort"
        @current-change="currentChange"
        @search-change="searchChange"
      >
        <template slot="menuLeft">
          <jvs-button type="primary" size="mini" @click="dialogVisibleShow('add', null, null, 'dept')" permisionFlag="upms_dept_add">添加部门</jvs-button>
<!--          <jvs-button type="primary" size="mini" @click="invitationHandle" permisionFlag="upms_dept_invite">邀请成员</jvs-button>-->
          <el-upload
            v-if="false && $permissionMatch('')"
            ref="uploadBtn"
            style="display: inline-block;margin: 0 10px;"
            action="/mgr/jvs-auth/usermanager/import/preview"
            accept=".xls,.xlsx"
            :limit="1"
            :on-change="handleFileChange"
            :http-request="httpHandle"
            :on-success="importView"
            :on-error="errHandle"
            :show-file-list="false"
            :file-list="fileList"
            :headers="headers"
          >
            <jvs-button type="primary" size="mini">导入用户</jvs-button>
          </el-upload>
          <jvs-button v-if="false" type="primary" size="mini" @click="downloadModel" permisionFlag="">导出模板</jvs-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <jvs-button type="text" size="mini" @click="editItem(scope.row, 'edit')" permisionFlag="upms_dept_editUser">编辑</jvs-button>
          <jvs-button type="text" size="mini" @click="editItem(scope.row, 'view')" permisionFlag="upms_dept_viewUser">详情</jvs-button>
          <jvs-button type="text" size="mini" v-if="false" @click="setPermissin(scope.row)" permisionFlag="upms_dept_permision_data">数据权限</jvs-button>
          <jvs-button size="mini" type='text' v-if="!scope.row.cancelFlag" permisionFlag="upms_dept_disableUser" @click="disableHandle(scope.row)">禁用</jvs-button>
          <jvs-button size="mini" type='text' v-else permisionFlag="upms_dept_enableUser" @click="disableHandle(scope.row)">启用</jvs-button>
        </template>
        <template slot="headImg" slot-scope="scope">
          <img v-if="scope.row.headImg" :src="scope.row.headImg" alt="" style="display: inline-block;width: 40px;height: 40px;border-radius: 50%;overflow: hidden;">
        </template>
        <template slot="roleName" slot-scope="scope">
          {{ scope.row.roleName && scope.row.roleName.join(",") }}
        </template>
      </jvs-table>
      <div class="treeBox dept-treeBox">
        <el-tree
          ref="deptTree"
          :data="treedata"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :loading="treeLoading"
          :props="defaultProps"
        >
          <span
            class="customize-tree-node"
            slot-scope="{ node, data }"
          >
            <span>
              <i :class="node.icon"></i>
              <span :class="'customize-tree-node-label customize-tree-node-label'+node.level" :style="'width:'+((193 - (18 * node.level)) > 0 ? (193 - (18 * node.level)) : 0) +'px;'">{{ node.label }}</span>
            </span>
            <span class="more-icon">
              <el-popover
                popper-class="hover-popver-list"
                placement="right"
                width="50"
                v-model="data.moretool"
                trigger="click">
                <ul class="base-type-list">
                  <li v-if="$permissionMatch('upms_dept_edit')" @click.stop="() => dialogVisibleShow('edit', node, data, 'dept')">
                    <!-- <i class="el-icon-setting iconhover"></i> -->
                    <span>修改部门</span>
                  </li>
                  <li v-if="$permissionMatch('upms_dept_add')" @click.stop="() => dialogVisibleShow('addchild', node, data, 'dept')">
                    <!-- <i class="el-icon-circle-plus-outline iconhover"></i> -->
                    <span>添加子部门</span>
                  </li>
                  <li v-if="$permissionMatch('upms_dept_addUser')" @click.stop="() => editItem(null, 'add', data)">
                    <!-- <i class="el-icon-circle-plus-outline iconhover"></i> -->
                    <span>添加成员</span>
                  </li>
                  <li v-if="$permissionMatch('upms_dept_delete')" @click.stop="() => remove( node ,data, '机构')">
                    <!-- <i class="el-icon-delete iconhover"></i> -->
                    <span>删除</span>
                  </li>
                </ul>
                <i slot="reference" class="el-icon-more iconhover" @click.stop="moreDept(data)"></i>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 部门 -->
    <el-dialog
      :title="title"
      width="75%"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div v-if="dialogVisible">
        <div v-if="formType == 'dept'">
          <jvs-form refs="Form" :option="deptOption" :formData="Form" @submit="doSubmit" @cancalClick="handleClose">
            <template slot="parentIdForm">
              <el-cascader
                style="width:100%;"
                v-model="Form.parentId"
                size="mini"
                :options="treedata"
                clearable
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
      </div>
    </el-dialog>
    <!-- 用户信息 -->
    <el-dialog
      :title="title"
      :visible.sync="userVisible"
      :before-close="userClose"
      class="form-fullscreen-dialog"
    >
      <jvs-form
        style="padding: 0 60px"
        v-if="userVisible"
        refs="userForm"
        :option="formOption"
        :formData="userForm"
        :defalutFormData="userForm"
        @submit="submitHandle"
      >
        <template slot="accountNameForm">
          <div class="jvs-form-item" style="display:flex;align-items:center;">
            <el-input v-model="userForm.accountName" @blur="noRepeatName(userForm.accountName)"></el-input>
            <span class="el-form-item__error" v-if="disSubmit">用户名重复</span>
          </div>
        </template>
        <template slot="roleIdsForm">
          <div class="jvs-form-item" style="display:flex;align-items:center;">
            <el-select v-model="userForm.roleIds" placeholder="角色" multiple size="mini" style="width: 100%;">
              <el-option
                v-for="sitem in roleLsit"
                :key="sitem.id"
                :label="sitem.roleName"
                :value="sitem.id"
              >
                <span style="float: left">{{ sitem.roleName }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ sitem.value }}</span> -->
              </el-option>
            </el-select>
          </div>
        </template>
        <template slot="deptIdForm">
          <div class="jvs-form-item" style="display:flex;align-items:center;">
            <el-cascader
              :disabled="title == '新增' ? true : false"
              style="width:100%;"
              v-model="userForm.deptId"
              size="mini"
              :options="deptList"
              :props="{ checkStrictly: true, expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
              clearable
              :show-all-levels="false"
            ></el-cascader>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 导入用户 -->
    <el-dialog
      v-if="importVisible"
      width="75%"
      title="导入用户"
      :fullscreen="(fileList && fileList.length > 5) ? true : false"
      :class="{'import-user-dialog': true, 'form-fullscreen-dialog user-import-fullscreen-dialog': (fileList && fileList.length > 5)}"
      :visible.sync="importVisible"
      :before-close="cancelHandle">
      <jvs-table :option="importOption" :data="fileList">
        <template slot="menu" slot-scope="scope">
          <jvs-button size="mini" type="text" @click="delImportRow(scope.row, scope.index)">删除</jvs-button>
        </template>
        <!-- 用户真名 -->
        <template slot="realName" slot-scope="scope">
          <div class="error-tip-item">
            <el-input v-model="scope.row.realName" size="mini" :class="{'err-item': repeatHandle('realName', scope.row.realName)}"></el-input>
          </div>
        </template>
        <!-- 昵称 -->
        <template slot="nickName" slot-scope="scope">
          <el-input v-model="scope.row.nickName" size="mini" :class="{'err-item': repeatHandle('nickName', scope.row.nickName)}"></el-input>
        </template>
        <template slot="accountName" slot-scope="scope">
          <div class="error-tip-item">
            <el-input v-model="scope.row.accountName" size="mini" :class="{'err-item': repeatHandle('accountName', scope.row.accountName)}"></el-input>
          </div>
        </template>
        <!-- 性别 -->
        <template slot="sex" slot-scope="scope">
          <el-radio-group v-model="scope.row.sex">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
          </el-radio-group>
        </template>
        <!-- 邮箱 -->
        <template slot="email" slot-scope="scope">
          <el-input v-model="scope.row.email" size="mini" :class="{'err-item': repeatHandle('email', scope.row.email)}"></el-input>
        </template>
        <!-- 电话 -->
        <template slot="phone" slot-scope="scope">
          <div class="error-tip-item">
            <el-input v-model="scope.row.phone" size="mini" :class="{'err-item': repeatHandle('phone', scope.row.phone)}"></el-input>
          </div>
        </template>
        <template slot="roleId" slot-scope="scope">
          <el-select v-model="scope.row.roleId" placeholder="角色" multiple size="mini" style="width: 100%;" collapse-tags>
            <el-option
              v-for="sitem in roleLsit"
              :key="sitem.id"
              :label="sitem.roleName"
              :value="sitem.id"
            >
              <span style="float: left">{{ sitem.roleName }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ sitem.value }}</span> -->
            </el-option>
          </el-select>
        </template>
        <template slot="deptId" slot-scope="scope">
          <el-cascader
            v-model="scope.row.deptId"
            size="mini"
            :options="deptList"
            :props="{ checkStrictly: true, expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
            clearable
            :show-all-levels="false"
          ></el-cascader>
        </template>
        <template slot="jobId" slot-scope="scope">
           <el-select v-model="scope.row.jobId" placeholder="职位" size="mini" style="width: 100%;">
            <el-option
              v-for="sitem in allPost"
              :key="sitem.id"
              :label="sitem.name"
              :value="sitem.id"
            >
              <span style="float: left">{{ sitem.name }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ sitem.value }}</span> -->
            </el-option>
          </el-select>
        </template>
        <template slot="status" slot-scope="scope">
          <el-switch size="mini" v-model="scope.row.status"></el-switch>
        </template>
        <template slot="employeeNo" slot-scope="scope">
          <el-input size="mini" v-model="scope.row.employeeNo"></el-input>
        </template>
        <template slot="birthday" slot-scope="scope">
          <el-date-picker
            size="mini"
            v-model="scope.row.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
        <template slot="hireDate" slot-scope="scope">
          <el-date-picker
            size="mini"
            v-model="scope.row.hireDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </jvs-table>
      <el-row style="display:flex;align-items:center;justify-content:center;margin-top:20px;">
        <jvs-button size="mini" type="primary" :disabled="fileList.length == 0" :loading="importLoading" @click="importHandle">导入</jvs-button>
        <jvs-button size="mini" @click="cancelHandle">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 邀请 -->
    <invitation ref="invitation"></invitation>
  </div>
</template>

<script>
import { getDeptList, getDeptUserList, AddDept, addUser, editUser, enableDisUser, editDept, deleteDept } from './api'
import { getRoleList } from '../role/api'
import { getPostList } from '../postList/api'
import { tableOption, importOptionData } from './option'
import {sendMyRequire} from '@/api/newDesign'
import { importUser } from '../../api/user.js'

import invitation from './invitation'
export default {
  components: {invitation},
  data () {
    // 这里存放数据
    return {
      orders: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        sort: 'sort'
      },
      option: tableOption,
      queryParams: {},
      tableLoading: false,
      treeLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableData: [],
      selectOneId: '',
      selectOneData: null,
      dialogVisible: false,
      title: '',
      method: '',
      //部门表单添加、修改
      Form: {
        name: '',
        parentId: null,
        sort: 0
      },
      rules: {
        name: [{ required: true, message: '部门不能为空' }],
        parentId: [{ required: false, message: '部门名称不能为空' }],
        sort: [{ required: true, message: '排序不能为空' }]
      },
      treedata: [],
      normalizer (node) {
        return {
          id: node.id,
          label: node.name,
          sort: node.sort,
          children: node.children,
        }
      },
      currentList: [], // 当前同级的部门列表
      lastName: '', // 未修改前的名字
      disSubmit: false, // 是否禁止提交
      formType: 'dept',
      deptIds: [],
      cascaderPptions: [],
      customizeList: [],
      deptOption: {
        emptyBtn: false,
        submitBtnText: '确定',
        labelWidth: '100px',
        submitLoading: false,
        formAlign: 'top',
        column: [
          {
            label: '上级部门',
            prop: 'parentId',
            formSlot: true,
            display: false,
            rules: [{ required: false, message: '部门名称不能为空' }]
          },
          {
            label: '部门名称',
            prop: 'name',
            rules: [{ required: true, message: '部门不能为空' }]
          },
          {
            label: '排序',
            prop: 'sort',
            type: 'inputNumber',
            rules: [{ required: false, message: '排序不能为空' }]
          },
          {
            label: '部门负责人',
            prop: 'leaderId',
            type: 'user',
            multiple: false,
            allowinput: false
          }
        ]
      },
      pathArr: [], // 部门路径结果
      currentId: '',
      lastDept: null,
      ownName: '', // 改变前的名字
      formOption: {
        cancal: false,
        submitLoading: false,
        disabled: false,
        column: JSON.parse(JSON.stringify(tableOption.column))
      },
      repeatPhone: [], // 重复的手机号
      repeatName: [], // 重复的用户名
      deptListImport: [], // 导入用户-部门列表
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
      importLoading: false,
      validateUserName: (rule, value, callback) => {
        if (value.length > 64) {
          callback(new Error('用户名不能超过64位字符'));
        } else {
          if(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
            callback();
          }else{
            callback(new Error('用户名只能包含：中文、英文、数字和下划线，且不能以下划线开头结尾'));
          }
        }
      },
      uploadFile: null,
      cancels: '',
      fileList: [],
      importVisible: false, // 导入弹框
      importOption: importOptionData,
      userVisible: false, // 用户信息弹框
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleSort(row) {
      if (row.order !== null) {
        const obj = {
          column: row.prop,
          order: row.order === 'ascending' ? 'asc' : 'desc'
        }
        const index = this.orders.findIndex(item => {
          return item.column === row.prop
        })
        if (index === -1) {
          this.orders.push(obj)
        } else {
          this.orders[index] = obj
        }
        this.getList()
      }
    },
    // 弹窗显示
    dialogVisibleShow (method, node, data, type) {
      if(data) {
        data.moretool = false
      }
      if (this.$refs.Form) {
        this.$refs.Form.resetFields();
      }
      if(type == 'dept' && data && node) {
        this.selectOneId = data.id
        this.selectOneData = data
        this.currentList = node.parent.childNodes
      }

      this.method = method
      this.formType = type
      this.dialogVisible = true
      if(type == 'dept') {
        if (method == 'add') {
          this.title = "添加部门"
          this.Form = {
            name: '',
            parentId: [],
            sort: 0,
            leaderId: ''
          }
          this.currentId = ''
          for(let i in this.treedata) {
            this.treedata[i].path = []
            if(this.treedata[i].children && this.treedata[i].children.length > 0) {
              this.getPath(this.treedata[i].children, this.treedata[i].path)
            }
          }
          // this.deptOption.column.filter(it => {
          //   if(it.prop == 'parentId') {
          //     it.display = true
          //   }
          // })
        }else if(method == 'addchild') {
          this.title = "添加子部门"
          this.Form = {
            name: '',
            parentId: [],
            sort: 0,
            leaderId: ''
          }
          this.currentId = data.id
          if(data.parentId) {
            for(let i in this.treedata) {
              this.treedata[i].path = []
              if(this.treedata[i].children && this.treedata[i].children.length > 0) {
                this.getPath(this.treedata[i].children, this.treedata[i].path)
              }
            }
            this.getDeptPath(data.id, this.treedata)
            console.log(data)
            this.Form.parentId = this.pathArr
            this.Form.parentId.push(data.id)
          }
          // this.deptOption.column.filter(it => {
          //   if(it.prop == 'parentId') {
          //     it.display = true
          //   }
          // })
        }else {
          this.title = "修改部门"
          let obj = JSON.parse(JSON.stringify(this.selectOneData))
          this.currentId = this.selectOneData.id
          if(obj.parentId) {
            for(let i in this.treedata) {
              this.treedata[i].path = []
              if(this.treedata[i].children && this.treedata[i].children.length > 0) {
                this.getPath(this.treedata[i].children, this.treedata[i].path)
              }
            }
            this.getDeptPath(obj.id, this.treedata)
            obj.parentId = this.pathArr
          }
          this.Form = obj
          this.lastName = this.selectOneData.name
          if(this.Form.parentId == -1) {
            this.Form.parentId = []
          }
          // this.deptOption.column.filter(it => {
          //   if(it.prop == 'parentId') {
          //     if(data.children && data.children.length > 0) {
          //       it.display = false
          //     }else{
          //       it.display = true
          //     }
          //   }
          // })
        }
      }
      if(type == 'user') {

      }
    },
    // 弹窗关闭的方法
    handleClose () {
      this.dialogVisible = false
      this.deptIds = []
      this.customizeList = []
    },
    // 页码改变
    currentChange (page) {
      this.getList(page)
    },
    // 显示树改变
    sizeChange (page) {
      this.getList(page)
    },
    // 搜素回调
    searchChange () {

    },
    // 列表加载
    getList (page) {
      const arr = [...this.orders]
      let str = ''
      let temp = ''
      let paramStr = ''
      if (arr.length > 0) {
        arr.forEach((item, key) => {
          str = `&${item.order}=${item.column}`
          temp += str
        })
        paramStr = temp.replace(/&/, '?')
      }
      let tp = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      if(this.selectOneId){
        tp.deptId = this.selectOneId
      }
      getDeptUserList( Object.assign({}, tp), paramStr).then(({ data }) => {
        if(data.code == 0 && data.data) {
          this.tableData = data.data.records
          this.page.currentPage = data.data.current
          this.page.total = data.data.total
        }
      })
    },
    // 编辑
    editItem (row, type, nodeData) {
      this.rowData={}
      if (row) {
        this.rowData = row
        this.userForm=JSON.parse(JSON.stringify(this.rowData))
        // this.userForm.accountName = this.userForm.username
        for(let i in this.deptList) {
          this.deptList[i].path = []
          if(this.deptList[i].children && this.deptList[i].children.length > 0) {
            this.getPath(this.deptList[i].children, this.deptList[i].path)
          }
        }
        this.getDeptPath(this.rowData.deptId, this.deptList)
        let tp = JSON.parse(JSON.stringify(this.pathArr))
        tp.push(this.rowData.deptId)
        this.userForm.deptId = tp
        this.changebefore(this.userForm.accountName)
        if(type == 'view') {
          this.title = '详情'
          this.formOption.disabled = true
        }else{
          this.title='编辑'
          this.formOption.disabled = false
        }
      } else {
        this.title='新增'
        let obj = {
          cancelFlag: false,
          deptId: nodeData.id
        }
        this.userForm= obj
      }
      this.userVisible=true
    },
    userClose () {
      this.userVisible = false
    },
    // 用户信息-提交
    submitHandle (form) {
      if(this.disSubmit) {
        return false
      }
      let obj={}
      obj=JSON.parse(JSON.stringify(form))
      obj.roleName=null
      this.formOption.submitLoading = true
      if (this.title=='编辑') {
        if(obj.deptId) {
          if(obj.deptId.length > 0) {
            obj.deptId = obj.deptId[obj.deptId.length-1]
          }else{
            obj.deptId = null
          }
        }
        editUser(obj).then(res => {
          if (res.data.code==0) {
            this.$message.success('编辑用户成功')
            this.formOption.submitLoading = false
            this.getList()
            this.userClose()
          }else{
            this.formOption.submitLoading = false
            if(res.data.msg) {
              this.$message.error(res.data.msg)
            }
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      } else {
        addUser(obj).then(res => {
          if (res.data.code==0) {
            this.$message.success('新增用户成功')
            this.formOption.submitLoading = false
            this.getList()
            this.userClose()
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      }
    },
    // 结点选中
    handleNodeClick (data, node, dom) {
      if(this.selectOneId == data.id) {
        this.selectOneId = ""
        this.$refs.deptTree.setCurrentKey(null)
        this.$forceUpdate()
      }else{
        this.selectOneId = data.id
      }
      this.selectOneData = data
      this.currentList = node.parent.childNodes
      this.getList(this.page)
    },
    remove (node, data, type) {
      console.log(data)
      this.$confirm('是否删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(type == '机构') {
          deleteDept(data.id).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success({
                showClose: true,
                message: '删除机构成功',
              })
              this.getTreeDept()
              this.getDeptListHandle()
            } else {
            }
          })
        }
      }).catch(() => {

      });

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
          obj.extend = item.extend
          if (item.children && item.children.length > 0) {
            obj.children = this.getTree(item.children, level+1);
          }
          arr.push(obj);
        });
      }
      return arr
    },
    // 部门提交
    doSubmit () {
      this.deptOption.submitLoading = true
      if(['add', 'addchild'].indexOf(this.method) > -1) {
        let obj = JSON.parse(JSON.stringify(this.Form))
        if(obj.parentId && obj.parentId.length > 0) {
          obj.parentId = obj.parentId[obj.parentId.length - 1]
        }else{
          obj.parentId = -1
        }
        AddDept(obj).then(({ data }) => {
          if (data.code === 0) {
            this.$message.success("添加部门成功")
            this.deptOption.submitLoading = false
            this.getTreeDept()
            this.handleClose()
            this.getDeptListHandle()
          }
        }).catch(e => {
          this.deptOption.submitLoading = false
        })
      }else if(this.method == 'edit'){
        let obj = JSON.parse(JSON.stringify(this.Form))
        if(obj.parentId && obj.parentId.length > 0) {
          obj.parentId = obj.parentId[obj.parentId.length - 1]
        }else{
          obj.parentId = -1
        }
        if(!obj.parentId) {
        obj.parentId = -1
        }
        editDept(obj).then(({ data }) => {
          if (data.code === 0) {
            this.$message.success("修改部门成功")
            this.deptOption.submitLoading = false
            this.getTreeDept()
            this.getDeptListHandle()
            this.handleClose()
          }
        }).catch(e => {
          this.deptOption.submitLoading = false
        })
      }
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
    // 记录改变前的名字
    changebefore (name) {
      this.ownName = name
    },
    // 名称去重
    noRepeatName (name) {
      for(let i in this.currentList) {
        if(name == this.currentList[i].data.name) {
          if(name != this.lastName) {
            this.disSubmit = true
            return false
          }
        }
      }
      this.disSubmit = false
    },
    // 禁用 启用
    disableHandle (row) {
      let str = '禁用'
      if(!row.cancelFlag) {
        str = '禁用'
      }else{
        str = '启用'
      }
      this.$confirm('确定'+str+'该用户？').then(_ => {
        enableDisUser(row.userId, row.cancelFlag).then(res => {
          if (res.data.code==0) {
            this.$message.success(str + '用户成功')
            this.getList()
          }
        })
      }).catch(_ => {})
    },
    // 获取部门id路径
    getPath (list, temp) {
      for(let i in list) {
        if(!list[i].path) {
          list[i].path = []
        }
        if(list[i].parentId != -1) {
          list[i].path = JSON.parse(JSON.stringify(temp))
          list[i].path.push(list[i].parentId)
        }
        if(list[i].id === this.currentId) {
          list[i].disabled = true
        }else{
          list[i].disabled = false
        }
        if(list[i].children && list[i].children.length > 0) {
          this.getPath(list[i].children, list[i].path)
        }
      }
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
    // 部门更多
    moreDept (item) {
      if(this.lastDept) {
        this.lastDept.moretool = false
      }
      this.lastDept = item
    },

    /**
     * 用户
    */
   // 获取角色列表
    getRoleListHandle () {
      getRoleList("userRole").then(res => {
        if (res.data.code==0) {
          this.option.column.filter(item => {
            if (item.prop=='roleName') {
              item.dicData=res.data.data
              this.roleLsit=res.data.data
              this.$forceUpdate()
            }
          })
        }
      })
    },
    // 获取部门列表
    getDeptListHandle () {
      getDeptList().then(res => {
        if (res.data.code==0) {
          this.deptList=res.data.data
          let tp = res.data.data
          this.deptListImport = [{id: 'ditto', name: '同上'}].concat(tp)
          this.$forceUpdate()
        }
      })
    },
    //上传文件，获取文件流
    handleFileChange(file) {
      this.uploadFile = file.raw
    },
    httpHandle (param) {
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      let _this = this
      this.instance.post('/mgr/jvs-auth/usermanager/import/preview', formData).then(responce => {
        if(responce.headers && responce.headers.cancels) {
          _this.cancels = responce.headers.cancels
        }
        let res = responce.data
        this.importView(res, null, [])
      })
    },
    // 导入用户
    importView (res, file, fileList) {
      if(res.code == 0) {
        let temp = []
        temp = res.data
        if(temp.length > 0) {
          for(let i in temp) {
            if(!temp[i].nickName && temp[i].realName) {
              temp[i].nickName = temp[i].realName
            }
            temp[i].status = false
            // if(temp[i].roleId && temp[i].roleId.length > 0) {
            //   temp[i].roleId = temp[i].roleId.map(Number)
            // }
            // temp[i].deptId && (temp[i].deptId = Number.parseInt(temp[i].deptId))
            // temp[i].jobId && (temp[i].jobId = Number.parseInt(temp[i].jobId))
            for(let i in this.deptList) {
              this.deptList[i].path = []
              if(this.deptList[i].children && this.deptList[i].children.length > 0) {
                this.getPath(this.deptList[i].children, this.deptList[i].path)
              }
            }
            this.getDeptPath(temp[i].deptId, this.deptList)
            let tp = JSON.parse(JSON.stringify(this.pathArr))
            tp.push(temp[i].deptId)
            temp[i].deptId = tp
          }
          this.fileList = temp
          this.getConst()
          this.importVisible = true
        }
      }else{
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    // 导入失败
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
    // 导入用户提交
    importHandle () {
      if(this.fileList.length > 0) {
        let temp = JSON.parse(JSON.stringify(this.fileList))
        for(let i in temp) {
          if(temp[i].deptId && temp[i].deptId.length > 0) {
            temp[i].deptId = temp[i].deptId[temp[i].deptId.length-1]
          }
        }
        this.importLoading = true
        importUser(temp).then(res => {
          if(res.data.code == 0) {
            if(res.data.data) {
              let phone = res.data.data.phone
              let accountName = res.data.data.accountName
              this.repeatPhone = phone
              this.repeatName = accountName
              if(phone.length > 0 || accountName.length > 0) {
                this.$message.error(res.data.msg)
              }else{
                this.$message.success(res.data.msg)
              }
            }else{
              this.$message.success('导入成功')
              this.importClose()
              this.getList()
            }
            this.importLoading = false
          }else{
            this.$message.error(res.data.msg)
            this.importLoading = false
          }
        }).catch(e => {
          console.log(e)
          this.importLoading = false
        })
      }
    },
    // 重复校验
    repeatHandle (type, val) {
      let bool = false
      let list = []
      if(type == 'phone') {
        list = this.repeatPhone
      }
      if(type == 'accountName') {
        list = this.repeatName
      }
      if(list.indexOf(val) > -1) {
        bool = true
      }else{
        // 必填校验
        // console.log(type) // realName
        if(['accountName', 'realName', 'phone'].indexOf(type) > -1) {
          if(val == '') {
            bool = true
          }else{
            bool = false
          }
        }else{
          bool = false
        }
      }
      return bool
    },
    // 下载模板
    downloadModel () {
      this.$openUrl('/mgr/jvs-auth/usermanager/template/users', '_self')
    },
    // 删除导入行
    delImportRow (row, index) {
      this.fileList.splice(index, 1)
      this.$forceUpdate()
    },
    // 关闭导入弹框
    importClose () {
      this.importVisible = false
      this.fileList = []
      this.repeatPhone = []
      this.repeatName = []
    },
    // 取消导入
    cancelHandle () {
      if(this.cancels) {
        sendMyRequire({
          url: '/mgr/jvs-auth/usermanager/cancelImport',
          httpMethod: 'delete',
          requestContentType: 'application/x-www-form-urlencoded',
          headers: {
            cancels: this.cancels
          }
        }
        ).then(res => {
          this.importClose()
        })
      }
    },
    // 获取常量列表
    getConst () {
      this.getRoleListHandle()
      this.getDeptListHandle()
      getPostList().then(res => {
        if(res.data.code == 0) {
          this.allPost = res.data.data
          this.formOption.column.filter(item => {
            if(item.prop == 'jobId') {
              item.dicData = res.data.data
            }
          })
          this.$forceUpdate()
        }
      })
    },
    // 邀请成员
    invitationHandle () {
      this.$refs.invitation.openDialog()
    }
  },
  created () {
    this.formOption.column.filter(item => { item.span=24 })
    this.getConst()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getTreeDept()
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.customize-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .more-icon{
    display: none;
    .el-icon-more{
      color: #868BA1;
      font-size: 16px;
    }
  }
}
.customize-tree-node:hover{
  .more-icon{
    display: block;
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
  .treeBox-title{
    font-size: 14px;
    padding-left: 10px;
    display: block;
    background: #fff;
  }
}
.treeBox::-webkit-scrollbar{
  display: none;
}
.formItem {
  width: 100%;
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
</style>
<style lang="scss">
.department-list-manage{
  position: relative;
  .treeBox{
    .el-tree{
      min-height: calc(100% - 19px);
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
  .dept-treeBox{
    .customize-tree-node{
      .customize-tree-node-label{
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.import-user-dialog:not(.user-import-fullscreen-dialog){
  .el-dialog__body{
    .jvs-table{
      .jvs-table-titleTop{
        .el-card__body{
          display: none;
        }
      }
      .table-body-box{
        .el-table{
          .el-table__body-wrapper{
            height: auto!important;
          }
        }
      }
    }
  }
}
.user-import-fullscreen-dialog{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      width: 100%;
      position: unset;
    }
  }
}
</style>
