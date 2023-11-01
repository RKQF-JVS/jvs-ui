<template>
  <div class="dictionaries-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='终端管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @delRow="delRowHandle"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="handleView(scope.row, 'edit')">编辑</jvs-button>
        <jvs-button size="mini" type="text" @click="handleView(scope.row, 'view')">查看</jvs-button>
        <jvs-button size="mini" type='text' v-if="scope.row.enable" @click="disableHandle(scope.row)">禁用</jvs-button>
        <jvs-button size="mini" type='text' v-else @click="disableHandle(scope.row)">启用</jvs-button>
        <!-- <jvs-button size="mini" type="text" @click="handlePermission(scope.row)">权限</jvs-button> -->
        <jvs-button size="mini" type='text' v-if="!scope.row.enable" @click="delRowHandle(scope.row)"><span style="color: #F56C6C;">删除</span></jvs-button>
      </template>
      <template slot="menuLeft">
        <jvs-button type="primary" icon="el-icon-plus" @click="handleAdd(null)">新增</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="75%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="client-info-box" v-if="dialogVisible">
        <jvs-form v-if="dialogVisible" :option="formOption" :formData="formData" @submit="handleAddSubmit">
          <template slot="iconForm">
            <el-upload
              ref="icoUpload"
              class="avatar-uploader"
              action="/mgr/jvs-auth//upload/jvs-public?module=tenantPicture"
              :limit="1"
              list-type="picture"
              accept=".png"
              :file-list="iconFileList"
              :show-file-list="false"
              :on-remove="iconRemove"
              :headers="headers"
              :on-success="icoSuccessHandle"
              :on-error="icoErrHandle"
              :disabled="title == '查看' ? true : false"
            >
              <img v-if="iconFileList.length > 0 && iconFileList[0].url" :src="iconFileList[0].url" class="avatar" @click.stop="imgClick">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <span slot="tip" class="el-upload__tip">建议 32 * 32</span>
            </el-upload>
            <i v-if="iconFileList.length > 0 && iconFileList[0].url" class="el-icon-delete delImg" @click="iconRemove(null, [])"></i>
          </template>
          <template slot="logoForm">
            <el-upload
              ref="logoUpload"
              class="avatar-uploader"
              action="/mgr/jvs-auth//upload/jvs-public?module=tenantPicture"
              :limit="1"
              list-type="picture"
              :file-list="logoFileList"
              accept=".jpg,.jpeg,.png"
              :show-file-list="false"
              :on-remove="logoRemove"
              :headers="headers"
              :on-success="logoSuccessHandle"
              :on-error="logoErrHandle"
              :disabled="title == '查看' ? true : false"
            >
              <img v-if="logoFileList.length > 0 && logoFileList[0].url" :src="logoFileList[0].url" class="avatar" @click.stop="imgClick">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <span slot="tip" class="el-upload__tip">建议 200 * 60</span>
            </el-upload>
            <i v-if="logoFileList.length > 0 && logoFileList[0].url" class="el-icon-delete delImg" @click="logoRemove(null, [])"></i>
          </template>
          <template slot="bgImgForm">
            <el-upload
              ref="bgUpload"
              class="avatar-uploader"
              action="/mgr/jvs-auth//upload/jvs-public?module=tenantPicture"
              :limit="1"
              list-type="picture"
              :file-list="bgFileList"
              accept=".jpg,.jpeg,.png"
              :show-file-list="false"
              :on-remove="bgRemove"
              :headers="headers"
              :on-success="bgSuccessHandle"
              :on-error="bgErrHandle"
              :disabled="title == '查看' ? true : false"
            >
              <img v-if="bgFileList.length > 0 && bgFileList[0].url" :src="bgFileList[0].url" class="avatar" @click.stop="imgClick">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                <span v-show="bgImgLimit" style="display:block;color: #F56C6C;">图片大小不能超过20M</span>
                <span>建议 1920 * 1080</span>
                </div>
            </el-upload>
            <i v-if="bgFileList.length > 0 && bgFileList[0].url" class="el-icon-delete delImg" @click="bgRemove(null, [])"></i>
          </template>
        </jvs-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getAppList, addApp, editApp, delApp, getAppById, enableDisApp} from './api'
