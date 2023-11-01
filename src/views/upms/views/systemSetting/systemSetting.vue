<template>
  <div class="system-setting-page">
    <div class="system-setting-form">
      <h4>基础设置</h4>
      <el-form ref="ruleForm" size="mini" :rules="rules" label-position="top" label-width="80px" :model="formData">
        <el-form-item label="系统名称" prop="shortName">
          <el-input v-model="formData.shortName" maxlength="20" show-word-limit></el-input>
          <span style="font-size: 12px;color: #a2a3a5;line-height: 20px">系统名称建议使用10字汉字，此名称将被作为登录页、页面标题、首页信息展示。</span>
        </el-form-item>
        <el-form-item label="公司全称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="登录域名" prop="loginDomain" v-show="false">
          <el-input v-model="formData.loginDomain"></el-input>
          <span style="font-size: 12px;color: #a2a3a5;line-height: 20px">请填写50位以内英文字符</span>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="formData.addr"></el-input>
        </el-form-item>
        <el-form-item label="公司简介">
          <el-input v-model="formData.descMsg"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <jvs-button type="primary" @click="handleSubmit">保存</jvs-button>
        <jvs-button @click="handleReset">重置</jvs-button>
      </div>
    </div>
    <div class="system-setting-form" v-show="false">
      <h4>页面配置</h4>
      <el-form class="config-form" ref="ruleForm" :inline="true" size="mini" :rules="rules" label-position="top" label-width="80px" :model="formData">
        <el-form-item label="ICON" prop="icon" style="margin-right: 8vw">
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
          >
            <img v-if="iconFileList.length > 0 && iconFileList[0].url" :src="iconFileList[0].url" class="avatar" @click.stop="imgClick">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span slot="tip" class="el-upload__tip">建议 32 * 32</span>
          </el-upload>
          <i v-if="iconFileList.length > 0 && iconFileList[0].url" class="el-icon-delete delImg" @click="iconRemove(null, [])"></i>
        </el-form-item>
        <el-form-item label="LOGO" prop="logo" style="margin-right: 8vw">
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
            <img v-if="logoFileList.length > 0 && logoFileList[0].url" :src="logoFileList[0].url" class="avatar" @click.stop="imgClick">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span slot="tip" class="el-upload__tip">建议 200 * 60</span>
          </el-upload>
          <i v-if="logoFileList.length > 0 && logoFileList[0].url" class="el-icon-delete delImg" @click="logoRemove(null, [])"></i>
        </el-form-item>
        <el-form-item label="背景图" prop="bgImg">
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
          >
            <img v-if="bgFileList.length > 0 && bgFileList[0].url" :src="bgFileList[0].url" class="avatar" @click.stop="imgClick">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <span v-show="bgImgLimit" style="display:block;color: #F56C6C;">图片大小不能超过20M</span>
              <span>建议 1920 * 1080</span>
            </div>
          </el-upload>
          <i v-if="bgFileList.length > 0 && bgFileList[0].url" class="el-icon-delete delImg" @click="bgRemove(null, [])"></i>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <jvs-button type="primary" @click="handleSubmit">保存</jvs-button>
        <jvs-button @click="handleReset">重置</jvs-button>
      </div>
    </div>
  </div>
</template>

<script>
import {getTenantInfo} from "@/views/upms/views/systemSetting/api";
import {getStore} from "@/util/store";
import {decryption, encryption} from "@/util/util";
import {enCodeKey} from "@/const/const";
import {addTenant, editTenant} from "@/views/upms/api/tenant";

