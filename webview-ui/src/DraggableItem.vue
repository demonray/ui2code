<script setup lang="ts">
import render from "./components/render/index";

interface DraggableItem {
  type: string;
  id: string
}

interface Props {
    index: number
    currentItem: DraggableItem
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
</script>
<template>
  <div @click="active" class="drawing-item" :class="{'active-from-item': props.activeIndex === props.index}">
    <el-form-item>
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
