<template>
  <div class="tenant-manage-box">
    <div class="tenant-manage">
      <jvs-table
        pageheadertitle='租户管理'
        :index="false"
        :page="page"
        :option="option"
        :data="tableData"
        :loading="tableLoading"
        @on-load="getList"
        @search-change="searchChange"
      >
        <template slot="menuLeft">
          <jvs-button type="primary" icon="el-icon-plus" size="mini" @click="editItem(null)" permisionFlag="">新增</jvs-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <jvs-button type="text" size="mini" @click="editItem(scope.row)" permisionFlag="">编辑</jvs-button>
<!--          <jvs-button type="text" size="mini" @click="openUser(scope.row)" permisionFlag="" v-if="tenantId !== scope.row.id">设置管理员</jvs-button>-->
          <jvs-button type="text" size="mini" @click="disableHandle(scope.row)" permisionFlag="" v-if="!scope.row.enable && isCurrentTenant(scope.row) && tenantId !== scope.row.id">启用</jvs-button>
          <jvs-button type="text" size="mini" @click="disableHandle(scope.row)" permisionFlag="" v-if="scope.row.enable && isCurrentTenant(scope.row) && tenantId !== scope.row.id">禁用</jvs-button>
          <jvs-button type="text" size="mini" @click="setAppItem(scope.row)" permisionFlag="">设置应用</jvs-button>
          <jvs-button type="text" size="mini" @click="delItem(scope.row)" permisionFlag="" v-if="!scope.row.enable && isCurrentTenant(scope.row)"><span style="color: #F56C6C;">删除</span></jvs-button>
        </template>
        <template slot="roleName" slot-scope="scope">
          {{ scope.row.roleName && scope.row.roleName.join(",") }}
        </template>
        <template slot="loginTypes" slot-scope="scope">
          {{scope.row.loginTypes | formatLoginType}}
        </template>
        <template slot="adminUserImg" slot-scope="scope">
          <img v-if="scope.row.adminUserImg" :src="scope.row.adminUserImg" alt="" style="display: inline-block;width: 40px;height: 40px;border-radius: 50%;overflow: hidden;">
        </template>
      </jvs-table>
    </div>
    <!-- 租户信息 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      fullscreen
      :title="title"
      append-to-body
      class="form-fullscreen-dialog no-header-dialog-tenant"
      :close-on-click-modal="false"
    >
      <tenantForm v-if="dialogVisible && dialogType == 'tenant'" :submitType="title == '新增' ? 'add' : 'edit'" :rowData="rowData" @close="closeHandle"></tenantForm>
      <appInfoForm v-if="dialogVisible && dialogType == 'app'" :rowData="rowData"></appInfoForm>
    </el-dialog>
    <userSelector
      ref="userSelector"
      :userEnable="true"
      :roleEnable="false"
      :currentActiveName="'user'"
      :isRadio="true"
      :dialogTitle="'人员选择'"
      @submit="addCheckUSer"
    />
  </div>
</template>
<script>
import { tableOption } from './option'
import store from "@/store";
import userSelector from '@/components/basic-assembly/userSelector'
import {setTenantManager} from './api'
import {
  getTenantList,
  deleteTenant,
  enableTenant,
  permissions,
  getPermision,
  getTenantDetail
} from '../../api/tenant.js'
import tenantForm from './tenantForm'
import appInfoForm from '../appBascSetting/appinfo'
export default {
  name: 'tenant-manage',
  components: { tenantForm, userSelector, appInfoForm },
  data () {
    return {
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: tableOption,
      tableData: [],
      title: '新增',
      dialogVisible: false,
      rowData: {},
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      userForm: {}, // 用户表单
      roleLsit: [], // 角色列表
      tableLoading: false,
      dialogType: '',
      tenantId: store.state.common.tenantId
    }
  },
  created () {
  },
  filters: {
    formatLoginType (list) {
      let dicData = [
        {label: '帐号密码', value: 'password'},
        {label: '手机号', value: 'phone'},
        {label: '微信二维码', value: 'wx_qr'},
        {label: 'APP二维码', value: 'app_qr'}
      ]
      let temp = []
      for(let i in list) {
        for(let j in dicData) {
          if(list[i] == dicData[j].value) {
            temp.push(dicData[j].label)
          }
        }
      }
      return temp.join(',')
    }
  },
  methods: {
    // 获取数据
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      this.tableLoading = true
      getTenantList(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
          this.tableLoading = false
        }
      })
    },
    /**
     * 搜索回调
     */
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    // 删除
    delItem (row) {
      this.$confirm('确定删除该租户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTenant(row.id).then(res => {
        if (res.data.code==0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
      }).catch(e => {})
    },
    // 编辑
    editItem (row) {
      this.rowData={}
      if (row) {
        // getTenantDetail(row.id).then(res => {
        //   if (res.data && res.data.code == 0) {
        //     console.log(res.data.data)
        //   }
        // })
        this.rowData = JSON.parse(JSON.stringify(row))
        this.rowData.password = '******'
        this.title='编辑'
      } else {
        this.title='新增'
        this.userForm = {
          loginTypes: []
        }
        this.rowData.defaultPassword = '123456'
      }
      this.dialogType = 'tenant'
      this.dialogVisible=true
    },
    // 关闭弹框
    handleClose () {
      this.dialogType = ''
      this.rowData = {}
      this.dialogVisible=false
      this.iconFileList = []
      this.bgFileList = []
      this.logoFileList = []
    },
    // 通知关闭
    closeHandle (bool) {
      if(bool) {
        this.handleClose()
        this.getList()
      }
    },
    disableHandle (row) {
      let str = '启用'
      if(row.enable) {
        str = '禁用'
      }
      this.$confirm('确认' + str +'该租户？').then(_ => {
        enableTenant(row.id, !row.enable).then(res => {
          if(res.data.code == 0) {
            this.$message.success(str + '成功')
            this.getList()
          }
        })
      }).catch(_ => {})
    },
    isCurrentTenant (row) {
      let id = row.id // Number.parseInt(row.id)
      let tid = this.$store.getters.userInfo.tenantId // Number.parseInt(this.$store.getters.userInfo.tenantId)
      let bool = true
      if(id === tid) {
        bool = false
      }
      bool = true // 当前租户可编辑自己！！！！！！！！！！！！！！！！！！！！！
      return bool
    },
    openUser (row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.$refs.userSelector.openDialog()
    },
    addCheckUSer (list) {
      if(list && list.length > 0) {
        setTenantManager(this.rowData.id, list[0].id).then(res => {
          if(res.data && res.data.code == 0) {
            this.$message.success('设置成功')
            this.getList()
            this.rowData = {}
          }
        })
      }
    },
    setAppItem (row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.title = '设置应用'
      this.dialogType = 'app'
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant-manage-box {
  height: 100%;
}
</style>
<style lang="scss">
.no-header-dialog-tenant{
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      // padding: 8px 10px;
      // background: #f0f2f5;
      left: 0;
      width: 100%;
      padding: 0;
      .el-card__body{
        background: #f0f2f5;
        padding: 0!important;
        .pageheader-top{
          padding: 10px;
          background: #fff;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
