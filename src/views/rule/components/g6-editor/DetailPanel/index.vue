<template>
  <div class="detailpannel" v-show="['node-selected', 'edge-selected'].indexOf(status) > -1 && selectType == 'click'">
    <div v-if="['node-selected', 'edge-selected'].indexOf(status) > -1" class="detailpannel-box">
      <i class="detailpannel-box-close el-icon-close" @click="closeDetail"></i>
      <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
        <h4 class="node-text-info">
          <span>{{node.name}}</span>
          <i class="el-icon-info" v-if="node && node.functionInfo && node.functionInfo.explain" @click="openExplain(node)"></i>
        </h4>
        <el-radio-group v-model="activeRadio" class="node-set-title" v-if="false">
          <el-radio-button label="name">设置</el-radio-button>
          <el-radio-button label="param">说明 | 示例</el-radio-button>
        </el-radio-group>
        <div class="block-container">
          <!-- <el-row style="display:flex;align-items:center;" v-if="activeRadio == 'name'">
            <span style="word-break: keep-all;margin-right:10px;font-size:14px;">节点名称</span>
            <el-input size="mini" v-model="node.name" @blur="handleChangeName(node.name)" />
          </el-row> -->
          <div v-if="activeRadio == 'name' && variableItems.length > 0" class="variable-list">
            <h5>变量名称</h5>
            <el-row>
              <el-tooltip v-for="(item, index) in variableItems" :key="item.key+index" class="item" effect="dark" placement="top">
                <div slot="content">
                  <span v-if="item.description">{{item.description}}</span>
                  <br v-if="item.description" />
                  <span>{{(item.parent && item.parent.length > 0) ? (item.parent.join('.') + '.' + item.key) : item.key}}</span>
                </div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onCopy"
                  v-clipboard:copy="copyVariable(item)"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  {{item.key}}
                </el-button>
              </el-tooltip>
            </el-row>
          </div>
          <settingForm v-if="activeRadio == 'name'" :info="node" @saveSetting="saveSettingHandle" @updateNode="updateNodeHandle" />
          <div v-if="activeRadio == 'param'" class="param-info">
            <div v-html="node.explain"></div>
          </div>
        </div>
      </div>
      <div v-if="status=='edge-selected'" class="pannel" id="edge_detailpannel">
        <jvs-form :option="expOption" :formData="expForm" style="padding:10px;" @submit="handleChangeExpression" @cancalClick="cancalHandle"></jvs-form>
      </div>
      <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
        <div class="pannel-title">画布</div>
        <div class="block-container">
          <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "../../../utils/eventBus";
// import Grid from "@antv/g6/build/grid";
import settingForm from "../../../views/design/setting"
import {getDatasource} from '@/api/newDesign'
import { getStore } from '@/util/store'
export default {
  components: {settingForm},
  data() {
    return {
      status: "canvas-selected",
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {},
      grid: null,
      activeRadio: "name",
      selectType: "", // 选中方式 click hover
      expForm: {},
      expOption: {
        emptyBtn: false,
        cancal: true,
        formAlign: 'top',
        column: [
          {
            label: '条件表达式',
            prop: 'expression',
            type: 'textarea',
            rules: [
              { required: false, message: '请输入表达式', trigger: 'blur' },
            ]
          }
        ]
      },
      variableItems: [], // 变量
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  methods: {
    init() {},
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on("nodeselectchange", item => {
          if (item.select === true && item.selectType == 'click') {
            if(item.target.getType() === "node" && ['start', 'end'].indexOf(item.target.getModel().nodeType) == -1) {
              self.status = "node-selected";
              this.activeRadio = 'name'
            }
            if(item.target.getType() == 'edge') {
              self.status = "edge-selected";
              if(item.target._cfg.model && item.target._cfg.model.expression) {
                this.$set(this.expForm, 'expression', item.target._cfg.model.expression)
              }else{
                this.$set(this.expForm, 'expression', "")
              }
            }
            self.item = item.target;
            self.node = JSON.parse(JSON.stringify(item.target.getModel()));
            this.selectType = item.selectType
          } else {
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
            this.selectType = ""
            this.expForm = {}
          }
          this.getVariableList()
          this.$forceUpdate()
        });
      });
    },
    handleChangeName(e) {
      const model = {
        label: e,
        name: e
      };
      let nodeAll = this.graph.findAll('node', node => {
        return node.get('model')
      })
      let temp = []
      nodeAll.filter( item => {
        temp.push(item._cfg.model.name)
      })
      let count = 0
      for(let i in temp) {
        if(temp[i] == model.name) {
          count++
        }
      }
      if(count > 0) {
        // 重复提示
        this.$message.warning("该名称已存在")
        return false
      }else{
        if(model.name == '' || !model.name) {
          this.$message.warning("名称不能为空")
          return false
        }
        // 更新
        this.graph.update(this.item, model);
        this.graph.refresh()
      }
      this.$forceUpdate()
    },
    handleChangeExpression(form) {
      // 更新
      this.graph.update(this.item, form);
      this.graph.refresh()
      this.selectType = ""
      this.expForm = {}
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    // 组件设置---提交
    saveSettingHandle (settingData) {
      let model = this.item.getModel()
      if(!model.body) {
        model.body = {}
      }
      model.body = JSON.parse(JSON.stringify(settingData))
      // 更新
      this.graph.update(this.item, model);
      this.graph.refresh()
      // this.handleCloseSetting()
      this.selectType = ""
    },
    cancalHandle () {
      this.selectType = ""
      this.expForm = {}
    },
    closeDetail () {
      this.cancalHandle()
    },
    // 获取变量
    getVariableList () {
      if(getStore({ name: 'variableItems' })) {
        this.variableItems = getStore({ name: 'variableItems' })
      }else{
        this.variableItems = []
      }
    },
    // 复制变量
    copyVariable (item) {
      let str = ""
      str = (item.parent && item.parent.length > 0) ? (item.parent.join('.') + '.' + item.key) : item.key
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
    },
    onError (e) {
      console.log(e)
    },
    // 打开说明
    openExplain (node) {
      if(node && node.functionInfo && node.functionInfo.explain) {
        this.$openUrl(node.functionInfo.explain, '_blank')
      }
    },
    // 更新节点参数
    updateNodeHandle (node) {
      // 更新
      this.graph.update(this.item, node);
      this.graph.refresh()
    }
  }
};
</script>

<style lang="scss" scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: rgba(0, 0, 0, .2);
  width: 100%;
  border-left: 1px solid #e6e9ed;
  overflow: hidden;
}
.detailpannel-box{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  width: 500px;
  background: #f7f9fb;
  float: right;
  padding: 0 20px;
  position: relative;
  .detailpannel-box-close{
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    font-size: 20px;
  }
  .node-text-info{
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    margin: 0;
    i{
      margin-left: 10px;
      cursor: pointer;
      font-size: 16px;
      font-weight: normal;
      color: #3471FF;
    }
  }
}
.detailpannel .block-container {
  padding:8px;
}
.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
</style>
<style lang="scss">
.detailpannel{
  .node-set-title{
    width: 100%;
    .el-radio-button{
      width: 50%;
      .el-radio-button__inner{
        width: 100%;
        border-radius: 0;
      }
    }
  }
  .variable-list{
    h5{
      margin: 0;
    }
    .el-row{
      .el-button{
        margin-right: 10px;
        margin-top: 10px;
        background: rgba(64, 158, 255, .1);
        color: #409EFF;
      }
    }
  }
}
</style>