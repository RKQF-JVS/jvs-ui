<template>
  <el-form class="form-item-setting" :model="form" label-width="140px" size="mini">
    <el-form-item v-if="form.showFrom.indexOf('label') !== -1" label="显示名称">
      <el-input v-model="form.label" size="mini"></el-input>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('span') !== -1" label="栅格格数">
      <el-input-number
        :min="1"
        :max="24"
        v-model="form.span"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('minlength') !== -1"
      label="最小长度"
    >
      <el-input-number
        :min="0"
        v-model="form.minlength"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('maxlength') !== -1"
      label="最大长度"
    >
      <el-input-number
        :min="0"
        v-model="form.maxlength"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('showwordlimit') !== -1"
      label="字数统计"
    >
      <el-switch
        v-model="form.showwordlimit"
        active-color="#409EFF"
        inactive-color="#eee"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('placeholder') !== -1"
      label="占位内容"
    >
      <el-input v-model="form.placeholder" size="mini"></el-input>
    </el-form-item>
    <el-form-item
      v-if="
        form.showFrom.indexOf('clearable') !== -1 && form.type !== 'Textarea'
      "
      label="可否清空"
    >
      <el-switch
        v-model="form.clearable"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('min') !== -1" label="最小值">
      <el-input-number v-model="form.min" size="mini"></el-input-number>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('max') !== -1" label="最大值">
      <el-input-number v-model="form.max"></el-input-number>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('step') !== -1" label="步长">
      <el-input-number
        :precision="2"
        v-model="form.step"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('stepstrictly') !== -1"
      label="只能是步长的倍数"
    >
      <el-switch
        v-model="form.stepstrictly"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('precision') !== -1"
      label="精确小数点后几位"
    >
      <el-input-number
        :min="0"
        :max="5"
        :step="1"
        stepstrictly
        v-model="form.precision"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('controlsposition') !== -1"
      label="按钮位置"
    >
      <el-select v-model="form.controlsposition" size="mini">
        <el-option label="两边" value=""></el-option>
        <el-option label="右边" value="right"></el-option>
      </el-select>
    </el-form-item>
    <!-- 下拉框 -->
    <el-form-item
      v-if="form.showFrom.indexOf('multiple') !== -1"
      label="可否多选"
    >
      <el-switch
        v-model="form.multiple"
        active-color="#409EFF"
        inactive-color="#eee"
        :disabled="form.sqlType == 'enum'"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('filterable') !== -1"
      label="可否搜索"
    >
      <el-switch
        v-model="form.filterable"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('allowcreate') !== -1 && form.filterable"
      label="可否创建选项"
    >
      <el-switch
        v-model="form.allowcreate"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('collapsetags') !== -1 && form.multiple"
      label="选择内容全部展示"
    >
      <el-switch
        v-model="form.collapsetags"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>

    <!-- 开关 -->
    <el-form-item v-if="form.showFrom.indexOf('width') !== -1" label="开关宽度">
      <el-input-number
        :min="40"
        :max="100"
        :step="1"
        v-model="form.width"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('activetext') !== -1"
      label="打开时的文字描述"
    >
      <el-input v-model="form.activetext" size="mini"></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('inactivetext') !== -1"
      label="关闭时的文字描述"
    >
      <el-input v-model="form.inactivetext" size="mini"></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('activecolor') !== -1"
      label="打开时背景色"
    >
      <el-color-picker
        v-model="form.activecolor"
        show-alpha
        size="mini"
      ></el-color-picker>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('inactivecolor') !== -1"
      label="关闭时背景色"
    >
      <el-color-picker
        v-model="form.inactivecolor"
        show-alpha
        size="mini"
      ></el-color-picker>
    </el-form-item>
    <!-- 滑块 -->
    <el-form-item
      v-if="form.showFrom.indexOf('showstops') !== -1"
      label="显示间断"
    >
      <el-switch
        v-model="form.showstops"
        active-color="#409EFF"
        inactive-color="#eee"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('showinput') !== -1"
      label="输入框"
      v-show="!form.range"
    >
      <el-switch
        v-model="form.showinput"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('range') !== -1" label="范围选择">
      <el-switch
        v-model="form.range"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>

    <!-- 时间选择器 固定时间 -->
    <el-form-item
      v-if="form.showFrom.indexOf('pickeroptions') !== -1"
      label="开始时间"
    >
      <el-time-picker
        v-model="form.pickeroptions.start"
        placeholder="开始时间"
        value-format="HH:mm"
        format="HH:mm"
        size="mini"
      >
      </el-time-picker>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('pickeroptions') !== -1"
      label="结束时间"
    >
      <el-time-picker
        v-model="form.pickeroptions.end"
        placeholder="结束时间"
        value-format="HH:mm"
        format="HH:mm"
        size="mini"
      >
      </el-time-picker>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('pickeroptions') !== -1"
      label="步长"
    >
      <el-time-picker
        v-model="form.pickeroptions.step"
        :picker-options="{
          selectableRange: '00:01:00 - 06:00:00',
        }"
        placeholder="步长"
        value-format="HH:mm"
        format="HH:mm"
        size="mini"
      >
      </el-time-picker>
    </el-form-item>

    <!-- 时间选择器 任意时间 -->
    <el-form-item
      v-if="form.showFrom.indexOf('isrange') !== -1"
      label="范围选择"
    >
      <el-switch
        v-model="form.isrange"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('startplaceholder') !== -1 && form.isrange"
      label="开始位置占位符"
    >
      <el-input v-model="form.startplaceholder" size="mini"></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('endplaceholder') !== -1 && form.isrange"
      label="结束位置占位符"
    >
      <el-input v-model="form.endplaceholder" size="mini"></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('rangeseparator') !== -1 && form.isrange"
      label="分隔符"
    >
      <el-input v-model="form.rangeseparator" size="mini"></el-input>
    </el-form-item>

    <!-- 分割线 和 文字 -->
    <el-form-item v-if="form.showFrom.indexOf('text') !== -1" label="文字">
      <el-input v-model="form.text"></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('contentposition') !== -1"
      label="文字位置"
    >
      <el-select
        style="width: 100%"
        v-model="form.contentposition"
        placeholder="请选择"
        size="mini"
      >
        <el-option label="左" value="left"></el-option>
        <el-option label="中" value="center"></el-option>
        <el-option label="右" value="right"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('fontsize') !== -1"
      label="文字大小"
    >
      <el-input-number
        :min="12"
        :max="100"
        :step="1"
        v-model="form.fontsize"
        size="mini"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('textcolor') !== -1"
      label="文字颜色"
    >
      <el-color-picker
        v-model="form.textcolor"
        show-alpha
        size="mini"
      ></el-color-picker>
    </el-form-item>

    <!-- 日期选择 -->
    <el-form-item
      v-if="form.showFrom.indexOf('datetype') !== -1"
      label="选择单位"
    >
      <el-select
        style="width: 100%"
        v-model="form.datetype"
        placeholder="请选择"
        size="mini"
      >
        <el-option label="年月日-单个" value="date"></el-option>
        <el-option label="年周-单个" value="week"></el-option>
        <el-option label="年月-单个" value="month"></el-option>
        <el-option label="年-单个" value="year"></el-option>
        <el-option label="多日期" value="dates"></el-option>
        <el-option label="年月日时分秒-单个" value="datetime"></el-option>
        <el-option label="年月日时分秒-范围" value="datetimerange"></el-option>
        <el-option label="年月日-范围" value="daterange"></el-option>
        <el-option label="年月-范围" value="monthrange"></el-option>
      </el-select>
    </el-form-item>
    <div
      v-if="
        form.datetype == 'datetimerange' ||
        form.datetype == 'daterange' ||
        form.datetype == 'monthrange'
      "
    >
      <el-form-item
        v-if="form.showFrom.indexOf('startplaceholder') !== -1"
        label="开始位置占位符"
      >
        <el-input v-model="form.startplaceholder" size="mini"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.showFrom.indexOf('endplaceholder') !== -1"
        label="结束位置占位符"
      >
        <el-input v-model="form.endplaceholder" size="mini"></el-input>
      </el-form-item>
      <el-form-item
        v-if="form.showFrom.indexOf('rangeseparator') !== -1"
        label="分隔符"
      >
        <el-input v-model="form.rangeseparator" size="mini"></el-input>
      </el-form-item>
    </div>
    <el-form-item
      v-if="form.showFrom.indexOf('startLimit') !== -1"
      label="最早限制"
    >
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'date' ||
            form.datetype == 'dates' ||
            form.datetype == 'daterange')
        "
        v-model="form.startLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="form.type === 'datePicker' && form.datetype == 'week'"
        v-model="form.startLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'month' || form.datetype == 'monthrange')
        "
        v-model="form.startLimit"
        :type="'month'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="form.type === 'datePicker' && form.datetype == 'year'"
        v-model="form.startLimit"
        type="year"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'datetime' || form.datetype == 'datetimerange')
        "
        v-model="form.startLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('endLimit') !== -1"
      label="最晚限制"
    >
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'date' ||
            form.datetype == 'dates' ||
            form.datetype == 'daterange')
        "
        v-model="form.endLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="form.type === 'datePicker' && form.datetype == 'week'"
        v-model="form.endLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'month' || form.datetype == 'monthrange')
        "
        v-model="form.endLimit"
        :type="'month'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <el-date-picker
        style="width: 100%"
        v-if="form.type === 'datePicker' && form.datetype == 'year'"
        v-model="form.endLimit"
        type="year"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
      <!-- :type='"datetime"'  value-format="yyyy-MM-dd HH:mm:ss" -->
      <el-date-picker
        style="width: 100%"
        v-if="
          form.type === 'datePicker' &&
          (form.datetype == 'datetime' || form.datetype == 'datetimerange')
        "
        v-model="form.endLimit"
        :type="'date'"
        :placeholder="form.placeholder"
        :clearable="form.clearable"
        :disabled="form.disabled"
        :prefix-icon="form.prefixicon"
        value-format="yyyy-MM-dd"
        :start-placeholder="form.startplaceholder"
        :end-placeholder="form.endplaceholder"
        :range-separator="form.rangeseparator"
        size="mini"
      >
      </el-date-picker>
    </el-form-item>

    <!-- 单选 -->
    <el-form-item
      v-if="form.showFrom.indexOf('radiotype') !== -1"
      label="展示类型"
    >
      <el-select
        style="width: 100%"
        v-model="form.radiotype"
        placeholder="请选择"
        size="mini"
      >
        <el-option label="圆圈" value="yuan"></el-option>
        <el-option label="按钮" value="button"></el-option>
      </el-select>
    </el-form-item>

    <!-- 多选 -->
    <el-form-item
      v-if="form.showFrom.indexOf('checkboxtype') !== -1"
      label="展示类型"
    >
      <el-select
        style="width: 100%"
        v-model="form.checkboxtype"
        placeholder="请选择"
        size="mini"
      >
        <el-option label="方块" value="fang"></el-option>
        <el-option label="按钮" value="button"></el-option>
      </el-select>
    </el-form-item>

    <!-- options -->
    <el-form-item
      v-if="form.showFrom.indexOf('datatype') !== -1"
      label="数据类型"
    >
      <el-select
        style="width: 100%"
        v-model="form.datatype"
        placeholder="请选择"
        size="mini"
      >
        <el-option label="配置数据" value="option"></el-option>
        <el-option label="接口数据" value="url"></el-option>
        <el-option label="系统字典" value="system"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('url') !== -1 && form.datatype === 'url'"
      label="接口地址"
    >
      <el-input v-model="form.url" size="mini"></el-input>
      <!--  @blur="getUrlData" -->
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('url') !== -1 && form.datatype === 'url'"
      label="显示值"
    >
      <div class="el-input el-input--mini">
        <input
          class="el-input__inner"
          size="mini"
          v-bind:value="form.props.label"
          v-on:input="oninput($event.target.value, 'label')"
        />
      </div>
      <!-- <el-input v-model="form.props.label" size="mini"></el-input> -->
      <!--  @blur="getUrlData" -->
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('url') !== -1 && form.datatype === 'url'"
      label="传递值"
    >
      <div class="el-input el-input--mini">
        <input
          class="el-input__inner"
          size="mini"
          v-bind:value="form.props.value"
          v-on:input="oninput($event.target.value, 'value')"
        />
      </div>
      <!-- <el-input v-model="form.props.value" size="mini"></el-input> -->
      <!--  @blur="getUrlData" -->
    </el-form-item>
    <el-table
      v-if="form.showFrom.indexOf('option') !== -1 && form.datatype == 'option'"
      border
      :data="form.dicData"
      class="tb-edit"
      style="width: 100%"
      highlight-current-row
      size="mini"
    >
      <el-table-column label="显示值">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.label"
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="传递值">
        <template slot-scope="scope">
          <el-input
            v-if="form.type == 'tab'"
            size="mini"
            v-model="scope.row.name"
            placeholder="请输入内容"
          ></el-input>
          <el-input
            v-else
            size="mini"
            v-model="scope.row.value"
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="暂存接口"
        v-if="form.type === 'FormGroup'"
        width="180"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.url"
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="form.sqlType != 'enum'">
        <template slot-scope="scope">
          <div>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="
        form.showFrom.indexOf('option') !== -1 &&
        form.datatype == 'option' &&
        form.sqlType != 'enum'
      "
      size="mini"
      @click="addoption"
      style="margin-top: 10px"
      >增加选项</el-button
    >

    <!-- 表格 -->
    <el-form-item
      v-if="form.showFrom.indexOf('border') !== -1"
      label="是否边框"
    >
      <el-switch
        v-model="form.border"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item v-if="form.showFrom.indexOf('stripe') !== -1" label="斑马纹">
      <el-switch
        v-model="form.stripe"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>

    <!-- 用户组件 -是否允许输入 -->
    <el-form-item
      v-if="form.showFrom.indexOf('allowinput') !== -1"
      label="可否输入"
    >
      <el-switch
        v-model="form.allowinput"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>

    <!-- 地区选择 -->
    <el-form-item
      v-if="form.showFrom.indexOf('emitKey') !== -1"
      label="传递key值"
    >
      <el-select
        style="width: 100%"
        v-model="form.emitKey"
        placeholder="请选择key值"
        size="mini"
      >
        <el-option label="名称" value="name"></el-option>
        <el-option label="代码" value="code"></el-option>
      </el-select>
    </el-form-item>

    <!-- 部门组件 -->
    <el-form-item
      v-if="form.showFrom.indexOf('showalllevels') !== -1"
      label="显示路径"
    >
      <el-switch
        v-model="form.showalllevels"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('emitPath') !== -1"
      label="传递路径"
    >
      <el-switch
        v-model="form.emitPath"
        active-color="#409EFF"
        inactive-color="#eee"
        size="mini"
      ></el-switch>
    </el-form-item>

    <!-- 下拉 来源 系统字典项 -->
    <el-form-item
      v-if="
        form.showFrom.indexOf('datatype') !== -1 && form.datatype == 'system'
      "
      label="选择字典"
    >
      <el-select
        style="width: 100%"
        v-model="form.systemDict"
        placeholder="请选择数据"
        size="mini"
        filterable
      >
        <el-option
          v-for="c in systemDictList"
          :key="c.description + c.uniqId + 'select-dic-item'"
          :label="c.description"
          :value="c.uniqId"
        ></el-option>
      </el-select>
    </el-form-item>

    <!-- 级联选择 -->
    <el-form-item
      v-if="form.showFrom.indexOf('cascaderOption') !== -1"
      label="选择数据"
    >
      <el-select
        style="width: 100%"
        v-model="form.dictName"
        placeholder="请选择数据"
        size="mini"
        filterable
      >
        <el-option
          v-for="c in classifyDictList"
          :key="c.name + 'cascader-item'"
          :label="c.dictName"
          :value="c.uniqueName"
        ></el-option>
      </el-select>
    </el-form-item>

    <!-- 数据源组件 -->
    <el-form-item
      v-if="form.showFrom.indexOf('sourceTable') !== -1 && !databaseName"
      label="数据源"
    >
      <el-select
        style="width: 100%"
        v-model="form.databaseName"
        placeholder="请选择数据源"
        size="mini"
        filterable
      >
        <el-option
          v-for="da in dataSourceOption"
          :key="da.databaseName"
          :label="da.name"
          :value="da.databaseName"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('sourceTable') !== -1"
      label="数据源表"
    >
      <el-select
        style="width: 100%"
        v-model="form.tableName"
        placeholder="请选择数据表"
        size="mini"
        filterable
        @change="scourceTableChangeHandle"
      >
        <el-option
          v-for="(it, index) in tableOption"
          :key="'datasource-item' + index"
          :label="it.tableName"
          :value="it.tableName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('sourceTable') !== -1"
      label="展示信息"
    >
      <el-select
        multiple
        style="width: 100%"
        v-model="form.infoColumn"
        allow-create
        filterable
        size="mini"
        collapse-tags
        clearable
        @change="infoColumnChange"
      >
        <el-option
          v-for="(item, index) in tablesItem"
          :key="index"
          :label="item.fieldName"
          :value="item.fieldName"
        >
          <span style="float: left">{{ item.columnComment }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.fieldName
          }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('sourceTable') !== -1"
      label="显示字段"
    >
      <el-select
        style="width: 100%"
        v-model="form.showProp"
        allow-create
        filterable
        size="mini"
        clearable
      >
        <el-option
          v-for="(item, index) in tablesItem"
          :key="index"
          :label="item.fieldName"
          :value="item.fieldName"
        >
          <span style="float: left">{{ item.columnComment }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.fieldName
          }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.showFrom.indexOf('sourceTable') !== -1"
      label="传递字段"
    >
      <el-select
        style="width: 100%"
        v-model="form.sendProp"
        allow-create
        filterable
        size="mini"
        clearable
      >
        <el-option
          v-for="(item, index) in tablesItem"
          :key="index"
          :label="item.fieldName"
          :value="item.fieldName"
        >
          <span style="float: left">{{ item.columnComment }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.fieldName
          }}</span>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'form-item-setting',
  props: {
    // 组件对象
    form: {
      type: Object,
      default: () => {
        return {
          // 展示字段
          showFrom: [],
          // 校验
          rules: [],
          props: {
            label: '',
            value: ''
          }
        }
      }
    },
    classifyDictList: {
      type: Array
    },
    systemDictList: {
      type: Array
    },
    databaseName: {
      type: String
    },
    tableOption: {
      type: Array
    },
  },
  data() {
    return {}
  },
  methods: {
    // 删除选项
    handleDelete (index) {
      // (this.form.deleteOption && this.form.deleteOption(index)) || (this.form.option.splice(index, 1))
      if(this.form.deleteOption){
        this.form.deleteOption(index)
      }else{

        if(this.form.type == 'tab') {
          this.form.dicData.splice(index, 1)
        }else{
          if(this.form.dicData && this.form.dicData.length > 0) {
            this.form.dicData.splice(index, 1)
          }
          if(this.form.option && this.form.option.length > 0) {
            this.form.option.splice(index, 1)
          }
        }
      }
      // 删除dicData时删除对应的column项
      if(this.form.type === 'tab') {
        let temp = []
        for(let i in this.form.dicData) {
          for(let j in this.form.column) {
            let key = Object.keys(this.form.column[j])[0]
            if(key === this.form.dicData[i].value) {
              temp.push(this.form.column[j])
            }
          }
        }
        this.form.column = temp
      }
    },
    // 数据表切换
    scourceTableChangeHandle (val) {
      this.$set(this.form, 'databaseName', this.databaseName)
      for(let i in this.tableOption) {
        if(this.tableOption[i].tableName == val) {
          this.tablesItem = this.tableOption[i].autoTableFields
        }
      }
    },
    // 添加选项
    addoption () {
      if(this.form.addoption){
        this.form.addoption()
      }else{
        if(this.form.type == 'tab') {
          this.form.dicData.push({label: '新的选择', name: ('newName' + this.form.dicData.length)})
        }else{
          this.form.dicData.push({label: '新的选择', value: ('newValue' + this.form.dicData.length)})
        }
      }
    },
    // 删除选项
    handleDelete (index) {
      // (this.form.deleteOption && this.form.deleteOption(index)) || (this.form.option.splice(index, 1))
      if(this.form.deleteOption){
        this.form.deleteOption(index)
      }else{

        if(this.form.type == 'tab') {
          this.form.dicData.splice(index, 1)
        }else{
          if(this.form.dicData && this.form.dicData.length > 0) {
            this.form.dicData.splice(index, 1)
          }
          if(this.form.option && this.form.option.length > 0) {
            this.form.option.splice(index, 1)
          }
        }
      }
      // 删除dicData时删除对应的column项
      if(this.form.type === 'tab') {
        let temp = []
        for(let i in this.form.dicData) {
          for(let j in this.form.column) {
            let key = Object.keys(this.form.column[j])[0]
            if(key === this.form.dicData[i].value) {
              temp.push(this.form.column[j])
            }
          }
        }
        this.form.column = temp
      }
    },
    // 监听值变化
    oninput (val, attr) {
      if(!this.form.props) {
        this.form.props = {
          label: 'label',
          value: 'value'
        }
      }
      this.form.props[attr] = val
    }
  }
}
</script>
<style lang="scss">
.form-item-setting {
  .el-form-item{
    display: flex;
  }
}
</style>
