<template>
  <div class="dictionaries-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle='字典管理'
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" permisionFlag="upms_dict_items_page" @click="setHandle(scope.row)">字典项</jvs-button>
      </template>
    </jvs-table>
    <el-dialog
      :title="rowData.type"
      fullscreen
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-button size="mini" type="primary" permisionFlag="upms_dict_items_save" @click="addOne" style="margin-bottom:10px;">添加</jvs-button>
      <tableForm :item="{editable: true, delBtn: true}" :option="sysDicOption" :data="sysDictItem" @setTable="setTableHandle">
        <template slot="menuBtn" slot-scope="scope">
          <jvs-button size="mini" type="text" permisionFlag="upms_dict_items_save" @click="delOne(scope.row, scope.index)">删除</jvs-button>
        </template>
      </tableForm>
      <el-row v-if="$permissionMatch('upms_dict_items_save')" style="margin-top:10px;display:flex;justify-content: center;align-items:center;">
        <jvs-button size="mini" type="primary" @click="saveHandle">保存</jvs-button>
        <jvs-button size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {getDictionaries, addDict, editDict, delDict, getDicItem, addDicItem} from './api'
import tableForm from '@/components/basic-assembly/tableForm'
export default {
  name: 'dictionaries-manage',
  components: {tableForm},
  data () {
    return {
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {}, // 行数据
      tableData: [],
      tableOption: {
        align: 'center',
        menuAlign: 'center',
        showOverflow: true,
        search: true,
        addBtn: this.$permissionMatch("upms_dict_add"),
        editBtn: this.$permissionMatch("upms_dict_edit"),
        viewBtn: this.$permissionMatch("upms_dict_view"),
        delBtn: this.$permissionMatch("upms_dict_delete"),
        cancal: false,
        page: true,
        submitLoading: false,
        column: [
          {
            label: '字典类型',
            prop: 'system',
            type: 'select',
            dicData: [
              { label: '系统内置', value: 'SYSTEM', tip: '可控制数据表的状态，如待支付、支付、已发货等' },
              { label: '业务类型', value: 'BIZ', tip: '业务服务中完全自定义,可能会与它类型重复' },
              // { label: '数据权限', value: 'DATA',tip: '系统内置功能将不允许删除，不允许修改' }
            ],
            // filterable: true,
            // allowcreate: true,
            searchSpan: 4,
            search: true,
            rules: [{ required: true, message: '请选择或输入字典类型', trigger: ['blur', 'change'] }]
          },
          {
            label: '类型',
            prop: 'type',
            rules: [{ required: true, message: '请输入类型', trigger: 'blur' }],
            search: true,
            searchSpan: 4,
            tips: {
              position: 'bottom',
              text: '类型，建议使用英文名'
            }
          },
          {
            label: '描述',
            prop: 'description',
            search: true,
            searchSpan: 4,
            rules: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          },
          {
            label: '备注',
            prop: 'remarks',
            type: 'textarea'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            addDisplay: false,
            editDisplay: false
          },
           {
            label: '创建人',
            prop: 'createBy',
            addDisplay: false,
            editDisplay: false
          },
        ]
      },
      dialogVisible: false,
      sysDictItem: [{}], // 字典项
      sysDicOption: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        align: 'center',
        menuAlign: 'center',
        size: 'mini',
        column: [
          {
            label: '数据值',
            prop: 'value'
          },
          {
            label: '标签名',
            prop: 'label'
          },
          {
            label: '描述',
            prop: 'description'
          }
        ]
      },
    }
  },
  methods: {
    getList (page) {
      let query={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      this.tableLoading = true
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      getDictionaries(Object.assign(query, temp)).then(res => {
        if (res.data.code==0) {
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableData=res.data.data.records
          this.tableLoading = false
        }
      })
    },
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 新增
    addRowHandle (row) {
      this.tableOption.submitLoading = true
      addDict(row).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增字典成功')
          this.tableOption.submitLoading = false
          this.getList()
        }
      }).catch(e => {
        this.tableOption.submitLoading = false
      })
    },
    // 修改
    editRowHandle (row) {
      this.tableOption.submitLoading = true
      editDict(row).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改字典成功')
          this.tableOption.submitLoading =false
          this.getList()
        }
      }).catch(e => {
        this.tableOption.submitLoading = false
      })
    },
    // 删除
    delRowHandle (row) {
      delDict(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除字典成功')
          this.getList()
        }
      })
    },
    // 配置 字典项
    setHandle (row) {
      this.rowData = row
      getDicItem(row.id).then(res => {
        if(res.data.code == 0) {
          this.sysDictItem = res.data.data
          if(this.sysDictItem.length == 0) {
            this.sysDictItem.push({})
          }
          this.dialogVisible = true
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    addOne () {
      this.sysDictItem.push({})
    },
    delOne (row, index) {
      this.sysDictItem.splice(index, 1)
    },
    saveHandle () {
      addDicItem(this.rowData.id, this.sysDictItem).then(res => {
        if(res.data.code == 0) {
          this.$message.success('配置字典项成功')
          this.getList()
          this.handleClose()
        }
      })
    },
    setTableHandle (data) {
      this.sysDictItem = data
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
