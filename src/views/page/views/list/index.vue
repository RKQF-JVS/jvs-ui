<template>
  <div class="page-list">
    <jvs-table
      v-if="initabled"
      pageheadertitle="列表设计"
      :page="page"
      :data="tableData"
      :option="option"
      @on-load="getList"
      @search-change="searchChange"
      @delRow="delRowHandle"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" type="primary" icon="el-icon-plus" @click="addPage('add')">新增</jvs-button>
        <el-upload
          style="display:inline-block;margin:0 10px;"
          action="/mgr/jvs-design/design/import"
          :multiple="false"
          :limit="1"
          ref="uploadBtn"
          :file-list="fileList"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="errHandle"
          :headers="headers"
        >
<!--          <jvs-button size="mini" type="primary">导入</jvs-button>-->
        </el-upload>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="addPage('edit', scope.row)">编辑</jvs-button>
        <jvs-button size="mini" type="text" @click="designPage(scope.row)">设计</jvs-button>
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="publishPage(scope.row)">发布</jvs-button>
        <jvs-button size="mini" type="text" v-if="scope.row.isDeploy" @click="unPublishPage(scope.row)">卸载</jvs-button>
<!--        <jvs-button size="mini" type="text" @click="exportHandle(scope.row)">导出</jvs-button>-->
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="delRowHandle(scope.row)">删除</jvs-button>
      </template>
      <template slot="isDeploy" slot-scope="scope">
        <el-tag size="mini" :type="scope.row.isDeploy ? '' : 'info'">{{getIsDeployText(scope.row.isDeploy)}}</el-tag>
      </template>
      <template slot="url" slot-scope="scope">
        <el-button
          style="color: #66b1ff;"
          type="text"
          @click="onCopy"
          v-clipboard:copy="getpageUrl(scope.row)"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          size="mini"
        >复制</el-button>
      </template>
    </jvs-table>
    <!-- 设计管理/演示 -->
    <!-- title="设计管理/设计演示" -->
    <el-dialog
      :title="dialogType == 'add' ? (menuOpType == 'edit' ? '编辑' : '新增列表页') : (dialogType == 'publish' ? '发布' : '')"
      :visible.sync="designVisible"
      :before-close="handleCloseDesign"
      :fullscreen="dialogType == 'design'"
      append-to-body
      :modal="dialogType == 'design' ? false : true"
      :class="{'no-header-dialog-my': dialogType == 'design'}"
    >
      <!-- 新增 -->
      <jvs-form v-if="designVisible && dialogType == 'add'" :option="pageFormOption" @formChange="formChange" :formData="pageForm" @submit="addNewPage"></jvs-form>
      <!-- 设计 -->
      <designBox v-if="dialogType == 'design'" :infoData="rowData" @getList="getList" @closeDesign="closeDesignHandle" />
     <!-- 部署 -->
     <jvs-form ref="validateForm" refs="validateForm" v-if="dialogType == 'publish'" :option="publishOption" :formData="publishForm" @submit="publishSubmit">
       <template slot="parentIdForm">
         <div class="validate-item">
          <el-cascader
            :class="{'err-item':parentError}"
            clearable
            style="width: 100%;"
            size="mini"
            v-model="publishForm.parentId"
            :show-all-levels="true"
            :options="cascaderPptions"
            :props="{ expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
            @change="handleChange"
            >
            </el-cascader>
            <span class="el-form-item__error" v-if="parentError">请选择上级菜单</span>
         </div>
       </template>
     </jvs-form>
    </el-dialog>
    <!-- 选择模式 -->
    <el-dialog
      v-if="modelVisible"
      :visible.sync="modelVisible"
      append-to-body
      :before-close="modelClose">
      <span style="margin-right: 20px;">选择模式</span>
      <el-radio-group v-model="modelType">
        <el-radio label="DESIGN">设计</el-radio>
        <el-radio label="DEVELOP">开发</el-radio>
      </el-radio-group>
      <el-row style="margin-top: 20px;display:flex;justify-content:center;align-items:center;">
        <jvs-button size="mini" type="primary" @click="modelSubmit">确定</jvs-button>
        <jvs-button size="mini" @click="modelClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import designBox from './design'
