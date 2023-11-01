<template>
  <div class="demo">
    <basic-container>
      <div class="demo-item">
        <h3>表格案例</h3>
        <!-- 表格 -->
        <jvs-table
          refs="multipleTable"
          :data="tableData"
          tooltipEffect="dark"
          style="width: 100%"
          :showHeader="false"
          :loading="tableLoading"
          :option="option"
          :formData="queryParams"
          :defalutFormData="queryParams"
          :index="true"
          @on-load="getList"
          @search-change="searchChange"
        >
          <!-- 顶部左侧插槽 -->
          <template slot="menuLeft">
            <span>顶部左侧插槽</span>
          </template>
          <!-- 顶部右侧插槽 -->
          <template slot="menuRight">
            <span>顶部右侧插槽</span>
          </template>
          <!-- 操作栏插槽 -->
          <template slot="menu" slot-scope="scope">
            <el-button @click="handleClick1(scope.row)">操作栏插槽</el-button>
          </template>
          <!-- 分页左侧插槽 -->
          <template slot="menuLeftBottom">
            <span>分页左侧插槽</span>
          </template>
        </jvs-table>
      </div>
      <div class="demo-item">
        <h3>表单案例</h3>
        <!-- 表单 -->
        <!-- 基础表单 -->
        <h4>一、基础表单</h4>
        <jvs-form :formData="formDemo" :defalutFormData="formDemo" :option="formOption">
          <template slot="myslotForm">
            <h3>表单项插槽</h3>
          </template>
        </jvs-form>
        <!-- 多级表单 -->
        <h4>二、多级表单</h4>
        <jvs-form-level :option="levelFormOption">
        </jvs-form-level>
        <!-- 步骤表单 -->
        <h4>三、步骤表单</h4>
        <jvs-form-step :option="stepFormOption">
        </jvs-form-step>
      </div>
      <div class="demo-item">
        <h3>tab页</h3>
        <jvs-tab :active="activeName" :option="tabOption" @tab-click="handleClick">
          <template slot="first">
            <span>插槽1</span>
          </template>
          <template slot="second">
            <span>插槽2</span>
          </template>
        </jvs-tab>
      </div>
      <div class="demo-item">
        <h3>按钮button</h3>
        <jvs-button size="mini" permisionFlag="ddd" @click="clickHandle">size=mini</jvs-button>
        <jvs-button type="primary">type=primary</jvs-button>
        <jvs-button :plain="true">plain=true</jvs-button>
        <jvs-button round>round=true</jvs-button>
        <jvs-button circle>circle=true</jvs-button>
        <jvs-button loading>loading=true</jvs-button>
        <jvs-button disabled>disabled=true</jvs-button>
        <jvs-button icon="el-icon-star-on">icon</jvs-button>
        <jvs-button :autofocus="false">autofocus=false</jvs-button>
        <jvs-button nativeType="submit">nativeType=submit </jvs-button>
        <jvs-button permisionFlag="btnpermision" defaultText="按钮" @click="clickHandle"></jvs-button>
      </div>
    </basic-container>
  </div>
</template>
<script>
import {tableOption} from './table/option'
import {formOption} from './form/option'
import {tabOption} from './tab/option'
import {levelFromOption} from './levelForm/option'
import {stepFormOption} from './stepForm/option'
export default {
  name: "demo-box",
  data () {
    return {
      queryParams: {},
      tableData: [
        {
          title: '很长的标题很长的标题很长的标题很长的标题很长的标题很长的标题很长的标题很长的标题',
          content: '很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容',
          status: 0,
          createTime: '2002-09-22 09:00:00'
        },
        {
          title: 'jkjkjkjkkjkjk就将计就计',
          content: '坚决打击洒家打开几十块的艰苦艰苦艰苦就开机开卷考就看',
          status: 0,
          createTime: '2002-09-22 09:00:00'
        },
        {
          title: '好的撒娇活动时间很多撒娇的环境撒谎的看很快就 的课件撒',
          content: '大撒大撒绝对路径萨拉丁就了解历史就是垃圾的撒娇吉萨记录记录',
          status: 0,
          createTime: '2002-09-22 09:00:00'
        }
      ],
      tableLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      option: tableOption,
      formDemo: {
        link: 'https://www.baidu.com/'
      },
      formOption: formOption,
      activeName: 'first',
      tabOption: tabOption,
      levelFormOption: levelFromOption, // 多级表单配置
      stepFormOption: stepFormOption, // 步骤表单配置
    };
  },
  filters: {},
  created () {},
  mounted () {},
  computed: {},
  methods: {
    //   获取数据
    getList (page) {
    },
    /**
     * 搜索回调
     */
    searchChange (form) {
      this.queryParams = form
      this.getList()
    },
    // 选项卡切换
    handleClick (tab) {
      this.activeName = tab
    },
    // 点击按钮
    clickHandle () {
      console.log('点击事件')
    },
    // handleClick1
    handleClick1 (row) {
      console.log(row)
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-item{
  padding: 10px 20px;
  border: 1px solid #eee;
  margin: 20px 0;
}
</style>
