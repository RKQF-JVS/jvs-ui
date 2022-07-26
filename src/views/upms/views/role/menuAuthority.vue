<template>
  <div>
    <el-dialog
      :visible.sync="menuAuthVisible"
      :before-close="handleClose"
      :fullscreen="true"
      append-to-body
      title="权限分配"
      class="transverseTreeDialog"
    >
      <!-- 应用终端 -->
      <div class="application-list">
        <jvs-button v-for="item in terminalList" :type="item.id == currentTerminal ? 'primary' : ''" :key="item.name" @click="activeHandle(item)">{{item.name}}</jvs-button>
        <p class="divider-line"></p>
      </div>
      <div class="menu-checkbox">
        <el-checkbox-group id="menuGroup" v-model="checkList">
          <el-checkbox class="checkbox-text" v-for="(item, key) in funOption" :key="key" :label="item.id" @change="handleCheckMenu(item)">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="menu-auth-box" :style="`height: calc(100% - 188px - ${String(menuGroupHeight)}px)`">
        <div class="left-part">
          <div v-for="(item, key) in menuList" :key="key" :class="{'left-part-item ': true, 'is-current': (rowId.id == item.id)}" @click="nodeClick(item)">
<!--            <el-checkbox v-model="item.checked" @change="nodeClick(item)"></el-checkbox>-->
            <div style="margin-left: 8px; font-size: 16px">{{item.name}}</div>
          </div>
        </div>
        <div style="width: 1px;height: 100%;background-color: #DCDFE6"/>
        <div class="right-part">
          <el-collapse v-model="activeNames">
            <div class="right-part-submenu" v-for="(item, key) in subMenuList" :key="key">
              <el-checkbox-group v-model="checkList">
                <el-checkbox class="submenu-check-all" :label="item.id" @change="subMenuCheck(item)">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <el-collapse-item :title="item.name" :name="item.id">
                <div class="three-level-menu">
                  <div v-for="(menuItem, key) in (item.children || [])" :key="key">
                    <div class="menu-item">
                      <el-checkbox-group style="margin-right: 80px" v-model="checkList">
                        <el-checkbox :label="menuItem.id" @change="menuItemCheck(menuItem)">{{ menuItem.name }}</el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group v-model="checkList">
                        <el-checkbox
                          :label="btnItem.id"
                          v-for="(btnItem, key) in (menuItem.extend || [])"
                          :key="key"
                          style="width: 100px"
                          @change="btnItemCheck(btnItem)"
                        >{{ btnItem.name }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>
      </div>
      <el-row style="display: flex;align-items: center;justify-content: center;background: #fff;padding:10px 0;">
        <el-button size="mini" type="primary" @click="saveHandle">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {bindMenuAuth, getAllMenu, getMenuAuth} from "./api";

export default {
  name: "menuAuthority",
  props: {
    menuAuthVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    terminalList: {
      type: Array,
      default: () => {
        return {}
      }
    },
    funOption: {
      type: Array,
      default: () => {
        return {}
      }
    },
    menuAuthList: {
      type: Array,
      default: () => {
        return {}
      }
    },
    applicationList: {
      type: Array,
      default: () => {
        return {}
      }
    },
    currentTerminal: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  watch: {
    currentTerminal (val) {
      this.menuAuthListTemp = [...this.menuAuthList]
      this.initAuth([...this.funOption])
    },
    menuAuthVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.initAuth([...this.funOption])
          this.menuGroupHeight = document.getElementById('menuGroup').clientHeight
        })
      }
    }
  },
  data () {
    return {
      checked: false,
      rowId: {},
      menuList: [],
      checkList: [],
      subMenuList: [],
      threeLevelMenuList: [],
      menuAuthListTemp: [],
      activeNames: [],
      arrTemp: [],
      menuGroupHeight: 0
    }
  },
  methods: {
    // 根据权限列表勾选权限
    initAuth(arry) {
      const list = []
      const arr = []
      this.menuAuthList.forEach(item => {
        list.push(item.permissionId)
        const index = arry.findIndex(obj => {
          return obj.id === item.permissionId
        })
        if (index !== -1) {
          arr.push(arry[index])
        }
      })
      this.checkList = [...list]
      this.menuList = [...arr]
    },
    // 二级菜单 check
    subMenuCheck(obj) {
      const index = this.activeNames.findIndex(item => {
        return item === obj.id
      })
      if (index === -1) {
        this.activeNames.push(obj.id)
      }
      this.setCheckStatus(obj)
      this.$forceUpdate()
    },
    // 设置check框状态
    setCheckStatus(obj) {
      if (obj.extend) {
        obj.extend.forEach(item => {
          item.checked = obj.checked
        })
      }
      if (obj.children) {
        obj.children.forEach(item => {
          item.checked = obj.checked
          if (item.extend) {
            this.setCheckStatus(item)
          }
        })
      }
    },
    // 一级菜单check框选择
    handleCheckMenu(obj) {
      if (!obj.checked) {
        const objTemp = {
          permissionId: obj.id,
          roleId: this.rowData.id,
          type: 'menu'
        }
        this.menuAuthListTemp.push(objTemp)
      } else {
        const index = this.menuAuthListTemp.findIndex(item => {
          return item.permissionId === obj.id
        })
        if (index !== -1) {
          this.menuAuthListTemp.splice(index, 1)
        }
      }
      if (obj.checked && obj.id === this.rowId.id) {
        this.subMenuList = []
        this.rowId = {}
      }
      const arr = [...this.checkList]
      const arrTemp = [...this.funOption]
      arrTemp.forEach((item, key) => {
        const index = arr.findIndex(temp => {
          return temp === item.id
        })
        item.checked = index !== -1
      })
      const menuList = arrTemp.filter(item => {
        return item.checked
      })
      this.menuList = [...menuList]
    },
    // 按钮权限 check
    btnItemCheck(obj) {
      this.$forceUpdate()
    },
    // 三级菜单 check
    menuItemCheck(obj) {
      if (obj.extend.length > 0 && obj.checked) {
        obj.extend.forEach(item => {
          item.checked = true
        })
      } else {
        obj.extend.forEach(item => {
          item.checked = false
        })
      }
      this.$forceUpdate()
    },
    // 二级菜单 check
    submenuClick(row) {
    },
    // 一级菜单 click
    nodeClick(row) {
      this.rowId = row
      this.subMenuList = row.children || []
      this.$forceUpdate()
    },
    // getList() {
    //   getMenuAuth(this.rowData.id).then(res => {
    //     if (res.data && res.data.code == 0) {
    //     }
    //   })
    //   getAllMenu().then(res => {
    //     if (res.data && res.data.code==0) {
    //       this.applicationList = [...res.data.data]
    //       this.terminalList = [...res.data.data]
    //       this.currentTerminal = this.terminalList[0].id
    //     }
    //   })
    // },
    // 切换终端
    async activeHandle (obj) {
      await this.$emit('activeHandle', obj)
      this.menuGroupHeight = document.getElementById('menuGroup').clientHeight
      // console.log(this.funOption)
      const index = this.funOption.findIndex(item => {
        return this.rowId.id === item.id
      })
      this.subMenuList = []
      const arrTemp = [...this.funOption]
      const menuList = arrTemp.filter(item => {
        return item.checked
      })
      this.menuList = [...menuList]
      this.subMenuList = index !== -1 ? (this.rowId.children || []) : []
      // this.subMenuList = this.funOption[index].children
    },
    handleClose() {
      this.$emit('handleClose')
    },
    // 生成已勾选权限列表
    getSubmitAuthList(arr, arrTemp) {
      arr.forEach(item => {
        const index1 = this.checkList.findIndex(obj => {
          return obj === item.id
        })
        if (index1 !== -1) {
          const obj = {
            permissionId: item.id,
            roleId: this.rowData.id,
            type: item.type ? item.type : 'menu'
          }
          arrTemp.push(obj)
        }
        if (item.children) {
          this.getSubmitAuthList(item.children, arrTemp)
        }
        if (item.extend && item.children === undefined) {
          this.getSubmitAuthList(item.extend, arrTemp)
        }
      })
      this.menuAuthListTemp = [...this.arrTemp]
    },
    // 提交数据
    saveHandle() {
      this.arrTemp = []
      this.applicationList.forEach(item => {
        this.getSubmitAuthList(item.children, this.arrTemp)
      })
      const arr = [...this.arrTemp]
      bindMenuAuth(arr, this.rowData.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('操作成功！')
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
//@import url(); 引入公共css类
.menu-auth-box {
  //height: calc(100% - 208px);
  overflow: hidden;
  //overflow-y: auto;
  background: #fff;
  display: flex;
  padding: 0 20px;
  .left-part{
    overflow-y: auto;
    padding: 20px 0;
    width: 15%;
    .left-part-item{
      display: flex;
      align-items: center;
      padding: 10px;
    }:hover{
    cursor: pointer;
         }
    .is-current{
      background-color: #EFF2F7;
    }
  }
  ::v-deep.right-part{
    overflow-y: auto;
    padding: 20px;
    width: 85%;
    .el-collapse{
      border: none;
    }
    .right-part-submenu{
      position: relative;
      .submenu-check-all{
        position: absolute;
        left: 10px;
        top: 10px;
        .el-checkbox__label{
          color: #606266;
        }
      }
      .el-collapse-item__wrap{
        border: none;
      }
      .el-collapse-item__header{
        display: flex!important;
        height: 40px;
        border: none;
        color: #f6f6f6;
        background-color: #F6F6F6;
        padding: 0 30px;
      }
      .submenu{
        background-color: #F6F6F6;
        font-size: 16px;
        padding: 10px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
      }
      .three-level-menu{
        padding: 20px 10px;
        .menu-item{
          display: flex;
          padding: 5px 0;
          .el-checkbox__label{
            color: #606266;
          }
          //.button-check-list{
          //  margin-left: 80px;
          //  .el-checkbox{
          //    margin-bottom: 8px;
          //    width: 8vw;
          //  }
          //}
        }
      }
    }
  }
}
.menu-checkbox{
  background-color: #FFFFFF;
  padding: 10px 20px 6px 20px;
  ::v-deep.checkbox-text{
    .el-checkbox__label{
      color: #606266;
    }
  }
  .el-checkbox{
    margin-bottom: 8px;
    //width: 6vw;
  }
}
.application-list{
  padding: 20px;
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  .el-button{
    border-color: transparent;
    background: #F3F3F3;
    color: #333333;
    margin-left: 20px;
  }
  .el-button:nth-of-type(1){
    margin-left: 0;
  }
  .el-button--primary{
    background: #3471FF;
    color: #fff;
  }
  .divider-line{
    position: absolute;
    width: calc(100% - 40px);
    border-bottom: 1px solid #DCDFE6;
    bottom: 0;
    left: 20px;
    margin: 0;
  }
}
</style>
