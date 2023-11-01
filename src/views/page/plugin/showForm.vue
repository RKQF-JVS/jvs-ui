<template>
  <div style="padding: 0 10px;">
    <jvs-form class="show-form" v-if="type == 'normal'" :formData="formData" :option="option" @submit="submitHandle">
      <!-- 自定义按钮 -->
      <template slot="formButton" v-if="option.flag">
        <jvs-button size="mini" v-for="(item, index) in option.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
      </template>
    </jvs-form>
    <jvs-form-level v-if="type == 'level'" :option="option" @submit="submitHandle"></jvs-form-level>
    <jvs-form-step v-if="type == 'step'" :option="option" @submit="submitHandle"></jvs-form-step>
    <!-- 流程表单 -->
    <div v-if="type == 'flowable'">
      <h4>提交信息</h4>
      <jvs-form :option="basicOption" @submit="submitHandle">
        <!-- 自定义按钮 -->
        <template slot="formButton">
          <jvs-button size="mini" v-for="(item, index) in basicOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)">{{item.name}}</jvs-button>
        </template>
      </jvs-form>
      <h4>审核</h4>
      <jvs-form :option="formOption" @submit="submitHandle">
        <!-- 自定义按钮 -->
        <template slot="formButton">
          <jvs-button size="mini" v-for="(item, index) in formOption.btnSetting" :key="item.name+'slotbtn'+index" @click="slotbtnClickHandle(item, index)" v-show="item.enable">{{item.name}}</jvs-button>
        </template>
      </jvs-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'show-form',
  props: {
    type: {
      type: String,
      default: 'normal'
    },
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    flowableData: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  data () {
    return {
      basicOption: {
        disabled: true,
        btnHide: true,
        column: []
      },
      formOption: {
        cancal: false,
        submitBtn: false,
        emptyBtn: false,
        column: []
      }
    }
  },
  created () {
    if(this.flowableData) {
      if(this.flowableData.formsetting) {
        this.basicOption = JSON.parse(JSON.stringify(this.flowableData.formsetting))
        this.basicOption.column = []
        this.basicOption.disabled = true
        this.basicOption.btnHide = true

        this.formOption = JSON.parse(JSON.stringify(this.flowableData.formsetting))
        this.formOption.column = []
        this.formOption.submitBtn = false
        this.formOption.emptyBtn = false
        this.formOption.cancal = false
      }
      if(this.flowableData.basic) {
        this.basicOption.column = this.flowableData.basic
      }
      if(this.flowableData.form) {
        this.formOption.column = this.flowableData.form
      }
      console.log(this.basicOption)
      console.log(this.formOption)
    }
  },
  methods: {
    submitHandle (obj) {
      this.$emit('submit', obj)
      console.log(obj)
    },
    // 自定义按钮事件
    slotbtnClickHandle (row, index) {},
  }
}
</script>
<style lang="scss" scoped>
::v-deep.show-form{
  .el-form-item{
    padding: 0 20px;
  }
}
</style>
