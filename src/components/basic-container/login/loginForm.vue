<template>
  <div>
    <el-dialog
      ref="loginComDialog"
      :modal="modal"
      :class="{'login-component-dialog': true, 'login-component-dialog-modal': modal}"
      :visible.sync="loginVisible"
      append-to-body
      :before-close="handleClose">
      <div class="jvs-loginCom" v-if="loginVisible" :style="setStyle">
        <div v-if="tenantVisible" :class="{'user-tenant-list': true}">
          <div v-if="tenantLoading" class="tenant-loading-back"></div>
          <p v-for="item in usertenantList" :key="'tenant-item'+item.id" @click="tenantLoginHandle(item)">
            <img v-if="item.icon" :src="item.icon" alt="" />
            <span v-else class="empty-logo-image">
              <i class="el-icon-office-building"></i>
            </span>
            <span>{{item.shortName}}</span>
          </p>
        </div>
        <div v-else class="login">
          <div class="login-top">
            <h5>{{formType == 'login' ? '欢迎登录' : '注册账号'}}</h5>
            <div class="top-right"
              v-if="formType == 'login' && loginType != 'namepass' && hasLoginRight('password') && (hasLoginRight('wx') || hasLoginRight('wxmp') || hasLoginRight('dd') || hasLoginRight('wxenterprise'))"
              @click="changeType('namepass')">
              <p class="code"></p>
              <i class="el-icon-user-solid" v-if="loginType != 'namepass'"></i>
            </div>
          </div>
          <div :class="{'login-center': true, 'code-login-center': (['weixin', 'dd', 'wxenterprise'].indexOf(loginType) > -1)}" v-if="!fresh">
            <!-- status-icon -->
            <el-form
              class="jvs-loginCom-form"
              :rules="loginRules"
              ref="loginForm"
              :model="loginForm"
              label-width="0"
            >
              <!-- 账号 -->
              <el-form-item
                prop="username"
                v-if="loginType == 'namepass' || loginType == 'register'"
                class="no-suffix"
              >
                <el-input
                  size="small"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.username"
                  placeholder="请输入姓名"
                >
                  <i
                    slot="prefix"
                    class="el-icon-user-solid"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- LDAP账号 -->
              <el-form-item
                prop="account"
                v-if="loginType == 'ldap'"
                class="no-suffix"
              >
                <el-input
                  size="small"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.account"
                  placeholder="请输入LDAP账号"
                >
                  <i
                    slot="prefix"
                    class="el-icon-user-solid"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- 手机号 -->
              <el-form-item
                prop="phone"
                v-if="loginType == 'phone' || formType == 'register'"
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
                    class="el-icon-mobile"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item
                prop="password"
                v-if="loginType == 'namepass' || loginType == 'ldap'"
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
                    class="el-icon-lock"
                  ></i>
                  <!-- icon-mima  -->
                </el-input>
              </el-form-item>

              <!-- 手机验证码 -->
              <el-form-item
                prop="code"
                v-if="loginType == 'phone' || loginType == 'register'"
                class="no-suffix"
              >
                <el-row :span="24">
                  <el-col :span="16">
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
                  <el-col :span="8" class="code-row">
                    <el-button
                      v-if="loginType == 'register'"
                      class="codebtn"
                      size="mini"
                      :disabled="regcodeobj.disabled"
                      @click.native.prevent="getPhoneCode('regcodeobj')"
                    >{{regcodeobj.text}}</el-button>
                    <el-button
                      v-else
                      class="codebtn"
                      size="mini"
                      :disabled="yzmobj.disabled"
                      @click.native.prevent="getPhoneCode('yzmobj')"
                    >{{yzmobj.text}}</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 随机验证码 -->
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



              <!-- 微信二维码登录 -->
              <div v-if="loginType == 'weixin' && wxType =='wx'" @click="freshWeixin" style="width: 300px;height: 330px;position: absolute;left: 50%;margin-left: -150px;cursor:pointer;z-index: 9;">
              </div>
              <!-- 微信 -->
              <iframe id="weixinCode" v-if="loginType == 'weixin' && wxType =='wx'" :src="`/auth/just/login/WECHAT_OPEN?client_id=${client_id}&url=`+ callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;" scrolling="no"  frameborder="0" height="330"></iframe>
              <!-- 公众号 -->
              <div v-loading="QRLoading" v-if="loginType == 'weixin' && OfficQrcodeUrl && wxType=='wxmp'"
                element-loading-text="正在登录..." style="position: absolute;left: 50%;margin-left: -165px;width: 330px;min-height: auto;display: flex;align-items: center;justify-content: center;flex-direction: column;">
                <div v-if="loginType == 'weixin' && OfficQrcodeUrl && wxType=='wxmp'" style="font-size:22px;">微信扫一扫登录</div>
                <img id="weixinCode"  @click="freshWeixin"
                 :src="OfficQrcodeUrl" v-if="loginType == 'weixin'  && OfficQrcodeUrl && wxType=='wxmp'"  scrolling="no"  frameborder="0" height="330" width="330" style="cursor:pointer;"/>
                <div v-if="loginType == 'weixin' && OfficQrcodeUrl && wxType=='wxmp'" style="font-size: 14px;margin-top: 5px;">扫码关注公众号完成登录</div>
                <div class="expires-box" v-if="isExpires && loginType == 'weixin' && OfficQrcodeUrl && wxType=='wxmp'" @click="freshWeixin">二维码已失效,点击刷新</div>
              </div>

              <!-- 钉钉扫码登录 -->
              <iframe id="ddLogin" v-if="loginType == 'dd' && ddCodeUrl" :src="ddCodeUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;width:300px;height:330px;" scrolling="no"  frameborder="0" height="330"></iframe>

              <!-- 企业微信扫码登录 -->
              <iframe v-if="loginType == 'wxenterprise'" id="wxenterpriseCode" :src="`/auth/just/login/WECHAT_ENTERPRISE?client_id=${client_id}&url=`+ callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;" scrolling="no"  frameborder="0" height="330"></iframe>

              <!-- 按钮 -->
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click.native="handleLogin"
                  class="login-submit-button"
                  :loading="submitLoading"
                  v-if="formType == 'login' && ['weixin', 'dd', 'wxenterprise', 'app', 'third'].indexOf(loginType) == -1"
                >登录</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click.native="handleRegister"
                  class="login-submit-button"
                  :loading="submitLoading"
                  v-if="formType == 'register'"
                >注册</el-button>
              </el-form-item>
              <el-row v-if="['weixin', 'dd', 'wxenterprise', 'ldap'].indexOf(loginType) == -1" class="btntab">
                <p v-if="formType == 'login'">
                  <el-button
                    type="text"
                    size="small"
                    v-if="loginType != 'namepass' && hasLoginRight('password')"
                    @click.native.prevent="changeType('namepass')"
                  >账号密码</el-button>
                  <el-button
                    type="text"
                    size="small"
                    v-if="loginType != 'phone' && hasLoginRight('phone')"
                    @click.native.prevent="changeType('phone')"
                  >手机号登录</el-button>
                </p>
                <p v-else></p>
                <p>
                  <span v-if="false && formType == 'login' && hasLoginRight('phone')">没有账号？<jvs-button type="text" @click="changeFormType('register', 'register')">点击注册</jvs-button></span>
                </p>
              </el-row>
              <el-row class="note-text" v-if="formType == 'register'">
                <p>
                  <span>点击注册按钮将视为您同意<jvs-button type="text" @click="openRule">使用条款</jvs-button></span>
                </p>
                <p>
                  <span><jvs-button type="text" @click="changeFormType('namepass', 'login')">去登录</jvs-button></span>
                </p>
              </el-row>
              <el-row v-if="formType == 'login' && ( hasLoginRight('wx') || hasLoginRight('wxmp') || hasLoginRight('wxenterprise')  || hasLoginRight('ldap') || hasLoginRight('dd'))" class="other-type-item">
                <el-divider content-position="center">其他登录方式</el-divider>
                <p>
                  <img v-if="(hasLoginRight('wx') || hasLoginRight('wxmp')) && loginType != 'weixin'" :src="wxImgIcon" alt="" @click="changeType('weixin')">
                  <img v-if="hasLoginRight('wxenterprise') && loginType != 'wxenterprise'" :src="qwImgIcon" alt="" @click="changeType('wxenterprise')">
                  <img v-if="hasLoginRight('ldap') && loginType != 'ldap'" :src="ldapImgIcon" alt="" @click="changeType('ldap')">
                  <img v-if="hasLoginRight('dd') && loginType != 'dd'" :src="dingImgIcon" alt="" @click="changeType('dd')">
                </p>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import wxImg from './icon/wx.png'
