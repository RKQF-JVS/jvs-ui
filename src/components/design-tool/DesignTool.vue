<template>
  <div :class="{ 'design-tool': true, 'header-top-open': show, 'header-top-close': !show }">
    <div :class="{ 'pageheader-top': true, 'pageheader-top-open': show }">
      <div class="left-box">
        <span v-if="dataModelId" style="display:flex;align-items:center;">
          <span style="display:inline-block;width:70px;">模型名称：</span>
          <span v-if="!dataModelNameEditShow">{{dataModelName}}</span>
          <i class="el-icon-edit" v-if="!dataModelNameEditShow" style="margin-left:5px;cursor:pointer;" @click="editName"></i>
          <el-input v-if="dataModelNameEditShow" ref="editDataModelName" size="mini" v-model="dataModelNameEdit" @blur="editNameSub" style="width:150px;"></el-input>
          <i class="el-icon-setting" style="margin-left:5px;cursor:pointer;" @click="modelSetHandle"></i>
        </span>
        <span v-else>工具栏</span>
        <slot name="left"></slot>
      </div>
      <div class="right-box">
        <slot name="right"></slot>
      </div>
    </div>
    <slot name="bottom"></slot>
    <el-dialog
      title="数据模型配置"
      append-to-body
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div v-if="dialogVisible" class="data-model-set">
        <h4>唯一性配置</h4>
        <el-alert
          title="唯一性设置会清除系统所有数据，请谨慎操作。或在管理员要求下再进行添加。"
          type="warning"
          :closable="false">
        </el-alert>
        <jvs-form :option="settingOption" :formData="settingForm" @submit="modelSetSubmit" @cancalClick="handleClose">
          <template slot="formulaForm">
            <el-button size="mini" @click="openButtonFormula">配置</el-button>
          </template>
          <template slot="userListForm">
            <div v-if="settingForm.userList && settingForm.userList.length > 0">
              <el-tag v-for="(item, index) in settingForm.userList" :key="item.id" :type="item.type=='user'? '': 'info'" closable style="margin-right: 10px;" @close="deleteUser(index, settingForm.userList)">{{item.name}}</el-tag>
            </div>
            <div style="margin-top: 10px;">
              <el-button size="mini" @click="openUser('userList')">选择人员/角色</el-button>
            </div>
          </template>
        </jvs-form>
      </div>
    </el-dialog>
    <userSelector
      ref="userSelector"
      :userEnable="true"
      :roleEnable="true"
      :currentActiveName="'user'"
      :selectable="true"
      :dialogTitle="'人员选择'"
      @submit="addCheckUSer"
    />
  </div>
</template>

