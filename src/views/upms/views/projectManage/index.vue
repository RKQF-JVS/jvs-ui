<template>
  <div class="project-table-show">
    <jvs-table
      :pageheadertitle='pageheadertitle'
      :option="option"
      :data="tableData"
      :loading="tableLoading"
      :page="page"
      @on-load="getList"
      @search-change="searchChange"
      @addRow="addRowHandle"
      @editRow="editRowHandle"
      @delRow="delRowHandle"
    >
      <template slot="menuLeft">
        <jvs-button size="mini" type="primary" icon="el-icon-plus" @click="addPage('add')">新增</jvs-button>
        <jvs-button size="mini" type="primary" icon="el-icon-plus" @click="addPageByMode('add')">从模板新增</jvs-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="addPage('edit', scope.row)">编辑</jvs-button>
        <jvs-button size="mini" type="text" @click="addPage('view', scope.row)">查看</jvs-button>
        <jvs-button size="mini" type="text" v-if="!scope.row.isDeploy" @click="handlePublish(scope.row)">发布</jvs-button>
        <jvs-button size="mini" type="text" @click="handlePublishToTep(scope.row)" permisionFlag="page_application_deploy_template">发布到模板</jvs-button>
        <jvs-button size="mini" type="text" v-if="scope.row.isDeploy" @click="handleUnload(scope.row)">卸载</jvs-button>
      </template>
      <template slot="isDeploy" slot-scope="scope">
        <el-tag size="mini" :type="scope.row.isDeploy ? '' : 'info'">{{getIsDeployText(scope.row.isDeploy)}}</el-tag>
      </template>
    </jvs-table>

    <el-dialog
      title="模板选择"
      :visible.sync="designVisible"
      :before-close="handleModeClose"
      fullscreen
      append-to-body
      :modal="false"
      :class="{'no-header-dialog-my': false}"
    >
      <div v-if="designVisible">
        <project-dialog @addByTemplate="addByTemplate"></project-dialog>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="tableVisible"
      :before-close="handleClose"
      append-to-body
    >
      <div v-if="tableVisible">
        <jvs-form :option="formOption" :formData="formData" @submit="handleSubmit">
          <template slot="logoForm">
            <el-upload
              class="avatar-uploader"
              :action="`/mgr/jvs-auth//upload/${paramData.bucketName}`"
              :data="paramData"
              :disabled="isPublish"
              :headers="header"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeUpload">
              <img v-if="imageUrl || formData.logo" :src="imageUrl || formData.logo" class="avatar" alt=""/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
          <template slot="roleIdsForm">
            <el-select
              :disabled="isPublish"
              style="width: 100%"
              size="mini"
              v-model="formData.roleIds"
              filterable
              placeholder="请选择"
              multiple
              clearable
            >
              <el-option
                v-for="(item, key) in roleOptions"
                :key="key"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="userIdsForm">
            <el-select
              :disabled="isPublish"
              style="width: 100%"
              size="mini"
              v-model="formData.userIds"
              filterable
              placeholder="请选择"
              multiple
              clearable
            >
              <el-option
                v-for="(item, key) in userOptions"
                :key="key"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="imgsForm">
            <el-upload
              v-if="dialogType === 'template'"
              class="avatar-uploader"
              :action="`/mgr/jvs-auth//upload/${paramData.bucketName}`"
              list-type="picture-card"
              :data="paramData"
              :headers="header"
              :on-success="handleImgSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>
          <template slot="iconForm">
            <svg class="icon" aria-hidden="true" style="margin-right: 20px;width: 26px;height: 26px;">
              <use :xlink:href="'#'+formData.icon"></use>
            </svg>
          </template>
        </jvs-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tableOption } from './option'
