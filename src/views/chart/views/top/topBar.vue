<template>
  <div class="top-bar-box">
    <titlePageHeader :title="'图表设计'" :needLoading="true" @save="saveChartHandle('保存')" @close="closeHandle">
      <template slot="left">
        <div class="cont-top">
          <div class="cont-top-item">
            <p>{{infoData.name}}</p>
            <p><el-tag size="mini" :type="infoData.isDeploy ? '' : 'info'">{{infoData.isDeploy ? '已发布' : '未发布'}}</el-tag></p>
          </div>
        </div>
      </template>
      <template slot="right">
        <p class="design-tool">
          <el-tooltip effect="dark" content="权限" placement="top">
            <i class="el-icon-key form-design-tool" @click="setPermission()"></i>
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="复制地址" placement="top">
            <i class="el-icon-document-copy form-design-tool" @click="handleCopy(rowData)"></i>
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="筛选" placement="top">
            <img :src="isSelected ? filterSelected : filterControl" alt="" @click="setSelectControl">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="移动端预览" placement="top">
            <img :src="mobileView" alt="" style="width:16px;" @click="view('mobile')">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="pc端预览" placement="top">
            <img :src="pcView" alt="" @click="view('pc')">
          </el-tooltip>
        </p>
      </template>
    </titlePageHeader>
    <permission
      :permissionVisible="permissionVisible"
      :operationList="operationList"
      :role="role"
      :roleType="roleType"
      @handleClosePermission="handleClosePermission"
      @submitPermission="submitPermission"
    />
  </div>
