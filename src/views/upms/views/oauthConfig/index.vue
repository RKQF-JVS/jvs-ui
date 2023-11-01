<template>
  <div class="oauth-config-page">
    <div class="form-title">
      开起oauth登录配置
      <el-switch
        style="margin-left: 10px;"
        v-model="oauthForm.enable">
      </el-switch>
    </div>
    <el-alert
      :closable="false"
      type="info">
      <template slot="title">
        <div class="alert-box">
          <i class="el-icon-info"/>
          <span>开启oauth配置后，可通过其它系统免登跳转到本系统中。</span><span style="color: #3471ff;cursor: pointer;">如何获取配置</span>
        </div>
      </template>
    </el-alert>
    <el-form v-show="oauthForm.enable" style="width: 620px;" size="mini" ref="ruleForm" :rules="rules" :model="oauthForm" label-position="top" label-width="100px">
      <el-form-item label="用户同步接口地址" prop="userInfoUrl">
        <div class="relation-list">
          <el-input style="width: 420px;" show-word-limit placeholder="用户请求接口地址" v-model="oauthForm.userInfoUrl"></el-input>
          <div style="margin: 0 10px;width: 60px">请求方式</div>
          <el-select style="width: 90px" v-model="oauthForm.userSyncList.method">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="字段映射" prop="userSyncList">
        <div class="relation-list" v-for="(item, key) in propMappingList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.userSyncList[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
      <el-form-item label="用户字段映射关系" prop="userSyncList">
        <div class="relation-list" v-for="(item, key) in userMappingList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.userSyncList[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
      <el-form-item label="组织同步接口地址" prop="deptSyncUrl">
        <div class="relation-list">
          <el-input style="width: 420px;" show-word-limit placeholder="组织同步接口地址" v-model="oauthForm.deptSyncUrl"></el-input>
          <div style="margin: 0 10px;width: 60px">请求方式</div>
          <el-select style="width: 90px" v-model="oauthForm.deptSyncList.method">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="字段映射" prop="deptSyncList">
        <div class="relation-list" v-for="(item, key) in propMappingList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.deptSyncList[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
      <el-form-item label="组织同步映射关系" prop="deptSyncList">
        <div class="relation-list" v-for="(item, key) in deptSyncList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.deptSyncList[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
      <el-form-item label="身份标识获取用户信息接口地址" prop="authUserUrl">
        <div class="relation-list">
          <el-input style="width: 420px;" show-word-limit placeholder="身份标识获取用户信息接口地址" v-model="oauthForm.authUserUrl"></el-input>
          <div style="margin: 0 10px;width: 60px">请求方式</div>
          <el-select style="width: 90px" v-model="oauthForm.authUser.method">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="字段映射" prop="authUser">
        <div class="relation-list" v-for="(item, key) in authMappingList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.authUser[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
      <el-form-item label="身份标识获取用户信息映射关系" prop="authUser">
        <div class="relation-list" v-for="(item, key) in authUserList" :key="key">
          <el-input style="width: 200px" disabled show-word-limit :placeholder="item.label"></el-input>
          <div style="margin: 0 10px;width: 50px">等于</div>
          <el-input style="margin-right: 6px;" show-word-limit :placeholder="item.value" v-model="oauthForm.authUser[item.value]"></el-input>
          <div style="font-size: 12px; width: 0px; color: #a2a3a5">{{item.desc}}</div>
        </div>
      </el-form-item>
    </el-form>
    <div v-show="oauthForm.enable" class="footer-btn">
      <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>

import {getOauthConfig, saveOauthConfig} from "./api";
import store from "@/store";

