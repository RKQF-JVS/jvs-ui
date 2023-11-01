<template>
  <!-- 申请入口 -->
  <div class="flowable-entry">
<!--    <div class="top">-->
<!--      <div class="left">-->
<!--        <a href="https://thoughts.teambition.com/sharespace/6004466724da880046623ccc/docs/6007c01f3cf39100462f863c" target="_blank">-->
<!--          <img :src="img" alt="">-->
<!--        </a>-->
<!--      </div>-->
<!--    </div>-->
    <div class="list">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, key) in tableData"
          :key="key"
          :title="`${item.designGroup}(${getModelList(item.designGroup).length})`"
          :name="item.designGroup"
        >
          <div class="type-list">
            <div class="entry-item-card"  v-for="it in getModelList(item.designGroup)" :key="it.modelId" @click="applyHandle(it)">
              <!-- <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#'+it.icon"></use>
              </svg> -->
              <img v-if="it.icon" :src="it.icon" class="icon" alt="" >
              <span>{{it.name}}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      width="75%"
      :fullscreen="true"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <iframe
        :src="formUrl"
        class="apply-form-iframe"
        scrolling="auto"
        v-if="isOut"
      >
      </iframe>
      <showForm v-else :formUrl="formUrl" :approverList="approverList" @close="closeHandle"/>
    </el-dialog>
  </div>
</template>
<script>
import {entryList} from '../api/flowable'
import showForm from './componet/info'
import entryImg from '../styles/entry.png'
import {startProcess} from './componet/api'
export default {
  name: 'flowable-entry',
  components: {showForm},
  data () {
    return {
      activeNames: [],
      tableData: [],
      title: '',
      formUrl: '',
      dialogVisible: false,
      isOut: false,
      img: entryImg,
      currentItem: {},
      approverList: []
    }
  },
  methods: {
    getModelList(val) {
      const index = this.tableData.findIndex(item => {
        return item.designGroup === val
      })
      return this.tableData[index].flowDesigns
    },
    handleChange(val) {
      // console.log(val)
    },
    getList () {
      entryList().then(res => {
        if(res.data.code == 0) {
          this.tableData = res.data.data
          this.currentItem = this.tableData[0]
          this.tableData.forEach(item => {
            this.activeNames.push(item.designGroup)
          })
        }
      })
    },
    // 申请
    applyHandle (it) {
      this.title = it.name
      this.approverList = []
      if(it.formId) {
        this.formUrl = `/page-design-ui/#/form/info?id=${it.formId}&dataModelId=${it.dataModelId}&flowId=${it.id}`
        this.isOut = false
        if(it.manualNodes && it.manualNodes.length > 0) {
          for(let i in it.manualNodes) {
            // 发起人自选
            if(it.manualNodes[i].props && it.manualNodes[i].props.type == "SELF_SELECT" && (!it.manualNodes[i].props.targetObj.objs || it.manualNodes[i].props.targetObj.objs.length == 0)) {
              this.approverList.push({
                nodeId: it.manualNodes[i].id,
                nodeName: it.manualNodes[i].name,
                approvers: []
              })
            }
          }
        }
        this.dialogVisible = true
      }else{
        this.$confirm('确认启动流程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let temp = {
            id: it.id
          }
          startProcess(temp).then(res => {
            if(res.data && res.data.code == 0) {
              this.$message.success('启动成功')
            }
          })
        }).catch(() => {});
      }
    },
    // 关闭表单
    handleClose () {
      this.dialogVisible = false
      this.title = ""
    },
    closeHandle (bool) {
      if(bool) {
        this.handleClose()
      }
    },
    // 分类入口显示
    typeList (item) {
      // console.log(item)
      this.currentItem = item
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.flowable-entry{
  // background: #F8FAFF;
  background: #fff;
  padding: 20px 10px;
  padding-left: 27px;
  //height: calc(100vh - 15px);
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  .top{
    margin-top: 27px;
    .left{
      a{
        display: block;
        width: 450px;
      }
      img{
        display: block;
        width: 450px;
        height: 160px;
      }
    }
  }
  ::v-deep.list{
    h4{
      color: #333;
      font-size: 21px;
      line-height: 41px;
      height: 41px;
      margin: 10px 0;
      font-weight: normal;
    }
    .type-list{
      display: flex;
      flex-wrap: wrap;
    }
    .el-collapse{
      border: none;
      .el-collapse-item__arrow{
        margin-left: 4px;
      }
      .el-collapse-item__header{
        border: none;
      }
      .el-collapse-item__wrap{
        border: none;
      }
    }
  }
  .entry-item-card{
    position: relative;
    width: 210px;
    height: 68px;
    display: flex;
    align-items: center;
    background: #fff;
    box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.05);
    padding-right: 10px;
    margin-bottom: 40px;
    box-sizing: border-box;
    cursor: pointer;
    margin: 27px;
    margin-left: 0;
    margin-bottom: 0;
    .icon{
      width:30px;
      height:30px;
      margin-left: 10px;
    }
    i{
      font-size: 36px;
      margin-left: 10px;
      color: #FC723C;
    }
    span{
      font-size: 16px;
      margin-left: 20px;
      color: #333;
      word-break: keep-all;
      display: inline-block;
      width: 135px;
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
    }
  }
  .entry-item-card:hover{
    span{
      color: #3471FF;
    }
  }
}
.flowable-entry::-webkit-scrollbar{
  display: none;
}
.apply-form-iframe{
  border: 0;
  width: 100%;
  height: calc(100vh - 114px);
}
</style>
<style lang="scss">
.flowable-entry{
  .list{
    .type-title{
      font-size: 18px;
      color: #333;
      height: 42px;
      height: auto;
      line-height: 42px;
      .el-breadcrumb__inner{
        color: #333;
        cursor: pointer;
      }
      .el-breadcrumb__separator{
        font-weight: normal;
        color: #BFBFBF;
        margin: 0 20px;
      }
      .active{
        color: #3471FF;
      }
    }
  }
}
</style>
