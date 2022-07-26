<template>
  <div class="message-center" style="width: clac(100% - 20px);padding: 10px;">
    <title-page-header title="消息中心" :hassave="false" @close="backToLast">
      <template slot="left">
        <div style="display: flex;align-items: center;">
          <el-input v-model="queryParams.search" size="mini" placeholder="消息搜索" clearable style="margin-right:10px;width:400px;"></el-input>
          <el-button type="primary" size="mini" @click="searchChange">搜索</el-button>
        </div>
      </template>
    </title-page-header>
    <div class="message-center-box">
      <jvs-table
        refs="multipleTable"
        pageheadertitle="消息中心"
        :data="tableData"
        tooltipEffect="dark"
        style="width: 100%"
        :showHeader="false"
        :loading="tableLoading"
        :option="option"
        :page="page"
        :size="$store.getters.theme.table.size || 'mini'"
        @row-click="viewHandle"
        @on-load="getList"
      >
        <template slot="title" slot-scope="scope">
          <!-- {{scope.row.readStatus ? '' : '[未读]'}}   -->
          <!-- [{{scope.row.sendMessageType | getlabelbyvalue(scope.row.sendMessageType)}}] -->
          <!-- [{{scope.row.source}}]  -->
          <span>{{scope.row.title}}</span>
        </template>
        <template slot="createTime" slot-scope="scope">
          <div>
            <span>{{scope.row.createTime}}</span>
            <!-- <el-button type="text" size="mini" style="margin-left: 20px;" @click.stop="hideMessage(scope.row)">隐藏</el-button> -->
          </div>
        </template>
        <template slot="readStatus" slot-scope="scope">
          <span>{{scope.row.readStatus ? '已读' : '未读'}}</span>
        </template>
        <template slot="sendMessageType" slot-scope="scope">
          <span>{{scope.row.sendMessageType | getlabelbyvalue(scope.row.sendMessageType)}}</span>
        </template>
      </jvs-table>
    </div>

    <el-dialog
      title="消息详情"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <!-- <div class="dialog-cont">
        <el-row
          style="display:flex;justify-content: center;height: 42px;align-items: center;padding: 0 4px;text-align: center;"
        >
          <span style="flex:1;">{{rowData.title}}</span>
        </el-row>
        <el-row
          style="display:flex;justify-content: center;height: 42px;align-items: center;padding: 0 4px;text-align: center;"
        >
          <span style="margin-right: 10px;">[{{rowData.sendMessageType | getlabelbyvalue(rowData.sendMessageType)}}]</span>
          <span style="margin-right: 10px;">[{{rowData.source}}]</span>
          <span style="margin-right: 10px;">{{rowData.createTime}}</span>
        </el-row>
        <el-row>
          <section v-html="rowData.content"></section>
        </el-row>
      </div> -->
      <div class="mess-info">
        <el-row class="title">
          <b>邮件内容标题：</b>
          <span>{{rowData.title}}</span>
        </el-row>
        <el-row>
          <b>发送类型：</b>
          <span>{{rowData.sendMessageType | getlabelbyvalue(rowData.sendMessageType)}}</span>
        </el-row>
        <!-- <el-row>
          <b>发件人：</b>
          <span>{{rowData.userId}}</span>
        </el-row>
        <el-row>
          <b>收件人：</b>
          <span>{{rowData.userId}}</span>
        </el-row> -->
        <el-row>
          <b>时间：</b>
          <span>{{rowData.createTime}}</span>
        </el-row>
        <el-row class="content">
          <section v-html="rowData.content"></section>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { messageaPage, deleteMessage, readMessage } from '@/api/admin/message'
