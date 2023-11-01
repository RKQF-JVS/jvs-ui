<template>
  <div class="user-info-list">
    <div>
      <el-input size="mini" placeholder="请选择用户" :disabled="disableBool" v-model="userStr" class="input-with-select" @focus="enableinputHandle">
        <div slot="append">
          <jvs-button icon="el-icon-search" type="info" :disabled="disableBool" @click="openDialog"></jvs-button>
          <jvs-button icon="el-icon-delete" type="warning" :disabled="disableBool" @click="clearUser"></jvs-button>
        </div>
      </el-input>
    </div>
    <userSelector ref="userSelector" :autoClose="true" @submit="submit"></userSelector>
  </div>
</template>

<script>
import userSelector from '@/components/basic-assembly/userSelector'
export default {
  name: "user-info-list",
  components: {userSelector},
  props: {
    form: {
      type: Object
    },
    prop: {
      type: String
    },
    selectable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    defaultValue: {
      type: String
    },
    enableinput: {
      type: Boolean,
      default: true
    },
    clearBool: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  filters: {
    formatRoleName (list) {
      let str = ''
      if(list) {
        str = list.join(',')
      }
      return str
    }
  },
  data () {
    return {
      selected: {},
      userStr: '',
      userList: [],
      userNameList: [],
      disableBool: false
    }
  },
  methods: {
    selectOne (data) {
      this.selected = data.row
    },
    selectChange (data) {
      let temp = []
      let nm = []
      for(let i in data) {
        temp.push(data[i].id)
        nm.push(data[i].realName) // userName)
      }
      this.userList = temp
      this.userNameList = nm
    },
    submit (list) {
      if(this.selectable) {
        this.selectChange(list)
        this.userStr = this.userNameList.join(',')
        this.form[this.prop] = this.userList
      }else{
        if(list && list.length > 0) {
          this.selected = list[0]
        }
        if(this.selected) {
          this.form[this.prop] = this.selected.id
          this.userStr = this.selected.realName // userName
        }
      }
    },
    openDialog () {
      this.$refs.userSelector.openDialog()
    },
    enableinputHandle () {
      if(this.enableinput === false) {
        this.openDialog()
      }
    },
    clearUser () {
      this.userStr = ""
      if(this.selectable) {
        this.form[this.prop] = []
      }else{
        if(this.selected) {
          this.form[this.prop] = ""
        }
      }
    }
  },
  mounted () {},
  created () {
    // this.getList(true)
  },
  watch: {
    defaultValue: {
      handler (newVal, oldVal) {
        this.userStr = newVal
        if(newVal != '') {
          this.disableBool = true
        }else{
          this.disableBool = false
        }
        this.$forceUpdate()
      }
    },
    clearBool: {
      handler (newVal, oldVal) {
        if(newVal) {
          this.userStr = ""
          this.$forceUpdate()
        }
      }
    }
  },
};
</script>

<style lang="scss">
.user-info-box{
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  .user-dept-tree{
    width: 150px;
  }
  .user-table{
    flex: 1;
    margin-left: 10px;
    width: calc(100% - 200px);
    box-sizing: border-box;
    .table-body-box{
      height: calc(100% - 130px);
      overflow: hidden;
      .el-table{
        height: 100%;
        box-sizing: border-box;
       .el-table__body-wrapper{
         height: calc(100% - 75px)!important;
       }
      }
    }
  }
}
</style>