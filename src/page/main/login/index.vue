<template>
  <div
    class="login-container"
    :style="background"
  >
    <div
      class="jvs-home"
      v-if="loadingShow"
      style="position: absolute;top: 0;left: 0;width: 100%;height: 100vh;"
    >
      <div class="jvs-home__main">
        <img
          class="jvs-home__loading_gif"
          :src="loadingImgSrc"
          alt="loading"
        >
        <!-- <img class="jvs-home__loading" :src="loadingImgSrc" alt="loading"> -->
        <div class="jvs-home__title">
          正在加载资源
        </div>
        <div class="jvs-home__sub-title">
          初次加载资源可能需要较多时间 请耐心等待
        </div>
      </div>
    </div>
    <img class="login-logo-picture" :src="logoV2Pic" alt="">
  </div>
</template>
<script>
import "@/styles/login.scss";
import userLogin from "./userlogin";
// import { getBase } from "@/api/admin/home";
import { mapGetters } from "vuex";
import loadingGifImg from '../../../../public/jvs-ui-public/img/loading.gif'
import logoV2 from '@/styles/login/jvslogo.png'
import {getDomain} from '@/api/login'

export default {
  name: 'login-index',
  components: {
    userLogin
  },
  data () {
    return {
      activeName: "user",
      imgSrc: "低代码平台",
      title: "低代码平台",
      background: "background",
      name: "login",
      sysInfo: {},
      loadingImgSrc: loadingGifImg,
      loadingShow: false,
      logoV2Pic: logoV2
    };
  },
  watch: {},
  created () {
    let headList = document.getElementsByTagName('head')[0].children
    for(let i in headList) {
      if(headList[i].type == 'image/x-icon') {
        headList[i].href = " "
      }
    }
    // 获取域名相关设置
    this.getDomainHandle()
  },
  mounted () { },
  computed: {
    ...mapGetters(["website", "tagWel"])
  },
  props: [],
  methods: {
    // 连接socket
    connect (code, dialog) {
      if (this.curUser) {
        console.log("用户对象", JSON.stringify(this.curUser))
        this.$message.warning("当前已登录,请先退出登录!")
        return
      }
      var ip = location.host
      var port = '10000'
      this.socket = new WebSocket("wss://" + ip + "/im/?logType=0&value=" + code); // + ":" + port
      this.socket.onopen = function (e) {
        // console.log(e)
        dialog.handleClose()
      };
      let _this = this
      this.socket.onerror = function (e) {
        dialog.handleClose()
        _this.loginToPath()
      };
      this.socket.onclose = function (e) {
        this.curUser = null;
      };
      this.socket.onmessage = function (e) {
        var data = e.data;
        var dataObj = eval("(" + data + ")");//转换为json对象
        if (dataObj.code == 10000) {
          if(dataObj.command == 6) {
            console.log('IM连接成功...')
            dialog.handleClose()
            _this.loginToPath()
          }
          if(dataObj.command == 22) {
            bus.$emit('notice', dataObj.data);
            console.log(dataObj)
          }
        }else{
          console.log(e)
        }
        if(!e) {
          dialog.handleClose()
          _this.loginToPath()
        }
      };
    },
    /**
     * 打开登录
     */
    openLogin() {
      if(this.$route.path != '/wel/index') {
        this.$openLogin({
          right: '150px',
          successClose: false,
          queryData: this.$route.query ? this.$route.query : null,
          afterLogin: (dialog, res) => {
            console.log('登录提交。。。。。')
            // 登录IM
            try {
              this.connect(res.code, dialog)
            } catch (error) {
              dialog.handleClose()
              this.loginToPath()
            }
          },
          afterRegister: () => {
            console.log('注册提交。。。。。')
          }
        })
      }
    },
    // 登陆后跳转
    loginToPath () {
      let path = sessionStorage.getItem('lastUrl')
      if(path) {
        this.$openUrl(path, '_self')
      }else{
        this.$router.push({ path: (this.tagWel && this.tagWel.value) ? this.tagWel.value : '/wel/index' });
      }
    },
    // 获取域名对应设置信息
    async getDomainHandle () {
      this.background = "background:none;"
      this.logoV2Pic = ""
      document.title = ""
      await getDomain().then(res => {
        if(res.data && res.data.code == 0) {
          if(res.data.data){
            if(res.data.data.bgImg) {
              this.background = `background-image:url("${res.data.data.bgImg}");`
            }
            if(res.data.data.logo) {
              this.logoV2Pic = res.data.data.logo
            }
            if(res.data.data.name) {
              document.title = res.data.data.name
            }
            if(res.data.data.icon) {
              var link = document.createElement('link')
              link.type = 'image/x-icon'
              link.rel = 'shortcut icon'
              link.href = res.data.data.icon
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            this.openLogin()
          } else {
            // this.openLogin()
            this.$router.push({ path: '/404' });
          }
        } else {
          this.$router.push({ path: '/404' });
        }
      }).catch(err => {
        this.$router.push({ path: '/404' });
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.login-logo-picture{
  position: absolute;
  top: 50px;
  left: 90px;
  height: 100px;
}
</style>

