import Vue from "vue"
export const tablewxOption={
  page: true,
  align: 'center',
  menuAlign: 'center',
  // viewBtn: false,
  // addBtn: false,
  // editBtn: false,
  // delBtn: false, // Vue.prototype.$permissionMatch("upms_mgr_zu_hu_shan_chu_zu_hu"), // true,
  // selection: false,
  // search: true,
  // inline: true,
  // showOverflow: true,
  // isSearch: true,
  // labelWidth: 'auto',
  // submitBtnText: '查询',
  // cancal: false,
  column: [
    {
      label: '欢迎语', // '关键字对应的回复内容',
      prop: 'keywordJson',
      span: 24,
      showwordlimit: true,
      rules: [
        { required: true, message: '请输入欢迎语', trigger: 'blur' }
      ]
    },
    {
      label: '关键字信息',
      prop: 'keywordText',
      span: 24,
      search: true,
      searchSpan: 4,
      rules: [
        { required: true, message: '请输入关键字信息', trigger: 'blur' }
      ]
    }
    // ,
    // {
    //   prop: 'icon',
    //   span: 15,
    //   hide: true,
    //   formSlot: true
    // },
    // {
    //   prop: 'logo',
    //   hide: true,
    //   formSlot: true,
    //   span: 15,
    // },
    // {
    //   prop: 'bgImg',
    //   hide: true,
    //   formSlot: true,
    //   span: 15,
    // }
  ]
}
