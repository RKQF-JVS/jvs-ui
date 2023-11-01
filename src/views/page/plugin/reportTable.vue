<template>
  <div class="report-table-designer">
    <div
      class="contdiv"
      :style="contdivstyle"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @dragover="dragover"
      @drop="drop"
      @dragover.prevent
    ></div>
    <div :class="{'report-table el-table': true, 'el-table--border': data.border}" style="width: 100%;">
      <div class="report-el-table__header-wrapper" style="margin-top: 0;">
        <table class="el-table__header__nofix">
          <colgroup>
            <col name="el-table_1_column_1" width="80" />
            <col v-for="(col, coi) in data.dicData" :key="'table_1_column_'+col.value" :name="'el-table_1_column_'+(coi+2)" />
            <col name="gutter" width="0" />
          </colgroup>
          <thead class="has-gutter">
            <tr class="el-table__row">
              <th class="is-leaf el-table_1_column_1">
                <div class="cell" style="text-align:center;min-width:94px;">{{data.rowcolumn}}</div>
              </th>
              <th
                v-for="(thi, thix) in data.dicData"
                :key="'table_1_column_'+thi.value"
                :class="'is-leaf el-table_1_column_'+(thix+2)"
              >
                <div class="cell">{{thi.label}}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="report-el-table__body-wrapper">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__body__nofix"
        >
          <colgroup>
            <col name="el-table_1_column_1" width="80" />
            <col v-for="(col, coi) in data.dicData" :key="'table_1_column_'+col.value" :name="'el-table_1_column_'+(coi+2)" />
            <col name="gutter" width="0" />
          </colgroup>
          <tbody>
            <tr class="el-table__row" v-for="(bi, bix) in data.tableColumn" :key="'report-table-body-row'+bix+bi.prop">
              <th class="is-leaf el-table_1_column_1">
                <div class="cell" style="text-align:center;min-width:94px;">
                  <span>{{bi.label}}</span>
                  <br/>
                  <i class="el-icon-setting icons" @click.stop="set(bi)"></i>
                  <i class="el-icon-delete icons" @click.stop="del(bi)"></i>
                </div>
              </th>
              <td v-for="(tdi, tdix) in data.dicData" :key="tdi.value+tdix+'_column_'+bi.prop+bix" :class="'is-leaf el-table_1_column_'+(tdix+2)">
                <div class="cell">
                  <FormItem :item="bi" />
                </div>
              </td>
              <!-- <td class="el-table_1_column_1">
                <div class="cell">30</div>
              </td>
              <td class="el-table_1_column_1">
                <div class="cell">35</div>
              </td>
              <td class="el-table_1_column_1">
                <div class="cell">32</div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="el-table_1_column_1">
                <div class="cell">平均成绩</div>
              </td>
              <td class="el-table_1_column_1">
                <div class="cell">89</div>
              </td>
              <td class="el-table_1_column_1">
                <div class="cell">85</div>
              </td>
              <td class="el-table_1_column_1">
                <div class="cell">80</div>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
    contdivstyle () {
      let obj={}
      // obj.background = this.drag3 === '1' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)'
      // 左侧或者 中间拖动的时候 要 大等于 10
      obj['z-index']=this.drag1!=='1'? 100:-1

      return obj
    }
  },
  data () {
    return {
      tablekey: 'tablekey'+new Date().getTime(),
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
      if (['tableForm', 'p', 'divider', 'tab', 'section', 'step', 'formbox', 'reportTable', 'htmlEditor'].indexOf(this.com.type)==-1) {
        if (this.com.type==='imageUpload'||this.com.type==='fileUpload') {
          this.com.action=this.action
        }
        if (this.data.addcolumn) {
          this.data.addcolumn(this.com)
        } else {
          this.data.tableColumn.push(this.com)
        }
        this.$emit('setdrag3', '2')
      } else if (this.startindex==='-1') {
        // 中间的拖动到表格中 不处理
      } else {
        if (this.com.type==='divider') {
          this.$message.error('不能在静态表格中添加分割线')
        } else if (this.com.type==='p') {
          this.$message.error('不能在静态表格中添加文字')
        } else if (this.com.type==='tab') {
          this.$message.error('不能在静态表格中添加选项卡')
        } else if (this.com.type==='section') {
          this.$message.error('不能在静态表格中添加作用域')
        } else if (this.com.type==='step') {
          this.$message.error('不能在静态表格中添加步骤条')
        } else if (this.com.type==='formbox') {
          this.$message.error('不能在静态表格中添加表单卡片')
        }else if(this.com.type == 'tableForm'){
          this.$message.error('不能在静态表格中添加表格')
        }else if(this.com.type == 'htmlEditor'){
          this.$message.error('不能在静态表格中添加富文本')
        }else {
          this.$message.error('不能在静态表格中添加静态表格')
        }
      }
      this.$emit('chonzhihxindex')
      console.log(this.data)
      console.log('方>>>')
    },
    submitForm (formName) {
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
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain (item) {
      var index=this.dynamicValidateForm.domains.indexOf(item);
      if (index!==-1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    set (data) {
      this.$emit('clickitem', data)
    },
    del (data) {
      (this.data.deletecolumn&&this.data.deletecolumn(data.prop))||(this.data.tableColumn=this.data.tableColumn.filter(item => item.prop!=data.prop))
    }
  },
  watch: {
    data: {
      handler () {
        this.tablekey='tablekey'+new Date().getTime()
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.headeritem {
  /* background: red; */
}
.cont {
  position: relative;
  width: 100%;
  height: 117px;
  /* background: blue; */
}
.contdiv {
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
  text-align: right;
  z-index: 10000;
  cursor: pointer;
}
.icons:hover {
  color: red;
}
.table-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.tb-edit {
  .el-form-item {
    margin-bottom: 0;
  }
}
.report-table-designer{
  padding-bottom: 40px;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  .report-table::after{
    display: none;
  }
  .report-table{
    overflow: auto;
    th, td{
      text-align: center;
    }
    .is-leaf:not(.el-table_1_column_1){
      .cell{
        min-width: 200px;
      }
    }
    .el-table__header__nofix, .el-table__body__nofix{
      width: 100%;
    }
    .el-table__fixed-right{
      padding-bottom: 4px;
    }
    .cell{
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
  .report-table::-webkit-scrollbar{
    height: 8px;
  }
  .report-table::-webkit-scrollbar-thumb{
    border-radius: 20px;
  }
}

</style>
