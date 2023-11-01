<template>
  <div class="iframe-info">
    <el-row style="margin-top: 20px">
      <span>页面地址：</span>
      <el-select
        size="mini"
        v-model="iframePage[0].address"
        placeholder="请选择"
        filterable
        allow-create
        :clearable="true"
      >
        <el-option
          v-for="item in iframepageOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-row>
    <el-row style="margin-top: 20px">
      <span>展示位置：</span>
      <el-radio v-model="iframePage[0].position" size="mini" label="top">顶部</el-radio>
      <el-radio v-model="iframePage[0].position" size="mini" label="bottom">底部</el-radio>
    </el-row>
    <el-row style="margin-top: 20px; display: flex; align-items: center">
      <span>高度：</span>
      <div style="flex: 1">
        <!-- <div style="display: flex; align-items: center">
          <span class="demonstration">宽</span>
          <el-slider
            v-model="iframepage.width"
            show-input
            :min="0"
            :max="100"
            style="flex: 1; margin-left: 20px"
          ></el-slider>
        </div> -->
        <div style="display: flex; align-items: center">
          <!-- <span class="demonstration">高</span> -->
          <el-slider
            v-model="iframePage[0].height"
            show-input
            :min="0"
            :max="100"
            size="mini"
            style="flex: 1; margin-left: 20px"
          ></el-slider>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'iframe-info',
  props: {
    iframePage: {
      type: Array
    }
  },
  data () {
    return {
      // 引入页面来源
      iframepageOption: [],
    }
  }
}
</script>
<style lang="scss" scoped>
</style>