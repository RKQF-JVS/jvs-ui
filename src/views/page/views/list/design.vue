<template>
  <div class="design-content">
    <title-page-header title="列表设计" :needLoading="true" :hassave="false" :hasclose="false" @save="saveHandle('save')" @close="closeDesignHandle(true)">
      <template slot="left">
        <div class="cont-top">
          <div class="cont-top-item">
            <p>{{infoData.name}}</p>
            <p><el-tag size="mini" :type="infoData.isDeploy ? '' : 'info'">{{infoData.isDeploy ? '已发布' : '未发布'}}</el-tag></p>
          </div>
        </div>
      </template>
      <template slot="right">
<!--        <p>-->
<!--          <el-tooltip effect="dark" content="列表页请求配置" placement="top">-->
<!--            <i class="el-icon-connection form-design-tool" @click="saveHandle('http')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p class="design-tool">-->
<!--          <el-tooltip effect="dark" content="复制地址" placement="top">-->
<!--            <span-->
<!--              v-clipboard:copy="getpageUrl(infoData)"-->
<!--              v-clipboard:success="onCopy"-->
<!--              v-clipboard:error="onError"-->
<!--              @click="onCopy"-->
<!--              style="line-height:0px;"-->
<!--            >-->
<!--              <svg class="icon form-design-tool">-->
<!--                <use xlink:href="#icon-link"></use>-->
<!--              </svg>-->
<!--            </span>-->
<!--          </el-tooltip>-->
<!--        </p>-->
        <p class="design-tool">
          <el-tooltip effect="dark" content="设置" placement="top">
            <i class="el-icon-setting form-design-tool" @click="handleSetting()"></i>
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="预览" placement="top">
            <i class="el-icon-view form-design-tool" @click="saveHandle('preview')"></i>
          </el-tooltip>
        </p>
<!--        <p>-->
<!--          <el-tooltip effect="dark" content="数据结构" placement="top">-->
<!--            <i class="el-icon-c-scale-to-original form-design-tool" @click="saveHandle('json')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
        <p>
          <el-tooltip effect="dark" content="保存" placement="top">
            <i v-show="saveLoading" class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="保存" placement="top">
            <img v-show="!saveLoading" :src="saveIcon" alt="" style="display:block;padding:2px;width:16px;height:16px;" @click="saveHandle('save')">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="发布" placement="top">
            <i v-if="publishLoading" class="el-icon-loading" style="font-size:20px;color:#353535;"></i>
            <i v-else class="el-icon-s-promotion" style="font-size:20px;color:#353535;cursor:pointer;" @click="publishClick"></i>
          </el-tooltip>
        </p>
