<template>
  <div class="file-manage" v-if="show">
    <jvs-table
      pageheadertitle='文件管理'
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menuLeft">
        <jvs-button type="primary" size="mini" @click="dialogVisible = true" icon="el-icon-plus">上传文件</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <div>
<!--          <jvs-button type="text" size="mini" v-if="['png', 'jpg', 'jpeg', 'pdf'].indexOf(scope.row.fileType) > -1" @click="viewItem(scope.row, 'preview')">预览</jvs-button>-->
          <jvs-button type="text" size="mini" @click="viewItem(scope.row, 'preview')">预览</jvs-button>
<!--          <jvs-button type="text" size="mini" @click="viewItem(scope.row, 'download')">下载</jvs-button>-->
          <jvs-button type="text" size="mini" @click="viewItem(scope.row, 'copy')">复制链接</jvs-button>
        </div>
      </template>
      <template slot="fileType" slot-scope="scope">
        <img style="height: 30px;" :src="scope.row.thumbnail" alt=""/>
      </template>
    </jvs-table>
    <el-dialog
      title="文件上传"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <jvs-form ref="ruleForm" :option="uploadOption" :formData="uploadForm" @formChange="formChange" @submit="handleSubmit"></jvs-form>
      <el-upload
        class="upload-demo"
        style="text-align:center;"
        drag
        ref="uploadBtn"
        :action="`/mgr/jvs-auth/upload/${paramData.bucketName}`"
        :data="paramData"
        :headers="header"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :on-success="successHandle"
        :on-error="errHandle"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传、或将文件拖到此处</div>
        <div class="el-upload__tip" slot="tip" v-if="limitShow" style="color: #f56c6c;font-size: 12px;">最大支持20M的文件</div>
      </el-upload>
      <el-row style="display:flex;justify-content:center;align-items:center;margin-top:10px;">
        <jvs-button size="mini" type="primary" :disabled="fileList.length == 0" @click="submitFile">提交</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {getFiles, preview, download, getbuckets, getfileTypes} from './api'
import { tableOption } from './option'
import store from "@/store";
import {Base64} from "js-base64";
import {client_id} from "../../../../const/const";
export default {
  data() {
    return {
      paramData: {
      }, // 上传参数
      tableData: [], // 表格数据
      tableLoading: false,
      option: tableOption, // 表格配置
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      uploadForm: {},
      uploadOption: { // 对应表单设置
        labelWidth: '80px',
        submitBtn: false,
        emptyBtn: false,
        btnHide: true,
        cancal: false,
        column: [
          {
            label: '桶名',
            prop: 'bucketName',
            type: 'select',
            dicData: [],
            search: true,
            filterable: true,
            allowcreate: true,
            rules: [
              { required: true, message: "请选择桶名", trigger: "blur" },
            ]
          },
          {
            label: '标签',
            prop: 'label',
            dicData: [],
          }
        ]
      },
      fileList: [],
      show: false,
      dialogVisible: false,
      limitShow: false,
      currentFile: null,
      header: {
        "Authorization": 'Bearer ' + store.getters.access_token
      },
    }
  },
  methods: {
    formChange(e) {
      this.paramData.bucketName = e.bucketName
      this.paramData.label = e.label
    },
    //   获取数据
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getFiles(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      }).catch(e => {
        this.page.total=0
        this.page.currentPage=1
        this.tableData=[]
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
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
      this.fileList = fileList
    },
    successHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.getList()
        this.handleClose()
      }else{
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
    viewItem (row, type) {
      if(['preview', 'copy'].indexOf(type) > -1) {
        preview(row.bucketName, {fileName: row.filePath}).then(res => {
          if(res.data.code == 0) {
            if(type == 'preview') {
              // this.$openUrl(res.data.data, "_blank")
              let url = Base64.encode(res.data.data)
              this.$openUrl(`http://file.preview.jvs.bctools.cn/onlinePreview?url=${url}`, "_blank")
            }
            if(type == 'copy') {
              let input = document.createElement("input");
              input.value = res.data.data;
              document.body.appendChild(input);
              input.select();
              document.execCommand("Copy");
              document.body.removeChild(input);
              // console.log(document.execCommand("Copy"))
              if (document.execCommand("Copy") == true) {
                this.$message.success("复制成功")
              }
            }
          }
        })
      }
      if(type == 'download') {
        this.$openUrl(`/mgr/jvs-auth/bytes/${row.bucketName}?fileName=${row.filePath}`, "_self")
      }
    },
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
    async getBuckConst () {
      await getbuckets().then(res => {
        if(res.data.code == 0) {
          let temp = []
          for(let i in res.data.data) {
            temp.push({
              label: res.data.data[i],
              value: res.data.data[i]
            })
          }
          this.option.column.filter(item => {
            if(item.prop == "bucketName") {
              item.dicData = temp
            }
          })
          this.uploadOption.column.filter(item => {
            if(item.prop == "bucketName") {
              item.dicData = temp
            }
          })
        }
      })
    },
    async getFileConst () {
      await getfileTypes().then(res => {
        if(res.data.code == 0) {
          let temp = []
          for(let i in res.data.data) {
            temp.push({
              label: res.data.data[i],
              value: res.data.data[i]
            })
          }
          this.option.column.filter(item => {
            if(item.prop == "fileType") {
              item.dicData = temp
            }
          })
        }
      })
    },
    handleClose () {
      this.limitShow = false
      this.$refs.uploadBtn.clearFiles()
      this.dialogVisible = false
      this.currentFile = null
    },
    submitFile () {
      this.$refs['ruleForm'].submitForm('ruleForm');
    },
    handleSubmit() {
      this.$refs.uploadBtn.submit()
    }
  },
  async created () {
    await this.getBuckConst()
    await this.getFileConst()
    this.show = true
  }
}
</script>
<style lang="scss" scoped>

</style>
