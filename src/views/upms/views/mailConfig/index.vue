<template>
  <div class="short-message-page">
    <div class="form-title">
      邮箱配置
      <el-switch
        style="margin-left: 10px;"
        v-model="emailForm.enable">
      </el-switch>
    </div>
    <el-alert
      :closable="false"
      type="info">
      <template slot="title">
        <div class="alert-box">
          <i class="el-icon-info"/>
          <span>邮箱配置后，可使用集成&自动化灵活配置发送邮件内容，或发送用户邀请邮件！</span><span style="color: #3471ff;cursor: pointer;">如何获取配置</span>
        </div>
      </template>
    </el-alert>
    <el-form v-show="emailForm.enable" style="width: 520px;" size="mini" ref="ruleForm" :rules="rules" :model="emailForm" label-position="top" label-width="100px">
      <el-form-item label="from" prop="from">
        <el-input maxlength="32" show-word-limit placeholder="from" v-model="emailForm.from"></el-input>
      </el-form-item>
      <el-form-item label="host" prop="host">
        <el-input maxlength="32" show-word-limit placeholder="host" v-model="emailForm.host"></el-input>
      </el-form-item>
      <el-form-item label="pass" prop="pass">
        <el-input maxlength="32" show-password show-word-limit placeholder="pass" v-model="emailForm.pass"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="emailForm.enable" class="footer-btn">
      <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>

import {getMailConfig, saveMailConfig} from "./api";
import store from "@/store";

export default {
  name: "EmailConfig",
  components: {
  },
  data () {
    return {
      emailForm: {
        enable: false
      },
      rules: {
        from: [
          { required: true, message: '请输入from', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入host', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入pass', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getSMSConfig()
  },
  methods: {
    getSMSConfig() {
      getMailConfig().then(res => {
        if (res.data && res.data.code == 0) {
          this.emailForm = JSON.parse(JSON.stringify(res.data.data))
          this.$set(this.emailForm, 'enable', this.emailForm.enable == 'true')
        }
      })
    },
    onSubmit() {
      const tenantId = store.state.common.tenantId
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          saveMailConfig(this.emailForm, tenantId).then(res => {
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
