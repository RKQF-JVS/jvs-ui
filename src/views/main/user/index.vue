<template>
  <div class="user-info-content-box">
    <div class="user-info-top">
      <img :src="userdata.headImg" style="width: 80px; height: 80px" />
      <p>{{userdata.phone}}</p>
    </div>
    <div class="card-list">
      <!-- 账号信息 -->
      <div class="user-info-card">
        <div class="user-info-card-item">
          <div class="left">
            <h5><span>{{tenantInfo.name}}</span>账号信息</h5>
          </div>
          <div class="right">
            <jvs-button v-if="changeTenantsList && changeTenantsList.length > 1" type='text' @click="switchTenant">切换组织</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <b>部门</b>
            <span>{{userdata && userdata.deptName}}</span>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <b>账号等级</b>
            <span>{{(userdata && userdata.level)}}</span>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <b>职工编号</b>
            <span>{{userdata && userdata.employeeNo}}</span>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <b>职位</b>
            <span>{{userdata && userdata.jobName}}</span>
          </div>
        </div>
      </div>
      <!-- 绑定账号 -->
      <div class="user-info-card">
        <div class="user-info-card-item">
          <h5>绑定账号</h5>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <i class="el-icon-message"></i>
            <b>邮箱</b>
            <span>{{userdata.email}}</span>
          </div>
          <div class="right">
            <jvs-button type="text" @click="bindOprateHandle('email')">{{userdata.email ? '解除绑定' : '绑定邮箱'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <img :src="wxImg" alt="">
            <b>微信</b>
            <span>{{userdata.exceptions && userdata.exceptions.WECHAT_OPEN && userdata.exceptions.WECHAT_OPEN.nickname}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" @click="bindOprateHandle('wx')">{{(userdata.exceptions && userdata.exceptions.WECHAT_OPEN && userdata.exceptions.WECHAT_OPEN.nickname) ? '解除绑定' : '绑定微信'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <i class="el-icon-mobile"></i>
            <b>手机</b>
            <span>{{userdata.phone}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" @click="bindOprateHandle('phone')">{{userdata.phone ? '解除绑定' : '绑定手机'}}</jvs-button>
          </div>
        </div>
      </div>
      <!-- 我的组织 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <h5>我的组织</h5>
        </div>
        <jvs-table class="tenant-list-table" :loading="mytableLoading" :option="tenantOption" :data="mytenantsList" @on-load="getMyTenantListHandle">
          <template slot="menu" slot-scope="scope">
            <jvs-button type="text" @click="delTenantListHandle(scope.row, 'my')">解散组织</jvs-button>
          </template>
        </jvs-table>
      </div>
      <!-- 加入的组织 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <h5>我加入组织</h5>
        </div>
        <jvs-table class="tenant-list-table" :loading="tableLoading" :option="tenantOption" :data="tenantsList" @on-load="getJoinTenantListHandle">
          <template slot="menu">
            <jvs-button type="text" @click="delTenantListHandle(scope.row, 'join')">退出组织</jvs-button>
          </template>
        </jvs-table>
      </div>
      <!-- 设置登录密码 -->
      <div class="user-info-card">
        <h5>设置登录密码</h5>
        <div class="user-info-card-item">
          <div class="left">设置登录密码后，可以使用账号密码直接登录，不用验证码登录</div>
          <div class="right"><jvs-button type="text" @click="setPassword">设置密码</jvs-button></div>
        </div>
      </div>
      <!-- 注销 -->
      <div class="user-info-card">
        <h5>删除所有数据，永久注销账号</h5>
        <div class="user-info-card-item">
          <div class="left">永久删除账号，所有企业后台不能登录</div>
          <div class="right"><jvs-button type="text" @click="loginOffHandle">注销</jvs-button></div>
        </div>
      </div>
    </div>
    <div class="switchShadow-box" v-if="false && switchShadow"></div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <div v-if="dialogVisible" class="user-info-content-dialog">
        <!-- 邮箱 -->
        <jvs-form v-if="oprationType == 'email'" ref="emailForm" :option="emailOption" :formData="emailForm" @submit="bindEmailHandle">
          <template slot="codeForm">
            <div style="display:flex;align-items:center;">
              <el-input size="mini" v-model="emailForm.code"></el-input>
              <jvs-button size="mini" style="margin-left: 10px;" :disabled="timeCountor != 300" @click="getEmailPhoneCode('email')">{{timeCountor != 300 ? (timeCountor +'s后重试') : '获取验证码'}}</jvs-button>
            </div>
          </template>
        </jvs-form>
        <!-- 手机 -->
        <jvs-form v-if="oprationType == 'phone'" ref="phoneForm" :option="phoneOption" :formData="phoneForm" @submit="bindPhoneHandle">
          <template slot="codeForm">
            <div style="display:flex;align-items:center;">
              <el-input size="mini" v-model="phoneForm.code"></el-input>
              <jvs-button size="mini" style="margin-left: 10px;" :disabled="timeCountor != 300" @click="getEmailPhoneCode('phone')">{{timeCountor != 300 ? (timeCountor +'s后重试') : '获取验证码'}}</jvs-button>
            </div>
          </template>
        </jvs-form>
        <!-- 微信 -->
        <div v-if="oprationType == 'wx'" style="position: relative;height: 350px;">
          <div @click="freshWeixin" style="width: 300px;height: 330px;position: absolute;left: 50%;margin-left: -150px;cursor:pointer;z-index: 9;">
          </div>
          <iframe id="weixinCode" :src="'/auth/just/login/WECHAT_OPEN?url=' + callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;" scrolling="no"  frameborder="0" height="330"></iframe>
        </div>
        <!-- 密码 -->
        <jvs-form v-if="oprationType == 'password'" ref="passForm" :option="passOption" :formData="passForm" @submit="submitPassWord">
        </jvs-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getUserInfo, getUserTenantInfo, getMyTenantList, delMyTenantList, getJoinTenantList, delJoinTenantList, bindEmail, unbindEmail, sendEmailCode, bindPhone, unbindPhone, sendPhoneCode, unbindWX, setPassWord, loginOff} from "@/api/admin/user"
import wxImg from '@/components/basic-container/login/icon/wx.png'
import {isEmail, isMobile} from '@/util/validate'
import { encryption } from "@/util/util";
import {enCodeKey} from "@/const/const"
export default {
  data () {
    var validateEmailReg = (rule, value, callback) => {
      if(isEmail(value)) {
        callback();
      }else{
        callback(new Error('请输入正确的邮箱'));
      }
    };
    var validatePhoneReg = (rule, value, callback) => {
      if(isMobile(value)) {
        callback();
      }else{
        callback(new Error('请输入正确的手机号'));
      }
    };
    var validatePassReg = (rule, value, callback) => {
      if(value && value.length < 16) {
        callback();
      }else{
        if(!value) {
          callback(new Error('请输入密码'));
        }else{
          callback(new Error('密码不能超过15位'));
        }
      }
    };
    var validateRePassReg = (rule, value, callback) => {
      if(value == this.passForm.password) {
        callback();
      }else{
        if(!value) {
          callback(new Error('请输入密码'));
        }else{
          callback(new Error('两次密码不一致'));
        }
      }
    };
    return {
      userdata: {},
      tenantInfo: {},
      wxImg: wxImg,
      mytenantsList: [],
      tenantsList: [],
      mytableLoading: false,
      tableLoading: false,
      tenantOption: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        align: "center",
        menuAlign: "center",
        hideTop: true,
        page: false,
        column: [
          {
            label: "组织名称",
            prop: "name"
          },
          {
            label: "组织简称",
            prop: "shortName"
          }
        ]
      },
      timeCountor: 300,
      timer: null,
      title: "",
      dialogVisible: false,
      oprationType: '', // 弹框类型
      emailForm: {},
      emailOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '邮箱',
            prop: 'email',
            rules: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator: validateEmailReg, trigger: 'blur'}
            ]
          },
          {
            label: '验证码',
            prop: 'code',
            formSlot: true,
            rules: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ]
          }
        ]
      },
      phoneForm: {},
      phoneOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '手机号',
            prop: 'phone',
            rules: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: validatePhoneReg, trigger: 'blur'}
            ]
          },
          {
            label: '验证码',
            prop: 'code',
            formSlot: true,
            rules: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ]
          }
        ]
      },
      passForm: {},
      passOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '密码',
            prop: 'password',
            showpassword: true,
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePassReg, trigger: 'blur'}
            ]
          },
          {
            label: '确认密码',
            prop: 'rePassword',
            showpassword: true,
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validateRePassReg, trigger: 'blur'}
            ]
          }
        ]
      },
      changeTenantsList: [], // 可切换的租户
      switchShadow: false, // 切换租户遮罩
      randomString: '',
      callbackUrl: ''
    }
  },
  methods: {
    // 用户信息
    getUserInfo () {
      getUserInfo().then(res => {
        if(res.data.code == 0) {
          this.$set(this, 'userdata', res.data.data)
        }
      })
    },
    // 租户信息
    getTenantInfo () {
      getUserTenantInfo().then(res => {
        if(res.data.code == 0) {
          this.tenantInfo = res.data.data
        }
      })
    },
    // 我的组织
    getMyTenantListHandle () {
      this.mytableLoading = true
      getMyTenantList().then(res => {
        if(res.data.code == 0) {
          this.mytenantsList = res.data.data
          this.mytableLoading = false
          this.getChangeTenants()
        }
      }).catch(e => {
        this.mytableLoading = false
      })
    },
    // 解散  退出
    delTenantListHandle (row, type) {
      let str = ""
      // 解绑
      if(type == 'my') {
        str = "即将解散该组织，是否继续？"
      }
      if(type == 'join') {
        str = "即将退出该组织，是否继续？"
      }
       this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let func = null
        if(type == 'my') {
          func = delMyTenantList
        }
        if(type == 'join') {
          func = delJoinTenantList
        }
        if(func) {
          func(row.id).then(res => {
            if(res.data.code == 0) {
              this.$message.success('已成功' + (type == 'my' ? '解散' : '退出') + "组织")
              this.getUserInfo()
              if(type == 'my') {
                this.getMyTenantListHandle()
              }
              if(type == 'join') {
                this.getJoinTenantListHandle()
              }
            }
          })
        }
      }).catch(e => {})
    },
    // 已加入的租户列表
    getJoinTenantListHandle () {
      this.tableLoading = true
      getJoinTenantList().then(res => {
        if(res.data.code == 0) {
          this.tenantsList = res.data.data
          this.tableLoading = false
          this.getChangeTenants()
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible = false
      if(this.timer) {
        clearInterval(this.timer)
        this.timeCountor = 300
      }
    },
    // 邮箱 手机号 操作
    bindOprateHandle (type) {
      let str = ""
      // 解绑
      if(type == 'email') {
        str = "即将解除邮箱绑定，是否继续？"
      }
      if(type == 'phone') {
        str = "即将解除手机号绑定，是否继续？"
      }
      if(type == 'wx') {
        str = "即将解除微信绑定，是否继续？"
      }
      if(['email', 'phone'].indexOf(type) > -1) {
        if(this.userdata[type]) {
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let func = null
            if(type == 'email') {
              func = unbindEmail
            }
            if(type == 'phone') {
              func = unbindPhone
            }
            if(func) {
              func().then(res => {
                if(res.data.code == 0) {
                  this.$message.success('已成功解绑' + (type == 'email' ? '邮箱' : '手机') )
                  this.getUserInfo()
                }
              })
            }
          }).catch(e => {})
        }else{ // 绑定
          this.title = (type == 'email' ? '绑定邮箱' : '绑定手机')
          this.oprationType = type
          this.dialogVisible = true
        }
      }else{
        // 解绑
        if(this.userdata.exceptions && this.userdata.exceptions.WECHAT_OPEN && this.userdata.exceptions.WECHAT_OPEN.nickname) {
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            unbindWX().then(res => {
              if(res.data.code == 0) {
                this.$message.success('已成功解绑微信')
                this.getUserInfo()
                this.$forceUpdate()
              }
            })
          }).catch(e => {})
        }else{ // 绑定微信
          this.title = '绑定微信'
          this.oprationType = type
          this.dialogVisible = true
        }
      }
    },
    // 获取邮箱验证码
    getEmailPhoneCode (type) {
      if(type == 'email') {
        this.$refs.emailForm.$refs.ruleForm.validateField('email', (msg) => {
          if(msg == '') {
            if(this.timer) {
              clearInterval(this.timer)
              this.timeCountor = 300
            }
            let _this = this
            this.timer = setInterval(() => {
              _this.timeCountor -= 1
              if(_this.timeCountor == 0) {
                clearInterval(_this.timer)
                _this.timeCountor = 300
              }
            }, 1000);
            sendEmailCode({email: this.emailForm.email}).then(res => {}).catch(err => {
              if(this.timer) {
                clearInterval(this.timer)
              }
              this.timeCountor = 300
            })
          }
        })
      }
      if(type == 'phone') {
        this.$refs.phoneForm.$refs.ruleForm.validateField('phone', (msg) => {
          if(msg == '') {
            if(this.timer) {
              clearInterval(this.timer)
              this.timeCountor = 300
            }
            let _this = this
            this.timer = setInterval(() => {
              _this.timeCountor -= 1
              if(_this.timeCountor == 0) {
                clearInterval(_this.timer)
                _this.timeCountor = 300
              }
            }, 1000);
            sendPhoneCode(this.phoneForm.phone).then(res => {}).catch(err => {
              if(this.timer) {
                clearInterval(this.timer)
              }
              this.timeCountor = 300
            })
          }
        })
      }
    },
    // 绑定邮箱
    bindEmailHandle (form) {
      this.emailOption.submitLoading = true
      bindEmail(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('绑定邮箱成功')
          this.getUserInfo()
          this.emailOption.submitLoading = false
          this.handleClose()
        }else{
          this.emailOption.submitLoading = false
        }
      }).catch(e => {
        this.emailOption.submitLoading = false
      })
    },
    // 绑定邮箱
    bindPhoneHandle (form) {
      this.phoneOption.submitLoading = true
      bindPhone(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('绑定手机成功')
          this.getUserInfo()
          this.phoneOption.submitLoading = false
          this.handleClose()
        }else{
          this.phoneOption.submitLoading = false
        }
      }).catch(e => {
        this.phoneOption.submitLoading = false
      })
    },
    // 刷新二维码
    freshWeixin () {
      $('#weixinCode').attr('src', $('#weixinCode').attr('src'))
    },
    // 注销
    loginOffHandle () {
      this.$confirm("将永久删除账号,所有企业后台不能登录,是否继续?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        loginOff().then(res => {
          if(res.data.code == 0) {
            window.parent.postMessage({command: 'loginOut'}, '*')
          }
        })
      }).catch(e => {})
    },
    // 设置密码
    setPassword () {
      this.title = '设置密码'
      this.oprationType = 'password'
      this.dialogVisible = true
    },
    // 提交密码
    submitPassWord (form) {
      let temp = encryption({
        data: form,
        key: enCodeKey,
        param: ["password"]
      });
      temp = encryption({
        data: temp,
        key: enCodeKey,
        param: ["rePassword"]
      });
      this.passOption.submitLoading = true
      setPassWord(temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('设置密码成功')
          this.passOption.submitLoading = false
          this.handleClose()
        }
      }).catch(e => {
        this.passOption.submitLoading = false
      })
    },
    // 获取切换的租户列表
    getChangeTenants () {
      let temp = []
      temp = [...this.mytenantsList, ...this.tenantsList]
      this.changeTenantsList = temp
    },
    // 切换租户
    switchTenant () {
      this.switchShadow = true
      this.$openLogin({
        successClose: false,
        hasModal: true,
        switchTenant: true,
        switchList: this.changeTenantsList,
        afterLogin: (dialog, res) => {
          dialog.handleClose()
          this.switchShadow = false
          window.parent.postMessage({command: 'fresh'}, '*')
        }
      })
    }
  },
  created () {
    this.callbackUrl = location.origin + '/%23/login/callback?back=bind'
    this.getUserInfo()
    this.getTenantInfo()
    let randomStr = Math.random() + ""
    this.randomString = '/' + (randomStr.slice(2, randomStr.length))
    localStorage.setItem('bindRandom', this.randomString)
  }
}
</script>
<style lang="scss">
.user-info-content-box{
  background: #fff;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .user-info-top{
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      display: block;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
    }
  }
  .user-info-card{
    padding: 10px 20px;
    box-sizing: border-box;
    .user-info-card-item{
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      h5{
        font-size: 16px;
        margin: 0;
        font-weight: normal;
        height: 24px;
        line-height: 24px;
        position: relative;
        text-indent: 15px;
        color: #333;
      }
      h5::before{
        content: '';
        display: block;
        width: 3px;
        height: 16px;
        position: absolute;
        background-color: #3471FF;
        top: 4px;
      }
      .left{
        flex: 1;
        i, img{
          margin-right: 20px;
        }
        i{
          font-size: 24px;
        }
        .el-icon-message{
          color: #f9ca1e;
        }
        .el-icon-mobile{
          color: #868282;
        }
        img{
          display: block;
          width: 24px;
          height: 24px;
        }
        b{
          font-weight: normal;
          margin-right: 20px;
          display: block;
          min-width: 60px;
          color: #999;
        }
        span{
          color: #666;
        }
      }
      div{
        display: flex;
        align-items: center;
      }
    }
    .tenant-list-table{
      margin-top: 10px;
      .table-body-box{
        padding: 0;
        .el-table::before{
          display: none;
        }
      }
      .el-table__body-wrapper{
        height: auto!important;
      }
      .el-table__empty-block{
        height: 255px!important;
        min-height: 200px!important;
        .el-table__empty-text::before{
          height: 100px!important;
          background-size: 220px 100px!important;
        }
      }
    }
  }
  .card-list{
    display: flex;
    flex-wrap: wrap;
    .user-info-card{
      width: calc(50% - 5px);
      margin: 0 5px;
      display: block;
      box-shadow: 0 0 10px #e5e5e5;
    }
    .user-info-card:nth-of-type(2n){
      margin-left: 0;
    }
    .user-info-card:nth-of-type(2n+1){
      margin-right: 0;
    }
    .user-info-card:nth-of-type(1){
      margin-left: 0;
      margin-right: 5px;
    }
    .user-info-card:nth-of-type(2){
      margin-left: 5px;
      margin-right: 0;
    }
    .tenant-card{
      width: 100%;
      margin: 0;
      margin: 10px 0;
    }
  }
  .switchShadow-box{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    top: 0;
    left: 0;
  }
}
.user-info-content-box::-webkit-scrollbar{
  display: none;
}
</style>