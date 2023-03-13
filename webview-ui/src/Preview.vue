<template>
  <iframe id="iframe" class="container"></iframe>
</template>
<script setup lang="ts">
import { onMounted, toRaw } from "vue";
import { loadSandpackClient } from "@codesandbox/sandpack-client";
import DetectService from "./config/modelService";

interface Props {
  files: IFiles;
}
const props = defineProps<Props>();

async function main(files:IFiles) {
  // Iframe selector or element itself
  const iframe: HTMLElement | null = document.getElementById("iframe");

  // Files, environment and dependencies
  const content = {
    files: toRaw(files)
  };

  // Optional options
  const options = {
    bundlerURL: DetectService.BUNDLERURL,
    showOpenInCodeSandbox: false
  };
  // Properly load and mount the bundler
  if (iframe) {
    const client = await loadSandpackClient(iframe as HTMLIFrameElement, content, options);
  }
}

onMounted(() => {
  main(props.files);
});
</script>
<style scoped>
#iframe {
  width: 100%;
  height: 100%;
}
</style>
