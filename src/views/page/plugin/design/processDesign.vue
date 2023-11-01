<template>
  <div class="cont form-design-box process-form-design">
    <div class="designer">
      <div class="assembly-designer">
        <Assembly
          :drag2="drag2Public"
          :currentDelDesignType="currentDelDesignType"
          @addcom="addcom"
          @setcom="setcom"
          @setdrag="setdragPublic"
          @deletecom="deletecom"
          @reset="resetPublic"
        />
      </div>
      <div class="form-designer">
        <div class="detailForm">
          <Forms
            ref="detailforms"
            :fromData="detailData"
            :formsetting="formsetting"
            :drag1="detaildrag1"
            :drag2="detaildrag2"
            :com="com"
            @setdrag="setdetaildrag"
            @reset="resetPublic"
            @setdelcom="detailsetdelcom"
            @addcom="addcom"
            @jiaohuan="jiaohuanDetail"
            @setformcom="detailsetformcom"
            @setdialogVisible="setdialogVisible"
            @save="save"
            @qingkong="qingkong"
            @downloadvue="downloadvue"
            :action="action"
            :title="'基本信息'"
            :needBtn="true"
            :designnerType="'infoForm'"
            :clickformcom="clickformcom"
            @designtype="designtypeHandle"
          />
        </div>
        <div class="subform">
          <Forms
            ref="subforms"
            :fromData="data"
            :formsetting="formsetting"
            :drag1="drag1"
            :drag2="drag2"
            :com="com"
            @setdrag="setdrag"
            @reset="resetPublic"
            @setdelcom="setdelcom"
            @addcom="addcom"
            @jiaohuan="jiaohuan"
            @setformcom="setformcom"
            @setdialogVisible="setdialogVisible"
            @save="save"
            @qingkong="qingkong"
            @downloadvue="downloadvue"
            :action="action"
            :title="'表单设计'"
            :needBtn="false"
            :designnerType="'dataForm'"
            :clickformcom="clickformcom"
            @designtype="designtypeHandle"
          />
        </div>
      </div>
      <div class="attribute-designer">
        <AttrFrom
          :fields="fields"
          :form="showformcom"
          :formsetting="formsetting"
          :drag2="drag2Public"
          @deletecom="deletecom"
          :formType="formType"
          :btnPostUrl="btnPostUrl"
          :btnType="btnType"
          :position="position"
          :tableOption="tableOption"
          :masterTable="masterTable"
          :allTable="allTable"
          :columnNameList="columnNameList"
        />
      </div>
    </div>
    <el-dialog
    title="预览表单"
    :fullscreen="formsetting.fullscreen"
    v-if='dialogVisible'
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
    :append-to-body="appendToBodyBool">
    <ShowFrom
      :type="formType"
      :flowableData="{basic: detailData, form: data, formsetting: formsetting}"
      :departmentList="departmentList"
      :userList="userList"
      :roleOption="roleOption"
      @save="saveForm"
      @close="closeHandle"
      @submit="submitHandle"
    />
  </el-dialog>
  </div>
</template>

