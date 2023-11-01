<template>
  <div class="variable-com">
    <div class="variable-com-top">
      <jvs-button type="primary" size="mini" @click="importHandle">导入json</jvs-button>
    </div>
    <div class="variable-com-center">
      <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div class="variable-item">
            <el-input class="name" placeholder="请输入字段名" size="mini" v-model="data.key" :style="'width:'+data.nameWidth+'px;'"></el-input>
            <el-select
              class="type"
              v-model="data.classType"
              size="mini"
              placeholder="请选择类型"
              :style="'width:'+data.avgWidth+'px;'"
              :disabled="data.level == 1"
              @change="typeChange(data, node)"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
            <div class="default" :style="'display: inline-block;;width:'+data.avgWidth+'px;'">
              <el-input v-if="['字符串', '集合类型', '对象'].indexOf(data.classType) > -1" size="mini" v-model="data.value" placeholder="请输入默认值" ></el-input>
              <el-input-number style="width:100%;" v-if="data.classType == '数字'" size="mini" v-model="data.value" label="请输入默认值" :step="1" :precision="0"></el-input-number>
              <el-input-number style="width:100%;" v-if="data.classType == '浮点数'" size="mini" v-model="data.value" label="请输入默认值" :precision="4"></el-input-number>
              <el-switch size="mini" v-if="data.classType == '布尔'" v-model="data.value"></el-switch>
            </div>
            <el-input class="introduce" size="mini" v-model="data.description" placeholder="请输入注释" :style="'width:'+data.avgWidth+'px;'"></el-input>
          </div>
          <div class="right-tool">
            <i v-if="['对象', '集合类型'].indexOf(data.classType) > -1" class="add el-icon-plus" @click="addChildren(data, node)"></i>
            <i v-if="data.level != 1" class="del el-icon-minus" @click="delSelf(data, node)"></i>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="variable-com-bottom">
      <jvs-button type="primary" size="mini" @click="saveHandle">保存</jvs-button>
    </div>
    <el-dialog
      title="导入"
      append-to-body
      class="variable-set-dialog"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <div v-if="dialogVisible">
        <h5 style="margin: 0;height: 24px;line-height: 24px;color: #F56C6C;">仅支持对象格式数据的json导入，且对象不能为空</h5>
        <codeEditor class="codeEditor" prop="variableJsonCode" @change="changeHandle"></codeEditor>
        <el-row style="margin-top: 10px;text-align: center;">
          <jvs-button type="primary" size="mini" :disabled="codeCon== 'error'" @click="importSubmit">导入</jvs-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import codeEditor from './coder'
