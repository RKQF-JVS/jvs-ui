<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <basic-container :block="true">
        这是一个容器
      </basic-container>
      <div class="demo-item">
        <div class="show-code">
          <codeArea lang="html" :content='`
            <basic-container :block="true">
              这是一个容器
            </basic-container>
          `'>
          </codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="参数配置" :option="option" :data="tableData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'container',
  data () {
    return {
      detail: {
        title: '基础容器',
        info: '容器组件，方便大部分页面占位',
        useInfo: '<basic-container></basic-container>'
      },
      option: paramOption,
      tableData: [
        {
          param: 'block',
          introduce: '为true时添加一个class名称basic-container--bloc',
          type: 'Boolean',
          value: 'true / false',
          default: 'false'
        }
      ],
      event: eventOption,
      eventData: [
        {
          name: '',
          introduce: '',
          param: '',
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>