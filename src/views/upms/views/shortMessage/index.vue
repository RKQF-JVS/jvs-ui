<template>
  <div class="short-message-page">
    <div class="form-title">
      短信配置
      <el-switch
        style="margin-left: 10px;"
        v-model="form.enable">
      </el-switch>
    </div>
    <el-alert
      :closable="false"
      type="info">
      <template slot="title">
        <div class="alert-box">
          <i class="el-icon-info"/>
          <span>短信配置后，可发送短信消息，也支持手机号密码登录。</span><span style="color: #3471ff;cursor: pointer;">如何获取配置</span>
        </div>
      </template>
    </el-alert>
    <el-form v-show="form.enable" style="width: 520px;" size="mini" ref="ruleForm" :rules="rules" :model="form" label-position="top" label-width="100px">
      <el-form-item label="accessKeyId" prop="accessKeyId">
        <el-input maxlength="32" show-word-limit placeholder="accessKeyId" v-model="form.accessKeyId"></el-input>
      </el-form-item>
      <el-form-item label="accessKeySecret" prop="accessKeySecret">
        <el-input maxlength="32" show-word-limit placeholder="accessKeySecret" v-model="form.accessKeySecret"></el-input>
      </el-form-item>
      <el-form-item label="签名（signature）" prop="signature">
        <el-input maxlength="32" show-word-limit placeholder="signature" v-model="form.signature"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="form.enable" class="footer-btn">
      <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>

import {getSMSConfig, saveSMSConfig} from "@/views/upms/views/shortMessage/api";
import store from "@/store";

export default {
  name: "shortMessage",
  components: {
  },
  data () {
    return {
      form: {
        enable: false
      },
      rules: {
        accessKeyId: [
          { required: true, message: '请输入accessKeyId', trigger: 'blur' }
        ],
        accessKeySecret: [
          { required: true, message: '请输入accessKeySecret', trigger: 'blur' }
        ],
        signature: [
          { required: true, message: '请输入signature', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getSMSConfig()
  },
  methods: {
    getSMSConfig() {
      getSMSConfig().then(res => {
        if (res.data && res.data.code == 0) {
          this.form = JSON.parse(JSON.stringify(res.data.data))
          this.$set(this.form, 'enable', this.form.enable == 'true')
        }
      })
    },
    onSubmit() {
      const tenantId = store.state.common.tenantId
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          saveSMSConfig(this.form, tenantId).then(res => {
            if (res.data && res.data.code == 0) {
              this.$message.success('保存成功')
              this.getSMSConfig()
            }
          })
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.short-message-page {
  padding: 40px;
  border-radius: 6px;
  background-color: #ffffff;
  //height: calc(100vh - 30px);
  overflow-y: auto;
  /deep/.el-form-item{
    padding: 0 32px;
  }
  /deep/.el-alert--info.is-light{
    width: 50%;
    margin-bottom: 12px;
  }
  .alert-box{
    i{
      margin-right: 8px;
      color: #3471ff;
    }
  }
  .form-title{
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 16px;
  }
  .footer-btn{
    //width: 100%;
    //text-align: center;
  }
}
</style>
