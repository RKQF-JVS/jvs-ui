import moment from 'moment'

export const commonConstants={
  componentsType: {
    panel: "panel",//画布
    text: "text",//文本
    picture: "picture",//图片
    histogram: "histogram",//柱状图
    lineChart: "lineChart",//折线图
    pieChart: "pieChart",//饼图
    gauge: "gauge",//仪表盘
    table: "table",//表格
    date: "date",//日期
    delete: "delete",//删除的组件
  },
  screenTextInit: {
    type: 'text',
    textType: "text",//文本类型
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 200,//文本组件初始化宽度
    h: 50,//文本组件初始化高度
    style: {
      display: 'table-cell', textAlign: 'center', verticalAlign: "middle", fontSize: "14", color: "#ffffff", letterSpacing: "1", background: "", fontWeight: false
    },
    zindex: 'auto',
    content: "文本",
    columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
    dataApiSettings: {//柱体数据接口配置
      url: "",//请求地址
      requestType: "post",//请求类型 post get
      params: "",//请求参数
      resultType: "",//返回值类型
      resultTypeProp: "",//返回值属性
    },
    columnDataSetSettings: {//柱体数据数据集配置
      dataSetId: "",//数据集id
      column: "",//cloumn属性
    },
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    speed: 10,//滚动速度
    href: "",
  },
  screenPictureInit: {
    type: 'picture',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 200,//图片组件初始化宽度
    h: 200,//图片组件初始化高度
    // style:{
    //     display:'table-cell',textAlign:'center', verticalAlign:"middle",fontSize:"14",color:"#000000",letterSpacing:"1",background:"",fontWeight:false
    // },
    imgUrl: "",
    zindex: 'auto',
  },
  screenHistogramInit: {
    type: 'histogram',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 300,//文本组件初始化宽度
    h: 200,//文本组件初始化高度
    active: false,
    zindex: 'auto',
    theme: "dark",//主题
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    options: {
      backgroundColor: '#100C2A',
      title: {
        show: true,//ture or false
        text: "柱状图",
        x: 'center',//'left' 'center' 'right'
        textStyle: {//标题样式
          color: '#1E90FF',
          fontWeight: 'normal',//'normal' 'bold'
          fontSize: 20
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: true,
        left: 0,
        top: 0
      },
      xAxis: {//x轴属性
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: {//x坐标是否显示，间隔和字体倾斜
          show: true,
          interval: 0,
          rotate: 30,
          color: '#FFFFFF',//字体颜色
          fontWeight: 'normal',//'normal','bold'
          fontSize: 12,
          overflow: 'truncate',
          ellipsis: '...',
          width: 40
        },
      },
      yAxis: {
        show: true,
        axisLabel: {//x坐标是否显示，间隔和字体倾斜
          show: true,
          rotate: 0,
          color: '#FFFFFF',//字体颜色
          fontWeight: 'normal',//'normal','bold'
          fontSize: 12,
          overflow: 'truncate',
          ellipsis: '...',
          width: 40
        },
      },

      categoryDataSource: "1",//类目数据来源 1自定义 2接口 3数据集
      apiSettings: {
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      //类目数据集配置
      categoryDataSetSettings: {
        dataSetId: "",//数据集id
        column: "",//cloumn属性
      },
      columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
      dataApiSettings: {//柱体数据接口配置
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      columnDataSetSettings: {//柱体数据数据集配置
        dataSetId: "",//数据集id
        column: [],//cloumn属性
      },
      series: [
        {
          name: "系列名称",
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barGap: 0,
          itemStyle: {
            color: '#00adff',//柱体颜色
          },

          smooth: 20,//柱体宽度
        },
      ],
    }
  },
  screenLineChartInit: {
    type: 'lineChart',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 300,//文本组件初始化宽度
    h: 200,//文本组件初始化高度
    active: false,
    zindex: 'auto',
    theme: "dark",//主题
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    options: {
      backgroundColor: '#100C2A',
      title: {
        show: true,//ture or false
        text: "折线图",
        x: 'center',//'left' 'center' 'right'
        textStyle: {//标题样式
          color: '#1E90FF',
          fontWeight: 'normal',//'normal' 'bold'
          fontSize: 20
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: true,
        left: 0,
        top: 0
      },
      xAxis: {//x轴属性
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: {//x坐标是否显示，间隔和字体倾斜
          show: true,
          interval: 0,
          rotate: 30,
          color: '#FFFFFF',//字体颜色
          fontWeight: 'normal',//'normal','bold'
          fontSize: 12,
          overflow: 'truncate',
          ellipsis: '...',
          width: 40
        },
      },
      yAxis: {
        show: true,
        axisLabel: {//x坐标是否显示，间隔和字体倾斜
          show: true,
          rotate: 0,
          color: '#FFFFFF',//字体颜色
          fontWeight: 'normal',//'normal','bold'
          fontSize: 12,
          overflow: 'truncate',
          ellipsis: '...',
          width: 40
        },
      },

      categoryDataSource: "1",//类目数据来源 1自定义 2接口 3数据集
      apiSettings: {
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      //类目数据集配置
      categoryDataSetSettings: {
        dataSetId: "",//数据集id
        column: "",//cloumn属性
      },
      columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
      dataApiSettings: {//柱体数据接口配置
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      columnDataSetSettings: {//柱体数据数据集配置
        dataSetId: "",//数据集id
        column: [],//cloumn属性
      },
      series: [
        {
          name: "系列名称",
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'line',
          barGap: 0,
          itemStyle: {
            color: '#00adff',//折线颜色颜色
          },
          smooth: false,//平滑曲线
        },
      ],
    }
  },
  screenPieChartInit: {
    type: 'pieChart',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 450,//文本组件初始化宽度
    h: 240,//文本组件初始化高度
    active: false,
    zindex: 'auto',
    theme: "dark",//主题
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    options: {
      backgroundColor: '#100C2A',
      title: {
        show: true,//ture or false
        text: "饼图",
        x: 'center',//'left' 'center' 'right'
        textStyle: {//标题样式
          color: '#1E90FF',
          fontWeight: 'normal',//'normal' 'bold'
          fontSize: 20
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      legend: {
        show: true,
        left: 0,
        top: 0,
        orient: 'vertical'
      },
      columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
      dataApiSettings: {//柱体数据接口配置
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      columnDataSetSettings: {//柱体数据数据集配置
        dataSetId: "",//数据集id
        column: [],//cloumn属性
      },
      series: [
        {
          name: "访问来源",
          roseType: "",
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}'
          },
          data: [
            { value: 1048,name: '搜索引擎', itemStyle: {color: '#4992FF'} },
            { value: 735, name: '直接访问', itemStyle: {color: '#7CFFB2'} },
            { value: 580, name: '邮件营销', itemStyle: {color: '#FDDD60'} },
            { value: 484, name: '联盟广告', itemStyle: {color: '#FF6E76'} },
            { value: 300, name: '视频广告', itemStyle: {color: '#58D9F9'} }
          ],
          type: 'pie',
          radius: ['0%', '50%'],
        },
      ],
    }
  },
  screenTableInit: {
    type: 'table',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 300,//文本组件初始化宽度
    h: 300,//文本组件初始化高度
    // style:{
    //     display:'table-cell',textAlign:'center', verticalAlign:"middle",fontSize:"14",color:"#000000",letterSpacing:"1",background:"",fontWeight:false
    // },
    zindex: 'auto',
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    //数据列
    tableColumn: [{ "name": "销售数量", "key": "count", "style": { "width": '40' } }, { "name": "日期", "key": "date", "style": { "width": '40' } }],

    headStyle: {
      height: 40,//高度
      backgroundColor: '#2570a1',
      color: "#00FFFF",//字体颜色
      fontSize: 12,//字体大小
      fontWeight: 'bold',//是否加粗 normal 和bold
    },//表头样式
    style: {//整体样式
      showIndex: true,//是否显示序号
      isBorder: true,//是否显示边框
      borderColor: '#FFFFFF',//边框颜色
      borderWidth: 1,//边框宽度
      borderStyle: 'solid',//边框样式
      indexWidth: '20',
    },
    bodyStyle: {//表体样式
      oddRowColor: '#33a3dc',//奇数行颜色
      evenRowColor: '#2570a1',//偶数行颜色
      height: 30,//行高
      color: '#ffffff',//字体颜色
      fontSize: 12,//字体大小
      fontWeight: 'normal',//是否加粗
    },
    options: {//表格配置项
      step: 0.5, // 数值越大速度滚动越快
      limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: true, // 开启数据实时监控刷新dom
      singleHeight: 30, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
    },
    columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
    dataApiSettings: {//柱体数据接口配置
      url: "",//请求地址
      requestType: "post",//请求类型 post get
      params: "",//请求参数
    },
    columnDataSetSettings: {//柱体数据数据集配置
      dataSetId: "",//数据集id
      column: [],//cloumn属性
    },
    data: [{
      'count': '100',
      'date': '2021-08-01'
    }, {
      'count': '95',
      'date': '2021-08-02'
    }, {
      'count': '112',
      'date': '2021-08-03'
    }, {
      'count': '125',
      'date': '2021-08-04'
    }, {
      'count': '144',
      'date': '2021-08-05'
    }, {
      'count': '168',
      'date': '2021-08-06'
    }, {
      'count': '158',
      'date': '2021-08-07'
    }, {
      'count': '99',
      'date': '2021-08-08'
    }],//表格数据
  },
  screenDateInit: {
    type: 'date',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 200,//图片组件初始化宽度
    h: 50,//图片组件初始化高度
    style: {
      display: 'table-cell', textAlign: 'center', verticalAlign: "middle", fontSize: "14", color: "#ffffff", letterSpacing: "1", background: "", fontWeight: false
    },
    zindex: 'auto',
    content: "",
    format: "1",
  },
  screenGaugeInit: {
    type: 'gauge',
    x: 0,//初始化横坐标
    y: 0,//初始化纵坐标
    w: 450,//文本组件初始化宽度
    h: 240,//文本组件初始化高度
    active: false,
    zindex: 'auto',
    theme: "dark",//主题
    isRefresh: false,//是否定时刷新
    refreshTime: 0,//定时刷新时间，单位(ms)
    options: {
      backgroundColor: '#100C2A',
      title: {
        show: true,//ture or false
        text: "仪表盘",
        x: 'center',//'left' 'center' 'right'
        textStyle: {//标题样式
          color: '#1E90FF',
          fontWeight: 'normal',//'normal' 'bold'
          fontSize: 20
        }
      },
      tooltip: {
        show: false,
        trigger: 'item',
      },
      columnDataSource: "1",//柱体数据来源 1自定义 2接口 3数据集
      dataApiSettings: {//柱体数据接口配置
        url: "",//请求地址
        requestType: "post",//请求类型 post get
        params: "",//请求参数
        resultType: "",//返回值类型
        resultTypeProp: "",//返回值属性
      },
      columnDataSetSettings: {//柱体数据数据集配置
        dataSetId: "",//数据集id
        column: [],//cloumn属性
      },
      series: [{
        name: '',
        type: 'gauge',
        radius: 90,
        min: 0,
        max: 100,
        startAngle: 225,// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
        endAngle: -45,
        splitNumber: 10,
        axisLine: {
          show: true,
          lineStyle: {
            width: 10,
            color: [[1, '#E6EBF8']]
          }
        },
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: "#1E90FF"
          }
        },
        splitLine: {
          show: true,
          length: 10,//分割线长度
          distance: 10,//分割线与轴线的距离
          lineStyle: {
            color: "#63677A",
            width: 3,
          }
        },
        axisTick: {
          show: true,
          splitNumber: 5,
          length: 6,
          distance: 10,
          lineStyle: {
            color: "#63677A",
            width: 1,
          }
        },
        axisLabel: {
          show: true,
          distance: 15,
          color: "#FCFAFA",
          fontSize: 12
        },
        anchor: {
          show: true,
          size: 16,
          icon: 'circle',
          itemStyle: {
            color: "#fff",
            borderWidth: 2,
            borderColor: '#00CED1'
          }
        },
        pointer: {
          show: true,
          length: '40%',
          icon: 'triangle',
          width: 10,
          itemStyle: {
            color: "#FF8C00"
          }
        },
        title: {
          show: true,
          offsetCenter: [0, 30],
          color: '#FCFAFA',
          fontWeight: 'normal',
          fontSize: 16,
        },
        detail: {
          show: true,
          color: '#FCFAFA',
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 20,
          fontWeight: 'bold',
          offsetCenter: [0, 50]
        },
        data: [{
          value: 90,
          name: '得分'
        }]
      }]
    }
  }
}

export const commonUtil={
  getUuid: function () {
    var len=32;//32长度
    var radix=16;//16进制
    var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid=[], i;
    radix=radix||chars.length;
    if (len) {
      for (i=0; i<len; i++)uuid[i]=chars[0|Math.random()*radix];
    } else {
      var r;
      uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';
      uuid[14]='4';
      for (i=0; i<36; i++) {
        if (!uuid[i]) {
          r=0|Math.random()*16;
          uuid[i]=chars[(i==19)? (r&0x3)|0x8:r];
        }
      }
    }
    return uuid.join('');
  },
  getCurrentDate: function (obj) {
    switch (obj.format) {
      case '1':
        return moment().format("YYYY-MM-DD HH:mm:ss");
      case '2':
        return moment().format("YYYY-MM-DD HH:mm");
      case '3':
        return moment().format("YYYY-MM-DD");
      case '4':
        return moment().format("YYYY-MM");
      case '5':
        return moment().format("HH:mm:ss");
      case '6':
        return moment().format("HH:mm");
      case '7':
        return commonUtil.getWeek();
      default:
        break;
    }
  },
  getWeek: function () {
    let week=moment().day()
    switch (week) {
      case 1:
        return '星期一'
      case 2:
        return '星期二'
      case 3:
        return '星期三'
      case 4:
        return '星期四'
      case 5:
        return '星期五'
      case 6:
        return '星期六'
      case 0:
        return '星期日'
    }
  }
}