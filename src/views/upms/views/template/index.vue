<template>
  <div class="template-list">
    <jvs-table
      pageheadertitle='模板管理'
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
      @editRow="editRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button type="primary" size="mini" @click="addEditTemp(null)">新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type='text' @click="addEditTemp(scope.row)">编辑</jvs-button>
        <jvs-button size="mini" type='text' @click="design(scope.row)">设计模板</jvs-button>
        <jvs-button size="mini" type='text' v-if="scope.row.businessType != 1" @click="delRowHandle(scope.row)">删除</jvs-button>
      </template>
      <template slot="roleName" slot-scope="scope">
        {{ scope.row.roleName && scope.row.roleName.join(",") }}
      </template>
    </jvs-table>
    <!-- 新增 编辑 -->
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form :option="formOption" :formData="form" @submit="submitHandle"></jvs-form>
    </el-dialog>
    <el-dialog
      :visible.sync="designVisible"
      :before-close="designClose"
      :fullscreen="true"
      append-to-body
      class="template-design-dialog"
      @opened="initEditor"
    >
      <titlePageHeader :title="rowData && rowData.name || ''" @save="saveHandle" @close="designClose"></titlePageHeader>
      <div style="background: #fff;flex:1;height:calc(100% - 72px);overflow:hidden;margin-top:10px;">
        <el-input
          v-if="rowData && rowData.type == 1"
          type="textarea"
          :rows="24"
          placeholder="请输入内容"
          v-model="rowData.content">
        </el-input>
        <el-row class="form-item-tips" v-if="rowData && rowData.type == 1" style="padding:10px;">
          <span>如果是阿里云短信环境此处模板的内容,填写阿里云的短信模板code,如 SMS_216278978,请填写合法且通过审核的模板</span>
        </el-row>
        <div class="con-box" v-show="rowData && rowData.type != 1" style="height:100%;">
          <div  id="templateContentBox"></div>
          <div v-if="false && contentValidate" class="el-form-item__error">请填写内容</div>
        </div>
      </div>
      <!-- <PageHeader :title="rowData && rowData.name" style="height:100%;">
        <div style="padding: 0 10px;background: #fff;flex:1;height:100%;">
          <el-input
            v-if="rowData && rowData.type == 1"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="rowData.content">
          </el-input>
          <div class="con-box" v-show="rowData && rowData.type != 1" style="height:100%;">
            <div  id="templateContentBox"></div>
            <div v-if="false && contentValidate" class="el-form-item__error">请填写内容</div>
          </div>
        </div>
        <el-row
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            padding:10px 0;
          "
        >
          <el-button size="mini" type="primary" @click="saveHandle">确 定</el-button>
          <el-button size="mini" @click="designVisible = false">取 消</el-button>
        </el-row>
      </PageHeader> -->
    </el-dialog>
  </div>
