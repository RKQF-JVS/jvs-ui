<template>

  <div :class="{'gallery-show': true, 'pcmobile-show': (isMobile && !viewMobile)}">
    <!-- <title>{{ titleName }}</title> -->
    <div :class="{'gallery-show-pc': !isMobile, 'gallery-show-mobile': isMobile, 'gallery-show-pcmobile': (isMobile && viewMobile)}">
      <!-- pcmobileHeight -->
      <div class="chart-content-box">
        <el-card v-if="queryList.length > 0">
          <el-row :gutter="16">
            <el-col :span="isMobile ? 24 : 8" v-for="(item, key) in queryList" :key="key">
              <div class="query-body">
                <span :title="item.label" class="query-label">{{ item.label.length > 6 ? item.label.substr(0, 4) + '...：' : item.label + '：' }}</span>
                <el-input :id="item.id" v-if="item.type === 'input'" v-model="item.defaultVal" @focus="handleFocus(item.id)" @input="handleInput" size="mini"></el-input>
<!--                <el-select v-model="item.defaultVal" v-if="item.type === 'select'" @focus="handleFocus(item.id)" @select="handleSelect" size="mini">-->
<!--                </el-select>-->
                <el-date-picker
                  v-if="item.type === 'datetimerange' || item.type === 'daterange'"
                  :type="item.type"
                  v-model="item.defaultVal"
                  size="mini"
                  style="width: 100%"
                  @focus="handleFocus(item.id)"
                  @change="handleDateSelect"
                  value-format="yyyy-MM-DD HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="isMobile ? 24 : 8">
              <div class="query-body">
                <jvs-button size="mini" type="primary" @click="searchHandle">查询</jvs-button>
              </div>
            </el-col>
          </el-row>
<!--          <el-form-->
<!--            :inline="true"-->
<!--            class="demo-form-inline"-->
<!--            size='mini'-->
<!--          >-->
<!--            <el-form-item style="margin-left: 10px;">-->
<!--              <el-date-picker-->
<!--                style="width:130px;"-->
<!--                v-model="startTime"-->
<!--                :type="dateType"-->
<!--                placeholder="开始时间"-->
<!--              >-->
<!--              </el-date-picker>-->
<!--              <span style="padding:0px 10px;" class="centerText">至</span>-->
<!--              <el-date-picker-->
<!--                style="width:130px;"-->
<!--                v-model="endTime"-->
<!--                :type="dateType"-->
<!--                placeholder="结束时间"-->
<!--              >-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
<!--            <jvs-button size="mini" type="primary" @click="searchHandle">查询</jvs-button>-->
<!--            <jvs-button size="mini" v-if="isExport" type="primary">导出</jvs-button>-->
<!--          </el-form>-->
        </el-card>
        <div style="flex:1;">
          <grid-layout
            :layout.sync="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="false"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[15, 15]"
            :use-css-transforms="true"
          >
<!--            {{ layout }}-->
            <grid-item
              v-for="item in (MobileWidth < 600 || isMobile) ? layoutMobile :layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
            >
              <div style="height: 100%" @click="handleClick(item)">
                <gallery
                  :isPreview="true"
                  :shape="item.type"
                  :width=" isMobile ? 355 : Number.parseInt(item.w * (MobileWidth / 12))"
                  :height="item.h * 40 - 60"
                  :setting="item.data.setting"
                  :tableData="item.data.tableData"
                  :column="item.data.column"
                  :cardTitle="item.data.cardTitle"
                  :cardContent="item.data.cardContent"
                />
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </div>

    </div>

    <div v-if="isMobile && imgdata" class="codediv">
      <div class="code-img" @click="getimgbase64data">
        <img :src='imgdata' style="width:200px;height:200px;"/>
      </div>
      <span >使用手机扫码预览(30分钟有效)</span>
      <span style="cursor:pointer;" @click="getimgbase64data">刷新二维码</span>
    </div>



  </div>