import tableForm from '@/components/basic-assembly/tableForm'
export default {
  name: 'application-manage',
  components: {tableForm},
  data () {
    return {
      title: '新增',
      dialogVisible: false,
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {}, // 行数据
      tableData: [],
      formData: {},
      formOption: {
        submitLoading: false,
        cancal: false,
        column: [
          {
            label: '终端名称',
            prop: 'name',
            maxlength: 10,
            disabled: false,
            rules: [{ required: true, message: '请输入终端名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '描述',
            prop: 'describes',
            disabled: false,
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: 'app_id',
            prop: 'appKey',
            disabled: false,
            rules: [{ required: true, message: '请输入appId', trigger: 'blur' }],
          },
          {
            label: 'app_secret',
            prop: 'appSecret',
            disabled: true,
            display: false
          },
          {
            label: 'ICON',
            prop: 'icon',
            span: 24,
            hide: true,
            formSlot: true,
          },
          {
            label: 'LOGO',
            prop: 'logo',
            hide: true,
            formSlot: true,
            span: 24,
          },
          {
            label: '背景图',
            prop: 'bgImg',
            hide: true,
            formSlot: true,
            span: 24,
          },
        ]
      },
      tableOption: {
        // align: 'center',
        // menuAlign: 'center',
        showOverflow: true,
        search: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '终端名称',
            prop: 'name',
            maxlength: 10,
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入终端名称', trigger: ['blur', 'change'] }]
          },
          {
            label: '描述',
            prop: 'describes',
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: 'app_id',
            prop: 'appKey',
            disabled: true,
            rules: [{ required: true, message: '请输入appId', trigger: 'blur' }],
          },
          {
            label: 'app_secret',
            prop: 'appSecret',
            hide: true,
            disabled: true,
            rules: [{ required: true, message: '请输入appSecret', trigger: 'blur' }],
            addDisplay: false,
          },
        ]
      },
      iconFileList: [],
      bgFileList: [],
      logoFileList: [],
      imgBase64Array:[],
      bgImgLimit: false, // 背景图大小限制
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: ('Bearer '+this.$store.getters.access_token)
      },
    }
  },
  methods: {
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getAppList(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 关闭弹窗
    handleClose() {
      this.formData = {}
      this.dialogVisible = false
      this.iconFileList = []
      this.bgFileList = []
      this.logoFileList = []
    },
    // 新增终端
    handleAdd () {
      this.title = '新增'
      this.formOption.submitBtn = true
      this.formOption.emptyBtn = true
      this.formOption.column.forEach((item, key) => {
        item.disabled = false
        if (key === 3) {
          item.display = false
        }
      })
      this.dialogVisible = true
    },
    // 查看权限
    handlePermission(row) {
      console.log(row)
    },
    // 查看终端
    handleView(row, type) {
      if(type == 'view') {
        this.title = '查看'
        this.formOption.submitBtn = false
        this.formOption.emptyBtn = false
      }else{
        this.title = '编辑'
        this.formOption.submitBtn = true
        this.formOption.emptyBtn = true
      }
      this.formOption.column.forEach((item, key) => {
        if(type == 'view') {
          item.disabled = true
        }else{
          item.disabled = false
        }
        if (key === 3) {
          item.display = true
        }
      })
      getAppById(row.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.formData = JSON.parse(JSON.stringify(res.data.data))
          if(this.formData.icon) {
            this.iconFileList.push({url: this.formData.icon})
          }
          if(this.formData.bgImg) {
            this.bgFileList.push({url: this.formData.bgImg})
          }
          if(this.formData.logo) {
            this.logoFileList.push({url: this.formData.logo})
          }
          this.dialogVisible = true
        }
      })
    },
    // 新增终端提交
    handleAddSubmit(form) {
      this.formOption.submitLoading = true
      let fun = null
      let str = ''
      if(this.title == '新增') {
        fun = addApp
        str = '新增终端成功'
      }else{
        fun = editApp
        str = '修改终端成功'
      }
      fun(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success(str)
          this.formOption.submitLoading = false
          this.handleClose()
          this.getList()
        } else {
          this.formOption.submitLoading = false
          this.handleClose()
        }
      }).catch(e => {
        this.formOption.submitLoading = false
        this.handleClose()
      })
    },
    // 删除
    delRowHandle (row) {
      delApp(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除字典成功')
          this.getList()
        }
      })
    },
    icoSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.formData.icon = res.data.fileLink
        this.iconFileList = [{
          url: res.data.fileLink
        }]
      }else{
        this.$refs.icoUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    icoErrHandle (err, file, fileList) {
      this.$refs.icoUpload.clearFiles()
      this.$message.error(err)
    },
    iconRemove (file, fileList) {
      this.iconFileList = fileList
      this.formData.icon = ""
    },
    bgSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.formData.bgImg = res.data.fileLink
        this.bgFileList = [{
          url: res.data.fileLink
        }]
      }else{
        this.$refs.bgUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    bgErrHandle (err, file, fileList) {
      this.$refs.bgUpload.clearFiles()
      this.$message.error(err)
    },
    bgRemove (file, fileList) {
      this.bgFileList = fileList
      this.formData.bgImg = ""
    },
    logoSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.formData.logo = res.data.fileLink
        this.logoFileList = [{
          url: res.data.fileLink
        }]
      }else{
        this.$refs.logoUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    logoErrHandle (err, file, fileList) {
      this.$refs.logoUpload.clearFiles()
      this.$message.error(err)
    },
    logoRemove (file, fileList) {
      this.logoFileList = fileList
      this.formData.logo = ""
    },
    imgClick () {
      // 点击图片不再上传
    },
    // 禁用 启用
    disableHandle (row) {
      let str = '禁用'
      if(row.enable) {
        str = '禁用'
      }else{
        str = '启用'
      }
      this.$confirm(`确定${str}此终端？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableDisApp(row.id, row.enable).then(res => {
          if (res.data.code==0) {
            this.$message.success(str + '成功')
            this.getList()
          }
        })
      }).catch(_ => {})
    },
  }
}
</script>
<style lang="scss">
.client-info-box{
  .el-upload__tip{
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload__tip{
    display: block;
    margin: 0;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .delImg{
    position: absolute;
    left: 160px;
    top: 5px;
    z-index: 999;
    cursor: pointer;
  }
}

</style>
