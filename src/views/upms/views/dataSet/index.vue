<template>
  <div class="data-set">
    <jvs-table
      :loading="tableLoading"
      :page="page"
      :option="dataPageOption"
      :data="dataPageList"
      @on-load="getDataModelList"
      @search-change="searchChange"
    >
      <template slot="name" slot-scope="scope">
        <span>
          <span v-if="!scope.row.dataModelNameEditShow">{{scope.row.name}}</span>
          <i class="el-icon-edit" v-if="!scope.row.dataModelNameEditShow" style="margin-left:5px;cursor:pointer;" @click.stop="editName(scope.row, scope.index)"></i>
          <el-input v-show="scope.row.dataModelNameEditShow" :ref="'editDataModelName'+scope.index" size="mini" v-model="dataModelNameEdit" @blur="editNameSub"></el-input>
        </span>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button v-if="scope.row.fieldList && scope.row.fieldList.length > 0" size="mini" type="text" @click="handleDetail(scope.row)">详情</jvs-button>
        <jvs-button size="mini" type="text" @click="handleDelete(scope.row)"><span style="color: #F56C6C;">删除</span></jvs-button>
      </template>
<!--      <template slot="menuLeft" slot-scope="scope">-->
<!--        <jvs-button type="primary" @click="syncDataModel">同步数据模型</jvs-button>-->
<!--      </template>-->
    </jvs-table>
    <!-- 数据集详情 -->
    <el-dialog
      title="数据集详情"
      append-to-body
      :visible.sync="dataModelDialog"
      :before-close="dataModelClose"
    >
      <div style="margin-bottom: 16px; color: #a2a3a5;">提示：索引最多10个</div>
      <jvs-table class="hide-top-jvs-table" :option="fieldOption" :data="fieldList">
        <template slot="menu" slot-scope="scope">
          <jvs-button size="mini" type="text" @click="addIndex(scope.row)">添加索引</jvs-button>
        </template>
        <template slot="indexBoolean" slot-scope="scope">
          {{scope.row.indexBoolean ? '是' : '否'}}
        </template>
      </jvs-table>
    </el-dialog>
    <!-- 同步数据模型 -->
    <el-dialog
      title="同步模型"
      class="step-dialog"
      width="900px"
      append-to-body
      :visible.sync="syncDialog"
      :before-close="syncClose"
    >
      <div style="padding: 0 80px">
        <!-- 步骤条 -->
        <stepBar
          v-if="syncDialog"
          :formRef="'ruleForm'"
          :active="stepItem.activeName"
          :formItem="stepItem"
          :validate="validate"
          :forms="stepForms[stepItem.prop]"
          :option="{column: stepItem.dicData}"
          :originOption="formOption"
          :originForm="stepForms"
          @customHandle="customHandle"
          @nextHandle="nextHandle"
        >
          <template slot="first">
            <div class="step-content">
              <el-form ref="stepForm" size="mini" :model="formData" :rules="rules" label-position="top" class="demo-form-inline">
                <el-form-item label="IP地址" prop="ip">
                  <el-input v-model="formData.ip" placeholder="请输入IP地址"></el-input>
                </el-form-item>
                <el-form-item label="库名" prop="database">
                  <el-input v-model="formData.database" placeholder="请输入库名"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="username">
                  <el-input v-model="formData.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template slot="second">
            <div class="step-content">
              <el-table
                ref="multipleTable"
                :data="tableData"
                border
                tooltip-effect="dark"
                style="width: auto"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="tableName"
                  label="表名">
                </el-table-column>
                <el-table-column
                  prop="info"
                  label="别名"
                  show-overflow-tooltip
                >
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template slot="third">
            <div class="step-content">
              <div class="step-process">
                <el-progress :text-inside="true" :stroke-width="26" :percentage="proportion"></el-progress>
              </div>
              <div class="step-process-text">{{syncMessage}}</div>
            </div>
          </template>
        </stepBar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addIndexField, getMysql, getSyncProcess, syncData} from "@/components/template/api";
