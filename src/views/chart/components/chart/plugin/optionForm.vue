<template>
  <div class="gallery-option-form">
    <jvs-form :option="option" :formData="formData"></jvs-form>
    <div v-if="shape === 'DataCard' || shape === 'InfoCard'" class="back-select">
      <div class="select-label">背景图片</div>
      <div class="select-image">
<!--        <el-upload-->
<!--          class="upload-demo"-->
<!--          :action="`/mgr/chart-design//upload/${paramData.bucketName}`"-->
<!--          :data="paramData"-->
<!--          :headers="header"-->
<!--          :on-success="handleAvatarSuccess"-->
<!--          :on-remove="handleRemove"-->
<!--          :before-remove="beforeRemove"-->
<!--          :before-upload="beforeUpload"-->
<!--          multiple-->
<!--          :limit="3"-->
<!--          :show-file-list="false"-->
<!--          :file-list="fileList">-->
<!--          <el-button style="margin-right: 8px" size="mini">点击上传</el-button>-->
<!--        </el-upload>-->
        <el-button size="mini" @click="handleFocus">选择图片</el-button>
<!--        <el-input v-model="imgName" placeholder="默认" style="width: 100%" size="mini" @focus="handleFocus"></el-input>-->
      </div>
    </div>
    <ImageSelect
      :dialogVisible="dialogVisible"
      :title="'图片选择'"
      :defaultLabel="defaultLabel"
      @handleClose="handleClose"
      @handleConfirm="handleConfirm"
    />
  </div>
</template>
<script>
import GLine from './chart/line'
import GHist from './chart/histogram'
import GPie from './chart/pie'
import GBarChart from './chart/bar'
import GScatter from './chart/scatter'
import GStackArea from "./chart/stackArea";
import GDashBoard from "./chart/dashBoard";
import GFunnelChart from "./chart/funnel";
import GDataCard from "./chart/dataCard";
import GInfoCard from "./chart/infoCard";
import ImageSelect from "../../imageSelect/ImageSelect"; // progress bar style
export default {
  name: 'option-form',
  components: {ImageSelect},
  props: {
    shape: {
      type: String,
      default: ''
    },// 设置表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {},
  data () {
    return {
      defaultLabel: '',
      dialogVisible: false,
      model: {}, // 图表实体所带参数
      option: { // 对应表单设置
        labelWidth: '120px',
        submitBtn: false,
        emptyBtn: false,
        cancal: false,
        btnHide: true,
        column: []
      },
    }
  },
  created () {
    this.getGallery(this.shape)
    this.createGallery()
  },
  methods: {
    // 确认选择
    handleConfirm(obj) {
      this.imgName = obj.fileLink
      this.formData.back = obj.fileLink
      this.handleClose()
    },
    // dialog 关闭
    handleClose() {
      this.dialogVisible = false
      this.defaultLabel = '背景'
    },
    // input输入框获取焦点事件
    handleFocus() {
      this.defaultLabel = '背景'
      this.dialogVisible = true
    },
    // 根据类型获取实体
    getGallery (type) {
      switch(type) {
        case 'LineChart' : this.model = new GLine();break;
        case 'HistogramChart' : this.model = new GHist();break;
        case 'Pie' : this.model = new GPie();break;
        case 'BarChart': this.model = new GBarChart();break;
        case 'ScatterChart': this.model = new GScatter();break;
        case 'AreaChart': this.model = new GStackArea();break;
        case 'DashBoardChart': this.model = new GDashBoard();break;
        case 'FunnelChart': this.model = new GFunnelChart();break;
        case 'DataCard': this.model = new GDataCard();break;
        case 'InfoCard': this.model = new GInfoCard();break;
        default: this.model = null;break;
      }
    },
    // 根据实体生成表单设置
    createGallery () {
      this.imgName = this.formData.back
      const unlimited = ['infoUrl', 'unit']  // 无需验证的字段
      Object.keys(this.model.setting).forEach(item => {
        if(['shape', 'span', 'id', 'dicData'].indexOf(item) === -1) {
          let label = ''
          let itemType = 'input'
          let dicData = []
          let max = 0
          let min = 0
          let maxLength = undefined
          switch (item) {
            case 'cardTitle':
              label = '标题'
              itemType = 'input'
              maxLength = 20
              break;
            case 'name':
              label = '标题'
              maxLength = 20
              itemType = 'input'
              break;
            case 'cardContent':
              label = '内容'
              itemType = 'textarea'
              break;
            case 'unit':
              label = '单位'
              itemType = 'input'
              maxLength = 10
              break;
            case 'titleSize':
              label = '标题字体大小'
              itemType = 'slider'
              max = 50
              min = 0
              break;
            case 'contentSize':
              label = '内容字体大小'
              itemType = 'slider'
              max = 50
              min = 0
              break;
            case 'titleWeight':
              label = '标题字体粗细'
              itemType = 'slider'
              max = 10
              min = 0
              break;
            case 'contentWeight':
              label = '内容字体粗细'
              itemType = 'slider'
              max = 10
              min = 0
              break;
            case 'titleColor':
              label = '标题颜色'
              itemType = 'colorSelect'
              break;
            case 'contentColor':
              label = '内容颜色'
              itemType = 'colorSelect'
              break;
            case 'infoUrl':
              label = '链接地址'
              itemType = 'input'
              break;
            case 'step':
              if (this.formData.type === 'hist') {
                label = '步长范围'
                itemType = 'inputNumber'
                min = 1
                max = 1000
              }
              break;
            case 'xUnit':
              label = '横向值单位'
              itemType = 'input'
              break;
            case 'yUnit':
              label = '纵向值单位'
              itemType = 'input'
              break;
            default: break;
          }
          let obj = {
            label: label,
            prop: item,
            type: itemType,
            span: 24,
            rules: unlimited.includes(item) ? [] : [{ required: true, message: '请输入'+label, trigger: 'blur' }],
            max: max,
            min: min,
            maxlength: maxLength
          }
          if(dicData.length > 0) {
            obj.dicData = dicData
          }
          if (label !== '') {
            this.option.column.push(obj)
          }
        }
      })
    }
  },
  watch: {
    formData: {
      handler: function (newV, oldV) {
        console.log(newV)
        this.$emit('setSetting', newV)
      },
      deep: true
    }
  },
}
</script>
<style lang="scss">
.gallery-option-form{
  margin-right: 20px;
  padding: 10px;
  .back-select{
    display: flex;
    align-items: center;
    .select-label{
      text-align: right;
      height: 28px;
      line-height: 28px;
      width: 108px;
      padding: 0 12px 0 0;
    }
    .select-image{
      width: calc(100% - 120px);
    }
  }
  .el-form{
    .el-row{
      .el-col{
        .el-input-number{
          width: 100%;
        }
      }
    }
  }
}
</style>
