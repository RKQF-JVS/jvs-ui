<template>
  <div class="jvs-tags" v-if="showTag" :style="'height: ' + $store.getters.theme.logo.height + ';'">
    <div
      class="jvs-tags__box"
      :class="{'jvs-tags__box--close':!website.isFirstPage}"
      :style="'height:'+ $store.getters.theme.logo.height"
    >
      <div class="lineBox">
        <div class="top-nav" :style="'padding-left:calc( '+$store.getters.theme.logo.width+' );width:calc(100% - '+ $store.getters.theme.logo.width +');'">
          <ul class="system-list">
<!--            <li v-for="(si, sindex) in sysList" v-if="sindex < 5" :key="si.name+sindex" @click="entrySystem(si)" :class="{'activeSysItem': si.id == activeSystem}" @mouseover="isMOreEntry = false;">-->
<!--              <span>{{si.name}}</span>-->
<!--            </li>-->
<!--            <li v-if="sysList.length > 5" class="more-nav" :class="{'activeSysItem': isMOreEntry}" @mouseover="entryMore(true)">-->
<!--              <span>快捷导航</span>-->
<!--              <i v-if="!isMOreEntry" class="el-icon-arrow-down down" style="margin-left:10px;color: #333;font-size: 18px!important;"></i>-->
<!--              <i v-else class="el-icon-arrow-up up" style="margin-left:10px;color: #333;font-size: 18px!important;"></i>-->
<!--            </li>-->
            <li class="more-nav" :class="{'activeSysItem': isMOreEntry}" @click="entryMore(true)">
              <span>快捷导航</span>
              <i v-if="!isMOreEntry" class="el-icon-arrow-down down" style="margin-left:10px;color: #333;font-size: 18px!important;"></i>
              <i v-else class="el-icon-arrow-up up" style="margin-left:10px;color: #333;font-size: 18px!important;"></i>
            </li>
          </ul>
        </div>
        <!-- 右上角工具栏 -->
        <div class="rightTool">
          <el-popover
            placement="bottom"
            trigger="hover">
            <div slot="reference" class="customer-org"><i class="el-icon-plus"/></div>
            <div>
              <div class="org-menu-item" @click="handleJoinOrg">加入组织</div>
<!--              <div class="org-menu-item" @click="handleCreateOrg">创建组织</div>-->
            </div>
          </el-popover>
          <!-- 消息通知 -->
          <el-popover
            v-if="true"
            placement="bottom"
            width="380"
            popper-class="my-popover"
            trigger="click"
            v-model="visible">
            <div class="right-search" slot="reference" @click="openMessage">
              <el-badge v-if="remainingCount > 0" :value="remainingCount" :max="99" style="line-height: normal;">
                <svg style="cursor:pointer;" width="17" height="17" t="1618561774520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19059" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path :fill="$store.getters.theme.topNav.fontColor" d="M721.338182 350.859636a64.512 64.512 0 0 1 64.512 64.488728 64.512 64.512 0 0 1-129.000727 0 64.488727 64.488727 0 0 1 64.488727-64.488728zM495.592727 350.859636a64.465455 64.465455 0 1 1 0 128.977455 64.465455 64.465455 0 0 1 0-128.977455zM269.847273 350.859636a64.512 64.512 0 1 1 0 129.000728 64.512 64.512 0 0 1 0-129.000728z" p-id="19060"></path>
                  <path :fill="$store.getters.theme.topNav.fontColor" d="M427.264 930.769455a32.116364 32.116364 0 0 1-28.299636-16.756364l-109.544728-192.069818a32.186182 32.186182 0 0 1 12.032-43.962182 32.116364 32.116364 0 0 1 43.962182 12.032l81.850182 143.429818 81.850182-143.429818c8.843636-15.499636 28.509091-20.945455 43.985454-12.032 15.476364 8.797091 20.852364 28.485818 12.032 43.962182l-109.568 192.069818a32.302545 32.302545 0 0 1-28.229818 16.756364h-0.069818z" p-id="19061"></path>
                  <path :fill="$store.getters.theme.topNav.fontColor" d="M837.934545 737.024H540.439273c-17.826909 0-32.256-14.405818-32.256-32.256s14.429091-32.256 32.256-32.256h297.495272c42.146909 0 76.404364-32.814545 76.404364-73.146182V230.795636c0-40.308364-34.280727-73.076364-76.404364-73.076363H186.042182c-42.123636 0-76.381091 32.768-76.381091 73.076363v368.570182c0 40.308364 34.257455 73.146182 76.381091 73.146182h129.419636c17.826909 0 32.256 14.405818 32.256 32.256s-14.429091 32.256-32.256 32.256H186.042182c-77.684364 0-140.893091-61.719273-140.893091-137.634909V230.795636c0-75.869091 63.208727-137.588364 140.893091-137.588363h651.892363c77.684364 0 140.916364 61.719273 140.916364 137.588363v368.570182c0 75.938909-63.232 137.658182-140.916364 137.658182z" p-id="19062"></path>
                </svg>
              </el-badge>
              <svg v-else style="cursor:pointer;" width="17" height="17" t="1618561774520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19059" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :fill="$store.getters.theme.topNav.fontColor" d="M721.338182 350.859636a64.512 64.512 0 0 1 64.512 64.488728 64.512 64.512 0 0 1-129.000727 0 64.488727 64.488727 0 0 1 64.488727-64.488728zM495.592727 350.859636a64.465455 64.465455 0 1 1 0 128.977455 64.465455 64.465455 0 0 1 0-128.977455zM269.847273 350.859636a64.512 64.512 0 1 1 0 129.000728 64.512 64.512 0 0 1 0-129.000728z" p-id="19060"></path>
                <path :fill="$store.getters.theme.topNav.fontColor" d="M427.264 930.769455a32.116364 32.116364 0 0 1-28.299636-16.756364l-109.544728-192.069818a32.186182 32.186182 0 0 1 12.032-43.962182 32.116364 32.116364 0 0 1 43.962182 12.032l81.850182 143.429818 81.850182-143.429818c8.843636-15.499636 28.509091-20.945455 43.985454-12.032 15.476364 8.797091 20.852364 28.485818 12.032 43.962182l-109.568 192.069818a32.302545 32.302545 0 0 1-28.229818 16.756364h-0.069818z" p-id="19061"></path>
                <path :fill="$store.getters.theme.topNav.fontColor" d="M837.934545 737.024H540.439273c-17.826909 0-32.256-14.405818-32.256-32.256s14.429091-32.256 32.256-32.256h297.495272c42.146909 0 76.404364-32.814545 76.404364-73.146182V230.795636c0-40.308364-34.280727-73.076364-76.404364-73.076363H186.042182c-42.123636 0-76.381091 32.768-76.381091 73.076363v368.570182c0 40.308364 34.257455 73.146182 76.381091 73.146182h129.419636c17.826909 0 32.256 14.405818 32.256 32.256s-14.429091 32.256-32.256 32.256H186.042182c-77.684364 0-140.893091-61.719273-140.893091-137.634909V230.795636c0-75.869091 63.208727-137.588364 140.893091-137.588363h651.892363c77.684364 0 140.916364 61.719273 140.916364 137.588363v368.570182c0 75.938909-63.232 137.658182-140.916364 137.658182z" p-id="19062"></path>
              </svg>
            </div>
            <template>
              <div v-loading="messageLoading" class="my-popover-box">
<!--                <div class="right-tab">-->
<!--                  <div class="right-tabsize" :v-model="readStatus" @click="editreadStatus()">-->
<!--                    <i class="el-icon-success" style="color:#3ABB07;"></i>-->
<!--                    <span style="font-size:14px;" class="right-tabhover"-->
<!--                          :style="readStatus ? 'color:#ccc;' : ''">全部标记为已读</span>-->
<!--                  </div>-->
<!--                </div>-->
                <div style="padding: 8px 30px 0;">
                  <el-tabs v-model="activeName" @tab-click="tabClick">
                    <el-tab-pane label="通知" name="1"></el-tab-pane>
                    <el-tab-pane label="项目" name="2"></el-tab-pane>
                  </el-tabs>
                </div>
<!--                <el-divider></el-divider>-->
                <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}" style="height:565px;">
                  <div class="top-tab"  v-for="(item,index) in insideList" :key="index"
                       @click="changeDetail(item.id,index,'insideList', item)" :style="(item.readIs || readStatus) ? 'color:#ccc;' : ''">
                    <div style="display:flex;align-items: center;height: 44px;">
<!--                      <img :src="renwu" alt="" v-if="item.clientCode === 'teamwork'" style="width: 20px;height: 20px;margin-left: -36px;padding: 0px 16px 0px 0px;" />-->
<!--                      <img :src="wendang" v-else-if="item.clientCode === 'knowledge'" alt="" style="width: 20px;height: 20px;margin-left: -36px;padding: 0px 16px 0px 0px;"  />-->
<!--                      <div class="top-tab-span">-->
<!--                        <div>{{item.subClass}}</div>-->
<!--                        <div>{{item.msgContent.title}}</div>-->
<!--                      </div>-->
                      <svg style="width: 30px;height: 30px;margin-right: 16px" aria-hidden="true">
                        <use xlink:href="#icon-gerentousudengji"></use>
                      </svg>
                      <div style="height: 40px;">
                        <div style="margin-top: 2px">{{item.subClass}}</div>
                        <div :title="item.msgContent.title" style="width: 180px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.msgContent.title}}</div>
                      </div>
                      <span class="top-tab-span-span">{{item.createTime | formatLogTime}}</span>
                    </div>
