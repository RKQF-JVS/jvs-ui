<template>
  <div @load="loadHandle">
    <basic-container>
      <!-- 顶部菜单nav -->
      <menuNav />
      <div class="outer-container">
        <div v-for="(item, index) in tagListData" :key="item.value+item.hash" style="height:100%;" v-show="(item.value+item.hash) == ($route.query.src+$route.hash)">
          <iframe :id="'mainIframe'+index"  :src="item.value ? (item.value+item.hash) : urlPath" class="iframe" ref="iframe"></iframe>
          <!-- <iframe id="mainIframe" v-else :src="urlPath" class="iframe" ref="iframe"></iframe> -->
        </div>
        <!-- <iframe id="mainIframe" v-if="$route.query.src" :src="src" class="iframe" ref="iframe"></iframe> -->
        <!-- <iframe id="mainIframe" v-else :src="urlPath" class="iframe" ref="iframe"></iframe> -->
      </div>
    </basic-container>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStore } from "@/util/store.js";
import menuNav from '@/page/main/index/top/menuNav'
import {getBulletin} from "../../api/login";
import {client_id} from "../../const/const";
export default {
  name: "home",
  data() {
    return {
      urlPath: this.getUrlPath(), //iframe src 路径
      src: ""
    };
  },
  created() {
    getBulletin(client_id).then(res => {
      if (res.data && res.data.code == 0) {
      }
    })
    // 监听子页面传值
    let _this = this
    window.addEventListener('message',function(e){
      if(e.data) {
       if(e.data.command == 'loginOut') {
          sessionStorage.clear()
          localStorage.clear()
          _this.$openUrl('/#/login', '_self')
       }
        if(e.data.command == 'fresh') {
          location.reload()
        }
        if(e.data.command == 'openUrl' && e.data.url) {
          _this.$openUrl(e.data.url, '_self')
        }
      }
    },false);
  },
  mounted() {
    // this.load();
    // this.resize();
  },
  props: ["routerPath"],
  watch: {
    $route: function() {
      // this.load();
    },
    routerPath: function() {
      // 监听routerPath变化，改变src路径
      this.urlPath = this.getUrlPath();
    }
  },
  components: {
    ...mapGetters(["screen"]),
    menuNav
  },
  computed : {
    ...mapGetters(["tagList"]),
    tagListData() {
      return this.tagList
    }
  },
  methods: {
    created() {},
    // 加载浏览器窗口变化自适应
    resize() {
      window.onresize = () => {
        this.iframeInit();
      };
    },
    // 加载组件
    load() {
      var flag = true; //URL是否包含问号
      if (this.$route.query.src.indexOf("?") == -1) {
        flag = false;
      }
      var list = [];
      for (var key in this.$route.query) {
        if (key != "src" && key != "name") {
          list.push(`${key}= this.$route.query[key]`);
        }
      }
      list = list.join("&").toString();
      if (flag) {
        this.$route.query.src = `${this.$route.query.src}${
          list.length > 0 ? `&list` : ""
        }`;
      } else {
        this.$route.query.src = `${this.$route.query.src}${
          list.length > 0 ? `?list` : ""
        }`;
      }
      const jti = getStore({
        name: "jti",
      });
      if(this.$route.query.src.indexOf('?') != -1){
         this.src = this.$route.query.src+this.$route.hash;
      }else{
         this.src = this.$route.query.src+this.$route.hash;
      }
      if(this.src.includes('/mgr')) {
        let str = this.src
        str = str.replace(/mgr\/\#/g, 'mgr')
        this.src = str
      }
      //超时5s自动隐藏等待框，加强用户体验
      let time = 5;
      const timeFunc = setInterval(() => {
        time--;
        if (time == 0) {
          clearInterval(timeFunc);
        }
      }, 1000);
      this.iframeInit();
      $('#mainIframe').attr('src', this.src)
    },
    //iframe窗口初始化
    iframeInit() {
      const iframe = this.$refs.iframe;
      const clientHeight =
        document.documentElement.clientHeight - (screen > 1 ? 200 : 130);
      // iframe.style.height = `${clientHeight}px`
      // iframe.style.height = `100%`;
      if (iframe && iframe.attachEvent) {
        iframe.attachEvent("onload", () => {
        });
      } else {
        iframe.onload = () => {
        };
      }
      this.$forceUpdate()
    },
    getUrlPath: function() {
      //获取 iframe src 路径
      const token = getStore({
        name: "access_token",
        debug: true
      });
      //请求携带token
      let url = window.location.href;
      //  + "%3Ftoken%3D"+token.content;
      url = url.replace("/myiframe", "");
      return url;
    },
    loadHandle () {
      console.log(11111)
    }
  }
};
</script>

<style lang="scss">
.iframe {
  width: 100%;
  border-radius: 6px;
  // height: calc(100% - 16px);
  height: 100%;
  border: none;
  overflow-x: hidden;
  overflow-y: scroll;
}
.outer-container {
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
  background: #F6F6F6;
  box-sizing: border-box;
  //padding: 8px 10px;
  padding: 20px;
  overflow: hidden;
}
</style>
