<template>
  <div class="news-info">
    <div class="item-title-bar" v-if="item.displayTitle">
      <h4>{{item.title}}</h4>
    </div>
    <div>
      <jvs-table :option="option" :data="item.data.data" :showHeader="false" :size="$store.getters.theme.table.size || 'mini'">
        <template slot="content" slot-scope="scope">
          <a :href="scope.row.link" target="_blank" style="color: #606266;"><span>[{{scope.row.title}}]  {{scope.row.content}}</span></a>
        </template>
      </jvs-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'news-info',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          data: {
            data: []
          }
        }
      }
    }
  },
  data(){
    return {
      option: {
        addBtn: false,
        menu: false,
        column: [
          {
            label: '消息类型',
            prop: 'title',
            hide: true,
          },
          {
            label: '消息标题',
            prop: 'content',
            span: 24,
            align: 'left',
            slot: true,
            showOverflow: true
          },
          {
            label: "发送时间",
            prop: "date",
            align: 'right',
            span: 24,
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            showOverflow: true
          },
        ]
      }
    }
  },
  created () {},
  methods: {
    viewAll () {
      this.$router.push({ path: '/usermessage' })
    }
  }
}
</script>
<style lang="scss" scoped>
.item-title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-left: 3px solid #409EFF;
  p, h4{
    margin: 0;
    padding: 0;
  }
  p{
    cursor: pointer;
  }
}
</style>
