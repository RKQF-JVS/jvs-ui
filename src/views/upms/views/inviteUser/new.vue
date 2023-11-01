<template>
  <!-- 2022.11.29 加入组织改版 -->
  <el-dialog
    :class="{'invite-user-box': true}"
    v-if="dialogVisible"
    append-to-body
    width="400px"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :style="tenantInfo.bgImg ? ('background-image: url('+ tenantInfo.bgImg +')' ): ''"
  >
    <div class="invite-content">
      <img v-if="$store.getters.userInfo.tenant.logo" :src="$store.getters.userInfo.tenant.logo" alt="">
      <div class="content-desc">
        <div style="font-weight: bold;margin-bottom: 6px;">加入组织</div>
        <div style="color: #a2a3a5">可通过组织管理员获取组织邀请码</div>
      </div>
      <div class="content-input">
        <jvs-form ref="basicForm" :option="option" :formData="form" @submit="submitHandle"></jvs-form>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {inviteCode} from "@/views/upms/views/inviteUser/api";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
  },
  data () {
    return {
      form: {},
      option: {
        cancal: false,
        emptyBtn: false,
        submitBtnText: '加入',
        submitLoading: false,
        column: [
          {
            label: '',
            prop: 'code',
            placeholder: '组织邀请码',
            rules: [{ required: true, message: "请输入组织邀请码", trigger: "blur" },]
          },
        ]
      },
      userInfo: {},
      tenantInfo: {},
      invite: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    submitHandle (form) {
      inviteCode(form.code).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success(res.data.msg)
          this.handleClose()
        }
      })
    },
  },
  created () {
  }
}
</script>
<style lang="scss">
.invite-user-box{
  background-size: cover;
  background-repeat: no-repeat;
  .el-dialog{
    .el-dialog__header{
      display: none!important;
    }
    .el-dialog__body{
      //padding: 0 20px;
      overflow: hidden;
    }
  }
  .invite-content{
    padding: 40px 0;
    .content-desc{
      margin-bottom: 20px;
    }
    .content-input{
      .el-button{
        width: 100%;
      }
    }
    img {
      height: 60px;
      margin: 20px 0 40px 0;
    }
  }
}
</style>
