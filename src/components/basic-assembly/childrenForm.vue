<template>
  <div class="children-form">
    <jvs-form
      :ref="formItem.prop + 'ChildrenForm'"
      :refs="formItem.prop + 'ChildrenForm'"
      :option="childrenOption"
      :formData="formData"
    >
      <!-- 关联表单主key选择 -->
      <template :slot="formItem.prop+'Form'">
        <el-select
          style="width:100%;"
          v-if='formItem.type==="connectForm"'
          v-model="forms[formItem.props.label]"
          :placeholder="formItem.placeholder || formItem.label"
          :multiple="formItem.multiple"
          :collapse-tags="!formItem.collapsetags"
          :disabled="formItem.disabled"
          :clearable="formItem.clearable === false ? false : true"
          :filterable="formItem.filterable"
          :allow-create="false"
          :size="$store.state.params.form.size || formItem.size || 'mini'"
          @change="formChange"
        >
          <el-option
            v-for="(sitem) in selectOption"
            :key="formItem.prop+'-'+sitem['id']"
            :label="sitem[(formItem.props && formItem.props.label) || 'label']"
            :value="sitem[(formItem.props && formItem.props.value) || 'id']"
          >
            <span style="float: left">{{ sitem[(formItem.props && formItem.props.label) || 'label'] }}</span>
            <span v-if="sitem.tip" style="float: right; color: #8492a6; font-size: 13px">{{ sitem.tip }}</span>
          </el-option>
        </el-select>
      </template>
    </jvs-form>
  </div>
</template>
<script>
export default {
  props: {
    // 表单传递对象
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    originOption: {
      type: Object
    },
    // 表单结构对象
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetRadom: {
      type: Number
    },
    selectOption: {
      type: Array
    }
  },
  computed: {
    formData: {
      get () {
        return this.forms
      },
      set () { }
    }
  },
  data () {
    return {
      childrenOption: {
        btnHide: true,
        column: []
      }
    }
  },
  methods: {
    formChange () {
      for(let i in this.selectOption) {
        if(this.selectOption[i].id == this.forms[this.formItem.props.label]) {
          for(let k in this.selectOption[i]) {
            this.$set(this.forms, k, this.selectOption[i][k])
          }
        }
      }
      this.$emit('formChange', true)
    },
    getDesign () {
    }
  },
  created () {
    if (this.originOption) {
      this.childrenOption.labelposition=this.originOption.labelposition
      this.childrenOption.labelwidth=this.originOption.labelwidth
      this.childrenOption.formAlign=this.originOption.formAlign
      this.childrenOption.disabled=this.formItem.disabled
    }
    if(this.formItem.childrenOptionColumn && this.formItem.childrenOptionColumn.length > 0) {
      this.childrenOption.column = this.formItem.childrenOptionColumn
    }else{
      // this.getDesign()
    }
  },
  watch: {
    resetRadom: {
      handler (newVal, oldVal) {
        if (newVal>-1) {
          if (this.$refs[this.formItem.prop+'ChildrenForm']) {
            this.$refs[this.formItem.prop+'ChildrenForm'].resetForm(this.formItem.prop+'ChildrenForm')
          }
        }
      }
    },
    formItem: {
      handler (newVal, oldVal) {
        if(newVal.type == 'connectForm') {
          if(this.formItem.connectFormColumn) {
            // this.getDesign()
            this.$forceUpdate()
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
.children-form {
  width: 100%;
  .jvs-form {
    .el-form-item {
      padding: 0;
      .jvs-form-item{
        .el-select{
          .el-input{
            .el-input__inner{
              height: 28px!important;
            }
          }
        }
      }
    }
  }
}
</style>
