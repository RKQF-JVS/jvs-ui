<template>
  <div class="app-container">
    <jvs-table pageheadertitle='粉丝管理' :loading="tableLoading" :page="page" :option="option" :data="tableData" @on-load="getList" @search-change="searchChange">
      <template slot="menuLeft">
        <jvs-form :option="syncOption" :formData="{}" @submit="syncAccountFans"></jvs-form>
      </template>
      <template slot="nicknameStr" slot-scope="scope">
        <span>{{ scope.row.nicknameStr }}</span>
        <br>
        <el-tag v-for="(item, index) in scope.row.tagList" :key="index" type="small" style="margin-top: 5px;margin-right: 5px;" hit>
          {{ item.name }}
        </el-tag>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6">
            <div class="grid-content bg-purple" />
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light" />
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" />
          </el-col>
        </el-row>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="handleUpdate(scope.row)">回复</jvs-button>
      </template>
    </jvs-table>

    <el-dialog title="快捷回复" :visible.sync="dialogFormVisible" append-to-body :before-close="handleClose">
      <jvs-form v-if="dialogFormVisible" :option="formOption" :formData="tempFansMsg" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, deleteRow, syncAccountFans, sendMsg } from '../../api/wx-account-fans'

export default {
  filters: {},
  data() {
    return {
      tableData: [],
      option: {
        addBtn: false,
        cancal: false,
        search: true,
        editBtn: false,
        viewBtn: false,
        align: 'center',
        menuAlign: 'center',
        page: true,
        column: [
          {
            label: '公众号',
            prop: 'wxAccountName',
            searchSpan: 4,
            search: true
          },
          {
            label: '昵称',
            prop: 'nickname'
          },
          {
            label: '昵称',
            prop: 'nicknameStr',
            slot: true
          },
          {
            label: '头像',
            prop: 'headimgUrl',
            type: 'image',
          },
          {
            label: '性别',
            prop: 'gender'
          },
          {
            label: '语言',
            prop: 'language'
          },
          {
            label: '国家',
            prop: 'country'
          },
          {
            label: '省份',
            prop: 'province'
          },
          {
            label: '城市',
            prop: 'city'
          },
          {
            label: '订阅状态',
            prop: 'subscribeStatus',
            type: 'select',
            dicData: [
              {label: '已订阅', value: 1},
              {label: '未订阅', value: 0}
            ]
          }
        ]
      },
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {},
      formOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: '消息类型',
            prop: 'msgType',
            type: 'select',
            dicData: [
              { value: 'text', label: '文本消息' },
              { value: 'mpnews', label: '图文消息' }
            ],
            rules: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
            children: [
              {
                label: '内容',
                prop: 'content',
                type: 'textarea',
                linkbind: 'text'
              },
              {
                label: '模板名称',
                prop: 'tplId',
                linkbind: 'mpnews',
                type: 'select',
                dicUrl: '/api/wx/news/template/listAll2',
                props: {
                  label: 'display_name',
                  value: 'id'
                },
                tips: {
                  position: 'bottom',
                  text: '仅能发送单图文'
                }
              }
            ]
          },
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      },
      rules: {
        msgType: [{ required: true, message: '请选择消息类型', trigger: 'blur' }]
      },
      accountSelected: '',
      tempFansMsg: {
        fansId: '',
        msgType: '',
        content: '',
        tplId: ''
      },
      newsTplOptions: [],
      syncOption: {
        cancal: false,
        submitBtnText: '同步粉丝',
        emptyBtn: false,
        inline: true,
        isSearch: true,
        labelWidth: 'auto',
        column: [
          {
            label: '公众号',
            prop: 'wxAccountId',
            type: 'select',
            span: 18,
            dicUrl: '/mgr/weixin-mp/wx/account/listAll',
            method: 'post',
            dicData: [],
            props: {
              label: 'name',
              value: 'id'
            },
          }
        ]
      }
    }
  },
  created() {},
  methods: {
    getList() {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      fetchList(Object.assign(query, this.queryParams)).then(res => {
        if(res.data && res.data.code == 0) {
          this.tableLoading = false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    handleClose () {
      this.dialogFormVisible = false
      this.tempFansMsg = {
        fansId: '',
        msgType: '',
        content: '',
        tplId: ''
      }
    },
    createData(form) {
      this.formOption.submitLoading = true
      createRow(form).then((res) => {
        if(res.data && res.data.code == 0) {
          this.formOption.submitLoading = false
          this.getList()
          this.dialogFormVisible = false
          this.$message.success('创建成功')
        }
      })
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData(form) {
      if (this.tempFansMsg.msgType == 'text' && !this.tempFansMsg.content) {
        this.$message({ message: '请输入内容', type: 'warning' })
        return false
      }
      if (this.tempFansMsg.msgType == 'mpnews' && !this.tempFansMsg.tplId) {
        this.$message({ message: '请选择模板', type: 'warning' })
        return false
      }
      this.formOption.submitLoading = true
      const tempData = Object.assign({}, this.tempFansMsg)
      tempData.fansId = this.temp.id
      sendMsg(tempData).then((res) => {
        if(res.data && res.data.code == 0) {
          this.dialogFormVisible = false
          this.formOption.submitLoading = false
          this.$message.success("发送成功")
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { 'id': row.id }
        deleteRow(params).then((res) => {
          if(res.data && res.data.code == 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    syncAccountFans(form) {
      if (form.wxAccountId == '') {
        this.$message({ message: '请选择公众号', type: 'warning' })
        return false
      }
      this.$confirm('确认需要同步粉丝信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { 'id': form.wxAccountId }
        syncAccountFans(params).then(res => {
          if(res.data && res.data.code == 0) {
            this.getList()
            this.$message.success('同步粉丝成功')
          }
        })
      })
    },
    onMsgTypeChange(value) {
      if (value === '') {
        this.tempFansMsg.tplId = ''
        this.tempFansMsg.content = ''
      }
      if (value === 'text') {
        this.tempFansMsg.tplId = ''
      }
      if (value === 'mpnews') {
        this.tempFansMsg.content = ''
      }
    }
  }
}
</script>
