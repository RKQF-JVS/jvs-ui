<template>
  <div class="tree-dictionaries">
    <div class="jvs-table left-tree-table">
      <PageHeader title="分类字典" :class="{'jvs-table-titleTop': true, 'jvs-table-top': true}">
        <div class="top">
          <el-row style="margin-left:10px;width: 100px;">
            <jvs-button size="mini" type="primary" icon="el-icon-plus" @click="addEditItem(null)">新增</jvs-button>
            <el-upload
              v-if="false"
              style="display:inline-block;margin:0 10px;"
              action="/mgr/jvs-auth/tree/import"
              :multiple="false"
              :limit="1"
              ref="uploadBtn"
              :file-list="fileList"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="errHandle"
              :headers="headers"
              :before-upload="beforeAvatarUpload">
              <jvs-button size="mini" type="primary">导入</jvs-button>
            </el-upload>
            <jvs-button v-if="false" size="mini" type="primary" @click="exportAll">导出所有</jvs-button>
          </el-row>
          <jvs-form style="flex:1;" :option="searchOption" :formData="searchForm" @submit="getList"></jvs-form>
        </div>
      </PageHeader>
    </div>
    <el-tree class="tree-dic" :data="data" :props="defaultProps" :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="label">{{ data.parentId == -1 ? data.name : node.label }}</span>
        <span class="tool">
          <el-popover
            placement="bottom"
            width="30"
            v-model="data.show"
            trigger="click">
            <ul class="tool-type-list">
              <li @click.stop="addEditItem(data)">
                <span>编辑</span>
              </li>
              <li @click.stop="delItem(data)">
                <span>删除</span>
              </li>
              <li @click.stop="addEditItem(data, 'children')">
                <span>新增子项</span>
              </li>
            </ul>
            <i slot="reference" class="el-icon-more"></i>
          </el-popover>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <jvs-form v-if="dialogVisible" :option="formOption" :formData="form" @submit="submitHandle"></jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import PageHeader from '@/components/page-header/PageHeader'
import {getTreeList, addTree, editTree, delTree, exportTreeList} from './api'
export default {
  components: {PageHeader},
  data() {
    return {
      data: [], // 所有树形结构
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'value'
      },
      searchForm: {},
      searchOption: {
        cancal: false,
        submitBtnText: "查询",
        labelWidth: 'auto',
        search: true,
        inline: true,
        isSearch: true,
        column: [
          {
            label: "名称",
            prop: "name",
            span: 6
          }
        ]
      },
      title: "", // 弹框标题
      dialogVisible: false,
      type: '', // 操作类型
      form: {}, // 字典项
      formOption: {
        cancal: false,
        submitLoading: false,
        column: [
          {
            label: "名称",
            prop: "name",
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' },
              { max: 20, message: '不得超过20个字', trigger: 'blur' }
            ],
            display: true
          },
          {
            label: "值",
            prop: "value",
            rules: [
              { required: true, message: '请输入值', trigger: 'blur' }
            ],
            display: true
          }
        ]
      },
      currentData: null,
      fileList: [],
      headers: {
        tenantId: this.$store.getters.userInfo.tenantId,
        Authorization: this.$store.getters.access_token
      }
    }
  },
  methods: {
    getList(form) {
      getTreeList(form).then(res => {
        if(res.data.code == 0) {
          this.data = res.data.data
        }
      })
    },
    addEditItem (data, type) {
      if(data) {
        this.currentData = data
        this.form = JSON.parse(JSON.stringify(data))
        this.type = 'edit'
        this.title = '编辑'
        if(data.extend && data.extend.value) {
          this.$set(this.form, 'value', data.extend.value)
        }
        if(type == 'children') {
          this.type = 'children'
          this.form = {
            name: '',
            value: '',
            parentId: data.id,
          }
          this.title = '新增子项'
        }
        this.formOption.column.filter(item => {
          if(['value'].indexOf(item.prop) > -1) { // 'name'
            item.display = this.form.parentId == -1 ? false : true
          }
        })
      }else{
        this.form = {
          name: '',
          value: '',
          parentId: -1
        }
        this.type = 'add'
        this.title = '新增'
        this.formOption.column.filter(item => {
          if([ 'value'].indexOf(item.prop) > -1) {
            item.display = false
          }
        })
      }
      this.dialogVisible = true
    },
    submitHandle (form) {
      this.formOption.submitLoading = true
      if(['add', 'children'].indexOf(this.type) > -1) {
        addTree(form).then(res => {
          if(res.data.code == 0) {
            let str = '新增成功'
            if(this.type == 'children') {
              str = '新增子项成功'
              this.currentData.show = false
            }
            this.$message.success(str)
            this.formOption.submitLoading = false
            this.handleClose()
            this.getList()
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      }
      if(this.type == 'edit') {
        editTree(form).then(res => {
          if(res.data.code == 0) {
            this.$message.success('修改成功')
            this.currentData.show = false
            this.formOption.submitLoading = false
            this.handleClose()
            this.getList()
          }
        }).catch(e => {
          this.formOption.submitLoading = false
        })
      }
    },
    handleClose () {
      this.form = {}
      this.title = ''
      this.type = ''
      this.dialogVisible = false
      this.$forceUpdate()
    },
    delItem (data) {
      this.$confirm('确定删除此项', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTree(data.id).then(res => {
          if(res.data.code == 0) {
            this.$message.success("删除成功")
            this.getList()
          }
        })
      }).catch(e => {})
    },
    exportAll () {
      let str = `/mgr/jvs-auth/tree/export`
      if(this.searchForm.dictName) {
        str += `?dictName=${this.searchForm.dictName}`
      }
      console.log(str)
      this.$openUrl(str, "_self")
    },
    uploadSuccess (res, file, fileList) {
      if(res.code == 0) {
        this.$message.success('导入成功')
        this.getList()
        this.fileList = []
      }else{
        this.$refs.uploadBtn.clearFiles()
        this.$message.error(res.msg)
      }
    },
    beforeAvatarUpload(file) {
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const extension3 = testmsg === 'json'
      if(!extension && !extension2 && !extension3) {
        this.$message.error('请使用标准的excel或json文件模板上传');
        return false;
      }
      return (extension || extension2 || extension3)
    },
    // 导入失败
    errHandle (err, file, fileList) {
      this.$refs.uploadBtn.clearFiles()
      this.$message.error(err)
    },
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.tree-dictionaries{
  height: 100%;
  overflow: hidden;
  .top{
    background: #fff;
    padding: 10px;
    padding-top: 20px;
    overflow: hidden;
    display: flex;
    border-bottom: 1px solid #DCDFE6;
  }
  .tree-dic{
    //height: calc(100% - 150px);
    height: calc(100% - 80px);
    overflow: hidden;
    overflow-y: auto;
    padding: 10px 10px 0 10px;
    .custom-tree-node{
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .tool{
        margin-right: 10px;
        display: none;
      }
    }
    .custom-tree-node:hover{
      .tool{
        display: block;
      }
    }
  }
}
.tool-buttons{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0;
  padding: 0;
  p{
    margin: 0;
    padding: 0;
  }
}
.tool-type-list{
  padding: 0;
  margin: 0;
  li{
    display: flex;
    align-items: center;
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px 10px;
    i{
      margin-right: 10px;
      font-size: 14px!important;
    }
  }
  li:hover{
    background: #F5F7FA;
  }
  li:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.tree-dictionaries{
  .pageheader-top{
    .pageheader-line{
      margin-left: 30px;
    }
  }
}
</style>