</template>
<script>
// import {getMenuChartDesign, getMenuChart , getCodeImg} from '@/api/menu'
import {previewChartDesign, getUseChart} from '../../api/chart'
import VueGridLayout from 'vue-grid-layout';
import gallery from '@/views/chart/components/chart/plugin/gallery'
import GLine from '@/views/chart/components/chart/plugin/chart/line'
const gLine = new GLine()
export default {
  name: 'gallery-show',
  components: {gallery, GridLayout: VueGridLayout.GridLayout, GridItem: VueGridLayout.GridItem},
  computed: {
    // 屏幕宽度
    MobileWidth () {
      if(this.isMobile) {
        return 3550
      }
      return this.$store.state.common.MobileWidth
    },
    // 手机端显示时
    layoutMobile () {
      let arr = JSON.parse(JSON.stringify(this.layout))
      let y = 0
      for (let i = 0; i < arr.length; i++) {
        arr[i].y = y
        arr[i].w = 12
        y += arr[i].h
      }
      return arr
    }
  },
  data() {
    return {
      isMobile: false,
      queryList: [],
      isSearch: false,
      tempName: '',
      params: {},
      imgdata: '', // 二维码
      dateType: 'month',
      isExport: false,
      activeName: '1',
      id: '',
      layout: [],
      titleName: '',
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      viewMobile: false,
      pcmobileHeight: 0
    }
  },
  created () {
    // 获取预览类型
    if(this.$route.query && this.$route.query.type == 'mobile') {
      this.isMobile = true
      this.viewMobile = false
    }else{
      this.isMobile = false
      this.viewMobile = true
    }
    if(this.$route.query && this.$route.query.model == 'preview') {
      // 预览
      this.getDataByVersion()
    }else{
      // 实际显示
      this.getDataById()
    }
    // 移动端二维码
    this.getimgbase64data()

    this.pcmobileHeight = document.body.clientHeight - 94
  },
  mounted () {
    // 监听屏幕宽度
    let _this = this
    _this.$store.commit('set_MobileWidth', document.documentElement.clientWidth)
    window.onresize = function () { // 定义窗口大小变更通知事件
      _this.$store.commit('set_MobileWidth', document.documentElement.clientWidth)
    }
  },
  methods: {
    // 图表点击事件
    handleClick(obj) {
      if (obj.type === 'InfoCard') {
        if (obj.data && obj.data.setting) {
          const url = obj.data.setting.infoUrl
          this.$openUrl(url, '_blank')
        }
      }
    },
    // 获取焦点
    handleFocus(e) {
      const index = this.queryList.findIndex(function (n) {
        return n.id === e
      })
      this.tempName = this.queryList[index].filterKey
    },
    // input框输入内容
    handleInput(e) {
      this.params[this.tempName] = e
    },
    // 选择框确认选择
    handleSelect(e) {
      this.params[this.tempName] = e
    },
    // 时间选择框确认选择
    handleDateSelect(e) {
      this.params[this.tempName] = [...e]
    },
    getimgbase64data() {
      let url = window.location.origin
      if(this.$route.query.id) {
        // getCodeImg(url, this.$route.query.id).then(res => {
        //   if (res && res.data.code == '0') {
        //     this.imgdata = res.data.data
        //   }
        // })
      }
    },
    mobileLayout (list) {
      let arr = list
      let y = 0
      for (let i = 0; i < arr.length; i++) {
        arr[i].y = y
        arr[i].w = 12
        y += arr[i].h
      }
      console.log(arr)
      return arr
    },
    searchHandle () {
      this.isSearch = true
      this.getDataByVersion()
    },
    // 根据页面获取数据
    getDataByVersion () {
      console.log(this.params)
      // return false
      this.layout = []
      // 查询条件
      let params = JSON.parse(JSON.stringify(this.params))
      if(this.$route.query && this.$route.query.id) {
        previewChartDesign(this.$route.query.id, params).then(res => {
          if(res.data.code == 0) {
            this.formatData(res.data.data)
          }
        })
      }
    },
    // 根据菜单id获取数据
    getDataById () {
      this.layout = []
      // 查询条件
      let params = JSON.parse(JSON.stringify(this.params))
      if(this.$route.query && this.$route.query.id) {
        getUseChart(this.$route.query.id, params).then(res => {
          if(res.data.code == 0 && res.data.data) {
            this.formatData(res.data.data)
          } else if (res.data.code !== 0) {
            this.$router.push({path: '/404', query: { msg: res.data.msg }});
          }
        }).catch((err) => {
          const str = String(err).split(':')[1]
          this.$router.push({path: '/404', query: { msg: str }});
        })
      }
    },
    formatData (data) {
      if (!this.isSearch) {
        this.queryList = [...JSON.parse(data.filterJson)]
        this.queryList.forEach(item => {
          this.params[item.filterKey] = item.defaultVal
        })
      }
      this.titleName = data.menuName
      this.dateType = data.timeType
      let list = JSON.parse(data.dataJson)
      for(let i in list) {
        let obj = {}
        obj = list[i]
        this.layout.push(obj)
      }
    }
  },
  watch: {
    $route (to, from) {
      if(to.fullPath != from.fullPath) {
        // 获取预览类型
        if(this.$route.query && this.$route.query.type == 'mobile') {
          this.isMobile = true
        }else{
          this.isMobile = false
        }
        // 获取数据
        this.getDataById()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.gallery-show::v-deep .el-card__body{
  .query-body{
    padding: 10px 0;
    display: flex;
    align-items: center;
    //margin-right: 10px;
    .query-label{
      text-align: right;
      font-size: 12px;
      min-width: 80px;
    }
  }
}
</style>
<style lang="scss">
.gallery-show{
  //height: calc(100vh - 16px);
  // background: #f1f2f4;
  height: 100%!important;
  overflow: auto!important;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  .el-card__body{
    padding: 10px;
  }
  .el-date-editor--monthrange.el-input__inner{
    width: 100%;
  }
  .el-form{
    .el-col-xs-24:nth-of-type(1){
      .el-form-item {
        .el-form-item__content{
          display: flex;
          flex-wrap: wrap;
          // .centerText{
          //   display: none;
          // }
          .el-date-editor:nth-of-type(1){
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  .vue-grid-layout{
    // height: 440px!important;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
  }
  .vue-grid-layout::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.gallery-show .gallery-show-mobile{
  width: 375px;
  // height: 667px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 128px 53px 139px 41px;
  background-image: url(../../styles/chart/mobile.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  .el-form{
    .el-row{
      .el-col{
        width: 100%;
      }
    }
  }
  // .vue-grid-layout{
  //   height: 100%!important;
  // }
}
.gallery-show .gallery-show-pcmobile {
  .vue-grid-layout{
    height: 100%!important;
  }
}

  .codediv{
    width:220px;
    height:260px;
    position: fixed;
    left: 50%;top: 20%;
    margin-left: 260px;
    font-size:12px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
.gallery-show-pc{
  flex: 1;
  display: flex;
  flex-direction: column;
  .vue-grid-layout{
    // height: 100%!important;
  }
}
.code-img{
  cursor:pointer;
  background: url(../../styles/chart/codeborder.png);
  background-size: contain;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pcmobile-show{
  height: 800px;
  overflow: hidden;
  .gallery-show-mobile{
    padding: 99px 53px 108px 41px;
  }
  .chart-content-box{
    height: calc(800px - 99px - 108px);
    overflow: hidden;
    overflow-y: auto;
  }
  .chart-content-box::-webkit-scrollbar{
    display: none;
  }
}
</style>