export default {
  name: "systemSetting",
  data(){
    return {
      submitType: 'edit',
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: ('Bearer '+this.$store.getters.access_token)
      },
      iconFileList: [],
      logoFileList: [],
      bgFileList: [],
      bgImgLimit: false, // 背景图大小限制
      userForm: {},
      rules: {
        shortName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入公司全称', trigger: 'blur' }
        ],
        loginDomain: [
          { required: false, message: '请输入登录域名', trigger: 'blur' },
          { pattern: /^[a-z]{0,50}$/, message: '格式错误' }
        ],
      },
      formData: {
        loginTypes: []
      },
      title: "基础设置",
      show: false,
      dialogVisible: true,
      formDataTemp: {},
      userFormTemp: {},
    }
  },
  created () {
  },
  mounted() {
    this.getFormData()
  },
  methods: {
    // 获取表单数据
    getFormData() {
      getTenantInfo().then(res => {
        if(res.data.code == 0) {
          this.formData = JSON.parse(JSON.stringify(res.data.data))
          this.userForm = JSON.parse(JSON.stringify(res.data.data))
          // this.formDataTemp = JSON.parse(JSON.stringify(res.data.data))
          // this.userFormTemp = JSON.parse(JSON.stringify(res.data.data))
          if(this.userForm.loginTypes) {
            this.loginTypesChange(this.userForm.loginTypes)
          }
          if(this.userForm.appId) {
            this.userForm = decryption({
              data: this.userForm,
              key: enCodeKey,
              param: ["appId"]
            });
          }
          if(this.userForm.secret) {
            this.userForm = decryption({
              data: this.userForm,
              key: enCodeKey,
              param: ["secret"]
            });
          }
          if(this.userForm.icon) {
            this.iconFileList.push({url: this.userForm.icon})
          }
          if(this.userForm.bgImg) {
            this.bgFileList.push({url: this.userForm.bgImg})
          }
          if(this.userForm.logo) {
            this.logoFileList.push({url: this.userForm.logo})
          }
          this.$set(this.formData, 'password', "******")
        }else{
          this.userForm = {
            loginTypes: []
          }
          if(getStore({name: 'tenantInfo'})) {
            this.formData = JSON.parse(JSON.stringify(getStore({name: 'tenantInfo'})))
          }else{
            this.formData = {
              loginTypes: []
            }
          }
        }
      })
    },
    // 表单重置
    handleReset() {
      // this.formData = JSON.parse(JSON.stringify(this.formDataTemp))
      // this.userForm = JSON.parse(JSON.stringify(this.userFormTemp))
      this.$refs.ruleForm.resetFields();
    },
    // 表单提交
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let obj = {}
          obj=JSON.parse(JSON.stringify(this.formData))
          obj.roleName=null
          if(obj.password == '******') {
            obj.password = ''
          }else{
            obj = encryption({
              data: obj,
              key: enCodeKey,
              param: ["password"]
            });
          }
          if(obj.appId) {
            obj = encryption({
              data: obj,
              key: enCodeKey,
              param: ["appId"]
            });
          }
          if(obj.secret) {
            obj = encryption({
              data: obj,
              key: enCodeKey,
              param: ["secret"]
            });
          }
          if(!obj.admin) {
            obj.admin = obj.phone
          }
          this.$set(obj, 'icon', this.userForm.icon)
          this.$set(obj, 'bgImg', this.userForm.bgImg)
          this.$set(obj, 'logo', this.userForm.logo)
          // if(!obj.loginDomain) {
          //   obj.loginDomain = 'xxx'
          // }
          if(!obj.loginTypes || obj.loginTypes.length == 0) {
            obj.loginTypes = ['password', 'phone']
          }
          if (this.submitType == 'edit') {
            editTenant(obj).then(res => {
              if (res.data.code==0) {
                if(this.submitType == 'edit') {
                  this.$message.success('保存成功')
                }else{
                  this.$message.success('编辑租户成功')
                }
                this.$emit("close", true)
              }
            }).catch(e => {
            })
          } else {
            addTenant(obj).then(res => {
              if (res.data.code==0) {
                this.$message.success('新增租户成功')
                this.$emit("close", true)
              }
            }).catch(e => {
            })
          }
        } else {
          return false;
        }
      })
    },
    imgClick () {
      // 点击图片不再上传
    },
    bgSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.userForm.bgImg = res.data.fileLink
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
      this.userForm.bgImg = ""
    },
    logoSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.userForm.logo = res.data.fileLink
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
      this.userForm.logo = ""
    },
    icoSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success("上传成功")
        this.userForm.icon = res.data.fileLink
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
      this.userForm.icon = ""
    },
  }
}
</script>

<style lang="scss" scoped>
.system-setting-page{
  background-color: #f6f6f6;
  height: calc(100% - 30px);
  overflow-y: auto;
  padding: 15px;
  /deep/.system-setting-form{
    padding: 10px 30px;
    margin: 0 30vh;
    border-radius: 8px;
    margin-bottom: 20px;
    background-color: #ffffff;
    .footer-btn{
      padding: 20px 0 10px;
      text-align: center;
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
    .el-form{
      padding: 0 80px;
    }
    h4{
      font-size: 16px;
      margin: 10px 0;
      position: relative;
      text-indent: 15px;
    }
    h4::before{
      content: "";
      display: block;
      width: 4px;
      height: 18px;
      background: #3471ff;
      border-radius: 2px;
      position: absolute;
      top: 2px;
      left: 0;
    }
  }
}
</style>