</template>
<script>
import {saveChart, publish, getVersionData} from '../../api/chart'
import lineImg from '../../styles/chart/line.png'
import zhuImg from '../../styles/chart/zhu.png'
import bingImg from '../../styles/chart/bing.png'
import tiaoImg from '../../styles/chart/tiao.png'
import titlePageHeader from '@/components/page-header/titlePageHeader'
import pcImg from '../../const/img/pc.png'
import mobileImg from '../../const/img/mobile.png'
import settingImg from '../../const/img/setting.png'
import filterImg from '../../const/img/filter.png'
import filterSelected from '../../const/img/filter-selected.png'
import Permission from "../../components/design/permission";
export default {
  name: 'top-bar',
  components: {titlePageHeader, Permission},
  props: {
    layout: {
      type: Array,
      default: () => {
        return []
      }
    },
    queryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    infoData: {
      type: Object
    },
    rowData: {
      type: Object
    }
  },
  data () {
    return {
      role: [], // 权限设置
      roleType: true, // 权限类型,true 应用 权限，false 自定义权限
      operationList: [], // 操作权限list
      permissionVisible: false, // 权限弹框
      // 图表数据表单
      dataForm: {
        versions: '', // 版本号
        menuId: -1, // 二级菜单id
        isTabs: false, // 是否开启tab
        timeType: '', // 查询日期时间格式
        isStatus: false, // 启用禁用状态
        dataJson: '',
        startTime: '',
        endTime: '',
      },
      // 设计数据
      chartData: [],
      deptId: [],
      treeData: [], // 菜单树形结构
      cascaderPptions: [], // 所有菜单结构
      charts: [
        { name: '折线图', type: 'LineChart', src: lineImg },
        { name: '柱状图', type: 'HistogramChart', src: zhuImg },
        { name: '饼图', type: 'Pie', src: bingImg },
        { name: '条形图', type: 'BarChart', src: tiaoImg },
      ],
      versionList: [], // 版本号列表
      dialogVisible: false,
      title: '设计页面',
      optype: '',
      menuForm: {},
      menuFormOption: {
        cancal: false,
        column: [
          {
            label: "系统名称",
            prop: "systemId",
            type: 'select',
            dicUrl: '/mgr/upms/system/all',
            props: {
              label: 'name',
              value: 'id'
            },
            disabled: false
          },
          {
            label: "上级名称",
            prop: "menuParentId",
            type: 'select',
            dicData: [],
            rules: [{ required: true, message: '请选择上级名称', trigger: 'change' },]
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
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      timeType: '',
      timeTypeTemp: '',
      autoRefresh: '',
      autoRefreshList: [
        { label: '3分钟', value: '3' },
        { label: '5分钟', value: '5' },
        { label: '10分钟', value: '10' },
        { label: '30分钟', value: '30' },
        { label: '1小时', value: '60' }
      ],
      versions: '',
      cascaderKey: 1, // 菜单重新渲染序号
      timeTypeVisible: false, // 设置时间类型弹框
      systemId: '', // 系统id
      sysList: [] ,// 系统列表
      pcView: pcImg,
      mobileView: mobileImg,
      settingView: settingImg,
      filterControl: filterImg,
      filterSelected: filterSelected,
      isSelected: false,
      submitLoading: false, // 保存loading
    }
  },
  created () {
    // console.log(this.infoData)
    if(this.infoData) {
      this.dataForm = this.infoData
      if(this.dataForm.timeType) {
        this.timeType = this.dataForm.timeType
      }
    }
    this.timeType = ''
  },
  methods: {
    // 关闭权限设置弹窗
    handleClosePermission() {
      // this.roleType = true
      this.permissionVisible = false
    },
    // 权限提交
    submitPermission(arr, roleType) {
      // this.roleType = roleType
      // this.role = [...arr]
      const params = {
        roleType: roleType,
        role: [...arr],
        id: this.infoData.id
      }
      saveChart(params).then(res => {
        if (res.data.code == 0) {
          this.submitLoading = false
          this.$message.success("保存成功")
        }
      }).catch(e => {
      })
    },
    // 设置权限
    setPermission() {
      this.permissionVisible = true
    },
    // 复制地址
    handleCopy(row) {
      const url = `${window.document.URL.split('#')[0]}#/chartShow?type=pc&id=${row.id}`
      const text = document.createElement('input')
      text.value = url
      document.body.appendChild(text)
      text.select()
      document.execCommand('Copy')
      document.body.removeChild(text)
      this.$message.success('复制成功！')
    },
    // 添加图表
    createChart(item) {
      let obj = JSON.parse(JSON.stringify(item))
      this.$emit('createChart', obj)
    },
    // 预览
    view(type) {
      this.saveChartHandle('保存', type)
    },
    // 设置筛选条件
    setSelectControl() {
      this.isSelected = !this.isSelected
      this.$emit('setFilter', this.isSelected)
    },
    // 设置筛选图标选中状态
    setIsSelected(bool) {
      this.isSelected = bool
    },
    // 保存
    async saveChartHandle(str, type) {
      const arr = [...this.queryList]
      // tab页数据处理
      if (this.dataForm.isTabs) {
        let temp = {}
        for (let l in this.layout) {
          temp[this.layout[l].title] = JSON.stringify(this.layout[l].layout)
        }
        this.dataForm.dataJson = JSON.stringify(temp)
      } else {
        this.dataForm.dataJson = JSON.stringify([...this.layout])
        this.dataForm.filterJson = JSON.stringify(arr)
        // this.dataForm.dataJson = JSON.stringify([...this.layout])
      }
      if (!this.dataForm.isTabs) {
        this.dataForm.isTabs = false
      }
      if (this.timeType) {
        this.dataForm.timeType = this.timeType
      }
      if (this.dataForm.timeType) {
        this.dataForm.startTime = this.startTime
        this.dataForm.endTime = this.endTime
      }
      if (this.infoData) {
        this.dataForm.id = this.infoData.id
      }
      if (!this.submitLoading) {
        this.submitLoading = true
        await saveChart(this.dataForm).then(res => {
          if (res.data.code == 0) {
            this.submitLoading = false
            this.$message.success(str + "成功")
            if (type && type != '') {
              this.$openUrl(`/chart-design-ui/#/chartShow?model=preview&type=${type}&id=${this.dataForm.id}`, '_blank')
            }
          }
        }).catch(e => {
        })
      }
    },
    closeHandle (bool) {
      this.$emit('close', bool)
    }
  }
}
</script>
<style lang="scss">
.top-bar-box{
  .form-design-tool{
    font-size: 24px;
    cursor: pointer;
    color: #353535;
    cursor: pointer;
    &:hover{
      //color: #0D76FC;
    }
  }
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
}
.gallery-list-top {
  // min-height: 70px;
  // display: flex;
  // align-items: center;
  justify-content: space-between;
  // padding: 10px 10px;
  border-radius: 5px;
  background-color: #fff;
  .tree-auth {
    height: 100%;
    display: flex;
    align-items: center;
    .el-button,
    .el-cascader {
      margin-right: 10px;
    }
  }
  .gallery-list-top-right{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    div{
      display: flex;
      align-items: center;
      .assembly-el-menu{
        width: 80px!important;
        .assembly-el-menu-item{
          width: 80px!important;
          .el-submenu__title{
            width: 100%;
            padding: 0;
          }
        }
      }
      .el-switch, .el-select{
        margin-left: 15px;
      }
    }
  }

}
.gallery-list-top-left .assembly-el-menu .el-submenu__icon-arrow{
  display: none;
}

 .gallery-list-top-bottom{
   background-color: #ffffff;
   display: flex;
   margin: 0 8px;
   padding: 10px 5px;
   padding-left: 40px;
  }


.el-tabs__new-tab{
  border: 1px solid #409EFF;
  color: #409EFF;
}
.el-tabs__item{
  background: #fff;
}
.el-menu.assembly-el-menu {
  height: 20px;
  top: -2px!important;
  width: auto !important;
  .el-submenu__icon-arrow {
    display: none;
  }
  .assembly-el-menu-item {
    color: #222;
    box-sizing: border-box;
    // margin: 0 10px;
    text-align: center;
    line-height: 20px;
    padding: 0;
    border-radius: 5px;
    height: 100%;
    .el-submenu__title {
      height: 100%;
      line-height: 32px;
      color: #222;
      border: 0;
      padding: 0;
    }
  }
  .assembly-el-menu-item:nth-of-type(1) {
    margin-left: 0;
  }
  .assembly-el-menu-item.is-active {
    .el-submenu__title {
      border: 0;
    }
  }
  >.el-submenu .el-submenu__title{
    height: 20px;
    line-height: 20px;
  }
  .el-submenu__icon-arrow{
    display: none;
  }
}
</style>
