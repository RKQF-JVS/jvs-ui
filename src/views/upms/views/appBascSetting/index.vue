<template>
  <div class="app-basic-setting-page">
    <div class="form-title">
      移动端基础配置
      <el-switch
        style="margin-left: 10px;"
        v-model="form.enable">
      </el-switch>
    </div>
    <div class="form-explain">通过配置图片，显示信息，可直接修改移动端H5、小程序、企业微信的功能展示。</div>
    <div v-show="form.enable" style="width: 50%;">
      <div class="form-title">
        关于系统
      </div>
      <el-form size="mini" ref="ruleForm" :rules="rules" :model="form" label-position="top" label-width="100px">
        <el-form-item label="logo" prop="logo">
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
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" @click.stop="imgClick" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span slot="tip" class="el-upload__tip">建议 80 * 80</span>
          </el-upload>
          <i v-if="form.logo" class="el-icon-delete delImg" @click="logoRemove(null, [])"></i>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="官方微信号" prop="wx">
          <el-input v-model="form.wx"></el-input>
        </el-form-item>
        <el-form-item label="客服电话号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <div class="form-title">Banner</div>
        <el-form-item label="工作台" prop="workBanner">
          <el-upload
            ref="logoUpload"
            class="avatar-uploader"
            action="/mgr/jvs-auth//upload/jvs-public"
            :limit="1"
            list-type="picture"
            :file-list="workFileList"
            accept=".jpg,.jpeg,.png"
            :show-file-list="false"
            :on-remove="workRemove"
            :headers="headers"
            :on-success="workSuccessHandle"
            :on-error="workErrHandle"
          >
            <img v-if="form.workBanner" :src="form.workBanner" class="avatar" @click.stop="imgClick" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span slot="tip" class="el-upload__tip">建议 350 * 100</span>
          </el-upload>
          <i v-if="form.workBanner" class="el-icon-delete delImg" @click="workRemove(null, [])"></i>
        </el-form-item>
        <el-form-item label="应用中心" prop="appBanner">
          <el-upload
            ref="logoUpload"
            class="avatar-uploader"
            action="/mgr/jvs-auth//upload/jvs-public"
            :limit="1"
            list-type="picture"
            :file-list="appFileList"
            accept=".jpg,.jpeg,.png"
            :show-file-list="false"
            :on-remove="appRemove"
            :headers="headers"
            :on-success="appSuccessHandle"
            :on-error="appErrHandle"
          >
            <img v-if="form.appBanner" :src="form.appBanner" class="avatar" @click.stop="imgClick" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span slot="tip" class="el-upload__tip">建议 350 * 100</span>
          </el-upload>
          <i v-if="form.appBanner" class="el-icon-delete delImg" @click="appRemove(null, [])"></i>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="form.enable" class="footer-btn">
      <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>

import {setConfig, getConfig} from "@/views/upms/views/appBascSetting/api";
import store from "@/store";

export default {
  name: "appBasicSetting",
  components: {
  },
  data () {
    const logoPass = (rule, value, callback) => {
      if (!this.form.logo) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    };
    const appBannerPass = (rule, value, callback) => {
      if (!this.form.appBanner) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    };
    const workBannerPass = (rule, value, callback) => {
      if (!this.form.workBanner) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    };
    return {
      headers: {
        Authorization: ('Bearer '+this.$store.getters.access_token)
      },
      logoFileList: [],
      workFileList: [],
      appFileList: [],
      form: {
        enable: false
      },
      rules: {
        logo: [
          { validator: logoPass, trigger: 'change' }
        ],
        appBanner: [
          { validator: appBannerPass, trigger: 'change' }
        ],
        workBanner: [
          { validator: workBannerPass, trigger: 'change' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        wx: [
          { required: true, message: '请输入官方微信号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入客服电话号码', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    imgClick () {
      // 点击图片不再上传
    },
    getConfig() {
      const params = {
        name: 'APPBASCSETTING',
      }
      getConfig(params).then(res => {
        if (res.data && res.data.code == 0) {
          this.form = JSON.parse(JSON.stringify(res.data.data)) || {}
          // this.form.enable = this.form.enable == 'true'
          this.$set(this.form, 'enable', this.form.enable == 'true')
        }
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // const params = {
          //   content: this.form,
          //   name: 'APPBASCSETTING',
          //   role: true,
          // }
          const tenantId = store.state.common.tenantId
          setConfig(this.form, tenantId).then(res => {
            if (res.data && res.data.code == 0) {
              this.$message.success('保存成功')
            }
          })
        } else {
          return false
        }
      })
    },
    logoSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.form.logo = res.data.fileLink
        this.$nextTick(() => {
          this.$refs.ruleForm.validateField('logo')
        })
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
      this.form.logo = ""
    },
    workSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.form.workBanner = res.data.fileLink
        this.workFileList = [{
          url: res.data.fileLink
        }]
      }else{
        this.$refs.logoUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    workErrHandle (err, file, fileList) {
      this.$refs.logoUpload.clearFiles()
      this.$message.error(err)
    },
    workRemove (file, fileList) {
      this.workFileList = fileList
      this.form.workBanner = ""
    },
    appSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.form.appBanner = res.data.fileLink
        this.appFileList = [{
          url: res.data.fileLink
        }]
      }else{
        this.$refs.logoUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    appErrHandle (err, file, fileList) {
      this.$refs.logoUpload.clearFiles()
      this.$message.error(err)
    },
    appRemove (file, fileList) {
      this.appFileList = fileList
      this.form.appBanner = ""
    },
  }
}
</script>

<style lang="scss" scoped>
.app-basic-setting-page {
  padding: 20px;
  border-radius: 6px;
  background-color: #ffffff;
  height: calc(100vh - 30px);
  overflow-y: auto;
  /deep/.el-form-item{
    padding: 0 32px;
  }
  .form-title{
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
  }
  .form-explain{
    color: #a2a3a5;
    margin-bottom: 32px;
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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .delImg{
    position: absolute;
    left: 102px;
    top: 5px;
    z-index: 999;
    cursor: pointer;
  }
  .footer-btn{
    width: 100%;
    text-align: center;
  }
}
</style>
