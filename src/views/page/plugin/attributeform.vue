<template>
  <el-card class="attrcont">
    <div v-if="false" class="attrcontzzc" :style="{'z-index':zzcindex}"></div>
    <el-row style="font-size: 14px;margin-bottom:10px;" v-if="(fineGrainedType == 'SAVE' || fineGrainedType == 'EDIT') && (formType == 'normalForm' || formType == 'multiLevelForm')">
      <span style="margin-right: 25px;">关联流程</span>
      <el-switch size="mini" v-model="isFlowableBoolean" active-color="#409EFF" inactive-color="#eee" @change="changeFlowable"></el-switch>
    </el-row>
    <el-row style="font-size: 14px;margin-bottom:10px;" v-if="isFlowableBoolean">
      <el-select size="mini" style="width:100%" v-model="flowableDomString" placeholder="请选择流程" @change="changeFlowable">
        <el-option v-for="ai in availableList" :key="ai.name" :label="ai.name" :value="ai.id"></el-option>
        </el-select>
    </el-row>
    <el-table
      v-if='allForm && allForm.length > 0'
      border
      :data="allForm"
      class="tb-edit"
      style="width: 100%"
      highlight-current-row
      size='mini'
    >
      <el-table-column label="表单名称">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.label"
            placeholder="请输入内容"
          ></el-input>
          <span class="el-form-item__error" style="position: unset;" v-if="!scope.row.label">必填</span>
        </template>
      </el-table-column>
      <el-table-column label="表单id">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.name"
            placeholder="请输入内容"
            @focus="isActive(scope.row.name)"
            @blur="changeFormId(scope.row.name)"
          ></el-input>
          <span class="el-form-item__error" style="position: unset;" v-if="!scope.row.name">必填</span>
          <span class="el-form-item__error" style="position: unset;" v-if="scope.row.name && isRepeat(scope.row.name)">此id已存在！</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="scope.$index > 0"
              size="mini"
              type="text"
              @click="deleteTabForm(scope.$index, scope.row)"
            >删除</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if='allForm && allForm.length > 0' size='mini' @click="addOneForm" style="margin-top:10px">增加表单</el-button>
    <div>
    </div>
    <el-tabs :class="formclass" :stretch="true" v-model="activeName">
      <el-tab-pane label="组件设置" name="1"><!-- 字段设置 -->
        <el-collapse v-model="activeAttrs" class="attribute-collapse">
          <el-collapse-item title="基础设置" name="basic">
            <el-form :model="form" label-width="80px" label-position="left" size='mini'>
              <!-- 选数据源 -->
              <!-- && form.type !== "tableForm" -->
              <!-- <el-form-item v-if='form.showFrom.indexOf("prop") !== -1  && fieldsdata.length == 0 ' label="数据源" :class="validateBool?'is-error':''">
                <el-select
                  style="width:100%"
                  v-model="form.dataSourceNameProp" placeholder="请选择数据源" size="mini"
                  @change="changeOriginTable(form.dataSourceNameProp, 'tableOption', 'tableNameprop')"
                >
                  <el-option
                    v-for="item in dataSourceOption"
                    :key="item.databaseName"
                    :label="item.name"
                    :value="item.databaseName">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- 选数据表 -->
              <!-- && form.type !== "tableForm" -->
              <!-- <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && fieldsdata.length == 0   && tableOption' label="数据表" :class="validateBool?'is-error':''">
                <el-select style="width:100%" v-model="form.tableNameprop" allow-create filterable @change="tableChangeHandle(form.tableNameprop, tableOption, 'tableColumnList')" size="mini">
                  <el-option v-for='(item,index) in tableOption' :key="index" :label="item.tableName" :value="item.tableName">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- 除可编辑表格外组件 -->
              <!-- && form.type !== "tableForm" -->
              <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && fieldsdata.length == 0' label="字段名称" :class="validateBool?'is-error':''">
<!--                <el-select v-if="tableOption && tableOption.length > 0"  style="width:100%" v-model="form.prop" allow-create filterable @change="aliasColumnNameChangeHandle" size="mini">-->
<!--                  <el-option  v-for='(item,index) in tableColumnList' :key="index" :label="item.fieldName" :value="item.fieldName">-->
<!--                    <span style="float: left">{{ item.fieldName }}</span>-->
<!--                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.columnComment }}</span>-->
<!--                  </el-option>-->
<!--                </el-select>-->
                <el-select v-if="tableOption && tableOption.length > 0"  style="width:100%" v-model="form.prop" allow-create filterable @change="aliasColumnNameChangeHandle" size="mini">
                  <el-option  v-for='(item,index) in fieldKeys' :key="index" :label="item.fieldKey" :value="item.fieldKey">
                    <span style="float: left">{{ item.fieldKey }}</span>
