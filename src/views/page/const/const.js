export const queryKeyList = [
  {label: "模糊", value: "LIKE"},
  {label: "左模糊", value: "LIKE_LEFT"},
  {label: "右模糊", value: "LIKE_RIGHT"},
  {label: "等于", value: "EQ"},
  {label: "不等于", value: "NE"},
  {label: "大于", value: "GT"},
  {label: "大于等于", value: "GE"},
  {label: "小于", value:"LT"},
  {label: "小于等于", value: "LE"},
  // {label: "为空", value:"IS_NULL"},
  // {label: "不为空", value: "IS_NOT_NULL"},
  {label: "区间", value: "BETWEEN"},
  // {label: "包含", value: "IN"}
]


/**数值 支持查询条件（等于 大于 小于 大于等于 小于等于 区间）**/
///public final static SqlKeyWordEnum[] NUMBER_QUERY_TYPE = new SqlKeyWordEnum[]{EQ, NE, GT, GE, LT, LE, BETWEEN};
/**字符串 时间 支持查询条件（模糊 左模糊 右模糊 等于）**/
//public final static SqlKeyWordEnum[] VARCHAR_QUERY_TYPE = new SqlKeyWordEnum[]{LIKE, LIKE_LEFT, LIKE_RIGHT, EQ};
const NUMBER_QUERY_TYPE = ['EQ', 'NE', 'GT', 'GE', 'LT', 'LE', 'BETWEEN']
const VARCHAR_QUERY_TYPE = ['LIKE', 'LIKE_LEFT', 'LIKE_RIGHT', 'EQ']
export const columnTypeList = [
  {label:'varchar',value:'varchar', type: 'input', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'bit',value:'bit', type: 'switch', isSearch: true, isSenior: false, isEnum: false},
  {label:'char',value:'char',type: 'input', isSearch: false, isSenior: false, isEnum: false},
  {label:'tinyblob',value:'tinyblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'tinytext',value:'tinytext', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'text',value:'text', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'mediumblob',value:'mediumblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'longblob',value:'longblob', type: 'textarea', isSearch: false, isSenior: false, isEnum: false},
  {label:'longtext',value:'longtext', type: 'textarea', isSearch: true, isSenior: true, limit: VARCHAR_QUERY_TYPE},
  {label:'tinyint',value:'tinyint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'smallint',value:'smallint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'mediumint',value:'mediumint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'int',value:'int', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'integer',value:'integer', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'year',value:'year', type: 'datePicker', datetype: 'year', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'bigint',value:'bigint', type: 'inputNumber', num: 'int', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'float',value:'float', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'double',value:'double', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'decimal',value:'decimal', type: 'inputNumber', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'date',value:'date', type: 'datePicker', datetype: 'date', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'time',value:'time', type: 'timePicker', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'datetime',value:'datetime', type: 'datePicker', datetype: 'datetime', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'timestamp',value:'timestamp', type: 'datePicker', datetype: 'datetime', isSearch: true, isSenior: false, limit: NUMBER_QUERY_TYPE},
  {label:'enum',value:'enum', type: '', isSearch: true, isSenior: true, isEnum: true, limit: ['EQ']},
]

export const btnType =  [
  // { position: ['top'],from:true, url: false, label: '新增表单', value: 'save_form'},
  // { position: ['top'],from:false, url: false, label: '导入', value: 'import_excel'},
  // // { position: ['top'],from:false, url: false, label: '导入', value: 'import_excel'},
  // { position: ['top'],from:true, url: false, label: '导出', value: 'export_excel'},
  // { position: ['line'],from:true, url: false, label: '修改表单', value: 'update_form'},
  // { position: ['line'],from:false, url: false, label: '删除操作', value: 'delete'},
  // // { position: ['line'],from:true, url: false, label: '其它表单', value: 'other_form'},
  // { position: ['line'],from:true, url: false, label: '详情', value: 'show_label'},
  // { position: ['top','line'],from:true, url: true, label: 'POST请求', value: 'network_post_url'},
  // { position: ['top','line'],from:true, url: true, label: 'GET请求', value: 'network_get_url'},
  // { position: ['top','line'],from:false, url: true, label: '打开内嵌页面', value: 'page_url'},
  // { position: ['top','line'],from:false, url: true, label: '打开新页面', value: 'open_page_url'},
  { position: ['top','line'],from:false, url: true, label: '表单', value: 'FORM'},
  { position: ['top'],from:false, url: true, label: '导入', value: 'IMPORT'},
  { position: ['top'],from:false, url: true, label: '导出', value: 'EXPORT'},
  { position: ['top','line'],from:false, url: true, label: '网络请求', value: 'NETWORK'},
]

export const defaultBtnList = [
  { name: '新增', position: 'top', type: 'FORM', formDesign: {formType: '', formdata: []}, fineGrainedType: 'SAVE', isopen: true },
  { name: '修改', position: 'line', type: 'FORM', formDesign: {formType: '', formdata: []}, fineGrainedType: 'EDIT', isopen: true },
  { name: '删除', position: 'line', type: 'NETWORK', formDesign: {formType: '', formdata: []}, fineGrainedType: 'DEL', isopen: true },
  { name: '详情', position: 'line', type: 'FORM', formDesign: {formType: '', formdata: []}, fineGrainedType: 'DETAIL', isopen: true },
  { name: '导出', position: 'top', type: 'EXPORT', formDesign: {formType: '', formdata: []}, fineGrainedType: 'EXPORT', isopen: true },
  { name: '导入', position: 'top', type: 'IMPORT', formDesign: {formType: '', formdata: []}, fineGrainedType: 'IMPORT', isopen: true },
]

export const dataTypeList = [
  {
    "label": "字符",
    "value": "VARCHAR",
    "type": "input",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      },
      {
        "value": "LIKE",
        "label": "模糊"
      },
      {
        "value": "LIKE_LEFT",
        "label": "左模糊"
      },
      {
        "value": "LIKE_RIGHT",
        "label": "右模糊"
      }
    ]
  },
  {
    "label": "日期",
    "value": "DATE",
    "type": "date",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      },
      {
        "value": "NE",
        "label": "不等于"
      },
      {
        "value": "GE",
        "label": "大于等于"
      },
      {
        "value": "GT",
        "label": "大于"
      },
      {
        "value": "LT",
        "label": "小于"
      },
      {
        "value": "LE",
        "label": "小于等于"
      },
      {
        "value": "BETWEEN",
        "label": "区间"
      }
    ]
  },
  {
    "label": "时间",
    "value": "TIME",
    "type": "time",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      },
      {
        "value": "NE",
        "label": "不等于"
      },
      {
        "value": "GE",
        "label": "大于等于"
      },
      {
        "value": "GT",
        "label": "大于"
      },
      {
        "value": "LT",
        "label": "小于"
      },
      {
        "value": "LE",
        "label": "小于等于"
      },
      {
        "value": "BETWEEN",
        "label": "区间"
      }
    ]
  },
  {
    "label": "日期时间",
    "value": "DATETIME",
    "type": "datePicker",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      },
      {
        "value": "NE",
        "label": "不等于"
      },
      {
        "value": "GE",
        "label": "大于等于"
      },
      {
        "value": "GT",
        "label": "大于"
      },
      {
        "value": "LT",
        "label": "小于"
      },
      {
        "value": "LE",
        "label": "小于等于"
      },
      {
        "value": "BETWEEN",
        "label": "区间"
      }
    ]
  },
  {
    "label": "数值",
    "value": "DECIMAL",
    "type": "inputNumber",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      },
      {
        "value": "NE",
        "label": "不等于"
      },
      {
        "value": "GE",
        "label": "大于等于"
      },
      {
        "value": "GT",
        "label": "大于"
      },
      {
        "value": "LT",
        "label": "小于"
      },
      {
        "value": "LE",
        "label": "小于等于"
      },
      {
        "value": "BETWEEN",
        "label": "区间"
      }
    ]
  },
  {
    "label": "字典",
    "value": "ENUM",
    "type": "select",
    "sqlKeywords": [
      {
        "value": "EQ",
        "label": "等于"
      }
    ]
  }
]