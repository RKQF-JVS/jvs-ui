<template>
  <el-dialog
    :class="{'invite-user-box': true, 'invite-user-box-mobile': isMobileBool}"
    v-if="dialogVisible"
    :fullscreen="isMobileBool"
    :modal="!isMobileBool"
    append-to-body
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :style="tenantInfo.bgImg ? ('background-image: url('+ tenantInfo.bgImg +')' ): ''"
  >
    <div v-if="showSuccess">
      <h3 class="title" v-if="!isMobileBool">您收到一个组织邀请</h3>
        <div class="invite-user-top">
          <div class="left">
            <img v-if="userInfo.headImg" :src="userInfo.headImg">
            <span>{{userInfo.realName}}邀请您加入{{tenantInfo.name}}</span>
          </div>
          <div v-if="tenantInfo.logo" class="right">
            <img :src="tenantInfo.logo" >
          </div>
        </div>
        <div class="invite-user-center">
          <section>致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界:让无处不在的联接，成为人人平等的权利，成为智能世界的前提和基础;为世界提供最强算力，让云无处不在，让智能无所不及;所有的行业和组织，因强大的数字平台而变得敏捷、高效、生机勃勃;通过AI重新定义体验，让消费者在家居、出行、办公、影音娱乐、运动健康等全场景获得极致的个性化智慧体验。</section>
        </div>
        <div class="invite-user-bottom">
          <jvs-form :option="option" :formData="form" @submit="submitHandle">
            <template slot="formButton">
              <jvs-button size="mini">拒绝</jvs-button>
            </template>
          </jvs-form>
        </div>
    </div>
    <div v-else class="mobile-show">
      <span>正在开发中...</span>
    </div>
  </el-dialog>
