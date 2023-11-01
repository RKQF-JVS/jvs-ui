<template>
  <el-card class="assemblycont assemblycont-process">
    <div class="assemblycontzzc" :style="{'z-index':zzcindex}"></div>
    <!-- 组件 -->
    <el-collapse v-model="activeNames" style="widht:100%;" class="assemblycont-tool-type-list">
        <el-collapse-item title="详情组件" name="1">
          <div v-for='(item,index) in detail' :key="index">
            <div class="assemblycont_item"
              draggable
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <i :class="item.icon || 'el-icon-help'"></i>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="表单" name="2">
          <div  v-for='(item,index) in data' :key="'currency'+index">
            <div class="assemblycont_item"
              draggable
              @click="click(item)"
              @dragstart="dragstart(item)"
              @dragend="dragend">
              <i :class="item.icon || 'el-icon-help'"></i>
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
import MInput from './../assembly/input'
import MTextarea from './../assembly/textarea'
import MInputNumber from './../assembly/inputNumber'
import MSelect from './../assembly/select'
// import Mtable from './../assembly/tableform'
import Mswitch from './../assembly/switch'
import MSlider from './../assembly/slider'
import Mtimeselect from './../assembly/timeselect'
import MTimepicker from './../assembly/timepicker'
import MDatePicker from './../assembly/datePicker'
import MRadio from './../assembly/radio'
import MCheckbox from './../assembly/checkbox'
import MDivider from './../assembly/divider'
import MP from './../assembly/p'
import MImageUpload from './../assembly/imageUpload'
import MFileUpload from './../assembly/fileUpload'

import MColorSelect from './../assembly/colorSelect'
import MIconSelct from './../assembly/iconSelect'

import MTab from './../assembly/tab'
// import MSection from './../assembly/section'
// import MDepartment from './../assembly/department'
// import MRole from './../assembly/role'
// import MUser from './../assembly/user'
// import MFormGroup from './../assembly/formGroup'

import MInputReadOnly from './../assembly/inputreadonly'
import MTextareaReadOnly from './../assembly/textareareadonly'
import MImage from './../assembly/image'
import MFile from './../assembly/file'
// import MTableReadOnly from './../assembly/tablereadonly'
import MLink from './../assembly/link'

export default {
  props: {
    drag2: {
      type: String,
      default: () => {
        return '1'
      }
    }
  },
  components: {
  },
  data () {
    return {
      activeNames: ['1', '2'],
      lj: false,
      data: [
        { type: 'divider', name: '分割线', icon: 'icon-ic_fengexian' },
        { type: 'p', name: '文字', icon: 'icon-xiaobiaoti' },
        { type: 'input', name: '文本框', icon: 'icon-danhang' },
        { type: 'textarea', name: '文本域', icon: 'icon-duohangwenbenxiawu50021' },
        { type: 'inputNumber', name: '计数器', icon: 'icon-jishuqi' },
        { type: 'select', name: '下拉框', icon: 'icon-xialakuang1' },
        { type: 'switch', name: '开关', icon: 'icon-guan' },
        { type: 'slider', name: '滑块', icon: 'icon-huakuai1' },
        { type: 'timeSelect', name: '固定时间', icon: 'icon-gudingshijian1' },
        { type: 'timePicker', name: '任意时间', icon: 'icon-time-circle-fill' },
        { type: 'datePicker', name: '日期', icon: 'icon-rili11' },
        { type: 'radio', name: '单选', icon: 'icon-iconfontoptionbutton' },
        { type: 'checkbox', name: '多选', icon: 'icon-xuanzhong' },
        // {type: 'tableForm', name: '表格'},

        { type: 'imageUpload', name: '上传图片', icon: 'icon-shiliangzhinengduixiang' },
        { type: 'fileUpload', name: '上传文件', icon: 'icon-shangchuanwenjian' },
        { type: 'colorSelect', name: '颜色', icon: 'icon-yanse2' },
        { type: 'iconSelect', name: '图标', icon: 'icon-tubiaoxuanze' },

        { type: 'tab', name: '选项卡', icon: 'icon-xuanxiangka2' },
      ],
      currency: [
        // { type: 'department', name: '部门选择' },
        // { type: 'role', name: '角色选择' },
        // { type: 'user', name: '用户选择' },
        // {type: 'formGroup', name: '多级表单'},
      ],
      detail: [
        { type: 'inputReadOnly', name: '文本框', icon: 'icon-danhang' },
        { type: 'textareaReadOnly', name: '文本域', icon: 'icon-duohangwenbenxiawu50021' },
        { type: 'image', name: '图片', icon: 'icon-tupian-copy' },
        { type: 'file', name: '文件', icon: 'icon-wenjian3' },
        { type: 'link', name: '链接', icon: 'icon-lianjie1'},
        // { type: 'TableReadOnly', name: '展示表格' },
      ]
    }
  },
  created () {
  },
  computed: {
    zzcindex () {
      return this.drag2==='1'? -10:10
    }
  },
  methods: {
    click (item) {
      this.$emit('setcom', this.getobj(item))
      this.$emit('addcom')
    },
    getobj (data) {
      let obj={}
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
        obj=new Mtable()
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
      } else if (data.type==='section') {
        obj=new MSection()
      } else if (data.type==='department') {
        obj=new MDepartment()
      } else if (data.type==='role') {
        obj=new MRole()
      } else if (data.type==='user') {
        obj=new MUser()
      } else if (data.type==='formGroup') {
        obj=new MFormGroup()
      } else if (data.type==='inputReadOnly') {
        obj=new MInputReadOnly()
      } else if (data.type==='textareaReadOnly') {
        obj=new MTextareaReadOnly()
      } else if (data.type==='image') {
        obj=new MImage()
      } else if (data.type==='file') {
        obj=new MFile()
      } else if (data.type==='tableReadOnly') {
        obj=new MTableReadOnly()
      }
       else if (data.type==='link') {
        obj=new MLink()
      }
      return obj
    },
    dragstart (data) {
      this.$emit("setdrag", { type: 'drag1', value: '2' })
      let obj=this.getobj(data)
      this.$emit('setcom', obj)
      console.log(obj)
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
  width: 200px;
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
  display: flex;
  align-items: center;
  height: 30px;
  box-sizing: border-box;
  transition: 0.3s;
  cursor: pointer;
  cursor: move;
  font-size: 12px;
  background: #fff;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  box-sizing: border-box;
  padding-left: 30px;
  font-size: 14px;
  color: #333333;
  i{
    margin-right: 13px;
    font-size: 16px;
  }
}
.assemblycont_item:hover {
  transition: 0.3s;
  color: #3471FF;
  background: #EEEEEE;
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
  }
}
</style>
