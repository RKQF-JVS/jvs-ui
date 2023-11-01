<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    class="video-dialog"
    width="1080px"
    :close-on-press-escape="false"
    :before-close="handleClose">
    <video class="video-box" :src="videoSrc" width="1080" controls>
      <source :src="videoSrc" type="video/mp4">
    </video>
  </el-dialog>
</template>

<script>
export default {
  name: "videoPreview",
  data() {
    return {
      dialogVisible: false,
      videoSrc: ''
    };
  },
  computed: {
    dialogTitle () {
      return this.title
    },
    openUrl () {
      return this.dicStr
    },

  },
  methods: {
    init() {
      let url = ''
      this.$store.state.common.systemHelpDict.forEach(item => {
        if (item.label === this.openUrl) {
          url = item.value
        }
      })
      this.videoSrc = url
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.video-dialog/deep/{
  .el-dialog__header{
    display: none!important;
  }
  .el-dialog__body{
    border-radius: 8px!important;
    padding: 0!important;
    height: 605px;
  }
  .video-box{
    border-radius: 8px!important;
  }
}
</style>
