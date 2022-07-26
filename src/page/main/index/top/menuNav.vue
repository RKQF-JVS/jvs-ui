<template>
  <div class="top-nav-bar-box">
    <!-- 顶部tab关闭按钮 -->
    <div
      v-if="contextmenuFlag"
      class="jvs-tags__contentmenu"
      :style="{left:contentmenuX+'px',top:contentmenuY+'px'}"
    >
      <div class="item" @click="closeOthersTags">关闭其他</div>
      <div class="item" @click="closeAllTags">关闭全部</div>
    </div>
    <!-- :closable="tagLen!==1" -->
    <i v-if="showHide" class="showhide-menu-icon el-icon-s-unfold" @click="setCollapse"></i>
    <i v-else class="showhide-menu-icon el-icon-s-fold" @click="setCollapse"></i>
    <el-tabs
      v-model="active"
      type="card"
      :style="'flex:1;width:100%;'"
      @contextmenu.native="handleContextmenu"
      @tab-click="openTag"
      @edit="menuTag"
    >
      <el-tab-pane
        v-for="(item, index) in tagList"
        :key="(item.hash+index) || (item.name+index)"
        :label="item.label"
        :closable="item.label!=='首页' && index != 0"
        :name="item.hash ? (item.value + item.hash) : item.value"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { getStore } from "@/util/store.js";
export default {
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website"]),
    ...mapState({
      showTag: state => state.common.showTag
    }),
    tagLen () {
      return this.tagList.length||0;
    }
  },
  data(){
    return {
      active: "",
      contextmenuFlag: false,
      contentmenuX: "",
      contentmenuY: "",
      showHide: true
    }
  },
  created() {
  },
  methods: {
    watchContextmenu () {
      if (!this.$el.contains(event.target)||event.button!==0) {
        this.contextmenuFlag=false;
      }
      window.removeEventListener("mousedown", this.watchContextmenu);
    },
    handleContextmenu (event) {
      let target=event.target;
      let flag=false;
      if (target.className.indexOf("el-tabs__item")>-1) flag=true;
      else if (target.parentNode.className.indexOf("el-tabs__item")>-1) {
        target=target.parentNode;
        flag=true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX=event.clientX;
        this.contentmenuY=event.clientY;
        this.tagName=target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag=true;
      }else{
        this.contextmenuFlag=false;
      }
    },
    //激活当前选项
    setActive () {
      this.active=this.tag.hash ? (this.tag.value + this.tag.hash) : this.tag.value;
    },
    menuTag (value, action) {
      if (action==="remove") {
        let { tag, key }=this.findTag(value);
        this.$store.commit("DEL_TAG", tag);
        if(tag.hash) {
          if (tag.hash===this.tag.hash) {
            tag=this.tagList[key===0? key:key-1]; //如果关闭本标签让前推一个
            this.openTag(tag);
          }
        }else{
          if (tag.value===this.tag.value) {
            // console.log(this.tag.value)
            tag=this.tagList[key===0? key:key-1]; //如果关闭本标签让前推一个
            this.openTag(tag);
          }
        }
      }
    },
    openTag (item) {
      // 重复点击不处理
      if(item.name == this.tag.value + this.tag.hash){ //  this.tag.hash || item.name == this.tag.value) {
        return false
      }
      let tag;
      if (item.name) {
        tag=this.findTag(item.name).tag;
      } else {
        tag=item;
      }
      const jti = getStore({
        name: "jti",
      });
      if(tag.label == '首页') {
        tag = this.website.fistPage
      }
      this.$router.push({
        path: this.$router.$jvsRouter.getPath({
          name: tag.label,
          src: tag.value + tag.hash
        }),
        query: tag.query
      });
    },
    closeOthersTags () {
      this.contextmenuFlag=false;
      this.$store.commit("DEL_TAG_OTHER");
    },
    findTag (value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if(item.hash) {
          if ((item.value + item.hash) === value) {
            tag=item;
            key=index;
          }
        }else{
          if(item.value === value) {
            tag=item;
            key=index;
          }
        }
      });
      return { tag: tag, key: key };
    },
    closeAllTags () {
      this.contextmenuFlag=false;
      this.$store.commit("DEL_ALL_TAG");
      if(this.tag.value != '/wel/index') {
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            src: this.tagWel.value
          }),
          query: this.tagWel.query
        });
      }
    },
    // 展开 收起
    setCollapse () {
      this.showHide = !this.showHide
      this.$store.commit("SET_COLLAPSE")
    },
  },
  mounted () {
    this.setActive();
  },
  watch: {
    tag () {
      this.setActive();
    },
    contextmenuFlag () {
      window.addEventListener("mousedown", this.watchContextmenu);
    }
  },
}
</script>
<style lang="scss">
.jvs-main{
  .top-nav-bar-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 30px;
    font-size: 13px;
    background: #fff;
    overflow: hidden;
    .el-tabs.el-tabs--top {
      overflow: hidden;
      .el-tabs__header {
        height: 100%;
        // margin: 0;
        .el-tabs__nav-wrap {
          height: 100%;
          .el-tabs__nav-scroll {
            height: 100%;
            .el-tabs__nav {
              height: 100%;
              display: flex;
              border: 0;
              .el-tabs__item {
                line-height: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-left: 0;
                // &.is-active {
                //   color: #409EFF;
                //   border-bottom: 3px solid #409EFF;
                // }
              }
            }
          }
          .el-tabs__nav-prev, .el-tabs__nav-next{
            height: 100%;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
