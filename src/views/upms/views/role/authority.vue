<!--  -->
<template>
  <div class='role-authority'>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
    >
      <template>
        <div class="item">
          <span class="title-text">功能权限</span>
          <el-divider class="bottom-line"></el-divider>
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </div>
      </template>
      <template>
        <div class="item">
          <span class="title-text">数据权限</span>
          <el-divider class="bottom-line"></el-divider>
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </div>
      </template>
      <template>
        <div class="item center">
          <span class="title-text margin-right">部门数据权限</span>
          <div class="radioGroup">
            <el-radio-group v-model="radio">
              <el-radio :label="0">所有部门权限</el-radio>
              <el-radio :label="1">当前部门</el-radio>
              <el-radio :label="2">当前部门及</el-radio>
              <el-radio :label="3">自定义权限</el-radio>
            </el-radio-group>
          </div>
          <div
            class="tree-auth"
            v-if="radio===3"
          >
            <el-cascader
              :options="options"
              :props="props"
              clearable
            ></el-cascader>
          </div>
        </div>
      </template>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <jvs-button
          size="small"
          @click="handleClose"
        >取 消</jvs-button>
        <jvs-button
          size="small"
          type="primary"
          @click="dialogVisible = false"
        >确 定</jvs-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {getAuth} from '@/api/role'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      method: '',
      dialogVisible: false,
      title: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      radio: '',
      props: { multiple: true },
      options: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 关闭方法
    handleClose () {
      this.dialogVisible = false
    },
    // 初始化
    init (method, row) {
      this.method = method
      this.dialogVisible = true
      getAuth(row.id).then(res => {
        console.log(res)
        if (res.data.code == 0) {
          this.data = res.data.data.menu
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.role-authority {
  width: 100%;
  padding-bottom: 30px;
  .center {
    display: flex;
    align-items: center;
    .tree-auth {
      margin-left: 20px;
    }
  }
  .item {
    margin-top: 20px;
    .radioGroup {
      padding-left: 30px;
    }
    .bottom-line {
      margin: 5px 0px 15px 0px !important;
    }
    .title-text {
      font-size: 18px;
      font-weight: bold;
    }
  }
  ::v-deep .el-tree-node__children {
    display: flex;
  }
}
.dialog-footer {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>
