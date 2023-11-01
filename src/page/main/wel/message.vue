<template>
  <div class="message-info">
    <div :class="{'item-title-bar': true, 'no-border': !item.displayTitle}">
      <h4>{{item.displayTitle ? item.title : ''}}</h4>
      <p @click="viewAll"><span>查看全部</span><i class="el-icon-caret-right"></i></p>
    </div>
    <div style="cursor:pointer;">
      <jvs-table :option="option" :data="item.data" :showHeader="false"
        :size="$store.getters.theme.table.size || 'mini'"
        @row-click="viewMessageHandle"
      >
        <template slot="sendMessageType" slot-scope="scope">
          <!-- {{scope.row.readStatus ? '' : '[未读]'}} -->
          <span style="cursor: pointer;" @click="viewMessageHandle(scope.row)">{{scope.row.sendMessageType | getlabelbyvalue(scope.row.sendMessageType)}}</span>
        </template>
      </jvs-table>
    </div>
    <el-dialog
      title="消息详情"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleCloseMessage"
    >
      <div class="dialog-cont" v-if="dialogVisible">
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
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { readMessage } from '@/api/admin/message'
export default {
  name: 'message-info',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          data: []
        }
      }
    }
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
  data(){
    return {
      option: {
        addBtn: false,
        menu: false,
        column: [
          {
            label: '消息标题',
            prop: 'title',
            span: 24,
            align: 'left',
            showOverflow: true
          },
          {
            label: '消息类型',
            prop: 'sendMessageType',
            slot: true,
            dicData: [
              {label: '广播消息', value: 'broadcast'},
              {label: '警告消息', value: 'warning'},
              {label: '通知消息', value: 'notification'},
              {label: '系统消息', value: 'system',},
              {label: '业务消息', value: 'business'}
            ]
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
            dicData: [
              { label: '未读', value: false },
              { label: '已读', value: true }
            ]
          },
          {
            label: "发送时间",
            prop: "createTime",
            align: 'right',
            span: 24,
            width: 150,
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            showOverflow: true
          },
        ]
      },
      dialogVisible: false,
      rowData: {}, // 行数据
    }
  },
  methods: {
    viewAll () {
      this.$router.push({ path: '/usermessage' })
    },
    // 查看消息详情
    viewMessageHandle (data) {
      let row = data.row
      this.rowData= row
      if(this.rowData.id) {
        this.markread(this.rowData)
      }
      this.dialogVisible=true
    },
    // 关闭消息详情
    handleCloseMessage () {
      this.dialogVisible=false
      this.rowData={}
    },
    // 消息标记已读
    markread (row) {
      readMessage(row.id).then(res => {
        if (res.data.code==0) {}
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.item-title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-left: 3px solid #409EFF;
  p, h4{
    margin: 0;
    padding: 0;
  }
  p{
    cursor: pointer;
  }
}
.item-title-bar.no-border{
  border-left-width: 0;
}
</style>
