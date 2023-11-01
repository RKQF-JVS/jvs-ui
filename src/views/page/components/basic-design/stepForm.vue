<template>
  <levelDesign type="step" :formdata="formdata" :fields="fields" :tableOption="tableOption" @save="save" :masterTable="masterTable" :allTable="allTable" />
</template>
<script>
import levelDesign from '../../plugin/design/levelDesign'
export default {
  name: 'stepForm',
  components: { levelDesign },
  props: {
    formdata: {
      type: Array
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableOption: {
      type: Array
    },
    masterTable: {
      type: String
    },
    allTable: {
      type: Array
    }
  },
  data () {
    return {}
  },
  methods: {
    save (data) {
      this.$emit('save', data)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>