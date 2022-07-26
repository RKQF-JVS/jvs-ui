<template>
  <el-dialog
    class="invitation-box-dialog"
    title="链接/二维码邀请加入"
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <div class="invitation-box" v-if="dialogVisible">
      <div class="left">
        <h4>扫码邀请</h4>
        <img v-if="img" :src="img" alt="">
      </div>
      <div class="right">
        <h4>链接邀请</h4>
        <section v-if="url">{{url}}</section>
        <el-button
          type="primary"
          :disabled="!url"
          @click="onCopy"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          size="mini"
        >复制链接</el-button>
      </div>
    </div>
    <div v-if="false" class="tips-text">
      <p>管理员可在<span>设置-常规设置</span>中设置成员申请加入企业提交的信息</p>
      <p>成员申请加入后，管理员可在<span>组织机构</span>中通过申请</p>
    </div>
    <el-row class="button-list">
      <jvs-button size="mini" type="primary" @click="handleClose">确定</jvs-button>
      <jvs-button size="mini" @click="handleClose">取消</jvs-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { inviteUser } from './api'
export default {
  name: 'invitation-box',
  data () {
    return {
      dialogVisible: false,
      img: '',
      url: ''
    }
  },
  methods: {
    openDialog () {
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
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
  }
}
</script>
<style lang="scss">
.invitation-box-dialog{
  .invitation-box{
    border-bottom: 1px solid #DCDFE6;
    padding-top: 3px;
    padding-bottom: 33px;
    display: flex;
    .left, .right{
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      h4{
        font-size: 18px;
        color: #333333;
        text-align: center;
        margin: 0;
        font-weight: normal;
      }
    }
    .left{
      img{
        display: block;
        width: 150px;
        height: 150px;
        margin-top: 15px;
      }
    }
    .right{
      section{
        color: #BFBFBF;
        margin: 42px 0;
        font-size: 14px;
        line-height: 24px;
      }
      .el-button{
        padding: 10px 50px;
        font-size: 16px;
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