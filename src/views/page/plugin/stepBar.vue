<template>
  <div class="cont">
    <!-- <p>{{startindex}}</p>
    <span>{{drag1}}</span>
    <span>{{drag2}}</span>
    <span>{{drag3}}</span> -->
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
      <div class="step-bar-header">
        <div class="step-bar-header-item" v-for="(ti, tindex) in data.dicData" :key="'step-bar'+ti.name" :class="{'last': tindex == (stepNumber - 1), 'active': ti.name == tabkey}" @click="handleClick(ti, tindex)">
          <span class="step-bar-header-item-title">{{ti.label}}</span>
        </div>
      </div>
      <div class="step-bar-content" v-for="ti in data.dicData" :key="'step-bar-content'+ti.name" v-if="ti.name == tabkey">
        <el-row :gutter="10">
          <el-col v-for="(ci, cinx) in data.column[ti.name]" :key="ci.prop" :span="ci.span">
            <div
              :class="{'tab-item-form-item': true, 'tab-item-form-item-active': actid === ci.prop}"
              :style="{'background': startindexTabItem == cinx ? '1px dashed #3a88ed' : endindexTabitem == cinx ? '1px dashed #3a88ed' :'', border: actid === ci.prop ? '1px solid #3a88ed' : ''}"
              draggable
              @dragstart.stop="dragstartTabItem(cinx,ci)"
              @dragend.stop="dragendTabItem(cinx)"
              @drop="dropfunTabItem(cinx)"
              @dragover="dragover2(cinx)"
              @dragover.prevent
              @click.stop="set(ci)"
            >
              <span style="color:#F56C6C" v-if='ci.rules.length > 0 && ci.rules[0].required && ["tableForm", "formbox", "divider","p","tab","tableReadOnly", "reportTable"].indexOf(ci.type) !== -1'>*</span>
              <div :class="['box', 'tableForm', 'formbox', 'reportTable'].indexOf(ci.type) === -1 ? 'headeritem no-label-item' : 'headeritem'">
                <el-form-item
                  style="flex:1;display:flex;"
                  :label="ci.label"
                  v-if='(["tableForm", "formbox" ,"divider","p","tab","tableReadOnly", "reportTable"].indexOf(ci.type) == -1)'
                  :rules="ci.rules"
                  :label-width="formsetting.labelwidth+'px'"
                  :class='(!ci.label || (["tableForm", "divider","p","tab","section","step", "reportTable"].indexOf(ci.type) > -1))? "nolabel-form-item" : ""'
                >
                  <!-- 一般项 -->
                  <!-- ,"box","link","iframe" -->
                  <FormItem  :item='ci' v-if='["tableForm", "formbox", "divider","p","tab","checkbox","tableReadOnly"].indexOf(ci.type) == -1 ' />
                  <FormItem :form='dynamicValidateForm[ti.value]' :item='ci' v-if='ci.type === "checkbox"' />
                </el-form-item>
                <el-form-item
                  style="flex:1;"
                  label-width="90px"
                  :label="ci.label"
                  v-if='ci.type === "tableReadOnly"'
                  :rules="ci.rules"
                >
                  <FormItem style="flex:1;"  :item='ci' />
                </el-form-item>
                <!-- 分割线 -->
                <el-divider style="flex:1;" v-if="ci.type === 'divider'" :content-position='ci.contentposition'>{{ci.text}}</el-divider>
                <!-- 文字 -->
                <p style="flex:1;" v-if="ci.type === 'p'"  :style="{'text-align': ci.contentposition,'font-size':ci.fontsize+'px',color:ci.textcolor}">{{ci.text}}</p>
                <!-- 表格 -->
                <el-form-item v-if='ci.type==="tableForm"' style="flex:1;overflow: hidden;" :label="ci.label" label-width="90px">
                  <div v-if="ci.type === 'tableForm'">
                    <tableForm
                    :com='com'
                    :data='ci'
                    :drag1='drag1'
                    :drag2='drag2'
                    :drag3='drag3Tab'
                    :startindex='startindex'
                    :formsetting="formsetting"
                    @setdrag3='setdrag3'
                    @chonzhihxindex='chonzhihxindex'
                    @clickitem='clickitem'
                    :action="action"
                    :designnerType='designnerType'
                    />
                  </div>
                </el-form-item>
                <el-form-item :label="ci.type == 'formbox' ? ci.label: ''" label-width="90px" style="flex:1;" :class="{'sectionItem': true, 'nolabel-form-item': !ci.label}" v-if='ci.hasChildren || ci.type == "formbox"'>
                  <div>
                    <sectionForm
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3Tab'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      :outClick="actid"
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                      />
                  </div>
                </el-form-item>
                <!-- 静态表格  报表类 -->
                <el-form-item class="form-item-reportTable" v-if='ci.type==="reportTable"' :label="ci.label">
                  <div>
                    <reportTable
                      :com='com'
                      :data='ci'
                      :drag1='drag1'
                      :drag2='drag2'
                      :drag3='drag3Tab'
                      :startindex='startindex'
                      :formsetting="formsetting"
                      @setdrag3='setdrag3'
                      @chonzhihxindex='chonzhihxindex'
                      @clickitem='clickitem'
                      :action="action"
                      :designnerType='designnerType'
                    />
                  </div>
                </el-form-item>
                <i class="el-icon-setting icons" @click.stop="set(ci)" v-if="false"></i>
                <i class="el-icon-delete icons" @click.stop="del(ci)"></i>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="step-bar-button" :style="'display:flex;justify-content:'+ (data.toolAlign ? data.toolAlign : 'center') +';'">
          <jvs-button size="mini" type="primary" v-for="(bi, bindex) in ti.btns" :key="bi.name+bindex">{{bi.name}}</jvs-button>
        </div>
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
    tableForm,
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
    // 表格的对象
    data: {
      type: Object,
      default: () => {
        return {
          activeName: '',
          dicData: [],
          column: []
        }
      }
    },
    // 左侧被拉动的组件 如果在step 中放开 则添加到step 中
    com: {
      type: Object
    },
    action: {
      type: String,
      default: () => {
        return ""
      }
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
      return this.data.column
    },
    dicData () {
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
      startindexTabItem: -1,
      endindexTabitem: -1,
      // 拖动到内部组件  1 没有  2 有
      dragtabitem: '1',
      stepNumber: 0,
      tabkey: "",
      dynamicValidateForm: {},
      drag3Tab: '1',
      detailTypeList: ["inputReadOnly", "textareaReadOnly", "image", "file", "tableReadOnly"],
      // 被点击选中的id值
      actid: '0',
    };
  },
  methods: {
    dragenter () {
      // console.log('进入目标>>>')
      // this.$emit('setmub', true)
    },
    dragover () {
      // 当在选项卡上滑动的时候
      this.$emit('setdrag3', '2')
      // // console.log('在选项卡上>>>')
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
      let arr=this.data.column[this.tabkey]
      let aa=arr[start]
      if(Math.abs(start-end) == 1) {
        arr[start]=arr[end]
        arr[end]=aa
      }else{
        arr.splice(start, 1)
        arr.splice((end - 1) < 0 ? 0 : (end -1), 0, aa);
      }
      this.$set(this.data.column, this.tabkey, arr)
    },
    drop () {
      let bool = this.currentDesignerDealItem(false)
      // console.log(bool)
      console.log(this.com)
      if(bool) {
        // todo 进行添加操作 并且 hxindex 置为 -3
        if (['tab', 'step'].indexOf(this.com.type) == -1 ) {
          if(this.com.type === 'imageUpload' || this.com.type === 'fileUpload'){
            this.com.action = this.action
          }
          if(this.data.addcolumn){
            this.data.addcolumn(this.tabkey,this.com)
          }else{
            if(!this.data.column[this.tabkey]) {
              this.data.column[this.tabkey] = []
            }
            this.data.column[this.tabkey].push(this.com)
          }
          this.$emit('setdrag3', '2')
          this.initForm()
        } else if (this.startindex === '-1') {
          // 中间的拖动到表格中 不处理
        } else {
          if(this.com.type === 'tab'){
            this.$message.error('不能在步骤条中添加选项卡')
          }else{
            this.$message.error('不能在步骤条中添加步骤条')
          }
        }
      }
      this.$emit('chonzhihxindex')
      // console.log(this.data)
      // console.log('方>>>')
      // console.log('tabkey',this.tabkey)
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
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    set (data) {
      this.actid = data.prop
      this.$emit('clickitem', data)
    },
    del (data) {
      if(this.data.deletecolumn) {
        this.data.deletecolumn(this.tabkey, data.prop)
      }else{
        this.data.column[this.data.activeName] = this.data.column[this.data.activeName].filter(item => item.prop != data.prop)
      }
      this.$forceUpdate()
    },
    handleClick(item, index) {
      this.stepNumber = index
      this.tabkey = item.name
      this.data.activeName = this.tabkey
    },
    // 选中中间的组件
    clickitem (data) {
      // console.log('data..')
      // console.log(data)
      this.$emit('setformcom', data)
      this.$emit('clickitem', data) // --------选项卡嵌套表格，点击设计行内组件
    },
    // 拖动到表格
    setdrag3(data){
      this.drag3Tab = data
      this.$emit('setdrag3', data)
    },
    chonzhihxindex () {
      this.hxindex = -3
    },
    initForm() {
      this.data.column = this.initColumn(this.data.dicData, this.data.column)
      for(let i in this.data.column) {
        if(!this.dynamicValidateForm[i]) {
          this.dynamicValidateForm[i] = {}
        }
        let obj = {}
        for(let j in this.data.column[i]) {
          let item = this.data.column[i][j]
          if(item.showFrom.indexOf("sqlType") === -1) {
            item.showFrom.push('sqlType')
          }
          if(!item.sqlType) {
            item.sqlType = 'varchar'
          }
          obj[item.prop] = null
          if(item.type === 'checkbox' || item.type === 'imageUpload' || item.type === 'fileUpload' || item.type === 'image' || item.type === 'file'){
            obj[item.prop] = []
          }
          if(item.type === 'department' || item.type === 'role' || item.type === 'user'){
            obj[item.prop] = []
          }
          if(item.type === 'imageUpload' || item.type === 'fileUpload') {
            item.action = this.action
            this.$forceUpdate()
          }
          this.dynamicValidateForm[i] = obj
        }
      }
      // console.log(this.dynamicValidateForm)
    },
    initColumn (dicData, column) {
      let list = this.getValueOfDicData(dicData)
      for(let i in dicData) {
        if(!column[dicData[i].value]) {
          column[dicData[i].value] = []
        }else{
          // 配置改变key值
          let keys = Object.keys(column)
          if(keys.indexOf(dicData[i].value) == -1) {
            for(let j in keys) {
              if(list.indexOf(keys[j]) == -1) {
                column[dicData[i].value] = JSON.parse(JSON.stringify(column[keys[j]]))
                delete column[keys[j]]
              }
            }
          }
        }
      }
      return column
    },
    getValueOfDicData (dicData) {
      let temp = []
      for(let i in dicData) {
        temp.push(dicData[i].name)
      }
      return temp
    },
    // 判断当前设计和组件是否能组合
    currentDesignerDealItem (needMessage) {
      // console.log(this.designnerType)
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
        console.log(this.com)
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
    },
    lastHandle () {
      let num = Number.parseInt(this.stepNumber) - 1
      this.tabkey = this.data.dicData[num].name
      this.stepNumber = num
    },
    nextHandle () {
      let num = Number.parseInt(this.stepNumber) + 1
      this.tabkey = this.data.dicData[num].name
      this.stepNumber = num
    },
    changeActive () {
      this.tabkey = this.data.activeName
      for(let i in this.data.dicData) {
        if(this.data.dicData[i].name == this.tabkey) {
          this.stepNumber = i
        }
      }
    }
  },
  mounted() {
    this.changeActive()
  },
  created() {
    this.initForm()
  },
  watch: {
    outClick: {
      handler(newVal, oldVal) {
        if(newVal != this.actid) {
          this.actid = '0'
        }
      }
    },
    'data.activeName': {
      handler(newVal, oldVal) {
        this.changeActive()
      }
    }
  }
};
</script>

