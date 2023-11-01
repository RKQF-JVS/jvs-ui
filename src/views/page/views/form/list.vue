<template>
  <div class="form-list">
    <jvs-table
      v-if="initabled"
      pageheadertitle="表单设计"
      :page="page"
      :option="option"
      :data="tableData"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchChange"
      @sort-change="handleSort"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" type="primary" icon="el-icon-plus" @click="addPage('add')">新增</jvs-button>
<!--        <el-upload-->
<!--          :action="`/mgr/jvs-design/form/design/import`"-->
<!--          :multiple="false"-->
<!--          :limit="1"-->
<!--          ref="uploadBtn"-->
<!--          :file-list="fileList"-->
<!--          :show-file-list="false"-->
<!--          :on-success="uploadSuccess"-->
<!--          :on-error="errHandle"-->
<!--          :headers="headers"-->
<!--          style="display:inline-block;margin-left:10px;"-->
<!--        >-->
<!--          <jvs-button size="mini" type="primary">导入</jvs-button>-->
<!--        </el-upload>-->
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="addPage('edit', scope.row)">编辑</jvs-button>
        <jvs-button size="mini" type="text" @click="designForm(scope.row)">设计</jvs-button>
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="deployFormHandle(scope.row)">发布</jvs-button>
        <jvs-button size="mini" type="text" v-if="scope.row.isDeploy" @click="undeployFormHandle(scope.row)">卸载</jvs-button>
<!--        <jvs-button size="mini" type="text" @click="exportFormHandle(scope.row)">导出</jvs-button>-->
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="delRowHandle(scope.row)">删除</jvs-button>
      </template>
      <template slot="type" slot-scope="scope">
        <span>{{getFormTypeText(scope.row.type)}}</span>
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
    <el-dialog
      v-if="designDialogVisible"
      :visible.sync="designDialogVisible"
      :fullscreen="true"
      :before-close="handleCloseDesignDialog"
      append-to-body
      class="form-design-no-header-dialog"
    >
      <formDesigner
        :designData="designData"
        :hassave="true"
        :hasclose="true"
        :hasjson="true"
        :hasimport="designData.id ? true: false"
        :hasexport="designData.id ? true: false"
        @close="closeHandle"
        @getList="getList"
      />
    </el-dialog>
    <!-- title="设计管理/设计演示" -->
    <el-dialog
      :title="menuOpType == 'edit' ? '编辑' : '新增'"
      :visible.sync="designVisible"
      :before-close="handleCloseDesign"
      append-to-body
      :modal="true"
    >
      <!-- 新增 -->
      <jvs-form v-if="designVisible" :option="pageFormOption" @formChange="formChange" :formData="pageForm" @submit="addNewPage"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getPageList, getTypeList, addForm, editForm, deployForm, undeployForm, delForm} from '../../api/formlist'