<!--        <p v-if="infoData.modelType == 'DEVELOP'">-->
<!--          <el-tooltip effect="dark" content="数据结构" placement="top">-->
<!--            <i class="el-icon-c-scale-to-original form-design-tool" @click="saveHandle('json')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
<!--        <p v-if="infoData.modelType == 'DEVELOP'">-->
<!--          <el-tooltip effect="dark" content="下载源码" placement="top">-->
<!--            <i class="el-icon-folder-checked form-design-tool" @click="saveHandle('download')"></i>-->
<!--          </el-tooltip>-->
<!--        </p>-->
      </template>
    </title-page-header>
    <el-steps :active="activeStep" align-center style="margin-top:8px;" v-if="false">
      <el-step title="数据设计" description=""></el-step>
      <el-step title="显示设计" description=""></el-step>
      <el-step title="完成" description=""></el-step>
    </el-steps>
    <el-row style="position:absolute;top: 20px;width: 100%;padding: 0 40px;" v-if="false">
      <jvs-button size="mini" style="float:left;" @click="lastStep" v-if="activeStep > 0">上一步</jvs-button>
      <jvs-button size="mini" style="float:right;" @click="nextStep" v-if="activeStep < 1">下一步</jvs-button>
    </el-row>
    <!-- 数据设计 -->
    <datascurceDesign v-if="activeStep == 0 && modelType == 'DEVELOP'" :infoData="infoData" />
    <!-- <datascurceDesign :systemId="systemId+''" :menuFormData="menuFormData" /> -->
    <designPage
      v-if="activeStep == 1"
      :infoData="infoData"
      :modelType="modelType"
      :roleType="roleType"
      :designId="designId"
      :dataModelId="dataModelId"
      :role="role"
      @closeDesign="closeDesignHandle"
      @getDesignData="getDesignData"
      @handleSaveLoading="handleSaveLoading"
      @getButtons="getButtons"
      @getList="getList"
      @handleSave="saveHandle('save')"
    />
    <!-- <designPage
      :menuId="menuId"
      :systemId="systemId+''"
      :menuName="menuForm.menuName"
      :menuFormData="menuFormData"
      :menuDicData="cascaderPptions"
      :treeData="treeData"
    /> -->
    <!-- 设置 -->
    <el-dialog
      title="设置"
      :visible.sync="settingVisible"
      width="60%"
      append-to-body
      :before-close="handleSettingClose">
      <div style="height: 40vh">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="权限设置" name="permission">
            <permission
              ref="permissionConfig"
              v-if="settingVisible"
              :operationList="operationList"
              :role="role"
              :roleType="roleType"
              @submitPermission="submitPermission"
            />
          </el-tab-pane>
          <el-tab-pane label="数据设置" name="callBack">
            <el-form style="padding: 0 20px;" class="demo-form-inline" label-width="100px" label-position="top">
              <el-form-item label="">
                <span style="color: #a3a3a3">所有的数据都会以网络请求到此地址进行数据转换。可进行业务二次对接。</span>
                <el-table
                  border
                  :data="callbackSettingData"
                  :span-method="arraySpanMethod"
                  class="tb-edit button-set-table"
                  style="width: 100%"
                  size='mini'
                >
                  <!-- 表头文字说明 -->
                  <el-table-column label="事件" width="150px">
                    <template slot-scope="scope">
                      {{ scope.row.desc }}
                    </template>
                  </el-table-column>
                  <el-table-column label="回调地址">
                    <template slot="header" slot-scope="scope">
                      <span>回调地址 </span>
                      <el-tooltip effect="light" content="默认请求方式为post" placement="top">
                        <i class="el-icon-info info-icon" style="cursor: pointer"/>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;">
                        <el-input
                          size="mini"
                          v-model="scope.row.callbackUrl"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否异步回调" width="150px">
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;">
                        <el-checkbox size="mini" v-model="scope.row.callbackAsync"></el-checkbox>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSettingClose">取 消</el-button>
        <el-button type="primary" @click="handleSettingSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getKeyValue} from '../../api/list'
