<template>
  <processDesign
    :columnNameList="columnNameList"
    :formdata="formdata"
    :column="column"
    :fields="fields"
    :tableOption="tableOption"
    :masterTable="masterTable"
    :allTable="allTable"
    @save="save"
  />
</template>
<script>
import processDesign from '../../plugin/design/processDesign'
export default {
  name: 'levelForm',
  components: { processDesign },
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
    column: {
      type: Array
    },
    columnNameList: {
      type: Array
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