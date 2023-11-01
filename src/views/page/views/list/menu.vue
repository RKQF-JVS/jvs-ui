<template>
  <div class="menu-page-list">
    <!-- 顶部 -->
    <div class="top">
      <PageHeader title="列表设计">
        <div style="height:20px"></div>
        <jvs-button type="primary" size="mini" @click="addMenuHandle">新增列表菜单</jvs-button>
      </PageHeader>
    </div>
    <div class="center">
      <img src="../../styles/chart.png" alt="">
      <ul class="system-list">
        <li v-for="item in sysList" :key="item.id" @click="changeSystem(item)">{{item.name}}</li>
      </ul>
      <div class="menu-list" v-if="cascaderPptions && cascaderPptions.length > 0">
        <div v-for="icem in cascaderPptions" :key="icem.value">
          <h4>{{icem.name}}</h4>
          <p v-if="icem.children">
            <span v-for="it in icem.children" :key="it.value" @click="handleChange([icem.id, it.id])">{{it.name}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 新增列表页菜单 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      class="menu-form"
      append-to-body
    >
      <jvs-form
        :formData="menuForm"
        :option="menuFormOption"
        @submit="submitMenu"
      >
        <template slot="menuParentIdForm" >
          <div class="validate-item">
            <el-cascader
              :class="{'err-item': parentError}"
              style="width: 100%;"
              size="mini"
              v-model="menuForm.menuParentId"
              :show-all-levels="true"
              :options="parentTree"
              :props="{ expandTrigger: 'hover', children: 'children', label: 'name', value: 'id' }"
              @change="parentChange">
            </el-cascader>
            <span class="el-form-item__error" v-if="parentError">请选择上级菜单</span>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
    <!-- 设计管理/演示 -->
    <!-- title="设计管理/设计演示" -->
    <el-dialog
      v-if="designVisible"
      :visible.sync="designVisible"
      :before-close="handleCloseDesign"
      fullscreen
      append-to-body
      :modal="false"
      class="no-header-dialog-page"
    >
      <designBox :systemId="systemId" :menuId="menuId" :menuForm="menuFormData" @closeDesign="closeDesignHandle" />
    </el-dialog>
  </div>
</template>
<script>
import PageHeader from '@/components/page-header/PageHeader'
import {getMenu, addMenu, getAllSystem, getParentMenu, getKeyValue} from '../../api/list'
import designBox from './design'
import { client_id } from '@/const/const'
export default {
  components: {PageHeader, designBox},
  data(){
    return{
      cascaderKey: 1, // 菜单重新渲染序号
      deptId: [],
      treeData: [], // 菜单树形结构
      cascaderPptions: [], // 所有菜单结构
      dataForm: {}, // 顶部表单
      dialogVisible: false, // 新增列表页弹框
      // 菜单
      menuForm: {
        menuParentId: '',
        menuName: '',
        menuIcon: '',
        menuSort: ''
      },
      // 菜单表单配置
      menuFormOption: {
        submitBtnText: '确定',
        cancal: false,
        inline: false,
        labelWidth: '90px', // label宽
        column: [
          // {
          //   label: "系统名称",
          //   prop: "systemId",
          //   type: 'select',
          //   dicUrl: '/mgr/jvs-auth/system/all',
          //   props: {
          //     label: 'name',
          //     value: 'id'
          //   },
          //   disabled: false,
          //   rules: [{ required: true, message: '请选择系统', trigger: 'change' },]
          // },
          {
            label: "上级菜单",
            prop: "menuParentId",
            formSlot: true,
            // type: 'select',
            // dicData: [],
            // // dicUrl: '/mgr/jvs-design/menu/parent',
            // props: {
            //   label: 'menuName',
            //   value: 'menuId'
            // },
            rules: [{ required: true, message: '请选择上级菜单', trigger: 'change' },]
          },
          {
            label: "名称",
            prop: "menuName",
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' },]
          },
          {
            label: "图标",
            prop: "menuIcon",
            type: 'iconSelect'
          },
          {
            label: "排序",
            prop: "menuSort",
            type: "inputNumber",
          }
        ]
      },
      designVisible: false, // 设计列表
      menuParentId: -1,
      menuId: -1,
      menuStatus: 'add',
      menuFormData: {}, // 传递菜单数据
      systemId: '', // 系统id
      sysList: [] ,// 系统列表
      currentSystem: null, // 第一级节点
      parentError: false,
      parentTree: [], // 父级菜单列表
    }
  },
  created () {
    this.getSystemList()
  },
  methods: {
    // 获取菜单树形结构
    getMenuTree () {
      this.cascaderPptions = []
      if(this.systemId) {
        this.changeSystem(this.currentSystem)
        // getMenu({systemId: this.systemId}).then(res => {
        //   if (res.data.code==0) {
        //     this.parentTree = res.data.data
        //     // this.treeData=res.data.data
        //     // this.formatTreeOfSelect(this.treeData, this.cascaderPptions)
        //   }
        // })
      ++this.cascaderKey
      }
    },
    // // 获取父级菜单
    // getParentMenuHandle () {
    //   getParentMenu({systemId: this.menuForm.systemId}).then(res => {
    //     if(res.data.code == 0) {
    //       // let temp = []
    //       // for(let i in res.data.data) {
    //       //   temp.push({
    //       //     label: res.data.data[i].menuName,
    //       //     value: res.data.data[i].menuId
    //       //   })
    //       // }
    //       this.menuFormOption.column.filter(item => {
    //         if(item.prop == 'menuParentId') {
    //           item.dicData = res.data.data
    //         }
    //       })
    //     }
    //   })
    // },
    // 选择菜单
    handleChange (value) {
      if (value.length>0) {
        this.menuParentId = value[0]
        this.menuId = value[value.length-1]
        // console.log(this.menuId)
        this.menuFormData = this.getLabelById(this.menuId)
        if(!this.menuFormData.menuParentId) {
          this.menuFormData.menuParentId = this.menuParentId
        }
        this.designVisible = true
      }
    },
    // 根据二级菜单id获取菜单
    getLabelById (id) {
      for(let i in this.treeData) {
        if(this.treeData[i].children && this.treeData[i].children.length > 0) {
          for(let j in this.treeData[i].children) {
            if(this.treeData[i].children[j].children && this.treeData[i].children[j].children.length > 0) {
              for(let k in this.treeData[i].children[j].children) {
                if(this.treeData[i].children[j].children[k] && this.treeData[i].children[j].children[k].id == id) {
                  return this.treeData[i].children[j].children[k]
                }
              }
            }
          }
        }
      }
      return false
    },
    // 新增菜单
    addMenuHandle () {
      this.getParentList({level: 3})
      this.dialogVisible = true
      this.menuStatus = 'add'
    },
    // 修改菜单
    // editMenu () {
    //   this.menuForm = this.getLabelById(this.menuId)
    //   if(!this.menuForm.menuParentId) {
    //     this.menuForm.menuParentId = this.menuParentId
    //   }
    //   this.menuStatus = 'edit'
    //   this.dialogVisible = true
    // },
    // 菜单提交
    submitMenu (form) {
      if(!form.menuParentId) {
        form.menuParentId = -1
      }
      if(!form.parentId) {
        form.parentId = form.menuParentId
      }
      console.log(form)
      return false
      if(this.menuStatus == 'add') {
        addMenu(form).then(res => {
          if(res.data.code == 0) {
            this.menuForm = {
              menuParentId: res.data.data.parentId,
              menuName: res.data.data.menuName,
              menuIcon: res.data.data.menuIcon,
              menuSort: res.data.data.menuSort,
              menuId: res.data.data.id // menuId
            }
            this.getMenuTree()
            this.menuId = res.data.data.id
            this.menuParentId = res.data.data.parentId
            this.menuFormData = this.menuForm
            this.systemId = this.menuParentId
            this.designVisible = true
          }
        })
      }
    },
    // 关闭菜单弹框
    handleClose () {
      this.dialogVisible = false
      this.menuForm = {
        menuParentId: '',
        menuName: '',
        menuIcon: '',
        menuSort: ''
      }
    },
    // 关闭设计
    handleCloseDesign () {
      this.designVisible = false
      this.activeStep = 0
    },
    // 子组件通知关闭
    closeDesignHandle (bool) {
      if(bool) {
        this.handleCloseDesign()
        this.deptId = []
        this.menuId = ''
        this.menuParentId = ''
        this.handleClose()
        this.getMenuTree()
        this.systemId = ''
        this.activeStep = 0
      }
    },
    // 格式化菜单数据为资源选择上级提供数据
    formatTreeOfSelect (list, result) {
      for (let i in list) {
        let obj={
          label: list[i].menuName,
          value: list[i].menuId,
        }
        if(list[i].childList) {
          obj.children = []
        }
        result.push(obj)
        if (list[i].childList && list[i].childList.length > 0) {
          this.formatTreeOfSelect(list[i].childList, obj.children)
        }
      }
    },
    // 获取系统id
    getSystemList() {
      getAllSystem(client_id).then(res => {
        if(res.data.code == 0) {
          this.sysList = res.data.data
          this.treeData = res.data.data
        }
      })
    },
    // 切换系统
    changeSystem (item) {
      this.systemId = item.id
      this.currentSystem = item
      this.cascaderPptions = item.children
    },

    // 上级菜单切换
    parentChange (value) {
      if(value && value.length > 0) {
        if(this.$refs.resourceForm) {
          this.parentValidate(value)
          this.$refs.resourceForm.$refs.resourceForm.clearValidate(['parentId'])
        }
      }
    },
    // 获取父级菜单列表
    getParentList (rowData) {
      let temp = []
      for(let i in this.treeData) {
        if(rowData.level == 2) {
          temp.push({
            name: this.treeData[i].name,
            id: this.treeData[i].id,
          })
        }
        if(rowData.level >= 3) {
          let obj = {
            name: this.treeData[i].name,
            id: this.treeData[i].id,
            children: []
          }
          if(this.treeData[i].children && this.treeData[i].children.length > 0) {
            for(let j in this.treeData[i].children) {
              let tb= {
                name: this.treeData[i].children[j].name,
                id: this.treeData[i].children[j].id,
              }
              if(rowData.level == 4 && this.treeData[i].children[j].children && this.treeData[i].children[j].children.length > 0) {
                tb.children = []
                for(let k in this.treeData[i].children[j].children) {
                  tb.children.push({
                    name: this.treeData[i].children[j].children[k].name,
                    id: this.treeData[i].children[j].children[k].id
                  })
                }
              }
              obj.children.push(tb)
            }
          }
          temp.push(obj)
        }
      }
      this.parentTree = temp
      for(let i in this.treeData) {
        this.treeData[i].path = []
        if(this.treeData[i].children && this.treeData[i].children.length > 0) {
          this.getPath(this.treeData[i].children, this.treeData[i].path)
        }
      }
      // 菜单类
      if(rowData.level < 4 && rowData.id) {
        this.getDeptPath(rowData.id, this.treeData)
      }else{
        // 资源
        this.getDeptPath(rowData.menuId, this.treeData)
      }
    },
    // 获取菜单id路径
    getPath (list, temp) {
      for(let i in list) {
        if(!list[i].path) {
          list[i].path = []
        }
        if(list[i].parentId != -1) {
          list[i].path = JSON.parse(JSON.stringify(temp))
          list[i].path.push(list[i].parentId)
        }
        if(list[i].children && list[i].children.length > 0) {
          this.getPath(list[i].children, list[i].path)
        }
      }
    },
    getDeptPath (val, list) {
      for(let i in list) {
        if(list[i].id == val) {
          this.pathArr = list[i].path
        }else{
          if(list[i].children && list[i].children.length > 0) {
            this.getDeptPath(val, list[i].children)
          }
        }
      }
    },
  },
  watch: {
    // 'menuForm.systemId': {
    //   handler(newVal, oldVal) {
    //     if(newVal){
    //       this.getParentMenuHandle()
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.menu-page-list{
  .top{
    display: flex;
    align-items: center;
    .el-card{
      width: 100%;
    }
    .el-button, .el-cascader{
      margin-right: 10px;
    }
  }
  .center{
    height: calc(100vh - 122px);
    margin-top: 10px;
    position: relative;
    img{
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
    }
    .system-list{
      width: 150px;
      background: #fff;
      border-radius: 5px;
      padding: 0;
      overflow: hidden;
      padding-bottom: 10px;
      height: 100%;
      box-sizing: border-box;
      li{
        text-indent: 12px;
        margin-top: 10px;
        padding: 5px 0;
        cursor: pointer;
      }
    }
    .menu-list{
      position: absolute;
      z-index: 1;
      left: 160px;
      top: 0;
      height: 100%;
      width: calc(100% - 160px);
      background: #fff;
      h4{
        font-weight: normal;
        text-indent: 10px;
        margin: 0;
        height: 32px;
        line-height: 32px;
      }
      p{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 0;
        padding: 0 10px;
        span{
          display: block;
          margin: 0 10px 10px 0;
          color: #409EFF;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.menu-form{
  .el-form{
    .el-row{
      .el-col{
        .el-form-item__content{
          div{
            .el-input, .el-select, .el-input-number, div{
              flex: 1;
            }
          }
        }
      }
      .el-col:nth-last-of-type(1) {
        .el-form-item{
          .el-form-item__content{
            margin: 0!important;
          }
        }
      }
    }
  }
}
.no-header-dialog-page{
  .el-dialog__header{
    padding: 0;
    .el-dialog__headerbtn{
      z-index: 9;
    }
  }
  .el-dialog__body{
    padding: 0;
  }
}
</style>