import store from "@/store";
import {pageList, add, edit, del, publishToTemplate, unload, publish} from './api'
import ProjectDialog from "./components/projectDialog";
import {getUserListAll, getRoleList} from "@/api/common";
export default {
  components: {ProjectDialog},
  props: {
    propData: {
      type: Object
    }
  },
  data () {
    return {
      dialogTitle: '',
      roleOptions: [],
      userOptions: [],
      header: {
        "Authorization": 'Bearer ' + store.getters.access_token
      },
      isPublish: false,
      paramData: {
        bucketName: 'jvs-public',
        module: 'jvsapplogo',
        label: ''
      }, // 上传参数
      designVisible: false,
      tableVisible: false,
      dialogType: 'add',
      pageheadertitle: '项目表', // fixed me  表名
      tableLoading: false, // loading显示
      tableData: [], // 列表数据
      option: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      queryParams: {}, // 查询条件
      imageUrl: undefined,
      formData: {},
      formOption: {
        cancal: false,
        // btnHide: true,
        column: [
          {
            label: "名称",
            prop: "name",
            rules: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
          },
          {
            label: "分类",
            prop: "type",
            type: "select",
            dicUrl: '/mgr/jvs-auth//api/dict/type/jvsapp',
            dicData: [
              // {label: "选项一", value: "1"},
              // {label: "选项二", value: "2"}
            ],
            rules: [
              { required: true, message: '请选择分类', trigger: 'blur' }
            ],
          },
          {
            label: "图标",
            prop: "icon",
            type: 'iconSelect',
            formSlot: false,
            rules: [
              { required: true, message: '请选择图标', trigger: 'change' }
            ],
          },
          {
            label: 'LOGO',
            prop: 'logo',
            formSlot: true
          },
          {
            label: '角色',
            prop: 'roleIds',
            display: true,
            formSlot: true
          },
          {
            label: '用户',
            prop: 'userIds',
            display: true,
            formSlot: true
          },
          {
            label: '图片说明',
            prop: 'imgs',
            formSlot: true,
            display: false
          }
        ]
      }
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    // 发布到模板
    handlePublishToTep(row) {
      this.dialogTitle = '发布到模板'
      this.formData = row
      this.isPublish = true
      this.formOption.column.forEach(item => {
        item.disabled = true
      })
      this.dialogType = 'template'
      this.tableVisible = true
      this.formOption.column[6].display = true
      this.formOption.column[4].display = false
      this.formOption.column[5].display = false
      this.$forceUpdate()
    },
    // 发布
    handlePublish(row,str) {
      this.$confirm('是否确认发布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publish(row.id).then(res => {
          if (res.data && res.data.code == 0) {
            this.$message.success('发布成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 卸载
    handleUnload(row) {
      this.$confirm('卸载后所有的人无法操作，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unload(row.id).then(res => {
          if (res.data && res.data.code == 0) {
            this.$message.success('卸载成功')
            this.getList()
          }
        })
      }).catch(e => {})
    },
    // 获取option
    async getOptions() {
      await getRoleList().then(res => {
        if (res.data && res.data.code == 0) {
          this.roleOptions = res.data.data.map(item => {
            return { label: item.roleName, value: item.id }
          })
        }
      })
      await getUserListAll().then(res => {
        if (res.data && res.data.code == 0) {
          this.userOptions = res.data.data.map(item => {
            return { label: item.realName, value: item.id }
          })
        }
      })
    },
    // 显示状态
    getIsDeployText(val) {
      return val ? '已发布' : '未发布'
    },
    addByTemplate(obj) {
      this.designVisible = false
      const params = {
        templateId: obj.id
      }
      add(params).then(res => {
        this.$message.success('新增成功！')
        this.getList()
      })
    },
    handleSubmit(form) {
      if (this.imageUrl) {
        form.logo = this.imageUrl
      }
      this.imageUrl = undefined
      if (this.dialogType === 'add') {
        add(form).then(res => {
          this.$message.success('新增成功！')
          this.tableVisible = false
          this.getList()
        })
      } else if (this.dialogType === 'edit') {
        edit(form).then(res => {
          this.$message.success('编辑成功！')
          this.tableVisible = false
          this.getList()
        })
      } else {
        if (this.imgs) {
          form.imgs = [...this.imgs]
        }
        this.$confirm('是否确认发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          publishToTemplate(form).then(res => {
            if (res.data && res.data.code == 0) {
              this.$message.success('发布成功')
              this.tableVisible = false
              this.imgs = []
              this.getList()
            }
          })
        }).catch(e => {})
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data.fileLink
    },
    handleImgSuccess(res, file, fileList) {
      const imgList = fileList.map(item => {
        return item.response.data.fileLink
      })
      this.imgs = [...imgList]
    },
    handleRemove(file, fileList) {
      const imgList = fileList.map(item => {
        return item.response.data.fileLink
      })
      this.imgs = [...imgList]
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleModeClose() {
      this.designVisible = false
    },
    handleClose() {
      this.tableVisible = false
    },
    addPage(type, row) {
      this.formOption.disabled = false
      this.formOption.emptyBtn = true
      this.formOption.submitBtn = true
      this.formOption.column[6].display = false
      this.formOption.column[4].display = true
      this.formOption.column[5].display = true
      this.formOption.column[2].formSlot = false
      this.formOption.column.forEach(item => {
        item.disabled = false
      })
      this.formOption.disabled = false
      this.isPublish = false
      if (type === 'edit' && row) {
        this.dialogTitle = '编辑'
        this.formData = row
      }
      if (type === 'view' && row) {
        this.dialogTitle = '查看'
        this.formData = row
        this.formOption.disabled = true
        this.formOption.emptyBtn = false
        this.formOption.submitBtn = false
        this.formOption.column[2].formSlot = true
      }
      if (type === 'add') {
        this.dialogTitle = '新增'
        this.formData = {
          icon: ''
        }
      }
      this.dialogType = type
      this.tableVisible = true
    },
    addPageByMode() {
      this.designVisible = true
    },
    // 表格分页查询
    getList (page) {
      let obj={
        size: this.page.pageSize,
        current: this.page.currentPage
      }
      pageList(Object.assign(obj, this.queryParams)).then(res => {
        if (res.data.code==0) {
          this.tableData=res.data.data.records
          this.page.currentPage=res.data.data.current
          this.page.total=res.data.data.total
        }
      })
    },
    // 条件查询
    searchChange (form) {
      this.queryParams=form
      this.getList()
    },
    // 新增
    addRowHandle (form) {
      add(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getList()
        }
      })
    },
    // 编辑
    editRowHandle (form) {
      edit(form).then(res => {
        if(res.data.code == 0) {
          this.$message.success('编辑成功')
          this.getList()
        }
      })
    },
    // 删除
    delRowHandle (row) {
      del(row.id).then(res => {
        if(res.data.code == 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-uploader{
  .el-upload--picture-card {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 120px;
    height: 120px;
    //display: flex;
    //align-items: center;
    //justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .el-upload-list__item{
    width: 120px;
    height: 120px;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.project-table-show{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      padding: 0;
    }
  }
}
</style>
