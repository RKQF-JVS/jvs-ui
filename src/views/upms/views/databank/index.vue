<template>
  <div style="background-color:#fff;height:calc(100% - 145px);">
    <div style="padding:20px 10px;display: flex;justify-content: space-between;">
        <template>
            <jvs-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</jvs-button>
        </template>
        <template>
            <p style="cursor:pointer;display: flex;align-items: center;" @click="searchChange(queryParams)">
                <span>刷新</span>
                <i class="el-icon-refresh" style="cursor:pointer;margin-left:3px;"></i>
            </p>
        </template>
    </div>
    <el-table
    style="padding: 0px 20px;width: 100%;"
    v-loading="tableLoading"
    @search-change="searchChange"
    :data="tableData"
    row-key="id"
    height="100%"
    @expand-change="getOpenDetail">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-table
                    v-loading="scope.row.sourceLoading"
                    :data="scope.row.sourceData"
                    style="width: 100%;"
                    row-key="id"
                    @expand-change="getOpenSource">
                    <el-table-column type="expand">
                      <template slot-scope="scopeF">
                        <el-table
                            :data="scopeF.row.columnData"
                            row-key="id"
                            v-loading="scopeF.row.columnLoading"
                            style="width: 100%;">
                            <el-table-column
                                width="48"
                                label=" ">
                            </el-table-column>
                            <el-table-column
                                prop="columnName"
                                label="字段名称">
                            </el-table-column>
                            <el-table-column
                                prop="dataFieldTypeEnum"
                                label="字段类型">
                            </el-table-column>
                            <el-table-column
                                prop="columnCount"
                                label="字段解释">
                            </el-table-column>
                            <el-table-column
                              width="150px"
                              label="操作">
                              <template slot-scope="scopeS">
                                <jvs-button size="mini" type="text" @click="changeFiledType(scopeS,scopeF.row,scope.row)">更改类型</jvs-button>
                              </template>
                            </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column
                        prop="tableName"
                        label="表名称">
                    </el-table-column>
                    <el-table-column
                        prop="tableNameDesc"
                        label="表解释">
                    </el-table-column>
                    <el-table-column
                        prop="dataSourceId"
                        label="数据源ID">
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column
            prop="sourceType"
            label="数据库类型">
            <template slot-scope="scope">{{scope.row.sourceType | formatsourcetype}}</template>
        </el-table-column>
        <el-table-column
            prop="sourceName"
            label="名字">
        </el-table-column>
        <el-table-column
            prop="sourceHost"
            label="IP地址">
        </el-table-column>
        <el-table-column
            prop="sourcePort"
            label="端口">
        </el-table-column>
        <el-table-column
            prop="sourceLibraryName"
            label="数据库名称">
        </el-table-column>
        <el-table-column
            prop="syncStructure"
            label="同步结果">
            <template slot-scope="scope">{{scope.row.syncStructure | formatsynctype}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
                <jvs-button size="mini" type="text" @click="handleSync(scope.row)" :disabled="scope.row.syncStructure == 2">同步结构</jvs-button>
                <jvs-button size="mini" type="text" @click="delRowHandle(scope.row)" style="color:red;">删除</jvs-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <el-dialog
    title="添加数据库"
    :visible.sync="importVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleImportClose">
      <el-form size="mini" ref="bankForm" :rules="rules" :model="bankForm" label-position="top" label-width="100px">
        <el-form-item label="数据库类型" prop="sourceType">
        <el-select v-model="bankForm.sourceType" placeholder="请选择数据库类型" style="width: 100%;">
            <el-option
            v-for="(item,index) in sourceOption"
            :key="index"
            :label="item.label"
            :value="item.value"
            @click.native="chType(item.value)">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="名字" prop="sourceName">
        <el-input v-model="bankForm.sourceName" placeholder="您想如何使用这个数据库？"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="sourceHost">
        <el-input v-model="bankForm.sourceHost" placeholder="10.0.0.44"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="sourcePort">
        <el-input v-model="bankForm.sourcePort" placeholder="9999"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="sourceLibraryName">
        <el-input v-model="bankForm.sourceLibraryName" placeholder="jvs"></el-input>
        </el-form-item>
        <el-form-item label="登录用户名" prop="sourceUserName">
        <el-input v-model="bankForm.sourceUserName" placeholder="您登陆数据库的用户名是什么？"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="sourcePwd">
        <el-input v-model="bankForm.sourcePwd" show-password placeholder="您登陆数据库的密码是什么？"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleImportClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleImportSubmit" :disabled="disabled">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更改数据类型"
      :visible.sync="changeTypeVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleCloseType">
      <el-form label-position="left">
        <el-form-item label="字段名称:">
          <span>{{ currentSecondItem.row.columnName }}</span>
        </el-form-item>
        <el-form-item label="字段解释:">
          <span>{{ currentSecondItem.row.columnCount }}</span>
        </el-form-item>
        <el-form-item label="原字段类型:">
          <span>{{ currentSecondItem.row.dataFieldTypeEnum }}</span>
        </el-form-item>
        <el-form-item label="新字段类型:">
          <el-select v-model="fieldTypeSelct" size="mini">
            <el-option v-for="(item,index) in allFieldType" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="change-type-footer">
        <jvs-button size="small" @click="handleCloseType">取 消</jvs-button>
        <jvs-button size="small" type="primary" @click="saveChangeType">保 存</jvs-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getSourcestructure,
    sourceList ,
    setsourceSave ,
    sourceStructure,
    delSource,
    getSourcetable,
    getSourceTableNew,
    getSourcestructureNew,
    getAllFileType,
    changeFileType} from "./api";
  export default {
    components: {},
    data () {
      return {
        importVisible: false,
        tableLoading: false,
        queryParams: {},
        tableData: [],
        sourceOption:[
            {label: 'MySQL', value: 'mysqlDataSource'},
            {label: 'MongoDB', value: 'mongodbDataSource'}
        ],
        bankForm: {
            sourceHost: '',
            sourceLibraryName: '',
            sourceName: '',
            sourcePort: '',
            sourcePwd: '',
            sourceType: '',
            sourceUserName: '',
            syncStructure:0
        },
        rules: {
            sourceType: [
                { required: true, message: '请选择数据类型', trigger: 'blur' }
            ],
            sourceName: [
                { required: true, message: '请输入名字', trigger: 'blur' }
            ],
            sourceHost: [
                { required: true, pattern: /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/,message: "请输入正确的IP地址", trigger: "blur"}
            ],
            sourcePort: [
                { required: true, pattern: /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/,message: '请输入正确的端口号,只能输入数字', trigger: 'blur' }
            ],
            sourceLibraryName: [
                { required: true, message: '请输入数据库名称', trigger: 'blur' }
            ],
            sourceUserName: [
                { required: true, message: '请输入登录用户名', trigger: 'blur' }
            ],
            sourcePwd: [
                { required: true, message: '请输入登录密码', trigger: 'blur' }
            ],
        },
        disabled:false,
        sourceData:[],
        sourceLoading: false,
        columnData:[],
        columnLoading: false,
        currentChangeItem:{},
        currentFirstItem:{},
        currentSecondItem:{
          row:{}
        },
        changeTypeVisible:false,
        allFieldType:[],
        fieldTypeSelct:'',
        page:{
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
          pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
          layout: "total, sizes, prev, pager, next, jumper", // 分页工具
        }
      }
    },
    created() {
      this.getList()
    },
    //前端表格转换显示
    filters:{
        formatsynctype (value) {
            if (value == 0) {
                return "失败";
            } else if (value == 1) {
                return "成功";
            } else if (value == 2) {
                return "同步中";
            }
            return value;
        },
        formatsourcetype (value) {
            if (value == 'mysqlDataSource') {
                return "MySQL";
            } else if (value == 'mongodbDataSource') {
                return "MongoDB";
            }
            return value;
        }
    },
    methods: {
      handleSizeChange(val){
        console.log(val)
      },
      handleCurrentChange(val){
        console.log(val)
      },
      // 打开弹窗获取所有类型
      getAllfieldType(){
        getAllFileType().then(res=>{
          if(res.data.code == 0){
            this.allFieldType = res.data.data
          }
        })
      },
      // 保存修改
      saveChangeType(){
        if(this.fieldTypeSelct){
          let newSecondeColumnData = JSON.parse(JSON.stringify(this.currentFirstItem))
          newSecondeColumnData.columnData[this.currentSecondItem.$index].dataFieldTypeEnum = this.fieldTypeSelct
          let newObj = {
            ...newSecondeColumnData,
            structure:newSecondeColumnData.columnData
          }
          changeFileType(newObj).then(res=>{
            if(res.data.code == 0){
              this.$message.success("更改数据类型成功")
              this.currentFirstItem.columnData[this.currentSecondItem.$index].dataFieldTypeEnum = this.fieldTypeSelct
              this.$nextTick(()=>{
                this.handleCloseType()
              })
            }
          })
        }else{
          this.handleCloseType()
        }
      },
      // 关闭弹出
      handleCloseType(){
        this.currentChangeItem = {}
        this.currentFirstItem = {}
        this.currentSecondItem = {
          row:{}
        }
        this.fieldTypeSelct = ''
        this.changeTypeVisible = false
      },
      //刷新
      searchChange (form) {
          this.queryParams = form
          this.getList()
      },
      // 点击图标展开节点 获取指定数据源的表
      getOpenDetail(row,expandedRows) {
        row.sourceLoading = true
        getSourceTableNew(Object.assign(row,{
            createTime:null,
            updateTime:null
        })).then(res => {
            if (res.data && res.data.code == 0) {
                row.sourceData = res.data.data
                row.sourceData.forEach(item=>{
                  item.sourceType = row.sourceType
                  item.columnData = []
                  item.columnLoading = false
                })
                //强制刷新
                this.tableData = this.tableData.slice(0)
                row.sourceLoading = false
            }
        })
      },
      // 点击子节点图标 获取数据源表结构
      getOpenSource(row,expandedRows){
        row.columnLoading = true
        getSourcestructureNew(row).then(res =>{
            if (res.data.code == 0) {
              row.columnData = res.data.data
              console.log(row.columnData)
              //强制刷新
              this.tableData = this.tableData.slice(0)
              // this.sourceData = this.sourceData.slice(0)
              row.columnLoading = false
            }
        })
      },
      chType(item){
          if(item == "mongodbDataSource"){
              this.rules.sourceUserName[0].required = false;
              this.rules.sourcePwd[0].required = false;
          }
          if(item == "mysqlDataSource"){
              this.rules.sourceUserName[0].required = true;
              this.rules.sourcePwd[0].required = true;
          }
      },
      // 同步结构
      handleSync(row) {
          sourceStructure(row).then(res => {
              if (res.data && res.data.code == 0) {
                  if (res.data.data.syncStructure == 1) {
                      this.$message.success('同步成功')
                  }else if(res.data.data.syncStructure == 0){
                      this.$message.error('同步失败')
                  }else if (res.data.data.syncStructure == 2) {
                      this.$message.error('同步中请稍等')
                  }
                  this.getList()
              }
          })
      },
      //获取所有数据源
      getList () {
          this.tableLoading = true
          sourceList().then(res => {
              if (res.data && res.data.code == 0) {
                  this.tableData = res.data.data
                  this.tableData.forEach((item,index)=>{
                    item.sourceLoading = false
                    item.sourceData = []
                  })
              }
          }).finally(res=>{
              this.tableLoading = false
          })
      },
      // 删除
      delRowHandle (row) {
          this.$confirm(`删除数据`,'确认删除？',{
              confirmButtonText: '删除',
              cancelButtonText: '取消',
              confirmButtonClass:'el-button--danger',
              type: 'warning'
          }).then(()=> {
              delSource(row.id).then(res => {
              if(res.data.code == 0) {
                  this.$message.success('删除成功')
                  this.getList()
              }
              })
          }).catch(_ => {})
      },
      // 关闭数据库 弹窗
      handleImportClose() {
          this.$refs.bankForm.resetFields()
          this.importVisible = false
      },
      // 打开数据库 弹窗
      handleAdd() {
          this.importVisible = true
      },
      // 添加数据库 保存
      handleImportSubmit() {
        // 调用事件动态控制disabled属性，防重复提交
        this.disabled = true;
        this.$refs.bankForm.validate((valid) => {
          if (valid) {
            if (valid) {
                setsourceSave(Object.assign({},this.bankForm)).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('保存成功')
                        this.getList()
                    }
                }).finally(res=>{
                    setTimeout(() => {
                        this.disabled = false;
                    }, 2000)//两秒之后，按钮恢复启用状态
                })
            }
            this.handleImportClose()
          } else {
            this.disabled = false;
            return false
          }
        });
      },
      async changeFiledType(itemS,itemF,item){
        await this.getAllfieldType()
        this.changeTypeVisible = true
        this.currentChangeItem = item
        this.currentFirstItem = itemF
        this.currentSecondItem = itemS
      }
    }
  }
</script>

<style lang="scss" scoped>
  //按钮高度
  /deep/ .el-button--primary{
    height: 30px !important;
  }
  //表头颜色
  /deep/ .el-table__header-wrapper tr th{
    background-color: #F6F6F6 !important;
  }
  //表头字体
  /deep/ .el-table th.el-table__cell>.cell{
      font-weight: normal !important;
  }
  /deep/.el-table__body{
    tbody{
      tr{
        .el-table__expanded-cell{
          border-bottom: none !important;
          .el-table{
            &::before{
              content: none !important;
            }
          }
        }
      }
    }
  }
  .page-box{
    background: #fff;
    padding: 10px 10px;
    text-align: right;
  }
</style>
