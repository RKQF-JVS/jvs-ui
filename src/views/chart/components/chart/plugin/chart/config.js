/**
 * 图表数据配置文件
 * column
 * tableData
 */

import {DataSet, DataView} from "@antv/data-set";
import GFunnelChart from './funnel'
const funnelData = new GFunnelChart()

// 基础条形图数据
export const baseBar = {
  column: [
    { "key": "项" },
    { "key": "汽车" },
    { "key": "建材家居" },
    { "key": "住宿旅游" },
    { "key": "交通运输与仓储邮政" },
    { "key": "建筑房地产" },
    { "key": "教育" },
    { "key": "IT 通讯电子" },
    { "key": "社会公共管理" },
    { "key": "医疗卫生" },
    { "key": "金融保险" }
  ],
  tableData: [
    {
      name:"销量（百万）",
      data:[{
        xAxis:'汽车',
        yAxis:34
      },{
        xAxis:'建材家居',
        yAxis: 85
      },{
        xAxis:'住宿旅游',
        yAxis: 103
      },{
        xAxis:'交通运输与仓储邮政',
        yAxis: 142
      },{
        xAxis:'建筑房地产',
        yAxis: 251
      },{
        xAxis:'IT 通讯电子',
        yAxis: 491
      },{
        xAxis:'社会公共管理',
        yAxis: 672
      },{
        xAxis:'医疗卫生',
        yAxis: 868
      }]
    },
    // {
    //   "项": "销量（百万）",
    //   "汽车": 34,
    //   "建材家居": 85,
    //   "住宿旅游": 103,
    //   "交通运输与仓储邮政": 142,
    //   "建筑房地产": 251,
    //   "教育": 367,
    //   "IT 通讯电子": 491,
    //   "社会公共管理": 672,
    //   "医疗卫生": 868,
    //   "金融保险": 1234
    // },
  ],
}

// 基础柱状图数据
export const baseHistogram = {
  column: [
    { "key": "项" },
    { "key": "1月" },
    { "key": "2月" },
    { "key": "3月" },
    { "key": "4月" },
    { "key": "5月" },
    { "key": "6月" },
    { "key": "7月" },
    { "key": "8月" }
  ],
  tableData: [
    {
      "name":"电信",
      "data":[
        {
          "xAxis":"1月",
          "yAxis":18.9
        },
        {
          "xAxis":"2月",
          "yAxis":28.8
        },
        {
          "xAxis":"3月",
          "yAxis":39.3
        },
        {
          "xAxis":"4月",
          "yAxis":81.4
        },
        {
          "xAxis":"5月",
          "yAxis":47
        }
      ]
    }
  ],
}

// 基础散点图数据
export const baseScatter = {
  tableData: require('@/views/chart/assets/json/scatter.json')
}

// 气泡图数据
export const bubbleScatter = {
  tableData: require('@/views/chart/assets/json/bubble.json')
}

// 其他折线图数据
export const otherLine = {
  tableData: require('@/views/chart/assets/json/otherLine.json')
}

// 多折线图数据
export function getLines() {
  // const list = []
  // const arr = ['boxcar', 'cosine', 'epanechnikov', 'gaussian', 'quartic', 'triangular', 'tricube', 'triweight', 'uniform']
  // arr.forEach(function(method, i) {
  //   const dv = new DataSet.View().source(require('@/views/chart/assets/json/lines.json'));
  //   dv.transform({
  //     type: 'kernel-smooth.regression',
  //     method: method,
  //     field: 'depth',
  //     extent: [50, 70]
  //   });
  //   const obj = { rows: dv.rows, name: method }
  //   list.push(obj)
  // });
  return { tableData: require('@/views/chart/assets/json/lines_new.json') }
}

// 直方图数据
export const hist = [
  1.2, 3.4, 3.7, 4.3, 5.2, 5.8, 6.1, 6.5, 6.8, 7.1, 7.3, 7.7, 8.3,
  8.6, 8.8, 9.1, 9.2, 9.4, 9.5, 9.7, 10.5, 10.7, 10.8, 11.0, 11.0,
  11.1, 11.2, 11.3, 11.4, 11.4, 11.7, 12.0, 12.9, 12.9, 13.3, 13.7,
  13.8, 13.9, 14.0, 14.2, 14.5, 15, 15.2, 15.6, 16.0, 16.3, 17.3,
  17.5, 17.9, 18.0, 18.0, 20.6, 21, 23.4
]
export function getHistData(arr) {
  const values = arr ? arr : hist;
  const data = [];
  for (let i = 0; i < values.length; i++) {
    const obj = {};
    obj.value = values[i];
    data.push(obj);
  }
  const ds = new DataSet();
  console.log(data)
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'bin.histogram',
    field: 'value',
    binWidth: 2,
    as: ['value', 'count']
  });
  console.log(dv)
  return dv.rows
}

// 漏斗图数据
export function getFunnelData() {
  const dv = new DataView().source(funnelData.tableData);
  // 获取最大值，方便计算比例
  funnelData.tableData.sort(function(a,b){
      var x = a['value'];
      var y = b['value'];
      return((x>y)?-1:((x<y)?1:0));
  })
  dv.transform({
    type: 'map',
    callback: function callback(row) {
      row.percent =  row.value / funnelData.tableData[0].value;
      return row;
    }
  });
  return { tableData: dv.rows }
}

// 基础面积图数据
export function getBaseAreaData() {
  const data = require('@/views/chart/assets/json/baseArea.json')
  const ds = new DataSet({
    state: {
      start: new Date('2009/7/20 0:00').getTime(),
      end: new Date('2009/8/12 0:00').getTime()
    }
  });
  const dv = ds.createView('origin').source(data);
  dv.transform({
    type: 'filter',
    callback: function callback(obj) {
      const time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
      return time >= ds.state.start && time <= ds.state.end;
    }
  });
  return { tableData: dv.rows }
}
