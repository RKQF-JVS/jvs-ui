<template>
  <div class="data-permision">
    <jvs-table
      :pageheadertitle="from == 'user' ? '' :'数据权限'"
      :option="option"
      :data="tableData"
      :page="page"
      :selectable="from == 'user' ? true : false"
      @on-load="getList"
      @delRow="delItem"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" type="primary" @click="addHandle(null)" v-if="from != 'user'">新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="addHandle(scope.row)">编辑</jvs-button>
      </template>
      <template slot="authority" slot-scope="scope">
        <!-- <span>{{getAuthorityString(scope.row)}}</span> -->
        <el-tag v-for="ritem in getAuthorityString(scope.row)" :key="ritem" style="margin-right:5px;">{{ritem}}</el-tag>
      </template>
    </jvs-table>
    <el-dialog
      :title="addEditTitle"
      width="75%"
      v-if="formVisible"
      :visible.sync="formVisible"
      :before-close="handleClose">
      <jvs-form :option="option" :formData="addForm" @submit="addSubmit">
        <template slot="customForm">
          <tableForm :item="{editable: true, delBtn: true}" :option="customOption" :data="customList" />
          <jvs-button size="mini" @click="addOne" style="margin-top:10px;">添加</jvs-button>
        </template>
        <template slot="deptForm">
          <div class="treebox" style="display: flex; align-items: center;height:28px;">
            <el-radio-group v-model="addForm.dept" size="mini">
              <el-radio label="all">所有部门</el-radio>
              <el-radio label="oneself">当前部门</el-radio>
              <el-radio label="subordinate">当前部门及以下</el-radio>
              <el-radio label="custom">自定义权限</el-radio>
            </el-radio-group>
            <div
              class="tree-auth"
              v-if="addForm.dept === 'custom'"
              style="margin-left: 10px"
            >
              <el-cascader
                v-model="deptIds"
                size="mini"
                :options="cascaderPptions"
                clearable
                :props="{
                  expandTrigger: 'hover',
                  multiple: true,
                  checkStrictly: true,
                }"
              >
              </el-cascader>
            </div>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAuthority, addAuthority, editAuthority, deleteAuthority} from './api'
