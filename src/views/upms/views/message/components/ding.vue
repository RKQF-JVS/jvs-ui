<template>
  <div class="ding-dialog">
    <div v-if="dataLoading" class="loading-back"/>
    <el-form style="width: 520px;" size="mini" ref="ruleForm" :rules="rules" :model="dingForm" label-position="top" label-width="100px">
      <el-form-item label="收件人" prop="personnel">
        <el-input :disabled="isView" placeholder="请选择收件人" v-model="dingForm.personnel" @focus="handleSelectUser"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input :disabled="isView" placeholder="请输入消息内容" v-model="dingForm.content" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="!isView" class="footer-btn">
      <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
    </div>
    <UserSelector
      ref="userSelector"
      user-enable
      current-active-name="user"
      :is-radio="false"
      dialog-title="选择收件人"
      @submit="submit"
      @cancel="cancel"
    ></UserSelector>
  </div>
</template>

<script>
import UserSelector from "@/components/basic-assembly/userSelector";
import {getMessageDetail} from "@/views/upms/api/message";

export default {
  name: "ding",
  components: {UserSelector},
  props: {
    rowData: {
      type: Object,
      default () {
        return {}
      }
    },
    isAdd: {
      type: Boolean,
      default () {
        return false
      }
    },
    isView: {
      type: Boolean,
      default () {
        return false
      }
    },
  },
  data () {
    return{
      dataLoading: false,
      personnel: '',
      dingForm: {},
      searchOption: {},
      rules: {
        personnel: [
          { required: true, message: '请选择收件人', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    if (!this.isAdd) {
      this.init()
    }
  },
  methods: {
    // 初始化
    init() {
      this.dataLoading = true
      getMessageDetail(this.rowData.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.dingForm = JSON.parse(JSON.stringify(res.data.data))
          const arr = this.dingForm.recipients.map(item => {
            return item.name
          })
          this.$set(this.dingForm, 'personnel', arr.join(','))
        }
        this.dataLoading = false
      }).catch(err => {
        this.dataLoading = false
      })
    },
    submit (list) {
      this.dingForm.recipients = [...list]
      const arr = list.map(item => {
        return item.name
      })
      this.$set(this.dingForm, 'personnel', arr.join(','))
      this.$forceUpdate()
    },
    cancel (bool) {
    },
    handleSelectUser() {
      this.$refs.userSelector.openDialog(this.dingForm.recipients)
    },
    setContent(content) {
      this.dingForm.content = content
    },
    onSubmit() {
      this.$refs.ruleForm.validate((propValid) => {
        if (propValid) {
          const params = {
            sendType: 'DING_H5',
            recipients: this.dingForm.recipients,
            content: this.dingForm.content,
          }
          if (this.isAdd) {
            this.$emit('editSubmit', params)
          } else {
            delete this.dingForm.personnel
            this.$emit('editSubmit', this.dingForm)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ding-dialog{
  position: relative;
  padding: 0 40px;
  /deep/.el-input.is-disabled .el-input__inner{
    border: none;
    background-color: #fff;
    color: #333;
    cursor: default;
  }
  /deep/.el-textarea.is-disabled .el-textarea__inner{
    border: none;
    background-color: #fff;
    color: #333;
    cursor: default;
  }
  .loading-back{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.8);
    background-image: url('../../../../../../public/jvs-ui-public/img/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-position: center;
    background-size: 200px 160px;
    z-index: 2;
  }
}
</style>
