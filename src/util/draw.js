/**
 * wyQAQ
 * 1396871452@qq.com
 */
import Vue from 'vue'
import canvas from '@/components/iframe/console.vue'
const canvasBox = Vue.extend(canvas)
canvas.install = function (data) {
  let instance = new canvasBox(data)
  instance.$store = this.$root.$store
  instance.$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.init(data)
  })
}

export default canvas