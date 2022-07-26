<template>
  <div class="user-form">
    <el-row>
      <el-select
        v-model="search"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
        :allow-create="allowcreate"
        @change="changeHandle"
      >
        <el-option
          v-if="!loading"
          v-for="item in options"
          :key="item.id"
          :label="item.realName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-row>
  </div>
</template>
<script>
import {queryUser} from '../../api/user'
export default {
  name: 'user-form',
  props: {
    sendType: {
      type: String,
    },
    defaultValue: {
      type: Array
    }
  },
  data () {
    return {
      search: [],
      options: [],
      loading: false,
      allowcreate: false,
      boolShow: false
    }
  },
  created () {
    this.options = []
    if(this.defaultValue && this.defaultValue.length > 0) {
      for(let i in this.defaultValue) {
        if(this.defaultValue[i].id) {
          this.search.push(this.defaultValue[i].id)
        }else if(this.defaultValue[i].realName){
          this.search.push(this.defaultValue[i].realName)
        }else{
          this.search.push(this.defaultValue[i])
        }
        this.search = Array.from(new Set(this.search))
        this.remoteMethod(this.defaultValue[i].realName)
      }
    }
  },
  methods: {
    remoteMethod (query) {
      if (query!=='' && query!==' ' && this.sendType) {
        this.loading=true
        queryUser(this.sendType, query).then(res => {
          if (res.data.code==0) {
            // this.options = res.data.data
            for(let i in res.data.data) {
              this.options.push(res.data.data[i])
            }
            this.loading = false
            this.$forceUpdate()
          }
        })
      }
    },
    changeHandle (val) {
      let temp = []
      for(let i in this.search) {
        let item = this.getItemByValue(this.search[i], this.options)
        if(item) {
          temp.push(item)
        }else{
          if(this.search[i]) {
            temp.push({
              realName: this.search[i]
            })
          }
        }
      }
      this.$emit('userSelectChange', temp)
    },
    getItemByValue (val, list) {
      for(let i in list) {
        if(list[i].id === val || list[i].realName === val) {
          return list[i]
        }
      }
      return false
    }
  },
  watch: {
    sendType: function(newVal, oldVal) {
      this.search = []
      if(newVal == 'interior') {
        this.allowcreate = false
      }else{
        this.allowcreate = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-form{
  .el-row{
    width: 100%;
    .el-select{
      width: 100%;
    }
  }
}
</style>
