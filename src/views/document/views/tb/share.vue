<template>
  <div>
    <div class="list">
      <p @click="open('https://thoughts.teambition.com/share/605d4d6b85c2c10046588d3c#title=jvs-ui_低代码系列开发说明')">低代码系列开发说明</p>
      <p @click="open('https://thoughts.teambition.com/share/605d50511c136f0046be5364#title=jvs-children-ui')">jvs-children-ui</p>
      <p @click="open('https://thoughts.teambition.com/share/605d507c0fd5e00046ee4302#title=前端常用操作及bug')">前端常用操作及bug</p>
    </div>
    <iframe v-if="src" :src="src" frameborder="0" width="100%" height="1000"></iframe>
  </div>
</template>
<script>
export default {
  data(){
    return {
      src: ''
    }
  },
  methods: {
    open (src) {
      this.src = src
    }
  }
}
</script>
<style lang="scss" scoped>
.list{
  display: flex;
  justify-content: center;
  p{
    margin: 0 10px;
    cursor: pointer;
  }
}
</style>