<template>
  <div :class="{'wel-index': true, 'empty-wel-index': list.length == 0}">
    <div v-if="showloading" :style="'position: absolute;top: 0;left: 0;width: 100%;z-index: 999;background: #fff;height: calc(100vh - '+$store.getters.theme.logo.height+');'">
      <jvsLoading />
    </div>
    <div class="wel-index-top" v-if="false && !showloading">
      <i class="el-icon-setting" @click="addItem"></i>
    </div>
    <div class="wel-index-content"  v-if="!showloading">
      <draggable :list="list" :options="{group:'movelist', disabled: disabled}"
        @start="startMove"
        @end="endMove"
      >
        <template v-for="(item, index) in list" class="wel-index-content-list">
          <div class="list-item" :key="index+'item'" :style="'height:'+getHeight(item, 'max')+'px;'">
            <div :class="(item.left && item.left.position == 'all') ? 'list-item-all': 'list-item-left'" v-if="!validatenullHandle(item.left)" :style="'height:'+getHeight(item, 'left')+'px;'">
              <iframeItem v-if="item.left.type == 'chart' || item.left.type == 'page' || item.left.type == 'http'" :item="item.left" />
              <div class="wel-item-info" v-if="item.left.type == 'wel'" :item="item.left">
                <h4>欢迎使用体验平台! </h4>
                <section>要替换启动画面，当然要事先准备好替换用的图片了。系统对这个图片有比较特殊的要求，图片尺寸应为640×480像素，使用16色，文件名为Boot.bmp。</section>
              </div>
              <i v-if="!validatenullHandle(item.left)" class="el-icon-delete delete-wel-item" @click="deleteItemOfList(item, 'left')"></i>
            </div>
            <div :class="'list-item-right'" v-if="!validatenullHandle(item.right)" :style="'height'+getHeight(item, 'right')+'px;'">
              <iframeItem v-if="item.right.type == 'chart' || item.right.type == 'page' || item.right.type == 'http'" :item="item.right" />
              <div class="wel-item-info" v-if="item.right.type == 'wel'" :item="item.right">
                <h4>欢迎使用体验平台! </h4>
                <section>要替换启动画面，当然要事先准备好替换用的图片了。系统对这个图片有比较特殊的要求，图片尺寸应为640×480像素，使用16色，文件名为Boot.bmp。</section>
              </div>
              <i v-if="!validatenullHandle(item.right)" class="el-icon-delete delete-wel-item" @click="deleteItemOfList(item, 'right')"></i>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      append-to-body
      v-if="dialogVisible"
      :before-close="handleClose">
      <!-- <el-row style="text-align:center;line-height:28px;font-size: 12px;"><span>{{modelName}}</span></el-row> -->
      <jvs-form :formData="itemForm" :option="itemOption" @submit="submitHandle">
        <template slot="positionForm">
          <div class="position-box">
            <div :class="pos == 'all' ? 'position-box-item selectd' : 'position-box-item'" @click="slectPosition('all')">
              <p style="width:100%;left:0;"></p>
            </div>
            <div :class="pos == 'left' ? 'position-box-item selectd' : 'position-box-item'" @click="slectPosition('left')">
              <p style="width:70%;left:0;"></p>
            </div>
            <div :class="pos == 'right' ? 'position-box-item selectd' : 'position-box-item'" @click="slectPosition('right')">
              <p style="width:30%;right: 0;"></p>
            </div>
          </div>
        </template>
        <template slot="formButton">
          <el-button size="mini" @click="handleClose">取消</el-button>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>
