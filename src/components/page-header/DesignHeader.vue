<template>
  <div class="design-header-box">
    <div class="header-left">
      <svg v-if="type === 'rule'" t="1648178009751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1387" width="25" height="25" style="margin-right: 10px;"><path d="M491.660728 374.985915a115.010473 115.010473 0 1 0 115.010473 115.010474 115.010473 115.010473 0 0 0-115.010473-115.010474z m0 0" fill="#1296db" p-id="1388"></path><path d="M1022.70587 291.039364V213.009751h-92.821957a142.006501 142.006501 0 0 0-113.16143-113.16143V0h-77.659805v97.629469h-184.904298V0h-79.508848v97.629469h-184.904297V0H211.715621v100.587938a142.006501 142.006501 0 0 0-110.942578 110.942578H0.554913v79.508848h97.629469v184.904298H0.554913v77.289996h97.629469v184.904298H0.554913v77.289996h100.21813a142.006501 142.006501 0 0 0 110.942578 110.942579v94.671h78.029614V931.91766h184.904297v92.08234h77.289997V931.91766h184.904297v92.08234H814.133823v-94.671a142.006501 142.006501 0 0 0 110.942578-110.942579h93.191766v-78.029613H932.472573v-184.904298h90.603106v-79.508848H932.472573v-184.904298z m-269.960274 403.830986a38.977826 38.977826 0 0 1-56.210907 53.992055l-97.999277-99.108703a193.040087 193.040087 0 1 1 54.361863-55.101481z m0 0" fill="#1296db" p-id="1389"></path></svg>
      <svg v-else-if="type === 'flow'" aria-hidden="true" style="margin-right: 10px;width: 25px;height: 25px;">
       <!-- <use xlink:href="#icontiaoboguanlisvg"></use> -->
        <use :xlink:href="'#' + 'icon-fenzhi'"></use>
      </svg>
      <svg v-else aria-hidden="true" style="margin-right: 10px;width: 25px;height: 25px;">
        <use :xlink:href="'#' + infoData.icon"></use>
      </svg>
      {{ appName }}
      <i class="el-icon-arrow-right icon-style"/>
      <el-input v-if="showEdit" v-model="infoData.name" @blur="showEdit = false " size="mini" style="width:200px;"></el-input>
      <span v-else style="color: #878787;">{{ infoData.name }} <i class="el-icon-edit" style="margin-left:5px;cursor:pointer;" @click="showEdit = true "></i></span>
      <!-- <el-tag style="margin-left: 12px;" size="mini" :type="infoData.isDeploy ? '' : 'info'">{{infoData.isDeploy ? '已发布' : '未发布'}}</el-tag> -->
    </div>
    <div class="header-center">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, key) in tabList" :key="item.name+key" :name="item.name">
          <span slot="label"><i :class="item.icon" style="margin-right: 6px;"/>{{ item.label }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="header-right">
      <slot name="right"></slot>
      <svg class="help-entry" aria-hidden="true" @click="handleHelp">
        <use xlink:href="#icon-help"></use>
      </svg>
      <slot name="rightButton"></slot>
      <jvs-button size="mini" type="primary" @click="handleSave">保存</jvs-button>
    </div>
  </div>
</template>

<script>
import {getAppInfoById} from "@/views/page/api/newDesign";
import {mapState} from "vuex";

export default {
  name: "DesignHeader",
  props: {
    infoData: {
      type: Object
    },
    tabList: {
      type: Array
    },
    type: {
      type: String
    },
    currentTab: {
      type: String
    }
  },
  computed: {},
  watch: {
    currentTab(val) {
      this.activeName = val
    }
  },
  data () {
    return {
      appName: '',
      activeName: '',
      showEdit: false
    }
  },
  created() {
    // this.activeName = this.currentTab
    this.getAppInfo()
    this.autoOpenVideo()
  },
  mounted() {
  },
  methods: {
    // tab 切换
    handleTabChange(str) {
      this.activeName = str
    },
    // 获取应用列表
    getAppInfo() {
      if(this.$route.query && this.$route.query.jvsAppId) {
        getAppInfoById(this.$route.query.jvsAppId).then(res => {
          if (res.data && res.data.code == 0 && res.data.data) {
            this.appName = res.data.data.name
          }
        })
      }
    },
    handleClick(e) {
      this.$emit('tabSelect', e.name)
    },
    // 保存
    handleSave() {
      this.$emit('handleSave')
    },
    // 帮助
    handleHelp() {
      let str = ''
      switch (this.type) {
        case 'rule':
          str = 'rule-help';
          break;
        case 'chart':
          str = 'chart-help';
          break;
        case 'flow':
          str = 'flow-help';
          break;
        case 'form':
          str = 'video-form-help';
          break;
        case 'list':
          str = 'list-help';
          break;
        default:break;
      }
      if (str.split('-')[0] === 'video') {
        this.$videoOpen({
          title: '表单帮助',
          dicStr: str ? str : ''
        })
      } else {
        this.$openUrl('', '_blank', str)
      }
    },
    autoOpenVideo() {
      if (this.$store.getters.autoOpenedDict.indexOf('video-form-help') === -1) {
        let arr = this.$store.getters.autoOpenedDict
        arr.push('video-form-help')
        this.$videoOpen({
          title: '表单帮助',
          dicStr: 'video-form-help'
        })
        this.$store.commit("SET_AUTO_OPENED_DICT", arr)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.design-header-box{
  padding: 0 20px;
  height: 45px;
  border-bottom: 2px solid #f0f2f5;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 14px;
  .header-left{
    display: flex;
    align-items: center;
    width: 30%;
    .icon-style{
      margin: 0 6px;
    }
  }
  /deep/.header-center{
    display: flex;
    justify-content: center;
    width: 40%;
    .el-tabs__header{
      margin: 0;
    }
    .el-tabs__item{
      color: #878787;
      height: 45px;
      line-height: 45px;
      font-weight: 500;
    }
    .el-tabs__nav-wrap:after{
      height: 0;
    }
    .el-tabs__item:hover{
      color: #878787;
      //color: #3471ff;
    }
    .el-tabs__item.is-active{
      //color: #333333;
      color: #3471ff;
    }
  }
  .header-right{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 30%;
    .help-entry{
      width: 20px;
      height: 20px;
      margin-right: 12px;
      cursor: pointer;
      fill: #878787;
    }
  }
}
</style>
