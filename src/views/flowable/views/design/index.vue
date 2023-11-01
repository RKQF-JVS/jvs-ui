<template>
  <div class="process-design-box">
    <title-page-header class="process-design-header" title="流程设计" :hassave="false" :hasclose="hasclose" @close="emitClose">
      <template slot="left">
        <div class="cont-top">
          <div class="cont-top-item">
            <p>
              <!-- <svg aria-hidden="true" style="width:26px;height:26px;margin-top:3px;">
                <use :xlink:href="'#'+infoData.icon"></use>
              </svg> -->
              <img v-if="infoData && infoData.icon" :src="infoData.icon" alt="" style="width:26px;height:26px;margin-top:3px;">
            </p>
            <p v-if="infoData">{{infoData.name || infoData.name}}</p>
            <p v-if="infoData"><el-tag size="mini" :type="infoData.published ? '' : 'info'">{{infoData.published ? '已发布' : '未发布'}}</el-tag></p>
          </div>
        </div>
      </template>
      <template slot="right">
        <p v-if="infoData && infoData.designChanged" style="color: red;font-size:12px;">
          <span><i class="el-icon-warning-outline"></i> 流程已变更请及时发布</span>
        </p>
        <p>
          <el-tooltip effect="dark" content="设置" placement="top">
            <i class="el-icon-setting" style="cursor:pointer;font-size:20px;color:#353535;" @click="editProcess"></i>
          </el-tooltip>
        </p>
        <p>
          <el-tooltip v-show="saveLoading" effect="dark" content="保存" placement="top">
            <i class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
          </el-tooltip>
          <el-tooltip v-show="!saveLoading" effect="dark" content="保存" placement="top">
            <img :src="saveIcon" alt="" style="display:block;width:16px;height:16px;padding: 2px;" @click="saveClick">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="发布" placement="top">
            <i v-if="publishLoading" class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
            <i v-else class="el-icon-s-promotion" style="font-size:20px;color:#353535;cursor:pointer;" @click="publishClick"></i>
          </el-tooltip>
        </p>
      </template>
    </title-page-header>
    <div class="scale">
      <jvs-button icon="el-icon-plus" size="mini" @click="scale += 10" :disabled="scale >= 150" circle></jvs-button>
      <span>{{ scale }}%</span>
      <jvs-button icon="el-icon-minus" size="mini" @click="scale -= 10" :disabled="scale <= 100" circle ></jvs-button>
    </div>
    <div class="design" :style="'transform: scale(' + scale / 100 + '); transform-origin: 50% 0px 0px; width: 100%;height: calc(100vh - ' + (((scale - 100) / 10 + 1) * 68) + 'px);'">
      <process @select="selectNode"></process>
      <el-row>
        <div class="end">
          <div></div>
          <div></div>
          <div class="end-node">流程结束</div>
        </div>
      </el-row>
    </div>
    <el-drawer
      :title="select.name"
      :visible.sync="drawer"
      :size="nodeType.TJ === select.type ? '600px' : '400px'"
      direction="rtl"
      :modal="false"
    >
      <div slot="title">
        <el-input
          v-model="select.name"
          size="medium"
          v-if="showInput"
          style="width: 300px"
          @blur="showInput = false"
        ></el-input>
        <el-link v-else @click="showInput = true" style="font-size: medium">
          <i class="el-icon-edit" style="margin-right: 10px"></i> {{ select.name }}
        </el-link>
      </div>
      <node-config :node="select" :infoData="infoData" :roleOption="roleOption" @saveNodeDesign="saveDesignData"></node-config>
    </el-drawer>
    <!-- 编辑 -->
    <el-dialog
      width="60%"
      :visible.sync="dialogVisible"
      append-to-body
      :modal="true"
      :before-close="handleClose"
      title="设置"
    >
      <jvs-form v-if="dialogVisible" style="padding: 0 80px;" :option="formOption" :formData="formData" @submit="modelInfoSubmit">
        <template slot="iconForm">
          <div class="icon-image">
            <img v-if="formData.icon" :src="formData.icon" alt="">
            <el-button v-if="!formData.icon" size="mini" @click="handleFocus">选择图标</el-button>
            <i v-if="formData.icon" class="el-icon-delete" @click="formData.icon = ''"></i>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 选图片 -->
    <ImageSelect
      :dialogVisible="iconVisible"
      :title="'选择图标'"
      :defaultLabel="defaultLabel"
      @handleClose="iconClose"
      @handleConfirm="handleConfirm"
    />
  </div>
</template>

<script>
import process from "./process/processView";
import nodeConfig from "./process/nodeConfig";
import { nodeType, getDefaultNodeProps } from "./common/enumConst";
import saveicon from "@/const/img/保存.png"
import {editModel, designModel, getModelDetail, deployProcess, flowableType} from '../../api/flowable'
import {getRoleList} from '@/components/api'
import ImageSelect from "../../../chart/components/imageSelect/ImageSelect";