import ldapImg from './icon/ldap.png'
import qwImg from './icon/qw.png'
import dingImg from './icon/dinglogo.png'
import QRcode from "../../QRcode/index"
import { randomLenNum,encryption } from "@/util/util";
import { getPhone, getRegPhoneCode, getCanLogin,getOffLoginQcode,checkQrcodeState,codeLogin, getInfoByLoginType } from "@/api/login"
import { enCodeKey, client_id } from "@/const/const"
export default {
  components: { 'qr-code': QRcode},
  computed: {
    setStyle () {
      let style = ''
      if(this.right) {
        style += `right:${this.right};`
      }else{
        if(this.left) {
          style += `left: ${this.left};`
        }else{
          style += `left: calc(50% - 230px);`
        }
      }
      if(this.top) {
        style += `top:${this.top};`
      }else{
        if(this.bottom) {
          style += `bottom:${this.bottom};`
        }else{
          style += `top: calc(50% - 300px);`
        }
      }
      return style
    },
    modal () {
      if(this.hasModal) {
        return true
      }else{
        return false
      }
    }
  },
  data() {
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
      wxImgIcon: wxImg,
      ldapImgIcon: ldapImg,
      qwImgIcon: qwImg,
      dingImgIcon: dingImg,
      loginVisible: false,
      loginForm: {
        username: "", // "admin",
        account: "",
        password: "", // "123456",
        code: "",
        redomStr: "",
        // company: 1,
        phone: '',
        wxcode: "",
        namecode: ''
      },
      loginRules: {
        username: [
          { required: true, message: " ", trigger: "blur" },
          { validator: validateUserName, trigger: 'blur' }
        ],
        account: [
          { required: true, message: " ", trigger: "blur" },
        ],
        password: [
          { required: true, message: " ", trigger: "blur" },
          // { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        phone: [{ required: true, message: " ", trigger: "blur" }],
        code: [
          { required: true, message: " ", trigger: "blur" },
          // { min: 6, max: 6, message: " ", trigger: "blur" }
        ],
        // namecode: [
        //   { required: true, message: " ", trigger: "blur" },
        //   { min: 4, max: 4, message: " ", trigger: "blur" }
        // ],
      },
      loginType: 'weixin', // 'namepass'
      passwordType: "password",
      loginTypes: [],
      submitLoading: false,
      code: {
        src: "/code",
        value: "",
        len: 6,
        namecodelen: 4,
        type: "image"
      },
      yzmobj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      regcodeobj: {
        text: '发送验证码',
        time: 180,
        disabled: false
      },
      qrType: 'weixin',
      formType: 'login', // register
      fresh: false,
      usertenantList: [], // 用户的租户列表
      tenantVisible: false, // 租户列表展示
      tenantLoading: false,
      randomString: '',
      callbackUrl: '',
      // 公众号二维码地址
      wxType:'',
      isExpires:false, //二维码是否过期
      OfficQrcodeUrl:'',
      QRcodeUUId:'',
      QRCheckSetInterval:null,
      QRChcekSetTimeout:null,
      QRLoading:false,
      ddCodeUrl: '',
      ddInfo: null,
      client_id: client_id
    }
  },
  methods: {
    init () {
      getCanLogin().then(res => {
        if(res.data && res.data.code == 0) {
          this.loginTypes = res.data.data
          if(this.loginTypes.indexOf('password') > -1) {
            this.loginType = 'namepass'
          }else{
            this.loginType = 'phone'
          }
          // 微信
          if(this.loginTypes.indexOf('wx') > -1) {
            this.loginType = 'weixin'
            this.wxType = 'wx'
          }
          this.loginVisible = true
          if(this.switchTenant) {
            this.tenantVisible = true
            this.usertenantList = this.switchList
          }else{
            this.$store.dispatch("LogOut")
          }
          // 微信公众号
          if(this.loginTypes.indexOf('wxmp')>-1){
            this.loginType = 'weixin'
            this.wxType = 'wxmp'
            this.QRLoading = false
            if(!this.switchTenant){
              this.getOffLoginQcode()
            }
          }
        }
      })
    },
    // 获取二维码
    getOffLoginQcode(){
      let uuid = this.getUUId(),uuidNew = []
      uuid.split('').forEach(item => {
        if(item!='-'){
          uuidNew.push(item)
        }
      });
      this.QRcodeUUId = uuidNew.join('')
      getOffLoginQcode(this.QRcodeUUId).then(res=>{
        if(res.data.code==0){
          this.OfficQrcodeUrl = res.data.data
          this.isExpires = false
          this.startCheckState()
        }
      })
    },
    // 检查登录状态
    startCheckState(){
      if(this.QRCheckSetInterval){
        clearInterval(this.QRCheckSetInterval)
      }
      if(this.QRChcekSetTimeout){
        clearTimeout(this.QRChcekSetTimeout)
      }
      // this.QRChcekSetTimeout = setTimeout(()=>{
      //   this.isExpires = true
      //   if(this.QRCheckSetInterval){
      //     clearInterval(this.QRCheckSetInterval)
      //   }
      // },1000 * 60 * 0.05)
      this.QRCheckSetInterval = setInterval(()=>{
        checkQrcodeState(this.QRcodeUUId).then(res=>{
          if(res.data.code == 0 && res.data.data.checkStatus){
            this.QRLoading = true
            if(this.QRCheckSetInterval){
              clearInterval(this.QRCheckSetInterval)
            }
            this.QRcodeLogin(this.QRcodeUUId)
          }else if(res.data.code == 0 && res.data.data.isPastDue){
            this.isExpires = true
            if(this.QRCheckSetInterval){
              clearInterval(this.QRCheckSetInterval)
            }
          }
        })
      },1000 * 2)
    },
    QRcodeLogin(id){
      let tp = {
        data: JSON.stringify(Object.assign({ id: id}))
      }
      let temp = encryption({
        data: tp,
        key: enCodeKey,
        param: ["data"]
      });
      codeLogin(('WECHAT_MP@'+temp.data)).then(res=>{
        this.getTenantByUserList(res.data)
      })
    },
    getUUId(){
      return URL.createObjectURL(new Blob()).substr(-36)
    },
    handleClose () {
      if(this.QRCheckSetInterval){
        clearInterval(this.QRCheckSetInterval)
      }
      this.submitLoading = false
      this.tenantLoading = false
      this.loginVisible = false
    },
    resetLogin () {
      this.$refs.loginForm.resetFields()
      this.fresh = true
      this.$nextTick( () => {
        this.loginForm = {
          username: "",
          password: "",
          code: "",
          redomStr: "",
          phone: '',
          wxcode: "",
          namecode: ''
        }
        this.fresh = false
      })
    },

    hasLoginRight (type) {
      let bool = false
      if(this.loginTypes.indexOf(type) > -1) {
        bool = true
      }
      return bool
    },
    showPassword () {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 切换登录方式
    changeType (type) {
      if(this.QRCheckSetInterval){
        clearInterval(this.QRCheckSetInterval)
      }
      if(type=='weixin' && this.wxType=='wxmp'){
        this.getOffLoginQcode()
      }
      if (type !== 'weixin' && this.$refs.QRCode) {
        this.$refs.QRCode.clear()
      }
      if(type == 'dd') {
        // 钉钉二维码
        this.getDDCode()
      }else{
        this.ddCodeUrl = ''
      }
      this.loginType = type
      this.resetLogin()
      // this.getQRcodeUrl()
    },
    // 获取验证码
    getPhoneCode (attr) {
      if(this.loginForm.phone && !this.loginForm.phone.includes(" ")){
        let func = null
        if(this.loginType == 'register') {
          func = getRegPhoneCode
        }else{
          func = getPhone
        }
        if(func) {
          func({ phone: this.loginForm.phone }).then(({ data }) => {
            // console.log(data)
            if (data.code === 0) {
              this.$set(this[attr], 'disabled', true)
              let time = this[attr].time
              let setInt = setInterval(() => {
                time--
                if (time <= 0) {
                  this.$set(this[attr], 'disabled', false)
                  clearInterval(setInt)
                  this.$set(this[attr], 'text', '发送验证码')
                } else {
                  this.$set(this[attr], 'text', (time + "s重新发送") )
                }
              }, 1000)
            }
          }).catch(err => {
            this.refreshCode();
          })
        }
      }
    },
    // 获取二维码
    getQRcodeUrl (val) {
      let _this = this
      if (this.loginType === 'weixin') {
        setTimeout(() => {
          _this.$refs.QRCode.init(_this.qrType)
        }, 1)
      }
    },
    // 刷新验证码
    refreshCode () {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    // 登录提交
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let subData = {}
          if(this.loginType == 'ldap') {
            subData = { loginType: 'LDAP', account: this.loginForm.account, password: this.loginForm.password }
          }else{
            let temp = {}
            if(this.queryData) {
              temp = JSON.parse(JSON.stringify(this.queryData))
            }
            subData = Object.assign(temp, this.loginForm, { loginType: this.loginType, code: this.loginType === 'namepass' ? this.loginForm.namecode : this.loginForm.code })
          }
          this.submitLoading = true
          this.$store.dispatch("LoginByUsername", subData).then((data) => {
            this.getTenantByUserList(data)
          }).catch((err) => {
            if(this.loginType != 'ldap') {
              this.$message.error(err.message)
            }
            this.refreshCode()
            this.submitLoading = false
          })
        }
      });
    },
    // 微信登录成功回调
    loginWX (code, type) {
      if (type == 'weixin') {
        codeGetUserInfo({ code: code }).then(({ data }) => {
          if (data.code === 0) {
            wxOpenidLogin({ openId: data.data.openid })
              .then(response => {
                const data = response.data;
                // this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
                // this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
                // this.$store.commit("SET_EXPIRES_IN", data.expires_in);
                // this.$store.commit("CLEAR_LOCK");
                // this.$store.commit("SET_USER_INFO", data.userDto);
                // this.$store.commit("SET_ROLES", data.roles || []);
                // this.$store.commit("SET_PERMISSIONS", data.permissions || []);
                // this.$store.commit("SET_TENANTId", this.loginForm.company);
                // this.$router.push({ path: this.tagWel.value });
              })
              .catch(error => {
                // this.getQRcodeUrl()
              });
          }
        })
      } else {
        appLogin(code).then(response => {
          const data = response.data;
          // this.$store.commit("SET_ACCESS_TOKEN", data.access_token);
          // this.$store.commit("SET_REFRESH_TOKEN", data.refresh_token);
          // this.$store.commit("SET_EXPIRES_IN", data.expires_in);
          // this.$store.commit("CLEAR_LOCK");
          // this.$store.commit("SET_USER_INFO", data.userDto);
          // this.$store.commit("SET_ROLES", data.roles || []);
          // this.$store.commit("SET_PERMISSIONS", data.permissions || []);
          // this.$store.commit("SET_TENANTId", this.loginForm.company);
          // this.$router.push({ path: this.tagWel.value });
        })
          .catch(error => {
            // this.getQRcodeUrl()
          });
      }
    },
    // 获取该用户下所有的租户列表
    getTenantByUserList (data) {
      // console.log(data)
      let list = []
      if(data.userDto && data.userDto.tenants) {
        list = data.userDto.tenants
        if(list.length > 0) {
          // 只有一个租户 或指定租户 直接进去
          if(list.length == 1 || (data.userDto.tenantId && data.userDto.tenant)) {
            if(data.userDto && data.userDto.callBackUrl && localStorage.getItem('loginQuery')){
              this.$openUrl(`${data.userDto.callBackUrl}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`, '_self') // 'Bearer ' +
              localStorage.setItem('loginQuery', '')
              this.submitLoading = false
            }else{
              this.$store.commit("SET_SwitchTenant", false)
              this.setUserInfoData(data)
              if(this.successClose !== false) {
                this.handleClose()
              }
              // 后续操作
              if(this.afterLogin) {
                this.afterLogin(this.$refs.loginComDialog, data)
              }
            }
          }else{
            this.submitLoading = false
            this.usertenantList = list
            this.$store.commit("SET_SwitchTenant", true)
            this.tenantVisible = true
          }
        }
      }
    },
    // 切换租户登录
    tenantLoginHandle (item) {
      if(item.id) {
        this.tenantLoading = true
        this.$store.dispatch('RefreshToken', item.id).then(data => {
          if(data) {
            if(data.userDto && data.userDto.callBackUrl && localStorage.getItem('loginQuery')){
              this.$openUrl(`${data.userDto.callBackUrl}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`, '_self') // 'Bearer ' +
              localStorage.setItem('loginQuery', '')
              this.submitLoading = false
            }else{
              this.setUserInfoData(data)
              if(this.successClose !== false) {
                this.handleClose()
              }
              // 后续操作
              if(this.afterLogin) {
                this.afterLogin(this.$refs.loginComDialog, data)
              }
            }
          }else{
            this.submitLoading = false
          }
        }).catch(() => {
          this.submitLoading = false
          this.tenantLoading = false
        });
      }
    },
    // 登录成功写入数据
    setUserInfoData (data) {
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
    },
    // 注册
    changeFormType (type, formtype) {
      this.loginType = type
      this.formType = formtype
      this.resetLogin()
    },
    // 注册提交
    handleRegister () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$store.dispatch("LoginByUsername", Object.assign({}, this.loginForm, { loginType: this.loginType, code: this.loginType === 'namepass' ? this.loginForm.namecode : this.loginForm.code })).then((data) => {
            this.getTenantByUserList(data)
          }).catch(() => {
            this.refreshCode()
            this.submitLoading = false
          })
        }
      });
      // if(this.afterRegister) {
      //   this.afterRegister()
      // }
    },
    // 刷新二维码
    freshWeixin () {
      if(this.wxType == 'wxmp'){
        this.getOffLoginQcode()
      }else{
        $('#weixinCode').attr('src', $('#weixinCode').attr('src'))
      }
    },
    // 使用条款
    openRule () {
      this.$openUrl('/agreement/policies.html', '_blank')
    },
    // 钉钉二维码生成
    getDDCode () {
      getInfoByLoginType({type: 'dd'}).then(res => {
        if(res && res.data && res.data.code == 0) {
          this.ddInfo = res.data.data
          let url = encodeURIComponent(res.data.data.redirectUri || `${location.origin}/#/login/dingtalk/scanback`);
          let goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${res.data.data.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)
          this.ddCodeUrl = `https://login.dingtalk.com/login/qrcode.htm?goto=${goto}&style=border:none;background-color:#FFFFFF;`
          this.$forceUpdate()
        }
      })
    },
    // 钉钉扫码回调
    dingdingBackHandle (event) {
      var origin = event.origin;
      if( origin == "https://login.dingtalk.com" ) { //判断是否来自ddLogin扫码事件。
        var loginTmpCode = event.data;
        //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
        console.log("loginTmpCode", loginTmpCode);
        let url = encodeURIComponent(this.ddInfo.redirectUri || `${location.origin}/#/login/dingtalk/scanback`);
        let goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.ddInfo.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)
        this.$openUrl(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.ddInfo.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${goto}&loginTmpCode=${loginTmpCode}`, '_self')
      }
    }
  },
  created () {
    this.callbackUrl = location.origin + '/%23/login/callback?back=login'
    this.refreshCode();
    let randomStr = Math.random() + ""
    this.randomString = '/' + (randomStr.slice(2, randomStr.length))
    localStorage.setItem('loginRandom', this.randomString)
    // 监听钉钉扫码
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', this.dingdingBackHandle, false);
    } else if (typeof window.attachEvent != 'undefined') {
      window.attachEvent('onmessage', this.dingdingBackHandle);
    }
  }
}
</script>
<style lang="scss">
.login-component-dialog{
  .el-dialog{
    overflow: hidden;
    background: none;
    box-shadow: none;
    width: 100%;
    height: 100vh;
    margin: 0!important;
    .el-dialog__header{
      display: none!important;
    }
    .el-dialog__body{
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
  .jvs-loginCom{
    background: #FFFFFF;
    width: 460px;
    height: 600px;
    border-radius: 10px;
    position: absolute;
    box-shadow: 0 2px 4px rgba(222, 222, 222, 0.5);
    h1,h2,h3,h4,h5,p{
      margin: 0;
      padding: 0;
    }
    .login{
      padding: 0 40px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .login-top{
        overflow: hidden;
        h5{
          font-size: 30px;
          font-family: MiSans-Demibold;
          font-weight: 500;
          line-height: 30px;
          color: #3471FF;
          margin-top: 32px;
          margin-bottom: 27px;
        }
        .top-right{
          position: absolute;
          top: 1px;
          right: 1px;
          border-radius: 0 10px 0 0;
          overflow: hidden;
          cursor: pointer;
          .code{
            width: 0;
            height: 0;
            border-top: 88px solid #868BA1;
            border-left: 88px solid transparent;
            overflow: hidden;
          }
          i{
            position: absolute;
            font-size: 26px!important;
            top: 12px;
            right: 12px;
            color: #fff;
          }
        }
      }
      .login-center{
        margin-top: 23px;
        //.login-form {
        .jvs-loginCom-form{
          margin: 10px 0;
          i {
            color: #DCDFE6;
          }
          .el-form-item__content {
            width: 100%;
          }
          .el-form-item {
            margin-bottom: 25px;
          }
          .el-input {
            input {
              text-indent: 20px;
              background: transparent;
              border: none;
              color: #BFBFBF;
              height: 60px;
              border: 1px solid #DCDFE6;
              border-radius: 0;
              border-radius: 4px;
            }
            .el-input__prefix {
              i{
                margin-left: 12px;
                display: inline-block;
                padding: 0 5px;
                line-height: 60px;
                font-size: 25px;
              }
            }
          }
          .no-suffix {
            .el-input__suffix {
              display: none;
            }
          }
          .el-form-item.is-error{
            .el-input__inner{
              border-color: #F56C6C;
            }
          }
          .login-submit-button{
            width: 100%;
            height: 50px;
            background: #3471FF;
            color: #fff;
            font-size: 14px;
          }
          .code-row{
            height: 60px;
            margin: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .codebtn{
              border: 0;
            }
            .codebtn:hover{
              color: #606266;
              background: none;
            }
          }
          .btntab{
            display: flex;
            align-items: center;
            justify-content: space-between;
            p{
              width: 50%;
              .el-button, span{
                font-size: 14px;
                font-family: MiSans-Demibold;
                font-weight: 400;
              }
            }
            p:nth-last-of-type(1){
              text-align: right;
            }
          }
          .note-text{
            font-size: 18px;
            color: #868BA1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            p:nth-of-type(1){
              flex: 1;
            }
            .el-button{
              font-size: 18px;
            }
          }
          .other-type-item{
            margin-top: 25px;
            .el-divider{
              .el-divider__text{
                font-size: 14px;
                //font-family: Source Han Sans CN;
                font-family: MiSans-Demibold;
                font-weight: 400;
                color: #868BA1;
              }
            }
            p{
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 46px;
              img{
                display: block;
                width: 50px;
                height: 50px;
                cursor: pointer;
                margin-left: 10px;
              }
              img:nth-of-type(1){
                margin-left: 0;
              }
            }
          }
        }
      }
      .code-login-center{
        .other-type-item{
          margin-top: 330px!important;
        }
      }
    }
    .user-tenant-list{
      //padding: 0 10px;
      padding: 0 20px;
      position: relative;
      height: 100%;
      overflow-y: auto;
      p{
        border-radius: 6px;
        width: 100%;
        height: 60px;
        overflow: hidden;
        margin: 0;
        padding: 0 10px;
        margin-top: 20px;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: #fff;
        //border: 1px solid #EFF2F7;
        img{
          display: block;
          width: 40px;
          height: 40px;
          border: 0;
          //background: #868BA1;
          //margin-right: 10px;
          margin: 0 30px;
        }
        span{
          display: block;
          width: 200px;
          color: #fff;
          text-align: left;
          color: #333333;
        }
        .empty-logo-image{
          display: block;
          width: 40px;
          height: 40px;
          background: #EFF2F7; // #F6F6F6;
          text-align: center;
          //margin-right: 10px;
          margin: 0 30px;
          i{
            font-size: 24px;
            line-height: 40px;
            text-align: center;
            color: #868BA1;
          }
        }
      }
      p:hover{
        background: #EFF2F7;
      }
    }
    .user-tenant-list::-webkit-scrollbar{
      display: none;
    }
    .tenant-loading-back{
      position: absolute;
      width: 100%;
      height: 560px;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.8);
      background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
      background-repeat: no-repeat;
      background-position: center;
      background-position: center;
      background-size: 300px 240px;
    }
  }
}
.login-component-dialog-modal{
  .el-dialog{
    position: unset;
    width: 50%;
    height: auto;
    .el-dialog__body{
      width: auto;
    }
  }
}
.expires-box{
  position: absolute;
  cursor: pointer;
  width: 330px;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.8);
  color: black;
  font-size: 16px;
  font-weight: 600;
}
</style>