<script>
import saveicon from "@/const/img/保存.png"
import closeicon from "@/const/img/关闭.png"
import {getModelName, editModelName, editModelSetting} from "@/components/api"
import userSelector from '@/components/basic-assembly/userSelector'
import { getEncryptionList } from '@/views/page/api/form'
export default {
  components: { userSelector },
  name: "PageHeader",
  props: {
    title: {
      type: String
    },
    needLoading: {
      type: Boolean,
      default: false
    },
    dataModelId: {
      type: String
    },
    jvsAppId: {
      type: String
    },
    designId: {
      type: String
    },
    dataModelFields: {
      type: Array
    },
  },
  data () {
    return {
      show: true,
      saveIcon: saveicon,
      closeIcon: closeicon,
      saveLoading: false,
      timer: null,
      dataModelName: '',
      dataModelNameEdit: '',
      dataModelNameEditShow: false,
      dialogVisible: false,
      settingForm: {},
      settingOption: {
        emptyBtn: false,
        formAlign: 'top',
        column: [
          {
            label: '单用户只能提交一次',
            prop: 'once',
            type: 'switch'
          },
          {
            label: '公式配置',
            prop: 'formula',
            formSlot: true
          },
          {
            label: '是否脱敏',
            prop: 'encryption',
            type: 'switch'
          },
          {
            label: '脱敏字段',
            prop: 'encryptionFields',
            type: 'tableForm',
            border: true,
            editable: true,
            addBtn: true,
            delBtn: true,
            align: 'left',
            menuAlign: 'left',
            displayExpress: [ { prop: 'encryption', value: 'true' } ],
            tableColumn: [
              {
                label: '字段名称',
                prop: 'fieldKey',
                type: 'select',
                dicData: [],
                props: {
                  label: 'fieldName',
                  value: 'fieldKey'
                }
              },
              {
                label: '脱敏正则',
                prop: 'encryptionExpress',
                type: 'select',
                dicData: []
              },
            ]
          },
          {
            label: '数据权限设置',
            prop: 'userList',
            formSlot: true
          },
        ]
      },
      userKey: ''
    }
  },
  methods: {
    openClose () {
      let bool=this.show
      // this.show = !bool
    },
    saveHandle () {
      this.$emit("save", true)
      if(this.needLoading) {
        this.saveLoading = true
        if(this.timer) {
          clearTimeout(this.timer)
        }
        let _this =  this
        this.timer = setTimeout(() => {
          _this.saveLoading = false
        }, 2000)
      }
    },
    closeHandle () {
      this.$emit("close", true)
    },
    editName () {
      this.dataModelNameEdit = this.dataModelName
      this.dataModelNameEditShow = true
      this.$nextTick(()=>{
        this.$refs.editDataModelName.focus()
      })
    },
    editNameSub () {
      if(this.dataModelNameEdit != this.dataModelName) {
        editModelName(this.$route.query.jvsAppId, this.dataModelNameEdit, this.dataModelId).then(res => {
          if(res.data && res.data.code == 0) {
            this.dataModelName = this.dataModelNameEdit
            this.dataModelNameEditShow = false
            this.dataModelNameEdit = ''
            this.$message.success('修改成功')
          }
        })
      }else{
        this.dataModelNameEditShow = false
        this.dataModelNameEdit = ''
      }
    },
    getModelInfo () {
      if(this.dataModelId) {
        getModelName(this.$route.query.jvsAppId, this.dataModelId).then(res => {
          if(res.data && res.data.code == 0 && res.data.data) {
            this.dataModelName = res.data.data.name
            if(res.data.data.setting) {
              this.settingForm = res.data.data.setting
            }
          }
        })
      }
    },
    modelSetHandle () {
      this.settingOption.column.filter(item => {
        if(item.prop == 'encryptionFields') {
          item.tableColumn[0].dicData = this.dataModelFields
        }
      })
      if(this.settingForm.once != true) {
        this.$set(this.settingForm, 'once', false)
      }
      if(!this.settingForm.formula) {
        this.$set(this.settingForm, 'formula', '')
      }
      if(!this.settingForm.formulaContent) {
        this.$set(this.settingForm, 'formulaContent', '')
      }
      if(!this.settingForm.userList) {
        this.$set(this.settingForm, 'userList', [])
      }
      this.dialogVisible = true
    },
    // 配置公式
    openButtonFormula () {
      this.$setFormula({
        title: '公式设置',
        hasModal: true,
        label: this.dataModelName,
        execId: this.settingForm.formula ? this.settingForm.formula : '',
        apiPrefix: 'jvs-design',
        useCase: 'thisDataItemValue',
        props: {
          jvsAppId: this.jvsAppId,
          designId: this.dataModelId, // this.designId ? this.designId : this.dataModelId,
          businessId: this.dataModelId
        },
        afterSave: (dialog, data) => {
          if(data && data.id) {
            this.$set(this.settingForm, 'formula', data.id)
            this.$set(this.settingForm, 'formulaContent', data.body)
          }
          dialog.handleClose()
        }
      })
    },
    modelSetSubmit () {
      editModelSetting(this.$route.query.jvsAppId, this.dataModelId, {setting: this.settingForm}).then(res => {
        if(res.data && res.data.code == 0) {
          this.$message.success('设置成功')
          this.handleClose()
          this.getModelInfo()
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    openUser (userKey) {
      this.userKey = userKey
      if(!this.settingForm[userKey]) {
        this.$set(this.settingForm, userKey, [])
      }
      this.$refs.userSelector.openDialog(this.settingForm[userKey])
    },
    addCheckUSer (list) {
      this.$set(this.settingForm, this.userKey, list)
    },
    deleteUser (index, arr) {
      arr.splice(index, 1)
    },
    getTmExList () {
      getEncryptionList().then(res => {
        if(res.data && res.data.code == 0) {
          this.settingOption.column.filter(item => {
            if(item.prop == 'encryptionFields') {
              item.tableColumn[1].dicData = res.data.data
            }
          })
        }
      })
    },
  },
  created () {
    this.getModelInfo()
    this.getTmExList()
  }
};
</script>
<style lang="scss" scoped>
.pageheader-top {
  display: flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .pageheader-line {
    width: 4px;
    height: 22px;
    background: #3471ff;
    border-radius: 2px;
    cursor: pointer;
    margin: 0 20px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    //font-family: SourceHanSansCN-Regular;
    font-family: MiSans-Demibold;
    color: #333333;
    cursor: pointer;
    margin-right: 20px;
  }
  .left-box, .right-box {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .right-box{
    p{
      margin: 0;
      padding: 0 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #DCDFE6;
      img{
        display: block;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .right-icon-close{
      img{
        width: 18px;
        height: 18px;
      }
    }
    p:nth-last-of-type(1) {
      border-right: 0;
    }
  }
}
.header-top-close {
  height: 44px;
  .pageheader-line {
    width: 20px;
    height: 4px;
  }
}
.data-model-set{

}
</style>
<style lang="scss">
.design-tool {
  padding: 0 20px;
  height: 36px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px 5px 0 0 ;
  display: flex;
  align-items: center;
}
*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
  background: rgba(0,0,0,0.1);
}
*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px #dcdfe6, 0.2;
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
</style>
