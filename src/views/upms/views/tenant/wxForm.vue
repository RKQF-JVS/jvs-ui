<template>
  <div class="tenant-info-form">
<!--    <PageHeader :title="title" v-if="title">-->
<!--    </PageHeader>-->
    <div style="font-size: 18px;font-weight: bold;margin-bottom: 16px">公众号自动回复</div>
    <el-alert
      :closable="false"
      type="info">
      <template slot="title">
        <div class="alert-box">
          <i class="el-icon-info"/>
          <span style="font-size: 12px;">通过编辑内容或关键词规则，快速进行自动回复设置。如具备开发能力，可更灵活地使用该功能。配置自动回复之后，将立即对所有用户生效。<span style="color: #3471ff;cursor: pointer;"> 查看文档</span></span>
        </div>
      </template>
    </el-alert>
    <div class="wx-img">
      <img src="@/components/application/img/wxImg.jpg" alt=""/>
    </div>
    <div v-if="userForm && isConfig" class="info-box">
      <div class="left">
        <jvs-form
          ref="userForms"
          refs="userForm"
          :option="formOption"
          :formData="userForm"
          :defalutFormData="userForm"
          @submit="submitHandle"
        >
          <template slot="keywordJsonForm">
            <jvs-table
              pageheadertitle="关键字管理"
              :option="taboption"
              :data="tableData"
              :loading="tableLoading"
              @on-load="getList"
              @search-change="searchChange"
              @addRow="addRowHandle"
              @editRow="editRowHandle"
              @delRow="delRowHandle"
            >
              <template slot="subscribeUrl" slot-scope="scope">
                <img :src="scope.row.picUrl.fileLink" width="80px" height="50px">
              </template>
              <template slot="url" slot-scope="scope">
                <span @click="handleUrl(scope.row.url)" style="cursor: pointer;color: #3471FF">点击跳转</span>
              </template>
            </jvs-table>
          </template>
        </jvs-form>
      </div>
    </div>
    <div v-else class="wx-massage">
      <el-alert title="未完善公众号配置信息，无法配置公众号消息" type="warning" :closable="false"></el-alert>
      <div v-if="false" class="wx-btn">
        <jvs-button type="primary" icon="el-icon-video-play" @click="handleConfig">立即配置</jvs-button>
      </div>
    </div>
  </div>
