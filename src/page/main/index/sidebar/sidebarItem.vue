  <template>
  <div class="menu-wrapper">
    <div class="notmove" v-if="!needmove && appSettingOpen">
      <div v-for="(item, key) in localMenu" :key="key">
        <div class="menu-item-head">{{ item.name }}</div>
        <el-menu-item
          v-for="(it, itindex) in item.children"
          :key="'navmenu'+itindex"
          :index="it.extend.url"
          @click="open(it.extend)"
          :class="{'menu-item-li':true,'is-active-item':vaildAvtive(it.extend)}"
        >
          <div>
            <i class="el-icon-menu" style="margin-right:12px;"></i>
            <span style="width: 110px;overflow:hidden;position: absolute;white-space: nowrap;text-overflow: ellipsis;line-height:45px;" :title="it.extend.name" slot="title" :alt="it.extend.url">{{it.extend.name}}</span>
          </div>
        </el-menu-item>
      </div>
    </div>
    <div class="needmove" v-if="needmove && !appSettingOpen">
      <draggable :list="menu" :options="{group:'movemenu', disabled: disabled}"
        @start="startMove"
        @end="endMove"
      >
        <template v-for="(item, index) in menu">
          <el-menu-item
            v-if="vaildRoles(item.extend)"
            :index="item.extend[pathKey]"
            @click="open(item.extend)"
            :key="item.extend[labelKey]+index"
            :class="{'menu-item-li':true,'is-active':vaildAvtive(item.extend)}"
          >
            <i :class="item.extend[iconKey]"></i>
            <span slot="title" :alt="item.extend[pathKey]">{{item.extend[labelKey]}}</span>
            <i class="el-icon-rank dragicon" v-show="!collapse"></i>
          </el-menu-item>
        </template>
      </draggable>
    </div>
    <div class="notmove" v-if="!needmove && !appSettingOpen">
      <draggable v-model="getMenu" :options="{group:'menu-move', disabled: !getRole,ghostClass:'menu-ghost',}"  @end="menuSort" id="menu-sort">
        <el-submenu v-for="(item, index) in getMenu" :key="'menuNav'+index" :index="index+''" :class="{'collapseNav': collapse}" :id="item.name" class="1234">
          <template slot="title" v-if="vaildRoles(item.extend)">
            <div @click="openCatalogue(item)" :class="{'catalogue-item': appItem}">
              <div>
<!--                <svg v-if="isSvg(item.extend[iconKey])" class="icon" aria-hidden="true" style="margin-right: 12px;width: 15px;height: 15px;">-->
<!--                  <use :xlink:href="'#'+item.extend[iconKey]"></use>-->
<!--                </svg>-->
<!--                <i v-else :class="item.extend[iconKey]"></i>-->
                <svg v-if="item.extend" class="icon" aria-hidden="true" style="margin-right: 12px;margin-bottom: 4px; width: 15px;height: 15px;">
                  <use :xlink:href="'#' + item.extend.icon"></use>
                </svg>
                <span style="width: 118px;overflow:hidden;position: absolute;white-space: nowrap;text-overflow: ellipsis;" :title="item.extend[labelKey]" slot="title" :alt="item.extend[pathKey]" v-show="!collapse">{{item.extend[labelKey]}}</span>
              </div>
              <span v-if="appItem && item.extend.designRole" class="more">
                <el-popover
                  placement="right-start"
                  size="mini"
                  trigger="hover">
                  <div class="more-box">
                    <div class="more-item" @click="moreHandle('rename', item)">
                      <!-- <i class="el-icon-setting" style="margin-right: 16px;"></i> -->
                      <span>修改名称</span>
                    </div>
                    <div v-if="(!item.children || (item.children && item.children.length == 0))" class="more-item" @click="moreHandle('del', item)">
                      <!-- <i class="el-icon-delete" style="margin-right: 16px;"></i> -->
                      <span style="color: #F56C6C;">删除目录</span>
                    </div>
                  </div>
                  <i slot="reference" class="el-icon-more" style="color: #333333;margin-right: 6px;"></i>
                </el-popover>
              </span>
            </div>
          </template>
          <template v-if="vaildRoles(item.extend)">
            <draggable :options="{group:'menu-children',ghostClass:'menu-children-ghost', disabled: !item.extend.designRole}" @end="childrenEnd">
              <el-menu-item
              v-for="(it, itindex) in item.children"
              :key="'navmenu'+itindex"
              :index="it.extend[pathKey] ? it.extend[pathKey] : it.id"
              @click="open(it.extend)"
              :class="{'menu-item-li':true,'is-active-item':vaildAvtive(it.extend)}"
              :id="it.id"
              >
