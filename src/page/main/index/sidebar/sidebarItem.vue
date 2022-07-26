<template>
  <div class="menu-wrapper">
    <div class="needmove" v-if="needmove">
      <draggable :list="menu" :options="{group:'movemenu', disabled: disabled}"
        @start="startMove"
        @end="endMove"
      >
        <template v-for="(item, index) in menu">
          <el-menu-item
            v-if="vaildRoles(item.extend)"
            :index="item.extend[pathKey]"
            @click="open(item.extend)"
            :key="item.extend[labelKey]+index"
            :class="{'menu-item-li':true,'is-active':vaildAvtive(item.extend)}"
          >
            <i :class="item.extend[iconKey]"></i>
            <span slot="title" :alt="item.extend[pathKey]">{{item.extend[labelKey]}}</span>
            <i class="el-icon-rank dragicon" v-show="!collapse"></i>
          </el-menu-item>
        </template>
      </draggable>
    </div>
    <div class="notmove" v-if="!needmove">
      <el-submenu v-for="(item, index) in menu" :key="'menuNav'+index" :index="index+''" :class="{'collapseNav': collapse}">
        <template slot="title" v-if="vaildRoles(item.extend)">
          <svg v-if="isSvg(item.extend[iconKey])" class="icon" aria-hidden="true" style="margin-right: 20px;width: 20px;height: 20px;">
            <use :xlink:href="'#'+item.extend[iconKey]"></use>
          </svg>
          <i v-else :class="item.extend[iconKey]"></i>
          <span slot="title" :alt="item.extend[pathKey]" v-show="!collapse">{{item.extend[labelKey]}}</span>
        </template>
        <template v-if="vaildRoles(item.extend)">
          <el-menu-item
            v-for="(it, itindex) in item.children"
            :key="'navmenu'+itindex"
            :index="it.extend[pathKey]"
            @click="open(it.extend)"
            :class="{'menu-item-li':true,'is-active-item':vaildAvtive(it.extend)}"
          >
            <div>
              <svg v-if="isSvg(it.extend[iconKey])" class="icon" aria-hidden="true" style="margin-right: 20px;width: 20px;height: 20px;">
                <use :xlink:href="'#'+it.extend[iconKey]"></use>
              </svg>
              <i v-else :class="it.extend[iconKey]"></i>
              <span slot="title" :alt="it.extend[pathKey]">{{it.extend[labelKey]}}</span>
            </div>
          </el-menu-item>
        </template>
      </el-submenu>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
import {sortMenuList} from '@/api/admin/menu'
export default {
  name: "sidebarItem",
  data () {
    return {
      config: config,
      falgs: 'movemenu',
      disabled: false,
      sortList: []
    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    },
    needmove: {
      type: Boolean,
      default: false
    }
  },
  created () {},
  mounted () {
    // 防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  computed: {
    ...mapGetters(["roles"]),
    labelKey () {
      return this.props.label||this.config.propsDefault.label;
    },
    pathKey () {
      return this.props.path||this.config.propsDefault.path;
    },
    iconKey () {
      return this.props.icon||this.config.propsDefault.icon;
    },
    nowTagValue () {
      return this.$router.$jvsRouter.formatMenuPath(this.$route);
    }
  },
  methods: {
    vaildAvtive (item) {
      const groupFlag=(item["group"]||[]).some(ele =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue===item[this.pathKey]||groupFlag;
    },
    isSvg(item) {
      if (item) {
        return item.indexOf("icon-") === -1
      }
    },
    vaildRoles (item) {
      item.meta=item.meta||{};
      return item.meta.roles? item.meta.roles.includes(this.roles):true;
    },
    validatenull (val) {
      return validatenull(val);
    },
    open (item) {
      if (item.design) {
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item.name,
            src: url
          }),
        })
        return
      }
      // 重复点击不跳转
      let tempStr = ""
      if(item.url.indexOf('#') > -1){
        tempStr = (item.url && ('#' + item.url.split('#')[1])) || ''
      }else{
        let indx = item.url.indexOf('-ui')
        if(indx > -1) {
          tempStr = item.url.slice(0, indx+3) + '/#' + item.url.slice(indx+3, item.url.length)
        }
      }
      if(this.$route.hash && this.$route.query && this.$route.query.src  && tempStr == (this.$route.query.src  + this.$route.hash)) {
        return false
      }
      if (this.screen<=1) this.$store.commit("SET_COLLAPSE");
      this.$router.$jvsRouter.group=item.group;
      if(item.newWindow === true) {
        if(item.url.includes('http') || item.url.includes('https') || item.url.includes('ftp')) {
          this.$openUrl(item[this.pathKey], '_blank')
        }else{
          if(item.url.indexOf('-ui') == -1) {
            this.$openUrl(item[this.pathKey], '_blank')
          }else{
            let tinx = item.url.indexOf('-ui')
            let tpStr = item.url.slice(0, (tinx+3)) + '/#' + item.url.slice(tinx+3, item.url.length)
            this.$openUrl(tpStr, '_blank')
          }
        }
      }else{
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey]
          }),
          query: item.query,
          params: item.params
        })
      }
    },
    startMove (event) {
      this.falgs = ''
      this.sortList = JSON.parse(JSON.stringify(this.menu))
    },
    endMove (ev) {
      this.falgs = 'movemenu'
      let temp = []
      for(let i in this.menu) {
        this.menu[i].sort =  i
        temp.push({
          menuId: this.menu[i].id,
          sort: i
        })
      }
      // 权限---修改菜单顺序
      if(this.$permissionMatch("upms_mgr_xiu_gai_cai_dan_shun_xu")) {
        sortMenuList(temp).then(res => {
          if(res.data.code == 0) {
            console.log('成功')
          }
        }).catch(e => {
          this.menu = JSON.parse(JSON.stringify(this.sortList))
        })
      }
    },
  }
};
</script>
<style lang="scss">
.el-popper{
  padding: 8px 0!important;
  .more-box{
    .more-item{
      padding: 6px 12px;
      cursor: pointer;
      &:hover{
        background-color: #eff2f7;
      }
    }
  }
}
.menu-item-li{
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .dragicon{
    cursor: move;
    position: absolute;
    right: 0;
    display: none;
  }
}
.menu-item-li:hover .dragicon{
  display: block;
}
.menu-item-li::before{
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  height: 50px;
  // background: $mainBg;
  position: absolute;
}
.notmove{
  // border-top: 1px solid rgba(0, 21, 41, 0.15);
  .collapseNav{
    .el-submenu__icon-arrow{
      display: none;
    }
  }
}
</style>