export default {
  name: "OauthConfig",
  components: {
  },
  data () {
    const validateUserMapping = (rule, value, callback) => {
      let count = 0
      Object.keys(value).forEach(item => {
        if (value[item] == '') {
          count = 1
        }
      })
      if (count > 0) {
        count = 0
        callback(new Error('请完善表单'));
      } else {
        callback();
      }
    };
    const validateDeptSync = (rule, value, callback) => {
      let count = 0
      Object.keys(value).forEach(item => {
        if (value[item] == '') {
          count = 1
        }
      })
      if (count > 0) {
        count = 0
        callback(new Error('请完善表单'));
      } else {
        callback();
      }
    };
    const validateAuthUser = (rule, value, callback) => {
      let count = 0
      Object.keys(value).forEach(item => {
        if (value[item] == '') {
          count = 1
        }
      })
      if (count > 0) {
        count = 0
        callback(new Error('请完善表单'));
      } else {
        callback();
      }
    };
    return {
      propMappingList: [
        { label: '响应码', value: 'code', desc: 'String' },
        { label: '数据字段', value: 'data', desc: 'Array' },
      ],
      authMappingList: [
        { label: '响应码', value: 'code', desc: 'String' },
        { label: '数据字段', value: 'data', desc: 'Map' },
      ],
      userMappingList: [
        { label: '用户ID', value: 'id', desc: 'String' },
        { label: '用户名称', value: 'name', desc: 'String' },
        { label: '用户手机号', value: 'phone', desc: 'String' },
        { label: '用户邮箱', value: 'email', desc: 'String' },
        { label: '用户头像', value: 'headImg', desc: 'String' },
        { label: '用户性别', value: 'gender', desc: 'String' },
        { label: '部门编号', value: 'deptIds', desc: 'Array' },
      ],
      deptSyncList: [
        { label: '部门ID', value: 'deptId', desc: 'String' },
        { label: '部门名称', value: 'deptName', desc: 'String' },
        { label: '上级部门', value: 'parentId', desc: 'String' },
        { label: '排序', value: 'sort', desc: 'Integer' },
      ],
      authUserList: [
        { label: '入参-用户身份标识', value: 'reqAuthCode', desc: 'String' },
        { label: '用户id', value: 'id', desc: 'String' },
        { label: '用户名', value: 'name', desc: 'String' },
      ],
      oauthForm: {
        enable: false,
        // 用户字段映射关系对象
        userSyncList: {
          id: 'id',
          name: 'name',
          phone: 'phone',
          email: 'email',
          headImg: 'headImg',
          gender: 'gender',
          deptIds: 'deptIds',
          code: 'code',
          data: 'data',
          method: 'GET',
        },
        // 组织同步映射关系对象
        deptSyncList: {
          deptId: 'deptId',
          deptName: 'deptName',
          parentId: 'parentId',
          sort: 'sort',
          code: 'code',
          data: 'data',
          method: 'GET',
        },
        // 身份标识获取用户信息映射关系对象
        authUser: {
          reqAuthCode: 'reqAuthCode',
          id: 'id',
          name: 'name',
          code: 'code',
          data: 'data',
          method: 'GET',
        },
        userInfoUrl: '', // 用户同步接口地址
        deptSyncUrl: '', // 组织同步接口地址
        authUserUrl: '' // 身份标识获取用户信息接口地址
      },
      rules: {
        userInfoUrl: [
          { required: true, message: '请输入用户请求接口地址', trigger: 'blur' }
        ],
        deptSyncUrl: [
          { required: true, message: '请输入组织同步接口地址', trigger: 'blur' }
        ],
        authUserUrl: [
          { required: true, message: '请输入身份标识获取用户信息接口地址', trigger: 'blur' }
        ],
        // userSyncList: [
        //   { validator: validateUserMapping, trigger: 'blur' }
        // ],
        // deptSyncList: [
        //   { validator: validateDeptSync, trigger: 'blur' }
        // ],
        // authUser: [
        //   { validator: validateAuthUser, trigger: 'blur' }
        // ]
      },
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
      ]
    }
  },
  created() {
    this.getOauthConfig()
  },
  methods: {
    // 获取oauth配置信息
    getOauthConfig() {
      getOauthConfig().then(res => {
        if (res.data && res.data.code == 0) {
          // this.oauthForm = JSON.parse(JSON.stringify(res.data.data))
          console.log(res.data.data)
          const data = JSON.parse(JSON.stringify(res.data.data))
          this.$set(this.oauthForm, 'enable', data.enable == 'true')
          // this.$set(this.oauthForm, 'userSyncList', data && data.userSyncList ? data.userSyncList : this.oauthForm.userSyncList)
          // this.$set(this.oauthForm, 'deptSyncList', data && data.deptSyncList ? data.deptSyncList : this.oauthForm.deptSyncList)
          // this.$set(this.oauthForm, 'authUser', data && data.authUser ? data.authUser : this.oauthForm.authUser)
          this.$set(this.oauthForm, 'userSyncList', data && data.userSyncList ? Object.assign(this.oauthForm.userSyncList, data.userSyncList) : this.oauthForm.userSyncList)
          this.$set(this.oauthForm, 'deptSyncList', data && data.deptSyncList ? Object.assign(this.oauthForm.deptSyncList, data.deptSyncList) : this.oauthForm.deptSyncList)
          this.$set(this.oauthForm, 'authUser', data && data.authUser ? Object.assign(this.oauthForm.authUser, data.authUser) : this.oauthForm.authUser)
          this.$set(this.oauthForm, 'userInfoUrl', data && data.userSyncList ? data.userSyncList.reqUrl : this.oauthForm.userInfoUrl)
          this.$set(this.oauthForm, 'deptSyncUrl', data && data.deptSyncList ? data.deptSyncList.reqUrl : this.oauthForm.deptSyncUrl)
          this.$set(this.oauthForm, 'authUserUrl', data && data.authUser ? data.authUser.reqUrl : this.oauthForm.authUserUrl)
          this.$forceUpdate()
        }
      })
    },
    // 设置默认值
    setDefaultValue(params) {
      Object.keys(params).forEach(item => {
          if (['userSyncList', 'deptSyncList', 'authUser'].indexOf(item)) {
            Object.keys(params[item]).forEach(it => {
              if (params[item][it] == '') {
                params[item][it] = it
              }
            })
          }
      })
      return params
    },
    onSubmit() {
      const tenantId = store.state.common.tenantId
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.oauthForm))
          params.userSyncList.reqUrl = this.oauthForm.userInfoUrl
          params.deptSyncList.reqUrl = this.oauthForm.deptSyncUrl
          params.authUser.reqUrl = this.oauthForm.authUserUrl
          delete params['userInfoUrl']
          delete params['deptSyncUrl']
          delete params['authUserUrl']
          // console.log(this.setDefaultValue(params))
          // return
          saveOauthConfig(this.setDefaultValue(params), tenantId).then(res => {
            if (res.data && res.data.code == 0) {
              this.$message.success('保存成功')
              this.getOauthConfig()
            }
          })
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.oauth-config-page {
  padding: 40px;
  border-radius: 6px;
  background-color: #ffffff;
  height: calc(100vh - 80px);
  overflow-y: auto;
  /deep/.el-form-item{
    padding: 0 32px;
  }
  /deep/.el-alert--info.is-light{
    width: 50%;
    margin-bottom: 12px;
  }
  .relation-list{
    display: flex;
    margin-bottom: 16px;
    :last-child{
      margin-bottom: 0;
    }
  }
  .alert-box{
    i{
      margin-right: 8px;
      color: #3471ff;
    }
  }
  .form-title{
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 16px;
  }
  .footer-btn{
    //width: 100%;
    //text-align: center;
  }
}
</style>
