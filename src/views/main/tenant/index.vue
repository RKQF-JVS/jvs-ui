<template>
  <el-dialog
      v-if="dialogVisible"
      class="choose-tenant-dialog"
      :visible.sync="dialogVisible"
      fullscreen
      append-to-body
    >
      <div class="tenant-body">
        <pageheader title="选择要进入的公司"></pageheader>
        <section style="margin: 10px 10px;">同一个用户识别到有多个公司都存在此帐号，请选择你要进入的公司后台。</section>
        <div class="user-tenant-list">
          <p v-for="item in usertenantList" :key="'tenant-item'+item.id" @click="tenantLoginHandle(item)">
            <img v-if="item.logo" :src="item.logo" alt="" />
            <span v-else class="empty-logo-image">
              <i class="el-icon-office-building"></i>
            </span>
            <span>{{item.shortName}}</span>
          </p>
        </div>
      </div>
      <div class="loading-back" v-if="loading"></div>
    </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import pageheader from '@/components/page-header/PageHeader'
import {tenantLogin} from '@/api/login'
import bus from '@/util/vuebus'
export default {
  components: {pageheader},
  props: {
    usertenantList: {
      type: Array
    },
    needReload: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  data() {
    return {
      dialogVisible: false, // 租户列表弹框
      loading: false,
      curUser: null,
      socket: null
    }
  },
  methods: {
    init () {
      this.dialogVisible = true
      this.$store.commit("SET_SYSTEM", "");
    },
    // 切换租户登录
    tenantLoginHandle (item) {
      if(item.id) {
        this.loading = true
        tenantLogin(item.id).then(res => {
          if(res.data.code == 0) {
            this.loading = false
            let data = res.data.data;
            this.$store.commit("SET_JTI", data.jti);
            this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
            this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
            this.$store.commit("SET_EXPIRES_IN", data.expires_in);
            this.$store.commit("CLEAR_LOCK");
            this.$store.commit("SET_USER_INFO", data.userDto);
            this.$store.commit("SET_ROLES", data.roles || []);
            this.$store.commit("SET_PERMISSIONS", data.permissions || []);

            this.$store.commit("SET_TENANTId", item.id);
            this.$store.commit("DEL_ALL_TAG"); // 关闭之前打开的所有tag
            this.$store.commit("SET_THEME_NAME", ""); // 清除主题
            this.$store.commit("SET_TENANTINFO", item)
            // 登录IM
            this.connect(res.data.data.code)
            if(this.needReload) {
              // 刷新页面
              this.$router.push({ path: '/' });
              this.$emit('reload', true)
            }else{
              this.$router.push({ path: this.tagWel.value });
            }
          }
        })
      }
    },
    // 连接socket
    connect (code) {
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
      };
      let _this = this
      this.socket.onerror = function (e) {
        if(_this.needReload) {
          // 刷新页面
          _this.$emit('reload', true)
        }else{
          _this.$router.push({ path: _this.tagWel.value });
        }
      };
      this.socket.onclose = function (e) {
        this.curUser = null;
      };
      this.socket.onmessage = function (e) {
        var data = e.data;
        var dataObj = eval("(" + data + ")");//转换为json对象
        if (dataObj.code == 10000) {
          if(dataObj.command == 22) {
            bus.$emit('notice', dataObj.data);
            console.log(dataObj)
          }
        }else{
          console.log(e)
        }
      };
    }
  }
}
</script>
<style lang="scss">
  .choose-tenant-dialog{
    .el-dialog{
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding: 0;
        .tenant-body{
          width: 70%;
          position: absolute;
          top: 5%;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto
        }
        .user-tenant-list{
          display: flex;
          flex-wrap: wrap;
          padding: 0 10px;
          p{
            width: 22%;
            height: 120px;
            border: 1px solid #EFEFEF;
            border-radius: 5px;
            overflow: hidden;
            margin: 0;
            padding: 0;
            margin-top: 10px;
            margin-bottom: 15px;
            cursor: pointer;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
            img{
              display: block;
              width: 200px;
              height: 50px;
              margin-bottom: 10px;
              border: 0;
              background: #868BA1;
            }
            .empty-logo-image{
              display: block;
              width: 200px;
              height: 60px;
              margin-bottom: 15px;
              background: #F6F6F6;
              i{
                font-size: 24px;
                line-height: 60px;
                text-align: center;
                color: #868BA1;
              }
            }
            span{
              display: block;
              width: 200px;
              color: #fff;
              text-align: center;
              color: #333333;
            }
          }
          p:nth-of-type(4n+2) {
            margin-left: 4%;
            margin-right: 4%;
          }
          p:nth-of-type(4n+3) {
            margin-right: 4%;
          }
          p:hover{
            border-color: #2E6CFF;
          }
        }
        .user-tenant-list::-webkit-scrollbar{
          display: none;
        }
        .loading-back{
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 300px 240px;
        }
      }
    }
  }
</style>
