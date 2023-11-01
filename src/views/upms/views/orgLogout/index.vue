<template>
  <div class="org-logout-page">
    <div>
      <div class="content-icon">
        <i class="el-icon-warning"/>
      </div>
      <div class="content-text">
        <div>解散后，你的后台管理账号和通讯录将会被删除；（如有需要，请先导出数据）</div>
        <div>该操作不可撤销，请谨慎操作。同时删除的包括云盘文件，应用数据（基础平台，知识库，任务，项目，视频会议等），请做好相应的备份。</div>
      </div>
      <div class="footer-btn">
        <jvs-button type="primary" @click="handleTenantLogout">解散组织</jvs-button>
      </div>
    </div>
  </div>
</template>

<script>

import store from "@/store";
import {tenantLogout} from "@/views/upms/views/orgLogout/api";
import {loginoutHandle} from "@/api/admin/home";

export default {
  name: "orgLogout",
  components: {
  },
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
    // 注销组织
    handleTenantLogout() {
      this.$confirm("确认解散组织?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        tenantLogout().then(res => {
          if (res.data && res.date.code == 0) {
            this.handleLogout()
          }
        })
      })
    },
    // 退出登录
    handleLogout() {
      loginoutHandle().then(res => {
        if(res.data.code == 0) {
          let path = this.$store.state.common.template || '/login'
          sessionStorage.clear()
          this.$store.dispatch("LogOut")
          this.$router.push({ path: path })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.org-logout-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 6px;
  background-color: #ffffff;
  height: calc(100vh - 40px);
  overflow-y: auto;
  .content-text{
    text-align: center;
    margin: 16px 0;
    div{
      font-size: 14px;
      line-height: 32px;
    }
  }
  .content-icon{
    text-align: center;
    i{
      font-size: 160px;
      color: #fc610d;
    }
  }
  .footer-btn{
    text-align: center;
  }
}
</style>
