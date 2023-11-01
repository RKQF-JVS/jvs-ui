<template>
  <div class="pagebox">
    <div class="toolbox">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#22242B"
        text-color="#B3B4B6"
        active-text-color="#fff"
      >
        <el-menu-item index="1" @click="addComponenet(commonConstants.componentsType.text)">
          <span><i class="el-icon-edit-outline"></i>文本</span>
        </el-menu-item>
        <el-menu-item index="7" @click="addComponenet(commonConstants.componentsType.date)">
          <span><i class="el-icon-date"></i>日期</span>
        </el-menu-item>
        <el-menu-item index="2" @click="addComponenet(commonConstants.componentsType.picture)">
          <span><i class="el-icon-picture-outline"></i>图片</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title"><span><i class="el-icon-s-data"></i>图表</span></template>
          <el-menu-item index="3-1" @click="addComponenet(commonConstants.componentsType.histogram)">柱状图</el-menu-item>
          <el-menu-item index="3-2" @click="addComponenet(commonConstants.componentsType.lineChart)">折线图</el-menu-item>
          <el-menu-item index="3-3" @click="addComponenet(commonConstants.componentsType.pieChart)">饼图</el-menu-item>
          <el-menu-item index="3-4" @click="addComponenet(commonConstants.componentsType.gauge)">仪表盘</el-menu-item>
        </el-submenu>
        <el-menu-item index="4" @click="addComponenet(commonConstants.componentsType.table)">
          <span><i class="el-icon-s-grid"></i>表格</span>
        </el-menu-item>
        <el-menu-item index="5" @click="save()">
          <span><i class="el-icon-document-checked"></i>保存</span>
        </el-menu-item>
        <el-menu-item index="6" @click="preview()">
          <span><i class="el-icon-view"></i>预览</span>
          </el-menu-item>
      </el-menu>
    </div>
    <div class="contentbox">
      <div class="leftbox" style="height: 100%">
        <el-tabs v-model="activeName2" style="width: 100%; height: 100%" class="mytaba">
          <el-tab-pane label="图层" name="tab2">
            <el-card
              shadow="never"
              v-for="(item, index) in components"
              :key="index"
              class="mycarda"
              :style="{ background: item.active ? '#2491F7' : '' }"
              @click.native="selectComponent(item)"
              v-show="item.type != commonConstants.componentsType.delete"
            >
              <label v-if="item.type == commonConstants.componentsType.text">文本({{ item.content }})</label>
              <label v-if="item.type == commonConstants.componentsType.picture">图片</label>
              <label v-if="item.type == commonConstants.componentsType.histogram">柱状图
                <span v-if="item.options.title.show && item.options.title.text">({{ item.options.title.text }})</span>
              </label>
              <label v-if="item.type == commonConstants.componentsType.lineChart">折线图
                <span v-if="item.options.title.show && item.options.title.text">({{ item.options.title.text }})</span>
              </label>
              <label v-if="item.type == commonConstants.componentsType.pieChart">饼图
                <span v-if="item.options.title.show && item.options.title.text">({{ item.options.title.text }})</span>
              </label>
              <label v-if="item.type == commonConstants.componentsType.gauge">仪表盘
                <span v-if="item.options.title.show && item.options.title.text">({{ item.options.title.text }})</span>
              </label>
              <label v-if="item.type == commonConstants.componentsType.table">表格</label>
              <label v-if="item.type == commonConstants.componentsType.date">日期</label>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="mainbox" ref="dragContainer">
        <div class="mainwrap">
          <vue-ruler-tool
            :content-layout="{ left: 0, top: 0 }"
            :is-scale-revise="true"
            :is-hot-key="false"
            :step-length="50"
          >
            <div
              @click="clickPanel"
              :style="{
                height: screenProperties.height + 'px',
                width: screenProperties.width + 'px',
                backgroundImage: 'url(' + screenProperties.imgUrl + ')',
                background: screenProperties.background,
              }"
            >
              <draggables
                :components="components"
                :activated.sync="activated"
                :isBubblingEvent.sync="isBubblingEvent"
                ref="draggable"
                :chartsComponents="chartsComponents"
                :isView="false"
                :myclass="'newclass'"
              ></draggables>
            </div>
          </vue-ruler-tool>
        </div>
      </div>
      <div class="rightbox">
        <el-tabs v-model="activeName" style="width: 100%; height: 100%" class="mytaba">
          <el-tab-pane label="配置" name="tab1">
            <div class="infobox" v-show="isOpen">
              <tabForm
                :component="activated"
                ref="tabForm"
                :chartsComponents="chartsComponents"
              ></tabForm>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script src="./design.js"></script>