<!--                    <div class="top-txt">{{item.msgContent.content}}</div>-->
<!--                    <el-divider></el-divider>-->
                  </div>
                  <el-empty v-if="insideList && insideList.length===0"></el-empty>
                </vue-scroll>
                <div class="bottom-txt">
                  <el-divider></el-divider>
                  <div class="bottom-all">
                    <div :v-model="readStatus" @click="editreadStatus()">
                      <span style="font-size:14px;" class="right-tabhover"
                            :style="readStatus ? 'color:#ccc;' : ''">全部标记为已读</span>
                    </div>
                    <div @click="allnotice">所有消息</div>
                  </div>
                </div>
              </div>
            </template>
          </el-popover>
          <!-- 所有消息 -->
          <el-dialog
            title="所有消息"
            :visible.sync="connectVisible"
            append-to-body
            width="1090px"
            custom-class="customheight dialog-no-header dialog-center message-dialog"
            :before-close="handleConnectClose">
<!--            <div class="task-headers">-->
<!--              <span class="head-title" style="margin-left: 25%;">-->
<!--                <span style=" display: flex; align-items: center;">-->
<!--                    <span class="muted">所有消息</span>-->
<!--                </span>-->
<!--              </span>-->
<!--              <div class="right-tab">-->
<!--                <div style="position: relative;left: -30px;">-->
<!--                  <el-select v-model="tabActive" class="select-options" @change="allnotice" size="mini">-->
<!--                    <el-option v-for="(item,index) in mesOption"-->
<!--                               :key="index"-->
<!--                               :label="item.label"-->
<!--                               :value="item.name">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--                <div class="right-tabsize" :v-model="readStatus" @click="editreadStatus()">-->
<!--                  <i class="el-icon-success" style="color:#3ABB07;"></i>-->
<!--                  <span style="font-size:14px;" class="right-tabhover"-->
<!--                        :style="readStatus ? 'color:#ccc;' : ''">全部标记为已读</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <span class="header-actions text-right">-->
<!--                <el-tooltip placement="bottom" :visible-arrow="false" popper-class="tooltip-class">-->
<!--                  <template slot="content">-->
<!--                    <span>关闭面板</span>-->
<!--                  </template>-->
<!--                  <a class="action-item muted" @click="handleConnectClose"><i class="el-icon-close"/></a>-->
<!--                </el-tooltip>-->
<!--              </span>-->
<!--            </div>-->
            <div class="right-tab">
              <div class="right-tabsize" :v-model="readStatus" @click="editreadStatus()">
                <i class="el-icon-success" style="color:#3ABB07;"></i>
                <span style="font-size:14px;" class="right-tabhover"
                      :style="readStatus ? 'color:#ccc;' : ''">全部标记为已读</span>
              </div>
            </div>
            <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}" style="height:626px;">
              <div class="top-tab"  v-for="(item,index) in noList" :key="index"
                   @click="changeDetail(item.id,index,'noList', item)" :style="(item.readIs || readStatus) ? 'color:#ccc;' : ''">
                <div style="display:flex;">
<!--                  <img :src="renwu" alt="" v-if="item.clientCode === 'teamwork'" style="width: 20px;height: 20px;margin-left: -36px;margin-right:16px;padding:0px;" />-->
<!--                  <img :src="wendang" v-else-if="item.clientCode === 'knowledge'" alt="" style="width: 20px;height: 20px;margin-left: -36px;margin-right:16px;padding:0px;"  />-->
                  <div style="display:flex;">
                    <span class="top-tab-span">{{item.msgContent.title}}</span>
                    <span class="top-tab-span-span">{{item.createTime}}</span>
                  </div>
                </div>
                <el-divider></el-divider>
                <el-empty v-if="noList && noList.length===0"></el-empty>
              </div>
            </vue-scroll>
          </el-dialog>
          <!-- 消息详情 -->
          <el-dialog
            title="消息详情"
            :visible.sync="connectVisibles"
            append-to-body
            width="1100px"
            custom-class=" dialog-center dialog-no-header customheight"
            :before-close="handleConnectCloses">
            <div class="message-detail">
              <div class="left" v-loading="messageLoading">
                <vue-scroll :ops="{bar: {background: 'rgba(206,206,206,0)',onlyShowBarOnScroll:false,minSize:0.1}}" style="height:535px;">
                  <div class="top-tab"  v-for="(item,index) in insideList" :key="index"
                       @click="selectDetail(item.id,index,'insideList', item)" :style="(item.readIs || readStatus) ? 'color:#ccc;' : ''">
                    <div style="display:flex;align-items: center;height: 44px;">
                      <svg style="width: 30px;height: 30px;margin-right: 16px" aria-hidden="true">
                        <use xlink:href="#icon-gerentousudengji"></use>
                      </svg>
                      <div style="height: 40px;">
                        <div style="margin-top: 2px">{{item.subClass}}</div>
                        <div :title="item.msgContent.title" style="width: 180px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.msgContent.title}}</div>
                      </div>
                      <span class="top-tab-span-span">{{item.createTime | formatLogTime}}</span>
                    </div>
                    <!--                    <div class="top-txt">{{item.msgContent.content}}</div>-->
                    <!--                    <el-divider></el-divider>-->
                  </div>
                  <el-empty v-if="insideList && insideList.length===0"></el-empty>
                </vue-scroll>
                <div class="left-pagination">
                  <el-pagination
                    layout="prev, pager, next"
                    :page-size="page.size"
                    :pager-count="5"
                    :current-page="page.current"
                    @current-change="handleCurrentChange"
                    :total="page.total">
                  </el-pagination>
                </div>
              </div>
              <div v-loading="noDetailLoading" v-if="noDetailList.msgContent" class="right">
<!--                <div v-if="noDetailLoading" class="loading-back"></div>-->
                <div class="right-title">{{noDetailList.msgContent.title}}</div>
                <section v-if="noDetailList.msgContent.content" v-html="noDetailList.msgContent.content"></section>
              </div>
            </div>
