<template>
  <div class="wx-settings">
    <jvs-tab
    :active="activeName"
    :option="option">
    <!-- 插槽 -->
      <template slot="logoForm">
        <el-upload class="upload-demo"
          :action="`/mgr/jvs-auth/upload/jvs-public`"
          :data="paramData"
          :headers="header"
          :on-exceed="handleExceed"
          list-type="picture-card"
          :limit='2'
          :file-list="fileList"
          :on-preview='handleContImgPreview'
          :on-remove='handleRmove'
          :on-success="handleSuccess"
          ref="upload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </template>
      <template slot="second">
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
        </jvs-table>
      </template>
    </jvs-tab>
    <el-image-viewer :z-index="20001" v-if="showViewer"  :on-close="handleClose" :url-list="priviewList"/>
  </div>
</template>
<script>
import store from "@/store";
import wxForm from '../tenant/wxForm'
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {wxForm,ElImageViewer},
  props:{
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
    }
  },
  data(){
    return {
      paramData: {},
      header: {
        "Authorization": 'Bearer ' + store.getters.access_token
      },
      activeName:'logoForm',
      //存放图片路径的数组
      dialogImageUrl: [],
      //取消放大的图片
      dialogVisible: false,
      // 查询条件
      queryParams: {},
      tableLoading: false,
      option: {
        type: "card",
        column: [
          {
            label: "图片管理",
            name: "logoForm",
          },
          {
            label: "关键字管理",
            name: "second",
          }
        ]
      },
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
            rules: [{ required: true, message: '请输入图文消息图片', trigger: 'blur' }],
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
            rules: [{ required: true, message: '请输入跳转链接', trigger: 'blur' },
            {pattern:/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: '请输入正确的链接地址',trigger:'blur'}],
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
      fileList:JSON.parse(JSON.stringify(this.subscribeUrl)),
      priviewList:[],
      showViewer:false
    }
  },
  watch:{
    keywordJson(newVal,oldVal){
      this.tableData =  JSON.parse(JSON.stringify(this.keywordJson)),
      this.$forceUpdate()
    },
    subscribeUrl(newVal,oldVal){
      this.fileList =  JSON.parse(JSON.stringify(this.subscribeUrl)),
      this.$forceUpdate()
    }
  },
  methods:{
    handleClose(){
      this.priviewList = []
      this.showViewer = false
    },
    handleRmove(file, fileList){
      this.fileList = fileList
    },
    handleContImgPreview(){
      this.priviewList = []
      this.fileList.forEach(item=>{
        this.priviewList.push(item?.response?.data?.fileLink || item.url)
      })
      this.showViewer = true
      this.$forceUpdate()
    },
    handleSuccess(response, file, fileList){
      this.fileList = fileList
    },
    getList() {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    searchChange(){

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
            fileName:form.subscribeUrl[0].fileName,
            originalName:form.subscribeUrl[0].name,
            fileLink:form.subscribeUrl[0].url
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
    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
.wx-settings{
  padding: 0px 20px;
}
.wx-settings{
  height: calc(100% - 250px);
  overflow: hidden;
  /deep/ .el-table__body-wrapper{
    overflow-y: auto !important;
    height:calc(100vh - 550px) !important;
    max-height: calc(100vh - 550px) !important;
  }
}
</style>
