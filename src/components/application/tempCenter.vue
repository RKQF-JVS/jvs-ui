<template>
  <div class="template-page">
    <div class="template-header">
      <div class="title">模板中心配置</div>
      <div class="explain">
        <span style="color: #a2a3a5">为多环境下配置的应用快速部署，可直接配置为模板中心。</span>
        <span style="color:#3471ff;cursor: pointer;">了解更多</span>
      </div>
    </div>
    <jvs-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" @click="handleAddTemp">添加三方模板</jvs-button>
    <div class="template-list-box">
      <div class="template-item" v-for="(item, key) in templateList" :key="key">
<!--        <i class="el-icon-delete del-icon" @click="handleDel(item)"/>-->
        <div>
<!--          <div class="item-content">-->
<!--            <img :src="item.img" alt=""/>-->
<!--            <div class="content-text">-->
<!--              <div class="temp-name">{{ item.name }}</div>-->
<!--              <div class="temp-description" :title="item.description">{{ item.description }}</div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="item-content">
            <img :src="item.img" alt=""/>
            <div class="content-text">
              <div class="temp-description" :title="item.description">{{ item.description }}</div>
            </div>
          </div>
          <div class="item-footer">
<!--            <div>{{ item.version }}</div>-->
<!--            <div>{{ item.createTime }}</div>-->
            <div>{{ item.name }}</div>
<!--            <i class="el-icon-more more-icon"/>-->
            <div class="more-icon">
              <el-popover
                placement="right"
                class="more-popover"
                width="50"
                trigger="click">
                <ul class="application-manage-tool-list">
                  <li @click="handleEditTemp(item)">
                    <svg class="icon" aria-hidden="true" style="margin-right: 12px;width: 15px;height: 15px;">
                      <use :xlink:href="'#'+ 'icon-edit-filling'"></use>
                    </svg>编辑模板</li>
                  <li @click="handleDel(item)">
                    <svg class="icon" aria-hidden="true" style="margin-right: 12px;width: 15px;height: 15px;">
                      <use :xlink:href="'#'+ 'icon-delete-filling'"></use>
                    </svg>删除模板</li>
                </ul>
                <i class="el-icon-more" slot="reference"></i>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <jvs-form v-if="dialogVisible" ref="tempForm" :option="option" :formData="formData" @submit="submitForm" @cancalClick="handleClose">
        <template slot="imgForm">
          <div v-if="formData.img" class="select-image-show">
            <img :src="formData.img" alt="">
            <i class="el-icon-delete delete-select-image-tool" @click="delIamgeSelect('img')"></i>
          </div>
          <jvs-button v-else @click="chooseImage('img')">选择图片</jvs-button>
        </template>
      </jvs-form>
    </el-dialog>
    <imageSelect ref="logoSelect"
       title="选择图片"
       :dialogVisible="chooseAble"
       :paramInfo="{'module': 'application'}"
       @handleConfirm="handleConfirm"
       @handleClose="chooseAble = false;"
    ></imageSelect>
  </div>
</template>

<script>
import {addTemplate, editTemplate, getTemplateList, delTemplate} from "@/api/application";
import imageSelect from "@/components/basic-assembly/ImageSelect";

