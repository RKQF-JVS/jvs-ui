<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.wxAccountId" placeholder="请选择公众号" clearable class="filter-item" style="width: 200px;margin-right: 20px">
        <el-option v-for="item in accountListOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input
        v-model="listQuery.receiveText"
        :placeholder="'请输入' + tempDesc.receiveText"
        style="width: 200px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-butto class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-butto>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
      <el-button
        v-has="'receiveTextList:add'"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="tempDesc.wxAccountName">
        <template slot-scope="scope">
          <span>{{ scope.row.wxAccountName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.receiveText">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveText }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.msgType">
        <template slot-scope="scope">
          <span>{{ scope.row.msgType == '1' ? '文本消息':'图文消息' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.tplName">
        <template slot-scope="scope">
          <span>{{ scope.row.tplName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.tplContent">
        <template slot-scope="scope">
          <span>{{ scope.row.tplContent }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="tempDesc.createTime" width="160px">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.createTime }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="tempDesc.updateTime" width="160px">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.updateTime }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-has="'receiveTextList:edit'" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has="'receiveTextList:delete'" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="tempDesc.receiveText" prop="receiveText">
          <el-input v-model="temp.receiveText" :placeholder="'请输入' + tempDesc.receiveText" :disabled="dialogStatus !='create'" />
        </el-form-item>
        <el-form-item :label="tempDesc.wxAccountId" prop="wxAccountId">
          <el-select v-model="temp.wxAccountId" placeholder="请选择公众号" clearable class="filter-item" style="width: 280px;" :disabled="dialogStatus !='create'">
            <el-option v-for="item in accountListOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.msgType" prop="msgType">
          <el-select v-model="temp.msgType" class="filter-item" :placeholder="'请选择' + tempDesc.msgType" style="width: 280px;" clearable>
            <el-option v-for="item in msgTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.tplId" prop="tplId">
          <el-select v-model="temp.tplId" class="filter-item" placeholder="请选择模板" style="width: 280px;" clearable>
            <el-option v-for="item in tplOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createRow, updateRow, deleteRow } from '../../api/wx_receive_text'
import { fetchAllAccount } from '../../api/wx-account'
import { fetchAllTextTpl } from '../../api/wx-text-template'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// 常量title
const tempDesc = {
  'id': '',
  'receiveText': '关键字',
  'msgType': '消息类型',
  'tplId': '模板名称',
  'wxAccountId': '公众号名称',
  'createTime': '创建时间',
  'updateTime': '更新时间',
  'tplName': '模板名称',
  'wxAccountName': '公众号名称',
  'tplContent': '模板内容'
}

const msgTypeOptions = [
  { key: '1', display_name: '文本消息' }
  // { key: '2', display_name: '图文消息' }
]

export default {
  // name: 'ComplexTable',
  // components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        receiveText: '',
        wxAccountId: ''
      },
      showReviewer: false,
      temp: {
        'id': '',
        'receiveText': '',
        'msgType': '',
        'tplId': '',
        'wxAccountId': '',
        'tplName': '',
        'wxAccountName': ''
      },
      tempDesc: tempDesc,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      },
      rules: {
        receiveText: [{ required: true, message: '请输入' + tempDesc.receiveText, trigger: 'blur' }],
        wxAccountId: [{ required: true, message: '请选择公众号', trigger: 'blur' }],
        msgType: [{ required: true, message: '请选择' + tempDesc.msgType, trigger: 'blur' }],
        tplId: [{ required: true, message: '请选择' + tempDesc.tplId, trigger: 'blur' }]
      },
      accountListOptions: [
      ],
      tplOptions: [],
      msgTypeOptions
    }
  },
  created() {
    this.getList()
    this.getAccountList()
    this.getAllTextTpl()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'receiveText': '',
        'msgType': '',
        'tplId': '',
        'wxAccountId': '',
        'tplName': '',
        'wxAccountName': ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRow(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRow(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { 'id': row.id }
          deleteRow(params).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
    },
    getAccountList() {
      fetchAllAccount().then(response => {
        this.accountListOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.accountListOptions.push({ 'key': response.data[i].id + '', 'display_name': response.data[i].name })
        }
      })
    },
    getAllTextTpl() {
      fetchAllTextTpl().then(response => {
        this.tplOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.tplOptions.push({ 'key': response.data[i].id + '', 'display_name': response.data[i].tplName })
        }
      })
    }
  }
}
</script>