<!--                <div style="margin-left: 12px">-->
<!--&lt;!&ndash;                  <svg v-if="isSvg(it.extend[iconKey])" class="icon" aria-hidden="true" style="margin-right: 12px;width: 15px;height: 15px;">&ndash;&gt;-->
<!--&lt;!&ndash;                    <use :xlink:href="'#'+it.extend[iconKey]"></use>&ndash;&gt;-->
<!--&lt;!&ndash;                  </svg>&ndash;&gt;-->
<!--&lt;!&ndash;                  <i v-else :class="it.extend[iconKey]"></i>&ndash;&gt;-->
<!--                </div>-->
                <div class="menu-item-it" style="" :title="it.extend[labelKey]" slot="title" :alt="it.extend[pathKey]">{{it.extend[labelKey]}}</div>
                <div v-if="it.extend.designRole" class="more">
                  <el-popover
                    placement="right-start"
                    size="mini"
                    trigger="hover">
                    <div class="more-box">
                      <div v-if="['url', 'URL'].indexOf(it.extend.design) == -1" class="more-item" @click="handleDesign(it)">
                        <!-- <i class="el-icon-edit-outline" style="margin-right: 16px;"></i> -->
                        <span>设计页面</span>
                      </div>
                      <div class="more-item" @click="moreHandle('move', it)">
                        <!-- <i class="el-icon-d-caret" style="margin-right: 16px;"></i> -->
                        <span>移动目录</span>
                      </div>
                      <div v-if="it.extend.design === 'URL'" class="more-item" @click="moreHandle('edit', it)">
                        <!-- <i class="el-icon-setting" style="margin-right: 16px;"></i> -->
                        <span>修改页面</span>
                      </div>
                      <div v-else class="more-item" @click="moreHandle('rename', it)">
                        <!-- <i class="el-icon-setting" style="margin-right: 16px;"></i> -->
                        <span>修改名称</span>
                      </div>
                      <div v-if="$store.getters.userInfo.adminFlag && (it.extend.design === 'URL' || it.extend.design === 'chart')" class="more-item" @click="moreHandle('index', it)">
                        <!-- <i class="el-icon-delete" style="margin-right: 16px;"></i> -->
                        <span>设置为首页</span>
                      </div>
                      <div class="more-item" @click="moreHandle('del', it)">
                        <!-- <i class="el-icon-delete" style="margin-right: 16px;"></i> -->
                        <span style="color: #F56C6C;">删除页面</span>
                      </div>
                      <div v-if="['chart', 'URL', 'url'].indexOf(it.extend.design) == -1 && it.extend.designTypes.length > 0">
                        <div style="height: 1px; background-color: #f2f2f2;margin: 6px 12px;"/>
                        <div class="model-header">根据模型快速创建</div>
                        <div class="model-box" v-if="it.extend.designTypes.indexOf('page') > -1">
                          <svg t="1647939001234" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8640" width="20" height="20" style="margin-right: 6px;"><path d="M226.3 70.4C151.1 91.6 91.6 151.1 70.4 226.3L226.3 70.4z" fill="#FFA65A" p-id="8641"></path><path d="M277.9 62.2c-116.5 4.7-211 99.1-215.7 215.7L277.9 62.2z" fill="#FFA659" p-id="8642"></path><path d="M321.5 62H287C163.3 62 62 163.3 62 287v34.5L321.5 62z" fill="#FFA558" p-id="8643"></path><path d="M365 62h-78C163.3 62 62 163.3 62 287v78L365 62z" fill="#FFA557" p-id="8644"></path><path d="M408.4 62H287C163.3 62 62 163.3 62 287v121.4L408.4 62z" fill="#FFA556" p-id="8645"></path><path d="M451.8 62H287c-35.9 0-69.8 8.5-100 23.6L85.6 187C70.5 217.2 62 251.1 62 287v164.8L451.8 62z" fill="#FFA555" p-id="8646"></path><path d="M495.3 62H287c-12.2 0-24.2 1-35.9 2.9L64.9 251.1C63 262.8 62 274.8 62 287v208.3L495.3 62z" fill="#FFA454" p-id="8647"></path><path d="M62 538.7L538.7 62H297.5L62 297.5z" fill="#FFA453" p-id="8648"></path><path d="M62 582.1L582.1 62H340.9L62 340.9z" fill="#FFA452" p-id="8649"></path><path d="M62 625.6L625.6 62H384.3L62 384.3z" fill="#FFA451" p-id="8650"></path><path d="M62 427.8V669L669 62H427.8z" fill="#FFA450" p-id="8651"></path><path d="M62 471.2v241.2L712.4 62H471.2z" fill="#FFA34F" p-id="8652"></path><path d="M737 62H514.6L62 514.6V737c0 6.1 0.3 12.1 0.7 18.1L755.1 62.7c-6-0.4-12-0.7-18.1-0.7z" fill="#FFA34E" p-id="8653"></path><path d="M737 62H558.1L62 558.1V737c0 19.1 2.4 37.6 6.9 55.4L792.4 68.9C774.6 64.4 756.1 62 737 62z" fill="#FFA34D" p-id="8654"></path><path d="M737 62H601.5L62 601.5V737c0 31.1 6.4 60.8 17.9 87.8L824.8 79.9C797.8 68.4 768.1 62 737 62z" fill="#FFA34C" p-id="8655"></path><path d="M853.5 94.7C819.4 74 779.5 62 737 62h-92.1L62 644.9V737c0 42.5 12 82.4 32.7 116.5L853.5 94.7z" fill="#FFA24B" p-id="8656"></path><path d="M878.9 112.7C840.1 81.1 790.7 62 737 62h-48.6L62 688.4V737c0 53.7 19.1 103.1 50.7 141.9l766.2-766.2z" fill="#FFA24A" p-id="8657"></path><path d="M737 62h-5.2L62 731.8v5.2c0 64.7 27.7 123.2 71.7 164.3l767.6-767.6C860.2 89.7 801.7 62 737 62z" fill="#FFA249" p-id="8658"></path><path d="M64.8 772.4c9.8 61 44.3 114.1 92.8 148.4l763.2-763.2c-34.3-48.6-87.4-83.1-148.4-92.8L64.8 772.4z" fill="#FFA248" p-id="8659"></path><path d="M73.3 807.3c18.7 56.4 59.2 103 111.3 129.9l752.6-752.6C910.4 132.5 863.7 92 807.3 73.3l-734 734z" fill="#FFA247" p-id="8660"></path><path d="M86.1 838c26.5 52.3 72.9 93.1 129.1 112.2l735-735C931.1 159 890.3 112.6 838 86.1L86.1 838z" fill="#FFA147" p-id="8661"></path><path d="M102.4 865.2c34 48.7 86.7 83.5 147.5 93.7l709-709c-10.2-60.8-45-113.5-93.7-147.5L102.4 865.2z" fill="#FFA146" p-id="8662"></path><path d="M962 287c0-65.2-28.1-124.1-72.7-165.3L121.7 889.3C162.9 933.9 221.8 962 287 962h3.2L962 290.2V287z" fill="#FFA145" p-id="8663"></path><path d="M962 287c0-54.2-19.4-104-51.6-143L144 910.4c39 32.2 88.8 51.6 143 51.6h46.6L962 333.6V287z" fill="#FFA144" p-id="8664"></path><path d="M962 287c0-43.1-12.3-83.4-33.5-117.7L169.3 928.5C203.6 949.7 243.9 962 287 962h90.1L962 377.1V287z" fill="#FFA143" p-id="8665"></path><path d="M287 962h133.5L962 420.5V287c0-31.6-6.6-61.8-18.5-89.2L197.8 943.4c27.4 12 57.6 18.6 89.2 18.6z" fill="#FFA042" p-id="8666"></path><path d="M287 962h176.9L962 463.9V287c0-19.7-2.6-38.7-7.4-56.9L230.1 954.6c18.2 4.8 37.2 7.4 56.9 7.4z" fill="#FFA041" p-id="8667"></path><path d="M287 962h220.4L962 507.4V287c0-6.7-0.3-13.4-0.9-20L267 961.1c6.6 0.6 13.3 0.9 20 0.9z" fill="#FFA040" p-id="8668"></path><path d="M550.8 962L962 550.8V309.6L309.6 962z" fill="#FFA03F" p-id="8669"></path><path d="M594.2 962L962 594.2V353L353 962z" fill="#FF9F3E" p-id="8670"></path><path d="M637.7 962L962 637.7V396.4L396.4 962z" fill="#FF9F3D" p-id="8671"></path><path d="M681.1 962L962 681.1V439.9L439.9 962z" fill="#FF9F3C" p-id="8672"></path><path d="M724.5 962L962 724.5V483.3L483.3 962z" fill="#FF9F3B" p-id="8673"></path><path d="M962 737V526.7L526.7 962H737c11.4 0 22.5-0.9 33.5-2.5l189-189c1.6-11 2.5-22.1 2.5-33.5z" fill="#FF9F3A" p-id="8674"></path><path d="M962 737V570.2L570.2 962H737c34.3 0 66.9-7.8 96.1-21.7l107.2-107.2c13.9-29.2 21.7-61.8 21.7-96.1z" fill="#FF9E39" p-id="8675"></path><path d="M962 613.6L613.6 962H737c123.8 0 225-101.3 225-225V613.6z" fill="#FF9E38" p-id="8676"></path><path d="M962 657L657 962h80c123.8 0 225-101.3 225-225v-80z" fill="#FF9E37" p-id="8677"></path><path d="M962 700.5L700.5 962H737c123.8 0 225-101.3 225-225v-36.5z" fill="#FF9E36" p-id="8678"></path><path d="M961.9 744L744 961.9c118.2-3.7 214.2-99.7 217.9-217.9z" fill="#FF9D35" p-id="8679"></path><path d="M954.4 795L795 954.4c77.4-20.8 138.6-82 159.4-159.4z" fill="#FF9D34" p-id="8680"></path><path d="M736.3 622.9L523.5 747.3c-5.6 3.3-12.4 3.3-18 0.1L287.8 622.6c-12.2-7-12-24.6 0.3-31.4l212.8-116.7c5.3-2.9 11.8-3 17.2-0.1l217.7 117c12.3 6.7 12.6 24.4 0.5 31.5z" fill="#FFD9C0" p-id="8681"></path><path d="M736.3 523.9L523.5 648.3c-5.6 3.3-12.4 3.3-18 0.1L287.8 523.6c-12.2-7-12-24.6 0.3-31.4l212.8-116.7c5.3-2.9 11.8-3 17.2-0.1l217.7 117c12.3 6.7 12.6 24.4 0.5 31.5z" fill="#FFE8D9" p-id="8682"></path><path d="M736.3 424.9L523.5 549.3c-5.6 3.3-12.4 3.3-18 0.1L287.8 424.6c-12.2-7-12-24.6 0.3-31.4l212.8-116.7c5.3-2.9 11.8-3 17.2-0.1l217.7 117c12.3 6.7 12.6 24.4 0.5 31.5z" fill="#FFF6F0" p-id="8683"></path></svg>
                          <div @click="handleCreate('list', it)">
                            <div class="model-title">创建数据管理</div>
                            <div class="model-explain">快速信息搜集</div>
                          </div>
                        </div>
                        <div class="model-box" v-if="it.extend.designTypes.indexOf('form') > -1">
                          <svg t="1647938974487" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7006" width="20" height="20" style="margin-right: 6px;"><path d="M511.744 509.5936m-450.816 0a450.816 450.816 0 1 0 901.632 0 450.816 450.816 0 1 0-901.632 0Z" fill="#59ADF8" p-id="7007"></path><path d="M630.8864 224H320.8192c-42.24 0-76.4928 34.2528-76.4928 76.4928v405.1968c0 42.24 34.2528 76.4928 76.4928 76.4928h165.12a192.75264 192.75264 0 0 1-42.1888-120.576c0-106.9056 86.6304-193.536 193.536-193.536 24.7296 0 48.384 4.7104 70.0928 13.1584v-180.736c0.0512-42.24-34.2016-76.4928-76.4928-76.4928z m-175.9232 293.888H350.9248c-17.3568 0-31.4368-14.08-31.4368-31.4368 0-17.3568 14.08-31.4368 31.4368-31.4368h104.0384c17.3568 0 31.4368 14.08 31.4368 31.4368 0 17.408-14.08 31.4368-31.4368 31.4368z m150.4256-124.928h-254.464c-17.3568 0-31.4368-14.08-31.4368-31.4368 0-17.3568 14.08-31.4368 31.4368-31.4368h254.464c17.3568 0 31.4368 14.08 31.4368 31.4368 0 17.3568-14.08 31.4368-31.4368 31.4368z" fill="#FFFFFF" p-id="7008"></path><path d="M637.2864 517.888c-79.3088 0-143.8208 64.512-143.8208 143.8208s64.512 143.8208 143.8208 143.8208 143.8208-64.512 143.8208-143.8208-64.512-143.8208-143.8208-143.8208z m60.416 175.2064h-29.3376v29.3376c0 17.3568-14.08 31.4368-31.4368 31.4368-17.3568 0-31.4368-14.08-31.4368-31.4368v-29.3376h-29.3376c-17.3568 0-31.4368-14.08-31.4368-31.4368s14.08-31.4368 31.4368-31.4368h29.3376v-29.3376c0-17.3568 14.08-31.4368 31.4368-31.4368 17.3568 0 31.4368 14.08 31.4368 31.4368v29.3376h29.3376c17.3568 0 31.4368 14.08 31.4368 31.4368s-14.08 31.4368-31.4368 31.4368z" fill="#FFFFFF" p-id="7009"></path></svg>
                          <div @click="handleCreate('form', it)">
                            <div class="model-title">创建表单设计</div>
                            <div class="model-explain">快速信息搜集</div>
                          </div>
                        </div>
                        <div class="model-box" v-if="it.extend.designTypes.indexOf('workflow') > -1">
                          <svg t="1647938948264" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4727" width="20" height="20" style="margin-right: 6px;"><path d="M512 241.777778m-139.377778 0a139.377778 139.377778 0 1 0 278.755556 0 139.377778 139.377778 0 1 0-278.755556 0Z" fill="#37ADDB" p-id="4728"></path><path d="M230.4 731.363556m-139.377778 0a139.377778 139.377778 0 1 0 278.755556 0 139.377778 139.377778 0 1 0-278.755556 0Z" fill="#37ADDB" p-id="4729"></path><path d="M221.639111 500.622222l-53.816889-12.401778A351.573333 351.573333 0 0 1 512 213.560889v55.296A296.846222 296.846222 0 0 0 221.639111 500.622222zM788.48 787.114667l-43.235556-34.133334A295.822222 295.822222 0 0 0 718.620444 352.711111l38.343112-39.936a350.776889 350.776889 0 0 1 31.516444 474.339556z" fill="#37ADDB" p-id="4730"></path><path d="M793.6 730.794667m-139.377778 0a139.377778 139.377778 0 1 0 278.755556 0 139.377778 139.377778 0 1 0-278.755556 0Z" fill="#37ADDB" p-id="4731"></path><path d="M520.078222 921.6a353.848889 353.848889 0 0 1-306.289778-176.469333L261.688889 717.596444A297.984 297.984 0 0 0 608.028444 853.333333l16.611556 52.679111A344.974222 344.974222 0 0 1 520.078222 921.6z" fill="#37ADDB" p-id="4732"></path></svg>
                          <div @click="handleCreate('flow', it)">
                            <div class="model-title">创建OA流程</div>
                            <div class="model-explain">快速信息搜集</div>
                          </div>
                        </div>
                        <div style="height: 1px; background-color: #f2f2f2;margin: 6px 12px;"/>
                        <div class="model-learn" @click="handleLearn('learn-data-model')">
                          <svg class="help-entry" aria-hidden="true">
                            <use xlink:href="#icon-help"></use>
                          </svg>
                          <div class="model-help">了解数据模型</div>
                        </div>
                      </div>
                    </div>
                    <div slot="reference">
                      <i class="el-icon-more" style="color: #333333; font-size: 14px"/>
                    </div>
                  </el-popover>
                </div>
              </el-menu-item>
            </draggable>
          </template>
        </el-submenu>
      </draggable>
    </div>

    <!-- 应用类移动位置 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="handleClose">
      <div v-if="dialogVisible">
        <jvs-form :formData="formData" :option="formOption" @submit="submitHandle" @cancalClick="handleClose"></jvs-form>
      </div>
    </el-dialog>
    <!-- 自定义页面修改 -->
    <el-dialog
      title="修改页面"
      :visible.sync="pageVisible"
      append-to-body
      :before-close="handleClosePage">
      <div v-if="pageVisible">
        <jvs-form :formData="pageFormData" :option="pageOption" @submit="submitPage" @cancalClick="handleClosePage"></jvs-form>
      </div>
    </el-dialog>
    <!-- 设置页面为首页 -->
    <el-dialog
      title="设置首页"
      :visible.sync="urlVisible"
      append-to-body
      width="600px"
      :before-close="handleCloseUrl">
      <el-form ref="urlForm" :model="urlFormData" :rules="urlFormRule" label-width="80px">
        <el-form-item label="用户等级" prop="userLevel">
          <el-select style="width: 400px" size="mini" v-model="urlFormData.userLevel" placeholder="请选择用户等级">
            <el-option
              v-for="item in userLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="submitUrl">确定</el-button>
          <el-button size="mini" @click="handleCloseUrl">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
