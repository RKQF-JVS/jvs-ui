<template>
<div class="data-migration">
  <jvs-table
    :data="tableData"
    :option="option"
    :loading="tableLoading"
    :page="page"
    pageheadertitle='数据迁移'
    @on-load="getList"
    @search-change="searchChange"
  >
    <template slot="menuLeft">
      <el-upload
        ref="uploadFileBtn"
        style="display: inline-block; margin-right: 10px;"
        class="upload-demo"
        action="/mgr/jvs-auth/data/service/import/all"
        :show-file-list="false"
        :limit="1"
        :on-success="uploadChangeHandle"
        :file-list="fileList">
        <jvs-button type="primary" size="mini">导入</jvs-button>
      </el-upload>
      <jvs-button size="mini" type="primary" @click="exportHandle">导出</jvs-button>
    </template>
  </jvs-table>
</div>
</template>
<script>
import {getLogs, addRow} from './api'
export default {
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
      option: {
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        align: 'center',
        menuAlign: 'center',
        search: true,
        showOverflow: true,
        page: true,
        menu: false,
        column: [
          {
            label: '服务名称',
            prop: 'serviceName',
            searchSpan: 6,
            search: true
          },
          {
            label: '允许导入导出的实例数量',
            prop: 'validCount',
            expressControl: [
              {
                color: "#F95E5E",
                express: "${validCount} == 0",
                text: "无"
              },
              {
                color: "#000000",
                express: "${validCount} > 0",
                text: "${validCount}"
              }
            ]
          },
          {
            label: '实例总数',
            prop: 'totalCount'
          }
        ]
      },
      fileList: []
    }
  },
  methods: {
    getList (page) {
      this.tableLoading = true
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      obj = Object.assign(obj, this.queryParams)
      getLogs(obj).then(res => {
        if(res.data.code == 0) {
          this.tableLoading = false
          this.tableData = res.data.data.records
          this.page.currentPage = res.data.data.current
          this.page.total = res.data.data.total
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 导入
    uploadChangeHandle (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.getList()
      }else{
        this.$message.error(res.msg)
      }
      this.$refs.uploadFileBtn.clearFiles()
    },
    // 导出
    exportHandle () {
      this.$openUrl('/mgr/jvs-auth/data/service/export/all', '_self')
    }
  }
}
</script>
<style lang="scss"></style>