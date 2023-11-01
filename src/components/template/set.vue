<template>
  <el-dialog
    title="发布到模板"
    :visible.sync="templateVisible"
    :before-close="templateClose">
    <div v-if="templateVisible">
      <jvs-form :option="templateOption" :formData="templateData" @submit="publishTempSubmit" @cancalClick="templateClose"></jvs-form>
    </div>
  </el-dialog>
</template>
<script>
import {pubTemplate} from './api'
export default {
  name: 'template-set',
  props: {
    type: {
      type: String
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      // 发布到模板
      templateVisible: false,
      pubTempLoading: false,
      templateData: {},
      templateOption: {
        emptyBtn: false,
        cancal: true,
        formAlign: 'top',
        submitLoading: false,
        submitBtnText: '发布',
        column: [
          {
            label: '模板名称',
            prop: 'name',
            rules: [
              { required: true, message: '请输入模板名称', trigger: 'blur' },
            ]
          },
          {
            label: '模板分类',
            prop: 'category',
            type: 'select',
            multiple: false,
            dicUrl: '/mgr/jvs-auth/api/dict/type/design_template_type',
            rules: [
              { required: true, message: '请选择模板分类', trigger: 'change' },
            ]
          },
          {
            label: '封面',
            prop: 'cover',
            type: 'imageUpload',
            action: '/mgr/jvs-auth/upload/jvs-public',
            fileList: [],
            limit: 1,
            rules: [{required: true, message: '请上传封面', trigger: 'change'}],
            headers: {
              Authorization: 'Bearer '+ this.$store.getters.access_token
            }
          }
        ]
      }
    }
  },
  methods: {
    // 发布到模板
    init () {
      this.templateVisible = true
    },
    templateClose () {
      this.templateVisible = false
      this.templateData = {}
      this.templateOption.submitLoading = false
      this.templateOption.column[2].fileList = []
    },
    publishTempSubmit () {
      this.templateOption.submitLoading = true
      let temp = JSON.parse(JSON.stringify(this.templateData))
      if(this.templateData.cover && this.templateData.cover.length > 0) {
        temp.cover = this.templateData.cover[0].url
      }
      temp.designId = this.id
      temp.type = this.type
      pubTemplate(temp).then(res => {
        if(res.data && res.data.code == 0) {
          this.templateOption.submitLoading = false
          this.$message.success('发布成功')
          this.templateClose()
        }else{
          this.templateOption.submitLoading = false
        }
      }).catch(e => {
        this.templateOption.submitLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>