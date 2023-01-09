<script setup lang="ts">
import { computed } from "vue";
import render from "./components/render/index";

interface Props {
    index: number
    currentItem: ComponentItemJson
    activeIndex: number
}
const props = defineProps<Props>()

const emit = defineEmits(["activeItem", "deleteItem", "copyItem"]);

function active() {
  emit("activeItem", props.index);
}
function deleteItem() {
  emit("deleteItem", props.index);
}
function copy() {
  emit("copyItem", props.currentItem);
}
const config = computed(() => {
    // console.log(props.currentItem)
    return {
        showLabel: props.currentItem.__config__.showLabel,
        labelWidth: 100,
        label: props.currentItem.__config__.label,
        required: props.currentItem.__config__.required,
    }
});

</script>
<template>
  <div @click="active" class="drawing-item" :class="{'active-from-item': props.activeIndex === props.index}">
    <el-form-item :label-width="config.labelWidth"
          :label="config.showLabel ? config.label : ''" :required="config.required">
      <render :conf="props.currentItem as Object" />
    </el-form-item>
    <span class="drawing-item-copy" title="复制" @click="copy">
      <svg-icon name="copy" />
    </span>
    <span class="drawing-item-delete" title="删除" @click="deleteItem">
      <svg-icon name="delete" />
    </span>
  </div>
</template>