import formDesigner from '../show/formDesignList'
import {getKeyValue} from '../../api/list'
import {getAllApp} from "../../api/newDesign";
export default {
  components: {formDesigner},
  data() {
    return {
      tableLoading: false,
      queryParam: {},
      orders: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      menuOpType: 'add',
      designVisible: false,
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
      option: {
        addBtn: false,
        editBtn: false,
        cancal: false,
        viewBtn: false,
        delBtn: false,
        page: true,
        search: true,
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        menuWidth: '200px',
        submitLoading: false,
        addDialogText: '新增表单',
        column: [
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicData: [],
            search: true,
            searchSpan: 4,
            clearable: true,
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
          {
            label: "表单名称",
            prop: "name",
            searchSpan: 4,
            search: true,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
          },
          {
            label: "表单分组",
            prop: "type",
            // type: 'select',
            // slot: true,
            dicData: [
              // {label: '普通表单', value: 'normalForm'},
              // {label: '详情表单', value: 'detailForm'}
            ],
            rules: [
              { required: true, message: '请输入分组', trigger: 'blur' }
            ],
            // addDisplay: false,
            // editDisplay: false
          },
          {
            label: "表单描述",
            prop: "description",
            searchSpan: 4,
            search: true
          },
          // {
          //   label: "客户端类型",
          //   prop: "supportedClientType",
          //   hide: true,
          //   type: "radio",
          //   defaultValue: '1',
          //   dicData: [
          //     {label: "PC", value: "pc"},
          //     {label: "Mobile", value: "mobile"},
          //     {label: "双端", value: "all"},
          //   ]
          // },
          // {
          //   label: "免登录",
          //   prop: "checkLogin",
          //   hide: true,
          //   type: "radio",
          //   defaultValue: '1',
          //   dicData: [
          //     {label: "是", value: true},
          //     {label: "否", value: false}
          //   ]
          // },
          // {
          //   label: "名称",
          //   prop: "name",
          //   hide: true,
          //   addDisplay: false,
          //   editDisplay: false
          // },
          {
            label: "图标",
            hide: true,
            prop: "icon",
            type: 'iconSelect'
          },
          {
            label: "创建人",
            prop: "createBy",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "创建时间",
            prop: "createTime",
            addDisplay: false,
            editDisplay: false,
            sort: true
          },
          {
            label: "更新人",
            prop: "updateBy",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "更新时间",
            prop: "updateTime",
            addDisplay: false,
            editDisplay: false,
            sort: true
          },
          {
            label: "状态",
            prop: "isDeploy",
            slot: true,
            headerExplain: true,
            explainContent: '未发布：应用管理员可查看；已发布：权限设置人员可查看',
            dicData: [
              {label: '已发布', value: true},
              {label: '未发布', value: false}
            ],
            addDisplay: false,
            editDisplay: false
          },
          // {
          //   label: '地址',
          //   prop: 'url',
          //   slot: true,
          //   addDisplay: false,
          //   editDisplay: false
          // },
        ]
      },
      designDialogVisible: false, // 设计表单弹框
      masterTable: null, // 表单的id
      designData: null, // 表单设计数据
      initabled: false,
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
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
    async getList (page) {
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
      await this.getTypeListHandle()
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      this.tableLoading = true
      getPageList(Object.assign(obj, this.queryParam), paramStr).then(res => {
        if(res.data.code == 0 && res.data.data) {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.page.currentPage = res.data.data.current
          this.tableLoading = false
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParam = form
      this.getList()
    },
    // 获取归类列表，并赋值
    async getTypeListHandle () {
      await getTypeList().then(res => {
        if(res.data.code == 0) {
          let list = []
          for(let i in res.data.data) {
            list.push({
              label: res.data.data[i],
              value: res.data.data[i]
            })
          }
          this.option.column.filter(item => {
            if(item.prop == 'classify') {
              // item.dicData = list
              this.$set(item, 'dicData', list)
              this.$forceUpdate()
            }
          })
        }
      })
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
    // 关闭弹框
    handleCloseDesign () {
      this.designVisible = false
      this.pageForm = {}
      this.pageFormOption.submitLoading = false
    },
    // 新增页面
    addNewPage (form) {
      if(this.menuOpType == 'add') {
        this.pageFormOption.submitLoading = true
        addForm(form).then(res => {
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
        editForm(form).then(res => {
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
    // 新增
    addRowHandle (form) {
      this.option.submitLoading = true
      addForm(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
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
      editForm(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('编辑成功')
          this.getList()
          this.option.submitLoading = false
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    // 发布
    deployFormHandle (row) {
      if(row.id) {
        if(row.isDeploy) {
          this.$confirm('设计已经发布，此次保存可能会影响使用，是否继续操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deployForm(row.id).then(res => {
              if(res.data.code == 0) {
                this.$message.success('发布成功')
                this.getList()
              }
            })
          }).catch(e => {})
        }else{
          this.$confirm('是否确认发布？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deployForm(row.id).then(res => {
              if(res.data.code == 0) {
                this.$message.success('发布成功')
                this.getList()
              }
            })
          }).catch(e => {})
        }
      }
    },
    // 卸载
    undeployFormHandle (row) {
      if(row.id) {
        this.$confirm('卸载后所有的人无法操作，是否确定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          undeployForm(row.id).then(res => {
            if(res.data.code == 0) {
              this.$message.success('卸载成功')
              this.getList()
            }
          })
        }).catch(e => {})
      }
    },
    // 删除
    delRowHandle (row) {
      this.$confirm("删除后会导致引用了表单页的页面无法正常访问，是否继续删除？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delForm(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("删除成功")
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 导出表单
    exportFormHandle (row) {
      this.$openUrl(`/mgr/jvs-design/form/design/export/${row.id}`, '_blank')
    },
    // 显示状态
    getIsDeployText(val) {
      return val ? '已发布' : '未发布'
    },
    // 显示表单类型
    getFormTypeText (type) {
      let dic = [
        {label: '普通表单', value: 'normalForm'},
        {label: '详情表单', value: 'detailForm'},
        {label: '工作流表单', value: 'flowable'},
        {label: '多级表单', value: 'multiLevelForm'},
        {label: '步骤表单', value: 'step'}
      ]
      let tp = type
      for(let i in dic) {
        if(dic[i].value == type) {
          tp = dic[i].label
        }
      }
      return tp
    },
    // 设计
    designForm (row) {
      if (row.id) {
        let str = ''
        str = location.origin + ('/page-design-ui/#/form?id='+row.id + (row.dataModelId ? `&dataModelId=${row.dataModelId}` : ''))
        this.$openUrl(str, '_blank')
      }
      // if(row.type && row.name) {
      //   this.designData = row
      //   this.designDialogVisible = true
      // }
    },
    // 关闭设计表单
    handleCloseDesignDialog () {
      this.designData = null
      this.designDialogVisible=false
    },
    // 通知关闭
    closeHandle (bool) {
      if(bool) {
        this.handleCloseDesignDialog()
      }
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      str += ('/page-design-ui/#/form/info?name='+row.id + (row.dataModelId ? `&dataModelId=${row.dataModelId}` : ''))
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
    // 获取所有label value 对应值
    async getKeyValueHandle () {
      await getKeyValue().then(res => {
        if(res.data.code == 0) {
          this.$store.state.labelValue = res.data.data
        }
      })
    },
    uploadSuccess (res, file, fileList) {
      this.formBool = false
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.fileList = []
        this.getList()
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
    // 获取所有应用
    // async getAllApp() {
    //   await getAllApp().then(res => {
    //     if (res.data && res.data.code == 0) {
    //       const arr = [...res.data.data]
    //       this.option.column[0].dicData = arr.map(item => {
    //         return { label: item.name, value: item.id }
    //       })
    //     }
    //   })
    // },
  },
  async created () {
    if(!this.$store.state.labelValue) {
      await this.getKeyValueHandle()
    }
    await this.getTypeListHandle()
    await this.getAllApp()
    this.initabled = true
  }
}
</script>
<style lang="scss">
.form-design-no-header-dialog{
  height: 100%;
  overflow: hidden;
  .el-dialog__header{
    display: none!important;
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
    overflow: hidden;
    padding: 8px 10px;
    background: #f0f2f5;
    box-sizing: border-box;
  }
  .title-page-header{
    margin-top: 0;
    z-index: 99999999;
    position: relative;
  }
  .form-design-tool{
    font-size: 25px;
    cursor: pointer;
    color: #353535;
  }
}
</style>
