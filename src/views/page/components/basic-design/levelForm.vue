<template>
  <levelDesign
    type="level"
    :formdata="formdata"
    :column="column"
    :fields="fields"
    :isFlowable="isFlowable"
    :tableOption="tableOption"
    :flowableDom="flowableDom"
    :fineGrainedType="fineGrainedType"
    :masterTable="masterTable"
    :allTable="allTable"
    @save="save"
    @flowChange="flowChange"
  />
</template>
<script>
import levelDesign from '../../plugin/design/levelDesign'
export default {
  name: 'levelForm',
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
    column: {
      type: Array
    },
    isFlowable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    flowableDom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fineGrainedType: {
      type: String
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
    },
    // 修改flowable设置
    flowChange (data) {
      this.$emit('flowChange', data)
    },
  }
}
</script>
<style lang="scss" scoped>
</style>