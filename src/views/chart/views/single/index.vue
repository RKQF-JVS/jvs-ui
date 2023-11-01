<template>
  <div :style="isFilter ? 'margin-top: 0' : 'margin-top: 10px; height: calc(100% - 70px);'" class="gallery-list-box gallery-list-box-without-date">
<!--    <div v-if="selectControl" class="select-control-form-box">-->
<!--      <div class="form-header">-->
<!--        <div>筛选设置</div>-->
<!--        <i class="el-icon-close close-icon" @click="handleClose"/>-->
<!--      </div>-->
<!--      <div style="width: 100%; height: 1px;background-color: #f2f2f2"/>-->
<!--      <div class="form-body">-->
<!--        <jvs-form :option="formOption" :formData="formData" @submit="handleSubmit"></jvs-form>-->
<!--      </div>-->
<!--    </div>-->
    <div v-if="isFilter" class="query-box">
      <div
        class="query-body"
        v-for="(item, key) in queryList"
        :style="(item.type === 'datetimerange' || item.type === 'daterange') ? 'width: 36%;' : ''" :key="key">
        <span :title="item.label" class="query-label">{{ item.label.length > 6 ? item.label.substr(0, 4) + '...：' : item.label + '：' }}</span>
        <el-input v-if="item.type === 'input'" size="mini"></el-input>
        <el-select v-model="selectVal" v-if="item.type === 'select'" size="mini">
        </el-select>
        <el-date-picker
          v-if="item.type === 'datetimerange' || item.type === 'daterange'"
          :type="item.type"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <i class="el-icon-setting plus-icon delete-icon" @click="handleSetItem(item)"/>
        <i class="el-icon-delete plus-icon delete-icon" @click="handleDeleteItem(item)"/>
      </div>
      <i class="el-icon-plus plus-icon query-plus-icon" @click="handleAddControl"></i>
    </div>
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[15, 15]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="(item, index) in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @resized="resizedEvent"
      >
        <div :class="{'item-box': true, 'warning-item-box': !item.isNull}">
          <div class="delete-item" v-if="!statusBool">
            <i class="el-icon-s-tools" style="margin-right: 10px" @click="setGallery(item, index)"></i>
            <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
          </div>
          <gallery
            v-if="item.isNull || item.isMock"
            :shape="item.type"
            :width="item.resizeWidth ? item.resizeWidth : Number.parseInt(item.w * (MobileWidth / 12))"
            :height="item.resizeHeight ? item.resizeHeight : (item.h * 50 - 100- item.data.setting.titleSize - item.data.setting.titleWeight)"
            :dataSource="item.dataSource"
            :setting="item.data.setting"
            :tableData="item.data.tableData"
            :column="item.data.column"
            :cardTitle="item.data.cardTitle"
            :cardContent="item.data.cardContent"
          />
<!--          <gallery-->
<!--            v-if="item.isNull || item.isMock"-->
<!--            :shape="item.type"-->
<!--            :width="item.resizeWidth ? item.resizeWidth : Number.parseInt(item.w * (MobileWidth / 12))"-->
<!--            :height="item.resizeHeight ? (item.resizeHeight - 30) : (item.h * 50 - 100 - item.data.setting.titleSize - item.data.setting.titleWeight)"-->
<!--            :dataSource="item.dataSource"-->
<!--            :setting="item.data.setting"-->
<!--            :tableData="item.data.tableData"-->
<!--            :column="item.data.column"-->
<!--            :cardTitle="item.data.cardTitle"-->
<!--            :cardContent="item.data.cardContent"-->
<!--          />-->
          <div class="image-none" v-else>
            <img
              class="image-style"
              :src="dataNull"
            />
          </div>
        </div>
      </grid-item>
    </grid-layout>
    <el-dialog
      title="筛选设置"
      :visible.sync="selectControl"
      width="30%"
      :before-close="handleClose"
      append-to-body
    >
      <jvs-form :option="formOption" :formData="formData" @submit="handleSubmit"></jvs-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import VueGridLayout from 'vue-grid-layout';
import dataNull from '@/views/chart/styles/chart/dataNull.png'
import gallery from '@/views/chart/components/chart/plugin/gallery'

