<template>
  <el-collapse class="left-tool-list-box" v-model="activeNames" @change="handleChange">
    <el-collapse-item v-for="(tp, tx) in Funcs" :key="'tool-type-'+tp.value" :name="tp.value">
      <template slot="title">
        <div class="title">
          <b class="pannel-type-icon" :style="{backgroundImage:'url('+tp.icon+')'}"></b>
          <!-- :class="tp.icon" -->
          <span>{{tp.label}}</span>
        </div>
      </template>
      <ul class="left-tool-list">
        <li
          v-for="(item,index) in tp.children"
          :key="index"
          :class="{'getItem': true, 'disabled': !item.draggable}"
          :data-shape="item.shape"
          :data-type="item.type"
          :data-size="item.size"
          :draggable="item.draggable"
          @dragstart="handleDragstart"
          @dragend="handleDragEnd($event,item)"
        >
          <span class="pannel-type-icon" :style="{backgroundImage:'url('+item.icon+')'}"></span>
          {{item.functionName}}
        </li>
      </ul>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import eventBus from "../../../utils/eventBus";
import okSvg from "../assets/icons/ok.svg";
export default {
  computed : {
    // 可以选的方法
    Funcs () {
      let temp = JSON.parse(JSON.stringify(this.$store.getters.Funcs))
      let dictData = JSON.parse(JSON.stringify(this.$store.getters.FuncGroup))
      let list = []
      for(let i in temp) {
        let obj = {
          label: this.getLabel(i, dictData, 'msg'),
          value: i,
          children: temp[i],
          icon: this.getLabel(i, dictData, 'url')
        }
        switch (i) {
          case 'common':
            // obj.icon = 'el-icon-star-off';
            obj.children.push({
              functionName: "结束",
              label: "结束",
              size: "170*34",
              type: "node",
              nodeType: 'end',
              x: 0,
              y: 0,
              shape: "customNode",
              color: "#1890ff",
              icon: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
              inPoints: [[0, 0.5]],
              outPoints: [[1, 0.5]],
              isDoingEnd: true,
              nodeType: 'end'
            })
            break;
          // case 'tools': obj.label = '工具'; obj.icon = 'el-icon-attract';break;
          // case 'data': obj.label = '数据'; obj.icon = 'el-icon-tickets';break;
          // case 'business': obj.label = '业务系统'; obj.icon = 'el-icon-aim'; break;
          default: ;break;
        }
        for(let j in obj.children) {
          obj.children[j].label = obj.children[j].functionName
          obj.children[j].name = obj.children[j].functionName
          obj.children[j].image = obj.children[j].icon || 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg'
          obj.children[j].size = "170*34"
          obj.children[j].type = "node"
          obj.children[j].shape = "customNode"
          obj.children[j].color = "#1890ff"
          obj.children[j].stateImage = okSvg
          obj.children[j].inPoints = [[0, 0.5]]
          obj.children[j].outPoints = [[1, 0.5]]
          obj.children[j].x = 0
          obj.children[j].y = 0
          // 是否禁用
          obj.children[j].draggable = obj.children[j].status ? true : false
          if(obj.children[j].functionName == '开始') {
            obj.children[j].nodeType = 'start'
            obj.children[j].draggable = true
          }
          if(obj.children[j].functionName == '结束') {
            obj.children[j].nodeType = 'end'
            obj.children[j].draggable = true
          }
        }
        list.push(obj)
      }
      return list
    },
  },
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      list: [],
      activeNames: ['common']
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    handleDragstart(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    handleDragEnd(e, item) {
      const graph = this.page.graph;
      const xy = graph.getPointByClient(e.x, e.y);
      let data = {};
      Object.assign(data, item);
      data.offsetX = this.offsetX;
      data.offsetY = this.offsetY;
      // // 重名校验
      // let nodeAll = graph.findAll('node', node => {
      //   return node.get('model')
      // })
      // let temp = []
      // nodeAll.filter( item => {
      //   temp.push(item._cfg.model.name)
      // })
      // let count = 0
      // for(let i in temp) {
      //   if(temp[i] == data.name) {
      //     count++
      //   }
      // }
      // if(count > 0 && data.name != "结束") {
      //   // 重复提示
      //   this.$message.warning("该名称已存在")
      //   return false
      // }else{
      //   if (this.page) {
      //     data.x = xy.x;
      //     data.y = xy.y;
      //     data.size = item.size.split("*");
      //     data.type = "node";
      //     this.command.executeCommand("add", [data]);
      //   }
      //   graph.refresh()
      // }
      if (this.page) {
        data.x = xy.x;
        data.y = xy.y;
        data.size = item.size.split("*");
        data.type = "node";
        this.command.executeCommand("add", [data]);
      }
      graph.refresh()
      this.$forceUpdate()
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
        this.command = page.command;
      });
    },
    handleChange () {},
    getLabel (value, list, attr) {
      let temp = value
      for(let i in list) {
        if(list[i].name == value) {
          temp = list[i][attr]
        }
      }
      return temp
    }
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
}
.itempannel ul {
  padding: 0px;
}
.itempannel li {
  display: flex;
  align-items: center;
  color: #333333;
  width: 100%;
  height: 30px;
  /*line-height: 30px;*/
  list-style-type: none;
  margin-bottom: 20px;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 12px;
}
.itempannel li:not(.disabled):hover {
  cursor: move;
  background: #EEEEEE;
  color: #3471FF;
}

.itempannel li.disabled {
  cursor: no-drop;
  background: #EEEEEE;
  color: #b3b3b3;
}

.itempannel .pannel-type-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.left-tool-list{
  width: 200px;
  margin: 0;
}
</style>
<style lang="scss">
.left-tool-list-box{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  .el-collapse-item__header{
    height: 42px;
    line-height: 42px;
    position: relative;
    padding: 0 10px;
    .title{
      display: flex;
      align-items: center;
      b{
        font-size: 18px;
        font-weight: 600;
        color: #848484;
        margin-right: 10px;
      }
    }
    i{
      position: absolute;
      right: 0;
      top: 17px;
    }
  }
  .el-collapse-item__content{
    padding: 10px 0;
  }
}
</style>
