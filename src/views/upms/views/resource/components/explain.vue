<template>
  <div class="explain-box">
    <el-dialog
      class="explain-dialog"
      title="解释管理"
      width="70%"
      :visible.sync="explainVisible"
      :before-close="handleClose">
      <jvs-table :option="option" :data="tableData">
        <template slot="headerTop">
          <el-button size="mini" style="margin-top: 16px" @click="handleAdd">新增一行</el-button>
        </template>
        <template slot="permission" scope="scope">
          <el-input size="mini" v-model="scope.row.permission"></el-input>
        </template>
        <template slot="name" scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
        <template slot="menu" scope="scope">
          <el-button size="mini" type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </jvs-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getResourceList, updateResource} from '../../../api/resource/index'
export default {
  name: "explain",
  props: {
    explainVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    menuId: {
      type: String,
      default: () => {
        return ''
      }
    },
    applyId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      option: {
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        showOverflow: false,
        column: [
          {
            label: "解释标识",
            prop: "permission",
            slot: true
          },
          {
            label: "中文解释",
            prop: "name",
            slot: true
          }
        ]
      },
      tableData: []
    }
  },
  watch: {
  },
  methods: {
    // 获取解释列表
    getExplainList(menuId) {
      this.tableData = []
      this.loading = true
      getResourceList(menuId).then(res => {
        if (res.data && res.data.code == 0) {
          this.tableData = [...res.data.data]
          this.loading = false
        } else {
          this.loading = false
        }
      }).catch(err => {
        this.loading = false
      })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('explainClose')
    },
    // 新增一行数据
    handleAdd() {
      const obj = {
        id: new Date().getTime(),
        name: '',
        permission: '',
        api: ''
      }
      this.tableData.push(obj)
    },
    // 删除一行数据
    handleDel(row) {
      const index = this.tableData.findIndex(item => {
        return item.id === row.id
      })
      this.tableData.splice(index, 1)
    },
    handleSubmit() {
      const index = this.tableData.findIndex(item => {
        return item.name === ''
      })
      if (index !== -1) {
        return false
      }
      const arr = []
      this.tableData.forEach(item => {
        const obj = {
          applyId: this.applyId,
          menuId: this.menuId,
          name: item.name,
          permission: item.permission,
          type: 'remark'
        }
        arr.push(obj)
      })
      this.handleClose()
      updateResource(arr, this.menuId).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('操作成功！')
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.explain-box{
  ::v-deep.explain-dialog{
    .el-dialog__body{
      padding: 0 20px;
      .el-table .el-table__body-wrapper {
        height: 40vh!important;
      }
      .table-top{
        display: none;
      }
    }
  }
}
</style>
