<template>
  <div v-if="isPreview" class="card-box">
    <div
      class="card-title"
      :style="'font-size:' + setting.titleSize + 'px;' + 'color:' + setting.titleColor + `;font-weight: ${setting.titleWeight*100}`"
    >{{ setting.cardTitle }}</div>
    <div
      v-if="shape === 'InfoCard'"
      class="card-content"
      :style="'font-size:' + setting.contentSize + 'px;' + 'color:' + setting.contentColor + `;font-weight: ${setting.contentWeight*100}`"
    >
      {{ setting.cardContent ? setting.cardContent : cardContent }}
    </div>
    <div
      v-else
      class="card-content"
      :style="'font-size:' + setting.contentSize + 'px;' + 'color:' + setting.contentColor + `;font-weight: ${setting.contentWeight*100}`"
    >
      <NumberGrow :value="getNumber(setting.cardContent)"></NumberGrow>
    </div>
  </div>
  <div v-else class="card-box">
    <div
      class="card-title"
      :style="'font-size:' + setting.titleSize + 'px;' + 'color:' + setting.titleColor + `;font-weight: ${setting.titleWeight*100}`"
    >{{ setting.cardTitle }}</div>
    <div
      class="card-content"
      :style="'font-size:' + setting.contentSize + 'px;' + 'color:' + setting.contentColor + `;font-weight: ${setting.contentWeight*100}`"
    >{{ setting.cardContent ? setting.cardContent : cardContent }}
    </div>
  </div>
</template>

<script>
import NumberGrow from '../../numberGrow/index'
export default {
  name: "index",
  components: {NumberGrow},
  props: {
    shape: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number,
    },
    cardContent: {
      type: String,
    },
    cardTitle: {
      type: String,
    },
    setting: {
      type: Object,
    },
    isPreview: {
      type: Boolean,
    },
  },
  computed: {
    data () {
      return this.getData(this.setting, this.cardTitle, this.cardContent)
    },
  },
  watch: {
    width: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.width = newVal
        this.init(this.data, newVal, this.height)
        this.$forceUpdate()
      }
    },
    height: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.height = newVal
        this.init(this.data, this.width, newVal)
        this.$forceUpdate()
      }
    },
    setting: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        // this.setting = newVal
        this.init(this.data, this.width, this.height)
        this.$forceUpdate()
      }
    },
    cardContent: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.cardContent = newVal
        this.init(this.data, this.width, this.height)
        this.$forceUpdate()
      }
    },
    cardTitle: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.cardTitle = newVal
        this.init(this.data, this.width, this.height)
        this.$forceUpdate()
      }
    },
  },
  data() {
    return {
      cardTitleText: '',
      cardContentText: '',
      settingTemp: {}
    }
  },
  created() {
    // this.getData(this.setting, this.cardTitle, this.cardContent)
  },
  methods: {
    getNumber(value) {
      const str = value ? this.setting.cardContent : this.cardContent
      return Number(str.replace(/[^0-9]/ig,''))
    },
    getData(setting, cardTitle, cardContent) {
      this.settingTemp = setting
      this.cardTitleText = cardTitle
      this.cardContentText = cardContent
      // if (setting.type === 'info') {
      //   setting.titleColor = '#fff'
      //   setting.contentColor = '#fff'
      //   setting.contentSize = 12
      //   setting.titleSize = 20
      //   setting.titleWeight = 10
      //   setting.contentWeight = 5
      //   cardTitle = '风控系统'
      //   cardContent = '最适合自己的电商小程序'
      //   this.settingTemp = setting
      //   this.cardTitleText = cardTitle
      //   this.cardContentText = cardContent
      // }
      // const { settingTemp, cardContentText, cardTitleText } = this
      // return { settingTemp, cardContentText, cardTitleText }
    },
    init(obj) {
      // console.log(obj)
    }
  }
}
</script>

<style lang="scss">
.card-box {
  overflow: hidden;
  height: 100%;
  .card-title {
    padding: 15px;
  }
  .card-content{
    padding: 0 15px 15px;
  }
}
</style>
