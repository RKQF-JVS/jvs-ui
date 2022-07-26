<template>
  <div class="iframe-info">
    <div class="item-title-bar" v-if="item.displayTitle">
      <h4>{{item.title}}</h4>
    </div>
    <div class="iframe-info-content">
      <iframe
        :src="formatUrl(item)" class="iframe" ref="iframe"
        style="width:100%;height: 100%;border: 0;"
        :data="item.data"
        :border="0"
      >
      </iframe>
    </div>
  </div>
</template>
<script>
export default {
  name: 'iframe-info',
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data(){
    return {
      option: {
        column: [
          {
            label: '消息类型',
            prop: 'title',
            hide: true,
          },
          {
            label: '消息标题',
            prop: 'content',
            span: 24,
            align: 'left',
            slot: true
          },
          {
            label: "发送时间",
            prop: "date",
            align: 'right',
            span: 24,
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss"
          },
        ]
      }
    }
  },
  created () {},
  methods: {
    formatUrl (item) {
      let str = item.page || ""
      if(str.includes("http") || str.includes("https") || str.includes("ftp")) {
        // console.log(str)
      }else{
        str = item.page
        let index = str.indexOf("-ui")
        if(index > -1) {
          str = item.page.slice(0, index+3) + '/#' + item.page.slice(index+3)
        }
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
.item-title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-left: 3px solid #409EFF;
  p, h4{
    margin: 0;
    padding: 0;
  }
  p{
    cursor: pointer;
  }
}
.iframe-info{
  height: 100%;
  iframe{
    height: 100%;
  }
  .iframe-info-content{
    height: calc(100% - 22px);
    position: relative;
  }
}
</style>
