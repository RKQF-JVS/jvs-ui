<template>
  <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <div class="demo-item">
        <h5>基础用法</h5>
        <span>基础的、简洁的标签页</span>
        <div class="show">
          <jvs-tab :active="activeName" :option="optionFirst">
          </jvs-tab>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-tab :active="activeName" :option="option"></jvs-tab>

            option: {
              column: [
                {
                  label: "选项卡一", // 选项卡标题
                  name: "first",
                },
                {
                  label: "选项卡二",
                  name: "second",
                },
                {
                  label: "选项卡三",
                  name: "third",
                },
                {
                  label: "选项卡四",
                  name: "fourth",
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>选项卡样式</h5>
        <span>选项卡样式的标签页</span>
        <br />
        <span>只需要设置 type 属性为 card 就可以使选项卡改变为标签风格</span>
        <div class="show">
          <jvs-tab :active="activeName" :option="optionSecond">
          </jvs-tab>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-tab :active="activeName" :option="option"></jvs-tab>

            option: {
              type: "card",
              column: [
                {
                  label: "选项卡一", // 选项卡标题
                  name: "first",
                },
                {
                  label: "选项卡二",
                  name: "second",
                },
                {
                  label: "选项卡三",
                  name: "third",
                },
                {
                  label: "选项卡四",
                  name: "fourth",
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>卡片化</h5>
        <span>卡片化的标签页</span>
        <br />
        <span>将type设置为border-card</span>
        <div class="show">
          <jvs-tab :active="activeName" :option="optionThird">
          </jvs-tab>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-tab :active="activeName" :option="option"></jvs-tab>

            option: {
              type: "border-card",
              column: [
                {
                  label: "选项卡一", // 选项卡标题
                  name: "first",
                },
                {
                  label: "选项卡二",
                  name: "second",
                },
                {
                  label: "选项卡三",
                  name: "third",
                },
                {
                  label: "选项卡四",
                  name: "fourth",
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>位置</h5>
        <span>可以通过 tabPosition 设置标签的位置</span>
        <br/>
        <span>标签一共有四个方向的设置 tabPosition="left|right|top|bottom"</span>
        <div class="show">
          <jvs-tab :active="activeName" :option="optionFourth">
          </jvs-tab>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-tab :active="activeName" :option="option"></jvs-tab>

            option: {
              tabPosition: "left",
              column: [
                {
                  label: "选项卡一", // 选项卡标题
                  name: "first",
                },
                {
                  label: "选项卡二",
                  name: "second",
                },
                {
                  label: "选项卡三",
                  name: "third",
                },
                {
                  label: "选项卡四",
                  name: "fourth",
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
      <div class="demo-item">
        <h5>自定义标签页</h5>
        <span>可以通过 slot 来实现自定义标签页的内容</span>
        <div class="show">
          <jvs-tab :active="activeName" :option="optionFirst">
            <!-- 插槽 -->
            <template slot="first">
              <span>first的插槽内容</span>
            </template>
          </jvs-tab>
        </div>
        <div class="show-code">
          <codeArea lang="html" :content='`
            <jvs-tab :active="activeName" :option="option">
              <!-- 插槽 -->
              <template slot="first">
                <span>first的插槽内容</span>
              </template>
            </jvs-tab>

            option: {
              column: [
                {
                  label: "选项卡一",
                  name: "first",
                },
                {
                  label: "选项卡二",
                  name: "second",
                },
                {
                  label: "选项卡三",
                  name: "third",
                },
                {
                  label: "选项卡四",
                  name: "fourth",
                }
              ]
            }
          `'>
          </codeArea>
        </div>
      </div>
    </div>
    <div>
      <jvs-table pageheadertitle="tab参数配置" :option="option" :data="tableData"></jvs-table>
      <jvs-table pageheadertitle="tab-panel参数配置" :option="option" :data="panelData"></jvs-table>
      <jvs-table pageheadertitle="事件说明" :option="event" :data="eventData"></jvs-table>
    </div>
  </div>
</template>
<script>
import {paramOption, eventOption} from '../../attr'
export default {
  name: 'tab',
  data () {
    return {
      detail: {
        title: 'Tabs 标签页',
        info: '分隔内容上有关联但属于不同类别的数据集合',
        useInfo: '<jvs-tab></jvs-tab>'
      },
      option: paramOption,
      tableData: [
        {
          param: 'active',
          introduce: '绑定值，选中选项卡的 name',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'type',
          introduce: '风格类型',
          type: 'string',
          value: 'card/border-card',
          default: '-'
        },
        {
          param: 'tabPosition',
          introduce: '选项卡所在位置',
          type: 'string',
          value: 'top/right/bottom/left',
          default: 'top'
        },
        {
          param: 'stretch',
          introduce: '标签的宽度是否自撑开',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'column',
          introduce: '选项配置集合，具体项参考tab-panel配置',
          type: 'array',
          value: '-',
          default: '-'
        }
      ],
      panelData: [
        {
          param: 'label',
          introduce: '选项卡标题',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'name',
          introduce: '与选项卡绑定值 value 对应的标识符，表示选项卡别名',
          type: 'string',
          value: '-',
          default: '-'
        },
        {
          param: 'disabled',
          introduce: '是否禁用',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'lazy',
          introduce: '标签是否延迟渲染',
          type: 'boolean',
          value: '-',
          default: 'false'
        },
        {
          param: 'permisionFlag',
          introduce: '权限标识',
          type: 'string',
          value: '-',
          default: '-'
        }
      ],
      event: eventOption,
      eventData: [
        {
          name: 'tab-click',
          introduce: 'tab 被选中时触发',
          param: '被选中的标签的name',
        }
      ],
      activeName: 'first',
      optionFirst: {
        column: [
          {
            label: "选项卡一",
            name: "first",
          },
          {
            label: "选项卡二",
            name: "second",
          },
          {
            label: "选项卡三",
            name: "third",
          },
          {
            label: "选项卡四",
            name: "fourth",
          }
        ]
      },
      optionSecond: {
        type: "card",
        column: [
          {
            label: "选项卡一",
            name: "first",
          },
          {
            label: "选项卡二",
            name: "second",
          },
          {
            label: "选项卡三",
            name: "third",
          },
          {
            label: "选项卡四",
            name: "fourth",
          }
        ]
      },
      optionThird: {
        type: "border-card",
        column: [
          {
            label: "选项卡一",
            name: "first",
          },
          {
            label: "选项卡二",
            name: "second",
          },
          {
            label: "选项卡三",
            name: "third",
          },
          {
            label: "选项卡四",
            name: "fourth",
          }
        ]
      },
      optionFourth: {
        tabPosition: "left",
        column: [
          {
            label: "选项卡一",
            name: "first",
          },
          {
            label: "选项卡二",
            name: "second",
          },
          {
            label: "选项卡三",
            name: "third",
          },
          {
            label: "选项卡四",
            name: "fourth",
          }
        ]
      },
    }
  }
}
</script>
<style lang="scss" scoped>

</style>