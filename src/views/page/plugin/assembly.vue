<template>
  <el-card class="assemblycont">
    <div class="assemblycontzzc" :style="{'z-index':zzcindex}"></div>
      <el-collapse v-model="activeNames" style="widht:100%;" class="assemblycont-tool-type-list">
        <el-collapse-item title="容器组件" name="0">
          <div v-for='(item,index) in containData' :key="index">
            <div :class="{'assemblycont_item': true, 'assemblycont_item_disable': item.disabled}"
              :draggable="item.disabled ? false : true"
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#'+item.icon"></use>
              </svg>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="基础组件" name="1">
          <div v-for='(item,index) in data' :key="index">
            <div :class="{'assemblycont_item': true, 'assemblycont_item_disable': item.disabled}"
              :draggable="item.disabled ? false : true"
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#'+item.icon"></use>
              </svg>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="高级组件" name="2">
          <div v-for='(item,index) in seniorData' :key="index">
            <div :class="{'assemblycont_item': true, 'assemblycont_item_disable': item.disabled}"
              :draggable="item.disabled ? false : true"
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#'+item.icon"></use>
              </svg>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="扩展组件" name="3">
          <div  v-for='(item,index) in currencyData' :key="'currency'+index">
            <div :class="{'assemblycont_item': true, 'assemblycont_item_disable': item.disabled}"
              :draggable="item.disabled ? false : true"
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#'+item.icon"></use>
              </svg>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    <!-- 垃圾桶 -->
    <div
      v-if="false"
      class="lajitongdiv"
      :style="{'z-index':zzcindex+1}"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
      @dragover.prevent
    >
      <svg
        t="1584024586503"
        v-if="!lj"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2016"
        width="200"
        height="200"
      >
        <path
          d="M652.8 834.56c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m-128 0c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m281.6-614.4h-153.6v-51.2c0-28.16-23.04-51.2-51.2-51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2c0 28.16 23.04 51.2 51.2 51.2v460.8c0 56.32 46.08 102.4 102.4 102.4h358.4c56.32 0 102.4-46.08 102.4-102.4v-460.8c28.16 0 51.2-23.04 51.2-51.2v-51.2c0-28.16-23.04-51.2-51.2-51.2z m-358.4-25.6c0-15.36 10.24-25.6 25.6-25.6h102.4c15.36 0 25.6 10.24 25.6 25.6v25.6h-153.6v-25.6z m307.2 640c0 28.16-23.04 51.2-51.2 51.2h-358.4c-28.16 0-51.2-23.04-51.2-51.2v-460.8h460.8v460.8z m25.6-512h-512c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h512c15.36 0 25.6 10.24 25.6 25.6 0 12.8-10.24 25.6-25.6 25.6z m-384 512c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z"
          p-id="2017"
          fill="#1296db"
        />
      </svg>
      <svg
        t="1584029734035"
        v-if="lj"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6049"
        width="200"
        height="200"
      >
        <path
          d="M652.8 834.56c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m-128 0c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m281.6-614.4h-153.6v-51.2c0-28.16-23.04-51.2-51.2-51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2c0 28.16 23.04 51.2 51.2 51.2v460.8c0 56.32 46.08 102.4 102.4 102.4h358.4c56.32 0 102.4-46.08 102.4-102.4v-460.8c28.16 0 51.2-23.04 51.2-51.2v-51.2c0-28.16-23.04-51.2-51.2-51.2z m-358.4-25.6c0-15.36 10.24-25.6 25.6-25.6h102.4c15.36 0 25.6 10.24 25.6 25.6v25.6h-153.6v-25.6z m307.2 640c0 28.16-23.04 51.2-51.2 51.2h-358.4c-28.16 0-51.2-23.04-51.2-51.2v-460.8h460.8v460.8z m25.6-512h-512c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h512c15.36 0 25.6 10.24 25.6 25.6 0 12.8-10.24 25.6-25.6 25.6z m-384 512c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z"
          p-id="6050"
          fill="#d4237a"
        />
      </svg>
    </div>
  </el-card>
