<template>
  <div class="app-setting-page">
    <div class="left-menu">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="handleSelect">
        <el-menu-item v-for="(item, key) in menuList" :key="key" :index="item.currentIndex">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-page">
      <regexp v-if="currentIndex === '4'"/>
      <tempCenter v-if="currentIndex === '6'"/>
      <app-role v-if="currentIndex === '11'"/>
    </div>
  </div>
</template>

<script>
import Regexp from "@/components/application/regExp";
import TempCenter from "@/components/application/tempCenter";
import AppRole from "@/components/application/appRole";
export default {
  name: "applicationSetting",
  components: {AppRole, TempCenter, Regexp},
  data () {
    return {
      currentIndex: '1',
      menuList: [
        // { icon: '', name: '正则配置', currentIndex: '4' },
        // { icon: '', name: '平台对接', currentIndex: '5' },
        { icon: '', name: '模板中心配置', currentIndex: '6' },
        // { icon: '', name: '短信配置', currentIndex: '8' },
        // { icon: '', name: '邮件配置', currentIndex: '9' },
        // { icon: '', name: 'ldap配置', currentIndex: '10' },
        { icon: '', name: '应用角色管理', currentIndex: '11' },
      ]
    }
  },
  created() {
  },
  methods: {
    handleSelect(key, keyPath) {
      this.currentIndex = key
    }
  }
}
</script>

<style lang="scss" scoped>
.app-setting-page{
  display: flex;
  //width: 100%;
  //height: 100%;
  //background: #f0f2f5;
  .left-menu{
    width: 240px;
    background-color: #ffffff;
    .el-menu-item:focus, .el-menu-item:hover{
      background-color: #EFF2F7;
    }
    .el-menu-item.is-active{
      color: #3471ff;
    }
    .el-menu-item, .el-submenu__title{
      height: 45px;
      line-height: 45px;
    }
  }
  .right-page{
    background-color: #f6f6f6;
    width: calc(100% - 240px);
    height: calc(100vh - 60px);
    //overflow: hidden;
    overflow-y: auto;
  }
}
</style>
