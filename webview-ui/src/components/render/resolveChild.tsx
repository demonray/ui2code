import { resolveComponent, h, defineComponent, type PropType, type ComponentOptions } from 'vue';
import draggable from "vuedraggable";
import { renderChildrenItem, type ItemOpts } from '../../DraggableItem'
type resultInfo = { options: Object, child: Array<any> | string }
type resolveComponentChild = (conf: ComponentItemJson, opts?: ItemOpts) =>  Array<any> | string
type resolveComponentOption = (conf: ComponentItemJson, opts?: ItemOpts) => object
interface pluginInfoType { getChild: resolveComponentChild, getOption?: resolveComponentOption }
export default class renderChildClass {
    conf: ComponentItemJson
    opts: ItemOpts | undefined
    static plugins: Map<string, pluginInfoType>
    constructor(conf: ComponentItemJson, opts?: ItemOpts) {
        this.conf = conf
        this.opts = opts
    }
    static addPlugin(tag: string, params: pluginInfoType) {
        if (!this.plugins) {
            this.plugins = new Map()
        }
        if(this.plugins.has(tag)) {
            throw new Error(`当前需要注入的插件${tag}已经存在，请勿重复注入`);
        } else {
            this.plugins.set(tag, params)
        }
        return this
    }
    resolve(): resultInfo{
        console.log(renderChildClass.plugins)
        const defaultPluginInfo: pluginInfoType = renderChildClass.plugins.get('default') as pluginInfoType
        const pluginInfo: pluginInfoType = renderChildClass.plugins.get(this.conf.type) || defaultPluginInfo
        let options = {}
        if (pluginInfo.getOption){
            options = pluginInfo.getOption(this.conf)
        } else if(defaultPluginInfo?.getOption) {
            options = defaultPluginInfo.getOption(this.conf)
        }
        return {
            child: pluginInfo.getChild(this.conf, this.opts),
            options
        }
    }
}
/**
 * 通用简单的属性-复杂的请单独在各自的插件导入时使用
 * @param conf 组件描述
 * @returns
 */
function makeDataObj(conf: ComponentItemJson): object {
    const options: { [propName: string]: any } = {};
    switch (conf.type) {
      case "table":
        options.data = conf.data;
        options.border = conf.__config__.border;
        break;
      case "menu":
        options.mode = conf.__config__.mode;
        options['default-active'] = '0'
        break;
      case "steps":
        options.direction = conf.__config__.mode;
        break;
    case "tabs":
        options.type = conf.__config__.type;
        options.tabPosition = conf.__config__.position;
        options.editable = conf.__config__.editable;
        break;
      case "timerange":
        options["is-range"] = true;
        break;
      case "pagination":
        options["page-sizes"] = conf.__config__['page-sizes'];
        options.layout = 'prev,next,pager,' + conf.__config__.layoutItems.join(',');
        options.total = 20;
        break;
      case "dialog":
        options.modelValue = conf.__config__.show;
        options.title = conf.__config__.title;
        options.closable = conf.__config__.closable;
        options.footer = conf.__config__.footer;
        break;
      case "button":
        options.type = conf.__config__.type;
        break;
      case "progress":
        options.type = conf.__config__.type;
        options.percentage = conf.percentage;
        conf.strokeWidth && (options['stroke-width'] = conf.strokeWidth);
        options.status = conf.status;
        break;
      default:
        options.type = conf.type
    }
    if (conf.placeholder) {
      options.placeholder = conf.placeholder
    }
    return options;
}
// 默认
class defaultPlugin implements pluginInfoType {
    getChild (conf: ComponentItemJson):  Array<any> | string{
        return (conf.__slot__ && conf.__slot__.default) ? conf.__slot__.default : ''
    }
    getOption(conf: ComponentItemJson) { return makeDataObj(conf) }
}
// 表单
class tablePlugin implements pluginInfoType {
    getChild (conf: ComponentItemJson):  Array<any> | string{
        return conf.__config__.children.map((item: { label: string; prop: string }) => {
            return h(resolveComponent("el-table-column"), { label: item.label, prop: item.prop });
        })
    }
}
// 单选框/多选框
class radioAndCheckboxPlugin implements pluginInfoType {
    type: string
    constructor(type: string) {
        this.type = type
    }
    getChild (conf: ComponentItemJson):  Array<any> | string{
        return (conf.__slot__?.options || []).map((item: { label: string; value: string | number }) => {
            return h(resolveComponent("el-radio"), { label: item.label, value: item.value });
        });
    }
}
// 菜单导航
class menuPlugin implements pluginInfoType {
    resolveMenu(children: OptionItem[]): Array<any> | string {
        return children.map((item: OptionItem) => {
          if (item.children) {
            return h(resolveComponent("el-sub-menu") as ComponentOptions, { index: item.value }, {
              default: () => this.resolveMenu(item.children as OptionItem[]),
              title: () => item.label
            })
          } else {
            return h(resolveComponent("el-menu-item"), { index: item.value}, () => item.label)
          }
        })
    }
    getChild (conf: ComponentItemJson):  Array<any> | string{
        return (conf.__slot__?.options || []).map((item:OptionItem) => {
            if (item.children) {
              return h(resolveComponent("el-sub-menu") as ComponentOptions, { index: item.value },
              {
                default: () => this.resolveMenu(item.children as OptionItem[]),
                title: () => item.label
              })
            }
            return h(resolveComponent("el-menu-item"), { index: item.value }, () => item.label)
        });
    }
}
// Tabs标签页
class tabsPlugin implements pluginInfoType {
    draggableRow(params: {currentItem: OptionItem, optionIndex: number, parentGuid: string, opts: ItemOpts} ) {
      const { currentItem, optionIndex, parentGuid, opts} = params
      return h(draggable, {
        animation: 340,
        'item-key': "guid",
        "group": "componentsGroup",
        "class": "drag-wrapper",
        list: currentItem.childrenComponet || [],
        onChange: ({ added, removed }: any) => {
          if (added && added.element) {
            added.element.parentInfo = {
              index: optionIndex,
              guid: parentGuid
            }
          } else if (removed && removed.element) {
            delete removed.element.parentInfo
          }
        }
      }, {
        item: ({ element }: any) => renderChildrenItem(element, opts)
      })
    }
    getChild (conf: ComponentItemJson, opts?: ItemOpts):  Array<any> | string{
        return (conf.__slot__?.options || []).map((item:OptionItem, index: number) => {
            return h(resolveComponent("el-tab-pane"),
              { label: item.label, name: item.value },
              () => h('div', { class: 'drawing-item drawing-row-item' }, this.draggableRow({
                currentItem: item,
                parentGuid: conf.guid,
                optionIndex: index,
                opts: opts as ItemOpts
              })))
        });
    }
}
// 菜单导航
class stepsPlugin implements pluginInfoType {
  getChild (conf: ComponentItemJson):  Array<any> | string{
      return (conf.__slot__?.options || []).map((item:OptionItem) => {
          return h(resolveComponent("el-step"), { title: item.label, description: item.value })
      });
  }
}
// 以插件形式导入--后续组建过多可以单独整出去
renderChildClass.addPlugin('default', new defaultPlugin())
.addPlugin('table', new tablePlugin())
.addPlugin('radio', new radioAndCheckboxPlugin('radio'))
.addPlugin('checkbox', new radioAndCheckboxPlugin('checkbox'))
.addPlugin('menu', new menuPlugin())
.addPlugin('tabs', new tabsPlugin())
.addPlugin('steps', new stepsPlugin())
