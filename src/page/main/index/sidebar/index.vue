<template>
  <div class="jvs-sidebar" :style="'margin-top:'+$store.getters.theme.logo.height+';'">
    <span v-if="false" class="showhide-menu-icon" :style="'height:'+ $store.getters.theme.logo.height +';top:calc( -'+$store.getters.theme.logo.height+');display:flex;align-items:center;'">
      <svg @click="setCollapse" v-if="showHide" xmlns="http://www.w3.org/2000/svg" class="svg-icon" viewBox="64 64 896 896" width="15" height="15" :style="'fill: '+ $store.getters.theme.topNav.fontColor +';'"><path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path></svg>
      <svg @click="setCollapse" v-if="!showHide" xmlns="http://www.w3.org/2000/svg" class="svg-icon" viewBox="64 64 896 896" width="15" height="15" :style="'fill:'+ $store.getters.theme.topNav.fontColor +';'"><path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 0 0 188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 0 0 492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path></svg>
    </span>
    <logo
      :isCollapse="isCollapse"
      :systemId="systemId"
      :thisSystem="thisSystem"
      @childMenu="childMenu"
      @freshList="freshList"
    ></logo>
    <el-scrollbar class="el-menu-scrollbar" :style="'height:calc( 100% - '+$store.getters.theme.logo.height+' );'">
      <div
        v-if="validatenull(menu) && validatenull(menuChildren)"
        class="jvs-sidebar--tip"
      >没有发现菜单</div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
          :needmove="true"
        ></sidebar-item>
      </el-menu>
      <div class="divider-line"></div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
        ref="menuRef"
      >
        <sidebar-item
          :menu="menuChildren"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
          :systemId="systemId"
        ></sidebar-item>
      </el-menu>

    </el-scrollbar>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";

export default {
  name: "sidebar",
  components: { sidebarItem, logo, top },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    systemId: {
      type: String
    },
    thisSystem: {
      type: Object
    }
  },
  data () {
    return {
      tempMenu: [], // 收藏的菜单
      menuChildren: [], // 点击模块的菜单子集
      showHide: true
    };
  },
  created () {
    //获取菜单信息
    // this.$store.dispatch("GetMenu").then(data => {
    //   if (data.length === 0) return;
    //   this.$router.$jvsRouter.formatRoutes(data, true);
    // });
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$jvsRouter.formatMenuPath(this.$route);
    },
    ...mapState({
      showCollapse: state => state.common.showCollapse,
    }),
  },
  mounted () {
    // console.log(this.website)
  },
  methods: {
    validatenull (val) {
      if (typeof val === 'boolean') {
        return false
      }
      if (typeof val === 'number') {
        return false
      }
      if (val instanceof Array) {
        if (val.length == 0) return true
      } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true
      } else {
        if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
        return false
      }
      return false
    },
    // 展开 收起
    setCollapse () {
      this.showHide = !this.showHide
      this.$store.commit("SET_COLLAPSE")
    },
    // 设置点击的子菜单
    childMenu (obj) {
      this.menuChildren = obj // obj.childList
    },
    // 刷新收藏列表
    freshList (bool) {
      if(bool) {
        this.$store.dispatch("GetMenu").then(data => {
          if (data.length === 0) return;
          this.$router.$jvsRouter.formatRoutes(data, true);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.divider-line{
  height: 1px;
  background: #303133;
  opacity: 0.2;
  display: none;
}
.showhide-menu-icon {
  color: #000;
  position: absolute;
  //width: 20px;
  //height: 40px;
  right: -29px;
  //text-align: center;
  //top: calc(50% - 20px);
  // top: -64px;
  cursor: pointer;
  //border: 1px solid rgba(0, 21, 41, 0.15);
  border-left: 0;
  //font-size: 20px;
  line-height: 40px;
  //z-index: 9;
  //background-color: #ccc;
  opacity: 0.7;
  display: block;
  //border-radius: 0 20px 20px 0;
  overflow: hidden;
}
.el-menu-scrollbar {
  // height: 100vh; //100%;
  position: relative;
  overflow: unset;

}
</style>
<style lang="scss">
.jvs-sidebar{
  .el-menu{
    .menu-wrapper{
      .menu-item-li{
        padding-right: 0;
        span{
          width: 100%;
          overflow: hidden;
          white-space: pre;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>

