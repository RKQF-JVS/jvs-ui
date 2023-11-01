<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="1240px"
      :before-close="handleClose"
      :class="isScreen ? 'dialog-box screen-img' : 'dialog-box'"
      append-to-body>
      <div class="dialog-box-content">
        <div class="header-box">
          <div>图片（共{{ page.total }}条）</div>
          <div style="display: flex;align-items: center">
            <span style="margin-right: 12px;color: #a2a3a5;font-size: 12px">大小不超过20MB</span>
            <el-upload
              v-if="dialogVisible"
              class="upload-demo"
              :action="`/mgr/jvs-auth//upload/${this.paramData.bucketName ? this.paramData.bucketName : 'jvs-public'}`"
              :data="paramData"
              :headers="header"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              multiple
              :limit="50"
              :show-file-list="false"
              :file-list="fileList">
              <el-button type="primary" size="small">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="categories-box">
          <span style="margin-right: 8px;">分类</span>
          <div v-for="(item, key) in labelList" :key="key">
            <div :tabindex="key" class="categories-item" :style="queryParams.label === item ? 'border: 1px solid #3471ff;color: #3471ff;' : ''" @click="handleClickItem(item, key)">{{ item }}</div>
          </div>
        </div>
        <div class="image-list-box">
          <div v-if="loading" class="loading-back"/>
          <div class="image-none"  v-if="isNone">
            <img src="@/const/img/emptyImage.png"/>
          </div>
          <div class="image-item" v-for="(item, key) in imageList" :key="key">
            <div class="search-icon">
              <i class="el-icon-search" @click="handlePreview(item)"/>
            </div>
            <div class="mask" @click="handleSelected(item)"/>
<!--            <el-image :src="item.fileLink">-->
<!--            </el-image>-->
            <img :src="item.fileLink" alt=""/>
          </div>
        </div>
        <div :class="{'image-pagination': true, 'screen-page': isScreen}">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="page.size"
            :pager-count="5"
            :current-page="current"
            @current-change="handleCurrentChange"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-image-viewer v-if="showViewer" :z-index="9999" :on-close="closeViewer" :url-list="previewSrcList"/>
  </div>
</template>

<script>
import {getImageList, getLabelList} from "../api";
import store from "@/store";

