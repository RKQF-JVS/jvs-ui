<template>
  <div class="project-page">
    <jvs-form :option="formOption" :formData="formData" @submit="handleQuery"></jvs-form>
    <div class="project-type">
      <el-radio-group v-model="queryParams.type" @change="handleOnChange" size="mini">
        <el-radio-button v-for="(item, key) in projectTypeList" :key="key" :label="item"></el-radio-button>
      </el-radio-group>
    </div>
    <div id="project-list" class="project-list">
      <div class="project-item" v-for="(item, key) in projectList" :key="key" @click="handleClick(item)">
        <img :src="item.logo" alt=""/>
        <div class="item-content">
          <div class="item-title">{{ item.name }}</div>
          <div class="item-description">{{ item.description }}</div>
          <el-tag size="small">{{ item.type }}</el-tag>
          <span style="margin-left:10px;font-size:12px;">{{item.online ? '线上' : '本地'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getProjectType, pageList, templateList} from "../api";

export default {
  name: "projectDialog",
  data () {
    return {
      formData: {},
      formOption: {
        inline: false,
        isSearch: true,
        submitBtnText: '查询',
        labelWidth: 'auto',
        cancal: false,
        column: [
          {
            label: "名称",
            prop: "name",
            span: 4
          }
        ]
      },
      queryParams: {
        type: '全部'
      },
      isMore: false,
      projectList: [
      ],
      projectTypeList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
    }
  },
  created() {
    this.getProjectList()
    this.getProjectTypeList()
  },
  mounted() {
    const el = document.getElementById('project-list');
    const offsetHeight = el.offsetHeight;
    el.onscroll = (e) => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      if ((offsetHeight + scrollTop) === scrollHeight) {
        if (this.isMore) {
          this.page.currentPage ++
          this.getMoreData()
        } else {
          this.page.currentPage = 1
        }
      }
    };
  },
  methods: {
    handleQuery(form) {
      this.page.currentPage = 1
      this.queryParams.name = form.name
      this.getProjectList()
    },
    handleOnChange(e) {
      this.page.currentPage = 1
      this.queryParams.type = e
      this.getProjectList()
    },
    getProjectTypeList() {
      getProjectType().then(res => {
        if (res.data && res.data.code == 0) {
          this.projectTypeList = res.data.data.map(item => {
            return item.value
          })
          this.projectTypeList.unshift('全部')
        }
      })
    },
    handleClick(obj) {
      // console.log(obj)
      this.$emit('addByTemplate', obj)
    },
    getProjectList() {
      templateList().then(res => {
        if (res.data.code == 0) {
          this.projectList = [...res.data.data.localList, ...res.data.data.onlineList]
          // this.page.currentPage = res.data.data.current
          // this.page.total = res.data.data.total
          this.isMore = this.projectList.length !== 0
        }
      })
    },
    getMoreData() {
      const arr = [...this.projectList]
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      if (this.queryParams.type === '全部') {
        this.queryParams.type = undefined
      }
      templateList(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code == 0) {
          this.projectList = arr.concat(res.data.data.records)
          this.page.currentPage = res.data.data.current
          this.page.total = res.data.data.total
          this.isMore = res.data.data.records.length !== 0
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/.project-page{
  .form-item-btn{
    width: auto;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #3e78fd;
    border-color: #3e78fd;
  }
  overflow: hidden;
  height: calc(100vh - 120px);
  .project-list{
    max-height: calc(100vh - 180px);
    display: flex;
    box-sizing: border-box;
    align-items: center;
    flex-wrap: wrap;
    overflow-y: auto;
    .project-item{
      border-radius: 4px;
      overflow: hidden;
      width: 14vw;
      min-width: 260px;
      height: 14vw;
      min-height: 220px;
      box-shadow: 0 0 8px rgba(59, 59, 59, 0.1);
      margin: 16px;
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.3s;
      &:hover{
        transform: translateY(-5px);
        box-shadow: 0 2px 8px rgba(59, 59, 59, 0.1);
        transition: 0.3s;
      }
      img {
        width: 100%;
        height: 40%;
      }
      .item-content{
        height: 60%;
        padding: 16px;
        .item-title{
          color: #333333;
          font-size: 14px;
        }
        .item-description{
          color: #999999;
          font-size: 12px;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
