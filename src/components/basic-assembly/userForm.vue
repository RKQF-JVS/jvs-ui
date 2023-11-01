<template>
  <div class="user-info-list">
    <div class="user-info-input-div">
      <el-input size="mini" ref="userSelectInput" :placeholder="getPlaceholder(type)" :disabled="disableBool" v-model="userStr" class="input-with-select" @focus="enableinputHandle">
        <div slot="append" v-if="!disableBool">
          <jvs-button icon="el-icon-search" type="info" :disabled="disableBool" @click="openDialog"></jvs-button>
          <jvs-button icon="el-icon-delete" type="warning" :disabled="disableBool" @click="clearUser"></jvs-button>
        </div>
      </el-input>
    </div>
<!--    <userSeletor-->
<!--      ref="userSelector"-->
<!--      :autoClose="true"-->
<!--      :selectable="selectable"-->
<!--      :deptable="deptable"-->
<!--      @submit="submit"-->
<!--      @cancel="cancel"-->
<!--    ></userSeletor>-->
    <userSeletor
      ref="userSelector"
      :user-enable="type === 'user'"
      :role-enable="type === 'role'"
      :dept-enable="type === 'department'"
      :group-enable="type === 'group'"
      :job-enable="type === 'job'"
      :current-active-name="type === 'department' ? 'dept' : type"
      :is-radio="!selectable"
      :dialog-title="getDialogTitle(type)"
      @submit="submit"
      @cancel="cancel"
    ></userSeletor>
  </div>
</template>

