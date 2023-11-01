<template>
  <div class="app-permission-page">
    <div v-if="dataLoading" class="loading-back"/>
    <div class="set-permission">
      <jvs-button type="primary" @click="handleSetPermission">设置权限</jvs-button>
    </div>
    <div class="user-permission">
      <div class="user-title">
        <i class="el-icon-user"/>
        <span>人员</span>
      </div>
      <div class="user-list">
        <div class="user-list-item" v-for="(item, key) in userList" :key="key">
          <img :src="item.headImg" alt=""/>{{item.name}}
        </div>
      </div>
    </div>
    <div class="role-permission">
      <div class="role-title">
        <i class="el-icon-user"/>
        <span>角色</span>
      </div>
      <div class="role-list">
        <div class="role-list-item" v-for="(item, key) in roleList" :key="key">
          <el-tag>{{item.name}}</el-tag>
        </div>
      </div>
    </div>
    <div class="manager-permission">
      <div class="title">管理员权限</div>
      <span style="color:#a2a3a5;font-size: 14px;">为该应用配置管理员，应用管理员可以对应用进行编辑、设置、应用数据的管理。</span>
      <div class="role">
        <div class="role-box">
          <div class="role-title">应用主管理员</div>
          <span style="color:#a2a3a5;">应用主管理员拥有应用的管理权限，可进行应用搭建、编辑、设置以及数据管理，并对自己的应用进行授权管理。</span>
        </div>
        <div class="role-box">
          <div class="role-title">超级管理员</div>
          <span style="color:#a2a3a5;">超级管理员拥有所有的权限，并可设置角色，用户，可查看其它所有应用管理员创建的应用。</span>
        </div>
        <div class="role-box">
          <div class="role-title">使用人员</div>
          <span style="color:#a2a3a5;">根据应用管理员赋予的操作权限或数据权限只能使用指定的应用。未授权的应用将不能使用。</span>
        </div>
      </div>
    </div>
    <el-dialog
      class="template-dialog"
      title="权限设置"
      append-to-body
      :visible.sync="permissionVisible"
      :before-close="handlePermissionClose">
      <div v-if="permissionVisible">
        <div class="permission-content-item">
          <el-form label-width="80px">
            <div style="color: #a2a3a5;margin-bottom: 16px;">默认所有人都可以查看</div>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleUserSelectOpen(appInfo.role[0].personnels)">选择人员/角色</el-button>
            <div style="position: relative; padding: 10px 0">
              <el-tag
                v-for="tag in appInfo.role[0].personnels"
                size="small"
                style="margin-right: 4px;margin-bottom: 4px;"
                :key="tag.id"
                @close="handleDelUser(tag.id, appInfo.role[0].personnels)"
                closable>
                {{getTagName(tag)}}
              </el-tag>
            </div>
          </el-form>
        </div>
      </div>
      <div style="margin-top: 10px;text-align: center;">
        <jvs-button size="mini" type="primary" @click="handlePermissionSubmit">确定</jvs-button>
        <jvs-button size="mini" @click="handlePermissionClose">取消</jvs-button>
      </div>
    </el-dialog>
    <userSelector
      ref="userSelector"
      :selectable="true"
      :userEnable="true"
      :roleEnable="true"
      @submit="addCheckUSer">
    </userSelector>
  </div>
</template>

<script>
import UserSelector from "@/components/basic-assembly/userSelector";
import {getUserListAll} from "@/api/common";
import {edit} from "@/components/template/api";

export default {
  name: "appPermission",
  components: {UserSelector},
  props: {
    appInfo: {
      type: Object
    }
  },
  data () {
    return {
      permissionVisible: false,
      dataLoading: false,
      userList: [],
      roleList: [],
      userAll: [],
    }
  },
  created() {
    this.getPermission()
    console.log(this.appInfo)
  },
  methods: {
    // 添加人员 提交
    addCheckUSer(checkList) {
      this.$emit('addUser', checkList)
      this.$forceUpdate()
      this.$refs.userSelector.closeDialog()
    },
    // 权限数据提交
    handlePermissionSubmit(form) {
      edit(this.appInfo).then(res => {
        this.$message.success('设置成功！')
        this.permissionVisible = false
        this.getPermission()
      })
    },
    // 设置权限弹窗打开
    handleSetPermission() {
      this.permissionVisible = true
    },
    // 获取tag名字
    getTagName(obj) {
      let header = ''
      switch (obj.type) {
        case 'user':
          break;
        case 'role':
          header = '（角色）';
          break;
        default: break;
      }
      return header + obj.name
    },
    handleDelUser(id, arr) {
      const index = arr.findIndex(item => {
        return item.id === id
      })
      arr.splice(index, 1)
      this.$forceUpdate()
    },
    // 打开人员选择组件
    handleUserSelectOpen(item) {
      // this.userIds = item.userIds
      this.$refs.userSelector.openDialog(item)
    },
    // 关闭权限设置弹窗
    handlePermissionClose() {
      this.permissionVisible = false
      this.permissionData = {}
    },
    getPermission() {
      this.dataLoading = true
      const userList = []
      const roleList = []
      if (this.appInfo && this.appInfo.role && this.appInfo.role.length > 0) {
        this.appInfo.role[0].personnels.forEach(item => {
          if (item.type === 'user') {
            userList.push(item)
          }
          if (item.type === 'role') {
            roleList.push(item)
          }
        })
      }
      this.roleList = [...roleList]
      getUserListAll().then(res => {
        if (res.data && res.data.code == 0 && res.data.data) {
          this.userAll = [...res.data.data]
          userList.forEach(item => {
            this.userAll.forEach(it => {
              if (item.id === it.id) {
                item.headImg = it.headImg
              }
            })
          })
          this.userList = [...userList]
          this.dataLoading = false
        } else {
          this.dataLoading = false
        }
      }).catch(err => {
        this.dataLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-permission-page{
  position: relative;
  margin-top: 20px;
  .loading-back{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.8);
    background-image: url('../../../public/jvs-ui-public/img/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-position: center;
    background-size: 200px 160px;
    z-index: 1;
  }
  .set-permission{
    position: absolute;
    right: 20px;
    top: 0;
  }
  .user-permission{
    .user-title{
      font-size: 14px;
      i{
        margin-right: 10px;
      }
    }
    .user-list{
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      width: 80%;
      .user-list-item{
        width: 100px;
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          margin-right: 8px;
          border-radius: 30px;
        }
      }
    }
  }
  .role-permission{
    .role-title{
      font-size: 14px;
      i{
        margin-right: 10px;
      }
    }
    .role-list{
      display: flex;
      padding: 20px;
      .role-list-item{
        margin-right: 16px;
      }
    }
  }
  .manager-permission{
    padding: 20px;
    .title{
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .role{
      margin-top: 20px;
      .role-box{
        height: 100%;
        border: 1px solid #e7e7e7;
        margin-bottom: 30px;
        border-radius: 6px;
        padding: 15px;
        font-size: 14px;
        .role-title{
          margin-bottom: 12px;
        }
        //line-height: 30px;
      }
    }
  }
}
</style>
