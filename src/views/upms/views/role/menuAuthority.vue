<template>
  <el-dialog
    :visible.sync="menuAuthVisible"
    :before-close="handleClose"
    :fullscreen="true"
    append-to-body
    title="权限分配"
    class="menuAuthorityDialog"
    :close-on-click-modal="false"
  >
    <div class="application-list">
      <!-- 应用终端 -->
      <div class="terminal-check-box">
        <div class="terminal-title">应用模块</div>
        <div class="terminal-check-list" v-for="(item, key) in terminalList" :key="key" >
          <div class="terminal-node" @click="terminalClick(item)" :style="currentApp === item.name ? 'color: #3e78fd;' : ''">{{ item.name }}</div>
        </div>
      </div>
      <!-- 一级菜单 -->
      <div class="terminal-check-box">
        <div class="terminal-title">一级菜单</div>
        <el-checkbox
          v-if="menuList.length > 0"
          :indeterminate="isMenuIndeterminate"
          v-model="menuCheckAll"
          @change="handleMenuCheckAll(menuCheckAll, 'menu')"
        >全选</el-checkbox>
        <div class="terminal-check-list" v-for="(item, key) in menuList" :key="key" >
          <el-checkbox v-model="menuAuthListTemp" :label="item.id" @change="menuChange">{{ '' }}</el-checkbox>
          <div class="terminal-node" @click="menuClick(item)" :style="currentMenu === item.name ? 'color: #3e78fd;' : ''">{{ item.name }}</div>
        </div>
      </div>
      <!-- 菜单分组 -->
      <div class="terminal-check-box">
        <div class="terminal-title">菜单分组</div>
        <el-checkbox
          v-if="menuGroupList.length > 0"
          :indeterminate="isMenuGroupIndeterminate"
          v-model="menuGroupCheckAll"
          @change="handleMenuCheckAll(menuGroupCheckAll, 'menuGroup')"
        >全选</el-checkbox>
        <div class="terminal-check-list" v-for="(item, key) in menuGroupList" :key="key" >
          <el-checkbox v-model="menuAuthListTemp" :label="item.id" @change="menuGroupChange">{{ '' }}</el-checkbox>
          <div class="terminal-node" @click="menuGroupClick(item)" :style="currentMenuGroup === item.name ? 'color: #3e78fd;' : ''">{{ item.name }}</div>
        </div>
      </div>
      <!-- 功能模块 -->
      <div class="terminal-check-box">
        <div class="terminal-title">功能模块</div>
        <el-checkbox
          v-if="functionList.length > 0"
          :indeterminate="isFunctionIndeterminate"
          v-model="functionCheckAll"
          @change="handleMenuCheckAll(functionCheckAll, 'function')"
        >全选</el-checkbox>
        <div class="terminal-check-list" v-for="(item, key) in functionList" :key="key" >
          <el-checkbox v-model="menuAuthListTemp" :label="item.id" @change="functionChange">{{ '' }}</el-checkbox>
          <div class="terminal-node" @click="functionClick(item)" :style="currentFunction === item.name ? 'color: #3e78fd;' : ''">{{ item.name }}</div>
        </div>
      </div>
      <!-- 功能按钮 -->
      <div class="terminal-check-box">
        <div class="terminal-title">功能按钮</div>
        <el-checkbox
          v-if="functionButtonList.length > 0"
          :indeterminate="isFunctionButtonIndeterminate"
          v-model="functionButtonCheckAll"
          @change="handleMenuCheckAll(functionButtonCheckAll, 'functionButton')"
        >全选</el-checkbox>
        <div class="terminal-check-list" v-for="(item, key) in functionButtonList" :key="key" >
          <el-checkbox v-model="menuAuthListTemp" :label="item.id" @change="functionButtonChange">{{ '' }}</el-checkbox>
          <div class="terminal-node" @click="functionButtonClick(item)" :style="currentFunctionButton === item.name ? 'color: #3e78fd;' : ''">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="footer-button">
      <el-button size="mini" type="primary" @click="saveHandle">确 定</el-button>
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {bindMenuAuth, getAllMenu, getMenuAuth} from "./api";
import { difference } from 'lodash'

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
    menuAuthVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.menuAuthListTemp = [...this.menuAuthList].map(item => {
            return item.permissionId
          })
        })
      }
    }
  },
  data () {
    return {
      currentApp: '', // 当前点击的应用模块
      currentMenu: '', // 当前点击的一级菜单
      currentMenuGroup: '', // 当前点击的菜单分组
      currentFunction: '', // 当前点击的功能模块
      currentFunctionButton: '', // 当前点击的功能按钮
      menuCheckAll: false,
      isMenuIndeterminate: false,
      menuGroupCheckAll: false,
      isMenuGroupIndeterminate: false,
      functionCheckAll: false,
      isFunctionIndeterminate: false,
      functionButtonCheckAll: false,
      isFunctionButtonIndeterminate: false,
      checked: false,
      rowId: {},
      menuGroupList: [],
      menuGroupCheckList: [],
      functionButtonList: [],
      functionButtonCheckList: [],
      functionList: [],
      functionCheckList: [],
      menuList: [],
      menuCheckList: [],
      terminalCheckList: [],
      menuAuthListTemp: [],
      arrTemp: [],
    }
  },
  methods: {
    // 数组去重
    uniqueArr(arr) {
      return Array.from(new Set(arr))
    },
    // 数组合并
    concatArr(arr1, arr2) {
      const arr = arr1.concat(arr2)
      return this.uniqueArr(arr)
    },
    /**
     * 多选框 change 事件
     * @param {String} type 多选框类型 (menu: '一级菜单', menuGroup: '菜单分组', function: '功能模块', functionButton: '功能按钮')
     * @param {Array} checkList 多选框数据源
     * @param {Array} menuAuthListTemp 当前已选中的权限数据列表
     **/
    checkChange(type, checkList, menuAuthListTemp) {
      let count = 0
      checkList.forEach(item => {
        const index = menuAuthListTemp.findIndex(temp => {
          return item.id === temp
        })
        if (index > -1) {
          count ++
        }
      })
      let checkAll = false
      let isIndeterminate = false
      if (count === checkList.length) {
        checkAll = true
        isIndeterminate = false
      } else {
        checkAll = false
        isIndeterminate = count !== 0
      }
      switch (type) {
        case 'menu':
          this.menuCheckAll = checkAll;
          this.isMenuIndeterminate = isIndeterminate;
          break;
        case 'menuGroup':
          this.menuGroupCheckAll = checkAll;
          this.isMenuGroupIndeterminate = isIndeterminate;
          break;
        case 'function':
          this.functionCheckAll = checkAll;
          this.isFunctionIndeterminate = isIndeterminate;
          break;
        case 'functionButton':
          this.functionButtonCheckAll = checkAll;
          this.isFunctionButtonIndeterminate = isIndeterminate;
          break;
        default: break;
      }
    },
    // 获取全选/取消全选后的权限列表
    getNewAuthList(val, type, arr1, arr2) {
      arr1 = [...arr1].map(item => {
        return item.id
      })
      if (val) {
        this.menuAuthListTemp = [...this.concatArr(arr1, arr2)]
      } else {
        this.menuAuthListTemp = difference([...arr2], [...arr1])
      }
      },
    // 全选/取消全选
    handleMenuCheckAll(val, type) {
      let arr = []
      switch (type) {
        case 'menu':
          arr = this.menuList
          this.isMenuIndeterminate = false;
          break;
        case 'menuGroup':
          arr = this.menuGroupList
          this.isMenuGroupIndeterminate = false;
          break;
        case 'function':
          arr = this.functionList
          this.isFunctionIndeterminate = false;
          break;
        case 'functionButton':
          arr = this.functionButtonList
          this.isFunctionButtonIndeterminate = false;
          break;
        default: break;
      }
      this.getNewAuthList(val, type, arr, this.menuAuthListTemp)
    },
    // 功能按钮多选框 change 事件
    functionButtonChange() {
      this.checkChange('functionButton', this.functionButtonList, this.menuAuthListTemp)
    },
    // 功能按钮 node 点击
    functionButtonClick(data) {
      this.currentFunctionButton= data.name
    },
    // 功能模块多选框 change 事件
    functionChange() {
      this.checkChange('function', this.functionList, this.menuAuthListTemp)
    },
    // 功能模块 node 点击
    functionClick(data) {
      this.currentFunction = data.name
      this.functionButtonList = data.extend ? [...data.extend] : []
      this.checkChange('functionButton', this.functionButtonList, this.menuAuthListTemp)
      this.currentFunctionButton = ''
    },
    // 菜单分组多选框 change 事件
    menuGroupChange() {
      this.checkChange('menuGroup', this.menuGroupList, this.menuAuthListTemp)
    },
    // 菜单分组 node 点击
    menuGroupClick(data) {
      this.currentMenuGroup = data.name
      this.functionList = data.children ? [...data.children] : []
      this.checkChange('function', this.functionList, this.menuAuthListTemp)
      this.functionButtonList = []
      this.currentFunction = ''
      this.currentFunctionButton = ''
    },
    // 一级菜单多选框 change 事件
    menuChange() {
      this.checkChange('menu', this.menuList, this.menuAuthListTemp)
    },
    // 一级菜单 node 点击
    menuClick(data) {
      this.currentMenu = data.name
      this.menuGroupList = data.children ? [...data.children] : []
      this.checkChange('menuGroup', this.menuGroupList, this.menuAuthListTemp)
      this.functionList = []
      this.functionButtonList = []
      this.currentMenuGroup = ''
      this.currentFunction = ''
      this.currentFunctionButton = ''
    },
    // 应用多选框 change 事件
    terminalChange() {
      console.log(this.terminalCheckList)
    },
    // 应用模块 node 点击
    terminalClick(data) {
      this.currentApp = data.name
      this.menuList = data.children ? [...data.children] : []
      this.checkChange('menu', this.menuList, this.menuAuthListTemp)
      this.menuGroupList = []
      this.functionList = []
      this.functionButtonList = []
      this.currentMenu = ''
      this.currentMenuGroup = ''
      this.currentFunction = ''
      this.currentFunctionButton = ''
    },
    handleClose() {
      this.menuList = []
      this.menuGroupList = []
      this.functionList = []
      this.functionButtonList = []
      this.currentApp = ''
      this.currentMenu = ''
      this.currentMenuGroup = ''
      this.currentFunction = ''
      this.currentFunctionButton = ''
      this.$emit('handleClose')
    },
    // 生成已勾选权限列表
    getSubmitAuthList(arr, arrTemp) {
      arr.forEach(item => {
        const index1 = this.menuAuthListTemp.findIndex(obj => {
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
        if (Array.isArray(item.extend) && item.children === undefined) {
          this.getSubmitAuthList(item.extend, arrTemp)
        }
      })
      // this.menuAuthListTemp = [...this.arrTemp]
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
.application-list{
  height: calc(100vh - 140px);
  overflow: auto;
  display: flex;
  .terminal-check-box{
    width: 200px;
    .terminal-title{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .el-checkbox-group{
      display: flex;
      flex-direction: column;
    }
    .terminal-check-list{
      position: relative;
      padding: 3px 0;
      display: flex;
      width: 160px;
      .custom-tree-node-right{
        display: none;
        margin-right: 5px;
      }
      &:hover{
        .custom-tree-node-right{
          position: absolute;
          cursor: pointer;
          right: 0;
          display: block;
        }
      }
      .terminal-node{
        cursor: pointer;
        &:hover{
          color: #3e78fd;
        }
      }
    }
  }
}
.footer-button{
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 10px 0;
}
</style>