<style scoped lang="scss">
.headeritem {
  /* background: red; */
  display: block;
  justify-content: space-between;
  align-items: center;
  .el-icon-setting,.el-icon-delete{
    font-size: 18px;
    margin-left: 10px;
  }
  margin-bottom: 10px;
  .el-form-item{
    margin: 0;
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
  bottom: 0px;
  right: 0;
}
.icons:hover{
  color: red;
}
.tab-item-form-item{
  padding: 10px 0;
  margin-bottom: 10px;
  border: 1px solid #fff;
  cursor: move;
  position: relative;
}
.tab-item-form-item:hover {
  // border: 1px dashed red;
  border: 1px dashed #3a88ed;
  transition: 0.5s;
  .del-item-first{
    display: block;
  }
}
.step-bar-content{
  padding: 20px 0;
}
</style>
<style lang="scss">
.no-label-item{
  display: block!important;
  .el-form-item {
    .el-form-item__content {
      margin-left: 0!important;
      flex: 1;
    }
  }
}

.step-bar-header{
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: nowrap;
  word-break: keep-all;
  line-height: 40px;
  .step-bar-header-item{
    height: 40px;
    background: #EEEEEE;
    color: #222222;
    text-align: center;
    flex: 1;
    position: relative;
    cursor: pointer;
    .step-bar-header-item-title{
      display: block;
      position: relative;
    }
    .step-bar-header-item-title::after{
      content: "";
      display: block;
      background: #EEEEEE;
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-left: 24px solid #EEEEEE;
      border-bottom: 20px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
    }
  }
  .step-bar-header-item.last{
    .step-bar-header-item-title::after{
      background: #3471FF;
    }
  }
  .step-bar-header-item.active{
    background: #3471FF;
    color: #fff;
    .step-bar-header-item-title::after{
      border-left-color: #3471FF;
      background: #EEEEEE;
    }
  }
  .step-bar-header-item::before, .step-bar-header-item::after{
      content: "";
      display: inline-block;
      position: absolute;
      background: #fff;
      width: 3px;
      height: 30px;
      top: 0;
      right: 0;
      z-index: 2;
  }
  .step-bar-header-item::before{
    transform-origin: 0 0;
    transform: rotate(-50deg) translateY(0px);
    right: 23px;
    height: 34px;
  }
  .step-bar-header-item::after{
    transform: rotate(46deg) translateY(27px);
    transform-origin: 0 0;
    right: -20px;
  }
  .step-bar-header-item:nth-last-of-type(1){
    .step-bar-header-item-title::after{
      display: none;
    }
  }
  .step-bar-header-item:nth-last-of-type(1)::before, .step-bar-header-item:nth-last-of-type(1)::after{
    display: none;
  }
  .step-bar-header-item:nth-of-type(1).active {
    .step-bar-header-item-title::after{
      background: #EEEEEE;
    }
  }
}
</style>
