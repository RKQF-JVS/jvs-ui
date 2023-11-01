export const tabOption = {
  type: 'card',
  column: [
    {
      label: '选项一', // 选项卡标题
      disabled: false, // 是否禁用
      name: 'first', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
      closable: false, // 标签是否可关闭
      lazy: false, // 标签是否延迟渲染
      permisionFlag: 'first'
    },
    {
      label: '选项二', // 选项卡标题
      disabled: true, // 是否禁用
      name: 'second', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
      closable: true, // 标签是否可关闭
      lazy: false, // 标签是否延迟渲染
      permisionFlag: ''
    },
    {
      label: '选项三', // 选项卡标题
      disabled: false, // 是否禁用
      name: 'third', // 与选项卡绑定值 value 对应的标识符，选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
      closable: true, // 标签是否可关闭
      lazy: false, // 标签是否延迟渲染
      permisionFlag: 'third'
    }
  ]

}
