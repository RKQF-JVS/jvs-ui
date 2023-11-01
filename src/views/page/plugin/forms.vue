<template>
  <el-card class="elcard">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
      <jvs-button v-if="formId" size="mini" v-show="needBtn" style="float: right; padding: 3px 0;margin-left:5px" type="text" @click="exportHandle">导出</jvs-button>
      <el-upload
        v-if="formId"
        style="float: right; padding: 3px 0;margin-left:5px;margin-top:-7px;"
        :action="`/mgr/jvs-design/form/design/import?formId=${formId}`"
        :multiple="false"
        :limit="1"
        ref="uploadBtn"
        :file-list="fileList"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :on-error="errHandle"
        :headers="headers"
      >
        <jvs-button ref="importBtn" size="mini" v-show="needBtn" type="text">导入</jvs-button>
      </el-upload>
      <jvs-button size="mini" v-show="needBtn && formJson" style="float: right; padding: 3px 0;margin-left:5px" type="text" @click="viewData">数据结构</jvs-button>
      <jvs-button size="mini" v-show="needBtn" style="float: right; padding: 3px 0;margin-left:5px" type="text" @click="save">保存</jvs-button>
      <jvs-button size="mini" v-show="needBtn" style="float: right; padding: 3px 0;margin-left:5px" type="text" @click="yulan">预览</jvs-button>

      <!-- <jvs-button style="float: right; padding: 3px 0;margin-left:5px" type="text" @click="()=>this.$emit('downloadvue')">下载源码</jvs-button> -->
   </div>
    <div
      class="elcardzz"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="dropfun"
      @dragover.prevent
      :style="styleCard"
    ></div>
    <!-- <span>{{drag1}} {{drag2}} {{drag3}} {{startindex}} {{endindex}}</span> -->
    <div class="formscont">
      <div v-if="hxindex== -1 && drag3 !== '2'" class="hxdiv"></div>
      <el-form  :model="from" :label-position="formsetting.labelposition" :label-width="formsetting.labelwidth+'px'" :size="formsetting.formsize">
        <el-row :gutter="10" v-if="!freshBoolean">
          <el-col v-for="(item,index) in fromData" :key="index" :span="item.span">
            <!-- :style="{'background': startindex == index ? 'rgba(255,0,0,0.2)' : endindex == index ? 'rgba(0,0,255,0.2)' :''}" -->
            <div
              class="formitem"
              :style="{'border': startindex == index ? '1px dashed #3a88ed' : endindex == index ? '1px dashed #3a88ed' :'0'}"
            >
              <div
                :class="{'formitem2': true, 'active-formitem2': actid === item.prop}"
                :style="{...styleitem,border: actid === item.prop ? '1px solid #3a88ed' : ''}"
                draggable
                @dragstart="dragstart(index,item)"
                @dragend="dragend(index)"
                @dragover="dragover2(index)"
                @dragleave="dragleave2(index)"
                @drop="dropfun2(index)"
                @dragover.prevent
                @click="clickitem(item)"
              >
                <!-- <div class="formitemzz"></div> -->
                <div class="hxdiv" v-if="hxindex==index && drag3 !== '2'"></div>

                <el-form-item :class='(!item.label || (["tableForm", "divider","p","tab","section","step", "reportTable"].indexOf(item.type) > -1))? "nolabel-form-item" : ""'
                  v-if='["tableForm", "formbox", "divider","p","tab","section", "step", "reportTable"].indexOf(item.type) == -1'
                  :label="item.label"
                  :prop='item.prop'
                  :rules='item.rules'
                  v-model="from[item.prop]"
                  :label-width="item.type==='iframe'?'0':'80px'"
                >
                  <FormItem :item='item' :form='from' :freshBoolean="freshBoolean" @file="fileListHandle"/>
                </el-form-item>
                <el-divider v-if="item.type === 'divider'" :content-position='item.contentposition'>{{item.text}}</el-divider>
                <p v-if="item.type === 'p'"  :style="{'text-align': item.contentposition,'font-size':item.fontsize+'px',color:item.textcolor}">{{item.text}}</p>
                <!-- 表格 -->
                <el-form-item :class="item.label? '' : 'nolabel-form-item'" v-if='item.type==="tableForm"' :label="item.label">
                  <div>
                    <tableForm
                      :com='com'
                      :data='item'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      />
                  </div>
                </el-form-item>

                <!-- 选项卡 -->
                <el-form-item :class="item.label? '' : 'nolabel-form-item'" v-if='item.type==="tab"' :label="item.label">
                  <div>
                    <tabForm
                      :com='com'
                      :data='item'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                </el-form-item>

                <!-- 步骤条 -->
                <el-form-item :class="item.label? '' : 'nolabel-form-item'" v-if='item.type==="step"' :label="item.label">
                  <div>
                    <stepBar
                      :com='com'
                      :data='item'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                </el-form-item>

                <!-- 子表 -->
                <el-form-item :label="item.type == 'formbox' ? item.label : ''" :class="item.label? '' : 'nolabel-form-item'" v-if='item.hasChildren || item.type == "formbox"' class="sectionItem">
                  <div>
                    <sectionForm
                      :com='com'
                      :data='item'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                </el-form-item>

                <!-- 静态表格  报表类 -->
                <el-form-item class="form-item-reportTable" v-if='item.type==="reportTable"' :label="item.label">
                  <div>
                    <reportTable
                      :com='com'
                      :data='item'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      />
                  </div>
                </el-form-item>

                <!-- 删除按钮 -->
                <div class="handle-btn">
                  <i class="el-icon-copy-document copy-item-first" @click.stop="copyFormsItem(item)"></i>
                  <i class="el-icon-delete del-item-first" @click.stop="deleteFormsItem(item)"></i>
                </div>
                <i class="el-icon-rank move-item-first"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="hxindex== -2 && drag3 !== '2'" class="hxdiv"></div>
    </div>
    <!-- <jvs-button @click="sub">sub</jvs-button> -->
    <el-dialog
      title="数据结构"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      fullscreen
      class="form-fullscreen-dialog json-show-dialog"
      :before-close="handleClose">
      <div class="row">
        <div>
          <h4>表单数据结构</h4>
          <json-viewer
            v-if="formJson || fromFlow"
            style="overflow:auto;flex:1;min-height:300px;"
            :value="formJsonString"
            :expand-depth="2000"
            copyable
            boxed
            sort
            ></json-viewer>
        </div>
      </div>
      <div class="row" v-if="false">
        <div>
          <h4>自定义JSQL</h4>
          <codeEditor class="jsql-codeEditor" prop="customizeJsonCode" :code="customizeJsqlJsonCode" @change="changeHandle"></codeEditor>
        </div>
        <div>
          <h4>JSQL</h4>
          <codeEditor class="jsql-codeEditor" prop="variableJsonCode" :readOnly="true" :code="jsqlJson"></codeEditor>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