export default {
  name: "processDesign",
  components: { process, nodeConfig, ImageSelect },
  props: {
    rowData: {
      type: Object
    }
  },
  computed: {
    template() {
      return this.$store.state.flow.template
    }
  },
  data() {
    return {
      hasclose: false,
      nodeType: nodeType,
      select: {},
      showInput: false,
      drawer: false,
      scale: 100,
      nodes: [],
      infoData: {},
      saveLoading: false, // 保存loading
      saveIcon: saveicon,
      dialogVisible: false,
      formData: {},
      formOption: {
        cancal: false,
        labelWidth: '80px',
        submitLoading: false,
        column: [
          {
            label: '流程名称',
            prop: 'name',
            search: true,
            showwordlimit: true,
            maxlength: 12,
            rules: [
              { required: true, message: '请输入流程名称', trigger: 'blur' },
            ],
            tips:{
              position: 'bottom',
              text: '流程名称建议使用12字内，请使用中文,默认情况下，业务对接工作流时使用'
            }
          },
          {
            label: '流程分组',
            prop: 'designGroup',
            type: 'select',
            dicData: [],
            filterable: true,
            allowcreate: true,
            defaultValue: '未分类',
            showwordlimit: true,
            maxlength: 12,
            tips:{
              position: 'bottom',
              text: '可以输入类型，或选择已经存在的分组'
            }
          },
          {
            label: '流程图标',
            prop: 'icon',
            type: 'iconSelect',
            iconType: 'svg',
            formSlot: true
          },
          {
            label: '终止模式',
            prop: 'enableCancel',
            type: 'radio',
            defaultValue: false,
            dicData: [
              {label: '允许申请人强制终止流程', value: true},
              {label: '禁止申请人强制终止流程', value: false}
            ],
            tips:{
              position: 'bottom',
              text: '申请人可以在流程流转到任何节点时进行强制终止，终止后将不能继续流转'
            }
          }
        ]
      },
      roleOption: [], // 角色列表
      publishLoading: false, // 发布loading
      defaultLabel: '',
      iconVisible: false,
    };
  },
  created () {
    if(this.$route.query) {
      if(this.$route.query.id) {
        this.getDetail(this.$route.query.id)
      }
    }else{
      if(this.rowData) {
        this.hasclose = true
        this.infoData = JSON.parse(JSON.stringify(this.rowData))
      }
    }
    this.getFlowableType()
    this.getRoleHandle() // 获取角色列表
  },
  methods: {
    // 获取工作流详情
    getDetail (id) {
      getModelDetail(id).then(res => {
        if(res.data.code == 0) {
          this.infoData = res.data.data
          if(res.data.data && res.data.data.designing && res.data.data.designing != '') {
            let data = JSON.parse(res.data.data.designing)
            this.$store.commit("setIsEdit", true);
            this.$store.commit("setTemplate", this.getTemplateData(data, res.data.data.designGroup));
          }else{
            this.$store.commit("setIsEdit", true);
            this.$store.commit("setTemplate", this.getTemplateData());
          }
          this.$forceUpdate()
        }
      })
    },
    // 选择节点
    selectNode(node) {
      this.select = node;
      this.drawer = true;
    },
    // 保存设计
    saveClick () {
      this.saveLoading = true
      this.saveDesignData()
    },
    // 保存
    saveDesignData (nodeId) {
      let temp = {
        id: this.infoData.id,
        design: this.template.process
      }
      if(nodeId) {
        temp.nodeId = nodeId
      }
      designModel(temp).then(res => {
        if(res.data && res.data.code == 0) {
          this.saveLoading = false
          if(nodeId) {
            if(res.data.data && typeof res.data.data == 'string') {
              this.$set(this.select.nodeForm, 'formId', res.data.data)
              let formType = 'normalForm'
              if(this.select.type != 'ROOT') {
                formType = 'flowable'
              }
              this.$openUrl(`/page-design-ui/#/form?id=${res.data.data}&dataModelId=${this.infoData.dataModelId}&formType=${formType}`, '_blank')
            }
          }else{
            this.$message.success('保存成功')
          }
          this.getDetail(this.infoData.id)
        } else {
          this.saveLoading = false
        }
      }).catch(err => {
        this.saveLoading = false
      })
    },
    // 通知关闭
    emitClose (bool) {
      this.$emit('close', bool)
    },
    // 编辑工作流
    editProcess () {
      if(this.infoData) {
        if(this.infoData.extend) {
          this.infoData.enableCancel = this.infoData.extend.enableCancel
        }
        this.formData = JSON.parse(JSON.stringify(this.infoData))
      }
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.formData = {}
    },
    // 模型数据 修改
    modelInfoSubmit () {
      this.formOption.submitLoading = true
      this.editRowHandle(this.infoData)
    },
    // 编辑工作流
    editRowHandle (form) {
      let temp = JSON.parse(JSON.stringify(this.formData))
      if(!temp.extend) {
        temp.extend = {
          enableCancel: this.formData.enableCancel
        }
      }else{
        this.$set(temp.extend, 'enableCancel', this.formData.enableCancel)
      }
      editModel(temp).then(res => {
        if(res.data.code == 0) {
          this.formOption.submitLoading = false
          this.$message.success('修改基本信息成功')
          this.$set(this, 'infoData', temp)
          this.handleClose()
        }else{
          this.formOption.submitLoading = false
        }
      }).catch(e => {
        this.formOption.submitLoading = false
      })
    },
    // 设计数据结构
    getTemplateData (data, group){
      return {
        id: this.$getDefalut(data, 'templateId', data ? data.id : null),
        baseSetup: {
          icon: this.$getDefalut(data, 'icon', 'el-icon-s-custom'),
          background: this.$getDefalut(data, 'background', '#FF7800'),
          name: this.$getDefalut(data, 'templateName', '未命名的表单'),
          group: this.$getDefalut(group, 'id', ''),
          sign: this.$getDefalut(data, 'sign', false),
          remark: this.$getDefalut(data, 'remark', ''),
          notify: JSON.parse(this.$getDefalut(data, 'notify', JSON.stringify({types:[], title:''}))),
          whoCommit: JSON.parse(this.$getDefalut(data, 'whoCommit', '[]')),
          whoEdit: JSON.parse(this.$getDefalut(data, 'whoEdit', '[]')),
          whoExport: JSON.parse(this.$getDefalut(data, 'whoExport', '[]')),
        },
        form: [],
        process: data ? data : {
          type: nodeType.ROOT,
          name: '发起人',
          id: '10000',
          props: getDefaultNodeProps(),
          // 节点表单参数配置
          nodeForm:{
            formId: "", // 表单id
            sendUserForm: true, // true--使用发起人表单，false-不使用发起人表单
            version: "" // 表单版本
          }
        },
      }
    },
    getRoleHandle () {
      getRoleList().then(res => {
        if(res.data.code == 0) {
          this.roleOption = res.data.data
        }
      })
    },
    // 发布
    publishClick () {
      this.$confirm('确认发布流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.publishLoading = true
        deployProcess(this.infoData.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("发布成功")
            this.publishLoading = false
            this.getDetail(this.infoData.id)
          }
        })
      }).catch(() => {});
    },
    // 选择图标的图片
    handleFocus() {
      this.defaultLabel = '工作流'
      this.iconVisible = true
    },
    iconClose () {
      this.iconVisible = false
      this.defaultLabel = '工作流'
    },
    // 确认选择
    handleConfirm(obj) {
      this.$set(this.formData, 'icon', obj.fileLink)
      this.iconClose()
    },
    // 流程分类列表
    getFlowableType () {
      flowableType().then(res => {
        if(res.data.code == 0) {
          let typeList = res.data.data
          let dicTemp = []
          for(let i in typeList) {
            dicTemp.push({label: typeList[i], value: typeList[i]})
          }
          this.formOption.column.filter(item => {
            if(item.prop == 'designGroup') {
              item.dicData = dicTemp
            }
          })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #e1e1e1;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #99999a;
}

.design {
  height: calc(100vh - 53px);
  box-sizing: border-box;
  padding-top: 25px;
  overflow: hidden;
  overflow: auto;
  ::v-deep .el-row {
    display: flex;
    justify-content: center;

    .end {
      .end-node {
        margin-top: 18px;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: small;
        color: #747474;
        background-color: #f2f2f2;
        box-shadow: 0 0 10px 0 #bcbcbc;
        margin-bottom: 10px;
      }
    }
  }
}

::v-deep .el-link {
  display: inline;
  width: 50px;
}

::v-deep .el-drawer__body {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #e1e1e1;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #a8a8a9;
  }
}

.scale {
  z-index: 999;
  position: fixed;
  top: 80px;
  right: 40px;

  span {
    margin: 0 10px;
    font-size: 15px;
    color: #7a7a7a;
    width: 50px;
  }
}
.icon-image{
  display: flex;
  align-items: center;
  position: relative;
  img{
    display: block;
    width: 120px;
    height: 120px;
    margin-right: 10px;
  }
  .el-icon-delete{
    position: absolute;
    top: 0;
    left: 100px;
    color: red;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.process-design-header{
  margin-top: 0;
  overflow: hidden;
  .pageheader-top{
    height: 100%;
    background: #fff;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    .right-box{
      p{
        i{
          font-size: 20px;
        }
      }
    }
  }
}
.process-design-box{
  padding: 8px 10px;
  background: #f0f2f5;
  .cont-top {
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #606266;
    background: #fff;
    // margin-top: 8px;
    // padding: 8px 0;
    border-radius: 5px;
    .cont-top-item {
      display: flex;
      justify-content: space-between;
      p {
        margin: 0 10px;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .design{
    background: #fff;
    height: calc(100vh - 69px);
    margin-top: 8px;
    padding-top: 15px;
  }
}
</style>