<!--                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.columnComment }}</span>-->
                  </el-option>
                </el-select>
                <el-input v-else v-model="form.prop" @blur="noKeyWord" size="mini"></el-input>
                <span v-show="validateBool" class="el-form-item__error">字段名称不能为系统关键字</span>
                <span v-show="validateRule" class="el-form-item__error">由英文字母组成</span>
              </el-form-item>
              <!--  && form.type !== "tableForm" -->
              <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && fieldsdata.length > 0' label="字段名称" :class="validateBool?'is-error':''">
                <el-select  style="width:100%" v-model="form.prop" allow-create filterable @change="keyChangehandle" size="mini">
                  <el-option  v-for='(item,index) in fieldsdata' :key="index" :label="item.fieldName" :value="item.fieldName">
                    <span style="float: left">{{ item.columnComment }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fieldName }}</span>
                  </el-option>
                </el-select>
                <span v-show="validateBool" class="el-form-item__error">字段名称不能为系统关键字</span>
                <span v-show="validateRule" class="el-form-item__error">由英文字母组成</span>
              </el-form-item>
              <!-- 可编辑表格组件 prop -->
              <!-- <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && form.type == "tableForm"' label="字段名称" :class="validateBool?'is-error':''">
                <el-select  style="width:100%" v-model="form.prop" allow-create filterable @change="keyChangehandle('other')" size="mini">
                  <el-option  v-for='(item,index) in otherTable' :key="index" :label="item.info" :value="item.tableName">
                    <span style="float: left">{{ item.info }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tableName }}</span>
                  </el-option>
                </el-select>
                <span v-show="validateBool" class="el-form-item__error">字段名称不能为系统关键字</span>
                <span v-show="validateRule" class="el-form-item__error">由英文字母组成</span>
              </el-form-item> -->
              <el-form-item v-if='form.showFrom.indexOf("defaultValue") !== -1 && ["switch","slider"].indexOf(form.type) === -1' label="默认值" :class="defaultLimit?'is-error':''">
                <el-input v-model="form.defaultValue" @blur="limitDefaultHandle" size="mini"></el-input>
                <span v-show="defaultLimit" class="el-form-item__error">{{defaultLimitText}}</span>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("defaultValue") !== -1 && form.type == "switch"' label="默认值">
                <el-switch
                  style="width:100%"
                  v-model="form.defaultValue"
                  :active-text='form.activetext'
                  :inactive-text='form.inactivetext'
                  :active-color="form.activecolor"
                  :inactive-color="form.inactivecolor"
                  size="mini"
                >
                </el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("defaultValue") !== -1 && form.type === "slider"' label="默认值">
                <el-input-number v-model="form.defaultValue" size="mini"></el-input-number>
              </el-form-item>
              <!-- <el-form-item v-if='form.showFrom.indexOf("defaultUrl") !== -1 || (form.showFrom.indexOf("defaultValue") !== -1)' label="回显接口">
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">接口示例： /xxx/xxxx 或以 http / https 开头的接口地址<br/>数据格式：[ { label: "示例1", value: "demo1" }, { label: "示例2", value: "demo2" } ]</div>
                  <i class="el-icon-question" style="position: absolute;left: -15px;top: 0px;cursor: pointer;color: #409EFF;"></i>
                </el-tooltip>
                <el-input v-model="form.defaultUrl"></el-input>
              </el-form-item> -->
              <el-form-item v-if='form.showFrom.indexOf("label") !== -1' label="中文名">
                <el-input v-model="form.label" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("disabled") !== -1' label="是否禁用">
                <el-switch v-model="form.disabled" :disabled="isDetail" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("disabled") !== -1' label="是否隐藏">
                <el-switch v-model="form.display" active-color="#409EFF" inactive-color="#eee" size="mini" :active-value="false" :inactive-value="true"></el-switch>
              </el-form-item>

              <!-- 表格组件 -->
              <!-- 暂时屏蔽QAQAQAQAQAQAQAQAQAQAQAQAQ -->
              <el-form-item v-if='false && form.type == "tableForm"' label="行内编辑">
                <el-switch v-model="form.editable" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm"' label="新增按钮">
                <el-switch v-model="form.addBtn" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
                <jvs-button v-if="!form.editable" size="mini" style="margin-left: 10px;" @click="designBtnForm('add')">设计表单</jvs-button>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm"' label="删除按钮">
                <el-switch v-model="form.delBtn" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
                <jvs-button v-if='form.type == "tableForm" && !form.editable' size="mini" style="margin-left: 10px;" @click="setHttpHandle('tableDelete')">配置</jvs-button>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm" && !form.editable' label="编辑按钮">
                <el-switch v-model="form.editBtn" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
                <jvs-button size="mini" style="margin-left: 10px;" @click="designBtnForm('edit')">设计表单</jvs-button>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm" && !form.editable' label="详情按钮">
                <el-switch v-model="form.viewBtn" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
                <jvs-button size="mini" style="margin-left: 10px;" @click="designBtnForm('view')">设计表单</jvs-button>
              </el-form-item>
              <el-form-item label="表格数据回显设置" v-if='form.type == "tableForm" && !form.editable'>
                <jvs-button size="mini"  @click="setHttpHandle('tableEcho')">配置</jvs-button>
              </el-form-item>
              <el-form-item label="网页地址" v-if='form.type == "iframe"'>
                <el-input v-model="form.iframeurl" size="mini"></el-input>
              </el-form-item>
              <!-- 时间线 流向字段、内容设置 -->
              <el-form-item v-if='form.type == "timeline"' label="时间字段">
                <el-input v-model="form.timestamp" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.type == "timeline" ' label="内容">
                <el-input v-model="form.content" size="mini"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="事件设置" name="event">
            <el-form :model="form" label-width="80px" label-position="left" size='mini'>
              <el-form-item label="设置方式" prop="eventType" v-if="eventList.indexOf(form.type) > -1 && form.type == 'button'">
                <el-radio-group v-model="form.eventType" size="mini">
                  <el-radio label="http">网络设置</el-radio>
                  <el-radio label="url">打开地址</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="打开地址" prop="openUrl" v-if="eventList.indexOf(form.type) > -1 && form.type == 'button' && form.eventType == 'url'">
                <el-select size="mini" style="width:100%" v-model="form.openUrl" placeholder="请选择或输入" filterable allow-create>
                  <el-option v-for="fi in formListOption" :key="fi.id+'_formItem'" :label="fi.name" :value="re.url"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="新窗口打开" prop="newWindowOpen" v-if="eventList.indexOf(form.type) > -1 && form.type == 'button' && form.eventType == 'url'">
                <el-switch size="mini" v-model="form.newWindowOpen" active-color="#409EFF" inactive-color="#eee"></el-switch>
              </el-form-item>
              <el-form-item label="网络设置" prop="eventHttp" v-if="eventList.indexOf(form.type) > -1 && ( (form.type == 'button' && form.eventType == 'http') || form.type != 'button' )">
                <jvs-button size="mini" @click="setHttpHandle('eventHttp')">配置</jvs-button>
              </el-form-item>
              <!-- 显示控制 -->
              <el-form-item label="显示控制" prop="showExpress">
                <jvs-button size="mini" @click="setShowHandle">配置</jvs-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="样式设置" name="style">
            <el-form :model="form" label-width="80px" label-position="left" size='mini'>
              <!-- 栅格格数 -->
              <el-form-item v-if='form.showFrom.indexOf("span") !== -1' label="控件宽度">
                <el-slider
                  v-model="form.span"
                  :min="1"
                  :max="24"
                  :step="1"
                  :show-input="false"
                  :range="false"
                ></el-slider>
              </el-form-item>

              <!-- 步骤条组件 -->
              <el-form-item v-if='form.type == "step"' label="按钮对齐">
                <el-select style="width:100%" v-model="form.toolAlign" placeholder="请选择">
                  <el-option label="左对齐" value="left"></el-option>
                  <el-option label="居中对齐" value="center"></el-option>
                  <el-option label="右对齐" value="flex-end"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("linkbind") !== -1' label="控制值">
                <el-input v-model="form.linkbind" size="mini" placeholder="多个值使用英文逗号,隔开"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("rows") !== -1' label="默认行数">
                <el-input-number :min="1" :max="20" v-model="form.rows" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='false && form.showFrom.indexOf("minlength") !== -1' label="最小长度">
                <el-input-number :min="0" v-model="form.minlength" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("maxlength") !== -1' label="最大长度">
                <el-input-number :min="0" v-model="form.maxlength" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("showwordlimit") !== -1' label="字数统计">
                <el-switch v-model="form.showwordlimit" active-color="#409EFF" inactive-color="#eee"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("placeholder") !== -1' label="占位内容">
                <el-input v-model="form.placeholder" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("clearable") !== -1 && form.type !== "Textarea"' label="可否清空">
                <el-switch v-model="form.clearable" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("showpassword") !== -1' label="密码框">
                <el-switch v-model="form.showpassword" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='["inputNumber", "slider"].indexOf(form.type) > -1' label="显示单位">
                <el-input v-model="form.unit" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && form.tips && form.type != "p"' label="提示描述">
                <el-input v-model="form.tips.text" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("prop") !== -1 && form.tips  && form.type != "p"' label="描述位置">
                <el-select  style="width:100%" v-model="form.tips.position" size="mini">
                  <el-option label="右侧" value="right"></el-option>
                  <el-option label="换行" value="bottom"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("prefixicon") !== -1' label="头部图标">
                <el-input v-model="form.prefixicon" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("suffixicon") !== -1' label="尾部图标">
                <el-input v-model="form.suffixicon"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("prepend") !== -1' label="前置内容">
                <el-input v-model="form.prepend" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("append") !== -1' label="后置内容">
                <el-input v-model="form.append" size="mini"></el-input>
              </el-form-item>
              <!-- number -->
              <el-form-item v-if='form.showFrom.indexOf("min") !== -1' label="最小值">
                <el-input-number v-model="form.min" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("max") !== -1' label="最大值">
                <el-input-number v-model="form.max"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("step") !== -1' label="步长">
                <el-input-number :precision="2" v-model="form.step" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("stepstrictly") !== -1' label="严格步数">
                <el-switch v-model="form.stepstrictly" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("precision") !== -1' label="精确小数">
                <el-input-number :min="0" :max="5" :step="1" stepstrictly v-model="form.precision" size="mini"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("controlsposition") !== -1' label="按钮位置">
                <el-select v-model="form.controlsposition" size="mini">
                  <el-option label="两边" value=""></el-option>
                  <el-option label="右边" value="right"></el-option>
                </el-select>
              </el-form-item>
              <!-- 下拉框 -->
              <el-form-item v-if='form.showFrom.indexOf("multiple") !== -1' label="可否多选">
                <el-switch v-model="form.multiple" active-color="#409EFF" inactive-color="#eee" :disabled="form.sqlType == 'enum'" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("filterable") !== -1' label="可否搜索">
                <el-switch v-model="form.filterable" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("allowcreate") !== -1 && form.filterable' label="可否创建选项">
                <el-switch v-model="form.allowcreate" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("collapsetags") !== -1 && form.multiple' label="选择内容全部展示">
                <el-switch v-model="form.collapsetags" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>

              <!-- 开关 -->
              <el-form-item v-if='form.showFrom.indexOf("width") !== -1' label="开关宽度">
                <el-input-number :min="40" :max="100" :step="1"  v-model="form.width"></el-input-number>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("activetext") !== -1' label="打开时的文字描述">
                <el-input v-model="form.activetext" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("inactivetext") !== -1' label="关闭时的文字描述">
                <el-input v-model="form.inactivetext" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("activecolor") !== -1' label="打开时背景色">
                <el-color-picker v-model="form.activecolor" show-alpha size="mini"></el-color-picker>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("inactivecolor") !== -1' label="关闭时背景色">
                <el-color-picker v-model="form.inactivecolor" show-alpha size="mini"></el-color-picker>
              </el-form-item>
              <!-- 滑块 -->
              <el-form-item v-if='form.showFrom.indexOf("showstops") !== -1' label="显示间断">
                <el-switch v-model="form.showstops" active-color="#409EFF" inactive-color="#eee"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("showinput") !== -1' label="输入框" v-show="!form.range">
                <el-switch v-model="form.showinput" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("range") !== -1' label="范围选择">
                <el-switch v-model="form.range" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>

              <!-- 时间选择器 固定时间 -->
              <el-form-item v-if='form.showFrom.indexOf("pickeroptions") !== -1' label="开始时间">
                <el-time-picker
                  v-model="form.pickeroptions.start"
                  placeholder="开始时间"
                  value-format='HH:mm'
                  format='HH:mm'
                  size="mini"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("pickeroptions") !== -1' label="结束时间">
                <el-time-picker
                  v-model="form.pickeroptions.end"
                  placeholder="结束时间"
                  value-format='HH:mm'
                  format='HH:mm'
                  size="mini"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("pickeroptions") !== -1' label="步长">
                <el-time-picker
                  v-model="form.pickeroptions.step"
                  :picker-options="{
                    selectableRange: '00:01:00 - 06:00:00'
                  }"
                  placeholder="步长"
                  value-format='HH:mm'
                  format='HH:mm'
                  size="mini"
                >
                </el-time-picker>
              </el-form-item>

              <!-- 时间选择器 任意时间 -->
              <el-form-item v-if='form.showFrom.indexOf("isrange") !== -1' label="范围选择">
                <el-switch v-model="form.isrange" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("startplaceholder") !== -1 && form.isrange' label="开始位置占位符">
                <el-input v-model="form.startplaceholder" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("endplaceholder") !== -1 && form.isrange' label="结束位置占位符">
                <el-input v-model="form.endplaceholder" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("rangeseparator") !== -1 && form.isrange' label="分隔符">
                <el-input v-model="form.rangeseparator" size="mini"></el-input>
              </el-form-item>

              <!-- 分割线 和 文字 -->
              <el-form-item v-if='form.showFrom.indexOf("text") !== -1' label="显示文字">
                <el-input v-model="form.text" type="textarea" :rows="3"  maxlength="20" show-word-limit></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("contentposition") !== -1 ' label="文字位置">
                <el-select style="width:100%" v-model="form.contentposition" placeholder="请选择" size="mini">
                  <el-option label="左" value="left"></el-option>
                  <el-option label="中" value="center"></el-option>
                  <el-option label="右" value="right"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("fontsize") !== -1' label="文字大小">
                <el-slider
                  v-model="form.fontsize"
                  :min="12"
                  :max="24"
                  :step="1"
                  :show-input="false"
                  :range="false"
                ></el-slider>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("textcolor") !== -1' label="文字颜色">
                <el-color-picker v-model="form.textcolor" show-alpha size="mini"></el-color-picker>
              </el-form-item>
              <el-form-item v-if='form.type == "box"' label="背景颜色">
                <el-color-picker v-model="form.boxback" show-alpha size="mini"></el-color-picker>
              </el-form-item>




              <!-- 日期选择 -->
              <el-form-item v-if='form.showFrom.indexOf("datetype") !== -1 ' label="选择单位">
                <el-select style="width:100%" v-model="form.datetype" placeholder="请选择" size="mini">
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
              <div v-if='form.datetype=="datetimerange"||form.datetype=="daterange"||form.datetype=="monthrange" '>
                <el-form-item v-if='form.showFrom.indexOf("startplaceholder") !== -1 ' label="开始位置占位符">
                  <el-input v-model="form.startplaceholder" size="mini"></el-input>
                </el-form-item>
                <el-form-item v-if='form.showFrom.indexOf("endplaceholder") !== -1 ' label="结束位置占位符">
                  <el-input v-model="form.endplaceholder" size="mini"></el-input>
                </el-form-item>
                <el-form-item v-if='form.showFrom.indexOf("rangeseparator") !== -1 ' label="分隔符">
                  <el-input v-model="form.rangeseparator" size="mini"></el-input>
                </el-form-item>
              </div>
              <el-form-item v-if='form.showFrom.indexOf("startLimit") !== -1' label="最早限制">
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && (form.datetype == "date" || form.datetype == "dates" || form.datetype == "daterange")'
                  v-model="form.startLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type === "datePicker" && form.datetype == "week"'
                  v-model="form.startLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type === "datePicker" && ( form.datetype == "month"|| form.datetype == "monthrange" )'
                  v-model="form.startLimit"
                  :type='"month"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type === "datePicker" && form.datetype == "year"'
                  v-model="form.startLimit"
                  type='year'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && (form.datetype == "datetime" || form.datetype == "datetimerange") '
                  v-model="form.startLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("endLimit") !== -1' label="最晚限制">
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && ( form.datetype == "date" || form.datetype == "dates" || form.datetype == "daterange")'
                  v-model="form.endLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && form.datetype =="week"'
                  v-model="form.endLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && ( form.datetype == "month"|| form.datetype == "monthrange" )  '
                  v-model="form.endLimit"
                  :type='"month"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && form.datetype == "year"'
                  v-model="form.endLimit"
                  type='year'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
                <!-- :type='"datetime"'  value-format="yyyy-MM-dd HH:mm:ss" -->
                <el-date-picker
                  style="width:100%"
                  v-if='form.type==="datePicker" && (form.datetype == "datetime" || form.datetype == "datetimerange") '
                  v-model="form.endLimit"
                  :type='"date"'
                  :placeholder="form.placeholder"
                  :clearable='form.clearable'
                  :disabled='form.disabled'
                  :prefix-icon='form.prefixicon'
                  value-format="yyyy-MM-dd"
                  :start-placeholder='form.startplaceholder'
                  :end-placeholder='form.endplaceholder'
                  :range-separator='form.rangeseparator'
                  size="mini"
                  >
                </el-date-picker>
              </el-form-item>

              <!-- 单选 -->
              <el-form-item v-if='form.showFrom.indexOf("radiotype") !== -1 ' label="展示类型">
                <el-select style="width:100%" v-model="form.radiotype" placeholder="请选择" size="mini">
                  <el-option label="圆圈" value="yuan"></el-option>
                  <el-option label="按钮" value="button"></el-option>
                </el-select>
              </el-form-item>

              <!-- 多选 -->
              <el-form-item v-if='form.showFrom.indexOf("checkboxtype") !== -1 ' label="展示类型">
                <el-select style="width:100%" v-model="form.checkboxtype" placeholder="请选择" size="mini">
                  <el-option label="方块" value="fang"></el-option>
                  <el-option label="按钮" value="button"></el-option>
                </el-select>
              </el-form-item>

              <!-- options -->
              <el-form-item v-if='form.showFrom.indexOf("datatype") !== -1 && ["step", "tab", "reportTable"].indexOf(form.type ) == -1' label="数据类型">
                <el-select style="width:100%" v-model="form.datatype" placeholder="请选择" size="mini">
                  <el-option label="配置数据" value="option"></el-option>
                  <el-option label="接口数据" value="url"></el-option>
                  <el-option label="系统字典" value="system"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("url") !== -1 && form.datatype === "url" ' label="接口地址">
                <el-input v-model="form.url" size="mini"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("url") !== -1 && form.datatype === "url" ' label="显示值">
                <div class="el-input el-input--mini">
                  <input class="el-input__inner" size="mini" v-bind:value="form.props.label" v-on:input="oninput($event.target.value, 'label')">
                </div>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("url") !== -1 && form.datatype === "url" ' label="传递值">
                <div class="el-input el-input--mini">
                  <input class="el-input__inner" size="mini" v-bind:value="form.props.value" v-on:input="oninput($event.target.value, 'value')">
                </div>
              </el-form-item>
              <p v-show="errtip" style="height: 14px; margin: 0; font-size: 12px; color: red; text-indent: 80px; margin-top: -18px;">格式错误</p>
              <el-table
                v-if='form.showFrom.indexOf("option") !== -1 && form.datatype == "option" '
                border
                :data="form.dicData"
                class="tb-edit"
                style="width: 100%"
                highlight-current-row
                size='mini'
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
                    <div style="display: flex;align-items: center;">
                      <el-input
                        v-if="['tab', 'step'].indexOf(form.type) > -1"
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
                      <el-tooltip class="item" effect="dark" content="传递值均为字符串" placement="top" style="margin-left: 5px;">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="暂存接口" v-if="form.type === 'FormGroup'" width="180">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.url"
                      placeholder="请输入内容"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="form.sqlType != 'enum'" :width="['step'].indexOf(form.type) > -1 ? 120 : ''">
                  <template slot-scope="scope">
                    <div>
                      <el-button v-if="['step'].indexOf(form.type) > -1" size="mini" type="text" @click="stepBtnSettingHandle(scope.$index, scope.row)">按钮</el-button>
                      <el-button v-if="['step'].indexOf(form.type) > -1" size="mini" type="text" @click="setHttpHandle('stepEcho', scope.row, scope.$index)">回显</el-button>
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)"
                      >删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-button v-if='form.showFrom.indexOf("option") !== -1 && form.datatype == "option" && form.sqlType != "enum"' size='mini' @click="addoption" style="margin-top:10px">增加选项</el-button>


              <!-- 表格 -->
              <el-form-item v-if='form.showFrom.indexOf("border") !== -1' label="是否边框">
                <el-switch v-model="form.border" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='false && form.showFrom.indexOf("stripe") !== -1' label="斑马纹">
                <el-switch v-model="form.stripe" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm" && !form.editable' label="是否分页">
                <el-switch v-model="form.page" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.type == "tableForm"' label="操作栏">
                <el-select v-model="menuFixTemp" clearable size="mini" style="width:100%;" @change="menuFixChange">
                  <el-option label="左侧" value="left"></el-option>
                  <el-option label="右侧" value="right"></el-option>
                </el-select>
              </el-form-item>

              <!-- 上传请求头 -->
              <!-- <el-form-item v-if='form.showFrom.indexOf("headers") !== -1' label="请求头">
                <el-input v-model="form.headersStr" @blur="form.setRequestHeaderHandle"></el-input>
              </el-form-item> -->

              <!-- 上传 -->
              <el-form-item v-if='form.showFrom.indexOf("multipleUpload") !== -1' label="可否多选">
                <el-switch v-model="form.multipleUpload" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='(form.type === "imageUpload" || form.type === "fileUpload") && form.showFrom.indexOf("limit") !== -1' label="最大允许">
                <el-input-number v-model="form.limit" :min="0" size="mini"></el-input-number>
                <!-- <el-input v-model="form.limit" type=""></el-input> -->
              </el-form-item>
              <el-form-item v-if='(form.type === "imageUpload" || form.type === "fileUpload") && form.showFrom.indexOf("action") !== -1' label="上传配置">
                <jvs-button size="mini" @click="setHttpHandle('upload',form, 'uploadHttp')">配置</jvs-button>
              </el-form-item>

              <!-- 只读表格设置字段 -->
              <el-table
                v-if='form.showFrom.indexOf("keyvalue") !== -1'
                border
                :data="form.option"
                class="tb-edit"
                style="width: 100%"
                highlight-current-row
                size='mini'
              >
                <el-table-column label="字段名">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.value"
                      placeholder="请输入内容"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="显示值">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.label"
                      placeholder="请输入内容"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="字段类型" width="120">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sqlType" :default-first-option="true" placeholder="请选择字段类型" size="mini">
                      <el-option
                        v-for="item in sqlTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)"
                      >删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-button v-if='form.showFrom.indexOf("keyvalue") !== -1' size='mini' @click="addoption" style="margin-top:10px">增加选项</el-button>
              <!-- 尺寸适应 -->
              <el-form-item v-if='form.showFrom.indexOf("fit") !== -1' label="尺寸适应">
                <el-select style="width:100%" v-model="form.fit" placeholder="请选择" size="mini">
                  <el-option label="fill" value="fill"></el-option>
                  <el-option label="contain" value="contain"></el-option>
                  <el-option label="cover" value="cover"></el-option>
                  <el-option label="none" value="none"></el-option>
                  <el-option label="scale-down" value="scale-down"></el-option>
                </el-select>
              </el-form-item>

              <!-- 用户组件 -是否允许输入 -->
              <el-form-item v-if='form.showFrom.indexOf("allowinput") !== -1' label="可否输入">
                <el-switch v-model="form.allowinput" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>

              <!-- 地区选择 -->
              <el-form-item v-if='form.showFrom.indexOf("emitKey") !== -1' label="传递key值">
                <el-select style="width:100%" v-model="form.emitKey" placeholder="请选择key值" size="mini">
                  <el-option label="名称" value="name"></el-option>
                  <el-option label="代码" value="code"></el-option>
                </el-select>
              </el-form-item>

              <!-- 部门组件 -->
              <el-form-item v-if='form.showFrom.indexOf("showalllevels") !== -1' label="显示路径">
                <el-switch v-model="form.showalllevels" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("emitPath") !== -1' label="传递路径">
                <el-switch v-model="form.emitPath" active-color="#409EFF" inactive-color="#eee" size="mini"></el-switch>
              </el-form-item>

              <!-- 下拉 来源 系统字典项 -->
              <el-form-item v-if='form.showFrom.indexOf("datatype") !== -1 && form.datatype == "system"' label="选择字典">
                <el-select style="width:100%" v-model="form.systemDict" placeholder="请选择数据" size="mini" filterable>
                  <el-option v-for="c in systemDictList" :key="c.description+c.uniqId+'select-dic-item'" :label="c.description" :value="c.uniqId"></el-option>
                </el-select>
              </el-form-item>

              <!-- 级联选择 -->
              <el-form-item v-if='form.showFrom.indexOf("cascaderOption") !== -1' label="选择数据">
                <el-select style="width:100%" v-model="form.dictName" placeholder="请选择数据" size="mini" filterable>
                  <el-option v-for="c in classifyDictList" :key="(c.extend ? c.extend.uniqueName : c.name) + 'cascader-item'" :label="c.name" :value="c.extend ? c.extend.uniqueName : c.name"></el-option>
                </el-select>
              </el-form-item>

              <!-- 数据源组件 -->
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1' label="数据来源">
                <el-select style="width:100%" v-model="form.sourceType" placeholder="请选择数据来源" size="mini" filterable>
                  <el-option label="数据源" value="database"></el-option>
                  <el-option label="接口api" value="api"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.sourceType == "api" && form.showFrom.indexOf("sourceTable") !== -1' label="接口api">
                <jvs-button size="mini"  @click="setHttpHandle('api',form, 'apiHttp')">配置</jvs-button>
              </el-form-item>
              <!-- 数据模型 -->
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1 && form.sourceType == "database"' label="数据模型">
                <el-select style="width:100%" v-model="form.dataModelId" placeholder="请选择数据模型" size="mini" filterable @change="tableChangeHandle(form.tableName, itemTableOption, 'tablesItem')">
                  <!-- <el-option v-for='(it,index) in itemTableOption' :key="'datasource-item'+index" :label="it.tableName" :value="it.tableName"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1 && form.sourceType' label="展示信息" class="top-align-item">
                <el-table
                  border
                  :data="form.infoColumn"
                  class="tb-edit"
                  style="width: 100%"
                  highlight-current-row
                  size='mini'
                >
                  <el-table-column label="字段名">
                    <template slot-scope="scope">
                      <div>
                        <el-select
                          v-if='form.sourceType == "database"'
                          style="width:100%"
                          v-model="scope.row.value"
                          allow-create
                          filterable
                          size="mini"
                          clearable
                          @change="changeSource(scope.row, scope.$index, tablesItem, 'infoColumn')"
                        >
                          <el-option  v-for='(item,index) in tablesItem' :key="index" :label="item.fieldName" :value="item.fieldName">
                            <span style="float: left">{{ item.columnComment }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fieldName }}</span>
                          </el-option>
                        </el-select>
                        <el-input v-if='form.sourceType == "api"' v-model="scope.row.value"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="显示值">
                    <template slot-scope="scope">
                      <el-input
                        size="mini"
                        v-model="scope.row.label"
                        placeholder="请输入内容"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <div>
                        <el-button
                          size="mini"
                          type="text"
                          @click="deleteItemOfArr(scope.$index, scope.row, 'infoColumn')"
                        >删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button size='mini' @click="addItemOfArr('infoColumn')" style="margin-top:10px">增加选项</el-button>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1 && form.sourceType' label="查询条件" class="top-align-item">
                <el-table
                  border
                  :data="form.queryProp"
                  class="tb-edit"
                  style="width: 100%"
                  highlight-current-row
                  size='mini'
                >
                  <el-table-column label="字段名">
                    <template slot-scope="scope">
                      <div>
                        <el-select
                          v-if='form.sourceType == "database"'
                          style="width:100%"
                          v-model="scope.row.value"
                          allow-create filterable
                          size="mini"
                          clearable
                          @change="changeSource(scope.row, scope.$index, tablesItem, 'queryProp')"
                        >
                          <el-option  v-for='(item,index) in tablesItem' :key="index" :label="item.fieldName" :value="item.fieldName">
                            <span style="float: left">{{ item.columnComment }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fieldName }}</span>
                          </el-option>
                        </el-select>
                        <el-input v-if='form.sourceType == "api"' v-model="scope.row.value"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="显示值">
                    <template slot-scope="scope">
                      <el-input
                        size="mini"
                        v-model="scope.row.label"
                        placeholder="请输入内容"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <div>
                        <el-button
                          size="mini"
                          type="text"
                          @click="deleteItemOfArr(scope.$index, scope.row, 'queryProp')"
                        >删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button size='mini' @click="addItemOfArr('queryProp')" style="margin-top:10px">增加选项</el-button>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1 && form.sourceType' label="显示字段">
                <el-select v-if='form.sourceType == "database"' style="width:100%" v-model="form.showProp" allow-create filterable size="mini" clearable>
                  <el-option  v-for='(item,index) in tablesItem' :key="index" :label="item.fieldName" :value="item.fieldName">
                    <span style="float: left">{{ item.columnComment }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fieldName }}</span>
                  </el-option>
                </el-select>
                <el-input v-if='form.sourceType == "api"' v-model="form.showProp"></el-input>
              </el-form-item>
              <el-form-item v-if='form.showFrom.indexOf("sourceTable") !== -1 && form.sourceType' label="传递字段">
                <el-select v-if='form.sourceType == "database"' style="width:100%" v-model="form.sendProp" allow-create filterable size="mini" clearable>
                  <el-option  v-for='(item,index) in tablesItem' :key="index" :label="item.fieldName" :value="item.fieldName">
                    <span style="float: left">{{ item.columnComment }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fieldName }}</span>
                  </el-option>
                </el-select>
                <el-input v-if='form.sourceType == "api"' v-model="form.sendProp"></el-input>
              </el-form-item>

              <!-- 按钮组件  样式 -->
              <el-form-item v-if='form.showFrom.indexOf("style") !== -1' label="按钮类型" prop="buttonType">
                <el-select style="width:100%" v-model="form.buttonType" size="mini" clearable>
                  <el-option label="主要按钮" value="primary"></el-option>
                  <el-option label="成功按钮" value="success"></el-option>
                  <el-option label="信息按钮" value="info"></el-option>
                  <el-option label="警告按钮" value="warning"></el-option>
                  <el-option label="危险按钮" value="danger"></el-option>
                </el-select>
              </el-form-item>
              <!-- 按钮组件  是否圆角 -->
              <el-form-item v-if='form.showFrom.indexOf("style") !== -1' label="是否圆角" prop="buttonRound">
                <el-switch size="mini" v-model="form.buttonRound" active-color="#409EFF" inactive-color="#eee"></el-switch>
              </el-form-item>

              <!-- 静态表格  报表类 -->
              <el-form-item v-if='form.type == "reportTable"' label="总标题">
                <el-input v-model="form.rowcolumn"></el-input>
              </el-form-item>
              <!-- iframe高度 -->
              <el-form-item label="显示高度" v-if='form.type == "iframe"'>
                <el-slider
                  v-model="form.iframeheight"
                  :min="100"
                  :max="1500"
                  :step="1"
                  :show-input="false"
                  :range="false"
                ></el-slider>
              </el-form-item>
            </el-form>

          </el-collapse-item>
          <el-collapse-item title="校验设置" name="validate" v-if='form.rules.length > 0'>
            <el-form v-if='form.rules.length > 0' :model="form" label-width="80px" label-position="left" size='mini'>
              <el-form-item label="是否必填">
                <el-switch size="mini" v-model="form.rules[0].required" active-color="#409EFF" inactive-color="#eee"></el-switch>
              </el-form-item>
              <el-form-item label="提示信息" v-if='form.rules[0].required'>
                <el-input size="mini" v-model="form.rules[0].message"></el-input>
              </el-form-item>
              <el-form-item label="正则验证" v-if="form.showFrom.indexOf('regular') !== -1" prop="regularExpression" :rules="regCheck">
                <el-select size="mini" style="width:100%" v-model="form.regularExpression" placeholder="请选择" filterable allow-create>
                  <el-option v-for="re in regExpOption" :key="re.name+'_regExpItem_'+ re.id" :label="re.name" :value="re.expression"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提示信息" v-if="form.showFrom.indexOf('regular') !== -1">
                <el-input size="mini" v-model="form.regularMessage"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="表单设置" name="3">
        <el-form class="form-set-tab-panel" label-position="left" style="margin-top: 10px;padding: 0 20px;" :model="formsetting" label-width="80px" size='mini'>
          <el-form-item label="对齐方式">
            <el-select style="width:100%" v-model="formsetting.labelposition" placeholder="请选择" size='mini'>
              <el-option label="左对齐" value="left"></el-option>
              <el-option label="右对齐" value="right"></el-option>
              <el-option label="顶对齐" value="top"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段宽度">
            <el-slider
              v-model="formsetting.labelwidth"
              :min="80"
              :max="400"
              :step="1"
              :show-input="false"
              :range="false"
              size='mini'
            ></el-slider>