import tableForm from '@/components/basic-assembly/tableForm'
import {getDeptList} from '../../api/system'
export default {
  name: 'data-permision',
  components: {tableForm},
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      loading: false,
      tableData: [],
      option: {
        page: true,
        search: true,
        addBtn: false,
        editBtn: false,
        menu: this.from == 'user' ? false : true,
        showOverflow: true,
        align: 'center',
        menuAlign: 'center',
        cancal: false,
        column: [
          {
            label: '标签名',
            prop: 'name',
            width: '100px'
          },
          {
            label: '描述',
            prop: 'annotation',
            hide: this.from == 'user' ? true : false
          },
          {
            label: '创建人',
            prop: 'createBy',
            addDisplay: false,
            editDisplay: false,
            display: false,
            hide: this.from == 'user' ? true : false
          },
          {
            label: '权限',
            prop: 'authority',
            addDisplay: false,
            editDisplay: false,
            display: false,
            slot: true,
            // hide: this.from == 'user' ? false : true
          },
          {
            label: '角色',
            prop: 'roleIds',
            hide: true,
            type: 'select',
            multiple: true,
            collapsetags: true,
            dicData: [],
            dicUrl: '/mgr/jvs-auth/role/all/userRole',
            props: {
            label: 'roleName',
            value: 'id'
        },
          },
          {
            label: '职位',
            prop: 'post',
            hide: true,
            type: 'select',
            multiple: true,
            collapsetags: true,
            dicData: [],
            dicUrl: '/mgr/jvs-auth/usermanager/post'
          },
          {
            label: '部门数据权限',
            prop: 'dept',
            hide: true,
            type: 'radio',
            formSlot: true,
            dicData: [
              {label: '所有部门', value: 'all'},
              {label: '当前部门', value: 'oneself'},
              {label: '当前部门及以下', value: 'subordinate'},
              {label: '自定义权限', value: 'custom'}
            ]
          },
          {
            label: '自定义权限',
            prop: 'custom',
            hide: true,
            formSlot: true
          },
          {
            label: "创建时间",
            prop: "createTime",
            span: 6,
            type: "datePicker",
            datetype: 'datetime',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            addDisplay: false,
            editDisplay: false,
            display: false,
            hide: this.from == 'user' ? true : false
          },
        ]
      },
      formVisible: false,
      addForm: {
        post: [],
        roleIds: []
      },
      customList: [],
      customOption: {
        addBtn: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '字段(表名.字段名)',
            prop: 'label'
          },
          {
            label: '值(使用逗号分割)',
            prop: 'value'
          },
          {
            label: '描述',
            prop: 'annotation'
          }
        ]
      },
      treeData: [],
      deptIds: [],
      cascaderPptions: [], // 所有部门结构
      addEditTitle: '新增'
    }
  },
  methods: {
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      getAuthority(Object.assign(obj, this.queryParams)).then(res => {
        if(res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
          this.$forceUpdate()
        }
      })
    },
    addHandle (row) {
      if(row) {
        this.addEditTitle = '编辑'
        let obj = JSON.parse(JSON.stringify(row))

        if(obj.roleIds) {
          obj.roleIds = JSON.parse(obj.roleIds)
        }else{
          obj.roleIds = []
        }
        this.addForm = obj
        if(this.addForm.post) {
          this.addForm.post = JSON.parse(this.addForm.post)
        }
        if(this.addForm.dept) {
          if(this.addForm.dept.startsWith('[')) {
            let temp = JSON.parse(this.addForm.dept)
            if(temp && temp instanceof Array) {
              this.addForm.dept = 'custom'
              this.deptIds = temp
            }
          }
        }
        if(this.addForm.custom) {
          this.customList = JSON.parse(this.addForm.custom)
        }
      }else{
        this.addEditTitle = '新增'
      }
      this.formVisible = true
    },
    delItem (row) {
      deleteAuthority(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    handleClose () {
      this.formVisible = false
      this.addForm = {
        post: [],
        roleIds: []
      }
      this.customList = [{}]
    },
    addOne () {
      this.customList.push({})
    },
    delOne (row, index) {
      this.customList.splice(index, 1)
    },
    // 获取部门
    getMenuTree () {
      getDeptList().then(res => {
        if(res.data.code == 0) {
          this.treeData = res.data.data
          this.formatTreeOfSelect(this.treeData, this.cascaderPptions)
        }
      })
    },
    // 格式化菜单数据为资源选择上级提供数据
    formatTreeOfSelect (list, result) {
      for (let i in list) {
        let obj={
          label: list[i].name,
          value: list[i].id,
        }
        if(list[i].childList) {
          obj.children = []
        }
        result.push(obj)
        if (list[i].childList && list[i].childList.length > 0) {
          this.formatTreeOfSelect(list[i].childList, obj.children)
        }
      }
    },
    // 新增  修改
    addSubmit (form) {
      let obj = JSON.parse(JSON.stringify(form))
      obj.post = JSON.stringify(obj.post)
      if(obj.dept == 'custom') {
        obj.dept = JSON.stringify(this.deptIds)
      }
      obj.custom = JSON.stringify(this.customList)
      if(this.addEditTitle == '新增') {
        addAuthority(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success(this.addEditTitle + '成功')
            this.getList()
            this.handleClose()
          }
        })
      }else{
        editAuthority(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success(this.addEditTitle + '成功')
            this.getList()
            this.handleClose()
          }
        })
      }
    },
    // 多选
    selectionChange (val) {
      this.$emit('selectionChange', val)
    },
    // 格式化权限信息
    getAuthorityString (row) {
      let arr = []
      if(row.post) {
        arr = arr.concat(arr, JSON.parse(row.post))
      }
      if(row.dept) {
        if(row.dept.startsWith('[') && JSON.parse(row.dept) instanceof Array) {
          arr = arr.concat(JSON.parse(row.dept))
        }else{
          arr.push(row.dept)
        }
      }
      if(row.custom) {
        let tp = JSON.parse(row.custom)
        for(let i in tp) {
          if(tp[i].label) {
            arr.push(tp[i].label)
          }
        }
      }
      // let str = arr.join(',')
      return arr // str
    }
  },
  created () {
    this.getMenuTree()
  }
}
</script>
<style lang="scss" scoped>
</style>