export default {
  name: "message-center",
  data () {
    return {
      queryParams: {
        search: ''
      },
      tableData: [],
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper", // 分页工具
      },
      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        columnBtn: false,
        selection: true,
        reserveSelection: true,
        search: false,
        menu: false,
        column: [
          {
            label: '消息标题',
            prop: 'title',
            span: 24,
            align: 'left',
            slot: true
          },
          {
            label: '内容',
            prop: 'content',
            span: 24,
            hide: true
          },
          {
            label: '状态',
            prop: 'readStatus',
            span: 24,
            // hide: false,
            slot: true,
            dicData: [
              { label: '未读', value: false },
              { label: '已读', value: true }
            ]
          },
          {
            label: '消息类型',
            prop: 'sendMessageType',
            dicData: [
              {label: '广播消息', value: 'broadcast'},
              {label: '警告消息', value: 'warning'},
              {label: '通知消息', value: 'notification'},
              {label: '系统消息', value: 'system',},
              {label: '业务消息', value: 'business'}
            ],
            // hide: true,
            slot: true
          },
          {
            label: "发送时间",
            prop: "createTime",
            align: 'right',
            span: 24,
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            width: 250,
            slot: true
          },
        ]
      },
      dialogVisible: false,
      rowData: {},
    };
  },
  filters: {
    getlabelbyvalue: function(value) {
      let str = value
      let arr = [
        {label: '广播消息', value: 'broadcast'},
        {label: '警告消息', value: 'warning'},
        {label: '通知消息', value: 'notification'},
        {label: '系统消息', value: 'system'},
        {label: '业务消息', value: 'business'}
      ]
      for(let i in arr) {
        if(arr[i].value == value) {
          str = arr[i].label
        }
      }
      return str
    }
  },
  created () { },
  mounted () {
    //监听键盘按键事件
    let self=this;
    this.$nextTick(function () {
      document.addEventListener('keyup', function (e) {
        //此处填写你的业务逻辑即可
        if (e.keyCode==27) {
          self.backToLast();
        }
      })
    })
  },
  computed: {},
  methods: {
    //   获取数据
    getList (page) {
      this.tableLoading=true
      let obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
      }
      if(this.queryParams.search) {
        obj.search = this.queryParams.search
      }
      messageaPage(obj).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.tableLoading=false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
        }
      }).catch(e => {
        // 请求失败时关闭loading
        this.tableLoading=false
      })
    },
    /**
     * 搜索
     */
    searchChange () {
      this.getList()
    },
    // 标记已读
    markread (row) {
      readMessage(row.id).then(res => {
        if (res.data.code==0) {
          this.getList()
        }
      })
    },
    // 查看详情
    viewHandle (data) {
      this.rowData= data.row
      if(this.rowData.id) {
        this.markread(this.rowData)
      }
      this.dialogVisible=true
    },
    // 关闭详情
    handleClose () {
      this.dialogVisible=false
      this.rowData={}
    },
    //退出全屏操作
    backToLast () {
      this.$router.go(-1)
    },
    // 不显示消息
    hideMessage (row) {
      this.$confirm('是否确认不显示此消息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteMessage(row.id)
      }).then(data => {
        this.getList()
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function (err) {
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.mess-info{
  .el-row{
    line-height: 32px;
    background: #F4F5F9;
    padding: 10px 20px;
    b{
      font-weight: normal;
      font-size: 14px;
      color: #1A1A1C;
    }
    span{
      color: #828283;
      font-size: 14px;
    }
  }
  .title{
    b,span{
      font-size: 16px;
    }
  }
  .content{
    background: #fff;
    padding: 20px;
  }
}
.dialog-cont{
  max-height: 600px;
  min-height: 400px;
  overflow: auto;
  overflow-x: hidden;
}
.search-title{
  width: 100%;
  // padding: 20px 0;
  div{
    width: 50%;
    .el-button {
      margin-left: 10px;
    }
  }
  display: flex;
  // justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.message-center{
  background-color: #f0f2f5;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 10px;
  .message-center-box{
    position: relative;
    height: calc(100% - 55px);
    overflow: hidden;
    margin-top: 10px;
  }
  .message-center-box::-webkit-scrollbar{
    display: none;
  }
  .table-top-left{
    width: 100%;
  }
  .close-message-icon{
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .jvs-table{
    height: 100%;
    overflow: hidden;
    .el-card__body{
      display: none;
    }
    .table-body-box{
      height: calc(100% - 72px);
      overflow: hidden;
      .el-table{
        height: 100%;
      }
    }
    .el-table__body-wrapper{
      height: 100%;
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
      background: rgba(0,0,0,0.1);
    }
    .el-table__body-wrapper::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
      border-radius: 0;
      background: rgba(0,0,0,0.1);
    }
  }
  .title-page-header{
    margin-top: 0;
  }
}
</style>
