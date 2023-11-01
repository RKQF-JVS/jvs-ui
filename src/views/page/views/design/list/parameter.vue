<template>
  <div class="parameters-form">
    <tableForm :option="option" :data="tableData">
      <template slot="menuBtn" slot-scope="scope">
        <jvs-button type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
      </template>
    </tableForm>
    <el-row style="margin-top: 10px">
      <jvs-button @click="addRowHandle">新增一行</jvs-button>
    </el-row>
  </div>
</template>
<script>
import {columnTypeList} from '../../../const/const'
import tableForm from '../../../components/basic-design/tableForm'
export default {
  name: 'parameters-form',
  components: { tableForm },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    roleList: {
      type: Array
    }
  },
  computed: {
    tableData: {
      get () {
        return this.data
      },
      set () {}
    }
  },
  data(){
    return{
      option: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        cancal: false,
        column: [
          {
            label: '字段名',
            prop: 'name'
          },
          {
            label: '字段值',
            prop: 'value'
          },
          {
            label: '字段类型',
            prop: 'sqlType',
            type: 'select',
            dicData: columnTypeList
          }
        ]
      }
    }
  },
  methods: {
    addRowHandle () {
      this.tableData.push({})
    },
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>