<!--            <vue-scroll v-loading="noDetailLoading" :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}" style="height:598px;">-->
<!--              <div class="top-tabs">-->
<!--                <div class="top-tabs-pad">-->
<!--                  <span>消息标题：{{noDetailList.title}}</span>-->
<!--                </div>-->
<!--                <div class="top-tabs-pad">-->
<!--                  <span>消息来源：{{noDetailList.clientName}}</span>-->
<!--                </div>-->
<!--                <div class="top-tabs-pad">-->
<!--                  <span>消息时间：{{noDetailList.createTime}}</span>-->
<!--                </div>-->
<!--                <div class="top-tabs-pad">-->
<!--                  <span>消息内容：</span>-->
<!--                </div>-->
<!--                <div class="top-tabs-pad-content">-->
<!--                  <section v-if="noDetailList.msgContent && noDetailList.msgContent.content" v-html="noDetailList.msgContent.content"></section>-->
<!--                </div>-->
<!--              </div>-->
<!--            </vue-scroll>-->
          </el-dialog>
          <el-popover
            v-model="infoShow"
            placement="bottom"
            width="180"
            @show="handleShowInfo"
            @hide="handleHideInfo"
            trigger="hover">
            <div class="show-user-info-card" v-if="$store.getters.userInfo && false">
              <div>
                <h3>
                  <b>个人信息</b>
                  <span @click="goInfo('userManager')">更多</span>
                </h3>
                <div class="user-info-list-item">
                  <b>账号ID</b>
                  <span>{{$store.getters.userInfo.accountName}}</span>
                </div>
                <div class="user-info-list-item">
                  <b>手机</b>
                  <span>{{$store.getters.userInfo.phone}}</span>
                </div>
                <div class="user-info-list-item">
                  <b>职工编号</b>
                  <span>{{$store.getters.userInfo.employeeNo}}</span>
                </div>
                <div class="user-info-list-item">
                  <b>职位</b>
                  <span>{{$store.getters.userInfo.jobName}}</span>
                </div>
                <div class="user-info-list-item">
                  <b>部门</b>
                  <span>{{$store.getters.userInfo.deptName}}</span>
                </div>
              </div>
              <div>
                <h3><b>企业/组织</b></h3>
                <div class="user-info-list-item">
                  <img v-if="$store.state.common.tenantInfo.logo" :src="$store.state.common.tenantInfo.logo" alt="">
                  <span>{{$store.state.common.tenantInfo.shortName}}</span>
                </div>
              </div>
              <div>
                <div class="user-info-list-item">
                  <p>
                    <jvs-button size="mini" @click="logout">退出系统</jvs-button>
                  </p>
                </div>
              </div>
            </div>
            <div class="right-tool-menu">
              <div class="user-info">
                <img v-if="userInformation.headImg" :src="$store.getters.userInfo.headImg" alt="">
                <div>
                  <div :title="userInformation.realName" style="margin-left:10px;margin-bottom: 4px;width: 100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{userInformation.realName}}</div>
                  <div style="margin-left:10px;font-size: 12px">{{userInformation.phone}}</div>
                </div>
              </div>
              <div class="menu-item" @click="goInfo('userManager')">
                <svg t="1647997386356" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2195" width="16" height="16" style="margin-right: 12px;"><path d="M634.65472 581.91872c92.89728-45.48608 157.02016-140.65664 157.02016-251.04384C791.67488 176.41472 666.46016 51.2 512 51.2c-154.46016 0-279.67488 125.21472-279.67488 279.67488 0 110.3872 64.12288 205.57824 157.02016 251.04384-154.15296 49.37728-270.25408 188.7232-282.46016 357.56032-1.2288 17.12128 11.63264 31.98976 28.75392 33.23904 17.24416 1.20832 31.98976-11.65312 33.23904-28.75392C181.80096 764.90752 332.53376 624.64 512 624.64s330.19904 140.26752 343.1424 319.32416c1.18784 16.36352 14.82752 28.83584 30.96576 28.83584 0.75776 0 1.51552-0.02048 2.27328-0.08192 17.12128-1.2288 29.98272-16.11776 28.75392-33.23904C904.92928 770.64192 788.82816 631.296 634.65472 581.91872zM294.48192 330.87488c0-120.13568 97.3824-217.51808 217.51808-217.51808 120.13568 0 217.51808 97.3824 217.51808 217.51808S632.13568 548.39296 512 548.39296C391.86432 548.39296 294.48192 451.01056 294.48192 330.87488z" p-id="2196"></path></svg>
                <div>个人中心</div>
              </div>
              <div v-if="$store.getters.userInfo.platformAdmin" class="menu-item" @click="settingApp('platform')">
                <svg class="icon" aria-hidden="true" style="margin-right: 12px;width: 16px;height: 16px;">
                  <use :xlink:href="'#icon-gaojishezhi'"></use>
                </svg>
                <div>平台设置</div>
              </div>
              <div v-if="$store.getters.userInfo.adminFlag" class="menu-item" @click="settingApp('system')">
                <svg class="icon" aria-hidden="true" style="margin-right: 12px;width: 16px;height: 16px;">
                  <use :xlink:href="'#icon-electronics'"></use>
                </svg>
                <div>系统后台</div>
              </div>
              <div v-if="changeTenantsList && changeTenantsList.length > 0" class="menu-item" @click="switchTenant">
                <svg class="icon" aria-hidden="true" style="margin-right: 12px;width: 16px;height: 16px;">
                  <use :xlink:href="'#icon-switch'"></use>
                </svg>
                <div>切换租户</div>
              </div>
              <div style="width: 100%;height: 1px;background-color: #eeeeee"/>
              <div class="menu-item" @click="helpCenter('help-center')">
                <svg t="1647997474462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7185" width="16" height="16" style="margin-right: 12px;"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0zM512 960c-249.6 0-448-198.4-448-448 0-249.6 198.4-448 448-448s448 198.4 448 448C960 761.6 761.6 960 512 960z" p-id="7186"></path><path d="M467.2 748.8l89.6 0 0 89.6-89.6 0 0-89.6Z" p-id="7187"></path><path d="M512 185.6c-57.6 0-108.8 12.8-140.8 44.8s-57.6 76.8-64 134.4L384 377.6c6.4-44.8 19.2-76.8 44.8-96C454.4 262.4 480 249.6 512 249.6c32 0 64 12.8 89.6 32C627.2 307.2 640 332.8 640 364.8 640 384 633.6 396.8 627.2 416 614.4 428.8 601.6 448 569.6 473.6 544 492.8 524.8 512 518.4 524.8 499.2 544 492.8 556.8 486.4 576c-6.4 25.6-12.8 51.2-12.8 83.2 0 6.4 0 12.8 0 25.6l76.8 0c0-32 0-51.2 6.4-70.4S563.2 582.4 569.6 576c6.4-12.8 25.6-25.6 51.2-51.2 38.4-32 64-64 76.8-83.2s19.2-51.2 19.2-76.8c0-51.2-19.2-89.6-57.6-121.6C627.2 204.8 576 185.6 512 185.6z" p-id="7188"></path></svg>
                <div>帮助中心</div>
              </div>
              <div class="menu-item" @click="logout">
                <svg t="1647997444953" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6362" width="14" height="14" style="margin-right: 12px;"><path d="M1023.050881 511.52544c0 30.696522-20.456022 51.202498-51.202498 51.202498H664.983072c-30.696522 0-51.202498-20.456022-51.202497-51.202498s20.456022-51.202498 51.202497-51.202497h306.915265c30.696522 0 51.202498 20.456022 51.202497 51.202497z" p-id="6363"></path><path d="M0 511.52544C0 230.186448 230.186448 0 511.52544 0c158.602859 0 301.795014 71.608566 398.992341 194.382165 15.348261 20.456022 15.348261 56.197863-10.228011 71.608566-20.468511 15.348261-51.202498 10.228011-66.500805-10.228011C751.9399 158.602859 634.286551 102.305088 511.52544 102.305088c-225.066198 0-409.220352 184.141665-409.220352 409.220352S286.459242 920.745792 511.52544 920.745792c127.88136 0 240.414459-56.272794 322.201083-153.457632 15.335772-20.456022 51.202498-25.576272 71.608567-10.228011s25.576272 51.202498 10.228011 71.608567C813.320455 951.429826 670.103322 1023.050881 511.52544 1023.050881 230.186448 1023.050881 0 792.864432 0 511.52544z" p-id="6364"></path></svg>
                <div>退出登录</div>
              </div>
            </div>
            <p slot="reference" class="user-info-tool" :style="'color: '+ $store.getters.theme.topNav.fontColor +';'">
              <img v-if="userInformation.headImg" :src="$store.getters.userInfo.headImg" alt="">
              <span style="margin-left:10px;">{{userInformation.realName}}</span>
              <!-- <svg width="18" height="18" style="cursor:pointer;" t="1618561971348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37130" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :fill="$store.getters.theme.topNav.fontColor" d="M362.474667 128.375467h303.317333a123.349333 123.349333 0 0 1 106.824533 61.696l151.658667 262.749866a123.400533 123.400533 0 0 1 0 123.370667l-151.658667 262.7584a123.349333 123.349333 0 0 1-106.824533 61.691733h-303.317333a123.349333 123.349333 0 0 1-106.824534-61.696l-151.658666-262.754133a123.400533 123.400533 0 0 1 0-123.370667l151.658666-262.754133a123.349333 123.349333 0 0 1 106.824534-61.696z m0 64a59.349333 59.349333 0 0 0-51.396267 29.6832L159.419733 484.821333a59.400533 59.400533 0 0 0 0 59.383467L311.082667 806.954667a59.349333 59.349333 0 0 0 51.396266 29.687466h303.317334a59.349333 59.349333 0 0 0 51.396266-29.687466l151.658667-262.754134a59.400533 59.400533 0 0 0 0-59.383466L717.184 222.058667a59.349333 59.349333 0 0 0-51.396267-29.6832h-303.317333zM512 661.333333c-82.474667 0-149.333333-66.858667-149.333333-149.333333s66.858667-149.333333 149.333333-149.333333 149.333333 66.858667 149.333333 149.333333-66.858667 149.333333-149.333333 149.333333z m0-64c47.1296 0 85.333333-38.203733 85.333333-85.333333s-38.203733-85.333333-85.333333-85.333333-85.333333 38.203733-85.333333 85.333333 38.203733 85.333333 85.333333 85.333333z" p-id="37131"></path>
              </svg> -->
              <i v-if="!isShowInfo" class="el-icon-arrow-down down" style="color: #333;font-size: 18px!important;"></i>
              <i v-else class="el-icon-arrow-up up" style="color: #333;font-size: 18px!important;"></i>
            </p>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 主题风格定义框 -->
    <el-dialog
      title="主题设置"
      class="themeBox"
      v-if="themeShow"
      :visible.sync="themeShow"
      width="30%"
      :before-close="handleClose"
    >
      <div class="defalutThemeList">
        <h4>默认主题</h4>
        <el-radio-group v-model="defalutTheme">
          <el-radio :label="item.id" v-for="item in defalutThemeList" :key="'defalut'+item.id">
            <!-- <img :src="item.img" /> -->
            <span>{{item.name}}</span>
          </el-radio>
        </el-radio-group>
        <!-- 自定义 -->
        <h4 v-if="false">自定义</h4>
        <div v-if="false">
          <themeForm :refs="'customTheme'" :formData="customTheme" :option="themeOption">
            <!-- <template slot-scope="scope" slot="menuForm">
                <el-button @click="tip">自定义按钮</el-button>
            </template>-->
          </themeForm>
        </div>
      </div>
      <el-row slot="footer" style="display:flex;align-items:center;justify-content:center;">
        <el-button size="mini" type="primary" :loading="submitLoading" @click="submitTheme">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </el-row>
    </el-dialog>
    <tenantDialog ref="tenantDialog" :usertenantList="usertenantList" :needReload="true" @reload="reload"></tenantDialog>

    <!-- 更多导航 -->
    <div :class="isMOreEntry ? 'more-nav-box up' : 'more-nav-box down'" @mouseleave="entryMore(false)">
      <div class="more-nav-list" :style="'top:'+$store.getters.theme.logo.height+';'">
        <div class="more-nav-list-left" :style="(false && $store.getters.isCollapse) ? '' : 'width: 480px;'">
          <ul class="more-system-list" :style="(false && $store.getters.isCollapse) ? '' : ('margin-left: '+ $store.getters.theme.logo.width + ';')">
            <li v-for="(item, index) in sysList" :key="'more-item-'+item.name+index" @mouseenter="entryMoreSystem(item, index)" :class="{'activeSysItem': item.id == (activeMore ? activeMore.id : activeSystem), 'reverseTrans': (index == activeIndex && lastActiveIndex > activeIndex)}" @click="entrySystem(item, true); isMOreEntry = false;">
              <img style="width: 16px; height: 16px;" v-if="item.extend" :src="item.extend.logo" alt=""/>
              <span :class="{'text-overflow': true, 'hasOwen': (item.extend && $store.getters && $store.getters.userInfo && item.extend.createById == $store.getters.userInfo.id)}" :title="item.name">{{item.name}}</span>
