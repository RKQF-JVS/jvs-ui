<template>
  <div class="user-info-content-box">
    <div class="card-list">
      <!-- 账号信息 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <div class="left">
            <h5><span>{{tenantInfo.name}}</span>账号信息</h5>
          </div>
          <div class="right">
<!--            <jvs-button v-if="changeTenantsList && changeTenantsList.length > 1" style="color: #3471FF;" type='text' @click="switchTenant">切换组织</jvs-button>-->
          </div>
        </div>
        <div class="user-info-top">
          <div style="display: flex;flex-direction: column;align-items: center;margin-right: 12%">
            <el-upload
              ref="headImgUpload"
              class="avatar-uploader"
              action="/mgr/jvs-auth/upload/jvs-public"
              :limit="1"
              list-type="picture"
              accept=".jpg,.jpeg,.png"
              :file-list="imgFileList"
              :show-file-list="false"
              :on-remove="headImgRemove"
              :headers="headers"
              :on-success="headImgSuccessHandle"
              :on-error="headImgErrHandle"
            >
              <img v-if="userdata.headImg" :src="userdata.headImg" class="avatar">
              <i v-else class="el-icon-picture-outline" style="font-size:18px;"></i>
            </el-upload>
            <div>
              <el-input ref="editName" v-if="editNameShow" v-model="realName" size="mini" @blur="realNameEdit"></el-input>
              <span v-else>
                <span @dblclick="editRealName">{{userdata.realName}}</span>
                <i v-if="userdata.realName" class="el-icon-edit" style="cursor:pointer;margin-left:10px;" @click="editRealName"></i>
              </span>
            </div>
          </div>
          <div style="margin-right: 12%;">
            <div style="margin-bottom: 20px">
              <span style="color: #a2a3a5;margin-right: 16px;">部门</span>
              <span>{{userdata && userdata.deptName}}</span>
            </div>
            <div>
              <span style="color: #a2a3a5;margin-right: 16px;">账号等级</span>
              <span>{{(userdata && userdata.level)}}</span>
            </div>
          </div>
          <div style="margin-right: 12%;">
            <div style="margin-bottom: 20px">
              <span style="color: #a2a3a5;margin-right: 16px;">职工编号</span>
              <span>{{userdata && userdata.employeeNo}}</span>
            </div>
            <div>
              <span style="color: #a2a3a5;margin-right: 16px;">职位</span>
              <span>{{(userdata && userdata.jobName)}}</span>
            </div>
          </div>
        </div>
