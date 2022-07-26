<template>
  <div class="regexp-list">
    <jvs-table
      class="left-tree-table"
      pageheadertitle='正则管理'
      refs="multipleTable"
      :data="tableData"
      tooltipEffect="dark"
      style="width: 100%"
      :loading="tableLoading"
      :option="option"
      :page="page"
      :defalutFormData="queryParams"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" type="primary" @click="addEditHandle('add', null)">新增</jvs-button>
        <jvs-button v-if="false" size="mini" type="primary" @click="dialogVisible = true">导入</jvs-button>
        <jvs-button v-if="false" size="mini" type="primary" @click="exportAll">导出所有</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="addEditHandle('edit', scope.row)">编辑</jvs-button>
        <!-- <jvs-button size="mini" type='text' @click="disableHandle(scope.row)">{{scope.row.lockFlag ? '禁用' : '启用'}}</jvs-button> -->
      </template>
      <template slot="roleName" slot-scope="scope">
        {{ scope.row.roleName && scope.row.roleName.join(",") }}
      </template>
    </jvs-table>
    <div class="type-list-info" >
      <el-tree
        :data="typeArrayList"
        node-key="id"
        default-expand-all
        @node-click="setSelectOneType"
        :expand-on-click-node="false"
      >
      </el-tree>
    </div>
    <!-- 新增   编辑 -->
    <el-dialog
      :title="diaType == 'add' ? '新增' : '编辑'"
      v-if="formVisible"
      :visible.sync="formVisible"
      fullscreen
      class="form-fullscreen-dialog"
      :before-close="formClose">
      <jvs-form ref="myform" :option="option" :formData="rowData" @submit="submitForm">
        <template slot="formButton">
          <jvs-button size="mini" @click="testHandle">测试</jvs-button>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
      title="导入正则"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <el-upload
        class="upload-demo"
        style="text-align:center;"
        drag
        ref="uploadBtn"
        action="/mgr/jvs-auth/regexp/import"
        :multiple="false"
        :limit="1"
        accept=".xls,.xlsx"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :on-success="uploadSuccess"
        :on-error="errHandle"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          点击上传、或将文件拖到此处
          <br/>
          只支持excel
        </div>
        <div class="el-upload__tip" slot="tip" style="color: #f56c6c;font-size: 12px;">
          <span v-if="limitShow">最大支持20M的文件</span>
          <span v-if="typeErrShow">请上传Excel文件</span>
        </div>
      </el-upload>
      <el-row style="display:flex;justify-content:center;align-items:center;margin-top:10px;">
        <jvs-button size="mini" type="primary" :disabled="fileList.length == 0" @click="submitFile">提交</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {getPageList, typeList, add, edit, del} from './api'
