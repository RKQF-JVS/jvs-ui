<template>
  <div :class="{'app-info-setting': true, 'app-info-setting-loading': showLoading}">
    <div class="app-info-set-title">
      <div>
        <span>可以针对每一个终端开通不同的个性化配置，支持LOGO、登录页、名称自定义，支持公众号、企业微信、企业钉钉、idap多种平台集成。</span>
      </div>
      <div class="tip">
        <p>不同终端基础配置时不允许域名相同</p>
        <p>开通了不同三方集成后才能正常使用消息通知</p>
      </div>
    </div>
    <el-tabs v-if="!showLoading" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.name" :name="item.id">
        <div class="item-box" v-if="activeName == item.id">
          <div class="info-card basic-info">
            <h4>
              <div class="left">
                <span style="margin-right: 20px;">基本设置</span>
                <el-switch v-model="appInfoData[item.appKey].BASIC.enable" size="mini"></el-switch>
              </div>
            </h4>
            <div class="el-message el-message--info info-text">
              <i class="el-message__icon el-icon-info"></i>
              <p class="el-message__content">************ <a href="javascript:void(0);" target="_blank">如何获取配置</a></p>
            </div>
            <div class="content-box" v-if="appInfoData[item.appKey].BASIC.enable">
              <jvs-form ref="basicForm" :option="basicOption" :formData="appInfoData[item.appKey].BASIC"></jvs-form>
              <div>
                <el-button type="primary" size="mini" :loading="basicLoading" @click="saveInfoHandle('basicForm', item, 'BASIC', appInfoData[item.appKey])">保存</el-button>
              </div>
            </div>
          </div>
          <div class="info-card dingding-info">
            <h4>
              <div class="left">
                <span style="margin-right: 20px;">钉钉H5应用</span>
                <el-switch v-model="appInfoData[item.appKey].DING_H5.enable" size="mini"></el-switch>
              </div>
            </h4>
            <div class="el-message el-message--info info-text">
              <i class="el-message__icon el-icon-info"></i>
              <p class="el-message__content">************ <a href="javascript:void(0);" target="_blank">如何获取配置</a></p>
            </div>
            <div class="content-box" v-if="appInfoData[item.appKey].DING_H5.enable">
              <jvs-form ref="dingForm" :option="dingOption" :formData="appInfoData[item.appKey].DING_H5"></jvs-form>
              <div>
                <el-button type="primary" size="mini" :loading="dingLoading" @click="saveInfoHandle('dingForm', item, 'DING_H5', appInfoData[item.appKey])">保存</el-button>
              </div>
            </div>
          </div>
          <div class="info-card wx-info">
            <h4>
              <div class="left">
                <span style="margin-right: 20px;">企业微信应用</span>
                <el-switch v-model="appInfoData[item.appKey].WX_ENTERPRISE.enable" size="mini"></el-switch>
              </div>
            </h4>
            <div class="el-message el-message--info info-text">
              <i class="el-message__icon el-icon-info"></i>
              <p class="el-message__content">************ <a href="javascript:void(0);" target="_blank">如何获取配置</a></p>
            </div>
            <div class="content-box" v-if="appInfoData[item.appKey].WX_ENTERPRISE.enable">
              <jvs-form ref="wxForm" :option="wxOption" :formData="appInfoData[item.appKey].WX_ENTERPRISE"></jvs-form>
              <div>
                <el-button type="primary" size="mini" :loading="wxLoading" @click="saveInfoHandle('wxForm', item, 'WX_ENTERPRISE', appInfoData[item.appKey])">保存</el-button>
              </div>
            </div>
          </div>
          <div class="info-card wechatMp-info">
            <h4>
              <div class="left">
                <span style="margin-right: 20px;">微信公众号</span>
                <el-switch v-model="appInfoData[item.appKey].WECHAT_MP.enable" size="mini"></el-switch>
              </div>
            </h4>
            <div class="el-message el-message--info info-text">
              <i class="el-message__icon el-icon-info"></i>
              <p class="el-message__content">************ <a href="javascript:void(0);" target="_blank">如何获取配置</a></p>
            </div>
            <div class="content-box" v-if="appInfoData[item.appKey].WECHAT_MP.enable">
              <jvs-form ref="wechatMpForm" :option="wechatMpOption" :formData="appInfoData[item.appKey].WECHAT_MP"></jvs-form>
              <div>
                <el-button type="primary" size="mini" :loading="wechatMpLoading" @click="saveInfoHandle('wechatMpForm', item, 'WECHAT_MP', appInfoData[item.appKey])">保存</el-button>
              </div>
            </div>
          </div>
          <div class="info-card LDAP-info">
            <h4>
              <div class="left">
                <span style="margin-right: 20px;">LDAP</span>
                <el-switch v-model="appInfoData[item.appKey].LDAP.enable" size="mini"></el-switch>
              </div>
            </h4>
            <div class="el-message el-message--info info-text">
              <i class="el-message__icon el-icon-info"></i>
              <p class="el-message__content">************ <a href="javascript:void(0);" target="_blank">如何获取配置</a></p>
            </div>
            <div class="content-box" v-if="appInfoData[item.appKey].LDAP.enable">
              <jvs-form ref="LDAPForm" :option="LDAPOption" :formData="appInfoData[item.appKey].LDAP"></jvs-form>
              <div>
                <el-button type="primary" size="mini" :loading="LDAPLoading" @click="saveInfoHandle('LDAPForm', item, 'LDAP', appInfoData[item.appKey])">保存</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getAppList } from '../application/api'
