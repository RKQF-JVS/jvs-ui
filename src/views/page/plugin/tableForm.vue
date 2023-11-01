<template>
  <div style="cursor:pointer;">
    <div class="contdiv"
      :style="contdivstyle"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @dragover="dragover"
      @drop="drop"
      @dragover.prevent
    ></div>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      class="demo-dynamic"
      style="width:100%;"
      :label-position="formsetting.labelposition"
      :label-width="formsetting.labelwidth+'px'"
      :size="formsetting.formsize || 'mini'"
      >
      <el-table
        empty-text='拖动左侧的组件到表格中'
        :key="tablekey"
        :border='data.border'
        :data="dynamicValidateForm.domains"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        >
          <el-table-column align="center" type="index" width="50" v-if="false"></el-table-column>
          <el-table-column align="center" v-for="(item,index) in data.tableColumn"  :label="item.label + (item.rules.length > 0 ? '(必填)':'(可选)') " :key="'column'+index" :width="item.width">
            <template slot="header">
              <div class="headeritem">
                <span style="color:#F56C6C" v-if='item.rules.length > 0 && item.rules[0].required'>*</span>
                <span>{{item.label}}</span>
                <i class="el-icon-setting icons" @click.stop="set(item)"></i>
                <i class="el-icon-delete icons" @click.stop="del(item)"></i>
              </div>
            </template>
            <template scope="scope">
              <div>
                <el-form-item
                  :key="scope.$index"
                  :rules="item.rules"
                  :prop="'domains.' + scope.$index + '.' + item.prop"
                  class="tableform-no-label-item"
                >
                  <FormItem :item='item' />
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" :fixed="data.menuFix" v-if="data.editBtn || data.delBtn">
            <template scope="scope">
              <div style="width:100%;justify-content: center;">
                <jvs-button
                  v-if="data.delBtn"
                  size="mini"
                  type="text"
                  @click="removeDomain(scope.row)"
                >删除</jvs-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      <el-form-item class="tableform-no-label-item" style="margin-top:10px;" v-if="data.editable && data.addBtn">
        <el-button @click="()=> this.dynamicValidateForm.domains.push({})">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {
    FormItem: () => import('@/components/basic-assembly/formitem')
  },
  props: {
    // 被选中的 id值
    drag1: {
      type: String,
      default: () => {
        return '1'
      }
    },
    drag2: {
      type: String,
      default: () => {
        return '1'
      }
    },
    // 1 没有拖动到 表格中  2 已经拖动到表格中
    drag3: {
      type: String,
      default: () => {
        return '1'
      }
    },
    // 用来判断是否是中间内容的拖动 为 -1 时 就不是  大于 0 的 都是 (此时不进行处理)
    startindex: {
      type: Number,
      default: () => {
        return -1
      }
    },
    field: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 表格的对象
    data: {
      type: Object,
      default: () => {
        return {
          tableColumn: []
        }
      }
    },
    // 左侧被拉动的组件 如果在table 中放开 则添加到table 中
    com: {
      type: Object
    },
    action: {
      type: String,
      default: () => {
        return ""
      }
    },
    formsetting: {
      type: Object
    }
  },
  computed: {
    column () {
      return this.data.tableColumn
    },
    contdivstyle(){
      let obj = {}
      // obj.background = this.drag3 === '1' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)'
      // 左侧或者 中间拖动的时候 要 大等于 10
      obj['z-index'] =  this.drag1 !== '1' ? 100 : -1

      return obj
    }
  },
  data() {
    return {
      tablekey: 'tablekey' + new Date().getTime(),
      dynamicValidateForm: {
        domains: []
      }
    };
  },
  methods: {
    dragenter () {
      console.log('进入目标>>>')
      // this.$emit('setmub', true)
    },
    dragover () {
      // 当在表格上滑动的时候
      this.$emit('setdrag3', '2')
      // console.log('在表格上>>>')
    },
    dragleave () {
      this.$emit('setdrag3', '1')
      console.log('移出目标>>>')
      // this.$emit('setmub', false)
    },
    drop () {
      // todo 进行添加操作 并且 hxindex 置为 -3
      if (['tableForm','p','divider','tab','section', 'step', 'formbox', 'htmlEditor', 'reportTable'].indexOf(this.com.type) == -1 ) {
        if(this.com.type === 'imageUpload' || this.com.type === 'fileUpload'){
          this.com.action = this.action
        }
        if(this.data.addcolumn){
          this.data.addcolumn(this.com)
        }else{
          this.data.tableColumn.push(this.com)
        }
        this.$emit('setdrag3', '2')
      } else if (this.startindex === '-1') {
        // 中间的拖动到表格中 不处理
      } else {
        if(this.com.type === 'divider') {
          this.$message.error('不能在表格中添加分割线')
        }else if(this.com.type === 'p') {
          this.$message.error('不能在表格中添加文字')
        }else if(this.com.type === 'tab') {
          this.$message.error('不能在表格中添加选项卡')
        }else if(this.com.type === 'section') {
          this.$message.error('不能在表格中添加作用域')
        }else if(this.com.type === 'step'){
          this.$message.error('不能在表格中添加步骤条')
        }else if(this.com.type === 'formbox'){
          this.$message.error('不能在表格中添加表单卡片')
        }else if(this.com.type == 'htmlEditor'){
          this.$message.error('不能在表格中添加富文本')
        }else if(this.com.type == 'reportTable'){
          this.$message.error('不能在表格中添加静态表格')
        }else{
          this.$message.error('不能在表格中添加表格')
        }
      }
      this.$emit('chonzhihxindex')
      console.log(this.data)
      console.log('方>>>')
    },
    submitForm(formName) {
      console.log(this.dynamicValidateForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.dynamicValidateForm)
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    set (data) {
      this.$emit('clickitem', data)
    },
    del (data) {
      (this.data.deletecolumn && this.data.deletecolumn(data.prop)) || ( this.data.tableColumn = this.data.tableColumn.filter(item => item.prop != data.prop) )
    }
  },
  watch: {
    data: {
      handler() {
        this.tablekey = 'tablekey' + new Date().getTime()
        for(let i in this.data.tableColumn) {
          this.data.tableColumn[i].width = this.data.tableColumn[i].span * 8
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.headeritem {
  /* background: red; */
  &:hover{
    .icons{
      color: #333333;
      display: inline-block;
      &:hover{
        color: red;
      }
    }
  }
}
.cont{
  position: relative;
  width: 100%;
  height: 117px;
  /* background: blue; */
}
.contdiv{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  /* bottom: 40px; */
  bottom: 0;
  z-index: 100;
  transition: all 0.5s;
  border-radius: 3px;
  overflow: hidden;
}
.icons {
  //display: none;
  color: #FFFFFF;
  text-align: right;
  z-index: 10000;
  cursor: pointer;
}
//.icons:hover{
//  color: red;
//}
.table-form{
  .el-form-item{
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.tb-edit{
  .el-form-item{
    margin-bottom: 0;
  }
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
  }
}
.tableform-no-label-item{
  .el-form-item__content{
    margin-left: 0!important;
  }
}
</style>
