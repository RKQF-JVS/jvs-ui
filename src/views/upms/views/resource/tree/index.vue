<template>
    <el-tree
      :data="treeData"
      node-key="id"
      :expand-on-click-node="false"
      :props="treeProps"
      default-expand-all
      style="height:100%;"
      @node-click="cancelMore"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <!-- @click="serarchTreeItem(data)" -->
        <span :class="'custom-tree-node-left node-left-level'+data.level" >
            <svg v-if="isSvg(data.extend.icon)" class="icon" aria-hidden="true" style="margin-left:10px;width: 20px;height: 20px;">
              <use :xlink:href="'#'+data.extend.icon"></use>
            </svg>
          <i v-else :class="data.extend.icon"></i>
          <span>{{data.name}}</span>
        </span>
<!--        <span class="custom-tree-node-right" v-if="['menu', 'page', 'chart', 'form'].indexOf(data.type ) > -1">-->
        <span class="custom-tree-node-right">
          <el-popover
            popper-class="hover-popver-list"
            placement="right"
            width="50"
            v-model="data.moretool"
            trigger="click">
            <ul class="base-type-list">
              <li v-if="$permissionMatch('upms_menu_add') && data.extend.layer < 3" @click="addTree(data)">
                <!-- <i class="el-icon-circle-plus-outline iconhover"></i> -->
                <span>添加下级菜单</span>
              </li>
              <li v-if="$permissionMatch('upms_resource_edit')" @click="editResourceExplain(data, 'resource')">
                <!-- <i class="el-icon-circle-plus-outline iconhover"></i> -->
                <span>编辑资源</span>
              </li>
              <li v-if="$permissionMatch('upms_explain_edit')" @click="editResourceExplain(data, 'expalin')">
                <!-- <i class="el-icon-circle-plus-outline iconhover"></i> -->
                <span>编辑解释</span>
              </li>
              <li v-if="$permissionMatch('upms_menu_edit')"  @click="editTree(data)">
                <!-- <i class="el-icon-setting iconhover"></i> -->
                <span>编辑菜单</span>
              </li>
              <li v-if="$permissionMatch('upms_menu_delete') && (!data.children || data.children.length == 0)" @click="deleteTree(data)">
                <!-- <i class="el-icon-delete iconhover"></i> -->
                <span>删除菜单</span>
              </li>
            </ul>
            <i slot="reference" class="el-icon-more iconhover" @click.stop="moreClick(data)"></i>
          </el-popover>
        </span>
      </span>
    </el-tree>
</template>
<script>
export default {
  name: "resource-tree",
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      treeProps: {
        label: 'name',
        children: 'children'
      },
      lastNode: null
    }
  },
  filters: {},
  created () { },
  mounted () { },
  computed: {
    data(){
      let arr = []
      this.treeData.map(item => {
        let obj = {
          ...item,
          children: item.children
        }
        arr.push(obj)
      })
      console.log(arr)
      return arr
    }
  },
  methods: {
    isSvg(item) {
      return item.indexOf("icon-") === -1
    },
    editTree (item) {
      item.moretool = false
      this.$emit('editTree', item)
    },
    deleteTree (item) {
      item.moretool = false
      this.$emit('deleteTree', item)
    },
    serarchTreeItem (item) {
      this.$emit('serarchTreeItem', item)
    },
    addTree (item) {
      item.moretool = false
      this.$emit('addTree', item)
    },
    moreClick (item) {
      if(this.lastNode) {
        this.lastNode.moretool = false
      }
      this.lastNode = item
    },
    cancelMore () {
      if(this.lastNode) {
        this.lastNode.moretool = false
      }
    },
    editResourceExplain (item, type) {
      item.moretool = false
      this.$emit('editResourceExplain', {data: item, type: type})
    },
  }
};
</script>

<style lang="scss" scoped>
.base-type-list{
  padding: 0;
  margin: 0;
  li{
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px 10px;
    i{
      margin-right: 10px;
      font-size: 14px!important;
    }
  }
  li:hover{
    background: #F5F7FA;
  }
  li:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.el-tree-node__content>.el-tree-node__expand-icon {
  height: 16px;
  width: 16px;
}
.rescurce-tree{
  .custom-tree-node {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    overflow: hidden;
    .custom-tree-node-left{
      width: calc(100% - 34px);
      span{
        flex: 1;
      }
      .item-text{
        max-width: 100px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
      }
    }
    .node-left-level1, .node-left-level2, .node-left-level3{
      span{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
    span{
      display: flex;
      align-items: center;
      i{
        font-size: 14px!important;
      }
      span{
        margin-left: 10px;
      }
    }
    .custom-tree-node-right{
      display: none;
      margin-right: 5px;
    }
  }
  .custom-tree-node:hover {
    .custom-tree-node-right{
      display: block;
    }
  }
  .iconhover{
    &:hover{
      // color: #409EFF;
    }
  }
}

</style>
