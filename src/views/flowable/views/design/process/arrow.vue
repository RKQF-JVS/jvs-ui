<template>
  <div :class="{ arrow: true, borderTop: !showCard(node) }" ref="arrow">
    <div @click.stop="select" v-if="showCard(node)">
      <el-card shadow="always" :class="{'currentNode': node.currentNode}">
        <div slot="header" :class="node.type" style="height: 15px">
          <div class="node-name">
            <i :class="{'el-icon-s-check': node.type === nodeType.SP, 'el-icon-s-promotion': node.type === nodeType.CS}"></i>
            {{ node.name }}
          </div>
          <i class="el-icon-close" v-if="nodeType.ROOT !== node.type && !node.defaultCondition" @click.stop="delNode"></i>
          <el-tooltip effect="dark" content="复制条件" placement="top-start" v-if="!node.defaultCondition">
            <i class="el-icon-copy-document" v-if="nodeType.TJ === node.type"></i>
          </el-tooltip>
        </div>
        <span>{{ nodeText }}</span>
        <span v-if="node.currentNode" class="lightLine lightLine1"></span>
        <span v-if="node.currentNode" class="lightLine lightLine2"></span>
        <span v-if="node.currentNode" class="lightLine lightLine3"></span>
        <span v-if="node.currentNode" class="lightLine lightLine4"></span>
      </el-card>
    </div>
    <div class="line-y">
      <el-popover
        placement="bottom-start"
        width="350"
        trigger="click"
      >
        <p style="margin: 5px 0;text-indent: 10px;font-size: 18px;">添加流程节点</p>
        <div class="node-select">
          <div @click="addNode(nodeType.SP)">
            <i class="el-icon-s-check" style="color: rgb(255, 148, 62)"></i>
            <span>审批人</span>
          </div>
          <div @click="addNode(nodeType.CS)">
            <i class="el-icon-s-promotion" style="color: rgb(50, 150, 250)"></i>
            <span>抄送人</span>
          </div>
          <div @click="addNode(nodeType.TJ)">
            <i class="el-icon-share" style="color: rgb(21, 188, 131)"></i>
            <span>条件分支</span>
          </div>
        </div>
        <jvs-button icon="el-icon-plus" ref="bt" slot="reference" type="primary" size="small" circle></jvs-button>
      </el-popover>
    </div>
    <div class="jt" v-if="showArrow(node)"></div>
    <div class="add-tj" v-if="showAddTjBtn(node)" @click="addCd">添加条件</div>
  </div>
</template>

<script>
import { nodeType } from "../common/enumConst";
import { approvalType, endCondition } from "../common/enumConst";

