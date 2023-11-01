import Vue from 'vue'
import draggables from '../../components/screen/draggables';
import tabForm from '../../components/screen/tabform';
import VueRulerTool from 'vue-ruler-tool'
import * as echarts from 'echarts';
import vueSeamlessScroll from 'vue-seamless-scroll'
Vue.use(draggables);
Vue.use(tabForm);
Vue.prototype.$echarts = echarts
Vue.use(vueSeamlessScroll)
import { getScreenDesignInfo, saveDesign } from './api'
import {commonConstants, commonUtil} from './commonConstants'
export default {
  name: 'screen-design',
  components: {
    VueRulerTool
  },
  props: {
    rowData: {
      type: Object
    }
  },
  data () {
    return {
      commonConstants: commonConstants,
      commonUtil: commonUtil,
      isOpen: true,
      activeName: 'tab1',
      activeName2: "tab2",
      components: [],//组件
      activated: {},//选中的控件
      isBubblingEvent: false,//是否是冒泡事件
      screenProperties: {//大屏属性
        id: "",
        width: "",
        height: "",
        imgUrl: '',
        background: "#181B24",
        type: 'panel'
      },
      chartsComponents: {},//图表 key id，value：charts
    }
  },
  mounted () {
    this.getScreenDesign();
    this.keyDown();
  },
  methods: {
    clickOpen () {
      this.isOpen=!this.isOpen
    },
    // 获取设计数据
    getScreenDesign () {
      getScreenDesignInfo(this.rowData.id).then(res => {
        if (res.data.code==0) {
          this.screenProperties.id=res.data.data.id;
          this.screenProperties.width=res.data.data.width;
          this.screenProperties.height=res.data.data.height;
          this.screenProperties.imgUrl=res.data.data.imgUrl;
          this.screenProperties.background=res.data.data.background;
          this.activated=this.screenProperties;
          this.formActivatedData(this.activated)
          if (res.data.data.components!=null&&res.data.data.components.length>0) {
            for (let index=0; index<res.data.data.components.length; index++) {
              const element=res.data.data.components[index];
              var component=JSON.parse(element.content);
              this.components.push(component);
            }
          }
          this.$nextTick(() => {
            this.initChart();
            this.initDate();
          });
        }
      });
    },
    //初始化图表
    initChart () {
      if (this.components&&this.components.length>0) {
        for (let index=0; index<this.components.length; index++) {
          const component=this.components[index];
          if (component.type==this.commonConstants.componentsType.histogram||component.type==this.commonConstants.componentsType.lineChart||component.type==this.commonConstants.componentsType.pieChart
            ||component.type==this.commonConstants.componentsType.gauge) {
            var chart=this.$echarts.init(document.getElementById(component.id), component.theme);
            chart.setOption(component.options);
            this.chartsComponents[component.id]=chart;
          }
        }
      }
    },
    initDate () {
      if (this.components&&this.components.length>0) {
        for (let index=0; index<this.components.length; index++) {
          const component=this.components[index];
          if (component.type==this.commonConstants.componentsType.date) {
            component.content="";
            setInterval(() => {
              var self=this;
              setTimeout(function () { self.refreshTime(component) }, 0)
            }, 100)
          }
        }
      }
    },
    //添加组件
    addComponenet (type) {
      if (this.activated) {
        this.activated.active=false;
        if (this.activated.type==this.commonConstants.componentsType.picture) {
          this.activated.zindex=98;
        } else {
          this.activated.zindex=99;
        }
      }
      if (type==this.commonConstants.componentsType.text) {//文本框
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenTextInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
      } else if (type==this.commonConstants.componentsType.picture) {//图片
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenPictureInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
      }
      else if (type==this.commonConstants.componentsType.histogram) {//柱状图
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenHistogramInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
        this.$nextTick(() => {
          var histogram=this.$echarts.init(document.getElementById(obj.id), obj.theme);
          // 绘制图表
          histogram.setOption(obj.options);
          this.chartsComponents[obj.id]=histogram;
        });
      } else if (type==this.commonConstants.componentsType.lineChart) {//折线图
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenLineChartInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
        this.$nextTick(() => {
          var lineChart=this.$echarts.init(document.getElementById(obj.id), obj.theme);
          // 绘制图表
          lineChart.setOption(obj.options);
          this.chartsComponents[obj.id]=lineChart;
        });
      } else if (type==this.commonConstants.componentsType.pieChart) {//饼图
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenPieChartInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
        this.$nextTick(() => {
          var pieChart=this.$echarts.init(document.getElementById(obj.id), obj.theme);
          // 绘制图表
          pieChart.setOption(obj.options);
          this.formActivatedData(pieChart)
          console.log(pieChart)
          this.chartsComponents[obj.id]=pieChart;
        });
      } else if (type==this.commonConstants.componentsType.table) {
        //表格
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenTableInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
      } else if (type==this.commonConstants.componentsType.date) {
        //日期
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenDateInit))
        obj.id=this.commonUtil.getUuid();
        obj.content=this.commonUtil.getCurrentDate(obj);
        this.components.push(obj);
        setInterval(() => {
          var self=this;
          setTimeout(function () { self.refreshTime(obj) }, 0)
        }, 1000)
      } else if (type==this.commonConstants.componentsType.gauge) {//仪表盘
        var obj=JSON.parse(JSON.stringify(this.commonConstants.screenGaugeInit))
        obj.id=this.commonUtil.getUuid();
        this.components.push(obj);
        this.$nextTick(() => {
          var guage=this.$echarts.init(document.getElementById(obj.id), obj.theme);
          // 绘制图表
          guage.setOption(obj.options);
          this.chartsComponents[obj.id]=guage;
        });
      }
    },
    clickPanel () {
      if (!this.isBubblingEvent) {
        if (this.activated) {
          this.activated.active=false;
          if (this.activated.type==this.commonConstants.componentsType.picture) {
            this.activated.zindex=98;
          } else {
            this.activated.zindex=99;
          }
        }
        this.activated=this.screenProperties;
        this.formActivatedData(this.activated)
      } else {
        this.isBubblingEvent=false;
      }
    },
    selectComponent (item) {
      if (this.activated) {
        this.activated.active=false;
        if (this.activated.type==this.commonConstants.componentsType.picture) {
          this.activated.zindex=98;
        } else {
          this.activated.zindex=99;
        }
      }
      item.active=true;
      item.zindex=100
      this.activated=item;
      this.formActivatedData(this.activated)
    },
    //保存大屏模板
    save () {
      var params={
        id: this.screenProperties.id,
        width: this.screenProperties.width,
        height: this.screenProperties.height,
        imgUrl: this.screenProperties.imgUrl,
        background: this.screenProperties.background,
      }
      if (this.components!=null&&this.components.length>0) {
        var components=new Array();
        for (let index=0; index<this.components.length; index++) {
          var component=JSON.parse(JSON.stringify(this.components[index]));
          component.active=false;
          if (component.type==this.commonConstants.componentsType.picture) {
            component.zindex=98;
          } else {
            component.zindex=99;
          }
          if (component.type==this.commonConstants.componentsType.delete) {
            if (component.primaryKey) {
              components.push(component);
            }
          } else {
            components.push(component);
          }
        }
        params.components=components;
      }
      saveDesign(params).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('保存成功')
          this.components=[];
          this.getScreenDesign();
        }
      });
    },
    async preview () {
      await this.save();
      this.$openUrl(`/jvs-report-ui/#/report/screenPreview?tplId=${this.screenProperties.id}`, '_blank')
    },
    refreshTime (component) {
      component.content=this.commonUtil.getCurrentDate(component);
    },

    keyDown () {
      document.onkeydown=(e) => {
        //事件对象兼容
        let e1=e||event||window.event||arguments.callee.caller.arguments[0]
        //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
        if (this.activated&&this.activated.type!=this.commonConstants.componentsType.panel) {
          if (e1&&e1.keyCode==37) {
            // 按下左箭头
            this.activated.x=this.activated.x-1
            return false;
          } else if (e1&&e1.keyCode==39) {
            // 按下右箭头
            this.activated.x=this.activated.x+1
            return false;
          } else if (e1&&e1.keyCode==38) {//上箭头
            this.activated.y=this.activated.y-1
            return false;
          } else if (e1&&e1.keyCode==40) {//下箭头
            this.activated.y=this.activated.y+1
            return false;
          }
        }

      }
    },
    copyComponent (component) {
      component.active=false;
      var obj=JSON.parse(JSON.stringify(component));
      obj.active=false;
      obj.id=this.commonUtil.getUuid();
      obj.primaryKey=null;
      this.activated=obj;
      this.formActivatedData(this.activated)
      this.components.push(obj);
      obj.x=obj.x+10;
      obj.y=obj.y+10;
      if (obj.type==this.commonConstants.componentsType.histogram||obj.type==this.commonConstants.componentsType.lineChart||obj.type==this.commonConstants.componentsType.pieChart||obj.type==this.commonConstants.componentsType.gauge) {
        this.$nextTick(() => {
          var chart=this.$echarts.init(document.getElementById(obj.id), obj.theme);
          // 绘制图表
          chart.setOption(obj.options);
          this.chartsComponents[obj.id]=chart;
        });
      } else if (obj.type==this.commonConstants.componentsType.date) {
        setInterval(() => {
          var self=this;
          setTimeout(function () { self.refreshTime(obj) }, 0)
        }, 1000)
      }
    },
    formActivatedData (obj) {
      if(obj.options && obj.options.series) {
        for (let i=0; i<obj.options.series.length; i++) {
          for (let j=0; j<obj.options.series[i].data.length; j++) {
            if (!obj.options.series[i].data[j].itemStyle) {
              this.$set(obj.options.series[i].data[j], 'itemStyle', {})
            }
          }
        }
      }
    }
  }
}
