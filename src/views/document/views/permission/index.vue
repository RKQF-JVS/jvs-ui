<template>
  <div class="permission-introduce">
    <jvs-button class="nav-button" size="mini" type="text" @click="goHome">文档说明</jvs-button>
    <h1>权限控制使用说明</h1>
    <h4>1. 添加或修改权限标识：</h4>
    <h5>系统管理-->系统管理-->资源管理</h5>
    <img :src="step1Img" alt="">
    <h4>2. 复制权限标识</h4>
    <img :src="step2Img" alt="">
    <h4>3. 权限控制</h4>
    <div>
      <div>
        <h5>dom使用：v-if="$permissionMatch(权限标识)"</h5>
        <h5>js使用：this.$permissionMatch(权限标识)</h5>
        <h5>组件配置：permisionFlag属性，支持button和tab</h5>
        <h5 style="margin-bottom: 10px;">配置js文件：</h5>
        <h5 style="margin: 0;">import Vue from "vue"</h5>
        <h5 style="margin: 0;">Vue.prototype.$permissionMatch("权限标识")</h5>
      </div>
    </div>
    <h4>4. 示例：</h4>
    <div class="show-code">
      <h5>按钮</h5>
      <codeArea lang="html" :needHide="false" :content='`
        <jvs-button :permisionFlag="权限标识"></jvs-button>
      `'>
      </codeArea>
    </div>
    <div class="show-code">
      <h5>tab项</h5>
      <codeArea lang="html" :needHide="false" :content='`
        <jvs-tab :option="option"></jvs-tab>

        option: {
          column: [
            {
              label: "选项卡一",
              name: "first",
              permisionFlag: "权限标识1"
            },
            {
              label: "选项卡二",
              name: "second",
              permisionFlag: "权限标识2"
            },
          ]
        }
      `'>
      </codeArea>
    </div>
    <div class="show-code">
      <h5>表格内置按钮，表单同理(submitBtn/emptyBtn/cancal)</h5>
      <codeArea lang="js" :needHide="false" :content='`
        赋值对应按钮的显隐属性：新增(addBtn)、编辑(editBtn)、查看(viewBtn)、删除(delBtn)
        <jvs-table :option="option"></jvs-table>
        option: {
          addBtn: true,
          editBtn: true,
          viewBtn: true,
          delBtn: true,
          column: []
        }
        let bool = this.$permissionMatch(权限标识)
        option.addBtn = bool
        option.editBtn = bool
        ...
      `'>
      </codeArea>
    </div>
    <div class="show-code">
      <h5>配置为单独的js文件</h5>
      <codeArea lang="js" :needHide="false" :content='`
        import Vue from "vue"
        export const option = {
          addBtn: Vue.prototype.$permissionMatch("权限标识1"),
          editBtn: Vue.prototype.$permissionMatch("权限标识2"),
          viewBtn: Vue.prototype.$permissionMatch("权限标识3"),
          delBtn: Vue.prototype.$permissionMatch("权限标识4"),
          column: []
        }
      `'>
      </codeArea>
    </div>
  </div>
</template>
<script>
import step1 from './img/step1.png'
import step2 from './img/step2.png'
export default {
  data() {
    return {
      step1Img: step1,
      step2Img: step2
    }
  },
  methods: {
    goHome () {
      this.$router.push({path: '/doc/index'})
    }
  },
}
</script>
<style lang="scss" scoped>
.permission-introduce{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 20px;
  h1{
    text-align: center;
  }
  img{
    display: block;
    width: 100%;
  }
  .show-code{
    h5{
      margin: 0;
    }
  }
}
.nav-button{
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>