export default {
  name: "templateCenter",
  components: {
    imageSelect
  },
  data () {
    return {
      templateList: [],
      dialogVisible: false,
      title: '添加三方模板',
      isEdit: false,
      chooseAble: false,
      imgProp: '',
      option: { // 对应表单设置
        labelWidth: '90px',
        // submitBtn: false,
        emptyBtn: false,
        addBtn: false,
        menu: false,
        cancal: true,
        showOverflow: true,
        // btnHide: true,
        formAlign: 'top',
        column: [
          {
            label: '模板名称',
            prop: 'name',
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
          },
          {
            label: '描述',
            type: 'textarea',
            rows: 5,
            searchSpan: 4,
            prop: 'description',
            rules: [
              { required: true, message: '请输入描述', trigger: 'blur' }
            ],
          },
          {
            label: 'url地址',
            prop: 'url',
            rules: [
              { required: true, message: '请输入数据处理地址', trigger: 'blur' }
            ],
          },
          {
            label: '图片',
            prop: 'img',
            formSlot: true,
            rules: [
              { required: true, message: '请选择图片', trigger: 'blur' }
            ],
          },
        ],
      },
      formData: {
      },
    }
  },
  created() {
    this.getTemplateList()
  },
  methods: {
    // 选择图片
    chooseImage (prop) {
      this.imgProp = prop
      this.chooseAble = true
      this.$refs.logoSelect.init()
    },
    // 确认图片
    handleConfirm (value) {
      this.chooseAble = false;
      if(value && value.fileLink) {
        this.$set(this.formData, this.imgProp, value.fileLink)
      }
    },
    // 删除已选图片
    delIamgeSelect (prop) {
      this.$set(this.formData, prop, '')
    },
    handleAddTemp() {
      this.isEdit = false
      this.title = '添加三方模板'
      this.dialogVisible = true
    },
    // 删除模板
    handleDel(obj) {
      this.$confirm('确认删除？').then(_ => {
        delTemplate(obj).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getTemplateList()
          }
        })
      }).catch(_ => {})
    },
    handleEditTemp(obj) {
      this.isEdit = true
      this.title = '编辑三方模板'
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(obj))
    },
    getTemplateList() {
      getTemplateList().then(res => {
        if (res.data && res.data.code == 0 && res.data.data) {
          this.templateList = [...res.data.data]
        }
      })
    },
    handleClose() {
      this.formData = {}
      this.dialogVisible = false
    },
    submitForm(form) {
      if (this.isEdit) {
        editTemplate(form).then(res => {
          if (res.data && res.data.code ==0) {
            this.$message.success('修改成功！')
            this.getTemplateList()
            this.dialogVisible = false
          }
        })
      } else {
        addTemplate(form).then(res => {
          if (res.data && res.data.code ==0) {
            this.$message.success('添加成功！')
            this.getTemplateList()
            this.dialogVisible = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.template-page{
  padding: 20px;
  border-radius: 6px;
  background-color: #ffffff;
  height: 100vh;
  overflow-y: auto;
  .template-header{
    .title{
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .explain{
      margin-bottom: 20px;
    }
  }
  .template-list-box{
    display: flex;
    flex-wrap: wrap;
    .template-item{
      cursor: pointer;
      position: relative;
      //padding: 12px;
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      width: 240px;
      margin-right: 30px;
      margin-bottom: 30px;
      &:hover{
        .del-icon{
          transition: 0.3s;
          color: #3471ff;
        }
        .item-footer{
          .more-icon{
            display: block;
          }
        }
      }
      .del-icon{
        font-size: 16px;
        position: absolute;
        top: 4px;
        right: 4px;
        color: #ffffff;
        z-index: 1000;
      }
      .item-content{
        //display: flex;
        margin-bottom: 10px;
        img{
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          width: 100%;
          height: 150px;
          margin-bottom: 10px;
        }
        .content-text{
          //margin-left: 10px;
          padding: 0 10px;
          .temp-name{
            margin-bottom: 6px;
          }
          .temp-description{
            color: #a2a3a5;
            width: 220px;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      .item-footer{
        display: flex;
        padding: 0 10px;
        margin-bottom: 10px;
        align-items: center;
        justify-content: space-between;
        .more-icon{
          display: none;
          font-size: 12px;
          .more-popover{
          }
        }
      }
    }
  }
}
.application-manage-tool-list{
  padding: 0;
  margin: 0;
  li{
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding-left: 20px;
    text-align: left;
  }
  li:hover{
    background: #eff2f7;
  }
}
.select-image-show{
  position: relative;
  img{
    display: block;
    width: 120px;
    height: 120px;
  }
  .delete-select-image-tool{
    position: absolute;
    top: 3px;
    left: 123px;
    cursor: pointer;
    color: #F56C6C;
  }
}
.icon{
  width: 40px;
  height: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
