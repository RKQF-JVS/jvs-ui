<template>
  <div :class="{'icon-manage-list': true, 'icon-manage-list-loading': loading}">
    <el-collapse v-model="activeNames" v-if="!loading">
      <el-collapse-item v-for="(item, index) in data" :key="'icon-manamge'+item.label+index" :title="item.label" :name="item.label">
        <div class="icon-item">
          <svg v-for="(it, ix) in item.list" :key="it+'_'+ix" class="icon" aria-hidden="true" @click="copyHandle(it)">
            <use :xlink:href="'#'+it"></use>
          </svg>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'iconManageList',
  computed: {
    data () {
      return this.$store.state.iconLib.lib
    }
  },
  data() {
    return {
      activeNames: [],
      loading: true
    }
  },
  methods: {
    getList () {
      this.activeNames = this.$store.state.iconLib.allType
      let _this = this
      setTimeout(() => {
        _this.loading = false
      }, 2000);
    },
    copyHandle (con) {
      const text = document.createElement('input')
      text.value = con
      document.body.appendChild(text)
      text.select()
      document.execCommand('Copy')
      document.body.removeChild(text)
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss">
.icon-manage-list{
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  .icon {
    width: 32px;
    height: 32px;
    margin: 10px;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
  .el-collapse-item__header {
    display: flex!important;
    font-size: 18px;
    padding: 0 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-collapse-item__content{
    padding-bottom: 5px;
  }
  .icon-item{
    display: flex;
    flex-wrap: wrap;
  }
}
.icon-manage-list-loading{
  background-image: url(../../../../public/jvs-ui-public/img/loading.gif);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 300px 240px;
}
</style>