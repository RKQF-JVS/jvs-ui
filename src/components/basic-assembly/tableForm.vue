<template>
  <div :class="{'table-form': true, 'table-form-noteditable': !item.editable}">
    <jvs-table
      v-if="readyShow"
      :pageheadertitle="item.editable ? '' : item.label"
      :option="options"
      :page="page"
      :data="tableData"
      :index="true"
      :editable="item.editable"
      @on-load="getList"
    >
      <template slot="menu" slot-scope="scope">
        <div :style="'width: 100%;display: flex;justify-content: '+ option.menuAlign == 'left' ? 'left' : 'center' + ';'">
          <jvs-button v-if="!item.editable && item.editBtn" size="mini" type="text" @click="showForm(item, 'edit', scope.row, scope.index)">编辑</jvs-button>
          <jvs-button v-if="!item.editable && item.viewBtn" size="mini" type="text" @click="showForm(item, 'view', scope.row, scope.index)">详情</jvs-button>
          <slot name="menuBtn" :row="scope.row" :index="scope.index"></slot>
          <jvs-button v-if="!item.editable && item.delBtn" size="mini" type="text" @click="delRowHandle(scope.row, scope.index)">删除</jvs-button>
        </div>
      </template>
      <template slot="menuLeft">
        <jvs-button v-if="!item.editable && item.addBtn" size="mini" type="primary" @click="showForm(item, 'add')">新增</jvs-button>
      </template>
      <template v-for="(item, index) in options.tableColumn" :slot="item.prop" slot-scope="scope">
        <div :key="item.prop+'node'+index+index+scope.index">
          <div v-if="item.text && item.text.label && scope.row[item.prop] == item.text.value" :key="item.prop+'text'">
            <span>{{item.text.label}}</span>
          </div>
          <div v-if="item.needSlot !== true && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && displayByBind(item, scope.row)" :key="item.prop+'item'">
            <el-form
              :model="scope.row"
              :ref="formRef || 'ruleForm'"
              class="demo-dynamic"
              size='mini'
            >
              <el-form-item label="" :prop='item.prop' :rules='item.rules' v-model="scope.row[item.prop]" style="margin-bottom: 0;">
                <tableFormItem
                  :tableRowAIndex="scope.index"
                  :style="'justify-content:'+ (options.align == 'center' ? 'center' : 'flex-start')"
                  :form="getDefaultData(scope.row)"
                  :item="{...item, disabledControl: disabledExpressHandle(item, scope.row, getDefaultData(scope.row))}"
                  :roleOption="roleOption"
                  :userList="userList"
                  :departmentList="departmentList"
                  :postList="postList"
                  :designId="designId"
                  :isView="isView"
                  :execsList="execsList"
                  :jvsAppId="jvsAppId"
                  :originForm="forms"
                  @formChange="formChange"
                  @reInitData="reInitData"
                ></tableFormItem>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="displayByBind(item, scope.row) && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && item.needSlot === true" :key="item.prop+'needslotitem'">
            <slot :name="item.prop+'Item'" :row="scope.row" :index="scope.index"></slot>
          </div>
        </div>
      </template>
    </jvs-table>
    <formDialog ref="formDialog" :title="title" @submit="childFormSubmit"></formDialog>
  </div>
