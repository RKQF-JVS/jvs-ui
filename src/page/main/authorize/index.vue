<template>
  <div class="page-box">
    <img style="width: 100%; height: 100%; z-index: 0" src="./back.png"/>
    <div class="center-box"></div>
    <img class="title-img" src="./title.png"/>
    <div class="name-box">风控小工具</div>
    <img class="loading-img" src="./loading.png"/>
    <div class="loading-text">正在跳转中....</div>
  </div>
</template>

<script>
import {loginByUsername, userManager, tenantLogin} from "@/api/login";
import { encryption } from "@/util/util";
import {getTenantInfo} from '@/api/admin/home'
import {mapGetters} from "vuex";

export default {
  name: "index",
  computed: {
    ...mapGetters(["tagWel"])
  },
  data() {
    return {
    }
  },
  created() {
    const params = {
      // tenantId: 1,
      // tenantName: '风控小工具',
      // userName: 'admin'
    }
    const url = window.document.URL.split('/')[2]
    if (url !== 'sccj.cguarantee.com') {
      this.$router.push({path: '/login'})
      return false
    }
    const str = window.document.URL.split('?')[1]
    if (str) {
      const arr = str.split('&')
      arr.forEach((item, index) => {
        params[item.split('=')[0]] = item.split('=')[1]
      })
    }
    sessionStorage.clear();
    userManager(params).then(res => {
      if (res.data && (res.data.code == 0 || res.data.code == 890)) {
        const userInfo = {
          userName: params.userName,
          password: '*IK<9ol.'
          // userName: 'admin',
          // password: '123456'
        }
        const user = encryption({
          data: userInfo,
          key: "ZnJhbWVmcmFtZQ==",
          param: ["password"]
        });
        loginByUsername(user.userName, user.password).then(res => {
          sessionStorage.setItem('jvs-access_token', `{"dataType":"string","content":${res.access_token},"type":"session","datetime":1624432254001}`)
          sessionStorage.setItem('jvs-tenantId', `{"dataType":"string","content":${params.tenantId},"type":"session","datetime":1624432201681}`)
          let data = res.data;
          this.$store.commit("SET_JTI", data.jti);
          this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
          this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
          this.$store.commit("SET_EXPIRES_IN", data.expires_in);
          this.$store.commit("CLEAR_LOCK");
          this.$store.commit("SET_USER_INFO", data.userDto);
          this.$store.commit("SET_ROLES", data.roles || []);
          this.$store.commit("SET_PERMISSIONS", data.permissions || []);

          this.$store.commit("SET_TENANTId", params.tenantId);
          this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
          tenantLogin(params.tenantId).then(res => {
            if(res.data.code == 0) {
              this.loading = false
              setTimeout(() => {
                this.$router.push({ path: this.tagWel.value });
              }, 1000)
            }
          })
          getTenantInfo().then(res => {
            if(res.data.code == 0) {
              this.$store.commit("SET_TENANTINFO", res.data.data)
            }
          })
        })
      }
    })
  }
}
</script>

<style lang="scss">
.page-box {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  .center-box {
    position: absolute;
    top: 20vh;
    left: 20vw;
    width: 60vw;
    height: 60vh;
    background: #000000;
    opacity: 0.1;
    border-radius: 10px;
    z-index: 2;
    display: flex;
  }
  .title-img{
    position: absolute;
    top: 25vh;
    left: 30vw;
    width: 40vw;
  }
  .name-box {
    position: absolute;
    top: calc(35vh + 50px);
    left: 20vw;
    width: 60vw;
    text-align: center;
    font-size: 40px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #FFFFFF;
  }
  .loading-img{
    position: absolute;
    top: 60vh;
    //left: 30vw;
    left: calc(50vw - 15px);
    width: 40px;
    -webkit-animation:load 1.1s infinite linear;
  }
  @-webkit-keyframes load{
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
  .loading-text{
    position: absolute;
    top: calc(60vh + 60px);
    left: 20vw;
    width: 60vw;
    text-align: center;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #FFFFFF;
  }
}
</style>