</template>
<script>
import titlePageHeader from '@/components/page-header/titlePageHeader.vue';
import {getPageList, add, edit, del, design} from './api'
import E from 'wangeditor'
export default {
  components: {titlePageHeader},
  data() {
    return {
      typeArray: [], // 类型
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
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        page: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: "名称",
            prop: "name",
            search: true,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' },
            ]
          },
          {
            label: "业务类型",
            prop: "businessType",
            type: "select",
            dicData: [
              {label: "系统类型", value: 1},
              {label: "业务类型", value: 2}
            ],
            rules: [
              { required: true, message: '请选择业务类型', trigger: 'change' },
            ]
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            dicData: [
              {label: "短信", value: 1},
              {label: "邮件", value: 2},
              {label: "文档", value: 3},
            ],
            rules: [
              { required: true, message: '请选择类型', trigger: 'change' },
            ]
          },
          {
            label: "标题",
            prop: "title",
            rules: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
          },
          {
            label: "创建人",
            prop: "createBy"
          },
          {
            label: "修改人",
            prop: "updateBy"
          },
          {
            label: "创建时间",
            prop: "createTime",
            type: 'datePicker',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        ]
      },
      dialogVisible: false,
      form: {}, // 表单
      formOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: "业务类型",
            prop: "businessType",
            type: "select",
            dicData: [
              {label: "系统类型", value: 1},
              {label: "业务类型", value: 2}
            ],
            rules: [
              { required: true, message: '请选择业务类型', trigger: 'change' },
            ]
          },
          {
            label: "模板类型",
            prop: "type",
            type: "select",
            dicData: [
              {label: "短信", value: 1},
              {label: "邮件", value: 2},
              {label: "文档", value: 3},
            ],
            rules: [
              { required: true, message: '请选择类型', trigger: 'change' },
            ],
            disabled: false,
          },
          {
            label: "名称",
            prop: "name",
            search: true,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' },
            ],
            disabled: false
          },
          {
            label: "标题",
            prop: "title",
            linkbind: 1,
            maxlength: 20,
            showwordlimit: true,
            rules: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            tips: {
              position: 'bottom',
              text: ''
            }
          }
        ]
      },
      title: "",
      designVisible: false, // 设计
      rowData: null, // 行数据
      editor: null, // 富文本
      contentValidate: false
    }
  },
  methods: {
    getList (page) {
      let tp = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      getPageList(Object.assign({}, tp, this.queryParams)).then(({ data }) => {
        if(data.code == 0 && data.data) {
          this.tableData = data.data.records
          this.page.currentPage = data.data.current
          this.page.total = data.data.total
          this.tableLoading = false
        }
      }).catch(e => {
        // this.tableLoading = false
        // this.tableData = [{id: 1, name: '假数据', type: 2}]
      })
    },
    // 搜素回调
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    addEditTemp (row) {
      if(row) {
        this.form = JSON.parse(JSON.stringify(row))
        this.title = '编辑'
      }else{
        this.title = '新增'
      }
      this.dialogVisible = true
    },
    submitHandle (form) {
      if(this.title == '新增') {
        this.addRowHandle(form)
      }
      if(this.title == '编辑') {
        this.editRowHandle(form)
      }
    },
    addRowHandle (form) {
      this.formOption.submitLoading = true
      add(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.formOption.submitLoading = false
          this.handleClose()
          this.getList()
        }
      }).catch(e => {
        this.formOption.submitLoading = false
      })
    },
    editRowHandle (form) {
      this.formOption.submitLoading = true
      edit(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改成功')
          this.formOption.submitLoading = false
          this.handleClose()
          this.getList()
        }
      }).catch(e => {
        this.formOption.submitLoading = false
      })
    },
    delRowHandle (row) {
      this.$confirm('确认删除此模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    handleClose () {
      this.dialogVisible = false
      this.form = {}
      this.title = ''
    },
    // 设计模板
    design (row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.designVisible = true
    },
    // 保存设计
    saveHandle () {
      if(this.rowData.type != 1) {
        let _this = this
        this.editor.config.onblur = function (newHtml) {
          _this.rowData.content = newHtml
        }
        this.editor.config.onchange = function (newHtml) {
          _this.rowData.content = newHtml
        }
      }
      design(this.rowData).then(res => {
        if(res.data.code == 0) {
          this.$message.success('保存成功')
          this.designClose()
          this.getList()
        }
      })
    },
    designClose () {
      this.designVisible = false
      this.rowData = null
    },
    // 初始化富文本
    initEditor () {
      let _this = this
      if(this.editor) {
        this.editor.destroy()
      }
      _this.editor = new E('#templateContentBox')
      _this.editor.config.height = $('.con-box').height() - 48
      _this.editor.config.uploadImgShowBase64 = true
      _this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify',
        'quote',
        'emoticon',
        'image',
        'table',
        'code',
        'splitLine',
        'undo',
        'redo',
      ]
      _this.editor.config.onblur = function (newHtml) {
        if(_this.rowData) {
          _this.rowData.content = newHtml
          if(newHtml) {
            _this.contentValidate = false
          }else{
            _this.contentValidate = true
          }
        } 
      }
      _this.editor.config.onchange = function (newHtml) {
        if(_this.rowData) {
          _this.rowData.content = newHtml
          if(newHtml) {
            _this.contentValidate = false
          }else{
            _this.contentValidate = true
          }
        } 
      }
      _this.editor.create()
      if(_this.rowData && _this.rowData.type != 1 && _this.rowData.content) {
        _this.editor.txt.html(_this.rowData.content)
      }
      this.$forceUpdate()
    },
  },
  created () {
  },
  watch: {
    'form.businessType': {
      handler(newVal, oldVal) {
        let bool = false
        let tpType = false
        if(this.title == '新增') {
          bool = false
          tpType = false
        }
        if(this.title == '编辑') {
          if(newVal == 1) {
            bool = true
          }else{
            bool = false
          }
          tpType = true
        }
        this.formOption.column.filter(item  => {
          if(['type', 'name'].indexOf(item.prop) > -1) {
            item.disabled = bool
          }
          if(item.prop == 'type') {
            item.disabled = tpType
          }
          if(item.prop == 'businessType') {
            item.disabled = bool
          }
        })
      }
    },
    'form.type': {
      handler (newVal, oldVal) {
        let str = ''
        if(newVal == 1) {
          str = '如果使用阿里云短信环境，此处标题填写阿里短信签名，注意必须是合法且过审的签名'
        }else{
          str = ''
        }
        this.formOption.column.filter(item  => {
          if(item.prop == 'title') {
            item.tips.text = str
          }
        })
      }
    },
    'rowData.type' : {
      handler (newVal, oldVal) {
        if(newVal && newVal != 1) {
          this.initEditor()
        }
        this.$forceUpdate()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.template-list{
  position: relative;
  height: 100%;
}
</style>
<style lang="scss">
.template-design-dialog {
  .el-dialog.is-fullscreen {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-dialog.is-fullscreen::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .el-dialog__header{
    padding: 0;
    display: none;
  }
  .el-dialog__body{
    padding: 0 10px;
    background: #f0f2f5;
    height: 100%;
    overflow: hidden;
    .el-card__body{
      background: #f0f2f5;
      padding: 0!important;
      .pageheader-top{
        padding: 10px;
        background: #fff;
        border-radius: 5px;
      }
    }
  }
  .el-card__body{
    height: 100%;
  }
}
#templateContentBox{
  .w-e-toolbar, .w-e-text-container{
    border: 0!important;
  }
}
</style>