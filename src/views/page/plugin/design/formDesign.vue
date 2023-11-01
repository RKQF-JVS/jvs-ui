<template>
  <div class="form-design-box">
    <div class="designer">
      <div class="assembly-designer">
        <Assembly
          :drag2="drag2"
          :isDetail="isDetail"
          @addcom="addcom"
          @setcom="setcom"
          @setdrag="setdrag"
          @deletecom="deletecom"
          @reset="reset"
        />
      </div>
      <div class="form-designer">
        <Forms
          ref="forms"
          :fromData="data"
          :formsetting="formsetting"
          :drag1="drag1"
          :drag2="drag2"
          :com="com"
          :formJson="formdata.formJson"
          :freshBoolean="dialogVisible"
          :masterTable="masterTable"
          :jsqlJson="formdata.jsqlJson"
          :customizeJsqlJson="formdata.customizeJsqlJson"
          @deletecom="deletecom"
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
          @freshFormData="freshFormDataHandle"
          @setJSQL="setJSQLHandle"
        />
        <div class="tool-box">
          <el-tooltip effect="dark" content="一列" placement="right">
            <svg class="icon form-design-tool" aria-hidden="true" @click="getColumnNum(24)">
              <use xlink:href="#icon-column-vertical"></use>
            </svg>
          </el-tooltip>
          <el-tooltip effect="dark" content="两列" placement="right">
            <svg class="icon form-design-tool" aria-hidden="true" @click="getColumnNum(12)">
              <use xlink:href="#icon-column-horizontal"></use>
            </svg>
          </el-tooltip>
          <el-tooltip effect="dark" content="清空" placement="right">
            <i class="el-icon-delete form-design-tool" @click="qingkong()"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="attribute-designer">
        <AttrFrom
          :levelOption="levelOption"
          :fields="fields"
          :form="formcom"
          :formsetting="formsetting"
          :isDetail="isDetail"
          :drag2="drag2"
          :activeForm="activeName"
          :isFlowable="isFlowable"
          :flowableDom="flowableDom"
          :fineGrainedType="fineGrainedType"
          :columnNameList="columnNameList"
          :tableOption="tableOption"
          :allTable="allTable"
          :classifyDictList="classifyDictList"
          :systemDictList="systemDictList"
          :databaseName="selectDataSourceName"
          :isFlowDesign="isFlowDesign"
          :formType="formType"
          :domList="data"
          @deletecom="deletecom"
          @updateForms="updateForms"
          @flowChange="flowChange"
          @changeActiveForm="changeActiveForm"
          @getColumnNum="getColumnNum"
        />
      </div>
    </div>
    <el-dialog
      title="预览表单"
      :fullscreen="formsetting.fullscreen"
      :class="{'form-fullscreen-dialog': (formOption.fullscreen ? hasTabItem(formOption.fullscreen) : formOption.fullscreen)}"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      top="5vh"
      width="70%"
      :before-close="handleClose"
      :append-to-body="appendToBodyBool"
    >
      <ShowFrom type="normal" :option="formOption" @submit="saveForm" @close="closeHandle" />
    </el-dialog>
  </div>
</template>

