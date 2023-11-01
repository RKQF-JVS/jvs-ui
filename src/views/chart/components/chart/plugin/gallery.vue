<template>
  <div v-if="shape === 'DataCard' || shape === 'InfoCard'" :class="isPreview ? 'card cardPreview' : 'card'">
    <img :src="setting.back" class="back-img"/>
    <cardItem
    :shape="shape"
    :width="cWidth"
    :height="cHeight"
    :setting="setting"
    :cardTitle="cardTitle"
    :cardContent="cardContent"
    :isPreview="isPreview"
    />
  </div>
  <div v-else :class="isPreview ? 'gallery preview' : 'gallery'" :style="'background:'+setting.back">
    <p v-if="!isPreview" class="titleClass" id="chartTitle" :style="{fontSize : setting.titleSize+'px',fontWeight: setting.titleWeight*100}">{{setting.name}}</p>
    <div v-else class="cardTitle">{{ setting.name }}</div>
    <itemGallery
      style="padding: 0 15px"
      :shape="shape"
      :width="cWidth"
      :height="cHeight"
      :style="'background:'+setting.back"
      :setting="setting"
      :tableData="tableData"
      :column="column"
    />
  </div>
</template>
<script>
import itemGallery from '../gallery/index'
import cardItem from '../card/index'
export default {
  name: 'gallery',
  components: {itemGallery, cardItem},
  props: {
    isPreview: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    shape: {
      type: String
    },
    cardTitle: {
      type: String
    },
    cardContent: {
      type: String
    },
    w: {
      type: Number,
      default: () => {
        return 12
      }
    },
    h: {
      type: Number,
      default: () => {
        return 12
      }
    },
    width: {type: Number},
    height: {type: Number},
    tableData: {
      type: Array,
    },
    column: {
      type: Array,
    },
    setting: {
      type: Object,
    },
  },
  data () {
    return {
      cWidth: this.width,
      cHeight: this.height
    }
  },
  watch: {
    width: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.cWidth = newVal
        this.$forceUpdate()
      }
    },
    height: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.cHeight = newVal - 20
        this.$forceUpdate()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  position: relative;
  height: 100%;
  .back-img{
    border-radius: 6px;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
  }
}
.gallery{
  border-radius: 6px;
  padding: 15px 0;
  .titleClass{
    text-align: center;
    margin: 0;
  }
  .cardTitle{
    font-size: 14px;
    padding: 0 20px;
    height: 35px;
    margin-bottom: 15px;
    border-bottom: #ebeef5 1px solid;
  }
}
.preview{
  height: calc(100% - 30px);
  transition: 0.3s;
  &:hover{
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }
}
.cardPreview{
  transition: 0.3s;
  &:hover{
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }
}
</style>
