<template>
  <div
    class="jvs-logo"
    @mouseover="showCardTip(true)"
    :style="
      'width: '+ $store.getters.theme.logo.width+
      ';height:calc( '+ $store.getters.theme.logo.height+ ' - 0px )' +
      ';line-height:'+ $store.getters.theme.logo.height+
      ';color:'+ $store.getters.theme.logo.color+
      ';font-size:'+ $store.getters.theme.logo.fontSize+
      ';font-weight:'+ $store.getters.theme.logo.fontWeight+
      ';background-color:'+ $store.getters.theme.logo.backgroundColor+';'
    "
  >
    <div v-if="userInfo && userInfo.tenant && userInfo.tenant.logo" class="logo-image" :style="'display:block;background-image:url('+ userInfo.tenant.logo +')'" @click="indexgo"></div>
    <transition name="fade">
      <div v-if="false && keyCollapse && sysInfo.bgImg" :style="'background-image:url('+ sysInfo.bgImg +');cursor:pointer;width: 60px;height: 60px;background-size: 100% 100%;background-repeat: no-repeat;'" @click="indexgo"></div>
    </transition>
    <transition-group name="fade">
      <template v-if="(true || !keyCollapse) && !sysInfo.logo">
        <span
          @click="indexgo"
          class="jvs-logo_title"
          key="1"
        >{{this.sysInfo.shortName || title || ''}}</span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, Store } from "vuex";
import { GetMenuList, favorite, delfavorite, GetMenu } from '@/api/admin/menu'
export default {
  name: "logo",
  imgSrc: "",
  title: "",
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    favList: {
      type: Array,
      default: () => {
        return []
      }
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
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: true, //是否只有滚动的时候才显示滚动条
          background: "#000000",//滚动条颜色
          opacity: 0,//滚动条透明度
          "overflow-x": "hidden"
        }
      },
      imgSrc: this.imgSrc,
      title: this.title,
      cardTip: false,
      cardTipList: [],
      menu: [], // 收藏列表
      timer: null,
      sysInfo: {}
    };
  },
  created () {
  },
  computed: {
    ...mapGetters(["website", "keyCollapse", "menuAll", "system", "userInfo"]), //  "menu"
  },
  methods: {
    async getAllMenuList () {
      const arr = [...this.menuAll]
      let appitem = null
      const index = arr.findIndex(item => {
        if(this.system === item.id && item.extend && item.extend.type == 'jvsapp') {
          appitem = item
        }
        return this.system === item.id
      })
      this.cardTipList = (this.menuAll[index] && this.menuAll[index].children) ? this.menuAll[index].children : []
      for (let i in this.cardTipList) {
        if (this.cardTipList[i].childList && this.cardTipList[i].childList.length > 0) {
          for (let j in this.cardTipList[i].childList) {
            if (this.isCollect(this.cardTipList[i].childList[j])) {
              this.cardTipList[i].childList[j].collected = true
            } else {
              this.cardTipList[i].childList[j].collected = false
            }
          }
        }
      }
      if(this.cardTipList) {
        this.$emit('childMenu', this.cardTipList)
      }
      this.$emit('setAppItem', appitem)
      this.$forceUpdate()
    },
    // 跳转主页
    indexgo () {
      this.$router.push({
        path: "/"
      })
      this.$emit('closeOther', true)
    },
    // 显示悬浮卡片
    showCardTip (bool) {
      if(this.timer) {
        clearTimeout(this.timer)
      }
      if(bool) {
        let _this = this
        this.timer = setTimeout( () => {
          _this.cardTip = bool
        }, 500)
      }else{
        this.cardTip = bool
      }
    },
    // 收藏功能
    collectHandle (it) {
      it.collected = !it.collected
      if (it.collected == true) {
        favorite(it.id).then(res => {
          if (res.data.code == 0) {
            console.log(res)
            this.$emit('freshList', true)
          }
        })
      } else {
        delfavorite(it.id).then(res => {
          if (res.data.code == 0) {
            console.log(res)
            this.$emit('freshList', true)
          }
        })
      }
      this.$forceUpdate()
    },
    // 打开对应项
    openItem (item, parent) {
      this.$router.push({
        path: this.$router.$jvsRouter.getPath({
          name: item.name,
          src: item.url
        }),
        query: item.query
      })
      this.$emit('childMenu', this.cardTipList) //  parent)
      this.showCardTip(false)
    },
    // 是否被收藏
    isCollect (obj) {
      for (let i in this.menu) {
        if (obj.id == this.menu[i].id) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    systemId: {
      handler (newVal, oldVal) {
        this.getAllMenuList()
      }
    },
    thisSystem: {
      handler (newVal, oldVal) {
        if(newVal) {
          this.sysInfo = newVal
        }
      }
    },
    needFresh: {
      handler (newVal, oldVal) {
        if(newVal != -1) {
          this.getAllMenuList()
        }
      }
    }
  }
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.jvs-logo {
  position: fixed;
  top: 0;
  left: 0;
  // width: 220px;
  height: 64px;
  line-height: 64px;
  // background-color: #20222a;
  background-color: #fff;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  //box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  // color: rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid #f0f2f5;
  color: #1890ff;
  z-index: 1024;
  display: flex;
  justify-content: center;
  align-items: center;
  &_title {
    display: block;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
  .logo-image{
    display: block;
    // width: 50px;
    // height: 50px;
    width: 200px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    // margin-right: 5px;
  }
  .jvs-logo_title{
    line-height: 20px;
  }
}
.cardtipsbox {
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  box-shadow: 3px 0px 6px #888888;
  .cardtipsbox-top {
    background: #fff;
    // display: flex;
    span {
      display: block;
      text-align: center;
      background: #c5c5c5;
    }
  }
  .ulList {
    background: #fff;
    // width: 60%;
    box-shadow: 0 0 10px #ccc;
    min-height: 100%;
    // overflow-y: scroll;
    height: 100%;
    padding: 20px 40px 60px 40px;
    h3 {
      font-size: 17px;
      color: #333;
      line-height: 20px;
      margin: 0;
      margin: 15px 0px 15px 0px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
    }
  }
  ul,
  li {
    list-style: none;
    background: #fff;
    li {
      line-height: 18px;
      display: flex;
      align-items: center;
      width: 25%;
      margin: 0px 0 0px 0px;
      display: flex;
      align-items: center;
      div {
        padding: 8px;
        /*border-radius: 10px;*/
        width: 80%;
        display: flex;
        justify-content: space-between;
      }
      div:hover {
        background: #f5f5f5;
        a {
          color: #000;
          cursor: pointer;
        }
        i {
          display: block !important;
        }
      }
    }
    a {
      font-size: 12px;
      color: #666;
    }
    i {
      margin-left: 5px;
      color: #c5c5c5;
      cursor: pointer;
    }
    .collected {
      color: #1890ff;
    }
  }
}
.jvs--collapse{
  .jvs-logo{
    .logo-image{
      display: none;
    }
  }
}
</style>
