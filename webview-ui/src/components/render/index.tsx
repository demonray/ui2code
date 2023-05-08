import { h, defineComponent, resolveComponent } from "vue";
import type { PropType } from "vue";

/**
 *
 * @param conf 组件描述
 * @returns
 */
function makeDataObj(conf: ComponentItemJson): object {
  // todo 组件props
  const options: { [propName: string]: any } = {};
  switch (conf.type) {
    case "table":
      options.data = conf.data;
      options.border = conf.__config__.border;
      break;
    case "timerange":
      options["is-range"] = true;
      break;
    default:
      options.type = conf.type;
  }
  return options;
}

function makeChild(conf: ComponentItemJson): Array<any> | string {
  if (conf.__slot__ && conf.__slot__.options) {
    // 单选框组
    if (conf.__config__.tag === "el-radio-group") {
      return conf.__slot__.options.map((item: { label: string; value: string | number }) => {
        return h(resolveComponent("el-radio"), { label: item.label, value: item.value });
      });
    }
    // 复选框组
    if (conf.__config__.tag === "el-checkbox-group") {
      return conf.__slot__.options.map((item: { label: string; value: string | number }) => {
        return h(resolveComponent("el-checkbox"), { label: item.label, value: item.value });
      });
    }
  }
  // 表格
  if (conf.__config__.tag === "el-table") {
    return conf.__config__.children.map((item: { label: string; prop: string }) => {
      return h(resolveComponent("el-table-column"), { label: item.label, prop: item.prop });
    });
  }
  if (conf.__slot__ && conf.__slot__.default) {
    return conf.__slot__.default;
  }
  return "";
}

export default defineComponent({
  props: {
    conf: {
      type: Object as PropType<ComponentItemJson>,
      required: true,
    },
  },
  render() {
    const tag = resolveComponent(this.conf.__config__.tag as string);
    const child: Array<any> | string = makeChild(this.conf);
    const options = makeDataObj(this.conf);
    console.log(tag, options);
    return h(tag, options, child);
  },
});