</template>
<script>
import {isMobile} from '@/util/validate'
import {getTenantInfo} from './api'
import { mapGetters } from 'vuex'
import { getStore } from "@/util/store.js";
export default {
  computed: {
    ...mapGetters(["tagWel"])
  },
  data () {
    var validatePhone = (rule, value, callback) => {
      if(isMobile(value)) {
        callback();
      }else{
        callback(new Error('请输入正确的手机号'));
      }
    };
    return {
      isMobileBool: false, // 是否为移动端
      dialogVisible: true,
      form: {},
      option: {
        cancal: false,
        emptyBtn: false,
        submitBtnText: '加入',
        submitLoading: false,
        column: [
          {
            label: '',
            prop: 'realName',
            placeholder: '姓名',
            span: 12,
            rules: [{ required: true, message: "请输入姓名", trigger: "blur" },]
          },
          {
            label: '',
            prop: 'phone',
            placeholder: '手机号',
            span: 12,
            rules: [
              { required: true, message: "请输入手机号", trigger: "blur" },
              { validator: validatePhone, trigger: ['blur', 'change']}
            ]
          },
          {
            label: '',
            prop: 'tip',
            span: 23,
            type: 'p',
            fontsize: 12,
            text: '填写的信息仅用于同事识别真实身份和安全验证，不会泄露您的个人信息或用于其他用途',
            textcolor: '#BFBFBF'
          }
        ]
      },
      userInfo: {},
      tenantInfo: {},
      invite: '',
      showSuccess: true
    }
  },
  methods: {
    isMobile () {
      if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
      }else{
        return false; // PC端
      }
    },
    getTenantInfoHandle (key) {
      key = decodeURI(key)
      getTenantInfo({key: key}).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.user){
            this.userInfo = res.data.data.user
          }
          if(res.data.data.tenant){
            this.tenantInfo = res.data.data.tenant
          }
        }
      }).catch(e => {
        this.dialogVisible = false
      })
    },
    submitHandle (form) {
      form.invite = this.invite
      form.id = this.tenantInfo.id
      form.loginType = 'invite'
      this.option.submitLoading = true
      this.$store.dispatch("LoginByUsername", Object.assign({}, form)).then((data) => {
        this.setUserInfoData(data)
        this.option.submitLoading = false

      }).catch(() => {
        this.option.submitLoading = false
      })
    },
    // 加入成功后写入数据
    setUserInfoData (data) {
      if(data) {
        if(this.isMobileBool) {
          // this.$router.push({ path: this.tagWel.value });
          this.showSuccess = false
        }else{
          // 已登录直接进首页
          if(getStore({name: 'tenantId'})){
            this.$openUrl('/#/wel/index?fresh=true', '_self')
          }else{ // 未登录写入数据后直接登录
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

            this.$openUrl('/#/wel/index?fresh=true', '_self')
          }
        }
      }
    },
  },
  created () {
    this.isMobileBool = this.isMobile()
    this.option.column.filter(item => {
      if(['realName', 'phone'].indexOf(item.prop) > -1) {
        item.span = this.isMobileBool ? 24 : 12
      }
    })
    document.title = '邀请'
    let temp = location.href.split('?')
    if(temp && temp.length > 1) {
      this.getTenantInfoHandle(decodeURI(temp[1]))
      this.invite = decodeURI(temp[1])
    }
  }
}
</script>
<style lang="scss">
.invite-user-box{
  background-size: cover;
  background-repeat: no-repeat;
  .el-dialog{
    .el-dialog__header{
      display: none!important;
    }
    .el-dialog__body{
      padding: 0 20px;
      overflow: hidden;
    }
  }
  .title{
    color: #333333;
    font-size: 18px;
    padding: 20px 0;
    text-align: center;
    font-weight: normal;
    border-bottom: 1px solid #DCDFE6;
  }
  .invite-user-top{
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 0;
    border-bottom: 1px solid #DCDFE6;
    .left{
      display: flex;
      align-items: center;
      img{
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
      }
      span{
        margin-left: 10px;
        color: #333;
        font-size: 16px;
      }
    }
    .right{
      background: #F6F6F6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0 32px;
      img{
        display: block;
        width: 248px;
        height: 46px;
      }
    }
  }
  .invite-user-center{
    padding: 25px 0;
    section{
      font-size: 16px;
      color: #333333;
      line-height: 30px;
    }
  }
  .invite-user-bottom{
   .el-form{
     .el-row{
      .el-col-12{
        display: flex;
        margin-bottom: 0;
        .form-item-no-label{
          width: 90%;
        }
      }
      .el-col-12:nth-of-type(2n) {
        justify-content: flex-end;
      }
      .el-col-23{
        .form-item-no-label{
          margin-bottom: 0;
          .el-form-item__content{
            line-height: 0px;
          }
        }
      }
     }
   }
  }
}
.invite-user-box-mobile{
  .el-dialog.is-fullscreen{
    width: 100%!important;
    .el-dialog__body{
      padding: 0 15px;
      .invite-user-top{
        flex-direction: column-reverse;
        justify-content: flex-end;
        height: auto;
        padding: 15px 0;
        overflow: hidden;
        .left, .right{
          width: 100%;
        }
        .left{
          margin-top: 14px;
        }
        .right{
          padding: 8px 0;
          img{
            width: 70%;
          }
        }
      }
      .invite-user-center{
        section{
          font-size: 14px;
          text-indent: 20px;
        }
      }
      .invite-user-bottom{
        .el-form{
          .el-row{
            .el-col-23{
              .form-item-no-label{
                .el-form-item__content{
                  line-height: initial;
                }
              }
            }
            .el-col-24{
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
  .mobile-show{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-image: url(../../../../const/img/emptyImage.png);
    background-position: center;
    background-size: auto;
    background-repeat: no-repeat;
    position: relative;
    background-size: 260px 123px;
    background-repeat: no-repeat;
    background-position: center;
    span{
      font-size: 16px;
      height: 24px;
      text-align: center;
      position: absolute;
      top: calc(50% - 170px);
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      color: #868BA1;
    }
  }
  .invite-user-bottom{
    .el-form{
      .el-input{
        font-size: 16px;
        .el-input__inner{
          height: 36px;
          line-height: 36px;
        }
      }
    }
  }
}
</style>