export default {
  name: "variable-set",
  components: {codeEditor},
  props: {
    varialbeData: {
      type: Object
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      typeOptions: [
        {label: '对象', value: '对象'},
        {label: '字符串', value: '字符串'},
        {label: '浮点数', value: '浮点数'},
        {label: '集合类型', value: '集合类型'},
        {label: '布尔', value: '布尔'},
        {label: '数字', value: '数字'}
      ],
      dialogVisible: false,
      codeCon: ''
    };
  },
  methods: {
    // 点击节点
    handleNodeClick(data) {
      // console.log(data);
    },
    // 格式化tree，添加level
    formatTree (list, level, deal) {
      let rowWidth = document.body.clientWidth - 150 || 0
      for(let i in list) {
        list[i].level = level
        let w = (rowWidth / 4) - ((level - 1) * 18)
        if(w < 20) {
          w = 20
        }
        list[i].avgWidth = (rowWidth / 4)
        list[i].nameWidth = w
        if(deal == 'tostring') {
          if(typeof list[i].value == 'object' && list[i].value) {
            list[i].value = JSON.parse(list[i].value)
          }
        }
        if(list[i].children && list[i].children.length > 0) {
          this.formatTree(list[i].children, (Number.parseInt(level) + 1))
        }
      }
    },
    // 导入
    importHandle () {
      this.dialogVisible = true
    },
    // 关闭导入
    handleClose () {
      this.dialogVisible = false
    },
    // editor赋值
    changeHandle (code) {
      this.codeCon = code
    },
    // 确定导入
    importSubmit () {
      if(this.codeCon) {
        this.generateJson(this.codeCon)
        this.formatTree(this.data, 1)
        this.$forceUpdate()
      }else{
        this.data = []
        this.handleClose()
      }
    },
    // 根据json生成树
    generateJson (str) {
      let json = JSON.parse(str)
      let temp = {
        key: 'root',
        value: '',
        description: '',
      }
      if(json instanceof Array) {
        temp.classType = '集合类型'
        if(json.length > 0) {
          if(typeof json[0] == 'object') {
            temp.children = []
            this.getChildren(json, temp.children)
          }else{
            temp.value = JSON.stringify(json)
          } 
        }else{
          temp.value = JSON.stringify(json)
        }
      }else{
        temp.classType = '对象'
        if(JSON.stringify(json) != '{}') {
          temp.children = []
          this.getChildren(json, temp.children)
        }else{
          temp.value = '{}'
        }
      }
      this.data = [temp]
      this.handleClose()
    },
    // 获取子集
    getChildren (item, list) {
      let data = item
      if(item instanceof Array) {
        data = item[0]
      }
      for(let k in data) {
        let kob = {
          key: k,
          value: '',
          description: ''
        }
        switch (typeof data[k]) {
          case 'string':
            kob.classType = '字符串';
            kob.value = data[k];
            break;
          case 'boolean':
            kob.classType = '布尔';
            kob.value = data[k];
            break;
          case 'number':
            kob.classType = '浮点数';
            if(data[k] % 1 == 0) {
              kob.classType = '数字';
            }
            kob.value = data[k];
            break;
          case 'object':
            kob.classType = '对象';
            if(data[k] instanceof Array) {
              kob.classType = '集合类型';
              if(data[k].length > 0) {
                if(typeof data[k][0] == 'object') {
                  kob.children = []
                  this.getChildren(data[k], kob.children)
                }else{
                  kob.value = JSON.stringify(data[k])
                }
              }else{
                kob.value = "[]"
              }
            }else{
              if(JSON.stringify(data[k]) == "{}"){
                kob.value = JSON.stringify(data[k])
              }else{
                kob.children = []
                this.getChildren(data[k], kob.children)
              }
            }
            break;
          default:
            break;
        }
        list.push(kob)
      }
    },
    // 添加子节点
    addChildren (data, node) {
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      let rowWidth = document.body.clientWidth - 150 || 0
      let level = Number.parseInt(data.level) + 1
      let w = (rowWidth / 4) - ((level - 1) * 18)
      if(w < 20) {
        w = 20
      }
      data.children.push({
        key: '',
        classType: '',
        value: '',
        description: '',
        level: level,
        avgWidth: (rowWidth / 4),
        nameWidth: w,
      })
      this.$set(data, 'value', '')
      node.expanded = true
    },
    // 删除节点
    delSelf (data, node) {
      const parent = node.parent;
      let children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.$treeNodeId === node.id);
      children.splice(index, 1);
    },
    // 类型change
    typeChange (data, node) {
      if(data.classType == '布尔') {
        this.$set(data, 'value', false)
      }else if(data.classType == '数字'){
        this.$set(data, 'value', 0)
      }else if(data.classType == '浮点数'){
        this.$set(data, 'value', 0)
      }else {
        this.$set(data, 'value', "")
      }
      if(['对象', '集合类型'].indexOf(data.classType) == -1) {
        if(data.children && data.children.length > 0) {
          this.$set(data, 'children', [])
        }
      }
    },
    // 保存
    saveHandle () {
      this.$emit('variableSave', this.data)
    }
  },
  created () {
    if(this.varialbeData) {
      if(this.varialbeData.key) {
        let temp = [JSON.parse(JSON.stringify(this.varialbeData))]
        this.formatTree(temp, 1, 'tostring')
        this.data = temp
      }else{
        this.data = []
      }
    }
  }
};
</script>
<style lang="scss">
.variable-com {
  width: 100%;
  overflow: hidden;
  .variable-com-top {
    margin-left: 30px;
  }
  .variable-com-center {
    margin-top: 10px;
    // padding: 0 30px;
    .el-tree{
      height: 180px;
    }
    .custom-tree-node{
      width: calc(100% - 25px);
      position: relative;
      .variable-item{
        display: flex;
        align-items: center;
        .name, .type, .default, .introduce {
          width: 25%;
          margin-right: 10px;
        }
        .introduce{
          margin-right: 0;
        }
      }
      .right-tool{
        position: absolute;
        right: 0;
        height: 28px;
        line-height: 28px;
        width: 50px;
        margin-left: 10px;
        top: 0;
        i{
          font-size: 20px;
        }
        .add{
          color: #67C23A;
          margin-right: 10px;
        }
        .del{
          color: #F56C6C;
        }
      }
    }
  }
  .variable-com-bottom {
    margin-top: 10px;
    margin-left: 30px;
  }
}
.codeEditor{
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
