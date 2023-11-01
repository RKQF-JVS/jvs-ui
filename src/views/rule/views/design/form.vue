<template>
  <div>
    <el-form
      ref="form"
      size="small"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="名称" prop="name" :rules="[{required: true, message: '请输入逻辑名称', trigger: 'blur' }]">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="逻辑介绍"
        prop="content"
        :rules="[{required: true, message: '请输入逻辑介绍', trigger: 'blur'}]"
      >
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="调用类型" prop="externalEnable">
        <el-radio-group v-model="form.externalEnable">
          <el-radio :label="true">外部调用</el-radio>
          <el-radio :label="false">内部调用</el-radio>
        </el-radio-group>
        <!-- <span style="margin-left: 10px;">开启后将生成URL， 任何地方都可调用</span> -->
      </el-form-item>
      <el-form-item label="定时开关" prop="onTask">
        <el-switch
          v-model="form.onTask"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        <span v-if="false" style="margin-left: 10px;">提示：开关会自动控制操作xxl-job进行动态生成定时任务</span>
      </el-form-item>
      <el-form-item
        label="负责人"
        v-if="form.onTask === true"
        prop="author"
        :rules="[
          {
            required: true,
            message: '定时任务负责人不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item
        label="负责人邮箱"
        v-if="form.onTask === true"
        prop="alarmEmail"
        :rules="[
          {
            required: true,
            message: '负责人邮箱不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="form.alarmEmail"></el-input>
      </el-form-item>
      <el-form-item
        label="开始时间"
        v-if="form.onTask === true"
        prop="startTime"
        :rules="[
          { required: true, message: '开始时间不能为空', trigger: 'blur' },
        ]"
      >
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
          v-model="form.startTime"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="定时设置"
        v-if="form.onTask === true"
        prop="cron"
        :rules="[
          { required: true, message: '表达式不能为空', trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.cron"></el-input>
        <span>可选择自动生成，可直接输入cron表达式</span>
        <!-- ，在线生成参考https:www.pppet.net/ -->
      </el-form-item>
      <el-form-item v-if="form.onTask === true">
        <Crdss @setCron="setcron" />
      </el-form-item>
      <el-form-item label="最近5次运行时间" v-if="false && form.onTask === true">
        <p class="time-list-item" v-for="(item, index) in timeList" :key="item+'timeList'+index">{{item}}</p>
      </el-form-item>
      <el-row style="display:flex;justify-content: center;">
        <el-button type="primary" size="mini" @click="onSubmit('form')">保存</el-button>
        <el-button size="mini" @click="handleClose" style="margin-left: 10px">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Crdss from '../../components/cron'
import {setTask, saveOrUpdateDesign, getCronList} from '../../api/rule.js'
export default {
  name: 'set-form',
  props: {
    formData: {
      type: Object
    }
  },
  components: {
    Crdss
  },
  data () {
    return {
      form: {
        externalEnable: false
      },
      rules: {
        name: [
          { required: true, message: '逻辑名称不能为空', trigger: 'blur' }
        ]
      },
      timeList: []
    }
  },
  created(){
    if(this.formData.task) {
      this.form = JSON.parse(JSON.stringify(this.formData.task))
    }
    if(this.formData.name) {
      this.$set(this.form, 'name', this.formData.name)
    }
    if(this.formData.content) {
      this.$set(this.form, 'content', this.formData.content)
    }
    if(!this.form.externalEnable) {
      this.$set(this.form, 'externalEnable', false)
    }
  },
  methods: {
    setcron (data) {
      this.form.cron=data
      getCronList({startTime: this.form.startTime, cron: data}).then(res => {
        if(res.data.code == 0) {
          this.timeList = res.data.data
        } 
      })
    },
    sub () {
      this.query.current=1
      this.getData()
    },
    // 关闭
    handleClose () {
      this.$refs['form'].resetFields();
      this.$emit('close', true)
    },
    // 提交
    onSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading=true
          let temp = JSON.parse(JSON.stringify(this.formData))
          temp.task = JSON.parse(JSON.stringify(this.form))
          temp.name = this.form.name
          temp.content = this.form.content
          delete temp.task.name
          delete temp.task.content
          // console.log(temp)
          this.$emit('save', temp)
          // saveOrUpdateDesign(temp).then(res => {
          //   this.dialogVisible=false
          //   this.loading=false
          //   this.handleClose()
          //   this.$message.success('设置成功')
          // })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.time-list-item{
  margin: 0;
}
</style>