<!--        <div class="user-info-card-item">-->
<!--          <div class="left">-->
<!--            <b>部门</b>-->
<!--            <span>{{userdata && userdata.deptName}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="user-info-card-item">-->
<!--          <div class="left">-->
<!--            <b>账号等级</b>-->
<!--            <span>{{(userdata && userdata.level)}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="user-info-card-item">-->
<!--          <div class="left">-->
<!--            <b>职工编号</b>-->
<!--            <span>{{userdata && userdata.employeeNo}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="user-info-card-item">-->
<!--          <div class="left">-->
<!--            <b>职位</b>-->
<!--            <span>{{userdata && userdata.jobName}}</span>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <!-- 绑定账号 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <h5>绑定账号</h5>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <i class="el-icon-user"></i>
            <b>账号</b>
            <span>
              <el-input ref="editAccount" v-if="editAccountShow" v-model="accountName" size="mini" @blur="accountNameEdit"></el-input>
              <span v-else>{{userdata.accountName}}</span>
            </span>
          </div>
          <div class="right">
            <jvs-button type="text" style="color: #3471FF;" @click="editAccount">修改账号</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item" v-if="enableTypeList.indexOf('EMAIL') > -1">
          <div class="left">
            <i class="el-icon-message"></i>
            <b>邮箱</b>
            <span>{{userdata.email}}</span>
          </div>
          <div class="right">
            <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('email')">{{userdata.email ? '解除绑定' : '绑定邮箱'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item" v-if="enableTypeList.indexOf('WECHAT_MP') > -1">
          <div class="left">
            <img :src="wxImg" alt="">
            <b>微信</b>
            <!-- WECHAT_OPEN -->
            <span>{{userdata.exceptions && userdata.exceptions.WECHAT_MP && userdata.exceptions.WECHAT_MP.nickname}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('wx')">{{(userdata.exceptions && userdata.exceptions.WECHAT_MP && userdata.exceptions.WECHAT_MP.nickname) ? '解除绑定' : '绑定微信'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item">
          <div class="left">
            <i class="el-icon-mobile"></i>
            <b>手机</b>
            <span>{{userdata.phone}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('phone')">{{userdata.phone ? '解除绑定' : '绑定手机'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item" v-if="enableTypeList.indexOf('WX_ENTERPRISE') > -1">
          <div class="left">
            <img :src="qwImg" alt="">
            <b>企业微信</b>
            <span>{{userdata.exceptions && userdata.exceptions.WX_ENTERPRISE && userdata.exceptions.WX_ENTERPRISE.username}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('wxenterprise')">{{(userdata.exceptions && userdata.exceptions.WX_ENTERPRISE && userdata.exceptions.WX_ENTERPRISE.username) ? '解除绑定' : '绑定企业微信'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item" v-if="enableTypeList.indexOf('DING_H5') > -1">
          <div class="left">
            <img :src="ddImg" alt="">
            <b>钉钉</b>
            <span>{{userdata.exceptions && userdata.exceptions.Ding && (userdata.exceptions.Ding.nick || userdata.exceptions.Ding.name)}}</span>
          </div>
          <div class="right">
             <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('dd')">{{(userdata.exceptions && userdata.exceptions.Ding && (userdata.exceptions.Ding.nick || userdata.exceptions.Ding.name)) ? '解除绑定' : '绑定钉钉'}}</jvs-button>
          </div>
        </div>
        <div class="user-info-card-item" v-if="enableTypeList.indexOf('LDAP') > -1">
          <div class="left">
            <img :src="ldapImg" alt="">
            <b>LDAP</b>
            <span>{{userdata.exceptions && userdata.exceptions.LDAP && (userdata.exceptions.LDAP.displayName || userdata.exceptions.LDAP.uid)}}</span>
          </div>
          <div class="right">
            <jvs-button type="text" style="color: #3471FF;" @click="bindOprateHandle('ldap')">{{(userdata.exceptions && userdata.exceptions.LDAP && ((userdata.exceptions.LDAP.displayName || userdata.exceptions.LDAP.uid))) ? '解除绑定' : '绑定LDAP'}}</jvs-button>
          </div>
        </div>
      </div>
      <!-- 我的组织 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <h5>我的组织</h5>
        </div>
        <jvs-table :showHeader="false" class="tenant-list-table" :loading="mytableLoading" :option="tenantOption" :data="mytenantsList" @on-load="getMyTenantListHandle">
<!--          <template slot="menu" slot-scope="scope">-->
<!--            <jvs-button type="text" @click="delTenantListHandle(scope.row, 'my')">解散组织</jvs-button>-->
<!--          </template>-->
        </jvs-table>
      </div>
      <!-- 加入的组织 -->
      <div class="user-info-card tenant-card" v-show="tenantsList && tenantsList.length > 0">
        <div class="user-info-card-item">
          <h5>我加入组织</h5>
        </div>
        <jvs-table :showHeader="false" class="tenant-list-table" :loading="tableLoading" :option="tenantOption" :data="tenantsList" @on-load="getJoinTenantListHandle">
          <template slot="menu" slot-scope="scope">
            <jvs-button type="text" @click="delTenantListHandle(scope.row, 'join')">退出组织</jvs-button>
          </template>
        </jvs-table>
      </div>
      <!-- 设置登录密码 -->
      <div class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <div class="left">
            <h5>设置登录密码</h5>
          </div>
        </div>
        <div class="notice">
          <el-alert
            title="设置密码后不影响其他功能的使用"
            type="info"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <div class="user-info-card-item">
          <div class="left">设置登录密码后，可以使用账号密码直接登录，不用验证码登录</div>
          <div class="right"><jvs-button type="text" style="color: #3471FF;" @click="setPassword">设置密码</jvs-button></div>
        </div>
      </div>
      <!-- 注销 -->
      <div v-show="false" class="user-info-card tenant-card">
        <div class="user-info-card-item">
          <div class="left">
            <h5>删除所有数据，永久注销账号</h5>
          </div>
        </div>
        <div class="notice">
          <el-alert
            title="注销用户后，将无法使用此平台。所有哦加入的组织都将无法登录，请谨慎操作"
            type="info"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <div class="user-info-card-item">
          <div class="left">永久删除账号，所有企业后台不能登录</div>
          <div class="right"><jvs-button type="text" style="color: #3471FF;" @click="loginOffHandle">注销</jvs-button></div>
        </div>
      </div>
    </div>
    <div class="switchShadow-box" v-if="false && switchShadow"></div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="['wxenterprise', 'dd', 'wx'].indexOf(oprationType) > -1 ? '360px' : ''"
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
        <div v-if="oprationType == 'wx' " style="position:relative;overflow:hidden;height:350px;">
          <div v-loading="QRLoading" v-if="OfficQrcodeUrl" element-loading-text="正在登录..." style="position: absolute;top: -50px;left: 50%;margin-left: -165px;width: 330px;min-height: auto;display: flex;align-items: center;justify-content: center;flex-direction: column;">
            <div style="font-size:22px;">微信扫一扫登录</div>
            <img id="weixinCode"  @click="freshWeixin" :src="OfficQrcodeUrl"  scrolling="no"  frameborder="0" height="330" width="330" style="cursor:pointer;"/>
            <div style="font-size: 14px;margin-top: 5px;">扫码关注公众号完成登录</div>
            <div v-if="isExpires" @click="freshWeixin">二维码已失效,点击刷新</div>
          </div>
        </div>
        <!-- <div v-if="oprationType == 'wx'" style="position: relative;height: 350px;">
          <div @click="freshWeixin" style="width: 300px;height: 330px;position: absolute;left: 50%;margin-left: -150px;cursor:pointer;z-index: 9;">
          </div>
          <iframe id="weixinCode" :src="`/auth/just/login/WECHAT_OPEN?client_id=${client_id}&url=` + callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;" scrolling="no"  frameborder="0" height="330"></iframe>
        </div> -->
        <!-- 密码 -->
        <jvs-form v-if="oprationType == 'password'" ref="passForm" :option="passOption" :formData="passForm" @submit="submitPassWord">
        </jvs-form>
        <!-- 企业微信 -->
        <div v-if="oprationType == 'wxenterprise'" style="position:relative;overflow:hidden;height:300px;">
          <iframe id="wxenterpriseCode" :src="`/auth/just/login/WECHAT_ENTERPRISE?client_id=${client_id}&url=`+ callbackUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;top:-24px;" scrolling="no"  frameborder="0" height="330"></iframe>
        </div>
        <!-- 钉钉扫码 -->
        <div v-if="oprationType == 'dd'" style="position:relative;overflow:hidden;height:300px;">
          <iframe id="ddLogin" v-if="ddCodeUrl" :src="ddCodeUrl" style="position: absolute;left: 50%;margin-left: -150px;cursor:pointer;width:300px;height:330px;" scrolling="no"  frameborder="0" height="330"></iframe>
        </div>
        <!-- LDAP -->
        <jvs-form v-if="oprationType == 'ldap'" :option="ldapOption" :formData="ldapForm" @submit="ldapSubmit" @cancalClick="handleClose"></jvs-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserInfo, getUserTenantInfo,
  getMyTenantList, delMyTenantList,
  getJoinTenantList, delJoinTenantList,
  bindEmail, unbindEmail, sendEmailCode,
  bindPhone, unbindPhone, sendPhoneCode,
  unbindWX, unbindQW, unbindDD, bindLDAP, unbindLDAP, bindWX,
  setPassWord, loginOff, updateAccountHead} from "@/api/admin/user"
import wxImg from '@/components/basic-container/login/icon/wx.png'
import qwImg from '@/components/basic-container/login/icon/qw.png'
import ddImg from '@/components/basic-container/login/icon/dinglogo.png'
import ldapImg from '@/components/basic-container/login/icon/ldap.png'
import { isEmail, isMobile } from '@/util/validate'
import { encryption } from "@/util/util";
import { enCodePasswordKey } from "@/const/const"
import { editUser, getEnableTypes } from './api'
import store from "@/store";
import { getInfoByLoginType } from '@/api/login'
import { enCodeKey, client_id } from "@/const/const"
import { getOffLoginQcode, checkQrcodeState } from '@/api/login'
import {loginoutHandle} from "@/api/admin/home";
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
      qwImg: qwImg,
      ddImg: ddImg,
      ldapImg: ldapImg,
      mytenantsList: [],
      tenantsList: [],
      mytableLoading: false,
      tableLoading: false,
      tenantOption: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        align: "left",
        menuAlign: "right",
        hideTop: true,
        page: false,
        column: [
          {
            label: "logo",
            prop: "logo",
            type: 'image',
            // width: 245,
            imgHeight: 45,
            // width: 300
          },
          {
            label: "logo",
            prop: "empty",
            width: '100px'
          },
          {
            label: "组织名称",
            prop: "name",
            // width: '240px'
            width: '640px'
          },
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
      callbackUrl: '',
      editAccountShow: false,
      accountName: '',
      editNameShow: false,
      realName: '',
      imgFileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: ('Bearer '+this.$store.getters.access_token)
      },
      ddCodeUrl: '',
      ddInfo: null,
      ldapForm: {},
      ldapOption: {
        emptyBtn: false,
        submitLoading: false,
        column: [
          {
            label: '账号',
            prop: 'account',
            rules: [ { required: true, message: "请输入账号", trigger: "blur" } ]
          },
          {
            label: '密码',
            prop: 'password',
            showpassword: true,
            rules: [ { required: true, message: "请输入密码", trigger: "blur" } ]
          }
        ]
      },
      isExpires:false, //二维码是否过期
      OfficQrcodeUrl: '',
      QRcodeUUId: '',
      QRCheckSetInterval: null,
      QRChcekSetTimeout: null,
      QRLoading: false,
      client_id: client_id,
      enableTypeList: []
    }
  },
  methods: {
    // 用户信息
    getUserInfo () {
      getUserInfo().then(res => {
        if(res.data.code == 0) {
          this.$set(this, 'userdata', res.data.data)
          // console.log(this.userdata)
          this.accountName = this.userdata.accountName
          this.realName = this.userdata.realName
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
              this.freshToken()
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
      if(this.QRCheckSetInterval){
        clearInterval(this.QRCheckSetInterval)
      }
      if(this.QRChcekSetTimeout){
        clearTimeout(this.QRChcekSetTimeout)
      }
    },
    // 绑定操作
    bindOprateHandle (type) {
      let str = ""
      // 解绑
      if(['email', 'phone', 'ldap'].indexOf(type) > -1) {
        let func = null
        let typestr = ''
        if(type == 'email') {
          str = "即将解除邮箱绑定，是否继续？"
          func = unbindEmail
          typestr = '邮箱'
        }
        if(type == 'phone') {
          str = "即将解除手机号绑定，是否继续？"
          func = unbindPhone
          typestr = '手机'
        }
        if(type == 'ldap') {
          str = "即将解除LDAP绑定，是否继续？"
          func = unbindLDAP
          typestr = 'LDAP'
        }
        if(['email', 'phone'].indexOf(type) > -1 ? this.userdata[type] : (this.userdata.exceptions && this.userdata.exceptions.LDAP && ((this.userdata.exceptions.LDAP.displayName || this.userdata.exceptions.LDAP.uid)))) {
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(func) {
              func().then(res => {
                if(res.data.code == 0) {
                  this.$message.success('已成功解绑' + typestr )
                  this.getUserInfo()
                  this.freshToken()
                }
              })
            }
          }).catch(e => {})
        }else{ // 绑定
          this.title = '绑定' + typestr
          this.oprationType = type
          this.dialogVisible = true
        }
      }
      // 微信
      if(type == 'wx'){
        str = "即将解除微信绑定，是否继续？"
        // 解绑
        // WECHAT_OPEN
        if(this.userdata.exceptions && this.userdata.exceptions.WECHAT_MP && this.userdata.exceptions.WECHAT_MP.nickname) {
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            unbindWX().then(res => {
              if(res.data.code == 0) {
                this.$message.success('已成功解绑微信')
                this.getUserInfo()
                this.freshToken()
                this.$forceUpdate()
              }
            })
          }).catch(e => {})
        }else{ // 绑定微信
          this.QRLoading = false
          this.getOffLoginQcode(type)
        }
      }
      // 企业微信
      if(type == 'wxenterprise') {
        // 解绑
        if(this.userdata.exceptions && this.userdata.exceptions.WX_ENTERPRISE && this.userdata.exceptions.WX_ENTERPRISE.username) {
          str = "即将解除企业微信绑定，是否继续？"
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            unbindQW().then(res => {
              if(res.data.code == 0) {
                this.$message.success('已成功解绑企业微信')
                this.getUserInfo()
                this.freshToken()
                this.$forceUpdate()
              }
            })
          }).catch(e => {})
        }
        // 绑定
        else{
          this.title = '绑定企业微信'
          this.oprationType = type
          this.dialogVisible = true
        }
      }
      // 钉钉
      if(type == 'dd') {
        // 解绑
        if(this.userdata.exceptions && this.userdata.exceptions.Ding && (this.userdata.exceptions.Ding.nick || this.userdata.exceptions.Ding.name)) {
          str = "即将解除钉钉绑定，是否继续？"
          this.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            unbindDD().then(res => {
              if(res.data.code == 0) {
                this.$message.success('已成功解绑钉钉')
                this.getUserInfo()
                this.freshToken()
                this.$forceUpdate()
              }
            })
          }).catch(e => {})
        }
        // 绑定
        else{
          this.getDDCode()
          this.title = '绑定钉钉'
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
          this.freshToken()
          this.emailOption.submitLoading = false
          this.handleClose()
        }else{
          this.emailOption.submitLoading = false
        }
      }).catch(e => {
        this.emailOption.submitLoading = false
      })
    },
    // 绑定手机
    bindPhoneHandle (form) {
      this.phoneOption.submitLoading = true
      bindPhone(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('绑定手机成功')
          this.getUserInfo()
          this.freshToken()
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
      this.getOffLoginQcode('wx')
      // $('#weixinCode').attr('src', $('#weixinCode').attr('src'))
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
        key: enCodePasswordKey, // enCodePasswordKey,
        param: ["password"]
      });
      temp = encryption({
        data: temp,
        key: enCodePasswordKey, // enCodePasswordKey,
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
      this.changeTenantsList = temp.filter(ti => {
        return ti.id != this.$store.getters.userInfo.tenantId
      })
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
    },
    // 修改账号
    editAccount () {
      this.editAccountShow = true
      this.$nextTick(()=>{
        this.$refs.editAccount.focus()
      })
    },
    accountNameEdit () {
      if (this.accountName !== this.$store.getters.userInfo.accountName) {
        this.$confirm("修改账号后需重新登录，确认修改？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editAccountShow = false
          if(this.accountName != this.userdata.accountName) {
            updateAccountHead('accountName', this.accountName).then(res =>{
              if(res.data && res.data.code == 0) {
                this.$message.success('修改成功')
                this.$set(this.userdata, 'accountName', this.accountName)
                this.getUserInfo()
                this.handleLogout()
              }
            })
          }
        }).catch(e => {
          this.editAccountShow = false
          this.accountName = this.$store.getters.userInfo.accountName
        })
      } else {
        this.editAccountShow = false
      }
    },
    editRealName () {
      this.editNameShow = true
      this.$nextTick(() => {
        this.$refs.editName.focus()
      })
    },
    realNameEdit () {
      this.editNameShow = false
      if(this.realName != this.userdata.realName) {
        let obj = JSON.parse(JSON.stringify(this.userdata))
        obj.realName = this.realName
        editUser(obj).then(res =>{
          if(res.data && res.data.code == 0) {
            this.$message.success('修改成功')
            this.$set(this.userdata, 'realName', this.realName)
            this.getUserInfo()
            this.freshToken()
          }
        })
      }
    },
    // 退出登录
    handleLogout() {
      loginoutHandle().then(res => {
        if(res.data.code == 0) {
          let path = this.$store.state.common.template || '/login'
          sessionStorage.clear()
          this.$store.dispatch("LogOut")
          window.parent.location.reload()
          this.$router.push({ path: path })
        }
      })
    },
    // 刷新token
    freshToken () {
      store.dispatch('RefreshToken', store.getters.tenantId).then(res => {
        window.parent.postMessage({command: 'fresh'}, '*')
      }).catch(e => {
        store.dispatch("LogOut").then(() => {
          sessionStorage.setItem('lastUrl', lastUrl)
          router.push({ path: "/login" });
          window.parent.postMessage({command: 'loginOut'}, '*')
        });
      })
    },
    headImgRemove (file, fileList) {
      this.imgFileList = fileList
      this.$set(this.userdata, 'headImg', '')
    },
    headImgSuccessHandle (res, file, fileList) {
      if(res.code == 0) {
        updateAccountHead('headImg', res.data.fileLink).then(res =>{
          if(res.data && res.data.code == 0) {
            this.$set(this.userdata, 'headImg', res.data.fileLink)
            this.imgFileList = [{
              url: res.data.fileLink
            }]
            this.$message.success('上传头像成功')
            this.getUserInfo()
            this.freshToken()
          }
        })
      }else{
        this.$refs.headImgUpload.clearFiles()
        this.$message.error(res.msg)
      }
    },
    headImgErrHandle (err, file, fileList) {
      this.$refs.headImgUpload.clearFiles()
      this.$message.error(err)
    },
    // 钉钉二维码生成
    getDDCode () {
      getInfoByLoginType({type: 'dd'}).then(res => {
        if(res && res.data && res.data.code == 0) {
          this.ddInfo = res.data.data
          let url = encodeURIComponent(`${location.origin}/#/login/dingtalk/bindback`);
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
        let url = encodeURIComponent(`${location.origin}/#/login/dingtalk/bindback`);
        let goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.ddInfo.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)
        window.parent.postMessage({command: 'openUrl', url: `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.ddInfo.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${goto}&loginTmpCode=${loginTmpCode}`}, '*')
      }
    },
    // 绑定LDAP
    ldapSubmit (form) {
      let userInfo = JSON.parse(JSON.stringify(this.ldapForm))
      let tp = {
        data: JSON.stringify(userInfo)
      }
      let temp = encryption({
        data: tp,
        key: enCodeKey,
        param: ["data"]
      })
      this.ldapOption.submitLoading = true
      bindLDAP({ code: temp.data, appId: client_id }).then(res => {
        if(res.data.code == 0) {
          this.$message.success('绑定LDAP成功')
          this.getUserInfo()
          this.freshToken()
          this.ldapOption.submitLoading = false
          this.handleClose()
        }else{
          this.ldapOption.submitLoading = false
        }
      }).catch(e => {
        this.ldapOption.submitLoading = false
      })
    },
    // 获取微信公众号二维码
    getOffLoginQcode(type){
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
          this.title = '绑定微信'
          this.oprationType = type
          this.dialogVisible = true
          this.startCheckState()
        }
      })
    },
    getUUId(){
      return URL.createObjectURL(new Blob()).substr(-36)
    },
    // 检查微信公众号登录状态
    startCheckState(){
      if(this.QRCheckSetInterval){
        clearInterval(this.QRCheckSetInterval)
      }
      if(this.QRChcekSetTimeout){
        clearTimeout(this.QRChcekSetTimeout)
      }
      this.QRCheckSetInterval = setInterval(()=>{
        checkQrcodeState(this.QRcodeUUId).then(res=>{
          if(res.data.code == 0 && res.data.data.checkStatus){
            this.QRLoading = true
            if(this.QRCheckSetInterval){
              clearInterval(this.QRCheckSetInterval)
            }
            let tp = {
              data: JSON.stringify({id: this.QRcodeUUId})
            }
            let temp = encryption({
              data: tp,
              key: enCodeKey,
              param: ["data"]
            })
            bindWX({ code: temp.data, appId: client_id }).then(res => {
              if(res.data.code == 0) {
                this.$message.success('绑定微信成功')
                this.getUserInfo()
                this.freshToken()
                this.handleClose()
              }else{
                this.QRLoading = false
                this.OfficQrcodeUrl = ''
                this.freshWeixin()
              }
            }).catch(e => {
              this.QRLoading = false
              this.oprationType = ''
              this.OfficQrcodeUrl = ''
              this.oprationType = 'wx'
              this.freshWeixin()
              this.$forceUpdate()
            })
          }else if(res.data.code == 0 && res.data.data.isPastDue){
            this.isExpires = true
            if(this.QRCheckSetInterval){
              clearInterval(this.QRCheckSetInterval)
            }
          }
        })
      },1000 * 2)
    },
  },
  created () {
    getEnableTypes().then(res => {
      if(res.data && res.data.code == 0 && res.data.data) {
        this.enableTypeList = res.data.data
      }
    })
    this.callbackUrl = location.origin + '/%23/login/callback?back=bind'
    this.getUserInfo()
    this.getTenantInfo()
    let randomStr = Math.random() + ""
    this.randomString = '/' + (randomStr.slice(2, randomStr.length))
    localStorage.setItem('bindRandom', this.randomString)
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
.user-info-content-box{
  //background: #fff;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .user-info-top{
    display: flex;
    font-size: 14px;
    //flex-direction: column;
    //align-items: center;
    img{
      //display: block;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
    }
    .avatar-uploader{
      width: 50px;
      height: 50px;
      //line-height: 50px;
      margin-bottom: 8px;
      //text-align: center;
    }
  }
  .user-info-card{
    border-radius: 6px;
    background: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
    .notice{
      margin-bottom: 8px;
      width: 600px;
      .el-alert__content{
        line-height: 16px;
      }
      .el-alert--info.is-light{
        background-color: #EFF2F7;
      }
    }
    .user-info-card-item{
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
      height: 24px;
      line-height: 24px;
      margin-bottom: 8px;
      h5{
        font-size: 15px;
        //margin: 0;
        font-weight: normal;
        height: 24px;
        line-height: 24px;
        position: relative;
        //text-indent: 15px;
        font-weight: bold;
        color: #333;
      }
      h5::before{
        //content: '';
        //display: block;
        //width: 3px;
        //height: 16px;
        //position: absolute;
        //background-color: #3471FF;
        //top: 4px;
      }
      .left{
        //flex: 1;
        width: 40%;
        i, img{
          margin-right: 20px;
        }
        i{
          font-size: 24px;
        }
        .el-icon-user{
          color: #7b7a9f;
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
        td{
          border: 0;
        }
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
    //width: 550px;
    //margin-left: calc(50% - 275px);
    //width: 750px;
    //margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    .user-info-card{
      width: calc(50% - 5px);
      margin: 0 5px;
      display: block;
      // box-shadow: 0 0 10px #e5e5e5;
    }
    .user-info-card:nth-of-type(2n){
      margin-left: 0;
    }
    .user-info-card:nth-of-type(2n+1){
      margin-right: 0;
    }
    .user-info-card:nth-of-type(1){
      margin-left: 0;
      //margin-right: 5px;
    }
    .user-info-card:nth-of-type(2){
      //margin-left: 5px;
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
