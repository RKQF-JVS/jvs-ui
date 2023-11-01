<template>
  <div>
    <ul
      :class="{'el-scrollbar__view el-select-dropdown__list context-menu' : true, 'edit-node-name': showNodeName}"
      ref="contextMenu"
    >
      <li v-if="showNodeName" class="el-select-dropdown__item">
        <el-input size="mini" v-model="name" @blur="handleChangeName"  />
      </li>
      <li
        v-if="!showNodeName"
        class="el-select-dropdown__item"
        v-for="menu in menus"
        :key="menu.key"
        @click="handleClick(menu)"
      >
        {{ menu.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from "../../../utils/eventBus";
export default {
  data () {
    return {
      menus: [
        { key: 1, name: "删除" }
      ],
      showNodeName: false,
      name: '',
      node: null,
      graph: null
    };
  },
  created () {
    this.bindEvent();
  },
  methods: {
    init () { },
    bindEvent () {
      eventBus.$on("contextmenuClick", e => {
        let item = e.item._cfg.model
        const menu=this.$refs.contextMenu;
        if(e.item.hasState('selected') == false) {
          return;
        }
        if(menu && ['start', 'end'].indexOf(item.nodeType) == -1) {
          menu.style.left=e.clientX +"px";
          menu.style.top=e.clientY - 60 +"px";
          menu.style.display="block";
        }
        this.showNodeName = false
      });
      eventBus.$on("mousedown", () => {
        const menu=this.$refs.contextMenu;
        if (menu) {
          menu.style.display="none";
        }
      });
      eventBus.$on("nodeClick", (data) => {
        const menu=this.$refs.contextMenu;
        if(typeof data == 'boolean') {
          this.handleClick(null)
        }else{
          this.showNodeName = true
          let e = data.e
          this.graph = data.graph
          if(e && e.item && e.item._cfg) {
            let item = e.item._cfg.model
            if(menu && ['start', 'end'].indexOf(item.nodeType) == -1) {
              menu.style.left=item.x + 154 +"px";
              menu.style.top=item.y - 22  +"px";
              menu.style.display="block";
            }
            this.name = item.name
            this.node = JSON.parse(JSON.stringify(item))
          }
        }
      });
    },
    handleClick (item) {
      const menu=this.$refs.contextMenu;
      if (menu) {
        menu.style.display="none";
        if(item) {
          eventBus.$emit('deleteItem')
        }
      }
      this.showNodeName = false
      this.name = ''
    },
    handleChangeName () {
      const model = {
        label: this.name,
        name: this.name
      };
      // let nodeAll = this.graph.findAll('node', node => {
      //   return node.get('model')
      // })
      // let temp = []
      // nodeAll.filter( item => {
      //   temp.push(item._cfg.model.name)
      // })
      // let count = 0
      // for(let i in temp) {
      //   if(temp[i] == model.name) {
      //     count++
      //   }
      // }
      // if(count > 0 && this.name != this.node.name) {
      //   // 重复提示
      //   this.$message.warning("该名称已存在")
      //   return false
      // }else{
      //   if(model.name == '' || !model.name) {
      //     this.$message.warning("名称不能为空")
      //     return false
      //   }
      //   // 更新
      //   this.graph.update(this.node.id, model);
      //   this.graph.refresh()
      // }
      // 更新
      this.graph.update(this.node.id, model);
      this.graph.refresh()
      this.$forceUpdate()
    }
  }
};
</script>

<style lang="scss">
.context-menu {
  position: absolute;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  z-index: 1;
  display: none;
  height: 40px;
}

.context-menu li {
  cursor: pointer;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
}
.context-menu li:hover {
  background-color: #f5f7fa;
}
.context-menu.edit-node-name{
  padding: 0;  
  height: 32px;
  width: 130px;
  .el-select-dropdown__item{
    height: 32px;
    padding: 0;
    .el-input{
      .el-input__inner{
        height: 32px;
        border: 0;
        padding: 0 5px;
        background: #f5f7fa;
        border-radius: 0;
      }
    }
  }
}
</style>