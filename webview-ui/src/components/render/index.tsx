import { h, defineComponent, resolveComponent } from "vue";
import type { PropType } from "vue";
import ResolveChild from './resolveChild'
import type { ItemOpts } from '../../DraggableItem'

export default defineComponent({
  props: {
    conf: {
      type: Object as PropType<ComponentItemJson>,
      required: true,
    },
    opts: {
      type: Object
    },
  },
  render() {
    const tag = resolveComponent(this.conf.__config__.tag as string);
    const { child, options } = new ResolveChild(this.conf, this.opts as ItemOpts).resolve()
    return h(tag, options, () => child);
  },
});