function isReg(reg) {
  let isReg;
  try {
    isReg = eval(reg) instanceof RegExp
  } catch (e) {
    isReg = false
  }
  return isReg
}
export default {
  data() {
    var CheckRegExp = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      let r = isReg('/' + value + '/')
      if(r == false) {
        callback(new Error('正则表达式错误'));
      }else{
        callback();
      }
    };
    return {
      typeArray: [], // 类型
      typeArrayList: [],
      queryParams: {},
      tableLoading: false,
      tableData: [],
      selectOneType: "",
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: {
        cancal: false,
        addBtn: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        page: true,
        submitLoading: false,
        column: [
          {
            label: "名称",
            prop: "name",
            search: true,
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' },
              { max: 20, message: '不得超过20个字', trigger: 'blur' }
            ]
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            dicData: [],
            filterable: true,
            allowcreate: true,
            rules: [
              { required: true, message: '请选择或输入类型', trigger: ['blur', 'change'] }
            ]
          },
          {
            label: "正则",
            prop: "expression",
            width: 400,
            rules: [
              { required: true, message: '请输入正则表达式', trigger: 'blur' },
              { validator: CheckRegExp, trigger: 'blur' }
            ]
          },
          {
            label: "示例",
            prop: "demo",
            hide: true,
            append: "",
          }
        ]
      },
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
      dialogVisible: false,
      limitShow: false,
      currentFile: null,
      typeErrShow: false,
      diaType: '',
      formVisible: false,
      rowData: {}
    }
  },
  methods: {
    getList (page) {
      let tp = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      if(this.selectOneType) {
        tp.type = this.selectOneType
      }
      this.tableLoading = true
      getPageList(Object.assign({}, tp, this.queryParams)).then(({ data }) => {
        if(data.code == 0 && data.data) {
          this.tableData = data.data.records
          this.page.currentPage = data.data.current
          this.page.total = data.data.total
          this.tableLoading = false
        }
      })
    },
    getTypeListHandle () {
      typeList().then(res => {
        if(res.data.code == 0) {
          this.typeArray = res.data.data
          let temp = []
          for(let i in this.typeArray) {
            temp.push({
              label: this.typeArray[i],
              value: this.typeArray[i]
            })
          }
          this.option.column.filter(item => {
            if(item.prop == 'type') {
              item.dicData = temp
            }
          })
          this.typeArrayList = temp
          this.$forceUpdate()
        }
      })
    },
    // 搜素回调
    searchChange (form) {
      this.queryParams = form
      this.getList()
      this.getTypeListHandle()
    },
    // 类型
    setSelectOneType (data) {
      this.selectOneType = data.value
      this.getList()
    },
    addRowHandle (form) {
      add(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.option.submitLoading = false
          this.formClose()
          this.getList()
          this.getTypeListHandle()
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    editRowHandle (form) {
      edit(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改成功')
          this.option.submitLoading = false
          this.formClose()
          this.getList()
          this.getTypeListHandle()
        }
      }).catch(e => {
        this.option.submitLoading = false
      })
    },
    delRowHandle (row) {
      del(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
          this.getTypeListHandle()
        }
      })
    },
    exportAll () {
      this.$openUrl('/mgr/jvs-auth/regexp/export', '_self')
    },
    uploadSuccess (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.getList()
        this.getTypeListHandle()
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
    beforeUpload (file) {
      if(file.size > 20971520) {
        this.limitShow = true
        return false
      }else{
        this.limitShow = false
      }
      this.currentFile = file
    },
    onChange (file, fileList) {
      console.log(file)
      if(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(file.raw.type) == -1) {
        this.typeErrShow = true
        this.$refs.uploadBtn.clearFiles()
        this.currentFile = null
        return false
      }
      this.typeErrShow = false
      this.fileList = fileList
    },
    handleClose () {
      this.limitShow = false
      this.$refs.uploadBtn.clearFiles()
      this.dialogVisible = false
      this.currentFile = null
    },
    submitFile () {
      this.$refs.uploadBtn.submit()
    },
    addEditHandle (type, row) {
      this.diaType = type
      if(row) {
        this.rowData = JSON.parse(JSON.stringify(row))
      }
      this.option.column.filter(item => {
        if(item.prop == 'demo') {
          item.append = ""
        }
      })
      this.formVisible = true
    },
    submitForm (form) {
      this.option.submitLoading = true
      if(this.diaType == 'add') {
        this.addRowHandle(form)
      }else{
        this.editRowHandle(form)
      }
    },
    formClose () {
      this.formVisible = false
      this.rowData = {}
    },
    testHandle () {
      if(this.$refs.myform && this.$refs.myform.$refs && this.$refs.myform.$refs.ruleForm) {
        this.$refs.myform.$refs.ruleForm.validate( (validate, prop, msg) => {
          if(validate) {
            let demo = ""
            if(this.rowData.demo) {
              demo = this.rowData.demo
            }
            let str = ""
            if(eval('/'+this.rowData.expression+'/').test(demo)) {
              str = '测试通过'
            }else{
              str = '测试不通过'
            }
            this.option.column.filter(item => {
              if(item.prop == 'demo') {
                item.append = str
              }
            })
          }
        })
      }
    }
  },
  created () {
    this.getTypeListHandle()
  },
  mounted () {
    if($('.jvs-table-top')) {
      let h = $('.jvs-table-top').height()
      $('.type-list-info').css('top', (h+'px'))
      $('.type-list-info').css('height', `calc( 100% - ${h}px )`)
    }
  }
}
</script>
<style lang="scss" scoped>
.regexp-list{
  position: relative;
  height: 100%;
  .type-list-info{
    position: absolute;
    width: 250px;
    height: 100%;
    top: 0;
    left: 0;
    border-right: 1px solid #f0f2f5;
    padding-left: 20px;
    box-sizing: border-box;
    overflow: hidden;
    .el-tree{
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="scss">
.left-tree-table{
  .table-body-box{
    .el-table{
      margin-left: 250px;
      width: calc(100% - 250px);
    }
  }
}
.jvs-form{
  .jvs-form-item{
    .el-input.is-disabled{
      .el-input-group__append{
        display: none;
      }
    }
  }
}
</style>