</template>

<script>
import MInput from './assembly/input'
import MTextarea from './assembly/textarea'
import MInputNumber from './assembly/inputNumber'
import MSelect from './assembly/select'
import Mswitch from './assembly/switch'
import MSlider from './assembly/slider'
import Mtimeselect from './assembly/timeselect'
import MTimepicker from './assembly/timepicker'
import MDatePicker from './assembly/datePicker'
import MRadio from './assembly/radio'
import MCheckbox from './assembly/checkbox'
import MDivider from './assembly/divider'
import MP from './assembly/p'

import MImageUpload from './assembly/imageUpload'
import MFileUpload from './assembly/fileUpload'

import MColorSelect from './assembly/colorSelect'
import MIconSelct from './assembly/iconSelect'

import MTab from './assembly/tab'
import MStep from './assembly/step'
import MTableForm from './assembly/tableform'

import MDepartment from './assembly/department'
import MRole from './assembly/role'
import MUser from './assembly/user'
import MPost from './assembly/post'
import MChinaArea from './assembly/chinaArea'

// 详情
import MInputReadOnly from './assembly/inputreadonly'
import MTextareaReadOnly from './assembly/textareareadonly'
import MImage from './assembly/image'
import MFile from './assembly/file'
import MBox from './assembly/box'
import MLink from './assembly/link'
import MIframe from './assembly/iframe'

// 2020-04-20 新增
import MHtmlEditor from './assembly/htmlEditor'
import MButton from './assembly/button'
import MCascader from './assembly/cascader'
import MDatasource from './assembly/datasource'
import MFormbox from './assembly/formbox'

//2021-06-04 新增
import MReportTable from './assembly/reportTable'
import MTimeLine from './assembly/timeline'

