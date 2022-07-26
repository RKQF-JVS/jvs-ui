<!-- 权限弹窗 -->
<template>
  <div class=''>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal='true'
      :close-on-press-escape='true'
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="form.roleName"
            placeholder="请输入角色名称"
            @blur="noRepeatName(form.roleName)"
            size="mini"
          ></el-input>
          <span class="el-form-item__error" v-if="disSubmit">名称重复</span>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input
            placeholder="请输入角色描述"
            type="textarea"
            v-model="form.roleDesc"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="display:flex;justify-content: center;"
      >
        <jvs-button
          size="mini"
          type="primary"
          :loading="submitLoading"
          @click="doSubmit"
          :disabled="disSubmit"
        >确 定</jvs-button>
        <jvs-button
          size="mini"
          @click="handleClose"
        >取 消</jvs-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { addRole, editRole } from './api'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    list: {
      type: Array
    }
  },
  data () {
    // 这里存放数据
    return {
      name:'',
      dialogVisible: false,
      title: '新增角色',
      method: '',
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空' }],
        roleDesc: [{ required: true, message: '角色描述不能为空' }]
      },
      disSubmit: false,
      submitLoading: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleClose () {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
        this.form = {
          roleName: '',
          roleDesc: ''
        }
      }
      this.dialogVisible = false
    },
    init (method, row) {
      this.method = method
      if (method === 'add') {
        this.title = "添加系统角色"
        this.form = {
          roleName: '',
          roleDesc: ''
        }
      } else if (method === 'edit') {
        this.title = "修改系统角色"
        this.name=row.roleName
        this.form = JSON.parse(JSON.stringify(row))
      }
      this.dialogVisible = true
    },
    doSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.method === 'add') {
            params.type = 'userRole'
            addRole(params).then(({ data }) => {
              if (data.code === 0) {
                this.submitLoading = false
                this.$message.success('添加角色成功')
                this.handleClose()
                this.$emit('reFresh')
              }
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            params.type = 'userRole'
            editRole(params).then(({ data }) => {
              if (data.code === 0) {
                this.submitLoading = false
                this.$message.success('修改角色成功')
                this.handleClose()
                this.$emit('reFresh')
              }
            }).catch(e => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 名称不可重复
    noRepeatName (name) {
      for(let i in this.list) {
        if(this.list[i].roleName == name && this.list[i].roleName!=this.name) {
          this.disSubmit = true
          return false
        }
      }
      this.disSubmit = false
    }
  }
}
</script>
