<template>
  <div class="left-menu">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :unique-opened="true"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/line.png"/>
          <span>折线图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in lineCharts"
          :key="index"
          :index="'1' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/bar.png"/>
          <span>条形图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in barCharts"
          :key="index"
          :index="'2' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/hist.png"/>
          <span>柱状图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in histogramCharts"
          :key="index"
          :index="'3' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/pie.png"/>
          <span>饼图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in pieCharts"
          :key="index"
          :index="'4' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/scatter.png"/>
          <span>散点图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in scatterCharts"
          :key="index"
          :index="'5' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/area.png"/>
          <span>面积图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in areaCharts"
          :key="index"
          :index="'6' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="7">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/dashBoard.png"/>
          <span>仪表盘</span>
        </template>
        <el-menu-item
          v-for="(item, index) in dashBoardCharts"
          :key="index"
          :index="'7' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="8">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/funnel.png"/>
          <span>漏斗图</span>
        </template>
        <el-menu-item
          v-for="(item, index) in funnelCharts"
          :key="index"
          :index="'8' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="9">
        <template slot="title">
          <img class="menu-icon" src="@/views/chart/styles/menu/card.png"/>
          <span>卡片</span>
        </template>
        <el-menu-item
          v-for="(item, index) in cardCharts"
          :key="index"
          :index="'9' + index"
        >
          <div class="assemblycont_item" @click="createChart(item)">
            <h5>{{ item.name }}</h5>
            <img
              :src="item.src"
            />
          </div>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import lineImg from '@/views/chart/styles/chart/line.png'
import linesImg from '@/views/chart/styles/chart/lines.png'
import otherLineImg from '@/views/chart/styles/chart/otherLine.png'
import zhuImg from '@/views/chart/styles/chart/zhu.png'
import histImg from '@/views/chart/styles/chart/hist.png'
import bingImg from '@/views/chart/styles/chart/bing.png'
import huanImg from '@/views/chart/styles/chart/huan.png'
import roseImg from '@/views/chart/styles/chart/rose.png'
import roseRing from '@/views/chart/styles/chart/roseRing.png'
import groupBar from '@/views/chart/styles/chart/groupBar.png'
import tiaoImg from '@/views/chart/styles/chart/tiao.png'
import groupHist from '@/views/chart/styles/chart/groupHist.png'
import stackHist from '@/views/chart/styles/chart/stack.png'
import pointImg from '@/views/chart/styles/chart/point.png'
import bubbleImg from '@/views/chart/styles/chart/bubble.png'
import stackArea from '@/views/chart/styles/chart/stackArea.png'
import baseArea from '@/views/chart/styles/chart/baseArea.png'
import dataCard from '@/views/chart/styles/chart/dataCard.png'
import infoCard from '@/views/chart/styles/chart/infoCard.png'
import dashBoard from '@/views/chart/styles/chart/dashBoard.png'
import funnel from '@/views/chart/styles/chart/funnel.png'
import {
  baseBar,
  baseHistogram,
  baseScatter,
  bubbleScatter,
  otherLine
} from "@/views/chart/components/chart/plugin/chart/config";
import {getBaseAreaData, getFunnelData, getHistData, getLines} from "../../components/chart/plugin/chart/config";
export default {
  name: "leftMenu",
  props: {
    timeType: {
      type: String,
      default: () => {
        return ''
      }
    },
  },
  data() {
    return {
      lineCharts: [
        { name: '基础折线图', type: 'LineChart', src: lineImg },
        { name: '多折线图', type: 'LineChart', src: linesImg, settingType: 'lines', data: getLines() },
        { name: '其他折线图', type: 'LineChart', src: otherLineImg, settingType: 'other', data: otherLine },
      ],
      barCharts: [
        { name: '基础条形图', type: 'BarChart', src: tiaoImg, settingType: 'base', data: baseBar },
        { name: '分组条形图', type: 'BarChart', src: groupBar }
      ],
      histogramCharts: [
        { name: '基础柱状图', type: 'HistogramChart', src: zhuImg, settingType: 'base', data: baseHistogram },
        { name: '分组柱状图', type: 'HistogramChart', src: groupHist },
        { name: '堆叠柱状图', type: 'HistogramChart', src: stackHist, settingType: 'stack' },
        { name: '直方图', type: 'HistogramChart', src: histImg, settingType: 'hist' } // data: getHistData()
      ],
      pieCharts: [
        { name: '基础饼图', type: 'Pie', src: bingImg },
        { name: '环图', type: 'Pie', src: huanImg, settingType: '3' },
        { name: '玫瑰图', type: 'Pie', src: roseImg, settingType: '4' },
        { name: '玫瑰环图', type: 'Pie', src: roseRing, settingType: '5' }
      ],
      scatterCharts: [
        { name: '基础散点图', type: 'ScatterChart', src: pointImg, data: baseScatter },
        { name: '气泡图', type: 'ScatterChart', src: bubbleImg, settingType: 'bubble', data: bubbleScatter },
      ],
      areaCharts: [
        { name: '基础面积图', type: 'AreaChart', src: baseArea, settingType: 'base', data: getBaseAreaData() },
        { name: '堆叠面积图', type: 'AreaChart', src: stackArea }
      ],
      dashBoardCharts: [
        { name: '仪表盘（多色）', type: 'DashBoardChart', src: dashBoard },
      ],
      funnelCharts: [
        { name: '基础漏斗图', type: 'FunnelChart', src: funnel, data: getFunnelData() },
      ],
      cardCharts: [
        { name: '数据卡片', type: 'DataCard', src: dataCard, isCard: true },
        { name: '信息卡片', type: 'InfoCard', src: infoCard, isCard: true },
      ]
    }
  },
  methods: {
    // 添加图表
    createChart (item) {
      let obj = JSON.parse(JSON.stringify(item))
      if (obj.isCard) {
        this.$emit('createCard', obj)
      } else {
        this.$emit('createChart', obj)
      }
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss">

.left-menu{
  z-index: 1;
  overflow-y: scroll;
  position: fixed;
  left: 0;
  bottom: 0;
  //margin: 10px 8px;
  height: calc(100% - 60px);
  width: 200px;
  //.assembly-el-menu{
  .el-menu-vertical-demo{
    width: 200px!important;
    .menu-icon {
      width: 12px;
      height: 12px;
      padding-right: 12px;
    }
    .assemblycont_item{
      //background: #f9f9f9;
      padding: 0 6px 6px 6px;
      h5{
        margin: 0;
        padding: 5px 0;
        height: 12px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
      }
      img{
        //display: block;
        width: 100%;
        height: 100%;
      }
    }
    .el-menu-item{
      height: auto;
      width: 100%;
      padding: 0!important;
    }
    .assembly-el-menu-item{
      width: 80px!important;
    }
  }
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.el-menu-item, .el-submenu__title {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
</style>
