<template>
  <div class="use-info">
    <h3>权限校验使用说明  $permissionMatch("")    
      <jvs-button type="text" @click="goPermission">详细说明</jvs-button>
    </h3>
    <div>
      <p>dom使用：v-if="$permissionMatch('')"</p>
      <p>js使用：this.$permissionMatch("")</p>
      <p>组件配置: permisionFlag属性，支持button和tab</p>
      <p>配置js:</p>
      <p>import Vue from "vue"</p>
      <p>Vue.prototype.$permissionMatch("")</p>
    </div>
    <h3>过滤器</h3>
    <div>
      <p>src/fileters/index.js</p>
      <p>支持：日期格式化(dateFormat)、字典格式化(dicFormat)</p>
      <p>使用：字段 | 过滤器名称(第二个参数)</p>
    </div>
    <h3>格式校验</h3>
    <div>
      <p>src/util/validate.js, 使用如下:</p>
      <p>important * as validate from '@/util/validate'</p>
      <p>valite.方法名</p>
    </div>
    <h3>打开链接</h3>
    <div>
      <p>$openUrl("地址", type) // type：'_self', '_blank'</p>
    </div>
    <h3>iframe挂载的设计类菜单</h3>
    <div v-highlight>
      <pre>
        <code class="js" v-html="`
          watch: {
            $route (to, from) {
              // 比较to和from的参数，以fullPath举例
              if(to.fullPath != from.fullPath) {
                // 初始化方法
                }
            }
          }
        `">
        </code>
      </pre>
    </div>
  </div>
</template>
<script>
export default {
  name: "useInfo",
  data() {
    return {}
  },
  methods: {
    goPermission () {
      this.$router.push({path: '/doc/permission'})
    }
  },
}
</script>
<style lang="scss" scoped>

</style>