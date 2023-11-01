<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <div class="demo-item">
        <h5>基础用法</h5>
        <span>基础的按钮用法</span>
        <div class="show">
          <el-row>
            <jvs-button>默认按钮</jvs-button>
            <jvs-button type="primary">主要按钮</jvs-button>
            <jvs-button type="success">成功按钮</jvs-button>
            <jvs-button type="info">信息按钮</jvs-button>
            <jvs-button type="warning">警告按钮</jvs-button>
            <jvs-button type="danger">危险按钮</jvs-button>
          </el-row>

          <el-row>
            <jvs-button plain>朴素按钮</jvs-button>
            <jvs-button type="primary" plain>主要按钮</jvs-button>
            <jvs-button type="success" plain>成功按钮</jvs-button>
            <jvs-button type="info" plain>信息按钮</jvs-button>
            <jvs-button type="warning" plain>警告按钮</jvs-button>
            <jvs-button type="danger" plain>危险按钮</jvs-button>
          </el-row>

          <el-row>
            <jvs-button round>圆角按钮</jvs-button>
            <jvs-button type="primary" round>主要按钮</jvs-button>
            <jvs-button type="success" round>成功按钮</jvs-button>
            <jvs-button type="info" round>信息按钮</jvs-button>
            <jvs-button type="warning" round>警告按钮</jvs-button>
            <jvs-button type="danger" round>危险按钮</jvs-button>
          </el-row>

          <el-row>
            <jvs-button icon="el-icon-search" circle></jvs-button>
            <jvs-button type="primary" icon="el-icon-edit" circle></jvs-button>
            <jvs-button type="success" icon="el-icon-check" circle></jvs-button>
            <jvs-button type="info" icon="el-icon-message" circle></jvs-button>
            <jvs-button type="warning" icon="el-icon-star-off" circle></jvs-button>
            <jvs-button type="danger" icon="el-icon-delete" circle></jvs-button>
          </el-row>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <el-row>
              <jvs-button>默认按钮</jvs-button>
              <jvs-button type="primary">主要按钮</jvs-button>
              <jvs-button type="success">成功按钮</jvs-button>
              <jvs-button type="info">信息按钮</jvs-button>
              <jvs-button type="warning">警告按钮</jvs-button>
              <jvs-button type="danger">危险按钮</jvs-button>
            </el-row>

            <el-row>
              <jvs-button plain>朴素按钮</jvs-button>
              <jvs-button type="primary" plain>主要按钮</jvs-button>
              <jvs-button type="success" plain>成功按钮</jvs-button>
              <jvs-button type="info" plain>信息按钮</jvs-button>
              <jvs-button type="warning" plain>警告按钮</jvs-button>
              <jvs-button type="danger" plain>危险按钮</jvs-button>
            </el-row>

            <el-row>
              <jvs-button round>圆角按钮</jvs-button>
              <jvs-button type="primary" round>主要按钮</jvs-button>
              <jvs-button type="success" round>成功按钮</jvs-button>
              <jvs-button type="info" round>信息按钮</jvs-button>
              <jvs-button type="warning" round>警告按钮</jvs-button>
              <jvs-button type="danger" round>危险按钮</jvs-button>
            </el-row>

            <el-row>
              <jvs-button icon="el-icon-search" circle></jvs-button>
              <jvs-button type="primary" icon="el-icon-edit" circle></jvs-button>
              <jvs-button type="success" icon="el-icon-check" circle></jvs-button>
              <jvs-button type="info" icon="el-icon-message" circle></jvs-button>
              <jvs-button type="warning" icon="el-icon-star-off" circle></jvs-button>
              <jvs-button type="danger" icon="el-icon-delete" circle></jvs-button>
            </el-row>
            `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>禁用状态</h5>
        <span>按钮不可用状态</span>
        <div class="show">
          <el-row>
            <jvs-button disabled>默认按钮</jvs-button>
            <jvs-button type="primary" disabled>主要按钮</jvs-button>
            <jvs-button type="success" disabled>成功按钮</jvs-button>
            <jvs-button type="info" disabled>信息按钮</jvs-button>
            <jvs-button type="warning" disabled>警告按钮</jvs-button>
            <jvs-button type="danger" disabled>危险按钮</jvs-button>
          </el-row>

          <el-row>
            <jvs-button plain disabled>朴素按钮</jvs-button>
            <jvs-button type="primary" plain disabled>主要按钮</jvs-button>
            <jvs-button type="success" plain disabled>成功按钮</jvs-button>
            <jvs-button type="info" plain disabled>信息按钮</jvs-button>
            <jvs-button type="warning" plain disabled>警告按钮</jvs-button>
            <jvs-button type="danger" plain disabled>危险按钮</jvs-button>
          </el-row>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <el-row>
              <jvs-button disabled>默认按钮</jvs-button>
              <jvs-button type="primary" disabled>主要按钮</jvs-button>
              <jvs-button type="success" disabled>成功按钮</jvs-button>
              <jvs-button type="info" disabled>信息按钮</jvs-button>
              <jvs-button type="warning" disabled>警告按钮</jvs-button>
              <jvs-button type="danger" disabled>危险按钮</jvs-button>
            </el-row>

            <el-row>
              <jvs-button plain disabled>朴素按钮</jvs-button>
              <jvs-button type="primary" plain disabled>主要按钮</jvs-button>
              <jvs-button type="success" plain disabled>成功按钮</jvs-button>
              <jvs-button type="info" plain disabled>信息按钮</jvs-button>
              <jvs-button type="warning" plain disabled>警告按钮</jvs-button>
              <jvs-button type="danger" plain disabled>危险按钮</jvs-button>
            </el-row>
          `'></codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>文字按钮</h5>
        <span>没有边框和背景颜色的按钮</span>
        <div class="show">
          <jvs-button type="text">文字按钮</jvs-button>
          <jvs-button type="text" disabled>文字按钮</jvs-button>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-button type="text">文字按钮</jvs-button>
            <jvs-button type="text" disabled>文字按钮</jvs-button>
          `'></codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>图标按钮</h5>
        <span>带图标的按钮可增强辨识度（有文字）或节省空间（无文字）</span>
        <div class="show">
          <jvs-button type="primary" icon="el-icon-edit"></jvs-button>
          <jvs-button type="primary" icon="el-icon-share"></jvs-button>
          <jvs-button type="primary" icon="el-icon-delete"></jvs-button>
          <jvs-button type="primary" icon="el-icon-search">搜索</jvs-button>
          <jvs-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></jvs-button>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-button type="primary" icon="el-icon-edit"></jvs-button>
            <jvs-button type="primary" icon="el-icon-share"></jvs-button>
            <jvs-button type="primary" icon="el-icon-delete"></jvs-button>
            <jvs-button type="primary" icon="el-icon-search">搜索</jvs-button>
            <jvs-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></jvs-button>
          `'></codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>加载中</h5>
        <span>要设置为 loading 状态，只要设置loading属性为true即可</span>
        <div class="show">
          <jvs-button type="primary" :loading="true">加载中</jvs-button>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-button type="primary" :loading="true">加载中</jvs-button>
          `'></codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>不同尺寸</h5>
        <span>按钮组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸</span>
        <br />
        <span>额外的尺寸：medium、small、mini，通过设置size属性来配置它们</span>
        <div class="show">
          <el-row>
            <jvs-button>默认按钮</jvs-button>
            <jvs-button size="medium">中等按钮</jvs-button>
            <jvs-button size="small">小型按钮</jvs-button>
            <jvs-button size="mini">超小按钮</jvs-button>
          </el-row>
          <el-row>
            <jvs-button round>默认按钮</jvs-button>
            <jvs-button size="medium" round>中等按钮</jvs-button>
            <jvs-button size="small" round>小型按钮</jvs-button>
            <jvs-button size="mini" round>超小按钮</jvs-button>
          </el-row>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <el-row>
              <jvs-button>默认按钮</jvs-button>
              <jvs-button size="medium">中等按钮</jvs-button>
              <jvs-button size="small">小型按钮</jvs-button>
              <jvs-button size="mini">超小按钮</jvs-button>
            </el-row>
            <el-row>
              <jvs-button round>默认按钮</jvs-button>
              <jvs-button size="medium" round>中等按钮</jvs-button>
              <jvs-button size="small" round>小型按钮</jvs-button>
              <jvs-button size="mini" round>超小按钮</jvs-button>
            </el-row>
          `'></codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="参数配置" :option="option" :data="tableData"></jvs-table>
      <jvs-table pageheadertitle="事件说明" :option="event" :data="eventData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'Button',
  data () {
    return {
      detail: {
        title: '按钮',
        info: '常用的操作按钮',
        useInfo: '<jvs-button></jvs-button>'
      },
      option: paramOption,
      tableData: [
        {
          param: 'size',
          introduce: '尺寸',
          type: 'string',
          value: 'medium / small / mini',
          default: '-'
        },
        {
          param: 'type',
          introduce: '类型',
          type: 'string',
          value: 'primary / success / warning / danger / info / text',
          default: '-'
        },
        {
          param: 'plain',
          introduce: '是否朴素按钮',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'round',
          introduce: '是否圆角按钮',
          type: '是否圆角按钮',
          value: '-',
          default: 'false'
        },
        {
          param: 'circle',
          introduce: '是否圆形按钮',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'loading',
          introduce: '是否加载中状态',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'disabled',
          introduce: '是否禁用状态',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'icon',
          introduce: '图标类名',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'autofocus',
          introduce: '是否默认聚焦',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'native-type',
          introduce: '原生 type 属性',
          type: 'string',
          value: 'button / submit / reset',
          default: 'button'
        },
        {
          param: 'permisionFlag',
          introduce: '权限标识',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'defaultText',
          introduce: '默认文字，即匹配失败或无需匹配时的显示',
          type: 'string',
          value: '-',
          default: '-'
        }
      ],
      event: eventOption,
      eventData: [
        {
          name: 'click',
          introduce: '点击事件',
          param: '-',
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>