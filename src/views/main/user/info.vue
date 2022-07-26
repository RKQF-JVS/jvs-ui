<template>
  <div class="app-container calendar-list-container userinfo">
    <el-card>
      <basic-container>
        <template>
          <el-tabs @tab-click="switchTab" v-model="switchStatus">
            <el-tab-pane label="信息管理" name="userManager">
              <!-- 信息管理 -->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form
                    :model="ruleForm1"
                    :rules="rules1"
                    ref="ruleForm2"
                    label-width="100px"
                    v-if="switchStatus === 'userManager'"
                    class="userinfo-form userManager-form"
                  >
                    <el-form-item label="头像" prop="phone">
                      <img :src="userdata.headImg" style="width: 80px; height: 80px" />
                    </el-form-item>
                    <el-form-item label="用户名" prop="accountName">
                      <span class="form-item-right-text">{{userdata.accountName}}</span>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                      <span class="form-item-right-text">{{ userdata.phone }}</span>
                    </el-form-item>

                    <el-form-item label="真实姓名" prop="phone">
                      <span class="form-item-right-text">{{userdata.realName}}</span>
                    </el-form-item>
                    <el-form-item label="昵称" prop="phone">
                      <span class="form-item-right-text">{{userdata.nickName}}</span>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="phone">
                      <span class="form-item-right-text">{{userdata.email}}</span>
                    </el-form-item>
                    <el-form-item label="部门" prop="phone">
                      <span class="form-item-right-text">{{userdata.deptName}}</span>
                    </el-form-item>

                    <el-form-item label="微信绑定" prop="weixin" v-if="false">
                      <span style="margin: 0 10px 0 0; color: #999">{{ruleForm1.wxIsBinding ? "已经绑定" : "未绑定"}}</span>
                      <el-button size="mini" @click="wxBingding">{{ruleForm1.wxIsBinding ? "重新绑定" : "去绑定"}}</el-button>
                    </el-form-item>
                    <!-- <el-form-item
                      label="绑定手机号"
                      prop="mobile"
                      class="frombtnclass"
                    >
                      <div class="Horizontal">
                        <el-input
                          size="mini"
                          v-model="ruleForm1.mobile"
                          placeholder="手机登录使用"
                          :disabled="true"
                        ></el-input>
                        <p style="width: 150px; text-align: center">{{ ruleForm1.mobile ? "已绑定" : "未绑定" }}</p>
                        <el-button size="mini" @click="pickPhone">{{ruleForm1.mobile ? "重新绑定" : "去绑定"}}</el-button>
                      </div>
                    </el-form-item> -->
                  </el-form>
                </div>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="密码管理" name="passwordManager">
              <!-- 密码管理 -->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form
                    :model="ruleForm2"
                    :rules="rules2"
                    ref="ruleForm2"
                    label-width="100px"
                    v-if="switchStatus === 'passwordManager'"
                    class="userinfo-form"
                    size="mini"
                  >
                    <el-form-item label="原密码" prop="oldPassword">
                      <el-input
                        size="mini"
                        type="password"
                        v-model="ruleForm2.oldPassword"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                      <el-input
                        size="mini"
                        type="password"
                        v-model="ruleForm2.password"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rePassword">
                      <el-input
                        type="password"
                        size="mini"
                        v-model="ruleForm2.rePassword"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button size="mini" type="primary" :loading="passLoading" @click="submitForm('ruleForm2')">提交</el-button>
                      <el-button size="mini" @click="resetForm('ruleForm2')">重置</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-tab-pane>
            <el-tab-pane :label="phonePickShow ? '绑定手机号' : '手机号重置'" name="phoneManager">
              <!-- 重置手机号 -->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form
                    :model="ruleForm3"
                    :rules="rules3"
                    ref="ruleForm3"
                    label-width="100px"
                    v-if="switchStatus === 'phoneManager' || switchStatus === 'phonePick'"
                    class="userinfo-form"
                  >
                    <el-form-item label="手机号" prop="phone" size="mini">
                      <el-input v-model="ruleForm3.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                      <div class="Horizontal">
                        <el-input
                          size="mini"
                          v-model="ruleForm3.code"
                          auto-complete="off"
                        ></el-input>
                        <el-button
                          size="mini"
                          style="margin-left: 10px"
                          :disabled="timeCount > 0"
                          @click="getCode"
                        >
                          获取验证码
                          <span v-if="timeCount > 0" style="display: inline">{{"(" + timeCount + "s)"
                          }}</span>
                        </el-button>
                      </div>
                    </el-form-item>
                    <el-form-item>
                      <el-button size="mini" type="primary" :loading="phoneLoading" @click="submitForm('ruleForm3')">提交</el-button>
                      <el-button size="mini" @click="resetForm('ruleForm3')">重置</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </template>
      </basic-container>
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="364px"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <qr-code
          ref="QRCode"
          :ReqType="'bind'"
          bottomtext="请使用微信扫描绑定"
          @submit="bingWX"
        ></qr-code>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
