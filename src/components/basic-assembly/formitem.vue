<template>
  <div :ref="item.prop" :class="{'jvs-form-item': true, 'jvs-form-item-disabled': item.disabled}" style="display:flex;align-items:center;">
    <!-- 普通文本框 -->
    <el-input
      v-model="forms[item.prop]"
      v-if='(item.type==="input" || !item.type) && !item.searchable && getDisableexpress("show")'
      :show-word-limit="item.showwordlimit"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :show-password="item.showpassword"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      :suffix-icon="item.suffixicon"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @focus="beforeValue = forms[item.prop]"
      @blur="formChange"
    >
      <template v-if='item.prepend' slot="prepend">{{item.prepend}}</template>
      <template v-if='item.append' slot="append">{{item.append}}</template>
    </el-input>
    <span
      v-if='(item.type==="input" || !item.type) && !item.searchable && !getDisableexpress("show")'
      :style="'padding: 0px 10px;border-radius: 5px;'+
      (getDisableexpress('color') ? ('color:' + getDisableexpress('color') + ';') : '') +
      (getDisableexpress('bgcolor') ? ('background-color:' + getDisableexpress('bgcolor') + ';') : '') +';'">{{forms[item.prop]}}</span>
    <!-- 搜索文本框 -->
    <el-input v-if='(item.type==="input" || !item.type) && item.searchable' disabled v-model="forms[item.prop]" placeholder="搜索选择所需数据" class="show-disable">
      <template slot="append" v-if="!item.disabled">
        <jvs-button icon="el-icon-search" type="info" @click="openDialog"></jvs-button>
        <jvs-button icon="el-icon-delete" type="warning" @click="clearSearch"></jvs-button>
      </template>
    </el-input>
    <span class="el-form-item__error" v-if='errorShow'>{{item.regularMessage}}</span>
    <el-input
      v-model="forms[item.prop]"
      v-if='item.type==="InputReadOnly" || item.type==="inputReadOnly"'
      :disabled="item.disabled || true"
      :placeholder="item.placeholder || item.label"
      :size="$store.state.params.form.size || item.size || 'mini'"
    ></el-input>
    <el-input
      type="textarea"
      v-if='item.type==="textarea"'
      v-model="forms[item.prop]"
      :rows="item.rows"
      :show-word-limit="item.showwordlimit"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :size="$store.state.params.form.size || item.size || 'mini'"
      :autosize="item.autoSize || false"
      @focus="beforeValue = forms[item.prop]"
      @blur="formChange"
    ></el-input>
    <el-input
      type="textarea"
      v-if='item.type==="textareaReadOnly"'
      v-model="forms[item.prop]"
      rows="2"
      :placeholder="item.placeholder || item.label"
      :disabled="item.disabled || true"
      :size="$store.state.params.form.size || item.size || 'mini'"
    ></el-input>
    <el-input-number
      v-if='item.type==="inputNumber"'
      v-model="forms[item.prop]"
      :min="item.min"
      :max="item.max"
      :step="item.step"
      :step-strictly="item.stepstrictly"
      :precision="item.precision"
      :disabled="item.disabled"
      :controls-position="item.controlsposition"
      :placeholder="item.placeholder || item.label"
      :size="$store.state.params.form.size || item.size || 'mini'"
      :class="{'input-number-hide': [undefined, null].indexOf(forms[item.prop]) > -1, 'show-thoudsandth-number': (item.thoudsandthable && showThoudsandth)}"
      @change="formChange"
      @focus="showThoudsandthHandle(false); beforeValue = forms[item.prop];"
      @blur="showThoudsandthHandle(true)"
    ></el-input-number>
    <span v-if='item.type==="inputNumber" && item.thoudsandthable && showThoudsandth' :class="{'input-number-Thousandth': true, 'input-number-Thousandth-disabled': item.disabled}" @click="showThoudsandthHandle(false)">{{getThousandthNumber(forms[item.prop])}}</span>
    <span v-if='item.type==="inputNumber" && item.disabled && !item.thoudsandthable' class="input-number-textcon">{{( (forms[item.prop] != null && forms[item.prop] != undefined && forms[item.prop] != '') || forms[item.prop] == 0 ) ? forms[item.prop] : (item.unit ? '' : '-')}}</span>

    <el-select
      v-if='item.type==="select"'
      v-model="forms[item.prop]"
      :placeholder="item.placeholder || item.label"
      :multiple="item.multiple"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :clearable="item.clearable === false ? false : true"
      :filterable="item.filterable"
      :allow-create="item.allowcreate"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <el-option
        v-for="(sitem) in selectOption"
        :key="sitem[(item.props && item.props.value) || 'value']+item.prop +Math.random() + Date.now().toString()"
        :label="sitem[(item.props && item.props.label) || 'label']"
        :value="sitem[(item.props && item.props.value) || 'value']"
      >
        <span style="float: left">{{ sitem[(item.props && item.props.label) || 'label'] }}</span>
        <span v-if="item.props && item.props.secTitle && sitem[item.props.secTitle]" style="float: right; color: #8492a6; font-size: 13px">{{ sitem[item.props.secTitle] }}</span>
        <span v-if="sitem.tip" style="float: right; color: #8492a6; font-size: 13px">{{ sitem.tip }}</span>
      </el-option>
    </el-select>

    <el-switch
      v-if='item.type==="switch"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :active-text="item.activetext"
      :inactive-text="item.inactivetext"
      :active-color="item.activecolor"
      :inactive-color="item.inactivecolor"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-switch>

    <el-slider
      v-if='item.type==="slider"'
      v-model="forms[item.prop]"
      :min="item.min"
      :max="item.max"
      :disabled="item.disabled"
      :step="item.step"
      :show-stops="item.showstops"
      :show-input="item.showinput"
      :range="item.range"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-slider>

    <el-time-select
      v-if='item.type==="timeSelect"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :picker-options="item.pickeroptions"
      :placeholder="item.placeholder || item.label"
      :prefix-icon="item.prefixicon"
      value-format="HH:mm:ss"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-time-select>

    <el-time-picker
      v-if='item.type==="timePicker"'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :clearable="item.clearable"
      :placeholder="item.placeholder || item.label"
      :prefix-icon="item.prefixicon"
      :is-range="item.isrange"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      value-format="HH:mm:ss"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-time-picker>

    <el-date-picker
      v-if='(item.type==="datePicker") && ( item.datetype=="date" || item.datetype=="dates" || item.datetype=="daterange")'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM-dd"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && item.datetype=="week"'
      v-model="forms[item.prop]"
      type="week"
      format="yyyy 第 WW 周"
      value-format="yyyy-MM-dd"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker")&& ( item.datetype=="month"|| item.datetype=="monthrange" )'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && item.datetype=="year"'
      v-model="forms[item.prop]"
      type="year"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>
    <el-date-picker
      v-if='(item.type==="datePicker") && (item.datetype=="datetime" || item.datetype=="datetimerange")'
      v-model="forms[item.prop]"
      :type="item.datetype"
      :placeholder="item.placeholder || item.label"
      :clearable="item.clearable"
      :disabled="item.disabled"
      :prefix-icon="item.prefixicon"
      value-format="yyyy-MM-dd HH:mm:ss"
      :start-placeholder="item.startplaceholder"
      :end-placeholder="item.endplaceholder"
      :range-separator="item.rangeseparator"
      :picker-options="startEndLimitHandle"
      :default-value="item.defaultValue"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    ></el-date-picker>

    <el-radio-group
      v-if='(item.type==="radio")'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <div v-if='item.radiotype==="yuan" || !item.radiotype'>
        <el-radio
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value']+item2[(item.props && item.props.label) || 'label']+'yuan'"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-radio>
      </div>
      <div v-if='item.radiotype==="button"'>
        <el-radio-button
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value'] + item2[(item.props && item.props.label) || 'label'] +'but'"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-radio-button>
      </div>
    </el-radio-group>

    <el-checkbox-group
      v-if='(item.type==="checkbox") && forms[item.prop]'
      v-model="forms[item.prop]"
      :disabled="item.disabled"
      :border="item.border"
      :min="item.min"
      :max="item.max"
      :size="$store.state.params.form.size || item.size || 'mini'"
      @change="formChange"
    >
      <div v-if='(item.checkboxtype=== "fang" || !item.checkboxtype) && selectOption && selectOption.length > 0'>
        <el-checkbox
          v-for="(item2) in selectOption"
          :key="item2[(item.props && item.props.value) || 'value']+item.label"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-checkbox>
      </div>
      <div v-if='item.checkboxtype=== "button" && selectOption && selectOption.length > 0'>
        <el-checkbox-button
          v-for="(item2) in selectOption"
          :key="'checkbut'+item2[(item.props && item.props.value) || 'value']+item.label"
          :label="item2[(item.props && item.props.value) || 'value']"
        >{{item2[(item.props && item.props.label) || 'label']}}</el-checkbox-button>
      </div>
    </el-checkbox-group>

    <!-- 颜色选择器 -->
    <el-color-picker v-if="(item.type == 'colorSelect')" v-model="forms[item.prop]" :placeholder="item.placeholder || item.label" :predefine="predefineColors" @change="formChange"></el-color-picker>

    <!-- 图片 -->
    <ul
      class="el-upload-list el-upload-list--picture-card"
      v-if='item.type==="image" && forms[item.prop] && forms[item.prop].length > 0'
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-success"
        v-for="mi in forms[item.prop]"
        :key="'image'+mi.url"
        @click="handlePictureCardPreview(mi.url)"
      >
        <el-image style="width: 100%; height: 100%;" :src="mi.url" :fit="item.fit || 'contain'">
          <div slot="error" class="image-slot loading-back" style="position:absolute;">
            <i class="el-icon-loading" style="font-size: 24px;color:#999;"></i>
          </div>
        </el-image>
      </li>
      <li
        tabindex="0"
        class="el-upload-list__item"
        v-if='!forms[item.prop] || forms[item.prop].length==0'
      >
        <el-image style="width: 100%; height: 100%;" src :fit="item.fit || 'contain'">
          <div slot="error" class="image-slot loading-back" style="position:absolute;">
            <i class="el-icon-loading" style="font-size: 24px;color:#999;"></i>
          </div>
        </el-image>
      </li>
    </ul>
    <!-- 没有图片 -->
    <span v-if='item.type==="image" && (!forms[item.prop] || forms[item.prop].length==0)'>无</span>

    <!-- 上传图片 -->
    <el-upload
      v-if='(item.type === "imageUpload")'
      :class="((item.parent && item.parent.type == 'tableForm') ? (tableFileList[tableRowAIndex] && tableFileList[tableRowAIndex].length || 0) : item.fileList.length) < (item.limit ? item.limit : 5) ? 'form-list-upload-img' : 'form-list-upload-img-none'"
      :ref="'uploadImageBtn'+'_'+item.prop"
      :action="item.action || (item.uploadHttp && item.uploadHttp.url) || ''"
      :multiple="item.multipleUpload"
      :limit="item.limit || 5"
      :headers="item.headers || {}"
      :file-list="(item.parent && item.parent.type == 'tableForm') ? tableFileList[tableRowAIndex] : item.fileList"
      :size="$store.state.params.form.size || item.size || 'mini'"
      list-type="picture-card"
      :data="formatUploadData(item)"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
      :auto-upload="true"
      :disabled="item.disabled"
      :on-success="handleSuccess"
      :on-error="item.handleError"
      :on-preview="handlePictureCardPreviewUpload"
      :on-remove="handleRemove"
      :on-change="uploadChangeHandle"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
      <div v-if="imageValidate" slot="tip" class="el-upload__tip" style="color: #F56C6C;font-size: 12px;">只能上传图片，且不超过20M</div>
    </el-upload>

    <!-- 预览图片 -->
    <el-dialog
      v-if='item.type === "imageUpload" || item.type === "image"'
      class="preViewDialog"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 上传文件 -->
    <el-upload
      v-if='item.type === "fileUpload"'
      :class="((item.parent && item.parent.type == 'tableForm') ? (tableFileList[tableRowAIndex] && tableFileList[tableRowAIndex].length || 0) : item.fileList.length) < (item.limit ? item.limit : 5) ? 'form-list-upload-file' : 'form-list-upload-file-none'"
      :ref="'uploadFileBtn'+'_'+item.prop"
      :action="item.action || (item.uploadHttp && item.uploadHttp.url) || ''"
      :multiple="item.multipleUpload"
      :limit="item.limit"
      :headers="item.headers"
      :file-list="(item.parent && item.parent.type == 'tableForm') ? ((tableFileList[tableRowAIndex] && tableFileList[tableRowAIndex].length > 0) ? tableFileList[tableRowAIndex] : item.fileList) : item.fileList"
      :size="$store.state.params.form.size || item.size || 'mini'"
      :data="formatUploadData(item)"
      :auto-upload="true"
      :disabled="item.disabled"
      :on-success="handleSuccess"
      :on-error="item.handleError"
      :on-remove="handleRemove"
      :on-change="uploadChangeHandle"
      :before-upload="beforeUpload"
      :on-preview="handleFilePreviewUpload"
    >
      <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
      <div v-if="fileValidate" slot="tip" class="el-upload__tip" style="color: #F56C6C;font-size: 12px;">文件大小不超过20M</div>
    </el-upload>

    <!-- 文件列表 -->
    <ul class="el-upload-list el-upload-list--text" v-if="item.type==='file' && forms[item.prop] && forms[item.prop].length > 0">
      <li
        class="el-upload-list__item is-success"
        v-for="fi in forms[item.prop]"
        :key="'file'+fi.url"
      >
        <a
          class="el-upload-list__item-name"
          target="_blank"
          :href="fi.url?fi.url:'javascript:void(0)'"
        >
          <i class="el-icon-document"></i>
          {{fi.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close"></i>
      </li>
      <!-- <li class="el-upload-list__item" v-if='!forms[item.prop] || forms[item.prop].length==0'>
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{'文件名称'}}
        </a>
      </li> -->
    </ul>
    <span v-if="item.type==='file' && (!forms[item.prop] || forms[item.prop].length==0)">无</span>

    <!-- 选项卡 -->
    <jvs-tab
      style="width: 100%;"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :formRef="formRef"
      v-if="item.type=='tab'"
      :active="item.activeName"
      :formItem="item"
      :forms="forms[item.prop]"
      :option="{type:'card', column: item.dicData}"
      :roleOption="roleOption"
      :userList="userList"
      :departmentList="departmentList"
      :postList="postList"
      :resetRadom="resetRadom"
      :originForm="forms"
      :designId="designId"
      :changeRandom="changeRandom"
      :changeDomItem="changeDomItem"
      :isView="isView"
      :dataModelId="dataModelId"
      :execsList="execsList"
      :jvsAppId="jvsAppId"
      @reInitData="reInitData"
      @tab-click="tabClick"
      @formChange="tabFormchange">
    </jvs-tab>

    <!-- 展示的表格 -->
    <!-- <el-table
      v-if="item.type==='TableReadOnly' || item.type==='tableReadOnly'"
      :data="forms[item.prop]"
      :border="item.border"
      highlight-current-row
      class="tb-edit"
      align="center"
      style="width: 100%;cursor:pointer;"
    >
      <el-table-column
        v-for="(ti) in item.option"
        :key="''+ti.value+'table'"
        :prop="ti.value"
        :label="ti.label"
        style="text-align:center;"
      ></el-table-column>
    </el-table> -->

    <!-- 描述框 -->
    <div
      v-if="item.type==='box'"
      :style="'width:100%;padding:0 16px;border-radius:4px;text-align:'+item.contentposition+';font-size:'+item.fontsize+'px;color:'+item.textcolor+';font-weight:'+item.fontweight+';background-color:'+(item.boxback?item.boxback:'none')+';'"
    >
      {{forms[item.prop]}}
      <span v-if='!forms[item.prop]' v-html="getHtmlText(item.text)"></span>
    </div>
    <!-- 链接 -->
    <a
      v-if="item.type =='link'"
      :href="forms[item.prop]?forms[item.prop]:'javascript:void(0);'"
      :target="item.openType"
      :style="'height: 32px;line-height:28px;text-align:'+item.contentposition+';font-size:'+item.fontsize+'px;color:'+item.textcolor+';font-weight:'+item.fontweight+';text-decoration:'+item.textdecoration+';'"
    >{{item.text}}</a>
    <!-- 嵌入页面 -->
    <div v-if="item.type==='iframe'" :style="'width:100%;height:'+item.iframeheight+'px;background:#ecf5ff;'">
      <iframe
        :name="item.id"
        :id="item.prop"
        :src="item.iframeurl"
        frameborder="0"
        width="100%"
        height="100%"
        scrolling="scroll"
      ></iframe>
    </div>

    <!-- 图标选择器 -->
     <div class="form-item-icon-selct" style="position: relative;" v-if="item.type == 'iconSelect'" :id="'icon-select-item-'+item.prop">
       <el-popover
          placement="bottom"
          :width="iconToolWidth"
          v-if="!item.disabled"
          trigger="click">
          <div v-if="item.iconType == 'svg'" class="icon-select-tool">
            <svg v-for="(it, itx) in iconList" :key="itx+it" @click="checkIcon(item.prop, it)" class="icon" aria-hidden="true">
              <use :xlink:href="'#'+it"></use>
            </svg>
          </div>
          <div v-else class="icon-select-tool">
            <i v-for="(it, itx) in iconList" :key="itx+it" :class="it" @click="checkIcon(item.prop, it)"></i>
          </div>
          <div slot="reference" style="display:flex;align-items: center;">
            <el-input v-model="forms[item.prop]" placeholder="图标" :disabled="item.disabled"></el-input>
            <svg v-if="forms[item.prop] && item.iconType == 'svg'" class="icon" aria-hidden="true" style="margin-left:10px;width: 20px;height: 20px;">
              <use :xlink:href="'#'+forms[item.prop]"></use>
            </svg>
            <i v-if="forms[item.prop] && item.iconType != 'svg'" :class="forms[item.prop]" style="margin-left:10px;"></i>
          </div>
        </el-popover>
        <div v-else style="display:flex;align-items: center;">
          <el-input v-model="forms[item.prop]" placeholder="图标" :disabled="item.disabled"></el-input>
          <i v-if="forms[item.prop] && item.iconType != 'svg'" :class="forms[item.prop]" style="margin-left:10px;"></i>
          <svg v-if="forms[item.prop] && item.iconType == 'svg'" class="icon" aria-hidden="true" style="margin-left:10px;width: 20px;height: 20px;">
            <use :xlink:href="'#'+forms[item.prop]"></use>
          </svg>
        </div>
      </div>

    <!-- p文字 -->
    <p v-if="item.type === 'p'" class="form-item-p" :style="`text-align:${item.contentposition};font-size:${item.fontsize}px;color:${item.textcolor};margin:0;`">
      <span>
        <i></i>
        <b>{{item.text}}</b>
      </span>
    </p>

    <!-- 分割线 -->
    <el-divider v-if="item.type === 'divider'" :content-position='item.contentposition'>{{item.text}}</el-divider>

    <!-- 流水号 -->
   <!-- <div
     v-if="item.type==='serialNumber' && forms[item.prop]"
     :style="'width:100%;padding:0 16px;border-radius:4px;'"
   >
     {{forms[item.prop]}}
     <span v-if='!forms[item.prop]'>&#45;&#45;</span>
   </div> -->
    <el-input v-if="item.type==='serialNumber'" disabled v-model="forms[item.prop]" placeholder="根据流水号规则自动生成" class="show-disable"></el-input>

    <el-input v-if="item.type==='positionMap'" disabled v-model="forms[item.prop]" placeholder="请用移动端打开页面获取位置信息" class="show-disable"></el-input>

    <!-- 用户组件 -->
    <userForm
      v-if="['user', 'role', 'department', 'group', 'job'].indexOf(item.type) > -1"
      :form="forms"
      :prop="item.prop"
      :selectable="item.multiple"
      :defaultValue="item.defaultValue"
      :enableinput="item.allowinput"
      :disabled="item.disabled"
      :deptable="item.deptable"
      :infoable="item.infoable"
      :props="item.props ? item.props : {'label': (item.prop+'_1'), 'value': item.prop}"
      :type="item.type"
      :resetRadom="resetRadom"
      :userAllList="userList"
      :departmentList="departmentList"
      :roleOption="roleOption"
      :postList="postList"
      @change="formChange" /> <!-- @formChange="tabFormchange" -->
    <!-- 部门组件 -->
    <el-cascader
      v-if="false && item.type==='department'"
      v-model="forms[item.prop]"
      size="mini"
      :options="departmentList"
      clearable
      :show-all-levels="item.showalllevels"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :props="{
        expandTrigger: 'hover',
        multiple: item.multiple === false ? item.multiple : true,
        children: 'childList',
        label: 'name',
        value: 'id',
        emitPath: item.emitPath
      }"
      @change="formChange"
    >
    </el-cascader>
    <!-- 角色组件 -->
    <el-select v-model="forms[item.prop]" filterable placeholder="请选择角色" :disabled="item.disabled" v-if="false && item.type==='role'" :multiple='item.multiple' @change="changeHandle">
      <el-option
        v-for="ir in roleOption"
        :key="ir.id+'role'+ir.roleName"
        :label="ir.roleName"
        :value="ir.id">
      </el-option>
    </el-select>
    <!-- 岗位组件 -->
    <el-select v-model="forms[item.prop]" filterable placeholder="请选择岗位" v-if="false && item.type==='job'"
      :multiple='item.multiple' :disabled="item.disabled" @change="changeHandle">
      <el-option
        v-for="ir in postList"
        :key="ir.id+'job'+ir.name"
        :label="ir.name"
        :value="ir.id">
      </el-option>
    </el-select>

    <!-- 可编辑表格 -->
    <div v-if="item.type == 'tableForm'" style="flex:1;width:100%;">
      <tableForm :formRef="formRef" :item="item" :option="tableFormOption"
        :data="forms[item.prop]" :originOption="originOption"
        :defalutSet="defalutSet" :rowData="rowData"
        :roleOption="roleOption"
        :userList="userList"
        :departmentList="departmentList"
        :postList="postList"
        :resetRadom="resetRadom"
        :designId="designId"
        :forms="forms"
        :dataModelId="dataModelId"
        :changeRandom="changeRandom"
        :changeDomItem="changeDomItem"
        :isView="isView"
        :execsList="execsList"
        :jvsAppId="jvsAppId"
        @reInitData="reInitData"
        @setTable="setTableHandle">
        <template slot="menuBtn" slot-scope="scope">
          <jvs-button v-if="item.editable && item.delBtn" type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
        </template>
      </tableForm>
      <el-row style="margin-top:10px;" v-if="item.editable && item.addBtn">
        <jvs-button size="mini" @click="addRowHandle">新增</jvs-button>
      </el-row>
    </div>

    <!-- 计数器   滑块   显示单位 -->
    <span v-if="['inputNumber', 'slider'].indexOf(item.type) > -1 && item.unit" class="unit-item-empty-span" style="padding-left: 5px;">{{(item.disabled && (!forms[item.prop] && forms[item.prop] !== 0)) ? '-  ' : ''}}</span>
    <span v-if="['inputNumber', 'slider'].indexOf(item.type) > -1 && item.unit">{{item.unit.trim()}}</span>

    <!-- 地区选择 -->
    <el-cascader
      v-if="item.type==='chinaArea'"
      v-model="forms[item.prop]"
      size="mini"
      :options="chinaAreaList"
      clearable
      :show-all-levels="item.showalllevels"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :props="{
        expandTrigger: 'hover',
        multiple: item.multiple === false ? item.multiple : true,
        label: 'name',
        value: item.emitKey ? item.emitKey : 'code',
        emitPath: item.emitPath
      }"
      @change="formChange"
    >
    </el-cascader>

    <!-- 富文本 -->
    <div v-if="item.type === 'htmlEditor'" :id="item.prop+'-editor'" style="z-index: 1000;width:100%;"></div>

    <!-- 按钮 -->
    <jvs-button v-if="item.type === 'button'" :disabled="item.disabled" :type="item.buttonType" :round="item.buttonRound" :size="item.size" @click="btnClick">{{item.text}}</jvs-button>

    <!-- 级联选择 -->
    <el-cascader
      v-if="item.type==='cascader'"
      v-model="forms[item.prop]"
      size="mini"
      :options="cascaderList"
      clearable
      :show-all-levels="item.showalllevels"
      :collapse-tags="!item.collapsetags"
      :disabled="item.disabled"
      :props="{
        expandTrigger: 'hover',
        multiple: item.multiple === false ? item.multiple : true,
        label: 'name',
        value: item.emitKey ? item.emitKey : 'value',
        emitPath: item.emitPath
      }"
      @change="formChange"
    >
    </el-cascader>

    <!-- 步骤条 -->
    <stepBar
      :formRef="formRef"
      v-if="item.type=='step'"
      :active="item.activeName"
      :formItem="item"
      :forms="forms[item.prop]"
      :option="{column: item.dicData}"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :roleOption="roleOption"
      :userList="userList"
      :departmentList="departmentList"
      :postList="postList"
      :rowData="rowData"
      :resetRadom="resetRadom"
      :originForm="forms"
      :designId="designId"
      :changeRandom="changeRandom"
      :changeDomItem="changeDomItem"
      :isView="isView"
      :dataModelId="dataModelId"
      :execsList="execsList"
      :jvsAppId="jvsAppId"
      @reInitData="reInitData"
      @formChange="tabFormchange">
    </stepBar>

    <!-- 表单卡片 -->
    <formCard
      v-if="item.type == 'formbox'"
      :formItem="item"
      :forms="forms[item.prop]"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :roleOption="roleOption"
      :userList="userList"
      :departmentList="departmentList"
      :postList="postList"
      :resetRadom="resetRadom"
      :designId="designId"
      :execsList="execsList"
      :jvsAppId="jvsAppId"
      @formChange="tabFormchange"
      >
    </formCard>

    <!-- 静态表格  报表类 -->
    <reportTable
      v-if="item.type == 'reportTable'"
      :formItem="item"
      :forms="forms[item.prop]"
      :originOption="originOption"
      :defalutSet="defalutSet"
      :roleOption="roleOption"
      :userList="userList"
      :departmentList="departmentList"
      :postList="postList"
      :resetRadom="resetRadom"
      :designId="designId"
      :execsList="execsList"
      :jvsAppId="jvsAppId"
      @formChange="tabFormchange"
    ></reportTable>

    <!-- 时间线 -->
    <el-timeline v-if="item.type == 'timeline' && forms[item.prop]" style="max-height: 300px; overflow: hidden; overflow-y: auto;">
      <el-timeline-item
        v-for="(activity, index) in forms[item.prop]"
        :key="item.prop + 'timeline-' + index"
        :timestamp="activity[item.timestamp || 'timestamp']">
        <div v-html="activity[item.content || 'content']"></div>
      </el-timeline-item>
    </el-timeline>

    <!-- 子表单 -->
    <childrenForm
      v-if="item.type == 'childrenForm'"
      :formItem="item"
      :originOption="originOption"
      :forms="forms[item.prop]"
      :resetRadom="resetRadom"
      :designId="designId"
      @formChange="tabFormchange"
    ></childrenForm>

    <!-- 关联表单 -->
    <childrenForm
      v-if="item.type == 'connectForm'"
      :formItem="item"
      :selectOption="selectOption"
      :originOption="originOption"
      :forms="forms[item.prop]"
      :resetRadom="resetRadom"
      :designId="designId"
      @formChange="formChange"
    ></childrenForm>

    <!-- 右侧提示 -->
    <el-tooltip v-if="item.tips && item.tips.position == 'right' && item.tips.text" class="form-item-tooltip" effect="dark" :content="item.tips.text" placement="top">
      <i class="el-icon-question"></i>
    </el-tooltip>

    <!-- 后置插槽 -->
    <slot v-if="item.appendSlot" :name="item.prop+'AppendItem'"></slot>

    <!-- 搜索弹框 -->
    <el-dialog
      :title="item.label"
      :visible.sync="searchVisible"
      append-to-body
      :before-close="searchClose">
      <div v-if="searchVisible" class="table-show search-form-item-table">
        <jvs-table
          :option="searchOption"
          :data="searchData"
          :index="true"
          :page="page"
          :loading="searchLoading"
          @on-load="getListData"
          @current-change="handleCurrentChange"
          @row-click="rowClick">
          <!-- 查询条件 -->
          <template slot="headerTop">
            <jvs-form class="search-form" v-if="searchOption.column.length > 0" :option="searchOption" :formData="queryParams" @submit="queryHandle" @reset="resetQueryHandle" :isSearch="true" :designId="$route.query.id || ''">
              <template v-for="sitem in queryBeforeSlot" :slot="sitem.prop+'Before'">
                <el-select v-model="queryOprator[sitem.prop]" placeholder="请选择" :key="sitem.prop+'-before-search'" class="bofore-append" size="mini">
                  <el-option v-for="op in sitem.list" :key="sitem.prop+'-option-item-'+op.value" :label="op.label" :value="op.value"></el-option>
                </el-select>
              </template>
            </jvs-form>
          </template>
        </jvs-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userForm from './userForm'
