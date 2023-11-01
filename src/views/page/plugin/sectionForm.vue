<template>
  <div class="cont">
    <div class="contdiv"
      :style="contdivstyle"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @dragover="dragover"
      @drop="drop"
      @dragover.prevent
    ></div>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      class="demo-dynamic"
      :label-position="formsetting.labelposition"
      :label-width="formsetting.labelwidth+'px'"
      :size="formsetting.formsize || 'mini'"
      >
      <div style="min-height:100px;">
        <el-row :gutter="10">
          <el-col  v-for="(ci, cindex) in column" :key="'section'+cindex" :span="ci.span">
          <div
            :class="{'formbox-form-item': true, 'formbox-form-item-active': actid === ci.prop}"
            :style="{'background': startindexTabItem == cindex ? '1px dashed #3a88ed' : endindexTabitem == cindex ? '1px dashed #3a88ed' :'', border: actid === ci.prop ? '1px solid #3a88ed' : ''}"
            draggable
            @dragstart.stop="dragstartTabItem(cindex,ci)"
            @dragend.stop="dragendTabItem(cindex)"
            @drop="dropfunTabItem(cindex)"
            @dragover="dragover2(cindex)"
            @dragover.prevent
            @click.stop="set(ci)"
          >
            <div>
              <el-form-item
                :key="ci.prop+'-sectionForm'"
                :rules="ci.rules"
                :prop="ci.prop"
                v-model="dynamicValidateForm[ci.prop]"
                :label="ci.label"
                :label-width="formsetting.labelwidth+'px'"
                :class='(!ci.label || (["tableForm", "divider","p","tab","section","step"].indexOf(ci.type) > -1))? "nolabel-form-item" : (ci.type == "reportTable" ? "form-item-reportTable" : "")'
              >
                <div class="headeritem">
                  <span style="color:#F56C6C" v-if='ci.rules.length > 0 && ci.rules[0].required && ["tableForm", "step", "formbox", "formbox", "divider","p","tab","tableReadOnly", "reportTable"].indexOf(ci.type) !== -1'>*</span>
                  <!-- 一般项 -->
                  <FormItem :form='dynamicValidateForm' :item='ci' style="flex:1;" v-if='["tableForm", "step", "formbox", "divider","p","tab", "reportTable"].indexOf(ci.type) == -1 ' />
                  <!-- 分割线 -->
                  <el-divider style="flex:1;" v-if="ci.type === 'divider'" :content-position='ci.contentposition'>{{ci.text}}</el-divider>
                  <!-- 文字 -->
                  <p style="flex:1;" v-if="ci.type === 'p'"  :style="{'text-align': ci.contentposition,'font-size':ci.fontsize+'px',color:ci.textcolor}">{{ci.text}}</p>
                  <!-- 表格 -->
                  <div style="flex:1;" v-if="ci.type === 'tableForm'">
                    <tableForm
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3Section'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                  <!-- 选项卡 -->
                  <div style="flex:1;width:85%;" v-if="ci.type === 'tab'">
                    <tabForm
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3Section'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3Section'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                  <!-- 步骤条 -->
                  <div v-if='ci.type==="step"' style="flex:1;">
                    <stepBar
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3Section'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3Section'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                  <!-- 卡片 控制块 -->
                  <div v-if='ci.hasChildren' style="flex:1;">
                    <sectionForm
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3Section'
                      :startindex='startindex'
                      :outClick="actid"
                      :formsetting="formsetting"
                      @setdrag3='setdrag3Section'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                  <!-- 静态表格  报表类 -->
                  <div v-if='ci.type==="reportTable"' :label="ci.label">
                    <reportTable
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3Section'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                    />
                  </div>
                  <!-- <i class="el-icon-setting icons" @click.stop="set(ci)"></i> -->
                  <i class="el-icon-delete icons" @click.stop="del(ci)"></i>
                </div>
              </el-form-item>
            </div>
          </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import tableForm from './tableForm'
