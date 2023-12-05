<template>
  <el-dialog
    v-bind="$attrs"
    width="90%"
    style="max-height: 80%;overflow: auto;"
    :modal-append-to-body="false"
    @open="onOpen"
    @close="close"
  >
  <img :src="data.ui" />
  <img :src="data.text"  />
  </el-dialog>
</template>
<script setup lang="ts">

const props = defineProps({
  data: {
    type: Object,
    require: true,
    default: {}
  },
});

const emit = defineEmits(["confirm", "update:modelValue"]);

function onOpen() {}

function close() {
  emit("update:modelValue", false);
}
</script>
<style scoped>
img {
    width: 100%;
}
</style>