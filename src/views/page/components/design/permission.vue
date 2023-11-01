<template>
  <div class="permission-box">
    <div class="permission-body">
      <div class="permission-header">
        <el-radio-group v-model="roleTypeTemp" @change="handleTypeChange">
          <el-radio :label="true">使用应用权限（所有功能都可使用）</el-radio>
          <el-radio :label="false">自定义权限</el-radio>
        </el-radio-group>
        <jvs-button type="primary" @click="addPermissionGroup" icon="el-icon-plus" :disabled="roleTypeTemp">添加权限组</jvs-button>
      </div>
      <div v-if="!roleTypeTemp" class="permission-content">
        <div class="loading" v-if="loading"></div>
        <div v-else class="permission-content-item" v-for="(item, key) in permissionList" :key="key">
          <div style="width: 100%; background-color: #DCDFE6;height: 1px;margin: 16px 0;"/>
          <el-form label-width="80px">
            <el-form-item label="选择角色">
              <el-select
                size="mini"
                style="width: calc(100% - 70px)"
                v-model="item.roleIds"
                filterable
                placeholder="请选择"
                multiple
                clearable
              >
                <el-option
                  v-for="it in options"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员">
              <el-select
                size="mini"
                style="width: calc(100% - 70px)"
                v-model="item.userIds"
                filterable
                placeholder="请选择"
                multiple
                clearable
              >
                <el-option
                  v-for="it in userList"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value">
                </el-option>
              </el-select>
              <!--                <div style="position: relative">-->
              <!--                  <el-tag-->
              <!--                    v-for="(item, key) in item.userList"-->
              <!--                    size="small"-->
              <!--                    style="margin-right: 4px;"-->
              <!--                    :key="key"-->
              <!--                    @close="handleDelUser(item.id)"-->
              <!--                    closable>-->
              <!--                    {{item.name}}-->
              <!--                  </el-tag>-->
              <!--                  <el-button size="mini" @click="handleUserSelectOpen(item, key)">添加</el-button>-->
              <!--                </div>-->
            </el-form-item>
            <el-form-item label="操作权限">
              <el-checkbox-group v-model="item.operation">
                <el-checkbox v-for="(op, key) in operationList" :key="key" :label="op">{{ op }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <i v-if="key !== 0" class="el-icon-delete del-btn" @click="deleteGroupItem(item)"></i>
        </div>
      </div>
    </div>
    <!--    <userSelector ref="userSelector" :selectable="true" :userIds="userIds" @submit="addCheckUSer"></userSelector>-->
  </div>
</template>

<script>
import UserSelector from "@/components/basic-assembly/userSelector";
import { getRoleList } from '@/api/common'
import {getUserListAll} from "../../../../api/common";
export default {
  name: "permission",
  components: {UserSelector},
  props: {
    permissionVisible: {
      type: Boolean,
      default: false
    },
    operationList: {
      type: Array,
      default() {
        return []
      }
    },
    roleType: {
      type: Boolean,
      default: true
    },
    role: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      key: null,
      roleTypeTemp: true,
      loading: true,
      permissionList: [],
      userIds: [],
      options: [],
      userList: [],
    }
  },
  watch: {
    permissionVisible(val) {
      if (val) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 表单数据初始化
    async initData() {
      this.loading = true
      this.roleTypeTemp = this.roleType
      await getRoleList().then(res => {
        if (res.data && res.data.code == 0) {
          this.options = res.data.data.map(item => {
            return { label: item.roleName, value: item.id }
          })
        }
      })
      await getUserListAll().then(res => {
        if (res.data && res.data.code == 0) {
          this.userList = res.data.data.map(item => {
            return { label: item.realName, value: item.id }
          })
        }
      })
      this.permissionList = this.role.length > 0 ? this.getRole([...this.role]) : [{
        roleIds: [],
        userIds: [],
        operation: [],
        userList: []
      }]
      this.loading = false
      // this.permissionList.forEach((item, key) => {
      //   const arr = []
      //   item.userIds.forEach(temp => {
      //     const index = this.userList.findIndex(user => {
      //       return user.id === temp
      //     })
      //     if (index !== -1) {
      //       arr.push(this.userList[index].realName)
      //     }
      //   })
      //   item.userList = arr
      // })
      this.$forceUpdate()
    },
    // 获取权限列表
    getRole(arr) {
      const arrTemp = [...arr]
      arrTemp.forEach((item, key) => {
        item.id = new Date().getTime() + key
      })
      return arrTemp
    },
    // 选择成员
    selectUser(e) {
      if (e) {
        this.$refs.userSelector.openDialog()
      }
    },
    // 打开人员选择组件
    handleUserSelectOpen(item, key) {
      this.userIds = item.userIds
      this.$refs.userSelector.openDialog()
      this.key = key
    },
    handleDelUser(item) {
      console.log(item)
    },
    // 添加人员 提交
    addCheckUSer(checkList) {
      this.permissionList[this.key].userIds = checkList.map(item => {
        return item.id
      })
      this.permissionList[this.key].userList = checkList.map(item => {
        return {name: item.realName, id: item.id}
      })
      this.$refs.userSelector.closeDialog()
    },
    // 权限类型 change
    handleTypeChange(e) {
      // this.permissionList = [{
      //   roleIds: [],
      //   userIds: [],
      //   operation: [],
      //   userList: []
      // }]
    },
    // 关闭权限设置弹框
    handleClosePermission() {
      this.permissionList = []
      this.$emit('handleClosePermission')
    },
    // 权限设置确认
    handleConfirm() {
      const arr = [...this.permissionList]
      const params = arr.map(item => {
        return {
          operation: item.operation,
          roleIds: item.roleIds,
          userIds: item.userIds
        }
      })
      this.$emit('submitPermission', params, this.roleTypeTemp)
      this.handleClosePermission()
    },
    // 添加权限组
    addPermissionGroup() {
      const obj = {
        id: new Date().getTime(),
        roleIds: [],
        userIds: [],
        operation: [],
        userList: []
      }
      this.permissionList.push(obj)
    },
    // 删除单个权限组
    deleteGroupItem(obj) {
      const index = this.permissionList.findIndex(item => {
        return item.id === obj.id
      })
      this.permissionList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.permission-box{
  .permission-body{
    padding: 0 20px;
    .permission-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .permission-content{
      margin-top: 8px;
      min-height: 240px;
      max-height: 50vh;
      overflow-y: auto;
      position: relative;
      .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url('../../../../../public/jvs-ui-public/img/loading.gif');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 300px 240px;
      }
      .permission-content-item{
        //min-height: 240px;
        position: relative;
        .del-btn{
          position: absolute;
          right: 20px;
          bottom: 0;
          cursor: pointer;
          font-size: 16px;
          &:hover{
            color: #3e78fd;
          }
        }
        .user-select{

        }
      }
    }
  }
}
</style>
