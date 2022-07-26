<template>
  <div class="pass-manage">
    <jvs-form :option="formOption"></jvs-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formOption: {
        column: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>