<!--            <el-input-number style="width:100%" :min="80" :max="400" :step="1" stepstrictly v-model="formsetting.labelwidth"></el-input-number>-->
          </el-form-item>
          <el-form-item label="组件尺寸" v-if="false">
            <el-select style="width:100%" v-model="formsetting.formsize" disabled placeholder="请选择" size='mini'>
              <el-option label="大" value="medium"></el-option>
              <el-option label="中" value="small"></el-option>
              <el-option label="小" value="mini"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="组件布局">-->
<!--            <el-radio-group style="width:100%" v-model="columnNum" @change="handleRadioChange">-->
<!--              <el-radio-button :label="24">一列</el-radio-button>-->
<!--              <el-radio-button :label="12">两列</el-radio-button>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
          <el-form-item label="是否全屏">
            <el-switch v-model="formsetting.fullscreen" active-color="#409EFF" inactive-color="#eee" size='mini'></el-switch>
          </el-form-item>
          <el-form-item label="回显设置" v-if="!isFlowDesign" v-show="position != 'top'">
            <!-- <el-input v-model="formsetting.dataEchoRequest.url"></el-input> -->
            <jvs-button size="mini"  @click="setHttpHandle('echo')">配置</jvs-button>
          </el-form-item>

          <el-form-item label="按钮设置">
            <jvs-button size="mini" :disabled="isDetail" @click="buttonSetting">配置</jvs-button>
          </el-form-item>
          <!-- QAQAQAQAQAQAQAQAQAQAQAQAQAQAQAQ -->
          <el-form-item label="提交按钮" v-if="false && formType != 'flowable'">
            <el-switch v-model="formsetting.submitBtn" active-color="#409EFF" inactive-color="#eee"></el-switch>
          </el-form-item>
          <el-form-item label="提交设置" v-if="false && !isFlowDesign" v-show="formsetting.submitBtn && !isFlowableBoolean">
            <jvs-button size="mini" @click="setHttpHandle('submit')">配置</jvs-button>
          </el-form-item>
          <el-form-item label="重置按钮" v-if="false && formType != 'flowable'">
            <el-switch v-model="formsetting.emptyBtn" active-color="#409EFF" inactive-color="#eee"></el-switch>
          </el-form-item>
          <el-form-item label="按钮设置" v-if="false && (formType == 'flowable')">
            <el-switch v-model="formsetting.flag" active-color="#409EFF" inactive-color="#eee" :disabled="(btnType=='network_post_url' || btnType == 'network_get_url' || formType == 'flowable')"></el-switch>
            <el-tooltip v-if="btnType=='network_post_url' || btnType == 'network_get_url'" class="item" effect="dark" content="get/post请求必须自定义按钮" placement="top">
              <i class="el-icon-question" style="color:#409eff;margin-left:10px;"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label-width="0" v-if="false &&  formsetting.flag && formType != 'flowable'">
            <el-table
              border
              :data="formsetting.btnSetting"
              :span-method="arraySpanMethod"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              size='mini'
              header-align="center"
              align="center"
            >
              <el-table-column label="按钮名称">
                <template slot-scope="scope">
                  <el-form-item :style="scope.row.name?'margin-bottom: 0;':'margin-bottom:18px;'" :class="{'is-required':true, 'is-error':(!scope.row.name)}">
                    <el-input
                      size="mini"
                      v-model="scope.row.name"
                      placeholder="请输入内容"
                    ></el-input>
                    <span v-show="!scope.row.name" class="el-form-item__error">必填</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- 请求地址 -->
              <el-table-column label="请求设置">
                <template slot-scope="scope">
                  <el-form-item style="margin-bottom:0;">
                    <jvs-button type='text' size="mini"  @click="setHttpHandle('normal', scope.row, scope.$index)">配置</jvs-button>
                    <!-- <el-input
                      size="mini"
                      v-model="scope.row.url"
                      placeholder="请输入内容"
                    ></el-input> -->
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-if="isFlowableBoolean"
                      size="mini"
                      type="text"
                      @click="configItemOfBtn(scope.$index, scope.row)"
                      >参数</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="deleteItemOfBtn(scope.$index, scope.row, 'formsetting')"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button size='mini' @click="addOneButton" style="margin-top:10px">增加按钮</el-button>
          </el-form-item>
          <el-form-item label-width="0" v-if="formsetting.flag && formType == 'flowable' && false">
            <!-- 工作流调整 表单内不设置按钮 -->
            <el-table
              border
              :data="formsetting.btnSetting"
              :span-method="arraySpanMethod"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              size='mini'
              header-align="center"
            >
              <el-table-column label="功能">
                <template slot-scope="scope">
                  <el-form-item :style="scope.row.name?'margin-bottom: 0;':'margin-bottom:18px;'" :class="{'is-required':true, 'is-error':(!scope.row.name)}">
                    <el-input
                      size="mini"
                      v-model="scope.row.name"
                      placeholder="请输入内容"
                    ></el-input>
                    <span v-show="!scope.row.name" class="el-form-item__error">必填</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="流转值">
                <template slot-scope="scope">
                  <el-form-item style="margin-bottom:0;" v-if="scope.$index < 3 || scope.$index > 5">
                    <el-input
                      size="mini"
                      :disabled="scope.$index < 5"
                      v-model="scope.row.url"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="启用">
                <template slot-scope="scope">
                  <el-form-item style="margin-bottom:0;">
                    <el-checkbox size="mini" v-model="scope.row.enable"></el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-if="scope.$index > 5"
                      size="mini"
                      type="text"
                      @click="deleteItemOfBtn(scope.$index, scope.row, 'formsetting')"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button size='mini' @click="addOneButton" style="margin-top:10px">增加按钮</el-button>
          </el-form-item>
          <el-form-item label="备注" v-if="false">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入备注"
              v-model="formsetting.formRemark">
            </el-input>
          </el-form-item>
          <!-- QAQAQAQAQAQAQAQAQAQAQAQAQAQAQAQ -->
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div v-if="false" class="lajitongdiv" :style="{'z-index':zzcindex+1}" @dragover="dragover" @dragleave="dragleave" @drop="drop"  @dragover.prevent>
      <div style="position: fixed;top: calc(100vh / 2 - 30px);">
        <svg t="1584024586503" v-if='!lj' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2016" width="200" height="200"><path d="M652.8 834.56c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m-128 0c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m281.6-614.4h-153.6v-51.2c0-28.16-23.04-51.2-51.2-51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2c0 28.16 23.04 51.2 51.2 51.2v460.8c0 56.32 46.08 102.4 102.4 102.4h358.4c56.32 0 102.4-46.08 102.4-102.4v-460.8c28.16 0 51.2-23.04 51.2-51.2v-51.2c0-28.16-23.04-51.2-51.2-51.2z m-358.4-25.6c0-15.36 10.24-25.6 25.6-25.6h102.4c15.36 0 25.6 10.24 25.6 25.6v25.6h-153.6v-25.6z m307.2 640c0 28.16-23.04 51.2-51.2 51.2h-358.4c-28.16 0-51.2-23.04-51.2-51.2v-460.8h460.8v460.8z m25.6-512h-512c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h512c15.36 0 25.6 10.24 25.6 25.6 0 12.8-10.24 25.6-25.6 25.6z m-384 512c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z" p-id="2017" fill="#1296db"></path></svg>
        <svg t="1584029734035" v-if='lj' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6049" width="200" height="200"><path d="M652.8 834.56c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m-128 0c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z m281.6-614.4h-153.6v-51.2c0-28.16-23.04-51.2-51.2-51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2h-153.6c-28.16 0-51.2 23.04-51.2 51.2v51.2c0 28.16 23.04 51.2 51.2 51.2v460.8c0 56.32 46.08 102.4 102.4 102.4h358.4c56.32 0 102.4-46.08 102.4-102.4v-460.8c28.16 0 51.2-23.04 51.2-51.2v-51.2c0-28.16-23.04-51.2-51.2-51.2z m-358.4-25.6c0-15.36 10.24-25.6 25.6-25.6h102.4c15.36 0 25.6 10.24 25.6 25.6v25.6h-153.6v-25.6z m307.2 640c0 28.16-23.04 51.2-51.2 51.2h-358.4c-28.16 0-51.2-23.04-51.2-51.2v-460.8h460.8v460.8z m25.6-512h-512c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h512c15.36 0 25.6 10.24 25.6 25.6 0 12.8-10.24 25.6-25.6 25.6z m-384 512c15.36 0 25.6-10.24 25.6-25.6v-307.2c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v307.2c0 12.8 10.24 25.6 25.6 25.6z" p-id="6050" fill="#d4237a"></path></svg>
      </div>
    </div>
    <!-- 按钮设置 -->
    <el-dialog
      title="按钮参数"
      :visible.sync="btnVisible"
      append-to-body
      :before-close="handleCloseBtnParams">
      <el-table
        v-if='btnParamsTable && btnParamsTable.length > 0'
        border
        :data="btnParamsTable"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        size='mini'
      >
        <el-table-column label="显示值" align="center">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.label"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="传递值" align="center">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.value"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                type="text"
                @click="deleteBtnParams(scope.$index, scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:10px;">
        <jvs-button size="mini" @click="addBtnParams">添加</jvs-button>
      </el-row>
      <el-row style="margin-top:10px;display:flex;justify-content: center;">
        <jvs-button type="primary" size="mini" @click="formatParams">确定</jvs-button>
        <jvs-button size="mini" @click="handleCloseBtnParams">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 提交 回显 配置 -->
    <el-dialog
      title="配置"
      append-to-body
      fullscreen
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :before-close="httpClose">
      <dataSourceForm sourceType="data_origin_request" :form="httpData" :disableItems="httpType == 'upload' ? ['httpMethod', 'requestContentType', 'responseContentType'] : []" @submit="submitHandle"></dataSourceForm>
    </el-dialog>
    <!-- 步骤条配置按钮 -->
    <el-dialog
      title="按钮配置"
      v-if="ownBtnVisible"
      :visible.sync="ownBtnVisible"
      append-to-body
      fullscreen
      :before-close="ownBtnClose">
      <el-table
        border
        :data="stepBtnList"
        class="tb-edit step-button-table"
        style="width: 100%"
        highlight-current-row
        size='mini'
        header-align="center"
        align="center"
      >
        <el-table-column label="按钮名称">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item :style="scope.row.name?'margin-bottom: 0;':'margin-bottom:18px;'" :class="{'is-required':true, 'is-error':(!scope.row.name)}">
                <el-input
                  size="mini"
                  v-model="scope.row.name"
                  placeholder="请输入内容"
                ></el-input>
                <span v-show="!scope.row.name" class="el-form-item__error">必填</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- 请求地址 -->
        <el-table-column label="请求设置" width="200">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item style="margin-bottom:0;">
                <jvs-button type='text' size="mini"  @click="setHttpHandle('step', scope.row, scope.$index)">配置</jvs-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="跳转设置" width="300">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item v-if='form.type == "step"' label="">
                <el-radio-group v-model="scope.row.type">
                  <el-radio label="last" v-if="stepBtnIndex !== 0">上一步</el-radio>
                  <el-radio label="next" v-if="stepBtnIndex < form.dicData.length -1">下一步</el-radio>
                  <el-radio label="no">不跳转</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="200">
          <template slot-scope="scope">
            <div class="sort-row-column">
              <i v-if="scope.$index > 0" class="el-icon-top" @click="sortHandle('up', scope.$index)"></i>
              <i v-if="scope.$index < stepBtnList.length -1" class="el-icon-bottom" @click="sortHandle('down', scope.$index)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <div style="text-align:center;">
              <el-button
                size="mini"
                type="text"
                @click="deleteItemOfBtn(scope.$index, scope.row, 'step')"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <jvs-button size="mini" style="margin-top:10px;" @click="addStepBtn">添加</jvs-button>
    </el-dialog>
    <!-- 显示表达式设置 -->
    <el-dialog
      title="显示控制"
      append-to-body
      width="80%"
      :visible.sync="showExpressVisible"
      :before-close="showExpressClose">
      <div v-if="showExpressVisible" class="show-express">
        <div class="left">
          <el-tree
            :data="domTreeData"
            :props="{value: 'prop', children: 'children'}"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="domNodeClick"></el-tree>
        </div>
        <div class="right">
          <jvs-form :formData="showExpressForm" :option="showExpressOption"></jvs-form>
        </div>
      </div>
      <el-row style="display: flex;justify-content: center;align-items:center;">
        <jvs-button size="mini" type="primary" @click="saveShowExpress">保存</jvs-button>
        <jvs-button size="mini" @click="showExpressClose">取消</jvs-button>
      </el-row>
    </el-dialog>
    <!-- 按钮统一配置 -->
    <el-dialog
      title="按钮设置"
      append-to-body
      :visible.sync="buttonSettingVisible"
      :before-close="buttonSettingClose">
      <div v-if="buttonSettingVisible">
        <el-form label-width="80px" label-position="left" size='mini'>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="0">
                <el-table
                  border
                  :data="formsettingTemp.btnSetting"
                  :span-method="arraySpanMethod"
                  class="tb-edit button-set-table"
                  style="width: 100%"
                  highlight-current-row
                  size='mini'
                  header-align="center"
                  align="center"
                >
                  <el-table-column label="按钮名称">
                    <template slot-scope="scope">
                      <el-form-item :style="scope.row.name?'margin-bottom: 0;':'margin-bottom:18px;'" :class="{'is-required':true, 'is-error':(!scope.row.name)}">
                        <el-input
                          size="mini"
                          v-model="scope.row.name"
                          placeholder="请输入内容"
                        ></el-input>
                        <span v-show="!scope.row.name" class="el-form-item__error">必填</span>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="请求设置">
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;" v-if="formType == 'flowable' ? (!scope.row.flag) : (scope.row.buttonType != 'empty' && scope.row.buttonType != 'submit')">
                        <jvs-button type='text' size="mini"  @click="setHttpHandle('normal', scope.row, scope.$index)">配置</jvs-button>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="启用">
                    <template slot-scope="scope">
                      <el-form-item style="margin-bottom:0;">
                        <el-checkbox size="mini" v-model="scope.row.enable"></el-checkbox>
                      </el-form-item>
                    </template>
                  </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                      <div>
                        <el-button
                          v-if="isFlowableBoolean"
                          size="mini"
                          type="text"
                          @click="configItemOfBtn(scope.$index, scope.row)"
                          >参数</el-button>
                        <el-button
                          v-if="!scope.row.flag"
                          size="mini"
                          type="text"
                          @click="deleteItemOfBtn(scope.$index, scope.row, formsettingTemp)"
                        >删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button size='mini' @click="addOneButton" style="margin-top:10px">增加按钮</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;display:flex;justify-content:center;align-items:center;">
            <jvs-button size="mini" type="primary" @click="buttonSettingSubmit">确认</jvs-button>
            <jvs-button size="mini" @click="buttonSettingClose">取消</jvs-button>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {getAvailable, getRegExpList} from '../api/form'
