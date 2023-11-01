<template>
  <div class="docment-box">
    <div class="document-index">
      <div class="document-index-item">
        <h3 style="cursor:pointer;" @click="openOther('devInfo')">开发指南</h3>
        <h3 style="cursor:pointer;" @click="openOther('useInfo')">框架说明</h3>
      </div>
      <div class="document-index-item">
        <h3 class="just-title">组件</h3>
        <div v-for="item in componentList" :key="item.name" class="component">
          <h4 class="just-title">{{item.info}}</h4>
          <div v-if="item.children">
            <div v-for="it in item.children" :key="it.name+'-leftMenu'" class="component-item">
              <h5 :class="{'active-show': it.name == activeName}" @click="openComponentItem(item, it)">{{it.info}}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="document-detail">
      <devIntrduce v-if="activeName == 'devInfo'"></devIntrduce>
      <useInfo v-if="activeName == 'useInfo'"></useInfo>
      <container v-if="activeName == 'container'"></container>
      <but v-if="activeName == 'button'"></but>
      <icon v-if="activeName == 'icon'"></icon>
      <tab v-if="activeName == 'tab'"></tab>
      <Table v-if="activeName == 'table'"></Table>
      <Form v-if="activeName == 'form'"></Form>
      <levelForm v-if="activeName == 'levelForm'"></levelForm>
      <stepForm v-if="activeName == 'stepForm'"></stepForm>
      <Input v-if="activeName == 'input'"></Input>
      <TextArea v-if="activeName == 'textarea'"></TextArea>
      <InputNumber v-if="activeName == 'inputNumber'"></InputNumber>
      <Select v-if="activeName == 'select'"></Select>
      <switchDoc v-if="activeName == 'switch'"></switchDoc>
      <Slider v-if="activeName == 'slider'"></Slider>
      <TimeSelect v-if="activeName == 'timeSelect'"></TimeSelect>
      <TimePicker v-if="activeName == 'timePicker'"></TimePicker>
      <DatePicker v-if="activeName == 'datePicker'"></DatePicker>
      <Radio v-if="activeName == 'radio'"></Radio>
      <Checkbox v-if="activeName == 'checkbox'"></Checkbox>
      <ImageUpload v-if="activeName == 'imageUpload'"></ImageUpload>
      <FileUpload v-if="activeName == 'fileUpload'"></FileUpload>
      <ColorSelect v-if="activeName == 'colorSelect'"></ColorSelect>
      <IconSelect v-if="activeName == 'iconSelect'"></IconSelect>
      <Tab v-if="activeName == 'tabItem'"></Tab>
      <TableForm v-if="activeName == 'tableForm'"></TableForm>
      <PCom v-if="activeName == 'p'"></PCom>
      <Divider v-if="activeName == 'divider'"></Divider>
      <ImageCom v-if="activeName == 'image'"></ImageCom>
      <FileCom v-if="activeName == 'file'"></FileCom>
      <BoxCom v-if="activeName == 'box'"></BoxCom>
      <LinkCom v-if="activeName == 'link'"></LinkCom>
      <IframeCom v-if="activeName == 'iframe'"></IframeCom>
      <Department v-if="activeName == 'department'"></Department>
      <Role v-if="activeName == 'role'"></Role>
      <UserCom v-if="activeName == 'user'"></UserCom>
      <PostCom v-if="activeName == 'post'"></PostCom>
      <ChinaArea v-if="activeName == 'chinaArea'"></ChinaArea>
      <Cascader v-if="activeName == 'cascader'"></Cascader>
      <HtmlEditor v-if="activeName == 'htmlEditor'"></HtmlEditor>
      <DatasourceForm v-if="activeName == 'datasource'"></DatasourceForm>
      <StepBar v-if="activeName == 'step'"></StepBar>
      <FormBox v-if="activeName == 'formbox'"></FormBox>
      <ReportTable v-if="activeName == 'reportTable'"></ReportTable>
    </div>
    <div class="back-to-top" @click="backUp">
      <i class="el-icon-caret-top"></i>
    </div>
  </div>
 
