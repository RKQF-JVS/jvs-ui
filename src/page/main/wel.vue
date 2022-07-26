<template>
  <basic-container class="wel-index">
    <!-- 顶部菜单nav -->
    <menuNav />
    <div class="top-outer-container">
      <div v-if="url" style="height: calc(100%);position:relative;">
        <iframe
          :src="url"
          class="iframe"
          :style="'height:calc(100%);border:0;'" width="100%">
        </iframe>
      </div>
      <div v-else style="width: 100%;height: 100%;">
        <welInfo />
      </div>
    </div>
  </basic-container>

</template>

<script>
  import {mapGetters} from 'vuex';
  import {getStore} from "@/util/store.js";
  import welInfo from './wel/index'
  import menuNav from '@/page/main/index/top/menuNav'
  import bus from '@/util/vuebus'

  export default {
    name: 'wel',
    components: {welInfo, menuNav},
    data() {
      return {
        activeNames: ['1', '2', '3', '4'],
        DATA: [],
        text: '',
        actor: '',
        count: 0,
        isText: false,
        url: ''
      }
    },
    created() {
      if(this.$store.state.common.tenantInfo && this.$store.state.common.tenantInfo.defaultIndexUrl) {
        // this.url = this.$store.state.common.tenantInfo.defaultIndexUrl
        this.url = ''
      }
      // 监听子页面传值
      let _this = this
      window.addEventListener('message',function(e){
        if(e.data) {
          if(e.data.command == 'isIndex') {
            if(_this.$route.path == '/wel/index') {
              sessionStorage.setItem('lastUrl', location.href)
            }
          }
        }
      },false);
    },

    computed: {
      ...mapGetters(['website'])
    },
    methods: {
      getData() {
        if (this.count < this.DATA.length - 1) {
          this.count++
        } else {
          this.count = 0
        }
        this.isText = true
        this.actor = this.DATA[this.count]
      },
      setData() {
        let num = 0
        let count = 0
        let active = false
        let timeoutstart = 5000
        let timeoutend = 1000
        let timespeed = 10
        setInterval(() => {
          if (this.isText) {
            if (count == this.actor.length) {
              active = true
            } else {
              active = false
            }
            if (active) {
              num--
              this.text = this.actor.substr(0, num)
              if (num == 0) {
                this.isText = false
                setTimeout(() => {
                  count = 0
                  this.getData()
                }, timeoutend)
              }
            } else {
              num++
              this.text = this.actor.substr(0, num)
              if (num == this.actor.length) {
                this.isText = false
                setTimeout(() => {
                  this.isText = true
                  count = this.actor.length
                }, timeoutstart)
              }
            }
          }
        }, timespeed)
      },
      //判断浏览器是否支持Web Notifications API
      suportNotify(obj){
        if (window.Notification) {
          // 支持
          console.log("支持"+"Web Notifications API");
          //如果支持Web Notifications API，再判断浏览器是否支持弹出实例
          this.showMess(obj)
        }else {
          // 不支持
          console.log("不支持 Web Notifications API");
          this.$notify({
            title: obj.title,
            message: obj.content,
            position: 'bottom-right',
            duration: 3000
          })
        }
      },
      showMess(obj){
        let _this = this
        let timer = null
        if(timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(function () {
          console.log(Notification.permission)
          //如果支持window.Notification 并且 许可不是拒绝状态
          if(window.Notification && Notification.permission !== "denied") {
              //Notification.requestPermission这是一个静态方法，作用就是让浏览器出现是否允许通知的提示
              Notification.requestPermission(function(status) {
                //如果状态是同意
                if (status === "granted") {
                  var m = new Notification(obj.title, {
                    body: obj.content,　　//消息体内容
                    icon: obj.icon　　//消息图片
                  });
                  m.onclick = function () {//点击当前消息提示框后，跳转到当前页面
                    window.focus();
                  }
              } else{
                // _this.$message.error('当前浏览器不支持弹出消息')
                _this.$notify({
                  title: obj.title,
                  message: obj.content,
                  position: 'bottom-right',
                  duration: 3000
                })
              }
            });
          }else{
            // _this.$message.warning('请允许此窗口进行通知')
            _this.$notify({
              title: obj.title,
              message: obj.content,
              position: 'bottom-right',
              duration: 3000
            })
            clearTimeout(timer)
          }
        },1000)
      }
    },
    mounted () {
      bus.$on('notice', (e) => {
        if(e) {
          this.suportNotify(
            {
              title: e.title,
              content: e.content,
              icon: '', // 消息图片
            }
          )
        }
      })
      if(this.$route.query && this.$route.query.fresh == 'true') {
        this.$openUrl('/#/wel/index', '_self')
        bus.$emit('refresh', true);
      }
    }
  }
</script>

<style scoped="scoped" lang="scss">
  .iframe {
    height: 100%;
    width: 100%;
    border: none;
    position: absolute;
//right: -20px;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .top-outer-container {
    position: relative;
    // overflow: hidden;
    width: 100%;
    // height: 850px;
    height: 100%;
  }
  .wel-index {
    .top-outer-container {
      height: calc(100% - 30px);
      overflow: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 8px 10px;
    }
    .top-outer-container::-webkit-scrollbar {
      display: none;
    }
  }
  .wel-contailer {
    position: relative;
  }

  .banner-text {
    position: relative;
    padding: 0 20px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    display: none;
  }

  .actor {
    height: 250px;
    overflow: hidden;
    font-size: 18px;
    color: #333;
  }

  .actor:after {
    content: '';
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: #333;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }

  .homediv {
    width: 100%;
    min-height: 900px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
