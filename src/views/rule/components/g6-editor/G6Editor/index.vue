<template>
  <div id="mountNode" :style="{width:width, height: '100%'}">
    <div class="editor" >
      <context-menu />
      <!--toolbar-->
      <toolbar v-show="false" @saveGraph="saveGraph" />
      <!-- <div style="height: 42px;"></div> -->
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel />
        <!--detailpannel-->
        <detail-panel />
        <!--miniMap-->
        <minimap v-show="false" />
        <!--page-->
        <page :height="height" :width="width"  :data="data" :needResize="needResize" />
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import Minimap from "../Minimap";
import Page from "../Page";
import Flow from "../Flow"
import ContextMenu from "../ContextMenu";
import Editor from "../Base/Editor";
import command from "../command";
export default {
  name: "G6Editor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.init();
  },
  data() {
    return {
      editor: {},
      command: null,
      needResize: -1,
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    },
    saveGraph (data) {
      this.$emit('saveGraph', data)
    },
    resize () {
      this.needResize = Math.random()
    }
  }
};
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
  height: 100%;
}
</style>
