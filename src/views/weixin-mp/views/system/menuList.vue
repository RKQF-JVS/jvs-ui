<template>
  <div class="app-container">
    <div class="jvs-table left-tree-table">
      <PageHeader title="公众号菜单" :class="{'jvs-table-titleTop': true, 'jvs-table-top': true}">
        <div class="top" style="margin-top: 15px;padding-bottom:15px;border-bottom:1px solid #DCDFE6;">
          <el-row style="display: flex;align-items:center;">
            <el-select size="mini" v-model="accountSelected" placeholder="请选择公众号" clearable class="filter-item" style="width: 200px;margin-right: 10px">
              <el-option v-for="item in accountListOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <jvs-button type="primary" @click="handlerSyncAccountFans">同步菜单</jvs-button>
            <jvs-button type="primary" @click="handleFilter()">刷新</jvs-button>
            <jvs-button type="primary" @click="handleExpand()">{{ expandAllTitle }}</jvs-button>
            <jvs-button type="primary" @click="handleCreate('')">新增</jvs-button>
          </el-row>
        </div>
      </PageHeader>
    </div>
    <tree-table
      v-loading="tableLoading"
      :data="menuTree"
      :default-expand-all="expandAll"
      :columns="columns"
      border
      default-children="children"
    >
      <template slot="menuType" slot-scope="{scope}">
        <span>{{ formatMenuType(scope.row) }}</span>
      </template>
      <template slot="menuLevel" slot-scope="{scope}">
        <span>{{ formatMenuLevel(scope.row) }}</span>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button v-show="scope.row.menuLevel == '1'" v-has="'menuList:addsub'" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate(scope.row)">
          添加下级
        </el-button>
        <el-button v-has="'menuList:edit'" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button v-has="'menuList:delete'" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </tree-table>

    <el-dialog :title="temp.menuLevel ==='1' ? textMap[dialogStatus] + '一级菜单' : textMap[dialogStatus] + '二级菜单'" :visible.sync="dialogFormVisible">
      <jvs-form :option="formOption" :formData="rowData" @submit="dialogStatus==='create'?createData():updateData()"></jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/page-header/PageHeader'
import { fetchAllAccount } from '../../api/wx-account'
import { fetchAllTextTpl } from '../../api/wx-text-template'
import { fetchAllNewsTpl } from '../../api/wx-news-template'
import { createRow, updateRow, deleteRow, listTreeMenu, validateData, syncAccountMenu } from '../../api/wx-menu'
import treeTable from '../components/TreeTable'
// 常量title
const tempDesc = {
  'id': '',
  'parentId': '',
  'menuName': '菜单名称',
  'menuType': '菜单类型',
  'menuLevel': '菜单等级',
  'tplId': '模板名称',
  'menuUrl': '菜单URL',
  'menuSort': '菜单排序',
  'wxAccountId': '公众号名称',
  'miniprogramAppid': '小程序appid',
  'miniprogramPagepath': '小程序页面路径',
  'createTime': '创建时间',
  'updateTime': '更新时间',
  'tplName': '模板名称',
  'wxAccountName': '公众号名称'
}

const menuTypeOptions = [
  { key: '1', display_name: '文本消息' },
  { key: '2', display_name: '图文消息' },
  { key: '3', display_name: '网址链接' },
  { key: '4', display_name: '小程序' }
]

const menuLevelOptions = [
  { key: '1', display_name: '一级菜单' },
  { key: '2', display_name: '二级菜单' }
]

