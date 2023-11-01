<template>
  <div class="chart-new-design-box">
    <div style="height:100%;overflow:hidden;">
      <topBar
        ref="topBar"
        :infoData="infoData"
        :rowData="infoData"
        :layout="layout"
        :queryList="queryList"
        @createChart="createChart"
        @tabChange="tabChange"
        @paramsChange="paramsChange"
        @statusChange="statusChange"
        @getTimeType="getTimeType"
        @close="closeHandle"
        @setFilter="setFilter"
      />
      <div class="content">
        <left-menu :timeType="timeType" @createChart="createChart" @createCard="createCard"/>
        <singleGallery
          ref="singleGallery"
          :layouts="layout"
          :isFilter="isFilter"
          :titleHeight="titleHeight"
          :timeType="timeType"
          :statusBool="statusBool"
          @setGalleryInfo="setGalleryInfo"
          @getQueryList="getQueryList"
          @clearQueryList="clearQueryList"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="infoShow"
      fullscreen
      append-to-body
      :show-close="false"
      class="form-fullscreen-dialog chart-config"
      :before-close="handleClose">
      <span slot="title" style="width: 100%; background-color: #F6F6F6">
        <titlePageHeader style="margin: 8px 0" title="图表配置" :needLoading="true" @save="handleSave(itemInfo.isCard)" @close="cancelHandle">
        </titlePageHeader>
<!--        <div class="title-header">-->
<!--          <p class="right-icon-close">-->
<!--            <img :src="closeIcon" alt="" @click="cancelHandle">-->
<!--          </p>-->
<!--          <p class="right-icon-save">-->
<!--            <el-tooltip effect="dark" content="保存" placement="top">-->
<!--              <img :src="saveIcon" alt="" @click="handleSave(itemInfo.isCard)">-->
<!--            </el-tooltip>-->
<!--          </p>-->
<!--        </div>-->
      </span>
      <div v-if="infoShow">
        <card-info
          v-if="itemInfo.isCard"
          ref="cardInfo"
          :infoData="itemInfo"
          :shape="itemInfo.type"
          :cardTitle="itemInfo.data.title"
          :cardContent="itemInfo.data.content"
          :setting="itemInfo.data.setting"
          :dataSource="itemInfo.dataSource"
          :params="params"
          @save="saveCardHandle"
          @cancel="cancelHandle"
        ></card-info>
        <galleryInfo
          v-else
          ref="galleryInfo"
          :infoData="itemInfo"
          :shape="itemInfo.type"
          :tableData="itemInfo.data.tableData"
          :column="itemInfo.data.column"
          :setting="itemInfo.data.setting"
          :dataSource="itemInfo.dataSource"
          :params="params"
          @save="saveHandle"
          @cancel="cancelHandle"
        >
        </galleryInfo>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import topBar from '../top/topBar'