import { editPass, getMessCode, editPhone, getUserInfo, codeGetUserInfo, bindOpenId } from "@/api/admin/user";
import { mapState } from 'vuex'
import store from "@/store";
import request from '@/router/axios'
import { isMobile } from "@/util/validate"
import { getQRcode } from '@/api/login'
import QRcode from '@/components/QRcode/index'
import { encryption } from "@/util/util";
import {enCodeKey} from "@/const/const"
export default {
  components: { 'qr-code': QRcode },
  data () {
    var validateRePassword=(rule, value, callback) => {
      if (value==='') {
        callback(new Error('请再次输入密码'));
      } else if (value!==this.ruleForm2.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    var validateReMobile=(rule, value, callback) => {
      if (value) {
        if (!isMobile(value)) {
          callback(new Error('手机号码格式错误!'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请输入手机号码'));
      }
      // if (value === '') {
      //   // callback(new Error('请输入手机号码'));
      //   callback();
      // } else if (!isMobile(value)) {
      //   callback(new Error('手机号码格式错误!'));
      // } else {
      //   callback();
      // }
    }
    return {
      userdata: {},

      URLLoading: false,
      RQURL: null,
      dialogVisible: false,
      switchStatus: '',
      avatarUrl: '',
      show: false,
      headers: {
        Authorization: 'Bearer '+store.getters.access_token
      },
      ruleForm1: {
        accountName: '',
        avatar: '',
        phone: '',
        wxIsBinding: false,
        weixin: ''
      },
      rules1: {},
      ruleForm2: {
        oldPassword: '',
        password: '',
        rePassword: ''
      },
      rules2: {
        oldPassword: [{ required: true, min: 6, message: '原密码不能为空且不少于6位', trigger: 'blur' }],
        password: [{ required: true, min: 6, message: '新密码不得少于6位', trigger: 'blur' }],
        rePassword: [{ required: true, trigger: 'blur', message: '请再次确认密码' }, { validator: validateRePassword, trigger: 'blur' }]
      },
      ruleForm3: {
        phone: '',
        code: '',
      },
      rules3: {
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }, { validator: validateReMobile, trigger: 'blur' }],
        code: [{required: true, trigger: 'blur', message: '请输入验证码'}]
      },
      timeCount: 0,
      timer: null,
      phonePickShow: false,
      getCodeSuccess: false,
      passLoading: false,
      phoneLoading: false
    }
  },
  created () {
    this.ruleForm1.accountName=this.userInfo.accountName
    this.ruleForm1.phone=this.userInfo.phone
    // this.ruleForm2.oldPassword=this.userInfo.password
    this.switchStatus='userManager'
    if (this.$route.query&&this.$route.query.act) {
      this.switchStatus=this.$route.query.act
    }
    this.getUserInfo()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
  },
  methods: {
    // 绑定微信成功回调
    bingWX (code) {
      codeGetUserInfo({ code: code }).then(({ data }) => {
        if (data.code===0) {
          bindOpenId({ openId: data.data.openid }).then(({ data }) => {
            this.dialogVisible=false
            this.getUserInfo()
            this.$message.success('微信绑定成功')
          })
        }
      })
    },
    // 微信绑定
    wxBingding () {
      // this.dialogVisible=true
      // setTimeout(() => {
      //   this.$refs.QRCode.init()
      // }, 1)
      this.$openUrl('/mgr/jvs-auth/oauth/render/wechat_open', '_self')
      // this.openWindow('/mgr/jvs-auth/oauth/render/wechat_open', 'wechat', 540, 540)
    },
    freshHandle (bool) {
      console.log(bool, 1111111111111)
      this.getUserInfo()
    },

    getUserInfo () {
      getUserInfo().then(({ data }) => {
        if (data.data.wxOpenid) {
          this.ruleForm1.wxIsBinding=true
        } else {
          this.ruleForm1.wxIsBinding=false
        }
        this.ruleForm1.weixin=data.data.nickname
        this.ruleForm1.phone=data.data.phone
        this.ruleForm1.mobile=data.data.phone
        this.userdata=data.data
      })
    },
    // 切换tab
    switchTab (tab, event) {
      if (this.$refs.ruleForm1) {
        this.$refs.ruleForm1.clearValidate()
      }
      if (this.$refs.ruleForm2) {
        this.$refs.ruleForm2.clearValidate()
      }
      if (this.$refs.ruleForm3) {
        this.$refs.ruleForm3.clearValidate()
      }
      this.switchStatus=tab.name
      this.phonePickShow=false

      this.getCodeSuccess=false

    },
    // 提交表单
    submitForm (formName) {
      let validate = true
      this.$refs[formName].validate( (bool, prop) => {
        validate = bool
      })
      if(!validate) {
        return false
      }
      // 密码管理
      if (formName=='ruleForm2') {
        let obj = JSON.parse(JSON.stringify(this[formName]))
        obj = encryption({
          data: obj,
          key: enCodeKey,
          param: ["oldPassword"]
          // param: ["oldPassword", "password", "rePassword"]
        });
        obj = encryption({
          data: obj,
          key: enCodeKey,
          param: ["password"]
        });
        obj = encryption({
          data: obj,
          key: enCodeKey,
          param: ["rePassword"]
        });
        this.passLoading = true
        editPass(obj).then(res => {
          if (res.data.code==0) {
            this.$message.success("密码重置成功")
            this.resetForm('ruleForm2')
            this.passLoading = false
            // this.$refs[formName].resetFields()
          }
        }).catch(e => {
          this.passLoading = false
        })
      }
      // 重置手机号或绑定
      if (formName=='ruleForm3') {
        let str="重置手机号成功"
        if (this.phonePickShow) {
          //  绑定
          str='绑定手机号成功'
        }
        this.phoneLoading = true
        editPhone(this[formName]).then(res => {
          if (res.data.code==0) {
            this.$message.success(str)
            this.$refs[formName].resetFields()
            this.phoneLoading = false
          }
        }).catch(e => {
          this.phoneLoading = false
        })
      }
    },
    // 重置表单
    resetForm (formName) {
      // if (this.$refs[formName]) {
      //   this.$refs[formName].resetFields()
      // }
      if (formName=='ruleForm2') {
        this.ruleForm2={
          oldPassword: '',
          password: '',
          rePassword: ''
        }
      } else {
        this.ruleForm3={
          phone: '',
          code: ''
        }
      }
    },
    // 获取短信验证码
    getCode () {
      this.$refs.ruleForm3.validate((valid, prop) => {
        let bool = valid
        if(!bool) {
          if(prop.code && prop.code.length > 0) {
            this.$refs.ruleForm3.clearValidate('code')
            bool = true
          }
        }
        if (bool) {
          clearInterval(this.timer)
          if (this.ruleForm3.phone) {
            this.timeCount=180
            this.timer=setInterval(() => {
              if (this.timeCount==0) {
                clearInterval(this.timer)
                return false
              }
              this.timeCount-=1
            }, 1000)
            getMessCode(this.ruleForm3.phone).then(res => {
              // console.log(res)
              if (res.data.code===0) {
                this.getCodeSuccess=true
                this.$message.success("验证码发送成功")
              }else{
                if(res.data.msg) {
                  this.$message.error(res.data.msg)
                }
              }
            }).catch(e => {
              clearInterval(this.timer)
              this.timeCount=0
              return false
            })
          }
        } else {
          return false
        }
      })

    },
    // 绑定手机号
    pickPhone () {
      if (this.ruleForm1.phone) {
        this.phonePickShow=true
        this.switchStatus= 'phoneManager' // 'phonePick'
      } else {
        this.switchStatus='phoneManager'
      }
    },
    handleClose () {
      this.$refs.QRCode.clear()
      setTimeout(() => {
        this.dialogVisible=false
      }, 1)
    },
    // 打开小窗口
    openWindow (url, title, w, h) {
      // Fixes dual-screen position             Most browsers       Firefox
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top
      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height
      const left = ((width / 2) - (w / 2)) + dualScreenLeft
      const top = ((height / 2) - (h / 2)) + dualScreenTop
      const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)
      // Puts focus on the newWindow
      if (window.focus) {
        newWindow.focus()
      }
    },
  }
}
</script>
<style lang="scss">
.userinfo {
  padding: 8px;
  overflow: hidden;
  .frombtnclass {
    .el-form-item__label {
      margin-top: 15px;
    }
  }
  .form-item-right-text {
    font-size: 14px;
    color: #999;
  }
  .el-form-item__content {
    line-height: 25px;
  }
  .el-card {
    height: 100%;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.Horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
}

// // .weixincode {
//   min-height: 300px;
//   height: 100% !important;
//   display: flex !important;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   img {
//     display: block;
//     width: 100%;
//     height: 100%;
//   }
// }
.userManager-form {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      line-height: 36px;
    }
  }
}
</style>
