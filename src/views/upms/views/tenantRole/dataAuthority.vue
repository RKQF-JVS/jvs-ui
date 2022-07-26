<template>
  <div class="data-authority">
    <el-dialog
      class="data-authority-dialog"
      title="数据权限"
      width="60%"
      :fullscreen="true"
      :visible.sync="dataAuthVisible"
      :before-close="handleClose">
      <div class="header-text">如果不勾选数据权限功能,默认查询所有数据</div>
      <div class="data-authority-content">
        <div class="check-box" v-for="(aItem, key) in authList" :key="key">
          <div class="data-authority-item">
            <h4>{{aItem.key}}</h4>
            <div v-for="(item, index) in aItem.value" :key="item.id">
              <div>
                <el-checkbox v-model="item.check" :label="item.name" @change="handleCheck(item, index, key)"></el-checkbox>
              </div>
              <div class="describes">
                <el-radio-group v-model="item.remark.dataScopeType" :disabled="item.disabled" size="mini" style="width: 100%;margin-top: 16px;">
                  <el-radio label="all_dept">所有部门</el-radio>
                  <el-radio label="curr_dept">当前部门</el-radio>
                  <el-radio label="curr_dept_tree">当前部门及以下</el-radio>
                  <el-radio label="all_job">所有岗位</el-radio>
                  <el-radio label="curr_job">当前岗位</el-radio>
                  <el-radio label="self">用户自己创建数据</el-radio>
                  <!-- <el-radio label="customize">自定义权限</el-radio> -->
                </el-radio-group>
                <div
                  class="tree-auth"
                  v-if="true || item.remark.dataScopeType === 'customize'"
                  style="margin-top: 10px;display:flex;"
                >
                  <el-cascader
                    :disabled="item.disabled"
                    v-model="item.remark.deptIds"
                    placeholder="请选择部门"
                    size="mini"
                    :options="treeData"
                    clearable
                    :show-all-levels="false"
                    :props="{
                        expandTrigger: 'hover',
                        checkStrictly: true,
                        multiple: true,
                        emitPath: false,
                        children: 'children',
                        label: 'name',
                        value: 'id'
                      }"
                    :collapse-tags="true"
                  >
                  </el-cascader>
                  <el-select :disabled="item.disabled" v-model="item.remark.jobIds" placeholder="请选择岗位" size="mini" multiple :collapse-tags="true" style="margin-left:10px;">
                    <el-option
                      v-for="temp in postData"
                      :key="'customize-select-option'+temp.id"
                      :label="temp.name"
                      :value="temp.id">
                    </el-option>
                  </el-select>
                  <el-cascader
                    :disabled="item.disabled"
                    style="margin-left: 10px;"
                    v-model="item.checkList"
                    placeholder="请选择"
                    size="mini"
                    :options="item.dataList"
                    clearable
                    :show-all-levels="false"
                    :props="{
                      expandTrigger: 'hover',
                      checkStrictly: false,
                      multiple: true,
                      emitPath: false,
                      children: 'dataDictDto',
                      label: 'desc',
                      value: 'value'
                    }"
                    :collapse-tags="true"
                    @change="checkHandle(item)"
                  >
                  </el-cascader>
                </div>
                <div class="describes-text">
                  {{ item.describes }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-row style="display: flex;align-items: center;justify-content: center;background: #fff;padding:10px 0;">
          <el-button size="mini" type="primary" @click="handleConfirm">确 定</el-button>
          <el-button size="mini" @click="handleClose">取 消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {bindRoleDataAuth} from "../role/api";
import {getDeptList} from "../department/api";
import {getPostList} from "../postList/api";

export default {
  name: "dataAuthority",
  props: {
    dataAuthVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    roleData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    authList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isBindList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    dataAuthVisible(val) {
      if (val) {
        this.getPostTree()
        this.getTreeDept()
        this.setCheckValue(this.authList)
      }
    }
  },
  data() {
    return {
      treeData: [],
      postData: [], // 岗位列表
    }
  },
  methods: {
    // 获取岗位树列表
    getPostTree () {
      this.postLoading = true
      getPostList().then(res => { // this.selectOneId
        if(res.data.code == 0) {
          // console.log(res.data.data)
          this.postData = res.data.data
          this.postLoading = false;
        }
      })
    },
    // 获取部门树列表
    getTreeDept() {
      this.treeLoading = true;
      getDeptList().then(res => {
        if(res.data && res.data.code == 0) {
          this.treeData = this.getTree(res.data.data, 1)
          this.treeLoading = false;
        }
      })
    },
    // 递归树清掉空的childList
    getTree (tree = [], level) {
      let arr = [];
      if (tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.name = item.extend.name;
          obj.id = item.extend.id;
          obj.sort = item.extend.sort
          obj.parentId = item.extend.parentId
          obj.leaderId = item.extend.leaderId
          obj.level = level
          if (item.children && item.children.length > 0) {
            obj.children = this.getTree(item.children, level+1);
          }
          arr.push(obj);
        });
      }
      return arr
    },
    // 复选选择 change
    handleCheck(obj, index, indexParent) {
      obj.dataId = obj.check ? obj.id : ''
      if (obj.check) {
        this.$set(this.authList[indexParent].value[index], 'dataId', obj.id)
        this.$set(this.authList[indexParent].value[index].remark, 'dataScopeType', 'all_dept')
        this.$set(this.authList[indexParent].value[index], 'disabled', false)
      } else {
        this.$set(this.authList[indexParent].value[index], 'dataId', '')
        this.$set(this.authList[indexParent].value[index].remark, 'dataScopeType', '')
        this.$set(this.authList[indexParent].value[index], 'disabled', true)
      }
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('dataAuthClose')
    },
    // 提交数据
    handleConfirm() {
      const arr = []
      this.authList.forEach(item => {
        if(item.value && item.value.length > 0) {
          for(let i in item.value) {
            if (item.value[i].dataId !== '') {
              arr.push({ dataId: item.value[i].dataId, remark: Object.assign(item.value[i].remark, {dataDictDto: item.value[i].dataList}), roleId: item.value[i].roleId})
            }
          }
        }
      })
      bindRoleDataAuth(this.roleData.id, arr).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('授权成功！')
          this.handleClose()
        }
      })
    },
    // 自定义选项check
    checkHandle (item) {
      if(item.checkList) {
        this.eachTree(item.checkList, item.dataList)
      }
    },
    eachTree (list, tree, type) {
      for(let i in tree) {
        if(type == 'get') {
          if(list.indexOf(tree[i].value) == -1 && tree[i].check == true) {
            list.push(tree[i].value)
          }
        }else{
          if(list.indexOf(tree[i].value) > -1) {
            tree[i].check = true
          }else{
            tree[i].check = false
          }
        }
        if(tree[i].dataDictDto) {
          this.eachTree(list, tree[i].dataDictDto, type == 'get' ? type : null)
        }
      }
    },
    setCheckValue (list) {
      for(let l in list) {
        if(list[l].value && list[l].value.length > 0) {
          for(let i in list[l].value) {
            if(list[l].value[i].remark && list[l].value[i].remark.dataDictDto) {
              let temp = []
              this.eachTree(temp, list[l].value[i].remark.dataDictDto, 'get')
              list[l].value[i].checkList = temp
              this.checkHandle(list[l].value[i])
            }
          }
        }
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.data-authority{
  ::v-deep.data-authority-dialog{
    .el-dialog__body{
      padding: 0 20px;
    }
    .header-text{
      padding: 20px 10px;
      font-size: 16px;
      color: #333333;
    }
    .data-authority-content{
      height: calc(100vh - 178px);
      .check-box{
        margin-bottom: 20px;
        .describes{
          padding: 10px 30px;
          .describes-text{
            margin-top: 20px;
            color: #999999;
          }
          .el-radio__input.is-disabled .el-radio__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner{
            background-color: #FFFFFF;
          }
          .el-radio__input.is-disabled+span.el-radio__label {
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
