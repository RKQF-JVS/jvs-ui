<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      fullscreen
      :before-close="handleClose"
      class="dialog-box no-header-dialog form-fullscreen-dialog"
      append-to-body>
      <div class="dialog-box-content">
        <div class="left-part">
          <el-menu
            :default-active="defaultLabel"
            class="el-menu-vertical-demo"
            @select="handleClickLabel"
          >
            <el-menu-item v-for="(item, key) in labelList" :key="key" :index="item">
              <span slot="title">{{ item }}</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div id="right-part" class="right-part" style="">
          <div v-if="loading" class="loading-back-box"></div>
          <el-upload
            v-if="dialogVisible"
            class="upload-demo"
            :action="`/mgr/jvs-auth//upload/${paramData.bucketName}`"
            :data="paramData"
            :headers="header"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            multiple
            :limit="3"
            :show-file-list="false"
            :file-list="fileList">
            <el-button style="margin-bottom: 8px" size="small">点击上传</el-button>
          </el-upload>
          <div v-if="imageList.length > 0" class="image-box">
            <vue-waterfall-easy
              ref="waterfall"
              srcKey="fileLink"
              :imgsArr="imageList"
              @scrollReachBottom="getImages"
              @click="handleConfirm"
            >
              <div slot="loading" slot-scope="{isFirstLoad}">
                <div slot="loading" v-if="isFirstLoad"></div>
              </div>
              <div slot="waterfall-over">没有更多数据</div>
            </vue-waterfall-easy>
          </div>
          <div class="image-box-no-data" v-else>
            <img src="@/const/img/emptyImage.png"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getImageList, getLabelList} from "../../api/chart";
import store from "@/store";
import vueWaterfallEasy from 'vue-waterfall-easy'

export default {
  name: "ImageSelect",
  components: {
    vueWaterfallEasy
  },
  props: {
    dialogVisible: {
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
      this.loading = true
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
      loading: false,
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
    }
  },
  methods: {
    init () {
      if(this.paramInfo) {
        this.$set(this.paramData, 'bucketName', this.paramInfo.bucketName || 'jvs-public')
        this.$set(this.paramData, 'module', this.paramInfo.module || 'chart')
        this.$set(this.paramData, 'label', this.paramInfo.label || '背景')
      }
      // this.$nextTick(() => {
      //   this.getLabelList()
      //   this.getImages()
      //   const el = document.getElementById('right-part');
      //   const offsetHeight = el.offsetHeight;
      //   el.onscroll = () => {
      //     const scrollTop = el.scrollTop;
      //     const scrollHeight = el.scrollHeight;
      //     if ((offsetHeight + scrollTop) === scrollHeight) {
      //       this.current++
      //       this.getMoreImages()
      //     }
      //   };
      // })
    },
    // 点击label
    handleClickLabel(e) {
      this.current = 1
      this.loading = true
      this.queryParams.label = e
      this.imageList = []
      this.getImages()
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
      const isPassType = (file.type !== png && file.type !== jpg)
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (isPassType && !isLt2M) {
        this.$message.error('上传文件的格式只能是 png、jpg、jpeg 格式，且文件大小不能超过 20MB！');
      } else if (isPassType) {
        this.$message.error('文件格式错误，仅支持上传png、jpg、jpeg格式文件!');
      } else if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过 20MB!');
      }
      return !isPassType && isLt2M;
    },
    // dialog 关闭
    handleClose() {
      this.imageList = []
      this.$emit('handleClose')
    },
    // dialog 确认
    handleConfirm(event, { index, value }) {
      // const obj = { fileLink: value.src }
      // console.log(obj)
      this.imageList = []
      this.$emit('handleConfirm', value)
    },
    // 获取标签列表
    async getLabelList(){
      await getLabelList().then(res => {
        if (res.data && res.data.code === 0) {
          this.labelList = [...res.data.data]
        }
      })
    },
    // 图片列表数组等长分割
    cutArr(arr, size){
      const arrTemp = []
      for(let i = 0; i <arr.length; i += size){
        arrTemp.push(arr.slice(i , i + size));
      }
      return arrTemp
    },
    // 获取图片列表
    async getImages() {
      // this.loading = true
      const params = {
        current: this.current,
        size: 40,
        bucketName: 'jvs-public',
        fileType: 'image'
      }
      await getImageList(Object.assign(params, this.queryParams)).then(res => {
        if (res.data.code === 0) {
          if (res.data.data) {
            const arr = [...res.data.data.records]
            this.imageList = this.imageList.concat([...arr])
            if (arr.length > 0) {
              this.current++
            } else {
              this.$nextTick(() => {
                // this.$refs.waterfall.waterfallOver()
              })
            }
            this.loading = false
          }
        }
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
::v-deep.dialog-box{
  .el-dialog__body{
    padding: 10px 20px 20px;
  }
  .dialog-box-content{
    height: calc(100vh - 85px);
    display: flex;
    .left-part{
      width: 15%;
      overflow: auto;
      margin-right: 8px;
      border-right: 1px solid #eff2f7;
      .el-menu-vertical-demo{
        .el-menu-item{
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          &:hover{
            background-color: #eff2f7;
          }
        }
        .el-menu-item.is-active {
          color: #333333;
          background-color: #eff2f7;
        }
      }
    }
    .right-part{
      .loading-back-box{
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 10;
        width: 85%;
        height: calc(100vh - 85px);
        position: absolute;
        background-image: url('../../../../../public/jvs-ui-public/img/loading.gif');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 300px 240px;
      }
      overflow: auto;
      width: 85%;
      .upload-demo{
      }
      .image-box{
        height: calc(100vh - 125px);
      }
      .image-box-no-data{
        width: 100%;
        text-align: center;
      }
      .pagination-box{
        margin-top: 8px;
        text-align: right;
      }
    }
  }
}
</style>
