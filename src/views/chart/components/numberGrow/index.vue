<template>
  <div class="number-grow-warp">
    <span ref="numberGrow" :data-time="time">{{ value }}</span>
  </div>
</template>

<script>
export default {
  props: {
    isShowClass: {
      type: Boolean,
      default: true
    },
    time: {
      type: Number,
      default: 2
    },
    value: {
      type: Number,
      default: 0
    }
  },

  methods: {
    numberGrow(el) {
      let that = this
      let step = Math.ceil((that.value * 10) / (that.time * 1000))
      let current = 0
      let start = 0
      let timer = setInterval(() => {
        start += step
        if (start > that.value) {
          clearInterval(timer)
          start = that.value
          timer = null
        }
        if (current === start) {
          return
        }
        current = start
        el.innerHTML = this.numberPutComma(current)
      }, 10)
    },
    numberPutComma(value) {
      if (value === 0) {
        return 0
      }
      if (Number(value)) {
        let intPartFormat = value
          .toString()
          .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      }
    }
  },
  mounted() {
    this.numberGrow(this.$refs.numberGrow)
  },
  watch: {
    value: {
      deep: true,
      handler(newVal, oldVal) {
        this.numberGrow(this.$refs.numberGrow)
      }
    }
  }
}
</script>

<style lang="scss">
.number-grow-warp {
  /*transform: translateZ(0);*/
  /*display: inline-block;*/
}
</style>