export default {
  props: {
    drag2: {
      type: String,
      default: () => {
        return '1'
      }
    },
    // 设计器类型 form填写表单，detail详情表单
    type: {
      type: String,
      default: 'form'
    },
    // 是否为列表页详情按钮
    isDetail: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 客户端类型
    supportedClientType: {
      type: String,
      default: 'pc'
    }
  },
  components: {
  },
  data () {
    return {
      activeNames: ['1', '2'],
      lj: false,
      conItems: [
        { type: 'tab', name: '选项卡', icon: 'icon-xuanxiangka2' },
        { type: 'step', name: '步骤条', icon: 'icon-suiji1'},
        { type: 'formbox', name: '表单卡片', icon: 'icon-xuanxiangka'},
        { type: 'tableForm', name: '表格', icon: 'icon-biaoge', support: 'pc'},
        { type: 'reportTable', name: '静态表格', icon: 'icon-biaoge', support: 'pc'},
        { type: 'iframe', name: '网页', icon: 'icon-wangye'},
      ],
      basicItems: [
        { type: 'input', name: '单行文本', icon: 'icon-danhangshuru' },
        { type: 'textarea', name: '多行文本', icon: 'icon-duohangshuru' },
        { type: 'divider', name: '分割线', icon: 'icon-fengefu' },
        { type: 'p', name: '小标题', icon: 'icon-jingtaiwenzi' },
        { type: 'select', name: '下拉框', icon: 'icon-xialaxuanze' },
        { type: 'inputNumber', name: '计数器', icon: 'icon-shuzishuru' },
        // { type: 'slider', name: '滑块', icon: 'icon-kaiguan', disabled: true },
        { type: 'switch', name: '开关', icon: 'icon-kaiguan' },
        { type: 'datePicker', name: '日期', icon: 'icon-riqixuanze' },
        { type: 'timeSelect', name: '固定时间', icon: 'icon-riqixuanze' },
        { type: 'timePicker', name: '任意时间', icon: 'icon-riqixuanze' },
        { type: 'radio', name: '单选', icon: 'icon-danxuan' },
        { type: 'checkbox', name: '多选', icon: 'icon-duoxuan' },
        {type: 'image', name: '图片', icon: 'icon-jingtaitupian'},
        {type: 'file', name: '文件', icon: 'icon-fujian'},
        { type: 'colorSelect', name: '颜色选择', icon: 'icon-yanse2', disabled: true },
        { type: 'iconSelect', name: '图标选择', icon: 'icon-shenpi' },
        { type: 'button', name: '按钮', icon: 'icon-anniu'},
        { type: 'box', name: '描述框', icon: 'icon-tishifu'},
        { type: 'link', name: '链接', icon: 'icon-chaolianjie'},
      ],
      seniorItems: [
        { type: 'cascader', name: '级联选择', icon: 'icon-jilianxuanze'},
        // { type: 'datasource', name: '自定义选择', icon: 'icon-jilianxuanze', support: 'pc'},
        { type: 'imageUpload', name: '上传图片', icon: 'icon-fujian' },
        { type: 'fileUpload', name: '上传文件', icon: 'icon-fujian' },
        { type: 'htmlEditor', name: '富文本', icon: 'icon-fuwenben'},
      ],
      containData: [], // 容器组件
      data: [],
      seniorData: [],
      currencyData: [],
      currency: [
        { type: 'department', name: '部门选择', icon: 'icon-danxuan', disabled: true },
        { type: 'role', name: '角色选择', icon: 'icon-danxuan', disabled: true },
        { type: 'user', name: '用户选择', icon: 'icon-danxuan', support: 'pc', disabled: true },
        { type: 'post', name: '岗位选择', icon: 'icon-danxuan', disabled: true },
        // { type: 'chinaArea', name: '地区选择', icon: 'icon-danxuan', support: 'pc' },
        { type: 'timeline', name: '时间线', icon: 'icon-danxuan', disabled: false},

      ],
      detail: [
        {type: 'inputReadOnly', name: '文本框', icon: 'icon-danhang'},
        {type: 'textareaReadOnly', name: '文本域', icon: 'icon-duohangwenbenxiawu50021'},
        {type: 'image', name: '图片', icon: 'icon-tupian-copy'},
        {type: 'file', name: '文件', icon: 'icon-wenjian3'},
        // {type: 'tableReadOnly', name: '表格'},
        {type: 'tab', name: '选项卡', icon: 'icon-xuanxiangka2'},
        {type: 'box', name: '描述框', icon: 'icon-miaoshu'},
        {type: 'link', name: '链接', icon: 'icon-lianjie1'},
        {type: 'iframe', name: '页面嵌入', icon: 'icon-wangye'}
      ],
      activeName: '',
      tabList: [],
      isCollapse: true
    }
  },
  watch: {
    supportedClientType (val) {
      this.getData()
    }
  },
  created () {
    // console.log(this.detail)
    // console.log(this.supportedClientType)
    if(this.type == 'detail') {
      this.data = this.detail
    }else{
      this.getData()
    }
  },
  computed: {
    zzcindex () {
      return this.drag2==='1'? -10:10
    }
  },
  methods: {
    // 获取左侧控件
    getData() {
      if (this.supportedClientType !== 'pc') {
        let con = this.conItems.filter(item => {
          return item.support !== 'pc'
        })
        this.containData = [...con]
        const arr = this.basicItems.filter(item => {
          return item.support !== 'pc'
        })
        this.data = [...arr]
        const stp = this.seniorItems.filter(item => {
          return item.support !== 'pc'
        })
        this.seniorData = [...stp]
        const currencyTemp = this.currency.filter(item => {
          return item.support !== 'pc'
        })
        this.currencyData = [...currencyTemp]
      } else {
        this.containData = [...this.conItems]
        this.data = [...this.basicItems]
        this.seniorData = [...this.seniorItems]
        this.currencyData = [...this.currency]
      }
    },
    click (item) {
      this.activeName=''
      this.tabList=[]
      if (item.disabled) {
        return false
      }
      this.$emit('setcom', this.getobj(item))
      this.$emit('addcom')
    },
    getobj (data) {
      let obj={}
      // 表单
      if (data.type==='input') {
        obj=new MInput()
      } else if (data.type==='textarea') {
        obj=new MTextarea()
      } else if (data.type==='inputNumber') {
        obj=new MInputNumber()
      } else if (data.type==='select') {
        obj=new MSelect()
      } else if (data.type==='switch') {
        obj=new Mswitch()
      } else if (data.type==='slider') {
        obj=new MSlider()
      } else if (data.type==='timeSelect') {
        obj=new Mtimeselect()
      } else if (data.type==='timePicker') {
        obj=new MTimepicker()
      } else if (data.type==='datePicker') {
        obj=new MDatePicker()
      } else if (data.type==='radio') {
        obj=new MRadio()
      } else if (data.type==='checkbox') {
        obj=new MCheckbox()
      } else if (data.type==='tableForm') {
        obj=new MTableForm()
      } else if (data.type==='divider') {
        obj=new MDivider()
      } else if (data.type==='p') {
        obj=new MP()
      } else if (data.type==='imageUpload') {
        obj=new MImageUpload()
      } else if (data.type==='fileUpload') {
        obj=new MFileUpload()
      } else if (data.type==='colorSelect') {
        obj=new MColorSelect()
      } else if (data.type==='iconSelect') {
        obj=new MIconSelct()
      } else if (data.type==='tab') {
        obj=new MTab()
      } else if (data.type==='step') {
        obj=new MStep()
      } else if (data.type==='formbox') {
        obj=new MFormbox()
      } else if (data.type==='department') {
        obj=new MDepartment()
      } else if (data.type==='role') {
        obj=new MRole()
      } else if (data.type==='user') {
        obj=new MUser()
      } else if (data.type==='post') {
        obj=new MPost()
      } else if (data.type==='chinaArea') {
        obj=new MChinaArea()
      }
      // 详情
      else if (data.type==='inputReadOnly') {
        obj=new MInputReadOnly()
      } else if (data.type==='textareaReadOnly') {
        obj=new MTextareaReadOnly()
      } else if (data.type==='image') {
        obj=new MImage()
      } else if (data.type==='file') {
        obj=new MFile()
      } else if (data.type==='box') {
        obj=new MBox()
      } else if (data.type==='link') {
        obj=new MLink()
      } else if (data.type==='iframe') {
        obj=new MIframe()
      }

      // 2021-04-20 新增
      else if (data.type==='htmlEditor') {
        obj=new MHtmlEditor()
      } else if (data.type==='button') {
        obj=new MButton()
      }  else if (data.type==='cascader') {
        obj=new MCascader()
      }  else if (data.type==='datasource') {
        obj=new MDatasource()
      }
      //  2021-06-04 新增
      else if (data.type==='reportTable') {
        obj=new MReportTable()
      }
      else if(data.type==='timeline') {
        obj=new MTimeLine()
      }
      return obj
    },
    dragstart (data) {
      this.$emit("setdrag", { type: 'drag1', value: '2' });
      let obj=this.getobj(data)
      this.$emit('setcom', obj)
    },
    dragend () {
      this.$emit('reset')
    },
    drop () {
      this.lj=false
      this.$emit('deletecom')
    },
    dragover () {
      this.lj=true
    },
    dragleave () {
      this.lj=false
    },
    handleClick () {
      this.setTabList()
    },
    showTab (active) {
      this.activeName=active
      this.setTabList()
    },
    setTabList () {
      if (this.activeName=='basic') {
        this.tabList=this.data
      } else if (this.activeName=='normal') {
        this.tabList=this.currency
      } else {
        this.tabList=[]
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.assemblycont {
  position: relative;
  /* box-shadow: none; */
  /* border: 0; */
  z-index: 999;
  height: 100%;
  //width: 200px;
  width: 100%;
}
.assemblycontzzc {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.assembly_title{
  margin: 0;
  margin: 10px 0;
}

.assemblycont_item {
  padding: 0 12px;
  display: flex;
  //flex-direction: column;
  align-items: center;
  //justify-content: center;
  //height: 60px;
  height: 32px;
  box-sizing: border-box;
  transition: 0.3s;
  cursor: pointer;
  cursor: move;
  font-size: 12px;
  background: #fff;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  //margin-top: 10px;
  box-sizing: border-box;
  //padding-left: 30px;
  color: #333333;
  i{
    margin-right: 12px;
    font-size: 16px;
    color: #3471FF;
  }
  .icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
    margin-right: 10px;
  }
}
.assemblycont_item:hover {
  transition: 0.3s;
  color: #3471FF;
  background: #EEEEEE;
}
.assemblycont_item_disable{
  cursor: no-drop;
}
.imgclass {
  width: 200px;
  height: 200px;
}
.lajitongdiv {
  display: none;
  position: fixed;
  top: 57px;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 57px);
  background: #F6F6F6;
}
</style>

<style lang="scss">
.assembly-el-menu {
  .el-submenu__icon-arrow {
    display: none;
  }
  .assembly-el-menu-item {
    color: #222;
    border: 1px solid #bfbfbf !important;
    box-sizing: border-box;
    margin: 0 10px;
    width: 150px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    padding: 0;
    border-radius: 5px;
    .el-submenu__title {
      height: 100%;
      line-height: 40px;
      color: #222;
      border: 0;
    }
  }
  .assembly-el-menu-item:nth-of-type(1) {
    margin-left: 0;
  }
  .assembly-el-menu-item.is-opened {
    color: #fff;
    background: #4a90f0;
    border-color: #4a90f0 !important;
    .el-submenu__title {
      color: #fff;
      i {
        color: #fff;
      }
    }
  }
  .assembly-el-menu-item.is-active {
    .el-submenu__title {
      border: 0;
    }
  }
}
</style>
<style lang="scss">
.el-menu--horizontal {
  width: 100%;
  .el-menu {
    display: flex;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.9) !important;
    // margin: 0 10px 0 25px;
    .el-menu-item {
      width: 10%;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      margin-top: 10px;
      padding: 0;
      .assemblycont_item {
        border-radius: 5px;
        margin: 0 10px;
        color: #222222;
      }
      .assemblycont_item:hover {
        color: #fff;
        background: #4a90f0;
      }
    }
  }
}

.assemblycont-tool-type-list{
  border: 0;
  .el-collapse-item__wrap, .el-collapse-item__header{
    border: 0;
  }
  .el-collapse-item__content{
    display: grid;
    grid-template-columns: calc(50% - 4px) calc(50% - 4px);
    grid-row-gap: 12px;
    grid-column-gap: 8px;
    //margin-bottom: 16px;
    margin: 12px 0;
  }
  .el-collapse-item__wrap{
    padding: 0 10px;
    background: #fff;
    margin-top: 16px;
  }
  .el-collapse-item__header{
    height: 40px;
    line-height: 40px;
    //margin-top: 20px;
    margin-top: 0;
    background: #EFF2F7;
    position: relative;
    text-indent: 10px;
    font-size: 16px;
    .el-collapse-item__arrow{
      position: absolute;
      right: 0;
      top: 9px;
    }
    .is-active{
      color: #3471FF;
      //top: 2px;
      transform: rotate(90deg);
    }
  }
  .el-collapse-item__content{
    padding-bottom: 0;
    .assemblycont_item{
      .icon-xiaobiaoti:before{
        font-size: 13px
      }
      .icon-guan:before{
        font-size: 12px;
        width: 18px;
        display: block;
      }
      .icon-lianjie1:before, .icon-wangye:before{
        font-size: 16px;
      }
    }
  }
}
</style>
