<template>
  <div style="width: 100%; height: 100%; position: relative; margin: 0 auto">
    <vue-draggable-resizable
      v-for="(item, index) in components"
      :key="index"
      :class="myclass"
      :parent="true"
      :z="item.zindex"
      :isConflictCheck="false"
      :snap="true"
      :snapTolerance="10"
      :x="item.x ? item.x : 0"
      :y="item.y ? item.y : 0"
      :w="item.w"
      :h="item.h"
      :active="item.active"
      @activated="onActivated(index, item)"
      @resizestop="onResizstop"
      @dragstop="onDragstop"
      v-show="item.type != commonConstants.componentsType.delete"
      :draggable="draggable"
      :resizable="resizable"
    >
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.text"
        :id="item.id"
        :style="{
          height: item.h + 'px',
          width: item.w + 'px',
          display: item.style.display,
          textAlign: item.style.textAlign,
          verticalAlign: item.style.verticalAlign,
          fontSize: item.style.fontSize + 'pt',
          color: item.style.color,
          letterSpacing: item.style.letterSpacing + 'px',
          background: item.style.background,
          fontWeight: item.style.fontWeight ? 'bold' : 'normal',
        }"
      >
        <span v-if="item.textType == 'text'">{{ item.content }}</span>
        <MarqueeTips
          v-if="item.textType == 'marquee'"
          :content="item.content"
          :speed="item.speed"
          :style="{
            height: item.h + 'px',
            width: item.w + 'px',
            lineHeight: item.h + 'px',
          }"
        >
        </MarqueeTips>
        <!-- <el-link v-if="item.textType=='link'" href="https://element.eleme.io" target="_blank">默认链接</el-link> -->
        <span
          ><a
            v-if="item.textType == 'link'"
            :style="{
              fontSize: item.style.fontSize + 'pt',
              color: item.style.color,
              letterSpacing: item.style.letterSpacing + 'px',
              fontWeight: item.style.fontWeight ? 'bold' : 'normal',
            }"
            :href="item.href"
            target="_blank"
            >{{ item.content }}</a
          ></span
        >
      </div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.date"
        :id="item.id"
        :style="{
          height: item.h + 'px',
          width: item.w + 'px',
          display: item.style.display,
          textAlign: item.style.textAlign,
          verticalAlign: item.style.verticalAlign,
          fontSize: item.style.fontSize + 'pt',
          color: item.style.color,
          letterSpacing: item.style.letterSpacing + 'px',
          background: item.style.background,
          fontWeight: item.style.fontWeight ? 'bold' : 'normal',
        }"
      >
        {{ item.content }}
      </div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.picture"
        :id="item.id"
        :style="{ height: item.h + 'px', width: item.w + 'px' }"
      >
        <img v-if="item.imgUrl" :src="item.imgUrl" />
      </div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.histogram"
        :id="item.id"
        :style="{ height: '100%', width: '100%' }"
      ></div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.lineChart"
        :id="item.id"
        :style="{ height: '100%', width: '100%' }"
      ></div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.pieChart"
        :id="item.id"
        :style="{ height: '100%', width: '100%' }"
      ></div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.gauge"
        :id="item.id"
        :style="{ height: '100%', width: '100%' }"
      ></div>
      <div
        @contextmenu.stop.prevent="
          isView ? emptyMethod : $refs.ctxshow.showMenu($event, item)
        "
        v-if="item.type == commonConstants.componentsType.table"
        :id="item.id"
        :style="{ height: item.h + 'px', width: item.w + 'px' }"
      >
        <!-- 表头 -->
        <div
          class="warp-title"
          :style="{
            height: item.headStyle.height + 'px',
            backgroundColor: item.headStyle.backgroundColor,
            color: item.headStyle.color,
            fontSize: item.headStyle.fontSize + 'pt',
            fontWeight: item.headStyle.fontWeight,
            borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
            borderStyle: item.style.isBorder ? item.style.borderStyle : '',
            borderColor: item.style.isBorder ? item.style.borderColor : '',
          }"
        >
          <ul class="item">
            <li
              :style="{
                height: item.headStyle.height + 'px',
                lineHeight: item.headStyle.height + 'px',
              }"
            >
              <span
                v-if="item.style.showIndex"
                class="title"
                :style="{
                  width: item.style.indexWidth + '%',
                  borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
                  borderStyle: item.style.isBorder ? item.style.borderStyle : '',
                  borderColor: item.style.isBorder ? item.style.borderColor : '',
                }"
                >序号</span
              >
              <span
                v-for="(column, i) in item.tableColumn"
                :key="i"
                class="title"
                :style="{
                  width: column.style.width + '%',
                  borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
                  borderStyle: item.style.isBorder ? item.style.borderStyle : '',
                  borderColor: item.style.isBorder ? item.style.borderColor : '',
                }"
                >{{ column.name }}</span
              >
            </li>
          </ul>
        </div>
        <!-- 表格滚动区 -->
        <div>
          <vue-seamless-scroll
            :style="{
              height: item.h - item.headStyle.height - 5 + 'px',
              borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
              borderStyle: item.style.isBorder ? item.style.borderStyle : '',
              borderColor: item.style.isBorder ? item.style.borderColor : '',
            }"
            :data="item.data"
            :class-option="item.options"
            class="warp-content"
            :ref="item.id"
          >
            <li
              v-for="(d, t) in item.data"
              :key="t"
              :style="{
                backgroundColor:
                  (t + 1) % 2 == 0
                    ? item.bodyStyle.evenRowColor
                    : item.bodyStyle.oddRowColor,
                height: item.bodyStyle.height + 'px',
                lineHeight: item.bodyStyle.height + 'px',
                color: item.bodyStyle.color,
                fontSize: item.bodyStyle.fontSize + 'pt',
                fontWeight: item.bodyStyle.fontWeight,
              }"
            >
              <span
                v-if="item.style.showIndex"
                class="title"
                :style="{
                  width: item.style.indexWidth + '%',
                  borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
                  borderStyle: item.style.isBorder ? item.style.borderStyle : '',
                  borderColor: item.style.isBorder ? item.style.borderColor : '',
                }"
                >{{ t + 1 }}</span
              >
              <span
                v-for="(column, i) in item.tableColumn"
                :key="i"
                class="title"
                :style="{
                  width: column.style.width + '%',
                  borderWidth: item.style.isBorder ? item.style.borderWidth + 'px' : '',
                  borderStyle: item.style.isBorder ? item.style.borderStyle : '',
                  borderColor: item.style.isBorder ? item.style.borderColor : '',
                }"
                >{{ d[column.key] }}</span
              >
            </li>
          </vue-seamless-scroll>
        </div>
      </div>
    </vue-draggable-resizable>
    <e-vue-contextmenu ref="ctxshow" id="contextStyle" @ctx-show="show" @ctx-hide="hide">
      <div @click="copyComponent">复制</div>
      <div @click="deleteComponent">删除</div>
      <!--<div>生成代码</div> -->
    </e-vue-contextmenu>
  </div>