<script>
// import dow from './dow'
import Assembly from '../assembly.vue'
import Forms from '../forms'
import AttrFrom from '../attributeform'
import ShowFrom from '../showForm'
import { getClassifyDict, getSystemDict } from '@/api/newDesign'
export default {
  name: 'formdesign',
  components: {
    Assembly, Forms, AttrFrom, ShowFrom
  },
  props: {
    // 表单类型
    type: {
      type: String,
      default: 'normal'
    },
    // 多级、步骤 表单配置
    levelOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单结构
    formdata: {
      type: Object
    },
    // 激活表单key
    activeName: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    isFlowable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否为列表页详情按钮
    isDetail: {
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
    columnNameList: {
      type: Array
    },
    masterTable: {
      type: String
    },
    allTable: {
      type: Array
    },
    selectDataSourceName: {
      type: String
    },
    isFlowDesign: {
      type: Boolean
    },
    formType: {
      type: String
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
        fullscreen: false
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
      classifyDictList: [],
      systemDictList: [],
      jsqlJson: '',
      customizeJsqlJson: ''
    }
  },
  created () {
    if(this.formdata) {
      this.data = this.formdata.forms
      this.formsetting = this.formdata.formsetting
      if(this.formsetting.submitBtn !== false) {
        this.$set(this.formsetting, 'submitBtn', true)
      }
      if(this.formsetting.emptyBtn !== false) {
        this.$set(this.formsetting, 'emptyBtn', true)
      }
      this.$set(this.formsetting, 'cancal', false)
    }
    // 分类字典
    this.getClassifyDictHandle()
    // 系统字典
    this.getSystemDictHandle()
  },
  mounted () {
    if (this.isDetail) {
      this.data.forEach(item => {
        item.disabled = true
      })
    }
  },
  methods: {
    getColumnNum(e) {
      this.data.forEach(item => {
        item.span = e
      })
    },
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
      data.disabled = this.isDetail
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
      if(!this.formcom.tips) {
        this.formcom.tips = {
          position: "right",
          text: ""
        }
      }
    },
    // 清空
    qingkong () {
      this.data=[]
      this.formcom={
        showFrom: [],
        rules: [],
        tips: {
          position: "right",
          text: ""
        }
      }
    },
    // 删除组件
    deletecom () {
      // 如果删除的是 被选中的 则把 选中的也清空
      if (this.delcom.prop===this.formcom.prop) {
        this.formcom={
          showFrom: [],
          rules: [],
          tips: {
            position: "right",
            text: ""
          }
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
      let data = JSON.parse(JSON.stringify(this.data))
      for(let i in data) {
        if(data[i].type == 'switch') {
          data[i].type = 'SWITCH'
        }
      }
      this.$emit('save', {
        formsetting: this.formsetting,
        forms: data,
        formJson: JSON.stringify(formJson),
        autoTableFields: this.columnNameList,
        isFlowable: this.isFlowable.isFlowable,
        flowableDom: this.flowableDom,
        customizeJsqlJson: this.customizeJsqlJson,
        jsqlJson: this.jsqlJson
      })
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
      console.log(form)
    },
    // 预览的 对话框
    setdialogVisible () {
      this.$emit('yulan', true)
      this.formOption = JSON.parse(JSON.stringify(this.formsetting))
      this.formOption.cancal =  false
      this.formOption.column = this.data
      this.formOption.formAlign = this.formOption.labelposition
      this.formOption.labelWidth = this.formOption.labelwidth == 'auto' ? this.formOption.labelwidth : (this.formOption.labelwidth + 'px')
      if(this.type == 'normal') {
        // console.log(this.formOption)
        this.dialogVisible=true
        // 流程设计器---预览时需调整外层弹框的关闭按钮 z-index
        let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
        if(dom) {
          dom.css({'z-index': 0})
        }
      }
    },
    // 关闭预览
    handleClose () {
      this.dialogVisible=false
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 9})
      }
    },
    // 里层通知关闭弹框
    closeHandle (bool) {
      if (bool) {
        this.handleClose()
      }
    },
    // 改变表单结构
    updateForms (data) {
      this.$emit('updateForms', data)
    },
    // 改变flowable设置
    flowChange (data) {
      this.$emit('flowChange', data)
    },
    // 改变激活表单key
    changeActiveForm (str) {
      this.$emit('changeActiveForm', str)
    },
    // 获取分类字典
    getClassifyDictHandle () {
      getClassifyDict().then(res => {
        if(res.data.code == 0) {
          this.classifyDictList = res.data.data
          // console.log(res.data.data)
        }
      })
    },
    getSystemDictHandle () {
      getSystemDict().then(res => {
        if(res.data.code == 0) {
          this.systemDictList = res.data.data
        }
      })
    },
    freshFormDataHandle(bool) {
      this.$emit("freshFormData", bool)
    },
    // 判断是否有tab组件
    hasTabItem (bool) {
      let result = bool
      if(this.formOption && this.formOption.column) {
        for(let i in this.formOption.column) {
          if(this.formOption.column[i].type == 'tab' && this.formOption.column[i].dicData && this.formOption.column[i].dicData.length > 4) {
            result = false
          }
          if(this.formOption.column[i].type == 'tableForm' && !this.formOption.column[i].editable) {
            result = false
          }
        }
      }
      return bool // result
    },
    setJSQLHandle (code) {
      this.customizeJsqlJson = code
    }
  },
  watch: {
    data: function () {
      this.$emit("setForm", this.data)
    },
    levelOption: function (newVal, oldVal) {
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss">
.form-design-box{
  height: 100%;
  overflow: hidden;
  .designer{
    height: 100%;
    overflow: hidden;
    display: flex;
    .el-card{
      border-radius: 0;
      .el-card__body{
        padding: 0;
      }
    }
    .assembly-designer{
      //width: 260px;
      width: 320px;
      height: 100%;
      overflow: hidden;
      .assemblycont{
        overflow-y: auto;
        background: #fff;
        width: 320px;
        .el-card__body{
          padding: 0;
        }
      }
      .assemblycont::-webkit-scrollbar{
        display: none;
      }
    }
    .form-designer{
      // flex: 1;
      position: relative;
      z-index: 1000;
      width: calc(100% - 640px);
      border-left: 1px solid #DCDFE6;
      border-right: 1px solid #DCDFE6;
      .tool-box{
        position: absolute;
        top: 5px;
        right: 1%;
        width: 20px;
        box-shadow: 0 0 10px rgba(25, 25, 25, 0.1);
        border-radius: 2px;
        background-color: #FFFFFF;
        padding: 5px;
        .form-design-tool{
          margin: 4px 0;
          font-size: 20px;
          cursor: pointer;
          color: #353535;
          &:hover{
            color: #0D76FC;
          }
        }
        .icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
          overflow: hidden;
          cursor: pointer;
        }
      }
      .el-card__header{
        display: none;
      }
      .el-card__body{
        // height: calc(100% - 56px);
        height: 100%;
      }
    }
    .attribute-designer{
      height: 100%;
      overflow: hidden;
      .attrcont{
        overflow-y: auto;
        background: #F6F6F6;
        .el-card__body{
        }
      }
      .attrcont::-webkit-scrollbar{
        display: none;
      }
      width: 320px;
      position: relative;
      z-index: 999;
      box-sizing: border-box;
      //padding-top: 20px;
      background: #fff;
      box-sizing: border-box;
      .el-tabs__item.is-active{
        color: #3471FF;
      }
      .el-tabs__active-bar{
        background-color: #3471FF;
      }
      .el-tabs{
        .el-tabs__header{
          margin: 0;
        }
      }
      //.el-tabs--border-card{
      //  background: none;
      //  border: 0;
      //  box-shadow: none;
      //  height: 100%;
      //  .el-tabs__header{
      //    background: #EEEEEE;
      //    border: 0;
      //    .is-active{
      //      //background: #3471FF;
      //      //color: #fff;
      //    }
      //    .el-tabs__item{
      //      border: 0;
      //    }
      //    .el-tabs__item:not(.is-disabled):hover {
      //      //background: #3471FF;
      //      //color: #fff;
      //    }
      //  }
      //  .el-tabs__content{
      //    background: none;
      //    height: calc(100% - 68px);
      //    overflow: hidden;
      //    overflow-y: auto;
      //  }
      //}
    }
  }
}
</style>
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
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}
.titleCol::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