import iconList from '@/const/iconfont'
import entryIcon from '@/const/entryIcon'
import tableForm from '@/components/basic-assembly/tableForm'
import systemIcon from '@/const/systemIcon'
import stepBar from './stepBar'
import formCard from './formcard'
import reportTable from './reportTable'
import childrenForm from './childrenForm.vue'
import {ruleRun} from "@/api/common";
// import {getSelectData, getFetchTable, getLineDataOfGet, getFormReviewData} from '../api/tableDesignsenior'
import {getSelectData} from '@/api/index'
import {areaList} from '@/const/chinaArea.js'
import {getClassifyDictTree, getSystemDictItems} from '@/api/newDesign'
import E from 'wangeditor'
import { getModelAllFields } from '@/components/template/api'
export default {
  name: "formitem",
  components: {
    userForm,
    tableForm,
    stepBar,
    formCard,
    reportTable,
    childrenForm
  },
  props: {
    // 表单对象
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单内的组件对象
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    originOption: {
      type: Object
    },
    defalutSet: {
      type: Object
    },
    formRef: {
      type: String,
      default: 'ruleForm'
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
    // 是否需要刷新组件
    freshBoolean: {
      type: Boolean
    },
    // 是否需要重新初始化
    reinitFlag: {
      type: Number
    },
    // 表格行数据
    rowData: {
      type: Object
    },
    resetRadom: {
      type: Number
    },
    tableRowAIndex: {
      type: Number
    },
    designId: {
      type: String
    },
    dataModelId: {
      type: String
    },
    changeRandom: {
      type: Number
    },
    changeDomItem: {
      type: Object
    },
    isView: {
      type: Boolean
    },
    disabledControl: {
      type: Boolean
    },
    execsList: {
      type: Array
    },
    jvsAppId:  {
      type: String
    },
    originForm: {
      type: Object
    },
    parentDomWidth: {
      type: Number,
      default: ()=> {
        return 0
      }
    }
  },
  computed: {
    forms () {
      return this.form
    },
    tableFormOption: {
      get () {
        let obj = {
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
          page: false,
          border: this.item.border,
          align: this.item.align || 'left',
          menuAlign: this.item.menuAlign || 'left',
          cancal: false,
          showOverflow: true,
          hideTop: this.item.hideTop || false,
          tableColumn: this.item.tableColumn
        }
        return obj
      },
      set () {}
    }
  },
  data () {
    return {
      selectOption: [],
      startEndLimitHandle: {
        disabledDate: time => {
          let bool=false
          if (!this.item.startLimit) {
            let end=new Date(this.item.endLimit).getTime()
            if (time.getTime()<=end) {
              bool=false
            } else {
              bool=true
            }
          }
          if (!this.item.endLimit) {
            let start=new Date(this.item.startLimit).getTime()
            if (time.getTime()>=start-8.64e7) {
              bool=false
            } else {
              bool=true
            }
          }
          if (!this.item.startLimit&&!this.item.endLimit) {
            bool=false
          }
          if (this.item.startLimit&&this.item.endLimit) {
            let start=new Date(this.item.startLimit).getTime()
            let end=new Date(this.item.endLimit).getTime()
            if (time.getTime()>=start-8.64e7&&time.getTime()<=end) {
              bool=false
            } else {
              bool=true
            }
          }
          return bool
        }
      },
      errorShow: false, // 自定义验证提示错误
      dialogVisible: false, // 预览图片弹框
      dialogImageUrl: '', // 预览图片地址
      iconList: this.item.iconType == 'svg' ? [...entryIcon] : [...iconList, ...systemIcon], // 图标列表
      chinaAreaList: areaList,
      cascaderList: [], // 级联选择数据
      editor: null, // 富文本
      pathArr: [], // 路径结果
      imageValidate: false,
      fileValidate: false,
      eventList: ['button', 'input', 'textarea', 'inputNumber', 'select', 'slider', 'switch', 'datePicker', 'timeSelect', 'timePicker',
      'radio', 'checkbox', 'imageUpload', 'fileUpload', 'htmlEditor', 'cascader', 'datasource', 'chinaArea', 'department', 'role', 'user', 'job'],
      initHtml: '', // 记录富文本初始值
      iconToolWidth: 400, // 图标组件工具栏宽
      tableFileList: [ [] ],
      searchVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 50, 100, 200, 500, 1000], // 分页大小
      },
      searchLoading: false,
      queryParams: {},
      searchData: [],
      searchOption: {
        page: true,
        search: true,
        menu: false,
        addBtn: false,
        isSearch: true,
        submitBtnText: '查询',
        labelWidth: 'auto',
        column: []
      },
      queryBeforeSlot: [],
      queryOprator: {},
      showThoudsandth: true,
      predefineColors: [
        '#ffd700',
        '#ff8c00',
        '#ff4500',
        '#c71585',
        '#FF99CC',
        '#FF6666',
        '#CCCCFF',
        '#CCCCCC',
        '#99CCFF',
        '#99CC99',
        '#90ee90',
        '#66CC66',
        '#669933',
        '#663366',
        '#490954',
        '#3471ff',
        '#333300',
        '#1e90ff',
        '#00ced1',
        '#003399'
      ],
      beforeValue: null
    };
  },
  methods: {
    changeHandle (val) {
      this.$set(this.item, 'currVal', val)
      this.$set(this.forms, this.item.prop, val)
      this.formChange()
      this.$forceUpdate()
    },
    uploadChangeHandle (file, fileList) {
      // console.log('upload change.....')
      // console.log(fileList)
      this.$forceUpdate()
      let obj={}
      obj[this.item.prop]=fileList
      this.$emit('currentValueHandle', obj)
    },
    beforeUpload (file) {
      if(file.size > 20971520) {
        if(this.item.type == 'imageUpload') {
          this.imageValidate = true
        }else{
          this.fileValidate = true
        }
        return false
      }else{
        if(this.item.type == 'imageUpload') {
          this.imageValidate = false
        }else{
          this.fileValidate = false
        }
      }
    },
    async initItem () {
      if(!this.item.disabled) {
        if(this.item.disabledControl == true) {
          this.item.disabled = true
        }
      }
      // 图标选择器
      if(this.item.type == 'iconSelect') {
        this.item.iconType = 'svg'
        this.iconList = this.$store.state.iconLib.iconList ? [...this.$store.state.iconLib.iconList] : [...entryIcon]
        // if(this.item.iconType == 'svg') {
        //   this.iconList = [...entryIcon]
        // }else{
        //   this.iconList = [...iconList, ...systemIcon]
        // }
      }
      if (!this.item.dicUrl && !this.item.url) {
        if (this.item.dicData) {
          this.selectOption=this.item.dicData
        }
      } else {
        if(!this.isView) {
          this.getSelectUrlData()
        }
      }
      // 系统字典
      if(this.item.datatype == 'system' && ['select', 'radio', 'checkbox'].indexOf(this.item.type) > -1 && this.item.systemDict) {
        this.selectOption = []
        await getSystemDictItems(this.item.systemDict).then(res => {
          if(res.data.code == 0 && res.data.data) {
            this.selectOption = res.data.data
          }
        })
      }
      if(['checkbox', 'formbox'].indexOf(this.item.type) > -1) {
        !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, []))
      }
      // 下拉切换是否多选时，初始化数据类型
      if(this.item.type == 'select') {
        if(this.item.multiple) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, []))
        }else{
          if((!this.forms[this.item.prop] && this.forms[this.item.prop] !== 0 && this.forms[this.item.prop] !== false) || this.forms[this.item.prop] instanceof Array) {
            this.$set(this.forms, this.item.prop, "")
          }
        }
      }
      // 滑块
      if(this.item.type == 'slider') {
        if(this.item.range) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, [0, this.item.max / 2]))
        }else{
          if(!this.forms[this.item.prop] || this.forms[this.item.prop] instanceof Array) {
            this.$set(this.forms, this.item.prop, 0)
          }
        }
      }
      // 表单项默认值填充，权重小于表单初始化值
      if(this.item.defaultValue || this.item.defaultValue === false || this.item.defaultValue === "") {
        // 时间选择 多选
        if(this.item.type == 'timePicker' && this.item.isrange) {
          // 不处理，不使用默认值
        }else{
          (!this.forms[this.item.prop] && this.forms[this.item.prop] !== false && this.forms[this.item.prop] !== 0) && (this.$set(this.forms, this.item.prop, this.item.defaultValue));
        }
      }
      // 级联选择类
      if(this.item.type == 'cascader' && this.item.dictName) {
        getClassifyDictTree(this.item.dictName).then(res => {
          if(res.data.code == 0 && res.data.data && res.data.data.children) {
            this.cascaderList = res.data.data.children
            this.formatCascaderOptions(this.cascaderList)
          }
        })
      }
      // tab选项卡  step步骤条
      if(['tab', 'step'].indexOf(this.item.type) > -1) {
        if(this.item.dicData && this.item.dicData.length > 0) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, {}))
          for(let col in this.item.column) {
            if(this.item.column[col] && this.item.column[col].length > 0) {
              !this.forms[this.item.prop][col] && (this.$set(this.forms[this.item.prop], col, {}))
            }
          }
        }
      }
      if(['tableForm'].indexOf(this.item.type) > -1) {
        !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, []))
      }
      if(this.item.type == 'reportTable') {
        if(this.item.dicData && this.item.dicData.length > 0) {
          !this.forms[this.item.prop] && (this.$set(this.forms, this.item.prop, {}))
          for(let di in this.item.dicData) {
            if(!this.forms[this.item.prop][this.item.dicData[di].value]) {
              this.$set(this.forms[this.item.prop], this.item.dicData[di].value, {})
            }
          }
        }
      }
      if(['imageUpload', 'fileUpload'].indexOf(this.item.type) > -1) {
        if(this.forms[this.item.prop]) {
          this.$set(this.item, 'fileList', this.forms[this.item.prop])
          this.$set(this.tableFileList, this.tableRowAIndex, this.forms[this.item.prop])
        }
        if(!this.item.headers) {
          this.$set(this.item, 'headers', {})
        }
        this.$set(this.item.headers, 'Authorization', ('Bearer ' + this.$store.getters.access_token))
      }
      if(this.item.type == 'timeline' && !this.forms[this.item.prop]) {
        this.$set(this.forms, this.item.prop, [])
      }
      if(['childrenForm', 'connectForm'].indexOf(this.item.type) > -1 && !this.forms[this.item.prop]) {
        this.$set(this.forms, this.item.prop, {})
      }
      this.$forceUpdate()
    },
    getSelectUrlData () {
      let url=this.item.dicUrl || this.item.url
      if (!url) {
        return false
      }
      if(!this.item.formId || (this.item.formId && this.item.props && this.item.props.label)) {
        let fs = []
        fs = (this.item.props && this.item.props.label) ? [this.item.props.label] : []
        if(this.item.props && this.item.props.secTitle && fs.length > 0) {
          fs.push(this.item.props.secTitle)
        }
        let postData = {
          fieldList: fs,
          conditions: []
        }
        if(this.item.props && this.item.props.sourceFieldId) {
          postData.sourceFieldId = this.item.props.sourceFieldId
        }
        let nomptyValue = true
        if(this.item.dataFilterList) {
          for(let df in this.item.dataFilterList) {
            let dfit = {
              enabledQueryTypes: this.item.dataFilterList[df].enabledQueryTypes,
              fieldKey: this.item.dataFilterList[df].fieldKey,
            }
            if(this.item.dataFilterList[df].type == 'cust') {
              dfit.value = this.item.dataFilterList[df].value
            }else{
              dfit.value = this.forms[this.item.dataFilterList[df].value]
              if((dfit.value == undefined || dfit.value == null || dfit.value == '') &&  this.item.dataFilterList[df].enabledQueryTypes != 'isNull') {
                nomptyValue = false
              }
            }
            postData.conditions.push(dfit)
          }
        }
        if(url.startsWith('/mgr/jvs-design/dynamic/data/query/list')) {
          url = `/mgr/jvs-design/app/${this.jvsAppId}/use/dynamic/data/query/list/${this.item.formId}`
        }
        if(nomptyValue) {
          getSelectData(url, this.item.method ? this.item.method : 'get', (this.item.method == 'post') ? postData : null, (this.item.method == 'post') ? this.designId : (this.item.formId ? this.item.formId : this.designId)).then(res => {
            if(res.data.code === 0) {
              this.selectOption = []
              for(let sitem in res.data.data){
                if(typeof res.data.data[sitem] == 'string') {
                  this.selectOption.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  // this.selectOption.push({
                  //   label: res.data.data[sitem][this.item.props.label ? this.item.props.label : 'label'],
                  //   value: res.data.data[sitem][this.item.props.value ? this.item.props.value : 'value']
                  // })
                  this.selectOption.push(res.data.data[sitem])
                }
              }
              // console.log(this.selectOption)
            }
          })
        }else{
          this.selectOption = []
        }
      }
    },
    handlePictureCardPreview (url) {
      this.dialogImageUrl=url
      this.dialogVisible=true
    },
    handlePictureCardPreviewUpload (file) {
      this.dialogImageUrl=file.url
      this.dialogVisible=true
    },
    handleFilePreviewUpload (file) {
      if(file.url) {
        this.$openUrl(file.url, '_blank')
      }
    },
    checkIcon (key, icon) {
      this.form[key] = icon
      this.$set(this.item, 'defaultValue', icon)
      this.$forceUpdate()
    },
    // 字段值改变传出表单
    async formChange () {
      this.$emit('formChange', this.form, this.item, this.beforeValue)
      if(this.eventList.indexOf(this.item.type) > -1) {
        this.eventRequireHandle('reinit')
      }else{
        if(this.isView !== true) {
          this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
          // if(this.execsList && this.execsList.indexOf(this.item.parentKey ? this.item.parentKey+'.'+this.item.prop : this.item.prop) > -1) {
          //   this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
          // }
        }
      }
      if(['user', 'role', 'department', 'group', 'job'].indexOf(this.item.type) > -1) {
        if(this.item.rules && this.item.rules.length > 0) {
          if(this.item.rules[0].required) {
            if(this.item.multiple) {
              if(this.form[this.item.prop].length > 0) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }else{
              if(this.form[this.item.prop]) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }
          }
        }
      }
    },
    // 选项卡formchange
    tabFormchange (data) {
      this.$set(this.form, this.item.prop, data)
      // this.formChange()
      this.$forceUpdate()
    },
    addRowHandle () {
      if(!this.forms[this.item.prop]) {
        this.$set(this.forms, this.item.prop, [])
      }
      let adrow = {}
      let keys = []
      let pk = []
      this.tableFormOption.tableColumn.filter(item => {
        keys.push(item.prop)
        pk = item.parentKey
        // 时间范围  日期范围
        if((item.type == 'timePicker' && item.isrange)) {
          let val = new Date()
          let h = val.getHours()
          let m = val.getMinutes()
          let s = val.getSeconds()
          let vastr = (h<10?('0'+h) : h) + ':' + (m<10?('0'+m) : m) + ':' + (s<10?('0'+s) : s)
          this.$set(adrow, item.prop, [vastr, vastr])
        }
        if(item.type == 'datePicker' && ['dates', 'daterange', 'monthrange', 'datetimerange'].indexOf(item.datetype) > -1) {
          this.$set(adrow, item.prop, [])
        }
      })
      this.forms[this.item.prop].push(adrow)
      let _this = this
      setTimeout( ()=> {
        _this.$emit('reInitData', keys.join(','), pk, (this.forms[this.item.prop].length -1), 'add')
      }, 0)
    },
    deleteRow (row, index) {
      if(this.item.formId) {
        if(!this.form[this.item.prop+'_del']) {
          this.$set(this.form, (this.item.prop+'_del'), [])
        }
        let list = JSON.parse(JSON.stringify(this.form[this.item.prop+'_del']))
        list.push(row)
        this.$set(this.form, (this.item.prop+'_del'), list)
      }
      this.forms[this.item.prop].splice(index, 1)

      this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex, 'del')
    },
    // 同步表格数据
    setTableHandle (data) {
      this.$set(this.forms, this.item.prop, data)
    },
    // 获取宽度占比
    getWidth (item) {
      let w = 400
      if(item.prop && document.getElementById('icon-select-item-'+item.prop)) {
        w = document.getElementById('icon-select-item-'+item.prop).clientWidth
      }
      return w
    },
    // 初始化富文本
    initEditor (prop) {
      let that = this
      this.$nextTick(() => {
        let _this = that
        if(_this.editor) {
          _this.editor.destroy()
        }
        _this.editor = null
        $('#' + prop + '-editor').html("")
        _this.editor = new E('#' + prop + '-editor')
        _this.editor.config.height = 400
        // _this.editor.config.uploadImgShowBase64 = true
        _this.editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          'foreColor',
          'backColor',
          'link',
          'list',
          'justify',
          'quote',
          'emoticon',
          'image',
          'table',
          'code',
          'splitLine',
          'undo',
          'redo',
        ]
        _this.editor.config.onblur = function (newHtml) {
          let vb = false
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.$set(_this.form, prop, "")
            vb = false
          }else{
            _this.$set(_this.form, prop, newHtml)
            _this.$set(_this.item, 'defaultValue', newHtml)
            vb = true
          }
          if(_this.item.rules && _this.item.rules.length > 0) {
            if(_this.item.rules[0].required) {
              if(vb) {
                _this.$emit('validateHandle', {type: 'clear', item: _this.item})
              }else{
                _this.$emit('validateHandle', {type: 'validate', item: _this.item})
              }
            }
          }
          _this.eventRequireHandle()
        }
        _this.editor.config.onchange = function (newHtml) {
          let vb = false
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.$set(_this.form, prop, "")
            vb = false
          }else{
            _this.$set(_this.form, prop, newHtml)
            _this.$set(_this.item, 'defaultValue', newHtml)
            vb = true
          }
          if(_this.item.rules && _this.item.rules.length > 0) {
            if(_this.item.rules[0].required) {
              if(vb) {
                _this.$emit('validateHandle', {type: 'clear', item: _this.item})
              }else{
                _this.$emit('validateHandle', {type: 'validate', item: _this.item})
              }
            }
          }
        }
        _this.editor.config.uploadImgServer = '/mgr/jvs-auth/upload/jvs-public'
        _this.editor.config.uploadFileName = 'file'
        _this.editor.config.uploadImgHeaders = {
          Authorization: 'Bearer ' + this.$store.getters.access_token
        }
        _this.editor.config.uploadImgHooks = {
          // 图片上传并返回了结果，图片插入已成功
          success: function(xhr) {
            console.log('success', xhr)
          },
          // 图片上传并返回了结果，但图片插入时出错了
          fail: function(xhr, editor, resData) {
            console.log('fail', resData)
          },
          // 上传图片出错，一般为 http 请求的错误
          error: function(xhr, editor, resData) {
            console.log('error', xhr, resData)
          },
          // 图片上传并返回了结果，想要自己把图片插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
          customInsert: function(insertImgFn, result) {
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            if(result.code == 0 && result.data && result.data.fileLink) {
              let url = result.data.fileLink.indexOf('?') ? result.data.fileLink.split('?')[0] : result.data.fileLink
              insertImgFn(url)
            }
          }
        }
        _this.editor.create()
        if(_this.item.defaultValue) {
          _this.editor.txt.html(_this.item.defaultValue)
          _this.initHtml = _this.item.defaultValue
        }
        if(_this.form[prop]) {
          _this.form[prop] = _this.form[prop].replace(/&lt;/g, "<")
          _this.form[prop] = _this.form[prop].replace(/&gt;/g, ">")
          _this.editor.txt.html(_this.form[prop])
          _this.initHtml = _this.form[prop]
        }
        if(_this.item.disabled) {
          _this.editor.disable()
        }else{
          _this.editor.enable()
        }
      })
      this.$forceUpdate()
    },
    tabClick (name) {
      if(this.item.handleClick) {
        this.item.handleClick(name)
      }
    },
    // 按钮点击
    btnClick () {
      if(this.item.eventType == 'url') {
        if(this.item.openUrl) {
          this.$openUrl(this.item.openUrl, this.item.newWindowOpen ? '_blank' : '_self')
        }
      }else{
        this.eventRequireHandle()
      }
    },
    // 上传成功回调
    handleSuccess (res, file, fileList) {
      if(res.code === 0){
        let obj = {
          name: res.data.originalFileName,
          url: res.data.fileLink,
          fileName: res.data.fileName
        }
        if(this.item.parent && this.item.parent.type == 'tableForm') {
          if(!this.tableFileList[this.tableRowAIndex]) {
            this.tableFileList[this.tableRowAIndex] = []
          }
          this.tableFileList[this.tableRowAIndex].push(obj)
          this.$set(this.forms, this.item.prop, this.tableFileList[this.tableRowAIndex])
        }else{
          this.item.fileList.push(obj)
          let temp = {
            key: this.item.prop,
            fileList: this.item.fileList
          }
          this.$emit('file', temp)
          this.$set(this.forms, this.item.prop, this.item.fileList)
        }
        this.eventRequireHandle()
      }
    },
    eventRequireHandle (op) {
      if(this.item.eventHttp) {
        if([undefined, null].indexOf(this.forms[this.item.prop]) > -1 && this.item.type != 'button') {
          return false
        }
        let obj = {}
        if(this.item.type == 'button') {
          obj = JSON.parse(JSON.stringify(this.forms))
        }else{
          obj[this.item.prop] = this.forms[this.item.prop]
        }
        ruleRun(this.jvsAppId, this.item.eventHttp, obj).then(res => {
          if(res.data && res.data.code == 0) {
            if(res.data.msg) {
              this.$message.success(res.data.msg)
            }
            if (res.data.data) {
              for(let i in res.data.data) {
                this.$set(this.form, i, res.data.data[i])
              }
              this.$emit('formChange', this.form)
            }
            if(op == 'reinit' && this.isView !== true) {
              this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
              // if(this.execsList && this.execsList.indexOf(this.item.parentKey ? this.item.parentKey+'.'+this.item.prop : this.item.prop) > -1) {
              //   this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
              // }
            }
          }
        })
      }else{
        if(op == 'reinit' && this.isView !== true) {
          this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
          // if(this.execsList && this.execsList.indexOf(this.item.parentKey ? this.item.parentKey+'.'+this.item.prop : this.item.prop) > -1) {
          //   this.$emit('reInitData', this.item.prop, this.item.parentKey, this.tableRowAIndex)
          // }
        }
      }
    },
    // 处理上传参数
    formatUploadData (item) {
      let obj = {}
      if(item.uploadHttp) {
        obj = item.uploadHttp.parameters
      }
      return obj
    },
    // 删除
    handleRemove (file, fileList) {
      if(this.item.parent && this.item.parent.type == 'tableForm') {
        for(let i in this.tableFileList[this.tableRowAIndex]) {
          if(this.tableFileList[this.tableRowAIndex][i].uid == file.uid) {
            this.tableFileList[this.tableRowAIndex].splice(i, 1)
            this.$set(this.forms, this.item.prop, this.tableFileList[this.tableRowAIndex])
          }
        }
        this.$forceUpdate()
      }else{
        for(let i in this.item.fileList) {
          if(this.item.fileList[i].uid == file.uid) {
            this.item.fileList.splice(i, 1)
            let temp = {
              key: this.item.prop,
              fileList: this.item.fileList
            }
            this.$emit('file', temp)
            this.$set(this.forms, this.item.prop, this.item.fileList)
          }
        }
      }
    },
    formatCascaderOptions (list) {
      for(let i in list) {
        if(list[i].extend && list[i].extend.uniqueName) {
          list[i].uniqueName = list[i].extend.uniqueName
        }
        if(list[i].children && list[i].children.length > 0) {
          this.formatCascaderOptions(list[i].children)
        }
      }
    },
    getHtmlText (text) {
      if(text) {
        return text.replace(/[\n]/g, "<br/>")
      }else{
        return ''
      }
    },
    reInitData (prop, parentKey, index, tableType) {
      this.$emit('reInitData', prop, parentKey, index, tableType)
    },
    openDialog () {
      if(!this.isView) {
        this.searchOption.column = []
        this.queryBeforeSlot = []
        if(this.item.others && this.item.others.length > 0) {
          getModelAllFields(this.jvsAppId, this.item.formId, this.designId).then(res => {
            if(res.data && res.data.code == 0) {
              res.data.data.filter(it => {
                if(this.item.others.indexOf(it.fieldKey) > -1) {
                  this.searchOption.column.push({
                    label: it.fieldName,
                    prop: it.fieldKey,
                    type: it.type ? it.type : 'input',
                    enabledQueryTypes: it.enabledQueryTypes,
                    searchSpan: 8,
                    datetype: 'date'
                  })
                }
                this.queryBeforeSlot.push({prop: it.fieldKey, list: it.enabledQueryTypes})
              })
              this.searchVisible = true
            }
          })
        }
      }
    },
    searchClose () {
      this.searchVisible = false
    },
    clearSearch () {
      this.$set(this.forms, this.item.prop, '')
      this.formChange()
    },
    // 条件查询
    queryHandle (form) {
      this.queryParams = form
      this.getListData()
    },
    // 分页change
    handleCurrentChange(e) {
      this.getListData()
    },
    resetQueryHandle () {
      this.queryParams = {}
    },
    rowClick (data) {
      let row = data.row
      if(this.item.props && this.item.props.label && row[this.item.props.label]) {
        this.$set(this.forms, this.item.prop, row[this.item.props.label])
      }else{
        this.$set(this.forms, this.item.prop, '')
      }
      this.formChange()
      this.searchVisible = false
    },
    getListData() {
      this.searchLoading = true
      let obj = {
        fieldList: (this.item.props && this.item.props.label) ? [this.item.props.label, ...(this.item.others || [])] : [],
      }
      obj.size = this.page.pageSize
      obj.current = this.page.currentPage
      obj.conditions = []
      for(let i in this.queryParams) {
        if(this.queryParams[i] || this.queryParams[i] === 0 || this.queryParams[i] === false || (typeof this.queryParams[i] == 'number')) {
          obj.conditions.push({fieldKey: i, enabledQueryTypes: 'eq', value: this.queryParams[i]})
        }
      }
      this.currentQuery = obj
      let nomptyValue = true
      if(this.item.dataFilterList) {
        for(let df in this.item.dataFilterList) {
          let dfit = {
            enabledQueryTypes: this.item.dataFilterList[df].enabledQueryTypes,
            fieldKey: this.item.dataFilterList[df].fieldKey,
          }
          if(this.item.dataFilterList[df].type == 'cust') {
            dfit.value = this.item.dataFilterList[df].value
          }else{
            let tval = null
            if(typeof this.item.dataFilterList[df].value == 'object' && (this.item.dataFilterList[df].value instanceof Array)) {
              if(this.item.dataFilterList[df].value.length > 0) {
                if(this.item.dataFilterList[df].value.length == 1) {
                  if(this.item.parentType && this.item.parentKey && this.originForm) {
                    tval = this.originForm[this.item.dataFilterList[df].value[0]]
                  }
                }else{
                  tval = this.forms[this.item.dataFilterList[df].value[this.item.dataFilterList[df].value.length - 1]]
                }
              }
            }else{
              tval = this.forms[this.item.dataFilterList[df].value]
            }
            if((tval == undefined || tval == null || tval == '') &&  this.item.dataFilterList[df].enabledQueryTypes != 'isNull') {
              nomptyValue = false
            }else{
              dfit.value = tval
            }
          }
          obj.conditions.push(dfit)
        }
      }
      if(nomptyValue) {
      }else{
        this.searchLoading = false
      }
    },
    getThousandthNumber(num) {
      let str = ''
      if(typeof num == 'number' || (typeof num == 'string' && num)) {
        str = num + ''
        str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        if(str.includes('.') == false && this.item.precision > 0) {
          str += '.'
          for(let i=0; i < this.item.precision; i++) {
            str += '0'
          }
        }
      }
      return str
    },
    showThoudsandthHandle (bool) {
      if(this.item.thoudsandthable && !this.item.disabled) {
        this.showThoudsandth = bool
      }
    },
    getDisableexpress (type) {
      let bool = true
      let color = ""
      let bgcolor = ''
      if(this.item.disabled) {
        if(this.item.expressDisplay) {
          if(this.item.expressDisplay.backColor || this.item.expressDisplay.textcolor) {
            bool = false
            if(this.item.expressDisplay.backColor) {
              bgcolor = this.item.expressDisplay.backColor
            }
            color = this.item.expressDisplay.textcolor
          }
          if(this.item.expressDisplay.conditionControl){
            this.item.expressDisplay.conditionControl.filter(cit => {
              if(cit.value == this.form[this.item.prop]) {
                bgcolor = cit.bgcolor
                color = cit.color
                bool = false
              }
            })
          }
        }
      }
      if(type == 'show') {
        if(!this.form[this.item.prop]) {
          bool = true
        }
        return bool
      }
      if(type == 'color') {
        return color
      }
      if(type == 'bgcolor') {
        return bgcolor
      }
    }
  },
  watch: {
    item: {
      handler (newVal, oldVal) {
        this.initItem()
        // 下拉框 单选 自定义选择
        if(this.item.currVal) {
          if(this.item.multiple) {
            if(this.item.currVal instanceof Array !== true) {
              this.$set(this.forms, this.item.prop, [])
            }else{
              this.$set(this.forms, this.item.prop, this.item.currVal)
            }
          }else{
            if(this.item.currVal instanceof Array !== true) {
              this.$set(this.forms, this.item.prop, this.item.currVal)
            }else{
              this.$set(this.forms, this.item.prop, "")
            }
          }
        }
        if(['imageUpload', 'fileUpload'].indexOf(this.item.type) > -1) {
          if(this.item.rules && this.item.rules.length > 0) {
            if(this.item.rules[0].required) {
              if(this.forms[this.item.prop].length > 0) {
                this.$emit('validateHandle', {type: 'clear', item: this.item})
              }else{
                this.$emit('validateHandle', {type: 'validate', item: this.item})
              }
            }
          }
        }
        if(this.item.type == 'htmlEditor'){
          if(newVal.prop != oldVal.prop) {
            if($('#' + this.item.prop + '-editor')) {
              $('#' + this.item.prop + '-editor').html("")
            }
            if(this.editor) {
              this.editor.destroy()
            }
            this.initEditor(this.item.prop)
          }else{
            if(this.item.disabled) {
              this.editor.disable()
            }else{
              this.editor.enable()
            }
          }
        }
      },
      deep: true
    },
    freshBoolean: {
      handler(newVal, oldVal) {
        if(this.item.type == 'htmlEditor') {
          $('#' + this.item.prop + '-editor').html("")
          this.initEditor(this.item.prop)
        }else{
          $('#' + this.item.prop + '-editor').html("")
          this.editor.destroy()
        }
      }
    },
    reinitFlag: {
      handler(newVal, oldVal) {
        if(newVal != -1) {
          this.initItem()
        }
      }
    },
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          if(this.item.type == 'htmlEditor') {
            this.editor.txt.html(this.initHtml)
          }
          if(this.item.type == 'checkbox') {
            if(!this.forms[this.item.prop]) {
              this.$set(this.forms, this.item.prop, [])
            }
          }
          if(this.item.type == 'reportTable') {
            this.initItem()
          }
        }
      }
    },
    changeRandom: {
      handler(newVal, oldVal) {
        if(newVal > -1) {
          if(this.item.dataFilterable && !this.isView) {
            this.getSelectUrlData()
          }
        }
      }
    },
    // 被嵌套表格自适应宽判断
    parentDomWidth: {
      handler(newVal, oldVal) {
        if(newVal && newVal > 0) {
          if(this.item.type == 'tableForm') {
            if(this.$refs[this.item.prop]) {
              let tw = 0
              this.item.tableColumn.filter(ti => {
                tw += ti.span * 8
              })
              let w = this.$refs[this.item.prop].offsetWidth
              if(w <= 0) {
                w = (newVal / 24) * (this.item.span)
              }
              if(tw < w - 50) {
                this.item.tableColumn.filter(ti => {
                  ti.width = ''
                })
              }
            }
          }
        }
      }
    }
  },
  created () {
    this.initItem()
  },
  mounted () {
    if(this.item.type == 'htmlEditor') {
      $('#' + this.item.prop + '-editor').html("")
      this.initEditor(this.item.prop)
    }
    if(this.item.type == 'iconSelect') {
      this.iconToolWidth = this.getWidth(this.item)
    }
    if(this.item.type == 'tableForm') {
      if(this.$refs[this.item.prop]) {
        let tw = 0
        this.item.tableColumn.filter(ti => {
          tw += ti.span * 8
        })
        if(tw < this.$refs[this.item.prop].offsetWidth - 50) {
          this.item.tableColumn.filter(ti => {
            ti.width = ''
          })
        }
      }
    }
  }
};
</script>

