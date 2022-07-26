<template>
  <div class="content-box">
    <div class="rescurce">
      <div class="tablebox">
        <jvs-table
          pageheadertitle='菜单管理'
          refs="multipleTable"
          :data="tableData"
          tooltipEffect="dark"
          :showHeader="true"
          :loading="tableLoading"
          :option="tableOption"
          @search-change="searchChange"
        >
        <template slot="menuLeft">
          <div class="resource-search-form">
            <jvs-button type="primary" size='mini' icon="el-icon-plus" @click="addMenuHandle" permisionFlag="upms_menu_add">新增一级菜单</jvs-button>
            <!-- <span class="menu-name-item">菜单名称</span>
            <el-input v-model="queryParams.name" size="mini" placeholder="请输入菜单名称"></el-input> -->
          </div>
          <!-- <jvs-button type="primary" size='mini' @click="addResource" permisionFlag="zi_yuan_guan_lixin_zeng_zi_yuan">新增资源</jvs-button> -->
        </template>
       <!-- <template slot="menuRight">
         <jvs-button type="primary" size='mini' @click="searchChange(queryParams)">查询</jvs-button>
         <jvs-button size='mini'>清空</jvs-button>
       </template> -->
        </jvs-table>
      </div>
      <div class="rescurce-tree">
        <div class="button-list">
          <jvs-button v-for="(item, key) in terminalList" :type="item.id == currentTerminal ? 'primary' : ''" :key="key" @click="activeHandle(item)">{{item.name}}</jvs-button>
          <p class="divider-line"></p>
        </div>
        <div class="treeForm">
          <treeFrom :treeData="treeData" @addTree="addTree" @editTree="editTree" @deleteTree="deleteTree" @editResourceExplain="editResourceExplain" @serarchTreeItem="serarchTreeItem" />
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form v-if="optype=='menu' && dialogVisible" :formData="menuForm" :defalutFormData="menuForm" :option="menuFormOption" @submit="submitMenu">
        <template slot="applyIdForm">
          <el-row>
            <!-- <jvs-button v-for="(item, key) in terminalList" :type="item.id == menuForm.applyId ? 'primary' : ''" :key="key" @click="selectApplyId(item)">{{item.name}}</jvs-button> -->
            <jvs-button :type="terminalList[index].id == menuForm.applyId ? 'primary' : ''" @click="selectApplyId(terminalList[index])">{{terminalList[index].name}}</jvs-button>
          </el-row>
        </template>
        <template slot="urlForm">
          <el-row style="display:flex;">
            <el-input size="mini" v-model="menuForm.url" style="margin-right:10px;"></el-input>
            <el-tooltip class="warn-tooltip" effect="dark" content="请慎重修改" placement="top">
              <i style="color: #E6A23C;display: flex;align-items: center;margin-right:10px;" class="el-icon-warning"></i>
            </el-tooltip>
            <jvs-button size="mini">图表设计</jvs-button>
            <jvs-button size="mini">页面设计</jvs-button>
          </el-row>
        </template>
        <template slot="parentIdForm">
          <el-cascader
            style="width: 100%;"
            size="mini"
            :disabled="menuParentDisabled"
            v-model="menuForm.parentId"
            :show-all-levels="true"
            :options="cascaderPptions"
            :props="{ expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
            @change="handleChange">
          </el-cascader>
        </template>
      </jvs-form>
      <jvs-form ref="resourceForm" refs="resourceForm" v-if="optype=='resource' && dialogVisible" :option="resourceOption" :formData="resourceForm" :defalutFormData="resourceForm" @submit="subResource">
        <template slot="parentIdForm" ref="parentIdForm">
          <div class="validate-item">
            <el-cascader
              :class="{'err-item':parentError}"
              style="width: 100%;"
              size="mini"
              v-model="resourceForm.parentId"
              :show-all-levels="true"
              :options="cascaderPptions"
              :props="{ expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
              @change="handleChange">
            </el-cascader>
            <span class="el-form-item__error" v-if="parentError">请选择上级菜单</span>
          </div>
        </template>
        <template slot="apiForm">
          <el-select
            size="mini"
            style="width:100%;"
            v-model="searchword"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :loading="searchloading"
            :remote-method="remoteMethod"
            @change="apiChangeHandle"
          >
            <el-option
              v-for="(item, index) in apiList"
              :key="item+'api'+index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
        <template slot="listForm">
          <ul class="selectApiList" v-if="selectApiList.length > 0">
            <li v-for="(item, index) in selectApiList" :key="item+'api-item'+index">
              <b>{{item}}</b>
              <jvs-button size="mini" type="text" style="margin-left:10px;" @click="deleteSearchItem(index)">删除</jvs-button>
            </li>
          </ul>
        </template>
      </jvs-form>
      <jvs-form v-if="optype=='system' && dialogVisible" :option="systemOption" :formData="systemForm" @submit="sysSubmitHandle">
        <template slot="securityKeyForm">
          <span>{{systemForm.securityKey}}</span>
        </template>
      </jvs-form>
    </el-dialog>
    <Resource ref="resource" :resourceVisible="resourceVisible" :apply-id="currentTerminal" :menu-id="menuId" @resourceClose="resourceClose"/>
    <Explain ref="explain" :explainVisible="explainVisible" :apply-id="currentTerminal" :menu-id="menuId" @explainClose="explainClose"/>
  </div>
