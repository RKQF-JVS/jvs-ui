<template>
  <div class="bulletin-page">
    <jvs-table
      :pageheadertitle='pageheadertitle'
      :option="option"
      :data="tableData"
      :loading="tableLoading"
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
      <template slot="publish" slot-scope="scope">
        <el-tag size="mini" :type="scope.row.publish ? '' : 'info'">{{getIsDeployText(scope.row.publish)}}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text"  v-if="scope.row.publish" @click="unload(scope.row)">卸载</jvs-button>
        <jvs-button size="mini" type="text"  v-if="!scope.row.publish" @click="deploy(scope.row)">发布</jvs-button>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import { tableOption } from './option'
import {pageList, add, edit, del, deploy, unload} from './api'
export default {
  components: {},
  props: {
    propData: {
      type: Object
    }
  },
  data () {
    return {
      tableLoading: false, // loading显示
      tableData: [], // 列表数据
      pageheadertitle: '公告管理', // fixed me  表名
      option: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
    }
  },
  created () { },
  methods: {
    // 发布
    deploy(row) {
      deploy(row.id).then(res => {
        if(res.data && res.data.code == 0) {
          this.$message.success('发布成功')
          this.getList()
        }
      })
    },
    // 卸载
    unload(row) {
      unload(row.id).then(res => {
        if(res.data && res.data.code == 0) {
          this.$message.success('卸载成功')
          this.getList()
        }
      })
    },
    // 显示状态
    getIsDeployText(val) {
      return val ? '已发布' : '未发布'
    },
    // 表格分页查询
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      pageList(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
        }
      })
    },
    // 条件查询
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    // 新增
    addRowHandle (form) {
      add(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    },
    // 编辑
    editRowHandle (form) {
      edit(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('编辑成功')
          this.getList()
        }
      })
    },
    // 删除
    delRowHandle (row) {
      del(row).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.bulletin-page{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      padding: 0;
    }
  }
}
</style>
