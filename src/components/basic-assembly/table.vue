<template>
  <div :class="{'jvs-table': true, 'jvs-table-nocolumn': (!option.column || option.column.length == 0)}">
    <PageHeader :title="pageheadertitle" :class="{'jvs-table-titleTop': true, 'jvs-table-top': !option.search == false, 'jvs-table-hideTop': option.hideTop, 'jvs-table-notitle': !pageheadertitle}">
      <!-- <div style="height:20px" v-if="pageheadertitle"></div> -->
      <slot name="headerTop"></slot>
      <jvs-form v-if="!option.search == false && searchOption.column && searchOption.column.length > 0" :formData="searchFormData" :defalutFormData="searchFormData" class="search-form" :option="searchOption" @submit="searchHandle" :isSearch="true">
      </jvs-form>
      <div class="table-top">
        <div class="table-top-left">
          <el-button type="primary" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.addBtn==false)" @click="addForm" icon="el-icon-plus">{{option.addBtnText || '新增'}}</el-button>
          <slot name="menuLeft"></slot>
        </div>
        <div class="table-top-right">
          <slot name="menuRight"></slot>
        </div>
      </div>
    </PageHeader>
    <h4 class="table-title">{{option.title}}</h4>
    <div :class="'table-body-box '+tableKey">
      <el-table
        header-row-class-name='headerclass'
        :stripe="false"
        :ref="refs"
        :data="data"
        :tooltip-effect="tooltipEffect"
        :show-header="showHeader"
        :border="option.border"
        v-loading="loading"
        :size="size || 'mini'"
        :highlight-current-row="option.highlightCurrentRow"
        empty-text="抱歉，没有找到相关搜索内容！"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        @sort-change="handleSort"
        style="margin-top:10px"
      >
        <el-table-column type="selection" width="55" v-if="selectable"></el-table-column>
        <el-table-column type="index" width="50" :label="option.indexLabel" v-if="index"> </el-table-column>
        <el-table-column
          v-for="item in option.column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :show-overflow-tooltip="item.type == 'image' ? false : tooltipShow(item, option)"
          :header-align="option.menuAlign"
          :align="item.align || option.align"
          :width="item.width"
          :sortable="item.sort ? 'custom' : false"
          v-if="!item.hide"
          :type="item.expand"
        >
          <!-- 表头文字说明 -->
          <template slot="header" slot-scope="scope">
            <span v-if="editable && item.rules && item.rules.length > 0 && item.rules[0].required" style="color:#f56c6c;">*</span>
            <span>{{item.label}}</span>
            <el-tooltip v-if="item.headerExplain" effect="light" :content="item.explainContent" placement="top">
              <i class="el-icon-info info-icon"/>
            </el-tooltip>
          </template>
          <template slot-scope="scope" >
            <span>
              <!-- 自定义 -->
              <slot v-if="item.slot && !item.expand" :name="item.prop" :row="scope.row" :index="scope.$index"></slot>
              <!-- 动态控制 -->
              <span v-if="!item.slot && !item.expand && ( (item.expressControl && item.expressControl.length > 0) || (item.conditionControl && item.conditionControl.length > 0) )"
                :style="'padding: 2px 10px;border-radius: 5px;'+ (styleRowItem(scope.row, item, 'color') ? ('color:' + styleRowItem(scope.row, item, 'color') + ';') : '')
                + (styleRowItem(scope.row, item, 'bgcolor') ? ('background-color:' + styleRowItem(scope.row, item, 'bgcolor') + ';') : '') +';'">{{styleRowItem(scope.row, item, 'text')}}</span>
              <span v-if="!item.slot && !item.expand && (!item.expressControl || item.expressControl.length == 0) && (!item.conditionControl || item.conditionControl.length == 0)">
                <!-- 一般列 -->
                <span v-if="!item.color && !item.dicData && (['datetime', 'link', 'image', 'file'].indexOf(item.type) == -1)" :style="'color:'+item.color+';'">{{scope.row[item.prop+'_1'] ? scope.row[item.prop+'_1'] : scope.row[item.prop]}}</span>
                <!-- 特殊颜色 -->
                <span v-if="item.color && !item.dicData && (['datetime', 'link', 'image', 'file'].indexOf(item.type) == -1) && ( (item.expressControl && item.expressControl.length > 0) || (item.conditionControl && item.conditionControl.length > 0) )" :style="'color:'+item.color+';'">{{scope.row[item.prop]}}</span>
                <!-- 日期时间 -->
                <span v-if="item.type == 'datetime'" :style="item.color ? ('color:'+item.color): ''">{{scope.row[item.prop] | dateFormat(item.format)}}</span>
                <!-- 字典 -->
                <span v-if="(['datetime', 'link', 'image', 'file'].indexOf(item.type) == -1) && item.dicData" :style="item.color ? ('color:'+item.color): ''">{{scope.row[item.prop] | dicFormat(item.dicData, item.props)}}</span>
                <!-- 链接 -->
                <a :href="scope.row[item.prop]" :target="item.openType || '_blank'" v-if="item.type == 'link'" :style="item.color ? ('color:'+item.color): ''">{{item.text}}</a>
                <!-- 图片 -->
                <img v-if="item.type == 'image' && (typeof scope.row[item.prop] == 'string' || (scope.row[item.prop] && scope.row[item.prop].length == 1))" :src="typeof scope.row[item.prop] == 'string' ? scope.row[item.prop] :  ( (scope.row[item.prop] && scope.row[item.prop].length > 0) ? scope.row[item.prop][0].url : '' )" :style="(item.imgWidth ? ('width:' + item.imgWidth + 'px;') : '') + (item.imgHeight ? ('height:' + item.imgHeight + 'px;') : '')" />
                <!-- 文件 -->
                <a v-if="['file'].indexOf(item.type) > -1  && (typeof scope.row[item.prop] == 'string' || (scope.row[item.prop] && scope.row[item.prop].length == 1))" :href="typeof scope.row[item.prop] == 'string' ? scope.row[item.prop] :  ( (scope.row[item.prop] && scope.row[item.prop].length > 0) ? scope.row[item.prop][0].url : '')" :target="'_blank'">{{typeof scope.row[item.prop] == 'string' ? '文件' :  ( (scope.row[item.prop] && scope.row[item.prop].length > 0) ? scope.row[item.prop][0].name : '')}}</a>
                <el-popover
                  v-if="['image', 'file'].indexOf(item.type) > -1 && (scope.row[item.prop] && scope.row[item.prop] instanceof Array && scope.row[item.prop].length > 1)"
                  placement="bottom"
                  trigger="click">
                  <div class="img-file-list">
                    <div v-for="(ifit, ifix) in scope.row[item.prop]" :key="item.type+'-item-'+ifix" class="if-item">
                      <img v-if="item.type == 'image'" :src="ifit.url" :alt="ifit.name">
                      <span>{{ifit.name}}</span>
                      <i class="el-icon-download" @click="$openUrl(ifit.url, '_blank')"></i>
                    </div>
                  </div>
                  <el-button type="text" slot="reference">共{{scope.row[item.prop].length + (item.type == 'image' ? '张图片' : '个文件')}}</el-button>
                </el-popover>
              </span>
            </span>
          </template>

        </el-table-column>
        <el-table-column :fixed="option.menuFix" label="操作" :width="option.menuWidth" v-if="option.menu!==false" :align="option.menuAlign">
          <template slot-scope="scope">
            <div>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.viewBtn==false)" @click="viewHandle(scope.row,scope.$index)">{{option.viewBtnText || '查看'}}</el-button>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.editBtn==false)" @click="editHandle(scope.row,scope.$index)">{{option.editBtnText || '编辑'}}</el-button>
              <!-- 操作栏自定义 -->
              <slot name="menu" :row="scope.row" :index="scope.$index"></slot>
              <el-button type="text" :size="$store.state.params.btn.size || 'mini'" v-if="!(option.delBtn==false)" @click="delHandle(scope.row,scope.$index)"><span style="color: #F56C6C;">{{option.delBtnText || '删除'}}</span></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="tablepagination"
      v-if="option.page"
    >
      <el-pagination
        background
        :layout="page.layout || pagination.layout"
        :total="page.total || pagination.total"
        :current-page="page.currentPage || pagination.currentPage"
        :page-sizes="page.pageSizes || pagination.pageSizes"
        :page-size="page.pageSize || pagination.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <slot name="menuLeftBottom"></slot>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal='option.dialogClickModal'
      :close-on-press-escape='option.dialogEscape'
      append-to-body
      :width="option.dialogWidth || '75%'"
      :fullscreen="option.dialogWidth == '100%' ? true : false"
      :class="{'form-fullscreen-dialog': option.dialogWidth == '100%'}"
      :before-close="handleClose">
      <jvs-form v-if="dialogVisible" :formData="rowData" :defalutFormData="rowData" :option="formOpton" @submit="submitHandle" :isSearch="false" @cancalClick="handleClose">
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import PageHeader from '../../components/page-header/PageHeader'
import { getSelectData } from '@/api/index.js'
export default {
  name: "jvs-table",
  components: { PageHeader },
  props: {
    pageheadertitle: {
      type:String,
      default: '',
    },
    // 绑定表格 refs
    refs: {
      type: String,
      default: 'multipleTable'
    },
    // 是否显示表格头
    showHeader: {
      type: Boolean,
      default: true
    },
    // tip提示背景
    tooltipEffect: {
      type: String,
      default: 'light', // 'dark'
    },
    // 是否可以多选
    selectable: {
      type: Boolean,
      default: false
    },
    // 是否提示 等待加载loading
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    // 是否显示顺序
    index: {
      type: Boolean,
      default: false
    },
    // 分页配置
    page: {
      type: Object,
      default: (data) => {
        return {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
          pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
          layout: "total, sizes, prev, pager, next, jumper", // 分页工具
        }
      }
    },
    // 表格数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 搜索表单
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格配置
    option: {
      type: Object,
      default: () => {
        return {
          border: false, // 表格是否边框
          page: true, // 是否分页
          align: 'left', // body对齐
          menuAlign: 'left', // 表头对齐
          menuFix: 'right', // 操作栏固定位置
          menuWidth: 200, // 操作栏宽度
          search: false, // 是否开启查询
          showOverflow: true, // 超出是否合并移入悬浮tip显示
          menu: true,
          indexLabel:'序号',
          // 搜索表单设置
          formAlign: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          searchBtn:true,//搜索的查询按钮
          searchBtnText: "查询", // 提交按钮文字，默认 提交
          submitBtn: true, // 提交按钮是否显示，默认显示
          submitBtnText: '保存', // 提交按钮文字，默认 提交
          emptyBtn: true, // 重置按钮，默认显示
          emptyBtnText: '清空', // 重置按钮文字，默认 重置
          addDialogText:'新增',//新增弹窗title,默认 新增
          editDialogText: '编辑', //编辑弹框title，默认 编辑
          submitLoading: false, // 默认表单提交按钮loading，初始值默认false
          searchLoading: false, // 查询表单提交按钮loading，初始值默认false
          column: [
            {
              label: '', // 文字
              prop: '', // 字段
              search: false, // 是否搜索
              slot: false, // 是否自定义
              hide: true, // 当前列在表格是否隐藏
              color: '', // 颜色特殊显示
              align: '', // 默认与table保持一致，可自定义 left right center
              menuAlign: '', // 默认与table保持一致，可自定义 left right center
              type: '', // 文本类型，默认input
              dicData: [], // 字典数据
              showOverflow: true, // 超出是否合并移入悬浮tip显示

              // 搜索表单对应
              span: 24, // 表单项栅格比，默认24
              formSlot: false, // 表单项是否自定义

              // 新增、编辑、查看对应表单设置
              addDisabled: false, // 表单新增时是否禁止
              addDisplay: true, // 表单新增时是否可见
              editDisabled: false, // 表单编辑时是否禁止
              editDisplay: false, // 表单编辑是否可见
              viewDisplay: true, // 表单查看是否可见
            }
          ]
        }
      }
    },
    // 是否清空多选，随机数
    isClearSelect: {
      type: Number
    },
    // 已选数据
    selectedRows: {
      type: Array
    },
    // 是否默认全选
    defaultAllSelect: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean
    }
  },
  data () {
    return {
      tableKey: 'table' + new Date().getTime(),
      searchForm: {},
      tempForm: {},
      title: '', // 弹框标题
      dialogVisible: false,
      rowData: {}, // 行数据
      formOpton: {},
      optype: 'addRow', // 提交方式
      pagination: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
        layout: "total, sizes, prev, pager, next, jumper", // 分页工具
      },
      // 搜索表单配置
      searchOption: {},
      daActionIndex:0,
    };
  },
  filters: {},
  created () {
    let searchObj = {}
    this.searchOption = JSON.parse(JSON.stringify(this.option))
    this.searchOption.labelWidth = 'auto'
    let temp = []
    for(let i in this.searchOption.column) {
      if(this.option.column[i].dicUrl) {
        let _this = this
        getSelectData(this.option.column[i].dicUrl).then(res=>{
          _this.option.column[i].dicData = res.data.data
        })
      }
      if(this.searchOption.column[i] && this.searchOption.column[i].search == true) {
        if(this.searchOption.column[i].formSlot == true) {
          this.searchOption.column[i].formSlot = false
        }
        searchObj[this.searchOption.column[i].prop] = null
        // 弹窗表格的栅格
        if(this.searchOption.column[i] && !this.searchOption.column[i].span) {
          this.searchOption.column[i].span = this.searchOption.span || 6
        }
        // 搜索表格的栅格
        if (this.searchOption.column[i] && !this.searchOption.column[i].searchSpan && this.searchOption.column[i].search) {
          this.searchOption.column[i].searchSpan = this.searchOption.searchSpan || 6
        }
        // 去除提示tips
        if(this.searchOption.column[i] && this.searchOption.column[i].tips) {
          this.searchOption.column[i].tips = null
        }
        temp.push(this.searchOption.column[i])
      }
    }
    // 去除搜索条件的校验
    for(let j in temp) {
      if(temp[j].rules && temp[j].rules.length > 0) {
        for(let k in temp[j].rules) {
          if(temp[j].rules[k].required && temp[j].rules[k].required === true) {
            temp[j].rules[k].required = false
          }
        }
      }
    }
    this.searchOption.column = temp
    this.searchOption.isSearch = true
    if(JSON.stringify(this.searchFormData) == '{}') {
      this.searchFormData = JSON.parse(JSON.stringify(searchObj))
    }
    this.$emit('on-load', this.page)
  },
  mounted () {
    // 多选回显
    if(this.selectable == true) {
      if (this.selectedRows && this.selectedRows.length > 0 && this.$refs[this.refs]) {
        this.selectedRows.forEach(row => {
          for(let i in this.data) {
            let keys = Object.keys(this.data[i])
            let k2 = 'id' // Object.keys(row)[0]
            if(keys.indexOf(k2) > -1) {
            }else{
              k2 = 'aliasColumnName'
            }
            if(this.data[i][k2] == row[k2]) {
              this.$refs[this.refs].toggleRowSelection(this.data[i])
            }
          }
        });
      } else {
        this.$refs[this.refs].clearSelection();
        // 默认全选上
        if(this.defaultAllSelect == true) {
          this.data.forEach(row => {
            this.$refs[this.refs].toggleRowSelection(row);
          })
        }
      }
    }
    // 表格自适应高
    this.styleHeight()
  },
  computed: {
    searchFormData: {
      get () {
        return this.formData
      },
      set (newVal) {
        this.tempForm = newVal
      }
    },
  },
  methods: {
    // 排序
    handleSort(row) {
      this.$emit('sort-change', row)
    },
    // 行点击
    rowClick (row, column, cell, event) {
      this.$emit('row-click', { row, column, cell, event })
    },
    // 多选
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    // 搜索
    searchHandle (form) {
      if(this.option.page){
        this.$set(form, 'current', 1)
      }
      this.$set(this, 'searchFormData', form)
      this.$emit('search-change', form)
    },
    // 清空
    emptyHandle () {
      this.searchForm = {}
    },
    // 分页大小变化
    handleSizeChange (val) {
      this.page.pageSize = val
      this.$emit('on-load', this.page)
      this.$emit('size-change', this.page)
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.page.currentPage = val
      if(this.option.page){
        // let obj = this.searchFormData
        let obj = this.tempForm
        this.$set(obj, 'current', val)
        this.$emit('search-change', obj)
      }else{
        this.$emit('on-load', this.page)
      }
      this.$emit('current-change', this.page)
    },
    // 判断是否需要超出文字提示
    tooltipShow (item, option) {
      let temp = true
      temp = (item.showOverflow == false) ? (item.showOverflow && option.showOverflow) : (item.showOverflow || option.showOverflow)
      return temp
    },
    // 关闭弹框
    handleClose () {
      this.formOpton.column.forEach((item,index)=>{
        if(['imageUpload','fileUpload'].indexOf(item.type)!=-1){
          item.fileList = []
        }
      })
      this.rowData = {}
      this.dialogVisible = false
    },
    // 表单提交
    submitHandle (form) {
      if (this.optype == 'addRow') {
        this.$emit('addRow', form)
      }
      if (this.optype == 'editRow') {
        this.$emit('editRow', form, this.daActionIndex)
      }
      this.handleClose()
    },
    // 新增
    addForm () {
      this.formOpton = this.option // JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = this.formOpton.submitBtnText || '提交'
      this.title = this.formOpton.addDialogText || '新增'
      this.optype = 'addRow'
      this.formOpton.disabled = false
      this.formOpton.submitBtn = true
      // this.formOpton.emptyBtn = true
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].addDisabled == true) {
          this.formOpton.column[i].disabled = true
        }
        if(this.formOpton.column[i].addDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      // this.formOpton.column = temp
      this.dialogVisible = true
    },
    // 查看
    viewHandle (row,index) {
      this.daActionIndex = index
      this.formOpton = JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = '提交'
      this.title = '查看'
      this.optype = 'viewRow'
      this.formOpton.disabled = true
      this.formOpton.submitBtn = false
      this.formOpton.emptyBtn = false
      this.rowData = row
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].viewDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      this.formOpton.column = temp
      this.dialogVisible = true
    },
    editHandle (row,index) {
      this.daActionIndex = index
      this.formOpton = this.option // JSON.parse(JSON.stringify(this.option))
      this.formOpton.submitBtnText = this.formOpton.submitBtnText || '提交'
      this.title = this.formOpton.editDialogText || '编辑'
      this.optype = 'editRow'
      this.formOpton.disabled = false
      this.formOpton.submitBtn = true
      // this.formOpton.emptyBtn = true
      this.rowData = JSON.parse(JSON.stringify(row))
      let temp = []
      for(let i in this.formOpton.column) {
        if(this.formOpton.column[i].editDisabled == true) {
          this.formOpton.column[i].disabled = true
        }
        if(this.formOpton.column[i].editDisplay != false) {
          temp.push(this.formOpton.column[i])
          this.formOpton.column[i].display = true
        }else{
          this.formOpton.column[i].display = false
        }
      }
      // this.formOpton.column = temp
      this.dialogVisible = true
    },
    delHandle (row,index) {
      this.$confirm('此操作将永久删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.optype = 'delRow'
        this.$emit('delRow', row,index)
      }).catch(() => {

      });
    },
    // 清空多选
    clearSelect () {
      this.$refs[this.refs].clearSelection()
    },
    // 表格高度适应
    styleHeight () {
      let height = $('#app').height()
      if($('.jvs-table-titleTop') && $('.jvs-table-titleTop').length > 0) {
        height -= $('.jvs-table-titleTop').height()
      }
      if(this.showHeader) {
        // height -= 55
        height -= 35
      }
      if(this.option.page) {
        if($('.tablepagination') && $('.tablepagination').length > 0) {
          height -= ($('.tablepagination').height() + 40)
        }
      }
      $('.'+ this.tableKey + ' ' + ".el-table__body-wrapper")[0].style.maxHeight = height
      $('.'+ this.tableKey + ' ' + ".el-table__body-wrapper").height(height)
      if(this.option.menuFix) {
        $('.'+ this.tableKey + ' ' + ".el-table__fixed-body-wrapper").height(height)
      }
    },
    doLayout(){
      let _this = this
      this.$nextTick(() => {
        console.log(_this.$refs[_this.refs])
        _this.$refs[_this.refs].doLayout()
      })
    },
    // 动态控制行数据显示
    styleRowItem (row, item, type) {
      let val = row[item.prop]
      let color = ""
      let bgcolor = ''
      if(item.expressControl && item.expressControl.length > 0) {
        for(let i in item.expressControl) {
          if(item.expressControl[i].express) {
            let str = item.expressControl[i].express.replace(/\$\{/g,"row.")
            str = str.replace(/}/g, "")
            if(eval(str)){
              if(item.expressControl[i].text.includes('${')) {
                let ts = item.expressControl[i].text
                ts = ts.replace(/\$\{/g,"row.")
                ts = ts.replace(/}/g, "")
                if(eval(ts)) {
                  val = eval(ts)
                }
              }else{
                val = item.expressControl[i].text
              }
              color = item.expressControl[i].color
            }
          }
        }
      }
      if(item.conditionControl && item.conditionControl.length > 0) {
        let hadFix = false
        for(let i in item.conditionControl) {
          if(item.conditionControl[i].value) {
            let arr = item.conditionControl[i].value.split(',')
            if(arr.indexOf(row[item.prop]) > -1) {
              hadFix = true
              if(item.conditionControl[i].text) {
                val = item.conditionControl[i].text
              }else{
                val = row[item.prop+'_1'] ? row[item.prop+'_1'] : row[item.prop]
              }
              if(item.conditionControl[i].color) {
                color = item.conditionControl[i].color
              }
              if(item.conditionControl[i].bgcolor) {
                bgcolor = item.conditionControl[i].bgcolor
              }
            }
          }
        }
        if(!hadFix) {
          if(item.color) {
            color = item.color
          }
          if(item.backColor) {
            bgcolor = item.backColor
          }
        }
      }
      if(type == 'color') {
        return color
      }else if(type == 'bgcolor'){
        return bgcolor
      }else{
        return val
      }
    }
  },
  watch: {
    isClearSelect: {
      handler(newVal, oldVal) {
        if(newVal != 0) {
          this.clearSelect()
        }
      }
    },
    data: {
      handler(newVal, oldVal) {
        this.styleHeight()
        if(this.option.menuFix) {
          this.doLayout()
        }
      }
    },
    'option.searchLoading': {
      handler(newVal, oldVal) {
        this.$set(this.searchOption, 'submitLoading', (newVal || false))
      }
    }
  }
};
</script>
<style lang="scss">
.el-table {
  .el-table__body-wrapper {
    overflow-y: auto;
    .el-table__empty-block {
      box-sizing: border-box;
      min-height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ebebeb;
    }
  }
  .el-table__body-wrapper:hover::-webkit-scrollbar{
    height: 8px;
  }
  th{
    font-size: 14px;
    font-family: MiSans-Demibold;
    font-weight: 600;
    color: #222222;
  }
}
.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    align-items: center;
    margin-left: 0;
  }
  .form-item-btn{
    width: auto;
  }
}
.tablepagination {
  padding: 20px 0;
  background-color: #fff;
  overflow: hidden;
  .el-pagination {
    float: right;
    padding: 0;
    margin-right: 20px;
  }
}
.table-top {
  width: 100%;
  overflow: hidden;
  .table-top-left{
    float: left;
    // margin: 10px 0;
  }
  .table-top-right {
    float: right;
    display: flex;
  }
}
.table-title{
  margin: 0;
  text-align: center;
}
// 去除斑马纹
.el-table--striped .el-table__body tr.el-table__row--striped td{
  background-color: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: #F5F7FA;
}
.jvs-table{
  .pageheader-top{
    display: none;
  }
  .el-table{
    // margin-top: 0!important;
  }
  .table-body-box{
    padding: 0 20px;
    background-color: #fff;
    .info-icon{
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .jvs-table-top{
    padding: 10px;
    box-shadow: none;
    .search-form{
      margin-bottom: 10px;
    }
  }
  .jvs-table-hideTop{
    .table-top{
      display: none;
    }
  }
  .jvs-table-notitle{
    .pageheader-top{
      display: none;
    }
  }
  .jvs-table-hideTop.jvs-table-notitle{
    .el-card__body{
      display: none;
    }
  }
  .el-loading-mask{
    background-image: url('../../styles/loading.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 300px 240px;
    .el-loading-spinner{
      .circular{
        display: none;
      }
    }
  }
}
// 文字提示
.el-tooltip__popper{
  max-width: 70%;
}
.jvs-table-nocolumn{
  width: 100%;
  height: 100vh;
  position: relative;
  .jvs-table-top, .table-title, .table-body-box, .tablepagination{
    display: none;
  }
}
.jvs-table-nocolumn::before{
  content: "";
  display: block;
  width: 457px;
  height: 180px;
  background-image: url(/jvs-ui/static/img/emptyImage.ca3665f2.png);
  background-size: 260px 123px;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  left: calc(50% - 228px);
  top: calc(50% - 180px);
}
.jvs-table-nocolumn::after{
  content: "抱歉，没有找到相关搜索内容！";
  position: absolute;
  left: calc(50% - 80px);
  top: calc(50%);
}
.img-file-list{
  padding: 30px 35px;
  .if-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    margin-top: 15px;
    box-sizing: border-box;
    width: 300px;
    flex-wrap: nowrap;
    min-height: 40px;
    background: #ebeef5;
    border-radius: 5px;
    border: 1px solid #ebeef5;
    overflow: hidden;
    img{
      display: block;
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    i{
      cursor: pointer;
      font-size: 20px;
    }
    span{
      flex: 1;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
      font-size: 16px;
    }
  }
  .if-item:nth-of-type(1){
    margin-top: 0;
  }
  .if-item:hover{
    border-color: #409EFF;
    span{
      color: #409EFF;
    }
  }
}
</style>
