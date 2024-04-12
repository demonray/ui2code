<template>
  <iframe
    ref="iframeRef"
    class="iframe-content"
    src="./labelimg/index.html"
    frameborder="0"
  ></iframe>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, toRaw } from "vue";

const props = defineProps({
  data: {
    type: Object,
    require: true,
    default: {},
  },
});

watch(props, () => {
  showConfirm();
});

let iframeRef = ref<any>(null); // 和iframe标签的ref绑定
let iframeWin: any = null;
onMounted(() => {
  if (iframeRef.value) {
    iframeWin = iframeRef.value.contentWindow;
  }
});

async function showConfirm() {
  const data = toRaw(props.data)
  let deviceEvent = {
    command: "ui2code_init_detect_data",
    data: {
      detectImg: data.detectImg,
      ...data.imageRes,
    },
  };
  if (iframeWin) {
    setTimeout(() => {
      iframeWin.postMessage(deviceEvent, "*");
    }, 1000);
  }
}
</script>
<style scoped>
.iframe-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 999;
}
</style>
