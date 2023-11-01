<template>
  <div :class="{'empty-back-loading-page': true, 'empty-back-choose-page': showTenant}"></div>
</template>
<script>
import * as dd from 'dingtalk-jsapi'
export default {
  data() {
    return {
      code: '',
      showType: '',
      showTenant: false
    }
  },
  created() {
    if(this.$route && this.$route.query && this.$route.query.corpId) {
      let _this = this
      let query = this.$route.query
      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId: _this.$route.query.corpId, // 企业id
          onSuccess: function (info) {
            _this.code = info.code; // 通过该免登授权码可以获取用户身份
            _this.showType = 'login'
            _this.$store.dispatch("LoginByUsername", Object.assign({code: info.code, loginType: 'DINGTALK_INSIDE'}, query)).then((data) => {
              localStorage.setItem('loginRandom', '')
              _this.getTenantByUserList(data)
            }).catch((err) => {
              _this.$router.push({path: '/login'})
            })
          },
          onFail : function(err) {}
        })
      })
    }
  },
  methods: {
    // 获取该用户下所有的租户列表
    getTenantByUserList (data) {
      let list = []
      if(data.userDto && data.userDto.tenants) {
        list = data.userDto.tenants
        if(list.length > 0) {
          // 只有一个租户 或指定租户 直接进去
          if(list.length == 1 || (data.userDto.tenantId && data.userDto.tenant)) {
            this.$store.commit("SET_SwitchTenant", false)
            this.setUserInfoData(data)
          }else{
            this.$store.commit("SET_SwitchTenant", true)
            this.switchTenant(list)
          }
        }
      }
    },
    // 加入成功后写入数据
    setUserInfoData (data) {
      if(data) {
        this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
        this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
        this.$store.commit("SET_EXPIRES_IN", data.expires_in);
        this.$store.commit("CLEAR_LOCK");
        this.$store.commit("SET_USER_INFO", data.userDto);
        this.$store.commit("SET_ROLES", data.roles || []);
        this.$store.commit("SET_PERMISSIONS", data.permissions || []);
        this.$store.commit("SET_TENANTId", data.userDto.tenantId);
        this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
        this.$store.commit("SET_THEME_NAME", ""); // 清除主题
        this.$store.commit("SET_TENANTINFO", data.userDto.tenant)

        this.$router.push({ path: '/wel/index' });
      }   
    },
    // 选择租户登录
    switchTenant (list) {
      let obj = {
        successClose: false,
        switchTenant: true,
        switchList: list,
        afterLogin: (dialog, res) => {
          dialog.handleClose()
          this.$router.push({ path: '/wel/index' });
        }
      }
      this.showTenant = true
      this.$openLogin(obj)
    }
  }
};
</script>
<style lang="scss" scoped>
.empty-back-loading-page{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.8);
  background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-position: center;
  background-size: 200px 160px;
}
.empty-back-choose-page{
  background: rgba(0, 0, 0, .3);
}
</style>