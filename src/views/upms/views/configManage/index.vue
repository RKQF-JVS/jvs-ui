<template>
  <div class="config-manage">
    <jvs-table
      :page="page"
      pageheadertitle='配置管理'
      :option="tableOption"
      :data="tableData"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menuLeft">
        <jvs-button type="primary" size="mini" icon="el-icon-plus" @click="addForm(null)">新增</jvs-button>
        <jvs-button type="primary" size="mini" :loading="reloading" @click="reloadHandle">重新加载</jvs-button>
      </template>
      <template slot="configValue" slot-scope="scope">
        <span v-if="scope.row.type != 'FILE'">{{scope.row.configValue}}</span>
        <span v-else>文件</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="addForm(scope.row)">修改</jvs-button>
        <jvs-button type="text" size="mini" @click="deleteRow(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :title="title"
      fullscreen
      v-if="dialogVisible"
      class="form-fullscreen-dialog"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form :option="formOption" :formData="form" @submit="formSubmit">
        <template slot="configValueForm">
          <el-input
            v-if="form.type == 'STRING'"
            type="textarea"
            :rows="2"
            placeholder="请输入配置值"
            v-model="form.configValue">
          </el-input>
          <el-upload
            v-if="form.type == 'FILE'"
            class="upload-demo"
            action=""
            :limit="1"
            :on-change="handleFileUploaderChange"
            :show-file-list="false"
            :file-list="fileList">
            <jvs-button type="primary" size="mini">选择文件</jvs-button>
            <div slot="tip" class="el-upload__tip" v-if="limitSize" style="color: #f56c6c;font-size:12px;">文件大小不能超过20M</div>
          </el-upload>
          <el-input
            v-if="form.type == 'FILE' && form.configValue"
            type="textarea"
            class="my-text-area"
            :rows="5"
            :disabled="true"
            placeholder="请输入配置值"
            v-model="form.configValue">
          </el-input>
          <el-input-number v-if="form.type == 'NUMBER'" v-model="form.configValue"></el-input-number>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getConfigPage, addConfig, editConfig, delConfig, reloadConfig} from './api'
export default {
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
      tableLoading: false,
      tableOption: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        align: "center",
        menuAlign: "center",
        page: true,
        search: true,
        showOverflow: true,
        column: [
          {
            label: "项目",
            prop: "projectName",
            search: true
          },
          {
            label: "配置键",
            prop: "configKey"
          },
          {
            label: "配置值",
            prop: "configValue",
            slot: true
          },
          {
            label: "备注",
            prop: "remarks"
          },
          {
            label: "创建时间",
            prop: "createTime"
          },
          {
            label: "创建人",
            prop: "createBy"
          }
        ]
      },
      title: "",
      dialogVisible: false,
      form: {},
      formOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: "项目",
            prop: "projectName"
          },
          {
            label: "配置键",
            prop: "configKey",
            rules: [
              { required: true, message: '请输入配置键', trigger: 'blur' }
            ]
          },
          {
            label: "字典类型",
            prop: "type",
            type: "select",
            dicData: [
              {label: "文件", value: "FILE"},
              {label: "数字", value: "NUMBER"},
              {label: "字符", value: "STRING"}
            ],
            defaultValue: "FILE",
            rules: [
              { required: true, message: '请选择字典类型', trigger: 'change' }
            ]
          },
          {
            label: "配置值",
            prop: "configValue",
            formSlot: true,
            rules: [
              { required: true, message: '请输入配置值', trigger: 'blur' }
            ]
          },
          {
            label: "备注信息",
            prop: "remarks",
            type: "textarea",
            rules: [
              { required: true, message: '请输入备注信息', trigger: 'blur' }
            ]
          }
        ]
      },
      fileList: [],
      count: -1,
      limitSize: false,
      reloading: false
    }
  },
  methods: {
    getList (page) {
      this.tableLoading = true
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      obj = Object.assign(obj, this.queryParams)
      getConfigPage(obj).then(res => {
        if(res.data.code == 0) {
          this.tableLoading = false
          this.tableData = res.data.data.records
          this.page.currentPage = res.data.data.current
          this.page.total = res.data.data.total
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    addForm (row) {
      this.title = "新增"
      if(row) {
        this.form = JSON.parse(JSON.stringify(row))
        this.title = "修改"
      }
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.form = {}
      this.count = -2
    },
    formSubmit (form) {
      this.formOption.submitLoading = true
      if(this.title == "新增") {
        addConfig(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success("新增成功")
            this.formOption.submitLoading = false
            this.handleClose()
            this.getList()
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      }
      if(this.title == "修改") {
        editConfig(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success("修改成功")
            this.formOption.submitLoading = false
            this.handleClose()
            this.getList()
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      }
    },
    deleteRow (row) {
      this.$confirm("确认删除此配置", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delConfig(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("删除成功")
            this.getList()
          }
        })
      }).catch(e => {})
    },
    handleFileUploaderChange(file){
      if(file && file.size > 20971520) {
        this.limitSize = true
        return false
      }else{
        this.limitSize = false
      }
      const self = this
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload  = function(event){
        let img_base64 = this.result
        // console.log(img_base64)
        self.$set(self.form, "configValue", img_base64)
        self.$forceUpdate()
      }
    },
    reloadHandle () {
      this.reloading = true
      reloadConfig().then(res => {
        if(res.data.code == 0) {
          this.$message.success("重新加载成功")
          this.reloading = false
          this.getList()
        }
      }).catch(e => {
        this.reloading = false
      })
    }
  },
  watch: {
    'form.type': {
      handler(newVal, oldVal) {
        if(newVal && this.count > -1) {
          this.form.configValue = ""
        }
        this.count += 1
      }
    }
  }
}
</script>
<style lang="scss">
.my-text-area{
  margin-top: 10px;
  .el-textarea__inner{
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