<!--              <i v-if="item.extend && $store.getters && $store.getters.userInfo && item.extend.createById == $store.getters.userInfo.id">管理员</i>-->
              <!-- <svg v-if="item.extend && item.extend.type === 'jvsapp'" aria-hidden="true">
                <use xlink:href="#icon-application"></use>
              </svg> -->
            </li>
          </ul>
        </div>
        <transition v-if="activeMore && activeMore.children" name="el-fade-in-linear">
          <div v-show="!bool" class="more-nav-list-right" >
            <div class="right-header">
              <img style="width: 72px; height: 72px;margin-right: 30px;" v-if="activeMore.extend" :src="activeMore.extend.logo" alt=""/>
              <div class="app-info">
                <div style="font-size: 16px;font-weight: bold">
                  {{activeMore.name}}
                  <el-tag :disable-transitions="true" style="margin: 0 8px;" size="mini" v-if="activeMore.extend && $store.getters && $store.getters.userInfo && activeMore.extend.createById == $store.getters.userInfo.id" type="success">管理员</el-tag>
                  <el-tag :disable-transitions="true" v-if="activeMore && activeMore.extend && !activeMore.extend.isDeploy" size="mini" type="warning"><span style="font-size: 12px">待发布</span></el-tag>
                </div>
                <div v-if="activeMore.extend" style="margin: 10px 0;font-size: 12px;color: #9d9d9d">{{ activeMore.extend.createBy }}</div>
                <div v-if="activeMore.extend" style="font-size: 12px;">{{ activeMore.extend.description }}</div>
              </div>
            </div>
            <div class="right-menu">
              <div v-for="menu in activeMore.children" :key="'more-menu-'+menu.name" :class="{'more-menu': true}">
                <div class="more-menu-second">
                  <span>{{menu.name}}</span>
                </div>
                <div class="more-menu-third" v-if="menu.children && menu.children.length > 0">
                  <p v-for="(mi, mindex) in menu.children" :key="'more-menu-child-'+mi.name+'-'+mindex" @click="openMoreMenu(mi)" :class="{'activeMenu': (mi.id == activeMenu || vaildAvtive(mi.extend))}">
                    <span>{{mi.name}}</span>
                    <!-- <i v-if="mi.isNew" class="new-mi-item">new</i> -->
                  </p>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <div class="image-none" v-else>
          <img src="@/const/img/emptyImage.png" alt=""/>
        </div>
        <div class="more-nav-list-rightMenu"></div>
      </div>
      <div class="more-modal" @mouseover="entryMore(false)"></div>
    </div>

    <!-- 菜单loading -->
    <div class="menu-loading-back" v-if="menuLoading"></div>
    <invite-user :dialogVisible="inviteUser" @handleClose="handleOrgClose"/>
  </div>