</template>
<script>
import treeFrom from './tree/index'
import Resource from './components/resource'
import Explain from './components/explain'
import {tableOption} from './option'
import {
  addMenu,
  editMenu,
  deleteMenu,
  getPermission,
  addPermission,
  editPermission,
  deletePermission,
  addSysntem,
  getAllSystemList,
  securityKey,
  getApiList,
  getAppList,
  getAllMenuList
} from '../../api/resource/index'
export default {
  name: "resource",
  components: { treeFrom, Resource, Explain },
  data () {
    return {
      menuId: '',
      resourceVisible: false,
      explainVisible: false,
      tableData: [],
      tableOption: tableOption,
      queryParams: {}, // 表格查询参数
      treeQuery: {}, // 菜单查询参数
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      treeData: [],
      treeDataTemp: [],
      dialogVisible: false,
      title: '新增菜单',
      optype: '',
      menuForm: {},
      menuFormOption: {
        formAlign: 'top',
        labelWidth: '110px',
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '已选择应用',
            prop: 'applyId',
            formSlot: true,
            display: true
          },
          {
            label: "上级菜单",
            prop: "parentId",
            type: 'select',
            dicData: [],
            formSlot: true
          },
          {
            label: "名称",
            prop: "name",
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' },]
          },
          {
            label: "图标",
            prop: "icon",
            type: 'iconSelect'
          },
          {
            label: "地址",
            prop: "url",
            // formSlot: true,
            rules: [{ required: false, message: '请输入地址', trigger: 'blur' },]
          },
          {
            label: "排序",
            prop: "sort",
            type: "inputNumber",
          },
          {
            label: "是否新窗口打开",
            prop: "newWindow",
            type: "switch",
            display: true
          }
        ]
      },
      resourceForm: {
        parentId: []
      },
      resourceOption: {},
      resourceFormOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            formSlot: true,
            rules: [{ required: true, message: '请选择上级菜单', trigger: 'change' },]
          },
          {
            label: "名称",
            prop: "name",
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' },]
          },
          {
            label: "资源路径",
            prop: "api",
            // rules: [{ required: true, message: '请选择或输入资源路径', trigger: ['blur', 'change'] },],
            type: 'select',
            // dicUrl: '/mgr/jvs-auth/permission',
            dicData: [],
            filterable: true,
            remote: true,
            reservekeyword: true,
            allowcreate: true,
            formSlot: true
          },
          {
            label: "",
            prop: 'list',
            formSlot: true
          }
        ]
      },
      resourceParentOption: {
        cancal: false,
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            formSlot: true
          },
        ]
      },
      cascaderPptions: [], // 所有菜单结构
      systemId: '',
      systemForm: {},
      searchword: '',
      searchloading: false,
      apiList: [],
      selectApiList: [],
      pathArr: null, // id路径
      menuParentDisabled: false,
      parentError: false,
      currentTerminal: '',
      index: 0,
      terminalList: []
    }
  },
  filters: {},
  created () {
    this.getAllSysntem() // 所有系统列表
    // this.getAllAppList()
  },
  mounted () { },
  computed: {},
  methods: {
    getAllAppList() {
      getAppList().then(res => {
        if (res.data && res.data.code == 0) {
          this.terminalList = [...res.data.data]
          if(!this.currentTerminal) {
            this.currentTerminal = this.terminalList[0].id
          }
          this.getAllSysntem() // 所有系统列表
        }
      })
    },
    // 新增 菜单
    addTree (item) {
      // if(item.parentId == -1) {
      //   this.addMenuHandle({level: 2, parentId: item.id}, 'add')
      // }else{
      //   this.addMenuHandle({level: 3, parentId: item.id}, 'add')
      // }
      if(item.extend) {
        this.addMenuHandle({level: item.extend.layer + 1, parentId: item.id}, 'add')
      }
    },
    // 编辑菜单
    editTree (item) {
      this.addMenuHandle(item.extend)
    },
    // 删除菜单
    deleteTree (item) {
      this.$confirm('此操作将永久删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(item.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("删除菜单成功")
            this.getAllSysntem()
          }
        })
      }).catch(() => {
      });
    },
    // 查询对应的资源列表
    serarchTreeItem (item) {
      this.treeQuery.menuId = item.id
      this.getList()
    },
    // 编辑资源或解释
    editResourceExplain (item) {
      let data = item.data
      let type = item.type
      this.menuId = data.id
      if (type === 'resource') {
        this.$refs.resource.getResourceList(data.id)
        this.resourceVisible = true
      } else {
        this.$refs.explain.getExplainList(data.id)
        this.explainVisible = true
      }
    },
    // 关闭编辑资源弹窗
    resourceClose() {
      this.resourceVisible = false
    },
    // 关闭编辑解释弹窗
    explainClose() {
      this.explainVisible = false
    },
    //   获取数据
    getList (page) {
      let query = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      // getPermission(Object.assign(query, this.queryParams, this.treeQuery)).then(res => {
      //   if(res.data.code == 0) {
      //     this.page.total = res.data.data.total
      //     this.page.currentPage = res.data.data.current
      //     this.tableData = res.data.data.records
      //     this.formatTreeOfSelect(this.tableData, 4)
      //     this.$forceUpdate()
      //   }
      // })
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible = false
      this.parentError = false
    },
    // 新增菜单
    addMenuHandle (rowData, treeType) {
      let row = JSON.parse(JSON.stringify(rowData))
      this.menuForm = {}
      this.title = '新增一级菜单'
      this.optype = 'menu'
      if(row && typeof row == 'object') {
        this.menuForm = row
        if(this.menuForm.parentId == -1) {
          this.menuForm.parentId = null
        }
        if(treeType == 'add') {
          this.title = '添加下级菜单'
        }else{
          this.title = '编辑菜单'
        }
        this.menuFormOption.column.filter(item => {
          if(item.prop == 'url'){
            if(row.children && row.children.length > 0) {
              item.rules[0].required = false
            }else{
              // 新增2级 项目层级
              if(rowData.level == 2 && treeType == 'add') {
                item.rules[0].required = false
              }else{
                item.rules[0].required = true
              }
            }
            // 系统层级
            if(rowData.parentId == -1) {
              item.display = false
            }else{
              item.display = true
            }
          }
          if(item.prop == 'parentId') {
            if(treeType == 'add') {
              item.disabled = true
            }else{
              item.disabled = false
            }
            if(rowData.layer == 1) {
              item.display = false
            }else{
              item.display = true
            }
            this.menuParentDisabled = item.disabled
          }
          if(item.prop == 'newWindow' || item.prop == 'url') {
            if(rowData.layer == 3 || rowData.level == 3) {
              item.display = true
            }else{
              item.display = false
            }
          }
          if(item.prop == 'applyId') {
            item.display = false
          }
        })
        if(treeType == 'add') {
          // 新增菜单时
          this.getParentList({level: rowData.level, id: rowData.parentId})
          if(this.pathArr && this.pathArr.length > 0) {
            let arr = []
            arr = JSON.parse(JSON.stringify(this.pathArr))
            arr.push(rowData.parentId)
            this.menuForm.parentId = arr
          }else{
            this.menuForm.parentId = [rowData.parentId]
          }
        }else{
          // this.getParentList(rowData)
          this.getParentList({level: rowData.layer, id: rowData.id})
          this.menuForm.parentId = this.pathArr
        }
      }else{
        this.menuFormOption.column.filter(item => {
          if(['url', 'parentId', 'newWindow'].indexOf(item.prop) > -1) {
            item.display = false
          }
          if(item.prop == 'applyId') {
            item.display = true
          }
        })
      }
      this.dialogVisible = true
    },
    // 新增资源
    addResource (row) {
      this.resourceOption = this.resourceFormOption
      this.resourceForm = {}
      this.title = '新增资源'
      if(row && typeof row == 'object') {
        this.resourceForm = JSON.parse(JSON.stringify(row))
        if(row.menuId) {
          row.parentId = row.menuId
          // let temp = this.getValueOfListByAttr(row.menuId,'menuId',this.cascaderPptions)
          // this.resourceForm.parentId = temp
        }
        if(row.systemId) {
          this.resourceForm.systemId = row.systemId
        }
        if(row.api) {
          this.selectApiList = JSON.parse(row.api)
        }
        this.title = '修改资源'
        // 不可修改时只能修改父级
        if(row.isDelete) {
          this.resourceOption = this.resourceParentOption
        }
        this.getParentList(row)
        let tarr = []
        tarr = JSON.parse(JSON.stringify(this.pathArr))
        tarr.push(row.menuId)
        this.resourceForm.parentId = tarr
      }else{
        this.getParentList({level: 4})
        this.resourceForm.parentId = [null]
      }
      this.optype = 'resource'
      this.parentValidate(this.resourceForm.parentId)
      this.dialogVisible = true
    },
    // 删除资源
    delResource (row) {
      this.$confirm('确认删除？').then(_ => {
        deletePermission(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除资源成功')
            this.getList()
          }
        })
      }).catch(_ => {})
    },
    // 获取父级菜单列表
    getParentList (rowData) {
      let temp = []
      for(let i in this.treeData) {
        if(rowData.level == 2) {
          temp.push({
            name: this.treeData[i].name,
            id: this.treeData[i].id,
          })
        }
        if(rowData.level >= 3) {
          let obj = {
            name: this.treeData[i].name,
            id: this.treeData[i].id,
            children: []
          }
          if(this.treeData[i].children && this.treeData[i].children.length > 0) {
            for(let j in this.treeData[i].children) {
              let tb= {
                name: this.treeData[i].children[j].name,
                id: this.treeData[i].children[j].id,
              }
              if(rowData.level == 4 && this.treeData[i].children[j].children && this.treeData[i].children[j].children.length > 0) {
                tb.children = []
                for(let k in this.treeData[i].children[j].children) {
                  tb.children.push({
                    name: this.treeData[i].children[j].children[k].name,
                    id: this.treeData[i].children[j].children[k].id
                  })
                }
              }
              obj.children.push(tb)
            }
          }
          temp.push(obj)
        }
      }
      this.cascaderPptions = temp
      for(let i in this.treeData) {
        this.treeData[i].path = []
        if(this.treeData[i].children && this.treeData[i].children.length > 0) {
          this.getPath(this.treeData[i].children, this.treeData[i].path)
        }
      }
      // 菜单类
      if(rowData.level < 4 && rowData.id) {
        this.getDeptPath(rowData.id, this.treeData)
      }else{
        // 资源
        this.getDeptPath(rowData.menuId, this.treeData)
      }
    },
    // 菜单提交
    submitMenu (form) {
      let obj = JSON.parse(JSON.stringify(form))
      if(obj.parentId && obj.parentId.length > 0) {
        obj.parentId = obj.parentId[obj.parentId.length - 1]
      }else{
        // obj.parentId = -1
        obj.parentId = this.currentTerminal
      }
      // console.log(obj)
      obj.applyId = this.terminalList[this.index].id
      this.menuFormOption.submitLoading = true
      if(this.title == '编辑菜单') {
        if(!obj.parentId) {
          obj.parentId = -1
        }
        editMenu(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改菜单成功')
            this.handleClose()
            this.getAllSysntem()
            this.menuFormOption.submitLoading = false
          }
        }).catch(e => {
          this.menuFormOption.submitLoading = false
        })
      }else {
        addMenu(obj).then(res => {
          if(res.data.code == 0) {
            this.menuFormOption.submitLoading = false
            this.$message.success('添加菜单成功')
            this.handleClose()
            this.getAllSysntem()
          }
        }).catch(e => {
          this.menuFormOption.submitLoading = false
        })
      }
    },
    // 资源提交
    subResource (form) {
      let obj = JSON.parse(JSON.stringify(form))
      let bool = this.parentValidate(obj.parentId)
      if(bool) {
        return false
      }
      if(obj.parentId && obj.parentId.length > 0) {
        obj.menuId = obj.parentId[obj.parentId.length - 1]
        obj.parentId = obj.menuId
      }
      obj.api = JSON.stringify(this.selectApiList)
      this.resourceOption.submitLoading = true
      if(this.title == '修改资源') {
        editPermission(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改资源成功')
            this.handleClose()
            this.getList()
            this.resourceOption.submitLoading = false
          }
        }).catch(e => {
          this.resourceOption.submitLoading = false
        })
      }else{
        addPermission(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('新增资源成功')
            this.handleClose()
            this.getList()
            this.resourceOption.submitLoading = false
          }
        }).catch(e => {
          this.resourceOption.submitLoading = false
        })
      }
    },
    // 格式化菜单数据 提供层级
    formatTreeOfSelect (list, level) {
      for (let i in list) {
        list[i].level = level
        if(list[i].children && list[i].children.length > 0) {
          this.formatTreeOfSelect(list[i].children, level+1)
        }
      }
    },
    // 资源选择上级菜单
    handleChange(value) {
      if(value && value.length > 0) {
        if(this.$refs.resourceForm) {
          this.parentValidate(value)
          this.$refs.resourceForm.$refs.resourceForm.clearValidate(['parentId'])
        }
      }
    },
    // 查询条件--查询资源
    searchChange (form) {
      this.queryParams = JSON.parse(JSON.stringify(form))
      let bool = true
      for(let i in this.queryParams) {
        bool = false
      }
      if(bool) {
        this.treeQuery.menuId = null
      }
      this.getList()
    },
    // 获取菜单id路径
    getValueOfListByAttr (val, attr, list) {
      let parentId = null
      for(let i in list) {
        if(list[i].children) {
          for(let j in list[i].children) {
            if(list[i].children[j].value == val) {
              parentId = list[i].value
            }
          }
        }
      }
      return [parentId,val]
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
    // 获取所有系统
    getAllSysntem () {
      // getAllSystemList({from: 'resources'}).then(res => {
      //   if(res.data.code == 0) {
      //     this.treeData = res.data.data
      //     this.$forceUpdate()
      //     this.formatTreeOfSelect(this.treeData, 1)
      //   }
      // })
      const appId = this.currentTerminal
      getAllMenuList().then(res => {
        if(res.data.code == 0) {
          this.treeDataTemp = [...res.data.data]
          const arr = [...res.data.data].map(item => {
            return { name: item.name, id: item.id }
          })
          this.terminalList = [...arr]
          if(!this.currentTerminal) {
            this.currentTerminal = this.terminalList[0].id
          }
          let index = 0
          for(let i in res.data.data) {
            if(res.data.data[i].id == this.currentTerminal) {
              index = i
            }
          }
          this.treeData = res.data.data[index].menus
          this.$forceUpdate()
          this.formatTreeOfSelect(this.treeData, 1)
        }
      })
    },
    // 系统  提交
    sysSubmitHandle (form) {
      addSysntem(form).then(res => {
        if(res.data.code == 0){
          this.$message.success(this.title + '成功')
          this.getAllSysntem()
          this.getList()
          this.handleClose()
        }
      })
    },
    // 获取密钥
    getSecurityKey () {
      securityKey().then(res => {
        if(res.data.code == 0) {
          this.systemForm.securityKey = res.data.data
        }
      })
    },
    // 远程搜索
    remoteMethod (query) {
      this.searchword = query
      if (query!=='' && query!==' ') {
        this.searchloading=true
        getApiList({api: query}).then(res => {
          if (res.data.code==0) {
            this.apiList = res.data.data
            this.searchloading=false
          }
        })
      }
    },
    // 添加
    apiChangeHandle (val) {
      this.selectApiList.push(val)
      this.searchword = ''
    },
    // 删除
    deleteSearchItem (index) {
      this.selectApiList.splice(index)
    },
    // 获取菜单id路径
    getPath (list, temp) {
      for(let i in list) {
        if(!list[i].path) {
          list[i].path = []
        }
        if(list[i].parentId != -1) {
          list[i].path = JSON.parse(JSON.stringify(temp))
          list[i].path.push(list[i].parentId)
        }
        if(list[i].children && list[i].children.length > 0) {
          this.getPath(list[i].children, list[i].path)
        }
      }
    },
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
    // 手动校验 上级菜单
    parentValidate (list) {
      let bool = false
      if(!list || list.length == 0) {
        bool = true
      }else{
        if(list[0]) {
          bool = false
        }else{
          bool = true
        }
      }
      this.parentError = bool
      return bool
    },
    // 切换终端
    activeHandle (app) {
      this.currentTerminal = app.id
      this.index = this.treeDataTemp.findIndex(item => {
        return app.id === item.id
      })
      this.treeData = this.treeDataTemp[this.index].menus
    },
    // 选择应用
    selectApplyId (item) {
      // this.$set(this.menuForm, 'applyId', item.id)
    }
  },
};
</script>

