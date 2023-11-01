<template>
  <div>
    <!-- <el-row class="titleCol assembly-content">
      <Assembly
          :drag2="drag2"
          type="detail"
          @addcom="addcom"
          @setcom="setcom"
          @setdrag="setdrag"
          @deletecom="deletecom"
          @reset="reset"
        />
    </el-row> -->
    <el-row :gutter="10" style="position:relative;top:0px;width:100%;margin:0;">
      <el-col style="width:200px;height:calc(100% - 145px);position:fixed;left:5px;" class="titleCol">
        <Assembly
          :drag2="drag2"
          type="detail"
          @addcom="addcom"
          @setcom="setcom"
          @setdrag="setdrag"
          @deletecom="deletecom"
          @reset="reset"
        />
      </el-col>
      <el-col :span="15" style="position:fixed;left: 205px;width:calc(100% - 570px);">
        <Forms
          ref="forms"
          :fromData="data"
          :formsetting="formsetting"
          :drag1="drag1"
          :drag2="drag2"
          :com="com"
          title="详情表单设计"
          :formJson="formdata.formJson"
          @setdrag="setdrag"
          @reset="reset"
          @setdelcom="setdelcom"
          @addcom="addcom"
          @jiaohuan="jiaohuan"
          @setformcom="setformcom"
          @setdialogVisible="setdialogVisible"
          @save="save"
          @qingkong="qingkong"
          @downloadvue="downloadvue"
        />
      </el-col>
      <el-col
        :span="6"
        style="height:calc(100% - 145px);position:fixed;right:5px;padding-left:5px;width:360px;"
        class="titleCol"
      >
        <AttrFrom
          :fields="fields"
          :form="formcom"
          :formsetting="formsetting"
          :drag2="drag2"
          :formType="formType"
          :columnNameList="columnNameList"
          :tableOption="tableOption"
          :masterTable="masterTable"
          :allTable="allTable"
          @deletecom="deletecom"
        />
      </el-col>
    </el-row>
    <el-dialog
      title="预览表单"
      :fullscreen="formsetting.fullscreen"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      :append-to-body="appendToBodyBool"
    >
      <ShowFrom type="normal" :option="formOption" @save="saveForm" @close="closeHandle" />
      <!-- :departmentList="departmentList"
      :userList="userList"
      :roleOption="roleOption"-->
    </el-dialog>
  </div>
</template>

<script>
// import dow from './dow'
import Assembly from '../assembly'
import Forms from '../forms'
import AttrFrom from '../attributeform'
import ShowFrom from '../showForm'
// import {getRole, getUser, getDepartment} from '../api/fromDesign'
export default {
  name: 'formdesign',
  components: {
    Assembly, Forms, AttrFrom, ShowFrom
  },
  props: {
    formdata: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => {
        return [
          { label: '姓名', value: 'name' },
          { label: '年龄', value: 'age' },
        ]
      }
    },
    formType: {
      type: String,
      default: () => {
        return "detailForm"
      }
    },
    columnNameList: {
      type: Array
    },
    tableOption: {
      type: Array
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
      // 是否正在拖动左侧的组件 1 没有动  2 已经拖动没有进入中间的界面  3拖动进入中间的页面 4 进入设计页面中的组件
      drag1: '1',
      // 是否正在拖动中间的组件 1 没有动  2 已经拖动没有进度其他组件  3 进入其他组件
      drag2: '1',
      // 左边 被操作的组件
      com: {},
      // 中间正在被拖动的组件的 如果拖动到垃圾桶 将会删除它
      delcom: {},
      // 表单列表
      data: [],
      // 表单设置
      formsetting: {
        labelposition: 'top',
        labelwidth: 80,
        formsize: 'mini',
        fullscreen: true
      },
      // 中间被点击的组件
      formcom: {
        showFrom: [],
        rules: []
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
    // 当传入props 值时 设置进入当前的data
    if(this.formdata && this.formdata.forms) {
      this.data = this.formdata.forms
    }
    // this.getDepartmentHandle()
    // this.getUserHandle()
    // this.getRoleHandle()
  },
  mounted () {
  },
  methods: {
    // 左边的全部重置 左边的结束拖动时调用
    reset () {
      this.drag1='1'
      this.drag2='1'
      // 重置中间的横线
      this.$refs.forms.chonzhihxindex()
    },
    // 设置拖动状态
    setdrag (data) {
      this[data.type]=data.value
    },
    // 设置操作的组件
    setcom (data) {
      // console.log('最外层。。。。。')
      // console.log(data)
      this.com=data
    },
    // 设置被删除的组件
    setdelcom (data) {
      this.delcom=data
    },
    // 设置表单组件数据项
    setformcom (data) {
      this.formcom=data
    },
    // 清空
    qingkong () {
      this.data=[]
      this.formcom={
        showFrom: [],
        rules: []
      }
    },
    // 删除组件
    deletecom () {
      // 如果删除的是 被选中的 则把 选中的也清空
      if (this.delcom.prop===this.formcom.prop) {
        this.formcom={
          showFrom: [],
          rules: []
        }
      }
      this.data=this.data.filter(item => item.prop!==this.delcom.prop)
    },
    // 增加一个组件
    addcom (index=-1) {
      if (index==-1) {
        this.data.push(this.com)
      } else {
        this.data.splice(index, 0, this.com)
      }
    },
    // 交换位置
    jiaohuan (start, end) {
      let arr=this.data
      // JSON.parse(JSON.stringify(this.data))
      let aa=arr[start]
      if(Math.abs(start-end) == 1) {
        arr[start]=arr[end]
        arr[end]=aa
      }else{
        arr.splice(start, 1)
        arr.splice((end - 1) < 0 ? 0 : (end -1), 0, aa);
      }
      this.data=arr
    },
    // 保存
    save (formJson) {
      this.$emit('save', { formsetting: this.formsetting, forms: this.data, formJson: JSON.stringify(formJson), autoTableFields: this.columnNameList})
    },
    // 下载
    download (filename, text) {
      let element=document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display='none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    // 下载源码
    downloadvue () {
      let filename='hello.vue'
      let text=dow(this.formsetting, this.data)
      // console.log(text)
      this.download(filename, text)
    },
    saveForm (form) {
    },
    // 预览的 对话框
    setdialogVisible () {
      console.log(this.data)
      this.formOption={
        column: this.data
      }
      this.dialogVisible=true
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
.assembly-content{
  position: absolute;
  height: 100%;
  width: 100%;
  .el-card__body{
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
</style>
