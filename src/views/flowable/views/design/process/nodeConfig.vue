<template>
  <div class="node-config">
    <el-form :label-position="isTjNode ? '' : 'top'" label-width="90px">
      <div v-if="isRootNode || isCsNode">
        <el-form-item :label="isRootNode ? '谁可以发起此审批' : '选择要抄送的人员'" prop="text">
          <jvs-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 15px" round @click="chooseUser">选择人员/部门</jvs-button>
          <div style="color: #38adff; font-size: x-small" v-show="isRootNode && props.targetObj.objs.length === 0">
            不指定则默认所有人都可发起此审批
          </div>
          <div>
            <el-tag
              :type="'dept' === user.type ? 'info' : 'primary'"
              v-for="(user, index) in props.targetObj.objs"
              size="mini"
              style="margin: 5px 10px 5px 0"
              @close="props.targetObj.objs.splice(index, 1)"
              closable
              :key="'user-tag'+index"
            >
              {{ user.name }}
            </el-tag>
          </div>
        </el-form-item>
      </div>

      <div v-if="isTjNode">
        <el-form-item label="调整优先级" prop="level">
          <el-popover
            placement="right"
            title="拖拽条件调整优先级顺序"
            width="250"
            trigger="click"
          >
            <draggable
              style="width: 100%; min-height: 25px"
              :list="prioritySortList"
              group="from"
              :options="{
                animation: 300,
                chosenClass: 'choose',
                scroll: true,
                sort: true,
              }"
            >
              <div class="drag-no-choose"
                :style="list.id === selectedNode.id ? 'background: #79bbff; color:#ffffff' : ''"
                v-for="(list, index) in prioritySortList"
                :key="'drag-no-'+index"
                v-show="index < (prioritySortList.length-1)"
              >
                <div>{{ list.name }}</div>
                <div>优先级 {{ index + 1 }}</div>
              </div>
            </draggable>
            <el-button icon="el-icon-sort" size="small" slot="reference">第{{ getNowNodeIndex + 1 }}级</el-button>
          </el-popover>
          <div class="group-connect">
            <span>条件组关系: </span>
            <el-switch
              v-model="selectedNode.connection"
              active-color="#409EFF"
              inactive-color="#909399"
              active-value="AND"
              inactive-value="OR"
              active-text="且"
              inactive-text="或"
            >
            </el-switch>
          </div>
        </el-form-item>
        <div>
          <condition></condition>
          <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 15px" round @click="addConditionGroup" >添加条件组</el-button>
          <span style="font-size: small; color: #7a7a7a; margin-left: 20px">只有必填选项才能作为审批条件</span>
        </div>
      </div>

      <div v-if="isSpNode">
        <el-form-item label="选择审批人" prop="text" class="select-user-type">
          <el-radio-group v-model="props.type">
            <el-radio v-for="t in approvalType" :label="t.label" :key="t.label" :disabled="t.disabled">
              {{ t.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <div v-if="props.type === enumConst.approvalType.ASSIGN_USER">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-bottom: 15px"
              round
              @click="chooseUser"
            >
              选择人员
            </el-button>
            <div>
              <el-tag
                :type="'dept' === user.type ? 'info' : 'primary'"
                v-for="(user, index) in props.targetObj.objs"
                size="mini"
                style="margin: 5px 10px 5px 0"
                @close="props.targetObj.objs.splice(index, 1)"
                closable
                :key="'choose-user'+index"
                >{{ user.name }}
              </el-tag>
            </div>
          </div>

          <div v-if="props.type === enumConst.approvalType.ROLE">
            <el-select v-model="roleList" style="display:block;margin-bottom:10px;" size="mini" clearable collapse-tags filterable placeholder="请选择角色" multiple @change="roleChangeHandle">
              <el-option
                v-for="ir in roleOption"
                :key="ir.id+'role'+ir.roleName"
                :label="ir.roleName"
                :value="ir.id">
              </el-option>
            </el-select>
            <div>
              <el-tag
                type="primary"
                size="mini"
                style="margin: 5px 10px 5px 20px"
                v-for="(role, index) in props.targetObj.roles"
                :key="'role-choose-'+index"
              >
                {{ role.name }}
              </el-tag>
            </div>
            
          </div>

          <div v-if="props.type === enumConst.approvalType.SELF">
            <p style="font-size: 15px; color: #8c8c8c">发起人自己作为审批人进行审批</p>
          </div>
          
          <!-- 暂时屏蔽！！！！！！！！！！！！！！！！！ -->
          <div v-if="false && props.type === enumConst.approvalType.SELF_SELECT">
            <el-select
              size="small"
              v-model="props.targetObj.multiple"
              placeholder="选择人数"
            >
              <el-option :value="false" label="自选一个人"></el-option>
              <el-option :value="true" label="自选多个人"></el-option>
            </el-select>
          </div>
        </div>

        <el-divider></el-divider>
        <el-form-item label="审批同意时是否需要手写签字">
          <el-switch
            :disabled="true"
            inactive-text="不用"
            active-text="需要"
            v-model="props.sign"
            :disable="$store.state.flow.template.baseSetup.sign"
          ></el-switch>
          <el-tooltip
            class="item"
            effect="dark"
            content="如果全局设置了需要签字，则此处不生效"
            placement="top-start"
          >
            <i
              class="el-icon-question"
              style="margin-left: 10px; font-size: medium; color: #b0b0b1"
            ></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="审批期限（为 0 则不生效）" prop="timeLimit">
          <el-select
            :disabled="true"
            v-model="props.timeLimit.type"
            size="mini"
            placeholder="维度 天 / 小时"
            style="width: 100px"
          >
            <el-option :value="enumConst.timeLimitType.HOUR" label="小时"></el-option>
            <el-option :value="enumConst.timeLimitType.DAY" label="天"></el-option>
          </el-select>
          <span style="margin: 0 10px">时长:</span>
          <el-input-number
            :disabled="true"
            :min="0"
            :max="100"
            :step="1"
            size="mini"
            v-model="props.timeLimit.limit"
          ></el-input-number>
          <span>
            {{
              props.timeLimit.type === enumConst.timeLimitType.HOUR ? "小时" : "天"
            }}</span
          >
        </el-form-item>

        <el-form-item
          label="审批期限超时后执行"
          prop="level"
          v-if="props.timeLimit.limit > 0"
        >
          <el-radio-group v-model="props.timeLimit.event.type">
            <el-radio v-for="evs in timeoutEvents" :label="evs.event" :key="evs.event">{{
              evs.name
            }}</el-radio>
          </el-radio-group>
          <!--<div>
            <span style="color:#4987ff; font-size: small">提醒 </span>
            <el-select v-model="props.approval.timeoutEvent.userType" size="mini" placeholder="提醒谁" style="width:100px">
              <el-option :value="'sender'" label="发起人"></el-option>
              <el-option :value="'select'" label="指定成员"></el-option>
            </el-select>
          </div>-->
          <div v-if="props.timeLimit.event.type === enumConst.timeoutEvent.NOTIFY">
            <div style="color: #409eef; font-size: small">默认提醒当前审批人</div>
            <el-switch
              inactive-text="一次"
              active-text="循环"
              v-model="props.timeLimit.event.loop"
            ></el-switch>
            <span style="margin-left: 20px" v-if="props.timeLimit.event.loop">
              每隔
              <el-input-number
                :min="0"
                :max="10000"
                :step="1"
                size="mini"
                v-model="props.timeLimit.event.loopTime"
              >
              </el-input-number>
              天
            </span>
          </div>
        </el-form-item>
      </div>

      <div v-if="props.type === enumConst.approvalType.LEADER">
        <el-divider></el-divider>
        <el-form-item label="指定主管" prop="text" style="color: #606266">
          <span>发起人的第 </span>
          <el-input-number
            :min="1"
            :max="20"
            :step="1"
            size="mini"
            v-model="props.leaderLevel"
          ></el-input-number>
          <span> 级主管</span>
          <div style="color: #409eff; font-size: small">👉 直接主管为 第 1 级主管</div>
        </el-form-item>
      </div>

      <div v-if="showModel">
        <el-divider></el-divider>
        <el-form-item label="多人审批时审批方式" prop="text" class="approve-mode">
          <el-radio-group v-model="props.mode">
            <el-radio :label="enumConst.approvalMode.NEXT">按选择顺序依次审批</el-radio>
            <el-radio :label="enumConst.approvalMode.AND"
              >会签（可同时审批，每个人必须同意）</el-radio
            >
            <el-radio :label="enumConst.approvalMode.OR">或签（有一人同意即可）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div v-if="props.type === enumConst.approvalType.LEADER_TOP">
        <el-divider></el-divider>
        <el-form-item label="审批终点" prop="text" class="approve-end">
          <el-radio-group v-model="props.endCondition">
            <el-radio :label="enumConst.endCondition.TOP">直到最上层主管</el-radio>
            <el-radio :label="enumConst.endCondition.LEAVE">不超过发起人的</el-radio>
          </el-radio-group>
          <div
            class="approve-end-leave"
            v-if="enumConst.endCondition.TOP !== props.endCondition"
          >
            <span>第 </span>
            <el-input-number
              :min="1"
              :max="20"
              :step="1"
              size="mini"
              v-model="props.leaderLevel"
            ></el-input-number>
            <span> 级主管</span>
          </div>
        </el-form-item>
      </div>

      <div v-if="showUserEmpty">
        <el-divider></el-divider>
        <el-form-item label="审批人为空时" prop="text" class="approve-mode">
          <el-radio-group v-model="props.userEmpty">
            <el-radio :label="enumConst.userEmpty.TO_PASS">自动通过</el-radio>
            <el-radio :label="enumConst.userEmpty.TO_ADMIN">自动转交管理员</el-radio>
            <el-radio :label="enumConst.userEmpty.TO_USER">转交到指定人员</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <!-- 设计表单 -->
    <div v-if="['TJ', 'CS'].indexOf(selectedNode.type) == -1" class="node-form-design">
      <el-divider></el-divider>
      <div class="node-form-design-item">
        <b>表单设计</b>
        <el-radio-group v-if="selectedNode.type !='ROOT'" v-model="nodeForm.sendUserForm">
          <el-radio :label="true">使用发起人表单</el-radio>
          <el-radio :label="false">自定义表单</el-radio>
        </el-radio-group>
        <jvs-button v-if="!nodeForm.sendUserForm || this.selectedNode.type =='ROOT'" type="text" @click="onlineDesign">在线设计</jvs-button>
        <jvs-button v-if="nodeForm && nodeForm.formId" type="text" @click="cancelDesign">取消设计</jvs-button>
      </div>
    </div>

    <!-- 选择人员 -->
    <userSelector ref="processUserSelector" :selectable="true" :autoClose="true" :deptable="selectedNode.type == 'ROOT' ? true : false" @submit="submitHandle"></userSelector>
  </div>
</template>

<script>
import condition from "./condition";
import enumConst from "../common/enumConst";
import draggable from "vuedraggable";
import userSelector from '@/components/basic-assembly/userSelector'

export default {
  name: "nodeConfig",
  components: { draggable, condition, userSelector },
  props: {
    node: {
      default: () => {
        return {};
      },
      type: Object,
    },
    // 工作流信息
    infoData: {
      type: Object
    },
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      enumConst: enumConst,
      select: [],
      approval: [],
      approvalType: [
        { label: enumConst.approvalType.ASSIGN_USER, text: "指定人员" },
        { label: enumConst.approvalType.SELF_SELECT, text: "发起人自选" },
        { label: enumConst.approvalType.LEADER_TOP, text: "连续多级主管", disabled: true },
        { label: enumConst.approvalType.LEADER, text: "主管", disabled: true },
        { label: enumConst.approvalType.ROLE, text: "角色" },
        { label: enumConst.approvalType.SELF, text: "发起人自己" },
      ],
      timeoutEvents: [
        { event: enumConst.timeoutEvent.PASS, name: "自动通过" },
        { event: enumConst.timeoutEvent.REFUSE, name: "自动拒绝" },
        { event: enumConst.timeoutEvent.NOTIFY, name: "发送提醒" },
      ],
      roleList: [], // 选择角色
    };
  },
  computed: {
    selectedNode() {
      // console.log(this.$store.state.flow.selectedNode)
      return this.$store.state.flow.selectedNode;
    },
    getNowNodeIndex() {
      for (let i = 0; i < this.prioritySortList.length; i++) {
        if (this.selectedNode.id === this.prioritySortList[i].id) {
          return i;
        }
      }
      return 0;
    },
    prioritySortList() {
      return this.$store.state.flow.parentMap.get(this.selectedNode.pid).conditions || [];
    },
    conditionGroups() {
      return this.$store.state.flow.parentMap.get(this.selectedNode.pid);
    },
    isRootNode() {
      return this.selectedNode.type === enumConst.nodeType.ROOT;
    },
    isTjNode() {
      return this.selectedNode.type === enumConst.nodeType.TJ;
    },
    isCsNode() {
      return this.selectedNode.type === enumConst.nodeType.CS;
    },
    isSpNode() {
      return this.selectedNode.type === enumConst.nodeType.SP;
    },
    onlySelectUser() {
      return (
        this.selectedNode.type === enumConst.nodeType.CS ||
        this.selectedNode.type === enumConst.nodeType.SP ||
        this.props.type === "1"
      );
    },
    props() {
      return this.$store.state.flow.selectedNode.props;
    },
    showModel() {
      return (
        (this.props.targetObj.objs.length > 1 &&
          this.props.type === enumConst.approvalType.ASSIGN_USER) ||
        (this.props.type === enumConst.approvalType.SELF_SELECT &&
          this.props.targetObj.multiple) ||
        this.props.type === enumConst.approvalType.LEADER ||
        (this.props.type === enumConst.approvalType.ROLE &&
          this.props.targetObj.roles.length > 0)
      );
    },
    showUserEmpty() {
      return (
        this.props.type === enumConst.approvalType.LEADER_TOP ||
        this.props.type === enumConst.approvalType.LEADER
      );
    },
    nodeForm() {
      if(!this.$store.state.flow.selectedNode.nodeForm) {
        this.$set(this.$store.state.flow.selectedNode, 'nodeForm', {
          formId: "", // 表单id
          sendUserForm: true, // true--使用发起人表单，false-不使用发起人表单
          version: "" // 表单版本
        })
      }
      return this.$store.state.flow.selectedNode.nodeForm
    },
  },
  methods: {
    showRoot() {   
      return this.selectedNode.type === enumConst.nodeType.ROOT;
    },
    selected (select) {
      this.$store.commit(
        "selectedApprover",
        select.map((s) => {
          return { id: s.id, name: s.realName, type: s.type ? s.type : 'user' };
        })
      );
    },
    addConditionGroup () {
      if (this.selectedNode.groups.length < 5) {
        this.selectedNode.groups.push({
          connection: enumConst.logicType.OR,
          cids: [],
          condition: [],
        });
        this.$store.commit('selectedNode', this.selectedNode)
      } else {
        this.$message.warning("最多只允许添加5个条件组");
      }
      this.$forceUpdate()
    },
    // 选择成员
    chooseUser () {
      this.$refs.processUserSelector.openDialog()
      this.select = this.props.targetObj.objs
    },
    // 确定成员
    submitHandle (list) {
      this.selected(list)
    },
    // 选择角色
    roleChangeHandle () {
      let temp = []
      this.roleOption.map((s) => {
        if(this.roleList.indexOf(s.id) > -1) {
          temp.push({ id: s.id, name: s.roleName, type: s.type})
        }
      })
      this.$store.commit( "selectedRole", temp)
    },
    // 在线设计
    onlineDesign () {
      // 已有设计表单
      let formType = 'normalForm'
      if(this.selectedNode.type != 'ROOT') {
        formType = 'flowable'
      }
      if(this.nodeForm.formId) {
        this.$openUrl(`/page-design-ui/#/form?id=${this.nodeForm.formId}&dataModelId=${this.infoData.dataModelId}&formType=${formType}`, '_blank')
      }else{
        // 未设计过表单
        this.$emit('saveNodeDesign', this.selectedNode.id)
      }
    },
    // 取消设计
    cancelDesign () {
      this.$set(this.nodeForm, 'formId', '')
    }
  },
  watch: {
    selectedNode: {
      handler (newVal, oldVal) {
        this.roleList = []
        if(this.props.targetObj.roles && this.props.targetObj.roles.length > 0) {
          for(let i in this.props.targetObj.roles) {
            this.roleList.push(this.props.targetObj.roles[i].id)
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.node-config {
  padding: 0 20px;
  overflow-y: auto;

  ::v-deep .el-form {
    .el-form-item__label {
      font-size: 14px;
      color: #000;
    }

    .el-form-item {
      margin-bottom: 5px;
    }
  }
}

.select-user-type {
  ::v-deep .el-radio {
    width: 80px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

::v-deep .approve-mode {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

::v-deep .approve-end {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-top: 15px;
    width: 100%;
  }

  .el-radio:last-child {
    margin-top: 15px;
    width: 50px;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -10px;
    right: 20px;
  }
}

.select-u {
  width: 100%;
}

.group-connect {
  display: inline;
  margin-left: 50px;
  & > span {
    margin-right: 20px;
  }
}

.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #1890ff !important;
}

.drag-no-choose {
  cursor: move;
  background: #f4f4f4;
  border-radius: 5px;
  position: relative;
  margin-top: 2px;
  padding: 5px 10px;
  border: 1px solid #bcbcbc;
  height: 20px;
  div:nth-child(1) {
    font-size: x-small;
    position: absolute;
    width: 160px;
    left: 10px;
    height: 20px;
    overflow: hidden;
  }
  div:nth-child(2) {
    position: absolute;
    right: 10px;
  }
}

::v-deep .node-form-design{
  padding-bottom: 20px;
  h4{
    font-size: 14px;
    color: #000;
    font-weight: normal;
    line-height: 36px;
    height: 36px;
    margin: 0;
  }
  .node-form-design-item{
    b{
      display: block;
      font-size: 14px;
      color: #000;
      font-weight: normal;
      line-height: 36px;
      height: 36px;
      margin-right: 10px;
    }
    .el-button{
      padding: 0;
      margin-left: 10px;
      span{
        font-size: 14px;
      }
    }
  }
}
</style>