<script>
import {validateURL, validatenull} from '@/util/validate'
import {getWelInfo, getPageList, addWelInfo, delWelInfo, sortWel} from '@/api/wel'
import iframeItem from './iframe'
import jvsLoading from '@/components/basic-container/loading'
const validateURLHandle = (rule, value, callback) => {
  if(validateURL(value)) {
    callback()
  }else{
    callback(new Error('请输入正确的网页地址'))
  }
}
export default {
  name: 'wel-index',
  components: {iframeItem, jvsLoading},
  data(){
    return {
      // 组件项
      dialogTitle: '新增组件',
      itemForm: {},
      itemOption: {
        formAlign: 'left', //对其方式
        inline: false,
        emptyBtn: false,
        column: [
          // {
          //   label: '标题',
          //   prop: 'title',
          //   rules: [
          //     { required: true, message: '请输入标题', trigger: 'blur' },
          //   ]
          // },
          {
            label: '组件类型',
            prop: 'type',
            type: 'select',
            dicData: [
              {label: '消息', value: 'message'},
              {label: '欢迎', value: 'wel'},
              {label: '待办', value: 'backlog'},
              {label: '最新动态', value: 'news'},
              {label: '日历', value: 'calendar'},
              {label: '图表', value: 'chart'},
              {label: '列表页', value: 'page'},
              {label: '网页', value: 'http'},
            ],
            rules: [
              { required: true, message: '请选择模块', trigger: 'change' },
            ]
          },
          {
            label: '标题显示',
            prop: 'displayTitle',
            type: 'radio',
            dicData: [
              {label: '是', value: true},
              {label: '否', value: false}
            ],
            rules: [
              { required: true, message: '请选择是否显示标题', trigger: ['change'] },
            ]
          },
          {
            label: '页面',
            prop: 'page',
            type: 'select',
            // dicUrl: '',
            dicData: [],
            display: false,
            rules: [
              { required: true, message: '请选择页面', trigger: 'change' },
            ]
          },
          {
            label: '布局样式',
            prop: 'position',
            // formSlot: true,
            type: 'radio',
            dicData: [
              {label: '左侧', value: 'left'},
              {label: '全部', value: 'all'},
              {label: '右侧', value: 'right'}
            ],
            rules: [
              { required: true, message: '请选择样式', trigger: 'change' },
            ]
          },
          {
            label: '组件高度',
            prop: 'height',
            type: 'inputNumber',
            step: 1,
            min: 10,
            max: 2000,
            display: true,
            rules: [
              { required: true, message: '请填写高度', trigger: ['blur', 'change'] },
            ]
          }
        ]
      },
      dialogVisible: false, // 添加组件项弹框
      pos: 'all', // 组件位置
      list: [], // 组件列表
      testData: [],
      falgs: 'movelist',
      disabled: false,
      inTemp: [],
      modelName: '',
      showloading: false,
      currentList: []
    }
  },
  created () {
    // this.getWelInfoHandle()
  },
  methods: {
    async getWelInfoHandle () {
      await getWelInfo().then(res => {
        if(res.data.code == 0) {
          this.formatData(res.data.data)
        }
      })
    },
    addItem () {
      this.itemForm = {
        height: 700,
        position: 'all',
        page: '',
        displayTitle: true
      }
      this.dialogVisible = true
    },
    handleClose () {
      this.itemForm = {}
      this.dialogVisible = false
      this.pos = ''
      this.modelName = ''
      this.currentList = []
    },
    slectPosition (pos) {
      this.pos = pos
      this.itemForm.position = pos
    },
    submitHandle (form) {
      this.itemForm = form
      for(let i in this.currentList) {
        if(this.currentList[i].code == form.page) {
          this.modelName = this.currentList[i].name
        }
      }
      this.itemForm.title = this.modelName
      addWelInfo(this.itemForm).then(res => {
        if(res.data.code == 0) {
          this.$message.success('新增成功')
          this.getWelInfoHandle()
          this.handleClose()
        }
      })
    },
    startMove (event) {
      this.falgs = ''
    },
    endMove (ev) {
      this.falgs = 'movelist'
      let ids = []
      for(let i in this.list) {
        if(this.list[i].left) {
          ids.push(this.list[i].left.id)
        }
        if(this.list[i].right) {
          ids.push(this.list[i].right.id)
        }
      }
      sortWel({ids: JSON.stringify(ids)}).then(res => {
        if(res.data.code == 0) {}
      })
    },
    formatData (data) {
      let temp = []
      this.inTemp = []
      for(let i in data) {
        if(this.inTemp.indexOf(i) == -1) {
          if(data[i].position == 'all') {
            temp.push({
              left: data[i]
            })
            this.inTemp.push(i+'')
          }else{
            if(data[i].position == 'left') {
              let next = Number.parseInt(i) + 1
              if(data[next]) {
                if(data[next].position == 'right') {
                  temp.push({
                    left: data[i],
                    right: data[next]
                  })
                  this.inTemp.push(i)
                  this.inTemp.push(next+'')
                }else{
                  temp.push({
                    left: data[i]
                  })
                  this.inTemp.push(i)
                }
              }else{
                temp.push({
                  left: data[i]
                })
                this.inTemp.push(i)
              }
            }else{
              let next = Number.parseInt(i) + 1
              if(data[next]) {
                if(data[next].position == 'left') {
                  temp.push({
                    left: data[next],
                    right: data[i]
                  })
                  this.inTemp.push(i)
                  this.inTemp.push(next+'')
                }else{
                  temp.push({
                    left: {},
                    right: data[i]
                  })
                  this.inTemp.push(i)
                }
              }else{
                temp.push({
                  left: {},
                  right: data[i]
                })
                this.inTemp.push(i)
              }
            }
          }
        }
      }
      this.list = temp
      // console.log(this.list)
    },
    getHeight (item, type) {
      let lh = 0
      let rh = 0
      let h = 320
      if(item.left) {
        if(item.left.type == 'chart' || item.left.type == 'page') {
          lh = item.left.height || 320
        }else{
          if(item.left.type == 'calendar') {
            lh = item.left.height || 410
          }else{
            lh = item.left.height || 320
          }
        }
      }
      if(item.right) {
        if(item.right.type == 'chart' || item.right.type == 'page') {
          rh = item.right.height || 320
        }else{
          if(item.right.type == 'calendar') {
            rh = item.right.height || 410
          }else{
            rh = item.right.height || 320
          }
        }
      }
      if(type == 'max') {
        if(lh >= rh) {
          h=  lh
        }else{
          h = rh
        }
      }
      if(type == 'left') {
        h = lh
      }
      if(type == 'right') {
        h = rh
      }
      return h
    },
    // 删除组件
    deleteItemOfList (item, po) {
      this.$confirm('确认删除？').then(_ => {
        this.showloading = true
        delWelInfo(item[po].id).then(res => {
          if(res.data.code == 0) {
            this.$message.success('删除成功')
            this.getWelInfoHandle()
            this.showloading = false
          }
        })
      }).catch(_ => {})
    },
    // 通过value获取label
    getLabelByValue (attr1, val, attr2, list) {
      let str = ''
      for(let i in list) {
        if(list[i][attr1] == val) {
          str = list[i][attr2]
        }
      }
      return str
    },
    // 判断是否为空
    validatenullHandle(data) {
      return validatenull(data)
    }
  },
  watch: {
    'itemForm.type' : {
      handler (newVal, oldVal) {
        this.itemOption.column.filter(item => {
          if(item.prop == 'height') {
            item.display = true
            // if(newVal == 'chart' || newVal == 'page' || newVal == 'http'){
            //   item.display = true
            // }else{
            //   item.display = false
            // }
          }
          if(item.prop == 'page') {
            this.itemForm.page = ''
            if(newVal == 'chart' || newVal == 'page' || newVal == 'http') {
              if(newVal == 'http') {
                item.type = 'input'
                item.rules = [
                  { required: true, message: '请输入网页地址', trigger: 'blur' },
                  { validator: validateURLHandle, trigger: 'blur'}
                ]
              }else{
                item.type = 'select'
                item.rules = [
                  { required: true, message: '请选择页面', trigger: 'change' },
                ]
                getPageList(newVal).then(res => {
                  if(res.data.code == 0) {
                    item.dicData = res.data.data
                    this.currentList = res.data.data
                    item.props = {
                      label: 'name',
                      value: 'code'
                    }
                    this.itemForm.page = (item.dicData && item.dicData.length > 0) ? item.dicData[0].code : ''
                    if(item.dicData && item.dicData.length > 0) {
                      this.modelName = item.dicData[0].name
                    }
                  }
                })
              }
              item.display = true
            }else{
              item.display = false
              item.dicData = []
            }
          }
          if(item.prop == 'type') {
            this.modelName = this.getLabelByValue('value', newVal, 'label', item.dicData)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wel-index{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 8px 10px;
  padding: 0 10px;
  background-color: #f0f2f5;
  padding-bottom: 20px;
  position: relative;
  .wel-index-top{
    height: 20px;
    position: absolute;
    top: 5px;
    right: 15px;
    z-index: 9;
    i{
      font-size: 20px;
      // position: absolute;
      // top: 0;
      // right: 0;
    }
  }
  .wel-index-content{
    >div{
      width: 100%;
    }
    .list-item{
      position: relative;
      margin-top: 10px;
      overflow: hidden;
      cursor: move;
      width: 100%;
      display: flex;
      .list-item-left, .list-item-right, .list-item-all{
        padding: 20px 10px;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        // overflow-y: auto;
        background: #fff;
        position: relative;
        .delete-wel-item{
          position: absolute;
          right: 3px;
          bottom: 5px;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }
      }
      .list-item-left:hover, .list-item-right:hover, .list-item-all:hover{
        .delete-wel-item{
          display: block;
        }
      }
      .list-item-left::-webkit-scrollbar, .list-item-right::-webkit-scrollbar, .list-item-all::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      .list-item-all{
        width: 100%;
      }
      .list-item-left{
        width: calc(70% - 10px);
        position: absolute;
        left: 0;
      }
      .list-item-right{
        margin-left: 10px;
        width:calc(30% - 10px);
        width: 30%;
        position: absolute;
        right: 0;
        height: 100%;
      }
    }
  }
  .wel-item-info{
    h4{
      text-align: center;
      font-size: 24px;
    }
    section{
      text-align: center;
      font-size: 14px;
      line-height: 28px;
    }
  }
}
.position-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .position-box-item{
    width: 50px;
    height: 20px;
    border: 1px solid #e5e5e5;
    position: relative;
    cursor: pointer;
    p{
      position: absolute;
      background: #F56C6C;
      height: 20px;
      top: 0;
      padding: 0;
      margin: 0;
    }
  }
  .position-box-item.selectd ::after{
    content: "√";
    position: absolute;
    right: -13px;
    top: 0px;
    color: #409EFF;
    font-weight: bold;
  }
  .position-box-item:nth-of-type(2) ::after{
    right: -30px;
  }
}
.empty-wel-index{
  padding: 0;
  .wel-index-top{
    top: 10px;
  }
  .wel-index-content{
    height: 100%;
    background-image: url(../../../const/img/wel.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 40%;
    background-color: #fff;
  }
}
</style>
