<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    append-to-body
    top="12vh"
    :width="isRadio ? '360px' : '720px'"
    class="user-info-list-dialog"
  >
    <div class="user-info-list" :style="(isRadio || !isSingleTab) ? 'height: 420px;' : 'height: 460px;'" v-if="dialogVisible">
      <div :class="isSingleTab ? 'left dept-treeBox' : 'left dept-treeBox single-left'" :style="isRadio ? 'border-right: none' : ''">
        <el-tabs size="mini" v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane v-if="userEnable" label="人员" name="user">
            <el-input size="mini" style="width: 95%;" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入手机号或名字搜索" prefix-icon="el-icon-search"></el-input>
            <div v-if="userLoading" class="tree-loading-back"/>
            <div style="height: 330px;overflow: auto;margin-top: 10px;">
              <ul v-if="userList.length > 0" class="user-list-box userlist-box-tool">
                <li v-for="(item, index) in userList" :key="'check-user-'+index" @click="handleClickNode(item, 'user')">
                  <p>
                    <img v-if="item.headImg" :src="item.headImg" alt="">
                    {{item.realName || item.accountName}}
                  </p>
                </li>
              </ul>
              <div class="image-none" v-else>
                <img src="@/const/img/emptyImage.png" alt=""/>
                <span style="font-size: 12px; color: #a2a3a5;">抱歉，没有找到相关搜索内容！</span>
              </div>
            </div>
            <div class="pagination-box">
              <div v-if="userList.length > 0">
                <i class="el-icon-arrow-left page-icon" :style="page.current === 1 ? 'cursor: no-drop;' : ''" @click="lastPage"/>
                {{ page.current }}/{{ getAllPageNum() }}
                <i class="el-icon-arrow-right page-icon" :style="page.current === getAllPageNum() ? 'cursor: no-drop;' : ''" @click="nextPage"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="roleEnable" label="角色" name="role">
            <el-input size="mini" style="width: 95%;" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
            <div v-if="publicLoading" class="tree-loading-back"/>
            <div style="height: 360px;overflow: auto;margin-top: 10px;">
              <ul class="user-list-box userlist-box-tool">
                <li v-for="(item, index) in roleList" :key="'check-user-'+index" @click="handleClickNode(item, 'role')">
                  <p>
                    {{item.roleName}}
                  </p>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="deptEnable" label="部门" name="dept">
            <el-input size="mini" style="width: 95%;" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
            <div v-if="publicLoading" class="tree-loading-back"/>
            <div style="height: 360px;overflow: auto;margin-top: 10px;">
              <el-tree
                v-if="deptList.length > 0"
                class="filter-tree"
                size="mini"
                :data="deptList"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-click="handleDeptNodeClick"
                ref="tree">
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="jobEnable" label="岗位" name="job">
            <el-input size="mini" style="width: 95%;" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
            <div v-if="publicLoading" class="tree-loading-back"/>
            <div style="height: 360px;overflow: auto;margin-top: 10px;">
              <ul class="user-list-box userlist-box-tool">
                <li v-for="(item, index) in jobList" :key="'check-user-'+index" @click="handleClickNode(item, 'job')">
                  <p>
                    {{item.name}}
                  </p>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="groupEnable" label="群组" name="group">
            <el-input size="mini" style="width: 95%;" v-model="keyword" @input="searchUserHandle" clearable placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
            <div v-if="publicLoading" class="tree-loading-back"/>
            <div style="height: 360px;overflow: auto;margin-top: 10px;">
              <ul class="user-list-box userlist-box-tool">
                <li v-for="(item, index) in groupList" :key="'check-user-'+index" @click="handleClickNode(item, 'group')">
                  <p>
                    {{item.name}}
                  </p>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="!isRadio" style="width: 1px; background-color: #eee" />
      <div v-if="!isRadio" class="right">
        <div v-if="selectedLoading" class="tree-loading-back"/>
        <div class="right-header">
          <h4>已选：({{checkList.length}})</h4>
          <el-button style="color: #3471FF" type="text" @click="handleClear">清空</el-button>
        </div>
        <div :style="(isSingleTab ? 'height: 410px;' : 'height: 370px;') + 'overflow: auto;margin-top: 10px;'">
          <ul class="user-list-box">
            <li v-for="(item, index) in checkList" :key="'check-user-'+index">
              <p>
                <img v-if="item.headImg" :src="item.headImg" alt="">
                {{item.typeName ? '（' + item.typeName + '）' + item.name : item.name}}
              </p>
              <p>
                <i class="el-icon-error" @click="delCheck(item, index)"></i>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="!isRadio" class="footer-btn">
      <jvs-button size="mini" type="primary" :disabled="!isFinish" @click="submit">确定</jvs-button>
      <jvs-button size="mini" @click="cancel">取消</jvs-button>
    </div>
  </el-dialog>