export default {
  components: { PageHeader, treeTable },
  data() {
    return {
      expandAll: false,
      expandAllTitle: '展开全部',
      columns: [
        {
          label: tempDesc.wxAccountName,
          key: 'wxAccountName',
          width: 220,
          expand: true,
          align: 'left',
          headerAlign: 'center'
        },
        {
          label: tempDesc.menuName,
          key: 'menuName'
        },
        {
          label: tempDesc.menuType,
          key: 'menuType'
        },
        {
          label: tempDesc.menuLevel,
          key: 'menuLevel'
        },
        {
          label: tempDesc.menuSort,
          key: 'menuSort'
        },
        {
          label: tempDesc.tplName,
          key: 'tplName'
        },
        {
          label: tempDesc.menuUrl,
          key: 'menuUrl'
        },
        {
          label: tempDesc.miniprogramAppid,
          key: 'miniprogramAppid'
        },
        {
          label: tempDesc.miniprogramPagepath,
          key: 'miniprogramPagepath'
        }
      ],
      menuList: [],
      menuTree: [],
      tempDesc: tempDesc,
      tableLoading: true,
      data: [
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        'id': '',
        'parentId': '',
        'menuName': '',
        'menuType': '',
        'menuLevel': '',
        'tplId': '',
        'menuUrl': '',
        'menuSort': '',
        'wxAccountId': '',
        'miniprogramAppid': '',
        'miniprogramPagepath': '',
        'tplName': '',
        'wxAccountName': ''
      },
      accountListOptions: [],
      menuTypeOptions,
      menuLevelOptions,
      tplOptions: [],
      textTplOptions: [],
      newsTplOptions: [],
      rules: {
      },
      accountSelected: '',
      accountNewsTplTemp: {},// 每个微信账号对应的图文模板的缓存

      rowData: {},
      formOption: {
        cancal: false,
        column: [
          {
            label: '公众号名称',
            prop: 'wxAccountId',
            type: 'select',
            dicUrl: ''
          },
          {
            label: '菜单名称',
            prop: 'menuName'
          },
          {
            label: '菜单类型',
            prop: 'menuType',
            type: 'select',
            dicData: menuTypeOptions,
            props: {
              label: 'display_name',
              value: 'key'
            }
          },
          {
            label: '菜单等级',
            prop: 'menuLevel',
            type: 'select',
            dicData: menuLevelOptions,
            props: {
              label: 'display_name',
              value: 'key'
            }
          },
          {
            label: '菜单排序',
            prop: 'menuSort'
          },
          {
            label: '模板名称',
            prop: 'tplId',
            type: 'select',
            dicData: [], // menuType区分 1   2
            displayExpress: [
              {
                prop: 'menuType',
                value: '1,2'
              }
            ]
          },
          {
            label: '菜单URL',
            prop: 'menuUrl',
            displayExpress: [
              {
                prop: 'menuType',
                value: '3'
              }
            ]
          },
          {
            label: '小程序appid',
            prop: 'miniprogramAppid',
            displayExpress: [
              {
                prop: 'menuType',
                value: '4'
              }
            ]
          },
          {
            label: '小程序页面路径',
            prop: 'miniprogramPagepath',
            displayExpress: [
              {
                prop: 'menuType',
                value: '4'
              }
            ]
          }
        ]
      }
    }
  },
  watch: {
    'temp.wxAccountId'(newValue, oldValue) {
      this.newsTplOptions = this.accountNewsTplTemp[newValue]
    }
  },
  created() {
    this.columns.push({ label: '操作', key: 'operation', width: 320 })
    this.getList()
    this.getAccountList()
    this.getAllTextTpl()
  },
  methods: {
    getList() {
      this.tableLoading = true
      listTreeMenu().then(response => {
        this.menuList = response.data.menuList
        this.menuTree = response.data.menuTree
        setTimeout(() => {
          this.tableLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'parentId': '',
        'menuName': '',
        'menuType': '',
        'menuLevel': '',
        'tplId': '',
        'menuUrl': '',
        'menuSort': '',
        'wxAccountId': '',
        'miniprogramAppid': '',
        'miniprogramPagepath': '',
        'tplName': '',
        'wxAccountName': ''
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if (!row) { // 一级菜单
        this.temp.menuLevel = '1'// 默认一级菜单
      }
      if (row) { // 子菜单
        this.temp.menuLevel = '2'
        this.temp.parentId = row.id
        this.temp.wxAccountId = row.wxAccountId
      }

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      if (this.temp.wxAccountId == '') {
        this.$message({ message: '请选择公众号', type: 'warning' })
        return false
      }
      if (this.temp.menuName == '') {
        this.$message({ message: '请输入菜单名称', type: 'warning' })
        return false
      }
      if (this.temp.menuType == '') {
        this.$message({ message: '请选择菜单类型', type: 'warning' })
        return false
      }
      if (this.temp.menuSort == '') {
        this.$message({ message: '请输入菜单排序', type: 'warning' })
        return false
      }
      if (this.temp.menuType == '1' || this.temp.menuType == '2') {
        if (this.temp.tplId == '') {
          this.$message({ message: '请选择模板', type: 'warning' })
          return false
        }
      }
      if (this.temp.menuType == '3') {
        if (this.temp.menuUrl == '') {
          this.$message({ message: '请输入' + tempDesc.menuUrl, type: 'warning' })
          return false
        }
      }
      if (this.temp.menuType == '4') {
        if (this.temp.menuUrl == '') {
          this.$message({ message: '请输入' + tempDesc.menuUrl, type: 'warning' })
          return false
        }
        if (this.temp.miniprogramAppid == '') {
          this.$message({ message: '请输入' + tempDesc.miniprogramAppid, type: 'warning' })
          return false
        }
        if (this.temp.miniprogramPagepath == '') {
          this.$message({ message: '请输入' + tempDesc.miniprogramPagepath, type: 'warning' })
          return false
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 后台校验数据
          validateData(this.temp).then((res) => {
            var result = res.data
            if (!result.isCanCreate) {
              this.$message({ message: result.msg, type: 'warning' })
              return false
            } else {
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
        }
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.temp.id = row.id
      this.temp.parentId = row.parentId
      this.temp.menuName = row.menuName
      this.temp.menuType = row.menuType
      this.temp.menuLevel = row.menuLevel
      this.temp.tplId = row.tplId
      this.temp.menuUrl = row.menuUrl
      this.temp.menuSort = row.menuSort
      this.temp.wxAccountId = row.wxAccountId
      this.temp.miniprogramAppid = row.miniprogramAppid
      this.temp.miniprogramPagepath = row.miniprogramPagepath

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (this.temp.wxAccountId == '') {
        this.$message({ message: '请选择公众号', type: 'warning' })
        return false
      }
      if (this.temp.menuName == '') {
        this.$message({ message: '请输入菜单名称', type: 'warning' })
        return false
      }
      if (this.temp.menuType == '') {
        this.$message({ message: '请选择菜单类型', type: 'warning' })
        return false
      }
      if (this.temp.menuSort == '') {
        this.$message({ message: '请输入菜单排序', type: 'warning' })
        return false
      }
      if (this.temp.menuType == '1' || this.temp.menuType == '2') {
        if (this.temp.tplId == '') {
          this.$message({ message: '请选择模板', type: 'warning' })
          return false
        }
      }
      if (this.temp.menuType == '3') {
        if (this.temp.menuUrl == '') {
          this.$message({ message: '请输入' + tempDesc.menuUrl, type: 'warning' })
          return false
        }
      }
      if (this.temp.menuType == '4') {
        if (this.temp.menuUrl == '') {
          this.$message({ message: '请输入' + tempDesc.menuUrl, type: 'warning' })
          return false
        }
        if (this.temp.miniprogramAppid == '') {
          this.$message({ message: '请输入' + tempDesc.miniprogramAppid, type: 'warning' })
          return false
        }
        if (this.temp.miniprogramPagepath == '') {
          this.$message({ message: '请输入' + tempDesc.miniprogramPagepath, type: 'warning' })
          return false
        }
      }
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
    formatMenuType(row, column) {
      switch (row.menuType) {
        case '1':
          return '文本消息'
          break
        case '2':
          return '图文消息'
          break
        case '3':
          return '网址链接'
          break
        case '4':
          return '小程序'
          break
      }
    },
    formatMenuLevel(row, column) {
      switch (row.menuLevel) {
        case '1':
          return '一级菜单'
          break
        case '2':
          return '二级菜单'
          break
      }
    },
    getAccountList() {
      this.accountListOptions = []
      fetchAllAccount().then(res => {
        if(res.data && res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            this.accountListOptions.push(res.data.data[i])
          }
        }
        console.log(this.accountListOptions)
        this.getAllNewsTpl()
      })
    },
    getAllTextTpl() {
      fetchAllTextTpl().then(response => {
        this.textTplOptions = []
        for (var i = 0; i < response.data.length; i++) {
          this.textTplOptions.push({ 'key': response.data[i].id + '', 'display_name': response.data[i].tplName })
        }
      })
    },
    getAllNewsTpl() {
      const _this = this
      for (var j = 0; j < _this.accountListOptions.length; j++) {
        var _wxAccountId = _this.accountListOptions[j].key
        var params = { 'wxAccountId': _wxAccountId }
        fetchAllNewsTpl(params).then(response => {
          //            _this.newsTplOptions = [];
          //            for(var i=0;i<response.data.length;i++){
          //              _this.newsTplOptions.push({"key":response.data[i].id + '',"display_name":response.data[i].tplName});
          //            }
          var _newsTplOptions = []
          for (var i = 0; i < response.data.length; i++) {
            _newsTplOptions.push({ 'key': response.data[i].id + '', 'display_name': response.data[i].tplName })
          }
          _this.accountNewsTplTemp[_wxAccountId] = _newsTplOptions
        })
      }
    },
    onMenuTypeChange(value) {
      if (value === '') {
        this.temp.tplId = ''
        this.temp.menuUrl = ''
        this.temp.miniprogramAppid = ''
        this.temp.miniprogramPagepath = ''
      }
      if (value === '1') {
        this.temp.tplId = ''
        this.temp.menuUrl = ''
        this.temp.miniprogramAppid = ''
        this.temp.miniprogramPagepath = ''
        // this.tplOptions = this.textTplOptions;
      }
      if (value === '2') {
        this.temp.tplId = ''
        this.temp.menuUrl = ''
        this.temp.miniprogramAppid = ''
        this.temp.miniprogramPagepath = ''
        // this.tplOptions = this.newsTplOptions;
      }
      if (value === '3') {
        this.temp.tplId = ''
        this.temp.miniprogramAppid = ''
        this.temp.miniprogramPagepath = ''
      }
      if (value === '4') {
        this.temp.tplId = ''
      }
    },
    handlerSyncAccountFans() {
      if (this.accountSelected == '') {
        this.$message({ message: '请选择公众号', type: 'warning' })
        return false
      }
      this.$confirm('确认需要同步菜单信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { 'id': this.accountSelected }
        syncAccountMenu(params).then(response => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '同步菜单成功，请稍后刷新数据查看',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleExpand() {
      this.expandAll = !this.expandAll
      this.expandAllTitle = this.expandAll ? '折叠全部' : '展开全部'
    }
  }

}
</script>