</template>
<script>
// 引入默认的主题风格
import {simpleStyle, darkblueStyle, darkredStyle} from '@/const/theme'
import top from './top/index'
import { getStore } from "@/util/store.js";
import { mapGetters, mapState } from "vuex";
import store from '@/store'
import {getUnread, getAllSystemList, loginoutHandle, getSearchMenu, editTheme, getSupport} from '@/api/admin/home'
import themeForm from './form'
import tenantDialog from '@/views/main/tenant/index'
import {getTenantByUser} from '@/api/login'
import bus from '@/util/vuebus'
import config from "./sidebar/config.js";
import {client_id} from '@/const/const'
import eventBus from "@/util/vuebus";
import inviteUser from "@/views/upms/views/inviteUser/new";
import { relativelyTime } from '@/util/date'
import {getMessageDetail, messageAll, messageAllRead, messageaPage} from "@/api/admin/message";
import {getMyTenantList} from "@/api/admin/user";
export default {
  name: "tags",
  components: {
    top,
    themeForm,
    tenantDialog,
    inviteUser
  },
  props: {
    freshAllMenuBool: {
      type: Number
    },
    openId: {
      type: String
    }
  },
  data () {
    return {
      activeName: '1',
      changeTenantsList: [], // 可切换的租户
      myTenantList: [],
      supportObj: null, // 咨询支持
      // 查询条件
      queryParams: {
        search: '',
        type: ''
      },
      page: {
        total: 0,
        size: 20,
        current: 1
      },
      noDetailList:{},
      noDetailLoading: false, // 消息详情弹窗loading
      noList:[],
      mesOption:[{
        name:"1",
        label:"全部消息"
      },{
        name:"2",
        label:"未读消息"
      }],
      tabActive:'1',
      connectVisible: false, // 所有消息弹窗标识
      connectVisibles: false, // 消息详情弹窗标识
      messageTitle: '消息详情',
      insideList:[],
      messageLoading:false,
      readStatus:false,
      visible:false,
      isShowInfo: false,
      unreadCount: 0, // 未读消息数量
      storeTemp: store,
      active: "",
      contentmenuX: "",
      contentmenuY: "",
      contextmenuFlag: false,
      themeShow: false,
      defalutTheme: '',
      defalutThemeList: [
        {
          img: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1599535146&di=85a057baf66090f8db86d7c1b81d195a&src=http://a1.att.hudong.com/05/00/01300000194285122188000535877.jpg',
          name: '简约风',
          id: 'simple'
        },
        {
          img: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1599535146&di=85a057baf66090f8db86d7c1b81d195a&src=http://a1.att.hudong.com/05/00/01300000194285122188000535877.jpg',
          name: '深蓝',
          id: 'darkblue'
        },
        {
          img: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1599535146&di=85a057baf66090f8db86d7c1b81d195a&src=http://a1.att.hudong.com/05/00/01300000194285122188000535877.jpg',
          name: '朱砂红',
          id: 'darkred'
        }
      ],
      // 自定义主题
      customTheme: {
        basic: {
          themeColor: '', // 主题背景颜色
          activeColor: '', // 激活状态背景颜色
          fontColor: '', // 主题字体颜色
          activeFont: '', // 激活状态字体颜色
        },
        // 字体
        font: {
          size: '', // 大小
          color: '', // 颜色
        },
        // logo设置
        logo: {
          width: '240px', // 宽
          height: '64px', // 高
          fit: 'contain', // 图片显示填充方式
          color: '#1890ff', // 字体颜色
          fontSize: '16px', // 字体大小
          fontWeight: 100, // 字体粗细
          backgroundColor: '#fff', // 背景颜色
        },
        // 表单设置
        form: {
          size: 'mini', // 表单内组件的尺寸  medium / small / mini
        },
        btn: {
          size: 'small', // 表单内组件的尺寸  medium / small / mini
          borderColor: '', // 边框颜色
          hoverBackgroundColor: '', // 移入背景色
          hoverBorderColor: '', // 移入边框色
          hoverFontColor: '', // 移入字体色
          primaryBackgroundColor: '', // primary按钮背景色
          defaultFontColor: '', // 默认按钮字体颜色
        },
        table: {
          size: 'small'
        }
      },
      themeOption: {
        inline: true,
        align: 'right',
        labelWidth: 'auto',
        column: [
          {
            label: "菜单设置",
            prop: "basic",
            type: 'title',
            span: 24,
            children: [
              {
                label: "菜单背景颜色",
                prop: "themeColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "激活态颜色",
                prop: "activeColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "字体颜色",
                prop: "fontColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "激活字体颜色",
                prop: "activeFont",
                type: 'color-select',
                span: 12
              },
            ]
          },
          {
            label: "文字设置",
            prop: "font",
            type: 'title',
            span: 24,
            children: [
              {
                label: '尺寸',
                prop: 'size',
                type: 'select',
                filterable: true,
                span: 12,
                dicData: [
                  { label: '大', value: '18px' },
                  { label: '中', value: '16px' },
                  { label: '小', value: '12px' }
                ]
              },
              {
                label: '颜色',
                prop: 'color',
                type: 'color-select',
                span: 12
              }
            ]
          },
          {
            label: 'logo设置',
            prop: 'logo',
            type: 'title',
            children: [
              {
                label: '宽',
                value: 'width',
                type: 'number',
                span: 12
              },
              {
                label: '高',
                value: 'height',
                type: 'number',
                span: 12
              },
              {
                label: '背景颜色',
                value: 'color',
                type: 'color-select',
                span: 12
              },
              {
                label: '字体颜色',
                value: 'color',
                type: 'color-select',
                span: 12
              },
              {
                label: '背景填充',
                value: 'fit',
                type: 'select',
                span: 12,
                dicData: [
                  { label: '全部填充', value: 'fill' },
                  { label: '比例填充', value: 'contain' },
                  { label: '比例缩放', value: 'scale-down' }
                ]
              },
              {
                label: '字体大小',
                value: 'fontSize',
                type: 'select',
                span: 12,
                dicData: [
                  { label: '大', value: '18px' },
                  { label: '小', value: '16px' },
                  { label: '中', value: '14px' }
                ]
              },
              {
                label: '字体粗细',
                value: 'fontWeight',
                span: 12,
                type: 'select',
                dicData: [
                  { label: '加粗', value: '600' },
                  { label: '正常', value: '500' },
                  { label: '细小', value: '200' }
                ]
              }
            ]
          },
          {
            label: "按钮设置",
            prop: "btn",
            type: 'title',
            span: 24,
            children: [
              {
                label: '尺寸',
                prop: 'size', // medium / small / mini
                span: 24,
                type: 'select',
                dicData: [
                  {label: '中', value: 'medium'},
                  {label: '小', value: 'small'},
                  {label: '迷你', value: 'mini'}
                ]
              },
              {
                label: "边框颜色",
                prop: "borderColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "移入背景颜色",
                prop: "hoverBackgroundColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "移入边框颜色",
                prop: "hoverBorderColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "移入字体颜色",
                prop: "hoverFontColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "提交背景颜色",
                prop: "primaryBackgroundColor",
                type: 'color-select',
                span: 12
              },
              {
                label: "默认字体颜色",
                prop: "defaultFontColor",
                type: 'color-select',
                span: 12
              },
            ]
          },
          {
            label: "表单设置",
            prop: "form",
            type: 'title',
            span: 24,
            children: [
              {
                label: '尺寸',
                prop: 'size', // medium / small / mini
                span: 12,
                type: 'select',
                dicData: [
                  {label: '中', value: 'medium'},
                  {label: '小', value: 'small'},
                  {label: '迷你', value: 'mini'}
                ]
              }
            ]
          },
          {
            label: "表格设置",
            prop: "table",
            type: 'title',
            span: 24,
            children: [
              {
                label: '文字大小',
                prop: 'size', // medium / small / mini
                span: 12,
                type: 'select',
                dicData: [
                  {label: '中', value: 'medium'},
                  {label: '小', value: 'small'},
                  {label: '迷你', value: 'mini'}
                ]
              },
              {
                label: '文字颜色',
                prop: 'color', // medium / small / mini
                span: 12,
                type: 'color-select',
              }
            ]
          }
        ]
      },
      sysList: [],
      activeSystem: '',
      submitLoading: false, // 确定loading
      usertenantList: [],
      isMOreEntry: false,
      bool: false,
      activeMore: null,
      activeMenu: '',
      config: config,
      menuKey: '', // 搜索菜单关键词
      menuSearchVisible: false,
      searchMenuList: [],
      templateOpen: false,
      infoShow: false,
      lastActiveIndex: -1,
      activeIndex: -1,
      userInformation: {},
      menuLoading: false,
      inviteUser: false,
    };
  },
  created () {
    if(this.$store.getters.userInfo) {
      this.userInformation = this.$store.getters.userInfo
    }
    this.getUnreadMessage()
    this.getAllSysntem()
    this.getSupport()
    this.getChangeTenants()
    // this.getMyTenantListHandle()
    eventBus.$off("freshUserInfo")
    eventBus.$on("freshUserInfo", data => {
      if(data) {
        this.userInformation = data
        this.$forceUpdate()
      }
    });
  },
  beforeDestory () {
    eventBus.$off("freshUserInfo")
  },
  mounted () {
    // this.setActive();
    this.connectWebsocket()
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website"]),
    ...mapState({
      showTag: state => state.common.showTag,
    }),
    tagLen () {
      return this.tagList.length||0;
    },
    defalutThemeConst () {
      return [simpleStyle, darkblueStyle, darkredStyle]
    },
    hasSwitch () {
      return getStore({name: 'switchTenant'})
    },
    labelKey () {
      return this.website.menu.props.label||this.config.propsDefault.label;
    },
    pathKey () {
      return this.website.menu.props.path||this.config.propsDefault.path;
    },
    nowTagValue () {
      return this.$router.$jvsRouter.formatMenuPath(this.$route);
    },
    remainingCount(){
      return this.$store.state.socket.messageSocketMsg.remainingCount || 0
    },
  },
  filters: {
    formatLogTime(value) {
      return relativelyTime(value)
    }
  },
  methods: {
    handleOrgClose() {
      this.inviteUser = false
    },
    // 加入组织
    handleJoinOrg() {
      this.inviteUser = true
    },
    // 创建组织
    handleCreateOrg() {
      this.$message.warning('版本不支持')
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getMessagePage()
    },
    getMessagePage() {
      this.messageLoading = true
      let obj = {
        current: this.page.current,
        size: this.page.size,
      }
      messageaPage(obj).then(res=>{
        if(res.data.code == 0){
          this.insideList = JSON.parse(JSON.stringify(res.data.data.records))
          this.page.total = res.data.data.total
          this.insideList.forEach(item => {
            item.msgContent = JSON.parse(item.msgContent)
          })
        }
      }).finally(res=>{
        this.messageLoading = false
      })
    },
    // 打开消息通知
    openMessage() {
      this.activeName = '1'
      this.getMessage()
    },
    tabClick(e) {
      if (e.name == '1') {
        this.getMessage('notice')
      } else {
        this.getMessage('project')
      }
    },
    connectWebsocket(){
      this.$store.dispatch('MESSAGE_WS_INIT', this.userInformation.id)
    },
    // 关闭弹窗
    handleConnectClose() {
      this.connectVisible = false
    },
    // 关闭弹窗
    handleConnectCloses() {
      this.connectVisibles = false
    },
    // 所有消息
    allnotice(){
      // this.connectVisible = true
      this.messageTitle = '所有消息'
      this.connectVisibles = true
      this.noDetailList = {}
      this.visible = false
      //查询所有
      // this.getAllNotice()
      this.getMessagePage()
    },
    // 获取所有通知
    getAllNotice() {
      // return
      messageAll({
        readStatus:this.tabActive=='1'?null:false
      }).then(res=>{
        if(res.data.code == 0){
          this.noList = JSON.parse(JSON.stringify(res.data.data))
          this.noList.forEach(item => {
            item.msgContent = JSON.parse(item.msgContent)
          })
        }
      })
    },
    //标记全部已读
    editreadStatus(){
      this.readStatus = true
      messageAllRead().then(res => {
        if(res.data.code == 0){
          this.$store.commit('SET_MESSAGE_DATA',{remainingCount:0})
        }
      })
    },
    selectDetail(id,index,params,data) {
      this.noDetailLoading = true
      getMessageDetail(id).then(res => {
        if (res.data && res.data.code == 0) {
          this.noDetailList = JSON.parse(JSON.stringify(res.data.data))
          this.noDetailList.msgContent = JSON.parse(res.data.data.msgContent)
          this.visible = false
          if(!this[params][index].readIs){
            this[params][index].readIs = true
            this.$store.commit('SET_MESSAGE_DATA',{remainingCount:this.remainingCount-1})
          }
        }
        this.noDetailLoading = false
      }).catch(err => {
        this.noDetailLoading = false
      })
    },
    // 消息详情
    changeDetail(id,index,params,data){
      this.messageTitle = '消息详情'
      this.connectVisibles = true
      this.noDetailList = {}
      this.selectDetail(id,index,params,data)
    },
    // 消息中心
    getMessage(type) {
      // this.$router.push({path: '/message'})
      this.readStatus = false
      this.messageLoading = true
      let obj = {
        current: 1,
        size: 20,
        largeCategories: type ? type : 'notice',
      }
      if(this.queryParams.search) {
        obj.search = this.queryParams.search
      }
      if(this.queryParams.type) {
        obj.type = this.queryParams.type
      }
      messageaPage(obj
        // {current:1, size:20, tabActive:this.tabActive,}
        ).then(res=>{
        if(res.data.code == 0){
          this.insideList = JSON.parse(JSON.stringify(res.data.data.records))
          this.insideList.forEach(item => {
            item.msgContent = JSON.parse(item.msgContent)
          })
          console.log(this.insideList)
        }
      }).finally(res=>{
        this.messageLoading = false
      })
    },
    // 显示基本设置
    handleShowInfo() {
      this.isShowInfo = true
    },
    // 隐藏基本设置
    handleHideInfo() {
      this.isShowInfo = false
    },
    // 客服咨询
    handleService() {
      this.$openUrl('http://www.bctools.cn/', '_blank')
    },
    helpCenter(str) {
      this.$openUrl('', '_blank', str)
    },
    watchContextmenu () {
      if (!this.$el.contains(event.target)||event.button!==0) {
        this.contextmenuFlag=false;
      }
      window.removeEventListener("mousedown", this.watchContextmenu);
    },
    handleContextmenu (event) {
      let target=event.target;
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag=false;
      if (target.className.indexOf("el-tabs__item")>-1) flag=true;
      else if (target.parentNode.className.indexOf("el-tabs__item")>-1) {
        target=target.parentNode;
        flag=true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX=event.clientX;
        this.contentmenuY=event.clientY;
        this.tagName=target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag=true;
      }
    },
    //激活当前选项
    setActive () {
      this.active=this.tag.hash ? (this.tag.value + this.tag.hash) : this.tag.value;
    },
    menuTag (value, action) {
      if (action==="remove") {
        let { tag, key }=this.findTag(value);
        this.$store.commit("DEL_TAG", tag);
        if(tag.hash) {
          if (tag.hash===this.tag.hash) {
            tag=this.tagList[key===0? key:key-1]; //如果关闭本标签让前推一个
            this.openTag(tag);
          }
        }else{
          if (tag.value===this.tag.value) {
            console.log(this.tag.value)
            tag=this.tagList[key===0? key:key-1]; //如果关闭本标签让前推一个
            this.openTag(tag);
          }
        }
      }
    },
    openTag (item) {
      // 重复点击不处理
      if(item.name == this.tag.value + this.tag.hash){ //  this.tag.hash || item.name == this.tag.value) {
        return false
      }
      let tag;
      if (item.name) {
        tag=this.findTag(item.name).tag;
      } else {
        tag=item;
      }
      const jti = getStore({
        name: "jti",
      });
      // if(tag.value) {
      //   if(tag.value.indexOf("?")!=-1){
      //     this.src+="&jti="+jti
      //   }else{
      //     this.src+="?jti="+jti
      //   }
      // }else{
      //   this.src+="?jti="+jti
      // }
      if(tag.label == '首页') {
        tag = this.website.fistPage
      }
      this.$router.push({
        path: this.$router.$jvsRouter.getPath({
          name: tag.label,
          src: tag.value + tag.hash
        }),
        query: tag.query
      });
    },
    closeOthersTags () {
      this.contextmenuFlag=false;
      this.$store.commit("DEL_TAG_OTHER");
    },
    findTag (value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if ((item.value + item.hash) === value) {
          tag=item;
          key=index;
        }else{
          if(item.value === value) {
            tag=item;
            key=index;
          }
        }
      });
      return { tag: tag, key: key };
    },
    closeAllTags () {
      this.contextmenuFlag=false;
      this.$store.commit("DEL_ALL_TAG");
      if(this.tag.value != '/wel/index') {
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            src: this.tagWel.value
          }),
          query: this.tagWel.query
        });
      }
    },
    // 我的组织
    getMyTenantListHandle () {
      getMyTenantList().then(res => {
        if(res.data.code == 0) {
          this.myTenantList = res.data.data
          this.getChangeTenants()
        }
      })
    },
    // 获取切换的租户列表
    getChangeTenants () {
      let temp = []
      temp = [...this.$store.getters.userInfo.tenants]
      this.changeTenantsList = temp.filter(ti => {
        return ti.id != this.$store.getters.userInfo.tenantId
      })
    },
    // 切换租户
    switchTenant () {
      this.$openLogin({
        successClose: false,
        hasModal: true,
        switchTenant: true,
        switchList: this.changeTenantsList,
        afterLogin: (dialog, res) => {
          this.$store.commit("DEL_ALL_TAG");
          this.$store.commit("SET_MENU_TYPE", "");
          this.$store.commit("SET_APP_SETTING_OPEN", false);
          this.$router.push({
            path: this.$router.$jvsRouter.getPath({
              src: '/wel/index'
            }),
          });
          dialog.handleClose()
          window.parent.postMessage({command: 'fresh'}, '*')
        }
      })
    },
    // 应用设置
    settingApp(type) {
      this.$emit('openAppSetting', true, type)
      this.templateOpen = false
    },
    logout () {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        loginoutHandle().then(res => {
          if(res.data.code == 0) {
            let path = this.$store.state.common.template || '/login'
            sessionStorage.clear()
            this.$store.dispatch("LogOut")
            this.$router.push({ path: path })
          }
        })
      });
    },
    goInfo (act) {
      this.templateOpen = false
      this.$emit('openAppSetting', false)
      this.$emit('openCatalogue', null)
      this.infoShow = false
      if(this.$route.hash != '#/userinfo' && (this.$route.query && this.$route.query.src != '/')) {
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: "个人信息",
            src: '/#/userinfo'
          })
        })
      }
    },
    openTheme () {
      this.defalutTheme = this.$store.getters.themeName
      this.themeShow=true
    },
    handleClose () {
      this.themeShow=false
      this.defalutTheme=""
      this.submitLoading = false
    },
    // 进入消息中心
    messageCenter () {
      this.$router.push({ path: '/usermessage' })
    },
    // 选择默认的主题
    setThemeWithDefault (value) {
      let bool = true
      let name = ""
      let params = {}
      for(let i in this.defalutThemeConst) {
        if(this.defalutThemeConst[i].theme == value) {
          name = this.defalutThemeConst[i].theme
          params = this.defalutThemeConst[i].params
          bool = false
        }
      }
      if(bool) {
        name = darkblueStyle.theme
        params = darkblueStyle.params
      }
      // let tenantInfo = JSON.parse(JSON.stringify(getStore({name: 'tenantInfo'})))
      let obj = {
        name: name,
        params: params
      }
      editTheme({themeStyle: JSON.stringify(obj)}).then(res => {
        if (res.data.code==0) {
          this.$message.success('设置主题成功')
          this.$store.commit("SET_THEME_NAME", name)
          this.$store.commit("SET_THEME", params)
          this.$emit('changeTheme', true)
          this.themeShow = false
          this.submitLoading = false
        }else {
          this.submitLoading = false
          this.$message.error(res.data.msg)
        }
      }).catch(e => {
        this.$message.error(e)
        this.submitLoading = false
      })
    },
    // 确认主题
    submitTheme () {
      this.submitLoading = true
      // 选择默认
      if(this.defalutTheme) {
        this.setThemeWithDefault(this.defalutTheme)
      }else {
        this.$store.commit("SET_THEME_NAME", "用户自定义")
        this.$store.commit("SET_THEME", this.customTheme)
        this.$emit('changeTheme', true)
        this.themeShow = false
      }
    },
    // 获取未读消息
    getUnreadMessage () {
      getUnread().then(res => {
        if(res.data.code == 0) {
          this.unreadCount = res.data.data
        }
      })
    },
    // 获取咨询支持
    getSupport() {
      getSupport().then(res => {
        if (res.data) {
          this.supportObj = res.data
        }
      })
    },
    // 获取版本价格
    handlePrice() {
      this.$openUrl(this.supportObj.frame, '_blank')
    },
    // 获取所有系统
    getAllSysntem () {
      this.menuLoading = true
      getAllSystemList(client_id).then(res => {
        if(res.data && res.data.code == 0) {
          this.sysList = res.data.data || []
          this.$store.commit("SET_MENU_ALL", this.sysList)
          if(this.sysList.length > 0) {
            if(this.$store.getters.system) {
              this.activeSystem = this.$store.getters.system
            }else{
              this.activeSystem = this.sysList[0].id
              this.$store.commit("SET_SYSTEM", this.activeSystem)
            }
            this.$emit('changeSystem', this.activeSystem)
          }
          this.menuLoading = false
        }
      })
    },
    // 切换系统
    entrySystem (item, openApp) {
      this.activeSystem = item.id
      this.$emit('changeSystem', item.id)
      this.$store.commit("SET_SYSTEM", this.activeSystem)
      this.templateOpen = false
      this.$emit('openAppSetting', false, '')
      if(item && item.extend && item.extend.type === 'jvsapp' && openApp && item.extend.designRole) {
        this.$emit('openAppManage', item.id)
      }
    },
    // 打开文档
    openDocument () {
      this.$openUrl('/jvs-document-ui/#/index', '_blabk')
      this.templateOpen = false
      this.$emit('openAppSetting', false)
    },
    // 获取该用户下所有的租户列表
    getTenantByUserList () {
      getTenantByUser().then(res => {
        if(res.data.code == 0) {
          let list = []
          if(res.data.data) {
            list = res.data.data
            if(list.length > 0) {
              // 只有一个租户直接进去
              if(list.length == 1) {
                this.$store.commit("DEL_ALL_TAG") // 清空已打开的页面
                this.$refs.tenantDialog.tenantLoginHandle(list[0])
              }else{
                this.usertenantList = list
                // this.dialogVisible = true
                this.$refs.tenantDialog.init()
              }
            }
          }
        }
      })
    },
    changeTenant () {
      this.templateOpen = false
      this.$emit('openAppSetting', false)
      this.getTenantByUserList()
    },
    reload (bool) {
      bus.$emit('refresh', true);
    },
    // 更多
    entryMore (bool) {
      if(bool === false) {
        this.activeMore = null
        this.activeSysItem = ''
        this.activeMenu = ''
      }
      this.isMOreEntry = bool
      if(this.activeSystem) {
        for(let i in this.sysList) {
          if(this.sysList[i].id == this.activeSystem) {
            this.entryMoreSystem(this.sysList[i], i)
          }
        }
      }
    },
    // 展示系统的子菜单
    entryMoreSystem (item, index) {
      this.activeIndex = index
      this.lastActiveIndex = -1
      let last = JSON.parse(JSON.stringify(this.activeMore))
      if(last) {
        for(let i in this.sysList) {
          if(this.sysList[i].id == last.id) {
            this.lastActiveIndex = i
          }
        }
      }
      this.bool = !this.bool
      setTimeout(() => {
        this.bool = !this.bool
        this.activeMore = item
      }, 200)
    },
    openMoreMenu (item) {
      if (item.extend && item.extend.design) {
        this.activeMenu = item.id
        this.entrySystem(this.activeMore)
        this.isMOreEntry = false
        let url = ''
        switch (item.extend.design) {
          case 'chart':
            url = `/chart-design-ui/chartUse?type=pc&id=${item.extend.id}`;
            break
          case 'page':
            url = `/page-design-ui/list/use?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}&jvsAppId=${item.extend.jvsAppId}`;
            break
          case 'form':
            url = `/page-design-ui/form/use?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}&jvsAppId=${item.extend.jvsAppId}`;
            break
        }
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item.extend.name,
            src: url
          }),
        })
      } else {
        this.activeMenu = item.id
        this.entrySystem(this.activeMore)
        this.openMenuRoute(item)
        this.isMOreEntry = false
      }
    },
    vaildAvtive (item) {
      const groupFlag=(item["group"]||[]).some(ele =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue===item[this.pathKey]||groupFlag;
    },
    searchMenu () {
      if(this.menuKey) {
        getSearchMenu(this.menuKey, client_id).then(res => {
          if(res.data.code == 0) {
            this.searchMenuList = res.data.data
            this.menuSearchVisible = true
          }
        })
      }else{
        this.menuSearchVisible = false
      }
    },
    openMenuRoute (item) {
      // 重复点击不跳转
      let tempStr = ""
      if(item.extend && item.extend.url && item.extend.url.indexOf('#') > -1){
        tempStr = (item.extend.url && ('#' + item.extend.url.split('#')[1])) || ''
      }else if (item.extend && item.extend.url && item.extend.url.indexOf('-ui') > -1) {
        let indx = item.extend.url.indexOf('-ui')
        tempStr = item.extend.url.slice(0, indx+3) + '/#' + item.extend.url.slice(indx+3, item.extend.url.length)
      }
      // 应用跳转
      if (item.extend && item.extend.type === 'jvsapp') {
        this.entrySystem(item, true)
        return
      }
      // 设计跳转
      if (item.extend && item.extend.design) {
        let url = ''
        switch (item.extend.design) {
          case 'chart':
            url = `/chart-design-ui/chartUse?type=pc&id=${item.extend.id}`;
            break
          case 'page':
            url = `/page-design-ui/list/use?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}`;
            break
          case 'form':
            url = `/page-design-ui/form/use?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}`;
            break
        }
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item.extend.name,
            src: url
          }),
        })
        return
      }
      if(this.$route.hash && tempStr == this.$route.hash) {
        return false
      }
      if (this.screen<=1) this.$store.commit("SET_COLLAPSE");
      this.$router.$jvsRouter.group=item.group;
      if(item.extend.newWindow === true) {
        if(item.extend.url.includes('http') || item.extend.url.includes('https') || item.extend.url.includes('ftp')) {
          this.$openUrl(item[this.pathKey], '_blank')
        }else{
          if(item.extend.url.indexOf('-ui') == -1) {
            this.$openUrl(item[this.pathKey], '_blank')
          }else{
            let tinx = item.extend.url.indexOf('-ui')
            let tpStr = item.extend.url.slice(0, (tinx+3)) + '/#' + item.extend.url.slice(tinx+3, item.extend.url.length)
            this.$openUrl(tpStr, '_blank')
          }
        }
      }else{
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item[this.labelKey],
            src: item.extend[this.pathKey]
          }),
          query: item.query,
          params: item.params
        })
      }
    },
    handleBlur() {
      this.menuSearchVisible = false
    },
    searchClick (item) {
      this.openMenuRoute(item)
      this.menuKey = ''
      this.menuSearchVisible = false
      this.templateOpen = false
      this.$emit('openAppSetting', false)
    },
  },
  watch: {
    freshAllMenuBool: {
      handler(newVal, oldVal) {
        if(newVal != -1) {
          this.getAllSysntem()
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.help-entry{
  width: 20px;
  height: 20px;
  fill: #333;
}
.user-info-tool {
  //margin: 0 10px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  span{
    font-size: 16px;
  }
  img{
    margin-left: 10px;
    display: block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.right-tool-menu{
  padding: 0 8px;
  .user-info{
    padding: 4px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 12px;
    img{
      width: 40px;
    }
  }
  .menu-item{
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 32px;
    padding: 6px 24px;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 6px;
    &:hover{
      transition: 0.3s;
      background-color: #eff2f7;
    }
  }
}
.show-user-info-card{
  padding: 0 17px;
  color: #333333;
  h3{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    b{
      font-size: 14px;
    }
    span{
      font-size: 12px;
      cursor: pointer;
      color: #409eff;
    }
  }
  .user-info-list-item{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 24px;
    b{
      width: 100px;
      font-weight: normal;
    }
    span{
      color: #333333;
    }
    img{
      display: block;
      width: 40px;
      height: 40px;
      background: #e5e5e5;
      margin-right: 10px;
    }
    p{
      width: 100%;
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
<style lang="scss">
.org-menu-item{
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  padding: 6px 24px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 6px;
  &:hover{
    transition: 0.3s;
    background-color: #eff2f7;
  }
}
.el-popover.my-popover{
  height: 677px;
  padding: 0px !important;
  .bottom-txt{
    position: relative;
    bottom: 0px;
    .bottom-all{
      //color: #101010;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 30px;
      color: #a2a3a5;
      cursor: pointer;
    }
    .bottom-all:hover{
      //color: #3471ff;
      background-color: #F2F6F8;
      cursor: pointer;
    }
  }
  .right-tab{
    height: 30px;
    display: flex;
    padding: 25px 29px 0px 29px;
    .select-options{
      width: 120px;
      height: 25px;
    }
    .right-tabsize{
      position: absolute;
      right: 29px;
      margin-top: -7px;
      cursor: pointer;
      .right-tabhover{
        // color: #3471ff;
      }
      .right-tabhover:hover{
        color: #3471ff;
      }
    }
  }
  .el-divider--horizontal{
    margin: 0 auto;
  }
}
.my-popover-box *{
  box-sizing: initial !important;
}
.message-detail{
  display: flex;
  justify-content: space-between;
  .left{
    width: 380px;
    .left-pagination{
      padding: 12px 0;
      text-align: right;
    }
  }
  .right{
    width: calc(100% - 400px);
    position: relative;
    .loading-back{
      background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 200px 160px;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 999999;
    }
    .right-title{
      font-size: 24px;
      color: #333333;
      margin-bottom: 20px;
    }
  }
}
.top-tab:hover{
  color: #3471ff;
  background-color: #F2F6F8;
  .top-tab-span{
    // color: #3471ff;
  }
}
.top-tab{
  padding: 8px 10px;
  cursor: pointer;
  margin: 0 20px;
  border-radius: 6px;
  .top-tab-span{
    width: 158px;
    overflow:hidden; //超出的文本隐藏
    text-overflow:ellipsis; //溢出用省略号显示
    white-space:nowrap; //溢出不换行
    font-size: 16px;
    font-weight: normal;
    // color: #000;
  }
  .top-tab-span-span{
    position: absolute;
    right: 36px;
    line-height: 60px;
    // color: #101010;
    font-size: 14px;
  }
  .top-txt{
    padding: 10px 0 5px 0px;
    .top-tab-span-span{
      position: absolute;
      right: 55px;
      // color: #101010;
      font-size: 14px;
    }
  }
  .el-divider--horizontal{
    margin: 10px auto 0px !important;
  }
  .container-page{
    text-align: right;
    padding: 10px 0px 0px;
    position: absolute;
    bottom: 55px;
    right: 36px;
  }
}
.customheight{
  height: 680px;
  .right-tab{
    height: 30px;
    display: flex;
    //padding: 25px 29px 0px 29px;
    .select-options{
      width: 120px;
      height: 25px;
    }
    .right-tabsize{
      position: absolute;
      right: 40px;
      margin-top: -7px;
      cursor: pointer;
      .right-tabhover{
        // color: #3471ff;
      }
      .right-tabhover:hover{
        color: #3471ff;
      }
    }
  }
  .top-tab-span{
    width: 800px;
  }
  .top-tabs{
    padding: 26px 0px 0px 40px;
    //height: 100%;
    .top-tabs-pad{
      line-height: 60px;
      width: 900px;
      font-size: 16px;
      font-weight: normal;
    }
    .top-tabs-pad-content{
      //height: 200px;
      //overflow-y: auto;
    }
  }
}
.jvs-tags {
  // border-bottom: 1px solid #c5c5c5;
  border-bottom: 2px solid #f0f2f5;
  .jvs-tags__box {
    padding: 0;
    .lineBox {
      position: relative;
      display: flex;
      justify-content: space-between;
      height: 100%;
      font-size: 13px;
      .top-nav{
        height:100%;
        display: flex;
        align-items: center;
        flex:1;
        box-sizing: border-box;
      }
      .system-list{
        display: flex;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
        overflow-x: auto;
        width: auto;
        height: 100%;
        li{
          display: flex;
          align-items: center;
          justify-content: center;
          color: #303133;
           font-size: 14px;
          //font-size: 16px;
          cursor: pointer;
          padding: 0 25px;
          i{
            //font-size: 32px!important;
          }
          span{
            word-break: keep-all;
            &:hover{
              color: #3471ff;
            }
          }
        }
        .activeSysItem{
          color: #409EFF;
        }
      }
      .el-tabs {
        height: calc(100% - 12px);
        margin-top: 10px;
        .el-tabs__header {
          height: 100%;
          .el-tabs__nav-wrap {
            height: 100%;
            .el-tabs__nav-scroll {
              height: 100%;
              .el-tabs__nav {
                height: 100%;
                .el-tabs__item {
                  line-height: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
          }
        }
      }
      .jvs-tags__menu {
        top: 0;
      }
      .noticeList {
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        li {
          padding: 0;
          margin: 0;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #f56c6c;
        }
      }
      .rightTool {
        display: flex;
        align-items: center;
        .customer-org{
          cursor: pointer;
          margin: 0 10px;
          font-size: 16px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eee;
          border-radius: 4px;
          &:hover{
          }
        }
        .customer-service{
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          border-radius: 20px;
          padding: 2px 8px;
          margin: 0 10px;
          font-size: 12px;
          background-color: #e5f0fa;
          color: #3471ff;
          i{
            margin-right: 0;
          }
        }
        .jvs-tags__menu {
          position: unset !important;
        }
        i, svg {
          margin: 0 10px;
          cursor: pointer;
        }
        p {
          display: flex;
          align-items: center;
          height: 100%;
          span {
            margin-left: 25px;
          }
        }
        //.search-menu{
        //  margin-right: 10px;
        //  .el-input__inner{
        //    //background: none;
        //    outline: none;
        //    border-color: #fff;
        //    //color: #fff;
        //  }
        //  .el-input__inner:hover{
        //    border-color: #fff!important;
        //  }
        //  .el-input__inner:focus{
        //    border-color: #C0C4CC;
        //  }
        //}
      }
    }
  }
  .search-menu{
    .el-input__inner{
      background: #f6f6f6;
      outline: none;
      border-color: #fff;
      //color: #fff;
    }
    .el-input__inner:hover{
      border-color: #fff!important;
    }
    .el-input__inner:focus{
      border-color: #fff;
    }
  }
  .menu-loading-back{
    background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 300px 240px;
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 999999;
  }
}
.themeBox {
  height: 100%;
  box-shadow: 0 0 10px #c5c5c5;
  // border: 1px solid #e5e5e5;
  .el-dialog {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    margin: 0 !important;
    overflow: auto;
  }
}
.defalutThemeList {
  img {
    display: block;
    width: 80%;
    height: 80px;
  }
  .el-radio-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-radio {
      width: 30%;
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #c5c5c5;
      padding: 10px 0;
      border-radius: 10px;
      .el-radio__label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          margin: 10px 0;
        }
      }
    }
    .el-radio.is-checked {
      border-color: #409eff;
    }
  }
}
.more-nav-box{
  position: fixed;
  width: 100%;
  z-index: 1030;
  //height: 100%;
  overflow: hidden;
  box-shadow: 10px 10px 10px #EEEEEE;
  transition: height 0.2s ease;
  &.up{
    height: 420px;
  }
  &.down{
    height: 0;
  }
  .more-nav-list {
    height: 420px;
    width: 100%;
    background: #fff;
    box-shadow: 10px 10px 10px #EEEEEE;
    display: flex;
    .more-nav-list-left{
      width: 300px;
      //background: #efefef;
      height: 100%;
      overflow: hidden;
      .more-system-list{
        //font-size: 18px;
        //font-size: 16px;
        font-size: 14px;
        color: #333333;
        margin: 0;
        padding: 0;
        margin-left: 80px;
        height: 100%;
        overflow: auto;
        padding-bottom: 20px;
        box-sizing: border-box;
        li{
          margin: 10px 0 10px 20px;
          padding: 0 10px;
          //margin-top: 25px;
          display: flex;
          align-items: center;
          text-indent: 10px;
          cursor: pointer;
          position: relative;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          font-family: MiSans-Demibold;
          //font-weight: bold;
          // overflow: hidden;
          i{
            background: #67C23A;
            color: #fff;
            text-align: center;
            font-style: normal;
            border-radius: 5px;
            height: 14px;
            font-size: 12px;
            text-indent: 0;
            padding: 2px 4px;
            line-height: 12px;
            margin-left: 4px;
            //margin: -13px 0 0 2px;
          }
          .text-overflow{
            display: inline-block;
            max-width: 158px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }
          .hasOwen{
            display: inline-block;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }
        }
        svg {
          width: 16px;
          height: 16px;
          margin-left: 10px;
        }
        li::before{
          //display: block;
          //content: '';
          //width: 3px;
          //height: 18px;
          //background: #efefef;
          //position: absolute;
          //top: 2px;
        }
        li:hover{
          //color: #3471FF;
          background: #f0f4ff;
        }
        li:hover::before{
          background: #3471FF;
          animation: topChange .3s;
          -webkit-animation: topChange .3s; /* Safari 与 Chrome */
        }
        .reverseTrans:hover::before{
          background: #3471FF;
          animation: topRevChange .3s;
          -webkit-animation: topRevChange .3s; /* Safari 与 Chrome */
        }
        li.activeSysItem::before{
          background: #3471FF;
        }
        li.activeSysItem::before{
          background: #3471FF;
          animation: topChange .3s;
          -webkit-animation: topChange .3s; /* Safari 与 Chrome */
        }
      }
      .more-system-list::-webkit-scrollbar {
        display: none;
      }
    }
    .more-nav-list-right{
      width: calc(100% - 750px);
      //font-size: 16px;
      font-size: 14px;
      //overflow: auto;
      //padding: 25px 0;
      .right-header{
        display: flex;
        height: 80px;
        margin: 0 30px;
        padding: 20px 0;
        border-bottom: 1px solid #e5e5e5;
      }
      .right-menu{
        overflow-y: auto;
        height: calc(100% - 150px);
        margin: 20px 0 10px 0;
        .more-menu{
          margin-left: 30px;
          margin-top: 20px;
          div{
            display: flex;
            align-items: center;
            word-break: keep-all;
            text-indent: 10px;
            span{
              cursor: pointer;
            }
            span:hover{
              color: #3471FF;
            }
            span:hover::after{
              background: #3471FF;
              animation: widthChange .4s;
              -webkit-animation: widthChange .4s; /* Safari 与 Chrome */
            }
          }
        }
        .more-menu:nth-of-type(1){
          margin-top: 0;
        }
        .more-menu-second{
          span{
            color: #3471FF;
          }
        }
        .more-menu-third{
          padding-left: 20px;
          box-sizing: border-box;
          flex-wrap: wrap;
          p{
            width: calc(100% / 6);
            margin-bottom: 0;
            position: relative;
            display: flex;
            align-items: center;
            i{
              background: #67C23A;
              color: #fff;
              text-align: center;
              font-style: normal;
              border-radius: 5px;
              height: 16px;
              font-size: 12px;
              text-indent: 0;
              padding: 0 2px;
              line-height: 12px;
              margin: -13px 0 0 2px;
            }
          }
          span{
            font-size: 14px;
            position: relative;
          }
          span::after{
            display: block;
            content: '';
            width: 100%;
            height: 2px;
            background: #fff;
            position: absolute;
            left: 0px;
            bottom: -5px;
          }
          span::after{
            display: block;
            content: '';
            width: 100%;
            height: 2px;
            background: #fff;
            position: absolute;
            left: 0px;
            bottom: -5px;
          }
        }
        .activeMenu{
          span{
            color: #3471FF;
          }
          span::after{
            background: #3471FF;
            animation: widthChange .4s;
            -webkit-animation: widthChange .4s; /* Safari 与 Chrome */
          }
        }
      }
      .right-menu::-webkit-scrollbar {
        display: none;
      }
    }
    .more-nav-list-rightMenu{
      width: 300px;
      background-image: url(./rightTool.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto;
      position: absolute;
      top: 0;
      right: 0;
      height: 420px;
    }
    .image-none{
      margin-left: 10vw;
      display: flex;
      align-items: center;
    }
  }
  //.more-modal{
  //  width: 100%;
  //  height: calc(100% - 420px);
  //}
}
.search-menu-result{
  margin: 0 10px;
  max-height: 400px;
  overflow-y: auto;
  p{
    height: 32px;
    //width: 140px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 4px 10px;
    line-height: 32px;
    cursor: pointer;
    border-radius: 6px;
  }
  p:hover{
    background: #EFF2F7;
    color: #333;
  }
}
.search-menu-result::-webkit-scrollbar{
  display: none;
}

@keyframes topChange
{
  0%   {top: -20px;}
  100% {top: 2px;}
}

@-webkit-keyframes topChange /* Safari 与 Chrome */
{
  0%   {top: -20px;}
  100% {top: 2px;}
}
@keyframes topRevChange
{
  0%   {top: 20px;}
  100% {top: 2px;}
}

@-webkit-keyframes topRevChange /* Safari 与 Chrome */
{
  0%   {top: 20px;}
  100% {top: 2px;}
}

@keyframes widthChange
{
  0%   {width: 0;}
  100% {width: 100%;}
}

@-webkit-keyframes widthChange /* Safari 与 Chrome */
{
  0%   {width: 0;}
  100% {width: 100%;}
}
@keyframes widthRevChange
{
  0%   {width: 100%;}
  100% {width: 0;}
}

@-webkit-keyframes widthRevChange /* Safari 与 Chrome */
{
  0%   {width: 100%;}
  100% {width: 0;}
}
</style>


