<template>
  <div :key="conditionKey">
    <div class="condition" v-for="(group, index) in selectedNode.groups" :key="'group-item'+index">
      <div>
        <span>条件组 {{ index + 1 }}</span>
        <span>条件关系: </span>
        <el-switch
          v-model="group.connection"
          active-color="#409EFF"
          inactive-color="#909399"
          active-value="AND"
          inactive-value="OR"
          active-text="且"
          inactive-text="或"
        >
        </el-switch>
        <div class="operation">
          <el-popover placement="bottom" title="选择审批条件" width="300" trigger="click">
            <!-- <div>以下条件将决定具体的审批流程</div>-->
            <el-checkbox-group v-model="group.cids" @change="conditionSelect(group)">
              <el-checkbox
                v-for="condition in formList"
                :label="condition.id"
                :key="condition.id"
              >
                {{ condition.name }}
              </el-checkbox>
            </el-checkbox-group>
            <i class="el-icon-plus" slot="reference"></i>
          </el-popover>
          <i class="el-icon-delete" @click="delGroup(index)"></i>
        </div>
      </div>
      <p v-if="group.condition.length < 1" style="text-align: center; color: #8d8d8e; font-size: 15px">
        点击右上角 + 为本条件组添加判断条件 ☝
      </p>
      <el-form label-width="110px">
        <el-form-item
          :label="condition.name"
          v-for="condition in group.condition"
          :key="condition.id"
        >
          <div v-if="condition.type === 'number'">
            <el-select
              v-model="condition.symbol"
              style="width: 140px; margin-right: 20px"
              size="small"
            >
              <el-option
                :value="sb.symbol"
                :label="sb.name"
                v-for="sb in symbolOptions"
                :key="sb.symbol"
              ></el-option>
            </el-select>
            <el-input
              v-model="condition.left"
              size="small"
              type="number"
              :placeholder="isBetween(condition.symbol) ? '最小值' : '比较值'"
              :style="'width: ' + (isBetween(condition.symbol) ? '120px' : '260px')"
            ></el-input>
            <span v-if="isBetween(condition.symbol)"> ~ </span>
            <el-input
              v-model="condition.right"
              placeholder="最大值"
              type="number"
              v-if="isBetween(condition.symbol)"
              size="small"
              style="width: 120px"
            ></el-input>
          </div>

          <div v-else-if="condition.type === type.ONE || condition.type === type.MORE">
            <el-select
              v-model="condition.symbol"
              style="width: 140px; margin-right: 20px"
              size="small"
            >
              <el-option :value="'='" label="完全等于"></el-option>
              <el-option :value="'in'" label="包含在"></el-option>
            </el-select>
            <el-select
              v-model="condition.values"
              style="width: 200px"
              size="small"
              multiple
            >
              <el-option
                :value="op"
                :label="op"
                v-for="(op, id) in condition.options"
                :key="id"
              ></el-option>
            </el-select>
          </div>

          <div v-else-if="condition.type === type.DEPT">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-bottom: 15px"
              round
              @click="chooseUser(condition)"
            >
              选择部门
            </el-button>
          </div>

          <div v-else-if="condition.type === type.USER">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-bottom: 15px"
              round
              @click="chooseUser(condition)"
            >
              选择人员
            </el-button>
          </div>

          <div v-else-if="['ORG', 'org'].indexOf(condition.type) > -1">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-bottom: 15px"
              round
              @click="chooseUser(condition)"
            >
              选择
            </el-button>
            <span style="margin-left: 15px; color: #a6a6a7">(属于某部门或哪些人员)</span>
            <div>
              <el-tag
                :type="type.DEPT === user.type ? 'info' : 'primary'"
                v-for="(user, index) in condition.values"
                size="mini"
                style="margin: 5px 10px 5px 0"
                :key="index"
                @close="condition.values.splice(index, 1)"
                closable
              >
                {{ user.name }}
              </el-tag>
            </div>
          </div>
          <!--  <i class="el-icon-delete"></i>-->
        </el-form-item>
      </el-form>
    </div>

    <userSelector ref="condiUserSelector" :selectable="true" :autoClose="true" :deptable="!onlySelectUser" @submit="submitHandle"></userSelector>
  </div>
