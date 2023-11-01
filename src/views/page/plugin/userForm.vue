<template>
  <div class="user-info-list">
    <div>
      <el-input size="mini" placeholder="请选择用户" :disabled="disableBool" v-model="userStr" class="input-with-select" @focus="enableinputHandle">
        <el-button slot="append" icon="el-icon-search" :disabled="disableBool" @click="openDialog"></el-button>
      </el-input>
    </div>
    <el-dialog
      title="选择用户"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
      width="90%"
      fullscreen
      class="user-info-list-dialog form-fullscreen-dialog"
    >
      <div class="user-info-box">
        <el-tree
          style="margin-top:10px"
          :data="treedata"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :loading="treeLoading"
          :props="defaultProps"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
          >
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
        <jvs-table
          class="user-table"
          :loading="tableLoading"
          :page="page"
          :option="option"
          :data="tableData"
          :selectable="selectable"
          @on-load="getList"
          @row-click="selectOne"
          @search-change="searchChange"
          @selection-change="selectChange"
        >
          <template slot="roleName" slot-scope="scope">
            <span>{{scope.row.roleName | formatRoleName}}</span>
          </template>
        </jvs-table>
      </div>
      <el-row style="margin-top:10px;display:flex;justify-content:center;align-items:center;">
        <jvs-button size="mini" type="primary" @click="submit">确定</jvs-button>
        <jvs-button size="mini" @click="cancel">取消</jvs-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getDeptList } from "../api/form";
export default {
  name: "user-info-list",
  components: {},
  props: {
    form: {
      type: Object
    },
    prop: {
      type: String
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    defaultValue: {
      type: String
    },
    enableinput: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  filters: {
    formatRoleName (list) {
      let str = ''
      if(list) {
        str = list.join(',')
      }
      return str
    }
  },
  data () {
    return {
      treedata: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        sort: 'sort'
      },
      treeLoading: false,
      selectOneId: '',
      queryParams: {},
      tableLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        viewBtn: false,
        addBtn: false,
        menu: false,
        selection: true,
        search: true,
        inline: true,
        showOverflow: true,
        isSearch: true,
        labelWidth: 'auto',
        searchBtnText: '查询',
        highlightCurrentRow: true,
        cancal: false,
        column: [
          {
            label: '用户名',
            prop: 'userName',
            span: 6,
            search: true,
            formSlot: true
          },
          {
            label: '用户真名',
            prop: 'realName',
            span: 6,
            rules: [
              { required: true, message: '请输入真名', trigger: 'blur' }
            ],
            // hide: true
          },
          {
            label: '昵称',
            prop: 'nickName',
            span: 6,
          },
          {
            label: '邮件',
            prop: 'email',
            span: 6,
            rules: [
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]
          },
          {
            label: '手机号',
            prop: 'phone',
            span: 6,
            search: true
          },
          {
            label: '角色',
            prop: 'roleName',
            span: 24,
            slot: true,
            display: false
          },
          {
            label: '角色',
            prop: 'roleIds',
            span: 24,
            dicData: [],
            multiple: true,
            hide: true,
            formSlot: true,
            props: {
              label: 'roleName',
              value: 'id'
            },
          },
          {
            label: '部门',
            prop: 'deptName',
            span: 24,
            formSlot: true
          },
          {
            label: '状态',
            prop: 'lockFlag',
            type: 'switch',
            span: 24,
            dicData: [
              { label: '未锁定', value: false },
              { label: '锁定', value: true }
            ],
            activetext: '锁定',
            inactivetext: '未锁定'
          }
        ]
      },
      selected: {},
      dialogVisible: false,
      userStr: '',
      userList: [],
      userNameList: [],
      disableBool: false
    }
  },
  methods: {
    getList (isFirst) {
      let obj={
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      if(this.selectOneId) {
        obj.deptId = this.selectOneId
      }
      this.tableLoading = true
      getUserList(obj).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
          this.tableLoading = false
          if(isFirst) {
            if(this.form[this.prop]) {
              if(this.selectable) {
                let temp = []
                for(let i in this.tableData) {
                  if(this.form[this.prop].indexOf(this.tableData[i].id) > -1) {
                    temp.push(this.tableData[i].realName) // userName
                  }
                }
                this.userStr = temp.join(',')
                this.userNameList = temp
                this.userList = this.form[this.prop]
              }else{
                this.userStr = this.form.realName
                for(let i in this.tableData) {
                  if(this.form[this.prop] == this.tableData[i].id) {
                    this.userStr = this.tableData[i].realName // userName
                  }
                }
              }
            }
          }
        }
      }).catch(e => {
        this.tableLoading = false
      })
    },
    selectOne (data) {
      this.selected = data.row
    },
    // 获取部门
    getTreeDept () {
      this.treeLoading = true;
      getDeptList().then(res => {
        if(res.data.code == 0) {
          this.treedata = this.getTree(res.data.data)
          this.treeLoading = false;
        }
      })
    },
    // 部门节点选中
    handleNodeClick (data, node, dom) {
      this.selectOneId = data.id
      this.getList()
    },
    // 递归树清掉空的childList
    getTree (tree = []) {
      let arr = [];
      if (tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.name = item.name;
          obj.id = item.id;
          obj.sort = item.sort
          obj.parentId = item.parentId
          if (item.childList && item.childList.length > 0) {
            obj.childList = this.getTree(item.childList);
          }
          arr.push(obj);
        });
      }
      return arr
    },
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    selectChange (data) {
      let temp = []
      let nm = []
      for(let i in data) {
        temp.push(data[i].id)
        nm.push(data[i].realName) // userName)
      }
      this.userList = temp
      this.userNameList = nm
    },
    submit () {
      if(this.selectable) {
        this.userStr = this.userNameList.join(',')
        this.form[this.prop] = this.userList
      }else{
        if(this.selected) {
          this.form[this.prop] = this.selected.id
          this.userStr = this.selected.realName // userName
        }
      }
      this.handleClose()
    },
    cancel () {
      this.$emit('cancel', true)
      this.handleClose()
    },
    openDialog () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    },
    enableinputHandle () {
      if(this.enableinput === false) {
        this.openDialog()
      }
    }
  },
  mounted () {},
  created () {
    this.getTreeDept()
    this.getList(true)
  },
  watch: {
    defaultValue: {
      handler (newVal, oldVal) {
        this.userStr = newVal
        if(newVal != '') {
          this.disableBool = true
        }else{
          this.disableBool = false
        }
        this.$forceUpdate()
      }
    }
  },
};
</script>

<style lang="scss">
.user-info-box{
  display: flex;
  width: 100%;
  overflow: hidden;
  .user-table{
    flex: 1;
    margin-left: 20px;
    .el-card{
      box-shadow: none;
    }
    .el-card__body{
      border: 0;
    }
  }
}
</style>