export default {
  name: 'single-gallery',
  components: {gallery, GridLayout: VueGridLayout.GridLayout, GridItem: VueGridLayout.GridItem },
  props: {
    layouts: {
      type: Array,
      default: () => {
        return []
      }
    },
    timeType: {
      type: String,
      default: () => {
        return ''
      }
    },
    statusBool: {
      type: Boolean
    },
    isFilter: {
      type: Boolean
    },
    titleHeight: {
      type: Number
    }
  },
  computed: {
    layout () {
      return this.layouts
    },
    // 屏幕宽度
    MobileWidth () {
      return this.$store.state.common.MobileWidth || document.body.clientWidth
    },
  },
  watch: {
    isFilter(val) {
      if (!val) {
        this.queryList = []
        this.selectControl = false
        this.$emit('clearQueryList')
      }
    }
  },
  data () {
    return {
      selectVal: '',
      dataNull,
      queryList: [],
      selectControl: false,
      formOption: {
        cancal: false,
        emptyBtn: false,
        submitBtn: false,
        submitBtnText: '保存',
        column: [
          {
            label: "筛选控件",
            prop: "filterControl",
            type: "select",
            defaultValue: 'input',
            dicData: [
              {label: "年月日时分秒", value: "datetimerange"},
              {label: "年月日", value: "daterange"},
              // {label: "选择器", value: "select"},
              // {label: "数字", value: "inputNumber"},
              {label: "字符", value: "input"},
            ],
            rules: [
              { required: true, message: "请选择筛选条件", trigger: "blur" },
            ]
          },
          {
            label: "标签名称",
            prop: "labelName",
            rules: [
              { required: true, message: "请输入标签名称", trigger: "blur" },
            ]
          },
          {
            label: "筛选关键字",
            prop: "filterKey",
            rules: [
              { required: true, message: "请输筛选关键字", trigger: "blur" },
            ]
          },
          {
            label: "默认值",
            prop: "defaultVal",
            // rules: [
            //   { required: true, message: "请输默认值", trigger: "blur" },
            // ]
          },
        ]
      },
      formData: {}
    }
  },
  methods: {
    setQueryList(arr) {
      this.queryList = [...arr]
    },
    // 筛选控件设置表单提交
    handleSubmit() {
      const { defaultVal, filterControl, filterKey, labelName } = this.formData
      if (this.isAdd) {
        const obj = { id: new Date().getTime(), label: labelName, type: filterControl, defaultVal, filterKey }
        this.queryList.push(obj)
      } else {
        const that = this
        const index = that.queryList.findIndex(function (n) {
          return n.id === that.tempId
        })
        that.queryList[index] = {label: labelName, type: filterControl, defaultVal, filterKey}
      }
      this.$emit('getQueryList', [...this.queryList])
      this.handleClose()
    },
    // 筛选控件表单弹窗关闭
    handleClose() {
      this.formData = {}
      this.selectControl = false
    },
    // 新增查询控件
    handleAddControl() {
      this.handleClose()
      this.$nextTick(() => {
        this.isAdd = true
        this.selectControl = true
      })
      // const obj = { label: '行业分类', type: 'input', typeOf: 'string' }
      // this.queryList.push(obj)
    },
    // 设置一个筛选控件
    handleSetItem(item) {
      this.handleClose()
      this.$nextTick(() => {
        this.isAdd = false
        this.tempId = item.id
        this.selectControl = true
        this.formData = {
          defaultVal: item.defaultVal,
          filterControl: item.type,
          filterKey: item.filterKey,
          labelName: item.label
        }
      })
    },
    // 删除一个筛选控件
    handleDeleteItem(item) {
      this.handleClose()
      const index = this.queryList.findIndex(function (n) {
        return n.id === item.id
      })
      this.queryList.splice(index, 1)
      this.$emit('getQueryList', [...this.queryList])
      // this.$confirm('是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const index = this.queryList.findIndex(function (n) {
      //     return n.id === item.id
      //   })
      //   this.queryList.splice(index, 1)
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      // });
    },
    // 拖拽
    resizedEvent (i, newH, newW, newHPx, newWPx) {
      for(let index in this.layout) {
        if(this.layout[index].i == i && document.getElementById('chartTitle')) {
          this.layout[index].resizeWidth = newWPx
          this.layout[index].resizeHeight = newHPx - 10 - document.getElementById('chartTitle').offsetHeight
        }
      }
      this.$forceUpdate()
    },
    // 点击设置图表
    setGallery (item, index) {
      // console.log(item)
      if(!this.statusBool) {
        this.$emit('setGalleryInfo', {index: index, item: item})
      }
    },
    // 删除
    deleteItem (item, index) {
      this.layout.splice(index, 1)
    }
  },
}
</script>
<style lang="scss" scoped>
  .gallery-list-box {
    //background: #f9f9f9;
    //background-image: url('../../styles/configuration.png');
    background-color: #f9f9f9;
    background-repeat: no-repeat;
    background-size: cover;
    background-position:center;
    // margin-top: 10px;
    // min-height: calc(100vh - 140px);
    //height: calc(100% - 120px);
    border-radius:5px;
    //margin-top: 10px;
    margin-right: 10px;
    overflow: hidden;
    overflow-y: auto;
    margin-left: 200px;
    .query-box{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-radius:5px;
      margin: 0 10px;
      padding: 0 15px;
      min-height: 50px;
      //line-height: 50px;
      background-color: #ffffff;
      .plus-icon{
        font-size: 14px;
        cursor: pointer;
        &:hover{
          color: #4A8FF0;
        }
      }
      .delete-icon{
        margin-left: 8px;
      }
      .query-body{
        padding: 10px 0;
        width: 24%;
        display: flex;
        align-items: center;
        //margin-right: 10px;
        .query-label{
          text-align: right;
          font-size: 12px;
          min-width: 80px;
        }
      }
      .query-plus-icon{
        text-align: center;
        width: 4%;
      }
    }
    .select-control-form-box{
      //padding: 20px;
      width: 280px;
      position: fixed;
      top: 60px;
      right: 8px;
      bottom: 10px;
      background-color: #ffffff;
      border: 1px solid #f2f2f2;
      border-radius: 4px;
      z-index: 1;
      box-shadow: 0 2px 12px 0 #f2f2f2;
      .form-header{
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .close-icon{
          font-size: 18px;
          cursor: pointer;
        }
      }
      .form-body{
        padding: 20px 10px;
      }
    }
  }
  .gallery-list-box-without-date {
    height: calc(100% - 60px);
  }
  .item-box{
    position: relative;
    height: 100%;
    //margin: 5px;
    .image-none {
      background-color: #ffffff;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .image-style {
        max-width: 50%;
        max-height: 100%;
      }
    }
  }
  .item-box:hover .delete-item{
    display: block;
  }
  .delete-item{
    display: none;
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    overflow: hidden;
    color: #000;
    width: 42px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    z-index: 1;
    i{
      font-size: 14px;
    }
  }
  .warning-item-box::before{
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    //background: #fff;
    z-index: -1;
  }
  .warning-item-box::after{
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    //background: #fff;
    z-index: -2;
    filter: blur(15px);
  }
  .warning-item-box::before, .warning-item-box::after{
    // background: linear-gradient(235deg,#67C23A,#303133,#409EFF);
  }
</style>