import tableForm from './tableForm'
import tabForm from './tabForm'
import sectionForm from './sectionForm'
import stepBar from './stepBar'
import reportTable from './reportTable'
import codeEditor from '../views/design/coder' // json编译器

// import department from './department'
// import userform from './userForm'
// import FormGroup from './FormGroup'
export default {
  name: "forms",
  components: {
    FormItem: () => import('@/components/basic-assembly/formitem'),
    tabForm, sectionForm, tableForm, stepBar, reportTable, codeEditor // department, userform, FormGroup
  },
  // 是否正在拖动组件
  props: {
    // 设计器名称
    title: {
      type: String,
      default: () => {
        return "表单设计"
      }
    },
    // 是否显示按钮
    needBtn: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 设计器类型
    designnerType: {
      type: String,
      default: () => {
        return ""
      }
    },
    // 当前选中的组件
    clickformcom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    drag1: {
      type: String,
      default: () => {
        return "1";
      }
    },
    drag2: {
      type: String,
      default: () => {
        return "1";
      }
    },
    fromData: {
      type: Array,
      default: () => {
        return [{ name: "111" }];
      }
    },
    formsetting: {
      type: Object,
      default: () => {
        return {
          labelposition: 'top',
          labelwidth: 80,
          formsize: 'mini',
          fullscreen: false
        }
      }
    },
    // 左侧正在被拖动的组件
    com: {
      type: Object
    },
    height: {
      type: Number,
      default: () => {
        return 600
      }
    },
    groupList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    action: {
      type: String,
      default: () => {
        return ""
      }
    },
    formJson: {
      type: String
    },
    freshBoolean: {
      type: Boolean
    },
    masterTable: {
      type: String
    },
    jsqlJson: {
      type: String
    },
    customizeJsqlJson: {
      type: String
    }
  },
  data() {
    return {
      startindex: -1,
      endindex: -1,
      // 表单的值
      from: {},
      // 拖动到内部组件  1 没有  2 有
      drag3: '1',
      // -3 为没有 -2 为大的div的下面 -1 为大的div的上面  其他为 小组件
      hxindex: -3,
      // 被点击选中的id值
      actid: '0',
      fileKey: [],
      // 详情组件
      detailTypeList: ["inputReadOnly", "textareaReadOnly", "image", "file", "tableReadOnly", "link"],
      // 是否交叉拖拽  true时不可操作com
      overlapping: false,
      dialogVisible: false,
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      },
      formId: '',
      fromFlow: false,
      customizeJsqlJsonCode: ''
    }
  },
  created () {
    this.initfrom()
    if(this.masterTable) {
      this.formId = this.masterTable
    }
    this.$root.eventBus.$off("toolEvent")
    this.$root.eventBus.$on("toolEvent", type => {
      switch(type) {
        case 'save':
          if(this.designnerType == 'infoForm') {
            console.log(111)
          }else{
            this.save();
          }
          break;
        case 'preview': this.yulan();break;
        case 'json': this.viewData();break;
        case 'import': console.log(this.$refs.importBtn);this.$refs.importBtn.clickHandle();break;
        case 'export': this.exportHandle();break;
        default: ;break;
      }
    });
    if(this.customizeJsqlJson) {
      this.customizeJsqlJsonCode = this.customizeJsqlJson
    }
  },
  beforeDestory () {
    this.$root.eventBus.$off("toolEvent")
  },
  methods: {
    // Checkbox 需要提前初始化
    initfrom() {
      this.fileKey = []
      let obj = {}
      this.fromData.map(item => {
        if(item.showFrom.indexOf("sqlType") === -1) {
          item.showFrom.push('sqlType')
        }
        if(!item.sqlType) {
          item.sqlType = 'varchar'
        }
        // obj[item.prop] = null
        if (item.type === 'checkbox' || item.type === 'department') {
          obj[item.prop] = []
        }
        if(item.type === 'select') {
          if(item.multiple) {
            this.$set(obj, item.prop, [])
          }else{
            obj[item.prop] = ""
          }
        }
        if (item.type === 'image' || item.type === 'file') { // 图片 文件 列表 提前初始化
          obj[item.prop] = []
        }
        if(item.type === 'imageUpload' || item.type === 'fileUpload') {
          item.action = this.action
        }
        if (item.type === 'image' || item.type === 'file' || item.type === 'imageUpload' || item.type === 'fileUpload') {
          if(item.type === 'imageUpload' || item.type === 'fileUpload') {
            this.fileKey.push({
              key: item.prop,
              list: []
            })
          }
        }
      })
      // console.log(obj)
      this.from = obj
    },
    // 拖动到内部组件
    setdrag3(data){
      this.drag3 = data
    },
    // 重置数据
    centerreset () {
      this.startindex = -1
      this.endindex = -1
      this.drag3 = '1'
      this.hxindex = -3
      this.actid = 0
    },
    chonzhihxindex () {
      this.hxindex = -3
    },
    // 大div 中滑动时
    dragover() {
      // 中间没有拖动时
      let bool = this.currentDesignerDealItem(false)
      if(bool) {
        this.sortList()
      }
    },
    // 离开大div时
    dragleave() {
      // 当进入到小div中时  或者在操作小div 时 不处理
      if (this.drag1 == "4" || this.drag2 != "1") {
        return;
      }
      this.$emit("setdrag", {type:'drag1',value: '2'});
      this.hxindex = -3;
    },
    // 在div 中放下时
    dropfun() {
      // 不是中间的拖动时 者添加到中间的表单中
      if (this.drag2 === "1") {
        console.log('外层添加。。。。')
        let bool = this.currentDesignerDealItem(true)
        console.log(bool)
        console.log(this.clickformcom)
        if(bool) {
          //-----------------------------------------------------------------
          this.$emit("addcom")
        }else{
          this.$emit('reset')
        }
        this.hxindex = -3;
      }
      this.drag3 = '1'
    },
    // 在组件中的
    dragstart(index, data) {
      this.$emit("setdrag", { type:'drag2',value: '2' });
      this.$emit('setdelcom', data)
      this.$emit('setformcom', data)
      this.$emit('designtype', this.designnerType)
      this.startindex = index;
      console.log("开始拖动 小div", index);
      console.log(index, data)
    },
    dragend() {
      // 重置数据
      console.log('中间的end ------------')
      this.startindex = -1
      this.endindex = -1
      this.drag3 = '1'
      this.$emit("reset")
    },
    // 在组件中滑动
    dragover2(index) {
      // 处理 从左侧拖动到中间组件的逻辑
      if (this.drag2 === "1" && this.drag1 !== "1") {
        this.$emit("setdrag", { type:'drag1',value: '4' });
        this.hxindex = index;
        // todo 增加横线
      }
      // 中间拖动进入到 中间的其他组件
      if (this.drag1 === "1" && this.drag2 !== "1") {
        if (index !== this.startindex) {
          this.endindex = index;
          this.$emit("setdrag", { type:'drag2',value: '3' });
        } else {
          this.endindex = -1;
        }
      }
    },
    dragleave2(index) {
      this.endindex = -1;
    },
    dropfun2(index) {
      let bool = this.currentDesignerDealItem(true)
      if(bool) {
        // 中间的进行拖动交换
        if (this.drag1 === "1") {
          this.$emit("setdrag", { type:'drag2',value: '1' });
          if (
            this.startindex !== this.endindex &&
            this.startindex != -1 &&
            this.endindex != -1
          ) {
            this.$emit("jiaohuan", this.startindex, this.endindex);
          }
        }
        // 从左侧进入到小div中放下  并且没有进入到内部组件中时 进行对应位置的添加
        if (this.drag1 === "4" && this.drag3 != '2') {
          console.log('中间层添加。。。。')
          console.log(this.drag1, this.drag3)
          console.log(index)
          this.$emit("addcom", index)
          this.hxindex = -3;
        }
      }else{
        this.startindex = -1
        this.endindex = -1
      }
      this.drag3 = '1'
    },
    // 选中中间的组件
    clickitem (data) {
      // console.log('data..')
      this.actid = data.prop
      this.$emit('setformcom', data)
      // console.log(this.actid)
    },
    sub() {
      alert(JSON.stringify(this.from));
    },
    // 预览
    yulan(){
      console.log(this.from)
      this.$emit('setdialogVisible', true)
    },
    // 保存
    save () {
      this.$emit('save', this.formJsonString)
    },
    // 查看数据结构
    viewData () {
      this.formJsonString = this.getJson(this.fromData, {})
      // 流程设计器---查看数据结构时需调整外层弹框的关闭按钮 z-index
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 0})
        this.fromFlow = true
      }else{
        this.fromFlow = false
      }
      this.dialogVisible = true
    },
    // 关闭预览数据结构
    handleClose () {
      this.dialogVisible = false
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 9})
        this.fromFlow = true
      }else{
        this.fromFlow = false
      }
    },
    // 上传文件--监听
    fileListHandle(obj){
      if(this.fileKey.length > 0){
        for(let i in this.fileKey){
          if(this.fileKey[i].key === obj.prop){
            this.fileKey[i].list = obj.fileList
          }
        }
      }
    },
    fromgroupSectionKeyListHandle(obj) {
      this.$emit('fromgroupSectionKeyList', obj)
    },
    sortList () {
      if (this.drag2 === "1") {
        this.$emit("setdrag", {type:'drag1',value: '3'});
        // 一个都没有时 在上面 否则在下面
        if (this.fromData.length === 0) {
          this.hxindex = -1;
        } else {
          this.hxindex = -2;
        }
      }
    },
    // 判断当前设计和组件是否能组合
    currentDesignerDealItem (needMessage) {
      if(this.designnerType == 'infoForm') {
        if((this.clickformcom.type && this.detailTypeList.indexOf(this.clickformcom.type) == -1) || !this.clickformcom.type) {
          if(needMessage) {
            this.$message.warning('基本信息不可放入表单组件！')
          }
          this.overlapping = true
          return false
        }else{
          this.overlapping = false
          return true
        }
      }else if(this.designnerType == 'dataForm'){
        if((this.clickformcom.type && this.detailTypeList.indexOf(this.clickformcom.type) == -1) || !this.clickformcom.type) {
          this.overlapping = false
          return true
        }else{
          if(needMessage) {
            this.$message.warning('表单设计不可放入详情组件！')
          }
          this.overlapping = true
          return false
        }
      }else{
        this.overlapping = false
        return true
      }
    },
    // 遍历字段列表生成数据结构
    getJson (list, formJson) {
      for(let i=0; i < list.length; i++) {
        switch(list[i].type) {
          case 'inputReadOnly':
            formJson[list[i].prop] = "";
            break;
          case 'textareaReadOnly':
            formJson[list[i].prop] = "";
            break;
          case 'input':
            formJson[list[i].prop] = "";
            break;
          case 'textarea':
            formJson[list[i].prop] = "";
            break;
          case 'inputNumber':
            // 整数 或 小数
            if(list[i].isFloat == true) {
              formJson[list[i].prop] = 1.0001;
            }else{
              formJson[list[i].prop] = 1;
            }
            break;
          case 'SWITCH':
            formJson[list[i].prop] = false;
            break;
          case 'switch':
            formJson[list[i].prop] = false;
            break;
          case 'timeSelect':
            formJson[list[i].prop] = "10:00:00";
            break;
          case 'timePicker':
            if(list[i].isrange) {
              formJson[list[i].prop] = ["10:00:00", "12:00:00"];
            }else{
              formJson[list[i].prop] = "10:00:00";
            }
            break;
          case 'datePicker':
            if(["datetimerange", "daterange", "monthrange"].indexOf(list[i].datetype) > -1) {
              formJson[list[i].prop] = ["2021-02-05 10:00:00", "2021-02-05 12:00:00"];
              if(list[i].datetype == 'daterange') {
                formJson[list[i].prop] = ["2021-02-05", "2021-02-06"];
              }
              if(list[i].datetype == 'monthrange') {
                formJson[list[i].prop] = ["2021-02", "2021-06"];
              }
            }else{
              formJson[list[i].prop] = "2021-02-05 10:00:00";
              if(list[i].datetype == "date" || list[i].datetype == "week") {
                formJson[list[i].prop] = "2021-02-05";
              }
              if(list[i].datetype == "month") {
                formJson[list[i].prop] = "2021-02";
              }
              if(list[i].datetype == "year") {
                formJson[list[i].prop] = "2021";
              }
              if(list[i].datetype == "dates") {
                formJson[list[i].prop] = ["2021-03-17", "2021-03-18", "2021-03-19"]
              }
            }
            break;
          case 'select':
          case 'role':
          case 'user':
          case 'post':
          case 'datasource':
            if(list[i].multiple) {
              formJson[list[i].prop] = []
            }else{
              formJson[list[i].prop] = ""
            }
            break;
          case 'inputReadOnly':
            formJson[list[i].prop] = "";
            break;
          case 'department':
          case 'cascader':
          case 'chinaArea':
            if(list[i].multiple) {
              if(list[i].emitPath) {
                formJson[list[i].prop] = [ [1,2,3], [1,2,4] ]
              }else{
                formJson[list[i].prop] = [3, 4]
              }
            }else{
              if(list[i].emitPath) {
                formJson[list[i].prop] = [1,2,3]
              }else{
                formJson[list[i].prop] = 3
              }
            }
            break;
          case 'checkbox':
          case 'timeline':
            formJson[list[i].prop] = [];
            break;
          case 'slider':
            if(list[i].range) {
              formJson[list[i].prop] = [0, 100]
            }else{
              formJson[list[i].prop] = 10
            }
            break;
          case 'tab':
          case 'step':
            let tobj = {};
            for(let j in list[i].dicData) {
              let name = list[i].dicData[j].name
              tobj[name] = {}
              if(list[i].column[name]) {
                tobj[name] = this.getJson(list[i].column[name], {})
              }
            }
            formJson[list[i].prop] = tobj;
            break;
          case 'tableForm':
            let tob = {};
            tob = this.getJson(list[i].tableColumn, {})
            formJson[list[i].prop] = [tob]
            break;
          case 'formbox':
            formJson[list[i].prop] = [];
            if(list[i].children) {
              let to = this.getJson(list[i].children, {})
              formJson[list[i].prop].push(to)
            }
            break;
          case 'image':
          case 'imageUpload':
          case 'file':
          case 'fileUpload':
            formJson[list[i].prop] = [{name: '', url: '', fileName: ''}];
            break;
          case 'reportTable':
            let rob = {};
            for(let ri in list[i].dicData) {
              let tb = {}
              tb = this.getJson(list[i].tableColumn, {})
              rob[list[i].dicData[ri].value] = tb
            }
            formJson[list[i].prop] = rob;
            break;
          default :
            formJson[list[i].prop] = "";
            break;
        }
        if(list[i].type != 'formbox' && list[i].hasChildren) {
          let to = this.getJson(list[i].children, {})
          formJson = Object.assign(formJson, to)
        }
      }
      return formJson
    },
    uploadSuccess (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.fileList = []
        this.$emit("freshFormData", true)
      }else{
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    // 导入失败
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
    exportHandle () {
      this.$openUrl(`/mgr/jvs-design/form/design/export/${this.formId}`, '_blank')
    },
    // 删除表单项
    deleteFormsItem(item){
      this.$emit('setdelcom', item)
      // this.$emit('setformcom', item)
      this.$emit('deletecom')
    },
    // 复制表单项
    copyFormsItem(item) {
      console.log(item)
    },
    // editor赋值
    changeHandle (code) {
      if(code && code != 'error') {
        this.$emit('setJSQL', code)
      }else{
        this.$emit('setJSQL', "")
      }
    },
  },
  computed: {
    // 中间的大的div
    styleCard: function() {
      // drag1 是否正在拖动左侧的组件 1 没有动 2 已经拖动没有进入中间的界面  3拖动进入中间的页面 4 进入设计页面中的组件
      // drag2 是否正在拖动中间的组件 1 没有动  2 已经拖动没有进度其他组件  3 进入其他组件
      let sty = { background: "rgb(0,0,0,0)" };
      if (this.drag1 == "2") {
        // sty.background = 'rgb(0,0,0,0.1)'
      } else if (this.drag1 == "3") {
        // sty.background = 'rgb(0,0,0,0.5)'
        // sty["z-index"] = 10;
      }
      return sty;
    },
    styleitem: function() {
      let sty = { "z-index": 100 };
      // if (this.drag2 == '2') {
      // }
      return sty;
    },
    formJsonString: {
      get(){
        // if(this.formJson) {
        //   if(this.formJson.startsWith('{')) {
        //     return JSON.parse(this.formJson)
        //   }else{
        //     return this.formJson
        //   }
        // }else{
        //   return ""
        // }
        let str = {}
        str =  this.getJson(this.fromData, {})
        return str
      },
      set () {}
    }
  },
  watch: {
    // fromData 变化时初始化表单
    fromData () {
      this.initfrom()
    }
  }
};
</script>

