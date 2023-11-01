<template>
  <div class="flowable-index">
    <jvs-table
      pageheadertitle='流程设计'
      :option="option"
      :data="tableData"
      :page="page"
      :loading="tableLoading"
      @on-load="getList"
      @search-change="searchHandle"
    >
      <template slot="menuLeft">
        <el-row style="display:flex;align-items:center;">
          <jvs-button size="mini" type="primary" @click="designRowHandle(null, 'add')">新增</jvs-button>
          <div style="display:flex;align-items:center;margin-left: 20px;">
            <span style="word-break:keep-all;margin-right: 10px;">流程名称</span>
            <el-input size="mini" v-model="queryParams.name"></el-input>
          </div>
          <div style="display:flex;align-items:center;margin-left:20px;">
            <jvs-button type="primary" size="mini" @click="searchHandle(queryParams)">查询</jvs-button>
            <jvs-button size="mini" @click=" () => { queryParams.name = '' }">重置</jvs-button>
          </div>
        </el-row>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button type="text" size="mini" @click="designRowHandle(scope.row, 'edit')">编辑</jvs-button>
        <jvs-button type="text" size="mini" @click="designRowHandle(scope.row, 'design')">设计</jvs-button>
        <jvs-button type="text" size="mini" @click="deployHandle(scope.row)">发布</jvs-button>
        <jvs-button type="text" size="mini" @click="deleteRowHandle(scope.row)">删除</jvs-button>
      </template>
    </jvs-table>
    <div class="table-left-tree">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>

    <!-- 设置 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :width="dialogType == 'design' ? '100%' : '60%'"
      :fullscreen="dialogType == 'design' ? true : false"
      :class="{'dom-set-dialog': dialogType == 'design'}"
      append-to-body
      :modal="dialogType == 'design' ? false : true"
      :before-close="handleClose"
      :title="dialogType == 'edit' ? '编辑' : (dialogType == 'add' ? '新增' : '设计')"
    >
      <!-- 设计 -->
      <processDesign v-if="dialogType == 'design'" :rowData="rowData" @close="handleClose"></processDesign>
      <!-- 新增  修改 -->
      <jvs-form v-if="dialogType == 'edit' || dialogType == 'add'" style="padding: 0 80px;" :option="formOption" :formData="rowData" @submit="modelInfoSubmit">
        <template slot="iconForm">
          <div class="icon-image">
            <img v-if="rowData.icon" :src="rowData.icon" alt="">
            <el-button v-if="!rowData.icon" size="mini" @click="handleFocus">选择图标</el-button>
            <i v-if="rowData.icon" class="el-icon-delete" @click="rowData.icon = ''"></i>
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
import {client_id} from '@/const/const'
import {getModelList, createModel, editModel, deleteModel, getModelDetail, deployProcess, suspendProcess, flowableType} from '../api/flowable'
import processDesign from './design/index'
import {nodeType, getDefaultNodeProps} from './design/common/enumConst'
import ImageSelect from "../../chart/components/imageSelect/ImageSelect";
export default {
  name: 'flowable-index',
  components: {processDesign, ImageSelect},
  data(){
    return {
      dialogVisible: false,
      // 查询条件
      queryParams: {},
      tableData: [], // 表格数据
      tableLoading: false,
      option: {
        align: 'center',
        menuAlign: 'center',
        page: true,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        showOverflow: true,
        // search: true,
        searchBtnText: '查询',
        cancal: false,
        menuWidth: 200,
        column: [
          {
            label: 'ID',
            prop: 'id',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicUrl: `/mgr/jvs-design/JvsApp/all`,
            clearable: true,
            props: {
              label: 'name',
              value: 'id'
            },
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
          {
            label: '流程名称',
            prop: 'name',
            // search: true,
            searchSpan: 6,
            rules: [
              { required: true, message: '请输入流程名称', trigger: 'blur' },
            ]
          },
          {
            label: '流程状态',
            prop: 'published',
            dicData: [
              {label: '已发布', value: true},
              {label: '未发布', value: false}
            ],
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '创建人',
            prop: 'createBy',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '创建时间',
            prop: 'createTime',
            datetype: 'datetime',
            type: "datePicker",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '最近更新人',
            prop: 'updateBy',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            datetype: 'datetime',
            type: "datePicker",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '分类',
            prop: 'designType',
            type: 'select',
            hide: true,
            dicData: [],
            filterable: true,
            allowcreate: true,
            defaultValue: '未分类'
          },
          {
            label: '图标',
            prop: 'icon',
            type: 'iconSelect',
            hide: true
          },
          {
            label: '是否允许申请人强制终止流程',
            prop: 'enableCancel',
            type: 'radio',
            hide: true,
            defaultValue: false,
            dicData: [
              {label: '允许', value: true},
              {label: '禁止', value: false}
            ]
          }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      rowData: {},
      formFields: [],
      treeData: [], // 流程分类
      flowType: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogType: '',
      formOption: {
        cancal: false,
        labelWidth: '80px',
        submitLoading: false,
        column: [
          {
            label: "所属应用",
            prop: "jvsAppId",
            type: 'select',
            dicUrl: `/mgr/jvs-design/JvsApp/all`,
            clearable: true,
            props: {
              label: 'name',
              value: 'id'
            },
            rules: [
              { required: true, message: '请选择应用', trigger: 'blur' }
            ],
          },
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
      defaultLabel: '',
      iconVisible: false,
    }
  },
  methods: {
    // 获取数据
    getList (page) {
      let temp = JSON.parse(JSON.stringify(this.queryParams))
      temp.filterText = temp.name
      temp.current = this.page.currentPage || 1
      temp.size = this.page.pageSize
      if(this.flowType) {
        if(this.flowType !== '全部分类') {
          temp.designGroup = this.flowType
        }
      }
      this.tableLoading = true
      getModelList(temp).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.tableLoading=false
          this.page.total=res.data.data.total
          this.page.currentPage=res.data.data.current
        }
      })
    },
    // 搜索
    searchHandle (form) {
      this.queryParams = form
      this.getList()
      this.getFlowableType()
    },
    // 模型数据 新增 修改
    modelInfoSubmit () {
      if(this.dialogType == 'add') {
        this.addRowHandle(this.rowData)
      }
      if(this.dialogType == 'edit') {
        this.editRowHandle(this.rowData)
      }
    },
    // 新增
    addRowHandle (form) {
      let temp = JSON.parse(JSON.stringify(form))
      if(!temp.extend) {
        temp.extend = {
          enableCancel: form.enableCancel
        }
      }else{
        this.$set(temp.extend, 'enableCancel', form.enableCancel)
      }
      this.formOption.submitLoading = true
      createModel(temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
          this.getFlowableType()
          this.handleClose()
          this.formOption.submitLoading = false
        }
      }).catch(e => {
        this.formOption.submitLoading = false
      })
    },
    // 编辑
    editRowHandle (form) {
      let temp = JSON.parse(JSON.stringify(form))
      if(!temp.extend) {
        temp.extend = {
          enableCancel: form.enableCancel
        }
      }else{
        this.$set(temp.extend, 'enableCancel', form.enableCancel)
      }
      this.formOption.submitLoading = true
      editModel(temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('修改成功')
          this.getList()
          this.getFlowableType()
          this.handleClose()
          this.formOption.submitLoading = false
        }
      }).catch(e => {
        this.formOption.submitLoading = false
      })
    },
    // 设计
    designRowHandle (row, type) {
      if(row) {
        // 编辑
        if(type == 'edit') {
          if(row.extend) {
            this.$set(row, 'enableCancel', row.extend.enableCancel)
          }
        }
        // 设计
        if(type == 'design') {
          this.getDetail(row)
        }
        this.rowData = JSON.parse(JSON.stringify(row))
      }else{
        this.rowData = {}
        if(type == 'design') {
          this.$store.commit("setIsEdit", false);
          this.$store.commit("setTemplate", this.getTemplateData());
        }
      }
      this.dialogType = type
      if(type != 'design') {
        this.dialogVisible = true
      }
    },
    // 获取详情
    getDetail (row) {
      // 跳转设计
      this.$openUrl(`/flowable-ui/#/processDesign?id=${row.id}`, '_blank')
      
      // 弹框设计
      // getModelDetail(row.id).then(res => {
      //   if(res.data.code == 0) {
      //     if(res.data.data.design && res.data.data.design != '') {
      //       let data = JSON.parse(res.data.data.design)
      //       this.$store.commit("setIsEdit", true);
      //       this.$store.commit("setTemplate", this.getTemplateData(data, res.data.data.designGroup));
      //     }else{
      //       this.$store.commit("setIsEdit", true);
      //       this.$store.commit("setTemplate", this.getTemplateData());
      //     }
      //     this.dialogVisible = true
      //   }
      // })
    },
    // 删除
    deleteRowHandle (row) {
      this.$confirm('确认删除？').then(_ => {
        deleteModel(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getList()
            this.getFlowableType()
          }
        })
      }).catch(_ => {})
    },
    // 发布
    deployHandle (row) {
      this.$confirm('确认发布流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deployProcess(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("发布成功")
            this.getList()
            this.getFlowableType()
          }
        })
      }).catch(() => {});
    },
    // 挂起
    suspendHandle (row) {
      this.$confirm('确认挂起流程？').then(_ => {
        suspendProcess(row.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("流程挂起成功")
            this.getList()
            this.getFlowableType()
          }
        })
      }).catch(_ => {})
    },
    handleClose () {
      this.dialogVisible = false
      this.rowData = null
    },
    closeHandle (bool) {
      this.handleClose()
    },
    // 流程分类列表
    getFlowableType () {
      flowableType().then(res => {
        if(res.data.code == 0) {
          let typeList = res.data.data
          let temp = [{label: '全部分类'}]
          let dicTemp = []
          for(let i in typeList) {
            temp.push({
              label: typeList[i]
            })
            dicTemp.push({label: typeList[i], value: typeList[i]})
          }
          this.treeData = temp
          this.option.column.filter(item => {
            if(item.prop == 'designGroup') {
              item.dicData = dicTemp
            }
          })
          this.formOption.column.filter(item => {
            if(item.prop == 'designGroup') {
              item.dicData = dicTemp
            }
          })
        }
      })
    },
    handleNodeClick (data) {
      this.flowType = data.label
      this.getList()
    },
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
      this.$set(this.rowData, 'icon', obj.fileLink)
      this.iconClose()
    },
  },
  created () {
    this.getFlowableType()
  }
}
</script>
<style lang="scss" scoped>
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
.dom-set-dialog{
  >.el-dialog{
    overflow: hidden;
    .el-dialog__header{
      padding: 0;
      display: none!important;
    }
    .el-dialog__body{
      padding: 0;
      height: 100%;
      .flowable-designer{
        padding: 8px 10px;
        box-sizing: border-box;
        .title-page-header{
          margin-top: 0;
        }
        .design-box{
          margin-top: 10px;
          height: calc(100vh - 74px);
        }
      }
    }
  }
}
.flowable-index{
  position: relative;
  .table-left-tree{
    position: absolute;
    width: 250px;
    left: 0;
    // top: 94px;
    top: 72px;
    overflow: hidden;
    //height: calc(100% - 94px);
    height: calc(100% - 72px);
    overflow: hidden;
    border-right: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-left: 20px;
    box-sizing: border-box;
    .el-tree{
      box-sizing: border-box;
      height: 100%;
      background: #fff;
      overflow: hidden;
      overflow-y: auto;
    }
    .el-tree::-webkit-scrollbar{
      display: none;
    }
    .el-tree-node.is-current{
      >.el-tree-node__content{
        background-color: #F5F7FA;
      }
    }
  }
  .el-table{
    margin-left: 250px;
    width: calc(100% - 250px);
  }
}
</style>
