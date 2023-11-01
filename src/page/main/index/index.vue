<template>
  <div
    class="jvs-contail"
    :class="{'jvs--collapse': isCollapse}"
  >
    <!-- 顶部导航栏 -->
    <tags
      ref="tags"
      :freshAllMenuBool="freshAllMenuBool"
      @changeTheme="changeTheme"
      @changeSystem="changeSystem"
      @openAppManage="openAppManage"
      @openAppSetting="openAppSetting"
      @openSystemSetting="openSystemSetting"
      @openCatalogue="openCatalogue"
    />
    <div :class="{'jvs-layout': true, 'jvs-layout-tempOpen': systemSettingOpen}">
      <!-- 顶部标签卡 -->
      <div
        class="jvs-left"
        :style="'width:'+ $store.getters.theme.logo.width"
      >
        <!-- 左侧导航栏 -->
        <sidebar :appSettingOpen="appSettingOpen" :menuType="menuType" :isCollapse="isCollapse" :systemId="systemId" :thisSystem="thisSystem" :freshSide="freshSide" @openAppManage="openAppManage" @openCatalogue="openCatalogue" @freshAllMenu="freshAllMenu" @closeOther="closeOther" />
      </div>
      <div
        class="jvs-main"
        :style="'top: '+$store.getters.theme.logo.height+';height:calc(100% - '+$store.getters.theme.logo.height+'); width:calc(100% - '+$store.getters.theme.logo.width+');left:'+$store.getters.theme.logo.width+';'"
      >
        <div :class="{'jvs-main-loading': !alreadyLoad}"></div>
        <!-- 主体视图层 -->
        <el-scrollbar style="height:100%" v-if="alreadyLoad && !catalogueItem && !showApplication">
          <keep-alive>
            <router-view
              class="jvs-view"
              v-if="$route.meta.$keepAlive"
            />
          </keep-alive>
          <router-view
            class="jvs-view"
            v-if="!$route.meta.$keepAlive"
          />
        </el-scrollbar>
      </div>

      <!-- 系统设置 -->
      <div v-if="systemSettingOpen" class="template-content-box" :style="'top: '+$store.getters.theme.logo.height+';height:calc(100% - '+$store.getters.theme.logo.height+');'">
        <system-setting />
      </div>
    </div>
    <div
      class="jvs-shade"
      @click="showCollapse"
    ></div>
    <el-dialog
      :title="bulletin.title + '公告'"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose">
      <div style="max-height: 800px;overflow-y: auto">
        <section v-html="bulletin.content"></section>
      </div>
    </el-dialog>
    <div class="dialog-box" v-if="imgVisible" @click="imgVisible = false">
      <img :src="bulletin.content" alt=""/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
import admin from '@/util/admin';
import { validatenull } from '@/util/validate';
import { getStore } from '@/util/store.js';
import {getSystemHelpDict, getTenantInfo, getBulletinList} from '@/api/admin/home'
import applicationSetting from '@/page/main/application/applicationSetting'
import { getDomain } from "@/api/login"
import SystemSetting from '@/views/upms/views/systemSetting/systemSetting'
// import appInfoSetting from '@/views/upms/views/appBascSetting/appinfo.vue'