<style scoped="scope">
.pagebox {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pagebox .toolbox {
  min-height: 60px;
  height: 5%;
  display: flex;
  background: #22242b;
}

.contentbox {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.contentbox .mainbox {
  flex: 1;
  background: #313239;
  padding: 20px 5px;
  overflow: hidden;
}

.contentbox .mainbox .mainwrap {
  height: 100%;
  /* background: #181B24; */
  overflow-y: auto;
  overflow-x: auto;
}

.contentbox .rightbox {
  flex: none;
  /*    padding-left: 30px; */
  background: #22242b;
  position: relative;
  width: 334px;
}

.contentbox .leftbox {
  flex: none;
  background: #22242b;
  position: relative;
  width: 180px;
  height: 100%;
}

.contentbox .rightbox.collapse {
  width: 30px;
}

.clarrow {
  position: absolute;
  top: 50%;
  left: 3px;
  font-size: 20px;
  cursor: pointer;
}

.el-tabs >>> .el-tabs__content {
  padding-bottom: 15px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.el-menu-demo .el-menu-item,
.el-menu-demo .el-submenu >>> .el-submenu__title {
  font-size: 16px;
}

.el-menu-demo .el-menu-item i,
.el-menu-demo .el-submenu >>> .el-submenu__title i {
  color: #b3b4b6;
}

.el-menu-demo .el-menu-item.is-active,
.el-menu-demo .el-submenu.is-active >>> .el-submenu__title {
  background-color: #2f3544 !important;
  border-bottom-color: #2f3544 !important;
}

.el-menu-demo .el-menu-item.is-active i,
.el-menu-demo .el-submenu.is-active >>> .el-submenu__title i {
  color: white;
}

.el-menu-demo .el-submenu >>> .el-submenu__title .el-submenu__icon-arrow {
  margin-top: 0px;
}

.mytaba >>> .el-tabs__header .el-tabs__item.is-active {
  color: white;
}

.mytaba >>> .el-tabs__nav-wrap::after {
  background-color: #3a3f48;
}

.mytaba >>> .el-tabs__header .el-tabs__active-bar {
  background-color: white;
}

.mytaba >>> .el-tabs__header {
  background-color: #2d2f38;
  padding: 0 10px;
  margin-bottom: 0;
}

.mytaba >>> .el-tabs__item {
  font-size: 14px;
  background: none;
}

.mycarda.el-card >>> .el-card__body {
  padding: 12px;
}

.mycarda.el-card {
  border: 0;
  border-radius: 0;
  background-color: unset;
  color: white;
}

.mycarda.el-card label {
  color: white;
  font-size: 14px;
}

.mytaba >>> .el-tabs__content::-webkit-scrollbar,
.mainwrap::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.mytaba >>> .el-tabs__content::-webkit-scrollbar-thumb,
.mainwrap::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(117, 114, 114, 0.7);
}

.mytaba >>> .el-tabs__content::-webkit-scrollbar-track,
.mainwrap::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.titlea {
  background: #2d2f38;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 14px;
  padding: 10px;
}
.infobox {
  /* padding:20px 0; */
}
.infobox >>> .el-form-item__label {
  color: #c5c5c5;
}
.infobox >>> .el-collapse {
  border-top: 1px solid #393b4a;
  border-bottom: 1px solid #393b4a;
}
.infobox >>> .el-collapse .el-collapse-item__header {
  background-color: #2d2f38;
  color: #fff;
  padding-left: 10px;
  border-bottom: 1px solid #2d2f38;
}
.infobox >>> .el-collapse-item__wrap {
  background-color: #22242b;
  padding: 20px 16px;
}
.infobox >>> .el-collapse-item__content {
  padding-bottom: 0;
}
.vue-ruler-wrapper {
  height: 200% !important;
  width: 200% !important;
}

::v-deep.el-menu--horizontal {
  width: auto;
}
::v-deep.el-menu--horizontal .el-menu {
  display: block;
  background: rgb(34, 36, 43)!important;
}
::v-deep.el-menu--horizontal .el-menu .el-menu-item {
  width: 100%;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  margin: 0;
}
</style>