<style scoped lang="scss">
.elcard {
  position: relative;
  height: 100%;
  //margin: 0 10px;
  margin: 0 3vw;
  padding: 0 20px;
}

.elcardzz {
  position: absolute;
  top: 58px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.formscont {
  height: 100%;
  // padding-bottom: 60px;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.level-form-design .formscont{
  height: calc(100vh - 272px);
}
.formscont::-webkit-scrollbar {
  display: none; /* Chrome Safari */
  width: 0;
}
.formitem {
  position: relative;
  padding: 3px;
  overflow: hidden;
  border-radius: 3px;
  box-sizing: border-box;
}
.formitem2 {
  position: relative;
  padding: 3px 20px;
  overflow: hidden;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px dashed #fff;
  cursor: move;
  z-index: 0;
  .handle-btn{
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #0D76FC;
    display: none;
    .copy-item-first{
      padding: 2px;
      font-size: 18px;
      cursor: pointer;
      //color: #0D76FC;
      color: #FFFFFF;
    }
    .del-item-first{
      padding: 2px;
      font-size: 18px;
      cursor: pointer;
      //color: #0D76FC;
      color: #FFFFFF;
    }
  }
  .move-item-first{
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
    color: #FFFFFF;
    background-color: #0D76FC;
    display: none;
  }
}
.active-formitem2{
  .handle-btn{
    display: flex;
  }
  //.del-item-first{
  //  display: block;
  //}
  //.copy-item-first{
  //  display: block;
  //}
  .move-item-first{
    display: block;
  }
}
.formitem2:hover {
  // border: 1px dashed red;
  border: 1px dashed #3a88ed;
  transition: 0.5s;
  .handle-btn{
    display: flex;
  }
  //.del-item-first{
  //  display: block;
  //}
  //.copy-item-first{
  //  display: block;
  //}
  .move-item-first{
    display: block;
  }
}
.formitemzz {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.hxdiv {
  width: 100%;
  height: 0px;
  border-top: 1px dashed #3a88ed;
}

.icons1 {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<style lang="scss">
.sectionItem>.el-form-item__content{
  margin-left: 0!important;
}
.nolabel-form-item, .form-item-reportTable{
  .el-form-item__content{
    margin-left: 0!important;
  }
}
.form-item-reportTable{
  width: 100%;
}
.jsql-codeEditor{
  width: 100%;
  height: 500px;
  position: relative;
}
.json-show-dialog{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      width: 100%;
      padding: 20px 10px;
      padding-top: 0;
      position: unset;
      box-sizing: border-box;
      .row{
        display: flex;
        justify-content: space-between;
        >div{
          width: 49%;
        }
      }
    }
  }
}
</style>
