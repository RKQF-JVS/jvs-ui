<template>
<!--  <el-dialog-->
<!--    width="50%"-->
<!--    class="invitation-box-dialog"-->
<!--    title="链接/二维码邀请加入"-->
<!--    :visible.sync="dialogVisible"-->
<!--    :close-on-click-modal="false"-->
<!--    :before-close="handleClose">-->
<!--    <div class="invitation-box" v-if="dialogVisible">-->
<!--      <div class="left">-->
<!--        <h4>扫码邀请</h4>-->
<!--        <img v-if="img" :src="img" alt="">-->
<!--      </div>-->
<!--      <div class="right">-->
<!--        <h4>链接邀请</h4>-->
<!--        <section v-if="url">{{url}}</section>-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          :disabled="!url"-->
<!--          @click="onCopy"-->
<!--          v-clipboard:copy="url"-->
<!--          v-clipboard:success="onCopy"-->
<!--          v-clipboard:error="onError"-->
<!--          size="mini"-->
<!--        >复制链接</el-button>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div v-if="false" class="tips-text">-->
<!--      <p>管理员可在<span>设置-常规设置</span>中设置成员申请加入企业提交的信息</p>-->
<!--      <p>成员申请加入后，管理员可在<span>组织机构</span>中通过申请</p>-->
<!--    </div>-->
<!--    <el-row class="button-list" v-if="false">-->
<!--      <jvs-button size="mini" type="primary" @click="handleClose">确定</jvs-button>-->
<!--      <jvs-button size="mini" @click="handleClose">取消</jvs-button>-->
<!--    </el-row>-->
<!--  </el-dialog>-->
  <el-dialog
    width="660px"
    class="invitation-box-dialog"
    title="邀请加入"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div class="invitation-box" v-if="dialogVisible">
      <div class="invitation-header">
        <img v-if="$store.state.common.tenantInfo.logo" :src="$store.state.common.tenantInfo.logo" alt="">
        <div class="header-text">
          <div>{{$store.state.common.tenantInfo.name}}</div>
          <div style="color: #a2a3a5">开启邀请后可通过下列任意方式邀请员工加入组织</div>
        </div>
      </div>
      <div class="invitation-body">
        <div class="left">
          <div class="left-header">
            <div style="color: #333333;margin-bottom: 6px;">邀请码</div>
            <div style="color: #a2a3a5">员工可通过输入邀请码申请加入组织</div>
          </div>
          <div class="invite-code">{{ inviteCode }}</div>
          <div class="invite-btn">
            <el-button
              v-clipboard:copy="inviteContent"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="primary"
              size="mini">复制邀请码</el-button>
          </div>
        </div>
        <div class="right">
          <div style="padding: 20px 20px 15px">当前邀请有效期30分钟有效</div>
          <div style="padding: 15px 20px;display: flex;align-items: center;">
            <el-button type="text" @click="getInviteCode">重新生成</el-button>
            <svg class="help-entry" aria-hidden="true">
              <use xlink:href="#icon-help"></use>
            </svg>
          </div>
          <div style="padding: 15px 20px">需要管理员审核</div>
          <div style="padding: 15px 20px">
            <el-switch v-model="adminCheck" active-color="#3471FF" @change="handleChange"></el-switch>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {inviteUser, setInviteCodeCheck} from './api'
export default {
  name: 'invitation-box',
  data () {
    return {
      dialogVisible: false,
      adminCheck: false,
      img: '',
      url: '',
      inviteCode: '-',
      inviteContent: ''
    }
  },
  created () {
  },
  methods: {
    // 设置邀请码是否需要审核
    handleChange(e) {
      setInviteCodeCheck(e, this.inviteCode).then(res => {
        if (res.data && res.data.code == 0) {
          console.log(res.data.data)
        }
      })
    },
    // 获取邀请码
    getInviteCode() {
      inviteUser().then(res => {
        if (res.data && res.data.code ==0) {
          this.adminCheck = res.data.data.status
          this.inviteCode = res.data.data.code
          this.inviteContent = res.data.data.content || ''
          this.dialogVisible = true
        }
      })
    },
    openDialog () {
      this.getInviteCode()
      return
      let url = location.origin + '/#/inviteUser?'
      inviteUser({uri: url}).then(res => {
        if(res.data.code == 0) {
          if(res.data.data.base64) {
            this.img = res.data.data.base64
          }
          if(res.data.data.url) {
            this.url = res.data.data.url
          }
          this.dialogVisible = true
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    // 复制
    onCopy (e) {
      this.$message.success('复制成功')
      console.log(e.text)
    },
    onError (e) {
      this.$message.warning('复制失败')
      console.log(e)
    },
  }
}
</script>
<style lang="scss">
.invitation-box-dialog{
  .invitation-box{
    //border-bottom: 1px solid #DCDFE6;
    padding-top: 3px;
    //padding-bottom: 33px;
    .invitation-header{
      display: flex;
      margin-bottom: 20px;
      img {
        height: 40px;
      }
      .header-text{
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 40px;
        font-size: 12px;
      }
    }
    .invitation-body{
      display: flex;
      padding: 20px 10px;
      .left, .right{
      }
      .left{
        margin-right: 20px;
        width: 280px;
        //height: 240px;
        background-color: #f5f7fa;
        .left-header{
          padding: 20px 30px;
        }
        .invite-code{
          color: #333333;
          font-size: 24px;
          font-weight: bold;
          padding: 20px 30px;
        }
        .invite-btn{
          padding: 20px 30px;
        }
      }
      .right{
        padding: 0 20px;
        .help-entry{
          width: 16px;
          height: 16px;
          margin-left: 6px;
          cursor: pointer;
          fill: #878787;
        }
      }
    }
  }
  .tips-text{
    font-size: 14px;
    margin-top: 10px;
    p{
      margin: 0;
      line-height: 30px;
      height: 30px;
      span{
        color: #3471FF;
      }
    }
  }
  .button-list{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
