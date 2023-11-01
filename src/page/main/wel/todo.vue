<template>
  <div class="todo-info">
    <div class="item-title-bar">
      <h4>{{item.displayTitle ? item.title : ''}}</h4>
      <p @click="viewAll"><span>查看全部</span><i class="el-icon-caret-right"></i></p>
    </div>
    <div class="todo-info-content">
      <ul>
        <li v-for="(item, index) in tableData" :key="item.processDefinitionName+index">
          <div>
            <h3>
              <span>【{{item.category}}】</span>
              <span>【{{item.name}}】</span>
            </h3>
            <span>{{item.created}}</span>
          </div>
          <div>
            <section>{{item.processInstanceName}}</section>
            <el-button type="text" @click="dealItem(item)">立即处理</el-button>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      append-to-body
      fullscreen
      :before-close="handleClose"
    >
      <taskForm
        :rowData="rowData"
        :taskFormType="taskFormType"
        @close="closeHandle"
      />
    </el-dialog>
  </div>
</template>
<script>
import {queryTaskList} from "@/api/wel"
import taskForm from './taskForm'
export default {
  name: 'todo-info',
  components: { taskForm },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          data: []
        }
      }
    }
  },
  data(){
    return {
      tableData: [],
      dialogVisible: false,
      rowData: {},
    }
  },
  methods: {
    // 查看全部
    viewAll () {
      this.$router.push({
        path: this.$router.$jvsRouter.getPath({
          name: '待办任务',
          src: '/flowable-ui/tasklist'
        })
      });
    },
    // 立即处理
    dealItem (row, type) {
      if (type) {
        this.taskFormType=type
      } else {
        this.taskFormType=""
      }
      this.rowData=row
      this.dialogVisible=true
    },
    getList () {
      let query={
        current: 1,
        size: 20,
        state: "running"
      }
      queryTaskList(query).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.data
        }
      })
    },
    handleClose () {
      this.dialogVisible=false
    },
    closeHandle (bool) {
      if (bool) {
        this.handleClose()
        this.getList()
      }
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.item-title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-left: 3px solid #409EFF;
  p, h4{
    margin: 0;
    padding: 0;
  }
  p{
    cursor: pointer;
  }
}
.todo-info-content{
  ul{
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    li{
      list-style: none;
      width: 49%;
      padding: 8px 15px;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      margin: 8px 1%;
      box-sizing: border-box;
      div{
        display: flex;
        justify-content: space-between;
        h3{
          margin: 0;
          font-weight: normal;
        }
        section{
          width: 80%;
        }
      }
      div:nth-of-type(1) {
        align-items: center;
      }
    }
    li:nth-of-type(2n+1) {
      margin-left: 0;
    }
    li:nth-of-type(2n) {
      margin-right: 0;
    }
  }
}
</style>