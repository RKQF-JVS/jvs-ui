import Vue from 'vue'
import draggables from '../../../components/screen/draggables';
Vue.use(draggables);
import {getScreenDesignInfo} from '../api'
import {commonConstants, commonUtil} from '../commonConstants'
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts

export default {
  data () {
    return {
      commonConstants: commonConstants,
      commonUtil: commonUtil,
      screenProperties: {//大屏属性
        id: "",
        width: "",
        height: "",
        imgUrl: '',
        type: 'panel'
      },
      components: [],//组件
    }
  },
  mounted () {
    this.getScreenDesign();
  },
  methods: {
    getScreenDesign () {
      getScreenDesignInfo(this.$route.query.tplId).then(res => {
        if (res.data && res.data.code == 0) {
          this.screenProperties.id=res.data.data.id;
          this.screenProperties.width=res.data.data.width;
          this.screenProperties.height=res.data.data.height;
          this.screenProperties.imgUrl=res.data.data.imgUrl;
          this.screenProperties.background=res.data.data.background ;
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
    refreshTime (component) {
      component.content=this.commonUtil.getCurrentDate(component);
    }
  }
}
