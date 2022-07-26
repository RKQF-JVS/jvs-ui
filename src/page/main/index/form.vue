<template>
  <el-form
    :model="formData"
    :ref="refs"
    :option="option"
    :class="{'jvs-form': true, 'jvs-form-autoflexable': (option.labelWidth == 'auto')}"
    :size="$store.state.params.form.size || 'mini'"
    :inline="option.inline"
    :label-position="option.align"
    :label-width="option.labelWidth"
  >
    <el-row>
      <el-col v-for="item in option.column" :key="item.prop" :span="item.span || 24">
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type != 'title'">
          <!-- 文本框 -->
          <el-input v-if="!item.type || item.type == 'input'" v-model="formData[item.prop]" :placeholder="item.label"></el-input>
          <!-- 颜色选择器 -->
          <el-color-picker v-if="item.type == 'color-select'" v-model="formData[item.prop]" :placeholder="item.label"></el-color-picker>
          <!-- 数字 -->
          <el-input-number
            v-if="item.type == 'number'"
            v-model="formData[item.prop]"
            :min="item.min"
            :max="item.max"
            :placeholder="item.label"
          ></el-input-number>
          <!-- 下拉框 -->
          <el-select v-if="item.type == 'select'" v-model="formData[item.prop]" :filterable="item.filterable" :placeholder="item.label">
            <el-option
              v-for="d in item.dicData"
              :key="d.value"
              :label="d.label"
              :value="d.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <h5 v-if="item.type == 'title'">{{item.label}}</h5>
        <el-row v-if="item.type == 'title' && item.children && item.children.length > 0">
          <el-col v-for="it in item.children" :key="it.prop" :span="it.span || 24">
            <el-form-item
              :label="it.label"
              :prop="it.prop"
            >
              <!-- 文本框 -->
              <el-input v-if="!it.type || it.type == 'input'" v-model="formData[item.prop][it.prop]"></el-input>
              <!-- 颜色选择器 -->
              <el-color-picker v-if="it.type == 'color-select'" v-model="formData[item.prop][it.prop]"></el-color-picker>
              <!-- 数字 -->
              <el-input-number
                v-if="it.type == 'number'"
                v-model="formData[item.prop][it.prop]"
                :min="it.min"
                :max="it.max"
                :placeholder="it.label"
              ></el-input-number>
              <!-- 下拉框 -->
              <el-select v-if="it.type == 'select'" v-model="formData[item.prop][it.prop]" :filterable="it.filterable" :placeholder="it.label">
                <el-option
                  v-for="d in it.dicData"
                  :key="d.value"
                  :label="d.label"
                  :value="d.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <slot></slot>
  </el-form>
</template>

<script>
export default {
  name: "themeForm",
  props: {
    // 表单绑定
    refs: {
      type: String,
      default: 'ruleForm'
    },
    // 表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单设置
    option: {
      type: Object,
      default: () => {
        return {
          align: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          column: [ // 字段
            {}
          ],
        }
      }
    },
  },
  created () {
    // console.log(this.formData)
  }
};
</script>

<style lang="scss">
.jvs-form {
  h5 {
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }
}
.jvs-form-autoflexable{
  .el-form-item{
    display: flex;
    .el-form-item__label-wrap{
      margin-left: auto!important;
      word-break: keep-all;
    }
    .el-form-item__content{
      margin-left: auto!important;
    }
  }
}
</style>
