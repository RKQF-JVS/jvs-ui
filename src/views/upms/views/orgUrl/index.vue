<template>
  <div class="org-url-page">
    <div class="form-title">
      基本配置
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
          <span>****************</span><span style="color: #3471ff;cursor: pointer;">如何获取配置</span>
        </div>
      </template>
    </el-alert>
    <div class="content-box" v-if="form.enable">
      <jvs-form ref="basicForm" :option="basicOption" :formData="form"></jvs-form>
      <div>
        <el-button type="primary" size="mini" :loading="basicLoading" @click="saveInfoHandle">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>

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
      basicLoading: false,
      basicOption: {
        btnHide: true,
        column: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '域名',
            prop: 'domain'
          },
          {
            label: 'ICON',
            prop: 'icon',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 32 * 32',
              position: 'bottom'
            }
          },
          {
            label: 'LOGO',
            prop: 'logo',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 200 * 60',
              position: 'bottom'
            }
          },
          {
            label: '背景图',
            prop: 'bgImg',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 1920 * 1080',
              position: 'bottom'
            }
          },
        ]
      },
    }
  },
  created() {
  },
  methods: {
    saveInfoHandle() {},
  }
}
</script>

<style lang="scss" scoped>
.org-url-page {
  padding: 40px;
  border-radius: 6px;
  background-color: #ffffff;
  height: calc(100vh - 40px);
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
  .content-box{
    width: 50%;
    padding: 20px 0;
  }
}
</style>
