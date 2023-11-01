<template>
  <div class="flow-info-list">
    <div>
      <el-input size="mini" placeholder="请输入流程表达式" v-model="express" class="input-with-select" @blur="saveHandle">
        <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
      </el-input>
    </div>
    <el-dialog
      title="选择常用流程表达式"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <jvs-table :option="option" :data="tableData" @row-click="rowClick"></jvs-table>
      <el-row style="margin-top:20px;display:flex;justify-content:center;">
        <jvs-button size="mini" type="primary" @click="submitHandle">确定</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'flow-info-list',
  props: {
    defaultValue: {
      type: String
    }
  },
  data(){
    return {
      express: '',
      dialogVisible: false,
      tableData: [
        {name: '同意', express: '${agree}', remark: ''},
        {name: '不同意', express: '${disagree}', remark: ''},
        {name: '强制结束', express: '${end}', remark: ''}
      ],
      option: {
        addBtn: false,
        menu: false,
        highlightCurrentRow: true,
        cancal: false,
        column: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '表达式',
            prop: 'express'
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      },
      rowData: {}
    }
  },
  created (){
    if(this.defaultValue) {
      this.express = this.defaultValue
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    },
    rowClick (data) {
      this.rowData = data.row
    },
    submitHandle () {
      this.express = this.rowData.express
      this.handleClose()
    },
    saveHandle () {
      this.$emit('save', this.express)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>