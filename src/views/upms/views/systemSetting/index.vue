<template>
  <div class="system-setting">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      class="form-fullscreen-dialog system-setting-no-header-dialog"
      fullscreen
      :close-on-press-escape="false"
    >
      <tenantForm v-if="show" submitType="edit" :rowData="form" permisionFlag="upms_systemSetting_save"></tenantForm>
    </el-dialog>
  </div>
</template>
<script>
import tenantForm from '../tenant/tenantForm'
import { getStore } from "@/util/store.js";
import {getTenantInfo} from './api'
export default {
  components: {tenantForm},
  data(){
    return {
      form: {
        loginTypes: []
      },
      title: "基础设置",
      show: false,
      dialogVisible: true
    }
  },
  created () {
    getTenantInfo().then(res => {
      if(res.data.code == 0) {
        this.show = true
        this.form = JSON.parse(JSON.stringify(res.data.data))
        this.$set(this.form, 'password', "******")
      }else{
        if(getStore({name: 'tenantInfo'})) {
          this.form = JSON.parse(JSON.stringify(getStore({name: 'tenantInfo'})))
        }else{
          this.form = {
            loginTypes: []
          }
        }
        this.show = true
      }
    })
  }
}
</script>
<style lang="scss">
.system-setting-no-header-dialog{
  .el-dialog__headerbtn{
    display: none;
  }
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      width: 100%;
      left: 0;
      padding: 0;
    }
  }
}
</style>