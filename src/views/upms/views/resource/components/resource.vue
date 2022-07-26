<template>
  <div class="resource-box">
    <el-dialog
      class="resource-dialog"
      title="资源管理"
      width="70%"
      :visible.sync="resourceVisible"
      :before-close="handleClose">
      <jvs-table :option="option" :data="tableData">
        <template slot="headerTop">
          <el-button size="mini" style="margin-top: 16px" @click="handleAdd">新增一行</el-button>
        </template>
        <template slot="name" scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
        <template slot="permission" scope="scope">
          <el-input size="mini" v-model="scope.row.permission"></el-input>
        </template>
        <template slot="api" scope="scope">
          <el-select v-model="scope.row.api" multiple filterable allow-create collapse-tags placeholder="请选择接口" size="mini" class="api-select">
            <el-option
              v-for="item in apiList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <!-- <el-input size="mini" v-model="scope.row.api"></el-input> -->
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
import {getResourceList, updateResource, getApiList} from '../../../api/resource/index'
export default {
  name: "resource",
  props: {
    resourceVisible: {
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
        align: 'center',
        menuAlign: 'center',
        menuWidth: 100,
        column: [
          {
            label: "资源名称",
            prop: "name",
            slot: true
          },
          {
            label: "资源标识",
            prop: "permission",
            slot: true
          },
          {
            label: "接口地址",
            prop: "api",
            slot: true,
            width: 380
          }
        ]
      },
      tableData: [],
      apiList: []
    }
  },
  watch: {
  },
  methods: {
    // 获取资源列表
    getResourceList(menuId) {
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
      this.$emit('resourceClose')
    },
    // 新增一行数据
    handleAdd() {
      const obj = {
        no: new Date().getTime(),
        name: '',
        permission: '',
        api: []
      }
      this.tableData.push(obj)
    },
    // 删除一行数据
    handleDel(row) {
      const index = this.tableData.findIndex(item => {
        if (item.id) {
          return item.id === row.id
        } else  {
          return item.no === row.no
        }
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
          id: item.id,
          name: item.name,
          permission: item.permission,
          type: 'button',
          api: item.api
        }
        arr.push(obj)
      })
      updateResource(arr, this.menuId).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('操作成功！')
          this.handleClose()
        }
      })
    },
    // 获取所有api列表
    getApiListHandle () {
      getApiList().then(res => {
        if(res.data.code == 0) {
          this.apiList = res.data.data
        }
      })
    }
  },
  created () {
    this.getApiListHandle()
  }
}
</script>

<style lang="scss" scoped>
.resource-box{
  ::v-deep.resource-dialog{
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
<style lang="scss">
.resource-dialog{
  .api-select{
    width: 100%;
    .el-input{
      .el-input__inner{
        height: 28px!important;
      }
    }
    .el-select__tags{
     .el-tag:nth-of-type(1){
       max-width: 265px;
       position: relative;
      .el-select__tags-text{
        max-width: 235px;
        display: inline-block;
        overflow: hidden;
        white-space: pre;
        text-overflow: ellipsis;
      }
     }
     .el-tag__close.el-icon-close{
       top: -4px;
     }
    }
  }
}
</style>