import {
  getPageList,
  createPage,
  getAllSystemList,
  deployPage,
  deletePage,
  unloadPage,
  editPage,
  getAllApp
} from '../../api/newDesign.js'
import { client_id } from '@/const/const'
import {addForm, editForm} from "../../api/formlist";
export default {
  name: 'page-list',
  components: {designBox},
  data() {
    return {
      initabled: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableData: [],
      option: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        page: true,
        align: 'center',
        menuAlign: 'center',
        menuWidth: 250,
        search: true,
        // submitBtnText: '查询',
        // inline: true,
        cancal: false,
        showOverflow: true,
        column: [
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicData: [],
            search: true,
            searchSpan: 4,
            filterable: true,
            allowcreate: true,
            clearable: true,
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
          // {
          //   label: '类型',
          //   prop: 'type',
          //   search: true,
          //   searchSpan: 4,
          //   type: "select",
          //   dicUrl: "/mgr/jvs-design/design/types"
          // },
          {
            label: '页面名称',
            prop: 'name',
            search: true,
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            // span: 4
          },
          {
            label: '页面分组',
            prop: 'type',
            dicData: [],
            rules: [
              { required: true, message: '请输入分组', trigger: 'blur' }
            ],
          },
          {
            label: '页面描述',
            prop: 'description',
            search: true,
            searchSpan: 4,
            // span: 4
          },
          {
            label: "图标",
            hide: true,
            prop: "icon",
            type: 'iconSelect'
          },
          {
            label: '创建人',
            prop: 'createBy',
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '更新人',
            prop: 'updateBy',
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '状态',
            prop: 'isDeploy',
            headerExplain: true,
            explainContent: '未发布：应用管理员可查看；已发布：权限设置人员可查看',
            slot: true,
            dicData: [
              {label: '已发布', value: true},
              {label: '未发布', value: false},
            ],
            addDisplay: false,
            editDisplay: false,
          },
          // {
          //   label: '地址',
          //   prop: 'url',
          //   slot: true,
          //   addDisplay: false,
          //   editDisplay: false,
          // }
        ]
      },
      designVisible: false, // 设计列表
      systemId: '', // 系统id
      parentId: -1,
      menuFormData: {}, // 传递菜单数据
      rowData: {}, // 行数据
      queryParam: {}, // 查询参数
      dialogType: '', // 弹框类型
      appList: [],
      pageForm: {}, // 页面基本信息
      pageFormOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicData: [],
            clearable: true,
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
          {
            label: '页面名称',
            prop: 'name',
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            // span: 4
          },
          {
            label: '页面分组',
            prop: 'type',
            type: 'select',
            filterable: true,
            allowcreate: true,
            dicData: [],
            rules: [
              { required: true, message: '请选择分组', trigger: 'blur' }
            ],
          },
          {
            label: '页面描述',
            prop: 'description',
            searchSpan: 4,
            // span: 4
          },
          {
            label: "图标",
            prop: "icon",
            type: 'iconSelect'
          },
        ]
      },
      publishForm: {}, // 发布信息
      publishOption: {
        cancal: false,
        refs: 'validateForm',
        column: [
          {
            label: '上级菜单',
            prop: 'parentId',
            formSlot: true,
            // rules: [{ required: false, message: '请选择上级菜单', trigger: 'change' },]
          },
          {
            label: '图标',
            prop: 'icon',
            type: 'iconSelect'
          },
          {
            label: '排序',
            prop: 'sort',
            type: 'inputNumber'
          }
        ]
      },
      parentError: false,
      cascaderPptions: [], // 组件选择的菜单结构
      treeData: [], // 系统菜单
      pathArr: [], // id路径,
      modelVisible: false, // 选择模式
      modelType: '',
      menuOpType: '', // 新增 修改 列表名称
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      }
    }
  },
  methods: {
    formChange(form) {
      const index = this.appList.findIndex(item => {
        return item.id === form.jvsAppId
      })
      this.pageFormOption.column[2].dicData = this.appList[index].types.map(item => {
        return { label: item, value: item }
      })
    },
    // 获取所有应用
    async getAllApp() {
      await getAllApp().then(res => {
        if (res.data && res.data.code == 0) {
          this.appList = [...res.data.data]
          const arr = [...res.data.data]
          this.option.column[0].dicData = arr.map(item => {
            return { label: item.name, value: item.id }
          })
          this.pageFormOption.column[0].dicData = arr.map(item => {
            return { label: item.name, value: item.id }
          })
        }
      })
    },
    // 显示状态
    getIsDeployText(val) {
      return val ? '已发布' : '未发布'
    },
    getList (page) {
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      getPageList(Object.assign(obj, this.queryParam)).then(res => {
        if(res.data.code == 0 && res.data.data) {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.page.currentPage = res.data.data.current
        }
      })
    },
    searchChange (form) {
      this.queryParam = form
      this.getList()
    },
    goFormDesign (type) {
      let path = ''
      switch (type) {
        case 'normal' : path="/normalform/design";break;
        case 'level' : path="/levelform/design";break;
        case 'step' : path="/stepform/design";break;
        case 'detail' : path="/detailform/design";break;
        default: ;break;
      }
      if(path != '') {
        this.$router.push({path: path})
      }
    },
    // 新增
    addPage (type, row) {
      this.dialogType = 'add'
      this.menuOpType = type
      if (type === 'edit') {
        const index = this.appList.findIndex(item => {
          return item.id === row.jvsAppId
        })
        this.pageFormOption.column[2].dicData = this.appList[index].types.map(item => {
          return { label: item, value: item }
        })
      }
      if(row && row.name) {
        this.pageForm = JSON.parse(JSON.stringify(row))
      }
      this.designVisible = true
    },
    // 新增
    addRowHandle (form) {
      this.option.submitLoading = true
      // this.pageFormOption.submitLoading = true
      // form.type = 'normalForm'
      createPage(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success("新增页面成功")
          this.handleCloseDesign()
          this.getList()
          this.option.submitLoading = false
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    // 编辑
    editRowHandle (form) {
      this.option.submitLoading = true
      editPage(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success("修改成功")
          this.handleCloseDesign()
          this.getList()
          this.option.submitLoading = false
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    // 删除
    delRowHandle (row) {
      let str = '删除后会导致页面不能访问，是否继续删除？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 设计
    designPage (row) {
      let str = ''
      str = location.origin + ('/page-design-ui/#/crud/design?id='+row.id + (row.dataModelId ? `&dataModelId=${row.dataModelId}` : ''))
      this.$openUrl(str, '_blank')
      this.rowData = row
      // this.modelVisible = true
      this.dialogType = 'design'
      this.modelType = 'DEVELOP'
      this.rowData.modelType = this.modelType
      // this.designVisible = true
    },
    // 查看
    viewPage (row) {
      // this.$router.push({path:'/show',query: {id: row.menuId}})
      this.$router.push({
        path: this.$router.$jvsRouter.getPath({
          name: `${row.name}`,
          src: ('/page-design-ui/show?id='+row.menuId)
        })
      });
    },
    // 关闭弹框
    handleCloseDesign () {
      this.designVisible = false
      this.rowData = {}
      this.pageForm = {}
      this.publishForm = {}
      this.parentError = false
      this.pageFormOption.submitLoading = false
    },
    // 子组件通知关闭
    closeDesignHandle (bool) {
      if(bool) {
        this.handleCloseDesign()
        this.parentId = ''
        this.systemId = ''
      }
    },
    // 下载源码
    downloadHande (row) {
      this.$openUrl(`/mgr/jvs-design/design/code/${row.id}`, '_blank') // '_self')
    },
    // 新增页面
    addNewPage (form) {
      if(this.menuOpType == 'add') {
        this.pageFormOption.submitLoading = true
        createPage(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success("新增页面成功")
            this.handleCloseDesign()
            this.getAllApp()
            this.getList()
            this.pageFormOption.submitLoading = false
          }
        }).catch(e => {
          this.pageFormOption.submitLoading = false
        })
      }
      if(this.menuOpType == 'edit') {
        this.pageFormOption.submitLoading = true
        editPage(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success("修改成功")
            this.handleCloseDesign()
            this.getAllApp()
            this.getList()
            this.pageFormOption.submitLoading = false
          }
        })
      }
    },
    // 部署
    publishPage (row) {
      this.rowData = row
      // this.dialogType = 'publish'
      // let obj = {level: 3}
      // if(row.menuId) {
      //   obj.id = row.menuId
      // }
      // if(row.name) {
      //   this.publishForm.name = row.name
      // }
      // this.getParentList(obj)
      // this.publishForm.parentId = this.pathArr
      // this.designVisible = true
      let obj = JSON.parse(JSON.stringify(row))
      obj.type = 'page'
      let msg = ''
      if(row.isDeploy){
        msg = '设计已经发布，此次保存可能会影响使用，是否继续操作？'
      }
      if(msg) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deployPage(obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success('发布成功')
              this.getList()
              this.handleCloseDesign()
            }
          })
        }).catch(e => {})
      }else{
        this.$confirm('是否确认发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deployPage(obj).then(res => {
            if(res.data.code == 0) {
              this.$message.success('发布成功')
              this.getList()
              this.handleCloseDesign()
            }
          })
        }).catch(e => {})
      }
    },
    unPublishPage (row) {
      this.$confirm('卸载后所有的人无法操作，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unloadPage(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('卸载成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 部署提交
    publishSubmit (form) {
      let bool = this.parentValidate(form.parentId)
      if(bool) {
        return false
      }
      let obj = JSON.parse(JSON.stringify(form))
      if(obj.parentId && obj.parentId.length > 0) {
        obj.parentId = obj.parentId[obj.parentId.length - 1]
        obj.id = this.rowData.id
        obj.type = 'page'
        deployPage(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('发布成功')
            this.getList()
            this.handleCloseDesign()
          }
        })
      }
    },
    // 资源选择上级菜单
    handleChange(value) {
      if(value && value.length > 0) {
        if(this.$refs.validateForm) {
          this.parentValidate(value)
          this.$refs.validateForm.$refs.validateForm.clearValidate(['parentId'])
        }
      }
    },
    // 获取所有系统
    getAllSysntem () {
      getAllSystemList(client_id, {from: 'resources'}).then(res => {
        if(res.data.code == 0) {
          this.treeData = res.data.data
          this.$forceUpdate()
        }
      })
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
      }
    },
    // 设置菜单id路径
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
    // 获取菜单id路径
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
    // 选择模式
    modelSubmit () {
      if(this.modelType) {
        this.dialogType = 'design'
        this.rowData.modelType = this.modelType
        this.designVisible = true
        this.modelClose()
      }
    },
    // 取消选择模式
    modelClose () {
      this.modelType = ''
      this.modelVisible = false
    },
    uploadSuccess (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.getList()
        this.fileList = []
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
    // 导出
    exportHandle (row) {
      this.$openUrl(`/mgr/jvs-design/design/export/${row.id}`, '_self')
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      str += ('/page-design-ui/#/show?id='+row.id + (row.dataModelId ? `&dataModelId=${row.dataModelId}` : '') + `&isDeploy=${row.isDeploy}`)
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
  },
  async created () {
    await this.getAllSysntem()
    await this.getAllApp()
    this.initabled = true
  },
}
</script>
<style lang="scss">
.no-header-dialog-my{
  .el-dialog.is-fullscreen{
    overflow: hidden;
    .design-content{
      height: 100%;
      background: #f0f2f5;
      padding: 8px 10px;
      box-sizing: border-box;
      .title-page-header{
        margin-top: 0;
      }
    }
  }
  .el-dialog__header{
    padding: 0;
    display: none!important;
    .el-dialog__headerbtn{
      z-index: 9;
    }
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
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