<script>
import Assembly from './process'
import Forms from './../forms'
import AttrFrom from './../attributeform'
import ShowFrom from './../showForm'
export default {
  name: 'process-form',
  components: { Assembly, Forms, AttrFrom, ShowFrom },
  props: {
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
    action: {
      type: String,
      default: () => {
        return ""
      }
    },
    formType: {
      type: String,
      default: () => {
        return 'flowable'
      }
    },
    btnPostUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    btnType: {
      type: String,
      default: () => {
        return ''
      }
    },
    position: {
      type: String,
      default: () => {
        return ''
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
      drag2Public: '1',
      // 当前点击的组件对象
      clickformcom: {
        showFrom: [],
        rules: []
      },
      // 右边设置项的form对象
      showformcom: {
        showFrom: [],
        rules: []
      },
      // 当前删除的form组件所在设计器类型
      currentDelDesignType: '',
      // 预览弹框
      dialogVisible: false,
      appendToBodyBool: true, // 弹框是否加到body
      processForm: {}, // 预览form对象

      // 详情列表
      detailData: [],
      detailTypeList: ["inputReadOnly", "textareaReadOnly", "image", "file", "link"],
      // 是否正在拖动左侧的组件 1 没有动  2 已经拖动没有进入中间的界面  3拖动进入中间的页面 4 进入设计页面中的组件
      detaildrag1: '1',
      // 是否正在拖动中间的组件 1 没有动  2 已经拖动没有进入其他组件  3 进入其他组件
      detaildrag2: '1',
      // 中间正在被拖动的组件的 如果拖动到垃圾桶 将会删除它
      detaildelcom: {},
      // 中间被点击的组件
      detailformcom: {
        showFrom: [],
        rules: []
      },

      // 表单列表
      data: [],
      // 是否正在拖动左侧的组件 1 没有动  2 已经拖动没有进入中间的界面  3拖动进入中间的页面 4 进入设计页面中的组件
      drag1: '1',
      // 是否正在拖动中间的组件 1 没有动  2 已经拖动没有进入其他组件  3 进入其他组件
      drag2: '1',
      // 左边 被操作的组件
      com: {},
      // 中间正在被拖动的组件的 如果拖动到垃圾桶 将会删除它
      delcom: {},
      // 表单设置
      formsetting: {
        labelposition: 'top',
        labelwidth: 80,
        formsize: 'mini'
      },
      // 中间被点击的组件
      formcom: {
        showFrom: [],
        rules: []
      },
      departmentList: [], // 部门列表
      userList: [], // 用户列表
      roleOption: [], // 角色列表
    }
  },
  computed: {},
  created () {
    if(this.formdata && this.formdata.length > 0) {
      if(this.formdata[0] && this.formdata[0].forms && this.formdata[0].forms.length > 0) {
        this.detailData = this.formdata[0].forms
        this.formsetting = this.formdata[0].formsetting
      }
      if(this.formdata[1] && this.formdata[1].forms && this.formdata[1].forms.length > 0) {
        this.data = this.formdata[1].forms
      }
    }
  },
  methods: {
    // 增加一个组件
    addcom (index=-1) {
      // if (index==-1) {
      if(this.detailTypeList.indexOf(this.com.type) == -1) {
        this.data.push(this.com)
      }else{
        this.detailData.push(this.com)
      }
      // }
      // else {
      //   if(this.detailTypeList.indexOf(this.com.type == -1)) {
      //     this.data.splice(index, 0, this.com)
      //   }else{
      //     this.detailData.splice(index, 0, this.com)
      //   }
      // }
    },
    // 设置操作的组件
    setcom (data) {
      // console.log('最外层。。。。。')
      // console.log(data)
      this.com = data
      this.clickformcom = data
    },
    // 详情交换位置
    jiaohuanDetail (start, end) {
      let arr = this.detailData
      // JSON.parse(JSON.stringify(this.data))
      let aa = arr[start]
      if(Math.abs(start-end) == 1) {
        arr[start]=arr[end]
        arr[end]=aa
      }else{
        arr.splice(start, 1)
        arr.splice((end - 1) < 0 ? 0 : (end -1), 0, aa);
      }
      this.detailData = arr
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
    save () {
      let temp = []
      temp.push({ formsetting: this.formsetting, forms: this.detailData })
      temp.push({ formsetting: this.formsetting, forms: this.data })
      let obj = {
        formdata: temp
      }
      this.$emit('save', obj)
    },
    // 详情重置状态
    detailreset() {
      this.detaildrag1='1'
      this.detaildrag2='1'
      this.drag2Public = '1'
      // 重置中间的横线
      this.$refs.detailforms.chonzhihxindex()
    },
    // 左边的全部重置 左边的结束拖动时调用
    reset () {
      this.drag1='1'
      this.drag2='1'
      this.drag2Public = '1'
      // 重置中间的横线
      this.$refs.subforms.chonzhihxindex()
    },
    resetPublic () {
      this.detailreset()
      this.reset()
      this.drag2Public = '1'
    },
    // 清空
    qingkong () {
      this.clickformcom = {
        showFrom: [],
        rules: []
      }
      this.data = []
      this.formcom = {
        showFrom: [],
        rules: []
      }
      this.detailData = []
      this.detailformcom = {
        showFrom: [],
        rules: []
      }
    },
    // 删除
    deletecom () {
      // 详情设计器
      if(this.currentDelDesignType == 'infoForm') {
        // 详情 如果删除的是 被选中的 则把 选中的也清空
        if (this.delcom.prop===this.detailformcom.prop) {
          this.detailformcom={
            showFrom: [],
            rules: []
          }
        }
        this.detailData = this.detailData.filter(item => item.prop!==this.detaildelcom.prop )
      }
      if(this.currentDelDesignType == 'dataForm') {
        // 表单 如果删除的是 被选中的 则把 选中的也清空
        if (this.delcom.prop===this.formcom.prop) {
          this.formcom={
            showFrom: [],
            rules: []
          }
        }
        this.data = this.data.filter(item => item.prop!==this.delcom.prop)
      }
    },
    // 设置详情拖动状态
    setdetaildrag (data) {
      this['detail'+data.type] = data.value
      if(data.type == 'drag2') {
        this.drag2Public = this.detaildrag2
      }
    },
    // 设置拖动状态
    setdrag (data) {
      this[data.type] = data.value
      if(data.type == 'drag2') {
        this.drag2Public = this.drag2
      }
    },
    // 拖拽传递状态
    setdragPublic (data) {
      if(this.detailTypeList.indexOf(this.com.type) == -1) {
        this.setdrag(data)
      }else{
        this.setdetaildrag(data)
      }
    },
    // 设置详情删除组件
    detailsetdelcom (data) {
      this.detaildelcom = data
    },
    // 设置即将删除的组件对象
    setdelcom (data) {
      this.delcom = data
    },
    // 设置详情form组件
    detailsetformcom (data) {
      this.detailformcom = data
      this.clickformcom = data
      this.showformcom = data
    },
    // 设置当前选择的组件对象
    setformcom (data) {
      this.formcom = data
      this.clickformcom = data
      this.showformcom = data
    },
    // 预览的 对话框
    setdialogVisible () {
      this.processForm = this.detailData.concat(this.data)
      this.dialogVisible = true
    },
    // 下载源码
    downloadvue () {
      let filename='hello.vue'
      let text=dow(this.formsetting, this.data)
      // console.log(text)
      this.download(filename, text)
    },
    // 设置当前拖动的组件所在设计器类型
    designtypeHandle (type) {
      this.currentDelDesignType = type
    },
    // 关闭预览
    handleClose () {
      this.dialogVisible = false
    },
    saveForm () {
      console.log('保存。。。。。')
    },
    closeHandle (bool) {
      if(bool) {
        this.handleClose()
      }
    },
    // 表单提交
    submitHandle (form) {
      // console.log(form)
    }
  },
  watch: {}
};
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
      width: calc(100% - 640px);
      border-left: 1px solid #DCDFE6;
      border-right: 1px solid #DCDFE6;
      .el-card__header{
        display: none;
      }
      .el-card__body{
        // height: calc(100% - 56px);
        height: 100%;
      }
      .detailForm, .subform{
        height: 50%;
        overflow: hidden;
        .el-card__body{
          margin-top: 0!important;
        }
      }
    }
    .attribute-designer{
      .attrcont{
        background: #F6F6F6;
        height: 100%;
        .el-card__body{
          height: 100%;
        }
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
