<template>
  <div v-if="false">
    <p class="login-title">{{(sysInfo && sysInfo.shortName) ? sysInfo.shortName : ''}}</p>
    <el-form
      class="login-form jvs-login-form"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      label-width="0"
    >
      <el-form-item prop="company" v-if="false && !(companyOptions.length == 1)">
        <el-select
          class="tenant-select"
          v-model="loginForm.company"
          @change="tendChange"
          placeholder="请选择"
          style="width:100%;"
          :disabled="companyOptions.length == 1"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.shortName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 账号密码登录 -->
      <el-form-item
        prop="username"
        v-if="loginType == 'namepass'"
        class="no-suffix"
      >
        <el-input
          size="small"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        >
          <i
            slot="prefix"
            class="icon-yonghu"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        v-if="loginType == 'namepass'"
        class="no-suffix"
      >
        <el-input
          size="small"
          @keyup.enter.native="handleLogin"
          :type="passwordType"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
        >
          <i
            class="el-icon-view el-input__icon"
            slot="suffix"
            @click="showPassword"
          ></i>
          <i
            slot="prefix"
            class="icon-mima"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="namecode"
        v-if="false && loginType == 'namepass'"
        class="no-suffix"
      >
        <el-row :span="24">
          <el-col :span="16">
            <el-input
              size="small"
              @keyup.enter.native="handleLogin"
              :maxlength="code.namecodelen"
              v-model="loginForm.namecode"
              auto-complete="off"
              placeholder="请输入验证码"
            >
              <i
                slot="prefix"
                class="icon-yanzhengma"
              ></i>
            </el-input>
          </el-col>
          <el-col :span="8">
            <div class="login-code">
              <span
                class="login-code-img"
                @click="refreshCode"
                v-if="code.type == 'text'"
              >{{code.value}}</span>
              <img
                :src="code.src"
                class="login-code-img"
                @click="refreshCode"
                v-else
              />
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 手机号登录 -->
      <el-form-item
        prop="phone"
        v-if="loginType == 'phone'"
        class="no-suffix"
      >
        <el-input
          size="small"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.phone"
          auto-complete="off"
          placeholder="请输入手机号"
        >
          <i
            slot="prefix"
            class="icon-yonghu"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="code"
        v-if="loginType == 'phone'"
        class="no-suffix"
      >
        <el-row :span="24">
          <el-col :span="14">
            <el-input
              size="small"
              @keyup.enter.native="handleLogin"
              :maxlength="code.len"
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="请输入验证码"
            >
              <i
                slot="prefix"
                class="icon-yanzhengma"
              ></i>
            </el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              class="codebtn"
              size="mini"
              :disabled="yzmobj.disabled"
              @click.native.prevent="getPhoneCode"
            >{{yzmobj.text}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 微信二维码登录 -->
      <!-- <div
        @click="changeType('weixin')"
        class="weixinlogin"
        v-if="loginType != 'weixin'"
      ></div> -->
      <!-- <iframe v-if="loginType == 'weixin'" src="/mgr/jvs-auth/oauth/render/wechat_open" style="margin-left:10px;" scrolling="no"  frameborder="0" height="330"></iframe> -->
      <qr-code
        v-if="loginType === 'weixin' || loginType === 'app'"
        ref="QRCode"
        :ReqType="'login'"
        @submit='loginWX'
      ></qr-code>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click.native="handleLogin"
          class="login-submit"
          :loading="submitLoading"
          v-if="loginType != 'weixin' && loginType != 'app' && loginType != 'third'"
        >登录</el-button>
      </el-form-item>
      <el-row class="btntab">
        <el-button
          type="text"
          size="small"
          v-if="true || loginType != 'namepass' && hasLoginRight('password')"
          @click.native.prevent="changeType('namepass')"
        >账号密码</el-button>
        <el-button
          type="text"
          size="small"
          v-if="true || loginType != 'phone' && hasLoginRight('phone')"
          @click.native.prevent="changeType('phone')"
        >手机号登录</el-button>
        <!-- 重新搞权限！！！！！！！！！！！！！！ -->
        <el-button
          type="text"
          size="small"
          v-if="false && loginType != 'weixin' && hasLoginRight('wx_qr')"
          @click.native.prevent="changeType('weixin')"
        >微信登录</el-button>
        <el-button
          type="text"
          size="small"
          v-if="loginType != 'app' && hasLoginRight('app_qr')"
          @click.native.prevent="changeType('app')"
        >APP登录</el-button>
        <el-button
          type="text"
          size="small"
          v-if="loginType != 'third' && hasLoginRight('third')"
          @click.native.prevent="changeType('third')"
        >第三方登录</el-button>
        <!-- <el-button
          v-if="loginType === 'weixin'"
          type="text"
          size="small"
          @click.native.prevent="changeQrType(qrType!='weixin'?'weixin':'app')"
        >{{qrType!='weixin'?'微信二维码登录':'APP二维码登录'}}</el-button> -->
      </el-row>
      <el-row class="btntab" v-if="true">
        <el-button
          type="text"
          size="small"
          @click.native.prevent="forgetPass"
        >忘记密码</el-button>
      </el-row>
    </el-form>
    <el-dialog
      title="忘记密码"
      append-to-body
      v-if="forgetVisible"
      :visible.sync="forgetVisible"
      :before-close="forgetClose">
      <jvs-form :option="forgetOption" :formData="forgetForm" @submit="forgetSubmit">
        <template slot="codeForm">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <el-input
              size="small"
              @keyup.enter.native="handleLogin"
              :maxlength="code.len"
              v-model="forgetForm.code"
              auto-complete="off"
              placeholder="请输入验证码"
            >
            </el-input>
            <el-button
              size="mini"
              :disabled="forgetObj.disabled"
              style="margin-left: 20px;"
              @click.native.prevent="getForgetCode"
            >{{forgetObj.text}}</el-button>
           </div>
        </template>
      </jvs-form>
    </el-dialog>
    <tenantDialog ref="tenantDialog" :usertenantList="usertenantList"></tenantDialog>
  </div>
</template>

<script>
import { randomLenNum, decryption, encryption } from "@/util/util";
import { mapGetters } from "vuex";
import { getAllTentan, getPhone, getPhoneCode, resetPass, getTenantByUser } from "@/api/login"
import QRcode from "@/components/QRcode/index"
import { codeGetUserInfo } from "@/api/admin/user"
import { wxOpenidLogin, appLogin } from '@/api/login'
import tenantDialog from '@/views/main/tenant/index'
import {enCodeKey} from "@/const/const"
export default {
  name: "userlogin",
  components: { 'qr-code': QRcode, tenantDialog},
  props: {
    companyOptionsList: {
      type: Array
    }
  },
  data () {
    var validateUserName = (rule, value, callback) => {
      if (value.length > 64) {
        callback(new Error('用户名不能超过64位字符'));
      } else {
        if(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
          callback();
        }else{
          callback(new Error('用户名包含中英文、数字和下划线，且不能下划线开头结尾'));
        }
      }
    };
    return {
      loginForm: {
        username: "", // "admin",
        password: "", // "123456",
        code: "",
        redomStr: "",
        // company: 1,
        phone: '',
        wxcode: "",
        namecode: ''
      },
      checked: false,
      code: {
        src: "/code",
        value: "",
        len: 6,
        namecodelen: 4,
        type: "image"
      },
      loginRules: {
        username: [
          { required: true, message: " ", trigger: "blur" },
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: " ", trigger: "blur" },
          // { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: " ", trigger: "blur" },
          { min: 6, max: 6, message: " ", trigger: "blur" }
        ],
        namecode: [
          { required: true, message: " ", trigger: "blur" },
          { min: 4, max: 4, message: " ", trigger: "blur" }
        ],
        phone: [{ required: true, message: " ", trigger: "blur" }]
      },
      passwordType: "password",
      loginType: 'namepass',
      companyOptions: [],
      yzmobj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      forgetObj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      qrType: 'weixin',
      loginTypes: [],
      sysInfo: {},
      forgetVisible: false,
      forgetForm: {},
      forgetOption: {
        cancal: false,
        column: [
          {
            label: "手机号",
            prop: "phone"
          },
          {
            label: "验证码",
            prop: "code",
            formSlot: true
          },
          {
            label: "密码",
            prop: "password"
          },
          {
            label: "确认密码",
            prop: "rePassword"
          }
        ]
      },
      ramdomCode: "", // 忘记密码  随机码
      forgetTimer: null,
      usertenantList: [], // 用户的租户列表
      submitLoading: false
    };
  },
  created () {
    this.refreshCode();
    this.getTenantList()
    this.$store.dispatch("LogOut")
  },
  mounted () {},
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    // 获取验证码
    getPhoneCode () {
      if(this.loginForm.phone && !this.loginForm.phone.includes(" ")){
        getPhone({ phone: this.loginForm.phone }).then(({ data }) => {
          // console.log(data)
          if (data.code === 0) {
            this.yzmobj.disabled = true
            let time = this.yzmobj.time
            let setInt = setInterval(() => {
              time--
              if (time <= 0) {
                this.yzmobj.disabled = false
                clearInterval(setInt)
                this.yzmobj.text = "发送验证码"
              } else {
                this.yzmobj.text = time + "s重新发送"
              }
            }, 1000)
          }
        }).catch(err => {
          this.refreshCode();
        })
      }
    },
    // 获取所有租户
    getTenantList () {
      getAllTentan().then(({ data }) => {
        this.companyOptions = data.data
        if(data.code == 0 && data.data && data.data.length == 1) {
          this.sysInfo = data.data[0]
          if (this.sysInfo.icon) {
            var link = document.createElement('link')
            link.type = 'image/x-icon'
            link.rel = 'shortcut icon'
            link.href = this.sysInfo.icon
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          this.$emit('changeShortName', this.sysInfo)
          this.$store.commit("SET_TENANTINFO", this.sysInfo)
        }
      })
    },
    // 微信登录成功回调
    loginWX (code, type) {
      if (type == 'weixin') {
        codeGetUserInfo({ code: code }).then(({ data }) => {
          if (data.code === 0) {
            wxOpenidLogin({ openId: data.data.openid })
              .then(response => {
                const data = response.data;
                this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
                this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
                this.$store.commit("SET_EXPIRES_IN", data.expires_in);
                this.$store.commit("CLEAR_LOCK");
                this.$store.commit("SET_USER_INFO", data.userDto);
                this.$store.commit("SET_ROLES", data.roles || []);
                this.$store.commit("SET_PERMISSIONS", data.permissions || []);
                this.$store.commit("SET_TENANTId", this.loginForm.company);
                this.$router.push({ path: this.tagWel.value });
              })
              .catch(error => {
                this.getQRcodeUrl()
              });
          }
        })
      } else {
        appLogin(code).then(response => {
          const data = response.data;
          this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
          this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
          this.$store.commit("SET_EXPIRES_IN", data.expires_in);
          this.$store.commit("CLEAR_LOCK");
          this.$store.commit("SET_USER_INFO", data.userDto);
          this.$store.commit("SET_ROLES", data.roles || []);
          this.$store.commit("SET_PERMISSIONS", data.permissions || []);
          this.$store.commit("SET_TENANTId", this.loginForm.company);
          this.$router.push({ path: this.tagWel.value });
        })
          .catch(error => {
            this.getQRcodeUrl()
          });
      }
    },
    refreshCode () {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    showPassword () {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin () {
      // console.log(this.sysInfo)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$store.dispatch("LoginByUsername", Object.assign({}, this.loginForm, { loginType: this.loginType, code: this.loginType === 'namepass' ? this.loginForm.namecode : this.loginForm.code })).then((data) => {
            this.getTenantByUserList()
            // this.$socket.emit('userInfo', data)
            this.submitLoading = false
          }).catch(() => {
            this.refreshCode()
            this.submitLoading = false
          })
        }
      });
    },
    // 获取该用户下所有的租户列表
    getTenantByUserList () {
      getTenantByUser().then(res => {
        if(res.data.code == 0) {
          let list = []
          if(res.data.data) {
            list = res.data.data
            if(list.length > 0) {
              // 只有一个租户直接进去
              if(list.length == 1) {
                this.$store.commit("SET_SwitchTenant", false)
                this.$refs.tenantDialog.tenantLoginHandle(list[0])
              }else{
                this.usertenantList = list
                this.$store.commit("SET_SwitchTenant", true)
                // this.dialogVisible = true
                this.$refs.tenantDialog.init()
              }
            }
          }
        }
      })
    },
    // 切换登录方式
    changeType (type) {
      if (type !== 'weixin' && this.$refs.QRCode) {
        this.$refs.QRCode.clear()
      }
      this.loginType = type
      this.getQRcodeUrl()
    },
    getQRcodeUrl (val) {
      this.$store.commit("SET_TENANTId", this.loginForm.company);
      if (this.loginType === 'weixin') {
        setTimeout(() => {
          this.$refs.QRCode.init(this.qrType)
        }, 1)
      }
      if (this.loginType === 'app') {
        setTimeout(() => {
          this.$refs.QRCode.init(this.qrType)
        }, 1)
      }
    },
    changeQrType (value) {
      if (this.qrType != value) {
        this.qrType = value
        this.getQRcodeUrl()
      }
    },
    tendChange (val) {
      this.getQRcodeUrl()
      for(let i in this.companyOptions) {
        if(this.companyOptions[i].id == val) {
          this.loginTypes = this.companyOptions[i].loginTypes
          this.sysInfo = this.companyOptions[i]
          this.$emit('changeShortName', this.sysInfo)
          this.$store.commit("SET_TENANTINFO", this.sysInfo)
          this.$forceUpdate()
        }
      }
    },
    hasLoginRight (type) {
      let bool = false
      if(this.loginTypes.indexOf(type) > -1) {
        bool = true
      }
      return bool
    },
    forgetPass () {
      this.forgetVisible = true
    },
    forgetClose () {
      this.forgetVisible = false
      this.forgetForm = {}
      this.ramdomCode = ""
      this.forgetObj = {
        text: '发送验证码',
        time: 180,
        disabled: false
      }
      if(this.forgetTimer) {
        clearInterval(this.forgetTimer)
      }
    },
    getForgetCode () {
      if(this.forgetForm.phone) {
        this.ramdomCode = new Date().getTime()
        getPhoneCode({ phone: this.forgetForm.phone, idStr:  this.ramdomCode}).then(({ data }) => {
          // console.log(data)
          if (data.code === 0) {
            this.forgetObj.disabled = true
            let time = this.forgetObj.time
            let _this = this
            this.forgetTimer = setInterval(() => {
              time--
              if (time <= 0) {
                _this.forgetObj.disabled = false
                clearInterval(_this.forgetTimer)
                _this.forgetObj.text = "发送验证码"
              } else {
                _this.forgetObj.text = time + "s重新发送"
              }
            }, 1000)
          }else{
            if(res.data.msg) {
              this.$message.error(res.data.msg)
            }
          }
        }).catch(err => {
          this.refreshCode();
        })
      }
    },
    forgetSubmit (form) {
      // console.log(form)
      let obj = JSON.parse(JSON.stringify(form))
      obj.randomCode = this.ramdomCode
      let temp = {
        code: JSON.stringify(obj)
      }
      temp = encryption({
        data: temp,
        key: enCodeKey,
        param: ["code"]
      });
      resetPass(temp.code).then(res => {
        if(res.data.code == 0) {
          this.$message.success("修改密码成功")
          this.forgetClose()
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.btntab {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  .el-button {
    border: 0;
  }
}
.weixinlogin {
  width: 0;
  height: 0;
  border-top: 100px solid #c0c4cc;
  border-left: 100px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}
// .weixincode {
//   height: 300px !important;
//   display: block !important;
//   img {
//     display: block;
//     width: 100%;
//     height: 100%;
//   }
// }
</style>
<style lang="scss">
.tenant-select{
  .el-input.is-disabled .el-input__inner{
    background: transparent;
    border-color:#4A8EEF;
    color: #333;
  }
  .el-input.is-disabled .el-input__inner:hover{
    border-color: #4A8EEF;
    cursor: auto;
  }
}
.login-submit{
  .el-icon-loading{
    color: #fff;
  }
}
.jvs-login-form{
  .el-form-item {
    margin-bottom: 20px;
  }
  .is-error{
    margin-bottom: 20px;
    .el-form-item__error{
      text-indent: 10px;
    }
  }
}
</style>
