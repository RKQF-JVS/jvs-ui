<template>
  <div class="datasource-design">
    <div class="left">
      <jvs-form :option="option" :formData="formData">
      </jvs-form>
      <ul v-if="tableList && tableList.length > 0">
        <li :class="{'selected-item': hadIn.indexOf(item.tableName) > -1}" v-for="item in tableList" :key="item.id" @click="changeTable(item)">
          <span>{{item.info}}</span>
          <span style="color: #C0C4CC;">{{item.tableName}}</span>
        </li>
      </ul>
    </div>
    <div class="right">
      <el-row>
        <jvs-button type="primary" size="mini" @click="createTable">自定义表</jvs-button>
        <jvs-button type="primary" size="mini" @click="saveHandle">保存</jvs-button>
      </el-row>
      <div class="table-list-info">
        <div v-for="(item, index) in selectTable" :key="item.id" class="table-list-info-item">
          <i class="el-icon-delete" @click="deleteTable(item, index)" style="position:absolute;right:3px;top:3px;"></i>
          <h5 @click="setTable(item)">
            <span>{{item.info}}</span>
            <span>{{item.tableName}}</span>
          </h5>
          <p v-for="it in item.autoTableFields" :key="'it.'+it.id+it.columnName" @click="addRealtion(it)">
            <a>
              <span>{{it.columnComment}}</span>
            </a>
            <a>
              <span>{{it.columnName}}</span>
              <span v-if="it.associatedFields">{{it.associatedFields.tableName}}.{{it.associatedFields.columnName}}</span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <!-- 关系 -->
    <el-dialog
      title="添加关系"
      width="80%"
      append-to-body
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <el-row class="add-relation">
        <div class="left">
          <span>关联字段：</span>
          <el-select v-model="leftTable" placeholder="请选择" size="mini" @change="leftChange(false)" clearable>
            <el-option
              v-for="item in selectListTable"
              :key="item.tableName"
              :label="item.info"
              :value="item.tableName">
            </el-option>
          </el-select>
          <el-select v-model="leftColumn" placeholder="请选择" size="mini" style="margin-left: 10px;" clearable @change="enableSubmit">
            <el-option
              v-for="item in leftSelectColumn"
              :key="item.columnName"
              :label="item.columnComment"
              :value="item.columnName">
            </el-option>
          </el-select>
        </div>
      </el-row>
      <el-row class="add-relation">
        <span>显示字段：</span>
        <el-select v-model="showlabel" placeholder="请选择" size="mini" clearable @change="enableSubmit">
          <el-option
            v-for="item in leftSelectColumn"
            :key="item.columnName"
            :label="item.columnComment"
            :value="item.columnName">
          </el-option>
        </el-select>
      </el-row>
      <el-row class="add-relation">
        <span>关联关系：</span>
        <el-select v-model="currentItem.correspondence" placeholder="请选择" size="mini" clearable @change="enableSubmit">
          <el-option label="1对1" value="ONE_TO_ONE"></el-option>
          <el-option label="1对多" value="ONE_TO_N"></el-option>
        </el-select>
      </el-row>
      <el-row style="display:flex;justify-content:center;align-items:center;margin-top:20px;">
        <jvs-button type="primary" size="mini" @click="subRelation" :disabled="subDisable">确定</jvs-button>
        <jvs-button type="primary" size="mini" @click="handleClose">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 表设计 -->
    <el-dialog
      title="主次设置"
      v-if="setVisible"
      :visible.sync="setVisible"
      append-to-body
      :before-close="setClose">
      <jvs-form :option="setOption" :formData="rowData" @submit="submitHandle">
        <template slot="masterForm">
          <el-switch size="mini" v-model="rowData.master" @change="masterChange"></el-switch>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 自定义表 -->
    <el-dialog
      :visible.sync="createVisible"
      v-if="createVisible"
      append-to-body
      :before-close="closeCreate">
      <jvs-form :option="createOption" :formData="newTable" @submit="createTableHandle" @cancalClick="closeCreate"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {getDesignInfo, updateDesignInfo} from '../../api/design'
