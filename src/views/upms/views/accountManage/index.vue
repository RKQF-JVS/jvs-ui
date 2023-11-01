<template>
  <div class="account-manage">
    <jvs-table
      :option="tableOption"
      :loading="tableLoading"
      :data="tableData"
      pageheadertitle="账号管理"
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
    >
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type='text' @click="editPassHandle(scope.row)">修改密码</jvs-button>
<!--        <jvs-button size="mini" type='text' v-if="!scope.row.cancelFlag" @click="disableHandle(scope.row)"><span style="color: #F56C6C;">删除</span></jvs-button>-->
        <jvs-button size="mini" type='text' v-if="!scope.row.cancelFlag" @click="disableHandle(scope.row)"><span style="color: #F56C6C;">注销</span></jvs-button>
        <jvs-button size="mini" type='text' v-else @click="disableHandle(scope.row)">恢复</jvs-button>
      </template>
      <template slot="headImg" slot-scope="scope">
        <img v-if="scope.row.headImg" :src="scope.row.headImg" alt="" style=" display: inline-block; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; " />
      </template>
      <template slot="tenantPo" slot-scope="scope">
        <div v-if="scope.row.tenantPo && scope.row.tenantPo.length == 1">{{ scope.row.tenantPo[0].name }}</div>
        <div v-else-if="scope.row.tenantPo && scope.row.tenantPo.length > 1">
          <el-popover
            placement="top"
            trigger="hover">
            <div slot="reference" class="customer-tenant">共{{scope.row.tenantPo.length}}个租户</div>
            <div style="display: flex;flex-direction: column">
              <div class="tenant-item" v-for="(item, key) in scope.row.tenantPo" :key="key">{{ item.name }}</div>
              <!--              <div class="org-menu-item" @click="handleCreateOrg">创建组织</div>-->
            </div>
          </el-popover>
        </div>
      </template>
    </jvs-table>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      append-to-body
      :visible.sync="passVisible"
      :close-on-click-modal="false"
      :before-close="passClose">
      <div v-if="passVisible" class="user-info-content-dialog">
        <jvs-form ref="passForm" :option="passOption" :formData="passForm" @submit="submitPassWord" @cancalClick="passClose">
        </jvs-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAccList, enableDisUser, setUserPassWord } from "./api";
import { encryption } from "@/util/util";
import {enCodePasswordKey} from "@/const/const"
export default {
  name: "account-manage",
  data() {
    var validatePassReg = (rule, value, callback) => {
      if(value && value.length < 16) {
        callback();
      }else{
        if(!value) {
          callback(new Error('请输入密码'));
        }else{
          callback(new Error('密码不能超过15位'));
        }
      }
    };
    var validateRePassReg = (rule, value, callback) => {
      if(value == this.passForm.password) {
        callback();
      }else{
        if(!value) {
          callback(new Error('请输入密码'));
        }else{
          callback(new Error('两次密码不一致'));
        }
      }
    };
    return {
      tableLoading: false,
      queryParams: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableData: [],
      tableOption: {
        showOverflow: true,
        addBtn: false,
        menu: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        search: true,
        page: true,
        cancal: false,
        column: [
          {
            label: "头像",
            prop: "headImg",
            display: false,
            type: "image",
            slot: true,
          },
          {
            label: "姓名",
            prop: "realName",
            searchSpan: 4,
            search: true,
          },
          {
            label: "账号",
            prop: "accountName",
            search: true,
            searchSpan: 4,
            rules: [
              { required: true, message: "请输入用户名", trigger: "blur" },
            ],
            // hide: store.getters.userInfo.adminFlag ? false : true,
            // search: store.getters.userInfo.adminFlag ? true : false,
          },
          {
            label: "性别",
            prop: "sex",
            searchSpan: 4,
            type: "select",
            dicData: [
              { label: "男", value: "male" },
              { label: "女", value: "female" },
              { label: "保密", value: "unknown" },
            ],
          },
          {
            label: "手机号",
            prop: "phone",
            searchSpan: 4,
            search: true,
            rules: [
              { required: true, message: "请输入手机号", trigger: ["blur"] },
            ],
          },
          {
            label: "邮箱",
            prop: "email",
            span: 6,
            rules: [
              { required: true, message: "请输入邮箱", trigger: ["blur"] },
              {
                type: "email",
                message: "请输入正确的邮箱地址",
                trigger: ["blur", "change"],
              },
            ],
          },
          {
            label: "租户组织",
            prop: "tenantPo",
            slot: true,
          },
          {
            label: "创建时间",
            prop: "createTime",
            // span: 6,
            display: false,
            type: "datePicker",
            datetype: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            sort: true,
            width: 100,
            span: 12,
          }
        ],
      },
      rowData: null,
      passVisible: false, // 修改密码弹框
      passForm: {},
      passOption: {
        cancal: true,
        submitLoading: false,
        emptyBtn: false,
        column: [
          {
            label: '密码',
            prop: 'password',
            showpassword: true,
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePassReg, trigger: 'blur'}
            ]
          },
          {
            label: '确认密码',
            prop: 'rePassword',
            showpassword: true,
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validateRePassReg, trigger: 'blur'}
            ]
          }
        ]
      },
    };
  },
  methods: {
    getList(page) {
      let query = {
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      this.tableLoading = true;
      let temp = JSON.parse(JSON.stringify(this.queryParams));
      getAccList(Object.assign(query, temp)).then((res) => {
        if (res.data.code == 0 && res.data.data) {
          this.page.total = res.data.data.total;
          this.page.currentPage = res.data.data.current;
          this.tableData = res.data.data.records;
          this.tableLoading = false;
        }
      });
    },
    searchChange(form) {
      this.queryParams = form;
      this.getList();
    },
    // 禁用 启用
    disableHandle (row) {
      let str = '注销'
      if(!row.cancelFlag) {
        str = '注销'
      }else{
        str = '恢复'
      }
      let tips = '确定'+str+'该用户？'
      if(!row.cancelFlag) {
        tips = ` 删除后，此用户将无法登录。确定删除此用户？`
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableDisUser(row.id, row.cancelFlag).then(res => {
          if (res.data.code==0) {
            this.$message.success(str + '用户成功')
            this.getList()
          }
        })
      }).catch(_ => {})
    },
    // 修改密码
    editPassHandle (row) {
      this.rowData = row
      this.passVisible = true
    },
    // 提交密码
    submitPassWord (form) {
      let temp = encryption({
        data: form,
        key: enCodePasswordKey, // enCodePasswordKey,
        param: ["password"]
      });
      temp = encryption({
        data: temp,
        key: enCodePasswordKey, // enCodePasswordKey,
        param: ["rePassword"]
      });
      this.passOption.submitLoading = true
      setUserPassWord(this.rowData.id, temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改密码成功')
          this.passOption.submitLoading = false
          this.passClose()
        }
      }).catch(e => {
        this.passOption.submitLoading = false
      })
    },
    // 关闭弹框
    passClose () {
      this.passForm = {}
      this.passVisible = false
    },
  },
};
</script>
<style lang="scss">
.customer-tenant{
  cursor: pointer;
}
.tenant-item{
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  padding: 6px 24px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 6px;
  &:hover{
    transition: 0.3s;
    background-color: #eff2f7;
  }
}
</style>
<style lang="scss" scoped>
</style>
