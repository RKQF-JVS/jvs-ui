<template>
  <div class="level-form-design">
    <el-tabs class="level-form-tab" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in levelOption.column"
        :key="'levelform'+item.name"
        :label="item.label"
        :name="item.name"
      >
        <formDesign
          type="level"
          :activeName="activeName"
          :levelOption="levelOption"
          :formdata="formdata[index]"
          :fields="fields"
          :isFlowable="isFlowable"
          :tableOption="tableOption"
          :flowableDom="flowableDom"
          :fineGrainedType="fineGrainedType"
          :masterTable="masterTable"
          :allTable="allTable"
          @setForm="setForm"
          @yulan="setdialogVisible"
          @updateForms="updateForms"
          @changeActiveForm="changeActiveForm"
          @save="save"
          @flowChange="flowChange"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="预览表单"
      :fullscreen="true"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      :append-to-body="appendToBodyBool"
    >
      <ShowFrom :type="type" :option="levelOption" @save="saveForm" @close="closeHandle" />
      <!-- :departmentList="departmentList"
      :userList="userList"
      :roleOption="roleOption"-->
    </el-dialog>
  </div>
</template>

<script>
// import dow from './dow'
import formDesign from './formDesign'
import Assembly from '../assembly'
import Forms from '../forms'
import AttrFrom from '../attributeform'
import ShowFrom from '../showForm'
// import {getRole, getUser, getDepartment} from '../api/fromDesign' 
export default {
  name: 'leveldesign',
  components: {
    Assembly, Forms, AttrFrom, ShowFrom, formDesign
  },
  props: {
    // 表单类型
    type: {
      type: String,
      default: 'level'
    },
    formdata: {
      type: Array
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    column: {
      type: Array
    },
    isFlowable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    tableOption: {
      type: Array
    },
    flowableDom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fineGrainedType: {
      type: String
    },
    masterTable: {
      type: String
    },
    allTable: {
      type: Array
    }
  },
  data () {
    return {
      levelOption: {
        column: [
          {
            label: '表单一',
            name: 'form1',
            defaultData: {}, // 表单默认值
            formOption: {
              column: []
            }
          },
          {
            label: '表单二',
            name: 'form2',
            defaultData: {}, // 表单默认值
            formOption: {
              column: []
            }
          }
        ]
      },
      // 预览弹框
      dialogVisible: false,
      // 弹框是否加到最外层
      appendToBodyBool: true,
      departmentList: [], // 部门列表
      userList: [], // 用户列表
      roleOption: [], // 角色列表
      formOption: {}, // 表单配置对象
    }
  },
  created () {
    if(this.column) {
      this.levelOption.column = this.column
    }
    if (this.levelOption.column&&this.levelOption.column.length>0) {
      this.activeName=this.levelOption.column[0].name
    }
    // 当传入props 值时 设置进入当前的data
    // this.getDepartmentHandle()
    // this.getUserHandle()
    // this.getRoleHandle()
  },
  mounted () {
  },
  methods: {
    // 切换表单
    handleClick (tab) {
      this.activeName = tab.name
      this.$forceUpdate()
    },
    // 设置对应form结构
    setForm (data) {
      let index=this.getFormIndexByActive()
      if (index>-1) {
        this.levelOption.column[index].formOption.column=data
        this.$forceUpdate()
      }
    },
    save (data) {
      let index = 0
      for(let i in this.levelOption.column) {
        if(this.levelOption.column[i].name == this.activeName) {
          index = i
        }
      }
      this.formdata[index] = data
      if(index == this.levelOption.column.length - 1) {
        this.$emit('save', {formdata: this.formdata, column: this.levelOption.column})
      }
    },
    saveForm (form) {
    },
    // 预览的 对话框
    setdialogVisible (bool) {
      if (bool) {
        this.dialogVisible=bool
      }
    },
    // 关闭预览
    handleClose () {
      this.dialogVisible=false
    },
    // 里层通知关闭弹框
    closeHandle (bool) {
      if (bool) {
        this.handleClose()
      }
    },
    // 修改表单项
    updateForms (data) {
      this.levelOption.column=data
      console.log(this.levelOption)
      this.$forceUpdate()
    },
    // 修改flowable设置
    flowChange (data) {
      this.$emit('flowChange', data)
    },
    // change activeName被修改
    changeActiveForm (str) {
      if(str) {
        this.activeName = str
      }else{
        this.activeName = this.levelOption.column[0].name
      }
    },
    // 获取当前对应表单结构对象索引
    getFormIndexByActive () {
      for (let i in this.levelOption.column) {
        if (this.levelOption.column[i].name==this.activeName) {
          return i
        }
      }
      return -1
    },
    // 获取部门
    getDepartmentHandle () {
      getDepartment(this.data? this.data.parameters:[]).then(res => {
        if (res.code===0) {
          this.departmentList=res.data
        }
      })
    },
    // 获取角色列表
    getRoleHandle () {
      getRole(this.data? this.data.parameters:[]).then(res => {
        if (res.code===0) {
          this.roleOption=[]
          for (let i in res.data) {
            let obj={
              label: res.data[i],
              value: res.data[i]
            }
            this.roleOption.push(obj)
          }
        }
      })
    },
    // 获取用户列表
    getUserHandle () {
      getUser(this.data? this.data.parameters:[]).then(res => {
        if (res.code===0) {
          this.userList=res.data
          // this.getRoleHandle() 
        }
      })
    },
  }
}
</script>

<style lang="scss">
.assembly-content {
  position: absolute;
  height: 100%;
  width: 100%;
  .el-card__body {
    padding: 0;
  }
}
.titleCol {
  // top: 60px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}
.titleCol::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.level-form-design {
  .el-tabs {
    margin-top: 10px;
    .el-tabs__header {
      // margin: 0 20px;
    }
  }
}
.el-tabs.level-form-tab{
  >.el-tabs__header{
    margin: 0;
    margin-left: 200px;
    border-bottom: 0;
    padding-top: 10px;
  }
}
.el-dialog{
  .el-tabs.level-form-tab{
  >.el-tabs__header{
    margin-left: 188px;
  }
}
}
</style>