import dataSourceForm from './datasource'
import {getDataSource, getSourceTable, getKeyValue} from '../api/list'
import {addForm} from '../api/formlist'
// import MTextarea from './assembly/textarea'
// import {getSelectData, getJurisdiction} from '../api/tableDesignsenior'
const javaKeyWords =
["abstract","assert","boolean","break","byte","case","catch","char","class","const","continue","default",
"do","double","else","enum","extends","final","finally","float","for","goto","if","implements","import","instanceof"
,"int","interface","long","native","new","package","private","protected","public","return","short","static","strictfp",
"super","switch","synchronized","this","throw","throws","transient","try","void","volatile","while"]
function isReg(reg) {
  let isReg;
  try {
    isReg = eval(reg) instanceof RegExp
  } catch (e) {
    isReg = false
  }
  return isReg
}
export default {
  props: {
    // 中间是否拖动
    drag2: {
      type: String,
      default: () => {
        return '1'
      }
    },
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
    // 激活表单key
    activeForm: {
      type: String,
      default: ''
    },
    formsetting: {
      type: Object
    },
    // 是否为流程
    isFlowable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否为列表页详情按钮
    isDetail: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 流程
    flowableDom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 按钮类型
    fineGrainedType: {
      type: String
    },
    // 传递过来的可选字段
    fields: {
       type: Array,
       default: () => {
         return []
       }
    },
    // 组件对象
    control: {
      type: Object,
      default: () => {
        return {
          // 展示字段
          show: [],
          hide: []
        }
      }
    },
    // 多级表单 / 步骤表单  结构
    levelOption: {
      type: Object,
      default: () => {
        return {
          column: []
        }
      }
    },
    formType: {
      type: String,
      default: () => {
        return 'normalForm'
      }
    },
    btnPostUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    btnType: {
      type: String,
      default: () => {
        return ''
      }
    },
    position: {
      type: String,
      default: () => {
        return ''
      }
    },
    columnNameList: {
      type: Array
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
    allTable: {
      type: Array
    },
    isFlowDesign: {
      type: Boolean
    },
    domList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableOption: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    dataSourceForm
  },
  data() {
    var CheckRegExp = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      let r = isReg('/' + value + '/')
      if(r == false) {
        callback(new Error('正则表达式错误'));
      }else{
        callback();
      }
    };
    return {
      columnNum: '',
      // tableOption: [], // 数据源列表
      activeName: '1',
      needChangeActiveForm: false, // 是否需要改变激活表单key
      formclass: '',
      // 垃圾桶
      lj: true, // false,
      controlValue: '', // 控制值
      groupList: [], // 控制组
      showList: [],
      hideList: [],
      hadSelected: [],
      currentSelect: {},
      errtip: false,
      sqlTypeList: [
        {label:'varchar',value:'varchar'},
        {label:'bit',value:'bit'},
        {label:'char',value:'char'},
        {label:'tinyblob',value:'tinyblob'},
        {label:'tinytext',value:'tinytext'},
        {label:'binary',value:'binary'},
        {label:'clob',value:'clob'},
        {label:'blob',value:'blob'},
        {label:'text',value:'text'},
        {label:'mediumblob',value:'mediumblob'},
        {label:'mediumtext',value:'mediumtext'},
        {label:'longblob',value:'longblob'},
        {label:'longtext',value:'longtext'},
        {label:'tinyint',value:'tinyint'},
        {label:'smallint',value:'smallint'},
        {label:'mediumint',value:'mediumint'},
        {label:'int',value:'int'},
        {label:'integer',value:'integer'},
        {label:'year',value:'year'},
        {label:'bigint',value:'bigint'},
        {label:'float',value:'float'},
        {label:'double',value:'double'},
        {label:'decimal',value:'decimal'},
        {label:'date',value:'date'},
        {label:'time',value:'time'},
        {label:'datetime',value:'datetime'},
        {label:'timestamp',value:'timestamp'},
      ],
      validateBool: false,
      validateRule: false,
      defaultLimit: false,
      defaultLimitText: '',
      allForm: [],
      btnSettingList: [
        {
          name: '提交',
          buttonType: 'submit',
          flag: true,
          enable: true
        },
        {
          name: '重置',
          buttonType: 'empty',
          flag: true,
          enable: true
        },
      ],
      // 详情表单的设置
      // 角色列表
      role: [],
      isFlowableBoolean: false, // 是否关联流程
      flowableDomString: "", // 关联的流程标识
      btnVisible: false, // 按钮参数
      btnRow: {}, // 按钮行
      btnParamsTable: [],
      availableList: [], // 可启动的流程列表
      httpData: {}, // 回显 提交 配置
      dialogVisible: false, // 地址配置弹框
      httpType: '', // 地址类型  submit提交  echo回显
      relationProp: [], // 表格项字段列表   子集的加入parentKey，匹配对应的列表？？？？？？？？？？？？？？
      tableColumnList: [], // 选表后的字段列表
      btnRowIndex: -1, // 当前自定义按钮设置的index
      dataSourceOption: [], // 数据源列表
      tablesItem: [], // 数据源对应的数据表的字段
      regExpOption: [], // 系统的正则
      regCheck: [{validator: CheckRegExp, trigger: ['blur', 'change']}],
      activeAttrs: [], // 属性设置折叠
      formListOption: [], // 表单列表
      stepBtnList: [], // 步骤条 单项 按钮配置项
      ownBtnVisible: false, // 步骤按钮配置
      stepBtnIndex: -1,
      itemTableOption: [], // 自定义选择组件
      eventList: ['button', 'input', 'textarea', 'inputNumber', 'select', 'slider', 'switch', 'datePicker', 'timeSelect', 'timePicker',
      'radio', 'checkbox', 'imageUpload', 'fileUpload', 'htmlEditor', 'cascader', 'datasource', 'chinaArea', 'department', 'role', 'user', 'post'],
      menuFixTemp: '',
      showExpressVisible: false,
      domTreeData: [],
      showExpressForm: {
        relation: []
      },
      showExpressOption: {
        cancal: false,
        btnHide: true,
        column: [
          {
            label: '',
            prop: 'relation',
            type: 'tableForm',
            editable: true,
            addBtn: false,
            delBtn: true,
            hideTop: true,
            tableColumn: [
              {
                label: '字段名',
                prop: 'label',
                disabled: true
              },
              {
                label: '字段名',
                prop: 'prop',
                hide: true
              },
              {
                label: '比较值',
                prop: 'value'
              }
            ]
          }
        ]
      },
      buttonSettingVisible: false, // 按钮统一配置
      formsettingTemp: {}
    }
  },
  created () {
    // console.log(this.allTable)
    // console.log(this.form)
    // 工作流表单设置
    if(this.formType == 'flowable') {
      this.formsetting.flag = true
      this.formsetting.btnSetting = [
        {name: '通过', url: 'ok', enable: true, flag: true},
        {name: '拒绝', url: 'fail', enable: true, flag: true},
        {name: '驳回', url: 'reject', enable: true, flag: true},
        {name: '保存', url: 'save', enable: true, flag: true},
        {name: '指派', url: 'zhipai', enable: true, flag: true},
        // {name: '委派', url: 'weipai', enable: true}
      ]
    }

    // this.getAvailableHandle()
    this.isFlowableBoolean = this.isFlowable
    this.flowableDomString = this.flowableDom.id
    // 获取角色列表
    // getJurisdiction().then(res => {
    //   if(res.code === 0){
    //     this.role = res.data;
    //   }
    // })
    this.allForm = this.levelOption.column

    // 初始化按钮设置
    if(!this.formsetting.btnSetting || this.formsetting.btnSetting.length < 1) {
      this.formsetting.btnSetting = JSON.parse(JSON.stringify(this.btnSettingList))
    }
    if(!this.formsetting.labelposition || this.formsetting.labelposition == '') {
      this.formsetting.labelposition = 'top'
    }
    // get post 只能自定义按钮
    if(this.btnType == 'network_post_url' || this.btnType == 'network_get_url') {
      this.formsetting.flag = true
    }

    if(!this.form.props) {
      this.$set(this.form, 'props', {label: '', value: ''})
    }

    if(this.form.menuFix) {
      this.menuFixTemp = this.form.menuFix
    }
    this.menuFixChange(this.menuFixTemp)

    this.keyChangehandle()
    this.noKeyWord()
    // this.getDataSourceHandle()
    this.getRegExpListHandle()
    this.$forceUpdate()
  },
  computed:{
    fieldsdata () {
      let ret = []
      if(this.columnNameList) {
        ret = this.columnNameList
      }
      // console.log(ret)
      return ret
    },
    fieldKeys () {
      const list = []
      for (let i in this.tableOption) {
        const index = this.domList.findIndex(item => {
          return item.prop === this.tableOption[i].fieldKey
        })
        if (index === -1) {
          list.push({ fieldKey: this.tableOption[i].fieldKey })
        }
      }
      return list
    },
    zzcindex () {
      return this.drag2 === '1' ? -10 : 10
    },
    otherTable: {
      get () {
        let temp = []
        for(let i in this.allTable) {
          temp.push(this.allTable[i])
        }
        return temp
      },
      set () {}
    }
  },
  methods: {
    // 获取可选字段列表
    getOption(arr) {
      const list = []
      for (let i in arr) {
        const index = this.domList.findIndex(item => {
          return item.prop === arr[i].fieldKey
        })
        if (index === -1) {
          list.push({ fieldKey: arr[i].fieldKey })
        }
      }
      return list
    },
    // 组件布局 change事件
    handleRadioChange(e) {
      console.log(e)
      this.$emit('getColumnNum', e)
    },
    drop () {
      this.lj = false
      this.$emit('deletecom')
    },
    dragover () {
      this.lj = true
      console.log('滑动时')
    },
    dragleave () {
      this.lj = false
      console.log('出去了')
    },
    // 联动控制改变时清空控制子集
    hasChildrenChange (form) {
      form.children = []
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
        let temp = {}
        for(let i in this.form.dicData) {
          let keys = Object.keys(this.form.column)
          let name = this.form.dicData[i].name
          if(keys.indexOf(name) > -1) {
            temp[name] = this.form.column[name]
          }
        }
        this.form.column = temp
      }
      // 删除步骤时，调整当前项
      if(this.form.type === 'step') {
        if(this.form.dicData && this.form.dicData.length > 0) {
          this.form.activeName = this.form.dicData[0].name
          this.$forceUpdate()
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
    addControl() {
    },
    isInArr(val, arr,str) {
      for(let i in arr){
        if(arr[i][str] === val){
          return true
        }
      }
      return false
    },
    getUrlData(){
      console.log(this.form.url)
      if(/^http[s]?:\/\/.*/.test(this.form.url) || /^\//.test(this.form.url)){
        this.errtip = false
      }else{
        this.errtip = true
      }
      let url = this.form.url
      getSelectData(url).then(res => {
        console.log(res)
        if(res.code === 0) {
          _this.form.option = res.data
        }
      })
    },
    keyChangehandle (type) {
      for(let i in this.fieldsdata){
        if(this.fieldsdata[i].aliasColumnName === this.form.prop || this.fieldsdata[i].fieldName === this.form.prop) {
          // 下拉选择
          if(this.form.type == 'select') {
            // url
            if(this.fieldsdata[i].associatedFieldHttp) {
              this.form.url = this.fieldsdata[i].associatedFieldHttp
              this.form.datatype = 'url'
            }
            // label value 配置
            if(!this.form.props) {
              this.form.props = {
                label: '',
                value: ''
              }
            }
            if(this.fieldsdata[i].associatedFields) {
              this.form.props.value = this.fieldsdata[i].associatedFields.columnName
            }
            if(this.fieldsdata[i].displayField) {
              this.form.props.label = this.fieldsdata[i].displayField.columnName
            }
          }
          // 修改对应的label placeholder
          this.form.label = this.fieldsdata[i].columnComment
          this.form.placeholder = (this.form.type == 'select' ? '请选择' : '请输入') + this.fieldsdata[i].columnComment
          // if(['Tab','TableForm','Section'].indexOf(this.form.type) === -1) {
          //   this.form.sqlType = this.fieldsdata[i].type
          // }
        }
      }
      this.noKeyWord()
      if(type == 'other') {
        for(let f in this.otherTable) {
          if(this.otherTable[f].tableName == this.form.prop) {
            this.relationProp = this.otherTable[f].autoTableFields
          }
        }
      }
    },
    // 过滤关键词
    noKeyWord () {
      if(javaKeyWords.indexOf(this.form.prop) !== -1) {
        this.validateBool = true
        this.form.prop = ''
      }else{
        this.validateBool = false
      }
      this.validateRule = false
      // if(/^[a-zA-Z]*$/.test(this.form.prop)) {
      //   this.validateRule = false
      // }else{
      //   this.validateRule = true
      // }
    },
    // 限制长度
    limitDefaultHandle () {
      if(this.form.type === "Checkbox") {
        if(this.form.defaultValue) {
          let arr = this.form.defaultValue.split(",")
          if(arr.length >= this.form.min && arr.length <= this.form.max) {
            this.defaultLimit = false
          }
          if(arr.length < this.form.min) {
            this.defaultLimit = true
            this.defaultLimitText = '最少填写' + this.form.min + '个值'
          }
          if(arr.length > this.form.max) {
            this.defaultLimit = true
            this.defaultLimitText = '最多填写' + this.form.max + '个值'
          }
        }else{
          this.defaultLimit = false
        }
      }
    },
    // 添加表单
    addOneForm() {
      let temp = {
        label: '表单'+ new Date().getTime(),
        name: 'form' + new Date().getTime(),
        defaultData: {},
        formOption: {
          column: []
        }
      }
      this.allForm.push(temp)
      this.$emit('updateForms', this.allForm)
      this.$forceUpdate()
    },
    // 删除表单
    deleteTabForm(index, row) {
      this.allForm.splice(index, 1)
      this.$emit('updateForms', this.allForm)
      // 删除的是当前激活的表单
      if(row.name == this.activeForm) {
        this.$emit('changeActiveForm', null)
      }
      this.$forceUpdate()
    },
    // 改变表单字段
    changeFormId (str) {
      this.$emit('updateForms', this.allForm)
      if(this.needChangeActiveForm) {
        this.$emit('changeActiveForm', str)
      }
    },
    // 改变字段前先判断是否为激活状态
    isActive (str) {
      if(str == this.activeForm) {
        this.needChangeActiveForm = true
      }else{
        this.needChangeActiveForm = false
      }
    },
    deleteItemOfBtn (index, item, type) {
      if(type == 'step') {
        this.form.dicData[this.stepBtnIndex].btns.splice(index, 1)
      }else{
        this.formsettingTemp.btnSetting.splice(index, 1)
      }
    },
    addOneButton () {
      if(this.formType == 'flowable') {
        this.formsettingTemp.btnSetting.push({buttonType: 'custom'})
      }else{
        this.formsettingTemp.btnSetting.push({name: ('按钮' + (this.formsettingTemp.btnSetting.length + 1)), buttonType: 'custom'})// , flag: false
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      return [1, 1];
      if (rowIndex < 3) {
        if (columnIndex === 1) {
          return [1, 2];
        } else if (columnIndex === 0) {
          return [1, 1];
        }
      }
    },
    isRepeat(str) {
      if(!str) {
        return false
      }
      let arr = []
      for(let i in this.allForm) {
        arr.push(this.allForm[i].name)
      }
      let counts = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)
      if(counts(arr, str) < 2) {
        return false
      }else{
        return true
      }
    },
    // 改变flowable设置参数
    changeFlowable () {
      this.$emit('flowChange', {
        isFlowable: this.isFlowableBoolean,
        flowableDom: this.getItemOfList(this.flowableDomString, 'id', this.availableList)
      })
    },
     // 配置按钮所需参数
    configItemOfBtn (index, item) {
      this.btnRow = item
      let temp = []
      if(this.btnRow.params) {
        for(let i in this.btnRow.params) {
          temp.push({
            label: i,
            value: this.btnRow.params[i]
          })
        }
        this.btnParamsTable = temp
      }
      this.btnVisible = true
    },
    // 添加参数
    addBtnParams () {
      this.btnParamsTable.push({
        label: '',
        value: ''
      })
    },
    // 删除按钮参数
    deleteBtnParams (index, row) {
      this.btnParamsTable.splice(index, 1)
    },
    // 格式化按钮参数
    formatParams () {
      let obj = {}
      for(let i in this.btnParamsTable) {
        obj[this.btnParamsTable[i].label] = this.btnParamsTable[i].value
      }
      this.btnRow.params = obj
      this.handleCloseBtnParams()
    },
    // 关闭按钮参数弹框
    handleCloseBtnParams () {
      this.btnVisible = false
    },
    getAvailableHandle () {
      getAvailable().then(res => {
        if(res.data.code == 0) {
          this.availableList = res.data.data.data
        }
      })
    },
    getItemOfList (val, attr, list) {
      let tp = {}
      for(let i in list) {
        if(list[i][attr] == val) {
          tp = list[i]
        }
      }
      return tp
    },
    oninput (val, attr) {
      this.$set(this.form.props, attr, val)
    },
    // 打开地址设置
    setHttpHandle (type, row, index) {
      this.httpType = type
      if((row && row.buttonType == 'submit') || type == 'submit') {
        this.httpType = row ? row.buttonType : type
        if(this.formsetting.dataSubmissionRequest) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(this.formsetting.dataSubmissionRequest))
          }
        }
      }else if(type == 'echo'){
        if(this.formsetting.dataEchoRequest) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(this.formsetting.dataEchoRequest))
          }
        }
      }else if(type == 'tableEcho') {
        if(this.form.tableEchoRequest) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(this.form.tableEchoRequest))
          }
        }
      }else if(type == 'tableDelete'){
        if(this.form.tableDeleteRequest) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(this.form.tableDeleteRequest))
          }
        }
      }else if(type == 'eventHttp'){
        if(this.form.eventHttp) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(this.form.eventHttp))
          }
        }
      }else if(type == 'api'){
        if(row.apiHttp) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(row.apiHttp))
          }
        }
      }else if(type == 'upload'){
        if(row.uploadHttp) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(row.uploadHttp))
          }
        }else{
          this.httpData = {
            http: {
              httpMethod: "POST",
              requestContentType: "MULTIPART",
              responseContentType: "JSON",
              url: "/mgr/jvs-auth/upload/jvs-public"
            }
          }
        }
      }else if(type == 'stepEcho'){
        if(row.echoHttp) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(row.echoHttp))
          }
        }
        this.btnRowIndex = index
      }else{
        // 按钮设置
        if(row) {
          this.httpData = {
            http: JSON.parse(JSON.stringify(row))
          }
        }
        this.btnRowIndex = index
      }
      // 流程设计器---查看数据结构时需调整外层弹框的关闭按钮 z-index
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 0})
      }
      this.dialogVisible = true
    },
    httpClose () {
      this.dialogVisible = false
      this.httpData = {
        http: {}
      }
      this.btnRowIndex = -1
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 9})
      }
    },
    submitHandle (data) {
      if(['submit', 'echo'].indexOf(this.httpType) > -1) {
        this.$set(this.formsetting, (this.httpType == 'submit' ? 'dataSubmissionRequest' : 'dataEchoRequest'), data.http)
      }else if(this.httpType == 'tableEcho'){
        this.$set(this.form, 'tableEchoRequest', data.http)
      }else if(this.httpType == 'tableDelete'){
        this.$set(this.form, 'tableDeleteRequest', data.http)
      }else if(this.httpType == 'eventHttp'){
        this.$set(this.form, 'eventHttp', data.http)
      }else if(this.httpType == 'api'){
        this.$set(this.form, 'apiHttp', data.http)
      }else if(this.httpType == 'upload'){
        this.$set(this.form, 'uploadHttp', data.http)
        this.$set(this.form, 'action', data.http.url)
        this.$set(this.form, 'headers', data.http.headers)
      }else if(this.httpType == 'stepEcho'){
        this.$set(this.form.dicData[this.btnRowIndex], 'echoHttp', data.http)
      }else{
        let tb = null
        if(this.httpType == 'step') {
          tb = this.stepBtnList
        }else{
          tb = this.formsettingTemp.btnSetting
        }
        if(this.btnRowIndex > -1) {
          let name = tb[this.btnRowIndex].name
          let obj = data.http
          obj.name = name
          this.$set(tb, this.btnRowIndex, obj)
        }
      }
      this.$forceUpdate()
      this.httpClose()
    },
    // 数据源切换
    changeOriginTable (val, attr, prop) {
      this.$set(this.form, prop, "")
      getSourceTable(val).then(res => {
        if(res.data.code == 0) {
          this[attr] = res.data.data
        }
      })
    },
    // 数据表切换
    tableChangeHandle (val, list, attr) {
      for(let i in list) {
        if(list[i].tableName == val) {
          this[attr] = list[i].autoTableFields
        }
      }
    },
    // 字段名称change
    aliasColumnNameChangeHandle (val) {
      for(let i in this.tableColumnList) {
        if(this.tableColumnList[i].fieldName == val || this.tableColumnList[i].aliasColumnName == val) {
          this.form.label = this.tableColumnList[i].columnComment
          this.form.placeholder = this.form.type == 'select' ? ('请选择' + this.form.label) : ('请输入' + this.form.label)
          this.form.columnNameProp = this.tableColumnList[i].columnName
          this.form.foreignKeyProp = this.tableColumnList[i].foreignKey || ''
        }
      }
    },
    infoColumnChange (val, prop) {
      let temp = []
      for(let i in this.tablesItem) {
        if(val.indexOf(this.tablesItem[i].fieldName) > -1) {
          temp.push(this.tablesItem[i])
        }
      }
      if(prop == 'infoColumn') {
        this.$set(this.form, 'infoColumnFields', temp)
      }
      if(prop == 'queryProp') {
        this.$set(this.form, 'queryColumnFields', temp)
      }
    },
    // 获取数据源列表
    getDataSourceHandle () {
      getDataSource().then(res => {
        if(res.data.code == 0) {
          this.dataSourceOption = res.data.data
        }
      })
    },
    getRegExpListHandle () {
      getRegExpList().then(res => {
        if(res.data.code == 0) {
          this.regExpOption = res.data.data
        }
      })
    },
    // 步骤配置按钮
    stepBtnSettingHandle (index, row) {
      if(row.btns) {
        this.stepBtnList = row.btns
      }
      this.stepBtnIndex = index
      // 流程设计器---查看数据结构时需调整外层弹框的关闭按钮 z-index
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 0})
      }
      this.ownBtnVisible = true
    },
    ownBtnClose () {
      this.ownBtnVisible = false
      this.stepBtnList = []
      this.stepBtnIndex = -1
      let dom = $("#flowableDesignDialog .el-dialog__header .el-dialog__headerbtn", parent.document)
      if(dom) {
        dom.css({'z-index': 9})
      }
    },
    addStepBtn () {
      this.stepBtnList.push({name: '按钮' + (this.stepBtnList.length + 1)})
      this.$forceUpdate()
    },
    designBtnForm (type) {
      let attr = ''
      if(type == 'add') {
        attr = 'addBtnFormCode'
      }else if(type == 'edit'){
        attr = 'editBtnFormCode'
      }else{
        attr = 'viewBtnFormCode'
      }
      if(!this.form[attr]) {
        // 新增表单code
        this.$store.state.formCode = ""
        addForm({type: 'normalForm', useTemplate: true}).then(res => {
          if(res.data.code == 0) {
            let code = res.data.data.name
            this.$set(this.form, attr, code)
            this.$root.eventBus.$emit('toolEvent', 'save')
            this.$store.state.formCode = code
          }
        })
      }else{
        // 直接打开设计
        this.$openUrl(`/page-design-ui/#/form?name=${this.form[attr]}`)
      }
    },
    addItemOfArr (prop) {
      if(!this.form[prop]) {
        this.$set(this.form, prop, [])
      }
      this.form[prop].push({})
    },
    deleteItemOfArr (index, row, prop) {
      this.form[prop].splice(index, 1)
    },
    // 字段change显示对应label
    changeSource (row, index, list, prop) {
      for(let i in list) {
        if(list[i].fieldName == row.value) {
          this.$set(this.form[prop][index], 'label', list[i].columnComment)
        }
      }
      let temp = []
      for(let i in this.form[prop]) {
        temp.push(this.form[prop][i].value)
      }
      this.infoColumnChange(temp, prop)
    },
    // 表格操作栏固定
    menuFixChange (val) {
      if(val) {
        this.$set(this.form, 'menuFix', val)
      }else{
        this.$set(this.form, 'menuFix', false)
      }
    },
    // 步骤按钮 重排顺序
    sortHandle (type, index) {
      index = Number.parseInt(index)
      let own = JSON.parse(JSON.stringify(this.stepBtnList[index]))
      let change = null
      if(type == 'up') {
        change = JSON.parse(JSON.stringify(this.stepBtnList[index-1]))
        this.$set(this.stepBtnList, (index-1), own)
        this.$set(this.stepBtnList, index, change)
      }
      if(type == 'down') {
        change = JSON.parse(JSON.stringify(this.stepBtnList[index+1]))
        this.$set(this.stepBtnList, (index+1), own)
        this.$set(this.stepBtnList, index, change)
      }
    },
    showExpressClose () {
      this.showExpressVisible = false
      this.showExpressForm = {
        relation: []
      }
    },
    // 设置显示控制
    setShowHandle () {
      if(this.form.displayExpress) {
        this.$set(this.showExpressForm, 'relation', this.form.displayExpress)
      }
      this.domTreeData = []
      this.getDomTree(this.domList, this.domTreeData)
      this.showExpressVisible = true
    },
    // 获取设计dom树
    getDomTree (list, result, prop) {
      for(let i in list) {
        if(["p", "divider", "box", "tableForm", "reportTable", "button", "link", "iframe"].indexOf(list[i].type) == -1) {
          let temp = {
            label: list[i].label,
            prop: list[i].prop
          }
          if(prop) {
            temp.parent = prop
          }
          if(["formbox"].indexOf(list[i].type) == -1 && list[i].children && list[i].children.length > 0) {
            temp.children = []
            let pa = []
            if(prop) {
              pa  = prop
            }
            pa.push(list[i].prop)
            this.getDomTree(list[i].children, temp.children, pa)
          }
          if(["tab", "step"].indexOf(list[i].type) > -1) {
            temp.children = []
            for(let t in list[i].dicData) {
              if(list[i].dicData[t].name && list[i].column && list[i].column[list[i].dicData[t].name] && list[i].column[list[i].dicData[t].name].length > 0) {
                let tp = {
                  label: list[i].dicData[t].label,
                  prop: list[i].dicData[t].name,
                  children: []
                }
                let dp = []
                if(prop) {
                  dp = prop
                }
                tp.parent = [...dp, list[i].prop]
                this.getDomTree(list[i].column[list[i].dicData[t].name] , tp.children, [...tp.parent, list[i].dicData[t].name])
                temp.children.push(tp)
              }
            }
          }
          result.push(temp)
        }

      }
    },
    domNodeClick (data) {
      let temp = {
        label: data.label,
        prop: data.prop,
        value: ''
      }
      if(data.parent) {
        temp.parent = data.parent
      }
      this.showExpressForm.relation.push(temp)
    },
    // 保存
    saveShowExpress () {
      let temp = []
      if(this.showExpressForm.relation && this.showExpressForm.relation.length > 0) {
        temp = this.showExpressForm.relation
      }
      this.$set(this.form, 'displayExpress', temp)
      this.showExpressClose()
    },
    // 按钮统一配置
    buttonSetting () {
      this.formsettingTemp = JSON.parse(JSON.stringify(this.formsetting))
      for(let i in this.formsettingTemp.btnSetting) {
        if(this.formsettingTemp.btnSetting[i].buttonType == "submit") {
          this.$set(this.formsettingTemp.btnSetting[i], 'enable' ,this.formsettingTemp.submitBtn)
        }
        if(this.formsettingTemp.btnSetting[i].buttonType == "empty") {
          this.$set(this.formsettingTemp.btnSetting[i], 'enable', this.formsettingTemp.emptyBtn)
        }
      }
      this.buttonSettingVisible = true
    },
    buttonSettingClose () {
      this.buttonSettingVisible = false
      this.formsettingTemp = {}
    },
    buttonSettingSubmit () {
      for(let i in this.formsettingTemp.btnSetting) {
        if(this.formsettingTemp.btnSetting[i].buttonType == "submit") {
          this.$set(this.formsetting, 'submitBtn', this.formsettingTemp.btnSetting[i].enable)
        }
        if(this.formsettingTemp.btnSetting[i].buttonType == "empty") {
          this.$set(this.formsetting, 'emptyBtn', this.formsettingTemp.btnSetting[i].enable)
        }
      }
      this.$set(this.formsetting, 'btnSetting', this.formsettingTemp.btnSetting)
      this.buttonSettingClose()
    }
  },
  watch: {
    form: function (newVal, oldVal) {
      let validateTypes = ["cascader", "datasource", "imageUpload", "fileUpload", "colorSelect", "iconSelect",
        "htmlEditor", "department", "role", "user", "post", "chinaArea"]
      if(validateTypes.indexOf(newVal.type) > -1) {
        if(!newVal.rules || newVal.rules.length == 0) {
          let msgstr = '请选择'
          if(["imageUpload", "fileUpload"].indexOf(newVal.type) > -1){
            msgstr = '请上传文件'
            if(newVal.type == 'imageUpload') {
              msgstr = '请上传图片'
            }
          }
          if(newVal.type == 'htmlEditor') {
            msgstr = '请输入' + newVal.label
          }
          newVal.rules = [{ required: false, message: msgstr, trigger: 'change' } ]
        }
        // if(newVal.showFrom.indexOf('regular') == -1) {
        //   newVal.showFrom.push('regular')
        // }
      }
      let thiz = this
      this.formclass = 'animated bounceInRight'
      let timer = setTimeout(function () {
        thiz.formclass = ''
        window.clearTimeout(timer)
      }, 1000)
      console.log('bianhua')
      this.activeName = '1'
      this.$forceUpdate()
    },
    stepBtnList: {
      handler(newVal, oldVal) {
        if(this.stepBtnIndex > -1) {
          this.$set(this.form.dicData[this.stepBtnIndex], 'btns', newVal)
        }
      }
    }
  }
};
</script>