</template>
<script>
import {getSelectedUsers, getUserListAll, getUserListPage, getUserTreeType} from "@/api/common";
export default {
  name: 'user-selector',
  props: {
    // 是否可选岗位
    jobEnable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否可选人员
    userEnable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否可选角色
    roleEnable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否可选部门
    deptEnable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否可选群组
    groupEnable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否是单选
    isRadio: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 当前选中tab
    currentActiveName: {
      type: String,
      default: () => {
        return 'user'
      }
    },
    // 弹框标题
    dialogTitle: {
      type: String,
      default: () => {
        return '人员选择'
      }
    }
  },
  computed: {
  },
  data () {
    return {
      isFinish: false, // 数据是否加载完成
      isSingleTab: false, // 是否单个tab
      userLoading: false,
      publicLoading: false,
      selectedLoading: false,
      activeName: '',
      dialogVisible: false,
      keyword: '', // 搜索关键词
      userOptionList: [],
      checkList: [], // 已选择节点
      userAll: [],
      userList: [],
      roleList: [],
      groupList: [],
      deptList: [],
      jobList: [],
      checkData: [], // 已选择数据
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      page: {
        size: 30,
        current: 1
      }
    }
  },
  async created() {
  },
  methods: {
    // 上一页
    lastPage() {
      if (this.page.current > 1) {
        this.page.current --
        this.getUserList()
      }
    },
    // 下一页
    nextPage() {
      if (this.page.current < this.getAllPageNum()) {
        this.page.current ++
        this.getUserList()
      }
    },
    // 获取总页数
    getAllPageNum() {
      let number = 0
      number = Math.ceil(this.page.total / this.page.size)
      return number
    },
    // 清空已选择数据
    handleClear() {
      this.checkList = []
      this.checkData = []
    },
    // 点击tree组件节点
    handleDeptNodeClick(data) {
      const obj = { id: data.id, name: data.name, typeName: '部门' }
      const dataObj = { id: data.id, name: data.name, type: 'dept' }
      const index = this.checkList.findIndex(item => {
        return item.id === data.id
      })
      if (this.isRadio) {
        this.checkList = [obj]
        this.checkData = [dataObj]
        this.submit()
      }
      if (index === -1) {
        this.checkList.push(obj)
        this.checkData.push(dataObj)
      } else {
        // this.$message.warning('请勿重复选择')
      }
    },
    // 属性数据搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击节点
    handleClickNode(node, type) {
      let name = ''
      let headImg = null
      let typeName = null
      if (type === 'user') {
        name = node.realName
        headImg = node.headImg
      }
      if (type === 'role') {
        name = node.roleName
        typeName = '角色'
      }
      if (type === 'job') {
        name = node.name
        typeName = '岗位'
      }
      if (type === 'group') {
        name = node.name
        typeName = '群组'
      }
      const obj = { id: node.id, name: name, headImg: headImg, typeName: typeName }
      const dataObj = { id: node.id, name: name, type: type }
      const index = this.checkList.findIndex(item => {
        return item.id === node.id
      })
      if (this.isRadio) {
        this.checkList = [obj]
        this.checkData = [dataObj]
        this.submit()
      }
      if (index === -1) {
        this.checkList.push(obj)
        this.checkData.push(dataObj)
      } else {
        // this.$message.warning('请勿重复选择')
      }
    },
    // tabs切换点击事件
    handleTabClick(tab, event) {
      this.keyword = ''
    },
    async openDialog (arr) {
      this.isFinish = false
      // await this.getAllUser()
      this.dialogVisible = true
      const list =  arr ? [...arr] : []
      const flagArr = [this.jobEnable, this.userEnable, this.roleEnable, this.deptEnable, this.groupEnable]
      let flagCount = 0
      flagArr.forEach(item => {
        if (item) {
          flagCount ++
        }
      })
      this.isSingleTab = flagCount > 1
      this.checkData = list
      this.activeName = this.currentActiveName
      await this.initCheckList(list)
      await this.getUserList()
      await this.getTreeData()
      this.isFinish = true
    },
    // 初始化已选数据
    initCheckList(arr) {
      const userIds = []
      let ulist = []
      arr.forEach(item => {
        if(item.realName) {
          ulist.push({id: item.id, name: item.realName, headImg: item.headImg})
        }
        if (item.type === 'user') {
          userIds.push(item.id)
          // const index = this.userAll.findIndex(temp => {
          //   return item.id === temp.id
          // })
          // if (index > -1) {
          //   this.checkList.push({ id: this.userAll[index].id, name: this.userAll[index].realName, headImg: this.userAll[index].headImg })
          // } else {
          //   this.checkList.push({ id: item.id, name: item.name })
          // }
        }
        if (typeof item === 'string') {
          userIds.push(item)
        }
        if (item.type === 'role') {
          this.checkList.push({ id: item.id, name: item.name, typeName: '角色' })
        }
        if (item.type === 'job') {
          this.checkList.push({ id: item.id, name: item.name, typeName: '岗位' })
        }
        if (item.type === 'dept' || item.type === 'branchOffice') {
          this.checkList.push({ id: item.id, name: item.name, typeName: '部门' })
        }
        if (item.type === 'group') {
          this.checkList.push({ id: item.id, name: item.name, typeName: '群组' })
        }
      })
      if (userIds.length > 0) {
        this.selectedLoading = true
        getSelectedUsers(userIds).then(res => {
          if (res.data && res.data.code == 0) {
            const tempArr = []
            res.data.data.forEach(user => {
              this.checkList.push({ id: user.id, name: user.realName, headImg: user.headImg })
              tempArr.push({ id: user.id, name: user.realName, type: 'user' })
              this.checkData = [...tempArr]
              this.selectedLoading = false
            })
          } else {
            this.selectedLoading = false
          }
        }).catch(err => {
          this.selectedLoading = false
        })
      }else{
        // 多选用户回显(ids查询数据)
        if(ulist && ulist.length > 0) {
          this.checkList = ulist
        }else{
          let olist = []
          arr.filter( item => {
            if (item.type === 'user') {
              olist.push({ id: item.id, name: item.name, typeName: '用户' })
            }
            if (item.type === 'role') {
              olist.push({ id: item.id, name: item.name, typeName: '角色' })
            }
            if (item.type === 'job') {
              olist.push({ id: item.id, name: item.name, typeName: '岗位' })
            }
            if (item.type === 'dept' || item.type === 'branchOffice') {
              olist.push({ id: item.id, name: item.name, typeName: '部门' })
            }
            if (item.type === 'group') {
              olist.push({ id: item.id, name: item.name, typeName: '群组' })
            }
          })
          this.checkList = olist
        }
      }
    },
    // 关闭弹窗
    closeDialog () {
      this.dialogVisible = false
      this.keyword = ""
      this.userOptionList = []
      this.checkList = []
      this.checkData = []
      this.roleList = []
      this.jobList = []
      this.groupList = []
      this.deptList = []
      this.userList = []
    },
    // 提交数据
    submit () {
      const submitArr = [...this.checkData]
      this.$emit('submit', submitArr)
      this.closeDialog()
    },
    // 取消
    cancel () {
      this.$emit('cancel', true)
      this.closeDialog()
    },
    // 获取所有用户
    getAllUser() {
      getUserListAll().then(res => {
        if (res.data && res.data.code == 0 && res.data.data) {
          this.userAll = [...res.data.data]
        }
      })
    },
    // 分页获取用户列表
    getUserList () {
      this.userLoading = true
      const params = {
        key: this.keyword,
        size: this.page.size,
        current: this.page.current
      }
      getUserListPage(params).then(res => {
        if (res.data && res.data.code == 0) {
          // console.log(res.data.data)
          this.userList = res.data.data ? [...res.data.data.records] : []
          this.page.total = res.data.data.total
          this.userLoading = false
        } else {
          this.userLoading = false
        }
      }).catch(err => {
        this.userLoading = false
      })
    },
    // 获取部门人员树
    async getTreeData () {
      this.publicLoading = true
      const params = {
        value: this.keyword,
        type: this.activeName
      }
      await getUserTreeType(params).then(res => {
        if (res.data && res.data.code == 0) {
          // this.userList = [...res.data.data.users]
          this.roleList = [...res.data.data.roles]
          this.jobList = [...res.data.data.jobs]
          this.groupList = [...res.data.data.groups]
          this.deptList = [...res.data.data.depts]
          this.publicLoading = false
        } else {
          this.publicLoading = false
        }
      }).catch(err => {
        this.publicLoading = false
      })
    },
    // 搜索成员
    searchUserHandle () {
      if (this.activeName === 'user') {
        this.page.current = 1
        this.getUserList()
      } else {
        this.getTreeData()
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
      this.checkData.splice(index, 1)
      for(let i in this.userOptionList) {
        let tix = this.isInArr('id', this.userOptionList[i].id, this.checkList)
        if(tix == -1) {
          this.userOptionList[i].checked = false
        }
      }
    },
  },
}
</script>
<style lang='scss' scoped>
.user-info-list-dialog{
  .filter-tree{
    .el-tree-node__label{
      font-size: 12px;
    }
  }
  .el-dialog{
    .el-dialog__header::after {
      display: none;
    }
    .el-dialog__body{
      padding-top: 10px;
      .user-info-list{
        //height: 460px;
        display: flex;
        justify-content: space-between;
        .left, .right{
          position: relative;
          box-sizing: border-box;
          .right-header{
            display: flex;
            justify-content: space-between;
            h4{
              font-size: 12px;
            }
          }
          .pagination-box{
            margin-top: 16px;
            height: 20px;
            display: flex;
            justify-content: right;
            align-items: center;
            .page-icon{
              cursor: pointer;
              padding: 0 6px;
            }
            span {
              font-size: 12px;
            }
          }
          .image-none{
            margin-top: 60px;
            text-align: center;
            img{
              width: 100%;
              margin-bottom: 20px;
            }
          }
          .tree-loading-back{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            background-image: url('../../../public/jvs-ui-public/img/loading.gif');
            background-repeat: no-repeat;
            background-position: center;
            background-position: center;
            background-size: 200px 160px;
          }
          .user-list-box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            li{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px;
              margin-right: 10px;
              p{
                font-size: 12px;
                color: #333333;
                display: flex;
                align-items: center;
                margin: 0;
                img{
                  margin-right: 10px;
                  display: block;
                  width: 16px;
                  height: 16px;
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
        /deep/.left{
          //height: 420px;
          width: 360px;
          box-sizing: border-box;
          //border-right: 1px solid #eee;
          .el-input__suffix{
            .el-input__icon.el-input__validateIcon{
              display: none;
            }
          }
          .el-tabs__item{
            padding: 0 8px;
            font-weight: bold;
          }
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
        /deep/.single-left{
          .el-tabs__nav-scroll{
            display: none;
          }
        }
        .right{
          padding-left: 20px;
          box-sizing: border-box;
          width: 360px;
          h4{
            font-size: 14px;
            color: #868BA1;
            font-weight: normal;
            margin: 10px 0;
          }
          .user-list-box{
          }
        }
      }
      .footer-btn{
        margin-top:20px;
        text-align: center;
      }
    }
  }
}
/deep/.left {
  .el-tabs__item.is-active{
    color: #3471FF;
  }
  .el-tabs__active-bar{
    background-color: #3471ff;
  }
  .el-tabs__nav-wrap::after{
    display: none;
  }
}
</style>
