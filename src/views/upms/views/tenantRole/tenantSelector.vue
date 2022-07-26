<template>
  <el-dialog
    title="请选择租户"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    append-to-body
    width="780px"
    class="user-info-list-dialog"
  >
    <div class="user-info-list" v-if="dialogVisible">
      <div class="center">
        <ul class="userlist-box userlist-box-tool">
          <li v-for="(item, index) in userOptionList" :key="'check-user-'+index" @click="changeCheck(item, index)">
            <p>
              <img v-if="item.logo" :src="item.logo" alt="">
              <b>{{item.name}}</b>
            </p>
            <p class="check-tool">
              <span :class="{'el-checkbox': true, 'is-checked': item.checked}">
                <span :class="{'el-checkbox__input': true, 'is-checked': item.checked}">
                  <i class="el-checkbox__inner"></i>
                </span>
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div class="right">
        <h4>已选：{{checkList.length}}名租户</h4>
        <ul class="userlist-box">
          <li v-for="(item, index) in checkList" :key="'check-user-'+index">
            <p>
              <img :src="item.logo" alt="">
              <b>{{item.name}}</b>
            </p>
            <p>
              <i class="el-icon-error" @click="delCheck(item, index)"></i>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <el-row style="padding-top:20px;display:flex;justify-content:center;align-items:center;border-top: 1px solid #DCDFE6;">
      <jvs-button size="mini" type="primary" @click="submit">确定</jvs-button>
      <jvs-button size="mini" @click="cancel">取消</jvs-button>
    </el-row>
  </el-dialog>
</template>
<script>
import {getAllTenant} from "./api";
export default {
  name: 'tenant-selector',
  props: {
    autoClose: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      keyword: '', // 搜索关键词
      treeLoading: false,
      selectOneId: '',
      selectOneData: null,
      userOptionList: [],
      checkList: []
    }
  },
  created() {},
  methods: {
    async openDialog () {
      await getAllTenant().then(res => {
        if (res.data && res.data.code == 0) {
          // console.log(res.data.data)
          this.userOptionList = res.data.data
        }
      })
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.selectOneId = ""
      this.selectOneData = null
      this.keyword = ""
      this.userOptionList = []
      this.checkList = []
    },
    submit () {
      this.$emit('submit', this.checkList)
      if(this.autoClose) {
        this.closeDialog()
      }
    },
    cancel () {
      this.$emit('cancel', true)
      this.closeDialog()
    },
    // 已选成员
    getCheckList () {
      for(let i in this.userOptionList) {
        let index = this.isInArr('id', this.userOptionList[i].id, this.checkList)
        if(this.userOptionList[i].checked) {
          if(index == -1){
            this.checkList.push(this.userOptionList[i])
          }
        }else{
          if(index > -1){
            this.checkList.splice(index, 1)
          }
        }
      }
    },
    // 判断是否已存在数组中,存在返回index
    isInArr (attr, val, list) {
      let index = -1
      for(let i in list) {
        if(list[i][attr] == val) {
          index = i
        }
      }
      return index
    },
    // 删除已选成员
    delCheck (item, index) {
      this.checkList.splice(index, 1)
      for(let i in this.userOptionList) {
        let tix = this.isInArr('id', this.userOptionList[i].id, this.checkList)
        if(tix == -1) {
          this.userOptionList[i].checked = false
        }
      }
    },
    // 其他信息选择
    changeCheck (item, index) {
      if(!this.selectable) {
        for(let i in this.userOptionList) {
          this.userOptionList[i].checked = false
        }
      }
      let bool = item.checked || false
      this.$set(this.userOptionList[index], 'checked', !bool)
      this.getCheckList()
    }
  },
}
</script>
<style lang='scss' scoped>
.customize-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .customize-tree-node-label{
    display: inline-block;
    overflow: hidden;
    overflow-x: auto;
  }
}
.treeBox {
  width: 250px;
  height: 58vh;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.treeBox::-webkit-scrollbar{
  display: none;
}
</style>
<style lang="scss">
.user-info-list-dialog{
  .el-dialog{
    margin-top: 10vh!important;
    .el-dialog__body{
      padding: 0 20px;
      padding-bottom: 20px;
      .user-info-list{
        display: flex;
        .left, .center, .right{
          box-sizing: border-box;
          .userlist-box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            li{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              p{
                font-size: 14px;
                display: flex;
                align-items: center;
                margin: 0;
                img{
                  margin-right: 10px;
                  display: block;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  overflow: hidden;
                }
                b{
                  color: #333333;
                  margin-right: 25px;
                }
                span{
                  color: #868BA1;
                }
                i{
                  color: #DCDFE6;
                  font-size: 16px;
                  cursor: pointer;
                }
              }
            }
            li:hover{
              background: #f5f7fa;
            }
          }
          .userlist-box-tool{
            li{
              cursor: pointer;
              p{
                align-items: center;
              }
              .check-tool{
                margin-right: 10px;
                .el-checkbox{
                  .el-checkbox__inner{
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                  }
                  .el-checkbox__inner::after{
                    left: 5px;
                    top: 2px;
                  }
                }
              }
            }
          }
        }
        .left{
          width: 210px;
          box-sizing: border-box;
          padding-right: 20px;
          padding-top: 13px;
          .el-tree{
            width: 100%;
            height: 100%;
          }
          .el-tree-node.is-current{
            >.el-tree-node__content{
              background-color: #F5F7FA;
            }
          }
        }
        .center{
          width: 280px;
          padding: 0 20px;
          border-left: 1px solid #DCDFE6;
          border-right: 1px solid #DCDFE6;
          box-sizing: border-box;
          .search-tool{
            margin: 20px 0;
            .el-input__inner{
              width: 240px;
              height: 40px;
              border-radius: 40px;
              background: #F5F5F5;
              border: 0;
            }
          }
          .userlist-box{
            height: calc(58vh - 60px);
          }
        }
        .right{
          padding-left: 20px;
          box-sizing: border-box;
          width: 240px;
          h4{
            font-size: 14px;
            color: #868BA1;
            font-weight: normal;
            margin: 20px 0;
          }
          .userlist-box{
            height: calc(58vh - 48px);
          }
        }
      }
    }
  }
}
</style>