export default {
  components: {
    SystemSetting,
    applicationSetting,
    top,
    tags,
    sidebar,
    // appInfoSetting
  },
  name: 'index',
  data () {
    return {
      dialogVisible: false,
      imgVisible: false,
      bulletin: {},
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: '',
      systemId: '-1',
      alreadyLoad: false,
      thisSystem: null,
      // appSettingOpen: false,
      // menuType: 'platform',
      systemSettingOpen: false,
      catalogueItem: null,
      freshAllMenuBool: -1, // 是否需要重新拉取所有菜单
      freshSide: -1, // 刷新左侧菜单栏
      showApplication: false
    }
  },
  created () {
    // this.appSettingOpen = this.$store.getters.appSettingOpen
    if (this.$route.query.login === 'isLogin') {
      this.getBulletinList()
    }
    //实时检测刷新token
    // this.refreshToken()
    getTenantInfo().then(res => {
      if(res.data.code == 0) {
        this.$store.commit("SET_TENANTINFO", res.data.data)
        this.$emit('changeTheme', true)
        this.getDomainHandle(res.data.data)
      }
      this.alreadyLoad = true
    }).catch(e => {
      this.alreadyLoad = true
    })
    getSystemHelpDict('jvs-ui-help-url').then(res => {
      if (res.data && res.data.code == 0) {
        this.$store.commit("SET_SYSTEM_HELP_DICT", res.data.data)
      }
    })
  },
  destroyed () {
    clearInterval(this.refreshTime)
  },
  mounted () {
    this.init()
  },
  computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website', 'expires_in', 'appSettingOpen', 'menuType']),
  props: [],
  methods: {
    getBulletinList() {
      getBulletinList().then(res => {
        this.bulletin = res.data.data || {}
        if (this.bulletin.content && this.bulletin.content.length > 0) {
          this.bulletin.content = this.bulletin.content.replace('<img ', `<img style="max-width: 710px;"`)
          if (this.bulletin.contentType === 'TEXT') {
            this.dialogVisible = true
          } else {
            this.imgVisible = true
          }
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    showCollapse () {
      this.$store.commit("SET_COLLAPSE")
    },
    // 屏幕检测
    init () {
      this.$store.commit('SET_SCREEN', admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen())
        }, 0);
      }
    },
    // 实时检测刷新token
    refreshToken () {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: 'access_token',
          debug: true,
        });

        if (validatenull(token)) {
          return;
        }

        if (this.expires_in <= 1000 && !this.refreshLock) {
          this.refreshLock = true
          this.$store
            .dispatch('RefreshToken')
            .catch(() => {
              clearInterval(this.refreshTime)
            });
          this.refreshLock = false
        }
        this.$store.commit("SET_EXPIRES_IN", this.expires_in - 10);
      }, 10000);
    },
    // 通知改变主题
    changeTheme (bool) {
      this.$emit('changeTheme', bool)
    },
    // 切换系统
    changeSystem (id) {
      this.systemId = id
      this.catalogueItem = null
      this.freshSide = Math.random()
    },
    // 打开应用管理
    openAppManage (id) {
      // this.showApplication = true
      this.showApplication = (this.$store.getters.userInfo.roleType && this.$store.getters.userInfo.roleType.indexOf('应用管理员') > -1)
      if(id != -1) {
        this.$refs.applicationManage.init(id)
      }
    },
    // 打开系统  应用
    openSystem (id) {
      if (id) {
        this.$refs.tags.entrySystem({id: id})
      }
      this.openAppManage(id)
      this.changeSystem(id)
    },
    // 打开应用设置
    openAppSetting (bool, type) {
      // this.appSettingOpen = bool
      this.$store.commit("SET_APP_SETTING_OPEN", bool)
      this.$store.commit("SET_MENU_TYPE", type)
      this.$forceUpdate()
      // this.menuType = type
    },
    // 打开系统设置
    openSystemSetting(bool) {
      this.systemSettingOpen = bool
      if(bool) {
        this.showApplication = false
        // this.appSettingOpen = false
        this.$store.commit("SET_APP_SETTING_OPEN", false)
      }
    },
    // 打开应用的目录
    openCatalogue (item) {
      this.catalogueItem = item
      this.showApplication = false
    },
    // 刷新所有菜单
    freshAllMenu (bool) {
      if(bool) {
        this.freshAllMenuBool = Math.random()
      }
    },
    // 点击了logo关闭应用相关
    closeOther (bool) {
      if(bool) {
        this.catalogueItem = null
        this.showApplication = false
        // this.appSettingOpen = false
        this.$store.commit("SET_APP_SETTING_OPEN", false)
        this.systemSettingOpen = false
      }
    },
    // 获取域名对应设置信息
    getDomainHandle (data) {
      getDomain().then(res => {
        if(res.data && res.data.code == 0) {
          this.thisSystem = data
          if(res.data.data){
            if(res.data.data.logo) {
              this.$set(this.thisSystem, 'logo', res.data.data.logo)
            }
            if(res.data.data.icon) {
              var link = document.createElement('link')
              link.type = 'image/x-icon'
              link.rel = 'shortcut icon'
              link.href = res.data.data.icon
              document.getElementsByTagName('head')[0].appendChild(link);
              this.$set(this.thisSystem, 'icon', res.data.data.icon)
            }
            if(res.data.data.bgImg) {
              this.$set(this.thisSystem, 'bgImg', res.data.data.bgImg)
            }
            this.$store.commit("SET_TENANTINFO", this.thisSystem)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.jvs-main-loading{
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 300px 240px;
}
/deep/ .jvs-layout-tempOpen{
  .el-menu-scrollbar{
    display: none;
  }
  .jvs-main{
    display: none;
  }
  .template-content-box{
    position: absolute;
    width: 100%;
    z-index: 1025;
    // .system-setting-page{
    //   height: auto;
    // }
    // .app-setby-tenant{
    //   background-color: #f6f6f6;
    //   padding: 0 15px;
    //   padding-bottom: 15px;
    //   .box{
    //     padding: 20px 30px;
    //     margin: 0 30vh;
    //     border-radius: 8px;
    //     background-color: #ffffff;
    //     h4{
    //       display: flex;
    //       align-items: center;
    //       font-size: 16px;
    //       margin: 0;
    //       position: relative;
    //       text-indent: 15px;
    //       .title-bar{
    //         display: block;
    //         width: 4px;
    //         height: 18px;
    //         background: #3471ff;
    //         border-radius: 2px;
    //       }
    //     }
    //     .app-info-setting{
    //       height: auto;
    //     }
    //   }
    // }
  }
}
.dialog-box/deep/{
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9999;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  img{
    max-width: 800px;
    min-width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 10000;
  }
}
</style>
