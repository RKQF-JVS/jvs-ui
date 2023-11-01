<template>
  <div class="basic-info">
    <jvs-form :option="option" :formData="formData" :defaultFormData="formData">
    </jvs-form>
    <el-row style="margin-top:10px;padding:0 20px;">
      <!-- <jvs-button size="mini">预览效果</jvs-button> -->
      <!-- <jvs-button size="mini" :disabled="!formData.canGenerateSourceCode">预览代码</jvs-button>
      <jvs-button size="mini" :disabled="!formData.canGenerateSourceCode" v-if="formData.id" @click="downloadHande">下载源码</jvs-button> -->
    </el-row>
  </div>
</template>
<script>
import {getTableList, getSourceCode} from '../../../api/list'
export default {
  name: 'basic-info',
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          dataSourceId: '',
          tableId: ''
        }
      }
    }
  },
  computed: {},
  data () {
    return {
      option: {
        labelWidth: '90px',
        btnHide: true,
        cancal: false,
        column: [
          {
            label: '数据源',
            prop: 'dataSourceId',
            type: 'select',
            dicUrl: '/mgr/jvs-design/datasource',
            dicData: [],
            props: {
              label: 'name',
              value: 'id'
            }
          },
          {
            label: '数据表',
            prop: 'tableId',
            type: 'select',
            dicData: [],
            props: {
              label: 'info',
              value: 'id'
            }
          }
        ]
      }
    }
  },
  created () {
    // console.log(this.formData)
  },
  methods: {
    downloadHande () {
      getSourceCode(this.formData.id).then(res => {
        // let name = res.headers["content-disposition"].split(";")[1]
        // name = name.split("=")[1]
        // name = decodeURI(name)
        // this.downloadFile(name, res.data)
        this.downloadFile(null, res.data)
      })
    },
    // 下载文件
    downloadFile(filename, content) {
      var elink = document.createElement('a')
      if(filename) {
        elink.download = filename
      }
      elink.style.display = 'none'

      var blob = new Blob([content]) //,{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
      elink.href = URL.createObjectURL(blob)

      document.body.appendChild(elink)
      elink.click()

      document.body.removeChild(elink)
    }
  },
  watch: {
    'formData.dataSourceId': {
      deep: true,
      handler(newVal,oldVal) {
        if(newVal && newVal != oldVal) {
          getTableList(newVal).then(res => {
            if(res.data.code == 0) {
              this.option.column.filter( item => {
                if(item.prop == 'tableId') {
                  item.dicData = res.data.data.tables
                  this.$forceUpdate()
                }
              })
            }
          })
        }
      }
    },
    'formData.tableId': {
      deep: true,
      handler(newVal, oldVal) {
        if(!oldVal && this.formData.id) {
          return false
        }
        if(newVal && newVal != oldVal) {
          this.$emit('tableChange', {dataSourceId: this.formData.dataSourceId, tableId: newVal})
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
