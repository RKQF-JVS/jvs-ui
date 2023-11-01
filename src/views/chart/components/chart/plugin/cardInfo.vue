<template>
  <div class="gallery-content">
    <el-row :gutter="10" class="gallery-box">
      <el-col :xs="24" :sm="12" :md="12" :lg="14" :xl="16">
        <div :class="{'draw-con': true, 'card-con': setting.cardshow}" :style="'background:'+setting.back">
<!--          <h4 :style="{textAlign:'center',fontSize: setting.titleSize+'px', fontWeight: setting.titleWeight*100}">{{setting.name}}</h4>-->
          <h4 :style="{textAlign:'center',fontSize: '15px', fontWeight: 1000}">{{setting.name}}</h4>
          <div class="card-info-box">
            <img :src="setting.back" class="back-img"/>
            <div class="card-box">
              <div
                class="card-title"
                :style="'font-size:' + setting.titleSize + 'px;' + 'color:' + setting.titleColor + `;font-weight: ${setting.titleWeight*100}`"
              >{{ setting.cardTitle }}</div>
              <div
                class="card-content"
                :style="'font-size:' + setting.contentSize + 'px;' + 'color:' + setting.contentColor + `;font-weight: ${setting.contentWeight*100}`"
              >{{ setting.cardContent ? setting.cardContent : cardContent }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <!--      <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8" style="box-shadow: 0 0 10px #e9e9e9; background:#fff">-->
      <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8" style="background:#fff">
        <jvs-tab :active="activeName" :option="tabOption">
          <!-- 插槽 -->
          <template slot="styleSetting">
            <div class="draw-form">
              <optionForm :shape="shape" :formData="setting" @setSetting="setSetting" :returnResult="returnResult" />
            </div>
          </template>
          <template slot="dataSetting">
            <div class="gallery-data-box" >
              <dataForm ref="dataForm" :info="info" @mockDataChange="mockDataChange" @mockTest="mockTest" :returnResult="returnResult" @testData="testDataHandle" >
                <slot></slot>
              </dataForm>
            </div>
          </template>
        </jvs-tab>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import optionForm from '../plugin/optionForm'
// import dateTableForm from '../plugin/dataTableForm'
import dataForm from '../plugin/dataForm'
import {testData} from '@/views/chart/api/chart'

export default {
  name: 'card-info',
  components: {optionForm, dataForm}, // dateTableForm
  props: {
    infoData: {
      type: Object
    },
    shape: {
      type: String
    },
    params: {
      type: Object
    }
  },
  computed: {
    data() {
      return this.getData(this.tableData)
    },
    cardTitle: {
      get () {
        return this.info.data.cardTitle
      },
      set (newVal) {}

    },
    cardContent: {
      get () {
        return this.info.data.cardContent
      },
      set (newVal) {}
    },
    setting: {
      get () {
        return this.info.data.setting
      },
      set (newVal) {}
    },
    dataSource: {
      get () {
        return this.info.data.dataSource
      },
      set (newVal) {}
    },
  },
  data () {
    return {
      chart: null,
      returnResult: null,
      activeName: 'styleSetting',
      tabOption: {
        column: [
          {
            label: "样式设置",
            name: "styleSetting",
          },
          {
            label: "数据设置",
            name: "dataSetting",
            disabled: false
          },
        ]
      },
      info: {}, // 当前图表数据
    }
  },
  created () {
    if(this.infoData) {
      this.info = JSON.parse(JSON.stringify(this.infoData))
      this.tabOption.column[1].disabled = this.info.type === 'InfoCard'
    }
  },
  mounted () {
    this.init(this.data)
  },
  methods: {
    mockDataChange(data) {
      this.info.data.cardContent = data
    },
    // tab 点击事件
    handleTabClick () {},
    // 格式化数据
    getData (tableData) {
    },
    init (data) {},
    // mock测试
    mockTest (bool) {
      if(bool) {
        if (this.info.type === 'DataCard') {
          const num = String(parseInt(Math.random() * 1000000000))
          this.info.data.cardContent = num.slice(0, 3) + ',' + num.slice(3, 6) + ',' + num.slice(6, 9)
        }
      }
    },
    // 样式
    setSetting (data) {
      this.setting = data
      // this.$emit('setSetting', data)
    },
    // 保存
    // saveHandle (form) {
    //   if(form) {
    //     this.info.dataSource = form
    //     this.$emit('save', this.info) //  {setting: this.setting, tableData: this.tableData, dataSource: form}
    //   }
    // },
    saveHandle () {
      this.$refs.dataForm.testHandle()
    },
    // 测试
    testDataHandle (form) {
      if(form) {
        form.data.setting = this.setting
        if(this.params.startTime) {
          form.startTime = this.params.startTime
        }
        if(this.params.endTime) {
          form.endTime = this.params.endTime
        }
        if (form.dataSource.datasourceType !== 'MOCK') {
          form.isMock = false
          testData(form).then(res => {
            if(res.data.code == 0) {
              // 通知显示结果
              this.returnResult = JSON.parse(res.data.data)
              if(this.returnResult.isNull == true) {
                this.info = this.returnResult
                // this.init(this.getData(this.tableData))
                this.$emit('save', this.info)
              } else {
                this.$emit('save', this.info)
              }
            }
          })
        } else {
          this.returnResult = form
          this.info = this.returnResult
          this.init(this.getData(this.tableData))
          this.$emit('save', this.info)
        }
      }
    },
    // 取消
    cancelHandle () {
      this.$emit('cancel')
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep.gallery-content{
  .gallery-box{
    //width: 100%;
    margin: 8px!important;
    background-color: #ffffff;
    .el-tabs__item{
      background: none;
    }
    .draw-con{
      padding: 20px;
      .card-info-box {
        position: relative;
        height: 200px;
        width: 100%;
        z-index: 1;
        .back-img{
          border-radius: 6px;
          position: absolute;
          left: 20%;
          height: 100%;
          //height: 80%;
          width: 60%;
          z-index: -1;
        }
        .card-box {
          position: absolute;
          left: 20%;
          //height: 80%;
          height: 100%;
          width: 60%;
          z-index: 1;
          .card-title {
            padding: 30px 30px 20px;
          }
          .card-content{
            padding: 0 30px 30px;
          }
        }
      }
      h4{
        margin-top: 0;
      }
    }
    .card-con{
      border: 3px solid #abb5c7;
    }
    .draw-form{
      overflow-y: auto;
      height: calc(100vh - 160px);
      width: 80%;
    }::-webkit-scrollbar {
       display: inline;
     }
  }
  .gallery-data-box{
    height: calc(100vh - 160px);
  }
}

</style>