export default {
  name: "ImageSelect",
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    isScreen: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    defaultLabel: {
      type: String,
      default() {
        return ''
      }
    },
    paramInfo: {
      type: Object,
    }
  },
  watch: {
    dialogVisible(val) {
      this.current = 1
      if (val) {
        if(this.paramInfo) {
          this.$set(this.paramData, 'bucketName', this.paramInfo.bucketName || 'jvs-public')
          this.$set(this.paramData, 'module', this.paramInfo.module || 'chart')
          this.$set(this.paramData, 'label', this.paramInfo.label || '背景')
        }
        // this.queryParams.label = this.defaultLabel
        this.$nextTick(() => {
          this.getLabelList()
          this.getImages()
        })
      }
    }
  },
  data() {
    return {
      showViewer: false,
      previewSrcList: [],
      loading: false,
      page: {
        total: 0,
        size: 10
      },
      queryParams: {
        label: '背景'
      }, // 查询参数
      header: {
        "Authorization": 'Bearer ' + store.getters.access_token
      },
      paramData: {
        bucketName: 'jvs-public',
        module: 'chart',
        label: '背景'
      }, // 上传参数
      fileList: [],
      labelList: [],
      current: 1,
      total: 0,
      imageList: [],
      isNone: false,
      currentKey: 0
    }
  },
  methods: {
    // 关闭图片预览
    closeViewer() {
      this.showViewer = false
    },
    // 图片预览
    handlePreview(obj) {
      this.showViewer = true
      this.previewSrcList = [obj.fileLink]
    },
    // 图片选择确认
    handleSelected(obj) {
      // this.imageList = []
      this.$emit('handleConfirm', obj)
    },
    // 点击分类
    handleClickItem(label, key) {
      this.current = 1
      this.imageList = []
      this.currentKey = key
      this.queryParams.label = label
      this.paramData.label = label
      this.getImages()
    },
    init () {
      if(this.paramInfo) {
        this.$set(this.paramData, 'bucketName', this.paramInfo.bucketName || 'jvs-public')
        this.$set(this.paramData, 'module', this.paramInfo.module || 'chart')
        this.$set(this.paramData, 'label', this.paramInfo.label || '背景')
      }
    },
    // 文件上传成功
    handleAvatarSuccess (response, fileList) {
      if (response && response.code === 0) {
        this.getImages()
      }
    },
    // 删除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 删除文件前钩子
    beforeRemove(file, fileList) {
    },
    // 上传文件前钩子
    beforeUpload(file) {
      const png = 'image/png'
      const jpg = 'image/jpeg'
      const gif = 'image/gif'
      const isPassType = (file.type !== png && file.type !== jpg && file.type !== gif)
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (isPassType && !isLt2M) {
        this.$message.error('上传文件的格式只能是 png、jpg、jpeg、gif 格式，且文件大小不能超过 50MB！');
      } else if (isPassType) {
        this.$message.error('文件格式错误，仅支持上传png、jpg、jpeg、gif格式文件!');
      } else if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过 50MB!');
      }
      return !isPassType && isLt2M;
    },
    // dialog 关闭
    handleClose() {
      this.current = 1
      this.imageList = []
      this.paramData.label = '背景'
      this.queryParams.label = '背景'
      this.$emit('handleClose')
    },
    // 获取标签列表
    async getLabelList(){
      await getLabelList().then(res => {
        if (res.data && res.data.code === 0 && res.data.data) {
          this.labelList = [...res.data.data]
        }
      })
    },
    // 图片预加载完成
    handlePreloaded() {
    },
    // 获取图片列表
    async getImages() {
      this.loading = true
      const params = {
        current: this.current,
        size: 10,
        bucketName: this.paramInfo ? this.paramInfo.bucketName : 'jvs-public',
        fileType: 'image'
      }
      await getImageList(Object.assign(params, this.queryParams)).then(res => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.imageList = [...res.data.data.records]
            this.isNone = this.imageList.length === 0
            this.page.total = res.data.data.total
            this.loading = false
          } else {
            this.loading = false
          }
        }
      }).catch(err => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.current = val
      this.getImages()
    },
  }
}
</script>
<style lang="scss" scoped>
.dialog-box{
  .dialog-box-content{
    max-width: 1240px;
    //padding: 0 20px;
    margin: 0 auto;
    .header-box{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .categories-box{
      margin: 20px 0;
      display: flex;
      align-items: center;
      .categories-item{
        border-radius: 16px;
        font-size: 12px;
        color: #a2a3a5;
        padding: 6px 10px;
        margin: 10px 2px;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0);
        transition: 0.2s;
        &:hover{
          transition: 0.2s;
          border: 1px solid #3471ff;
          color: #3471ff;
        }
      }
    }
    .image-list-box{
      display: grid;
      flex-wrap: wrap;
      grid-template-columns: 180px 180px 180px 180px 180px;
      grid-template-rows: 180px 180px;
      justify-content: center;
      grid-row-gap: 30px;
      grid-column-gap: 30px;
      position: relative;
      margin-bottom: 20px;
      .loading-back{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0);
        background-image: url('../../../public/jvs-ui-public/img/loading.gif');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 200px 160px;
        z-index: 10;
      }
      .image-item{
        cursor: pointer;
        position: relative;
        .search-icon{
          position: absolute;
          right: 0;
          text-align: center;
          border-radius: 2px;
          top: 4px;
          opacity: 0;
          color: #ffffff;
          width: 20px;
          height: 20px;
          background-color: #3471ff;
          transition: 0.2s;
          z-index: 100;
        }
        .mask{
          border-radius: 4px;
          transition: 0.2s;
          background-color: rgba(255, 255, 255, 0);
          border: 1.5px solid rgba(255, 255, 255, 0);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 99;
        }
        .el-image{
          padding: 5%;
          border-radius: 4px;
          width: 90%;
          height: 90%;
          img{
            object-fit: contain;
          }
        }
        img{
          padding: 5%;
          border-radius: 4px;
          width: 90%;
          height: 90%;
          //object-fit: contain;
        }
        &:hover{
          transition: 0.2s;
          .mask{
            background-color: rgba(52, 113, 255, 0.03);
            border: 1.5px solid rgba(52, 113, 255, 0.5);
          }
          .search-icon{
            opacity: 1;
          }
        }
      }
    }
    .image-none{
      position: relative;
      height: 400px;
      width: 1020px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-pagination{
      width: 100%;
      padding: 30px 0 20px;
      text-align: right;
    }
    .screen-page{
      /deep/.el-pagination.is-background .btn-next, .el-pager li{
        background-color: #303640;
        color: #f4f4f5;
      }
      /deep/.el-pagination.is-background .btn-prev, .el-pager li{
        background-color: #303640;
        color: #f4f4f5;
      }
      /deep/.el-pagination.is-background .el-pager li{
        background-color: #303640;
        color: #f4f4f5;
      }
      /deep/.el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #5a626e;
        color: #f4f4f5;
      }
    }
  }
}
.screen-img/deep/{
   .el-dialog{
    background: #22242b;
    .el-dialog__title{
      color: #c5c5c5!important;
    }
    .el-form-item__label{
      color: #c5c5c5!important;
    }
  }
}
</style>
