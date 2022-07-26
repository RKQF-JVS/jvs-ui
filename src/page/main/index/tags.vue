<template>
  <div class="jvs-tags" v-if="showTag" :style="'height: ' + $store.getters.theme.logo.height + ';'">
    <div
      class="jvs-tags__box"
      :class="{'jvs-tags__box--close':!website.isFirstPage}"
      :style="'height:'+ $store.getters.theme.logo.height"
    >
      <div class="lineBox">
        <!-- + 40px -->
        <div class="top-nav" :style="'padding-left:calc( '+$store.getters.theme.logo.width+' );width:calc(100% - '+ $store.getters.theme.logo.width +');'">
          <!-- <h4 class="quick-nav" @click="quickNav">
            <span>快捷导航</span><i class="el-icon-caret-bottom"></i>
          </h4> -->
          <ul class="system-list">
            <li v-for="(si, sindex) in sysList" v-if="sindex < 5" :key="si.name+sindex" @click="entrySystem(si)" :class="{'activeSysItem': si.id == activeSystem}" @mouseover="isMOreEntry = false;">
              <span>{{si.name}}</span>
            </li>
            <li v-if="sysList.length > 5" class="more-nav" :class="{'activeSysItem': isMOreEntry}" @mouseover="entryMore(true)">
              <span>更多导航</span>
              <i v-if="!isMOreEntry" class="el-icon-arrow-down down" style="margin-left:10px;color: #fff;font-size: 18px!important;"></i>
              <i v-else class="el-icon-arrow-up up" style="margin-left:10px;color: #fff;font-size: 18px!important;"></i>
            </li>
          </ul>
        </div>
        <!-- 右上角工具栏 -->
        <div class="rightTool">
          <!-- 搜索菜单 -->
          <el-popover
            class="search-menu"
            placement="bottom"
            width="160"
            trigger="manual"
            v-model="menuSearchVisible">
            <div class="search-menu-result">
              <p v-for="item in searchMenuList" :key="'search-menu-item'+item.id" @click="searchClick(item)">{{item.name}}</p>
            </div>
            <el-input slot="reference" size="mini" v-model="menuKey" placeholder="" @input="searchMenu"></el-input>
          </el-popover>

          <a href="https://www.baidu.com" target="_blank" v-if="false">
            <svg style="width:14px;height:14px;cursor:pointer;" t="1617671751476" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2146" width="200" height="200"><path d="M862.435556 844.231111c0 40.96-20.48 61.44-56.888889 61.44H209.351111c-34.133333 0-54.613333-18.204444-56.888889-52.337778-2.275556-77.368889 0-293.546667 0-368.64 27.306667-4.551111 56.888889-4.551111 81.92-15.928889 22.755556-11.377778 40.96-34.133333 63.715556-52.337777 20.48 36.408889 54.613333 63.715556 104.675555 63.715555 47.786667 0 81.92-25.031111 106.951111-68.266666 56.888889 93.297778 163.84 88.746667 211.626667 4.551111 20.48 18.204444 38.684444 40.96 61.44 52.337777 22.755556 11.377778 52.337778 11.377778 81.92 15.928889v22.755556c-2.275556 65.991111 0 270.791111-2.275555 336.782222z" fill="" p-id="2147"></path><path d="M851.057778 411.875556c-59.164444 11.377778-104.675556-18.204444-131.982222-86.471112-18.204444 56.888889-52.337778 91.022222-111.502223 88.746667-52.337778-2.275556-84.195556-34.133333-102.4-86.471111-20.48 59.164444-56.888889 91.022222-116.053333 86.471111-47.786667-2.275556-77.368889-29.582222-100.124444-86.471111-4.551111 9.102222-6.826667 18.204444-9.102223 25.031111-20.48 40.96-61.44 65.991111-106.951111 63.715556-45.511111-4.551111-81.92-34.133333-93.297778-79.644445-2.275556-13.653333-2.275556-29.582222 2.275556-43.235555 18.204444-54.613333 50.062222-104.675556 68.266667-159.288889 4.551111-13.653333 13.653333-18.204444 27.306666-18.204445h650.808889c15.928889 0 22.755556 4.551111 29.582222 20.48 18.204444 50.062222 43.235556 95.573333 65.991112 141.084445 31.857778 52.337778-13.653333 125.155556-72.817778 134.257778z" fill="" p-id="2148"></path></svg>
          </a>
          <i class="el-icon-document" @click="openDocument" v-if="false"></i>
          <svg v-if="false && $store.getters.userInfo.adminFlag" @click="openTheme" style="cursor:pointer;" width="16" height="16" class="icon" t="1618562009830" viewBox="0 0 1185 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40011" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :fill="$store.getters.theme.topNav.fontColor" d="M835.368421 1024H350.315789c-51.2 0-94.315789-43.115789-94.315789-94.315789V512c-24.252632 16.168421-61.978947 13.473684-83.536842-8.084211L18.863158 350.315789c-10.778947-10.778947-18.863158-29.642105-18.863158-45.810526 0-18.863158 8.084211-35.031579 18.863158-48.505263L258.694737 18.863158c13.473684-10.778947 29.642105-18.863158 48.505263-18.863158h99.705263c24.252632 0 43.115789 13.473684 56.589474 32.336842 21.557895 37.726316 59.284211 59.284211 102.4 59.284211h53.894737c43.115789 0 80.842105-21.557895 102.4-59.284211 13.473684-18.863158 35.031579-32.336842 56.589473-32.336842h99.705264c18.863158 0 35.031579 8.084211 48.505263 18.863158l239.831579 237.136842c13.473684 13.473684 18.863158 29.642105 18.863158 48.505263s-8.084211 35.031579-18.863158 48.505263l-153.6 153.6c-13.473684 13.473684-29.642105 18.863158-48.505264 18.863158-13.473684 0-24.252632-2.694737-35.031578-10.778947v417.68421c0 48.505263-43.115789 91.621053-94.31579 91.621053zM282.947368 396.126316c8.084211 0 13.473684 2.694737 21.557895 5.389473 21.557895 8.084211 32.336842 26.947368 32.336842 48.505264v479.663158c0 8.084211 5.389474 13.473684 13.473684 13.473684h485.052632c8.084211 0 13.473684-5.389474 13.473684-13.473684V450.021053c0-21.557895 13.473684-40.421053 32.336842-48.505264 21.557895-8.084211 43.115789-2.694737 59.284211 10.778948l24.252631 24.252631 132.042106-132.042105L873.094737 80.842105h-83.536842c-37.726316 56.589474-99.705263 91.621053-169.768421 91.621053h-53.894737c-67.368421 0-132.042105-35.031579-169.768421-91.621053h-83.536842l-226.357895 223.663158 132.042105 132.042105 24.252632-24.252631c13.473684-10.778947 26.947368-16.168421 40.421052-16.168421z m692.547369 51.2z" p-id="40012"></path>
          </svg>
          <el-badge :value="unreadCount" :max="99" class="item" v-if="unreadCount > 0">
            <svg @click="messageCenter" style="cursor:pointer;" width="17" height="17" t="1618561774520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19059" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path :fill="$store.getters.theme.topNav.fontColor" d="M721.338182 350.859636a64.512 64.512 0 0 1 64.512 64.488728 64.512 64.512 0 0 1-129.000727 0 64.488727 64.488727 0 0 1 64.488727-64.488728zM495.592727 350.859636a64.465455 64.465455 0 1 1 0 128.977455 64.465455 64.465455 0 0 1 0-128.977455zM269.847273 350.859636a64.512 64.512 0 1 1 0 129.000728 64.512 64.512 0 0 1 0-129.000728z" p-id="19060"></path>
              <path :fill="$store.getters.theme.topNav.fontColor" d="M427.264 930.769455a32.116364 32.116364 0 0 1-28.299636-16.756364l-109.544728-192.069818a32.186182 32.186182 0 0 1 12.032-43.962182 32.116364 32.116364 0 0 1 43.962182 12.032l81.850182 143.429818 81.850182-143.429818c8.843636-15.499636 28.509091-20.945455 43.985454-12.032 15.476364 8.797091 20.852364 28.485818 12.032 43.962182l-109.568 192.069818a32.302545 32.302545 0 0 1-28.229818 16.756364h-0.069818z" p-id="19061"></path>
              <path :fill="$store.getters.theme.topNav.fontColor" d="M837.934545 737.024H540.439273c-17.826909 0-32.256-14.405818-32.256-32.256s14.429091-32.256 32.256-32.256h297.495272c42.146909 0 76.404364-32.814545 76.404364-73.146182V230.795636c0-40.308364-34.280727-73.076364-76.404364-73.076363H186.042182c-42.123636 0-76.381091 32.768-76.381091 73.076363v368.570182c0 40.308364 34.257455 73.146182 76.381091 73.146182h129.419636c17.826909 0 32.256 14.405818 32.256 32.256s-14.429091 32.256-32.256 32.256H186.042182c-77.684364 0-140.893091-61.719273-140.893091-137.634909V230.795636c0-75.869091 63.208727-137.588364 140.893091-137.588363h651.892363c77.684364 0 140.916364 61.719273 140.916364 137.588363v368.570182c0 75.938909-63.232 137.658182-140.916364 137.658182z" p-id="19062"></path>
          </svg>
          </el-badge>
          <svg @click="messageCenter" v-else style="cursor:pointer;" width="17" height="17" t="1618561774520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19059" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :fill="$store.getters.theme.topNav.fontColor" d="M721.338182 350.859636a64.512 64.512 0 0 1 64.512 64.488728 64.512 64.512 0 0 1-129.000727 0 64.488727 64.488727 0 0 1 64.488727-64.488728zM495.592727 350.859636a64.465455 64.465455 0 1 1 0 128.977455 64.465455 64.465455 0 0 1 0-128.977455zM269.847273 350.859636a64.512 64.512 0 1 1 0 129.000728 64.512 64.512 0 0 1 0-129.000728z" p-id="19060"></path>
            <path :fill="$store.getters.theme.topNav.fontColor" d="M427.264 930.769455a32.116364 32.116364 0 0 1-28.299636-16.756364l-109.544728-192.069818a32.186182 32.186182 0 0 1 12.032-43.962182 32.116364 32.116364 0 0 1 43.962182 12.032l81.850182 143.429818 81.850182-143.429818c8.843636-15.499636 28.509091-20.945455 43.985454-12.032 15.476364 8.797091 20.852364 28.485818 12.032 43.962182l-109.568 192.069818a32.302545 32.302545 0 0 1-28.229818 16.756364h-0.069818z" p-id="19061"></path>
            <path :fill="$store.getters.theme.topNav.fontColor" d="M837.934545 737.024H540.439273c-17.826909 0-32.256-14.405818-32.256-32.256s14.429091-32.256 32.256-32.256h297.495272c42.146909 0 76.404364-32.814545 76.404364-73.146182V230.795636c0-40.308364-34.280727-73.076364-76.404364-73.076363H186.042182c-42.123636 0-76.381091 32.768-76.381091 73.076363v368.570182c0 40.308364 34.257455 73.146182 76.381091 73.146182h129.419636c17.826909 0 32.256 14.405818 32.256 32.256s-14.429091 32.256-32.256 32.256H186.042182c-77.684364 0-140.893091-61.719273-140.893091-137.634909V230.795636c0-75.869091 63.208727-137.588364 140.893091-137.588363h651.892363c77.684364 0 140.916364 61.719273 140.916364 137.588363v368.570182c0 75.938909-63.232 137.658182-140.916364 137.658182z" p-id="19062"></path>
          </svg>
          <el-dropdown class="jvs-tags__menu">
            <p style="margin:0;" :style="'color: '+ $store.getters.theme.topNav.fontColor +';'">
              <span>{{storeTemp.getters.userInfo.accountName}}</span>
              <svg width="18" height="18" style="cursor:pointer;" t="1618561971348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37130" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :fill="$store.getters.theme.topNav.fontColor" d="M362.474667 128.375467h303.317333a123.349333 123.349333 0 0 1 106.824533 61.696l151.658667 262.749866a123.400533 123.400533 0 0 1 0 123.370667l-151.658667 262.7584a123.349333 123.349333 0 0 1-106.824533 61.691733h-303.317333a123.349333 123.349333 0 0 1-106.824534-61.696l-151.658666-262.754133a123.400533 123.400533 0 0 1 0-123.370667l151.658666-262.754133a123.349333 123.349333 0 0 1 106.824534-61.696z m0 64a59.349333 59.349333 0 0 0-51.396267 29.6832L159.419733 484.821333a59.400533 59.400533 0 0 0 0 59.383467L311.082667 806.954667a59.349333 59.349333 0 0 0 51.396266 29.687466h303.317334a59.349333 59.349333 0 0 0 51.396266-29.687466l151.658667-262.754134a59.400533 59.400533 0 0 0 0-59.383466L717.184 222.058667a59.349333 59.349333 0 0 0-51.396267-29.6832h-303.317333zM512 661.333333c-82.474667 0-149.333333-66.858667-149.333333-149.333333s66.858667-149.333333 149.333333-149.333333 149.333333 66.858667 149.333333 149.333333-66.858667 149.333333-149.333333 149.333333z m0-64c47.1296 0 85.333333-38.203733 85.333333-85.333333s-38.203733-85.333333-85.333333-85.333333-85.333333 38.203733-85.333333 85.333333 38.203733 85.333333 85.333333 85.333333z" p-id="37131"></path>
              </svg>
            </p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="goInfo('userManager')">个人信息</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="goInfo('passwordManager')">修改密码</el-dropdown-item> -->
              <el-dropdown-item v-if="hasSwitch && false" @click.native="changeTenant">切换租户</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <div class="more-nav-box" v-if="isMOreEntry">
      <div class="more-nav-list" :style="'top:'+$store.getters.theme.logo.height+';'">
        <div class="more-nav-list-left" :style="(false && $store.getters.isCollapse) ? '' : 'width: 450px;'">
          <ul class="more-system-list" :style="(false && $store.getters.isCollapse) ? '' : ('margin-left: '+ $store.getters.theme.logo.width + ';')">
            <li v-for="(item, index) in sysList" :key="'more-item-'+item.name+index" @mouseover="entryMoreSystem(item)" :class="{'activeSysItem': item.id == (activeMore ? activeMore.id : activeSystem)}" @click="entrySystem(item); isMOreEntry = false;">
              <span>{{item.name}}</span>
              <svg v-if="item.extend && item.extend.type === 'jvsapp'" aria-hidden="true">
                <use xlink:href="#icon-application"></use>
              </svg>
            </li>
          </ul>
        </div>
        <div class="more-nav-list-right" v-if="activeMore && activeMore.children">
          <div v-for="menu in activeMore.children" :key="'more-menu-'+menu.name" :class="{'more-menu': true}">
            <div class="more-menu-second">
              <span>{{menu.name}}</span>
            </div>
            <div class="more-menu-third" v-if="menu.children && menu.children.length > 0">
              <p v-for="mi in menu.children" :key="'more-menu-child-'+mi.name" @click="openMoreMenu(mi)" :class="{'activeMenu': (mi.id == activeMenu || vaildAvtive(mi))}">
                <span>{{mi.name}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="more-nav-list-rightMenu"></div>
      </div>
      <div class="more-modal" @mouseover="entryMore(false)"></div>
    </div>
  </div>
</template>
<script>
// 引入默认的主题风格
import {simpleStyle, darkblueStyle, darkredStyle} from '@/const/theme'
import top from './top/index'
import { getStore } from "@/util/store.js";
import { mapGetters, mapState } from "vuex";
import store from '@/store'
import {getUnread, getAllSystemList, loginoutHandle, getSearchMenu, editTheme} from '@/api/admin/home'
import themeForm from './form'
import tenantDialog from '@/views/main/tenant/index'
import {getTenantByUser} from '@/api/login'
import bus from '@/util/vuebus'
import config from "./sidebar/config.js";
import {client_id} from '@/const/const'
export default {
  name: "tags",
  components: {
    top,
    themeForm,
    tenantDialog
  },
  data () {
    return {
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
      activeMore: null,
      activeMenu: '',
      config: config,
      menuKey: '', // 搜索菜单关键词
      menuSearchVisible: false,
      searchMenuList: []
    };
  },
  created () {
    this.getUnreadMessage()
    this.getAllSysntem()
  },
  mounted () {
    // this.setActive();
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website"]),
    ...mapState({
      showTag: state => state.common.showTag
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
    }
  },
  methods: {
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
    // 快捷导航
    quickNav () {
      this.$message.warning('此功能暂未开发')
    },
    // 获取所有系统
    getAllSysntem () {
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
        }
      })
    },
    // 切换系统
    entrySystem (item) {
      this.activeSystem = item.id
      this.$emit('changeSystem', item.id)
      this.$store.commit("SET_SYSTEM", this.activeSystem)
    },
    // 打开文档
    openDocument () {
      this.$openUrl('/jvs-document-ui/#/index', '_blabk')
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
            this.entryMoreSystem(this.sysList[i])
          }
        }
      }
    },
    // 展示系统的子菜单
    entryMoreSystem (item) {
      this.activeMore = item
    },
    openMoreMenu (item) {
      if (item.extend && item.extend.design) {
        this.activeMenu = item.id
        this.entrySystem(this.activeMore)
        this.isMOreEntry = false
        let url = ''
        switch (item.extend.design) {
          case 'chart':
            url = `/chart-design-ui/chartShow?type=pc&id=${item.extend.id}`;
            break
          case 'crud':
            url = `/page-design-ui/show?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}&isDeploy=${item.extend.isDeploy}`;
            break
          case 'form':
            url = `/page-design-ui/form/info?id=${item.extend.id}&dataModelId=${item.extend.dataModelId}&isDeploy=${item.extend.isDeploy}`;
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
      if(item.extend && item.extend.url.indexOf('#') > -1){
        tempStr = (item.extend.url && ('#' + item.extend.url.split('#')[1])) || ''
      }else{
        let indx = item.extend.url.indexOf('-ui')
        if(indx > -1) {
          tempStr = item.extend.url.slice(0, indx+3) + '/#' + item.extend.url.slice(indx+3, item.extend.url.length)
        }
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
    searchClick (item) {
      this.openMenuRoute(item)
      this.menuKey = ''
      this.menuSearchVisible = false
    }
  }
};
</script>
<style lang="scss">
.jvs-tags {
  // border-bottom: 1px solid #c5c5c5;
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
      .quick-nav{
        margin: 0;
        cursor:pointer;
        margin-left: 40px;
        display: flex;
        align-items: center;
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
          // font-size: 15px;
          font-size: 16px;
          cursor: pointer;
          padding: 0 25px;
          i{
            font-size: 32px!important;
          }
          span{
            word-break: keep-all;
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
        .search-menu{
          margin-right: 10px;
          .el-input__inner{
            background: none;
            outline: none;
            color: #fff;
          }
          .el-input__inner:focus{
            border-color: #fff;
          }
        }
      }
    }
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
  height: 100%;
  .more-nav-list {
    height: 420px;
    overflow: hidden;
    width: 100%;
    background: #fff;
    box-shadow: 10px 10px 10px #EEEEEE;
    display: flex;
    .more-nav-list-left{
      width: 300px;
      background: #efefef;
      height: 100%;
      overflow: hidden;
      .more-system-list{
        //font-size: 18px;
        font-size: 16px;
        color: #333333;
        margin: 0;
        padding: 0;
        margin-left: 80px;
        height: 100%;
        overflow: auto;
        padding-bottom: 20px;
        box-sizing: border-box;
        li{
          margin-top: 25px;
          display: flex;
          align-items: center;
          text-indent: 10px;
          cursor: pointer;
        }
        svg {
          width: 16px;
          height: 16px;
          margin-left: 10px;
        }
        li::before{
          display: block;
          content: '';
          width: 3px;
          height: 18px;
          background: #efefef;
        }
        li:hover{
          color: #3471FF;
        }
        li:hover::before{
          background: #3471FF;
        }
        li.activeSysItem{
          color: #3471FF;
        }
        li.activeSysItem::before{
          background: #3471FF;
        }
      }
    }
    .more-nav-list-right{
      width: calc(100% - 800px);
      font-size: 16px;
      overflow: auto;
      padding: 25px 0;
      .more-menu{
        margin-left: 60px;
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
        }
        span{
          font-size: 14px;
        }
      }
      .activeMenu{
        span{
          color: #3471FF;
        }
      }
    }
    .more-nav-list-rightMenu{
      width: 350px;
      background-image: url(./rightTool.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto;
      position: absolute;
      top: 0;
      right: 0;
      height: 420px;
    }
  }
  .more-modal{
    width: 100%;
    height: calc(100% - 420px);
  }
}
.search-menu-result{
  p{
    height: 32px;
    margin: 0;
    padding: 0 10px;
    line-height: 32px;
    cursor: pointer;
  }
  p:hover{
    background: #3471FF;
    color: #fff;
  }
}
</style>