</template>
<script>
import PageHeader from '@/components/page-header/PageHeader.vue';
import store from "@/store";
import {getTenantConfig} from "@/api/common";
export default {
  name: "tenant-form",
  props: {
    title: {
      type: String
    },
    keywordJson:{
      type:Array,
      default(){
        return []
      }
    },
    subscribeUrl:{
      type:Array,
      default(){
        return []
      }
    },
    rowData: {
      type: Object,
      default(){
        return {
          welcomeText:'',
          keywordText:''
        }
      }
    },
    submitType: {
      type: String
    },
    permisionFlag: {
      type: String
    }
  },
  components: {
    PageHeader
  },
  data() {
    return {
      tableLoading: false,
      taboption: {
        menuAlign: 'center',
        align: 'center',
        // showOverflow: true,
        search: true,
        addBtn: this.$permissionMatch("upms_dataAuth_add"),
        editBtn: this.$permissionMatch("upms_dataAuth_edit"),
        delBtn: this.$permissionMatch("upms_dataAuth_delete"),
        viewBtn: false,
        cancal: false,
        // page: true,
        submitLoading: false,
        column: [
          {
            label: "关键字",
            prop: "key",
            rules: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
          },
          {
            label: "图文消息描述",
            prop: "description",
            hide: true,
            rules: [{ required: true, message: '请输入图文消息描述', trigger: 'blur' }],
          },
          {
            label: "图文消息标题",
            prop: "title",
            rules: [{ required: true, message: '请输入图文消息标题', trigger: 'blur' }],
          },
          {
            label: "图文消息图片",
            prop: "subscribeUrl",
            type: 'imageUpload',
            // rules: [{ required: true, message: '请输入图文消息图片', trigger: 'blur' }],
            fileList:[],
            action:'/mgr/jvs-auth/upload/jvs-public',
            limit:1,
            headers:{
              "Authorization": 'Bearer ' + store.getters.access_token
            },
            slot:true
          },
          {
            label: "跳转链接",
            prop: "url",
            slot:true
            // rules: [{ required: true, message: '请输入跳转链接', trigger: 'blur' },
            //   {pattern:/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '请输入正确的链接地址',trigger:'blur'}],
          }
        ]
      }
      ,
      tableData: JSON.parse(JSON.stringify(this.keywordJson)),
      page:{
        currentPage:1,
        size:20,
        total:0
      },
      userForm: JSON.parse(JSON.stringify(this.rowData)),
      isConfig: false, // 是否配置
      disSubmit: false,
      formOption: {
        cancal: false,
        submitLoading: false,
        emptyBtn:false,
        submitBtn:true,
        formAlign: 'top',
        // btnHide:true,
        column: [
          {
            label: '欢迎语', // '关键字对应的回复内容',
            prop: 'welcomeText',
            span: 13,
            type:'textarea',
            autoSize :{minRows:4,maxRows:4},
            showwordlimit: true,
            rules: [
              { required: true, message: '请输入欢迎语', trigger: 'blur' }
            ]
          },
          {
            label: '关键字信息',
            prop: 'keywordText',
            span: 13,
            search: true,
            type:'textarea',
            autoSize :{minRows:4,maxRows:4},
            searchSpan: 4,
            rules: [
              { required: true, message: '请输入关键字信息', trigger: 'blur' }
            ]
          },
          {
            label: '图片',
            prop: 'fileList',
            type: 'imageUpload',
            action: '/mgr/jvs-auth/upload/jvs-public',
            fileList: [],
            limit: 3,
            // rules: [{required: true, message: '请上传图片', trigger: 'change'}],
            headers: {
              Authorization: 'Bearer ' + store.getters.access_token
            }
          },
          {
            label: '关键字消息',
            prop: 'keywordJson',
            span: 24,
            formSlot: true,
          }
        ]
      }
    };
  },
  methods: {
    searchChange(){

    },
    getList() {
    },
    addRowHandle(form){
      console.log(form)
      this.taboption.column[3].fileList=[]
      this.$forceUpdate()
      this.keywordJson.push(
        {
          ...form,
          picUrl:{
            bucketName:'jvs-public',
            fileName:form.subscribeUrl ? form.subscribeUrl[0].fileName : '',
            originalName:form.subscribeUrl ? form.subscribeUrl[0].name : '',
            fileLink:form.subscribeUrl ? form.subscribeUrl[0].url : ''
          }
        }
      )
    },
    delRowHandle(val,index){
      this.keywordJson.splice(index,1)
    },
    editRowHandle(val,index){
      this.keywordJson.splice(index,1,{
        ...val,
        picUrl:{
          bucketName:'jvs-public',
          fileName:val.subscribeUrl[0].fileName,
          originalName:val.subscribeUrl[0].name,
          fileLink:val.subscribeUrl[0].url
        }
      })
    },
    // 配置公众号
    handleConfig() {},
    // 提交
    submitHandle (form) {
      form.keywordJson = JSON.parse(JSON.stringify(this.keywordJson))
      this.$emit('nextStep',form)
    },
    // 点击跳转
    handleUrl(url) {
      this.$openUrl(url, 'blank')
    },
    // 获取消息类型配置
    getTenantConfig() {
      getTenantConfig().then(res => {
        if (res.data && res.data.code == 0) {
          const arr = res.data.data || []
          this.isConfig = arr.indexOf('WECHAT_MP_MESSAGE') > -1
        }
      })
    }
  },
  created () {
    this.getTenantConfig()
  },
  watch:{
    keywordJson(newVal,oldVal){
      this.tableData =  JSON.parse(JSON.stringify(this.keywordJson)),
        this.$forceUpdate()
    },
    subscribeUrl(newVal,oldVal){
      this.fileList =  JSON.parse(JSON.stringify(this.subscribeUrl)),
        this.$forceUpdate()
    },
    rowData(newVal,oldVal){
      this.userForm = JSON.parse(JSON.stringify(this.rowData))
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant-info-form{
  /deep/.jvs-table .table-body-box .el-table .el-table__body-wrapper{
    height: auto!important;
    max-height: calc(100vh - 380px)!important;
    width: 100%;
  }
  padding: 40px;
  /deep/.el-alert--info.is-light{
    width: 60%;
    margin-bottom: 16px;
  }
  .alert-box{
    i{
      margin-right: 8px;
      color: #3471ff;
    }
  }
  .wx-img{
    width: 200px;
    margin-bottom: 16px;
    img{
      width: 100%;
    }
  }
  .wx-massage{
    width: 400px;
    margin-bottom: 16px;
  }
  .wx-btn{
    margin: 16px 0;
  }
  .info-box{
    //width: 50%;
  }
}
// .info-box {
//   margin-top: 10px;
//   background: #fff;
//   padding: 8px 10px;
//   .left{
//     border-radius: 10px;
//   }
//   .img-list{
//     display: flex;
//     justify-content: space-between;
//     div{
//       width: 46%;
//       border: 1px solid #e5e5e5;
//       border-radius: 10px;
//       padding: 10px;
//       margin-bottom: 10px;
//       cursor: pointer;
//     }
//     .activeStyle{
//       border-color: #409EFF;
//       position: relative;
//       color: #409EFF;
//     }
//     .activeStyle::after{
//       content: "√";
//       position: absolute;
//       top: 5px;
//       right: 10px;
//       color: #409EFF;
//       font-size: 20px;
//     }
//     p{
//       margin: 0;
//       padding: 0;
//       text-align: center;
//     }
//     img{
//       display: block;
//       width: 100%;
//       height: 200px;
//     }
//   }
// }
// .el-upload__tip{
//   margin-left: 10px;
// }
// </style>
// <style lang="scss">
// .hide-password-input{
//   .el-input__suffix{
//     .el-input__suffix-inner{
//       display: none;
//     }
//   }
// }
// .tenant-info-form{
//   padding-top: 10px;
//   padding-left: 90px;
//   box-sizing: border-box;
//   .el-card {
//     .el-card__body{
//       padding: 10px!important;
//     }
//   }
//   .avatar-uploader .el-upload {
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .avatar-uploader .el-upload__tip{
//     display: block;
//     margin: 0;
//   }
//   .avatar-uploader .el-upload:hover {
//     border-color: #409EFF;
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 160px;
//     height: 100px;
//     line-height: 100px;
//     text-align: center;
//   }
//   .avatar {
//     width: 160px;
//     height: 100px;
//     display: block;
//   }
//   .delImg{
//     position: absolute;
//     left: 160px;
//     top: 5px;
//     z-index: 999;
//     cursor: pointer;
//   }
//   .info-box{
//     margin: 0;
//     padding: 0;
//     .left{
//       .el-form{
//         .el-row{
//           display: flex;
//           flex-wrap: wrap;
//           .el-col{
//             padding: 0 5px;
//           }
//         }
//       }
//     }
//   }
// }
// .el-dialog__body {
//     color: #606266;
//     font-size: 30px;
// }
// .el-icon-delete:before{
//     margin-left: -25px;
// }

</style>