<script>
import userSeletor from './userSelector'
import { getUserInfoById, getUserInfoListByIds } from '@/api/admin/user'
import { getUserListAll, getRoleList, getPostList} from "../api";
import {getDeptList} from "@/views/upms/views/department/api";
export default {
  name: "user-info-list",
  components: { userSeletor },
  props: {
    form: {
      type: Object
    },
    type: {
      type: String
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
      // default: true
      default: false
    },
    disabled: {
      type: Boolean
    },
    deptable: {
      type: Boolean
    },
    props: {
      type: Object
    },
    resetRadom: {
      type: Number
    },
    infoable: {
      // 多选结果是否返回完整用户信息
      type: Boolean
    },
    userAllList: {
      type: Array
    },
    departmentList: {
      type: Array
    },
    roleOption: {
      type: Array
    },
    postList: {
      type: Array
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
      userStr: '',
      userList: [],
      tempList: [],
      userNameList: [],
      disableBool: false
    }
  },
  methods: {
    getDialogTitle(type) {
      if (type === 'user') {
        return '用户选择'
      }
      if (type === 'role') {
        return '角色选择'
      }
      if (type === 'department') {
        return '部门选择'
      }
      if (type === 'group') {
        return '群组选择'
      }
      if (type === 'job') {
        return '岗位选择'
      }
    },
    getPlaceholder(type) {
      if (type === 'user') {
        return '请选择用户'
      }
      if (type === 'role') {
        return '请选择角色'
      }
      if (type === 'department') {
        return '请选择部门'
      }
      if (type === 'group') {
        return '请选择群组'
      }
      if (type === 'job') {
        return '请选择岗位'
      }
    },
    submit (list) {
      if(this.selectable) {
        this.selectChange(list)
        this.$set(this, 'userStr', this.userNameList.join(','))
        if(this.infoable) {
          this.form[this.prop] = list
        }else{
          this.form[this.prop] = this.userList
        }
      }else{
        if(list && list.length > 0) {
          this.form[this.prop] = list[0].id
          this.$set(this, 'userStr', list[0].name)
          if(this.props) {
            this.form[this.props.label] = list[0].name
            this.form[this.props.value] = list[0].id
          }
        }
      }
      this.$emit('change', this.form)
    },
    selectChange (data) {
      let temp = []
      let nm = []
      for(let i in data) {
        temp.push(data[i].id)
        nm.push(data[i].name)
      }
      this.userList = temp
      this.userNameList = nm
    },
    cancel (bool) {
      this.$emit('cancel', bool)
    },
    openDialog () {
      this.tempList = []
      if (this.type === 'user' && this.userList.length > 0) {
        const arr = [...this.userList]
        this.$refs.userSelector.openDialog(arr)
        return
      }
      if (this.type === 'department' && this.userList.length > 0) {
        const arr = [...this.userList]
        getDeptList().then(res => {
          if (res.data && res.data.code == 0) {
            arr.forEach(item => {
              this.getSelectedDept(item, res.data.data)
            })
            this.$refs.userSelector.openDialog(this.tempList)
          }
        })
        return
      }
      if (this.type == 'role' && this.selectable && this.form[this.prop].length > 0) {
        if(this.roleOption && this.roleOption.length > 0) {
          let tprole = []
          this.roleOption.filter(ro => {
            if(this.form[this.prop].indexOf(ro.id) > -1) {
              tprole.push({id: ro.id, name: ro.roleName, type: 'role'})
            }
          })
          this.userList = tprole
          this.$refs.userSelector.openDialog([...this.userList])
          return
        }else{
          getRoleList().then(res => {
            if(res.data.code == 0) {
              let tprole = []
              res.data.data.filter(ro => {
                if(this.form[this.prop].indexOf(ro.id) > -1) {
                  tprole.push({id: ro.id, name: ro.roleName, type: 'role'})
                }
              })
              this.userList = tprole
              this.$refs.userSelector.openDialog([...this.userList])
              return
            }
          })
        }
      }
      if(this.type == 'job' && this.selectable  && this.form[this.prop].length > 0) {
        if(this.postList && this.postList.length > 0) {
          let tprole = []
          this.postList.filter(ro => {
            if(this.form[this.prop].indexOf(ro.id) > -1) {
              tprole.push({id: ro.id, name: ro.name, type: 'job'})
            }
          })
          this.userList = tprole
          this.$refs.userSelector.openDialog([...this.userList])
          return
        }else{
          getPostList().then(res => {
            if(res.data.code == 0) {
              let tprole = []
              res.data.data.filter(ro => {
                if(this.form[this.prop].indexOf(ro.id) > -1) {
                  tprole.push({id: ro.id, name: ro.name, type: 'job'})
                }
              })
              this.userList = tprole
              this.$refs.userSelector.openDialog([...this.userList])
              return
            }
          })
        }
      }
      this.$refs.userSelector.openDialog()
    },
    // 递归查询已选部门
    getSelectedDept(id, arr) {
      arr.forEach(item => {
        if (item.id === id) {
          this.tempList.push({id: item.id, name: item.name, type: item.extend.type})
        }
        if (item.children && item.children.length > 0) {
          this.getSelectedDept(id, item.children)
        }
      })
    },
    enableinputHandle () {
      if(this.enableinput === false) {
        this.openDialog()
        this.$refs.userSelectInput.blur()
      }
    },
    clearUser () {
      this.userStr = ""
      this.userList = []
      if(this.selectable) {
        this.form[this.prop] = []
      }else{
        this.form[this.prop] = null
        if(this.props) {
          this.$set(this.form, this.props.label, null)
        }
      }
      this.$emit('change', this.form)
    },
    eachDeptTree (list) {
      for(let i in list) {
        if(list[i].id == this.form[this.prop]) {
          this.userStr = list[i].name
          return false
        }
        if(list[i].children && list[i].children.length > 0) {
          this.eachDeptTree(list[i].children)
        }
      }
    }
  },
  mounted () {},
  created () {
    if(this.disabled === true) {
      this.disableBool = true
    }
    // this.userStr = this.form[this.prop + '_1']
    // 通过默认数据添加的人员仅存有id，由表单初始化获取所有用户列表进行匹配，只回显单个数据(多选暂不支持)
    if(this.type == 'user' && this.form[this.prop]) {
      if(this.selectable) {
        getUserInfoListByIds(this.form[this.prop]).then(res => {
          if(res.data && res.data.code == 0 && res.data.data) {
            this.userList = res.data.data
            res.data.data.filter(rit => {
              this.userNameList.push(rit.realName)
            })
            this.$set(this, 'userStr', this.userNameList.join(','))
          }
        })
      }else{
        getUserInfoById(this.form[this.prop]).then(res => {
          if(res.data && res.data.code == 0) {
            this.userStr = res.data.data.realName
          }
        })
      }
    }
    if(this.type == 'department' && this.form[this.prop]) {
      if(this.selectable) {
        let tpdept = []
        this.form[this.prop].filter(dit => {
          tpdept.push(dit[dit.length-1])
        })
        this.userList = tpdept
      }else{
        if(this.departmentList && this.departmentList.length > 0) {
          this.eachDeptTree(this.departmentList)
        }
      }
    }
    if (this.form.extend) {
      getUserListAll().then(res => {
        if (res.data && res.data.code == 0 && res.data.data) {
          const arr = [...res.data.data]
          const index = arr.findIndex(item => {
            return item.id === this.form.extend[this.prop]
          })
          this.userStr = arr[index].realName
        }
      })
      return
    }
    if(this.form[this.prop + '_1']) {
      this.userStr = this.form[this.prop + '_1']
      return
    }
    // 单选时通过props传入label，赋值给用户名，与id同级
    if (this.props) {
      if(this.form[this.props.label]) {
        this.userStr = this.form[this.props.label]
      }
    }
    // if(this.props) {
    //   if(this.form[this.props.label]) {
    //     this.userStr = this.form[this.props.label]
    //   }
    // }
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
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.clearUser()
        }
      }
    }
  },
};
</script>

