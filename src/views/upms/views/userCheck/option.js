import Vue from "vue"
import store from "@/store";
export const tableOption = {
  page: true,
  // align: 'center',
  // menuAlign: 'center',
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false, // Vue.prototype.$permissionMatch("yong_hu_guan_lishan_chu_yong_hu"),
  selection: false,
  search: true, //false,
  inline: true,
  showOverflow: true,
  isSearch: true,
  labelWidth: 'auto',
  submitBtnText: '查询',
  menuWidth: '250px',
  cancal: false,
  column: [
    {
      label: '头像',
      prop: 'headImg',
      display: false,
      type: 'image',
      slot: true
    },
    {
      label: '姓名',
      prop: 'realName',
      searchSpan: 4,
      search: true,
    },
    {
      label: '性别',
      prop: 'sex',
      searchSpan: 4,
      type: 'select',
      search: true,
      dicData: [
        {label: '男', value: 'male'},
        {label: '女', value: 'female'},
        {label: '保密', value: 'unknown'}
      ],
    },
    {
      label: '手机号',
      prop: 'phone',
      searchSpan: 4,
      search: true,
      rules: [
        { required: true, message: '请输入手机号', trigger: ['blur'] }
      ]
    },
    {
      label: '邮箱',
      prop: 'email',
      span: 6,
      hide: true,
      rules: [
        { required: true, message: '请输入邮箱', trigger: ['blur'] },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]
    },
    {
      label: "创建时间",
      prop: "createTime",
      // span: 6,
      display: false,
      type: "datePicker",
      datetype: 'datetime',
      format: "yyyy-MM-dd HH:mm:ss",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      sort: true,
      width: 100,
      span: 12
    },
  ]
}
