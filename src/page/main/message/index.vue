<template>
  <div class="message-center">
    <div class="message-center-box">
      <title-page-header title="消息中心" :hassave="false" @close="backToLast">
        <template slot="left">
          <div style="display: flex;align-items: center;">
            <el-input v-model="queryParams.search" size="mini" placeholder="消息搜索" clearable style="margin-right:10px;width:400px;"></el-input>
            <el-button type="primary" size="mini" @click="searchChange">搜索</el-button>
          </div>
        </template>
      </title-page-header>
      <div class="message-center-content">
        <div class="left-part">
          <div
            :class="item.value === currentType ? 'left-part-item is-active' : 'left-part-item'"
            v-for="(item, key) in typeList"
            :key="key"
            @click="handleType(item.value)"
          >{{ item.label }}</div>
        </div>
        <div class="right-part">
          <jvs-table
            refs="multipleTable"
            pageheadertitle="消息中心"
            :data="tableData"
            tooltipEffect="dark"
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
              <!-- [{{scope.row.type | getlabelbyvalue(scope.row.type)}}] -->
              <!-- [{{scope.row.source}}]  -->
              <div style="display: flex;align-items: center">
                <div style="width: 40px">
                  <div v-if="!scope.row.readStatus" style="width: 10px;height: 10px;border-radius: 5px;background-color: #de4942"></div>
                </div>
                <span>{{scope.row.title}}</span>
              </div>
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
            <template slot="type" slot-scope="scope">
              <span>{{scope.row.type | getlabelbyvalue(scope.row.type)}}</span>
            </template>
          </jvs-table>
        </div>
      </div>
    </div>

    <el-dialog
      title="消息详情"
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
          <span style="margin-right: 10px;">[{{rowData.type | getlabelbyvalue(rowData.type)}}]</span>
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
      currentType: null,
      typeList: [
        {label: '广播消息', value: 'broadcast'},
        {label: '警告消息', value: 'warning'},
        {label: '通知消息', value: 'notification'},
        {label: '系统消息', value: 'system'},
        {label: '业务消息', value: 'business'}
      ],
      queryParams: {
        search: '',
        type: ''
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
        // align: 'center',
        // menuAlign: 'center',
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
            hide: true,
            slot: true,
            dicData: [
              { label: '未读', value: false },
              { label: '已读', value: true }
            ]
          },
          {
            label: '消息类型',
            prop: 'type',
            dicData: [
              {label: '广播消息', value: 'broadcast'},
              {label: '警告消息', value: 'warning'},
              {label: '通知消息', value: 'notification'},
              {label: '系统消息', value: 'system',},
              {label: '业务消息', value: 'business'}
            ],
            hide: true,
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
    handleType(item) {
      this.currentType = item
      this.queryParams.type = item
      this.getList()
    },
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
      if(this.queryParams.type) {
        obj.type = this.queryParams.type
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
.message-center{
  background-color: #f0f2f5;
  height: 100%;
  overflow: hidden;
  .message-center-box{
    background-color: #ffffff;
    padding: 20px;
    width: 80vw;
    margin: 20px auto;
    .message-center-content{
      display: flex;
      .left-part{
        margin-top: 40px;
        margin-right: 40px;
        border-right: 1px solid #f9f9f9;
        width: 240px;
        .left-part-item{
          color: #333333;
          padding: 6px 16px;
          height: 28px;
          line-height: 28px;
          font-size: 16px;
          cursor: pointer;
          &:hover{
            background-color: #f9f9f9;
          }
        }
        .is-active{
          background-color: #f9f9f9;
        }
      }
      /deep/.right-part{
        width: calc(100% - 280px);
        .el-table .el-table__body-wrapper{
          height: 60vh!important;
        }
        .jvs-table .jvs-table-titleTop .el-card__body .table-top{
          border-bottom: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>