import { getAppSetByTenant, saveAppSetByTenant } from './api'
export default {
  name: 'app-info',
  props: {
    rowData: {
      type: Object
    }
  },
  data () {
    return {
      showLoading: true,
      tabList: [],
      activeName: '',
      appInfoData: {},
      basic: {
        enable: false,
        name: '',
        domain: '',
        icon: [],
        logo: [],
        bgImg: []
      },
      basicLoading: false,
      basicOption: {
        btnHide: true,
        column: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '域名',
            prop: 'domain'
          },
          {
            label: 'ICON',
            prop: 'icon',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 32 * 32',
              position: 'bottom'
            }
          },
          {
            label: 'LOGO',
            prop: 'logo',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 200 * 60',
              position: 'bottom'
            }
          },
          {
            label: '背景图',
            prop: 'bgImg',
            type: 'imageUpload',
            limit: 1,
            multipleUpload: false,
            fileList: [],
            action: '/mgr/jvs-auth//upload/jvs-public?module=tenantPicture',
            tips: {
              text: '建议 1920 * 1080',
              position: 'bottom'
            }
          },
        ]
      },
      DING_H5: {
        enable: false,
        agentId: '', // 钉钉H5微应用的AgentId
        appId: '', // 钉钉H5微应用的appKey
        appSecret: '', // 钉钉H5微应用的appSecret
        enableScan: false, // 是否支持扫码登录
        redirectUri: '/#/login/dingtalk/scanback', // 重定向地址
      },
      dingLoading: false,
      dingOption: {
        btnHide: true,
        column: [
          {
            label: 'appKey',
            prop: 'appId',
            rules: [ { required: true, message: '请输入钉钉H5微应用的appKey', trigger: 'blur' } ],
          },
          {
            label: 'appSecret',
            prop: 'appSecret',
            rules: [ { required: true, message: '请输入钉钉H5微应用的appSecret', trigger: 'blur' } ],
          },
          {
            label: 'AgentId',
            prop: 'agentId',
            rules: [ { required: true, message: '请输入钉钉H5微应用的appKey', trigger: 'blur' } ],
          },
          {
            label: '开启扫码登录',
            prop: 'enableScan',
            type: 'switch'
          },
          {
            label: '重定向地址',
            prop: 'redirectUri',
            rules: [ { required: true, message: '请输入重定向地址', trigger: 'blur' } ],
            defaultValue: `/#/login/dingtalk/scanback`,
            disabled: true,
            display: false
          }
        ]
      },
      WX_ENTERPRISE: {
        enable: false,
        enableScan: false, // 是否支持扫码登录
        agentId: '', // 企业微信应用的AgentId
        appId: '', // 企业微信的corp_id（企业id）
        appSecret: '', // 企业微信应用的Secret
        redirectUri: '/auth/just/callback', // 重定向地址
      },
      wxLoading: false,
      wxOption: {
        btnHide: true,
        column: [
          {
            label: 'appKey',
            prop: 'appId',
            rules: [ { required: true, message: '请输入企业微信的corp_id（企业id）', trigger: 'blur' } ],
          },
          {
            label: 'appSecret',
            prop: 'appSecret',
            rules: [ { required: true, message: '请输入企业微信应用的Secret', trigger: 'blur' } ],
          },
          {
            label: 'AgentId',
            prop: 'agentId',
            rules: [ { required: true, message: '请输入企业微信应用的AgentId', trigger: 'blur' } ],
          },
          {
            label: '开启扫码登录',
            prop: 'enableScan',
            type: 'switch'
          },
          {
            label: '重定向地址',
            prop: 'redirectUri',
            rules: [ { required: true, message: '请输入重定向地址', trigger: 'blur' } ],
            defaultValue: `/auth/just/callback`,
            disabled: true,
            display: false
          }
        ]
      },
      WECHAT_MP: {
        enable: false,
        enableScan: false, // 是否支持扫码登录
        appId: '',
        appSecret: '',
        token: '',
        aesKey: ''
      },
      wechatMpLoading: false,
      wechatMpOption: {
        btnHide: true,
        column: [
          {
            label: 'appKey',
            prop: 'appId',
            rules: [ { required: true, message: '请输入appKey', trigger: 'blur' } ],
          },
          {
            label: 'appSecret',
            prop: 'appSecret',
            rules: [ { required: true, message: '请输入appSecret', trigger: 'blur' } ],
          },
          {
            label: 'token',
            prop: 'token',
            // rules: [ { required: true, message: '请输入token', trigger: 'blur' } ],
          },
          {
            label: 'aesKey',
            prop: 'aesKey',
            // rules: [ { required: true, message: '请输入aesKey', trigger: 'blur' } ],
          },
          {
            label: '开启扫码登录',
            prop: 'enableScan',
            type: 'switch'
          }
        ]
      },
      LDAP: {
        enable: false,
        base: '',
        urls: '',
        username: '',
        password: '',
        accountAttribute: ''
      },
      LDAPLoading: false,
      LDAPOption: {
        btnHide: true,
        column: [
          {
            label: 'base',
            prop: 'base',
            rules: [ { required: true, message: '请输入base', trigger: 'blur' } ],
          },
          {
            label: 'urls',
            prop: 'urls',
            rules: [ { required: true, message: '请输入urls', trigger: 'blur' } ],
            tips: {
              position: 'bottom',
              text: '多个url以英文逗号,分隔'
            }
          },
          {
            label: '用户名',
            prop: 'username',
            rules: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
          },
          {
            label: '密码',
            prop: 'password',
            rules: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
          },
          {
            label: '账号字段',
            prop: 'accountAttribute',
            tips: {
              position: 'bottom',
              text: '为空则默认使用uid'
            }
          },
        ]
      },
    }
  },
  async created () {
    this.showLoading = true
    await this.getAppListHandle()
    if(this.rowData && this.rowData.id) {
     this.getAppSetByTenantHandle()
    }
  },
  methods: {
    getAppSetByTenantHandle () {
      getAppSetByTenant(this.rowData.id).then(res => {
        if(res && res.data && res.data.code == 0){
          if(res.data.data) {
            this.appInfoData = res.data.data
          }
          this.formatData()
        }
      })
    },
    async getAppListHandle () {
      await getAppList({current: 1, size: 1000}).then(res => {
        if(res && res.data && res.data.code == 0 && res.data.data) {
          this.tabList = res.data.data.records
          if(this.tabList && this.tabList.length > 0) {
            this.activeName = this.tabList[0].id
          }
        }
      })
    },
    formatData () {
      this.tabList.filter(item => {
        if(!this.appInfoData[item.appKey]) {
          this.$set(this.appInfoData, item.appKey, {
            BASIC: JSON.parse(JSON.stringify(this.basic)),
            DING_H5: JSON.parse(JSON.stringify(this.DING_H5)),
            WX_ENTERPRISE: JSON.parse(JSON.stringify(this.WX_ENTERPRISE)),
            WECHAT_MP: JSON.parse(JSON.stringify(this.WECHAT_MP)),
            LDAP: JSON.parse(JSON.stringify(this.LDAP))
          })
        }else{
          if(!this.appInfoData[item.appKey].BASIC) {
            this.$set(this.appInfoData[item.appKey], 'BASIC', JSON.parse(JSON.stringify(this.basic)))
          }else{
            // 上传图片数据类型转换
            if(this.appInfoData[item.appKey].BASIC.icon) {
              this.$set(this.appInfoData[item.appKey].BASIC, 'icon', [{url: this.appInfoData[item.appKey].BASIC.icon}])
            }else{
              this.$set(this.appInfoData[item.appKey].BASIC, 'icon', [])
            }
            if(this.appInfoData[item.appKey].BASIC.logo) {
              this.$set(this.appInfoData[item.appKey].BASIC, 'logo', [{url: this.appInfoData[item.appKey].BASIC.logo}])
            }else{
              this.$set(this.appInfoData[item.appKey].BASIC, 'logo', [])
            }
            if(this.appInfoData[item.appKey].BASIC.bgImg) {
              this.$set(this.appInfoData[item.appKey].BASIC, 'bgImg', [{url: this.appInfoData[item.appKey].BASIC.bgImg}])
            }else{
              this.$set(this.appInfoData[item.appKey].BASIC, 'bgImg', [])
            }
          }
          if(!this.appInfoData[item.appKey].DING_H5) {
            this.$set(this.appInfoData[item.appKey], 'DING_H5', JSON.parse(JSON.stringify(this.DING_H5)))
          }
          if(!this.appInfoData[item.appKey].WX_ENTERPRISE) {
            this.$set(this.appInfoData[item.appKey], 'WX_ENTERPRISE', JSON.parse(JSON.stringify(this.WX_ENTERPRISE)))
          }
          if(!this.appInfoData[item.appKey].WECHAT_MP) {
            this.$set(this.appInfoData[item.appKey], 'WECHAT_MP', JSON.parse(JSON.stringify(this.WECHAT_MP)))
          }
          if(!this.appInfoData[item.appKey].LDAP) {
            this.$set(this.appInfoData[item.appKey], 'LDAP', JSON.parse(JSON.stringify(this.LDAP)))
          }
        }
      })
      this.showLoading = false
    },
    saveInfoHandle (ref, item, type, data) {
      let bool = true
      if(data[type].enable) {
        if(this.$refs[ref] && this.$refs[ref].length > 0) {
          this.$refs[ref][0].$refs.ruleForm.validate( (valid) => {
            bool = valid
          })
        }
      }
      if(bool) {
        // console.log(this.rowData.id, item.appKey, type, data[type])
        let subData = JSON.parse(JSON.stringify(data[type]))
        switch(type) {
          case 'BASIC':
            this.basicLoading = true;
            // 上传图片数据类型转换
            if(subData.icon && subData.icon.length > 0) {
              subData.icon = subData.icon[0].url
            }else{
              subData.icon = ''
            }
            if(subData.logo && subData.logo.length > 0) {
              subData.logo = subData.logo[0].url
            }else{
              subData.logo = ''
            }
            if(subData.bgImg && subData.bgImg.length > 0) {
              subData.bgImg = subData.bgImg[0].url
            }else{
              subData.bgImg = ''
            }
            break;
          case 'DING_H5': this.dingLoading = true;break;
          case 'WX_ENTERPRISE': this.wxLoading = true;break;
          case 'WECHAT_MP': this.wechatMpLoading = true;break;
          case 'LDAP': this.LDAPLoading = true;break;
          default: ;break;
        }
        saveAppSetByTenant(this.rowData.id, item.appKey, type, subData).then(res => {
          if(res && res.data && res.data.code == 0) {
            switch(type) {
              case 'BASIC': this.basicLoading = false;break;
              case 'DING_H5': this.dingLoading = false;break;
              case 'WX_ENTERPRISE': this.wxLoading = false;break;
              case 'WECHAT_MP': this.wechatMpLoading = false;break;
              case 'LDAP': this.LDAPLoading = false;break;
              default: ;break;
            }
          }
        }).catch(e => {
          switch(type) {
            case 'BASIC': this.basicLoading = false;break;
            case 'DING_H5': this.dingLoading = false;break;
            case 'WX_ENTERPRISE': this.wxLoading = false;break;
            case 'WECHAT_MP': this.wechatMpLoading = false;break;
            case 'LDAP': this.LDAPLoading = false;break;
            default: ;break;
          }
        })
      }
    },
    handleClick (tab) {
      // console.log(tab)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-info-setting{
  padding: 10px 30px;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 45px);
  .tip{
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    p{
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
      a{
        color: #409eff;
        text-decoration: none;
      }
    }
  }
  .app-info-set-title{
    span{
      color: #5e6d82;
    }
  }
  .item-box{
    .info-card{
      border: 1px solid #DCDFE6;
      padding: 20px 15px;
      border-radius: 5px;
      width: 50%;
      margin-top: 20px;
      .info-text{
        position: relative;
        top: 0;
        margin-top: 20px;
        background: #F4F4F6;
        i{
          color: #3871F0;
        }
        p{
          color: #9999;
          font-size: 16px;
          a{
            color: #409eff;
            text-decoration: none;
            font-size: 13px;
          }
        }
      }
      h4{
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div{
          display: flex;
          align-items: center;
          .title{
            display: inline-block;
            width: 4px;
            height: 18px;
            background: #3471ff;
            border-radius: 2px;
            margin-right: 10px;
          }
        }
        .right{
          .save-card-icon{
            font-size: 20px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
      .content-box{
        margin-top: 15px;
      }
    }
    .info-card:nth-of-type(1) {
      margin-top: 0;
    }
  }
}
.app-info-setting-loading{
  background-color: rgba(255, 255, 255, 0.8);
  background-image: url('../../../../../public/jvs-ui-public/img/loading.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-position: center;
  background-size: 200px 160px;
}
</style>
