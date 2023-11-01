<template>
  <div class="wx-login-index"></div>
</template>
<script>
import { client_id } from "@/const/const"
export default {
  name: 'wx-login-index',
  data() {
    return {}
  },
  created() {
    this.$openUrl(`/auth/just/login/WECHAT_ENTERPRISE_WEB?client_id=${client_id}&url=${location.origin}/%23/login/enterpriseWechat`, '_self')
  }
}
</script>
<style lang="scss" scoped>

</style>