<style lang="scss">
.user-info-box{
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  .user-dept-tree{
    width: 150px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .user-dept-tree::-webkit-scrollbar{
    display: none;
  }
  .user-table{
    flex: 1;
    margin-left: 10px;
    width: calc(100% - 200px);
    box-sizing: border-box;
    .el-card{
      box-shadow: none;
      border: 0;
    }
    .el-card__body{
      border: 0;
    }
    .table-body-box{
      height: calc(100% - 130px);
      overflow: hidden;
      .el-table{
        height: 100%;
        box-sizing: border-box;
       .el-table__body-wrapper{
         height: calc(100% - 75px)!important;
       }
       .el-table__header-wrapper{
         margin-top: 0;
       }
      }
    }
    .tablepagination{
      .el-pagination__sizes{
        .el-input__suffix{
          .el-input__icon.el-input__validateIcon{
            display: none;
          }
        }
      }
    }
  }
}

.table-form .jvs-table .el-table{
  .user-info-list{
    .input-with-select{
      flex-wrap: nowrap!important;
      .el-input__inner{
        width: calc(100% - 75px);
      }
      .el-input-group__append{
        display: table-cell!important;
        width: 82px;
        padding: 0;
        div{
          display: block!important;
          width: 100%;
          line-height: 26px;
        }
      }
    }
  }
}
.user-info-list-dialog{
  .el-dialog.is-fullscreen{
    position: relative;
    .el-dialog__header{
      padding: 0;
      height: 45px;
      display: flex;
      align-items: center;
      .el-dialog__title{
        font-size: 18px;
        font-weight: 600;
        margin-left: 30px;
        position: relative;
        padding-left: 20px;
      }
      .el-dialog__title::before{
        position: absolute;
        content: "";
        width: 4px;
        height: 18px;
        background: #3471ff;
        border-radius: 2px;
        cursor: pointer;
        left: 0;
        top: 4px;
        cursor: auto;
      }
      .el-dialog__headerbtn{
        top: 12px;
      }
    }
    .el-dialog__body{
      padding: 8px 10px;
      height: calc(100% - 45px);
      box-sizing: border-box;
      overflow: hidden;
      background: #F0F2F5;
      .el-form{
        .el-form-item{
          .el-form-item__label-wrap{
            .el-form-item__label{
              font-size: 14px;
            }
            .el-form-item__content{
              font-size: 14px;
            }
          }
          .el-button{
            font-size: 12px;
            // background-color: #409eff;
            // color: #fff;
            // border-color: #409eff;
          }
          .el-button--primary{
            background-color: #409eff;
            color: #fff;
          }
        }
      }
    }
  }
}
.el-form-item.is-error{
  .user-info-list{
    .el-input-group__append{
      border-color: #F56C6C;
      .el-button{
        color: #F56C6C;
      }
    }
  }
}
</style>
