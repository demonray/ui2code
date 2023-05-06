import { computed, watch, defineComponent, reactive } from "vue";
import draggable from "vuedraggable";
import type { PropType } from "vue";
import render from "./components/render/index";

interface ItemOpts {
  actived: boolean;
  active: () => void;
  deleteItem: () => void;
  copy: () => void;
}

const components = {
  itemBtns(currentItem: ComponentItemJson, index: number, opts: ItemOpts) {
    const { copy, deleteItem } = opts;
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          copy();
          event.stopPropagation();
        }}>
        <svg-icon name="copy" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          deleteItem();
          event.stopPropagation();
        }}>
        <svg-icon name="delete" />
      </span>,
    ];
  },
};
const layouts = {
  colItem(currentItem: ComponentItemJson, index: number, opts: ItemOpts) {
    const { active, actived } = opts;
    const config = currentItem.__config__;
    const child = renderChildren(currentItem, index, opts);
    let className = actived ? "drawing-item active-from-item" : "drawing-item";
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return (
      <el-col
        span={config.span}
        class={className}
        onClick={(event: MouseEvent) => {
          active();
          event.stopPropagation();
        }}>
        <el-form-item
          label-width={labelWidth}
          label={config.showLabel ? config.label : ""}
          required={config.required}>
          <render key={config.renderKey} conf={currentItem}>
            {child}
          </render>
        </el-form-item>
        {components.itemBtns(currentItem, index, opts)}
      </el-col>
    );
  },
  rowItem(currentItem: ComponentItemJson, index: number, opts: ItemOpts) {
    const { active, actived } = opts;
    const config = currentItem.__config__;
    const className = actived ? "drawing-row-item active-from-item" : "drawing-row-item";
    let child = renderChildren(currentItem, index, opts);
    return (
      <el-col span={config.span}>
        <el-row
          gutter={config.gutter}
          class={className}
          onClick={(event: MouseEvent) => {
            active();
            event.stopPropagation();
          }}>
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            item-key="name"
            group="componentsGroup"
            class="drag-wrapper">
            {{
              item: () =>
                currentItem.lyoutType === "flex" ? (
                  <el-row
                    type={currentItem.lyoutType}
                    justify={currentItem.justify}
                    align={currentItem.align}>
                    {child}
                  </el-row>
                ) : (
                  child
                ),
            }}
          </draggable>
          {components.itemBtns(currentItem, index, opts)}
        </el-row>
      </el-col>
    );
  },
  raw(currentItem: ComponentItemJson, index: number, opts: ItemOpts) {
    const config = currentItem.__config__;
    const child = renderChildren(currentItem, index, opts);
    return (
      <render key={config.renderKey} conf={currentItem}>
        {child}
      </render>
    );
  },
};

function renderChildren(currentItem: ComponentItemJson, index: number, opts: ItemOpts) {
  const config = currentItem.__config__;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout as keyof typeof layouts];
    if (layout) {
      return layout(el, i, opts);
    }
    return layoutIsNotFound(currentItem);
  });
}

function layoutIsNotFound(currentItem: ComponentItemJson) {
  throw new Error(`没有与${currentItem.__config__.layout}匹配的layout`);
}

export default defineComponent({
  props: {
    index: {
      type: Number,
      required: true,
    },
    currentItem: {
      type: Object as PropType<ComponentItemJson>,
      required: true,
    },
    activeIndex: {
      type: Number,
      required: true,
    },
  },
  components: {
    render,
    draggable,
  },
  setup(props, context) {
    function active() {
      context.emit("activeItem", props.index);
    }
    /**
     * 删除
     */
    function deleteItem() {
      context.emit("deleteItem", props.index);
    }
    /**
     * 复制
     */
    function copy() {
      context.emit("copyItem", props.currentItem);
    }

    const config = computed(() => {
      return {
        showLabel: props.currentItem.__config__.showLabel,
        layout: props.currentItem.__config__.layout,
        labelWidth: props.currentItem.__config__.labelWidth
          ? `${props.currentItem.__config__.labelWidth}px`
          : null,
        label: props.currentItem.__config__.label,
        required: props.currentItem.__config__.required,
      };
    });
    let itemOpts: ItemOpts = reactive({
      actived: props.activeIndex === props.index,
      active,
      deleteItem,
      copy,
    });
    watch(props, (v) => {
      itemOpts.actived = v.activeIndex === v.index;
    });
    const layout = layouts[config.value.layout as keyof typeof layouts];

    if (layout) {
      return () => layout(props.currentItem, props.index, itemOpts);
    }
    return layoutIsNotFound(props.currentItem);
  },
});