</template>

<script>
import Vue from "vue";
import EVueContextmenu from "e-vue-contextmenu";
Vue.use(EVueContextmenu);
import MarqueeTips from "vue-marquee-tips";
import VueDraggableResizable from 'vue-draggable-resizable-gorkys'
// 可选择导入默认样式
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable);
export default {
  components: {
    MarqueeTips,
  },
  props: {
    components: {
      type: Array,
      default: () => [],
    },
    chartsComponents: {
      type: Object,
      default: () => ({}),
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    myclass: {
      type: String,
      default: "",
    },
    isView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonConstants: {
        componentsType: {
          panel: "panel", //画布
          text: "text", //文本
          picture: "picture", //图片
          histogram: "histogram", //柱状图
          lineChart: "lineChart", //折线图
          pieChart: "pieChart", //饼图
          gauge: "gauge", //仪表盘
          table: "table", //表格
          date: "date", //日期
          delete: "delete", //删除的组件
        },
      },
      activated: null,
      current: null,
    };
  },
  methods: {
    onActivated(index, item) {
      if (this.draggable && this.resizable) {
        if (this.current) {
          this.current.active = false;
          if (this.current.type == this.commonConstants.componentsType.picture) {
            this.current.zindex = 98;
          } else {
            this.current.zindex = 99;
          }
        }
        item.active = true;
        item.zindex = 100;
        this.current = item;
        this.$emit("update:activated", item);
        this.$emit("update:isBubblingEvent", true);
      }
    },
    onResizstop(left, top, width, height) {
      this.current.x = left;
      this.current.y = top;
      this.current.w = width;
      this.current.h = height;
      if (
        this.current.type == this.commonConstants.componentsType.histogram ||
        this.current.type == this.commonConstants.componentsType.lineChart ||
        this.current.type == this.commonConstants.componentsType.pieChart ||
        this.current.type == this.commonConstants.componentsType.gauge
      ) {
        this.chartsComponents[this.current.id].resize();
      }
      this.$emit("update:isBubblingEvent", true);
    },
    onDragstop(left, top) {
      this.current.x = left;
      this.current.y = top;
      this.$emit("update:isBubblingEvent", true);
    },
    hideMenu() {
      this.$refs.ctxshow.hideMenu(); // 隐藏菜单
    },
    show(item) {
      if (this.current) {
        this.current.active = false;
        if (this.current.type == this.commonConstants.componentsType.picture) {
          this.current.zindex = 98;
        } else {
          this.current.zindex = 99;
        }
      }
      item.active = true;
      item.zindex = 100;
      this.current = item;
      this.$emit("update:activated", item);
      this.$emit("update:isBubblingEvent", true);
    },
    hide(data) {},
    //删除组件
    deleteComponent() {
      this.current.type = this.commonConstants.componentsType.delete;
      this.current.active = false;
      this.current.zindex = "auto";
      this.hideMenu();
    },
    //复制组件
    copyComponent() {
      this.$parent.$parent.copyComponent(this.current);
      this.hideMenu();
    },
    //空方法，啥也不干
    emptyMethod() {},
  },
};
</script>
<style scoped lang="scss">
.handle,
.vdr {
  /* position:static !important; */
}
.box {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background-color: #fff;
}
#ctx-menu-content {
  background-color: #434b55;
  border: 1px solid #fff;
  color: #fff;
  padding: 0;
  > div {
    padding: 5px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
}
#contextStyle {
  background: rgba(0, 0, 0, 0.5);
  padding: 0;
  color: white;
}
#contextStyle > div {
  padding: 5px 8px;
}
#contextStyle > div:hover {
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}
img {
  width: 99.7%;
  height: 99.6%;
  max-width: 99.7%;
  max-height: 99.6%;
}
.warp-title {
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
  }
  li {
    //   height: 40px;
    //   line-height: 40px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //   font-size: 20px;
    //   color:#00FFFF;
    //   font-weight: bold;
  }
}

.warp-content {
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
  }
  li {
    //   height: 30px;
    //   line-height: 30px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    //   font-size: 15px;
    //   color:#ffffff
  }
}
.myclass {
  border: none;
}
.newclass {
  border: 1px solid #00ced1;
}
</style>