</template>
<script>
import {devInfo} from './develop/index'
import {componentPathList} from './component/index'
export default {
  components: Object.assign(devInfo, componentPathList.basic, componentPathList.items),
  computed: {
    componentPath () {
      return componentPathList
    },
  },
  data () {
    return {
      activeName: 'devInfo', // 当前组件
      componentList: [
        {
          name: 'basic',
          info: '基本组件',
          children: [
            {
              name: 'container',
              info: '基本容器'
            },
            {
              name: 'button',
              info: '按钮'
            },
            {
              name: 'icon',
              info: '图标'
            },
            {
              name: 'tab',
              info: '选项卡'
            },
            {
              name: 'table',
              info: '表格'
            },
            {
              name: 'form',
              info: '表单'
            },
            // {
            //   name: 'levelForm',
            //   info: '多级表单'
            // },
            // {
            //   name: 'stepForm',
            //   info: '步骤表单'
            // }
          ]
        },
        {
          name: 'formCom',
          info: '表单项组件',
          children: [
            {
              name: 'input',
              info: '文本框',
            },
            {
              name: 'textarea',
              info: '文本域'
            },
            {
              name: 'inputNumber',
              info: '计数器',
            },
            {
              name: 'select',
              info: '下拉框'
            },
            {
              name: 'switch',
              info: '开关',
            },
            {
              name: 'slider',
              info: '滑块'
            },
            {
              name: 'timeSelect',
              info: '固定时间',
            },
            {
              name: 'timePicker',
              info: '任意时间'
            },
            {
              name: 'datePicker',
              info: '日期',
            },
            {
              name: 'radio',
              info: '单选'
            },
            {
              name: 'checkbox',
              info: '多选'
            },
            {
              name: 'imageUpload',
              info: '上传图片'
            },
            {
              name: 'fileUpload',
              info: '上传文件'
            },
            {
              name: 'colorSelect',
              info: '颜色'
            },
            {
              name: 'iconSelect',
              info: '图标'
            },
            {
              name: 'tabItem',
              info: '选项卡'
            },
            {
              name: 'tableForm',
              info: '可编辑表格'
            },
            {
              name: 'p',
              info: 'p文字'
            },
            {
              name: 'divider',
              info: '分割线'
            },
            {
              name: 'image',
              info: '图片'
            },
            {
              name: 'file',
              info: '文件列表'
            },
            {
              name: 'box',
              info: '描述框'
            },
            {
              name: 'link',
              info: '链接'
            },
            {
              name: 'iframe',
              info: '嵌入页面'
            },
            {
              name: 'department',
              info: '部门选择'
            },
            {
              name: 'role',
              info: '角色选择'
            },
            {
              name: 'user',
              info: '用户选择'
            },
            {
              name: 'post',
              info: '岗位选择'
            },
            {
              name: 'chinaArea',
              info: '地区选择'
            },
            {
              name: 'cascader',
              info: '级联选择'
            },
            {
              name: 'htmlEditor',
              info: '富文本编译器'
            },
            {
              name: 'datasource',
              info: '自定义选择'
            },
            {
              name: 'step',
              info: '步骤条'
            },
            {
              name: 'formbox',
              info: '表单卡片'
            },
            {
              name: 'reportTable',
              info: '静态表格'
            }
          ]
        }
      ]
    }
  },
  methods: {
    openComponentItem (item, it) {
      this.activeName = ''
      if(item.name && it.name) {
        this.activeName = it.name
      }
      this.backUp()
    },
    backUp () {
      if($('.docment-box').scrollTop() > 100) {
        $('.docment-box').scrollTop(0)
      }
    },
    openOther (act) {
      this.activeName = act
      this.backUp()
    }
  }
}
</script>
<style lang="scss">
.docment-box{
  display: flex;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  .document-index{
    position: fixed;
    width: 150px;
    height: 100%;
    overflow: auto;
    .document-index-item{
      padding-left: 10px;
      box-sizing: border-box;
      .component{
        .component-item{
          h5{
            cursor: pointer;
            font-weight: normal;
            color: #333;
            font-size: 14px;
          }
        }
        .active-show{
          color: #409EFF;
        }
      }
    }
    .just-title{
      color: #b1b1b1;
    }
  }
  .document-detail{
    width: calc(100% - 170px);
    margin-left: 170px;
    .component-item{
      .demo{
        .demo-item{
          margin-top: 10px;
          >span:not(.step-bar-header-item-title){
            line-height: 24px;
          }
        }
      }
    }
  }
}
.docment-box::-webkit-scrollbar{
  display: none;
}
</style>
<style lang="scss">
.document-detail{
  .component-item{
    h4{
      margin: 10px 0;
    }
    .demo{
      h5{
        margin: 0;
      }
      span{
        font-size: 12px;
      }
      .show{
        .el-row{
          margin-top: 10px;
        }
      }
    }
    .table-body-box{
      .el-table .el-table__body-wrapper{
        height: auto!important;
      }
    }
  }
}
.back-to-top{
  position: fixed;
  bottom: 10%;
  right: 10px;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 5;
}
</style>