</template>

<script>
import { conditionType, logicType } from "../common/enumConst";
import userSelector from '@/components/basic-assembly/userSelector'

export default {
  name: "condition",
  components: { userSelector },
  props: {
    /*value: {
      default: () => {
        return {}
      },
      type: Object
    }*/
  },
  data() {
    return {
      type: conditionType,
      onlySelectUser: false,
      itemCd: {},
      symbolOptions: [
        { name: "大于", symbol: ">" },
        { name: "大于等于", symbol: ">=" },
        { name: "小于", symbol: "<" },
        { name: "小于等于", symbol: "<=" },
        { name: "等于", symbol: "=" },
        { name: "介于两者之间", symbol: "between" },
        { name: "包含并介于两者之间", symbol: "between-eq" },
      ],
      conditionKey: ''
    };
  },
  computed: {
    selectedNode() {
      return this.$store.state.flow.selectedNode;
    },
    formList() {
      //这个条件有5种类型 user 人员选择、 dept 部门选择、 number 数字、single 单选、 more 多选
      let result = [];
      this.$store.state.flow.template.form.forEach((atom) => {
        if (atom.valid) {
          if (atom.name === "jInput" && atom.props.type === "number") {
            result.push({
              id: atom.id,
              name: atom.text,
              type: "number",
            });
          } else if (atom.name === "jSelect") {
            result.push({
              id: atom.id,
              name: atom.text,
              type: atom.props.type,
              options: atom.props.options,
            });
          } else if (atom.name === "orgSelect") {
            result.push({
              id: atom.id,
              name: atom.text,
              type: atom.props.type,
            });
          }
        }
      });
      result.unshift({
        id: this.$store.state.flow.template.process.id,
        name: "发起人",
        type: "org",
      });
      return result;
    },
  },
  methods: {
    isBetween(symbol) {
      return symbol === "between" || symbol === "between-eq";
    },
    selected (select) {
      this.$set(this.itemCd, "values", select.map((s) => {
        return { id: s.id, name: s.realName, type: s.type ? s.type : 'user' };
      }));
      this.$set(this.selectedNode, 'groups', this.selectedNode.groups)
      this.$store.commit('selectedNode', this.selectedNode)
      this.$forceUpdate()
    },
    conditionSelect (group) {
      let condition = [];
      group.cids.forEach((cd) => {
        for (let key in this.formList) {
          if (this.formList[key].id === cd) {
            condition.push(JSON.parse(JSON.stringify(this.formList[key])));
            break;
          }
        }
      });
      group.condition = condition;
      this.$store.commit('setCondition', condition)
    },
    delGroup(index) {
      let temp = []
      for(let i in this.selectedNode.groups) {
        if(i != index) {
          temp.push(this.selectedNode.groups[i])
        }
      }
      this.$set(this.selectedNode, 'groups', temp)
    },
    // 选择成员
    chooseUser (condition) {
      this.itemCd = condition
      this.$refs.condiUserSelector.openDialog()
    },
    // 确定成员
    submitHandle (list) {
      this.selected(list)
    },
  },
  watch: {
    'selectedNode.groups': {
      handler(newVal, oldVal) {
        this.conditionKey = Math.random().toString()
        this.$forceUpdate()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.condition {
  border: 1px solid #d8d8d9;
  border-radius: 5px;
  overflow: hidden;
  margin: 30px 0;
  & > div {
    position: relative;
    padding: 5px 5px 5px 10px;
    color: #5e5e5e;
    font-size: medium;
    background: #e8e8e9;
    span:nth-child(2) {
      font-size: 14px;
      position: absolute;
      left: 100px;
    }

    ::v-deep .el-switch {
      position: absolute;
      left: 170px;
    }
    .operation {
      position: absolute;
      right: 10px;
      top: 5px;
      i {
        padding: 3px;
        cursor: pointer;
        margin-left: 15px;
      }
      .el-icon-delete {
        &:hover {
          color: #f56c6c;
        }
      }
      .el-icon-plus {
        &:hover {
          color: #4987ff;
        }
      }
    }
  }
  ::v-deep .el-form {
    padding: 5px;
    .el-form-item__content {
      & > div {
        display: inline;
      }
    }
  }
}
</style>
