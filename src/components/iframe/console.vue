<template>
  <canvas :id="id" style="display:none;"></canvas>
</template>
<script>
/**
 * wyQAQ
 * 1396871452@qq.com
 */
import { drawImage } from '@/page/main/index/draw'
export default {
  data () {
    return {
      id: 'canvas'
    }
  },
  methods: {
    init (url) {
      this.id = 'canvas' + new Date().getTime()
      let _this = this
      window.onload = function() {
        drawImage({id: _this.id, url: url})
      }
    }
  }
}
</script>