<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <div class="demo-item">
        <h5>基础表格</h5>
        <span>基础的表格展示用法</span>
        <div class="show">
          <jvs-table pageheadertitle="示例表格" :option="option1" :data="dataDemo"></jvs-table>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-table pageheadertitle="示例表格" :option="option" :data="tableData"></jvs-table>
            option: {
              column: [
                {
                  label: "日期",
                  prop: "date"
                },
                {
                  label: "姓名",
                  prop: "name"
                },
                {
                  label: "地址",
                  prop: "address"
                }
              ]
            }
            tableData: [
              {
                date: "2016-05-02",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
              },
              {
                date: "2016-05-04",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1517 弄"
              },
              {
                date: "016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1519 弄"
              },
              {
                date: "2016-05-03",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1516 弄"
              }
            ]
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>表格分页</h5>
        <span>表格数据分页展示</span>
        <div class="show">
          <jvs-table pageheadertitle="分页表格" :option="option2" :data="dataDemo" :page="page"></jvs-table>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-table pageheadertitle="分页表格" :option="option" :data="tableData" :page="page"></jvs-table>

            page: {
              total: 4, // 总页数
              currentPage: 1, // 当前页数
              pageSize: 20, // 每页显示多少条
              pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
              layout: "total, sizes, prev, pager, next, jumper", // 分页工具
            },
            option: {
              page: true,
              column: [
                {
                  label: "日期",
                  prop: "date"
                },
                {
                  label: "姓名",
                  prop: "name"
                },
                {
                  label: "地址",
                  prop: "address"
                }
              ]
            }
            tableData: [
              {
                date: "2016-05-02",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
              },
              {
                date: "2016-05-04",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1517 弄"
              },
              {
                date: "016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1519 弄"
              },
              {
                date: "2016-05-03",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1516 弄"
              }
            ]
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>表格插槽</h5>
        <span>自定义表格部分位置内容</span>
        <div class="show">
          <jvs-table pageheadertitle="插槽表格" :option="option3" :data="dataDemo">
            <!-- 表格顶部, 在left和right之上 -->
            <template slot="headerTop">
              <span>表格顶部插槽</span>
            </template>

            <!-- 表格顶部左侧 -->
            <template slot="menuLeft" scope="scope">
              <span>顶部左侧插槽</span>
            </template>

            <!-- 表格顶部右侧 -->
            <template slot="menuRight" scope="scope">
              <span>顶部右侧插槽</span>
            </template>

            <!-- 行数据插槽 -->
            <template slot="name" scope="scope">
              <span>name插槽--scope.row.name: {{scope.row.name}}</span>
            </template>

            <!-- 操作栏 -->
            <template slot="menu" scope="scope">
              <span>操作栏插槽</span>
            </template>

            <!-- 分页左侧 仅分页时显示 -->
            <template slot="menuLeftBottom" scope="scope">
              <span>分页左侧插槽</span>
            </template>
          </jvs-table>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-table pageheadertitle="插槽表格" :option="option" :data="tableData">
              <!-- 表格顶部, 在left和right之上 -->
              <template slot="headerTop">
                <span>表格顶部插槽</span>
              </template>

              <!-- 表格顶部左侧 -->
              <template slot="menuLeft" scope="scope">
                <span>顶部左侧插槽</span>
              </template>

              <!-- 表格顶部右侧 -->
              <template slot="menuRight" scope="scope">
                <span>顶部右侧插槽</span>
              </template>

              <!-- 行数据插槽 -->
              <template slot="name" scope="scope">
                <span>name插槽--scope.row.name: {{scope.row.name}}</span>
              </template>

              <!-- 操作栏 -->
              <template slot="menu" scope="scope">
                <span>操作栏插槽</span>
              </template>

              <!-- 分页左侧 -->
              <template slot="menuLeftBottom" scope="scope">
                <span>分页左侧插槽</span>
              </template>
            </jvs-table>
            option: {
              column: [
                {
                  label: "日期",
                  prop: "date"
                },
                {
                  label: "姓名",
                  prop: "name",
                  slot: true, // true时开启插槽
                },
                {
                  label: "地址",
                  prop: "address"
                }
              ]
            }
            tableData: [
              {
                date: "2016-05-02",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
              },
              {
                date: "2016-05-04",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1517 弄"
              },
              {
                date: "016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1519 弄"
              },
              {
                date: "2016-05-03",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1516 弄"
              }
            ]
          `'>
          </codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="表格属性" :option="param" :data="paramData"></jvs-table>
      <jvs-table pageheadertitle="配置项" :option="param" :data="optionData"></jvs-table>
      <jvs-table pageheadertitle="列项参数配置" :option="param" :data="columnData"></jvs-table>
      <jvs-table pageheadertitle="事件说明" :option="event" :data="eventData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {list, columnTemp, tableParam, option_data, column_item, event_data} from './data'
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'Table',
  data () {
    return {
      detail: {
        title: 'Table 表格',
        info: '用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作',
        useInfo: '<jvs-table></jvs-table>'
      },
      dataDemo: list,
      option1: {
        column: columnTemp
      },
      page: {
        total: 4, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper", // 分页工具
      },
      option2: {
        page: true,
        column: columnTemp
      },
      option3: {
        column: [
          {
            label: "日期",
            prop: "date",
          },
          {
            label: "姓名",
            prop: "name",
            slot: true
          },
          {
            label: "地址",
            prop: "address"
          }
        ]
      },
      // 参数
      param: paramOption,
      paramData: tableParam,
      optionData: option_data,
      columnData: column_item,
      event: eventOption,
      eventData: event_data,
    }
  }
}
</script>
<style lang="scss" scoped>

</style>