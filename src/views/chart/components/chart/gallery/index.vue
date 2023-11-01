<template>
  <div :id="setting.id"></div>
</template>
<script>
import {Chart, registerShape } from '@antv/g2'
import {DataView, DataSet} from '@antv/data-set'
import {getHistData, hist} from "../plugin/chart/config";

export default {
  name: 'gallery-canvas',
  props: {
    shape: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number,
    },
    tableData: {
      type: Array,
    },
    column: {
      type: Array,
    },
    setting: {
      type: Object,
    },
  },
  computed: {
    data () {
      return this.getData(this.tableData)
    },
    // 根据不同的边框 用不同的padding
    charpadding () {
      let padd=[]
      let num=this.setting.border
      if (num===0) {
        padd=[20, 20, 70, 40]
      } else if (num===1||num===2||num===5||num===6||num===7||num===8||num===9||num===10||num===12||num===13) {
        padd=[50, 40, 70, 110]
      } else if (num===3||num===4) {
        padd=[70, 50, 100, 120]
      } else if (num===11) {
        padd=[80, 40, 80, 110]
      } else {
        padd=[20, 20, 70, 40]
      }
      return padd
    }
  },
  data () {
    return {
      chart: null
    }
  },
  created () {
  },
  mounted () {
    if(!this.width) {
      this.width = 355
    }
    setTimeout(() => {
      this.init(this.data, this.width, this.height)
    }, 0)
    // 首次加载自适应初始化宽高
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
  },
  methods: {
    // 格式化数据
    getData (tableData) {
      // 饼图不处理数据
      if(this.shape == 'Pie') {
        let all = 0
        tableData.forEach(item => {
          all = all + item.value
        })
        for(let i in tableData) {
          tableData[i].percent = Number.parseFloat((tableData[i].value / all).toFixed(4))
        }
        return tableData
      } else if (this.shape === 'ScatterChart') {
        return tableData
      } else if (this.shape === 'FunnelChart') {
        return tableData
      } else if (this.shape === 'AreaChart' && this.setting.type === 'base') {
        return tableData
      } else if (this.shape === 'DashBoardChart') {
        return tableData
      } else{
        // 折线图和基础柱状图都走这里
        let newTable = []
        // 直方图需要处理步长
        if(this.setting.type === 'hist'){
         tableData.map(item=>{
            let newName =  item.name,startStep = 0,endStep = this.setting.step
            item.data.map(itemD=>{
              newTable.push({yAxis:itemD.yAxis,name:newName})
              startStep += endStep
              endStep += this.setting.step
            })
          })
          const ds = new DataSet();
          const dv = ds.createView().source(newTable);
          dv.transform({
            type: 'bin.histogram',
            field: 'yAxis',
            binWidth: this.setting.step,
            groupBy: ['name'],
            as: ['yAxis', 'xAxis'],
          });
          return dv.rows
        }else{
          tableData.map(item=>{
            let newName =  item.name
            item.data.map(itemD=>{
              newTable.push({...itemD,name:newName})
            })
          })
          return newTable
        }
      }
    },
    // 初始化
    init (data, width, height) {
      this.chart && this.chart.destroy() //this.chart存在就销毁重新绘制chart
      // 初始化实例
      this.chart = new Chart({
        container: this.setting.id,
        autoFit: true,
        width: width,
        height: height,
        // padding: this.shape == 'Pie' ? [0,0,0,0] : this.charpadding
        padding: this.shape == 'Pie' ? [0,0,0,0] : 'auto'
      })

      // 饼图设置圆周大小及内环
      if(this.shape == 'Pie') {
        if(this.setting.type == '4' || this.setting.type == '5') {
          this.chart.coordinate('polar', {
            innerRadius: this.setting.type == '5' ? 0.2 : 0,
          });
          this.chart.axis(false);
          // 图例靠右
          this.chart.legend('type', {
            position: 'right',
          });
        }else{
          this.chart.coordinate('theta', {
            radius: 0.75,
            innerRadius: this.setting.type == '3' ? 0.6 : 0,
          });
        }
      }

      // 数据处理
      if(this.shape == 'HistogramChart' && this.setting.type == 'percent') {
        // 计算每个柱子的占比
        const dv = new DataView().source(data).transform({
          type: 'percent',
          field: 'y', // 统计
          dimension: '项', // 图例占比
          groupBy: ['x'], // 分组
          as: 'percent',
        });
        this.chart.data(dv.rows)
      }else{
        this.chart.data(data); // 挂载数据
      }

      // x y 设置
      let scale={}
      // y轴单位设置
      if(this.setting.unit) {
        this.chart.axis('y', {
          label: {
            formatter: (val) => {
              return val+this.setting.unit;
            },
          },
        });
      }
      // 百分比处理
      if(this.shape == 'HistogramChart') {
        if(this.setting.type == 'percent') {
          scale = {
            percent: {
              min: 0,
              formatter(val) {
                return (val * 100).toFixed(2) + '%';
              },
            }
          };
        }else{
          scale['yAxis']={
            min: 0,
            nice: true,
          }
        }
      }else if(this.shape == 'Pie'){
        if(this.setting.type != '4' && this.setting.type != '5') {
          scale['value'] = {//percent
            formatter: (val) => {
              // val = val * 100 + '%';
              return val;
            },
          };
        }
      }else if(this.shape === 'BarChart' && this.setting.type === 'group'){
        this.chart.coordinate().transpose().scale(1, -1);
        this.chart.axis('yAxis', {position: 'right',});
        this.chart.axis('xAxis', { label: { offset: 12, }});
      }else{
        scale['xAxis']={
          range: [0, 1],
        }
        scale['yAxis']={
          min: 0,
          nice: true,
        }
      }
      this.chart.scale(scale)

      switch(this.shape) {
        // 折线图
        case 'LineChart' :
          const colorList = ["#1890FF", "#41D9C7", "#2FC25B", "#FACC14", "#E6965C", "#223273", "#7564CC", "#8543E0", "#5C8EE6"]
          // 辅助线
          this.chart.tooltip({
            showCrosshairs: true, // 展示 Tooltip 辅助线
            shared: true,
          });
          if (this.setting.type === 'lines') {
            this.chart.scale({
              // x: {
              //   alias: 'depth',
              //   min: 50,
              //   max: 70,
              //   sync: true,
              // },
              y: {
                alias: '概率密度分布',
                sync: true
              }
            });
            const that = this
            // data.forEach((item, key) => {
            //   const view = that.chart.view();
            //   // !!key && view.axis(false);
            //   view.source(item.rows);

            // })
            that.chart.line().position('xAxis*yAxis').color('name');
          } else if (this.setting.type === 'other') {
            this.chart.axis('xAxis', {
              label: {
                textStyle: {
                  fill: '#aaaaaa'
                },
              }
            });
            this.chart.scale('yAxis',  {
              max: 300
            });
            this.chart.axis('yAxis', {
              label: {
                textStyle: {
                  fill: '#aaaaaa'
                },
                formatter: (val) => {
                  return this.setting.unit ? val+this.setting.unit : val;
                },
              }
            });
            this.chart.tooltip({
              showCrosshairs: false
            });
            this.chart.scale('xAxis',  {
              tickCount: 6
            });
            this.chart.line().position('xAxis*yAxis').color('name');
          } else {
            this.chart.line().position('xAxis*yAxis').label('yAxis').color('name').shape(this.setting.type);
            this.chart.point().position('xAxis*yAxis').color('name');
            //  this.chart.line().position('x *y').label('y').color('项').shape(this.setting.type);
            // this.chart.point().position('x*y').color('项');
          }
          break;
        // 柱状图
        case 'HistogramChart':
          // this.chart.padding = 'auto'
          // 辅助线
          this.chart.tooltip({
            showMarkers: false, // 去除顶点提示
            showCrosshairs: false,
            shared: true,
          });
          if(this.setting.type === 'group') {
            this.chart.interval().position('xAxis*yAxis').color('name').adjust([{type: 'dodge', marginRatio: 0},],);
          } else if (this.setting.type === 'hist') {
            this.chart.axis('yAxis', {
              label: {
                formatter: (val) => {
                  if (!(val % this.setting.step)) {
                    return val;
                  }
                  return '';
                }
              }
            });
            this.chart.axis('xAxis', {
              label: {
                formatter: (val) => {
                  return this.setting.unit ? val+this.setting.unit : val;
                },
              }
            });
            this.chart.scale({
              yAxis: {
                tickInterval: this.setting.step,
              },
              xAxis: {
                nice: true,
              }
            });
            this.chart.interval().position('yAxis*xAxis').color('name').adjust('stack');
          } else if (this.setting.type === 'base') {
            // 基础柱状图
            this.chart.interval().position('xAxis*yAxis').color('name');
          } else {
            // 百分比
            if(this.setting.type === 'percent') {
              this.chart.interval().position('xAxis*percent').color('name').adjust('stack')
            }else{
              this.chart.interval().position('xAxis*yAxis').color('name').adjust('stack');
            }
          }
          this.chart.interaction('active-region');
          break;
        case 'Pie':
          if(this.setting.type === '2') {
            // 内部文字
            this.chart.interval().adjust('stack').position('percent').color('type').label('percent', {
              offset: -40,
              style: {
                textAlign: 'center',
                fontSize: 16,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
                fill: '#fff',
              },
            }).tooltip('type*percent', (type, percent) => {
              percent = (percent * 100).toFixed(2) + '%';
              return {
                name: type,
                value: percent,
              };
            });
            this.chart.interaction('element-active');
          }else if(this.setting.type === '4' || this.setting.type === '5') {
            // 南丁格尔图
            this.chart.interval().position('type*value').color('type').style({
              lineWidth: 1,
              stroke: '#fff',
            });
            this.chart.tooltip({
              showMarkers: false
            });
            this.chart.interaction('element-highlight');
          }else{
            // 普通饼图
            this.chart.tooltip({
              showTitle: false,
              showMarkers: false,
            })
            this.chart.interval().position('value').color('type').label('percent', {
              content: (data) => {
                return `${data.type}: ${(data.percent * 100).toFixed(2)}%`;
              },
            }).adjust('stack');
            this.chart.interaction('element-active');
          }
          break;
        case 'BarChart':
          this.chart.tooltip({
            shared: true,
            showMarkers: false,
          });
          if(this.setting.type === 'group') {
            this.chart.interval().position('xAxis*yAxis').color('name').adjust([
              {
                type: 'dodge',
                marginRatio: 0,
              },
            ]);
          }else{
            this.chart.tooltip({
              shared: true,
              showMarkers: false,
            });
            // this.chart.padding = [20, 40, 50, 124]
            this.chart.coordinate().transpose();
            this.chart.axis('yAxis', {
              label: null,
            });
            this.chart.axis('value', {
              label: {
                textStyle: {
                  fill: '#8d8d8d',
                  fontSize: 12
                }
              },
              title: {
                offset: 30,
                textStyle: {
                  fontSize: 12,
                  fontWeight: 300
                }
              }
            });
            this.chart.interval().position('xAxis*yAxis').color('name').label('yAxis', {
              textStyle: {
                fill: '#8d8d8d'
              },
              offset: 10
            });
          }
          this.chart.interaction('active-region');
          break;
        // 散点图
        case 'ScatterChart':
          const arr = []
          Object.keys(data[0]).forEach(item => {
            arr.push(item)
          })
          if (this.setting.type === 'base') {
            this.chart.scale({
              height: { nice: true },
              weight: { nice: true },
            });
            // 辅助线
            this.chart.tooltip({
              showTitle: false,
              showCrosshairs: true,
              crosshairs: {
                type: 'xy'
              },
              itemTpl: '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">'
                + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
                + '{name}<br/>'
                + '{value}'
                + '</li>'
            });
            let {xUnit = 'cm',yUnit = 'kg'} = this.setting
            this.chart.point().position(`${arr[1]}*${arr[2]}`).color(`${arr[0]}`).shape('circle').tooltip(`${arr[0]}*${arr[1]}*${arr[2]}`, function(gender, height, weight) {
              return {
                name: gender,
                value: height + `(${xUnit}), ` + weight + `(${yUnit})`
                // value: height + '(cm), ' + weight + '(kg)'
              };
            }).style({ fillOpacity: 0.85 });
            this.chart.interaction('legend-highlight');
          } else {
            this.chart.tooltip({
              showTitle: false, // 不显示默认标题
              shared: true,
              showMarkers: false,
            });
            const colorMap = {
              'Asia': '#1890FF',
              'Americas': '#41D9C7',
              'Europe': '#2FC25B',
              'Oceania': '#FACC14'
            };
            this.chart.scale({
              LifeExpectancy: {
                alias: '人均寿命（年）',
                nice: true,
              },
              Population: {
                type: 'pow',
                alias: '人口总数'
              },
              GDP: {
                alias: '人均国内生产总值($)',
                nice: true,
              },
              Country: {
                alias: '国家/地区'
              }
            });
            this.chart.axis('GDP', {
              label: {
                formatter: function formatter(value) {
                  return (value / 1000).toFixed(0) + 'k';
                } // 格式化坐标轴的显示
              }
            });
            this.chart.legend('Population', false); // 该图表默认会生成多个图例，设置不展示 Population 和 Country 两个维度的图例
            this.chart.point().position('GDP*LifeExpectancy').size('Population', [4, 65]).color('continent', function(val) {
              return colorMap[val];
            }).shape('circle').tooltip('Country*Population*GDP*LifeExpectancy')
              .style('continent', (val) => {
                return {
                  lineWidth: 1,
                  strokeOpacity: 1,
                  fillOpacity: 0.3,
                  opacity: 0.65,
                  stroke: colorMap[val],
                };
              });
            this.chart.interaction('element-active');
          }
          break;
        // 面积图
        case 'AreaChart':
          // 辅助线
          this.chart.tooltip({
            showCrosshairs: true, // 展示 Tooltip 辅助线
            shared: true,
          });
          if (this.setting.type === 'base') {
            this.chart.scale('flow',  {
              alias: '流量(m^3/s)',
              tickInterval: 50,
              max: 300,
              min: 0
            });
            this.chart.scale('rain',  {
              alias: '降雨量(mm)',
              min: 0,
              max: 12,
              tickInterval: 2,
            });
            this.chart.scale('time',  {
              type: 'time',
              tickCount: 8,
              mask: 'm/dd hh:MM'
            });
            this.chart.axis('rain', {
              grid: null
            });
            this.chart.area().position('time*flow').color('l(100) 0:#a50f15 1:#fee5d9');
            this.chart.area().position('time*rain').color('l(100) 0:#293c55 1:#f7f7f7');
            this.chart.interaction('element-visible-filter');
          } else {
            this.chart.scale('xAxis', {
              type: 'linear',
              tickInterval: 50,
            });
            this.chart.scale('yAxis', {
              nice: true,
            });
            this.chart.area().adjust('stack').position('xAxis*yAxis').color('name');
            this.chart.line().adjust('stack').position('xAxis*yAxis').color('name');
            this.chart.interaction('element-highlight');
          }
          break;
        // 仪表图
        case 'DashBoardChart':
          // 自定义Shape 部分
          registerShape('point', 'pointer', {
            draw: function draw(cfg, group) {
              const center = this.parsePoint({ // 获取极坐标系下画布中心点
                x: 0,
                y: 0
              });
              // 绘制指针
              group.addShape('line', {
                attrs: {
                  x1: center.x,
                  y1: center.y,
                  x2: cfg.x,
                  y2: cfg.y,
                  stroke: cfg.color,
                  lineWidth: 5,
                  lineCap: 'round'
                }
              });
              return group.addShape('circle', {
                attrs: {
                  x: center.x,
                  y: center.y,
                  r: 9.75,
                  stroke: cfg.color,
                  lineWidth: 4.5,
                  fill: '#fff'
                }
              });
            }
          });
          this.chart.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            radius: 0.9
          });
          // f c l  代表第一色 第二色 第三色 区间范围值
          let f,c,l
          f = Math.ceil(this.tableData[0].value/3)
          c = Math.ceil(this.tableData[0].value/3*2)
          l = Math.ceil(this.tableData[0].value+0.1)
          this.chart.scale('value', {
            min: 0,
            max: l,
            tickInterval: 1,
            nice: false
          });

          this.chart.axis('1', false);
          this.chart.axis('value', {
            zIndex: 2,
            line: null,
            label: {
              offset: -60,
              textStyle: {
                fontSize: 18,
                fill: '#CBCBCB',
                textAlign: 'center',
                textBaseline: 'middle'
              }
            },
            tickLine: {
              length: -44,
              stroke: '#fff',
              strokeOpacity: 1
            },
            grid: null
          });
          this.chart.legend(false);
          this.chart.point().position('value*1').shape('pointer').color('value', function(val) {
            if (val < f) {
              return '#0086FA';
            } else if (val <= c) {
              return '#FFBF00';
            } else{
              return '#F5222D';
            }
          });
          const lineWidth = 45;
          this.chart.guide().clear();
          // 绘制仪表盘背景
          this.chart.guide().arc({
            zIndex: 0,
            top: false,
            start: [0, 0.92],
            end: [l, 0.92],
            style: { // 底灰色
              stroke: '#CBCBCB',
              lineWidth: lineWidth
            }
          });

          data[0].value >= f && this.chart.guide().arc({
            zIndex: 1,
            start: [0, 0.92],
            end: [data[0].value, 0.92],
            style: {
              stroke: '#0086FA',
              lineWidth: lineWidth
            }
          });

          data[0].value >= c && this.chart.guide().arc({
            zIndex: 1,
            start: [f, 0.92],
            end: [c, 0.92],
            style: {
              stroke: '#FFBF00',
              lineWidth: lineWidth
            }
          });

          data[0].value > c && data[0].value <= l && this.chart.guide().arc({
            zIndex: 1,
            start: [c, 0.92],
            end: [data[0].value, 0.92],
            style: {
              stroke: '#F5222D',
              lineWidth: lineWidth
            }
          });

          data[0].value > f && data[0].value <= c && this.chart.guide().arc({
            zIndex: 1,
            start: [f, 0.92],
            end: [data[0].value, 0.92],
            style: {
              stroke: '#FFBF00',
              lineWidth: lineWidth
            }
          });

          data[0].value < f && this.chart.guide().arc({
            zIndex: 1,
            start: [0, 0.92],
            end: [data[0].value, 0.92],
            style: {
              stroke: '#0086FA',
              lineWidth: lineWidth
            }
          });

          // // 绘制指标数字
          // this.chart.guide().html({
          //   position: ['0%', '0%'],
          //   html: '<div style="width: 300px;text-align: center;">' + '<p style="font-size: 20px; color: #545454;margin: 0;">完成率</p>' + '<p style="font-size: 36px;color: #545454;margin: 0;">' + val * 10 + '%</p>' + '</div>'
          // });
          // this.chart.interaction('active-region');
          this.chart.changeData([{ value: data[0].value }])
          break;
        // 漏斗图
        case 'FunnelChart':
          this.chart.axis(false);
          this.chart.padding = [20, 120, 95]
          this.chart.tooltip({
            showTitle: false,
            showMarkers: false, // 去除顶点提示
            itemTpl:
              '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
              '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
              '{name}<br/>' +
              '<span style="padding-left: 16px;line-height: 16px;">浏览人数：{value}</span><br/>' +
              // '<span style="padding-left: 16px;line-height: 16px;">占比：{percent}</span><br/>' +
              '</li>',
          });
          this.chart.coordinate('rect').transpose().scale(1, -1);
          this.chart.interval().adjust('symmetric').position('type*percent').shape('funnel').color('type', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']).label('type*value', function(type, value) {
            return type + ' ' + value;
          }, {
            offset: 35,
            labelLine: {
              style: {
                lineWidth: 1,
                stroke: 'rgba(0, 0, 0, 0.15)',
              },
            }
          }).tooltip('type*value*percent', function(type, value, percent) {
            return {
              name: type,
              percent: parseInt(percent * 100) + '%',
              value: value
            };
          });
          this.chart.interaction('element-active');
          break;
        default: ;break;
      }

      this.chart.render();
    },
  },
  watch: {
    width: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.width = newVal
        this.init(this.data, newVal, this.height)
        this.$forceUpdate()
      }
    },
    height: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.height = newVal
        this.init(this.data, this.width, newVal)
        this.$forceUpdate()
      }
    },
    setting: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.init(this.data, this.width, this.height)
        this.$forceUpdate()
      }
    },
    tableData: {
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        this.init(this.getData(newVal), this.width, this.height)
        this.$forceUpdate()
      }
    }
  }
}
</script>
