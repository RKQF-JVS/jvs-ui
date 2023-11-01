export const stepFormOption = {
    type: 'card',
    column: [
      {
        label: '表单一', // 选项卡标题
        disabled: false, // 是否禁用
        name: 'first', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
        permisionFlag: 'first',
        defaultData: {}, // 表单默认值
        formOption: {
          inline: true,
          labelWidth: 'auto',
          column: [
            {
              label: '文本框',
              prop: 'input',
          }
          ]
        }
      },
      {
        label: '表单二', // 选项卡标题
        disabled: false, // 是否禁用
        name: 'second', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
        permisionFlag: '',
        defaultData: {}, // 表单默认值
        formOption: {
          inline: true,
          labelWidth: 'auto',
          column: [
            {
              label: '下拉框',
              prop: 'select',
              type: 'select',
              dicData: [
                {label: '下拉一', value: 'first'},
                {label: '下拉二', value: 'second'}
              ]
            }
          ]
        }
      },
      {
        label: '表单三', // 选项卡标题
        disabled: false, // 是否禁用
        name: 'third', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
        permisionFlag: 'third'
      }
    ]
  
  }
  