export default {
  name: "arrow",
  props: {
    hasArrow: {
      default: true,
      type: Boolean,
    },
    node: {
      default: null,
      type: Object,
    },
    index: {
      default: null,
      type: Number,
    },
  },
  data() {
    return {
      nodeType: nodeType,
    };
  },
  computed: {
    nodeText() {
      let text = "",
        type = "",
        approval = this.node.props;
      if (this.node.type === nodeType.ROOT) {
        text = this.getUsersText(approval.targetObj.objs);
        text = text === "" ? "所有人" : text;
        type = "发起人";
      } else if (this.node.type === nodeType.SP) {
        switch (approval.type) {
          case approvalType.ASSIGN_USER:
            text = this.getUsersText(approval.targetObj.objs);
            break;
          case approvalType.SELF_SELECT:
            text = "发起人自选"; // （" + (approval.targetObj.multiple ? "多人）" : "一人）")
            break;
          case approvalType.LEADER_TOP:
            text = "连续多级主管(" + (approval.endCondition === endCondition.TOP ? "全部)" : approval.leaderLevel + "级)");
            break;
          case approvalType.LEADER:
            text = "发起人的" + (approval.leaderLevel === 1 ? "直接主管" : "第 " + approval.leaderLevel + " 级主管");
            break;
          case approvalType.ROLE:
            text =
              "角色- " + (approval.targetObj.roles.length > 0 ? String( approval.targetObj.roles.map((r) => { return r.name; }) ) : "请选择角色");
            break;
          case approvalType.SELF:
            text = "发起人自己";
            break;
        }
        type = "审批人";
      } else if (this.node.type === nodeType.TJ) {
        type = "审批条件";
        if(this.node.groups && this.node.groups.length > 0) {
          text = '修改审批条件'
        }
        if(this.node.defaultCondition) {
          text = '其他情况进入此流程'
        }
      } else if (this.node.type === nodeType.CS) {
        text = this.getUsersText(approval.targetObj.objs);
        type = "抄送人";
      } else {
        // console.log(this.node)
        return "未知节点";
      }
      if (text.lastIndexOf("、") !== -1) {
        text = text.substring(0, text.length - 1);
      } else if (text === "") {
        text = "请设置" + type;
      }
      return text.length > 24 ? text.substring(0, 24) + "..." : text;
    },
  },
  methods: {
    addNode (type) {
      this.$refs.arrow.click();
      this.$emit("addNode", type, this.node);
    },
    getUsersText(users) {
      let text = "";
      if (users === undefined || users === "") {
        users = [];
      }
      users.forEach((u) => {
        text = text + u.name + "、";
      });
      return text;
    },
    addCd() {
      this.$emit("addCd", this.node);
    },
    delNode() {
      this.$emit("delNode", this.node);
    },
    select () {
      if(this.node.defaultCondition) {
        return false
      }
      this.$store.commit("selectedNode", this.node);
      this.$emit("select", this.node);
    },
    showCard (node) {
      return (
        node !== null &&
        node !== undefined &&
        (node.type === nodeType.ROOT ||
          node.type === nodeType.SP ||
          node.type === nodeType.CS ||
          node.type === nodeType.TJ)
      );
    },
    showArrow(node) {
      return false && node;
    },
    showAddTjBtn(node) {
      return node.node !== undefined && node.node.conditions !== undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #EBEEF5!important;
  .el-card__body {
    height: 50px;
    overflow: hidden;
    padding: 0 20px !important;
    display: flex;
    align-items: center;
  }
}

.arrow {
  z-index: 555;
  position: relative;
  .add-tj {
    cursor: pointer;
    font-size: small;
    border-radius: 14px;
    padding: 8px 10px;
    color: rgb(21, 188, 131);
    width: 54px;
    left: calc(50% - 36px);
    bottom: -30px;
    background-color: #ffffff;
    position: absolute;
    box-shadow: 0 0 8px 2px #e5e5e5;
    &:hover {
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
  }
  .node-name {
    float: left;
    width: 158px;
    overflow: hidden;
    height: 17px;
  }
}
.arrow::before {
  content: "";
  z-index: -999;
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 2px;
  height: calc(100% + 4px);
  background-color: #cacaca;
}
.arrow {
  padding: 30px 0px;
  ::v-deep .el-card {
    margin: 0 auto;
    cursor: pointer;
    height: 77px;
    font-size: medium;
    width: 220px;

    .el-card__header {
      color: #ffffff;
      font-size: small;
      width: 100%;
      height: 25px;
      padding: 0;
    }
    .el-card__body {
      padding: 10px 20px;
      font-size: small;
    }
    .ROOT,
    .SP,
    .CS,
    .TJ {
      padding: 5px 10px;

      span {
        &:hover {
          text-decoration: underline;
        }
      }

      .el-icon-close,
      .el-icon-copy-document {
        display: none;
        float: right;
        margin-top: 2px;

        &:hover {
          font-size: 15px;
        }
      }
    }

    .ROOT {
      background-color: rgb(87, 106, 149);
    }

    .SP {
      background-color: rgb(255, 148, 62);
    }
    .CS {
      background-color: #1890ff;
    }
    .TJ {
      font-size: small;
      background-color: #ffffff;
      color: rgb(21, 188, 131);
      i {
        color: #818181;
      }
      i:last-child {
        margin-right: 10px;
      }
    }
    &:hover {
      border: 1px solid #1890FF!important;

      .el-icon-close,
      .el-icon-copy-document {
        display: inline;
      }
    }
  }
  .line-y {
    position: relative;
    height: 80px;
    margin: 0 auto;
    width: 0;
    //border: 1px solid #a9a9a9;

    button {
      position: absolute;
      top: 18px;
      right: -16px;

      &:hover {
        box-shadow: 0 0 10px 2px #c2c2c2;
      }
    }
  }

  .jt {
    border: 5px solid rgb(245, 246, 246);
    border-top-width: 10px;
    border-top-color: #a9a9a9;
    margin: 0 auto;
    width: 0;
    height: 0;
  }

  .currentNode {
    position: relative;
    text-transform: uppercase;
    transition: .5s;
    letter-spacing: 4px;
    padding: 4px;
    .lightLine{
      position: absolute;
      display: block;
    }
    .lightLine1 {
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg,transparent,#03e9f4);
      animation: animate1 1s linear infinite;
    }
    .lightLine2 {
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg,transparent,#03e9f4);
      animation: animate2 1s linear infinite;
      animation-delay: .25s;
    }
    .lightLine3 {
      bottom: 0;
      right: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(270deg,transparent,#03e9f4);
      animation: animate3 1s linear infinite;
      animation-delay: .5s;
    }
    .lightLine4 {
      bottom: -100%;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(360deg,transparent,#03e9f4);
      animation: animate4 1s linear infinite;
      animation-delay: .75s;
    }
  }
  .currentNode:hover{
    border-color: transparent!important;
  }
}

.bdl, .bdr {
  .arrow::before{
    height: calc(100% - 30px);
  }
}

.node-select {
  div {
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
    padding: 10px 15px;
    border: 1px solid #f8f9f9;
    background-color: #f8f9f9;
    border-radius: 10px;
    width: 130px;
    position: relative;
    span {
      position: absolute;
      left: 65px;
      top: 18px;
    }
    &:hover {
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    i {
      font-size: 25px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
}

::v-deep .el-popover__title{
  padding: 0 10px;
}

@keyframes animate1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}
@keyframes animate2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}
@keyframes animate3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}
@keyframes animate4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}
</style>
