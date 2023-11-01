<template>
  <detailDesign
    :formdata="formdata"
    :columnNameList="columnNameList"
    :fields="fields"
    :formType="formType"
    :tableOption="tableOption"
    :masterTable="masterTable"
    :allTable="allTable"
    @save="save"
  />
</template>
<script>
import detailDesign from '../../plugin/design/detailDesign'
export default {
  name: 'detailForm',
  components: { detailDesign },
  props: {
    // 表单结构
    formdata: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    formType: {
      type: String,
      default: () => {
        return "detailForm"
      }
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