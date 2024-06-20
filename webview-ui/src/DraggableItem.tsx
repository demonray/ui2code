import { computed, watch, defineComponent, reactive } from "vue";
import draggable from "vuedraggable";
import type { PropType } from "vue";
import render from "./components/render/index";

export interface ItemOpts {
  actived: boolean;
  active: (item: ComponentItemJson) => void;
  deleteItem: (item: ComponentItemJson) => void;
  copy: (item: ComponentItemJson) => void;
}

const components = {
  itemBtns(currentItem: ComponentItemJson, opts: ItemOpts) {
    const { copy, deleteItem } = opts;
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          copy(currentItem);
          event.stopPropagation();
        }}>
        <svg-icon name="copy" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          deleteItem(currentItem);
          event.stopPropagation();
        }}>
        <svg-icon name="delete" />
      </span>,
    ];
  },
};
const layouts = {
  colItem(currentItem: ComponentItemJson, opts: ItemOpts) {
    const { active, actived } = opts;
    const config = currentItem.__config__;
    let className = actived ? "drawing-item active-from-item" : "drawing-item";

    let child = null;
    if (config.children) {
      child = renderChildren(currentItem, opts);
    } else {
      return (
        <div
          class={className}
          onClick={(event: MouseEvent) => {
            active(currentItem);
            event.stopPropagation();
          }}>
          <render key={config.guid} conf={currentItem} opts={opts}></render>
          {components.itemBtns(currentItem, opts)}
        </div>
      );
    }
    return (
      <el-col
        span={config.span}
        class={className}
        onClick={(event: MouseEvent) => {
          active(currentItem);
          event.stopPropagation();
        }}>
        {child}
      </el-col>
    );
  },
  rowItem(currentItem: ComponentItemJson, opts: ItemOpts) {
    const { active, actived } = opts;
    const config = currentItem.__config__;
    const className = actived ? "drawing-row-item active-from-item" : "drawing-row-item";
    return (
      <el-row
        gutter={config.gutter}
        class={className}
        onClick={(event: MouseEvent) => {
          active(currentItem);
          event.stopPropagation();
        }}>
        <span class="component-name">{config.componentName}</span>
        <draggable
          list={config.children || []}
          animation={340}
          item-key="guid"
          group="componentsGroup"
          class="drag-wrapper el-row">
          {{
            item: ({ element }: any) => {
              return currentItem.layoutType === "flex" ? (
                <el-row
                  type={currentItem.layoutType}
                  justify={currentItem.justify}
                  align={currentItem.align}>
                  {renderChildrenItem(element, opts)}
                </el-row>
              ) : (
                <>{renderChildrenItem(element, opts)}</>
              );
            },
          }}
        </draggable>
        {components.itemBtns(currentItem, opts)}
      </el-row>
    );
  },
  raw(currentItem: ComponentItemJson, opts: ItemOpts) {
    const { active, actived } = opts;
    const config = currentItem.__config__;
    let className = actived ? "drawing-item active-from-item" : "drawing-item";
    let child = null;
    if (config.children) {
      child = renderChildren(currentItem, opts);
    }
    return (
      <div
        class={className}
        onClick={(event: MouseEvent) => {
          active(currentItem);
          event.stopPropagation();
        }}>
        <render key={config.guid} conf={currentItem} opts={opts}>
          {child}
        </render>
        {components.itemBtns(currentItem, opts)}
      </div>
    );
  },
};

export function renderChildren(currentItem: ComponentItemJson, opts: ItemOpts) {
  const config = currentItem.__config__;
  if (Array.isArray(config.children)) {
    return config.children.map((el, i) => {
      const layout = layouts[el.__config__.layout as keyof typeof layouts];
      if (layout) {
        return layout(el, opts);
      }
      return layoutIsNotFound(currentItem);
    });
  } else {
    return renderChildrenItem(currentItem, opts);
  }
}

export function renderChildrenItem(item: ComponentItemJson, opts: ItemOpts) {
  const layout = layouts[item.__config__.layout as keyof typeof layouts];
  if (layout) {
    return layout(item, opts);
  }
  return layoutIsNotFound(item);
}

function layoutIsNotFound(item: ComponentItemJson) {
  throw new Error(`没有与${item.__config__.layout}匹配的layout`);
}

export default defineComponent({
  props: {
    currentItem: {
      type: Object as PropType<ComponentItemJson>,
      required: true,
    },
    activeId: {
      type: String,
      required: true,
    },
  },
  components: {
    render,
    draggable,
  },
  setup(props, context) {
    function active(currentItem: ComponentItemJson) {
      console.log(currentItem, "active");
      context.emit("activeItem", currentItem);
    }
    /**
     * 删除
     */
    function deleteItem(currentItem: ComponentItemJson) {
      context.emit("deleteItem", currentItem);
    }
    /**
     * 复制
     */
    function copy(currentItem: ComponentItemJson) {
      context.emit("copyItem", currentItem);
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
      actived: props.activeId === props.currentItem.guid,
      active,
      deleteItem,
      copy,
    });
    watch(props, (v) => {
      itemOpts.actived = v.activeId === v.currentItem.guid;
    });
    const layout = layouts[config.value.layout as keyof typeof layouts];
    if (layout) {
      return () => layout(props.currentItem, itemOpts);
    }
    return layoutIsNotFound(props.currentItem);
  },
});