import singleGallery from '../single/index'
import galleryInfo from '../../components/chart/plugin/info'
import GLine from '../../components/chart/plugin/chart/line'
import GHist from '../../components/chart/plugin/chart/histogram'
import GPie from '../../components/chart/plugin/chart/pie'
import GBarChart from '../../components/chart/plugin/chart/bar'
import GScatter from '../../components/chart/plugin/chart/scatter'
import GStackArea from '../../components/chart/plugin/chart/stackArea'
import GDashBoard from '../../components/chart/plugin/chart/dashBoard'
import GFunnelChart from '../../components/chart/plugin/chart/funnel'
import GDataCard from '../../components/chart/plugin/chart/dataCard'
import GInfoCard from '../../components/chart/plugin/chart/infoCard'
import closeicon from "@/const/img/关闭.png"
import saveicon from "@/const/img/保存.png"
import LeftMenu from "../single/leftMenu";
import CardInfo from "../../components/chart/plugin/cardInfo";
import titlePageHeader from '@/components/page-header/titlePageHeader'
const gLine = new GLine()
const gHist = new GHist()
const gPie = new GPie()
const gBarChart = new GBarChart()
import { getChartDesign } from '../../api/chart.js'
export default {
  components: {CardInfo, LeftMenu, topBar, singleGallery, galleryInfo, titlePageHeader},
  props: {
    // infoData: {
    //   type: Object
    // },
    // rowData: {
    //   type: Object
    // }
  },
  data() {
    return {
      infoData: {},
      isFilter: false,
      titleHeight: 20,
      closeIcon: closeicon,
      saveIcon: saveicon,
      layout: [],
      queryList: [],
      tabData: {}, // tab数据
      infoShow: false, // 图表详情设置显示
      itemInfo: {},
      index: 0, // 当前拖动项在layout的索引
      chartCom: {}, // 当前组件
      params: {}, // 时间条件
      statusBool: false,
      timeType: 'daterange', // 时间类型
      countNumber: 0,
    }
  },
  methods: {
    // 设置筛选条件
    setFilter(bool) {
      this.isFilter = bool
    },
    // 获取图表详情
    getChartInfo(id) {
      getChartDesign(id).then(res => {
        if(res.data.code == 0) {
          this.infoData = res.data.data
          this.init()
        }
      })
    },
    init () {
      let form = this.infoData
      this.layout = []
      if(form && form.id) {
        if(form.dataJson) {
          let list = JSON.parse(form.dataJson)
          const arr = []
          for(let i in list) {
            let obj = {}
            obj = list[i]
            if(obj.resizeHeight) {
              obj.resizeHeight -= (obj.data.setting.titleSize + 4)
            }
            this.layout.push(obj)
          }
          if (form.filterJson) {
            JSON.parse(form.filterJson).forEach(item => {
              arr.push(item)
              this.$nextTick(() => {
                this.$refs.singleGallery.setQueryList(arr)
                this.queryList = [...arr]
                this.$refs.topBar.setIsSelected(true)
                this.isFilter = true
              })
            })
          }
        }
      }
    },
    // 创建卡片实例
    createCard (item) {
      let obj = JSON.parse(JSON.stringify(item))
      switch(item.type) {
        // 数据卡片
        case 'DataCard' :
          obj.data = {
            setting: new GDataCard().setting,
            cardTitle: new GDataCard().cardTitle,
            cardContent: new GDataCard().cardContent
          };
          break;
        // 信息卡片
        case 'InfoCard' :
          obj.data = {
            setting: new GInfoCard().setting,
            cardTitle: new GInfoCard().cardTitle,
            cardContent: new GInfoCard().cardContent
          };
          break;
        default: ;break;
      }
      obj.data.setting.id = item.type + this.countNumber + new Date().getTime()
      obj.x = 0
      obj.y = 0
      obj.w = 4
      obj.h = 3
      obj.i = obj.data.setting.id
      obj.isMock = true
      // obj = Object.assign(obj, {"x":0,"y":0,"w":6,"h":12,"i": obj.data.setting.id})
      this.layout.push(obj)
      this.layout.reverse()
      this.countNumber += 1
    },
    // 创建图表实例
    createChart (item) {
      let obj = JSON.parse(JSON.stringify(item))
      const chartHist = new GHist()
      const chartPie = new GPie()
      const chartArea = new GStackArea()
      const chartLine = new GLine()
      const chartScatter = new GScatter()
      const chartBar = new GBarChart()
      const chartFunnel = new GFunnelChart()
      if (item.settingType) {
        chartLine.setting.type = item.settingType
        chartLine.setting.name = item.name
        chartHist.setting.type = item.settingType
        chartHist.setting.name = item.name
        chartPie.setting.type = item.settingType
        chartPie.setting.name = item.name
        chartArea.setting.type = item.settingType
        chartArea.setting.name = item.name
        chartScatter.setting.type = item.settingType
        chartScatter.setting.name = item.name
        chartBar.setting.type = item.settingType
        chartBar.setting.name = item.name
      }
      if (item.data) {
        chartBar.column = item.data.column
        chartBar.tableData = item.data.tableData
        if (item.data.column) {
          chartHist.column = item.data.column
          chartHist.tableData = item.data.tableData
        } else {
          chartHist.tableData = item.data
        }
        chartScatter.tableData = item.data.tableData
        chartLine.tableData = item.data.tableData
        chartFunnel.tableData = item.data.tableData
        chartArea.tableData = item.data.tableData
      }
      switch(item.type) {
        // 折线图
        case 'LineChart' :
          obj.data = {
            setting: chartLine.setting,
            column: chartLine.column,
            tableData: chartLine.tableData
          };
          break;
        // 柱状图
        case 'HistogramChart':
          obj.data = {
            setting: chartHist.setting,
            column: chartHist.column,
            tableData: chartHist.tableData
          };
          break;
        // 饼图
        case 'Pie':
          obj.data = {
            setting: chartPie.setting,
            column: chartPie.column,
            tableData: chartPie.tableData
          };
          break;
        // 条形图
        case 'BarChart':
          obj.data = {
            setting: chartBar.setting,
            column: chartBar.column,
            tableData: chartBar.tableData
          };
          break;
        // 散点图
        case 'ScatterChart':
          obj.data = {
            setting: chartScatter.setting,
            column: chartScatter.column,
            tableData: chartScatter.tableData
          };
          break;
        // 面积图
        case 'AreaChart':
          obj.data = {
            setting: chartArea.setting,
            column: chartArea.column,
            tableData: chartArea.tableData
          };
          break;
        // 仪表盘
        case 'DashBoardChart':
          obj.data = {
            setting: new GDashBoard().setting,
            column: new GDashBoard().column,
            tableData: new GDashBoard().tableData
          };
          break;
        // 漏斗图
        case 'FunnelChart':
          obj.data = {
            setting: chartFunnel.setting,
            column: chartFunnel.column,
            tableData: chartFunnel.tableData
          };
          break;
        default: ;break;
      }
      obj.data.setting.id = item.type + this.countNumber + new Date().getTime()
      obj.x = 0
      obj.y = 0
      obj.w = 12
      obj.h = 12
      obj.i = obj.data.setting.id
      obj.isMock = true
      // obj = Object.assign(obj, {"x":0,"y":0,"w":6,"h":12,"i": obj.data.setting.id})
      if(this.isTab) {
        // tab对应添加数据
        this.chartCom = obj
      }else{
        this.layout.push(obj)
        this.layout.reverse()
      }
      this.countNumber += 1
    },
    // 是否开启tab
    tabChange (val) {
      this.isTab = val
      let temp = JSON.parse(JSON.stringify(this.layout))
      if(this.isTab) {
        this.layout = [{
          title: '默认',
          name: '1',
          layout: temp
        }]
      }else{
        this.layout = temp[0].layout
      }
    },
    // 获取筛选控件列表
    getQueryList(arr) {
      // console.log(arr)
      this.queryList = arr
    },
    clearQueryList() {
      this.queryList = []
    },
    // 图表设置
    setGalleryInfo (data) {
      // console.log(JSON.parse(this.infoData.dataJson))
      // console.log(arr)
      // 启用状态下不可编辑
      if(this.itemInfo.isStatus) {
        return false
      }
      this.itemInfo = data.item
      this.index = data.index
      this.itemInfo.selectControl = [...this.queryList]
      this.infoShow = true
    },
    // 卡片保存
    saveCardHandle(data) {
      this.itemInfo.isMock = false
      this.infoShow = false
      this.itemInfo.data.setting = data.data.setting
      this.itemInfo.data.cardContent = data.data.cardContent
      this.itemInfo.data.cardTitle = data.data.cardTitle
      this.itemInfo.dataSource = data.dataSource
      if(data.isNull) {
        this.itemInfo.isNull = data.isNull
      }else{
        this.itemInfo.isNull = false
      }
      if(data.dataSource && data.dataSource.datasourceType === 'MOCK') {
        this.itemInfo.isMock = true
      }
      this.layout[this.index] = this.itemInfo
      this.$forceUpdate()
    },
    // 图表保存
    saveHandle (data) {
      this.$nextTick(() => {
        if (document.getElementById('chartTitle')) {
          this.titleHeight = document.getElementById('chartTitle').offsetHeight
        }
      })
      this.itemInfo.isMock = false
      this.infoShow = false
      this.itemInfo.data.setting = data.data.setting
      this.itemInfo.data.tableData = data.data.tableData
      this.itemInfo.dataSource = data.dataSource
      // console.log(this.itemInfo)
      if(data.isNull) {
        this.itemInfo.isNull = data.isNull
      }else{
        this.itemInfo.isNull = false
      }
      if(data.dataSource && data.dataSource.datasourceType === 'MOCK') {
        this.itemInfo.isMock = true
      }
      this.layout[this.index] = this.itemInfo
      this.$forceUpdate()
    },
    // 取消
    cancelHandle () {
      this.infoShow = false
    },
    // 保存
    handleSave(isCard) {
      // console.log(isCard)
      if (isCard) {
        this.$refs.cardInfo.saveHandle()
      } else {
        this.$refs.galleryInfo.saveHandle()
      }
    },
    // 获取时间选择类型
    getTimeType (type) {
      this.timeType = type
      // console.log(this.timeType)
    },
    // 时间改变
    paramsChange (params) {
      this.params = params
    },
    // 是否启用
    statusChange (val) {
      this.statusBool= val
    },
    // 同步tab数据
    synData (data) {
      // this.layout = JSON.parse(JSON.stringify(data))
    },
    handleClose () {
      this.infoShow = false
    },
    closeHandle (bool) {
      this.$emit('close', bool)
      window.close()
    }
  },
  async created () {
    if (this.$route.query && this.$route.query.id) {
      await this.getChartInfo(this.$route.query.id)
    }
    const arr = []
    if (this.infoData.dataJson && this.infoData.dataJson !== '{}') {
      JSON.parse(this.infoData.dataJson).forEach(item => {
        const data = item
        if(data.filterKey) {
          const obj = { filterKey: data.filterKey, label: data.label }
          arr.push(obj)
        }
      })
      this.queryList = [...arr]
    }
  }
}
</script>
<style lang="scss" scoped>
.title-header{
  position: relative;
  height: 45px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  .right-icon-close{
    padding: 0 17px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    border-left: 1px solid #DCDFE6;
    img{
      width: 18px;
      height: 18px;
    }
  }
  .right-icon-save {
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 0 17px;
    img{
      width: 20px;
      height: 20px;
    }
  }
}
::v-deep.chart-config{
  .el-dialog.is-fullscreen {
    //background-color: #f9f9f9;
    overflow: auto;
    .el-dialog__header{
      height: 45px;
      //margin: 8px;
      margin-bottom: 8px;
      background-color: #ffffff;
      border-radius: 5px 5px 0 0;
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}
.chart-new-design-box{
  height: 100%;
  background-color: #f9f9f9;
  overflow: hidden;
  .content{
    //margin: 0 8px;
    margin-top: 8px;
    height:100%;
    overflow:hidden;
    background-color: #ffffff;
    //.left-menu{
    //  position: fixed;
    //  left: 0;
    //  bottom: 0;
    //  //background-color: rebeccapurple;
    //  margin: 10px 8px;
    //  height: calc(100% - 120px);
    //  width: 240px;
    //}
    //.left-menu-without-date{
    //  height: calc(100% - 120px);
    //}
    .gallery-list-top{
      margin-top: 10px;
      .gallery-list-top-left{
        margin-right: 40px;
      }
    }
  }
}
.el-menu--horizontal {
  left: 0!important;
  width: 100%;
  top: -5px!important;
  .el-menu {
    display: flex;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.9) !important;
    text-align: center;
    // margin: 0 10px 0 25px;
    .el-menu-item {
      width: 20%;
      height: auto;
      overflow: hidden;
      margin: 0 15px;
      padding: 0;
      .assemblycont_item {
        text-align: center;
        background: #f9f9f9;
        padding: 10px;
        padding-top: 0;
        h5{
          margin: 0;
          padding: 5px 0;
          height: 12px;
          font-size: 12px;
          line-height: 12px;
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