<style lang="scss">
.content-box{
  // padding-bottom: 80px;
  height: 100%;
  overflow: hidden;
}
.rescurce {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .rescurce-tree{
    position: absolute;
    //top: 134px;
    top: 90px;
    left: 0;
    width: 100%;
    //height: calc(100% - 134px);
    height: calc(100% - 90px);
    box-sizing: border-box;
    background: #F6F6F6;
    .button-list{
      overflow-x: auto;
      margin-top: 10px;
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
        bottom: 20px;
        left: 20px;
        margin: 0;
      }
    }
    .treeForm {
      padding: 0 20px;
      height: calc(100% - 78px);
      overflow: hidden;
      overflow-y: auto;
      background: #fff;
    }
    .treeForm::-webkit-scrollbar{
      display: none;
    }
  }

  .tablebox {
    width: 100%;
    .el-table {
      width: calc(100% - 250px);
      margin-left: 250px;
      display: none;
    }
    .table-top{
      border-bottom: none!important;
    }
  }
  .resource-search-form{
    display: flex;
    align-items: center;
    .menu-name-item{
      word-break: keep-all;
      margin: 0 15px 0 50px;
    }
    .el-input{
      .el-input__inner{
        width: 280px;
      }
    }
  }
}
.selectApiList{
  margin: 0;
  padding: 0;
  border: 1px solid #e5e5e5;
  border-bottom: 0;
  li{
    margin: 0;
    padding: 0;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 10px;
    b{
      flex: 1;
      font-weight: normal;
    }

  }
}
.validate-item{
  position: relative;
  .err-item{
    .el-input{
      .el-input__inner{
        border-color: #F56C6C;
      }
    }
  }
}
</style>
