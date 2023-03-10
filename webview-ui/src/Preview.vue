<template>
  <iframe id="iframe" class="container"></iframe>
</template>
<script setup lang="ts">
import { onMounted, toRaw } from "vue";

import { loadSandpackClient } from "@codesandbox/sandpack-client";

interface Props {
  files: IFiles;
}
const props = defineProps<Props>();

async function main(files:IFiles) {
  // Iframe selector or element itself
  const iframe = document.getElementById("iframe");

  // Files, environment and dependencies
  const content: SandboxSetup = {
    files: toRaw(files)
  };

  // Optional options
  const options: ClientOptions = {
    bundlerURL: "http://localhost:8080",
    showOpenInCodeSandbox: false
  };
  // Properly load and mount the bundler
  const client = await loadSandpackClient(iframe, content, options);
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
