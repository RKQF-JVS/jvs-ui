<template>
  <formDesign
    ref="formDesign"
    :formdata="formdata"
    :columnNameList="columnNameList"
    :fields="fields"
    :isDetail="isDetail"
    :isFlowable="isFlowable"
    :tableOption="tableOption"
    :flowableDom="flowableDom"
    :fineGrainedType="fineGrainedType"
    :masterTable="masterTable"
    :allTable="allTable"
    :selectDataSourceName="selectDataSourceName"
    :isFlowDesign="isFlowDesign"
    :formType="formType"
    @save="save"
    @flowChange="flowChange"
    @freshFormData="freshFormDataHandle"
  />
</template>
<script>
import formDesign from '../../plugin/design/formDesign'
export default {
  name: 'normalForm',
  components: { formDesign },
  props: {
    // 表单结构
    formdata: {
      type: Object
    },
    // 激活表单key
    activeName: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    isFlowable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否为列表页详情按钮
    isDetail: {
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
    },
    selectDataSourceName: {
      type: String
    },
    isFlowDesign: {
      type: Boolean
    },
    formType: {
      type: String
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
    freshFormDataHandle(bool) {
      this.$emit("freshFormData", bool)
    },
    handleClear() {
      this.$refs.formDesign.qingkong()
    },
    handleSetColumn(num) {
      this.$refs.formDesign.getColumnNum(num)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