import PageHeader from '@/components/page-header/PageHeader'
import {getTableList, addCustomTable} from '../../api/list'
import tableForm from '@/components/basic-assembly/tableForm'
export default {
  components: {PageHeader, tableForm},
  props: {
    infoData: {
      type: Object
    },



    menuId: {
      type: Number
    },
    menuName: {
      type: String
    },
    menuFormData: {
      type: Object
    },
    systemId: {
      type: String
    }
  },
  computed: {
    selectListTable () {
      let temp = []
      for(let i in this.selectTable) {
        if(this.selectTable[i].tableName != this.currentItem.tableName) {
          temp.push(this.selectTable[i])
        }
      }
      return temp
    }
  },
  data(){
    return {
      designData: {},
      formData: {
        databaseName: ""
      },
      option: {
        labelWidth: '90px',
        btnHide: true,
        cancal: false,
        column: [
          {
            label: '数据源',
            prop: 'databaseName',
            type: 'select',
            dicUrl: '/mgr/jvs-design/datasource',
            props: {
              label: 'name',
              value: 'name'
            }
          }
        ]
      },
      tableList: [],
      selectTable: [],
      hadIn: [],
      databaseObj: {},
      dialogVisible: false,
      leftSelectColumn: [],
      rightSelectColumn: [],
      leftTable: '',
      leftColumn: '',
      showlabel: '',
      rightTable: '',
      rightColumn: '',
      relationList: [],
      count: -1,
      setVisible: false,
      setOption: {
        cancal: false,
        submitBtnText: '确定',
        column: [
          {
            label: '是否为主表',
            prop: 'master',
            type: 'switch',
            formSlot: true
          },
          {
            label: '',
            prop: 'relationTables',
            type: 'tableForm',
            tableColumn: [
              {
                label: '关联表',
                prop: 'id',
                type: 'select',
                dicData: [],
                props: {
                  label: 'info',
                  value: 'id'
                }
              },
              {
                label: '关联关系',
                prop: 'correspondence',
                type: 'select',
                dicData: [
                  {label: '1对1', value: 'ONE_TO_ONE'},
                  {label: '1对多', value: 'ONE_TO_N'}
                ]
              }
            ]
          }
          // {
          //   label: '是否跟随主表删除',
          //   prop: 'cascadeDelete',
          //   type: 'switch',
          //   display: true,
          // }
        ]
      },
      currentItem: {}, // 当前字段项
      refName: '',
      subDisable: false, // 字段关联关系可否提交
      createVisible: false, // 自定义表弹框
      newTable: {}, // 自定义表
      createOption: {
        emptyBtn: false,
        labelWidth: '70px',
        column: [
          {
            label: '解释',
            prop: 'info',
            span: 12,
            rules: [{ required: true, message: '请输入解释', trigger: 'blur' }]
          },
          {
            label: '表名',
            prop: 'tableName',
            span: 12,
            rules: [{ required: true, message: '请输入表名', trigger: 'blur' }]
          },
          {
            label: '',
            prop: 'autoTableFields',
            type: 'tableForm',
            tableColumn: [
              {
                label: '描述',
                prop: 'columnComment'
              },
              {
                label: '字段名',
                prop: 'columnName'
              },
              {
                label: '类型',
                prop: 'dataType',
                type: 'select',
                dicData: []
              },
              {
                label: '长度',
                prop: 'characterMaximumLength',
                type: 'inputNumber'
              },
              {
                label: '是否为空',
                prop: 'isNullable',
                type: 'switch'
              },
            ]
          }
        ]
      }
    }
  },
  methods: {
    // 获取详情
    getDesignInfoHandle () {
      // getDesignInfo(this.menuFormData.menuId).then(res => {
      getDesignInfo(this.infoData.id).then(res => {
        if(res.data.code == 0) {
          this.designData = res.data.data
          if(res.data.data.dataPage) {
            this.selectTable = res.data.data.dataPage.tables
            this.formData.databaseName = res.data.data.dataPage.databaseName
            this.relationList = res.data.data.dataPage.relationList
            this.getTableListHandle(this.formData.databaseName)
            let temp = []
            for(let i in this.selectTable) {
              temp.push(this.selectTable[i].tableName)
            }
            this.hadIn = temp
          }
        }
      })
    },
    // 选择数据表
    changeTable (item) {
      if(this.hadIn.indexOf(item.tableName) == -1) {
        this.selectTable.push(item)
        this.hadIn.push(item.tableName)
      }
    },
    // 删除数据表
    deleteTable (item, index) {
      this.selectTable.splice(index, 1)
      this.hadIn = []
      for(let i in this.selectTable) {
        this.hadIn.push(this.selectTable[i].tableName)
      }
      for(let re in this.relationList) {
        if(this.hadIn.indexOf(this.relationList[re].left.tableName) == -1 || this.hadIn.indexOf(this.relationList[re].right.tableName)) {
          this.relationList.splice(re, 1)
        }
      }
      this.$forceUpdate()
    },
    // 保存
    saveHandle () {
      let obj = JSON.parse(JSON.stringify(this.databaseObj))
      obj.tables = this.selectTable
      obj.relationList = this.relationList
      let temp = JSON.parse(JSON.stringify(this.designData))
      // temp.menuId = this.menuFormData.menuId
      if(this.infoData.menuId) {
        temp.menuId = this.infoData.menuId
      }
      temp.dataPage = obj
      updateDesignInfo(this.infoData.id, temp).then(res => {
        if(res.data.code == 0) {
          this.$message.success('保存成功')
        }
      })
    },
    // 添加关系
    addRealtion (item) {
      this.currentItem = item
      if(this.selectListTable && this.selectListTable.length > 0) {
        if(this.currentItem.associatedFields) {
          this.leftTable = this.currentItem.associatedFields.tableName
          this.leftColumn = this.currentItem.associatedFields.columnName
        }
        if(this.currentItem.displayField) {
          this.showlabel = this.currentItem.displayField.columnName
        }
        this.leftChange(true)
        this.dialogVisible = true
      }
    },
    // 关闭关系
    handleClose () {
      this.dialogVisible = false
      this.leftTable = ''
      this.leftColumn = ''
      this.showlabel = ''
      this.rightTable = ''
      this.rightColumn = ''
      this.leftSelectColumn = []
      this.rightSelectColumn = []
    },
    // 关联关系
    leftChange (isFirst) {
      let item = this.getItemOfArr(this.leftTable, 'tableName', this.selectListTable)
      if(item) {
        this.leftSelectColumn = item.autoTableFields
        if(!isFirst) {
          this.currentItem.correspondence = ""
          this.leftColumn = ""
          this.showlabel = ""
        }
      }else{
        this.leftSelectColumn = []
        this.currentItem.correspondence = ""
        this.leftColumn = ""
        this.showlabel = ""
      }
      this.enableSubmit()
    },
    rightChange (val) {
      let item = this.getItemOfArr(val, 'tableName', this.selectListTable)
      if(item) {
        this.rightSelectColumn = item.autoTableFields
      }
    },
    // 确定关系
    subRelation () {
      this.currentItem.associatedFields = this.getItemOfArr(this.leftColumn, 'columnName', this.leftSelectColumn)
      this.currentItem.displayField = this.getItemOfArr(this.showlabel, 'columnName', this.leftSelectColumn)
      this.handleClose()
    },
    // 删除关系
    deleteRelation (item, index) {
      this.relationList.splice(index, 1)
      // 清除关联字段
      for(let i in this.selectTable) {
        if([item.left.tableName, item.right.tableName].indexOf(this.selectTable[i].tableName) > -1) {
          for(let j in this.selectTable[i].autoTableFields) {
            if([item.left.columnName, item.right.columnName].indexOf(this.selectTable[i].autoTableFields[j].columnName) > -1) {
              for(let k in this.selectTable[i].autoTableFields[j].associatedFields) {
                if([item.left.columnName, item.right.columnName].indexOf(this.selectTable[i].autoTableFields[j].associatedFields[k].columnName) > -1) {
                  this.selectTable[i].autoTableFields[j].associatedFields.splice(k, 1)
                }
              }
            }
          }
        }
      }
      this.$forceUpdate()
    },
    isInAssociatedField (item, list) {
      let bool = false
      for(let i in list) {
        if(list[i].columnName == item.columnName && list[i].tableId == item.tableId) {
          bool =  true
        }
      }
      return bool
    },
    getItemOfArr (val, attr, list) {
      for(let i in list) {
        if(list[i][attr] == val) {
          return list[i]
        }
      }
      return false
    },
    getTableListHandle(databaseName) {
      getTableList(databaseName).then(res => {
        if(res.data.code == 0) {
          this.databaseObj = {
            databaseName: res.data.data.databaseName,
            name: res.data.data.name,
            id: res.data.data.id
          }
          this.tableList = res.data.data.tables
        }
      })
    },
    // 设置数据表
    setTable (item) {
      this.rowData = item
      this.currentItem = item
      this.getRelationTable()
      this.setOption.column.filter(item => {
        if(item.prop == 'cascadeDelete') {
          if(this.rowData.master == true) {
            item.display = false
          }else{
            item.display = true
          }
        }
      })
      this.setVisible = true
    },
    // 关闭主次
    setClose () {
      this.setVisible = false
    },
    // 主次关系提交
    submitHandle (form) {
      this.setClose()
      for(let i in this.selectTable) {
        if(this.selectTable[i].tableName == form.tableName && form.master == true) {
          this.selectTable[i].master = true
        }else{
          if(this.selectTable[i].master) {
            this.selectTable[i].master = false
          }
        }
      }
    },
    // 是否主表
    masterChange (val) {
      this.setOption.column.filter(item => {
        if(item.prop == 'cascadeDelete') {
          item.display = !val
        }
      })
    },
    getRelationTable () {
      let temp = []
      let had = []
      if(this.rowData.relationTables) {
        had = this.rowData.relationTables
      }
      for(let i in this.selectTable) {
        if(this.selectTable[i].tableName != this.currentItem.tableName && had.indexOf(this.selectTable[i].id) == -1) {
          temp.push(this.selectTable[i])
        }
      }
      this.setOption.column.filter(item => {
        // 关联表的下拉数据
        if(item.prop == 'relationTables') {
          item.tableColumn.filter(it => {
            if(it.prop == 'id') {
              it.dicData = temp
            }
          })
          if(temp.length > 0) {
            item.display = true
          }else{
            item.display = false
          }
        }
      })
    },
    // 字段关联可否提交
    enableSubmit () {
      let subDisable = false
      if(this.leftTable) {
        if(!this.leftColumn) {
          subDisable = true
        }
        if(!this.showlabel) {
          subDisable = true
        }
        if(!this.currentItem.correspondence) {
          subDisable = true
        }
      }else{
        subDisable = false
      }
      this.subDisable = subDisable
    },
    // 自定义表
    createTable () {
      this.createVisible = true
    },
    closeCreate () {
      this.createVisible = false
      this.newTable = {}
    },
    // 自定义表 提交
    createTableHandle (form) {
      let obj = JSON.parse(JSON.stringify(form))
      if(obj.autoTableFields && obj.autoTableFields.length > 0) {
        for(let i in obj.autoTableFields) {
          if(obj.autoTableFields[i].isNullable == true) {
            obj.autoTableFields[i].isNullable = 'YES'
          }else{
            obj.autoTableFields[i].isNullable = 'NO'
          }
        }
      }
      console.log(obj)
      // addCustomTable(obj).then(res => {
      //   if(res.data.code == 0) {

      //   }
      // })
    }
  },
  created () {
    this.getDesignInfoHandle()
    if(this.$store.state.labelValue && this.$store.state.labelValue.fieldType) {
      let temp = []
      for(let i in this.$store.state.labelValue.fieldType) {
        let obj = {
          label: this.$store.state.labelValue.fieldType[i],
          value: i
        }
        temp.push(obj)
      }
      this.createOption.column.filter(item => {
        if(item.prop == 'autoTableFields') {
          item.tableColumn.filter(it => {
            if(it.prop == 'dataType') {
              it.dicData = temp
            }
          })
        }
      })
    }
  },
  watch: {
    'formData.databaseName': {
      deep: true,
      handler(newVal,oldVal) {
        if(newVal && newVal != oldVal) {
          if(this.count > -1) {
            this.selectTable = []
            this.hadIn = []
            this.relationList = []
          }
          this.getTableListHandle(newVal)
        }
        this.count++
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.datasource-design{
  display: flex;
  .left{
    ul{
      margin: 0;
      border: 1px solid #e5e5e5;
      padding: 0;
      width: 250px;
      border-top: 0;
      li{
        padding: 5px 10px;
        // height: 32px;
        // line-height: 32px;
        cursor: pointer;
        border-top: 1px solid #e5e5e5;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        span{
          width: 230px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre;
        }
      }
      .selected-item{
        background: #F2F6FC;
      }
    }
  }
  .right{
    margin-left: 10px;
    flex: 1;
    .table-list-info{
      display: flex;
      margin-top: 10px;
      .table-list-info-item{
        border: 1px solid #e5e5e5;
        border-top: 0;
        min-width: 200px;
        margin-right: 10px;
        position: relative;
        cursor: pointer;
        i{
          display: none;
          cursor: pointer;
        }
        h5{
          background: #F2F6FC;
          span{
            font-size: 14px;
          }
        }
        h5, p{
          margin: 0;
          font-weight: normal;
          border-top: 1px solid #e5e5e5;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 12px;
        }
        h5{
          span{
            width: 100%;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }
          span:nth-of-type(2) {
            color: #C0C4CC;
          }
        }
        p{
          a{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
            display: flex;
            justify-content: space-between;
          }
          a:nth-of-type(2) {
            color: #C0C4CC;
          }
        }
      }
      .table-list-info-item:hover{
        i{
          display: block;
        }
      }
    }
    .relation-list{
      margin-top: 20px;
      .relation-list-item{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .inline-border{
        width: 50px;
        border-top: 1px solid #e5e5e5;
        height: 0;
        position: relative;
        text-align: center;
        i{
          position: absolute;
          display: none;
          top: -7px;
          left: calc(50% - 7px);
          cursor: pointer;
        }
      }
      .relation-list-item:hover{
        .inline-border{
          i{
            display: block;
          }
        }
      }
    }
  }
}
.add-relation {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  h4{
    margin: 0 10px;
  }
}
</style>