<style scoped>
.attrcont{
  position: relative;
  min-height: calc(100% - 2px);
}
.attrcontzzc{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #F6F6F6;
  box-shadow: none;
}
.lajitongdiv{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.attrcont{
  .el-tabs{
    animation: none;
    .el-tabs__content{
      padding: 0;
    }
  }
  .no-label-item{
    .el-form-item__content{
      margin-left: 0!important;
    }
  }
}
.attribute-collapse{
  border: 0;
  background: none;
  .el-collapse-item{
    //margin-bottom: 20px;
    margin-bottom: 0;
    .el-collapse-item__header, .el-collapse-item__wrap{
      //background: none;
    }
    .el-collapse-item__content{
      //margin-top: 10px;
      padding: 10px 0;
      .el-form-item{
        margin-bottom: 12px;
      }
      .el-form-item__label{
        font-size: 12px;
      }
    }
    .el-collapse-item__header{
      height: 40px;
      line-height: 40px;
      position: relative;
      background: #EFF2F7;
      padding: 0 10px;
      //margin-bottom: 10px;
      .el-collapse-item__arrow{
        position: absolute;
        right: 10px;
        top: 13px
      }
    }
    .el-collapse-item__wrap{
      padding: 0 20px;
    }
  }
}
.top-align-item{
  .el-form-item__content{
    margin-left: 0!important;
  }
}
.step-button-table{
  .el-table__header-wrapper{
    thead{
      .cell{
        text-align: center;
      }
    }
  }
  .el-table__body{
    tbody{
      .el-form-item__content{
        text-align: center;
      }
    }
  }
  .sort-row-column{
    text-align: center;
    i{
      cursor: pointer;
      font-size: 20px;
      margin-right: 10px;
    }
  }
}
.show-express{
  display: flex;
  width: 100%;
  overflow: hidden;
  .right{
    flex: 1;
    overflow: hidden;
    overflow-x: auto;
  }
  .el-tree{
    width: 250px;
    min-width: 250px;
    max-width: 350px;
    height: 385px;
    overflow: hidden;
    overflow-y: auto;
    border-right: 1px solid #DCDFE6;
  }
  .el-tree::-webkit-scrollbar{
    display: none;
  }
  .el-form{
    .table-form{
      .table-body-box{
        .el-table__body-wrapper {
          height: 329px!important;
        }
      }
      .jvs-table{
        .cell{
          .el-input__inner{
            text-align: center;
          }
        }
      }
    }
  }
}
.button-set-table{
  thead{
    tr{
      th{
        text-align: center;
      }
    }
  }
  tbody{
    tr{
      td{
        .cell{
          text-align: center;
        }
      }
    }
  }
}
.form-set-tab-panel{
  .el-form-item{
    margin-bottom: 12px;
  }
  .el-form-item__label{
    font-size: 12px;
  }
}
</style>