</template>
<script>
import {getSelectData} from '@/api/index'
import {sendMyRequire} from '@/api/newDesign'
import formDialog from '@/plugin/components/dialogInfo'
import {getSystemDictItems, getClassifyDictTree} from '@/api/newDesign'
import {getDeptList, getRoleList, getPostList} from '../api'
import {areaList} from '@/const/chinaArea.js'
import {doExec} from '@/components/basic-container/formula/api'
import {dataModelTriggering} from '@/components/api'
import moment from "moment";
import {getUserInfo} from "@/api/admin/user";
export default {
  name: 'table-Form',
  components: {
    // 异步import，formitem引用了tableForm，嵌套时异步引用
    tableFormItem: () => import('@/components/basic-assembly/formitem'),
    formDialog
  },
  props: {
    formRef: {
      type: String,
      default: 'ruleForm'
    },
    item: {
      type: Object
    },
    option: {
      type: Object
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    originOption: {
      type: Object
    },
    defalutSet: {
      type: Object
    },
    rowData: {
      type: Object
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 部门列表
    departmentList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 岗位列表
    postList: {
      type: Array,
      default: () => {
        return []
      }
    },
    resetRadom: {
      type: Number
    },
    designId: {
      type: String
    },
    forms: {
      type: Object
    },
    dataModelId: {
      type: String
    },
    changeRandom: {
      type: Number
    },
    changeDomItem: {
      type: Object
    },
    isView: {
      type: Boolean
    },
    execsList: {
      type: Array
    },
    jvsAppId:  {
      type: String
    }
  },
  computed: {
    options (){
      let temp = JSON.parse(JSON.stringify(this.option))
      if(temp.column && !temp.tableColumn) {
        temp.tableColumn = temp.column
      }
      if(this.item.editable) {
        for(let i in temp.tableColumn) {
          temp.tableColumn[i].slot = true
        }
      }
      if(!temp.column) {
        temp.column = temp.tableColumn
      }
      if(this.item.editable) {
        if(this.item.delBtn) {
          temp.menu = true
        }else{
          temp.menu = false
        }
      }else{
        if(this.item.editBtn || this.item.viewBtn || this.item.delBtn) {
          temp.menu = true
        }else{
          temp.menu = false
        }
      }
      if(this.item.page && this.item.editable) {
        temp.page = true
      }else{
        temp.page = false
      }
      if(this.item.menuFix) {
        temp.menuFix = this.item.menuFix
      }
      if(temp.menuAlign != 'left') {
        temp.menuAlign = 'center'
      }
      temp.indexLabel = '序号'
      return temp
    }
  },
  created () {
    if(this.$store.getters && this.$store.getters.userInfo) {
      this.userInfo = JSON.parse(JSON.stringify(this.$store.getters.userInfo))
    }else{
      this.getUserInfo()
    }
    this.init()
  },
  data () {
    return {
      title: '',
      tableData: [],
      userInfo: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      },
      openType: '', // 弹框类型
      rowIndex: -1, // 行数据index
      loadTimes: -1, // 加载次数
      initData: [],
      readyShow: false
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        if(res.data.code == 0) {
          this.userInfo = res.data.data
        }
      })
    },
    // 扩展组件默认值
    getDefaultData(obj) {
      return {}
    },
    async init () {
      let deptBool = false
      let roleBool = false
      let postBool = false
      for(let i in this.options.tableColumn) {
        if(this.options.tableColumn[i].type == 'department') {
          deptBool = true
        }
        if(this.options.tableColumn[i].type == 'role') {
          roleBool = true
        }
        if(this.options.tableColumn[i].type == 'post') {
          postBool = true
        }
        // 接口字典
        if(this.options.tableColumn[i].dicUrl) {
          await getSelectData(this.options.tableColumn[i].dicUrl).then(res => {
            if(res.data.code == 0) {
               for(let sitem in res.data.data){
                if(typeof sitem == 'string') {
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem][this.options.tableColumn[i].props.label ? this.options.tableColumn[i].props.label : 'label'],
                    value: res.data.data[sitem][this.options.tableColumn[i].props.value ? this.options.tableColumn[i].props.value : 'value']
                  })
                }
              }
            }
          })
        }
        // 系统字典
        if(this.options.tableColumn[i].datatype == 'system' && this.options.tableColumn[i].systemDict) {
          await getSystemDictItems(this.options.tableColumn[i].systemDict).then(res => {
            if(res.data.code == 0) {
              this.options.tableColumn[i].dicData = []
               for(let sitem in res.data.data){
                if(typeof res.data.data[sitem] == 'string') {
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem][this.options.tableColumn[i].props.label ? this.options.tableColumn[i].props.label : 'label'],
                    value: res.data.data[sitem][this.options.tableColumn[i].props.value ? this.options.tableColumn[i].props.value : 'value']
                  })
                }
              }
            }
          })
        }
        // 级联选择类
        if(this.options.tableColumn[i].type == 'cascader' && this.options.tableColumn[i].dictName) {
          await getClassifyDictTree(this.options.tableColumn[i].dictName).then(res => {
            if(res.data.code == 0 && res.data.data && res.data.data.children) {
              this.options.tableColumn[i].dicData = res.data.data.children
              this.options.tableColumn[i].emitKey = 'uniqueName'
              this.options.tableColumn[i].props = {
                label: 'name',
                value: 'uniqueName',
                children: 'children'
              }
            }
          })
        }
        // 配置字典
        if(this.options.tableColumn[i].dicData) {
          let temp = []
          let bool = false
          for(let j in this.options.tableColumn[i].dicData) {
            if(typeof this.options.tableColumn[i].dicData[j] == 'string') {
              bool = true
              temp.push({
                label: this.options.tableColumn[i].dicData[j],
                value: this.options.tableColumn[i].dicData[j]
              })
            }
          }
          if(bool) {
            this.options.tableColumn[i].dicData = temp
          }
        }
        // 上传
        if(['imageUpload', 'fileUpload'].indexOf(this.options.tableColumn[i].type) > -1) {
          this.options.tableColumn[i].parent = this.item
        }
        // 地区回显
        if(this.options.tableColumn[i].type == 'chinaArea') {
          this.options.tableColumn[i].dicData = areaList
          this.options.tableColumn[i].props = {
            label: 'name',
            value: this.options.tableColumn[i].emitKey ? this.options.tableColumn[i].emitKey : 'code',
            children: 'children'
          }
        }
      }
      // 部门回显
      if(deptBool) {
        await getDeptList().then(res => {
          if(res.data.code == 0) {
            for(let i in this.options.tableColumn) {
              if(this.options.tableColumn[i].type == 'department') {
                this.options.tableColumn[i].dicData = res.data.data
              }
            }
          }
        })
      }
      // 角色回显
      if(roleBool) {
        await getRoleList().then(res => {
          if(res.data.code == 0) {
            for(let i in this.options.tableColumn) {
              if(this.options.tableColumn[i].type == 'role') {
                this.options.tableColumn[i].dicData = res.data.data
              }
            }
          }
        })
      }
      // 岗位回显
      if(postBool) {
        await getPostList().then(res => {
          if(res.data.code == 0) {
            for(let i in this.options.tableColumn) {
              if(this.options.tableColumn[i].type == 'post') {
                this.options.tableColumn[i].dicData = res.data.data
              }
            }
          }
        })
      }
      // if(this.item.formId && !this.isView) {
      //   await this.getDataByFilter()
      // }
      this.readyShow = true
    },
    // 下拉选择change
    valueChange (item, row) {
      this.$emit((item.prop+'Change'), {
        item: item,
        row: row
      })
    },
    // 根据绑定字段值决定显隐
    displayByBind (item, row) {
      let temp = true
      if(item.display) {
        if(typeof item.display.value == 'object' && (item.display.value instanceof Array)) {
          if(item.display.value.indexOf(row[item.display.key]) > -1) {
            temp = true
          }else{
            temp = false
          }
        }else{
          if(row[item.display.key] == item.display.value) {
            temp = true
          }else{
            temp = false
          }
        }
      }else{
        temp = true
      }
      return temp
    },
    async formChange (form, item) {
      if(this.$refs[this.formRef || 'ruleForm'] && this.$refs[this.formRef || 'ruleForm'].length > 0) {
        for(let r in this.$refs[this.formRef || 'ruleForm']) {
          this.$refs[this.formRef || 'ruleForm'][r].validate( (valid) => {
            //
          })
        }
      }
      this.$emit('formChange', form, item)
    },
    // 打开表单
    showForm (item, type, row, index) {
      this.openType = type
      if(index || index == 0) {
        this.rowIndex = index
      }
      let code = ""
      if(type == 'add') {
        code = item.addBtnFormCode
        this.title = '新增'
      }else if(type == 'edit'){
        code = item.editBtnFormCode
        this.title = '编辑'
      }else{
        code = item.viewBtnFormCode
        this.title = '详情'
      }
      if(code) {
        this.$refs.formDialog.childFormInit(code, row)
      }
    },
    childFormSubmit (form) {
      if(typeof form == 'object') {
        if(form) {
          if(this.openType == 'add') {
            this.tableData.push(form)
            this.getList()
          }
          if(this.openType == 'edit') {
            if(this.rowIndex > -1) {
              this.$set(this.tableData, this.rowIndex, form)
            }
            this.getList()
          }
        }else{
          this.getList()
        }
      }else{
        // 当前只存在false情况
      }
    },
    // 表格数据api来源
    getList () {
      if(this.item.tableEchoRequest && !this.item.editable) {
        // 请求接口
        let tp = JSON.parse(JSON.stringify(this.item.tableEchoRequest))
        if(this.$store.getters.labelValue && this.$store.getters.labelValue.requestContentType) {
          tp.requestContentType = this.$store.getters.labelValue.requestContentType[tp.requestContentType]
        }
        if(tp && tp.url) {
          let query = {}
          if(this.item.page) {
            query.current = this.page.currentPage
            query.size = this.page.pageSize
          }
          if(this.rowData) {
            query = Object.assign(query, this.rowData)
          }
          sendMyRequire(tp, query).then(res => {
            if(res.data.code == 0) {
              if(this.item.page) {
                this.tableData = res.data.data.records
                this.page.currentPage = res.data.data.current
                this.page.total = res.data.data.total
                this.initData = JSON.parse(JSON.stringify(res.data.data.records))
              }else{
                this.tableData = res.data.data
                this.initData = JSON.parse(JSON.stringify(res.data.data))
              }
              this.$forceUpdate()
            }
          })
        }
      }else{
        if(this.loadTimes == -1 && this.data) {
          this.tableData = JSON.parse(JSON.stringify(this.data))
          this.initData = JSON.parse(JSON.stringify(this.data))
          this.$forceUpdate()
        }
      }
      this.loadTimes++
    },
    // 删除
    delRowHandle (row, index) {
      if(this.item.editable) {
        this.tableData.splice(index, 1)
      }else{
        if(this.item.tableDeleteRequest && this.item.tableDeleteRequest.url) {
          // 请求接口
          let tp = JSON.parse(JSON.stringify(this.item.tableDeleteRequest))
          if(this.$store.getters.labelValue && this.$store.getters.labelValue.requestContentType) {
            tp.requestContentType = this.$store.getters.labelValue.requestContentType[tp.requestContentType]
          }
          if(tp && tp.url) {
            sendMyRequire(tp, row).then(res => {
              if(res.data.code == 0) {
                this.getList()
                this.$forceUpdate()
              }
            })
          }
        }else{
          this.tableData.splice(index, 1)
        }
      }
    },
    reset () {
      this.$set(this, 'tableData', this.data)
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000]
      }
    },
    async getDataByFilter () {
      let tprop = []
      for(let i in this.item.tableColumn) {
        tprop.push(this.item.tableColumn[i].prop)
      }
      let postData = {
        fieldList: tprop,
        conditions: []
      }
      let nomptyValue = true
      if(this.item.dataFilterList) {
        for(let df in this.item.dataFilterList) {
          let dfit = {
            enabledQueryTypes: this.item.dataFilterList[df].enabledQueryTypes,
            fieldKey: this.item.dataFilterList[df].fieldKey,
          }
          if(this.item.dataFilterList[df].type == 'cust') {
            dfit.value = this.item.dataFilterList[df].value
          }else{
            dfit.value = this.forms[this.item.dataFilterList[df].value]
            if((dfit.value == undefined || dfit.value == null || dfit.value == '') && this.item.dataFilterList[df].enabledQueryTypes != 'isNull' ) {
              nomptyValue = false
            }
          }
          postData.conditions.push(dfit)
        }
      }
      if(nomptyValue) {
        await getSelectData(`/mgr/jvs-design/app/${this.jvsAppId}/use/dynamic/data/query/list/${this.item.formId}`, 'post', postData, this.designId).then(res => {
          if(res.data && res.data.code == 0) {
            this.$set(this, 'tableData', res.data.data)
            this.$emit('setTable', this.tableData)
            // console.log('表格的筛选。。。。', res.data.data)
          }
        })
      }
    },
    reInitData (prop, parentKey, index, tableType) {
      this.$emit('reInitData', prop, parentKey, index, tableType)
    },
    // 表达式控制显示
    disabledExpressHandle (item, row, form) {
      let bool = false
      let formStr = 'row' // 表单值参数名
      if(item.disabledExpress && item.disabledExpress.length > 0) {
        let list = item.disabledExpress
        let temp = []
        for(let i in list) {
          let prop = (formStr + '.') // 控制字段名
          if(list[i].parent && list[i].parent.length > 0) {
            prop += list[i].parent.join('.')
            prop += '.'
          }
          prop += list[i].prop

          // 校验层级表单值是否为undefined
          let tpr = ''
          let exValidate = true
          tpr += formStr
          for(let p in list[i].parent) {
            tpr += ('.' + list[i].parent[p])
            if(eval(tpr) == undefined) {
              exValidate = false
              break;
            }
          }
          if(exValidate) {
            let tv = JSON.stringify(list[i].value.split(','))
            tv += '.indexOf( '
            let tp = (tv + prop + ' + ' + "''" + ')')
            tp += (' > -1')
            temp.push(tp)
          }
        }
        if(temp.length > 0) {
          if(eval(temp.join(` ${item.showOperator || '||'} `))) {
            bool = true
          }
        }
      }else{
        bool = false
      }
      if(bool && !item.disabled && item.disabledEmpty) {
        this.$set(form, item.prop, '')
      }
      return bool
    },
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.$emit('setTable', newVal)
      }
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          this.reset()
        }
      }
    },
    data: {
      handler (newVal, oldVal) {
        if(this.item.editable) {
          this.tableData = this.data
          if(this.$refs[this.formRef || 'ruleForm'] && this.$refs[this.formRef || 'ruleForm'].length > 0) {
            for(let r in this.$refs[this.formRef || 'ruleForm']) {
              this.$refs[this.formRef || 'ruleForm'][r].validate( (valid) => {
                //
              })
            }
          }
          this.$forceUpdate()
        }
      }
    },
    changeRandom: {
      handler (newVal, oldVal) {
        if(newVal > -1 && this.item.formId && !this.isView) {
          let bool = true
          if(this.changeDomItem) {
            // 本身子组件触发不请求
            if(this.changeDomItem.parentType == this.item.type) {
              let pks = this.changeDomItem.parentKey.split('.')
              if(pks[pks.length - 1] == this.item.prop) {
                bool = false
              }
            }
            // 触发组件不作为条件的不请求
            if(this.item.dataFilterList && this.item.dataFilterList.length > 0) {
              let pool = false
              this.item.dataFilterList.filter(dit => {
                if(dit.type == 'prop') {
                  if(dit.value == this.changeDomItem.prop) {
                    pool = true
                  }
                }
              })
              if(!pool) {
                bool = false
              }
            }
          }
          if(bool) {
            this.getDataByFilter()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.table-form{
  overflow: hidden;
  .jvs-table-notitle{
    display: none;
  }
  .el-card{
    border-width: 0;
  }
  .jvs-table{
    .el-table{
      .el-table__header-wrapper{
        margin-top: 0;
      }
      .el-table__body-wrapper{
        .el-table__empty-block{
          border-top: 0;
        }
      }
      .cell{
        >div{
          width: 100%;
        }
        .el-radio-group, .el-checkbox-group{
          width: 100%;
          div{
            display: flex;
            flex-wrap: wrap;
            .el-radio, .el-checkbox{
              min-width: 50%;
              margin-right: 0;
              text-align: left;
            }
          }
        }
        .demo-dynamic{
          .el-form-item{
            padding: 0;
            .el-input.is-disabled{
              .el-input__inner{
                padding-right: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: pre;
              }
            }
          }
        }
      }
      .el-table__fixed, .el-table__fixed-right{
        margin-top: 0;
      }
    }
    .el-table.el-table--border{
      .el-table__body-wrapper{
        .el-table__empty-block{
          border-top: 0;
          border-left: 0;
        }
      }
    }
  }
  .table-body-box{
    .el-table__body-wrapper{
      height: auto!important;
    }
    .el-table__body-wrapper::-webkit-scrollbar{
      height: 8px;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb{
      border-radius: 20px;
    }
    .el-table__fixed-right{
      padding-bottom: 4px;
    }
  }
  .el-table__row{
    .el-input{
      font-size: 12px;
      .el-input__inner{
        height: 28px;
        line-height: 28px;
      }
    }
    .el-upload-list{
      .el-upload-list__item{
        .el-icon-close-tip{
          display: none!important;
        }
      }
    }
  }
}
.table-form-noteditable{
  padding: 10px;
  .jvs-table{
    .jvs-table-titleTop{
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .table-body-box{
      padding: 0;
    }
  }
}
.show-form{
  .table-form{
    .table-body-box{
      .el-table__body-wrapper{
        .el-table__empty-block{
          display: none!important;
        }
      }
      .jvs-form-item{
        .user-info-list{
          .el-input__inner{
            width: 100%;
          }
          .el-input-group__append{
            width: auto;
            .el-button{
              padding: 7px 5px;
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