import {GetMenuList, sortMenuList,draggableMenuSort} from '@/api/admin/menu'
import {editCataType, delCataType, editDesign, delDesign, setIndexPage} from '@/components/template/api'
import { localMenu } from './localMenu.js'
import {getUserLevelList, edit} from "@/views/upms/views/userLevel/api";
export default {
  name: "sidebarItem",
  data () {
    return {
      // localMenu: localMenu,
      config: config,
      falgs: 'movemenu',
      disabled: false,
      sortList: [],
      dialogTitle: '',
      dialogType: '',
      dialogVisible: false,
      urlVisible: false,
      userLevelList: [],
      userLevelOption: [],
      indexUrl: '',
      pageVisible: false,
      itemData: null,
      urlFormData: {
        userLevel: ''
      },
      urlFormRule: {
        userLevel: [{ required: true, message: '请选择用户等级', trigger: 'change' }],
      },
      pageFormData: {},
      pageOption: {
        emptyBtn: false,
        submitBtnText: '确定',
        submitLoading: false,
        column: [
          {
            label: "页面名称",
            prop: "name",
            searchSpan: 4,
            search: true,
            rules: [
              { required: true, message: '请输入页面名称', trigger: 'blur' },
              { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
            ],
          },
          {
            label: "目标地址",
            prop: "url",
            searchSpan: 4,
            search: true,
            rules: [
              { required: true, message: '请输入目标地址', trigger: 'blur' },
            ],
          },
          {
            label: "描述",
            prop: "description",
            searchSpan: 4,
            search: true
          },
          {
            label: "图标",
            prop: "icon",
            type: 'iconSelect'
          },
        ]
      },
      formData: {},
      formOption: {
        emptyBtn: false,
        formAlign: 'top',
        submitBtnText: '确定',
        column: [
          {
            label: '选择目录',
            prop: 'type',
            type: 'select',
            multiple: false,
            dicData: [],
            rules: [{ required: true, message: '目录不能为空', trigger: 'change' }],
            display: true
          },
          {
            label: '名称',
            prop: 'name',
            rules: [
              { required: true, message: '名称不能为空', trigger: 'blur' },
              { max: 6, message: '名称不得超过6个字符', trigger: 'blur' }
            ],
            display: true
          },
          {
            label: '图标',
            prop: 'icon',
            type: 'iconSelect'
          },
        ]
      }
    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    appSetting: {
      type: Boolean,
      default: false
    },
    // menuType: {
    //   type: String,
    //   default: 'platform'
    // },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    },
    needmove: {
      type: Boolean,
      default: false
    },
    appItem: {
      type: Object
    }
  },
  created () {},
  mounted () {
    // 防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  computed: {
    ...mapGetters(["roles", 'appSettingOpen', 'menuType']),
    labelKey () {
      return this.props.label||this.config.propsDefault.label;
    },
    pathKey () {
      return this.props.path||this.config.propsDefault.path;
    },
    iconKey () {
      return this.props.icon||this.config.propsDefault.icon;
    },
    nowTagValue () {
      return this.$router.$jvsRouter.formatMenuPath(this.$route);
    },
    getRole(){
      return this.appItem?.extend?.designRole || false
    },
    localMenu () {
      return this.menuType === 'platform' ? localMenu.platformMenu : localMenu.systemMenu
    },
    getMenu:{
      get(){
        return this.menu || []
      },
      set(val){
        this.$emit('changeMenu',val)
      }
    }
  },
  methods: {
    // 关闭自定义页面设置弹窗
    handleClosePage() {
      this.pageVisible = false
    },
    // 修改自定义页面 提交
    submitPage(form) {
    },
    // 了解数据模型
    handleLearn(str) {
      this.$openUrl('', '_blank', str)
    },
    // 创建设计
    handleCreate(type, it) {
      const params = {
        name: '',
        jvsAppId: it.extend.jvsAppId,
        dataModelId: it.extend.dataModelId,
        type: it.extend.type
      }
    },
    handleDesign(obj) {
      let str = ''
      if (obj.extend && obj.extend.design) {
        switch (obj.extend.design) {
          case 'page':
            str = location.origin + (`/page-design-ui/#/crud/design?jvsAppId=${obj.extend.jvsAppId}&id=`+obj.extend.id + (obj.extend.dataModelId ? `&dataModelId=${obj.extend.dataModelId}` : ''))
            this.$openUrl(str, '_blank')
            break
          case 'form':
            str = location.origin + (`/page-design-ui/#/form?jvsAppId=${obj.extend.jvsAppId}&id=`+obj.extend.id + (obj.extend.dataModelId ? `&dataModelId=${obj.extend.dataModelId}` : ''))
            this.$openUrl(str, '_blank')
            break
          case 'chart':
            str = location.origin + (`/chart-design-ui/#/chartDesign?jvsAppId=${obj.extend.jvsAppId}&id=`+obj.extend.id)
            this.$openUrl(str, '_blank')
            break
          case 'screen':
            str = location.origin + (`/jvs-report-ui/#/report/screenDesign?jvsAppId=${obj.extend.jvsAppId}&id=` + obj.extend.id)
            this.$openUrl(str, '_blank')
            break
        }
      }
    },
    vaildAvtive (item) {
      const groupFlag=(item["group"]||[]).some(ele =>
        this.$route.path.includes(ele)
      );
      if(item[this.pathKey]||groupFlag) {
        return this.nowTagValue===item[this.pathKey]||groupFlag;
      }else{
        if(this.nowTagValue.includes('?')) {
          let tp = this.nowTagValue.split('?')[1]
          let tarr = tp.split('&')
          let boolTemp = true
          for(let i in tarr) {
            let oba = tarr[i].split('=')
            if(item[oba[0]] != oba[1] && JSON.stringify(item[oba[0]]) != oba[1]) {
              boolTemp = false
            }
          }
          return boolTemp
        }
      }
    },
    isSvg(item) {
      if (item) {
        return true // item.indexOf("icon-") === -1
      }
    },
    vaildRoles (item) {
      item.meta=item.meta||{};
      return item.meta.roles? item.meta.roles.includes(this.roles):true;
    },
    validatenull (val) {
      return validatenull(val);
    },
    open (item) {
      this.$emit('openCatalogue', null)
      if (item.design) {
        let url = ''
        let str = ''
        switch (item.design) {
          case 'chart':
            url = `/chart-design-ui/chartUse?type=pc&id=${item.id}&jvsAppId=${item.jvsAppId}`;
            break;
          case 'page':
            url = `/page-design-ui/list/use?id=${item.id}&dataModelId=${item.dataModelId}&jvsAppId=${item.jvsAppId}`;
            break;
          case 'form':
            url = `/page-design-ui/form/use?id=${item.id}&dataModelId=${item.dataModelId}&jvsAppId=${item.jvsAppId}`;
            break;
          case 'screen':
            this.$openUrl(`/jvs-report-ui/#/report/screenPreview?tplId=${item.id}&jvsAppId=${item.jvsAppId}`, '_blank')
            // str = location.origin + ('/jvs-report-ui/#/report/screenDesign?id=' + item.id + `&jvsAppId=${item.jvsAppId}`)
            // this.$openUrl(str, '_blank')
            break;
          case 'URL':
            url = item.url;
            break;
          default: ;break;
        }
        if (str !== '') {
          return
        }
        let tmps = ""
        if(url.indexOf('#') > -1){
          tmps = (url && ('#' + url.split('#')[1])) || ''
        }else{
          let indx = url.indexOf('-ui')
          if(indx > -1) {
            tmps = url.slice(0, indx+3) + '/#' + url.slice(indx+3, url.length)
          }
        }
        if(this.$route.hash && this.$route.query && this.$route.query.src  && tmps == (this.$route.query.src  + this.$route.hash)) {
          return false
        }
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item.name,
            src: url
          }),
        })
        return
      }
      // 重复点击不跳转
      let tempStr = ""
      if(item.url.indexOf('#') > -1){
        tempStr = (item.url && ('#' + item.url.split('#')[1])) || ''
      }else{
        let indx = item.url.indexOf('-ui')
        if(indx > -1) {
          tempStr = item.url.slice(0, indx+3) + '/#' + item.url.slice(indx+3, item.url.length)
        }
      }
      if(this.$route.hash && this.$route.query && this.$route.query.src  && tempStr == (this.$route.query.src  + this.$route.hash)) {
        return false
      }
      if (this.screen<=1) this.$store.commit("SET_COLLAPSE");
      this.$router.$jvsRouter.group=item.group;
      // this.$router.push({
      //   path: this.$router.$jvsRouter.getPath({
      //     name: item[this.labelKey],
      //     src: item[this.pathKey]
      //   }),
      //   query: item.query,
      //   params: item.params
      // })
      if(item.newWindow === true) {
        if(item.url.includes('http') || item.url.includes('https') || item.url.includes('ftp')) {
          this.$openUrl(item[this.pathKey], '_blank')
        }else{
          if(item.url.indexOf('-ui') == -1) {
            this.$openUrl(item[this.pathKey], '_blank')
          }else{
            let tinx = item.url.indexOf('-ui')
            let tpStr = item.url.slice(0, (tinx+3)) + '/#' + item.url.slice(tinx+3, item.url.length)
            this.$openUrl(tpStr, '_blank')
          }
        }
      }else{
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey]
          }),
          query: item.query,
          params: item.params
        })
      }
    },
    startMove (event) {
      this.falgs = ''
      this.sortList = JSON.parse(JSON.stringify(this.menu))
    },
    endMove (ev) {
      this.falgs = 'movemenu'
      let temp = []
      for(let i in this.menu) {
        this.menu[i].sort =  i
        temp.push({
          menuId: this.menu[i].id,
          sort: i
        })
      }
      // 权限---修改菜单顺序
      if(this.$permissionMatch("upms_mgr_xiu_gai_cai_dan_shun_xu")) {
        sortMenuList(temp).then(res => {
          if(res.data.code == 0) {
            console.log('成功')
          }
        }).catch(e => {
          this.menu = JSON.parse(JSON.stringify(this.sortList))
        })
      }
    },
    // 打开目录
    openCatalogue (item) {
      if(this.appItem && item.extend.designRole) {
        this.$emit('openCatalogue', item)
      }
    },
    // 应用更多操作
    moreHandle (type, item) {
      switch(type) {
        case 'del':
          let str = '确定删除此'
          if(item.extend && item.extend.design) {
            // str += '页面'
            str = '删除后关联的页面或功能将无法使用，请谨慎操作！'
          }else{
            str += '目录？'
          }
          this.$confirm(`${str}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(item.extend && item.extend.design) {
              // 页面
              delDesign({appId: this.appItem.id, designId: item.id, designType: item.extend.design}).then(res => {
                if(res.data && res.data.code == 0) {
                  this.$message.success('删除成功')
                  this.$emit('freshAllMenu', true)
                }
              })
            }else{
              delCataType({appId: this.appItem.id, type: item.name}).then(res => {
                if(res.data && res.data.code == 0) {
                  this.$message.success('删除成功')
                  this.$emit('freshAllMenu', true)
                }
              })
            }
          }).catch(e => {});
          break;
        case 'move':
          this.dialogType = type;
          this.dialogTitle = '移动';
          this.formOption.column.filter(col => {
            if(col.prop == 'type') {
              col.display = true
              let dicData = []
              for(let i in this.menu) {
                if(this.menu[i].id != item.parentId) {
                  dicData.push({
                    value: this.menu[i].name,
                    label: this.menu[i].name
                  })
                }
              }
              col.dicData = dicData
            }else{
              col.display = false
            }
          })
          item.type = item.extend.type
          this.formData = JSON.parse(JSON.stringify(item))
          this.dialogVisible = true;
          break;
        case 'rename':
          this.dialogType = type;
          this.dialogTitle = '重命名';
          this.formOption.column.filter(col => {
            if(col.prop == 'name' || col.prop == 'icon') {
              col.display = true
            }else{
              col.display = false
            }
          })
          this.itemData = item
          this.formData = JSON.parse(JSON.stringify(item))
          this.formData.icon = JSON.parse(JSON.stringify(item)).extend.icon
          this.dialogVisible = true;
          break;
        case 'edit':
          this.dialogType = type;
          this.itemData = item
          this.pageFormData = JSON.parse(JSON.stringify(item.extend))
          this.pageVisible = true;
          break;
        case 'index':
          let url = ''
          if(item.extend){
            switch(item.extend.design) {
              case 'URL':
                url = item.extend.url;
                break;
              // case 'page':
              //   url = `/page-design-ui/#/list/use?id=${item.id}&dataModelId=${item.extend.dataModelId}&jvsAppId=${item.extend.jvsAppId}`;
              //   break;
              // case 'form':
              //   url = `/page-design-ui/#/form/use?id=${item.id}&dataModelId=${item.extend.dataModelId}&jvsAppId=${item.extend.jvsAppId}`;
              //   break;
              case 'chart':
                url = `/chart-design-ui/#/chartUse?type=pc&id=${item.id}&jvsAppId=${item.extend.jvsAppId}`;
                break;
               // case 'screen':
               //  url = `/jvs-report-ui/#/report/screenDesign?jvsAppId=${item.extend.jvsAppId}&id=` + item.id;
               //  break;
              default: ;break;
            }
          }
          this.indexUrl = url
          getUserLevelList().then(res => {
            if (res.data.code==0) {
              this.userLevelList = res.data.data || []
              this.userLevelOption = res.data.data.map(item => {
                return {
                  label: item.name,
                  value: item.name
                }
              })
              this.urlVisible = true
            }
          })
          // this.$confirm('确认设置为首页？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   setIndexPage({url: url}).then(res => {
          //     if(res.data && res.data.code == 0) {
          //       this.$message.success('设置首页成功')
          //     }
          //   })
          // }).catch(e => {})
          break;
        default: ;break;
      }
    },
    // 关闭设置首页弹窗
    handleCloseUrl() {
      this.urlVisible = false
      this.urlFormData = {
        userLevel: ''
      }
    },
    // 提交设置首页
    submitUrl() {
      this.$refs.urlForm.validate((valid) => {
        if (valid) {
          const index = this.userLevelList.findIndex(item => {
            return item.name = this.urlFormData.userLevel
          })
          this.userLevelList[index].indexUrl = this.indexUrl
          this.$confirm('确认设置为首页？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            edit(this.userLevelList[index]).then(res => {
              if(res.data && res.data.code == 0) {
                this.$message.success('设置首页成功')
                this.handleCloseUrl()
              }
            })
          }).catch(e => {})
        } else {
          return false;
        }
      });
    },
    // 关闭弹框
    handleClose () {
      this.dialogType = ''
      this.dialogTitle = ''
      this.dialogVisible = false
      this.formData = {}
      this.itemData = null
    },
    // 移动  重命名  提交
    submitHandle () {
      // 页面
      if(this.formData.extend && this.formData.extend.design) {
        let obj = {
          appId: this.formData.extend.jvsAppId,
          designId: this.formData.id,
          designType: this.formData.extend.design,
          name: this.formData.name,
          icon: this.formData.icon
        }
        if(this.dialogType == 'rename') {
          obj.type = this.formData.extend.type
        }else{
          obj.type = this.formData.type
        }
        editDesign(obj).then(res => {
          if(res.data && res.data.code == 0) {
            this.$message.success(`${this.dialogType == 'rename' ? '重命名' : '移动'}成功`)
            this.handleClose()
            this.$emit('freshAllMenu', true)
          }
        })
      }else{
        let obj = {
          appId: this.appItem.id,
          newType: this.formData.name,
          type: this.itemData.name,
          icon: this.formData.icon
        }
        editCataType(obj).then(res => {
          if(res.data && res.data.code == 0) {
            this.$message.success('重命名成功')
            this.handleClose()
            this.$emit('freshAllMenu', true)
          }
        })
      }
    },
    menuSort(e){
      const domArr = document.getElementById("menu-sort").children
      let stageSortList = []
      for (let i = 0, len = domArr.length; i < len; i++) {
        stageSortList.push(domArr[i].getAttribute('id'));
      }
      draggableMenuSort(this.appItem.id, {
        sortList:stageSortList,
        appId:this.appItem.id
      }).then(res=>{
        // console.log(res)
      })
    },
    childrenEnd(event){
      console.log(event)
      let codes = [];
      // 获取目标列ID
      const toMenuCode = event.to.parentNode.parentNode.getAttribute('id');
      // 获取原列ID
      const fromMenuCode = event.from.parentNode.parentNode.getAttribute('id')
      this.$nextTick(()=>{
        for (let i = 0, len = event.to.children.length; i < len; i++) {
          codes.push(event.to.children[i].id)
        }
        draggableMenuSort(this.appItem.id, {
          sortList:codes,
          toMenuCode,
          appId:this.appItem.id
        }).then(res=>{
          // console.log(res)
        })
      })
    }
  }
};
</script>
<style lang="scss">
.el-popper{
  padding: 8px 0!important;
  .more-box{
    //padding: 0 6px;
    .more-item{
      height: 32px;
      line-height: 32px;
      padding: 6px 24px;
      cursor: pointer;
      transition: 0.3s;
      &:hover{
        transition: 0.3s;
        background-color: #eff2f7;
      }
    }
    .model-header{
      font-size: 12px;
      padding: 6px 38px;
      color: #bbb3b3;
    }
    .model-box{
      display: flex;
      cursor: pointer;
      padding: 6px 12px;
      transition: 0.3s;
      &:hover{
        transition: 0.3s;
        background-color: #eff2f7;
      }
      .model-title{
        margin-bottom: 4px;
      }
      .model-explain{
        font-size: 12px;
        color: #bbb3b3;
      }
    }
    .model-learn{
      cursor: pointer;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      .help-entry{
        fill: #bbb3b3;
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      .model-help{
        color: #bbb3b3;
        font-size: 12px;
      }
    }
  }
}
.menu-item-head{
  font-size: 14px;
  color: #9d9d9d;
  padding: 12px;
}
.menu-item-li{
  overflow: hidden;
  display: flex;
  //align-items: center;
  justify-content: space-between;
  position: relative;
  //margin: 0 20px;
  border-radius: 6px;
  .more{
    position: absolute;
    right: -20px;
    display: none;
    margin-right: 16px;
  }
  .el-tooltip{
    display: flex!important;
    align-items: center;
  }
  .dragicon{
    cursor: move;
    position: absolute;
    right: 0;
    display: none;
  }
  .menu-item-it{
    margin-left: 12px;
    position: absolute;
  }
}
.menu-item-li:hover .dragicon{
  display: block;
}
.menu-item-li:hover .more{
  display: block;
}
.menu-item-li:hover .menu-item-it{
  width: 120px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.menu-item-li::before{
  //content: "";
  //top: 0;
  //left: 0;
  //bottom: 0;
  //width: 4px;
  //height: 50px;
  // background: $mainBg;
  //position: absolute;
}
.notmove{
  // border-top: 1px solid rgba(0, 21, 41, 0.15);
  .collapseNav{
    .el-submenu__icon-arrow{
      display: none;
    }
  }
  .el-submenu__title{
    border-radius: 6px;
  }
  .catalogue-item{
    height: 45px;
    line-height: 45px;
    display:flex;
    align-items:center;
    width: calc(100% - 10px);
    justify-content: space-between;
    .more{
      display: none;
      .el-popover__reference-wrapper{
        display: flex;
      }
    }
  }
  .catalogue-item:hover{
    .more{
      display: block;
    }
  }
}
.menu-ghost {
  background: #e5e5e5 !important;
  div {
    visibility: hidden;
  }
}
.menu-children-ghost {
  border-left: 3px solid #e5e5e5 !important;
  background: #e5e5e5;
  * {
    visibility: hidden;
    //display: none;
  }
}
</style>

