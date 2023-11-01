<template>
  <div id="app">
    <div class="theme-box">
      <router-view @changeTheme="changeThemeHandle" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {simpleStyle, darkblueStyle, darkredStyle} from '@/const/newTheme' // '@/const/theme'
  import { getStore } from "@/util/store.js";
  import './assets/fonts/font.scss';
  // constants
  import * as globalTypes from '@/store/types/global'
  import bus from '@/util/vuebus'
  import {getTenantInfo} from '@/api/admin/home'
  import { getDomain } from "@/api/login"
  export default {
    name: 'app',
    data() {
      return {
        themeStyle: document.createElement("style")
      }
    },
    watch: {},
    created() {
      // 切换租户了设置主题
      if(window.self == window.top) {
        if(getStore({name: 'tenantId'})) {
          getTenantInfo().then(res => {
            if(res.data.code == 0) {
              this.$store.commit("SET_TENANTINFO", res.data.data)
              if(res.data.data.themeStyle) {
                let temp = JSON.parse(res.data.data.themeStyle)
                if(temp.themeStyle) {
                  let obj = JSON.parse(temp.themeStyle)
                  let name = obj.name
                  let params = obj.params
                  this.$store.commit("SET_THEME_NAME", name)
                  this.$store.commit("SET_THEME", params)
                }
              }
              this.getDomainHandle()
              // 默认设置深蓝主题
              if(!getStore({name: 'themeName'})) {
                this.$store.commit("SET_THEME_NAME", darkblueStyle.theme)
                this.$store.commit("SET_THEME", darkblueStyle.params)
              }
              this.changeTheme()
            }
          }).catch(e => {
            // 默认设置深蓝主题
            if(!getStore({name: 'themeName'})) {
              this.$store.commit("SET_THEME_NAME", darkblueStyle.theme)
              this.$store.commit("SET_THEME", darkblueStyle.params)
            }
            this.changeTheme()
          })
        }else{
          // 默认设置深蓝主题
          if(!getStore({name: 'themeName'})) {
            this.$store.commit("SET_THEME_NAME", darkblueStyle.theme)
            this.$store.commit("SET_THEME", darkblueStyle.params)
          }
          this.changeTheme()
        }
      }
      this.$consoleImage()
      window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    methods: {
      ...mapMutations({
        onChangeTheme: globalTypes.UPDATE_THEME,
      }),
      // 全局 logo样式
      setLogoStyle () {
        let logoStyle =
        `
          #app {
            font-size: ${this.$store.getters.theme.font.size};
            color: ${this.$store.getters.theme.font.color};
          }
          .jvs-left .jvs-logo:hover{
            color: ${this.$store.getters.theme.basic.activeFont};
            // background: ${this.$store.getters.theme.basic.activeColor}!important;
          }
          .cardtipsbox .ulList{
            background: ${this.$store.getters.theme.basic.themeColor};
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .cardtipsbox .ulList div h3{
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .cardtipsbox .ulList div ul, .cardtipsbox .ulList div ul li {
            background: ${this.$store.getters.theme.basic.themeColor};
          }
          .cardtipsbox .ulList div ul li div a, .cardtipsbox .ulList div ul li div i{
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .cardtipsbox .ulList div ul li:hover div{
            background: ${this.$store.getters.theme.basic.activeColor};

          }
          .cardtipsbox ul li div:hover a {
            color: #fff !important
          },
          .cardtipsbox .ulList div ul li div .collected{
            color: ${this.$store.getters.theme.basic.activeFont};
          }
          .el-menu-scrollbar .el-scrollbar__view .showhide-menu-icon{
            background-color: ${this.$store.getters.theme.basic.activeColor};
          }
        `
        return logoStyle
      },
      // 菜单样式
      setMenuStyle () {
        let menuStyle =
        // 正常状态
        `
          .divider-line{
            background: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu-scrollbar {
            background: ${this.$store.getters.theme.basic.themeColor};
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu-scrollbar .el-submenu__title i, .el-menu-scrollbar .el-submenu__title span{
            color: ${this.$store.getters.theme.basic.fontColor};
            font-size: 15px;
          }
          .el-menu-scrollbar .el-menu .el-menu-item span{
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu-scrollbar .el-menu .el-menu-item i {
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu-scrollbar .el-menu .el-menu-item::before {
            background: ${this.$store.getters.theme.basic.themeColor};
          }
          .el-menu-scrollbar .el-menu .el-menu-item:hover, .el-menu-scrollbar .el-menu .el-menu-item:focus{
            background: ${this.$store.getters.theme.basic.activeColor};
          }
          .el-menu-scrollbar .el-menu .el-menu-item:hover::before{
            background: ${this.$store.getters.theme.basic.activeBefore};
          }
          .el-menu-scrollbar .el-menu .el-menu-item:hover span, .el-menu-scrollbar .el-menu .el-menu-item:focus span {
            color: ${this.$store.getters.theme.basic.activeFont};
          }
          .el-menu-scrollbar .el-submenu__title:hover {
            background: ${this.$store.getters.theme.basic.activeColor};
          }
          .el-menu-scrollbar .el-submenu__title:hover span{
            color: ${this.$store.getters.theme.basic.activeFont};
          }
          .el-menu-scrollbar .el-menu .el-menu-item:hover i, .el-menu-scrollbar .el-menu .el-menu-item:focus i{
            color: ${this.$store.getters.theme.basic.activeBefore};
          }
          .el-menu-scrollbar .el-submenu__title:hover i:not(.el-submenu__icon-arrow){
            color: ${this.$store.getters.theme.basic.activeBefore};
          }
          .el-menu--vertical{
            background: ${this.$store.getters.theme.basic.themeColor};
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu--vertical .el-menu-item span, .el-menu--vertical .el-menu-item i{
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu--vertical .el-menu-item:hover i, el-menu--vertical .el-menu-item:hover span,
          .el-menu--vertical .el-menu-item:focus i, el-menu--vertical .el-menu-item:focus span {
            color: ${this.$store.getters.theme.basic.fontColor};
          }
          .el-menu--vertical .el-menu-item:hover::before {
            background: ${this.$store.getters.theme.basic.activeBefore || this.$store.getters.theme.basic.fontColor};
          }
          .el-menu--vertical .el-menu-item:hover, .el-menu--vertical .el-menu-item:focus {
            background: ${this.$store.getters.theme.basic.activeColor};
          }
        `
        +
        // 激活状态
        `
          .el-menu-scrollbar .el-menu .is-active-item, .jvs-sidebar .el-submenu .el-menu-item.is-active-item{
            background: ${this.$store.getters.theme.basic.activeColor};
          }
          .el-menu-scrollbar .el-menu .is-active-item::before {
            background: ${this.$store.getters.theme.basic.activeBefore || this.$store.getters.theme.basic.fontColor};
          }
          .el-menu-scrollbar .el-menu .is-active-item, .jvs-sidebar .el-submenu .el-menu-item.is-active-item span{
            color: ${this.$store.getters.theme.basic.activeFont};
          }
          .jvs-sidebar .el-submenu .el-menu-item.is-active-item i{
            color: ${this.$store.getters.theme.basic.activeBefore || this.$store.getters.theme.basic.fontColor};
          }

        `
        return menuStyle
      },
      // 其他样式
      setOtherStyle () {
        // 顶部系统栏
        // table
        // 表单
        // 个人中心
        // 顶部菜单栏
        // 面包屑
        let otherStyle =
        `
          .jvs-tags .jvs-tags__box .lineBox{
            background-color: ${this.$store.getters.theme.topNav.backgroundColor};
            color: ${this.$store.getters.theme.topNav.fontColor};
          }
          .jvs-tags .jvs-tags__box .lineBox .system-list li span, .jvs-tags .jvs-tags__box .lineBox .system-list li i{
            color: ${this.$store.getters.theme.topNav.fontColor};
          }
          .jvs-tags .jvs-tags__box .lineBox .system-list .activeSysItem{
            color: ${this.$store.getters.theme.topNav.activeColor};
            background-color: ${this.$store.getters.theme.topNav.activeBackgroundColor};
          }
          .jvs-tags .jvs-tags__box .lineBox .system-list .activeSysItem span{
            color: ${this.$store.getters.theme.topNav.activeColor};
          }
          .el-table {
            color: ${this.$store.getters.theme.table.color};
          }
          .el-form {
            color: ${this.$store.getters.theme.form.color};
          }
          .el-dropdown-menu .el-dropdown-menu__item:hover {
            background-color: ${this.$store.getters.theme.basic.activeColor};
            color: ${this.$store.getters.theme.basic.activeFont};
          }
          .app-container .el-card .basic-container .el-tabs .el-tabs__active-bar{
            background-color: ${this.$store.getters.theme.topMenu.activeColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-tabs__item:hover{
            color: ${this.$store.getters.theme.topMenu.activeColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-tabs__item.is-active{
            color: ${this.$store.getters.theme.topMenu.activeColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-button{
            border-color: ${this.$store.getters.theme.btn.borderColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-button:hover{
            background-color: ${this.$store.getters.theme.btn.hoverBackgroundColor};
            border-color: ${this.$store.getters.theme.btn.hoverBorderColor};
            color: ${this.$store.getters.theme.btn.hoverFontColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-button--primary{
            background-color: ${this.$store.getters.theme.btn.primaryBackgroundColor};
          }
          .app-container .el-card .basic-container .el-tabs .el-button--default{
            color: ${this.$store.getters.theme.btn.defaultFontColor};
          }
          .top-nav-bar-box .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
            color: ${this.$store.getters.theme.topMenu.fontColor || this.$store.getters.theme.topMenu.activeColor};
            border-bottom-color: ${this.$store.getters.theme.topMenu.activeColor};
          }
          .top-nav-bar-box .el-tabs--card>.el-tabs__header .el-tabs__item.is-active .el-icon-close{
            color: ${this.$store.getters.theme.topMenu.iconColor || this.$store.getters.theme.topMenu.activeColor};
          }
          .top-nav-bar-box .el-tabs--card>.el-tabs__header .el-tabs__item.is-active .el-icon-close:hover{
            color: #fff;
          }
        `
        return otherStyle
      },
      // 加入主题样式
      addTheme (themeStyle) {
        // 菜单
        themeStyle.appendChild(document.createTextNode(this.setMenuStyle()))
        // logo
        themeStyle.appendChild(document.createTextNode(this.setLogoStyle()))
        // 其他
        themeStyle.appendChild(document.createTextNode(this.setOtherStyle()))
      },
      // 加入主题兼容ie
      addThemeIE (themeStyle) {
        // 菜单
        themeStyle.styleSheet.cssText = this.setMenuStyle()
        // logo
        themeStyle.styleSheet.cssText = this.setLogoStyle()
        // 其他
        themeStyle.styleSheet.cssText = this.setOtherStyle()
      },
      // 切换主题
      changeTheme () {
        if(!this.$store.getters.theme.basic) {
          return false
        }
        let head = document.getElementsByTagName("head")[0]
        head.appendChild(this.themeStyle)
        if(this.themeStyle) {
          head.removeChild(this.themeStyle)
        }
        this.themeStyle = document.createElement("style")
        this.themeStyle.type = 'text/css'
        try{
          this.addTheme(this.themeStyle)
        }catch(ex){
          this.addThemeIE(this.themeStyle)
        }
        head.appendChild(this.themeStyle)
      },
      // 切换通知
      changeThemeHandle (bool) {
        // 默认设置深蓝主题
        if(!getStore({name: 'themeName'})) {
          this.$store.commit("SET_THEME_NAME", darkblueStyle.theme)
          this.$store.commit("SET_THEME", darkblueStyle.params)
        }else{
          this.$store.commit("SET_THEME_NAME", darkblueStyle.theme)
          this.$store.commit("SET_THEME", darkblueStyle.params)
        }
        if(bool) {
          this.changeTheme()
        }
      },
      fresh () {
        location.reload()
      },
      goBack () {
        history.pushState(null, null, document.URL)
      },
      // 获取域名对应设置信息
      getDomainHandle () {
        getDomain().then(res => {
          if(res.data && res.data.code == 0) {
            if(res.data.data){
              if(res.data.data.icon) {
                var link = document.createElement('link')
                link.type = 'image/x-icon'
                link.rel = 'shortcut icon'
                link.href = res.data.data.icon
                document.getElementsByTagName('head')[0].appendChild(link);
              }
            }
          }
        })
      },
      beforeunloadFn (e) {
        this.$store.commit("DEL_TAG_OTHER");
      }
    },
    computed: {
      ...mapGetters({
        theme: globalTypes.GET_THEME,
      }),
    },
    mounted () {
      bus.$on('refresh', (e) => {
        if(e) {
          this.fresh()
        }
      })
      if(window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.goBack, false)
      }
    },
    destroyed () {
      window.removeEventListener('popstate', this.goBack, false)
      window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    }
  }
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  ul, li {
    list-style: none;
  }
</style>
<style lang="scss" scoped>
  .theme-text{
    position: fixed;
    right: 0;
    top: 50%;
    z-index: 9999999999999;
  }
  .theme-box {
    font-family: MiSans-Demibold;
    width: 100%;
    height: 100%;
  }
</style>
