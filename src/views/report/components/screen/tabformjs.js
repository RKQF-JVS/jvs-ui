import Vue from 'vue'
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
Vue.use(VueCodemirror);
import validate from '../validate'
Vue.use(validate);
import { codemirror } from 'vue-codemirror'
import sqlFormatter from "sql-formatter";
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material-palenight.css';
import "codemirror/addon/fold/foldgutter.css"
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import "codemirror/addon/fold/brace-fold";
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/selection/active-line';
// import 'codemirror/addon/edit/closeBrackets';
// import 'codemirror/addon/edit/matchBrackets';
import 'codemirror/addon/hint/sql-hint.js';
import Axios from 'axios'
import store from "@/store";
import commonUtil from '../common'

import ImageSelect from "@/views/chart/components/imageSelect/ImageSelect"; // progress bar style

export default {
  components: {ImageSelect},
  props: {
    component: {
      type: Object,
      default: () => ({})
    },
    chartsComponents: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      dialogVisible: false, // 选择图片
      defaultLabel: '',
      paramInfo: null,
      commonUtil: commonUtil,
      commonConstants: {
        componentsType: {
          panel: "panel", //画布
          text: "text", //文本
          picture: "picture", //图片
          histogram: "histogram", //柱状图
          lineChart: "lineChart", //折线图
          pieChart: "pieChart", //饼图
          gauge: "gauge", //仪表盘
          table: "table", //表格
          date: "date", //日期
          delete: "delete", //删除的组件
        },
      },
      selectUtil: {
        textType: [
          { value: "text", label: "普通文本" },
          { value: "marquee", label: "滚动文本" },
          { value: "link", label: "超链接" },
        ],
        textAlign: [
          { value: "left", label: "左对齐" },
          { value: "center", label: "居中对齐" },
          { value: "right", label: "右对齐" },
        ],
        fontWeight: [
          { value: "normal", label: "正常" },
          { value: "bold", label: "加粗" },
        ],
        chartTheme: [
          { value: "dark", label: "默认" },
          { value: "dark-blue", label: "dark-blue" },
          { value: "fresh-cu", label: "fresh-cu" },
          { value: "gray", label: "gray" },
          { value: "green", label: "green" },
          { value: "macarons2", label: "macarons2" },
          { value: "red", label: "red" },
          { value: "vintage", label: "vintage" },
        ],
        orient: [
          { value: "horizontal", label: "水平" },
          { value: "vertical", label: "垂直" },
        ],
        labelPosition: [
          { value: "outside", label: "饼图扇区外侧" },
          { value: "inside", label: "饼图扇区内部" },
          { value: "center", label: "饼图中心位置" },
        ],
        roseType: [
          { value: "", label: "普通饼图" },
          { value: "radius", label: "南丁格尔玫瑰图" },
        ],
        gaugeIconType: [
          { value: "circle", label: "circle" },
          { value: "rect", label: "rect" },
          { value: "roundRect", label: "roundRect" },
          { value: "triangle", label: "triangle" },
          { value: "diamond", label: "diamond" },
          { value: "pin", label: "pin" },
          { value: "arrow", label: "arrow" },
          { value: "none", label: "none" },
        ],
        dateFormat: [
          { value: "1", label: "年-月-日 时:分:秒" },
          { value: "2", label: "年-月-日 时:分" },
          { value: "3", label: "年-月-日" },
          { value: "4", label: "年-月" },
          { value: "5", label: "时:分:秒" },
          { value: "6", label: "时:分" },
          { value: "7", label: "星期几" },
        ]
        ,
        verticalAlign: [
          { value: "top", label: "顶端对齐" },
          { value: "middle", label: "垂直居中" },
          { value: "bottom", label: "底端对齐" },
        ],
        resultType: [
          { value: "String", label: "字符串/数字" },
          { value: "Array", label: "数组" },
          { value: "ObjectArray", label: "对象数组" },
          { value: "Object", label: "对象" },
        ]

      },
      predefineColors: [
        "#000000",
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#FF0000',
      ],
      showEditCategoryDialog: false,//显示编辑x轴类目对话框
      cateGorytableData: [],//类目表格数据
      categoryDialog: false,//单个类目对话框
      categoryForm: {
        type: "1",
        index: null,
        content: ""
      },//单个类目form表单
      apiDialog: false,
      apiForm: {//接口表单
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: [],//请求参数
        resultType: "",//返回值类型
        resultTypeProp: [],//返回值属性
        type: "1",//1 目录 2数据
      },
      dataSetDialog: false,//数据集配置
      dataSetForm: {//数据集表单
        dataSetId: "",//选中的数据集id
        column: null,//选中的数据列
        isMulti: false,
        type: "",//1目录 2数据
      },
      dataSets: [],//数据集
      dataColumn: [],//数据列
      addDatasetsDialogVisiable: false,
      sqlForm: {
        id: "",
        datasetName: "",//数据集名称
        datasourceId: "",//数据源id
      },//sql表单
      dataSource: [],
      //sql解析对应的列表格数据
      sqlColumnTableData: {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          pageSizeRange: [5, 10, 20, 50]
        },
      },
      tableData: [],
      cmOptions: {//codemirror参数配置
        tabSize: 4,
        mode: { name: 'text/x-mysql' },
        theme: "eclipse",
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldgutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        lineWrapping: true, //代码折叠
        foldGutter: true,
        matchBrackets: true,  //括号匹配
        autoCloseBrackets: true,
      },
      showDatasetsDialog: false,//数据集管理dialog
      customColumnDataDialogVisiable: false,
      tableColumnDialogVisiable: false,
      tableColumnForm: {
        name: "",
        key: "",
        width: "",
        type: "1",//1新增 2编辑
        index: null
      },
      paramDialog: false,
      paramForm: {
        paramName: "",
        paramCode: "",
        defaultValue: "",
      },
      propDialog: false,
      propForm: {
        propName: "",
      },
      fileList: [],
      header: {
        "Authorization": 'Bearer '+store.getters.access_token
      },
    }
  },
  methods: {
    handleFocus(type) {
      if(type == 'bg') {
        this.paramInfo = {
          bucketName: 'jvs-public',
          module: 'report',
          label: '大屏'
        }
      }else{
        this.paramInfo = {
          bucketName: 'jvs-public',
          module: 'report',
          label: '大屏图片'
        }
      }
      this.defaultLabel = '背景'
      this.$refs.imgselector.init()
      this.dialogVisible = true
    },
    // 确认选择
    handleConfirm(obj) {
      this.$set(this.component, 'imgUrl', obj.fileLink)
      this.handleClose()
    },
    // dialog 关闭
    handleClose() {
      this.dialogVisible = false
      this.defaultLabel = '背景'
    },
    //宽度改变事件
    changeWidth (component) {
      if (this.commonConstants.componentsType.histogram==component.type||this.commonConstants.componentsType.lineChart==component.type||this.commonConstants.componentsType.pieChart==component.type) {
        this.chartsComponents[component.id].resize();
      }
    },
    //高度改变事件
    changeHeight (component) {
      if (this.commonConstants.componentsType.histogram==component.type||this.commonConstants.componentsType.lineChart==component.type||this.commonConstants.componentsType.pieChart==component.type) {
        this.chartsComponents[component.id].resize();
      }
    },
    //重新加载chart
    reLoadChart (component) {
      if (component.options.backgroundColor==null) {
        component.options.backgroundColor='';
      }
      this.chartsComponents[component.id].setOption(component.options, true);
      // component.chart.setOption(component.options,true);
    },
    reInitChart (component) {
      this.chartsComponents[component.id].dispose();
      // component.chart.dispose();
      var chart=this.$echarts.init(document.getElementById(component.id), component.theme);
      chart.setOption(component.options, true);
      this.chartsComponents[component.id]=chart;
    },
    //编辑类目
    editXcategory (component) {
      this.showEditCategoryDialog=true;
      this.cateGorytableData=[];

      if (component.options.xAxis.data&&component.options.xAxis.data.length>0) {
        for (let index=0; index<component.options.xAxis.data.length; index++) {
          const element=component.options.xAxis.data[index];
          var row={ content: element }
          this.cateGorytableData.push(row)
        }
      }
    },
    //编辑新增类目对话框
    showDialog (type, index, item) {
      this.categoryDialog=true;
      this.categoryForm.type=type;
      this.categoryForm.index=index;
      if (type=='1') {//新增
        this.categoryForm.content='';
      } else {
        //编辑
        this.categoryForm.content=item.content
      }
    },
    //类目修改完成确认
    categoryConfirm () {
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          if (this.categoryForm.type=='1') {
            var row={ content: this.categoryForm.content }
            this.cateGorytableData.push(row)
          } else {
            this.cateGorytableData[this.categoryForm.index].content=this.categoryForm.content
          }
          this.categoryDialog=false;
        } else {
          return false;
        }
      });
    },
    //删除全部类目
    deleteAllCategory () {
      this.cateGorytableData=[];
    },
    //删除单个类目
    deleteCategory (index) {
      this.cateGorytableData.splice(index, 1)
    },
    //确认修改类目
    confirmChangeCategory () {
      if (this.cateGorytableData&&this.cateGorytableData.length>0) {
        var categories=new Array();
        for (let index=0; index<this.cateGorytableData.length; index++) {
          const element=this.cateGorytableData[index];
          categories.push(element.content);
        }
        this.component.options.xAxis.data=categories;
      } else {
        this.component.options.xAxis.data=[];
      }
      this.reLoadChart(this.component);
      this.showEditCategoryDialog=false;
    },
    //类目数据来源于api
    //type 1柱状图折线图类目数据 2柱状图、折线图、饼图、仪表盘数据 3表格数据来源 4 文本数据来源
    categoryApiSetting (component, type) {
      this.apiDialog=true;
      if (type=="1") {
        this.apiForm.url=component.options.apiSettings.url;
        this.apiForm.requestType=component.options.apiSettings.requestType;
        if (Array.isArray(component.options.apiSettings.params)) {
          this.apiForm.params=component.options.apiSettings.params;
        } else {
          this.apiForm.params=[];
        }
        this.apiForm.resultType=component.options.apiSettings.resultType;
        if (Array.isArray(component.options.apiSettings.resultTypeProp)) {
          this.apiForm.resultTypeProp=component.options.apiSettings.resultTypeProp;
        } else {
          this.apiForm.resultTypeProp=[];
        }
      } else if (type=="2") {
        this.apiForm.url=component.options.dataApiSettings.url;
        this.apiForm.requestType=component.options.dataApiSettings.requestType;
        if (Array.isArray(component.options.dataApiSettings.params)) {
          this.apiForm.params=component.options.dataApiSettings.params;;
        } else {
          this.apiForm.params=[];
        }
        this.apiForm.resultType=component.options.dataApiSettings.resultType;
        if (Array.isArray(component.options.dataApiSettings.resultTypeProp)) {
          this.apiForm.resultTypeProp=component.options.dataApiSettings.resultTypeProp;
        } else {
          this.apiForm.resultTypeProp=[];
        }
      } else if (type=="3") {
        this.apiForm.url=component.dataApiSettings.url;
        this.apiForm.requestType=component.dataApiSettings.requestType;
        if (Array.isArray(component.dataApiSettings.params)) {
          this.apiForm.params=component.dataApiSettings.params;
        } else {
          this.apiForm.params=[];
        }
        this.apiForm.resultType=component.dataApiSettings.resultType;
        if (Array.isArray(component.dataApiSettings.resultTypeProp)) {
          this.apiForm.resultTypeProp=component.dataApiSettings.resultTypeProp;
        } else {
          this.apiForm.resultTypeProp=[];
        }
      } else if (type=="4") {
        this.apiForm.url=component.dataApiSettings.url;
        this.apiForm.requestType=component.dataApiSettings.requestType;
        this.apiForm.params=component.dataApiSettings.params;
        if (Array.isArray(component.dataApiSettings.params)) {
          this.apiForm.params=component.dataApiSettings.params;
        } else {
          this.apiForm.params=[];
        }
        this.apiForm.resultType=component.dataApiSettings.resultType;
        if (Array.isArray(component.dataApiSettings.resultTypeProp)) {
          this.apiForm.resultTypeProp=component.dataApiSettings.resultTypeProp;
        } else {
          this.apiForm.resultTypeProp=[];
        }
      }
      this.apiForm.type=type;
    },
    //接口测试
    apiTest () {
      let obj={
        url: `/mgr/report/api/common/apiTest`, // QAQAQAQAQAQAQAQAQAQAQAQ
        params: this.apiForm,
      }
      this.commonUtil.doPost(obj).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg || '测试通过')
        }
      });
    },
    apiCategoryConfirm () {
      this.$refs['apiForm'].validate((valid) => {
        if (valid) {
          if (this.component.type==this.commonConstants.componentsType.histogram||this.component.type==this.commonConstants.componentsType.lineChart) {//柱状图和折线图
            let obj={
              url: this.apis.screenDesign.getApiResultApi,
              params: this.apiForm,
            }
            if (this.apiForm.type=="1") {
              obj.url=this.apis.screenDesign.getCategoryApiResultApi;
            }
            this.commonUtil.doPost(obj).then(response => {
              this.getApiResultCallback(response);
            });
          } else if (this.component.type==this.commonConstants.componentsType.pieChart) {//饼图
            let obj={
              url: this.apis.screenDesign.getPieApiResultApi,
              params: this.apiForm,
            }
            this.commonUtil.doPost(obj).then(response => {
              this.getPieApiResultCallback(response);
            });
          } else if (this.component.type==this.commonConstants.componentsType.table) {//表格
            let obj={
              url: this.apis.screenDesign.getTableApiResultApi,
              params: this.apiForm,
            }
            this.commonUtil.doPost(obj).then(response => {
              this.getTableApiResultCallback(response);
            });
          } else if (this.component.type==this.commonConstants.componentsType.text) {
            let obj={
              url: this.apis.screenDesign.getTextApiResultApi,
              params: this.apiForm,
            }
            this.commonUtil.doPost(obj).then(response => {
              this.getTextApiResultCallback(response);
            });
          }
          else if (this.component.type==this.commonConstants.componentsType.gauge) {
            let obj={
              url: this.apis.screenDesign.getGaugeApiResult,
              params: this.apiForm,
            }
            this.commonUtil.doPost(obj).then(response => {
              this.getGaugeApiResultCallback(response);
            });
          }
        }
      });
    },
    //获取柱形图折线图接口返回数据回调
    getApiResultCallback (response) {
      if (response.code=="200") {
        if (this.apiForm.type=="1") {
          this.component.options.xAxis.data=response.responseData;
          this.component.options.apiSettings.url=this.apiForm.url;
          this.component.options.apiSettings.requestType=this.apiForm.requestType;
          this.component.options.apiSettings.params=this.apiForm.params;
          this.component.options.apiSettings.resultType=this.apiForm.resultType;
          this.component.options.apiSettings.resultTypeProp=this.apiForm.resultTypeProp;
        } else {
          if (response.responseData&&response.responseData.length>0) {
            var series=new Array();
            var type="bar";
            if (this.component.type==this.commonConstants.componentsType.histogram) {
              type="bar";
            } else if (this.component.type==this.commonConstants.componentsType.lineChart) {
              type="line";
            }
            if (response.responseData[0] instanceof Array) {
              for (let index=0; index<response.responseData.length; index++) {
                const element=response.responseData[index];
                var data=element.map(Number)
                var obj={
                  name: "",
                  type: type,
                  barGap: 0,
                  barWidth: 20,//柱体宽度
                  itemStyle: {
                    color: '#00adff',//柱体颜色
                  },
                  data: data
                }
                series.push(obj);
              }
              this.component.options.series=series;
            } else {
              var data=response.responseData.map(Number)
              var obj={
                name: "",
                type: type,
                barGap: 0,
                barWidth: 20,//柱体宽度
                itemStyle: {
                  color: '#00adff',//柱体颜色
                },
                data: data
              }
              series.push(obj)
              this.component.options.series=series;
            }
            this.component.options.dataApiSettings.url=this.apiForm.url;
            this.component.options.dataApiSettings.requestType=this.apiForm.requestType;
            this.component.options.dataApiSettings.params=this.apiForm.params;
            this.component.options.dataApiSettings.resultType=this.apiForm.resultType;
            this.component.options.dataApiSettings.resultTypeProp=this.apiForm.resultTypeProp;
          }
        }
        this.reLoadChart(this.component);
        this.apiDialog=false;
        this.commonUtil.clearObj(this.apiForm);
      }
    },
    //获取饼状图返回结果回调
    getPieApiResultCallback (response) {
      if (response.code=="200") {
        for (let index=0; index<response.responseData.length; index++) {
          let element=response.responseData[index];
          element.itemStyle={ color: this.commonUtil.color16() };
        }
        this.component.options.series[0].data=response.responseData;
        this.reLoadChart(this.component);
        this.apiDialog=false;
        this.component.options.dataApiSettings.url=this.apiForm.url;
        this.component.options.dataApiSettings.requestType=this.apiForm.requestType;
        this.component.options.dataApiSettings.params=this.apiForm.params;
        this.component.options.dataApiSettings.resultType=this.apiForm.resultType;
        this.component.options.dataApiSettings.resultTypeProp=this.apiForm.resultTypeProp;
        this.commonUtil.clearObj(this.apiForm);
      }
    },
    getTableApiResultCallback (response) {
      if (response.code=="200") {
        this.component.data=response.responseData;
        this.apiDialog=false;
        this.component.dataApiSettings.url=this.apiForm.url;
        this.component.dataApiSettings.requestType=this.apiForm.requestType;
        this.component.dataApiSettings.params=this.apiForm.params;
        this.component.dataApiSettings.resultType=this.apiForm.resultType;
        this.component.dataApiSettings.resultTypeProp=this.apiForm.resultTypeProp;
        this.commonUtil.clearObj(this.apiForm);
        this.reLoadTable(this.component);
      }

    },
    getTextApiResultCallback (response) {
      if (response.code=="200") {
        this.component.content=response.responseData;
        this.apiDialog=false;
        this.component.dataApiSettings.url=this.apiForm.url;
        this.component.dataApiSettings.requestType=this.apiForm.requestType;
        this.component.dataApiSettings.params=this.apiForm.params;
        this.component.dataApiSettings.resultType=this.apiForm.resultType;
        this.component.dataApiSettings.resultTypeProp=this.apiForm.resultTypeProp;
        this.commonUtil.clearObj(this.apiForm);
      }
    },
    getGaugeApiResultCallback (response) {
      if (response.code=="200") {
        this.component.options.series[0].data=[];
        this.component.options.series[0].data.push(response.responseData);
        this.apiDialog=false;
        this.component.options.dataApiSettings.url=this.apiForm.url;
        this.component.options.dataApiSettings.requestType=this.apiForm.requestType;
        this.component.options.dataApiSettings.params=this.apiForm.params;
        this.component.options.dataApiSettings.resultType=this.apiForm.resultType;
        this.component.options.dataApiSettings.resultTypeProp=this.apiForm.resultTypeProp;
        this.commonUtil.clearObj(this.apiForm);
        this.reLoadChart(this.component);
      }
    },
    closeApiDialog () {
      this.apiDialog=false;
      this.commonUtil.clearObj(this.apiForm);
      this.apiForm.requestType="post";
    },
    //类目数据来源于数据源
    categoryDatasourceSetting (component, type) {
      this.dataSetDialog=true;
      this.dataSetForm.type=type;
      if (type=="1") {
        this.dataSetForm.dataSetId=component.options.categoryDataSetSettings.dataSetId
        this.dataSetForm.column=component.options.categoryDataSetSettings.column
        this.dataSetForm.isMulti=false;
      } else if (type=="2") {
        this.dataSetForm.dataSetId=component.options.columnDataSetSettings.dataSetId
        this.dataSetForm.column=component.options.columnDataSetSettings.column
        if (component.type==this.commonConstants.componentsType.gauge) {
          this.dataSetForm.isMulti=false;
        } else {
          this.dataSetForm.isMulti=true;
        }
      } else if (type=="3") {
        this.dataSetForm.dataSetId=component.columnDataSetSettings.dataSetId
        this.dataSetForm.column=component.columnDataSetSettings.column
        this.dataSetForm.isMulti=true;
      }
      else if (type=="4") {
        this.dataSetForm.dataSetId=component.columnDataSetSettings.dataSetId
        this.dataSetForm.column=component.columnDataSetSettings.column
        this.dataSetForm.isMulti=false;
      }
      this.getDataSets();
    },
    //关闭添加数据源
    closeAddDataSet () {
      this.addDatasetsDialogVisiable=false;
      this.$refs.codeMirror.codemirror.setValue("");
    },
    execSql () {
      this.$refs['sqlRef'].validate((valid) => {
        if (valid) {
          let obj={
            url: this.apis.reportDesign.execSqlApi,
            params: { tplSql: this.$refs.codeMirror.codemirror.getValue(), datasourceId: this.sqlForm.datasourceId },
            removeEmpty: false,
          }
          this.commonUtil.doPost(obj).then(response => {
            if (response.code=="200") {
              this.sqlColumnTableData.tableData=response.responseData;
              this.sqlColumnTableData.tablePage.pageTotal=response.responseData.length;
            }
          });
        }
      });
    },
    //sql语句列表修改当前页触发事件
    handleCurrentChange: function (val) {
      this.sqlColumnTableData.tablePage.currentPage=val;
    },
    //sql语句列表修改当每页显示条数触发事件
    handleSizeChange: function (val) {
      this.sqlColumnTableData.tablePage.pageSize=val;
    },
    formatSql () {//sql格式化
      let sqlContent="";
      sqlContent=this.$refs.codeMirror.codemirror.getValue();
      this.$refs.codeMirror.codemirror.setValue(sqlFormatter.format(sqlContent))
    },
    addDataSet () {
      let tplId=this.$route.query.tplId;;//tplId
      let tplSql=this.$refs.codeMirror.codemirror.getValue();
      if (tplSql==null||tplSql=="") {
        this.commonUtil.showMessage({ message: "sql语句不能为空", type: this.commonConstants.messageType.error })
        return;
      }
      this.$refs['sqlRef'].validate((valid) => {
        if (valid) {
          let obj={
            url: this.apis.reportDesign.addDataSetApi,
            params: { id: this.sqlForm.id, tplId: tplId, tplSql: tplSql, datasourceId: this.sqlForm.datasourceId, datasetName: this.sqlForm.datasetName },
            removeEmpty: false,
          }
          this.commonUtil.doPost(obj).then(response => {
            if (response.code=="200") {
              this.addDatasetsDialogVisiable=false;
              this.getDataSets();
            }
          });
        } else {
          return;
        }
      });
    },
    //显示数据集页面
    showDatasetDialog () {
      this.addDatasetsDialogVisiable=true;
      this.getScreenTplDateSource();
    },
    //获取数据集
    getDataSets () {
      let tplId=this.$route.query.tplId;;//tplId
      let obj={
        url: `/mgr/report/api/reportTplDataset/getScreenDataBySql`, // QAQAQAQAQAQAQAQAQAQAQAQ
        params: { tplId: tplId },
        removeEmpty: false,
      }
      this.commonUtil.doPost(obj).then(response => {
        if (response.code=="200") {
          this.dataSets=response.responseData;
        }
      });
    },
    //获取模板关联的数据源
    getScreenTplDateSource () {
      let tplId=this.$route.query.tplId;;//tplId
      let obj={
        url: this.apis.reportDesign.getReportTplDateSourceApi,
        params: { tplId: tplId },
        removeEmpty: false,
      }
      this.commonUtil.doPost(obj).then(response => {
        if (response.code=="200") {
          this.dataSource=response.responseData
        }
      });
    },
    //修改数据集，获取数据集对应的列
    changeDataset () {
      if (this.dataSetForm.dataSetId) {
        this.getDatasetColumn(this.dataSetForm.dataSetId);
      } else {
        this.dataColumn=[];
      }
    },
    getDatasetColumn (dataSetId) {
      let obj={
        url: this.apis.screenDesign.getTplDatasetColumnsApi,
        params: { id: dataSetId },
        removeEmpty: false,
      }
      this.commonUtil.doPost(obj).then(response => {
        if (response.code=="200") {
          this.dataColumn=response.responseData;
        }
      });
    },
    datasetEditDialog () {
      this.showDatasetsDialog=true;
    },
    //编辑数据集
    editDatasets (index, item) {
      this.addDatasetsDialogVisiable=true;
      this.getScreenTplDateSource();
      this.sqlForm.datasetName=item.datasetName;
      this.sqlForm.datasourceId=item.datasourceId;
      this.sqlForm.id=item.id;
      this.$nextTick(() => {
        this.$refs.codeMirror.codemirror.setValue(item.tplSql)
        this.execSql();
      });

    },
    //删除数据集
    deleteDatasets (index, item) {
      let obj={
        url: this.apis.screenDesign.deleteDatasetApi,
        messageContent: this.commonUtil.getMessageFromList("confirm.delete", null),
        callback: this.getDataSets,
        params: { id: item.id },
        type: "get",
      }
      //弹出删除确认框
      this.commonUtil.showConfirm(obj)
    },
    //确认目录绑定数据集
    dataSetCategoryConfirm () {
      this.$refs['dataSetForm'].validate((valid) => {
        if (valid) {
          var params={ dataSetId: this.dataSetForm.dataSetId };
          if (this.dataSetForm.isMulti) {
            params.props=this.dataSetForm.column;
          } else {
            params.props=[this.dataSetForm.column];
          }
          let obj={
            params: params,
            removeEmpty: false,
          }
          if (this.component.type==this.commonConstants.componentsType.pieChart) {
            obj.url=this.apis.screenDesign.getScreenPieDataBySqlApi;
          } else if (this.component.type==this.commonConstants.componentsType.histogram||this.component.type==this.commonConstants.componentsType.lineChart) {
            obj.url=this.apis.screenDesign.getScreenDataBySqlApi;
          } else if (this.component.type==this.commonConstants.componentsType.table) {
            obj.url=this.apis.screenDesign.getScreenTableDataBySqlApi;
          } else if (this.component.type==this.commonConstants.componentsType.text) {
            obj.url=this.apis.screenDesign.getScreenTextDataBySqlApi
          } else if (this.component.type==this.commonConstants.componentsType.gauge) {
            obj.url=this.apis.screenDesign.getScreenGaugeDataBySqlApi
          }
          this.commonUtil.doPost(obj).then(response => {
            if (response.code=="200") {
              if (this.dataSetForm.type=="1") {
                this.component.options.xAxis.data=response.responseData[0];
                this.component.options.categoryDataSetSettings.dataSetId=this.dataSetForm.dataSetId;
                this.component.options.categoryDataSetSettings.column=this.dataSetForm.column;
                this.reLoadChart(this.component);
              } else if (this.dataSetForm.type=="2") {
                this.component.options.columnDataSetSettings.dataSetId=this.dataSetForm.dataSetId;
                this.component.options.columnDataSetSettings.column=this.dataSetForm.column;
                if (response.responseData) {
                  if (this.component.type==this.commonConstants.componentsType.pieChart) {
                    this.component.options.series[0].data=response.responseData;
                  } else if (this.component.type==this.commonConstants.componentsType.histogram||this.component.type==this.commonConstants.componentsType.lineChart) {
                    var type="bar";
                    if (this.component.type==this.commonConstants.componentsType.lineChart) {
                      type="line";
                    }
                    var series=new Array();
                    for (let index=0; index<response.responseData.length; index++) {
                      const element=response.responseData[index];
                      var obj={
                        name: "",
                        type: type,
                        barGap: 0,
                        barWidth: 20,//柱体宽度
                        itemStyle: {
                          color: '#00adff',//柱体颜色
                        },
                        data: element
                      }
                      series.push(obj);
                    }
                    this.component.options.series=series;
                  } else if (this.component.type==this.commonConstants.componentsType.gauge) {
                    this.component.options.series[0].data=[];
                    this.component.options.series[0].data.push(response.responseData);
                  }
                  this.reLoadChart(this.component);
                }
              } else if (this.dataSetForm.type=="3") {
                this.component.data=response.responseData;
                this.component.columnDataSetSettings.dataSetId=this.dataSetForm.dataSetId;
                this.component.columnDataSetSettings.column=this.dataSetForm.column;
                this.reLoadTable(this.component);
              } else if (this.dataSetForm.type=="4") {
                this.component.content=response.responseData;
                this.component.columnDataSetSettings.dataSetId=this.dataSetForm.dataSetId;
                this.component.columnDataSetSettings.column=this.dataSetForm.column;
              }
              this.commonUtil.clearObj(this.dataSetForm);
              this.dataSetForm.column=null;
              this.dataSetDialog=false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //编辑自定义列数据
    editCustomColumnData (component) {
      this.customColumnDataDialogVisiable=true;
      let dataContent="";
      if (component.type==this.commonConstants.componentsType.histogram||component.type==this.commonConstants.componentsType.lineChart
        ||component.type==this.commonConstants.componentsType.pieChart) {
        for (let index=0; index<component.options.series.length; index++) {
          const element=component.options.series[index];
          if (index==0) {
            dataContent=dataContent+JSON.stringify(element.data)
          } else {
            dataContent=dataContent+";"+JSON.stringify(element.data)
          }
        }
      } else if (component.type==this.commonConstants.componentsType.table) {
        dataContent=JSON.stringify(component.data)
      } else if (component.type==this.commonConstants.componentsType.text) {
        dataContent=component.content
      } else if (component.type==this.commonConstants.componentsType.gauge) {
        dataContent=component.options.series[0].data[0].value+'';
      }
      this.$nextTick(() => {
        this.$refs.dataCodeMirror.codemirror.setValue(dataContent);
      });

    },
    closeCustomColumnDataDialog () {
      this.customColumnDataDialogVisiable=false;
      this.$refs.dataCodeMirror.codemirror.setValue("");
    },
    formatData () {//sql格式化
      let sqlContent="";
      sqlContent=this.$refs.dataCodeMirror.codemirror.getValue();
      if (sqlContent) {
        this.$refs.dataCodeMirror.codemirror.setValue(sqlFormatter.format(sqlContent));
      }

    },
    confirmCustomColumnData () {
      let sqlContent=this.$refs.dataCodeMirror.codemirror.getValue();
      if (sqlContent.trim()) {
        if (this.component.type==this.commonConstants.componentsType.histogram||this.component.type==this.commonConstants.componentsType.lineChart
          ||this.component.type==this.commonConstants.componentsType.pieChart||this.component.type==this.commonConstants.componentsType.gauge) {
          var type="bar";
          if (this.component.type==this.commonConstants.componentsType.histogram) {
            type="bar";
          } else if (this.component.type==this.commonConstants.componentsType.lineChart) {
            type="line";
          } else if (this.component.type==this.commonConstants.componentsType.pieChart) {
            type="pie";
          } else if (this.component.type==this.commonConstants.componentsType.gauge) {
            type="gauge";
          }
          if (type=="bar"||type=="line") {
            var series=new Array();
            let arrs=sqlContent.split(";");
            for (let index=0; index<arrs.length; index++) {
              let element=arrs[index];
              element=element.replace('[', '').replace(']', '');
              var data=element.split(',').map(Number)
              var obj={
                name: "系列名称",
                type: type,
                barGap: 0,
                barWidth: 20,//柱体宽度
                itemStyle: {
                  color: '#00adff',//柱体颜色
                },
                data: data
              }
              series.push(obj);
            }
            this.component.options.series=series;
          } else if (type=="pie") {
            try {
              this.component.options.series[0].data=JSON.parse(sqlContent.trim());
            } catch (error) {
              this.commonUtil.showMessage({ message: "数据解析错误，请检查数据格式是否是正确的json格式。", type: this.commonConstants.messageType.error })
              return;
            }
          } else if (type=="gauge") {
            try {
              this.component.options.series[0].data[0].value=Number(sqlContent.trim());
            } catch (error) {
              this.commonUtil.showMessage({ message: "数据解析错误，请检查数据格式是否是正确的数字格式。", type: this.commonConstants.messageType.error })
              return;
            }
          }

          this.reLoadChart(this.component);
        } else if (this.component.type==this.commonConstants.componentsType.table) {//表格
          try {
            this.component.data=JSON.parse(sqlContent.trim());
          } catch (error) {
            this.commonUtil.showMessage({ message: "数据解析错误，请检查数据格式是否是正确的json格式。", type: this.commonConstants.messageType.error })
            return;
          }

          this.reLoadTable(this.component)
        } else if (this.component.type==this.commonConstants.componentsType.text) {
          this.component.content=sqlContent.trim();
        }
        this.closeCustomColumnDataDialog()
      } else {
        this.commonUtil.showMessage({ message: "请输入自定义数据", type: this.commonConstants.messageType.error })
        return;
      }
    },
    //图标重置 1标题重置 2主题设置重置 3数据来源重置 4图例组件重置 5x轴设置重置 6柱体设置重置 7y轴设置重置 8饼图设置
    resetChartContent (component, type) {
      var obj;
      if (component.type==this.commonConstants.componentsType.histogram) {//柱状图
        obj=JSON.parse(JSON.stringify(this.commonConstants.screenHistogramInit));
      } else if (component.type==this.commonConstants.componentsType.lineChart) {//折线图
        obj=JSON.parse(JSON.stringify(this.commonConstants.screenLineChartInit));
      } else if (component.type==this.commonConstants.componentsType.pieChart) {//饼图
        obj=JSON.parse(JSON.stringify(this.commonConstants.screenPieChartInit));
      } else if (component.type==this.commonConstants.componentsType.gauge) {//仪表盘
        obj=JSON.parse(JSON.stringify(this.commonConstants.screenGaugeInit));
      }
      if (type=="1") {//标题重置
        component.options.title=obj.options.title;
      } else if (type=="2") {//主题重置
        component.theme=obj.theme;
        component.options.backgroundColor=obj.options.backgroundColor;
        this.reInitChart(component);
      } else if (type=="3") {//数据来源重置
        if (component.type==this.commonConstants.componentsType.pieChart||component.type==this.commonConstants.componentsType.gauge) {
          component.options.columnDataSource=obj.options.columnDataSource;
          component.options.series[0].data=[];
          component.options.series[0].data=component.options.series[0].data.concat(obj.options.series[0].data);
        }
        else {
          component.options.xAxis.data=obj.options.xAxis.data;
          component.options.categoryDataSource=obj.options.categoryDataSource;
          component.options.apiSettings=obj.options.apiSettings;
          component.options.categoryDataSetSettings=obj.options.categoryDataSetSettings;
          component.options.columnDataSource=obj.options.columnDataSource;
          component.options.dataApiSettings=obj.options.dataApiSettings;
          component.options.columnDataSetSettings=obj.options.columnDataSetSettings;
          component.options.series=obj.options.series;
        }
        component.isRefresh=obj.isRefresh;
        component.refreshTime=obj.refreshTime;
      } else if (type=="4") {//图例组件
        component.options.legend=obj.options.legend;
      } else if (type=="5") {//X轴设置
        component.options.xAxis.axisLabel=obj.options.xAxis.axisLabel;
      } else if (type=="6") {//柱体设置
        component.options.series=obj.options.series;
      } else if (type=="7") {//y轴设置
        component.options.yAxis=obj.options.yAxis;
      } else if (type=="8") {//饼图设置
        component.options.series[0].name=obj.options.series[0].name;
        component.options.series[0].label=obj.options.series[0].label;
        component.options.series[0].radius=obj.options.series[0].radius;
      }
      this.reLoadChart(component);
    },
    //重置表格 1数据列 2数据来源 3表格样式 4 表头样式 5表体样式 6滚动设置
    resetTableContent (component, type) {
      var obj=JSON.parse(JSON.stringify(this.commonConstants.screenTableInit));
      if (type=="1") {
        component.tableColumn=obj.tableColumn;
      } else if (type=="2") {
        component.data=obj.data;
        component.columnDataSource=obj.columnDataSource;
        component.dataApiSettings=obj.dataApiSettings;
        component.columnDataSetSettings=obj.columnDataSetSettings;
        component.isRefresh=obj.isRefresh;
        component.refreshTime=obj.refreshTime;
      } else if (type=="3") {
        component.style=obj.style;
      } else if (type=="4") {
        component.headStyle=obj.headStyle;
      } else if (type=="5") {
        component.bodyStyle=obj.bodyStyle;
        component.options.singleHeight=component.bodyStyle.height;
      } else if (type=="6") {
        component.options.step=obj.options.step;
        component.options.limitMoveNum=obj.options.limitMoveNum;
        component.options.hoverStop=obj.options.hoverStop;
        component.options.waitTime=obj.options.waitTime;
      }
      this.reLoadTable(component);
    },
    //显示添加表格数据列dialog 
    //type 类型 1新增 2编辑
    showAddTableColumn (type, row, index) {
      this.tableColumnDialogVisiable=true;
      if (type=="2") {
        this.tableColumnForm.name=row.name;
        this.tableColumnForm.key=row.key;
        this.tableColumnForm.width=row.style.width;
        this.tableColumnForm.type=type;
        this.tableColumnForm.index=index;
      }

    },
    addTableColomn () {
      this.$refs['tableColumnForm'].validate((valid) => {
        if (valid) {
          if (this.tableColumnForm.type=="1") {
            var obj={
              name: this.tableColumnForm.name,
              key: this.tableColumnForm.key,
              style: { width: this.tableColumnForm.width }
            }
            this.component.tableColumn.push(obj);
          } else {
            this.component.tableColumn[this.tableColumnForm.index].name=this.tableColumnForm.name;
            this.component.tableColumn[this.tableColumnForm.index].key=this.tableColumnForm.key;
            this.component.tableColumn[this.tableColumnForm.index].style.width=this.tableColumnForm.width;
          }
          this.tableColumnForm.name="";
          this.tableColumnForm.key="";
          this.tableColumnForm.width="";
          this.tableColumnForm.type="1";
          this.tableColumnForm.index=null;
          this.tableColumnDialogVisiable=false;
          this.$parent.$parent.$parent.$refs['draggable'].$refs[this.component.id][0].reset()
        }
      })
    },
    //删除列
    deleteTableColumn (index) {
      this.component.tableColumn.splice(index, 1);
      this.$parent.$parent.$parent.$refs['draggable'].$refs[this.component.id][0].reset()
    },
    //重写加载表格
    reLoadTable (component) {
      this.$parent.$parent.$parent.$refs['draggable'].$refs[this.component.id][0].reset()
    },
    //修改表体行高
    changeTableLineHeight (component) {
      component.options.singleHeight=component.bodyStyle.height;
      this.reLoadTable(component);
    },
    //数据源修改
    dataSourceChange () {
      if (this.commonConstants.componentsType.text==this.component.type||this.commonConstants.componentsType.table==this.component.type) {//文本框和表格
        if (this.component.columnDataSource=="1") {
          this.component.isRefresh=false;
        }
      } else if (this.commonConstants.componentsType.histogram==this.component.type||this.commonConstants.componentsType.lineChart==this.component.type) {
        if (this.component.options.categoryDataSource=='1'&&this.component.options.columnDataSource=='1') {
          this.component.isRefresh=false;
        }
      } else if (this.commonConstants.componentsType.pieChart==this.component.type) {
        if (this.component.options.columnDataSource=='1') {
          this.component.isRefresh=false;
        }
      }
    },
    //添加参数
    addParam () {
      this.paramDialog=true;
    },
    paramConfirm () {
      this.$refs['paramForm'].validate((valid) => {
        if (valid) {
          //校验是否已经有该参数
          if (this.checkParamName(this.paramForm.paramName, this.apiDialog? this.apiForm.params:this.dataSetForm.params)) {
            this.commonUtil.showMessage({ message: "该参数名称已经存在，请勿重复添加。", type: "error" })
            return;
          }
          if (this.checkParamCode(this.paramForm.paramCode, this.apiDialog? this.apiForm.params:this.dataSetForm.params)) {
            this.commonUtil.showMessage({ message: "该参数编码已经存在，请勿重复添加。", type: "error" })
            return;
          }
          var param={
            paramName: this.paramForm.paramName,
            paramCode: this.paramForm.paramCode,
            defaultValue: this.paramForm.defaultValue,
            paramValue: "",
          }
          if (this.apiDialog) {
            this.apiForm.params.push(param);
          } else {
            this.dataSetForm.params.push(param);
          }

          this.paramCancle();
        }
      })
    },
    paramCancle () {
      this.paramDialog=false;
      this.commonUtil.clearObj(this.paramForm);
      this.$refs['paramForm'].resetFields();//校验重置
    },
    checkParamCode (paramCode, params) {
      var result=false;
      for (let index=0; index<params.length; index++) {
        const element=params[index];
        if (paramCode==element.paramCode) {
          result=true;
          break;
        }
      }
      return result;
    },
    checkParamName (paramName, params) {
      var result=false;
      for (let index=0; index<params.length; index++) {
        const element=params[index];
        if (paramName==element.paramName) {
          result=true;
          break;
        }
      }
      return result;
    },
    deleteParam (row, index) {
      if (this.apiDialog) {
        this.apiForm.params.splice(index, 1)
      } else {
        this.dataSetForm.params.splice(index, 1)
      }
    },
    //添加属性值
    addProp () {
      this.propDialog=true;
    },
    propConfirm () {
      this.$refs['propForm'].validate((valid) => {
        if (valid) {
          var prop={
            propName: this.propForm.propName,
          }
          this.apiForm.resultTypeProp.push(prop);
          this.propCancle();
        }
      })
    },
    propCancle () {
      this.propDialog=false;
      this.commonUtil.clearObj(this.propForm);
      this.$refs['propForm'].resetFields();//校验重置
    },
    deleteProp (row, index) {
      this.apiForm.resultTypeProp.splice(index, 1)
    },
    // 图片上传
    beforeUpload (file) {
      if (file.size>20971520) {
        //   this.limitShow = true
        this.$message.error('文件大小不得超过20M')
        return false
      } else {
      }
    },
    onChange (file, fileList) {
      this.fileList=fileList
    },
    successHandle (res, file, fileList) {
      if (res.code==0) {
        this.$set(this.component, 'imgUrl', res.data.fileLink)
      } else {
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
  }
}