<style lang="scss">
.loading-back {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-list-upload-img {
  .el-upload--picture-card {
    display: inline-block;
  }
}
.el-upload-list--picture-card{
  display: inline-block;
  height: 148px;
}
.form-list-upload-img-none {
  .el-upload--picture-card {
    display: none;
  }
  .el-upload-list {
    height: 148px;
  }
}
.form-list-upload-file {
  .el-upload--text {
    display: inline-block;
  }
}
.form-list-upload-file-none {
  .el-upload--text {
    display: none;
  }
}
.icon-select-tool{
  display: flex;
  flex-wrap: wrap;
  height: 200px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 15px;
  i{
    margin: 10px;
    display: block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  i:hover{
    color: #409EFF;
  }
  .icon {
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
.icon-select-tool::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.icon-select-tool-position{
  position: absolute;
  height: 158px;
  top: 45px;
  margin: 0;
  z-index: 9;
}
.jvs-form-item{
  min-height: 32px;
  position: relative;
  .el-slider, p, .el-input-number, .el-select, .el-date-editor, .form-item-icon-selct, .el-tabs, .el-cascader, .user-info-list{
    flex: 1;
  }
  .el-input-number{
    .el-input__inner{
      text-align: left;
    }
  }
  .el-input-number.is-disabled{
    // flex: none;
    width: 100%;
    .el-input{
      width: auto;
      .el-input__inner{
        padding-right: 0;
      }
    }
  }
  .show-thoudsandth-number{
    .el-input__inner{
      color: transparent;
    }
  }
  .input-number-Thousandth{
    position: absolute;
    left: 16px;
    font-size: 12px;
  }
  .input-number-Thousandth-disabled{
    left: 0;
    font-size: 14px;
  }
  // 隐藏文本框前置图标
  .el-input--prefix{
    .el-input__prefix{
      display: none;
    }
    .el-input__inner{
      padding-left: 15px;
    }
  }
  // 隐藏禁用状态下placeholder
  .el-input.is-disabled{
    font-size: 12px;
    .el-input__inner::-webkit-input-placeholder{
      color: transparent;
    }
    .el-input__inner::-moz-input-placeholder{
      color: transparent;
    }
    .el-input__inner::-ms-input-placeholder{
      color: transparent;
    }
  }
  .show-disable.is-disabled{
    .el-input__inner{
      font-size: 12px!important;
      background-color: #F5F7FA!important;
      border: 1px solid #E4E7ED!important;
      color: #C0C4CC!important;
      padding: 0 15px!important;
    }
    .el-input__inner::-webkit-input-placeholder{
      color: #C0C4CC!important;
    }
    .el-input__inner::-moz-input-placeholder{
      color: #C0C4CC!important;
    }
    .el-input__inner::-ms-input-placeholder{
      color: #C0C4CC!important;
    }
    .el-input-group__append{
      display: table-cell!important;
    }
  }
  // p文字
  .form-item-p{
    span{
      display: inline-block;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      padding-left: 10px;
      height: 28px;
      i,b{
        font-weight: normal;
        font-style: normal;
      }
      i{
        width: 4px;
        border-radius: 2px;
        height: 20px;
        background-color: rgb(52, 113, 255);
        display: inline-block;
        line-height: 28px;
        position: absolute;
        top: 4px;
        left: 0;
      }
    }
  }
  .table-form{
    .jvs-table{
      .table-body-box{
        padding: 0;
      }
    }
  }
  .user-info-list{
    .user-info-input-div{
      height: 28px;
    }
  }
  .el-cascader{
    .el-input{
      .el-input__inner{
        height: 28px!important;
      }
    }
  }
}
.jvs-form-item-disabled{
  .el-upload-list{
    .el-upload-list__item{
      .el-upload-list__item-status-label{
        display: none!important;;
      }
    }
    .el-upload-list__item:hover{
      .el-icon-close{
        display: none!important;
      }
    }
  }
  .w-e-toolbar{
    display: none;
  }
  .w-e-text-container{
    width: 100%;
    border: 0!important;
    height: auto!important;
  }
  .form-item-icon-selct{
    .el-input{
      display: none;
    }
  }
}
.search-form-item-table{
  .jvs-table{
    .search-form{
      padding: 0!important;
    }
    .table-top{
      padding: 0!important;
      padding-top: 10px!important;
    }
    .table-body-box{
      .el-table__body-wrapper{
        height: auto!important;
      }
    }
  }
}
</style>
