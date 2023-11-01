<template>
  <div class="wx-message-temp-page">
    <div class="header">
      <div class="form-title">
        公众号消息模板
      </div>
      <div class="header-desc">
        **********
      </div>
    </div>
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='请求日志'
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menuLeft" slot-scope="scope">
                <jvs-button size="mini" type="primary" @click="handleAsync()">同步消息模板</jvs-button>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {getWxMessageTempList} from "@/views/upms/views/wxMessageTemplate/api";

export default {
  name: 'wx-message-template',
  data () {
    return {
      tableLoading: false,
      tableData: [],
      tableOption: {
        showOverflow: true,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        search: false,
        menu: false,
        page: false,
        cancal: false,
        column: [
          {
            label: '模板标题',
            prop: 'title',
          },
          {
            label: '一级行业',
            prop: 'primaryIndustry'
          },
          {
            label: '二级行业',
            prop: 'deputyIndustry',
          },
          {
            label: '模板内容',
            prop: 'content',
          },
          {
            label: '模板示例',
            prop: 'example',
          },
        ]
      },
    }
  },
  created() {
  },
  methods: {
    getList () {
      getWxMessageTempList().then(res => {
        if (res.data && res.data.code == 0) {
          this.tableData = res.data.data || []
        }
      })
    },
    handleAsync() {
      const params = {
        new: true
      }
      getWxMessageTempList(params).then(res => {
        if (res.data && res.data.code == 0) {
          this.tableData = res.data.data || []
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
  }
}
</script>
<style lang="scss" scoped>
.wx-message-temp-page{
  background-color: #FFFFFF;
  .header{
    padding: 20px 20px 0;
    .form-title{
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }
    .header-desc{
      color: #a2a3a5;
      font-size: 14px;
    }
  }
}
</style>
