<template>
  <div class="sms-dialog">
    <div v-if="dataLoading" class="loading-back"/>
    <el-form style="width: 520px;" size="mini" ref="ruleForm" :rules="rules" :model="smsForm" label-position="top" label-width="100px">
      <el-form-item label="收件人" prop="personnel">
<!--        <el-input show-word-limit placeholder="请输入收件人" v-model="smsForm.recipients"></el-input>-->
        <el-input :disabled="isView" placeholder="请选择收件人" v-model="smsForm.personnel" @focus="handleSelectUser"></el-input>
      </el-form-item>
      <el-form-item label="选择模板" prop="templateId">
        <el-select :disabled="isView" style="width: 100%" v-model="smsForm.templateId" placeholder="请选择模板" @change="handleTempChange">
          <el-option
            v-for="(item, key) in templateList"
            :key="key"
            :label="item.templateName"
            :value="item.templateCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细内容" prop="templateContent">
        <span style="color: #3471ff">{{templateContent}}</span>
      </el-form-item>
      <el-form-item label="参数名" prop="paramName">
        <el-form size="mini" ref="propForm" :rules="propRules" :model="smsForm.extension">
          <el-form-item v-for="(item, key) in propList" :key="key" :label="item" :prop="item">
            <el-input :disabled="isView" :placeholder="`请输入${item}`" v-model="smsForm.extension[item]"></el-input>
          </el-form-item>
        </el-form>
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
import {getShortMessageTempList} from "@/views/upms/views/shortMessageTemplate/api";
import UserSelector from "@/components/basic-assembly/userSelector";
import {getMessageDetail} from "@/views/upms/api/message";

export default {
  name: "sms",
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
      smsForm: {
        extension: {}
      },
      rules: {
        personnel: [
          { required: true, message: '请选择收件人', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择模板', trigger: 'blur' }
        ],
      },
      propRules: {},
      templateList: [],
      templateContent: '',
      propList: [],
      regularAll: /\${([a-zA-Z0-9]*)}/g, // ${}正则校验全匹配
      regular: /\${([a-zA-Z0-9]*)}/, // ${}
    }
  },
  created() {
    this.getTemplateList()
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
          this.smsForm = JSON.parse(JSON.stringify(res.data.data))
          const arr = this.smsForm.recipients.map(item => {
            return item.name
          })
          this.$set(this.smsForm, 'personnel', arr.join(','))
        }
        this.dataLoading = false
      }).catch(err => {
        this.dataLoading = false
      })
    },
    // 人员选择提交
    submit (list) {
      this.smsForm.recipients = [...list]
      const arr = list.map(item => {
        return item.name
      })
      this.$set(this.smsForm, 'personnel', arr.join(','))
      this.$forceUpdate()
    },
    // 人员选择取消
    cancel (bool) {
    },
    // 选择人员
    handleSelectUser() {
      this.$refs.userSelector.openDialog(this.smsForm.recipients)
    },
    // 表单提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.propForm.validate((propValid) => {
            if (propValid) {
              const params = {
                sendType: 'sms',
                recipients: this.smsForm.recipients,
                templateId: this.smsForm.templateId,
                extension: JSON.parse(JSON.stringify(this.smsForm.extension)),
              }
              if (this.isAdd) {
                this.$emit('editSubmit', params)
              } else {
                delete this.smsForm.personnel
                this.$emit('editSubmit', this.smsForm)
              }
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    // 模板选择 change
    handleTempChange(e) {
      const index = this.templateList.findIndex(item => {
        return item.templateCode === e
      })
      this.templateContent = this.templateList[index].templateContent
      this.propList = []
      if (this.templateContent.match(this.regularAll)) {
        this.templateContent.match(this.regularAll).forEach(item => {
          const key = item.match(this.regular)[1]
          if (key) {
            this.$set(this.smsForm.extension, key, '')
            this.$set(this.propRules, key, [
              { required: true, message: `请输入${key}`, trigger: 'blur' }
            ])
            this.propList.push(key)
          }
        })
      }
      this.$forceUpdate()
    },
    // 获取短信模板列表
    getTemplateList() {
      const params = {
        size: 20,
        current: 1,
      }
      getShortMessageTempList(params).then(res => {
        if (res.data && res.data.code == 0) {
          const tempList = res.data.data || []
          this.templateList = tempList.filter(item => {
            return item.auditStatus === 'AUDIT_STATE_PASS'
          })
          if (!this.isAdd) {
            this.templateList.forEach(item => {
              if (item.templateCode === this.rowData.templateId) {
                this.handleTempChange(item.templateCode)
                this.$set(this.smsForm, 'extension', this.rowData.extension)
              }
            })
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.sms-dialog{
  position: relative;
  padding: 0 40px;
  /deep/.el-input.is-disabled .el-input__inner{
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
