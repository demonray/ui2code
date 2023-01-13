import { h, defineComponent, resolveComponent } from "vue";
/**
 *
 * @param conf
 * @returns
 */
function makeDataObj(conf: object): object {
  // console.log(conf)
  // todo 组件props生成函数
  return {
    type: conf.type,
  };
}
export default defineComponent({
  props: {
    conf: {
      type: Object,
      required: true,
    },
  },
  render() {
    const tag = resolveComponent(this.conf.__config__.tag);
    let child: Array<any> = [];
    if (this.conf.__slot__ && this.conf.__slot__.options) {
      if (this.conf.__config__.tag === "el-radio-group") {
        child = this.conf.__slot__.options.map(
          (item: { label: string; value: string | number }) => {
            return h(resolveComponent("el-radio"), { label: item.label, value: item.value });
          }
        );
      }
      if (this.conf.__config__.tag === "el-checkbox-group") {
        child = this.conf.__slot__.options.map(
          (item: { label: string; value: string | number }) => {
            return h(resolveComponent("el-checkbox"), { label: item.label, value: item.value });
          }
        );
      }
    }
    if (this.conf.__slot__ && this.conf.__slot__.default) {
      child = this.conf.__slot__.default;
    }
    const options = makeDataObj(this.conf);

    return h(tag, options, child);
  },
});
