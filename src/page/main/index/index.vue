<template>
  <div
    class="jvs-contail"
    :class="{'jvs--collapse': isCollapse}"
  >
    <!-- 顶部导航栏 -->
    <!-- <div class="jvs-header">
      <top/>
    </div>-->
    <tags @changeTheme="changeTheme" @changeSystem="changeSystem" />
    <div class="jvs-layout">
      <!-- 顶部标签卡 -->

      <div
        class="jvs-left"
        :style="'width:'+ $store.getters.theme.logo.width"
      >
        <!-- 左侧导航栏 -->
        <sidebar :isCollapse="isCollapse" :systemId="systemId" :thisSystem="thisSystem" />
      </div>
      <div
        class="jvs-main"
        :style="'top: '+$store.getters.theme.logo.height+';height:calc(100% - '+$store.getters.theme.logo.height+'); width:calc(100% - '+$store.getters.theme.logo.width+');left:'+$store.getters.theme.logo.width+';'"
      >
        <div :class="{'jvs-main-loading': !alreadyLoad}"></div>
        <!-- 主体视图层 -->
        <el-scrollbar style="height:100%" v-if="alreadyLoad">
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
    </div>
    <div
      class="jvs-shade"
      @click="showCollapse"
    ></div>
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
import {getTenantInfo} from '@/api/admin/home'

export default {
  components: {
    top,
    tags,
    sidebar
  },
  name: 'index',
  data () {
    return {
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: '',
      systemId: '-1',
      alreadyLoad: false,
      thisSystem: null
    }
  },
  created () {
    //实时检测刷新token
    // this.refreshToken()
    getTenantInfo().then(res => {
      if(res.data.code == 0) {
        this.$store.commit("SET_TENANTINFO", res.data.data)
        this.thisSystem = res.data.data
        // if(res.data.data.themeStyle) {
        //   let temp = JSON.parse(res.data.data.themeStyle)
        //   if(temp.themeStyle) {
        //     let obj = JSON.parse(temp.themeStyle)
        //     let name = obj.name
        //     let params = obj.params
        //     this.$store.commit("SET_THEME_NAME", name)
        //     this.$store.commit("SET_THEME", params)
        //   }
        // }
        if(res.data.data.icon) {
          var link = document.createElement('link')
          link.type = 'image/x-icon'
          link.rel = 'shortcut icon'
          link.href = res.data.data.icon
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        this.$emit('changeTheme', true)
      }
      this.alreadyLoad = true
    }).catch(e => {
      this.alreadyLoad = true
    })
  },
  destroyed () {
    clearInterval(this.refreshTime)
  },
  mounted () {
    this.init()
  },
  computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website', 'expires_in']),
  props: [],
  methods: {
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
</style>
