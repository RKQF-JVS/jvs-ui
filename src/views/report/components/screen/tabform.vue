<template>
  <div>
    <!-- 文本输入 -->
    <el-form
      class="demo-form-inline"
      :model="component"
      label-position="left"
      label-width="100px"
      size="medium"
      ref="settingForm"
    >
      <div v-if="component.type == commonConstants.componentsType.panel" class="basicbox">
        <el-form-item label="大屏宽度" prop="width">
          <el-input v-model="component.width">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="大屏高度" prop="height">
          <el-input v-model="component.height">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="背景图片" prop="height">  
          <el-input v-model="component.imgUrl">
            <template slot="append">
              <!-- <el-upload
                class="upload-demo"
                style="text-align:center;"
                ref="uploadBtn"
                action="/mgr/jvs-auth/upload/jvs-public"
                :show-file-list="false"
                :auto-upload="true"
                :headers="header"
                :file-list="fileList"
                :before-upload="beforeUpload"
                :on-change="onChange"
                :on-success="successHandle"
                :on-error="errHandle"
              >
                <jvs-button icon="el-icon-upload"></jvs-button>
              </el-upload> -->
              <jvs-button icon="el-icon-upload" @click="handleFocus('bg')"></jvs-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="背景颜色" prop="background">
          <el-color-picker
            v-model="component.background"
            size="small"
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
      </div>
      <div v-if="component.type != commonConstants.componentsType.panel">
        <el-collapse>
          <el-collapse-item title="坐标">
            <el-form-item label="当前x轴坐标" prop="x">
              <el-input v-model.number="component.x"></el-input>
            </el-form-item>
            <el-form-item label="当前y轴坐标" prop="y">
              <el-input v-model.number="component.y"></el-input>
            </el-form-item>
            <el-form-item label="当前宽度" prop="w">
              <el-input
                v-model.number="component.w"
                @change="changeWidth(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="当前高度" prop="h">
              <el-input
                v-model.number="component.h"
                @change="changeHeight(component)"
              ></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="component.type == commonConstants.componentsType.picture">
        <el-collapse>
          <el-collapse-item title="图片">
            <el-form-item label="图片路径" prop="height">
              <el-input v-model="component.imgUrl">
                <template slot="append">
                  <!-- <el-upload
                    class="upload-demo"
                    style="text-align:center;"
                    ref="uploadBtn"
                    action="/mgr/jvs-auth/upload/jvs-public"
                    :show-file-list="false"
                    :auto-upload="true"
                    :headers="header"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-change="onChange"
                    :on-success="successHandle"
                    :on-error="errHandle"
                  >
                    <jvs-button icon="el-icon-upload"></jvs-button>
                  </el-upload> -->
                  <jvs-button icon="el-icon-upload" @click="handleFocus('img')"></jvs-button>
                </template>
              </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="component.type == commonConstants.componentsType.text">
        <el-collapse>
          <el-collapse-item title="文本设置">
            <el-form-item label="文本类型" prop="textType">
              <el-select v-model="component.textType" placeholder="请选择">
                <el-option
                  v-for="item in selectUtil.textType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源">
              <el-radio-group
                v-model="component.columnDataSource"
                @change="dataSourceChange"
              >
                <el-radio label="1">自定义</el-radio>
                <el-radio label="2">接口</el-radio>
                <el-radio label="3">数据集</el-radio>
              </el-radio-group>
              <el-button
                v-if="component.columnDataSource == '1'"
                round
                type="warning"
                @click="editCustomColumnData(component)"
                >编辑</el-button
              >
              <el-button
                v-if="component.columnDataSource == '2'"
                round
                type="warning"
                @click="categoryApiSetting(component, '4')"
                >接口配置</el-button
              >
              <el-button
                v-if="component.columnDataSource == '3'"
                round
                type="warning"
                @click="categoryDatasourceSetting(component, '4')"
                >数据集配置</el-button
              >
            </el-form-item>
            <el-form-item label="是否定时刷新" v-if="component.columnDataSource != '1'">
              <el-switch v-model="component.isRefresh"> </el-switch>
            </el-form-item>
            <el-form-item label="刷新时间" v-if="component.isRefresh">
              <el-input v-model="component.refreshTime">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
            <el-form-item label="字体大小" prop="style.fontSize">
              <el-input v-model="component.style.fontSize">
                <template slot="append">pt</template>
              </el-input>
            </el-form-item>
            <el-form-item label="字体颜色" prop="style.color">
              <el-color-picker
                v-model="component.style.color"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体背景色" prop="style.background">
              <el-color-picker
                v-model="component.style.background"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体间距" prop="style.letterSpacing">
              <el-input v-model="component.style.letterSpacing">
                <template slot="append">px</template>
              </el-input>
            </el-form-item>
            <el-form-item label="是否加粗" prop="style.fontWeight">
              <el-switch v-model="component.style.fontWeight"> </el-switch>
            </el-form-item>
            <el-form-item
              label="水平对齐"
              prop="style.textAlign"
              v-if="component.textType == 'text' || component.textType == 'link'"
            >
              <el-select v-model="component.style.textAlign" placeholder="请选择">
                <el-option
                  v-for="item in selectUtil.textAlign"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="垂直对齐"
              prop="style.verticalAlign"
              v-if="component.textType == 'text' || component.textType == 'link'"
            >
              <el-select v-model="component.style.verticalAlign" placeholder="请选择">
                <el-option
                  v-for="item in selectUtil.verticalAlign"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="滚动速度"
              prop="speed"
              v-if="component.textType == 'marquee'"
            >
              <el-input v-model.number="component.speed">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="链接地址"
              prop="href"
              v-if="component.textType == 'link'"
            >
              <el-input type="textarea" v-model="component.href"> </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="component.type == commonConstants.componentsType.table">
        <el-collapse>
          <el-collapse-item title="数据列">
            <el-button type="primary" @click="showAddTableColumn('1')">新增</el-button>
            <el-button type="warning" @click="resetTableContent(component, '1')"
              >重置</el-button
            >
            <el-table :data="component.tableColumn" border style="width: 100%">
              <el-table-column prop="name" label="名称"> </el-table-column>
              <el-table-column prop="key" label="属性"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="showAddTableColumn('2', scope.row, scope.$index)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteTableColumn(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="数据来源">
            <el-form-item label="数据来源">
              <el-radio-group
                v-model="component.columnDataSource"
                @change="dataSourceChange"
              >
                <el-radio label="1">自定义</el-radio>
                <el-radio label="2">接口</el-radio>
                <el-radio label="3">数据集</el-radio>
              </el-radio-group>
              <el-button
                v-if="component.columnDataSource == '1'"
                round
                type="warning"
                @click="editCustomColumnData(component)"
                >编辑</el-button
              >
              <el-button
                v-if="component.columnDataSource == '2'"
                round
                type="warning"
                @click="categoryApiSetting(component, '3')"
                >接口配置</el-button
              >
              <el-button
                v-if="component.columnDataSource == '3'"
                round
                type="warning"
                @click="categoryDatasourceSetting(component, '3')"
                >数据集配置</el-button
              >
            </el-form-item>
            <el-form-item label="是否定时刷新" v-if="component.columnDataSource != '1'">
              <el-switch v-model="component.isRefresh"> </el-switch>
            </el-form-item>
            <el-form-item label="刷新时间" v-if="component.isRefresh">
              <el-input v-model="component.refreshTime">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button round type="primary" @click="resetTableContent(component, '2')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="表格样式">
            <el-form-item label="显示序号" prop="style.showIndex">
              <el-switch
                v-model="component.style.showIndex"
                @change="reLoadTable(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="序号列宽度"
              prop="style.indexWidth"
              v-if="component.style.showIndex"
            >
              <el-input
                v-model="component.style.indexWidth"
                @change="reLoadTable(component)"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="显示边框" prop="style.isBorder">
              <el-switch
                v-model="component.style.isBorder"
                @change="reLoadTable(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              v-if="component.style.isBorder"
              label="边框宽度"
              prop="style.borderWidth"
            >
              <el-input
                v-model="component.style.borderWidth"
                @change="reLoadTable(component)"
              >
                <template slot="append">px</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="component.style.isBorder"
              label="边框颜色"
              prop="style.borderColor"
            >
              <el-color-picker
                v-model="component.style.borderColor"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetTableContent(component, '3')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="表头样式">
            <el-form-item label="高度" prop="headStyle.height">
              <el-input
                v-model="component.headStyle.height"
                @change="reLoadTable(component)"
              >
                <template slot="append">px</template>
              </el-input>
            </el-form-item>
            <el-form-item label="背景颜色" prop="headStyle.backgroundColor">
              <el-color-picker
                v-model="component.headStyle.backgroundColor"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体颜色" prop="headStyle.color">
              <el-color-picker
                v-model="component.headStyle.color"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体大小" prop="headStyle.fontSize">
              <el-input
                v-model.number="component.headStyle.fontSize"
                @change="reLoadTable(component)"
              >
                <template slot="append">pt</template>
              </el-input>
            </el-form-item>
            <el-form-item label="是否加粗" prop="headStyle.fontWeight">
              <el-select
                v-model="component.headStyle.fontWeight"
                placeholder="请选择"
                @change="reLoadTable(component)"
              >
                <el-option
                  v-for="item in selectUtil.fontWeight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetTableContent(component, '4')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="表体样式">
            <el-form-item label="奇数行背景色" prop="bodyStyle.oddRowColor">
              <el-color-picker
                v-model="component.bodyStyle.oddRowColor"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="偶数行背景色" prop="bodyStyle.evenRowColor">
              <el-color-picker
                v-model="component.bodyStyle.evenRowColor"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="行高" prop="bodyStyle.height">
              <el-input
                v-model="component.bodyStyle.height"
                @change="changeTableLineHeight(component)"
              >
                <template slot="append">px</template>
              </el-input>
            </el-form-item>

            <el-form-item label="字体颜色" prop="bodyStyle.color">
              <el-color-picker
                v-model="component.bodyStyle.color"
                @change="reLoadTable(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体大小" prop="bodyStyle.fontSize">
              <el-input
                v-model.number="component.bodyStyle.fontSize"
                @change="reLoadTable(component)"
              >
                <template slot="append">pt</template>
              </el-input>
            </el-form-item>
            <el-form-item label="是否加粗" prop="bodyStyle.fontWeight">
              <el-select
                v-model="component.bodyStyle.fontWeight"
                placeholder="请选择"
                @change="reLoadTable(component)"
              >
                <el-option
                  v-for="item in selectUtil.fontWeight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetTableContent(component, '5')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="滚动设置">
            <el-form-item label="滚动速度" prop="options.step">
              <el-input v-model="component.options.step" @change="reLoadTable(component)">
              </el-input>
            </el-form-item>
            <el-form-item label="滚动最小条数" prop="options.limitMoveNum">
              <el-input
                v-model="component.options.limitMoveNum"
                @change="reLoadTable(component)"
              >
                <template slot="append">行</template>
              </el-input>
            </el-form-item>
            <el-form-item label="鼠标悬停" prop="options.hoverStop">
              <el-switch
                v-model="component.options.hoverStop"
                @change="reLoadTable(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="停顿时间" prop="options.waitTime">
              <el-input
                v-model="component.options.waitTime"
                @change="reLoadTable(component)"
              >
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetTableContent(component, '6')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div
        v-if="
          component.type == commonConstants.componentsType.histogram ||
          component.type == commonConstants.componentsType.lineChart ||
          component.type == commonConstants.componentsType.pieChart ||
          component.type == commonConstants.componentsType.gauge
        "
      >
        <el-collapse>
          <el-collapse-item title="标题设置">
            <el-form-item label="标题" prop="options.title.show">
              <el-switch
                v-model="component.options.title.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="标题内容"
              v-if="component.options.title.show"
              prop="options.title.text"
            >
              <el-input
                @change="reLoadChart(component)"
                v-model="component.options.title.text"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="对齐方式"
              v-if="component.options.title.show"
              prop="options.title.x"
            >
              <el-select
                v-model="component.options.title.x"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.textAlign"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="component.options.title.show"
              label="字体颜色"
              prop="options.title.textStyle.color"
            >
              <el-color-picker
                v-model="component.options.title.textStyle.color"
                @change="reLoadChart(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              v-if="component.options.title.show"
              label="字体大小"
              prop="options.title.textStyle.fontSize"
            >
              <el-input
                v-model.number="component.options.title.textStyle.fontSize"
                @change="reLoadChart(component)"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="component.options.title.show"
              label="是否加粗"
              prop="options.title.textStyle.fontWeight"
            >
              <el-select
                v-model="component.options.title.textStyle.fontWeight"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.fontWeight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '1')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="主题设置">
            <el-form-item label="主题" prop="theme">
              <el-select
                v-model="component.theme"
                placeholder="请选择"
                @change="reInitChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.chartTheme"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="背景色" prop="options.backgroundColor">
              <el-color-picker
                v-model="component.options.backgroundColor"
                @change="reLoadChart(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '2')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item title="数据来源">
            <el-form-item
              label="类目来源"
              v-if="
                component.type == commonConstants.componentsType.histogram ||
                component.type == commonConstants.componentsType.lineChart
              "
            >
              <el-radio-group
                v-model="component.options.categoryDataSource"
                @change="dataSourceChange"
              >
                <el-radio label="1">自定义</el-radio>
                <el-radio label="2">接口</el-radio>
                <el-radio label="3">数据集</el-radio>
              </el-radio-group>
              <el-button
                v-if="component.options.categoryDataSource == '1'"
                round
                type="warning"
                @click="editXcategory(component)"
                >编辑</el-button
              >
              <el-button
                v-if="component.options.categoryDataSource == '2'"
                round
                type="warning"
                @click="categoryApiSetting(component, '1')"
                >接口配置</el-button
              >
              <el-button
                v-if="component.options.categoryDataSource == '3'"
                round
                type="warning"
                @click="categoryDatasourceSetting(component, '1')"
                >数据集配置</el-button
              >
            </el-form-item>
            <el-form-item label="数据来源">
              <el-radio-group
                v-model="component.options.columnDataSource"
                @change="dataSourceChange"
              >
                <el-radio label="1">自定义</el-radio>
                <el-radio label="2">接口</el-radio>
                <el-radio label="3">数据集</el-radio>
              </el-radio-group>
              <el-button
                v-if="component.options.columnDataSource == '1'"
                round
                type="warning"
                @click="editCustomColumnData(component)"
                >编辑</el-button
              >
              <el-button
                v-if="component.options.columnDataSource == '2'"
                round
                type="warning"
                @click="categoryApiSetting(component, '2')"
                >接口配置</el-button
              >
              <el-button
                v-if="component.options.columnDataSource == '3'"
                round
                type="warning"
                @click="categoryDatasourceSetting(component, '2')"
                >数据集配置</el-button
              >
            </el-form-item>
            <el-form-item
              label="是否定时刷新"
              v-if="
                component.options.columnDataSource == '2' ||
                component.options.columnDataSource == '3' ||
                component.options.categoryDataSource == '2' ||
                component.options.categoryDataSource == '3'
              "
            >
              <el-switch v-model="component.isRefresh"> </el-switch>
            </el-form-item>
            <el-form-item label="刷新时间" v-if="component.isRefresh">
              <el-input v-model="component.refreshTime">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '3')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          v-if="
            component.type == commonConstants.componentsType.histogram ||
            component.type == commonConstants.componentsType.lineChart ||
            component.type == commonConstants.componentsType.pieChart
          "
        >
          <el-collapse-item title="图例组件">
            <el-form-item label="是否显示" prop="options.legend.show">
              <el-switch
                v-model="component.options.legend.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="左侧距离"
              prop="options.legend.left"
              v-if="component.options.legend.show"
            >
              <el-input
                v-model.number="component.options.legend.left"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="上方距离"
              prop="options.legend.top"
              v-if="component.options.legend.show"
            >
              <el-input
                v-model.number="component.options.legend.top"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="布局"
              prop="options.legend.orient"
              v-if="component.options.legend.show"
            >
              <el-select
                v-model="component.options.legend.orient"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.orient"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '4')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          v-if="
            component.type == commonConstants.componentsType.histogram ||
            component.type == commonConstants.componentsType.lineChart
          "
        >
          <el-collapse-item title="X轴设置">
            <el-form-item label="标签旋转角度" prop="options.xAxis.axisLabel.rotate">
              <el-input
                v-model.number="component.options.xAxis.axisLabel.rotate"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签显示间隔" prop="options.xAxis.axisLabel.interval">
              <el-input
                v-model.number="component.options.xAxis.axisLabel.interval"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签字体颜色" prop="options.xAxis.axisLabel.color">
              <el-color-picker
                v-model="component.options.xAxis.axisLabel.color"
                @change="reLoadChart(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="标签字体大小" prop="options.xAxis.axisLabel.fontSize">
              <el-input
                v-model.number="component.options.xAxis.axisLabel.fontSize"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签是否加粗" prop="options.xAxis.axisLabel.fontWeight">
              <el-select
                v-model="component.options.xAxis.axisLabel.fontWeight"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.fontWeight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '5')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse>
          <el-collapse-item
            title="柱体设置"
            v-if="component.type == commonConstants.componentsType.histogram"
          >
            <div v-for="(item, index) in component.options.series" :key="index">
              <el-form-item
                :label="'柱体' + (index + 1) + '名称'"
                :prop="'options.series.' + index + '.name'"
              >
                <el-input
                  v-model="component.options.series[index].name"
                  @change="reLoadChart(component)"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="'柱体' + (index + 1) + '颜色'"
                :prop="'options.series.' + index + '.itemStyle.color'"
              >
                <el-color-picker
                  v-model="component.options.series[index].itemStyle.color"
                  @change="reLoadChart(component)"
                  size="small"
                  :predefine="predefineColors"
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                :label="'柱体' + (index + 1) + '宽度'"
                :prop="'options.series.' + index + '.barWidth'"
              >
                <el-input
                  v-model.number="component.options.series[index].barWidth"
                  @change="reLoadChart(component)"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '6')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item
            title="折线设置"
            v-if="component.type == commonConstants.componentsType.lineChart"
          >
            <div v-for="(item, index) in component.options.series" :key="index">
              <el-form-item
                :label="'折线' + (index + 1) + '名称'"
                :prop="'options.series.' + index + '.name'"
              >
                <el-input
                  v-model="component.options.series[index].name"
                  @change="reLoadChart(component)"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="'折线' + (index + 1) + '颜色'"
                :prop="'options.series.' + index + '.itemStyle.color'"
              >
                <el-color-picker
                  v-model="component.options.series[index].itemStyle.color"
                  @change="reLoadChart(component)"
                  size="small"
                  :predefine="predefineColors"
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                label="平滑曲线"
                :prop="'options.series.' + index + '.smooth'"
              >
                <el-switch
                  v-model="component.options.series[index].smooth"
                  @change="reLoadChart(component)"
                >
                </el-switch>
              </el-form-item>
              <el-form-item>
                <el-button round type="warning" @click="resetChartContent(component, '6')"
                  >重置</el-button
                >
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          v-if="
            component.type == commonConstants.componentsType.histogram ||
            component.type == commonConstants.componentsType.lineChart
          "
        >
          <el-collapse-item title="Y轴设置">
            <el-form-item label="标签旋转角度" prop="options.yAxis.axisLabel.rotate">
              <el-input
                v-model.number="component.options.yAxis.axisLabel.rotate"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签字体颜色" prop="options.yAxis.axisLabel.color">
              <el-color-picker
                v-model="component.options.yAxis.axisLabel.color"
                @change="reLoadChart(component)"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="标签字体大小" prop="options.yAxis.axisLabel.fontSize">
              <el-input
                v-model.number="component.options.yAxis.axisLabel.fontSize"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签是否加粗" prop="options.yAxis.axisLabel.fontWeight">
              <el-select
                v-model="component.options.yAxis.axisLabel.fontWeight"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.fontWeight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '7')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-if="component.type == commonConstants.componentsType.pieChart">
          <el-collapse-item title="饼图设置">
            <el-form-item label="名称" :prop="'options.series.' + 0 + '.name'">
              <el-input
                v-model="component.options.series[0].name"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="饼图类型" :prop="'options.series.' + 0 + '.roseType'">
              <el-select
                v-model="component.options.series[0].roseType"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.roseType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="140px"
              label="文本标签是否显示"
              :prop="'options.series.' + 0 + '.label.show'"
            >
              <el-switch
                v-model="component.options.series[0].label.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              v-if="component.options.series[0].label.show"
              label="标签位置"
              :prop="'options.series.' + 0 + '.label.position'"
            >
              <el-select
                v-model="component.options.series[0].label.position"
                placeholder="请选择"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.labelPosition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="component.options.series[0].label.show"
              label="标签格式"
              :prop="'options.series.' + 0 + '.label.formatter'"
            >
              <el-input
                v-model="component.options.series[0].label.formatter"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="内半径大小"
              :prop="'options.series.' + 0 + '.radius.' + 0"
            >
              <el-input
                v-model="component.options.series[0].radius[0]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="外半径大小"
              :prop="'options.series.' + 0 + '.radius.' + 1"
            >
              <el-input
                v-model="component.options.series[0].radius[1]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <div v-for="(item, index) in component.options.series[0].data" :key="index">
              <el-form-item
                :label="'数据项' + (index + 1) + '名称'"
                :prop="'options.series.' + 0 + '.data.' + index + '.name'"
              >
                <el-input
                  v-model="component.options.series[0].data[index].name"
                  @change="reLoadChart(component)"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="component.options.series[0].data[index].itemStyle"
                :label="'数据项' + (index + 1) + '颜色'"
                :prop="'options.series.' + 0 + '.data.' + index + '.itemStyle.color'"
              >
                <el-color-picker
                  v-model="component.options.series[0].data[index].itemStyle.color"
                  size="small"
                  :predefine="predefineColors"
                  @change="reLoadChart(component)"
                ></el-color-picker>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button round type="warning" @click="resetChartContent(component, '8')"
                >重置</el-button
              >
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-if="component.type == commonConstants.componentsType.gauge">
          <el-collapse-item title="表盘设置">
            <el-form-item label="表盘大小" :prop="'options.series.' + 0 + '.radius'">
              <el-input
                v-model.number="component.options.series[0].radius"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="刻度最小值" :prop="'options.series.' + 0 + '.min'">
              <el-input
                v-model="component.options.series[0].min"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="最大值" :prop="'options.series.' + 0 + '.max'">
              <el-input
                v-model="component.options.series[0].max"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="起始角度" :prop="'options.series.' + 0 + '.startAngle'">
              <el-input
                v-model="component.options.series[0].startAngle"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="结束角度" :prop="'options.series.' + 0 + '.endAngle'">
              <el-input
                v-model="component.options.series[0].endAngle"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="刻度分割段数"
              :prop="'options.series.' + 0 + '.splitNumber'"
            >
              <el-input
                v-model="component.options.series[0].splitNumber"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="表盘轴线宽度"
              :prop="'options.series.' + 0 + '.axisLine.lineStyle.width'"
            >
              <el-input
                v-model.number="component.options.series[0].axisLine.lineStyle.width"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="表盘轴线颜色"
              :prop="'options.series.' + 0 + '.axisLine.lineStyle.color.' + 0 + '.' + 1"
            >
              <el-color-picker
                v-model="component.options.series[0].axisLine.lineStyle.color[0][1]"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="进度条宽度"
              :prop="'options.series.' + 0 + '.progress.width'"
            >
              <el-input
                v-model="component.options.series[0].progress.width"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="进度条颜色"
              :prop="'options.series.' + 0 + '.progress.itemStyle.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].progress.itemStyle.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-if="component.type == commonConstants.componentsType.gauge">
          <el-collapse-item title="分割线刻度设置">
            <el-form-item
              label="分割线显示"
              :prop="'options.series.' + 0 + '.splitLine.show'"
            >
              <el-switch
                v-model="component.options.series[0].splitLine.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="分割线长度"
              :prop="'options.series.' + 0 + '.splitLine.length'"
            >
              <el-input
                v-model.number="component.options.series[0].splitLine.length"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="分割线宽度"
              :prop="'options.series.' + 0 + '.splitLine.lineStyle.width'"
            >
              <el-input
                v-model.number="component.options.series[0].splitLine.lineStyle.width"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="与轴线间距"
              :prop="'options.series.' + 0 + '.splitLine.distance'"
            >
              <el-input
                v-model.number="component.options.series[0].splitLine.distance"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="分割线颜色"
              :prop="'options.series.' + 0 + '.splitLine.lineStyle.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].splitLine.lineStyle.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="刻度线显示"
              :prop="'options.series.' + 0 + '.axisTick.show'"
            >
              <el-switch
                v-model="component.options.series[0].axisTick.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="刻度线数量"
              :prop="'options.series.' + 0 + '.axisTick.splitNumber'"
            >
              <el-input
                v-model.number="component.options.series[0].axisTick.splitNumber"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="刻度线长度"
              :prop="'options.series.' + 0 + '.axisTick.length'"
            >
              <el-input
                v-model.number="component.options.series[0].axisTick.length"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="刻度线宽度"
              :prop="'options.series.' + 0 + '.axisTick.lineStyle.width'"
            >
              <el-input
                v-model.number="component.options.series[0].axisTick.lineStyle.width"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="与轴线间距"
              :prop="'options.series.' + 0 + '.axisTick.distance'"
            >
              <el-input
                v-model.number="component.options.series[0].axisTick.distance"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="刻度线颜色"
              :prop="'options.series.' + 0 + '.axisTick.lineStyle.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].axisTick.lineStyle.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="刻度标签显示"
              :prop="'options.series.' + 0 + '.axisLabel.show'"
            >
              <el-switch
                v-model="component.options.series[0].axisLabel.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="与轴线间距"
              :prop="'options.series.' + 0 + '.axisLabel.distance'"
            >
              <el-input
                v-model.number="component.options.series[0].axisLabel.distance"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="刻度标签颜色"
              :prop="'options.series.' + 0 + '.axisLabel.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].axisLabel.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="刻度字体大小"
              :prop="'options.series.' + 0 + '.axisLabel.fontSize'"
            >
              <el-input
                v-model.number="component.options.series[0].axisLabel.fontSize"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-if="component.type == commonConstants.componentsType.gauge">
          <el-collapse-item title="锚点指针设置">
            <el-form-item label="锚点显示" :prop="'options.series.' + 0 + '.anchor.show'">
              <el-switch
                v-model="component.options.series[0].anchor.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="锚点样式" :prop="'options.series.' + 0 + '.anchor.icon'">
              <el-select
                v-model="component.options.series[0].anchor.icon"
                placeholder="锚点样式"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.gaugeIconType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="锚点大小" :prop="'options.series.' + 0 + '.anchor.size'">
              <el-input
                v-model.number="component.options.series[0].anchor.size"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="component.options.series[0].anchor.itemStyle"
              label="锚点颜色"
              :prop="'options.series.' + 0 + '.anchor.itemStyle.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].anchor.itemStyle.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="锚点边线宽度"
              :prop="'options.series.' + 0 + '.anchor.itemStyle.borderWidth'"
            >
              <el-input
                v-model.number="component.options.series[0].anchor.itemStyle.borderWidth"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="锚点边线颜色"
              :prop="'options.series.' + 0 + '.anchor.itemStyle.borderColor'"
            >
              <el-color-picker
                v-model="component.options.series[0].anchor.itemStyle.borderColor"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>

            <el-form-item
              label="指针显示"
              :prop="'options.series.' + 0 + '.pointer.show'"
            >
              <el-switch
                v-model="component.options.series[0].pointer.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="指针样式"
              :prop="'options.series.' + 0 + '.pointer.icon'"
            >
              <el-select
                v-model="component.options.series[0].pointer.icon"
                placeholder="指针样式"
                @change="reLoadChart(component)"
              >
                <el-option
                  v-for="item in selectUtil.gaugeIconType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="指针长度"
              :prop="'options.series.' + 0 + '.pointer.length'"
            >
              <el-input
                v-model="component.options.series[0].pointer.length"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="指针宽度"
              :prop="'options.series.' + 0 + '.pointer.width'"
            >
              <el-input
                v-model="component.options.series[0].pointer.width"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="指针颜色"
              :prop="'options.series.' + 0 + '.pointer.itemStyle.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].pointer.itemStyle.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-if="component.type == commonConstants.componentsType.gauge">
          <el-collapse-item title="标题数值设置">
            <el-form-item label="标题显示" :prop="'options.series.' + 0 + '.title.show'">
              <el-switch
                v-model="component.options.series[0].title.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="标题内容"
              :prop="'options.series.' + 0 + '.data.' + 0 + '.name'"
            >
              <el-input
                v-model="component.options.series[0].data[0].name"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item label="标题颜色" :prop="'options.series.' + 0 + '.title.color'">
              <el-color-picker
                v-model="component.options.series[0].title.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="标题字体大小"
              :prop="'options.series.' + 0 + '.title.fontSize'"
            >
              <el-input
                v-model.number="component.options.series[0].title.fontSize"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="标题水平位置"
              :prop="'options.series.' + 0 + '.title.offsetCenter.' + 0"
            >
              <el-input
                v-model.number="component.options.series[0].title.offsetCenter[0]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="标题垂直位置"
              :prop="'options.series.' + 0 + '.title.offsetCenter.' + 1"
            >
              <el-input
                v-model.number="component.options.series[0].title.offsetCenter[1]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>

            <el-form-item label="数值显示" :prop="'options.series.' + 0 + '.detail.show'">
              <el-switch
                v-model="component.options.series[0].detail.show"
                @change="reLoadChart(component)"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="数值颜色"
              :prop="'options.series.' + 0 + '.detail.color'"
            >
              <el-color-picker
                v-model="component.options.series[0].detail.color"
                size="small"
                :predefine="predefineColors"
                @change="reLoadChart(component)"
              ></el-color-picker>
            </el-form-item>
            <el-form-item
              label="数值字体大小"
              :prop="'options.series.' + 0 + '.detail.fontSize'"
            >
              <el-input
                v-model.number="component.options.series[0].detail.fontSize"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数值水平位置"
              :prop="'options.series.' + 0 + '.detail.offsetCenter.' + 0"
            >
              <el-input
                v-model.number="component.options.series[0].detail.offsetCenter[0]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数值垂直位置"
              :prop="'options.series.' + 0 + '.detail.offsetCenter.' + 1"
            >
              <el-input
                v-model.number="component.options.series[0].detail.offsetCenter[1]"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数值格式"
              :prop="'options.series.' + 0 + '.detail.formatter'"
            >
              <el-input
                v-model="component.options.series[0].detail.formatter"
                @change="reLoadChart(component)"
              ></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="component.type == commonConstants.componentsType.date">
        <el-collapse>
          <el-collapse-item title="日期设置">
            <el-form-item label="日期格式" prop="format">
              <el-select v-model="component.format" placeholder="日期格式">
                <el-option
                  v-for="item in selectUtil.dateFormat"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字体大小" prop="style.fontSize">
              <el-input v-model="component.style.fontSize">
                <template slot="append">pt</template>
              </el-input>
            </el-form-item>
            <el-form-item label="字体颜色" prop="style.color">
              <el-color-picker
                v-model="component.style.color"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体背景色" prop="style.background">
              <el-color-picker
                v-model="component.style.background"
                size="small"
                :predefine="predefineColors"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体间距" prop="style.letterSpacing">
              <el-input v-model="component.style.letterSpacing">
                <template slot="append">px</template>
              </el-input>
            </el-form-item>
            <el-form-item label="是否加粗" prop="style.fontWeight">
              <el-switch v-model="component.style.fontWeight"> </el-switch>
            </el-form-item>
            <el-form-item label="水平对齐" prop="style.textAlign">
              <el-select v-model="component.style.textAlign" placeholder="请选择">
                <el-option
                  v-for="item in selectUtil.textAlign"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="垂直对齐" prop="style.verticalAlign">
              <el-select v-model="component.style.verticalAlign" placeholder="请选择">
                <el-option
                  v-for="item in selectUtil.verticalAlign"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    <el-dialog
      append-to-body
      title="X轴类目"
      :visible.sync="showEditCategoryDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <section class="ces-handle">
        <el-row class="operate">
          <el-col :span="24">
            <el-button type="primary" @click="showDialog('1')">新增</el-button>
            <el-button type="danger" @click="deleteAllCategory()">全部删除</el-button>
          </el-col>
        </el-row>
      </section>
      <section class="ces-table">
        <el-table :data="cateGorytableData" border style="width: 100%">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column prop="content" label="类目内容" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDialog('2', scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" @click="deleteCategory(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confirmChangeCategory()">确 定</el-button>
        <el-button size="mini" @click="showEditCategoryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="类目名称"
      :visible.sync="categoryDialog"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        class="demo-form-inline"
        :model="categoryForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="categoryForm"
      >
        <el-form-item
          label="类目内容"
          prop="content"
          :rules="filter_rules('类目内容', { required: true })"
        >
          <el-input v-model="categoryForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="categoryConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="接口配置"
      :visible.sync="apiDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        class="demo-form-inline"
        :model="apiForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="apiForm"
      >
        <el-form-item
          label="接口地址"
          prop="url"
          :rules="filter_rules('接口地址', { required: true })"
        >
          <el-input type="textarea" v-model="apiForm.url"></el-input>
        </el-form-item>
        <el-form-item
          label="请求方式"
          prop="requestType"
          :rules="filter_rules('接口地址', { required: true })"
        >
          <el-radio-group v-model="apiForm.requestType">
            <el-radio label="post">post请求</el-radio>
            <el-radio label="get">get请求</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="请求参数"
          prop="params"
          :rules="filter_rules('请求参数', { required: false })"
        >
          <!-- <el-input type="textarea" v-model="apiForm.params"></el-input>
                  <i title="参数请输入json格式的数据，如{'id':'1'}，没有参数可输入{}或者不输入" class="el-icon-question">参数说明</i> -->
          <el-button
            type="primary"
            round
            icon="el-icon-circle-plus-outline"
            @click="addParam"
            >添加参数</el-button
          >
          <el-table
            :data="apiForm.params"
            border
            style="width: 100%"
            align="center"
            size="small"
            height="230px"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column
              prop="paramName"
              label="参数名"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="paramCode"
              label="参数编码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="defaultValue"
              label="默认值"
              align="center"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteParam(scope.row, scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label="返回值类型"
          prop="resultType"
          :rules="filter_rules('返回值类型', { required: true })"
        >
          <el-select v-model="apiForm.resultType" placeholder="请选择">
            <el-option
              v-for="item in selectUtil.resultType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="apiForm.resultType == 'ObjectArray' || apiForm.resultType == 'Object'"
          label="返回值属性"
          prop="resultTypeProp"
        >
          <!-- <el-input v-model="apiForm.resultTypeProp"></el-input> -->
          <el-button
            type="primary"
            round
            icon="el-icon-circle-plus-outline"
            @click="addProp"
            >添加属性</el-button
          >
          <el-table
            :data="apiForm.resultTypeProp"
            border
            style="width: 100%"
            align="center"
            size="small"
            height="230px"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column
              prop="propName"
              label="返回值属性"
              align="center"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteProp(scope.row, scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <i
            title="对象数组返回值结构如[{'name':'test1'},{'name':'test2'}]，则填写name；对象类型返回值结构如{'code':'200','msgLevel':'success','responseData':{'name':'张三'}}，饼图、仪表盘最多只允许添加两个返回值，第一个返回值是value，第二个返回值是name，如果只添加一个返回值，则为value"
            class="el-icon-question"
            >返回值属性说明</i
          >
        </el-form-item>
        <el-form-item>
          <el-button type="warning" round icon="el-icon-link" @click="apiTest"
            >接口测试</el-button
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="apiCategoryConfirm">确 定</el-button>
        <el-button size="mini" @click="closeApiDialog">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="数据集配置"
      :visible.sync="dataSetDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        class="demo-form-inline"
        :model="dataSetForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="dataSetForm"
      >
        <div>
          <el-button type="primary" @click="showDatasetDialog">添加数据集</el-button
          ><el-button type="warning" @click="datasetEditDialog">管理数据集</el-button>
        </div>
        <br />
        <el-form-item
          label="数据集"
          prop="dataSetId"
          :rules="filter_rules('返回值类型', { required: true })"
        >
          <el-select
            v-model="dataSetForm.dataSetId"
            placeholder="请选择"
            @change="changeDataset"
          >
            <el-option :label="'请选择'" value=""></el-option>
            <el-option
              v-for="item in dataSets"
              :key="item.id"
              :label="item.datasetName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="数据列"
          prop="column"
          :rules="filter_rules('返回值类型', { required: true })"
        >
          <el-select
            v-model="dataSetForm.column"
            placeholder="请选择"
            :multiple="dataSetForm.isMulti"
          >
            <el-option
              v-for="item in dataColumn"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dataSetCategoryConfirm">确 定</el-button>
        <el-button size="mini" @click="dataSetDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="数据集"
      :visible.sync="addDatasetsDialogVisiable"
      width="80%"
      height="80%"
      :close-on-click-modal="false"
      @close="closeAddDataSet"
    >
      <div style="height: 40%">
        <el-form :inline="true" :model="sqlForm" class="demo-form-inline" ref="sqlRef">
          <el-form-item
            label="数据集名称"
            prop="datasetName"
            :rules="filter_rules('数据集名称', { required: true })"
          >
            <el-input v-model="sqlForm.datasetName" placeholder="数据集名称"></el-input>
          </el-form-item>
          <el-form-item
            label="选择数据源"
            prop="datasourceId"
            :rules="filter_rules('选择数据源', { required: true })"
          >
            <el-select v-model="sqlForm.datasourceId" placeholder="选择数据源">
              <el-option
                v-for="op in dataSource"
                :label="op.dataSourceName"
                :value="op.datasourceId"
                :key="op.datasourceId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="height: 40px">
          <el-tooltip
            content="该操作将执行sql语句并校验sql语句的正确性，并将查询字段全部显示到下方的表格中"
            placement="bottom"
            ><el-tag type="success" @click="execSql" size="large" style="cursor: pointer"
              ><i class="el-icon-caret-right"></i>执行</el-tag
            ></el-tooltip
          >
          <el-tooltip content="该操作会将sql语句进行格式化并显示" placement="right"
            ><el-tag @click="formatSql" style="cursor: pointer"
              ><i class="el-icon-document"></i>格式化</el-tag
            >
          </el-tooltip>
        </div>
        <div style="height: 300px">
          <codemirror ref="codeMirror" :options="cmOptions"></codemirror>
        </div>
        <div style="height: 5px"></div>
        <div style="height: 50%">
          <!--表格 start-->
          <el-table
            :data="
              sqlColumnTableData.tableData.slice(
                (sqlColumnTableData.tablePage.currentPage - 1) *
                  sqlColumnTableData.tablePage.pageSize,
                sqlColumnTableData.tablePage.currentPage *
                  sqlColumnTableData.tablePage.pageSize
              )
            "
            border
            style="width: 100%"
            align="center"
            size="small"
            height="230px"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column prop="name" label="列名" align="center"></el-table-column>
            <el-table-column
              prop="dataType"
              label="数据类型"
              align="center"
            ></el-table-column>
            <el-table-column prop="width" label="宽度" align="center"></el-table-column>
          </el-table>
          <!--表格 end-->
          <!--分页 start-->
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="sqlColumnTableData.tablePage.currentPage"
            :page-sizes="sqlColumnTableData.tablePage.pageSizeRange"
            :page-size="sqlColumnTableData.tablePage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sqlColumnTableData.tablePage.pageTotal"
          >
          </el-pagination>
          <!--分页 end-->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addDataSet">确 定</el-button>
        <el-button size="mini" @click="closeAddDataSet">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="数据集管理"
      :visible.sync="showDatasetsDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <section class="ces-table">
        <el-table :data="dataSets" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column prop="datasetName" label="数据集" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="editDatasets(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deleteDatasets(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDatasetsDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="类目名称"
      :visible.sync="categoryDialog"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        class="demo-form-inline"
        :model="categoryForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="categoryForm"
      >
        <el-form-item
          label="类目内容"
          prop="content"
          :rules="filter_rules('类目内容', { required: true })"
        >
          <el-input v-model="categoryForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="categoryConfirm">确 定</el-button>
        <el-button size="mini" @click="categoryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="自定义数据"
      :visible.sync="customColumnDataDialogVisiable"
      width="80%"
      height="80%"
      :close-on-click-modal="false"
      @close="closeCustomColumnDataDialog"
    >
      <div style="height: 40%">
        <el-alert
          v-if="
            component.type == commonConstants.componentsType.lineChart ||
            component.type == commonConstants.componentsType.histogram
          "
          title="请输入数组格式的数据，多个数组请用;分隔，例如：[1,2,3];[4,5,6]"
          type="success"
          :closable="false"
        >
        </el-alert>
        <el-alert
          v-if="component.type == commonConstants.componentsType.pieChart"
          title="请输入对象数组格式的数据，对象的key是value和name，其中value不能为空，必须填一个数值，name可以为空字符串；例如：[{'value':100,'name':'测试'},{'value':200,name:'测试1'}]"
          type="success"
          :closable="false"
        ></el-alert>
        <el-alert
          v-if="component.type == commonConstants.componentsType.table"
          title="请输入对象数组格式的数据，对象的key与数据列中的属性需保持一致！例如：[{'count': '100','date': '2021-08-01'}, {'count': '95','date': '2021-08-02'}"
          type="success"
          :closable="false"
        >
        </el-alert>
        <!-- <div style="height:40px;">
            <el-tooltip content="该操作会将数据进行格式化并显示" placement="right"><el-tag @click="formatData" style="cursor:pointer"><i class="el-icon-document"></i>格式化</el-tag> </el-tooltip>
            </div> -->
        <div class="code-mirror" style="height: 300px">
          <codemirror ref="dataCodeMirror" :options="cmOptions"></codemirror>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confirmCustomColumnData()">确 定</el-button>
        <el-button size="mini" @click="closeCustomColumnDataDialog()">取 消</el-button>   
      </span>
    </el-dialog>

    <el-dialog
      append-to-body
      title="表格数据列"
      :visible.sync="tableColumnDialogVisiable"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        class="demo-form-inline"
        :model="tableColumnForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="tableColumnForm"
      >
        <el-form-item
          label="列名称"
          prop="name"
          :rules="filter_rules('列名称', { required: true })"
        >
          <el-input v-model="tableColumnForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="列属性"
          prop="key"
          :rules="filter_rules('列属性', { required: true })"
        >
          <el-input v-model="tableColumnForm.key"></el-input>
        </el-form-item>
        <el-form-item
          label="列宽"
          prop="width"
          :rules="filter_rules('列宽', { required: true })"
        >
          <el-input v-model="tableColumnForm.width">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addTableColomn">确 定</el-button>
        <el-button size="mini" @click="tableColumnDialogVisiable = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="添加参数"
      :visible.sync="paramDialog"
      :close-on-click-modal="false"
      width="500px"
      @close="paramCancle"
    >
      <el-form
        class="demo-form-inline"
        :model="paramForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="paramForm"
      >
        <el-form-item
          label="参数名称"
          prop="paramName"
          :rules="filter_rules('参数名称', { required: true })"
        >
          <el-input v-model="paramForm.paramName"></el-input>
        </el-form-item>
        <el-form-item
          label="参数代码"
          prop="paramCode"
          :rules="filter_rules('参数代码', { required: true })"
        >
          <el-input v-model="paramForm.paramCode"></el-input>
        </el-form-item>
        <el-form-item
          label="默认值"
          prop="defaultValue"
          :rules="filter_rules('默认值', { required: false })"
        >
          <el-input v-model="paramForm.defaultValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="paramConfirm">确 定</el-button>
        <el-button size="mini" @click="paramCancle">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      title="添加属性"
      :visible.sync="propDialog"
      :close-on-click-modal="false"
      width="500px"
      @close="propCancle"
    >
      <el-form
        class="demo-form-inline"
        :model="propForm"
        label-position="left"
        label-width="100px"
        size="medium"
        ref="propForm"
      >
        <el-form-item
          label="属性"
          prop="propName"
          :rules="filter_rules('属性', { required: true })"
        >
          <el-input v-model="propForm.propName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="propConfirm">确 定</el-button>
        <el-button size="mini" @click="propCancle">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 选择图片 -->
    <ImageSelect
      ref="imgselector"
      :dialogVisible="dialogVisible"
      :title="'图片选择'"
      :paramInfo="paramInfo"
      :defaultLabel="defaultLabel"
      @handleClose="handleClose"
      @handleConfirm="handleConfirm"
    />
  </div>
</template>

<script src="./tabformjs.js"></script>
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 16px !important;
}
.el-color-picker {
  margin-top: -10px !important;
}
.el-form-item__error {
  padding-top: 1px !important;
}
.basicbox {
  padding: 20px 16px;
}
.el-tabs__header {
  background-color: red !important;
}
::v-deep.CodeMirror-gutters{
    left: 0!important;
  }
</style>