import reportTable from './reportTable'
export default {
  components: {
    FormItem: () => import('@/components/basic-assembly/formitem'),
    tabForm: () => import('.//tabForm'),
    tableForm,
    stepBar: () => import('.//stepBar'),
    sectionForm: () => import('.//sectionForm'),
    reportTable
  },
  props: {
    // 当前选中的组件
    clickformcom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 设计器类型
    designnerType: {
      type: String,
      default: () => {
        return ""
      }
    },
    // 被选中的 id值
    drag1: {
      type: String,
      default: () => {
        return '1'
      }
    },
    drag2: {
      type: String,
      default: () => {
        return '1'
      }
    },
    // 1 没有拖动到 表格中  2 已经拖动到表格中
    drag3: {
      type: String,
      default: () => {
        return '1'
      }
    },
    // 用来判断是否是中间内容的拖动 为 -1 时 就不是  大于 0 的 都是 (此时不进行处理)
    startindex: {
      type: Number,
      default: () => {
        return -1
      }
    },
    field: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 子表结构对象
    data: {
      type: Object,
      default: () => {
        return {
          activeName: '',
          dicData: [],
          children: []
        }
      }
    },
    // 左侧被拉动的组件 如果在tab 中放开 则添加到tab 中
    com: {
      type: Object
    },
    action: {
      type: String,
      default: () => {
        return ""
      }
    },
    form: {
      type: Object
    },
    outClick: {
      type: String
    },
    formsetting: {
      type: Object
    }
  },
  computed: {
    column () {
      return this.data.children
    },
    option () {
      return this.data.dicData
    },
    contdivstyle(){
      let obj = {}
      // obj.background = this.drag3 === '1' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)'
      // 左侧或者 中间拖动的时候 要 大等于 10
      obj['z-index'] =  this.drag1 !== '1' ? 100 : -1

      return obj
    }
  },
  data() {
    return {
      tabkey: '',
      dynamicValidateForm: {},
      drag3Section: '1',
      detailTypeList: ["inputReadOnly", "textareaReadOnly", "image", "file", "tableReadOnly"],
      startindexTabItem: -1,
      endindexTabitem: -1,
      actid: '0',
    };
  },
  methods: {
    dragenter () {
      console.log('进入目标>>>')
      // this.$emit()
      // this.$emit('setmub', true)
    },
    dragover () {
      // 当在作用域上滑动的时候
      this.$emit('setdrag3', '2')
      // console.log('在作用域上>>>')
    },
    dragleave () {
      this.$emit('setdrag3', '1')
      // console.log('移出目标>>>')
      // this.$emit('setmub', false)
    },
    // 在组件中的
    dragstartTabItem(index, data) {
      this.$emit('setdelcom', data)
      this.$emit('setformcom', data)
      this.$emit('designtype', this.designnerType)
      this.startindexTabItem = index;
      // console.log("开始拖动 小div", index);
      // console.log(index, data)
    },
    dragendTabItem() {
      // 重置数据
      // console.log('中间的end ------------')
      this.startindexTabItem = -1
      this.endindexTabitem = -1
      this.drag3Tab = '1'
      this.$emit("reset")
    },
    // 在组件中滑动
    dragover2(index) {
      if (index !== this.startindexTabItem) {
        this.endindexTabitem = index;
      } else {
        this.endindexTabitem = -1;
      }
    },
    dropfunTabItem(index) {
      let bool = this.currentDesignerDealItem(true)
      // console.log(this.startindexTabItem, this.endindexTabitem)
      if(bool) {
        if (
          this.startindexTabItem !== this.endindexTabitem &&
          this.startindexTabItem != -1 &&
          this.endindexTabitem != -1
        ) {
          this.jiaohuanHandle(this.startindexTabItem, this.endindexTabitem);
        }
      }else{
        this.startindexTabItem = -1
        this.endindexTabitem = -1
      }
      this.drag3Tab = '1'
    },
    // 交换位置
    jiaohuanHandle (start, end) {
      let arr=this.data.children
      let aa=arr[start]
      if(Math.abs(start-end) == 1) {
        arr[start]=arr[end]
        arr[end]=aa
      }else{
        arr.splice(start, 1)
        arr.splice((end - 1) < 0 ? 0 : (end -1), 0, aa);
      }
      this.$set(this.data, "children", arr)
    },
    drop () {
      // todo 进行添加操作 并且 hxindex 置为 -3
      let bool = this.currentDesignerDealItem(false)
      console.log(bool)
      if(bool) {
        if (['section', 'formbox', 'htmlEditor'].indexOf(this.com.type) == -1 ) {
          this.com.showFrom.push('linkbind')
          this.data.children.push(this.com)
        } else if (this.startindex === '-1') {
          // 中间的拖动到表格中 不处理
        } else if(this.com.type == 'formbox'){
          this.$message.error('不能在表单卡片中添加表单卡片')
        }else if(this.com.type == 'htmlEditor') {
          this.$message.error('不能在表单卡片中添加富文本')
        }else {
          this.$message.error('不能在作用域中添加作用域')
        }
      }
      this.$emit('chonzhihxindex')
      // console.log(this.data)
      // console.log('方>>>')
    },
    submitForm(formName) {
      // console.log(this.dynamicValidateForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.dynamicValidateForm)
          alert("submit!");
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      delete this.dynamicValidateForm[item.prop]
    },
    set (data) {
      this.actid = data.prop
      this.$emit('clickitem', data)
    },
    del (data) {
      // console.log(data)
      let index = 0
      for(let i in this.option){
        if(this.option[i].value === this.data.activeName) {
          index = i
        }
      }
      if(this.data.deletecolumn) {
        this.data.deletecolumn(data.prop)
      }else{
        if(this.data.column) {
          this.data.column = this.data.column.filter(item => item.prop != data.prop)
        }
        if(this.data.children) {
          this.data.children = this.data.children.filter(item => item.prop != data.prop)
        }
      }
      this.$forceUpdate()
    },
    // 选中中间的组件
    clickitem (data) {
      // console.log('data..')
      // console.log(data)
      this.actid = data.prop
      this.$emit('setformcom', data)
      this.$emit('clickitem', data) // --------选项卡嵌套表格，点击设计行内组件
    },
    // 拖动到作用域
    setdrag3Section(data){
      this.drag3Section = data
      this.$emit('setdrag3', data)
    },
    chonzhihxindex () {
      this.hxindex = -3
    },
    initform(){
      let obj = {} //this.form
      this.column.map(item => {
        // obj[item.prop] = ''
        if(item.showFrom.indexOf("sqlType") === -1) {
          item.showFrom.push('sqlType')
        }
        if(!item.sqlType) {
          item.sqlType = 'varchar'
        }
        if (item.type === 'checkbox') {
          this.$set(obj, item.prop, [])
        }
        if(item.type === 'select') {
          if(item.multiple) {
            this.$set(obj, item.prop, [])
          }else{
            this.$set(obj, item.prop, "")
          }
        }
        if(item.type === 'slider') {
          if(item.range) {
            obj[item.prop] = []
          }else{
            obj[item.prop] = 0
          }
        }
        if (item.type === 'image' || item.type === 'file' || item.type === 'imageUpload' || item.type === 'fileUpload') { // 图片 文件 列表 提前初始化
          obj[item.prop] = []
        }
        if(item.type === 'imageUpload' || item.type === 'fileUpload') {
          item.action = this.action
        }
      })
      this.dynamicValidateForm = obj
      // console.log(this.dynamicValidateForm)
    },
    // 判断当前设计和组件是否能组合
    currentDesignerDealItem (needMessage) {
      if(this.designnerType == 'infoForm') {
        if((this.com.type && this.detailTypeList.indexOf(this.com.type) == -1) || !this.com.type) {
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
        if((this.com.type && this.detailTypeList.indexOf(this.com.type) == -1) || !this.com.type) {
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
    }
  },
  watch: {
    data: {
      handler() {
        // this.tabkey = 'tabkey' + new Date().getTime()
      },
      deep: true
    },
    // fromData 变化时初始化表单
    column () {
      this.initform()
    },
    outClick: {
      handler(newVal, oldVal) {
        if(newVal != this.actid) {
          this.actid = '0'
        }
      }
    }
  },
  mounted() {
    this.tabkey = this.data.activeName
    // console.log(this.data)
    // console.log(this.forms)
  },
  created() {
    this.initform()
  }
};
</script>

<style scoped lang="scss">
.headeritem {
  /* background: red; */
  display: block;
  align-items: center;
  .el-icon-setting,.el-icon-delete{
    font-size: 18px;
    margin-left: 10px;
  }
}
.cont{
  position: relative;
  width: 100%;
  // height: 117px;
  /* background: blue; */
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  margin-top: 10px;
}
.contdiv{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  /* bottom: 40px; */
  bottom: 0;
  z-index: 100;
  transition: all 0.5s;
  border-radius: 3px;
  overflow: hidden;
}
.icons {
  text-align: right;
  z-index: 10000;
  cursor: pointer;
  position: absolute;
  bottom: -25px;
  right: 0;
}
.icons:hover{
  color: red;
}
.formbox-form-item{
  padding: 10px 0;
  margin-bottom: 10px;
  border: 1px solid #fff;
  cursor: move;
  position: relative;
}
.formbox-form-item:hover {
  // border: 1px dashed red;
  border: 1px dashed #3a88ed;
  transition: 0.5s;
  .del-item-first{
    display: block;
  }
}
</style>
