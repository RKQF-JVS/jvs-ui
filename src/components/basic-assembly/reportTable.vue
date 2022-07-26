<template>
  <div class="report-table-info">
    <div :class="{'report-table el-table': true, 'el-table--border': formItem.border}">
      <div class="report-el-table__header-wrapper">
        <table class="el-table__header__nofix">
          <colgroup>
            <col name="el-table_1_column_1" width="80" />
            <col v-for="(col, coi) in formItem.dicData" :key="'table_1_column_'+col.value" :name="'el-table_1_column_'+(coi+2)" />
            <col name="gutter" width="0" />
          </colgroup>
          <thead class="has-gutter">
            <tr class="el-table__row">
              <th class="is-leaf el-table_1_column_1">
                <div class="cell" style="text-align:left;min-width:94px;">{{formItem.rowcolumn}}</div>
              </th>
              <th 
                v-for="(thi, thix) in formItem.dicData" 
                :key="'table_1_column_'+thi.value" 
                :class="'is-leaf el-table_1_column_ '+(thix+2)"
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
            <col v-for="(col, coi) in formItem.dicData" :key="'table_1_column_'+col.value" :name="'el-table_1_column_'+(coi+2)" />
            <col name="gutter" width="0" />
          </colgroup>
          <tbody>
            <tr class="el-table__row" v-for="(bi, bix) in formItem.tableColumn" :key="'report-table-body-row'+bix+bi.prop">
              <th class="is-leaf el-table_1_column_1">
                <div class="cell" style="text-align:left;min-width:94px;">
                  <span>{{bi.label}}</span>
                </div>
              </th>
              <td v-for="(tdi, tdix) in formItem.dicData" :key="tdi.value+tdix+'_column_'+bi.prop+bix" :class="'is-leaf el-table_1_column_'+(tdix+2)">
                <div class="cell">
                  <FormItem :item="bi" :form="forms[tdi.value]"
                    :roleOption="roleOption"
                    :userList="userList"
                    :departmentList="departmentList"
                    :postList="postList"
                    :resetRadom="resetRadom"
                    @formChange="formChange" />
                </div>
              </td>
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
    // 表单传递对象
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单结构对象
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formRef: {
      type: String,
      default: 'ruleForm'
    },
    originOption: {
      type: Object
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 部门列表
    departmentList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 岗位列表
    postList: {
      type: Array,
      default: () => {
        return []
      }
    },
    resetRadom: {
      type: Number
    }
  },
  computed: {},
  data () {
    return {
      
    };
  },
  methods: {
    formChange (form){
      // console.log(form)
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.report-table-info{
  width: 100%;
  .report-table{
    overflow: auto;
    th, td{
      text-align: center;
    }
    .el-table__header__nofix, .el-table__body__nofix{
      width: 100%;
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
    tbody{
      tr:nth-last-of-type(1) {
        th, td{
          border-bottom-color: #fff;
        }
      }
    }
  }
  .report-table::before{
    background: none;
  }
  .report-table::-webkit-scrollbar{
    height: 8px;
  }
  .report-table::-webkit-scrollbar-thumb{
    border-radius: 20px;
  }
  .report-table::after{
    display: none;
  }
}
</style>