import saveicon from "@/const/img/保存.png"
import datascurceDesign from '../design/datasourceDesign'
import designPage from '../design/list'
import {getDesignById, getDesignInfo, updateDesignInfo} from "../../api/design";
import Permission from "../../components/list/permission";
import {getModelSetting, updateModelSetting} from "../../../../api/newDesign";
import {deployPage} from "../../api/newDesign";
export default {
  components: {datascurceDesign, designPage, Permission},
  props: {
    // infoData: {
    //   type: Object
    // },
    systemId: {
      type: Number
    },
    menuId: {
      type: Number
    },
    menuForm: {
      type: Object
    }
  },
  data () {
    return {
      saveLoading: false, // 保存loading
      publishLoading: false, // 发布loading
      saveIcon: saveicon,
      role: [], // 权限设置
      roleType: true, // 权限类型,true 应用 权限，false 自定义权限
      operationList: [], // 操作权限list
      settingVisible: false, // 设置弹框
      activeName: 'permission', // tabs
      infoData: {},
      activeStep: 0,
      labelValue: {},
      menuFormData: {},
      modelType: '', // 模式  产品pro  开发dev
      designId: '',
      dataModelId: '',
      designData: {},
      callbackSettingData: [],
    }
  },
  created () {
    this.getKeyValueHandle()
    if (this.$route.query && this.$route.query.id) {
      this.getInfoData(this.$route.query.id)
      this.designId = this.$route.query.id
      this.dataModelId = this.$route.query.dataModelId
      this.getModelSetting(this.$route.query.dataModelId)
    }
    // if(this.infoData) {
    //   this.activeStep = 1
    //   this.modelType = this.infoData.type
    // }


    if(this.menuForm) {
      this.menuFormData = this.menuForm
    }
  },
  methods: {
    // 设置
    handleSetting() {
      this.setPermission('permission')
    },
    // 关闭设置弹窗
    handleSettingClose() {
      this.settingVisible = false
    },
    // 设置提交
    async handleSettingSubmit () {
      await this.callbackSettingSubmit()
      await this.$refs.permissionConfig.handleConfirm()
      this.settingVisible = false
      this.$message.success('设置成功')
    },
    // 发布
    publishClick() {
      this.publishLoading = true
      const row = this.infoData
      let obj = JSON.parse(JSON.stringify(row))
      obj.type = 'page'
      let msg = ''
      if(row.isDeploy){
        msg = '设计已经发布，此次保存可能会影响使用，是否继续操作？'
      }
      if(msg) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deployPage(obj).then(res => {
            if(res.data.code == 0) {
              this.publishLoading = false
              this.$message.success('发布成功')
            }
          })
        }).catch(e => {
          this.publishLoading = false
        })
      }else{
        this.$confirm('是否确认发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deployPage(obj).then(res => {
            if(res.data.code == 0) {
              this.publishLoading = false
              this.$message.success('发布成功')
            }
          })
        }).catch(e => {})
      }
    },
    // 获取数据关联设置
    getModelSetting(modelId) {
      getModelSetting(modelId).then(res => {
        if (res.data && res.data.code == 0) {
          this.callbackSettingData = [...res.data.data.eventList]
        }
      })
    },
    // 生成地址
    getpageUrl (row) {
      let str = location.origin
      str += ('/page-design-ui/#/show?id='+row.id + (row.dataModelId ? `&dataModelId=${row.dataModelId}` : '') + `&isDeploy=${row.isDeploy}`)
      return str
    },
    // 复制
    onCopy (e) {
      console.log(e.text)
      if(e.text) {
        this.$message.success('复制成功')
      }
    },
    onError (e) {
      console.log(e)
    },
    // 获取设计数据
    getDesignData(data) {
      this.saveLoading = false
      this.designData = JSON.parse(JSON.stringify(data))
    },
    // 操作保存loading
    handleSaveLoading() {
      this.saveLoading = false
    },
    // 获取按钮
    getButtons(arr) {
      const buttonArr = arr.map(item => {
        return item.name
      })
      this.operationList = [...buttonArr]
      this.settingVisible = true
    },
    // 设置权限
    setPermission(type) {
      this.$root.eventBus.$emit('pageEvent', type)
    },
    // 权限提交
    submitPermission(arr, roleType) {
      // this.roleType = roleType
      // this.role = [...arr]
      this.designData.role = roleType ? undefined : [...arr]
      this.designData.roleType = roleType
      updateDesignInfo(this.infoData.id, this.designData).then(res => {
        if(res.data.code == 0) {
          this.getInfoData(this.infoData.id)
        }
      }).catch(e => {
        this.submitLoding = false
      })
    },
    // 获取设计详情
    async getInfoData(id) {
      await getDesignById(id).then(res => {
        if (res.data && res.data.code == 0) {
          this.infoData = res.data.data
          this.role = JSON.parse(JSON.stringify(this.infoData.role))
          this.roleType = JSON.parse(JSON.stringify(this.infoData.roleType))
          this.modelType = 'DEVELOP'
          this.activeStep = 1
        }
      })
    },
    // 获取所有label value 对应值
    getKeyValueHandle () {
      getKeyValue().then(res => {
        if(res.data.code == 0) {
          this.labelValue = res.data.data
          this.$store.state.labelValue = this.labelValue
        }
      })
    },
    // 上一步
    lastStep () {
      if (this.activeStep-- < 0) {
        this.activeStep = 0
      }
    },
    // 下一步
    nextStep () {
      if (this.activeStep++ > 1) this.activeStep = 0
    },
    // 通知关闭
    closeDesignHandle (bool) {
      window.close()
      this.$emit('closeDesign', bool)
    },
    // 通知关闭
    saveHandle (type) {
      if (type === 'save') {
        this.saveLoading = true
      }
      this.$root.eventBus.$emit('pageEvent', type)
    },
    // 刷新列表
    getList() {
      this.$emit('getList')
    },
    callbackSettingSubmit() {
      const params = {
        eventList: [...this.callbackSettingData]
      }
      updateModelSetting(params, this.$route.query.dataModelId).then(res => {
        if (res.data && res.data.code == 0) {
          this.getModelSetting(this.$route.query.dataModelId)
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      return [1, 1];
      if (rowIndex < 3) {
        if (columnIndex === 1) {
          return [1, 2];
        } else if (columnIndex === 0) {
          return [1, 1];
        }
      }
    },
  }
}
</script>
<style lang="scss">
.el-tabs__item{
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
.design-content{
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 10px;
  background: #f0f2f5;
  -webkit-box-sizing: border-box;
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
  .title-page-header{
    margin-top: 0;
  }
  .icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
}
.form-design-tool{
  font-size: 20px;
  cursor: pointer;
  color: #353535;
}
</style>