import {getDataModel, deleteDataModel} from './api'
import {editModelName} from "@/components/api";
import StepBar from "@/components/basic-assembly/stepBar";
import {encryption} from "@/util/util";
import {enCodeKey, enCodePasswordKey} from "@/const/const";

export default {
  name: "dataSet",
  components: {StepBar},
  props: {
    appInfo: {
      type: Object
    }
  },
  data () {
    return {
      proportion: 0,
      syncMessage: '正在进行同步',
      tableData: [],
      formData: {
        // ip: '10.0.0.38:3306',
        // database: 'jvs',
        // username: 'root',
        // password: 'root'
      },
      rules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
        ],
        database: [
          { required: true, message: '请输入库名', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      stepForms: {
        demo1: {
          first: {},
          second: {}
        }
      },
      stepItem: {
        label: "",
        prop: "demo1",
        type: "step",
        activeName: "first",
        dicData: [
          {
            label: "配置数据源",
            name: "first",
            btns: [{name: "下一步", type: "next"}]
          }, {
            label: "选择同步数据表",
            name: "second",
            btns: [{name: "上一步", type: "last"}, {name: '同步', type: 'custom'}]
          }, {
            label: "同步结果",
            name: "third",
            // btns: [{name: "上一步", type: "last"}]
          }
        ],
        column: {}
      },
      formOption: {
        submitBtn: false,
        emptyBtn: false,
        cancal: false,
        column: [
          {
            label: "",
            prop: "demo1",
            type: "step",
            activeName: "first",
            dicData: [
              {
                label: "配置数据源",
                name: "first",
                btns: [{name: "下一步", type: "next"}]
              }, {
                label: "选择同步数据表",
                name: "second",
                btns: [{name: "上一步", type: "last"}]
              }, {
                label: "同步结果",
                name: "third",
                btns: [{name: "上一步", type: "last"}]
              }
            ],
          }
        ]
      },
      validate: false,
      dataModelDialog: false,
      syncDialog: false,
      syncing: false,
      dataModelRow: null,
      fieldList: [],
      fieldOption: {
        addBtn: false,
        search: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        hideTop: false,
        column: [
          {
            label: '字段名',
            prop: 'fieldKey'
          },
          {
            label: '是否有索引',
            prop: 'indexBoolean',
            slot: true
          },
          {
            label: '说明',
            prop: 'fieldName'
          }
        ]
      },
      tableLoading: false,
      dataModelNameEdit: '',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      dataPageList: [], // 数据集列表数据
      dataPageOption: {
        addBtn: false,
        search: false,
        viewBtn: false,
        editBtn: false,
        page: true,
        delBtn: false,
        hideTop: false,
        column: [
          {
            label: '名称',
            prop: 'name',
            width: 200,
            slot: true
          },
          {
            label: '创建时间',
            prop: 'createTime',
            dateType: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
          {
            label: '编号',
            prop: 'id'
          },
        ]
      }, // 数据集列表配置
      tableNames: [],
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.tableNames = val.map(item => {
        return item.tableName
      })
    },
    nextHandle(callback) {
      this.$refs.stepForm.validate((valid) => {
        if (valid) {
          let tp = {
            data: JSON.stringify(this.formData)
          }
          let temp = encryption({
            data: tp,
            key: enCodePasswordKey,
            param: ["data"]
          });
          const params = {
            body: temp.data,
          }
          getMysql(params, this.appInfo.id).then(res => {
            if (res.data && res.data.code == 0 && res.data.data) {
              this.tableData = [...res.data.data]
            }
          })
          callback(true)
        } else {
          callback(false)
        }
      });
    },
    customHandle(callback) {
      if (this.tableNames.length === 0) {
        this.$message.warning('请勾选需要同步的表')
        callback(false)
      } else {
        this.syncing = true
        syncData(this.tableNames, this.appInfo.id).then(res => {
          if (res.data && res.data.code == 0) {
            this.getSyncProcess()
          }
        })
        callback(true)
      }
    },
    getSyncProcess() {
      getSyncProcess(this.appInfo.id).then(res => {
        if (res.data && res.data.code == 0) {
          this.proportion = res.data.data.proportion
          this.syncMessage = res.data.data.message
          if (res.data.data && !res.data.data.isEnd) {
            this.getSyncProcess()
          } else {
            this.$message.success('数据模型同步成功')
            this.getDataModelList()
            this.syncing = false
          }
        } else {
          this.syncing = false
        }
      }).catch(err => {
        this.syncing = false
      })
    },
    // 同步数据模型
    syncDataModel() {
      this.syncDialog = true
    },
    // 添加索引
    addIndex(row) {
      addIndexField(this.appInfo.id, row.modelId, row.fieldKey).then(res => {
        if (res.data && res.data.code == 0) {
          this.$message.success('添加成功！')
          row.indexBoolean = true
          this.getDataModelList()
        }
      })
    },
    // 关闭数据集详情弹框
    dataModelClose() {
      this.dataModelDialog = false
    },
    // 关闭同步数据模型弹框
    syncClose() {
      this.tableData = []
      this.formData = {}
      if (this.syncing) {
        this.$message.warning('数据同步中...')
      } else {
        this.syncDialog = false
      }
    },
    // 查看数据集详情
    handleDetail(row) {
      this.dataModelDialog = true
      this.fieldList = [...row.fieldList]
    },
    // 删除数据集
    handleDelete(row) {
      this.$confirm("删除模型后无法恢复，确认物理删除模型？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataModel(row).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getDataModelList()
          }
        })
      }).catch(e => {})
    },
    editName (row, index) {
      this.editIndex = index
      this.$set(this, 'dataModelRow', JSON.parse(JSON.stringify(row)))
      this.$set(this, 'dataModelNameEdit', row.name)
      this.$set(this.dataPageList[index], 'dataModelNameEditShow', true)
      this.$nextTick(()=>{
        this.$refs['editDataModelName'+index].focus()
      })
      this.$forceUpdate()
    },
    editNameSub () {
      if(this.dataModelNameEdit != this.dataModelRow.name) {
        editModelName(this.appInfo.id, this.dataModelNameEdit, this.dataModelRow.id).then(res => {
          if(res.data && res.data.code == 0) {
            this.$set(this.dataPageList[this.editIndex], 'name', this.dataModelNameEdit)
            this.dataModelNameEdit = ''
            this.dataModelRow = null
            this.$message.success('修改成功')
            this.$set(this.dataPageList[this.editIndex], 'dataModelNameEditShow', false)
          }
        })
      }else{
        this.dataModelNameEdit = ''
        this.dataModelRow = null
        this.$set(this.dataPageList[this.editIndex], 'dataModelNameEditShow', false)
      }
    },
    // 获取数据集列表
    getDataModelList(id) {
      this.tableLoading = true
      let obj={
        current: this.page.currentPage,
        size: this.page.pageSize,
      }
      getDataModel(Object.assign(obj, this.queryParam)).then(res => {
        if(res.data && res.data.code == 0) {
          this.dataPageList = [...res.data.data.records]
          this.page.total = res.data.data.total
          this.page.currentPage = res.data.data.current
          this.tableLoading = false
        } else {
          this.tableLoading = false
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    searchChange (form) {
      this.queryParam = form
      this.getDataModelList()
    },
  }
}
</script>

<style lang="scss" scoped>
.data-set{
  background-color: #ffffff;
}
</style>
<style lang="scss">
.step-content{
  padding: 30px 100px;
  height: 350px;
  .step-process{
    margin-top: 100px;
  }
  .step-process-text{
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    text-align: center;
  }
}
</style>
