<template>
  <div class="page page-design-conbox">
    <div :id="pageId" class="graph-container" style="position: relative;height:100%;"></div>
  </div>
</template>


<script>
// import G6 from "@antv/g6/build/g6";
import G6 from "@antv/g6";
import { initBehavors } from "../behavior";
export default {
  name: "g6DesignPage",
  data() {
    return {
      pageId: "graph-container",
      graph: null
    };
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    },
    needResize: {
      type: Number,
    }
  },
  created() {
    initBehavors();
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
    let _this = this
    window.onresize = function () { // 定义窗口大小变更通知事件
      if($(".page-design-conbox")) {
        let w = $(".page-design-conbox").width()
        let h = $(".page-design-conbox").height()
        if(w && h) {
          _this.graph.changeSize(w, h)
        }
      }
    }
  },
  methods: {
    init() {
      document.getElementById("graph-container").oncontextmenu = function(e){
        return false;
      }
      const height = document.getElementsByClassName("page-design-conbox")[0].clientHeight // this.height - 42
      const width = document.getElementsByClassName("page-design-conbox")[0].clientWidth // this.width - 400

      this.graph = new G6.Graph({
        container: "graph-container",
        height: height,
        width: width,
        modes: {
          // 支持的 behavior
          default: [
            "drag-canvas",
            // "zoom-canvas",
            "hover-node",
            "select-node",
            "hover-edge",
            "keyboard",
            "customer-events",
            "add-menu"
          ],
          mulitSelect: ["mulit-select"],
          addEdge: ["add-edge"],
          moveNode:[ "drag-item"]
        }
      });
      const { editor, command } = this.$parent;
      editor.emit("afterAddPage", { graph: this.graph, command });
      this.readData();
    },
    readData() {
      let data = this.data;
      if (data) {
        this.graph.read(data);
      }
    },
    resize () {
      let _this = this
      if($(".page-design-conbox")) {
        let w = $(".page-design-conbox").width()
        let h = $(".page-design-conbox").height()
        if(w && h) {
          _this.graph.changeSize(w, h)
        }
      }
    }
  },
  watch: {
    needResize: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.resize()
        }
      }
    }
  }
};
</script>

<style scoped>
.page{
  margin-left:200px;
  /* margin-right: 200px; */
}
.page-design-conbox{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>